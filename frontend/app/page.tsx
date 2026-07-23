// frontend/app/page.tsx
// Halaman utama (Beranda)

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beranda | UAS Web Dinamis',
  description: 'Project UAS Web Dinamis dengan Next.js dan Express.js',
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          color: 'white',
          marginBottom: '2rem',
          width: '100%',
          maxWidth: '700px',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}
        >
          🚀
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          UAS Web Dinamis
        </h1>
        <p
          style={{
            fontSize: '1rem',
            opacity: 0.9,
            marginBottom: '2rem',
          }}
        >
          Project berbasis <strong>Next.js</strong> + <strong>Express.js</strong> + <strong>TypeScript</strong>
        </p>
        <Link
          href="/status"
          style={{
            display: 'inline-block',
            background: 'white',
            color: '#2563eb',
            padding: '0.625rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          Cek Status API →
        </Link>
      </div>

      {/* Info Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '700px',
        }}
      >
        <InfoCard
          icon="⚡"
          title="Backend"
          description="Express.js + TypeScript"
          detail="Port 3000"
          color="#dbeafe"
          textColor="#1e40af"
        />
        <InfoCard
          icon="🎨"
          title="Frontend"
          description="Next.js + TypeScript"
          detail="Port 3001"
          color="#ede9fe"
          textColor="#5b21b6"
        />
        <InfoCard
          icon="🗄️"
          title="Database"
          description="MySQL + mysql2"
          detail="Port 3306"
          color="#dcfce7"
          textColor="#166534"
        />
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  detail: string;
  color: string;
  textColor: string;
}

function InfoCard({ icon, title, description, detail, color, textColor }: InfoCardProps) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        {description}
      </p>
      <span
        style={{
          display: 'inline-block',
          background: color,
          color: textColor,
          padding: '0.125rem 0.625rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {detail}
      </span>
    </div>
  );
}
