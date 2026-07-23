// src/routes/health.routes.ts
// Route untuk health check server dan database

import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

// GET /api/health         - Cek status server
// GET /api/health/db      - Cek koneksi database

router.get('/', healthController.checkServer);
router.get('/db', healthController.checkDatabase);

export default router;
