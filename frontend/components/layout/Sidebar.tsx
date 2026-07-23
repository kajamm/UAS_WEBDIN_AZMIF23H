'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string>('');

  // Tutup sidebar saat route berubah pada mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || 'user');
      } catch (e) {}
    }
  }, []);

  const allNavItems = [
    { name: 'Dashboard', path: '/', roles: ['admin', 'viewer'] },
    { name: 'Jenis Kegiatan', path: '/jenis-kegiatan', roles: ['admin'] },
    { name: 'Kegiatan', path: '/kegiatan', roles: ['admin', 'operator', 'viewer'] },
    { name: 'Peserta', path: '/peserta', roles: ['admin', 'operator'] },
    { name: 'Pengguna', path: '/users', roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          UAS Web Dinamis
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-link ${pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
