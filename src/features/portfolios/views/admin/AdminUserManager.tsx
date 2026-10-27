import React, { useState } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProcessConfirmModal } from '@/components/ui/ProcessConfirmModal';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { User, UserRole, Extracurricular } from '@/types';

interface AdminUserManagerProps {
  title: string;
  description: string;
  roleFilters: UserRole[];
  themeColor: 'green' | 'gold' | 'red';
  allEkskuls?: Extracurricular[];
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onNavigate?: (path: string) => void;
}

const themes = {
  green: {
    text: 'text-[#234B36]',
    bg: 'bg-[#E7EFEA]',
    hoverText: 'hover:text-[#234B36]',
    hoverBg: 'hover:bg-[#F9F8F6]',
    focusRing: 'focus:ring-[#234B36]',
    badgeValid: 'bg-[#E7EFEA] text-[#234B36]',
    badgeInvalid: 'bg-[#F9ECEB] text-[#A33D35]',
  },
  gold: {
    text: 'text-[#8C6819]',
    bg: 'bg-[#F9F4E5]',
    hoverText: 'hover:text-[#8C6819]',
    hoverBg: 'hover:bg-[#F9F8F6]',
    focusRing: 'focus:ring-[#8C6819]',
    badgeValid: 'bg-[#F9F4E5] text-[#8C6819]',
    badgeInvalid: 'bg-[#F9ECEB] text-[#A33D35]',
  },
  red: {
    text: 'text-[#B84A3A]',
    bg: 'bg-[#F9ECEB]',
    hoverText: 'hover:text-[#B84A3A]',
    hoverBg: 'hover:bg-[#F9ECEB]',
    focusRing: 'focus:ring-[#B84A3A]',
    badgeValid: 'bg-[#F9ECEB] text-[#B84A3A]',
    badgeInvalid: 'bg-[#F9F8F6] text-[#68655F]',
  },
};

export const AdminUserManager: React.FC<AdminUserManagerProps> = ({
  title,
  description,
  roleFilters,
  themeColor,
  allEkskuls,
  users,
  setUsers,
  showNotification,
  onNavigate,
}) => {
  const theme = themes[themeColor];
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users
    .filter((u) => roleFilters.includes(u.role))
    .filter(
      (u) =>
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEditClick = (u: User) => {
    if (onNavigate) {
      if (u.role === 'student') {
        onNavigate(`/pengurus/students/${u.id}/edit`);
      } else {
        onNavigate(`/pengurus/pembina/${u.id}/edit`);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return false;
    const res = db.deleteUser(userToDelete.id);
    if (res.success) {
      setUsers([...db.getUsers()]);
      showNotification('success', res.message);
      return true;
    } else {
      showNotification('error', res.message);
      return false;
    }
  };

  return (
    <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE6DC]">
        <div>
          <h2 className="text-base font-bold text-[#171717]">{title}</h2>
          <p className="text-xs text-[#68655F] mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#68655F]" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-3 py-1.5 text-xs bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors w-48 sm:w-60"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (onNavigate) {
                if (roleFilters.includes('student')) {
                  onNavigate('/pengurus/students/tambah');
                } else {
                  onNavigate('/pengurus/pembina/tambah');
                }
              }
            }}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            {roleFilters.includes('student') ? 'Tambah Siswa Baru' : 'Tambah Guru Pembina'}
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EAE6DC]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#EAE6DC] bg-[#F9F8F6] text-[#68655F]">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Nama Lengkap</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Email Institusi</th>
              {allEkskuls ? (
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Ekskul yang Dibina</th>
              ) : (
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Kelas & No. Kontak</th>
              )}
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE6DC]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#68655F]">
                  Tidak ada data pengguna yang sesuai dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                let assignedEkskul: Extracurricular[] = [];
                if (allEkskuls) {
                  assignedEkskul = allEkskuls.filter((e) =>
                    e.supervisor_name.toLowerCase().includes(u.name.toLowerCase())
                  );
                }

                return (
                  <tr key={u.id} className="hover:bg-[#F9F8F6]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#171717] flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${theme.bg} ${theme.text} font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                      >
                        {u.name.substring(0, 1)}
                      </div>
                      <div className="overflow-hidden">
                        <span className="block truncate">{u.name}</span>
                        {u.role === 'student' && u.nisn && (
                          <span className="text-[10px] text-[#68655F] font-mono block">NISN: {u.nisn}</span>
                        )}
                        {u.role === 'pembina' && u.nip && (
                          <span className="text-[10px] text-[#68655F] font-mono block">NIP: {u.nip}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#525049] font-mono">{u.email}</td>

                    {allEkskuls ? (
                      <td className="py-3 px-4">
                        {assignedEkskul.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assignedEkskul.map((e) => (
                              <Badge key={e.id} variant="neutral">
                                {e.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#68655F] italic">Belum ditugaskan</span>
                        )}
                      </td>
                    ) : (
                      <td className="py-3 px-4 text-[#171717]">
                        <span className="font-semibold block">{u.class_name || 'Umum'}</span>
                        <span className="text-[11px] text-[#68655F] block font-mono">{u.phone || '-'}</span>
                      </td>
                    )}

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          u.is_active ? 'bg-[#E7EFEA] text-[#234B36]' : 'bg-[#F9ECEB] text-[#A33D35]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-[#234B36]' : 'bg-[#A33D35]'}`} />
                        {u.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#525049] hover:text-[#D15B40] hover:bg-[#FDEDE9] border border-[#EAE6DC] hover:border-[#F2C9C0] rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                          title="Buka Halaman Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] border border-transparent hover:border-[#E8BAB5] rounded-lg cursor-pointer transition-colors shadow-2xs"
                          title="Hapus Akun Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup with Process State */}
      <ProcessConfirmModal
        isOpen={userToDelete !== null}
        onClose={() => setUserToDelete(null)}
        title="Konfirmasi Hapus Akun Pengguna"
        description="Apakah Anda yakin ingin menghapus akun"
        targetName={`${userToDelete?.name} (${userToDelete?.email})`}
        warningNotice="Tindakan ini akan mencabut akses masuk akun pengguna secara permanen dari sistem portal kesiswaan SMKN 1 Ciomas."
        confirmLabel="Hapus Akun Pengguna"
        loadingText="Menghapus akun pengguna dari database..."
        successText={`Akun ${userToDelete?.name || ''} berhasil dihapus!`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
