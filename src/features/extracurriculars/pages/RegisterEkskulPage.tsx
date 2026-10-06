import React, { useState } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  UserCheck,
  Users,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';

interface RegisterEkskulPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const RegisterEkskulPage: React.FC<RegisterEkskulPageProps> = ({ slug, onNavigate }) => {
  const { currentUser, role } = useAuth();
  const ekskul = db.getExtracurricularBySlug(slug);

  // Role guard: Only students can register
  if (currentUser && role !== 'student') {
    const roleLabel =
      role === 'pembina' || role === 'teacher'
        ? 'Guru Pembina'
        : role === 'pengurus'
        ? 'Pengurus Ekskul'
        : 'Guru Wali Kelas';

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5 font-sans">
        <div className="w-14 h-14 rounded-full bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center mx-auto border border-[#F2C9C0]">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">Pendaftaran Khusus Siswa</h2>
          <p className="text-xs sm:text-sm text-[#525049] leading-relaxed">
            Akun Anda terdaftar sebagai <strong className="text-[#171717]">{roleLabel}</strong>. Formulir pendaftaran ekstrakurikuler hanya dapat diisi dan diajukan oleh akun Siswa.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" onClick={() => onNavigate(`/ekskul/${slug}`)}>
            Kembali ke Detail Ekskul
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate(role === 'pembina' || role === 'teacher' ? '/pembina/dashboard' : '/pengurus/dashboard')}
          >
            Buka Dasbor Saya
          </Button>
        </div>
      </div>
    );
  }

  if (!ekskul) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <h2 className="text-xl font-bold text-[#171717]">Ekstrakurikuler Tidak Ditemukan</h2>
        <p className="text-sm text-[#525049]">Kegiatan yang ingin kamu daftarkan tidak terdaftar di sistem sekolah.</p>
        <Button variant="outline" onClick={() => onNavigate('/ekskul')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const isCapacityFull = ekskul.current_member_count >= ekskul.member_capacity;
  const remainingQuota = Math.max(0, ekskul.member_capacity - ekskul.current_member_count);

  const [studentName, setStudentName] = useState(() => currentUser?.name || 'Budi Pratama');
  const [studentClass, setStudentClass] = useState('XII RPL 1');
  const [studentNisn, setStudentNisn] = useState('0067823910');
  const [studentPhone, setStudentPhone] = useState(currentUser?.phone || '');
  const [reason, setReason] = useState('');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentName.trim()) {
      setFormError('Nama lengkap siswa wajib diisi.');
      return;
    }
    if (!studentClass.trim()) {
      setFormError('Kelas dan jurusan siswa wajib diisi.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 15) {
      setFormError('Tuliskan alasan atau motivasimu bergabung (minimal 15 karakter).');
      return;
    }
    if (!agreedToRules) {
      setFormError('Kamu perlu menyetujui komitmen keaktifan sebelum mengirim formulir.');
      return;
    }

    setIsSubmitting(true);

    const studentId = currentUser?.id || `usr-student-${Date.now()}`;
    const result = db.createRegistration({
      extracurricular_id: ekskul.id,
      student_id: studentId,
      student_name: studentName.trim(),
      student_class: studentClass.trim(),
      student_nisn: studentNisn.trim() || '0067823910',
      reason: reason.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmittedSuccessfully(true);
    } else {
      setFormError(result.message || 'Gagal mengirim formulir pendaftaran.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 font-sans space-y-6 sm:space-y-8">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate(`/ekskul/${ekskul.slug}`)}
          className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#D15B40] active:scale-95 transition-all cursor-pointer select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Detail {ekskul.name}</span>
        </button>
      </div>

      {submittedSuccessfully ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-xs animate-in fade-in duration-300 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center mx-auto border border-[#F2C9C0]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D15B40]">
              Pendaftaran Berhasil Dikirim
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Selamat, Formulirmu Telah Diterima!
            </h1>
            <p className="text-sm text-[#525049] max-w-lg mx-auto leading-relaxed">
              Permohonan bergabung ke <strong className="text-[#171717]">{ekskul.name}</strong> sudah diteruskan ke guru pembina ({ekskul.supervisor_name}). Kamu dapat memantau status persetujuan kapan saja melalui dasbor siswa.
            </p>
          </div>

          <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="font-bold text-[#171717]">Ringkasan Pendaftaran:</div>
            <div className="flex justify-between text-[#525049]">
              <span>Nama Siswa:</span>
              <span className="font-semibold text-[#171717]">{studentName}</span>
            </div>
            <div className="flex justify-between text-[#525049]">
              <span>Kelas:</span>
              <span className="font-semibold text-[#171717]">{studentClass}</span>
            </div>
            <div className="flex justify-between text-[#525049]">
              <span>Ekstrakurikuler:</span>
              <span className="font-semibold text-[#171717]">{ekskul.name}</span>
            </div>
            <div className="flex justify-between text-[#525049]">
              <span>Status:</span>
              <Badge variant="warning">Menunggu Persetujuan</Badge>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/student/registrations')}
              className="rounded-xl"
            >
              Lihat Status di Dasbor Siswa
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/ekskul')}
              className="rounded-xl"
            >
              Jelajahi Ekskul Lain
            </Button>
          </div>
        </div>
      ) : (
        /* MAIN REGISTRATION FORM WORKFLOW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: EKSKUL SUMMARY CARD */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#EAE6DC] rounded-2xl overflow-hidden shadow-xs">
              <div className="h-40 w-full relative bg-[#2A2926] overflow-hidden">
                <img
                  src={imgError ? 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800' : (ekskul.profile_image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800')}
                  alt={ekskul.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge variant="neutral" className="bg-white/95 text-[#171717] text-[10px] font-bold">
                    {ekskul.category}
                  </Badge>
                  <h3 className="text-white font-bold text-base mt-1 drop-shadow-sm">{ekskul.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 text-[#525049]">
                    <Clock className="w-4 h-4 text-[#D15B40] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#171717] block">Jadwal Latihan:</span>
                      <span>{ekskul.practice_schedule}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[#525049]">
                    <MapPin className="w-4 h-4 text-[#8C6819] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#171717] block">Lokasi:</span>
                      <span>{ekskul.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[#525049]">
                    <UserCheck className="w-4 h-4 text-[#2A7B88] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#171717] block">Guru Pembina:</span>
                      <span>{ekskul.supervisor_name}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[#525049]">
                    <Users className="w-4 h-4 text-[#3B7A82] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#171717] block">Kapasitas:</span>
                      <span>{ekskul.current_member_count} dari {ekskul.member_capacity} Kuota Terisi</span>
                    </div>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div className="pt-2 border-t border-[#EAE6DC]">
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-[#525049]">Sisa Kursi:</span>
                    <span className={isCapacityFull ? 'text-[#D15B40]' : 'text-[#3B7A82]'}>
                      {remainingQuota} kursi tersedia
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F9F8F6] rounded-full overflow-hidden border border-[#EAE6DC]">
                    <div
                      className={`h-full transition-all ${isCapacityFull ? 'bg-[#D15B40]' : 'bg-[#3B7A82]'}`}
                      style={{ width: `${Math.min(100, (ekskul.current_member_count / ekskul.member_capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Step Guide */}
            <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-xs space-y-2">
              <div className="font-bold text-[#171717] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D15B40]" />
                <span>Alur Setelah Mengirim Formulir:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 text-[#525049] leading-relaxed">
                <li>Formulirmu masuk ke daftar tinjauan guru pembina.</li>
                <li>Pembina memeriksa motivasi dan ketersediaan kuota.</li>
                <li>Setelah disetujui, kamu resmi terdaftar dan bisa mulai mengikuti presensi latihan.</li>
              </ol>
            </div>
          </div>

          {/* RIGHT COLUMN: MAIN REGISTRATION FORM */}
          <div className="lg:col-span-8 bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#EAE6DC] pb-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
                Formulir Pendaftaran {ekskul.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#525049] mt-1">
                Isi data dirimu dengan benar. Informasi ini akan tercatat resmi di buku induk kesiswaan.
              </p>
            </div>

            {isCapacityFull && (
              <div className="p-4 bg-[#FDEDE9] border border-[#F2C9C0] text-[#D15B40] text-xs rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Kuota Reguler Telah Penuh</strong>
                  <span>Kamu masih bisa mendaftar sebagai antrean cadangan apabila ada anggota yang berhalangan atau membatalkan keikutsertaan.</span>
                </div>
              </div>
            )}

            {formError && (
              <div className="p-3.5 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Lengkap Siswa"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Contoh: Budi Pratama"
                  required
                />

                <Input
                  label="Nomor Induk Siswa Nasional (NISN)"
                  type="text"
                  value={studentNisn}
                  onChange={(e) => setStudentNisn(e.target.value)}
                  placeholder="Contoh: 0067823910"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Kelas & Jurusan Saat Ini"
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="Contoh: XII RPL 1"
                  required
                />

                <Input
                  label="Nomor WhatsApp Siswa / Orang Tua"
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525049] mb-1.5">
                  Alasan & Motivasi Bergabung <span className="text-[#D15B40]">*</span>
                </label>
                <Textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ceritakan mengapa kamu tertarik bergabung dengan ekskul ini, apa yang ingin kamu pelajari, atau pengalaman lomba/kegiatan yang pernah kamu ikuti..."
                  required
                />
                <span className="text-[11px] text-[#78746B] mt-1 block">
                  Tuliskan secara jelas agar guru pembina dapat mengenal minat dan potensimu.
                </span>
              </div>

              {/* Agreement Checkbox */}
              <div
                onClick={() => setAgreedToRules(!agreedToRules)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none active:scale-[0.99] min-h-[48px] ${
                  agreedToRules
                    ? 'bg-[#FDEDE9] border-[#D15B40]/50 text-[#171717] shadow-2xs'
                    : 'bg-[#F9F8F6] border-[#EAE6DC] text-[#525049] hover:border-[#D15B40]/40'
                }`}
              >
                <input
                  type="checkbox"
                  id="agreed-rules"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5 w-4 h-4 rounded border-[#D8D4CC] text-[#D15B40] focus:ring-[#D15B40] cursor-pointer"
                />
                <label htmlFor="agreed-rules" className="text-xs cursor-pointer leading-relaxed">
                  Saya berkomitmen untuk hadir aktif pada jadwal latihan rutin, menjaga nama baik sekolah, dan mematuhi tata tertib kegiatan ekstrakurikuler.
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#EAE6DC]">
                <div className="text-[11px] text-center sm:text-left">
                  {!agreedToRules ? (
                    <span className="inline-flex items-center gap-1.5 text-[#B58A32] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B58A32] shrink-0" />
                      Centang kotak komitmen di atas untuk mengaktifkan tombol pendaftaran.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[#3B7A82] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B7A82] shrink-0" />
                      Data siap dikirimkan ke guru pembina.
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => onNavigate(`/ekskul/${ekskul.slug}`)}
                    className="min-h-[44px] w-full sm:w-auto rounded-xl justify-center"
                  >
                    Batal
                  </Button>

                  <button
                    type="submit"
                    disabled={!agreedToRules || isSubmitting}
                    className={`min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center font-bold text-xs sm:text-sm rounded-xl px-7 py-2.5 gap-2 transition-all duration-300 select-none ${
                      agreedToRules
                        ? 'bg-[#D15B40] text-white hover:bg-[#B94931] active:bg-[#A63F28] active:scale-[0.98] shadow-md shadow-[#D15B40]/20 ring-2 ring-[#D15B40]/40 cursor-pointer'
                        : 'bg-[#2A2926] text-[#8C8980] border border-[#3E3C38] cursor-not-allowed opacity-80 shadow-none'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim Formulir...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Formulir Pendaftaran</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
