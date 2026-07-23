// src/config/cors.ts
// Konfigurasi CORS (Cross-Origin Resource Sharing)

import { CorsOptions } from 'cors';
import { env } from './env';

// Buat daftar origin dari env, hindari duplikat
const allowedOrigins: string[] = Array.from(
  new Set([
    env.FRONTEND_URL,
    // Izinkan localhost hanya di environment development
    ...(env.NODE_ENV === 'development' ? ['http://localhost:3001'] : []),
  ])
);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (misalnya dari Postman / mobile app)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin "${origin}" tidak diizinkan.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
