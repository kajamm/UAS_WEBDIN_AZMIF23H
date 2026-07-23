import { execute, query } from '../config/db';
import { PesertaRow } from '../models/peserta.model';
import { CreatePesertaDto, UpdatePesertaDto, PesertaData } from '../types/peserta';
import { AppError } from '../types';
import { RowDataPacket } from 'mysql2';

export class PesertaService {
  /**
   * Mengambil semua peserta (dengan join ke tabel kegiatan untuk nama kegiatannya)
   */
  async getAll(): Promise<PesertaData[]> {
    const rows = await query<PesertaData & RowDataPacket>(`
      SELECT p.*, k.judul as judul_kegiatan
      FROM peserta p
      LEFT JOIN kegiatan k ON p.kegiatan_id = k.id
      ORDER BY p.id DESC
    `);
    return rows;
  }

  /**
   * Mengambil peserta berdasarkan ID
   */
  async getById(id: number): Promise<PesertaData> {
    const rows = await query<PesertaData & RowDataPacket>(`
      SELECT p.*, k.judul as judul_kegiatan
      FROM peserta p
      LEFT JOIN kegiatan k ON p.kegiatan_id = k.id
      WHERE p.id = ?
    `, [id]);

    if (rows.length === 0) {
      throw new AppError('Peserta tidak ditemukan', 404);
    }

    return rows[0];
  }

  /**
   * Menambahkan peserta baru
   */
  async create(data: CreatePesertaDto): Promise<PesertaData> {
    const { kegiatan_id, nama, email, no_hp, status_pendaftaran, user_id } = data;

    // Validasi input
    if (!kegiatan_id || !nama || !email) {
      throw new AppError('Kegiatan ID, Nama, dan Email wajib diisi', 400);
    }

    // Cek apakah kegiatan_id valid
    const kegiatanRows = await query('SELECT id FROM kegiatan WHERE id = ?', [kegiatan_id]);
    if (kegiatanRows.length === 0) {
      throw new AppError('Kegiatan tidak ditemukan', 400);
    }

    const finalStatus = status_pendaftaran || 'terdaftar';

    const result = await execute(
      `INSERT INTO peserta (kegiatan_id, user_id, nama, email, no_hp, status_pendaftaran) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [kegiatan_id, user_id || null, nama, email, no_hp || null, finalStatus]
    );

    return this.getById(result.insertId);
  }

  /**
   * Mengupdate data peserta
   */
  async update(id: number, data: UpdatePesertaDto): Promise<PesertaData> {
    const { kegiatan_id, nama, email, no_hp, status_pendaftaran, user_id } = data;

    // Pastikan data exist
    await this.getById(id);

    // Validasi foreign key kegiatan jika diupdate
    if (kegiatan_id !== undefined) {
      const kegiatanRows = await query('SELECT id FROM kegiatan WHERE id = ?', [kegiatan_id]);
      if (kegiatanRows.length === 0) {
        throw new AppError('Kegiatan tidak ditemukan', 400);
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (kegiatan_id !== undefined) {
      updates.push('kegiatan_id = ?');
      values.push(kegiatan_id);
    }
    if (nama !== undefined) {
      updates.push('nama = ?');
      values.push(nama);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (no_hp !== undefined) {
      updates.push('no_hp = ?');
      values.push(no_hp);
    }
    if (status_pendaftaran !== undefined) {
      updates.push('status_pendaftaran = ?');
      values.push(status_pendaftaran);
    }
    if (user_id !== undefined) {
      updates.push('user_id = ?');
      values.push(user_id);
    }

    if (updates.length > 0) {
      const sql = `UPDATE peserta SET ${updates.join(', ')} WHERE id = ?`;
      values.push(id);
      await execute(sql, values);
    }

    return this.getById(id);
  }

  /**
   * Menghapus peserta
   */
  async delete(id: number): Promise<void> {
    await this.getById(id);
    await execute('DELETE FROM peserta WHERE id = ?', [id]);
  }
}
