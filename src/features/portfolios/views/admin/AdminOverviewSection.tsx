import React from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Extracurricular, PortfolioVerification } from '@/types';
import {
  BookOpen,
  Calendar,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  QrCode,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AdminOverviewSectionProps {
  studentsList: User[];
  pembinaList: User[];
  ekskuls: Extracurricular[];
  verifications: PortfolioVerification[];
  registrations: any[];
  setRegistrations: (data: any[]) => void;
  setEkskuls: (data: Extracurricular[]) => void;
  switchSection: (section: string) => void;
  openAddUserModal: (role: string) => void;
  setIsAddEkskulModalOpen: (open: boolean) => void;
  setIsAddEventModalOpen: (open: boolean) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  settings: any;
  onNavigate?: (path: string) => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  studentsList,
  pembinaList,
  ekskuls,
  verifications,
  registrations,
  setRegistrations,
  setEkskuls,
  switchSection,
  openAddUserModal,
  setIsAddEkskulModalOpen,
  setIsAddEventModalOpen,
  showNotification,
  settings,
  onNavigate,
}) => {
  const handleApproveRegistration = (regId: string) => {
    const reviewer = settings?.vice_principal_student_affairs || 'Jamil Husein';
    const res = db.updateRegistrationStatus(regId, 'approved', reviewer);
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', 'Pendaftaran siswa berhasil disetujui!');
    }
  };

  const handleRejectRegistration = (regId: string) => {
    const reviewer = settings?.vice_principal_student_affairs || 'Jamil Husein';
    const res = db.updateRegistrationStatus(regId, 'rejected', reviewer);
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      showNotification('success', 'Pendaftaran siswa ditolak.');
    }
  };

  const pendingRegistrations = registrations.filter((r) => r.status === 'pending');
  const totalAchievements = db.getAchievements?.()?.length || 12;
  const events = db.getSchoolEvents?.() || [];

  // Filter next 3 upcoming events for a sleek overview snapshot
  const nowTime = new Date().getTime();
  const upcomingPreview = events
    .filter((e) => new Date(e.start_datetime.replace(' ', 'T')).getTime() >= nowTime - 86400000)
    .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. EXECUTIVE RECAP WIDGET (Polished, clean, actionable, no typography overload) */}
      <div className="bg-gradient-to-r from-[#FDEDE9]/70 via-white to-white border border-[#F2C9C0] rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D15B40] text-white flex items-center gap-1 shadow-2xs">
                <FileText className="w-3 h-3" />
                Rekapitulasi Bulanan Sekolah
              </span>
              <span className="text-[11px] font-semibold text-[#888681]">
                Periode: <strong>Oktober 2026</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#171717] tracking-tight">
              Ringkasan Kegiatan & Kesiswaan Bulan Ini
            </h2>
            <p className="text-xs text-[#525049] max-w-xl leading-relaxed">
              Pantau akumulasi pendaftaran siswa, penggunaan sarana latihan, dan perolehan prestasi resmi yang siap diekspor ke format laporan bulanan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate?.('/pengurus/rekap')}
              icon={<FileText className="w-3.5 h-3.5" />}
              className="shadow-xs font-semibold"
            >
              Buka Rekap Bulanan Lengkap
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('/contoh-portofolio')}
              icon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Format Portofolio
            </Button>
          </div>
        </div>

        {/* 4 Mini KPI Chips inside Recap */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#F2C9C0]/60 text-xs">
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#EAE6DC] flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#888681] block">Pendaftaran Baru</span>
              <span className="font-bold text-sm text-[#171717]">{registrations.length} Siswa</span>
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#EAE6DC] flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#E7EFEA] text-[#234B36] flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#888681] block">Ekskul Aktif</span>
              <span className="font-bold text-sm text-[#171717]">{ekskuls.length} Klub</span>
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#EAE6DC] flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#F9F4E5] text-[#8C6819] flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#888681] block">Prestasi Tercatat</span>
              <span className="font-bold text-sm text-[#171717]">{totalAchievements} Sertifikat</span>
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-[#EAE6DC] flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#F9ECEB] text-[#A33D35] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[#888681] block">Portofolio Sah</span>
              <span className="font-bold text-sm text-[#171717]">{verifications.length} Dokumen</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE METRICS GRID (Ultra-crisp visual cards with distinct accent colors) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa Card */}
        <div
          onClick={() => switchSection('students')}
          className="group bg-white border border-[#EAE6DC] hover:border-[#234B36] rounded-2xl p-4.5 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681]">Total Siswa</span>
            <div className="w-8 h-8 rounded-xl bg-[#E7EFEA] text-[#234B36] flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#171717] font-mono">{studentsList.length}</div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#234B36] mt-2 pt-2 border-t border-[#EAE6DC]/60">
            <span>Monitoring Siswa</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pembina Card */}
        <div
          onClick={() => switchSection('pembina')}
          className="group bg-white border border-[#EAE6DC] hover:border-[#D15B40] rounded-2xl p-4.5 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681]">Guru Pembina</span>
            <div className="w-8 h-8 rounded-xl bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#171717] font-mono">{pembinaList.length}</div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#D15B40] mt-2 pt-2 border-t border-[#EAE6DC]/60">
            <span>Monitoring Pembina</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Ekskul Card */}
        <div
          onClick={() => switchSection('ekskul')}
          className="group bg-white border border-[#EAE6DC] hover:border-[#8C6819] rounded-2xl p-4.5 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681]">Ekstrakurikuler</span>
            <div className="w-8 h-8 rounded-xl bg-[#F9F4E5] text-[#8C6819] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#171717] font-mono">{ekskuls.length}</div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C6819] mt-2 pt-2 border-t border-[#EAE6DC]/60">
            <span>Monitoring Ekskul</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Verifikasi Card */}
        <div
          onClick={() => switchSection('verification')}
          className="group bg-white border border-[#EAE6DC] hover:border-[#171717] rounded-2xl p-4.5 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681]">Portofolio Sah</span>
            <div className="w-8 h-8 rounded-xl bg-[#F9ECEB] text-[#A33D35] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#171717] font-mono">{verifications.length}</div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#171717] mt-2 pt-2 border-t border-[#EAE6DC]/60">
            <span>Arsip Verifikasi</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D15B40]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            Aksi Cepat Kesiswaan
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openAddUserModal('student')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F9F8F6] border border-[#EAE6DC] text-xs font-semibold text-[#171717] hover:text-[#234B36] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#234B36]" />
            <span>+ Siswa Baru</span>
          </button>
          <button
            onClick={() => openAddUserModal('pembina')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F9F8F6] border border-[#EAE6DC] text-xs font-semibold text-[#171717] hover:text-[#D15B40] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#D15B40]" />
            <span>+ Pembina Baru</span>
          </button>
          <button
            onClick={() => setIsAddEkskulModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F9F8F6] border border-[#EAE6DC] text-xs font-semibold text-[#171717] hover:text-[#8C6819] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8C6819]" />
            <span>+ Ekskul Baru</span>
          </button>
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#D15B40] hover:bg-[#b84a32] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ Jadwal Latihan</span>
          </button>
          <button
            onClick={() => switchSection('verification')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F9F8F6] border border-[#EAE6DC] text-xs font-semibold text-[#525049] hover:text-[#171717] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Cek Kode QR</span>
          </button>
        </div>
      </div>

      {/* 4. DUAL COLUMN: PENDING REGISTRATIONS + UPCOMING AGENDA SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Registrations (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">Pendaftaran Ekskul Siswa yang Masuk</h3>
              <p className="text-xs text-[#68655F]">Tinjau dan setujui kuota masuk anggota ekstrakurikuler.</p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                pendingRegistrations.length > 0 ? 'bg-[#FDEDE9] text-[#D15B40]' : 'bg-[#E7EFEA] text-[#234B36]'
              }`}
            >
              {pendingRegistrations.length} Menunggu Persetujuan
            </span>
          </div>

          {registrations.length === 0 ? (
            <p className="text-xs text-[#68655F] py-4 text-center">Belum ada pengajuan pendaftaran baru.</p>
          ) : (
            <div className="space-y-3">
              {registrations.slice(0, 5).map((reg) => (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-xl border border-[#EAE6DC] hover:border-[#D15B40] bg-[#F9F8F6]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FDEDE9] text-[#D15B40] font-bold flex items-center justify-center shrink-0 text-xs">
                      {reg.student_name.substring(0, 1)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#171717]">{reg.student_name}</span>
                        <span className="text-[10px] text-[#68655F]">({reg.student_class})</span>
                        <Badge variant="neutral">{reg.extracurricular_name}</Badge>
                      </div>
                      <p className="text-[11px] text-[#525049] italic">
                        &quot;{reg.reason || 'Ingin mengasah bakat dan keterampilan.'}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {reg.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveRegistration(reg.id)}
                          className="px-3 py-1 bg-[#234B36] hover:bg-[#1a3828] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRejectRegistration(reg.id)}
                          className="px-3 py-1 bg-white hover:bg-[#F9ECEB] border border-[#EAE6DC] text-[#A33D35] rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <Badge variant={reg.status === 'approved' ? 'success' : 'danger'}>
                        {reg.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Agenda Snapshot (1 Col) */}
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC] mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Agenda Terdekat</h3>
                <p className="text-xs text-[#68655F]">Kegiatan yang akan datang.</p>
              </div>
              <button
                onClick={() => switchSection('schedule')}
                className="text-xs font-semibold text-[#D15B40] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingPreview.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl border border-[#EAE6DC] bg-[#F9F8F6]/40 space-y-1.5 text-xs hover:border-[#D15B40] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#171717] truncate">{ev.title}</span>
                    <Badge variant="neutral">{ev.organizer}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#68655F]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#234B36]" />
                      {ev.start_datetime.substring(11, 16)} WIB
                    </span>
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="w-full mt-4 py-2 px-3 bg-[#F9F8F6] hover:bg-[#FDEDE9] border border-[#EAE6DC] hover:border-[#F2C9C0] text-[#D15B40] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwalkan Latihan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
