// frontend/components/layout/Navbar.tsx
// Komponen navigasi utama

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UAS</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Web Dinamis</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/status"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Status API
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
