import { execute, query } from '../config/db';
import { JenisKegiatanRow } from '../models/jenis_kegiatan.model';
import { CreateJenisKegiatanDto, UpdateJenisKegiatanDto, JenisKegiatanData } from '../types/jenis_kegiatan';
import { AppError } from '../types';

export class JenisKegiatanService {
  /**
   * Mengambil semua jenis kegiatan
   */
  async getAll(): Promise<JenisKegiatanData[]> {
    const rows = await query<JenisKegiatanRow>(
      'SELECT id, nama_jenis, deskripsi, created_at, updated_at FROM jenis_kegiatan ORDER BY id ASC'
    );
    return rows;
  }

  /**
   * Mengambil jenis kegiatan berdasarkan ID
   */
  async getById(id: number): Promise<JenisKegiatanData> {
    const rows = await query<JenisKegiatanRow>(
      'SELECT id, nama_jenis, deskripsi, created_at, updated_at FROM jenis_kegiatan WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      throw new AppError('Jenis kegiatan tidak ditemukan', 404);
    }

    return rows[0];
  }

  /**
   * Menambahkan jenis kegiatan baru
   */
  async create(data: CreateJenisKegiatanDto): Promise<JenisKegiatanData> {
    const { nama_jenis, deskripsi } = data;

    // Validasi nama jenis kegiatan
    if (!nama_jenis || nama_jenis.trim() === '') {
      throw new AppError('Nama jenis kegiatan wajib diisi', 400);
    }

    // Cek duplikasi
    const existing = await query<JenisKegiatanRow>(
      'SELECT id FROM jenis_kegiatan WHERE nama_jenis = ?',
      [nama_jenis]
    );
    if (existing.length > 0) {
      throw new AppError('Nama jenis kegiatan sudah ada', 400);
    }

    // Simpan ke DB
    const result = await execute(
      'INSERT INTO jenis_kegiatan (nama_jenis, deskripsi) VALUES (?, ?)',
      [nama_jenis, deskripsi || null]
    );

    return this.getById(result.insertId);
  }

  /**
   * Mengupdate jenis kegiatan
   */
  async update(id: number, data: UpdateJenisKegiatanDto): Promise<JenisKegiatanData> {
    const { nama_jenis, deskripsi } = data;

    // Pastikan data exist
    await this.getById(id);

    // Validasi jika nama_jenis diubah
    if (nama_jenis !== undefined) {
      if (nama_jenis.trim() === '') {
        throw new AppError('Nama jenis kegiatan tidak boleh kosong', 400);
      }

      // Cek duplikasi (kecuali dirinya sendiri)
      const existing = await query<JenisKegiatanRow>(
        'SELECT id FROM jenis_kegiatan WHERE nama_jenis = ? AND id != ?',
        [nama_jenis, id]
      );
      if (existing.length > 0) {
        throw new AppError('Nama jenis kegiatan sudah digunakan oleh ID lain', 400);
      }
    }

    // Bangun query dinamis berdasarkan field yang dikirim
    const updates: string[] = [];
    const values: any[] = [];

    if (nama_jenis !== undefined) {
      updates.push('nama_jenis = ?');
      values.push(nama_jenis);
    }
    if (deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(deskripsi);
    }

    if (updates.length > 0) {
      const sql = `UPDATE jenis_kegiatan SET ${updates.join(', ')} WHERE id = ?`;
      values.push(id);
      await execute(sql, values);
    }

    return this.getById(id);
  }

  /**
   * Menghapus jenis kegiatan
   */
  async delete(id: number): Promise<void> {
    // Pastikan data exist
    await this.getById(id);

    try {
      await execute('DELETE FROM jenis_kegiatan WHERE id = ?', [id]);
    } catch (error: any) {
      // Menangani foreign key constraint error (jika jenis kegiatan dipakai di tabel kegiatan)
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new AppError('Tidak dapat menghapus jenis kegiatan ini karena sedang digunakan oleh kegiatan lain.', 400);
      }
      throw error;
    }
  }
}
