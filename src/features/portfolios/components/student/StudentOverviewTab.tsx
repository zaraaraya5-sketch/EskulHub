import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Extracurricular, SchoolEvent, AttendanceRecord, ExtracurricularMember, Achievement, Certificate } from '@/types';
import { db } from '@/lib/storage/mockDatabase';
import {
  CheckSquare,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
  Search,
  Eye,
  MapPin,
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
}) => {
  return (
    <div className="space-y-6">
      {/* 5 Core Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => setActiveTab('overview')}
          className="bg-white border border-[#F2F0EB] rounded-2xl p-4 hover:shadow-md hover:border-[#234B36]/30 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="text-[11px] font-bold text-[#68655F] uppercase tracking-wide group-hover:text-[#234B36] transition-colors">Ekskul Aktif</div>
          <div className="text-3xl font-black text-[#171717] mt-2 group-hover:scale-105 transform origin-left transition-transform">{myMemberships.length}</div>
          <div className="text-[11px] text-[#234B36] font-semibold mt-1">Terdaftar resmi</div>
        </div>

        <div
          onClick={() => setActiveTab('registrations')}
          className="bg-white border border-[#F2F0EB] rounded-2xl p-4 hover:shadow-md hover:border-[#234B36]/30 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="text-[11px] font-bold text-[#68655F] uppercase tracking-wide group-hover:text-[#234B36] transition-colors">Pendaftaran</div>
          <div className="text-3xl font-black text-[#171717] mt-2 group-hover:scale-105 transform origin-left transition-transform">
            {myRegistrations.length}
          </div>
          <div className="text-[11px] text-[#B58A32] font-semibold mt-1">
            {myRegistrations.filter((r) => r.status === 'pending').length} Menunggu review
          </div>
        </div>

        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white border border-[#F2F0EB] rounded-2xl p-4 hover:shadow-md hover:border-[#234B36]/30 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="text-[11px] font-bold text-[#68655F] uppercase tracking-wide group-hover:text-[#234B36] transition-colors">Kehadiran</div>
          <div className="text-3xl font-black text-[#234B36] mt-2 group-hover:scale-105 transform origin-left transition-transform">{attendanceRate}%</div>
          <div className="text-[11px] text-[#68655F] font-semibold mt-1">{presentCount} Hadir dari {totalSessions} sesi</div>
        </div>

        <div
          onClick={() => setActiveTab('achievements')}
          className="bg-white border border-[#F2F0EB] rounded-2xl p-4 hover:shadow-md hover:border-[#234B36]/30 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="text-[11px] font-bold text-[#68655F] uppercase tracking-wide group-hover:text-[#234B36] transition-colors">Prestasi</div>
          <div className="text-3xl font-black text-[#171717] mt-2 group-hover:scale-105 transform origin-left transition-transform">{myAchievements.length}</div>
          <div className="text-[11px] text-[#234B36] font-semibold mt-1">
            {myAchievements.filter((a) => a.is_verified).length} Tervalidasi resmi
          </div>
        </div>

        <div
          onClick={() => setActiveTab('documents')}
          className="bg-white border border-[#F2F0EB] rounded-2xl p-4 hover:shadow-md hover:border-[#234B36]/30 transition-all cursor-pointer shadow-sm flex flex-col justify-between group"
        >
          <div className="text-[11px] font-bold text-[#68655F] uppercase tracking-wide group-hover:text-[#234B36] transition-colors">Dokumen</div>
          <div className="text-3xl font-black text-[#171717] mt-2 group-hover:scale-105 transform origin-left transition-transform">{myCertificates.length}</div>
          <div className="text-[11px] text-[#234B36] font-semibold mt-1">Piagam tersimpan</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Memberships & Activity Overview */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Memberships */}
          <div className="bg-white border border-[#F2F0EB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F2F0EB]">
              <div>
                <h2 className="text-sm font-bold text-[#171717]">Ekstrakurikuler yang Diikuti</h2>
                <p className="text-xs text-[#68655F] mt-0.5">Daftar ekskul resmi tempat Anda terdaftar aktif sebagai anggota/pengurus.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('browse')}
                icon={<Search className="w-3.5 h-3.5" />}
              >
                Jelajah Ekskul Lain
              </Button>
            </div>

            {myMemberships.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#68655F] space-y-3">
                <p>Anda belum terdaftar dalam ekstrakurikuler manapun saat ini.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('browse')}
                >
                  Daftar Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myMemberships.map((m) => {
                  const ekskul = db.getExtracurricularById(m.extracurricular_id);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-[#F9F8F6] border border-transparent hover:bg-white hover:border-[#F2F0EB] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={ekskul?.profile_image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150'}
                          alt={ekskul?.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-[#F2F0EB] shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-bold text-[#171717]">{ekskul?.name}</span>
                            <Badge variant="success">{m.role}</Badge>
                            <span className="text-[11px] text-[#68655F]">
                              Bergabung: {m.joined_at}
                            </span>
                          </div>
                          <div className="text-xs text-[#68655F] space-y-0.5">
                            <div><strong className="text-[#171717]">Jadwal:</strong> {ekskul?.practice_schedule}</div>
                            <div><strong className="text-[#171717]">Lokasi:</strong> {ekskul?.location} • <strong className="text-[#171717]">Pembina:</strong> {ekskul?.supervisor_name}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEkskulDetail(ekskul || null)}
                          icon={<Eye className="w-3.5 h-3.5" />}
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

          {/* Recent Attendance Preview */}
          <div className="bg-white border border-[#F2F0EB] rounded-2xl p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F2F0EB]">
              <div>
                <h2 className="text-sm font-bold text-[#171717]">Catatan Presensi Terkini</h2>
                <p className="text-xs text-[#68655F] mt-0.5">Rekap sesi latihan terakhir yang dicatat oleh pembina/pengurus ekskul.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('attendance')}
                icon={<CheckSquare className="w-3.5 h-3.5" />}
              >
                Buku Presensi Lengkap
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#EAE6DC]">
                <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                    <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                    <th className="py-2.5 px-3 font-semibold">Materi Latihan</th>
                    <th className="py-2.5 px-3 font-semibold">Status Presensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D4CC]">
                  {myAttendanceRecords.slice(0, 5).map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#F9F8F6]/40">
                      <td className="py-2.5 px-3 font-mono text-[#68655F]">{rec.session_date}</td>
                      <td className="py-2.5 px-3 font-bold text-[#171717]">{rec.extracurricular_name}</td>
                      <td className="py-2.5 px-3 text-[#171717]">{rec.session_title}</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            rec.status === 'present'
                              ? 'success'
                              : rec.status === 'late'
                              ? 'warning'
                              : rec.status === 'excused'
                              ? 'info'
                              : 'danger'
                          }
                        >
                          {rec.status === 'present'
                            ? 'Hadir'
                            : rec.status === 'late'
                            ? 'Terlambat'
                            : rec.status === 'excused'
                            ? 'Izin'
                            : 'Alpa'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {myAttendanceRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#68655F]">
                        Belum ada catatan presensi latihan tercatat untuk akun Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Portfolio Card & Upcoming Events */}
        <div className="lg:col-span-4 space-y-6">
          {/* Portfolio Status Card */}
          <div className="bg-gradient-to-br from-[#1A3828] to-[#2B5C43] text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
              <ShieldCheck className="w-4 h-4" />
              <span>Dokumen Portofolio Resmi</span>
            </div>
            <h3 className="text-base font-bold">Portofolio Non-Akademik TA. 2025/2026</h3>
            <p className="text-xs text-white/85 leading-relaxed">
              Seluruh rekam jejak ekskul, presensi ({attendanceRate}%), dan sertifikat prestasi telah diverifikasi dengan QR publik resmi.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center bg-white text-[#234B36] hover:bg-[#F9F8F6] border-transparent font-bold"
                onClick={handleDownloadPdf}
                isLoading={isGeneratingPdf}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Unduh Portofolio (PDF)
              </Button>
              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className="text-center text-xs text-white/80 hover:text-white underline cursor-pointer py-1"
              >
                Pratinjau Lembar Portofolio
              </button>
            </div>
          </div>

          {/* Upcoming Agenda & Practices */}
          <div className="bg-white border border-[#F2F0EB] rounded-2xl p-6 shadow-sm mt-6 lg:mt-0">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F2F0EB]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#68655F]">
                Agenda Mendatang
              </h3>
              <Calendar className="w-4 h-4 text-[#234B36]" />
            </div>

            <div className="space-y-3 text-xs">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="p-4 bg-[#F9F8F6] rounded-xl space-y-1.5 hover:bg-[#F2F0EB] transition-colors">
                  <div className="font-bold text-[#171717]">{ev.title}</div>
                  <div className="text-[#68655F] flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ev.start_datetime.replace('T', ' ')}</span>
                  </div>
                  <div className="text-[11px] text-[#234B36] font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
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
