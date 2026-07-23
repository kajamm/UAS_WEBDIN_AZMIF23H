import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../types';
import { UserPayload } from '../types/auth';

/**
 * Middleware untuk memverifikasi JWT token dari header Authorization.
 * Jika valid, menyimpan data user ke req.user.
 * Jika tidak valid / tidak ada, melempar 401 Unauthorized.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token tidak ditemukan, harap login', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
      req.user = decoded; // Menyimpan data user ke request
      next();
    } catch (err) {
      throw new AppError('Token tidak valid atau sudah kadaluarsa', 401);
    }
  } catch (error) {
    next(error);
  }
};
