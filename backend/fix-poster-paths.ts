// Script untuk memperbaiki nilai kolom poster di database
// yang salah tersimpan dengan prefix '/uploads/' di dalamnya

import * as dotenv from 'dotenv';
dotenv.config();

import { execute, query } from './src/config/db';

async function fixPosterPaths() {
  console.log('Mengecek data poster yang perlu diperbaiki...');
  
  const rows = await query<any>(
    `SELECT id, poster FROM kegiatan WHERE poster LIKE '/uploads/%'`
  );
  
  if (rows.length === 0) {
    console.log('✅ Tidak ada data yang perlu diperbaiki.');
    process.exit(0);
  }
  
  console.log(`Ditemukan ${rows.length} baris yang perlu diperbaiki:`);
  for (const row of rows) {
    const oldVal = row.poster;
    // Hapus prefix '/uploads/' (9 karakter)
    const newVal = oldVal.replace(/^\/uploads\//, '');
    console.log(`  ID ${row.id}: "${oldVal}" → "${newVal}"`);
    await execute(`UPDATE kegiatan SET poster = ? WHERE id = ?`, [newVal, row.id]);
  }
  
  console.log('✅ Selesai! Semua path poster telah diperbaiki.');
  process.exit(0);
}

fixPosterPaths().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
