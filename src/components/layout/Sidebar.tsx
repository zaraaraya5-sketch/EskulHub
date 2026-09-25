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

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, role, logout } = useAuth();

  const studentMenu = [
    {
      group: 'Utama',
      items: [
        { label: 'Ringkasan Dasbor', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Jelajah Ekskul', path: '/student/ekskul', icon: BookOpen },
      ]
    },
    {
      group: 'Aktivitas Saya',
      items: [
        { label: 'Status Pendaftaran', path: '/student/registrations', icon: UserCheck },
        { label: 'Presensi Kehadiran', path: '/student/attendance', icon: CheckSquare },
        { label: 'Prestasi & Organisasi', path: '/student/achievements', icon: Trophy },
      ]
    },
    {
      group: 'Administrasi',
      items: [
        { label: 'Dokumen Pendukung', path: '/student/documents', icon: FileCheck },
        { label: 'Portofolio Resmi', path: '/student/portfolio', icon: FileText },
      ]
    }
  ];

  const pengurusMenu = [
    {
      group: 'Utama',
      items: [
        { label: 'Ringkasan Operasional', path: '/pengurus/dashboard', icon: LayoutDashboard },
        { label: 'Verifikasi Pendaftaran', path: '/pengurus/registrations', icon: UserCheck },
      ]
    },
    {
      group: 'Kegiatan Latihan',
      items: [
        { label: 'Presensi Digital', path: '/pengurus/attendance', icon: CheckSquare },
        { label: 'Jadwal & Agenda', path: '/pengurus/schedule', icon: Calendar },
        { label: 'Dokumentasi Acara', path: '/pengurus/activities', icon: Layers },
      ]
    }
  ];

  const teacherMenu = [
    {
      group: 'Utama',
      items: [
        { label: 'Dasbor Pembina', path: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'Daftar Ekskul Binaan', path: '/teacher/extracurriculars', icon: BookOpen },
      ]
    },
    {
      group: 'Monitoring',
      items: [
        { label: 'Rekap Presensi', path: '/teacher/attendance', icon: CheckSquare },
        { label: 'Validasi Prestasi', path: '/teacher/achievements', icon: Trophy },
      ]
    }
  ];

  const adminMenu = [
    {
      group: 'Utama',
      items: [
        { label: 'Dasbor Ringkasan', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Kelola Profil Admin', path: '/admin/profile', icon: UserCog },
      ]
    },
    {
      group: 'Manajemen Pengguna',
      items: [
        { label: 'Data Siswa', path: '/admin/students', icon: GraduationCap },
        { label: 'Data Guru', path: '/admin/teachers', icon: Users },
        { label: 'Pembina Ekskul', path: '/admin/pembina', icon: UserCheck },
      ]
    },
    {
      group: 'Manajemen Ekskul',
      items: [
        { label: 'Katalog Ekstrakurikuler', path: '/admin/ekskul', icon: BookOpen },
        { label: 'Jadwal & Kalender', path: '/admin/schedule', icon: Calendar },
        { label: 'Verifikasi Portofolio', path: '/admin/verification', icon: ShieldCheck },
      ]
    }
  ];

  const guruMenu = [
    {
      group: 'Utama',
      items: [
        { label: 'Dasbor Wali Kelas', path: '/guru/dashboard', icon: LayoutDashboard },
        { label: 'Daftar Siswa Binaan', path: '/guru/students', icon: Users },
      ]
    },
    {
      group: 'Penilaian',
      items: [
        { label: 'Leger Nilai Karakter', path: '/guru/grades', icon: CheckSquare },
        { label: 'Verifikasi Raport', path: '/guru/verification', icon: FileText },
      ]
    }
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

  const roleBadges: Record<string, { label: string; bgClass: string; textClass: string; lightBg: string; activeNavClass: string }> = {
    student: {
      label: 'Siswa',
      bgClass: 'bg-[#234B36]', 
      textClass: 'text-[#234B36]',
      lightBg: 'bg-[#E7EFEA]',
      activeNavClass: 'bg-[#234B36] text-white shadow-md',
    },
    guru: {
      label: 'Guru Wali Kelas',
      bgClass: 'bg-[#8C6819]',
      textClass: 'text-[#8C6819]',
      lightBg: 'bg-[#F9F4E5]',
      activeNavClass: 'bg-[#8C6819] text-white shadow-md',
    },
    pembina: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#B84A3A]',
      textClass: 'text-[#B84A3A]',
      lightBg: 'bg-[#F9ECEB]',
      activeNavClass: 'bg-[#B84A3A] text-white shadow-md',
    },
    teacher: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#B84A3A]',
      textClass: 'text-[#B84A3A]',
      lightBg: 'bg-[#F9ECEB]',
      activeNavClass: 'bg-[#B84A3A] text-white shadow-md',
    },
    pengurus: {
      label: 'Pengurus Ekskul',
      bgClass: 'bg-[#4B5E28]',
      textClass: 'text-[#4B5E28]',
      lightBg: 'bg-[#EDF2E6]',
      activeNavClass: 'bg-[#4B5E28] text-white shadow-md',
    },
    admin: {
      label: 'Admin Kesiswaan',
      bgClass: 'bg-[#262522]',
      textClass: 'text-[#262522]',
      lightBg: 'bg-[#ECEAE4]',
      activeNavClass: 'bg-[#262522] text-white shadow-md',
    },
  };

  const badgeInfo = roleBadges[role] || roleBadges.student;
  const settings = db.getSettings();

  return (
    <aside className="w-72 bg-white border-r border-[#EAE6DC] shadow-sm flex flex-col shrink-0 h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div
        onClick={() => onNavigate('/')}
        className="p-5 border-b border-[#EAE6DC] flex items-center gap-4 cursor-pointer group bg-white hover:bg-[#F9F8F6] transition-colors"
        title="Kembali ke Beranda Publik"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-[#234B36] to-[#1A3A29] text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          EH
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-[#171717] group-hover:text-[#234B36] transition-colors leading-none truncate">
              EKSKUL-HUB
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#E7EFEA] text-[#234B36] shrink-0">
              {settings.academic_year}
            </span>
          </div>
          <div className="text-xs text-[#68655F] font-medium mt-1 truncate">
            {settings.school_name}
          </div>
        </div>
      </div>

      {/* User profile card */}
      <div
        onClick={() => {
          if (role === 'admin') onNavigate('/admin/profile');
        }}
        className={`p-5 border-b border-[#EAE6DC] bg-[#F9F8F6] ${
          role === 'admin'
            ? 'cursor-pointer hover:bg-[#F9F8F6] transition-colors group select-none'
            : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-full object-cover shadow-sm border border-white group-hover:border-[#234B36] transition-colors"
            />
            {role === 'admin' && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#234B36] text-white border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                ✎
              </span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-sm font-bold text-[#171717] truncate group-hover:text-[#234B36] transition-colors">
              {currentUser?.name}
            </div>
            <div className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${badgeInfo.textClass}`}>
              {badgeInfo.label}
            </div>
            <div className="text-xs text-[#68655F] truncate mt-0.5">{currentUser?.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 py-5 px-4 space-y-6 overflow-y-auto">
        {currentMenu.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#A09D96]">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path === '/admin/dashboard' && currentPath === '/admin');
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer text-left ${
                      isActive
                        ? badgeInfo.activeNavClass
                        : 'text-[#474540] hover:bg-[#F9F8F6] hover:text-[#171717]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#888681]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-[#EAE6DC] bg-white space-y-2">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#234B36] font-semibold hover:bg-[#F9F8F6] rounded-lg transition-colors cursor-pointer border border-[#EAE6DC]"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Ke Halaman Publik</span>
        </button>

        <button
          onClick={() => {
            logout();
            onNavigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#A33D35] hover:bg-[#FDF6F5] font-semibold rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#FADBD8]"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
