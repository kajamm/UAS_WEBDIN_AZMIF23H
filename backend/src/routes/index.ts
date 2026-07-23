// src/routes/index.ts
// Main router - mengumpulkan semua sub-router

import { Router, Request, Response } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import jenisKegiatanRouter from './jenis_kegiatan.routes';
import kegiatanRouter from './kegiatan.routes';
import pesertaRouter from './peserta.routes';
import userRouter from './user.routes';

const router = Router();

// ─── Core Routes ─────────────────────────────────────────────────────────────
router.use('/auth', authRouter);
router.use('/jenis-kegiatan', jenisKegiatanRouter);
router.use('/kegiatan', kegiatanRouter);
router.use('/peserta', pesertaRouter);
router.use('/users', userRouter);
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
