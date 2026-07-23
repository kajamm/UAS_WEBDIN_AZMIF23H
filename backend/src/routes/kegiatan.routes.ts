import { Router } from 'express';
import { KegiatanController } from '../controllers/kegiatan.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import { uploadPosterMiddleware } from '../middleware/upload.middleware';

const router = Router();
const controller = new KegiatanController();

// Semua endpoint Kegiatan dibatasi untuk Role: Admin saja
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/upload', uploadPosterMiddleware.single('poster'), controller.uploadPoster);
router.delete('/:id', controller.delete);

export default router;
