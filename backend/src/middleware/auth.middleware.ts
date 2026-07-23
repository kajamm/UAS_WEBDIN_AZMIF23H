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

/**
 * Middleware untuk membatasi akses berdasarkan role (Otorisasi).
 * Harus dijalankan SETELAH authMiddleware.
 * 
 * @param roles - Daftar role yang diizinkan (contoh: 'admin', 'operator')
 */
export const roleMiddleware = (...roles: Array<'admin' | 'operator' | 'viewer' | 'user'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized: Harap login terlebih dahulu', 401);
      }

      // Cek apakah role user ada di dalam daftar roles yang diizinkan
      if (!roles.includes(req.user.role)) {
        throw new AppError('Akses ditolak: Anda tidak memiliki hak akses', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
