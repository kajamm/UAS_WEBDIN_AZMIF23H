import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { CreateUserDto, UpdateUserDto } from '../types/user';

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
      const body = req.body as UpdateUserDto;
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
      await this.service.delete(id);
      sendSuccess(res, 'User berhasil dihapus');
    } catch (error) {
      next(error);
    }
  };
}
