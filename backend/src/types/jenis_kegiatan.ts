// src/types/jenis_kegiatan.ts

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateJenisKegiatanDto {
  nama_jenis: string;
  deskripsi?: string;
}

export interface UpdateJenisKegiatanDto {
  nama_jenis?: string;
  deskripsi?: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface JenisKegiatanData {
  id: number;
  nama_jenis: string;
  deskripsi: string | null;
  created_at: Date;
  updated_at: Date;
}
