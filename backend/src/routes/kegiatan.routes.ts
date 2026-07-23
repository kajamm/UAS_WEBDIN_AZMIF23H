import { Router } from 'express';
import { KegiatanController } from '../controllers/kegiatan.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import { uploadPosterMiddleware } from '../middleware/upload.middleware';

const router = Router();
const controller = new KegiatanController();

// Validasi token untuk semua rute
router.use(authMiddleware);

// GET: Admin, Operator, Viewer
router.get('/', roleMiddleware('admin', 'operator', 'viewer'), controller.getAll);
router.get('/:id', roleMiddleware('admin', 'operator', 'viewer'), controller.getById);

// POST, PUT, DELETE: Admin, Operator
router.post('/', roleMiddleware('admin', 'operator'), controller.create);
router.put('/:id', roleMiddleware('admin', 'operator'), controller.update);
router.post('/:id/upload', roleMiddleware('admin', 'operator'), uploadPosterMiddleware.single('poster'), controller.uploadPoster);
router.delete('/:id', roleMiddleware('admin', 'operator'), controller.delete);

export default router;
