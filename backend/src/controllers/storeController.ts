import { Request, Response } from 'express';
import { Store } from '../models/Store';

export const getNearbyStores = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const stores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: parseInt(radius as string),
        },
      },
    }).limit(20);

    res.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby stores',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const { name, address, lat, lng, phone, categories } = req.body;
    const ownerId = (req as any).userId;

    if (!name || !address || !lat || !lng || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const store = new Store({
      name,
      address,
      ownerId,
      phone,
      categories: categories || [],
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
