import { RowDataPacket } from 'mysql2';

/**
 * Tipe untuk row tabel peserta di database.
 */
export interface PesertaRow extends RowDataPacket {
  id: number;
  kegiatan_id: number;
  user_id: number | null;
  nama: string;
  email: string;
  no_hp: string | null;
  status_pendaftaran: 'terdaftar' | 'hadir' | 'tidak_hadir';
  created_at: Date;
  updated_at: Date;
}
