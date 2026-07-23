// src/types/express.d.ts
// Memperluas tipe Express Request dengan properti `user`
// Menggunakan Declaration Merging agar `req.user` tersedia di seluruh aplikasi
// tanpa perlu membuat interface AuthenticatedRequest secara manual.

import { UserPayload } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
