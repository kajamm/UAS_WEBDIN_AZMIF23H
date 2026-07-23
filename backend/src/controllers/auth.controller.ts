import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { RegisterDto, LoginDto } from '../types/auth';
import { AppError } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nama, email, password } = req.body as RegisterDto;

      if (!nama || !email || !password) {
        throw new AppError('Nama, email, dan password wajib diisi', 400);
      }

      const result = await this.authService.register({ nama, email, password });
      
      sendSuccess(res, 'Registrasi berhasil', result, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as LoginDto;

      if (!email || !password) {
        throw new AppError('Email dan password wajib diisi', 400);
      }

      const result = await this.authService.login({ email, password });
      
      sendSuccess(res, 'Login berhasil', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/auth/me
   */
  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.user diset oleh auth middleware
      const userId = req.user?.id;
      
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await this.authService.getMe(userId);
      
      sendSuccess(res, 'Data user berhasil diambil', user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Untuk JWT berbasis stateless, logout dilakukan di sisi client
      // dengan menghapus token. Server hanya perlu mengembalikan success.
      sendSuccess(res, 'Logout berhasil');
    } catch (error) {
      next(error);
    }
  };
}
