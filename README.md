# UAS Web Dinamis

Aplikasi **Sistem Informasi Manajemen Kegiatan** berbasis:
- **Backend**: Node.js (Express) + TypeScript + MySQL
- **Frontend**: Next.js (App Router) + TypeScript

Fitur: CRUD Kegiatan, Peserta, Jenis Kegiatan & User, Role-Based Access Control (RBAC), Upload Poster, Reset Password via Email.

---

## Prasyarat

Pastikan sudah terinstall di komputer Anda:

| Kebutuhan | Versi | Keterangan |
|-----------|-------|------------|
| [Node.js](https://nodejs.org/) | 18.x / 20.x LTS | Disarankan versi LTS |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/) | 8.x | Bisa pakai XAMPP/Laragon |
| npm | Bawaan Node.js | Atau Yarn |

---

## 1. Clone & Struktur Folder

```
UAS_WEBDIN/
├── backend/          ← Express.js + TypeScript
│   ├── src/
│   ├── database.sql  ← Script SQL (buat DB + import data dummy)
│   ├── .env.example  ← Template konfigurasi
│   └── ...
└── frontend/         ← Next.js 15
    ├── app/
    ├── components/
    └── ...
```

---

## 2. Import Database

1. Pastikan **MySQL Server sudah berjalan**.
2. Buka MySQL Client (phpMyAdmin, DBeaver, TablePlus, atau MySQL CLI).
3. Import file `backend/database.sql`:

   **Via MySQL CLI:**
   ```bash
   mysql -u root -p < backend/database.sql
   ```

   **Via phpMyAdmin:**
   - Klik **Import** → Pilih file `database.sql` → Klik **Go**

   Script ini akan otomatis:
   - Membuat database `uas_webdin`
   - Membuat semua tabel (`users`, `jenis_kegiatan`, `kegiatan`, `peserta`)
   - Mengisi data dummy untuk pengujian

---

## 3. Konfigurasi & Menjalankan Backend

### Langkah 1: Install dependency
```bash
cd backend
npm install
```

### Langkah 2: Buat file `.env`
Salin `.env.example` menjadi `.env`, lalu isi sesuai konfigurasi Anda:
```bash
copy .env.example .env   # Windows
# atau
cp .env.example .env     # Mac/Linux
```

Isi file `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=            ← Password MySQL Anda (kosong jika tidak ada)
DB_NAME=uas_webdin

# CORS
FRONTEND_URL=http://localhost:3001

# JWT — Ganti dengan string acak yang panjang!
JWT_SECRET=ganti_dengan_secret_yang_kuat_123
JWT_EXPIRES_IN=1d

# SMTP untuk Reset Password
# Lihat bagian "Konfigurasi Email" di bawah
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=emailanda@gmail.com
SMTP_PASS=app_password_gmail
```

### Langkah 3: Jalankan backend
```bash
npm run dev
```
Backend berjalan di → **http://localhost:3000**

---

## 4. Konfigurasi & Menjalankan Frontend

### Langkah 1: Install dependency
```bash
cd frontend
npm install
```

### Langkah 2: Buat file `.env.local`
```bash
# Buat file frontend/.env.local dengan isi:
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> **Catatan**: Jika IP backend bukan localhost (misalnya akses dari perangkat lain di jaringan), ganti dengan IP komputer yang menjalankan backend, contoh: `http://192.168.1.10:3000/api`

### Langkah 3: Jalankan frontend
```bash
npm run dev
```
Frontend berjalan di → **http://localhost:3001**

---

## 5. Konfigurasi Email (Reset Password)

Fitur Reset Password membutuhkan konfigurasi SMTP. Ada dua opsi:

### Opsi A: Mailtrap (Recommended untuk Development)
Gratis, email tidak benar-benar dikirim, bisa dilihat di dashboard Mailtrap.

1. Daftar di [mailtrap.io](https://mailtrap.io)
2. Masuk → **Email Testing** → **Inboxes** → klik inbox → tab **SMTP**
3. Copy credential ke `.env`:
   ```env
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=<username-mailtrap>
   SMTP_PASS=<password-mailtrap>
   ```

### Opsi B: Gmail (Production)
1. Aktifkan **2-Factor Authentication** di akun Gmail Anda
2. Buka [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Buat App Password baru → copy ke `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=emailanda@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx   ← App Password (bukan password biasa!)
   ```

---

## 6. Daftar Akun Uji Coba

Gunakan akun berikut untuk login dan menguji RBAC:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@webdin.com | password123 |
| **Operator** | operator@webdin.com | password123 |
| **Viewer** | viewer@webdin.com | password123 |
| **User Biasa** | budi@mahasiswa.com | password123 |

---

## 7. Hak Akses (RBAC)

| Endpoint | Admin | Operator | Viewer | User |
|----------|-------|----------|--------|------|
| GET kegiatan, peserta | ✅ | ✅ | ✅ | ❌ |
| POST/PUT/DELETE kegiatan, peserta | ✅ | ✅ | ❌ | ❌ |
| CRUD jenis kegiatan | ✅ | ❌ | ❌ | ❌ |
| CRUD users & reset password | ✅ | ❌ | ❌ | ❌ |
| Dashboard stats | ✅ | ✅ | ✅ | ❌ |
| GET /auth/me | ✅ | ✅ | ✅ | ✅ |

---

## 8. API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | `/health` | Public | Health check server |
| GET | `/health/db` | Public | Health check database |
| POST | `/auth/register` | Public | Registrasi user baru |
| POST | `/auth/login` | Public | Login |
| POST | `/auth/logout` | Public | Logout (client-side) |
| GET | `/auth/me` | Auth | Profil user saat ini |
| GET | `/dashboard/stats` | Auth (non-user) | Statistik dashboard |
| GET/POST | `/kegiatan` | Auth | List / buat kegiatan |
| GET/PUT/DELETE | `/kegiatan/:id` | Auth | Detail / update / hapus |
| POST | `/kegiatan/:id/upload` | Admin, Operator | Upload poster |
| GET/POST | `/peserta` | Auth | List / buat peserta |
| GET/PUT/DELETE | `/peserta/:id` | Auth | Detail / update / hapus |
| GET/POST | `/jenis-kegiatan` | Admin | CRUD jenis kegiatan |
| GET/POST | `/users` | Admin | List / buat user |
| GET/PUT/DELETE | `/users/:id` | Admin | Detail / update / hapus |
| POST | `/users/:id/reset-password` | Admin | Kirim email reset password |

---

## 9. Fitur Utama

- ✅ **Role-Based Access Control (RBAC)** — 4 role: admin, operator, viewer, user
- ✅ **JWT Authentication** — Token-based, stateless
- ✅ **Prepared Statements** — Seluruh query DB aman dari SQL Injection
- ✅ **Input Validation** — Validasi di controller dan service layer
- ✅ **Upload Poster** — Menggunakan Multer (JPG/PNG, maks 2MB)
- ✅ **Reset Password** — Token via email (berlaku 1 jam)
- ✅ **Pagination** — Pada listing kegiatan
- ✅ **Error Handling** — Konsisten via AppError + global error handler
- ✅ **Helmet + CORS** — Keamanan header HTTP
