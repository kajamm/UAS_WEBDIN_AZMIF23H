'use client';

import { useState, useEffect, useCallback } from 'react';
import KegiatanModal from '@/components/kegiatan/KegiatanModal';
import PosterModal from '@/components/kegiatan/PosterModal';
import DeleteModal from '@/components/kegiatan/DeleteModal';
import { useRouter } from 'next/navigation';

export default function KegiatanPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [jenisList, setJenisList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  
  // Fitur pencarian & filter
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [jenisId, setJenisId] = useState('');
  
  // Fitur Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPage: 1, totalData: 0, currentPage: 1 });

  // Fitur Modal
  const [modalForm, setModalForm] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', initialData: null });
  const [modalPoster, setModalPoster] = useState({ isOpen: false, kegiatanId: null as number | null });
  const [modalDelete, setModalDelete] = useState({ isOpen: false, kegiatanId: null as number | null, judul: '' });

  const fetchJenisKegiatan = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/jenis-kegiatan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) setJenisList(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchKegiatan = useCallback(async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserRole(user.role || '');
          if (!['admin', 'operator', 'viewer'].includes(user.role)) {
            router.push('/unauthorized');
            return;
          }
        } catch (e) {}
      }

      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (jenisId) params.append('jenis_kegiatan_id', jenisId);

      const response = await fetch(`${apiUrl}/kegiatan?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok) {
        setData(result.data);
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, jenisId]);

  useEffect(() => {
    fetchJenisKegiatan();
  }, []);

  useEffect(() => {
    fetchKegiatan();
  }, [fetchKegiatan]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // reset ke page 1 saat filter diubah
    fetchKegiatan();
  };

  const handleModalSuccess = () => {
    setModalForm({ isOpen: false, mode: 'add', initialData: null });
    setModalPoster({ isOpen: false, kegiatanId: null });
    setModalDelete({ isOpen: false, kegiatanId: null, judul: '' });
    fetchKegiatan(); // Refresh data
  };

  // Helper render status
  const renderStatus = (statusStr: string) => {
    if (statusStr === 'aktif') return <span className="badge badge-success">Aktif</span>;
    if (statusStr === 'selesai') return <span className="badge badge-error" style={{backgroundColor: '#e2e8f0', color: '#475569'}}>Selesai</span>;
    return <span className="badge badge-warning">Draft</span>;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Data Kegiatan</h1>
        {['admin', 'operator'].includes(userRole) && (
          <button 
            className="btn btn-primary"
            onClick={() => setModalForm({ isOpen: true, mode: 'add', initialData: null })}
          >
            + Tambah Kegiatan
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="card mb-6">
        <form onSubmit={handleFilterSubmit} className="flex gap-4 items-end" style={{ flexWrap: 'wrap' }}>
          <div className="form-group flex-1" style={{ minWidth: '200px' }}>
            <label className="form-label">Pencarian Judul</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cari kegiatan..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ minWidth: '150px' }}>
            <label className="form-label">Jenis Kegiatan</label>
            <select className="form-input" value={jenisId} onChange={e => setJenisId(e.target.value)}>
              <option value="">Semua Jenis</option>
              {jenisList.map(jk => (
                <option key={jk.id} value={jk.id}>{jk.nama_jenis}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: '150px' }}>
            <label className="form-label">Status</label>
            <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary h-10">
            Cari & Filter
          </button>
        </form>
      </div>

      {/* Datatable */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Poster</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Judul & Tanggal</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Lokasi</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Status</th>
                {['admin', 'operator'].includes(userRole) && (
                  <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      {item.poster ? (
                        <img 
                          src={`http://localhost:3000/uploads/${item.poster}`} 
                          alt="Poster" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                          Kosong
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="font-bold text-gray-900">{item.judul}</div>
                      <div className="text-sm text-gray-500">{new Date(item.tanggal).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>{item.lokasi}</td>
                    <td style={{ padding: '1rem' }}>{renderStatus(item.status)}</td>
                    {['admin', 'operator'].includes(userRole) && (
                      <td style={{ padding: '1rem' }}>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-secondary text-sm px-2 py-1"
                            onClick={() => setModalForm({ isOpen: true, mode: 'edit', initialData: item })}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-secondary text-sm px-2 py-1"
                            onClick={() => setModalPoster({ isOpen: true, kegiatanId: item.id })}
                          >
                            Upload
                          </button>
                          <button 
                            className="btn text-sm px-2 py-1"
                            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                            onClick={() => setModalDelete({ isOpen: true, kegiatanId: item.id, judul: item.judul })}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {!loading && data.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Halaman {pagination.currentPage} dari {pagination.totalPage} (Total: {pagination.totalData} data)
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-secondary text-sm px-3 py-1"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Prev
              </button>
              <button 
                className="btn btn-secondary text-sm px-3 py-1"
                disabled={page >= pagination.totalPage}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <KegiatanModal 
        isOpen={modalForm.isOpen} 
        mode={modalForm.mode} 
        initialData={modalForm.initialData}
        jenisKegiatanList={jenisList}
        onClose={() => setModalForm({ ...modalForm, isOpen: false })}
        onSuccess={handleModalSuccess}
      />

      <PosterModal 
        isOpen={modalPoster.isOpen}
        kegiatanId={modalPoster.kegiatanId}
        onClose={() => setModalPoster({ ...modalPoster, isOpen: false })}
        onSuccess={handleModalSuccess}
      />

      <DeleteModal 
        isOpen={modalDelete.isOpen}
        kegiatanId={modalDelete.kegiatanId}
        kegiatanJudul={modalDelete.judul}
        onClose={() => setModalDelete({ ...modalDelete, isOpen: false })}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
