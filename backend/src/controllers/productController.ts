import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProductsByStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const products = await Product.find({ storeId });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { storeId, name, price, category, description } = req.body;

    if (!storeId || !name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const product = new Product({
      storeId,
      name,
      price,
      category,
      description,
      inStock: true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
