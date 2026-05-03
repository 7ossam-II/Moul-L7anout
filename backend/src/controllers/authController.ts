import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  phone: z.string().regex(/^(06|07)[0-9]{8}$/, 'Invalid Moroccan phone number'),
  fullName: z.string().min(2).max(100),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN', 'DELIVERY_PERSON', 'CASHIER'])
});

const loginSchema = z.object({
  phone: z.string().regex(/^(06|07)[0-9]{8}$/)
});

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: validated.phone }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this phone number'
      });
    }

    // Create user (no subtype record – will be created on demand)
    const user = await prisma.user.create({
      data: {
        phone: validated.phone,
        fullName: validated.fullName,
        role: validated.role,
        verified: false
      }
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues
      });
    }
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues
      });
    }
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, phone: true, fullName: true, role: true, verified: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};