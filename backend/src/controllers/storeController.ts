import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// ========== Zod Schemas ==========
const createStoreSchema = z.object({
  address: z.string().min(5),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  storeType: z.enum([
    'RESTAURANT',
    'MOVING_KIOSK',
    'FOOD_PRODUCTS',
    'HARDWARE_STORE',
    'CLOTHING_STORE',
    'BOOK_STORE',
    'MILK_STORE',
    'PHARMACY',
    'SUPERMARKET',
    'SPICES_STORE',
  ]),
  deliveryFlatFee: z.number().nonnegative().optional(),
});

const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().default(5000),
});

// ========== Helper: raw SQL for distance ==========
const getNearbyStoresSQL = (lat: number, lng: number, radiusMeters: number) => {
  const radiusKm = radiusMeters / 1000;
  return `
    SELECT *
    FROM (
      SELECT *, (
        6371 * acos(
          cos(radians(${lat})) * cos(radians("locationLat")) *
          cos(radians("locationLng") - radians(${lng})) +
          sin(radians(${lat})) * sin(radians("locationLat"))
        )
      ) AS distance
      FROM stores
    ) AS stores_with_distance
    WHERE distance < ${radiusKm}
    ORDER BY distance
    LIMIT 20
  `;
};

// ========== Controllers ==========

export const getNearbyStores = async (req: Request, res: Response) => {
  try {
    const parseResult = nearbyQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: parseResult.error.issues,
      });
    }
    const { lat, lng, radius } = parseResult.data;
    const sql = getNearbyStoresSQL(lat, lng, radius);
    const stores = await prisma.$queryRawUnsafe(sql);
    res.json({ success: true, data: stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch nearby stores' });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ success: false, error: 'Invalid store ID' });
    }
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { products: true },
    });
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found' });
    }
    res.json({ success: true, data: store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch store' });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const validated = createStoreSchema.parse(req.body);
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    console.log('=== CREATE STORE DEBUG ===');
    console.log('sellerId from token:', sellerId);
    console.log('store data:', validated);

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Ensure Seller record exists (create if missing)
    let seller = await prisma.seller.findUnique({
      where: { userId: sellerId },
    });
    if (!seller) {
      console.log('Seller record missing – creating one now');
      seller = await prisma.seller.create({
        data: {
          userId: sellerId,
          storeName: validated.address.substring(0, 50) || `Store_${sellerId}`,
          idDocumentUrl: 'pending_upload',
          adminApproved: false,
          lkridiEnabled: false,
        },
      });
    }

    const newStore = await prisma.store.create({
      data: {
        sellerId,
        address: validated.address,
        locationLat: validated.lat,
        locationLng: validated.lng,
        storeType: validated.storeType,
        deliveryFlatFee: validated.deliveryFlatFee,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: newStore,
    });
  } catch (error) {
    console.error('=== PRISMA ERROR DETAILS ===');
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create store',
    });
  }
};