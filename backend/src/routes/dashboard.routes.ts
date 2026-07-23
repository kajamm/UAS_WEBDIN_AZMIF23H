import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();

// Gunakan authMiddleware (seluruh user yg login) lalu role admin/viewer
router.use(authMiddleware, roleMiddleware('admin', 'viewer'));

router.get('/stats', controller.getStats);

export default router;
