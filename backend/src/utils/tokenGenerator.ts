import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE } as jwt.SignOptions
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRE } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};