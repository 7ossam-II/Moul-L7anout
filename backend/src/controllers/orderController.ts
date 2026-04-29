import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// ========== Zod Schemas ==========
const itemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const createOrderSchema = z.object({
  storeId: z.number().int().positive(),
  items: z.array(itemSchema).min(1),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(['ONLINE', 'OFFLINE', 'LKRIDI']).default('OFFLINE'),
});

const orderIdSchema = z.object({
  orderId: z.string().transform(Number).refine(n => !isNaN(n), { message: 'Invalid order ID' }),
});

// ========== Controllers ==========

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validated = createOrderSchema.parse(req.body);
    const buyerId = req.user?.id;
    const userRole = req.user?.role;

    if (!buyerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'BUYER') {
      return res.status(403).json({ success: false, error: 'Forbidden: only buyers can create orders' });
    }

    // Verify store exists
    const store = await prisma.store.findUnique({ where: { id: validated.storeId } });
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }

    // Verify all products exist and belong to the store
    const productIds = validated.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, storeId: validated.storeId },
    });
    if (products.length !== productIds.length) {
      return res.status(400).json({ success: false, error: 'One or more products are invalid or do not belong to this store' });
    }

    // Ensure Buyer record exists (create if missing)
    let buyer = await prisma.buyer.findUnique({ where: { userId: buyerId } });
    if (!buyer) {
      console.log('Buyer record missing – creating one now');
      buyer = await prisma.buyer.create({
        data: { userId: buyerId }, // only userId is required; other fields optional
      });
    }

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerId,
          storeId: validated.storeId,
          totalAmount: validated.totalAmount,
          paymentMethod: validated.paymentMethod,
          orderStatus: 'PENDING',
        },
      });

      await tx.orderItem.createMany({
        data: validated.items.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues,
      });
    }
    // Send detailed error in development, generic in production
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order',
      ...(process.env.NODE_ENV !== 'production' && { details: error }),
    });
  }
};
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const parseResult = orderIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID',
        details: parseResult.error.issues,
      });
    }
    const { orderId } = parseResult.data;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        store: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Check permissions: buyer, seller of the store, or admin
    if (
      order.buyerId !== userId &&
      order.store.sellerId !== userId &&
      userRole !== 'ADMIN'
    ) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = req.user?.id;
    const userRole = req.user?.role;

    if (!buyerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (userRole !== 'BUYER') {
      return res.status(403).json({ success: false, error: 'Forbidden: only buyers can view their orders' });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId },
      include: {
        orderItems: { include: { product: true } },
        store: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};