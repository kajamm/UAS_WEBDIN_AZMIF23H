import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import { sendSuccess } from '../utils/response';
import { RowDataPacket } from 'mysql2';

interface CountResult extends RowDataPacket {
  total: number;
}

export class DashboardController {
  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jenisKegiatan = await query<CountResult>('SELECT COUNT(*) as total FROM jenis_kegiatan');
      const kegiatan = await query<CountResult>('SELECT COUNT(*) as total FROM kegiatan');
      const peserta = await query<CountResult>('SELECT COUNT(*) as total FROM peserta');
      const users = await query<CountResult>('SELECT COUNT(*) as total FROM users');

      const data = {
        jenis_kegiatan: jenisKegiatan[0].total,
        kegiatan: kegiatan[0].total,
        peserta: peserta[0].total,
        users: users[0].total
      };

      sendSuccess(res, 'Berhasil mengambil statistik dashboard', data);
    } catch (error) {
      next(error);
    }
  };
}
