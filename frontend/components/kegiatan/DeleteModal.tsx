import { useState } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kegiatanId: number | null;
  kegiatanJudul: string;
}

export default function DeleteModal({ isOpen, onClose, onSuccess, kegiatanId, kegiatanJudul }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !kegiatanId) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${apiUrl}/kegiatan/${kegiatanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menghapus kegiatan');
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '0 1rem' }}>
        <h2 className="text-xl font-bold mb-2 text-red-600">Hapus Kegiatan</h2>
        <p className="text-gray-600 mb-4">
          Apakah Anda yakin ingin menghapus kegiatan <strong>{kegiatanJudul}</strong>? Aksi ini tidak dapat dibatalkan.
        </p>
        
        {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-sm">{error}</div>}

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button type="button" className="btn" style={{ backgroundColor: '#dc2626', color: 'white' }} onClick={handleDelete} disabled={loading}>
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
