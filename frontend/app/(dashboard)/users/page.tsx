'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import UserModal from '@/components/users/UserModal';
import DeleteUserModal from '@/components/users/DeleteUserModal';
import ResetPasswordModal from '@/components/users/ResetPasswordModal';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Client-side pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Modal states
  const [modalForm, setModalForm] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', initialData: null });
  const [modalDelete, setModalDelete] = useState({ isOpen: false, userId: null as number | null, nama: '' });
  const [modalReset, setModalReset] = useState({ isOpen: false, userId: null as number | null, nama: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Role middleware will block if not admin, but let's handle 401/403
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

      const response = await fetch(`${apiUrl}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.status === 403) {
        alert("Akses ditolak: Hanya Admin yang dapat mengakses halaman ini.");
        router.push('/');
        return;
      }
      
      if (response.ok) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleModalSuccess = () => {
    setModalForm({ isOpen: false, mode: 'add', initialData: null });
    setModalDelete({ isOpen: false, userId: null, nama: '' });
    fetchUsers();
  };

  const renderRoleBadge = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin':
        return <span className="badge badge-error">Admin</span>; // merah
      case 'operator':
        return <span className="badge badge-warning">Operator</span>; // kuning
      case 'viewer':
        return <span className="badge badge-success">Viewer</span>; // hijau
      default:
        return <span className="badge" style={{backgroundColor: '#e2e8f0', color: '#475569'}}>User</span>; // abu
    }
  };

  // Kalkulasi pagination
  const totalPage = Math.ceil(data.length / limit) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return data.slice(startIndex, startIndex + limit);
  }, [data, page, limit]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Kelola pengguna, hak akses (role), dan reset sandi</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setModalForm({ isOpen: true, mode: 'add', initialData: null })}
        >
          + Tambah User
        </button>
      </div>

      {/* Datatable */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Nama</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Email</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Role</th>
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
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{user.nama}</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>{renderRoleBadge(user.role)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-secondary text-sm px-2 py-1"
                          onClick={() => setModalForm({ isOpen: true, mode: 'edit', initialData: user })}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn text-sm px-2 py-1"
                          style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' }}
                          onClick={() => setModalReset({ isOpen: true, userId: user.id, nama: user.nama })}
                        >
                          Reset Pass
                        </button>
                        <button 
                          className="btn text-sm px-2 py-1"
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                          onClick={() => setModalDelete({ isOpen: true, userId: user.id, nama: user.nama })}
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
        
        {/* Pagination Client Side */}
        {!loading && data.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Halaman {page} dari {totalPage} (Total: {data.length} data)
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
                disabled={page >= totalPage}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal 
        isOpen={modalForm.isOpen} 
        mode={modalForm.mode} 
        initialData={modalForm.initialData}
        onClose={() => setModalForm({ ...modalForm, isOpen: false })}
        onSuccess={handleModalSuccess}
      />

      <DeleteUserModal 
        isOpen={modalDelete.isOpen}
        userId={modalDelete.userId}
        userName={modalDelete.nama}
        onClose={() => setModalDelete({ ...modalDelete, isOpen: false })}
        onSuccess={handleModalSuccess}
      />

      <ResetPasswordModal 
        isOpen={modalReset.isOpen}
        userId={modalReset.userId}
        userName={modalReset.nama}
        onClose={() => setModalReset({ ...modalReset, isOpen: false })}
      />
    </div>
  );
}
