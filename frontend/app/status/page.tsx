// frontend/app/status/page.tsx
// Halaman untuk mengecek status API backend

'use client';

import { useState } from 'react';
import type { ApiResponse, ServerHealthData, DatabaseHealthData } from '@/types';
import { healthService } from '@/services/health.service';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface CheckResult<T> {
  status: Status;
  data?: ApiResponse<T>;
  error?: string;
}

export default function StatusPage() {
  const [serverCheck, setServerCheck] = useState<CheckResult<ServerHealthData>>({
    status: 'idle',
  });
  const [dbCheck, setDbCheck] = useState<CheckResult<DatabaseHealthData>>({
    status: 'idle',
  });

  const checkServer = async () => {
    setServerCheck({ status: 'loading' });
    try {
      const data = await healthService.checkServer();
      setServerCheck({ status: 'success', data });
    } catch (error) {
      setServerCheck({
        status: 'error',
        error: error instanceof Error ? error.message : 'Gagal terhubung ke backend',
      });
    }
  };

  const checkDatabase = async () => {
    setDbCheck({ status: 'loading' });
    try {
      const data = await healthService.checkDatabase();
      setDbCheck({ status: 'success', data });
    } catch (error) {
      setDbCheck({
        status: 'error',
        error: error instanceof Error ? error.message : 'Gagal terhubung ke database',
      });
    }
  };

  const checkAll = async () => {
    await Promise.allSettled([checkServer(), checkDatabase()]);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          Status API
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Cek koneksi antara frontend dan backend server
        </p>
      </div>

      {/* Check All Button */}
      <button
        onClick={checkAll}
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.625rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        🔄 Cek Semua
      </button>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Server Status */}
        <StatusCard
          title="Backend Server"
          description={`http://localhost:3000/api/health`}
          status={serverCheck.status}
          data={serverCheck.data?.data}
          error={serverCheck.error}
          onCheck={checkServer}
          icon="⚡"
        />

        {/* Database Status */}
        <StatusCard
          title="Database MySQL"
          description={`http://localhost:3000/api/health/db`}
          status={dbCheck.status}
          data={dbCheck.data?.data}
          error={dbCheck.error}
          onCheck={checkDatabase}
          icon="🗄️"
        />
      </div>
    </div>
  );
}

// ─── StatusCard Component ─────────────────────────────────────────────────────

interface StatusCardProps {
  title: string;
  description: string;
  status: Status;
  data?: Record<string, string> | null;
  error?: string;
  onCheck: () => void;
  icon: string;
}

function StatusCard({ title, description, status, data, error, onCheck, icon }: StatusCardProps) {
  const statusConfig = {
    idle: { color: '#6b7280', bg: '#f3f4f6', label: 'Belum dicek' },
    loading: { color: '#d97706', bg: '#fef3c7', label: 'Mengecek...' },
    success: { color: '#16a34a', bg: '#dcfce7', label: 'Terhubung' },
    error: { color: '#dc2626', bg: '#fee2e2', label: 'Gagal' },
  };

  const { color, bg, label } = statusConfig[status];

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          <div>
            <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{title}</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontFamily: 'monospace' }}>{description}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              background: bg,
              color: color,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {label}
          </span>
          <button
            onClick={onCheck}
            disabled={status === 'loading'}
            style={{
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              padding: '0.375rem 0.875rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              color: '#374151',
            }}
          >
            {status === 'loading' ? '...' : 'Cek'}
          </button>
        </div>
      </div>

      {/* Result */}
      {status === 'success' && data && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
          }}
        >
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <span style={{ color: '#6b7280', minWidth: '100px' }}>{key}:</span>
              <span style={{ color: '#111827', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && error && (
        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.8125rem',
            color: '#be123c',
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
