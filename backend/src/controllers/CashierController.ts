import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// Validation schemas
const createCashierSchema = z.object({
  storeId: z.number().int().positive(),
  phone: z.string().regex(/^(06|07)[0-9]{8}$/, 'Invalid Moroccan phone number'),
  fullName: z.string().min(2).max(100),
  password: z.string().min(6).optional(), // optional; can be set later via OTP
});

// Get all cashiers for the seller's stores
export const getCashiers = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;
    if (!sellerId || (userRole !== 'SELLER' && userRole !== 'ADMIN')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Find all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);

    const cashiers = await prisma.cashier.findMany({
      where: { storeId: { in: storeIds } },
      include: { user: true, store: true },
      orderBy: { userId: 'desc' },
    });

    const data = cashiers.map(c => ({
      id: c.userId,
      name: c.user.fullName,
      phone: c.user.phone,
      storeId: c.storeId,
      storeName: c.store.name,
      active: c.user.verified, // or add a dedicated 'active' field if you have one
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch cashiers' });
  }
};

// Create a new cashier (worker) for a specific store
export const createCashier = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;
    const validated = createCashierSchema.parse(req.body);

    if (!sellerId || (userRole !== 'SELLER' && userRole !== 'ADMIN')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Verify store belongs to seller
    const store = await prisma.store.findFirst({
      where: { id: validated.storeId, sellerId },
    });
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { phone: validated.phone } });
    if (user) {
      // If user exists, ensure they are not already a cashier for this store
      const existingCashier = await prisma.cashier.findFirst({
        where: { userId: user.id, storeId: validated.storeId },
      });
      if (existingCashier) {
        return res.status(400).json({ success: false, error: 'User is already a cashier for this store' });
      }
    } else {
      // Create new user with role CASHIER
      user = await prisma.user.create({
        data: {
          phone: validated.phone,
          fullName: validated.fullName,
          role: 'CASHIER',
          verified: true, // or false; you can require OTP later
        },
      });
    }

    // Create cashier record
    const cashier = await prisma.cashier.create({
      data: {
        userId: user.id,
        storeId: validated.storeId,
        createdBySellerId: sellerId,
      },
      include: { user: true, store: true },
    });

    res.status(201).json({
      success: true,
      data: {
        id: cashier.userId,
        name: cashier.user.fullName,
        phone: cashier.user.phone,
        storeId: cashier.storeId,
        storeName: cashier.store.name,
        active: cashier.user.verified,
      },
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
    res.status(500).json({ success: false, error: 'Failed to create cashier' });
  }
};

// Remove a cashier
export const removeCashier = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;
    const cashierId = parseInt(req.params.cashierId);
    if (isNaN(cashierId)) {
      return res.status(400).json({ success: false, error: 'Invalid cashier ID' });
    }
    if (!sellerId || (userRole !== 'SELLER' && userRole !== 'ADMIN')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Find cashier and ensure it belongs to a store owned by this seller
    const cashier = await prisma.cashier.findFirst({
      where: {
        userId: cashierId,
        store: { sellerId },
      },
    });
    if (!cashier) {
      return res.status(404).json({ success: false, error: 'Cashier not found' });
    }

    // Delete the cashier record (the user remains in the system)
    await prisma.cashier.delete({ where: { userId: cashierId } });

    res.json({ success: true, message: 'Cashier removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to remove cashier' });
  }
};