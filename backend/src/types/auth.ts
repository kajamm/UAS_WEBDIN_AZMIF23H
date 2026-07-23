// src/types/auth.ts
// Definisi tipe data khusus untuk fitur Authentication

// ─── JWT Payload ─────────────────────────────────────────────────────────────

/**
 * Payload yang disimpan di dalam JWT token.
 * iat (issued at) dan exp (expiry) ditambahkan otomatis oleh jsonwebtoken.
 */
export interface UserPayload {
  id: number;
  nama: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer' | 'user';
  iat?: number;
  exp?: number;
}

// ─── Request DTOs (Data Transfer Objects) ────────────────────────────────────

export interface RegisterDto {
  nama: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

/**
 * Data user yang aman untuk dikirim ke client (tanpa password).
 */
export interface SafeUserData {
  id: number;
  nama: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer' | 'user';
  created_at: Date;
  updated_at: Date;
}

/**
 * Response setelah register atau login berhasil.
 */
export interface AuthResult {
  user: SafeUserData;
  token: string;
}
