'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim permintaan reset password.');
      }

      setMessage(data.message || 'Jika email terdaftar, token telah dikirim. Silakan cek email Anda.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="card w-full max-w-md p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password</h1>
          <p className="text-gray-500">Masukkan email Anda untuk menerima token reset password</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
            <span>✅</span>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-10 mt-2"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Kirim Token Reset'}
          </button>
        </form>

        <div className="mt-6 text-center flex flex-col gap-2">
          {message && (
            <a href="/reset-password" className="text-sm text-primary hover:text-blue-800 font-medium transition-colors">
              Sudah menerima token? Reset sekarang →
            </a>
          )}
          <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Kembali ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  );
}
