import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new UserController();

// Seluruh endpoint User hanya bisa diakses oleh role 'admin'
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/reset-password', controller.requestResetPassword);

export default router;
