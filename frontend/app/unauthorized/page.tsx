'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="mb-6 text-red-500" style={{ fontSize: '4rem' }}>
        ⚠️
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Anda tidak memiliki izin (role yang sesuai) untuk mengakses halaman ini. Silakan kembali atau hubungi Administrator.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.history.back()}
          className="btn btn-secondary"
        >
          Kembali
        </button>
        <Link href="/login" className="btn btn-primary" onClick={() => localStorage.removeItem('token')}>
          Login Ulang
        </Link>
      </div>
    </div>
  );
}
