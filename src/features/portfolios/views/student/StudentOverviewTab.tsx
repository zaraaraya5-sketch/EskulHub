import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Extracurricular, SchoolEvent, AttendanceRecord, ExtracurricularMember, Achievement, Certificate } from '@/types';
import { db } from '@/lib/database';
import {
  CheckSquare,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
  Search,
  Eye,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck,
  Trophy,
  Award,
} from 'lucide-react';

interface StudentOverviewTabProps {
  myRegistrations: any[];
  attendanceRate: number;
  presentCount: number;
  totalSessions: number;
  myAchievements: Achievement[];
  myCertificates: Certificate[];
  myMemberships: ExtracurricularMember[];
  myAttendanceRecords: AttendanceRecord[];
  upcomingEvents: SchoolEvent[];
  isGeneratingPdf: boolean;
  setActiveTab: (tab: any) => void;
  setSelectedEkskulDetail: (ekskul: Extracurricular | null) => void;
  handleDownloadPdf: () => void;
  onNavigate?: (path: string) => void;
}

export const StudentOverviewTab: React.FC<StudentOverviewTabProps> = ({
  myRegistrations,
  attendanceRate,
  presentCount,
  totalSessions,
  myAchievements,
  myCertificates,
  myMemberships,
  myAttendanceRecords,
  upcomingEvents,
  isGeneratingPdf,
  setActiveTab,
  setSelectedEkskulDetail,
  handleDownloadPdf,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Onboarding / Questionnaire Recommendation Banner */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-[#171717]">
                Tes Minat Bakat & Rekomendasi Ekstrakurikuler
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                5 Pertanyaan
              </span>
            </div>
            <p className="text-xs text-[#68655F] leading-relaxed">
              Bingung memilih cabang kegiatan yang tepat? Ikuti kuesioner singkat untuk menemukan ekskul yang selaras dengan minat dan potensimu.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate('/student/onboarding-quiz') : (window.location.href = '/student/onboarding-quiz'))}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#D15B40] hover:bg-[#B94931] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>Mulai Tes Minat</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Core Metrics Cards — Strict 5-Col Grid on Desktop, Clean 2-Col on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Ekskul Aktif */}
        <div
          onClick={() => setActiveTab('overview')}
          className="bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 hover:border-[#D15B40]/50 hover:shadow-sm transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider group-hover:text-[#D15B40] transition-colors">
              Ekskul Aktif
            </span>
            <BookOpen className="w-4 h-4 text-[#A39F97] group-hover:text-[#D15B40] transition-colors" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              {myMemberships.length}
            </span>
          </div>
          <div className="text-xs text-[#D15B40] font-semibold truncate">
            Terdaftar resmi
          </div>
        </div>

        {/* Metric 2: Pendaftaran */}
        <div
          onClick={() => setActiveTab('registrations')}
          className="bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 hover:border-[#D15B40]/50 hover:shadow-sm transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider group-hover:text-[#D15B40] transition-colors">
              Pendaftaran
            </span>
            <FileCheck className="w-4 h-4 text-[#A39F97] group-hover:text-[#D15B40] transition-colors" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              {myRegistrations.length}
            </span>
          </div>
          <div className="text-xs text-[#B58A32] font-semibold truncate">
            {myRegistrations.filter((r) => r.status === 'pending').length} Menunggu review
          </div>
        </div>

        {/* Metric 3: Kehadiran */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 hover:border-[#D15B40]/50 hover:shadow-sm transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider group-hover:text-[#D15B40] transition-colors">
              Kehadiran
            </span>
            <CheckSquare className="w-4 h-4 text-[#A39F97] group-hover:text-[#D15B40] transition-colors" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#D15B40] tracking-tight">
              {attendanceRate}%
            </span>
          </div>
          <div className="text-xs text-[#525049] font-medium truncate">
            {presentCount} dari {totalSessions} sesi
          </div>
        </div>

        {/* Metric 4: Prestasi */}
        <div
          onClick={() => setActiveTab('achievements')}
          className="bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 hover:border-[#D15B40]/50 hover:shadow-sm transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider group-hover:text-[#D15B40] transition-colors">
              Prestasi
            </span>
            <Trophy className="w-4 h-4 text-[#A39F97] group-hover:text-[#D15B40] transition-colors" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              {myAchievements.length}
            </span>
          </div>
          <div className="text-xs text-[#D15B40] font-semibold truncate">
            {myAchievements.filter((a) => a.is_verified).length} Tervalidasi
          </div>
        </div>

        {/* Metric 5: Dokumen */}
        <div
          onClick={() => setActiveTab('documents')}
          className="col-span-2 sm:col-span-1 bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 hover:border-[#D15B40]/50 hover:shadow-sm transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider group-hover:text-[#D15B40] transition-colors">
              Dokumen
            </span>
            <Award className="w-4 h-4 text-[#A39F97] group-hover:text-[#D15B40] transition-colors" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              {myCertificates.length}
            </span>
          </div>
          <div className="text-xs text-[#525049] font-medium truncate">
            Piagam tersimpan
          </div>
        </div>
      </div>

      {/* Main Grid: 8 Cols (Activities & Attendance) vs 4 Cols (Official Portfolio & Upcoming Schedule) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Memberships Card */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#EAE6DC]">
              <div>
                <h2 className="text-base font-bold text-[#171717]">Ekstrakurikuler yang Diikuti</h2>
                <p className="text-xs text-[#68655F] mt-0.5">
                  Daftar cabang ekskul resmi tempat kamu terdaftar aktif sebagai anggota.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('browse')}
                icon={<Search className="w-3.5 h-3.5 text-[#D15B40]" />}
                className="self-start sm:self-auto cursor-pointer"
              >
                Jelajah Ekskul Lain
              </Button>
            </div>

            {myMemberships.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#68655F] space-y-3">
                <BookOpen className="w-10 h-10 text-[#A39F97]/40 mx-auto" />
                <p>Kamu belum terdaftar dalam cabang ekstrakurikuler manapun saat ini.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('browse')}
                  className="cursor-pointer"
                >
                  Daftar Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {myMemberships.map((m) => {
                  const ekskul = db.getExtracurricularById(m.extracurricular_id);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC] hover:border-[#D15B40]/40 hover:bg-white hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                        <img
                          src={ekskul?.profile_image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150'}
                          alt={ekskul?.name}
                          width={64}
                          height={64}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.fallback) {
                              target.dataset.fallback = 'true';
                              target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150';
                            }
                          }}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#EAE6DC] shrink-0 group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-bold text-[#171717]">{ekskul?.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                              {m.role}
                            </span>
                            <span className="text-[11px] text-[#68655F]">
                              Bergabung: {m.joined_at}
                            </span>
                          </div>
                          <div className="text-xs text-[#68655F] space-y-0.5">
                            <div><strong className="text-[#171717]">Jadwal:</strong> {ekskul?.practice_schedule}</div>
                            <div className="truncate"><strong className="text-[#171717]">Lokasi:</strong> {ekskul?.location} • <strong className="text-[#171717]">Pembina:</strong> {ekskul?.supervisor_name}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEkskulDetail(ekskul || null)}
                          icon={<Eye className="w-3.5 h-3.5 text-[#525049]" />}
                          className="cursor-pointer text-xs"
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Attendance Preview Card */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#EAE6DC]">
              <div>
                <h2 className="text-base font-bold text-[#171717]">Catatan Presensi Terkini</h2>
                <p className="text-xs text-[#68655F] mt-0.5">
                  Rekap sesi latihan terakhir yang dicatat oleh pembina/pengurus ekskul.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('attendance')}
                icon={<CheckSquare className="w-3.5 h-3.5 text-[#D15B40]" />}
                className="self-start sm:self-auto cursor-pointer"
              >
                Buku Presensi Lengkap
              </Button>
            </div>

            {/* Mobile Card List (< md) */}
            <div className="block md:hidden space-y-2.5">
              {myAttendanceRecords.slice(0, 5).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-[#8C887B]">{rec.session_date}</div>
                    <div className="font-bold text-[#171717] truncate">{rec.extracurricular_name}</div>
                    <div className="text-[#525049] text-[11px] truncate mt-0.5">{rec.session_title}</div>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      rec.status === 'present'
                        ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                        : rec.status === 'late'
                        ? 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                        : rec.status === 'excused'
                        ? 'bg-[#F0F5F6] text-[#3B7A82] border border-[#CDE0E3]'
                        : 'bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2]'
                    }`}
                  >
                    {rec.status === 'present'
                      ? 'Hadir'
                      : rec.status === 'late'
                      ? 'Terlambat'
                      : rec.status === 'excused'
                      ? 'Izin'
                      : 'Alpa'}
                  </span>
                </div>
              ))}
              {myAttendanceRecords.length === 0 && (
                <div className="py-6 text-center text-[#68655F] bg-[#F9F8F6] rounded-xl border border-dashed border-[#EAE6DC] text-xs">
                  Belum ada riwayat catatan presensi latihan untuk akun Anda.
                </div>
              )}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto border border-[#EAE6DC] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                  <tr>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Tanggal</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Ekstrakurikuler</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Materi Latihan</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DC]">
                  {myAttendanceRecords.slice(0, 5).map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#F9F8F6]/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-[#68655F] whitespace-nowrap">{rec.session_date}</td>
                      <td className="py-3 px-4 font-bold text-[#171717]">{rec.extracurricular_name}</td>
                      <td className="py-3 px-4 text-[#525049]">{rec.session_title}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            rec.status === 'present'
                              ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                              : rec.status === 'late'
                              ? 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                              : rec.status === 'excused'
                              ? 'bg-[#F0F5F6] text-[#3B7A82] border border-[#CDE0E3]'
                              : 'bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2]'
                          }`}
                        >
                          {rec.status === 'present'
                            ? 'Hadir'
                            : rec.status === 'late'
                            ? 'Terlambat'
                            : rec.status === 'excused'
                            ? 'Izin'
                            : 'Alpa'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {myAttendanceRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#68655F]">
                        Belum ada riwayat catatan presensi latihan untuk akun Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Official Portfolio Card */}
          <div className="bg-gradient-to-br from-[#232220] to-[#171717] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#3A3834] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40]">
              <ShieldCheck className="w-4 h-4" />
              <span>Dokumen Kearsipan Resmi</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Portofolio Non-Akademik Siswa</h3>
              <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                Seluruh rekam jejak ekskul, persentase kehadiran ({attendanceRate}%), dan piagam prestasi terverifikasi sah dengan kode QR resmi sekolah.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center shadow-xs cursor-pointer"
                onClick={handleDownloadPdf}
                isLoading={isGeneratingPdf}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Unduh Portofolio (PDF)
              </Button>
              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className="text-center text-xs text-stone-400 hover:text-white underline cursor-pointer py-1 transition-colors"
              >
                Pratinjau Lembar Portofolio
              </button>
            </div>
          </div>

          {/* Upcoming School Events & Agenda */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#EAE6DC]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#68655F]">
                Agenda Mendatang
              </h3>
              <Calendar className="w-4 h-4 text-[#D15B40]" />
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="p-3.5 bg-[#F9F8F6] border border-[#EAE6DC]/60 rounded-xl space-y-1.5 hover:bg-[#F0EDE6] transition-colors">
                  <div className="font-bold text-xs text-[#171717]">{ev.title}</div>
                  <div className="text-[#68655F] flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#D15B40]" />
                    <span>{ev.start_datetime.replace('T', ' ')}</span>
                  </div>
                  <div className="text-[11px] text-[#525049] font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#68655F]" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
