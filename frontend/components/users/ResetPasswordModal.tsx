import { useState } from 'react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  userName: string;
}

export default function ResetPasswordModal({ isOpen, onClose, userId, userName }: ResetPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !userId) return null;

  const handleReset = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${apiUrl}/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal reset password');
      
      setSuccessMsg('Email reset password berhasil dikirim ke alamat email user.');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '0 1rem' }}>
        <h2 className="text-xl font-bold mb-2">Reset Password</h2>
        
        {successMsg ? (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
            {successMsg}
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4 text-sm">
              Sistem akan membuat token reset baru dan mengirimkannya via email kepada <strong>{userName}</strong>. Lanjutkan?
            </p>
            
            {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-sm">{error}</div>}

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleReset} disabled={loading}>
                {loading ? 'Memproses...' : 'Kirim Link Reset'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
