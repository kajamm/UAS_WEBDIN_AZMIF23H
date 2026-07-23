import { Router } from 'express';
import { PesertaController } from '../controllers/peserta.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new PesertaController();

// Seluruh endpoint butuh token
router.use(authMiddleware);

// VIEWER, OPERATOR, ADMIN bisa GET data
router.get('/', roleMiddleware('admin', 'operator', 'viewer'), controller.getAll);
router.get('/:id', roleMiddleware('admin', 'operator', 'viewer'), controller.getById);

// Hanya OPERATOR dan ADMIN yang bisa menambah/mengubah/menghapus
router.post('/', roleMiddleware('admin', 'operator'), controller.create);
router.put('/:id', roleMiddleware('admin', 'operator'), controller.update);
router.delete('/:id', roleMiddleware('admin', 'operator'), controller.delete);

export default router;
