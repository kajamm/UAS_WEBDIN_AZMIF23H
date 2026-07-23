// src/controllers/health.controller.ts
// Controller untuk health check server dan koneksi database

import { Request, Response, NextFunction } from 'express';
import { testConnection, getPoolInfo } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/env';

export class HealthController {
  /**
   * Cek status server
   * GET /api/health
   */
  checkServer = (_req: Request, res: Response): void => {
    sendSuccess(res, 'Server berjalan dengan baik', {
      status: 'OK',
      environment: env.NODE_ENV,
      uptime: `${Math.floor(process.uptime())} detik`,
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * Cek koneksi database
   * GET /api/health/db
   */
  checkDatabase = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await testConnection();
      const poolInfo = getPoolInfo();
      sendSuccess(res, 'Koneksi database berhasil', {
        status: 'Connected',
        host: `${poolInfo.config.host}:${poolInfo.config.port}`,
        database: poolInfo.config.database,
        connectionLimit: poolInfo.config.connectionLimit,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, 'Koneksi database gagal. Cek konfigurasi database Anda.', 503);
      next(error);
    }
  };
}
