import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { School, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { User, Extracurricular, SchoolEvent, PortfolioVerification } from '@/types';
import { Button } from '@/components/ui/Button';

// Modular Sections
import { AdminOverviewSection } from '../components/admin/AdminOverviewSection';
import { AdminUserManager } from '../components/admin/AdminUserManager';
import { AdminEkskulSection } from '../components/admin/AdminEkskulSection';
import { AdminScheduleSection } from '../components/admin/AdminScheduleSection';
import { AdminVerificationSection } from '../components/admin/AdminVerificationSection';
import { AdminProfileSection } from '../components/admin/AdminProfileSection';

interface AdminDashboardPageProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const settings = db.getSettings();

  const getSectionFromPath = (path?: string) => {
    if (!path) return 'dashboard';
    if (path.includes('/students')) return 'students';
    if (path.includes('/teachers')) return 'teachers';
    if (path.includes('/pembina')) return 'pembina';
    if (path.includes('/ekskul')) return 'ekskul';
    if (path.includes('/schedule') || path.includes('/events')) return 'schedule';
    if (path.includes('/verification')) return 'verification';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeSection = getSectionFromPath(currentPath);

  const switchSection = (section: string) => {
    const pathMap: Record<string, string> = {
      dashboard: '/admin/dashboard',
      students: '/admin/students',
      teachers: '/admin/teachers',
      pembina: '/admin/pembina',
      ekskul: '/admin/ekskul',
      schedule: '/admin/schedule',
      verification: '/admin/verification',
      profile: '/admin/profile',
    };
    onNavigate(pathMap[section]);
  };

  const [users, setUsers] = useState<User[]>(() => db.getUsers());
  const [ekskuls, setEkskuls] = useState<Extracurricular[]>(() => db.getExtracurriculars());
  const [events, setEvents] = useState<SchoolEvent[]>(() => db.getSchoolEvents());
  const [verifications, setVerifications] = useState<PortfolioVerification[]>(() => db.getVerifications());
  const [registrations, setRegistrations] = useState(() => db.getRegistrations());

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const studentsList = users.filter((u) => u.role === 'student');
  const teachersList = users.filter((u) => u.role === 'guru');
  const pembinaList = users.filter((u) => u.role === 'pembina' || u.role === 'teacher');

  const openAddUserModal = (role: string) => {
    switchSection(role === 'student' ? 'students' : role === 'guru' ? 'teachers' : 'pembina');
  };

  // State lifting for modals that are needed by header shortcuts in Ekskul
  const [isAddEkskulModalOpen, setIsAddEkskulModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Page Title */}
      <div className="border-b border-[#EAE6DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#234B36] flex items-center gap-1.5 mb-1">
            <School className="w-3.5 h-3.5" />
            <span>Pusat Kendali Administrasi Kesiswaan • {settings.school_name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            {activeSection === 'dashboard' && 'Ringkasan Dasbor Kesiswaan'}
            {activeSection === 'students' && 'Kelola Data Siswa'}
            {activeSection === 'teachers' && 'Kelola Guru & Wali Kelas'}
            {activeSection === 'pembina' && 'Kelola Guru Pembina Ekstrakurikuler'}
            {activeSection === 'ekskul' && 'Master Data Ekstrakurikuler'}
            {activeSection === 'schedule' && 'Jadwal Latihan & Kalender Kegiatan'}
            {activeSection === 'verification' && 'Audit Verifikasi QR & Portofolio Sah'}
            {activeSection === 'profile' && 'Kelola Profil & Foto Administrator'}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">
            Admin: <strong>{settings.vice_principal_student_affairs}</strong> • Tahun Ajaran {settings.academic_year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('/')} icon={<ExternalLink className="w-3.5 h-3.5" />}>
            Halaman Publik
          </Button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 border shadow-xs transition-all ${
            notification.type === 'success' ? 'bg-[#E7EFEA] border-[#B7D2C2] text-[#234B36]' : 'bg-[#F9ECEB] border-[#E8BAB5] text-[#A33D35]'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Render the active section component */}
      {activeSection === 'dashboard' && (
        <AdminOverviewSection
          studentsList={studentsList}
          teachersList={teachersList}
          pembinaList={pembinaList}
          ekskuls={ekskuls}
          verifications={verifications}
          registrations={registrations}
          setRegistrations={setRegistrations}
          setEkskuls={setEkskuls}
          switchSection={switchSection}
          openAddUserModal={openAddUserModal}
          setIsAddEkskulModalOpen={() => switchSection('ekskul')}
          setIsAddEventModalOpen={() => switchSection('schedule')}
          showNotification={showNotification}
          settings={settings}
        />
      )}

      {activeSection === 'students' && (
        <AdminUserManager
          title="Daftar Seluruh Siswa Terdaftar"
          description="Kelola akun siswa, pantau status keaktifan, dan data kontak."
          roleFilters={['student']}
          themeColor="green"
          users={users}
          setUsers={setUsers}
          showNotification={showNotification}
        />
      )}

      {activeSection === 'teachers' && (
        <AdminUserManager
          title="Daftar Guru & Wali Kelas"
          description="Guru berwenang memvalidasi raport, leger capaian, dan memantau siswa binaan kelas."
          roleFilters={['guru']}
          themeColor="gold"
          users={users}
          setUsers={setUsers}
          showNotification={showNotification}
        />
      )}

      {activeSection === 'pembina' && (
        <AdminUserManager
          title="Daftar Guru Pembina Ekstrakurikuler"
          description="Guru pembina memvalidasi presensi latihan, kegiatan mingguan, dan pengajuan sertifikat kejuaraan."
          roleFilters={['pembina', 'teacher']}
          themeColor="red"
          allEkskuls={ekskuls}
          users={users}
          setUsers={setUsers}
          showNotification={showNotification}
        />
      )}

      {activeSection === 'ekskul' && (
        <AdminEkskulSection
          ekskuls={ekskuls}
          setEkskuls={setEkskuls}
          showNotification={showNotification}
          onNavigate={onNavigate}
          isAddEkskulModalOpen={isAddEkskulModalOpen}
          setIsAddEkskulModalOpen={setIsAddEkskulModalOpen}
        />
      )}

      {activeSection === 'schedule' && (
        <AdminScheduleSection
          events={events}
          setEvents={setEvents}
          showNotification={showNotification}
        />
      )}

      {activeSection === 'verification' && (
        <AdminVerificationSection
          verifications={verifications}
          setVerifications={setVerifications}
          showNotification={showNotification}
          onNavigate={onNavigate}
          settings={settings}
        />
      )}

      {activeSection === 'profile' && (
        <AdminProfileSection
          showNotification={showNotification}
          switchSection={switchSection}
          setUsers={setUsers}
        />
      )}
    </div>
  );
};
