// src/middleware/notFoundHandler.ts
// Middleware untuk menangani route yang tidak ditemukan (404)

import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' tidak ditemukan.`,
  };

  res.status(404).json(response);
};
