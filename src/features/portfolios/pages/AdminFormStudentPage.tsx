import React, { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  GraduationCap,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Edit2
} from 'lucide-react';

interface AdminFormStudentPageProps {
  onNavigate: (path: string) => void;
  editId?: string;
}

export const AdminFormStudentPage: React.FC<AdminFormStudentPageProps> = ({ onNavigate, editId }) => {
  const isEditMode = Boolean(editId);
  const existingUser = editId ? db.getUserById(editId) : null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nisn, setNisn] = useState('');
  const [className, setClassName] = useState('X PPLG 1');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name || '');
      setEmail(existingUser.email || '');
      setNisn(existingUser.nisn || '');
      setClassName(existingUser.class_name || 'X PPLG 1');
      setGender(existingUser.gender === 'P' ? 'P' : 'L');
      setPhone(existingUser.phone || '');
      setBio(existingUser.bio || '');
      setIsActive(existingUser.is_active !== undefined ? existingUser.is_active : true);
    }
  }, [existingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Nama lengkap siswa wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setFormError('Alamat email siswa wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editId) {
        const updatePayload: any = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          nisn: nisn.trim() || undefined,
          class_name: className.trim(),
          gender,
          phone: phone.trim() || '081234567890',
          bio: bio.trim() || undefined,
          is_active: isActive,
        };

        if (password.trim()) {
          updatePayload.password = password.trim();
        }

        const res = db.updateUser(editId, updatePayload);
        setIsSubmitting(false);

        if (res.success) {
          setFormSuccess(`Data siswa ${name} berhasil diperbarui!`);
          setTimeout(() => {
            onNavigate('/pengurus/students');
          }, 1000);
        } else {
          setFormError(res.message || 'Gagal memperbarui data siswa.');
        }
      } else {
        const res = await db.addUserAsync({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'student',
          phone: phone.trim() || '081234567890',
          password: password.trim() || 'password123',
          nisn: nisn.trim() || undefined,
          class_name: className.trim(),
          gender,
          bio: bio.trim() || undefined,
          is_active: isActive,
        });

        setIsSubmitting(false);

        if (res.success) {
          setFormSuccess(res.message || 'Akun siswa berhasil didaftarkan ke sistem portal!');
          setTimeout(() => {
            onNavigate('/pengurus/students');
          }, 1000);
        } else {
          setFormError(res.message || 'Gagal menambahkan akun siswa.');
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || 'Terjadi kesalahan saat memproses data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/pengurus/students')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#234B36] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Monitoring Data Siswa</span>
        </button>
      </div>

      {/* Header section */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] bg-[#D15B40]/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                {isEditMode ? <Edit2 className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                {isEditMode ? 'Edit Data Pengguna' : 'Registrasi Siswa Baru'}
              </span>
              <Badge variant="neutral">Peran: Siswa</Badge>
              {isEditMode && (
                <Badge variant={isActive ? 'success' : 'danger'}>
                  {isActive ? 'Akun Aktif' : 'Non-Aktif'}
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
              {isEditMode ? `Edit Data Siswa: ${name || 'Siswa'}` : 'Tambah Data Akun Siswa Baru'}
            </h1>
            <p className="text-xs text-[#68655F] max-w-2xl leading-relaxed">
              {isEditMode
                ? 'Perbarui informasi profil akun siswa, penyesuaian kelas, nomor identitas NISN, dan nomor kontak aktif.'
                : 'Daftarkan akun siswa baru ke dalam sistem database untuk akses pendaftaran ekstrakurikuler, presensi latihan, serta rekam portofolio prestasi resmi sekolah.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Success Banner */}
          {formSuccess && (
            <div className="p-4 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] rounded-xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Berhasil Disimpan</p>
                <p className="text-xs">{formSuccess}</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded-xl flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Gagal Menyimpan Data</p>
                <p className="text-xs">{formError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Data Identitas Siswa */}
          <div className="space-y-4">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D15B40]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                1. Data Identitas Pribadi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap Siswa *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Farhan"
                required
              />

              <Input
                label="Alamat Email Sekolah (@smkn1ciomas.sch.id) *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farhan@smkn1ciomas.sch.id"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="NISN (Nomor Induk Siswa Nasional)"
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="0067823911"
              />

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                  Kelas / Rombel Siswa
                </label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
                >
                  <option value="X PPLG 1">X PPLG 1</option>
                  <option value="X PPLG 2">X PPLG 2</option>
                  <option value="X Animasi 1">X Animasi 1</option>
                  <option value="X DKV 1">X DKV 1</option>
                  <option value="XI PPLG 1">XI PPLG 1</option>
                  <option value="XI PPLG 2">XI PPLG 2</option>
                  <option value="XI Animasi 1">XI Animasi 1</option>
                  <option value="XII RPL 1">XII RPL 1</option>
                  <option value="XII RPL 2">XII RPL 2</option>
                  <option value="XII Animasi 1">XII Animasi 1</option>
                  <option value="XII TKJ 1">XII TKJ 1</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Keamanan */}
          <div className="space-y-4 pt-4 border-t border-[#EAE6DC]">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#234B36]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                2. Kontak & Akses Akun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nomor Telepon / WhatsApp"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
              />

              <div>
                <Input
                  label={isEditMode ? 'Ganti Kata Sandi (Opsional)' : 'Kata Sandi Awal Akun'}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditMode ? 'Kosongkan jika tidak ingin mengubah' : 'Opsional (Default: password123)'}
                />
                <p className="text-[10px] text-[#68655F] mt-1">
                  {isEditMode
                    ? 'Kosongkan kolom ini jika tidak ingin merubah kata sandi siswa saat ini.'
                    : 'Jika dikosongkan, kata sandi awal otomatis diatur ke password123.'}
                </p>
              </div>
            </div>

            {isEditMode && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                  Status Keaktifan Akun
                </label>
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={(e) => setIsActive(e.target.value === 'active')}
                  className="w-full max-w-xs px-3 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
                >
                  <option value="active">Aktif (Dapat Mengakses Portal)</option>
                  <option value="inactive">Non-Aktif (Akses Ditangguhkan)</option>
                </select>
              </div>
            )}

            <Textarea
              label="Bio / Minat Siswa (Opsional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Minat khusus pada bidang olahraga futsal, robotika cerdas, atau seni pertunjukan tari..."
              rows={3}
            />
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#D15B40] shrink-0 mt-0.5" />
            <div className="text-xs text-[#525049] space-y-1">
              <p className="font-semibold text-[#171717]">Sinkronisasi Otomatis Database</p>
              <p className="text-[11px] leading-relaxed">
                Data yang disimpan langsung diperbarui secara realtime pada database server portal SMKN 1 Ciomas.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE6DC]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('/pengurus/students')}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isEditMode
                ? 'Perbarui Data Siswa'
                : 'Simpan Data Siswa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
