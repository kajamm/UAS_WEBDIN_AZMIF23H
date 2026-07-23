'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick?: () => void;
}

interface UserInfo {
  nama: string;
  email: string;
  role: string;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Baca info user dari localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        // localStorage corrupt, biarkan null
      }
    }
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout backend (stateless — hanya untuk log)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // Lanjutkan logout meskipun request gagal
    } finally {
      // Hapus data sesi dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect ke halaman login
      router.push('/login');
    }
  };

  // Ambil inisial nama untuk avatar
  const getInitial = (nama: string) =>
    nama ? nama.charAt(0).toUpperCase() : '?';

  // Label role yang lebih ramah
  const roleLabel: Record<string, string> = {
    admin: 'Admin',
    operator: 'Operator',
    viewer: 'Viewer',
    user: 'User',
  };

  return (
    <header className="top-navbar">
      <div className="flex items-center">
        {onMenuClick && (
          <button className="hamburger-btn mr-4" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <h2 className="font-medium text-lg">Admin Panel</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* User profile + logout dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm select-none">
              {getInitial(user?.nama ?? 'A')}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="font-medium text-sm">{user?.nama ?? 'User'}</span>
              <span className="text-xs text-gray-400">
                {roleLabel[user?.role ?? ''] ?? user?.role ?? ''}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
              {/* Info user */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.nama ?? 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email ?? ''}</p>
                <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {roleLabel[user?.role ?? ''] ?? user?.role ?? ''}
                </span>
              </div>

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
