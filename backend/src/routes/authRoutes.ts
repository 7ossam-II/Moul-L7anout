import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  phone: z.string().regex(/^(06|07)[0-9]{8}$/, 'Invalid Moroccan phone number'),
  fullName: z.string().min(2).max(100),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN', 'DELIVERY_PERSON', 'CASHIER'])
});

const loginSchema = z.object({
  phone: z.string().regex(/^(06|07)[0-9]{8}$/)
});

// POST /auth/register
router.post('/register', async (req, res) => {
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

    // Create user (assuming you have added 'role' field to User model)
    const user = await prisma.user.create({
      data: {
        phone: validated.phone,
        fullName: validated.fullName,
        role: validated.role,   // requires 'role' enum in User model
        verified: false
      }
    });

    // Optionally create subtype record (Buyer, Seller, etc.)
    // This can be added later

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
});

// POST /auth/login (simplified for development – no OTP yet)
router.post('/login', async (req, res) => {
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

    // For development, auto-verify and generate token
    // In production, send OTP and verify here
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
});

export default router;