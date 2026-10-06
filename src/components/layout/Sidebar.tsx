import React from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
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
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
}) => {
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

  const pembinaMenu = [
    {
      group: 'Ekskul Binaan Saya',
      items: [
        { label: 'Dasbor Binaan', path: '/pembina/dashboard', icon: LayoutDashboard },
        { label: 'Ekskul Binaan', path: '/pembina/extracurriculars', icon: BookOpen },
      ]
    },
    {
      group: 'Pengelolaan Anggota',
      items: [
        { label: 'Pendaftaran & Anggota', path: '/pembina/members', icon: Users },
        { label: 'Presensi Latihan', path: '/pembina/attendance', icon: CheckSquare },
      ]
    },
    {
      group: 'Agenda & Prestasi',
      items: [
        { label: 'Agenda Acara & Lomba', path: '/pembina/schedule', icon: Calendar },
        { label: 'Verifikasi Prestasi Lomba', path: '/pembina/achievements', icon: Trophy },
      ]
    }
  ];

  const pengurusMenu = [
    {
      group: 'Monitoring Utama',
      items: [
        { label: 'Dasbor Monitoring', path: '/pengurus/dashboard', icon: LayoutDashboard },
        { label: 'Profil Pengurus', path: '/pengurus/profile', icon: UserCog },
      ]
    },
    {
      group: 'Pemantauan Pengguna',
      items: [
        { label: 'Monitoring Siswa', path: '/pengurus/students', icon: GraduationCap },
        { label: 'Monitoring Pembina', path: '/pengurus/pembina', icon: UserCheck },
      ]
    },
    {
      group: 'Pemantauan Ekstrakurikuler',
      items: [
        { label: 'Monitoring Seluruh Ekskul', path: '/pengurus/ekskul', icon: BookOpen },
        { label: 'Agenda & Kalender Sekolah', path: '/pengurus/schedule', icon: Calendar },
        { label: 'Verifikasi Portofolio', path: '/pengurus/verification', icon: ShieldCheck },
      ]
    }
  ];

  const currentMenu =
    role === 'pengurus'
      ? pengurusMenu
      : role === 'pembina' || role === 'teacher'
      ? pembinaMenu
      : studentMenu;

  const roleBadges: Record<string, { label: string; bgClass: string; textClass: string; lightBg: string; activeNavClass: string }> = {
    student: {
      label: 'Siswa',
      bgClass: 'bg-[#D15B40]', 
      textClass: 'text-[#D15B40]',
      lightBg: 'bg-[#FDEDE9]',
      activeNavClass: 'bg-[#D15B40] text-white shadow-md',
    },
    pembina: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#3B7A82]',
      textClass: 'text-[#3B7A82]',
      lightBg: 'bg-[#E8F4F5]',
      activeNavClass: 'bg-[#3B7A82] text-white shadow-md',
    },
    teacher: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#3B7A82]',
      textClass: 'text-[#3B7A82]',
      lightBg: 'bg-[#E8F4F5]',
      activeNavClass: 'bg-[#3B7A82] text-white shadow-md',
    },
    pengurus: {
      label: 'Pengurus (Monitoring & Koordinasi)',
      bgClass: 'bg-[#2A2926]',
      textClass: 'text-[#2A2926]',
      lightBg: 'bg-[#F5F2EB]',
      activeNavClass: 'bg-[#D15B40] text-white shadow-md',
    },
  };

  const badgeInfo = roleBadges[role] || roleBadges.student;
  const settings = db.getSettings();

  const handleNavClick = (path: string, isMobile: boolean) => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
    onNavigate(path);
  };

  const renderSidebarContent = (isMobile: boolean = false) => (
    <>
      {/* Brand Header */}
      <div
        onClick={() => handleNavClick('/', isMobile)}
        className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center gap-3 sm:gap-4 cursor-pointer group bg-white hover:bg-[#F9F8F6] transition-colors select-none"
        title="Kembali ke Beranda Publik"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-[#D15B40] to-[#A6432D] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          EH
        </div>
        <div className="overflow-hidden min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-[#171717] group-hover:text-[#D15B40] transition-colors leading-none truncate">
              EKSKUL-HUB
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#FDEDE9] text-[#D15B40] shrink-0">
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
          if (role === 'pengurus') handleNavClick('/pengurus/profile', isMobile);
        }}
        className={`p-4 sm:p-5 border-b border-[#EAE6DC] bg-[#F9F8F6] ${
          role === 'pengurus'
            ? 'cursor-pointer hover:bg-[#F9F8F6] transition-colors group select-none'
            : ''
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
              alt={currentUser?.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm border border-white group-hover:border-[#D15B40] transition-colors"
            />
            {role === 'pengurus' && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D15B40] text-white border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                ✎
              </span>
            )}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="text-sm font-bold text-[#171717] truncate group-hover:text-[#D15B40] transition-colors">
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
      <div className="flex-1 py-4 sm:py-5 px-3 sm:px-4 space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain">
        {currentMenu.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#A09D96]">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isExact = currentPath === item.path;
                const isRootAlias =
                  (item.path === '/student/dashboard' && currentPath === '/student') ||
                  (item.path === '/pembina/dashboard' && (currentPath === '/pembina' || currentPath === '/teacher' || currentPath === '/teacher/dashboard')) ||
                  (item.path === '/pengurus/dashboard' && (currentPath === '/pengurus' || currentPath === '/admin' || currentPath === '/admin/dashboard'));
                const isSubroute =
                  (item.path === '/student/documents' && currentPath.startsWith('/student/documents')) ||
                  (item.path === '/pengurus/ekskul' && (currentPath.startsWith('/pengurus/ekskul') || currentPath.startsWith('/admin/ekskul')));
                const isActive = isExact || isRootAlias || isSubroute;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path, isMobile)}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-[0.98] cursor-pointer text-left select-none ${
                      isActive
                        ? `${badgeInfo.activeNavClass} shadow-xs font-semibold`
                        : 'text-[#474540] hover:bg-[#F9F8F6] hover:text-[#171717] hover:translate-x-0.5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : 'text-[#888681] group-hover:scale-110'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer controls */}
      <div className="p-3.5 sm:p-4 border-t border-[#EAE6DC] bg-white space-y-2 shrink-0">
        <button
          onClick={() => handleNavClick('/', isMobile)}
          className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm text-[#D15B40] font-semibold hover:bg-[#F9F8F6] active:bg-[#F0EDE6] rounded-xl transition-colors cursor-pointer border border-[#EAE6DC] select-none"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>Ke Halaman Publik</span>
        </button>

        <button
          onClick={() => {
            logout();
            handleNavClick('/login', isMobile);
          }}
          className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm text-[#A33D35] hover:bg-[#FDF6F5] active:bg-[#FDECEB] font-semibold rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#FADBD8] select-none"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (hidden on mobile) */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#EAE6DC] shadow-sm flex-col shrink-0 h-screen sticky top-0 z-30">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer (Slide-Over with Backdrop for narrow screens) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header close button for drawer */}
            <div className="p-3.5 border-b border-[#EAE6DC] flex items-center justify-between bg-[#F9F8F6] shrink-0">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">Navigasi Dasbor</span>
              <button
                onClick={onCloseMobile}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#68655F] hover:text-[#171717] hover:bg-[#EAE6DC] active:bg-[#E0DDD5] transition-colors cursor-pointer"
                aria-label="Tutup menu navigasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
