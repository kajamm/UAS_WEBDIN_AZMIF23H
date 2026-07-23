// src/middleware/errorHandler.ts
// Middleware global untuk menangani semua error

import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Jika error adalah AppError (error yang kita buat sendiri)
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Log error di development
  if (env.NODE_ENV === 'development') {
    console.error('💥 Error:', err);
  }

  // Error tidak dikenal - kirim 500
  const response: ApiResponse = {
    success: false,
    message: env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan pada server.'
      : err.message,
  };

  res.status(500).json(response);
};
