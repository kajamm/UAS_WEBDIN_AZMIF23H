// src/types/kegiatan.ts
import { PaginationQuery } from './index';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateKegiatanDto {
  judul: string;
  jenis_kegiatan_id: number;
  tanggal: string; // Format YYYY-MM-DD
  lokasi?: string;
  status?: 'aktif' | 'selesai' | 'dibatalkan';
  poster?: string; // string path URL untuk sementara
  deskripsi?: string;
}

export interface UpdateKegiatanDto {
  judul?: string;
  jenis_kegiatan_id?: number;
  tanggal?: string;
  lokasi?: string;
  status?: 'aktif' | 'selesai' | 'dibatalkan';
  poster?: string;
  deskripsi?: string;
}

// ─── Query Parameters ────────────────────────────────────────────────────────

export interface FilterKegiatanQuery extends PaginationQuery {
  search?: string; // Search berdasarkan judul
  status?: 'aktif' | 'selesai' | 'dibatalkan';
  jenis_kegiatan_id?: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface KegiatanData {
  id: number;
  jenis_kegiatan_id: number;
  nama_jenis?: string; // Di-join dari tabel jenis_kegiatan
  judul: string;
  deskripsi: string | null;
  tanggal: Date;
  lokasi: string | null;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  poster: string | null;
  created_at: Date;
  updated_at: Date;
}
