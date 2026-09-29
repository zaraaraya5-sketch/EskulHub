import React from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Extracurricular, PortfolioVerification } from '@/types';
import {
  Users,
  BookOpen,
  Calendar,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  QrCode,
} from 'lucide-react';

interface AdminOverviewSectionProps {
  studentsList: User[];
  teachersList: User[];
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
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  studentsList,
  teachersList,
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
}) => {
  const handleApproveRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'approved', 'Drs. Bambang Suryono');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', 'Pendaftaran siswa berhasil disetujui!');
    }
  };

  const handleRejectRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'rejected', 'Drs. Bambang Suryono');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      showNotification('success', 'Pendaftaran siswa ditolak.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => switchSection('students')}
          className="bg-white border border-[#EAE6DC] rounded-lg p-4 cursor-pointer hover:border-[#234B36] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#68655F] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Siswa</span>
            <GraduationCap className="w-4 h-4 text-[#234B36]" />
          </div>
          <div className="text-2xl font-bold text-[#171717] group-hover:text-[#234B36]">{studentsList.length}</div>
          <div className="text-[11px] text-[#234B36] font-semibold mt-0.5">Kelola Siswa →</div>
        </div>

        <div
          onClick={() => switchSection('teachers')}
          className="bg-white border border-[#EAE6DC] rounded-lg p-4 cursor-pointer hover:border-[#8C6819] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#68655F] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Guru Wali Kelas</span>
            <Users className="w-4 h-4 text-[#8C6819]" />
          </div>
          <div className="text-2xl font-bold text-[#171717] group-hover:text-[#8C6819]">{teachersList.length}</div>
          <div className="text-[11px] text-[#8C6819] font-semibold mt-0.5">Kelola Guru →</div>
        </div>

        <div
          onClick={() => switchSection('pembina')}
          className="bg-white border border-[#EAE6DC] rounded-lg p-4 cursor-pointer hover:border-[#B84A3A] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#68655F] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Guru Pembina</span>
            <UserCheck className="w-4 h-4 text-[#B84A3A]" />
          </div>
          <div className="text-2xl font-bold text-[#171717] group-hover:text-[#B84A3A]">{pembinaList.length}</div>
          <div className="text-[11px] text-[#B84A3A] font-semibold mt-0.5">Kelola Pembina →</div>
        </div>

        <div
          onClick={() => switchSection('ekskul')}
          className="bg-white border border-[#EAE6DC] rounded-lg p-4 cursor-pointer hover:border-[#234B36] transition-colors group"
        >
          <div className="flex items-center justify-between text-[#68655F] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ekstrakurikuler</span>
            <BookOpen className="w-4 h-4 text-[#234B36]" />
          </div>
          <div className="text-2xl font-bold text-[#171717] group-hover:text-[#234B36]">{ekskuls.length}</div>
          <div className="text-[11px] text-[#234B36] font-semibold mt-0.5">Master Ekskul →</div>
        </div>

        <div
          onClick={() => switchSection('verification')}
          className="bg-white border border-[#EAE6DC] rounded-lg p-4 cursor-pointer hover:border-[#262522] transition-colors group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-[#68655F] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Portofolio QR</span>
            <ShieldCheck className="w-4 h-4 text-[#262522]" />
          </div>
          <div className="text-2xl font-bold text-[#171717]">{verifications.length} Sah</div>
          <div className="text-[11px] text-[#262522] font-semibold mt-0.5">Audit Dokumen →</div>
        </div>
      </div>

      {/* Quick Shortcuts Bar */}
      <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-lg p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-3">
          Aksi Cepat Administrator
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" size="sm" onClick={() => openAddUserModal('student')} icon={<GraduationCap className="w-3.5 h-3.5" />}>
            + Siswa Baru
          </Button>
          <Button variant="outline" size="sm" onClick={() => openAddUserModal('guru')} icon={<Users className="w-3.5 h-3.5" />}>
            + Guru Baru
          </Button>
          <Button variant="outline" size="sm" onClick={() => openAddUserModal('pembina')} icon={<UserCheck className="w-3.5 h-3.5" />}>
            + Pembina Baru
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsAddEkskulModalOpen(true)} icon={<BookOpen className="w-3.5 h-3.5" />}>
            + Ekstrakurikuler Baru
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsAddEventModalOpen(true)} icon={<Calendar className="w-3.5 h-3.5" />}>
            + Jadwal Latihan
          </Button>
          <Button variant="outline" size="sm" onClick={() => switchSection('verification')} icon={<QrCode className="w-3.5 h-3.5" />}>
            Audit QR Portofolio
          </Button>
        </div>
      </div>

      {/* Pending Registrations Table */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">Pendaftaran Ekskul Siswa yang Masuk</h3>
            <p className="text-xs text-[#68655F]">Verifikasi langsung persetujuan kuota masuk ekskul.</p>
          </div>
          <Badge variant="neutral">{registrations.filter((r) => r.status === 'pending').length} Menunggu</Badge>
        </div>

        {registrations.length === 0 ? (
          <p className="text-xs text-[#68655F]">Belum ada data pendaftaran.</p>
        ) : (
          <div className="divide-y divide-[#D8D4CC]">
            {registrations.slice(0, 5).map((reg) => (
              <div key={reg.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#171717]">{reg.student_name} ({reg.student_class})</div>
                  <div className="text-[11px] text-[#68655F]">
                    Mendaftar ke: <strong className="text-[#234B36]">{reg.extracurricular_name}</strong> • Alasan: &quot;{reg.reason}&quot;
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {reg.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveRegistration(reg.id)}
                        className="px-2.5 py-1 bg-[#234B36] text-white rounded font-bold hover:bg-[#1a3828] cursor-pointer"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleRejectRegistration(reg.id)}
                        className="px-2.5 py-1 bg-white border border-[#EAE6DC] text-[#A33D35] hover:bg-[#F9ECEB] rounded font-bold cursor-pointer"
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
    </div>
  );
};
