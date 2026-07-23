import { Request, Response, NextFunction } from 'express';
import { JenisKegiatanService } from '../services/jenis_kegiatan.service';
import { sendSuccess } from '../utils/response';
import { CreateJenisKegiatanDto, UpdateJenisKegiatanDto } from '../types/jenis_kegiatan';

export class JenisKegiatanController {
  private service: JenisKegiatanService;

  constructor() {
    this.service = new JenisKegiatanService();
  }

  /**
   * GET /api/jenis-kegiatan
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAll();
      sendSuccess(res, 'Berhasil mengambil data jenis kegiatan', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/jenis-kegiatan/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await this.service.getById(id);
      sendSuccess(res, 'Berhasil mengambil detail jenis kegiatan', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/jenis-kegiatan
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateJenisKegiatanDto;
      const data = await this.service.create(body);
      sendSuccess(res, 'Jenis kegiatan berhasil ditambahkan', data, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/jenis-kegiatan/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const body = req.body as UpdateJenisKegiatanDto;
      const data = await this.service.update(id, body);
      sendSuccess(res, 'Jenis kegiatan berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/jenis-kegiatan/:id
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.service.delete(id);
      sendSuccess(res, 'Jenis kegiatan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  };
}
