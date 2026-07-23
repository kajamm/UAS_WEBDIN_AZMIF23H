// src/types/peserta.ts

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreatePesertaDto {
  kegiatan_id: number;
  nama: string;
  email: string;
  no_hp?: string;
  status_pendaftaran?: 'terdaftar' | 'hadir' | 'tidak_hadir';
  user_id?: number;
}

export interface UpdatePesertaDto {
  kegiatan_id?: number;
  nama?: string;
  email?: string;
  no_hp?: string;
  status_pendaftaran?: 'terdaftar' | 'hadir' | 'tidak_hadir';
  user_id?: number;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface PesertaData {
  id: number;
  kegiatan_id: number;
  judul_kegiatan?: string; // Di-join dari tabel kegiatan
  user_id: number | null;
  nama: string;
  email: string;
  no_hp: string | null;
  status_pendaftaran: 'terdaftar' | 'hadir' | 'tidak_hadir';
  created_at: Date;
  updated_at: Date;
}
