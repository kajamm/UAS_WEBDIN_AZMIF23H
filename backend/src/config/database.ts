// src/config/database.ts
// Konfigurasi koneksi database MySQL menggunakan mysql2

import mysql from 'mysql2/promise';
import { env } from './env';

// Membuat connection pool untuk performa yang lebih baik
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Fungsi untuk menguji koneksi database
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Koneksi database berhasil!');
    connection.release();
  } catch (error) {
    console.error('❌ Koneksi database gagal:', error);
    throw error;
  }
};

export default pool;
