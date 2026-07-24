import { execute, query } from '../config/db';
import { RowDataPacket } from 'mysql2';
import { KegiatanRow } from '../models/kegiatan.model';
import { CreateKegiatanDto, UpdateKegiatanDto, KegiatanData, FilterKegiatanQuery } from '../types/kegiatan';
import { AppError } from '../types';
import { getPagination } from '../utils/response';

export class KegiatanService {
  /**
   * Mengambil semua kegiatan dengan filter, pencarian, dan pagination
   */
  async getAll(filters: FilterKegiatanQuery): Promise<{ data: KegiatanData[]; total: number }> {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const offset = (page - 1) * limit;

    let baseSql = `
      SELECT k.*, j.nama_jenis 
      FROM kegiatan k
      LEFT JOIN jenis_kegiatan j ON k.jenis_kegiatan_id = j.id
      WHERE 1=1
    `;
    let countSql = `SELECT COUNT(*) as total FROM kegiatan k WHERE 1=1`;
    
    const params: any[] = [];

    // Filter Search by Judul
    if (filters.search) {
      const searchParam = `%${filters.search}%`;
      baseSql += ` AND k.judul LIKE ?`;
      countSql += ` AND k.judul LIKE ?`;
      params.push(searchParam);
    }

    // Filter by Status
    if (filters.status) {
      baseSql += ` AND k.status = ?`;
      countSql += ` AND k.status = ?`;
      params.push(filters.status);
    }

    // Filter by Jenis Kegiatan
    if (filters.jenis_kegiatan_id) {
      baseSql += ` AND k.jenis_kegiatan_id = ?`;
      countSql += ` AND k.jenis_kegiatan_id = ?`;
      params.push(filters.jenis_kegiatan_id);
    }

    baseSql += ` ORDER BY k.tanggal DESC LIMIT ? OFFSET ?`;
    
    // Execute Count
    const countRows = await query<any>(countSql, params);
    const total = countRows[0].total;

    // Execute Data query
    const dataParams = [...params, limit, offset];
    const dataRows = await query<KegiatanData & RowDataPacket>(baseSql, dataParams);

    return { data: dataRows, total };
  }

  /**
   * Mengambil kegiatan berdasarkan ID
   */
  async getById(id: number): Promise<KegiatanData> {
    const rows = await query<KegiatanData & RowDataPacket>(
      `SELECT k.*, j.nama_jenis 
       FROM kegiatan k
       LEFT JOIN jenis_kegiatan j ON k.jenis_kegiatan_id = j.id
       WHERE k.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      throw new AppError('Kegiatan tidak ditemukan', 404);
    }

    return rows[0];
  }

  /**
   * Menambahkan kegiatan baru
   */
  async create(data: CreateKegiatanDto): Promise<KegiatanData> {
    const { judul, jenis_kegiatan_id, tanggal, lokasi, status, poster, deskripsi } = data;

    // Validasi basic
    if (!judul || !jenis_kegiatan_id || !tanggal) {
      throw new AppError('Judul, Jenis Kegiatan, dan Tanggal wajib diisi', 400);
    }

    // Cek apakah jenis_kegiatan_id exist
    const jenisRows = await query('SELECT id FROM jenis_kegiatan WHERE id = ?', [jenis_kegiatan_id]);
    if (jenisRows.length === 0) {
      throw new AppError('Jenis kegiatan tidak valid', 400);
    }

    const finalStatus = status || 'aktif';

    // Simpan ke DB
    const result = await execute(
      `INSERT INTO kegiatan 
       (judul, jenis_kegiatan_id, tanggal, lokasi, status, poster, deskripsi) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [judul, jenis_kegiatan_id, tanggal, lokasi || null, finalStatus, poster || null, deskripsi || null]
    );

    return this.getById(result.insertId);
  }

  /**
   * Mengupdate kegiatan
   */
  async update(id: number, data: UpdateKegiatanDto): Promise<KegiatanData> {
    const { judul, jenis_kegiatan_id, tanggal, lokasi, status, poster, deskripsi } = data;

    // Pastikan data exist
    await this.getById(id);

    if (jenis_kegiatan_id !== undefined) {
      const jenisRows = await query('SELECT id FROM jenis_kegiatan WHERE id = ?', [jenis_kegiatan_id]);
      if (jenisRows.length === 0) {
        throw new AppError('Jenis kegiatan tidak valid', 400);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (judul !== undefined) {
      updates.push('judul = ?');
      values.push(judul);
    }
    if (jenis_kegiatan_id !== undefined) {
      updates.push('jenis_kegiatan_id = ?');
      values.push(jenis_kegiatan_id);
    }
    if (tanggal !== undefined) {
      updates.push('tanggal = ?');
      values.push(tanggal);
    }
    if (lokasi !== undefined) {
      updates.push('lokasi = ?');
      values.push(lokasi);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (poster !== undefined) {
      updates.push('poster = ?');
      values.push(poster);
    }
    if (deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(deskripsi);
    }

    if (updates.length > 0) {
      const sql = `UPDATE kegiatan SET ${updates.join(', ')} WHERE id = ?`;
      values.push(id);
      await execute(sql, values);
    }

    return this.getById(id);
  }

  /**
   * Update poster kegiatan
   */
  async updatePoster(id: number, filename: string): Promise<KegiatanData> {
    // Pastikan data exist
    const kegiatan = await this.getById(id);

    // Hapus file lama jika ada? Opsional.
    // Dalam kasus ini kita biarkan file lama agar simpel, atau 
    // jika ingin menghapusnya bisa import fs dan fs.unlinkSync.

    // Simpan hanya nama file (tanpa prefix /uploads/) agar konsisten dengan cara frontend membacanya
    await execute('UPDATE kegiatan SET poster = ? WHERE id = ?', [filename, id]);

    return this.getById(id);
  }

  /**
   * Menghapus kegiatan
   */
  async delete(id: number): Promise<void> {
    // Pastikan data exist
    await this.getById(id);

    try {
      await execute('DELETE FROM kegiatan WHERE id = ?', [id]);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new AppError('Tidak dapat menghapus kegiatan ini karena memiliki pendaftar/peserta.', 400);
      }
      throw error;
    }
  }
}
