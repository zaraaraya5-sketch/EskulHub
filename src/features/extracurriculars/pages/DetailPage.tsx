import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Users,
  Calendar,
  MapPin,
  Trophy,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface DetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ slug, onNavigate }) => {
  const { currentUser, role } = useAuth();
  const ekskul = db.getExtracurricularBySlug(slug);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [studentName, setStudentName] = useState(() => currentUser?.name || 'Budi Pratama');
  const [studentClass, setStudentClass] = useState('XII RPL 1');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  if (!ekskul) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#171717] mb-2">Ekstrakurikuler Tidak Ditemukan</h2>
        <p className="text-sm text-[#68655F] mb-4">Kegiatan yang Anda cari tidak terdaftar dalam pangkalan data sekolah.</p>
        <Button variant="outline" onClick={() => onNavigate('/ekskul')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const members = db.getMembersByExtracurricularId(ekskul.id);
  const activities = db.getActivities().filter(a => a.extracurricular_id === ekskul.id);
  const achievements = db.getAchievements().filter(a => a.extracurricular_id === ekskul.id);
  const isCapacityFull = ekskul.current_member_count >= ekskul.member_capacity;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!studentName.trim()) {
      setFormError('Nama siswa wajib diisi.');
      return;
    }

    if (!studentClass.trim()) {
      setFormError('Kelas siswa wajib diisi.');
      return;
    }

    if (!reason.trim()) {
      setFormError('Mohon isi deskripsi mengenai alasan dan komitmen Anda masuk ekskul ini.');
      return;
    }

    const studentId = currentUser?.id || `usr-student-${Date.now()}`;

    const result = db.createRegistration({
      extracurricular_id: ekskul.id,
      student_id: studentId,
      student_name: studentName.trim(),
      student_class: studentClass.trim(),
      student_nisn: '0067823910',
      reason: reason.trim(),
    });

    if (result.success) {
      setFormSuccess(`Formulir pendaftaran berhasil dikirim langsung ke Guru Pembina (${ekskul.supervisor_name}).`);
      setReason('');
      setTimeout(() => {
        setIsRegisterModalOpen(false);
        setFormSuccess('');
      }, 1800);
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/ekskul')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68655F] hover:text-[#234B36] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog Ekstrakurikuler</span>
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg overflow-hidden">
        <div className="h-64 sm:h-80 relative bg-[#EAE6DC]">
          <img
            src={ekskul.profile_image}
            alt={ekskul.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-white text-[#171717] text-xs font-bold">
                  {ekskul.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  ekskul.registration_status === 'open' ? 'bg-[#234B36] text-white' : 'bg-[#A33D35] text-white'
                }`}>
                  {ekskul.registration_status === 'open' ? 'Pendaftaran Dibuka' : 'Kuota Penuh'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">
                {ekskul.name}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl">
                {ekskul.short_description}
              </p>
            </div>

            <div className="shrink-0">
              <Button
                variant="primary"
                size="lg"
                disabled={isCapacityFull || ekskul.registration_status === 'closed'}
                onClick={() => setIsRegisterModalOpen(true)}
                className="shadow-sm"
              >
                {isCapacityFull ? 'Kapasitas Penuh' : 'Daftar Sekarang'}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D8D4CC] border-t border-[#EAE6DC] bg-[#F9F8F6]/40 text-xs">
          <div className="p-4">
            <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Guru Pembina</span>
            <span className="font-bold text-[#171717]">{ekskul.supervisor_name}</span>
          </div>
          <div className="p-4">
            <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Ketua Ekstrakurikuler</span>
            <span className="font-bold text-[#171717]">{ekskul.chairperson_name}</span>
          </div>
          <div className="p-4">
            <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Jadwal Rutin</span>
            <span className="font-bold text-[#171717]">{ekskul.practice_schedule}</span>
          </div>
          <div className="p-4">
            <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Kapasitas & Kuota</span>
            <span className="font-bold text-[#171717]">{ekskul.current_member_count} dari {ekskul.member_capacity} Siswa</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description, Activities, Achievements */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Description */}
          <div className="bg-white border border-[#EAE6DC] rounded-lg p-6">
            <h2 className="text-base font-bold text-[#171717] border-b border-[#EAE6DC] pb-3 mb-4">
              Tentang & Silabus Kegiatan
            </h2>
            <div className="text-sm text-[#474540] leading-relaxed space-y-3">
              <p>{ekskul.full_description}</p>
              <p>
                Kegiatan ekstrakurikuler ini menerapkan sistem presensi berbasis barcode digital pada setiap sesi latihan.
                Setiap anggota diwajibkan memenuhi persentase kehadiran minimal 80% untuk dapat memperoleh lembar verifikasi
                portofolio resmi pada akhir semester.
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white border border-[#EAE6DC] rounded-lg p-6">
            <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3 mb-4">
              <h2 className="text-base font-bold text-[#171717]">Daftar Prestasi Resmi Klub</h2>
              <Trophy className="w-4 h-4 text-[#B58A32]" />
            </div>

            {achievements.length === 0 ? (
              <p className="text-xs text-[#68655F]">Belum ada data prestasi resmi yang tercatat untuk ekstrakurikuler ini.</p>
            ) : (
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-3.5 border border-[#EAE6DC] rounded bg-[#F9F8F6]/30 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#171717]">{ach.title}</span>
                        <Badge variant="warning">{ach.rank}</Badge>
                      </div>
                      <div className="text-xs text-[#68655F]">
                        {ach.competition_name} ({ach.level}) • Peraih: <span className="font-semibold text-[#171717]">{ach.student_name}</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-[#234B36] font-semibold">
                      Terverifikasi
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-[#EAE6DC] rounded-lg p-6">
            <h2 className="text-base font-bold text-[#171717] border-b border-[#EAE6DC] pb-3 mb-4">
              Dokumentasi & Agenda Terbaru
            </h2>
            {activities.length === 0 ? (
              <p className="text-xs text-[#68655F]">Belum ada dokumentasi kegiatan yang diunggah.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="p-4 border border-[#EAE6DC] rounded bg-white">
                    <div className="flex items-center justify-between text-xs text-[#68655F] mb-1">
                      <span className="font-semibold text-[#234B36]">{act.location}</span>
                      <span>{act.activity_date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#171717] mb-2">{act.title}</h3>
                    <p className="text-xs text-[#474540] mb-3 leading-relaxed">{act.description}</p>
                    {act.documentation_urls.length > 0 && (
                      <div className="h-40 rounded overflow-hidden bg-[#EAE6DC]">
                        <img
                          src={act.documentation_urls[0]}
                          alt={act.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Organization Structure & CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#EAE6DC] rounded-lg p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68655F] mb-3">
              Struktur Kepengurusan Siswa
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC]">
                <span className="text-[#68655F]">Ketua:</span>
                <strong className="text-[#171717]">{ekskul.chairperson_name}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC]">
                <span className="text-[#68655F]">Wakil Ketua:</span>
                <strong className="text-[#171717]">Budi Pratama</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC]">
                <span className="text-[#68655F]">Guru Pembina:</span>
                <strong className="text-[#171717]">{ekskul.supervisor_name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#68655F]">Jumlah Anggota Aktif:</span>
                <strong className="text-[#234B36]">{ekskul.current_member_count} Siswa</strong>
              </div>
            </div>
          </div>

          {/* Registration Requirement Box */}
          <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-lg p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#234B36] mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Ketentuan Anggota</span>
            </div>
            <ul className="text-xs text-[#68655F] space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Terdaftar aktif sebagai siswa di {db.getSettings().school_name}.</li>
              <li>Wajib mengikuti sesi latihan rutin sesuai jadwal resmi.</li>
              <li>Menjaga nama baik sekolah dan sportivitas/kode etik organisasi.</li>
              <li>Presensi dicatat otomatis pada dokumen portofolio akhir.</li>
            </ul>

            <div className="mt-4 pt-3 border-t border-[#EAE6DC]">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                disabled={isCapacityFull || ekskul.registration_status === 'closed'}
                onClick={() => setIsRegisterModalOpen(true)}
              >
                {isCapacityFull ? 'Pendaftaran Ditutup' : 'Formulir Pendaftaran'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title={`Pendaftaran: ${ekskul.name}`}
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="p-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#8C6819]">
              <UserCheck className="w-4 h-4" />
              <span>Formulir ini dikirim langsung ke Guru Pembina:</span>
            </div>
            <div className="text-[#171717] font-bold pl-5">
              {ekskul.supervisor_name}
            </div>
            <div className="text-[11px] text-[#68655F] pl-5">
              Guru Pembina akan menerima pesan pendaftaran ini dan memverifikasi kelayakan anggota baru.
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] text-xs rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap Siswa"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Masukkan nama lengkap siswa..."
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kelas & Jurusan"
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Contoh: XII RPL 1 / X TKJ 2"
              required
            />
            <Input
              label="Kapasitas Tersisa"
              type="text"
              value={`${ekskul.member_capacity - ekskul.current_member_count} Kuota Tersedia`}
              readOnly
              className="bg-[#F9F8F6]/60 text-[#68655F]"
            />
          </div>

          <Textarea
            label="Deskripsi / Alasan Masuk Ekstrakurikuler"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Jelaskan minat Anda, pengalaman sebelumnya (bila ada), dan komitmen Anda masuk ekskul ini..."
            required
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Kirim ke Pembina
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
