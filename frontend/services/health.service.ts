// frontend/services/health.service.ts
// Service untuk health check API backend

import apiClient from './api';
import { ApiResponse, ServerHealthData, DatabaseHealthData } from '@/types';

export const healthService = {
  /**
   * Cek status server backend
   */
  checkServer: () =>
    apiClient.get<ApiResponse<ServerHealthData>>('/health'),

  /**
   * Cek koneksi database
   */
  checkDatabase: () =>
    apiClient.get<ApiResponse<DatabaseHealthData>>('/health/db'),
};
