# UAS Web Dinamis

Aplikasi Sistem Informasi Manajemen Kegiatan dengan arsitektur **Node.js (Express) + TypeScript** untuk Backend dan **Next.js (App Router) + TypeScript** untuk Frontend.

## Prasyarat

Pastikan perangkat Anda telah terinstal:
- [Node.js](https://nodejs.org/en/) (Disarankan versi LTS, misal 18.x atau 20.x)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (Versi 8.x atau setara)
- NPM atau Yarn (Bawaan dari Node.js)

---

## 1. Instalasi & Import Database

1. Buka MySQL Client Anda (seperti phpMyAdmin, DBeaver, atau MySQL CLI).
2. Temukan file `database.sql` di folder `backend/database.sql`.
3. Impor isi dari file `database.sql` tersebut ke server MySQL Anda. 
   - Script tersebut akan otomatis membuat database `uas_webdin` beserta seluruh tabel dan data *dummy* awal.

---

## 2. Konfigurasi Backend

Masuk ke dalam folder `backend`:
```bash
cd backend
npm install
```

### Konfigurasi `.env`
Salin atau buat file `.env` di dalam folder `backend/` dengan struktur berikut:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=uas_webdin
DB_PORT=3306

# JWT Secret (Ubah string ini untuk production)
JWT_SECRET=rahasia_negara_123

# SMTP Gmail untuk Reset Password
SMTP_USER=email.anda@gmail.com
SMTP_PASS=app_password_gmail_anda
```

> **Catatan**: Jika menggunakan Gmail, Anda harus menggunakan **App Password** pada bagian `SMTP_PASS`, bukan password email biasa.

### Menjalankan Backend
Untuk mode *development* (otomatis me-restart saat kode diubah):
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:3000`.

---

## 3. Konfigurasi Frontend

Buka terminal baru, dan masuk ke dalam folder `frontend`:
```bash
cd frontend
npm install
```

### Konfigurasi `.env.local`
Buat file `.env.local` di dalam folder `frontend/` (opsional jika Anda menggunakan port 3000, tapi sangat disarankan jika API berada di alamat lain):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Menjalankan Frontend
Untuk mode *development*:
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:3001` (atau 3000 jika belum terpakai).

---

## Daftar Akun Uji Coba

Gunakan akun berikut untuk menguji *Role-Based Access Control* (RBAC) di halaman Login:

- **Admin**: `admin@mail.com` | Password: `password123`
- **Operator**: `operator@mail.com` | Password: `password123`
- **Viewer**: `viewer@mail.com` | Password: `password123`
- **User Biasa**: `user@mail.com` | Password: `password123`

---

## Fitur Utama

- **Role-Based Access Control (RBAC)**: Pembatasan rute dan tombol aksi secara dinamis dari frontend hingga middleware backend.
- **Manajemen Kegiatan**: CRUD dengan kemampuan Upload Poster menggunakan Multer.
- **Manajemen User**: CRUD dan fungsi Reset Password via SMTP Email.
- **Prepared Statements**: Keamanan tingkat lanjut pada MySQL (mencegah SQL Injection).
- **Client-Side & Server-Side Pagination**: Menampilkan data lebih ringan.
