import { Request, Response } from 'express';
import { Order } from '../models/Order';

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { storeId, items, totalAmount, paymentMethod = 'offline' } = req.body;
    const buyerId = (req as any).userId;

    if (!storeId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const order = new Order({
      orderNumber: generateOrderNumber(),
      buyerId,
      storeId,
      items,
      totalAmount,
      paymentMethod,
      status: 'pending',
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).userId;

    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
