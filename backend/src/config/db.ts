// src/config/db.ts
// Konfigurasi koneksi database MySQL menggunakan mysql2/promise (connection pool)
// Semua query menggunakan prepared statement untuk keamanan (mencegah SQL Injection)

import mysql, {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
  ExecuteValues,
} from 'mysql2/promise';
import { env } from './env';

// ─── Pool Configuration ──────────────────────────────────────────────────────

/**
 * Connection pool MySQL.
 * Pool dibuat sekali dan digunakan ulang untuk setiap request.
 * Konfigurasi berasal dari environment variables (.env) — TIDAK ADA hardcode.
 */
const pool: Pool = mysql.createPool({
  host:     env.DB_HOST,
  port:     env.DB_PORT,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,   // Berasal dari .env — tidak pernah di-hardcode
  database: env.DB_NAME,

  // Pool settings
  waitForConnections: true,    // Antre jika semua koneksi sedang dipakai
  connectionLimit:    10,      // Maksimum koneksi simultan
  queueLimit:         0,       // 0 = antre tak terbatas

  // Keep-alive agar koneksi tidak putus saat idle
  enableKeepAlive:      true,
  keepAliveInitialDelay: 0,

  // Timezone database (sesuaikan dengan server MySQL Anda)
  timezone: '+07:00',

  // Charset
  charset: 'utf8mb4',

  // Gunakan named placeholders untuk prepared statement yang lebih readable
  namedPlaceholders: false,
});

// ─── Connection Test ─────────────────────────────────────────────────────────

/**
 * Menguji koneksi ke database MySQL.
 * Dipanggil saat server pertama kali dijalankan.
 * Jika gagal, proses akan dilempar error (server tidak akan jalan).
 */
export const testConnection = async (): Promise<void> => {
  let connection: PoolConnection | null = null;

  try {
    connection = await pool.getConnection();

    // Jalankan query sederhana untuk memverifikasi koneksi aktif
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT 1 AS connected, NOW() AS server_time, DATABASE() AS db_name'
    );

    const result = rows[0];
    console.log('✅ Koneksi database berhasil!');
    console.log(`   Host     : ${env.DB_HOST}:${env.DB_PORT}`);
    console.log(`   Database : ${result.db_name}`);
    console.log(`   Server   : ${result.server_time}`);
  } catch (error) {
    console.error('❌ Koneksi database gagal!');
    console.error(`   Host     : ${env.DB_HOST}:${env.DB_PORT}`);
    console.error(`   Database : ${env.DB_NAME}`);
    console.error(`   Error    :`, (error as Error).message);
    throw error;
  } finally {
    // Selalu kembalikan koneksi ke pool setelah selesai
    if (connection) {
      connection.release();
    }
  }
};

// ─── Query Helpers ───────────────────────────────────────────────────────────

/**
 * Eksekusi query SELECT menggunakan prepared statement.
 * Mengembalikan array of rows.
 *
 * @param sql   - Query SQL dengan placeholder `?`
 * @param params - Array nilai untuk menggantikan placeholder
 * @returns     - Array of rows
 *
 * @example
 * const users = await query<User>('SELECT * FROM users WHERE id = ?', [1]);
 */
export const query = async <T extends RowDataPacket>(
  sql: string,
  params: ExecuteValues = []
): Promise<T[]> => {
  const [rows] = await pool.execute<T[]>(sql, params);
  return rows;
};

/**
 * Eksekusi query INSERT / UPDATE / DELETE menggunakan prepared statement.
 * Mengembalikan ResultSetHeader yang berisi affectedRows, insertId, dll.
 *
 * @param sql    - Query SQL dengan placeholder `?`
 * @param params - Array nilai untuk menggantikan placeholder
 * @returns      - ResultSetHeader
 *
 * @example
 * const result = await execute('INSERT INTO users (name, email) VALUES (?, ?)', ['Budi', 'budi@mail.com']);
 * console.log(result.insertId);
 */
export const execute = async (
  sql: string,
  params: ExecuteValues = []
): Promise<ResultSetHeader> => {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result;
};

/**
 * Eksekusi beberapa query dalam satu transaksi.
 * Jika salah satu query gagal, seluruh transaksi akan di-rollback.
 *
 * @param callback - Fungsi async yang menerima koneksi dan menjalankan query
 * @returns        - Hasil dari callback
 *
 * @example
 * const result = await transaction(async (conn) => {
 *   await conn.execute('UPDATE accounts SET balance = balance - ? WHERE id = ?', [100, 1]);
 *   await conn.execute('UPDATE accounts SET balance = balance + ? WHERE id = ?', [100, 2]);
 *   return 'Transfer berhasil';
 * });
 */
export const transaction = async <T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// ─── Pool Info ───────────────────────────────────────────────────────────────

/**
 * Mendapatkan informasi status pool saat ini.
 * Berguna untuk monitoring.
 */
export const getPoolInfo = (): {
  threadId: number | undefined;
  config: {
    host: string;
    port: number;
    database: string;
    connectionLimit: number;
  };
} => ({
  threadId: undefined,
  config: {
    host:            env.DB_HOST,
    port:            env.DB_PORT,
    database:        env.DB_NAME,
    connectionLimit: 10,
  },
});

// Export pool sebagai default untuk penggunaan langsung jika diperlukan
export default pool;
