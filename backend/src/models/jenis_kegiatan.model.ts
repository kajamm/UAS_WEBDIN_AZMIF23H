import { RowDataPacket } from 'mysql2';

/**
 * Tipe untuk row tabel jenis_kegiatan di database.
 */
export interface JenisKegiatanRow extends RowDataPacket {
  id: number;
  nama_jenis: string;
  deskripsi: string | null;
  created_at: Date;
  updated_at: Date;
}
