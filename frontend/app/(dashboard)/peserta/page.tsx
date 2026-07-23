'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Peserta {
  id: number;
  kegiatan_id: number;
  judul_kegiatan?: string;
  user_id: number | null;
  nama: string;
  email: string;
  no_hp: string | null;
  status_pendaftaran: 'terdaftar' | 'hadir' | 'tidak_hadir';
  created_at: string;
  updated_at: string;
}

interface Kegiatan {
  id: number;
  judul: string;
}

// ─── Modal Form ──────────────────────────────────────────────────────────────

interface FormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData: Peserta | null;
  kegiatanList: Kegiatan[];
  onClose: () => void;
  onSuccess: () => void;
}

function FormModal({ isOpen, mode, initialData, kegiatanList, onClose, onSuccess }: FormModalProps) {
  const [form, setForm] = useState({
    kegiatan_id: '',
    nama: '',
    email: '',
    no_hp: '',
    status_pendaftaran: 'terdaftar',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        kegiatan_id: initialData?.kegiatan_id?.toString() ?? '',
        nama: initialData?.nama ?? '',
        email: initialData?.email ?? '',
        no_hp: initialData?.no_hp ?? '',
        status_pendaftaran: initialData?.status_pendaftaran ?? 'terdaftar',
      });
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kegiatan_id || !form.nama.trim() || !form.email.trim()) {
      setError('Kegiatan, nama, dan email wajib diisi');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const url =
        mode === 'add'
          ? `${apiUrl}/peserta`
          : `${apiUrl}/peserta/${initialData!.id}`;

      const response = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kegiatan_id: parseInt(form.kegiatan_id),
          nama: (form.nama || '').trim(),
          email: (form.email || '').trim(),
          no_hp: (form.no_hp || '').trim() || null,
          status_pendaftaran: form.status_pendaftaran,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menyimpan data');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '0 1rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {mode === 'add' ? 'Tambah Peserta' : 'Edit Peserta'}
          </h3>
          <button className="text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 flex gap-2 items-start">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">
              Kegiatan <span className="text-red-500">*</span>
            </label>
            <select
              className="form-input"
              value={form.kegiatan_id}
              onChange={(e) => setForm({ ...form, kegiatan_id: e.target.value })}
              required
            >
              <option value="">Pilih kegiatan...</option>
              {kegiatanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.judul}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Nama Peserta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Nama lengkap peserta"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">No. HP</label>
            <input
              type="text"
              className="form-input"
              placeholder="08xxxxxxxxxx (opsional)"
              value={form.no_hp}
              onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status Pendaftaran</label>
            <select
              className="form-input"
              value={form.status_pendaftaran}
              onChange={(e) => setForm({ ...form, status_pendaftaran: e.target.value })}
            >
              <option value="terdaftar">Terdaftar</option>
              <option value="hadir">Hadir</option>
              <option value="tidak_hadir">Tidak Hadir</option>
            </select>
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
  item: Peserta | null;
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
      const response = await fetch(`${apiUrl}/peserta/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menghapus data');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', margin: '0 1rem' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Hapus Peserta</h3>
          <button className="text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={onClose}>✕</button>
        </div>
        <p className="text-gray-600 mb-4">
          Yakin ingin menghapus peserta{' '}
          <strong className="text-gray-900">"{item?.nama}"</strong> dari daftar?
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}
        <div className="flex justify-end gap-2 mt-4">
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderStatusBadge(status: string) {
  switch (status) {
    case 'hadir':
      return <span className="badge badge-success">Hadir</span>;
    case 'tidak_hadir':
      return (
        <span className="badge badge-error" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          Tidak Hadir
        </span>
      );
    default:
      return (
        <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
          Terdaftar
        </span>
      );
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PesertaPage() {
  const router = useRouter();
  const [data, setData] = useState<Peserta[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [search, setSearch] = useState('');

  // Client-side pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter kegiatan
  const [filterKegiatanId, setFilterKegiatanId] = useState('');

  // Modal states
  const [modalForm, setModalForm] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    initialData: Peserta | null;
  }>({ isOpen: false, mode: 'add', initialData: null });

  const [modalDelete, setModalDelete] = useState<{
    isOpen: boolean;
    item: Peserta | null;
  }>({ isOpen: false, item: null });

  // Fetch daftar kegiatan untuk filter & dropdown
  const fetchKegiatanList = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/kegiatan?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) setKegiatanList(result.data ?? []);
    } catch {
      // silent
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Guard role
      const userStr = localStorage.getItem('user');
      if (!userStr) { router.push('/login'); return; }
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role ?? '');
        if (!['admin', 'operator', 'viewer'].includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      } catch {
        router.push('/login');
        return;
      }

      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/peserta`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) { router.push('/login'); return; }
      if (response.status === 403) { router.push('/unauthorized'); return; }

      const result = await response.json();
      if (response.ok) setData(result.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchKegiatanList();
    fetchData();
  }, [fetchData, fetchKegiatanList]);

  const handleSuccess = () => {
    setModalForm({ isOpen: false, mode: 'add', initialData: null });
    setModalDelete({ isOpen: false, item: null });
    fetchData();
  };

  // Filter + pagination client-side
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        (item.judul_kegiatan ?? '').toLowerCase().includes(search.toLowerCase());
      const matchKegiatan = filterKegiatanId
        ? item.kegiatan_id.toString() === filterKegiatanId
        : true;
      return matchSearch && matchKegiatan;
    });
  }, [data, search, filterKegiatanId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  useEffect(() => { setPage(1); }, [search, filterKegiatanId]);

  const canEdit = ['admin', 'operator'].includes(userRole);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4" style={{ flexWrap: 'wrap' }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Peserta</h1>
          <p className="text-gray-500 mt-1">Daftar peserta yang terdaftar di setiap kegiatan</p>
        </div>
        {canEdit && (
          <button
            className="btn btn-primary"
            onClick={() => setModalForm({ isOpen: true, mode: 'add', initialData: null })}
          >
            + Tambah Peserta
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="card mb-6">
        <div className="flex gap-4 items-end" style={{ flexWrap: 'wrap' }}>
          <div className="form-group flex-1" style={{ minWidth: '200px' }}>
            <label className="form-label">Pencarian</label>
            <input
              type="text"
              className="form-input"
              placeholder="Cari nama, email, atau judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ minWidth: '200px' }}>
            <label className="form-label">Filter Kegiatan</label>
            <select
              className="form-input"
              value={filterKegiatanId}
              onChange={(e) => setFilterKegiatanId(e.target.value)}
            >
              <option value="">Semua Kegiatan</option>
              {kegiatanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.judul}
                </option>
              ))}
            </select>
          </div>
          {(search || filterKegiatanId) && (
            <button
              className="btn btn-secondary h-10"
              onClick={() => { setSearch(''); setFilterKegiatanId(''); }}
            >
              Reset Filter
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
              minWidth: '700px',
            }}
          >
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', width: '3rem' }}>#</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Nama Peserta</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Kegiatan</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>No. HP</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Status</th>
                {canEdit && (
                  <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    {search || filterKegiatanId
                      ? 'Tidak ada hasil yang cocok.'
                      : 'Belum ada data peserta.'}
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="font-medium text-gray-900">{item.nama}</div>
                      <div className="text-sm text-gray-500">{item.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>
                      {item.judul_kegiatan ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                      {item.no_hp ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '1rem' }}>{renderStatusBadge(item.status_pendaftaran)}</td>
                    {canEdit && (
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
                    )}
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
              Halaman {page} dari {totalPages} (Total: {filtered.length} peserta)
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
        kegiatanList={kegiatanList}
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
