-- =============================================================================
-- database.sql
-- Skema database untuk UAS Web Dinamis
-- Engine  : InnoDB
-- Charset : utf8mb4 (mendukung emoji & karakter Unicode penuh)
-- Dibuat  : 2026-07-23
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Buat dan gunakan database
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `uas_webdin`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `uas_webdin`;

-- -----------------------------------------------------------------------------
-- Hapus tabel lama (urutan terbalik agar FK tidak konflik)
-- -----------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `peserta`;
DROP TABLE IF EXISTS `kegiatan`;
DROP TABLE IF EXISTS `jenis_kegiatan`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- TABEL: users
-- Menyimpan data akun pengguna (admin & user biasa)
-- =============================================================================
CREATE TABLE `users` (
  `id`         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100)    NOT NULL                 COMMENT 'Nama lengkap pengguna',
  `email`      VARCHAR(150)    NOT NULL                 COMMENT 'Email (unik, digunakan untuk login)',
  `password`   VARCHAR(255)    NOT NULL                 COMMENT 'Password terenkripsi (bcrypt)',
  `role`       ENUM('admin','operator','viewer','user') NOT NULL DEFAULT 'user' COMMENT 'Peran pengguna',
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expired_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabel pengguna aplikasi';


-- =============================================================================
-- TABEL: jenis_kegiatan
-- Master data jenis/kategori kegiatan
-- =============================================================================
CREATE TABLE `jenis_kegiatan` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_jenis`  VARCHAR(100) NOT NULL    COMMENT 'Nama kategori kegiatan',
  `deskripsi`   TEXT                     COMMENT 'Penjelasan singkat tentang jenis kegiatan',
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data jenis/kategori kegiatan';


-- =============================================================================
-- TABEL: kegiatan
-- Data kegiatan yang diselenggarakan
-- Relasi: jenis_kegiatan (1) ──< kegiatan (N)
-- =============================================================================
CREATE TABLE `kegiatan` (
  `id`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `jenis_kegiatan_id` INT UNSIGNED NOT NULL                    COMMENT 'FK ke tabel jenis_kegiatan',
  `judul`             VARCHAR(200) NOT NULL                    COMMENT 'Nama kegiatan / Judul',
  `deskripsi`         TEXT                                     COMMENT 'Deskripsi lengkap kegiatan',
  `tanggal`           DATE         NOT NULL                    COMMENT 'Tanggal pelaksanaan kegiatan',
  `lokasi`            VARCHAR(200)                             COMMENT 'Tempat pelaksanaan kegiatan',
  `status`            ENUM('aktif','selesai','dibatalkan') NOT NULL DEFAULT 'aktif' COMMENT 'Status penyelenggaraan kegiatan',
  `poster`            VARCHAR(255)                             COMMENT 'Path atau URL poster kegiatan',
  `created_at`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_kegiatan_jenis` (`jenis_kegiatan_id`),
  KEY `idx_kegiatan_status` (`status`),
  KEY `idx_kegiatan_tanggal` (`tanggal`),

  CONSTRAINT `fk_kegiatan_jenis_kegiatan`
    FOREIGN KEY (`jenis_kegiatan_id`)
    REFERENCES `jenis_kegiatan` (`id`)
    ON DELETE RESTRICT   -- Jenis tidak bisa dihapus jika masih ada kegiatan
    ON UPDATE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Data kegiatan yang diselenggarakan';


-- =============================================================================
-- TABEL: peserta
-- Data peserta yang mendaftar ke suatu kegiatan
-- Relasi: kegiatan (1) ──< peserta (N)
--         users    (1) ──< peserta (N)  [opsional — user_id boleh NULL]
-- =============================================================================
CREATE TABLE `peserta` (
  `id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kegiatan_id`         INT UNSIGNED NOT NULL                    COMMENT 'FK ke tabel kegiatan',
  `user_id`             INT UNSIGNED                             COMMENT 'FK ke tabel users (NULL jika belum punya akun)',
  `nama`                VARCHAR(100) NOT NULL                    COMMENT 'Nama lengkap peserta',
  `email`               VARCHAR(150) NOT NULL                    COMMENT 'Email peserta',
  `no_hp`               VARCHAR(20)                              COMMENT 'Nomor handphone peserta',
  `status_pendaftaran`  ENUM('terdaftar','hadir','tidak_hadir') NOT NULL DEFAULT 'terdaftar' COMMENT 'Status kehadiran peserta',
  `created_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_peserta_kegiatan` (`kegiatan_id`),
  KEY `idx_peserta_user` (`user_id`),
  KEY `idx_peserta_email` (`email`),

  CONSTRAINT `fk_peserta_kegiatan`
    FOREIGN KEY (`kegiatan_id`)
    REFERENCES `kegiatan` (`id`)
    ON DELETE RESTRICT   -- Kegiatan tidak bisa dihapus jika masih ada peserta
    ON UPDATE CASCADE,

  CONSTRAINT `fk_peserta_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL   -- Jika user dihapus, user_id peserta menjadi NULL
    ON UPDATE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Data peserta yang mendaftar ke kegiatan';


-- =============================================================================
-- DATA DUMMY
-- Password semua user dummy: password123
-- Hash bcrypt (10 rounds): $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Data dummy: users
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`nama`, `email`, `password`, `role`) VALUES
  ('Administrator',    'admin@webdin.com',    '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'admin'),
  ('Operator',         'operator@webdin.com', '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'operator'),
  ('Tamu Viewer',      'viewer@webdin.com',   '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'viewer'),
  ('Budi Santoso',     'budi@mahasiswa.com',  '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'user'),
  ('Siti Rahayu',      'siti@mahasiswa.com',  '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'user'),
  ('Ahmad Fauzi',      'ahmad@mahasiswa.com', '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'user'),
  ('Dewi Lestari',     'dewi@mahasiswa.com',  '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'user'),
  ('Rizky Pratama',    'rizky@mahasiswa.com', '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy', 'user');


-- -----------------------------------------------------------------------------
-- Data dummy: jenis_kegiatan
-- -----------------------------------------------------------------------------
INSERT INTO `jenis_kegiatan` (`nama_jenis`, `deskripsi`) VALUES
  ('Seminar',
   'Kegiatan akademik berupa presentasi dan diskusi ilmiah oleh narasumber ahli di bidangnya.'),
  ('Workshop',
   'Kegiatan pelatihan praktis untuk meningkatkan keterampilan teknis peserta secara langsung.'),
  ('Lomba',
   'Kegiatan kompetisi antar mahasiswa atau tim untuk mengukur kemampuan di bidang tertentu.'),
  ('Pengabdian Masyarakat',
   'Kegiatan bakti sosial dan pemberdayaan masyarakat sebagai bentuk Tri Dharma Perguruan Tinggi.');


-- -----------------------------------------------------------------------------
-- Data dummy: kegiatan
-- (jenis_kegiatan_id: 1=Seminar, 2=Workshop, 3=Lomba, 4=Pengabdian)
-- -----------------------------------------------------------------------------
INSERT INTO `kegiatan` (`jenis_kegiatan_id`, `judul`, `deskripsi`, `tanggal`, `lokasi`, `status`, `poster`) VALUES

  -- Seminar (jenis_kegiatan_id = 1)
  (1, 'Seminar Nasional Teknologi Informasi 2026',
   'Seminar nasional membahas perkembangan terkini di bidang teknologi informasi, kecerdasan buatan, dan keamanan siber.',
   '2026-08-10', 'Aula Gedung A Lt. 3', 'aktif', NULL),

  (1, 'Seminar Kewirausahaan Digital',
   'Seminar tentang strategi membangun bisnis digital di era transformasi teknologi dan peluang startup Indonesia.',
   '2026-09-05', 'Aula Gedung B', 'aktif', NULL),

  -- Workshop (jenis_kegiatan_id = 2)
  (2, 'Workshop Web Development Full Stack',
   'Pelatihan intensif pembuatan aplikasi web menggunakan React.js, Node.js, dan MySQL selama dua hari.',
   '2026-08-15', 'Lab Komputer Gedung C Lt. 2', 'aktif', NULL),

  (2, 'Workshop Desain UI/UX dengan Figma',
   'Pelatihan desain antarmuka pengguna menggunakan tools Figma dari dasar hingga pembuatan prototype interaktif.',
   '2026-09-20', 'Lab Multimedia Gedung D', 'aktif', NULL),

  -- Lomba (jenis_kegiatan_id = 3)
  (3, 'Hackathon Nasional 2026',
   'Kompetisi pemrograman 24 jam untuk menciptakan solusi inovatif berbasis teknologi pada tema Smart City.',
   '2026-08-22', 'Gedung Serba Guna Kampus Utama', 'aktif', NULL),

  (3, 'Lomba Desain Poster Digital',
   'Kompetisi desain poster bertema lingkungan hidup secara digital menggunakan software grafis.',
   '2026-07-01', 'Online (Google Meet)', 'selesai', NULL),

  -- Pengabdian Masyarakat (jenis_kegiatan_id = 4)
  (4, 'Pelatihan Literasi Digital untuk UMKM',
   'Program pemberdayaan pelaku UMKM desa dalam memanfaatkan media sosial dan marketplace untuk pengembangan usaha.',
   '2026-09-12', 'Balai Desa Sukamaju, Kab. Bandung', 'aktif', NULL),

  (4, 'Bakti Sosial Bersih Pantai',
   'Kegiatan pembersihan pantai dan edukasi masyarakat pesisir tentang pengelolaan sampah plastik.',
   '2026-06-05', 'Pantai Karang Hawu, Sukabumi', 'selesai', NULL);


-- -----------------------------------------------------------------------------
-- Data dummy: peserta
-- (kegiatan_id merujuk ke INSERT di atas; user_id bisa NULL)
-- -----------------------------------------------------------------------------
INSERT INTO `peserta` (`kegiatan_id`, `user_id`, `nama`, `email`, `no_hp`, `status_pendaftaran`) VALUES

  -- Peserta kegiatan 1: Seminar Nasional Teknologi Informasi
  (1, 2, 'Budi Santoso',   'budi@mahasiswa.com',  '081234567890', 'hadir'),
  (1, 3, 'Siti Rahayu',    'siti@mahasiswa.com',  '082345678901', 'hadir'),
  (1, 4, 'Ahmad Fauzi',    'ahmad@mahasiswa.com', '083456789012', 'tidak_hadir'),
  (1, NULL, 'Rina Agustina', 'rina@gmail.com',    '084567890123', 'hadir'),
  (1, NULL, 'Doni Setiawan', 'doni@gmail.com',    '085678901234', 'hadir'),

  -- Peserta kegiatan 2: Seminar Kewirausahaan Digital
  (2, 2,    'Budi Santoso',  'budi@mahasiswa.com',  '081234567890', 'terdaftar'),
  (2, 5,    'Dewi Lestari',  'dewi@mahasiswa.com',  '086789012345', 'terdaftar'),
  (2, NULL, 'Hendra Wijaya', 'hendra@yahoo.com',    '087890123456', 'terdaftar'),

  -- Peserta kegiatan 3: Workshop Web Development Full Stack
  (3, 3, 'Siti Rahayu',    'siti@mahasiswa.com',  '082345678901', 'hadir'),
  (3, 4, 'Ahmad Fauzi',    'ahmad@mahasiswa.com', '083456789012', 'hadir'),
  (3, 5, 'Dewi Lestari',   'dewi@mahasiswa.com',  '086789012345', 'hadir'),
  (3, 6, 'Rizky Pratama',  'rizky@mahasiswa.com', '088901234567', 'hadir'),
  (3, NULL, 'Fani Permata', 'fani@gmail.com',      '089012345678', 'tidak_hadir'),

  -- Peserta kegiatan 4: Workshop Desain UI/UX
  (4, 5,    'Dewi Lestari',  'dewi@mahasiswa.com',  '086789012345', 'terdaftar'),
  (4, 6,    'Rizky Pratama', 'rizky@mahasiswa.com', '088901234567', 'terdaftar'),
  (4, NULL, 'Putri Andini',  'putri@gmail.com',     '081122334455', 'terdaftar'),

  -- Peserta kegiatan 5: Hackathon Nasional 2026
  (5, 2, 'Budi Santoso',   'budi@mahasiswa.com',  '081234567890', 'terdaftar'),
  (5, 4, 'Ahmad Fauzi',    'ahmad@mahasiswa.com', '083456789012', 'terdaftar'),
  (5, 6, 'Rizky Pratama',  'rizky@mahasiswa.com', '088901234567', 'terdaftar'),

  -- Peserta kegiatan 6: Lomba Desain Poster (sudah selesai)
  (6, 3,    'Siti Rahayu',   'siti@mahasiswa.com',  '082345678901', 'hadir'),
  (6, 5,    'Dewi Lestari',  'dewi@mahasiswa.com',  '086789012345', 'hadir'),
  (6, NULL, 'Bagas Nugroho', 'bagas@gmail.com',     '082233445566', 'tidak_hadir'),

  -- Peserta kegiatan 7: Pelatihan Literasi Digital UMKM
  (7, 2,    'Budi Santoso',  'budi@mahasiswa.com',  '081234567890', 'terdaftar'),
  (7, NULL, 'Pak Hasan',     'hasan.umkm@gmail.com','081999888777', 'terdaftar'),
  (7, NULL, 'Bu Kartini',    'kartini@gmail.com',   '082888777666', 'terdaftar'),

  -- Peserta kegiatan 8: Bakti Sosial Bersih Pantai (sudah selesai)
  (8, 2, 'Budi Santoso',   'budi@mahasiswa.com',  '081234567890', 'hadir'),
  (8, 3, 'Siti Rahayu',    'siti@mahasiswa.com',  '082345678901', 'hadir'),
  (8, 4, 'Ahmad Fauzi',    'ahmad@mahasiswa.com', '083456789012', 'hadir'),
  (8, 5, 'Dewi Lestari',   'dewi@mahasiswa.com',  '086789012345', 'hadir'),
  (8, 6, 'Rizky Pratama',  'rizky@mahasiswa.com', '088901234567', 'hadir');


-- =============================================================================
-- VERIFIKASI (opsional — jalankan setelah import selesai)
-- =============================================================================
-- SELECT 'users'          AS tabel, COUNT(*) AS jumlah FROM users
-- UNION ALL
-- SELECT 'jenis_kegiatan' AS tabel, COUNT(*) AS jumlah FROM jenis_kegiatan
-- UNION ALL
-- SELECT 'kegiatan'       AS tabel, COUNT(*) AS jumlah FROM kegiatan
-- UNION ALL
-- SELECT 'peserta'        AS tabel, COUNT(*) AS jumlah FROM peserta;
