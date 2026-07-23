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

  // Tutup sidebar saat route berubah pada mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Jenis Kegiatan', path: '/jenis-kegiatan' },
    { name: 'Kegiatan', path: '/kegiatan' },
    { name: 'Peserta', path: '/peserta' },
    { name: 'Pengguna', path: '/users' },
  ];

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
