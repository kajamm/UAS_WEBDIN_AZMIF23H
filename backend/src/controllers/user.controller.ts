import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { CreateUserDto, UpdateUserDto } from '../types/user';
import { AppError } from '../types';
import { isValidEmail } from '../utils/helpers';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  /**
   * GET /api/users
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAll();
      sendSuccess(res, 'Berhasil mengambil data users', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/users/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID user tidak valid', 400);
      }
      const data = await this.service.getById(id);
      sendSuccess(res, 'Berhasil mengambil detail user', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/users
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateUserDto;

      // Validasi field wajib di controller layer
      if (!body.nama || !body.email || !body.password) {
        throw new AppError('Nama, email, dan password wajib diisi', 400);
      }

      if (!isValidEmail(body.email)) {
        throw new AppError('Format email tidak valid', 400);
      }

      if (body.password.length < 6) {
        throw new AppError('Password minimal 6 karakter', 400);
      }

      const data = await this.service.create(body);
      sendSuccess(res, 'User berhasil ditambahkan', data, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/users/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID user tidak valid', 400);
      }

      const body = req.body as UpdateUserDto;

      // Validasi format email jika disertakan
      if (body.email !== undefined && !isValidEmail(body.email)) {
        throw new AppError('Format email tidak valid', 400);
      }

      // Validasi panjang password jika disertakan
      if (body.password !== undefined && body.password.trim() !== '' && body.password.length < 6) {
        throw new AppError('Password minimal 6 karakter', 400);
      }

      const data = await this.service.update(id, body);
      sendSuccess(res, 'Data user berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/users/:id
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID user tidak valid', 400);
      }
      await this.service.delete(id);
      sendSuccess(res, 'User berhasil dihapus');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/users/:id/reset-password
   */
  requestResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID user tidak valid', 400);
      }
      await this.service.requestResetPassword(id);
      sendSuccess(res, 'Email reset password telah dikirim');
    } catch (error) {
      next(error);
    }
  };
}
