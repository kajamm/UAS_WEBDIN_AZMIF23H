'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface JenisKegiatan {
  id: number;
  nama_jenis: string;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Modal Form ──────────────────────────────────────────────────────────────

interface FormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData: JenisKegiatan | null;
  onClose: () => void;
  onSuccess: () => void;
}

function FormModal({ isOpen, mode, initialData, onClose, onSuccess }: FormModalProps) {
  const [namaJenis, setNamaJenis] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNamaJenis(initialData?.nama_jenis ?? '');
      setDeskripsi(initialData?.deskripsi ?? '');
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaJenis.trim()) {
      setError('Nama jenis kegiatan wajib diisi');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const url =
        mode === 'add'
          ? `${apiUrl}/jenis-kegiatan`
          : `${apiUrl}/jenis-kegiatan/${initialData!.id}`;

      const response = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama_jenis: namaJenis.trim(), deskripsi: deskripsi.trim() || null }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menyimpan data');

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === 'add' ? 'Tambah Jenis Kegiatan' : 'Edit Jenis Kegiatan'}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 flex gap-2 items-start">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">
              Nama Jenis Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="contoh: Seminar, Workshop, Lomba..."
              value={namaJenis}
              onChange={(e) => setNamaJenis(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-input"
              placeholder="Deskripsi singkat tentang jenis kegiatan ini (opsional)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="modal-footer" style={{ paddingTop: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : mode === 'add' ? 'Simpan' : 'Perbarui'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Hapus ─────────────────────────────────────────────────────────────

interface DeleteModalProps {
  isOpen: boolean;
  item: JenisKegiatan | null;
  onClose: () => void;
  onSuccess: () => void;
}

function DeleteModal({ isOpen, item, onClose, onSuccess }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!item) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/jenis-kegiatan/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menghapus data');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Hapus Jenis Kegiatan</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="text-gray-600 mb-2">
          Yakin ingin menghapus jenis kegiatan{' '}
          <strong className="text-gray-900">"{item?.nama_jenis}"</strong>?
        </p>
        <p className="text-sm text-red-500 mb-4">
          ⚠️ Jenis kegiatan yang masih dipakai oleh kegiatan lain tidak dapat dihapus.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="modal-footer" style={{ paddingTop: 0 }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className="btn"
            style={{ backgroundColor: '#dc2626', color: 'white' }}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JenisKegiatanPage() {
  const router = useRouter();
  const [data, setData] = useState<JenisKegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Client-side pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [modalForm, setModalForm] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    initialData: JenisKegiatan | null;
  }>({ isOpen: false, mode: 'add', initialData: null });

  const [modalDelete, setModalDelete] = useState<{
    isOpen: boolean;
    item: JenisKegiatan | null;
  }>({ isOpen: false, item: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Guard: hanya admin yang boleh akses
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role !== 'admin') {
            router.push('/unauthorized');
            return;
          }
        } catch {
          router.push('/login');
          return;
        }
      } else {
        router.push('/login');
        return;
      }

      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

      const response = await fetch(`${apiUrl}/jenis-kegiatan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (response.status === 403) {
        router.push('/unauthorized');
        return;
      }
      if (response.ok) {
        setData(result.data ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSuccess = () => {
    setModalForm({ isOpen: false, mode: 'add', initialData: null });
    setModalDelete({ isOpen: false, item: null });
    fetchData();
  };

  // Filter + pagination client-side
  const filtered = useMemo(
    () =>
      data.filter(
        (item) =>
          item.nama_jenis.toLowerCase().includes(search.toLowerCase()) ||
          (item.deskripsi ?? '').toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  // Reset page ke 1 saat search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jenis Kegiatan</h1>
          <p className="text-gray-500 mt-1">Master data kategori / jenis kegiatan</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModalForm({ isOpen: true, mode: 'add', initialData: null })}
        >
          + Tambah Jenis
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Cari nama atau deskripsi jenis kegiatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-secondary text-sm"
              onClick={() => setSearch('')}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Tabel */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              minWidth: '600px',
            }}
          >
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', width: '3rem' }}>#</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Nama Jenis</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Deskripsi</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data jenis kegiatan.'}
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>
                      {item.nama_jenis}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                      {item.deskripsi ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary text-sm px-2 py-1"
                          onClick={() =>
                            setModalForm({ isOpen: true, mode: 'edit', initialData: item })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn text-sm px-2 py-1"
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                          onClick={() => setModalDelete({ isOpen: true, item })}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Halaman {page} dari {totalPages} (Total: {filtered.length} data)
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-secondary text-sm px-3 py-1"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <button
                className="btn btn-secondary text-sm px-3 py-1"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <FormModal
        isOpen={modalForm.isOpen}
        mode={modalForm.mode}
        initialData={modalForm.initialData}
        onClose={() => setModalForm({ ...modalForm, isOpen: false })}
        onSuccess={handleSuccess}
      />
      <DeleteModal
        isOpen={modalDelete.isOpen}
        item={modalDelete.item}
        onClose={() => setModalDelete({ ...modalDelete, isOpen: false })}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
