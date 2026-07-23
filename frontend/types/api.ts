// frontend/types/api.ts
// Tipe data untuk API response dari backend

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

// Health check response types
export interface ServerHealthData {
  [key: string]: string;
  status: string;
  environment: string;
  uptime: string;
  timestamp: string;
}

export interface DatabaseHealthData {
  [key: string]: string;
  status: string;
  host: string;
  database: string;
  timestamp: string;
}
