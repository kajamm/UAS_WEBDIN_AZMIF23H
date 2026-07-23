import { useState } from 'react';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kegiatanId: number | null;
}

export default function PosterModal({ isOpen, onClose, onSuccess, kegiatanId }: PosterModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !kegiatanId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Pilih file terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const formData = new FormData();
      formData.append('poster', file);

      const response = await fetch(`${apiUrl}/kegiatan/${kegiatanId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengunggah poster');
      
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
        <h2 className="text-xl font-bold mb-4">Upload Poster</h2>
        
        {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Pilih Gambar (JPG/PNG)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png"
              className="form-input" 
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              required 
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mengunggah...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
