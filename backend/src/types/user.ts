// src/types/user.ts

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateUserDto {
  nama: string;
  email: string;
  password?: string; // Optional if you want to generate one, but required by user instructions
  role?: 'admin' | 'operator' | 'viewer' | 'user';
}

export interface UpdateUserDto {
  nama?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'operator' | 'viewer' | 'user';
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface UserData {
  id: number;
  nama: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer' | 'user';
  created_at: Date;
  updated_at: Date;
}
