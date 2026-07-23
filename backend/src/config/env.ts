// src/config/env.ts
// Konfigurasi environment variables dengan validasi

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`❌ Environment variable "${key}" tidak ditemukan. Pastikan file .env sudah dikonfigurasi.`);
  }
  return value;
};

export const env = {
  PORT: parseInt(getEnvVar('PORT', '3000'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development') as 'development' | 'production' | 'test',

  DB_HOST: getEnvVar('DB_HOST', 'localhost'),
  DB_PORT: parseInt(getEnvVar('DB_PORT', '3306'), 10),
  DB_USER: getEnvVar('DB_USER', 'root'),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', ''),
  DB_NAME: getEnvVar('DB_NAME', 'uas_webdin'),

  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3001'),
} as const;

export type Env = typeof env;
