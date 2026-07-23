import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();

// Gunakan authMiddleware (seluruh user yg login bisa melihat dashboard)
router.use(authMiddleware);

router.get('/stats', controller.getStats);

export default router;
