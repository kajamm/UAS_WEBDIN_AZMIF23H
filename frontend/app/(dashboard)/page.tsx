'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    jenis_kegiatan: 0,
    kegiatan: 0,
    peserta: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Role protection
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (!['admin', 'viewer'].includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      } catch (e) {}
    } else {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Gagal memuat data');
        }

        setStats(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Ringkasan sistem pendaftaran kegiatan</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          title="Jenis Kegiatan" 
          value={loading ? '...' : stats.jenis_kegiatan.toString()} 
          label="Kategori kegiatan" 
          color="blue" 
        />
        <StatCard 
          title="Kegiatan" 
          value={loading ? '...' : stats.kegiatan.toString()} 
          label="Total kegiatan dibuat" 
          color="green" 
        />
        <StatCard 
          title="Peserta" 
          value={loading ? '...' : stats.peserta.toString()} 
          label="Total pendaftar" 
          color="yellow" 
        />
        <StatCard 
          title="User" 
          value={loading ? '...' : stats.users.toString()} 
          label="Total pengguna sistem" 
          color="purple" 
        />
      </div>

      {!loading && !error && (
        <div className="card text-center p-8 bg-gray-50">
          <p className="text-gray-500">Dashboard berhasil terkoneksi ke backend secara realtime!</p>
        </div>
      )}
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
          Real-time
        </span>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</span>
      </div>
    </div>
  );
}
