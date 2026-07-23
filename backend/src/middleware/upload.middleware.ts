import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../types';

// Pastikan folder uploads tersedia
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate nama file unik: timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `poster-${uniqueSuffix}${ext}`);
  },
});

// Filter tipe file (jpg, jpeg, png)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Format file tidak didukung. Hanya diperbolehkan JPG, JPEG, dan PNG.', 400));
  }
};

// Batas ukuran 2MB
const limits = {
  fileSize: 2 * 1024 * 1024,
};

export const uploadPosterMiddleware = multer({
  storage,
  fileFilter,
  limits,
});
