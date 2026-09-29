import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
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
}) => {
  const theme = themes[themeColor];
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addUserTargetRole, setAddUserTargetRole] = useState<UserRole>(roleFilters[0]);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userPhoneInput, setUserPhoneInput] = useState('');

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>(roleFilters[0]);
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserStatus, setEditUserStatus] = useState<boolean>(true);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users
    .filter((u) => roleFilters.includes(u.role))
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim() || !userEmailInput.trim()) {
      showNotification('error', 'Nama dan email wajib diisi.');
      return;
    }

    const res = db.addUser({
      name: userNameInput.trim(),
      email: userEmailInput.trim(),
      role: addUserTargetRole,
      phone: userPhoneInput.trim(),
      is_active: true,
    });

    if (res.success) {
      setUsers([...db.getUsers()]);
      setIsAddModalOpen(false);
      setUserNameInput('');
      setUserEmailInput('');
      setUserPhoneInput('');
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const res = db.updateUser(editingUser.id, {
      name: editUserName.trim(),
      email: editUserEmail.trim(),
      role: editUserRole,
      phone: editUserPhone.trim(),
      is_active: editUserStatus,
    });

    if (res.success) {
      setUsers([...db.getUsers()]);
      setEditingUser(null);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    const res = db.deleteUser(userToDelete.id);
    if (res.success) {
      setUsers([...db.getUsers()]);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
    setUserToDelete(null);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserPhone(user.phone || '');
    setEditUserStatus(user.is_active);
  };

  return (
    <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
        <div>
          <h2 className="text-sm font-bold text-[#171717]">{title}</h2>
          <p className="text-xs text-[#68655F]">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]`} />
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs bg-[#F9F8F6]/50 border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 ${theme.focusRing}`}
            />
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
            Tambah Baru
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#EAE6DC] bg-[#F9F8F6]/60 text-[#68655F]">
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Nama Lengkap</th>
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Email Institusi</th>
              {allEkskuls ? (
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Ekskul yang Dibina</th>
              ) : (
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">No. Telepon / WA</th>
              )}
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D4CC]">
            {filteredUsers.map((u) => {
              let assignedEkskul: Extracurricular[] = [];
              if (allEkskuls) {
                assignedEkskul = allEkskuls.filter((e) => e.supervisor_name.toLowerCase().includes(u.name.toLowerCase()));
              }

              return (
                <tr key={u.id} className="hover:bg-[#F9F8F6]/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#171717] flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${theme.bg} ${theme.text} font-bold flex items-center justify-center text-xs`}>
                      {u.name.substring(0, 1)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 px-3 text-[#68655F] font-mono">{u.email}</td>
                  
                  {allEkskuls ? (
                    <td className="py-3 px-3">
                      {assignedEkskul.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedEkskul.map((e) => (
                            <Badge key={e.id} variant="neutral">{e.name}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#68655F] italic">Belum ditugaskan</span>
                      )}
                    </td>
                  ) : (
                    <td className="py-3 px-3 text-[#171717]">{u.phone || '-'}</td>
                  )}

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_active ? theme.badgeValid : theme.badgeInvalid}`}>
                      {u.is_active ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(u)}
                        className={`p-1.5 text-[#68655F] ${theme.hoverText} ${theme.hoverBg} rounded cursor-pointer transition-colors`}
                        title="Edit Pengguna"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded cursor-pointer transition-colors"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={`Tambah Akun Baru`}>
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <Input label="Nama Lengkap Beserta Gelar" type="text" value={userNameInput} onChange={(e) => setUserNameInput(e.target.value)} placeholder="Contoh: Muhammad Farhan" required />
          <Input label="Alamat Email Akun" type="email" value={userEmailInput} onChange={(e) => setUserEmailInput(e.target.value)} placeholder="nama@smknusantara.sch.id" required />
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">Peran Akun</label>
            <select value={addUserTargetRole} onChange={(e) => setAddUserTargetRole(e.target.value as UserRole)} className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]">
              <option value="student">Siswa</option>
              <option value="guru">Guru</option>
              <option value="pembina">Pembina</option>
            </select>
          </div>
          <Input label="Nomor Telepon / WhatsApp" type="tel" value={userPhoneInput} onChange={(e) => setUserPhoneInput(e.target.value)} placeholder="081234567890" />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Akun</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editingUser !== null} onClose={() => setEditingUser(null)} title={`Edit Data Pengguna: ${editingUser?.name}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <Input label="Nama Lengkap" type="text" value={editUserName} onChange={(e) => setEditUserName(e.target.value)} required />
          <Input label="Alamat Email" type="email" value={editUserEmail} onChange={(e) => setEditUserEmail(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">Peran Akun</label>
              <select value={editUserRole} onChange={(e) => setEditUserRole(e.target.value as UserRole)} className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]">
                <option value="student">Siswa</option>
                <option value="guru">Guru</option>
                <option value="pembina">Pembina</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">Status Akun</label>
              <select value={editUserStatus ? 'active' : 'inactive'} onChange={(e) => setEditUserStatus(e.target.value === 'active')} className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]">
                <option value="active">Aktif</option>
                <option value="inactive">Non-Aktif</option>
              </select>
            </div>
          </div>
          <Input label="Nomor WhatsApp" type="tel" value={editUserPhone} onChange={(e) => setEditUserPhone(e.target.value)} />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Batal</Button>
            <Button type="submit" variant="primary">Perbarui Data</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={userToDelete !== null} onClose={() => setUserToDelete(null)} title="Konfirmasi Hapus Akun">
        <div className="space-y-4 text-xs">
          <p className="text-[#68655F]">Apakah Anda yakin ingin menghapus akun <strong className="text-[#171717]">{userToDelete?.name}</strong> ({userToDelete?.email})?</p>
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded">Tindakan ini akan mencabut akses masuk pengguna secara permanen.</div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>Batal</Button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-[#A33D35] hover:bg-[#852E27] text-white rounded text-xs font-bold transition-colors cursor-pointer">Hapus Pengguna</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
