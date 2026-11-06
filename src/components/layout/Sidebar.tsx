import React from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import { Logo } from '@/components/ui/Logo';
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
    },
    {
      group: 'Laporan & Rekapitulasi',
      items: [
        { label: 'Rekap Bulanan Ekskul', path: '/pembina/rekap', icon: FileText },
      ]
    }
  ];

  const pengurusMenu = [
    {
      group: 'Monitoring Utama',
      items: [
        { label: 'Dasbor Monitoring', path: '/pengurus/dashboard', icon: LayoutDashboard },
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
    },
    {
      group: 'Laporan & Rekapitulasi',
      items: [
        { label: 'Rekap Bulanan Sekolah', path: '/pengurus/rekap', icon: FileText },
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
      bgClass: 'bg-[#D15B40]',
      textClass: 'text-[#D15B40]',
      lightBg: 'bg-[#FDEDE9]',
      activeNavClass: 'bg-[#D15B40] text-white shadow-md',
    },
    teacher: {
      label: 'Guru Pembina Ekskul',
      bgClass: 'bg-[#D15B40]',
      textClass: 'text-[#D15B40]',
      lightBg: 'bg-[#FDEDE9]',
      activeNavClass: 'bg-[#D15B40] text-white shadow-md',
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
      <div className="px-5 py-4 border-b border-[#EAE6DC] bg-white hover:bg-[#F9F8F6] transition-colors select-none">
        <Logo
          size="md"
          withText
          badgeText={settings.academic_year}
          subtitle={settings.school_name}
          onClick={() => handleNavClick('/', isMobile)}
          title="Kembali ke Beranda Publik"
        />
      </div>

      {/* Navigation menu */}
      <div className="flex-1 py-4 px-3 sm:px-4 space-y-5 overflow-y-auto overscroll-contain">
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

      {/* Footer controls with user info */}
      <div className="p-3.5 sm:p-4 border-t border-[#EAE6DC] bg-white space-y-2 shrink-0">
        {currentUser && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1 bg-[#F9F8F6] rounded-xl border border-[#EAE6DC]/60">
            <div className="w-7 h-7 rounded-lg bg-[#D15B40] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#171717] truncate">{currentUser.name}</div>
              <div className="text-[10px] text-[#D15B40] font-semibold uppercase tracking-wider">{badgeInfo.label}</div>
            </div>
          </div>
        )}

        <button
          onClick={() => handleNavClick('/', isMobile)}
          className="w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 text-xs text-[#525049] hover:text-[#171717] hover:bg-[#F9F8F6] active:bg-[#F0EDE6] font-medium rounded-xl transition-colors cursor-pointer border border-[#EAE6DC] select-none"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#D15B40]" />
          <span>Ke Halaman Publik</span>
        </button>

        <button
          onClick={() => {
            logout();
            handleNavClick('/login', isMobile);
          }}
          className="w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 text-xs text-[#A33D35] hover:bg-[#FDF6F5] active:bg-[#FDECEB] font-semibold rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#FADBD8] select-none"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
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
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!isMobileOpen}
      >
        {/* Soft fade backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onCloseMobile}
          aria-hidden="true"
        />

        {/* Fluid cubic-bezier slide-in drawer from the left */}
        <aside
          className={`relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
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
    </>
  );
};
