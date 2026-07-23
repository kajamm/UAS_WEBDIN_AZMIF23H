// frontend/app/page.tsx
// Halaman utama (Beranda / Dashboard)

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard | UAS Web Dinamis',
  description: 'Dashboard Admin panel',
};

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Ringkasan sistem pendaftaran kegiatan</p>
        </div>
        <div className="flex gap-2">
          <Link href="/kegiatan/create" className="btn btn-primary">
            + Kegiatan Baru
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Kegiatan" value="12" label="Kegiatan aktif bulan ini" color="blue" />
        <StatCard title="Total Peserta" value="1,248" label="Terdaftar di semua kegiatan" color="green" />
        <StatCard title="Jenis Kegiatan" value="5" label="Kategori tersedia" color="yellow" />
        <StatCard title="Pengguna" value="3" label="Admin & Operator aktif" color="purple" />
      </div>

      {/* Recent Activity Mockup */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">Kegiatan Mendatang</h2>
        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>Kegiatan</th>
                <th style={{ padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>Tanggal</th>
                <th style={{ padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>Lokasi</th>
                <th style={{ padding: '0.75rem', color: '#64748b', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0.75rem', fontWeight: 500 }}>Seminar Web Development 2026</td>
                <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>24 Jul 2026</td>
                <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>Auditorium Utama</td>
                <td style={{ padding: '1rem 0.75rem' }}><span className="badge badge-success">Aktif</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 0.75rem', fontWeight: 500 }}>Workshop UI/UX Design</td>
                <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>12 Agu 2026</td>
                <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>Lab Komputer A</td>
                <td style={{ padding: '1rem 0.75rem' }}><span className="badge badge-success">Aktif</span></td>
              </tr>
              <tr>
                <td style={{ padding: '1rem 0.75rem', fontWeight: 500 }}>Lomba Cerdas Cermat IT</td>
                <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>05 Sep 2026</td>
                <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>Gedung Serbaguna</td>
                <td style={{ padding: '1rem 0.75rem' }}><span className="badge badge-warning">Draft</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Komponen Stat Card Sederhana ──────────────────────────────────────────

function StatCard({ title, value, label, color }: { title: string, value: string, label: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: '#eff6ff',
    green: '#f0fdf4',
    yellow: '#fefce8',
    purple: '#faf5ff'
  };
  
  const textMap: Record<string, string> = {
    blue: '#1d4ed8',
    green: '#15803d',
    yellow: '#a16207',
    purple: '#7e22ce'
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ background: colorMap[color], color: textMap[color], padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
          Info
        </span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</span>
      </div>
    </div>
  );
}
