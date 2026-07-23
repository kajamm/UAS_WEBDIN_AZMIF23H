// src/types/index.ts
// Definisi tipe data global yang digunakan di seluruh aplikasi

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Query Parameter Types ───────────────────────────────────────────────────

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type QueryParams = PaginationQuery & SortQuery & {
  search?: string;
};

// ─── Custom Error Types ──────────────────────────────────────────────────────

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Express Extension Types ─────────────────────────────────────────────────

import { Request } from 'express';
// Note: We extend the Request object using Declaration Merging in `src/types/express.d.ts`
// so req.user is available globally on the standard Request type.
