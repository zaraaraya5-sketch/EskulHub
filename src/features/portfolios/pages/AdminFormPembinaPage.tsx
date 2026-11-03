import React, { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  UserCheck,
  Phone,
  Briefcase,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Edit2,
} from 'lucide-react';

interface AdminFormPembinaPageProps {
  onNavigate: (path: string) => void;
  editId?: string;
}

export const AdminFormPembinaPage: React.FC<AdminFormPembinaPageProps> = ({ onNavigate, editId }) => {
  const ekskuls = db.getExtracurriculars();
  const isEditMode = Boolean(editId);
  const existingUser = editId ? db.getUserById(editId) : null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nip, setNip] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedEkskulId, setAssignedEkskulId] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name || '');
      setEmail(existingUser.email || '');
      setNip(existingUser.nip || '');
      setSubject(existingUser.subject || '');
      setPhone(existingUser.phone || '');
      setIsActive(existingUser.is_active !== undefined ? existingUser.is_active : true);

      // Find if an ekskul already has this supervisor
      const matchedEkskul = ekskuls.find(
        (e) => e.supervisor_name.toLowerCase().includes((existingUser.name || '').toLowerCase())
      );
      if (matchedEkskul) {
        setAssignedEkskulId(matchedEkskul.id);
      }
    } else if (ekskuls.length > 0 && !assignedEkskulId) {
      setAssignedEkskulId(ekskuls[0].id);
    }
  }, [existingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Nama lengkap beserta gelar pembina wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setFormError('Alamat email pembina wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editId) {
        const updatePayload: any = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          nip: nip.trim() || undefined,
          subject: subject.trim() || 'Guru Pembina Ekstrakurikuler',
          phone: phone.trim() || '081234567891',
          is_active: isActive,
        };

        if (password.trim()) {
          updatePayload.password = password.trim();
        }

        const res = db.updateUser(editId, updatePayload);

        if (res.success && assignedEkskulId) {
          db.updateExtracurricular(assignedEkskulId, {
            supervisor_name: name.trim(),
          });
        }

        setIsSubmitting(false);

        if (res.success) {
          setFormSuccess(`Data pembina ${name} berhasil diperbarui!`);
          setTimeout(() => {
            onNavigate('/pengurus/pembina');
          }, 800);
        } else {
          setFormError(res.message || 'Gagal memperbarui data pembina.');
        }
      } else {
        const res = await db.addUserAsync({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'pembina',
          phone: phone.trim() || '081234567891',
          password: password.trim() || 'password123',
          nip: nip.trim() || undefined,
          subject: subject.trim() || 'Guru Pembina Ekstrakurikuler',
          is_active: isActive,
        });

        if (res.success && assignedEkskulId) {
          db.updateExtracurricular(assignedEkskulId, {
            supervisor_name: name.trim(),
          });
        }

        setIsSubmitting(false);

        if (res.success) {
          setFormSuccess(res.message || 'Akun guru pembina berhasil didaftarkan ke sistem portal!');
          setTimeout(() => {
            onNavigate('/pengurus/pembina');
          }, 800);
        } else {
          setFormError(res.message || 'Gagal menambahkan akun pembina.');
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || 'Terjadi kesalahan saat memproses data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/pengurus/pembina')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#D15B40] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Monitoring Guru Pembina</span>
        </button>
      </div>

      {/* Header section card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] bg-[#FDEDE9] border border-[#F2C9C0] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                {isEditMode ? <Edit2 className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                <span>{isEditMode ? 'Edit Data Pembina' : 'Registrasi Guru Pembina'}</span>
              </span>
              <Badge variant="neutral">Peran: Pembina Ekstrakurikuler</Badge>
              {isEditMode && (
                <Badge variant={isActive ? 'success' : 'danger'}>
                  {isActive ? 'Akun Aktif' : 'Non-Aktif'}
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
              {isEditMode ? `Edit Data Pembina: ${name || 'Guru'}` : 'Tambah Data Guru Pembina Baru'}
            </h1>
            <p className="text-xs text-[#68655F] max-w-2xl leading-relaxed">
              {isEditMode
                ? 'Perbarui data kepegawaian NIP, penugasan ekskul binaan, nomor WhatsApp aktif, dan status akun.'
                : 'Daftarkan akun guru pembina baru untuk verifikasi jadwal latihan mingguan, validasi presensi siswa, dan pembinaan prestasi.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-7 shadow-xs">
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

          {/* Section 1: Profil Guru & Kepegawaian */}
          <div className="space-y-4">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#D15B40]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                1. Data Kepegawaian & Guru
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap Beserta Gelar *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Hendra Wijaya, S.Pd."
                required
              />

              <Input
                label="Alamat Email Sekolah (@smkn1ciomas.sch.id) *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hendra@smkn1ciomas.sch.id"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="NIP (Nomor Induk Pegawai)"
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="198204152008011007"
              />

              <Input
                label="Mata Pelajaran / Bidang Tugas Guru"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Guru Pendidikan Jasmani & Olahraga"
              />
            </div>
          </div>

          {/* Section 2: Penugasan Ekstrakurikuler */}
          <div className="space-y-4 pt-4 border-t border-[#EAE6DC]">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#234B36]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                2. Penugasan Ekstrakurikuler
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                Pilih Ekstrakurikuler yang Dibina
              </label>
              <select
                value={assignedEkskulId}
                onChange={(e) => setAssignedEkskulId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
              >
                <option value="">-- Pilih Ekstrakurikuler --</option>
                {ekskuls.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.category}) - Pembina: {e.supervisor_name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#68655F] mt-1">
                Nama pembina pada ekstrakurikuler yang dipilih akan otomatis disinkronkan dengan data akun ini.
              </p>
            </div>
          </div>

          {/* Section 3: Kontak & Akses Akun */}
          <div className="space-y-4 pt-4 border-t border-[#EAE6DC]">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8C6819]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                3. Kontak & Akses Akun
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nomor Telepon / WhatsApp"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567891"
              />

              <div>
                <Input
                  label={isEditMode ? 'Ganti Kata Sandi (Opsional)' : 'Kata Sandi Awal Akun'}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditMode ? 'Kosongkan jika tidak ingin mengubah' : 'Default: password123'}
                />
                <p className="text-[10px] text-[#68655F] mt-1">
                  {isEditMode
                    ? 'Kosongkan jika tidak ingin mengubah kata sandi pembina saat ini.'
                    : 'Jika dikosongkan, kata sandi otomatis diatur ke password123.'}
                </p>
              </div>
            </div>

            {isEditMode && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                  Status Keaktifan Akun
                </label>
                <select
                  value={isActive ? 'active' : 'inactive'}
                  onChange={(e) => setIsActive(e.target.value === 'active')}
                  className="w-full sm:max-w-xs px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
                >
                  <option value="active">Aktif (Dapat Mengakses Portal)</option>
                  <option value="inactive">Non-Aktif (Akses Ditangguhkan)</option>
                </select>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#D15B40] shrink-0 mt-0.5" />
            <div className="text-xs text-[#525049] space-y-0.5">
              <p className="font-semibold text-[#171717]">Hak Akses Pembina Ekstrakurikuler</p>
              <p className="text-[11px] text-[#68655F] leading-relaxed">
                Guru pembina memiliki akses dasbor untuk membuka absensi latihan mingguan, mencatat presensi, serta memvalidasi sertifikat kejuaraan.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-[#EAE6DC]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/pengurus/pembina')}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              className="w-full sm:w-auto bg-[#D15B40] hover:bg-[#b84a32] text-white font-bold"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isEditMode
                ? 'Perbarui Data Pembina'
                : 'Simpan Data Pembina'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
