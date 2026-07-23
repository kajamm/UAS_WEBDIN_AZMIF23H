import { RowDataPacket } from 'mysql2';

/**
 * Tipe untuk row tabel kegiatan di database.
 */
export interface KegiatanRow extends RowDataPacket {
  id: number;
  jenis_kegiatan_id: number;
  judul: string;
  deskripsi: string | null;
  tanggal: Date;
  lokasi: string | null;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  poster: string | null;
  created_at: Date;
  updated_at: Date;
}
