import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { execute, query } from '../config/db';
import { env } from '../config/env';
import { RegisterDto, LoginDto, AuthResult, SafeUserData, UserPayload } from '../types/auth';
import { UserRow } from '../models/user.model';
import { AppError } from '../types';

export class AuthService {
  /**
   * Mendaftarkan user baru (default role: 'user')
   */
  async register(data: RegisterDto): Promise<AuthResult> {
    const { nama, email, password } = data;

    // Cek apakah email sudah terdaftar
    const existingUsers = await query<UserRow>('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      throw new AppError('Email sudah terdaftar', 400);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database
    const result = await execute(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, hashedPassword, 'user']
    );

    const insertId = result.insertId;

    // Ambil data user yang baru dibuat
    const newUserRows = await query<UserRow>('SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?', [insertId]);
    const user = newUserRows[0];

    // Generate JWT
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Login user yang sudah ada
   */
  async login(data: LoginDto): Promise<AuthResult> {
    const { email, password } = data;

    // Cari user berdasarkan email
    const users = await query<UserRow>('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      throw new AppError('Email atau password salah', 401);
    }

    const user = users[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Email atau password salah', 401);
    }

    // Buat SafeUserData (tanpa password)
    const safeUser: SafeUserData = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // Generate JWT
    const token = this.generateToken(safeUser);

    return { user: safeUser, token };
  }

  /**
   * Mengambil data user berdasarkan ID
   */
  async getMe(userId: number): Promise<SafeUserData> {
    const users = await query<UserRow>(
      'SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new AppError('User tidak ditemukan', 404);
    }

    return users[0];
  }

  /**
   * Helper untuk membuat JWT token
   */
  private generateToken(user: Pick<SafeUserData, 'id' | 'nama' | 'email' | 'role'>): string {
    const payload: UserPayload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }
}
