// src/utils/response.ts
// Helper functions untuk membuat API response yang konsisten

import { Response } from 'express';
import { ApiResponse, PaginatedResponse, Pagination } from '../types';

/**
 * Mengirim response sukses
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Mengirim response error
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: Record<string, string[]>
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};

/**
 * Mengirim response dengan pagination
 */
export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  pagination: Pagination
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(200).json(response);
};

/**
 * Menghitung pagination
 */
export const getPagination = (
  page: number,
  limit: number,
  total: number
): Pagination => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
