import React, { useState } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  CheckSquare,
  Trophy,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  UserPlus,
  Mail,
  XCircle,
  Clock,
  UserCheck,
  Calendar,
  Users,
  MapPin,
  Plus,
  Edit,
  FileText,
  AlertCircle
} from 'lucide-react';
import { ExtracurricularRegistration, SchoolEvent, ExtracurricularMember } from '@/types';

interface TeacherDashboardPageProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ currentPath = '/pembina/dashboard', onNavigate }) => {
  const { currentUser } = useAuth();
  
  // Filter clubs matching the logged-in Pembina
  const allEkskuls = db.getExtracurriculars();
  const myEkskuls = currentUser
    ? allEkskuls.filter(e =>
        (e.supervisor_id && e.supervisor_id === currentUser.id) ||
        (currentUser.name && e.supervisor_name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
        (currentUser.email && currentUser.email.toLowerCase().includes('hendra') && (e.id === 'eks-1' || e.name.toLowerCase().includes('futsal')))
      )
    : [];
  const ekskuls = myEkskuls.length > 0 ? myEkskuls : allEkskuls.slice(0, 2);
  const supervisedEkskulIds = ekskuls.map(e => e.id);
  const supervisedEkskulNames = ekskuls.map(e => e.name);

  // Registrations & members
  const [registrations, setRegistrations] = useState<ExtracurricularRegistration[]>(() => db.getRegistrations());
  const [achievements, setAchievements] = useState(() => db.getAchievements());
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [membersTab, setMembersTab] = useState<'pending' | 'active'>('pending');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'competition' | 'training'>('all');

  // Events & Schedule
  const allEvents = db.getSchoolEvents();
  const events = allEvents.filter(ev => {
    // Show events related to supervisor's clubs or competition / school-wide events
    if (ev.extracurricular_id && supervisedEkskulIds.includes(ev.extracurricular_id)) return true;
    if (supervisedEkskulNames.includes(ev.extracurricular_name || '')) return true;
    if (ev.category === 'competition' || ev.event_type === 'competition') return true;
    if (ev.created_by_id === currentUser?.id) return true;
    return false;
  });

  // Attendance sessions
  const allSessions = db.getAttendanceSessions();
  const sessions = allSessions.filter(s => supervisedEkskulIds.includes(s.extracurricular_id));

  // Active members
  const activeMembers: ExtracurricularMember[] = ekskuls.flatMap(e =>
    db.getMembersByExtracurricularId(e.id)
  );

  const handleApproveRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'approved', currentUser?.name || 'Hendra Wijaya, S.Pd.', 'Disetujui oleh Pembina Ekskul.');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setActionNotice('Pendaftaran berhasil disetujui! Siswa telah otomatis masuk ke daftar anggota resmi.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleRejectRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'rejected', currentUser?.name || 'Hendra Wijaya, S.Pd.', 'Ditolak: kuota kelas telah terpenuhi.');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setActionNotice('Pendaftaran telah ditolak.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleVerifyAchievement = (id: string) => {
    db.verifyAchievement(id, currentUser?.name || 'Hendra Wijaya, S.Pd.');
    setAchievements([...db.getAchievements()]);
  };

  // Filter incoming registrations for clubs supervised by this Pembina
  const relevantRegistrations = registrations.filter(r =>
    supervisedEkskulNames.includes(r.extracurricular_name) ||
    supervisedEkskulIds.includes(r.extracurricular_id) ||
    r.status === 'pending'
  );

  const filteredEvents = events.filter(ev => {
    const cat = (ev.category || ev.event_type || '').toLowerCase();
    if (scheduleFilter === 'competition') return cat.includes('competition') || cat.includes('lomba');
    if (scheduleFilter === 'training') return cat.includes('training') || cat.includes('latihan');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#3B7A82] mb-1">
          Panel Guru Pembina • {currentUser?.name || 'Hendra Wijaya, S.Pd.'}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
          {currentPath.includes('extracurriculars') ? 'Daftar Ekskul Binaan' : 
           currentPath.includes('members') ? 'Daftar Calon & Anggota Aktif' : 
           currentPath.includes('attendance') ? 'Rekap Presensi & Kehadiran Latihan' : 
           currentPath.includes('schedule') ? 'Agenda Acara & Jadwal Lomba' :
           currentPath.includes('achievements') ? 'Verifikasi Prestasi Lomba Siswa' : 
           currentPath.includes('activities') ? 'Dokumentasi Kegiatan' : 
           'Dasbor Guru Pembina'}
        </h1>
        <p className="text-xs text-[#525049] mt-0.5">
          Pantau kehadiran anggota latihan, tinjau pendaftaran anggota baru, atur agenda & jadwal lomba, dan sahkan prestasi lomba siswa binaan.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 bg-[#FDEDE9] border border-[#F2C9C0] text-[#D15B40] text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* CONTENT BASED ON ROUTE */}
      
      {/* 1. DASBOR KILAT & RINGKASAN TINDAKAN (Dashboard Overview) */}
      {(currentPath === '/pembina/dashboard' || currentPath === '/pembina' || currentPath === '/teacher/dashboard' || currentPath === '/teacher') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EAE6DC] p-5 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.('/pembina/extracurriculars')}>
              <span className="text-xs font-bold text-[#525049] uppercase">Total Binaan</span>
              <span className="text-2xl font-black text-[#171717]">{ekskuls.length} Ekskul</span>
              <div className="text-[11px] text-[#3B7A82] font-semibold flex items-center gap-1 mt-1">
                <span>Lihat Detail Ekskul</span> <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="bg-white border border-[#EAE6DC] p-5 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.('/pembina/members')}>
              <span className="text-xs font-bold text-[#525049] uppercase">Pendaftar Baru</span>
              <span className="text-2xl font-black text-[#D15B40]">{relevantRegistrations.filter(r => r.status === 'pending').length} Siswa</span>
              <div className="text-[11px] text-[#D15B40] font-semibold flex items-center gap-1 mt-1">
                <span>Tinjau Pendaftar</span> <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="bg-white border border-[#EAE6DC] p-5 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.('/pembina/schedule')}>
              <span className="text-xs font-bold text-[#525049] uppercase">Agenda & Lomba</span>
              <span className="text-2xl font-black text-[#3B7A82]">{events.length} Agenda</span>
              <div className="text-[11px] text-[#3B7A82] font-semibold flex items-center gap-1 mt-1">
                <span>Atur Jadwal</span> <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="bg-white border border-[#EAE6DC] p-5 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.('/pembina/achievements')}>
              <span className="text-xs font-bold text-[#525049] uppercase">Validasi Prestasi</span>
              <span className="text-2xl font-black text-[#8C6819]">{achievements.filter(a => !a.is_verified).length} Prestasi</span>
              <div className="text-[11px] text-[#8C6819] font-semibold flex items-center gap-1 mt-1">
                <span>Sahkan Sekarang</span> <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Ekskul Binaan Anda with Quick Action Shortcuts */}
          <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
              <div>
                <h2 className="text-sm font-bold text-[#171717]">Ekstrakurikuler yang Anda Bina</h2>
                <p className="text-xs text-[#68655F] mt-0.5">Kelola anggota, jadwal latihan, dan rekap presensi ekskul binaan Anda.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('/pembina/extracurriculars')}>
                Kelola Detail Ekskul
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ekskuls.map((ekskul) => (
                <div key={ekskul.id} className="border border-[#EAE6DC] rounded-lg p-4 space-y-3 bg-[#F9F8F6]/30 hover:bg-[#F9F8F6] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3B7A82] uppercase">{ekskul.category}</span>
                    <Badge variant="success">Binaan Aktif</Badge>
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">{ekskul.name}</h3>
                  <div className="text-xs text-[#525049] space-y-1">
                    <div>Ketua Siswa: <strong className="text-[#171717]">{ekskul.chairperson_name}</strong></div>
                    <div>Jadwal Rutin: <strong className="text-[#171717]">{ekskul.practice_schedule}</strong></div>
                    <div>Kapasitas: <strong className="text-[#171717]">{ekskul.current_member_count} / {ekskul.member_capacity} Siswa</strong></div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#EAE6DC]">
                    <button
                      onClick={() => onNavigate?.('/pembina/members')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#EAE6DC] hover:border-[#3B7A82] text-[#171717] rounded cursor-pointer transition-colors"
                    >
                      Anggota & Pendaftar
                    </button>
                    <button
                      onClick={() => onNavigate?.('/pembina/schedule')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#EAE6DC] hover:border-[#3B7A82] text-[#171717] rounded cursor-pointer transition-colors"
                    >
                      Jadwal & Agenda
                    </button>
                    <button
                      onClick={() => onNavigate?.('/pembina/attendance')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#EAE6DC] hover:border-[#3B7A82] text-[#171717] rounded cursor-pointer transition-colors"
                    >
                      Presensi Latihan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DAFTAR DETAIL EKSKUL BINAAN (Extracurriculars Page) */}
      {currentPath.includes('extracurriculars') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Daftar Spesifikasi Ekskul Binaan</h2>
              <p className="text-xs text-[#68655F]">Informasi profil, deskripsi pembinaan, jadwal latihan, dan lokasi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ekskuls.map((ekskul) => (
              <div key={ekskul.id} className="bg-white border border-[#EAE6DC] rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3B7A82] uppercase">{ekskul.category}</span>
                  <Badge variant="success">Binaan Aktif</Badge>
                </div>
                <h3 className="text-lg font-bold text-[#171717]">{ekskul.name}</h3>
                <p className="text-xs text-[#525049] leading-relaxed">{ekskul.short_description}</p>
                <div className="text-xs text-[#525049] space-y-1.5 pt-2 border-t border-[#EAE6DC]">
                  <div>Ketua Ekskul: <strong className="text-[#171717]">{ekskul.chairperson_name}</strong></div>
                  <div>Jadwal Latihan: <strong className="text-[#171717]">{ekskul.practice_schedule}</strong></div>
                  <div>Lokasi: <strong className="text-[#171717]">{ekskul.location}</strong></div>
                  <div>Kapasitas Anggota: <strong className="text-[#171717]">{ekskul.current_member_count} / {ekskul.member_capacity} Siswa</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MANAJEMEN ANGGOTA & PENDAFTAR (Members) */}
      {currentPath.includes('members') && (
        <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#171717]">
                  Pengelolaan Anggota & Calon Pendaftar Ekskul
                </h2>
              </div>
              <p className="text-xs text-[#68655F] mt-0.5">
                Kelola permohonan pendaftaran baru dan pantau daftar seluruh anggota resmi ekskul binaan Anda.
              </p>
            </div>
            
            {/* Tabs Toggle */}
            <div className="flex items-center bg-[#F4F1EA] p-1 rounded-md text-xs font-medium">
              <button
                onClick={() => setMembersTab('pending')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  membersTab === 'pending'
                    ? 'bg-white text-[#D15B40] font-bold shadow-xs'
                    : 'text-[#68655F] hover:text-[#171717]'
                }`}
              >
                Pendaftar Baru ({relevantRegistrations.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setMembersTab('active')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  membersTab === 'active'
                    ? 'bg-white text-[#3B7A82] font-bold shadow-xs'
                    : 'text-[#68655F] hover:text-[#171717]'
                }`}
              >
                Anggota Resmi ({activeMembers.length})
              </button>
            </div>
          </div>

          {membersTab === 'pending' && (
            <div>
              {relevantRegistrations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#68655F] bg-[#F9F8F6]/40 rounded border border-[#EAE6DC]">
                  Belum ada formulir permohonan anggota baru yang masuk.
                </div>
              ) : (
                <div className="space-y-3">
                  {relevantRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="border border-[#EAE6DC] rounded-lg p-4 bg-[#F9F8F6]/20 hover:bg-[#F9F8F6]/50 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE6DC]/60 pb-2.5">
                        <div>
                          <span className="text-xs font-bold text-[#171717]">{reg.student_name}</span>
                          <span className="text-[11px] text-[#68655F] ml-2">
                            Kelas: <strong className="text-[#171717]">{reg.student_class}</strong>
                          </span>
                          <span className="text-[11px] text-[#68655F] ml-2">
                            Ekskul Tujuan: <strong className="text-[#3B7A82]">{reg.extracurricular_name}</strong>
                          </span>
                        </div>

                        <div>
                          {reg.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F9F4E5] text-[#8C6819] border border-[#DFCF9B]">
                              Menunggu Persetujuan Pembina
                            </span>
                          )}
                          {reg.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                              Disetujui Pembina
                            </span>
                          )}
                          {reg.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F4F5] text-[#A33D35] border border-[#E8BAB5]">
                              Ditolak
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Deskripsi & Alasan Mendaftar */}
                      <div className="text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#68655F] block mb-1">
                          Alasan & Motivasi Masuk Ekskul:
                        </span>
                        <div className="p-2.5 bg-white border border-[#EAE6DC] rounded text-[#171717] italic">
                          "{reg.reason}"
                        </div>
                      </div>

                      {/* Action Buttons for Pembina */}
                      {reg.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleRejectRegistration(reg.id)}
                            className="px-3 py-1.5 border border-[#EAE6DC] hover:bg-[#E8F4F5] text-[#A33D35] rounded text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Tolak Permohonan
                          </button>
                          <button
                            onClick={() => handleApproveRegistration(reg.id)}
                            className="px-3.5 py-1.5 bg-[#D15B40] hover:bg-[#b84a32] text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Setujui Masuk Anggota</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {membersTab === 'active' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#EAE6DC]">
                <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Nama Siswa</th>
                    <th className="py-2.5 px-3 font-semibold">NISN</th>
                    <th className="py-2.5 px-3 font-semibold">Kelas</th>
                    <th className="py-2.5 px-3 font-semibold">Peran / Posisi</th>
                    <th className="py-2.5 px-3 font-semibold">Tanggal Bergabung</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D4CC]">
                  {activeMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-xs text-[#68655F]">
                        Belum ada anggota resmi yang tercatat di ekskul binaan Anda.
                      </td>
                    </tr>
                  ) : (
                    activeMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-[#F9F8F6]/40">
                        <td className="py-2.5 px-3 font-bold text-[#171717]">{member.student_name}</td>
                        <td className="py-2.5 px-3 text-[#68655F] font-mono">{member.student_nisn}</td>
                        <td className="py-2.5 px-3">{member.student_class}</td>
                        <td className="py-2.5 px-3 font-medium text-[#3B7A82]">{member.role}</td>
                        <td className="py-2.5 px-3 text-[#68655F]">{member.joined_at}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="success">Aktif</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. AGENDA ACARA & JADWAL LOMBA (Schedule) */}
      {currentPath.includes('schedule') && (
        <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Agenda Acara & Jadwal Lomba Ekskul</h2>
              <p className="text-xs text-[#68655F] mt-0.5">
                Kelola jadwal latihan rutin, agenda tryout internal, serta persiapan dan keikutsertaan kompetisi.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate?.('/calendar/create')}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buat Agenda / Lomba Baru</span>
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduleFilter('all')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border ${
                scheduleFilter === 'all'
                  ? 'bg-[#3B7A82] text-white border-[#3B7A82]'
                  : 'bg-white text-[#525049] border-[#EAE6DC] hover:bg-[#F9F8F6]'
              }`}
            >
              Semua Agenda ({events.length})
            </button>
            <button
              onClick={() => setScheduleFilter('competition')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border ${
                scheduleFilter === 'competition'
                  ? 'bg-[#B58A32] text-white border-[#B58A32]'
                  : 'bg-white text-[#525049] border-[#EAE6DC] hover:bg-[#F9F8F6]'
              }`}
            >
              Jadwal Lomba & Kompetisi
            </button>
            <button
              onClick={() => setScheduleFilter('training')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border ${
                scheduleFilter === 'training'
                  ? 'bg-[#D15B40] text-white border-[#D15B40]'
                  : 'bg-white text-[#525049] border-[#EAE6DC] hover:bg-[#F9F8F6]'
              }`}
            >
              Latihan Rutin & Acara Ekskul
            </button>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#68655F] bg-[#F9F8F6]/40 rounded border border-[#EAE6DC] space-y-2">
              <Calendar className="w-8 h-8 text-[#A09D95] mx-auto" />
              <p>Belum ada jadwal acara atau lomba yang dicatat untuk kategori ini.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.('/calendar/create')}
              >
                Tambah Agenda Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((ev) => {
                const isCompetition = (ev.category || ev.event_type || '').toLowerCase().includes('competition') || (ev.category || '').toLowerCase().includes('lomba');
                return (
                  <div
                    key={ev.id}
                    className="border border-[#EAE6DC] rounded-lg p-4 bg-white hover:border-[#3B7A82] transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          isCompetition
                            ? 'bg-[#F9F4E5] text-[#8C6819] border border-[#DFCF9B]'
                            : 'bg-[#E8F4F5] text-[#3B7A82] border border-[#C5DFE2]'
                        }`}>
                          {isCompetition ? 'Kompetisi / Kejuaraan' : 'Agenda Ekskul'}
                        </span>
                        <h3 className="text-sm font-bold text-[#171717]">{ev.title}</h3>
                      </div>
                      <button
                        onClick={() => onNavigate?.(`/calendar/edit/${ev.id}`)}
                        className="p-1.5 text-[#68655F] hover:text-[#3B7A82] hover:bg-[#F4F1EA] rounded cursor-pointer transition-colors"
                        title="Edit Agenda"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-[#525049] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#3B7A82] shrink-0" />
                        <span>{ev.start_datetime ? new Date(ev.start_datetime).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                        <span>{ev.location}</span>
                      </div>
                      {ev.organizer && (
                        <div className="text-[11px] text-[#68655F]">
                          Penyelenggara: <strong className="text-[#171717]">{ev.organizer}</strong>
                        </div>
                      )}
                    </div>

                    {ev.description && (
                      <p className="text-xs text-[#525049] line-clamp-2 bg-[#F9F8F6] p-2 rounded">
                        {ev.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. PRESENSI & KEHADIRAN (Attendance) */}
      {currentPath.includes('attendance') && (
        <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Rekap Presensi & Kehadiran Latihan Anggota</h2>
              <p className="text-xs text-[#68655F] mt-0.5">
                Pantau tingkat partisipasi siswa pada setiap sesi latihan rutin ekskul binaan Anda.
              </p>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#68655F] bg-[#F9F8F6]/40 rounded border border-[#EAE6DC] space-y-2">
              <CheckSquare className="w-8 h-8 text-[#A09D95] mx-auto" />
              <p>Belum ada sesi latihan yang tercatat untuk ekskul binaan Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#EAE6DC]">
                <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Judul Pertemuan / Sesi</th>
                    <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                    <th className="py-2.5 px-3 font-semibold">Tanggal & Waktu</th>
                    <th className="py-2.5 px-3 font-semibold">Tempat</th>
                    <th className="py-2.5 px-3 font-semibold">Kehadiran</th>
                    <th className="py-2.5 px-3 font-semibold">Pencatat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D4CC]">
                  {sessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-[#F9F8F6]/40">
                      <td className="py-2.5 px-3 font-bold text-[#171717]">{sess.title}</td>
                      <td className="py-2.5 px-3 text-[#3B7A82] font-semibold">{sess.extracurricular_name}</td>
                      <td className="py-2.5 px-3 text-[#68655F]">
                        {sess.session_date} ({sess.start_time} - {sess.end_time})
                      </td>
                      <td className="py-2.5 px-3">{sess.location}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#234B36]">{sess.present_count}</span>
                        <span className="text-[#68655F]"> / {sess.total_members} hadir</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#68655F]">{sess.created_by_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. VERIFIKASI PRESTASI RESMI (Achievements) */}
      {currentPath.includes('achievements') && (
        <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Verifikasi Prestasi Masuk Portofolio Resmi</h2>
              <p className="text-xs text-[#68655F]">
                Prestasi yang disahkan pembina akan otomatis tercantum pada transkrip resmi portofolio kelulusan siswa.
              </p>
            </div>
            <Trophy className="w-5 h-5 text-[#8C6819]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#EAE6DC]">
              <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Nama Siswa</th>
                  <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                  <th className="py-2.5 px-3 font-semibold">Kejuaraan / Prestasi</th>
                  <th className="py-2.5 px-3 font-semibold">Tingkat</th>
                  <th className="py-2.5 px-3 font-semibold">Status Validasi</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D4CC]">
                {achievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-[#F9F8F6]/40">
                    <td className="py-2.5 px-3 font-bold text-[#171717]">{ach.student_name}</td>
                    <td className="py-2.5 px-3 text-[#68655F]">{ach.extracurricular_name}</td>
                    <td className="py-2.5 px-3 font-medium text-[#171717]">{ach.title}</td>
                    <td className="py-2.5 px-3">{ach.level}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={ach.is_verified ? 'success' : 'warning'}>
                        {ach.is_verified ? 'Terverifikasi' : 'Menunggu Validasi'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {!ach.is_verified ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyAchievement(ach.id)}
                        >
                          Validasi Sah
                        </Button>
                      ) : (
                        <span className="text-[11px] text-[#D15B40] font-semibold flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Selesai</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
