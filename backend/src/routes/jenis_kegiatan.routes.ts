import { Router } from 'express';
import { JenisKegiatanController } from '../controllers/jenis_kegiatan.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new JenisKegiatanController();

// Gunakan authMiddleware & roleMiddleware('admin') untuk semua endpoint di bawah ini
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
