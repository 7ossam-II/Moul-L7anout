import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '7d' });
};