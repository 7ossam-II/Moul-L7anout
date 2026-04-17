import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const register = async (req: Request, res: Response) => {
  try {
    const { phone, name, role = 'buyer' } = req.body;

    if (!phone || !name) {
      return res.status(400).json({
        success: false,
        message: 'Phone and name are required',
      });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this phone already exists',
      });
    }

    const user = new User({
      phone,
      name,
      role,
      isVerified: false,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_SECRET || 'secret',
      { expiresIn: env.JWT_EXPIRE || '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone is required',
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_SECRET || 'secret',
      { expiresIn: env.JWT_EXPIRE || '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
