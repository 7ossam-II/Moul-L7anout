import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  storeId: z.number().int().positive(),
  description: z.string().optional(),
});

router.post('/products', authMiddleware, authorize('SELLER', 'ADMIN'), async (req, res) => {
  try {
    const validated = createProductSchema.parse(req.body);

    // Optional: verify the seller owns this store
    const store = await prisma.store.findFirst({
      where: { id: validated.storeId, sellerId: req.user!.id }
    });
    if (!store) {
      return res.status(403).json({ success: false, error: 'You do not own this store' });
    }

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        price: validated.price,
        storeId: validated.storeId,
        // other fields default or optional
      }
    });

    res.json({ success: true, product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.issues });
    }
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;