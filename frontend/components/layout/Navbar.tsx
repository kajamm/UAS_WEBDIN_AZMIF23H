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

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  operator: 'Operator',
  viewer: 'Viewer',
  user: 'User',
};

const roleColor: Record<string, string> = {
  admin: '#dbeafe',
  operator: '#fef9c3',
  viewer: '#dcfce7',
  user: '#f1f5f9',
};

const roleTextColor: Record<string, string> = {
  admin: '#1d4ed8',
  operator: '#854d0e',
  viewer: '#166534',
  user: '#475569',
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch { /* invalid */ }
    }
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch { /* lanjut logout */ } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const initial = user?.nama ? user.nama.charAt(0).toUpperCase() : '?';
  const role = user?.role ?? '';

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onMenuClick && (
          <button className="hamburger-btn" onClick={onMenuClick} style={{ marginRight: '0.25rem' }}>
            ☰
          </button>
        )}
        <h2 style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>Admin Panel</h2>
      </div>

      {/* User Dropdown */}
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: '2rem',
            padding: '0.35rem 0.75rem 0.35rem 0.35rem',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          {/* Avatar */}
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          {/* Name + role — hidden on mobile */}
          <div
            style={{
              display: 'none',
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: 1.3,
            }}
            className="navbar-user-info"
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b' }}>
              {user?.nama ?? 'User'}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
              {roleLabel[role] ?? role}
            </span>
          </div>
          {/* Chevron */}
          <span
            style={{
              fontSize: '0.6rem',
              color: '#94a3b8',
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              lineHeight: 1,
            }}
          >
            ▼
          </span>
        </button>

        {/* Dropdown panel */}
        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 0.5rem)',
              minWidth: '220px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              overflow: 'hidden',
              zIndex: 50,
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            {/* Info user */}
            <div
              style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.125rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.nama ?? 'User'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '0.5rem',
                }}
              >
                {user?.email ?? ''}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: roleColor[role] ?? '#f1f5f9',
                  color: roleTextColor[role] ?? '#475569',
                }}
              >
                {roleLabel[role] ?? role}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.75rem 1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#dc2626',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {/* Logout icon — sederhana, tidak pakai SVG besar */}
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>⎋</span>
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
