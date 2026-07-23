import 'dotenv/config';
import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';

const PORT = env.PORT;

/**
 * Fungsi utama untuk menjalankan server.
 * Urutan startup:
 *   1. Test koneksi database
 *   2. Jalankan Express server (hanya jika DB berhasil)
 */
const startServer = async (): Promise<void> => {
  // ─── 1. Test Koneksi Database ────────────────────────────────────────────
  console.log('\n⏳ Memeriksa koneksi database...');
  try {
    await testConnection();
  } catch {
    console.error('\n❌ Server tidak dapat dijalankan karena koneksi database gagal.');
    console.error('   Pastikan MySQL sudah berjalan dan konfigurasi .env sudah benar.\n');
    process.exit(1); // Keluar jika DB tidak bisa terkoneksi
  }

  // ─── 2. Jalankan Express Server ─────────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`\n🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📌 Environment : ${env.NODE_ENV}`);
    console.log(`🗄️  Database    : ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
    console.log(`📅 Waktu       : ${new Date().toLocaleString('id-ID')}\n`);
  });
};

// Jalankan server dan tangkap error yang tidak tertangani
startServer().catch((error: unknown) => {
  console.error('💥 Startup error:', error);
  process.exit(1);
});
