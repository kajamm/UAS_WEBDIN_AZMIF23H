import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { RegisterDto, LoginDto } from '../types/auth';
import { AppError } from '../types';
import { isValidEmail } from '../utils/helpers';

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

      if (!isValidEmail(email)) {
        throw new AppError('Format email tidak valid', 400);
      }

      if (password.length < 6) {
        throw new AppError('Password minimal 6 karakter', 400);
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

      if (!isValidEmail(email)) {
        throw new AppError('Format email tidak valid', 400);
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

  /**
   * POST /api/auth/forgot-password
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new AppError('Email wajib diisi', 400);
      }
      if (!isValidEmail(email)) {
        throw new AppError('Format email tidak valid', 400);
      }

      await this.authService.forgotPassword(email);
      
      // We always say it's sent to prevent email enumeration
      sendSuccess(res, 'Jika email terdaftar, link reset telah dikirim ke email tersebut.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/reset-password
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        throw new AppError('Token dan password baru wajib diisi', 400);
      }

      await this.authService.resetPassword(token, newPassword);
      
      sendSuccess(res, 'Password berhasil diubah. Silakan login kembali.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/change-password
   */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        throw new AppError('Password lama dan password baru wajib diisi', 400);
      }

      await this.authService.changePassword(userId, oldPassword, newPassword);
      
      sendSuccess(res, 'Password berhasil diubah.');
    } catch (error) {
      next(error);
    }
  };
}
