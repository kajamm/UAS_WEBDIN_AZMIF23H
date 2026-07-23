import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { execute, query } from '../config/db';
import { UserRow } from '../models/user.model';
import { CreateUserDto, UpdateUserDto, UserData } from '../types/user';
import { AppError } from '../types';
import { RowDataPacket } from 'mysql2';
import { sendResetPasswordEmail } from '../utils/mailer';

export class UserService {
  /**
   * Mengambil semua user (tanpa password)
   */
  async getAll(): Promise<UserData[]> {
    const rows = await query<UserData & RowDataPacket>(
      'SELECT id, nama, email, role, created_at, updated_at FROM users ORDER BY id DESC'
    );
    return rows;
  }

  /**
   * Mengambil user berdasarkan ID
   */
  async getById(id: number): Promise<UserData> {
    const rows = await query<UserData & RowDataPacket>(
      'SELECT id, nama, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      throw new AppError('User tidak ditemukan', 404);
    }

    return rows[0];
  }

  /**
   * Menambahkan user baru
   */
  async create(data: CreateUserDto): Promise<UserData> {
    const { nama, email, password, role } = data;

    // Validasi input
    if (!nama || !email || !password) {
      throw new AppError('Nama, Email, dan Password wajib diisi', 400);
    }

    // Cek duplikasi email
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new AppError('Email sudah terdaftar', 400);
    }

    const finalRole = role || 'user';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await execute(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, hashedPassword, finalRole]
    );

    return this.getById(result.insertId);
  }

  /**
   * Mengupdate data user
   */
  async update(id: number, data: UpdateUserDto): Promise<UserData> {
    const { nama, email, password, role } = data;

    // Pastikan data exist
    await this.getById(id);

    // Jika ubah email, cek apakah dipakai orang lain
    if (email !== undefined) {
      const existing = await query<UserRow>('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (existing.length > 0) {
        throw new AppError('Email sudah digunakan oleh user lain', 400);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (nama !== undefined) {
      updates.push('nama = ?');
      values.push(nama);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password !== undefined && password.trim() !== '') {
      updates.push('password = ?');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      values.push(hashedPassword);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }

    if (updates.length > 0) {
      const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      values.push(id);
      await execute(sql, values);
    }

    return this.getById(id);
  }

  /**
   * Menghapus user
   */
  async delete(id: number): Promise<void> {
    await this.getById(id);
    
    // Cek jika kita mencoba menghapus user terakhir atau apa pun, 
    // tapi karena ini UAS biarkan sederhana.
    try {
      await execute('DELETE FROM users WHERE id = ?', [id]);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new AppError('Tidak dapat menghapus user ini karena sedang terhubung dengan data lain (misal: peserta).', 400);
      }
      throw error;
    }
  }

  /**
   * Request Reset Password
   */
  async requestResetPassword(id: number): Promise<void> {
    const user = await this.getById(id);

    // Generate random token (6 digit hex/angka)
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Set expiration (1 hour from now)
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);

    await execute(
      'UPDATE users SET reset_token = ?, reset_token_expired_at = ? WHERE id = ?',
      [resetToken, expireDate, id]
    );

    // Kirim email
    await sendResetPasswordEmail(user.email, resetToken);
  }
}
