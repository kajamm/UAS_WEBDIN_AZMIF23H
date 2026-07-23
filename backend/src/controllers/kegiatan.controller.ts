import { Request, Response, NextFunction } from 'express';
import { KegiatanService } from '../services/kegiatan.service';
import { getPagination, sendPaginated, sendSuccess } from '../utils/response';
import { CreateKegiatanDto, UpdateKegiatanDto, FilterKegiatanQuery } from '../types/kegiatan';
import { AppError } from '../types';

export class KegiatanController {
  private service: KegiatanService;

  constructor() {
    this.service = new KegiatanService();
  }

  /**
   * GET /api/kegiatan
   * Mendukung query: ?page=1&limit=10&search=keyword&status=aktif&jenis_kegiatan_id=1
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as FilterKegiatanQuery;
      const { data, total } = await this.service.getAll(filters);
      
      const page = parseInt(filters.page || '1', 10);
      const limit = parseInt(filters.limit || '10', 10);
      
      const pagination = getPagination(page, limit, total);
      
      sendPaginated(res, 'Berhasil mengambil data kegiatan', data, pagination);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/kegiatan/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await this.service.getById(id);
      sendSuccess(res, 'Berhasil mengambil detail kegiatan', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/kegiatan
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateKegiatanDto;
      const data = await this.service.create(body);
      sendSuccess(res, 'Kegiatan berhasil ditambahkan', data, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/kegiatan/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const body = req.body as UpdateKegiatanDto;
      const data = await this.service.update(id, body);
      sendSuccess(res, 'Kegiatan berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/kegiatan/:id/upload
   */
  uploadPoster = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      // req.file disuntikkan oleh multer
      if (!req.file) {
        throw new AppError('File poster tidak ditemukan dalam request (key: poster)', 400);
      }

      const data = await this.service.updatePoster(id, req.file.filename);
      sendSuccess(res, 'Poster berhasil diunggah', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/kegiatan/:id
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.service.delete(id);
      sendSuccess(res, 'Kegiatan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  };
}
