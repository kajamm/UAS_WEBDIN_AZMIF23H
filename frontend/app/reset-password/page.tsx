'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mereset password.');
      }

      setMessage(data.message || 'Password berhasil diubah. Silakan login kembali.');
      setToken('');
      setNewPassword('');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-500">Masukkan token yang Anda terima di email dan password baru</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm mb-6 flex flex-col items-center gap-2 text-center">
            <span className="text-2xl">✅</span>
            <span>{message}</span>
            <a href="/login" className="btn btn-primary w-full mt-4">
              Pergi ke Halaman Login
            </a>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-group">
              <label className="form-label" htmlFor="token">Token Reset (6 karakter)</label>
              <input
                id="token"
                type="text"
                className="form-input font-mono"
                placeholder="A1B2C3"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">Password Baru</label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-10 mt-2"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Ubah Password'}
            </button>
          </form>
        )}

        {!message && (
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Batal dan kembali ke Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
