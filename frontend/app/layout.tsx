// frontend/app/layout.tsx
// Root layout - dibungkus semua halaman

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DashboardLayout from '@/components/layout/DashboardLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UAS Web Dinamis',
  description: 'Project UAS Web Dinamis - Next.js + Express.js + TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
