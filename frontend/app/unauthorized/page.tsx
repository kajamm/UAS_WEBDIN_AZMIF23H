'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleBack = () => {
    // Cek role user dari localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // User biasa tidak punya halaman yang bisa dituju — langsung ke login
        if (user.role === 'user') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
      } catch { /* invalid JSON */ }
    }
    // Role lain (admin/operator/viewer) — kembali ke halaman sebelumnya
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="mb-6" style={{ fontSize: '4rem' }}>
        ⚠️
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Anda tidak memiliki izin (role yang sesuai) untuk mengakses halaman ini. Silakan kembali atau hubungi Administrator.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="btn btn-secondary"
        >
          Kembali
        </button>
        <Link
          href="/login"
          className="btn btn-primary"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }}
        >
          Login Ulang
        </Link>
      </div>
    </div>
  );
}
