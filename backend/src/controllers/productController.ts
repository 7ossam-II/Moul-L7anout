import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// ========== Zod Schemas (aligned with your model) ==========

const createProductSchema = z.object({
  storeId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  photoUrl: z.string().url().optional(),
  quantityAvailable: z.number().int().nonnegative().optional(),
  deliveryAvailable: z.boolean().optional(),
  maxPerDelivery: z.number().int().positive().optional(),
});

const productIdSchema = z.object({
  productId: z.string().transform(Number).refine(n => !isNaN(n), { message: 'Invalid product ID' }),
});

const storeIdSchema = z.object({
  storeId: z.string().transform(Number).refine(n => !isNaN(n), { message: 'Invalid store ID' }),
});

// ========== Controllers ==========

export const getProductsByStore = async (req: Request, res: Response) => {
  try {
    const parseResult = storeIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid store ID',
        details: parseResult.error.issues,
      });
    }
    const { storeId } = parseResult.data;

    const products = await prisma.product.findMany({
      where: { storeId },
      orderBy: { id: 'asc' },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const parseResult = productIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        details: parseResult.error.issues,
      });
    }
    const { productId } = parseResult.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validated = createProductSchema.parse(req.body);
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Only sellers or admins can create products
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Verify the seller owns the store (or admin bypass)
    const store = await prisma.store.findUnique({
      where: { id: validated.storeId },
      select: { sellerId: true },
    });
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    if (store.sellerId !== sellerId && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'You do not own this store' });
    }

    const product = await prisma.product.create({
      data: {
        storeId: validated.storeId,
        name: validated.name,
        price: validated.price,
        photoUrl: validated.photoUrl,
        quantityAvailable: validated.quantityAvailable,
        deliveryAvailable: validated.deliveryAvailable ?? false,
        maxPerDelivery: validated.maxPerDelivery,
        availableStatus: true, // default as per model
        // expectedAvailabilityDate is optional; not set here
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues,
      });
    }
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};