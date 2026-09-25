import React from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/storage/mockDatabase';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Trophy,
  FileText,
  Users,
  UserCheck,
  Calendar,
  Layers,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  GraduationCap,
  UserCog,
  FileCheck,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, role, logout } = useAuth();

  const studentMenu = [
    { label: 'Ringkasan Dasbor', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Jelajah Ekskul', path: '/student/ekskul', icon: BookOpen },
    { label: 'Status Pendaftaran', path: '/student/registrations', icon: UserCheck },
    { label: 'Presensi & Kehadiran', path: '/student/attendance', icon: CheckSquare },
    { label: 'Prestasi & Kepanitiaan', path: '/student/achievements', icon: Trophy },
    { label: 'Dokumen Pendukung', path: '/student/documents', icon: FileCheck },
    { label: 'Portofolio Resmi (PDF & QR)', path: '/student/portfolio', icon: FileText },
  ];

  const pengurusMenu = [
    { label: 'Ringkasan Dasbor Ekskul', path: '/pengurus/dashboard', icon: LayoutDashboard },
    { label: 'Verifikasi Pendaftaran', path: '/pengurus/registrations', icon: UserCheck },
    { label: 'Presensi Sesi Latihan', path: '/pengurus/attendance', icon: CheckSquare },
    { label: 'Jadwal & Agenda Latihan', path: '/pengurus/schedule', icon: Calendar },
    { label: 'Dokumentasi & Kegiatan', path: '/pengurus/activities', icon: Layers },
  ];

  const teacherMenu = [
    { label: 'Dasbor Pembina', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Ekskul Binaan', path: '/teacher/extracurriculars', icon: BookOpen },
    { label: 'Rekap Presensi Siswa', path: '/teacher/attendance', icon: CheckSquare },
    { label: 'Validasi Prestasi Masuk Portofolio', path: '/teacher/achievements', icon: Trophy },
  ];

  const adminMenu = [
    { label: 'Dasbor Ringkasan', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Kelola Siswa', path: '/admin/students', icon: GraduationCap },
    { label: 'Kelola Guru', path: '/admin/teachers', icon: Users },
    { label: 'Kelola Pembina', path: '/admin/pembina', icon: UserCheck },
    { label: 'Kelola Ekstrakurikuler', path: '/admin/ekskul', icon: BookOpen },
    { label: 'Jadwal & Kalender Latihan', path: '/admin/schedule', icon: Calendar },
    { label: 'Verifikasi QR Portofolio', path: '/admin/verification', icon: ShieldCheck },
    { label: 'Kelola Profil Admin', path: '/admin/profile', icon: UserCog },
  ];

  const guruMenu = [
    { label: 'Dasbor Guru & Wali Kelas', path: '/guru/dashboard', icon: LayoutDashboard },
    { label: 'Penilaian Karakter & Leger', path: '/guru/grades', icon: CheckSquare },
    { label: 'Daftar Siswa Binaan Kelas', path: '/guru/students', icon: Users },
    { label: 'Verifikasi Portofolio Raport', path: '/guru/verification', icon: FileText },
  ];

  const currentMenu =
    role === 'admin'
      ? adminMenu
      : role === 'guru'
      ? guruMenu
      : role === 'pembina' || role === 'teacher'
      ? teacherMenu
      : role === 'pengurus'
      ? pengurusMenu
      : studentMenu;

  // Solid institutional colors (No blue, no purple, no gradients)
  const roleBadges: Record<string, { label: string; bgClass: string; textClass: string; lightBg: string; activeNavClass: string }> = {
    student: {
      label: 'Siswa',
      bgClass: 'bg-[#234B36]', // Forest Green
      textClass: 'text-[#234B36]',
      lightBg: 'bg-[#E7EFEA]',
      activeNavClass: 'bg-[#234B36] text-white',
    },
    guru: {
      label: 'Guru Wali Kelas',
      bgClass: 'bg-[#8C6819]', // Amber Ochre
      textClass: 'text-[#8C6819]',
      lightBg: 'bg-[#F9F4E5]',
      activeNavClass: 'bg-[#8C6819] text-white',
    },
    pembina: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#B84A3A]', // Terracotta Rust
      textClass: 'text-[#B84A3A]',
      lightBg: 'bg-[#F9ECEB]',
      activeNavClass: 'bg-[#B84A3A] text-white',
    },
    teacher: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#B84A3A]', // Terracotta Rust
      textClass: 'text-[#B84A3A]',
      lightBg: 'bg-[#F9ECEB]',
      activeNavClass: 'bg-[#B84A3A] text-white',
    },
    pengurus: {
      label: 'Pengurus Ekskul',
      bgClass: 'bg-[#B84A3A]', // Terracotta Rust
      textClass: 'text-[#B84A3A]',
      lightBg: 'bg-[#F9ECEB]',
      activeNavClass: 'bg-[#B84A3A] text-white',
    },
    admin: {
      label: 'Admin Kesiswaan',
      bgClass: 'bg-[#262522]', // Charcoal Slate
      textClass: 'text-[#262522]',
      lightBg: 'bg-[#ECEAE4]',
      activeNavClass: 'bg-[#262522] text-white',
    },
  };

  const badgeInfo = roleBadges[role] || roleBadges.student;
  const settings = db.getSettings();

  return (
    <aside className="w-64 bg-white border-r border-[#D8D4CC] flex flex-col shrink-0 h-screen sticky top-0 z-30">
      {/* Brand Header (Self-contained in Dashboard mode) */}
      <div
        onClick={() => onNavigate('/')}
        className="p-4 border-b border-[#D8D4CC] flex items-center gap-3 cursor-pointer group bg-white"
        title="Kembali ke Beranda Publik"
      >
        <div className="w-9 h-9 bg-[#234B36] text-white rounded flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
          EH
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight text-[#171717] group-hover:text-[#234B36] transition-colors leading-none truncate">
              EKSKUL-HUB
            </span>
            <span className="px-1 py-0.5 rounded text-[9px] font-semibold bg-[#E7EFEA] text-[#234B36] shrink-0">
              {settings.academic_year}
            </span>
          </div>
          <div className="text-[10px] text-[#68655F] font-medium uppercase mt-0.5 truncate">
            {settings.school_name}
          </div>
        </div>
      </div>

      {/* User profile card */}
      <div
        onClick={() => {
          if (role === 'admin') onNavigate('/admin/profile');
        }}
        className={`p-3.5 border-b border-[#D8D4CC] bg-[#F5F2EA]/50 ${
          role === 'admin'
            ? 'cursor-pointer hover:bg-[#EAE6DC] transition-colors group select-none'
            : ''
        }`}
        title={role === 'admin' ? 'Klik untuk kelola profil & ganti foto' : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover border border-[#D8D4CC] group-hover:border-[#234B36] transition-colors"
            />
            {role === 'admin' && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#234B36] text-white border border-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs"
                title="Kelola Profil"
              >
                ✎
              </span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-bold text-[#171717] truncate group-hover:text-[#234B36] transition-colors">
              {currentUser?.name}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${badgeInfo.textClass}`}>
              {badgeInfo.label}
            </div>
            <div className="text-[10px] text-[#68655F] truncate">{currentUser?.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#68655F]">
          Menu Akses
        </div>
        {currentMenu.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path === '/admin/dashboard' && currentPath === '/admin');
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? badgeInfo.activeNavClass
                  : 'text-[#171717] hover:bg-[#F5F2EA] hover:text-[#234B36]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#68655F]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="p-3 border-t border-[#D8D4CC] bg-[#F5F2EA]/40 space-y-1.5">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#234B36] font-semibold hover:bg-white rounded transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat Halaman Publik</span>
        </button>

        <button
          onClick={() => {
            logout();
            onNavigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#68655F] hover:text-[#A33D35] hover:bg-white rounded transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sesi (Logout)</span>
        </button>
      </div>
    </aside>
  );
};
