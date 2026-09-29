import React, { useState } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Camera, CheckCircle } from 'lucide-react';
import { User } from '@/types';

interface AdminProfileSectionProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
  switchSection: (section: any) => void;
  setUsers: (users: User[]) => void;
}

export const AdminProfileSection: React.FC<AdminProfileSectionProps> = ({
  showNotification,
  switchSection,
  setUsers,
}) => {
  const { currentUser, updateProfile } = useAuth();
  
  const [profileName, setProfileName] = useState(currentUser?.name || 'Drs. Bambang Suryono');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'admin@smknusantara.sch.id');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '081298765432');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showNotification('error', 'Ukuran foto maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileAvatar(reader.result);
        showNotification('success', 'Foto baru berhasil dimuat. Klik "Simpan Perubahan Profil" di bawah.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      showNotification('error', 'Nama dan email wajib diisi.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showNotification('error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar_url: profileAvatar,
    });

    if (res.success) {
      setUsers([...db.getUsers()]);
      setNewPassword('');
      setConfirmPassword('');
      showNotification('success', 'Profil dan foto akun Admin berhasil disimpan!');
    } else {
      showNotification('error', res.message);
    }
  };

  return (
    <div className="bg-white border border-[#EAE6DC] rounded-lg p-6 space-y-6">
      <div className="pb-4 border-b border-[#EAE6DC]">
        <h2 className="text-base font-bold text-[#171717]">Pengaturan Profil & Foto Administrator</h2>
        <p className="text-xs text-[#68655F]">
          Ubah foto profil yang tampil di sidebar, nama akun, informasi kontak, dan kata sandi kesiswaan.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Foto Profil Section */}
        <div className="bg-[#F9F8F6]/40 border border-[#EAE6DC] rounded-lg p-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#234B36] mb-3">
            Foto Profil Administrator
          </label>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Live Avatar Preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <img
                  src={profileAvatar}
                  alt={profileName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#234B36] shadow-sm bg-white"
                />
                <label
                  htmlFor="avatar-file-input"
                  className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>Ganti Foto</span>
                </label>
              </div>
              <span className="text-[11px] font-semibold text-[#68655F]">Pratinjau Foto</span>
            </div>

            {/* Upload Options */}
            <div className="flex-1 space-y-3 text-xs w-full">
              <div>
                <label className="block font-bold text-[#171717] mb-1.5">
                  Unggah File Foto Profil:
                </label>
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-[#68655F] file:mr-3 file:py-2 file:px-3.5 file:rounded file:border file:border-[#EAE6DC] file:text-xs file:font-bold file:bg-white file:text-[#171717] hover:file:bg-[#F9F8F6] cursor-pointer"
                />
                <p className="text-[11px] text-[#68655F] mt-1.5">
                  Pilih file foto dari laptop/komputer Anda (Format JPG, PNG, atau WEBP, maksimal 3MB). Foto akan langsung terpasang pada pratinjau di sebelah kiri.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Profil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap & Gelar Resmi"
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Drs. Bambang Suryono, M.Pd."
            required
          />

          <Input
            label="Alamat Email Akun Admin"
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            placeholder="admin@smknusantara.sch.id"
            required
          />

          <Input
            label="Nomor Telepon / WhatsApp"
            type="tel"
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
            placeholder="081298765432"
          />

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
              Jabatan Satuan Pendidikan
            </label>
            <input
              type="text"
              disabled
              value="Wakil Kepala Sekolah Bidang Kesiswaan (Admin)"
              className="w-full px-3 py-2 text-xs bg-[#F9F8F6] border border-[#EAE6DC] rounded text-[#68655F] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Keamanan & Sandi */}
        <div className="pt-4 border-t border-[#EAE6DC]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-3">
            Pengaturan Kata Sandi (Opsional)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kata Sandi Baru"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah"
            />
            <Input
              label="Ulangi Kata Sandi Baru"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi kata sandi baru"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#EAE6DC]">
          <Button
            type="button"
            variant="outline"
            onClick={() => switchSection('dashboard')}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Simpan Perubahan Profil
          </Button>
        </div>
      </form>
    </div>
  );
};
