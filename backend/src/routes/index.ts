// src/routes/index.ts
// Main router - mengumpulkan semua sub-router

import { Router, Request, Response } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';

const router = Router();

// ─── Core Routes ─────────────────────────────────────────────────────────────
router.use('/auth', authRouter);
router.use('/health', healthRouter);

// ─── API Info ─────────────────────────────────────────────────────────────────
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'UAS Web Dinamis API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
    },
  });
});

export default router;
