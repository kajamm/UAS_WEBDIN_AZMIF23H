import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../types';
import { UserPayload } from '../types/auth';

/**
 * Middleware untuk memverifikasi JWT token dari header Authorization.
 * Format header: "Bearer <token>"
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token tidak ditemukan, harap login', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
      req.user = decoded;
      next();
    } catch (err) {
      throw new AppError('Token tidak valid atau sudah kadaluarsa', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk membatasi akses hanya untuk admin.
 * Harus dijalankan setelah requireAuth.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (req.user.role !== 'admin') {
      throw new AppError('Akses ditolak, butuh hak akses admin', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
