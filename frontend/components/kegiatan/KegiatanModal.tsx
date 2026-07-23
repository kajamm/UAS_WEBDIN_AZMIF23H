import { useState, useEffect } from 'react';

interface KegiatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'add' | 'edit';
  initialData?: any;
  jenisKegiatanList: any[];
}

export default function KegiatanModal({ isOpen, onClose, onSuccess, mode, initialData, jenisKegiatanList }: KegiatanModalProps) {
  const [formData, setFormData] = useState({
    judul: '',
    jenis_kegiatan_id: '',
    tanggal: '',
    lokasi: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        // Format tanggal untuk input type="date" (YYYY-MM-DD)
        const dateStr = initialData.tanggal ? new Date(initialData.tanggal).toISOString().split('T')[0] : '';
        setFormData({
          judul: initialData.judul || '',
          jenis_kegiatan_id: initialData.jenis_kegiatan_id || '',
          tanggal: dateStr,
          lokasi: initialData.lokasi || '',
          status: initialData.status || 'draft'
        });
      } else {
        setFormData({
          judul: '',
          jenis_kegiatan_id: jenisKegiatanList[0]?.id || '',
          tanggal: '',
          lokasi: '',
          status: 'draft'
        });
      }
      setError('');
    }
  }, [isOpen, mode, initialData, jenisKegiatanList]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const url = mode === 'add' ? `${apiUrl}/kegiatan` : `${apiUrl}/kegiatan/${initialData.id}`;
      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal menyimpan data');
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '0 1rem' }}>
        <h2 className="text-xl font-bold mb-4">{mode === 'add' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}</h2>
        
        {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Judul Kegiatan</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.judul} 
              onChange={e => setFormData({...formData, judul: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Kegiatan</label>
            <select 
              className="form-input" 
              value={formData.jenis_kegiatan_id} 
              onChange={e => setFormData({...formData, jenis_kegiatan_id: e.target.value})}
              required
            >
              <option value="">Pilih Jenis Kegiatan</option>
              {jenisKegiatanList.map(jk => (
                <option key={jk.id} value={jk.id}>{jk.nama}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal</label>
            <input 
              type="date" 
              className="form-input" 
              value={formData.tanggal} 
              onChange={e => setFormData({...formData, tanggal: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.lokasi} 
              onChange={e => setFormData({...formData, lokasi: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-input" 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="draft">Draft</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
