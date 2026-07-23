import { Request, Response, NextFunction } from 'express';
import { PesertaService } from '../services/peserta.service';
import { sendSuccess } from '../utils/response';
import { CreatePesertaDto, UpdatePesertaDto } from '../types/peserta';
import { AppError } from '../types';
import { isValidEmail } from '../utils/helpers';

export class PesertaController {
  private service: PesertaService;

  constructor() {
    this.service = new PesertaService();
  }

  /**
   * GET /api/peserta
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAll();
      sendSuccess(res, 'Berhasil mengambil data peserta', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/peserta/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID peserta tidak valid', 400);
      }
      const data = await this.service.getById(id);
      sendSuccess(res, 'Berhasil mengambil detail peserta', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/peserta
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreatePesertaDto;

      // Validasi field wajib di controller layer
      if (!body.kegiatan_id || !body.nama || !body.email) {
        throw new AppError('Kegiatan ID, nama, dan email wajib diisi', 400);
      }

      if (!isValidEmail(body.email)) {
        throw new AppError('Format email peserta tidak valid', 400);
      }

      const data = await this.service.create(body);
      sendSuccess(res, 'Peserta berhasil ditambahkan', data, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/peserta/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID peserta tidak valid', 400);
      }

      const body = req.body as UpdatePesertaDto;

      // Validasi format email jika disertakan
      if (body.email !== undefined && !isValidEmail(body.email)) {
        throw new AppError('Format email peserta tidak valid', 400);
      }

      const data = await this.service.update(id, body);
      sendSuccess(res, 'Data peserta berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/peserta/:id
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID peserta tidak valid', 400);
      }
      await this.service.delete(id);
      sendSuccess(res, 'Peserta berhasil dihapus');
    } catch (error) {
      next(error);
    }
  };
}
