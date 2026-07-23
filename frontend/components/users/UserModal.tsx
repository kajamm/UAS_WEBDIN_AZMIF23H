import { useState, useEffect } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'add' | 'edit';
  initialData?: any;
}

export default function UserModal({ isOpen, onClose, onSuccess, mode, initialData }: UserModalProps) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          nama: initialData.nama || '',
          email: initialData.email || '',
          password: '', // Kosongkan password saat edit, isi jika ingin ubah
          role: initialData.role || 'user'
        });
      } else {
        setFormData({
          nama: '',
          email: '',
          password: '',
          role: 'user'
        });
      }
      setError('');
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const url = mode === 'add' ? `${apiUrl}/users` : `${apiUrl}/users/${initialData.id}`;
      const method = mode === 'add' ? 'POST' : 'PUT';

      // Jangan kirim password kosong saat edit (kecuali disengaja, namun API meng-handle-nya)
      const payload = { ...formData };
      if (mode === 'edit' && !payload.password) {
        delete (payload as any).password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
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
        <h2 className="text-xl font-bold mb-4">{mode === 'add' ? 'Tambah User' : 'Edit User'}</h2>
        
        {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.nama} 
              onChange={e => setFormData({...formData, nama: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password {mode === 'edit' && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})}
              required={mode === 'add'} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select 
              className="form-input" 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
              <option value="user">User</option>
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
