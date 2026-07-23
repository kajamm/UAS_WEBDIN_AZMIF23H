# UAS Web Dinamis

Project UAS Web Dinamis menggunakan **Express.js + TypeScript** (backend) dan **Next.js + TypeScript** (frontend).

## 📁 Struktur Project

```
UAS_WEBDIN/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts          # Konfigurasi environment variables
│   │   │   ├── cors.ts         # Konfigurasi CORS
│   │   │   └── database.ts     # Koneksi MySQL pool
│   │   ├── controllers/
│   │   │   └── health.controller.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── notFoundHandler.ts
│   │   │   └── requestLogger.ts
│   │   ├── models/             # (tahap berikutnya)
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   └── health.routes.ts
│   │   ├── services/           # (tahap berikutnya)
│   │   ├── types/
│   │   │   └── index.ts        # Global TypeScript types
│   │   ├── uploads/            # File uploads
│   │   ├── utils/
│   │   │   ├── response.ts     # API response helpers
│   │   │   ├── logger.ts       # Logger utility
│   │   │   └── helpers.ts      # General helpers
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Entry point
│   ├── .env                    # Environment variables (jangan di-commit!)
│   ├── .env.example            # Template environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── globals.css         # Global styles
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx            # Halaman beranda
    │   └── status/
    │       └── page.tsx        # Halaman cek status API
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   └── ui/
    │       └── StatusBadge.tsx
    ├── services/
    │   ├── api.ts              # Base API client
    │   └── health.service.ts   # Health check service
    ├── types/
    │   ├── api.ts              # API response types
    │   ├── declarations.d.ts   # Module declarations
    │   └── index.ts
    ├── .env.local              # Environment variables frontend
    ├── next.config.js
    ├── package.json
    └── tsconfig.json
```

## 🚀 Cara Menjalankan

### 1. Konfigurasi Database

Edit file `backend/.env` dan sesuaikan:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=uas_webdin
```

### 2. Jalankan Backend

```bash
cd backend
npm run dev
```

Server backend berjalan di: **http://localhost:3000**

### 3. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend berjalan di: **http://localhost:3001**

## 🔗 API Endpoints

| Method | Endpoint          | Deskripsi                |
|--------|-------------------|--------------------------|
| GET    | `/`               | Info API                 |
| GET    | `/api`            | Info API lengkap         |
| GET    | `/api/health`     | Cek status server        |
| GET    | `/api/health/db`  | Cek koneksi database     |

## 🛠 Tech Stack

**Backend:**
- Express.js + TypeScript
- mysql2 (MySQL driver)
- helmet (Security headers)
- cors (Cross-Origin Resource Sharing)
- morgan (HTTP request logger)
- dotenv (Environment variables)

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Vanilla CSS

## 📝 Catatan

- File `.env` **jangan di-commit** ke git
- Pastikan MySQL sudah berjalan sebelum menjalankan backend
- Port backend: **3000**, Port frontend: **3001**
