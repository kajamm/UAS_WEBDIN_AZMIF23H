// src/middleware/requestLogger.ts
// Middleware untuk mencatat setiap request yang masuk

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toLocaleString('id-ID');
  const method = req.method.padEnd(7);
  const url = req.originalUrl;

  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};
