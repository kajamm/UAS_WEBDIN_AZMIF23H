// src/models/user.model.ts
// Interface tipe data yang merepresentasikan baris tabel `users` di database

import { RowDataPacket } from 'mysql2';

/**
 * Tipe untuk row tabel users (dengan password).
 * Digunakan saat melakukan SELECT termasuk kolom password
 * (misalnya saat verifikasi login).
 */
export interface UserRow extends RowDataPacket {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

/**
 * Tipe untuk row tabel users (TANPA password).
 * Digunakan saat SELECT tidak menyertakan kolom password
 * (aman untuk dikirim ke client sebagai response API).
 */
export interface SafeUserRow extends RowDataPacket {
  id: number;
  nama: string;
  email: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}
