import React from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import {
  BookOpen,
  Calendar,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, role, logout } = useAuth();
  const settings = db.getSettings();

  const getDashboardPath = (targetRole: UserRole) => {
    switch (targetRole) {
      case 'student': return '/student/dashboard';
      case 'pembina':
      case 'teacher': return '/pembina/dashboard';
      case 'pengurus': return '/pengurus/dashboard';
      default: return '/student/dashboard';
    }
  };

  // Solid institutional badge styles
  const roleBadges: Record<string, { label: string; bgClass: string; textClass: string }> = {
    student: { label: 'Siswa', bgClass: 'bg-[#D15B40]', textClass: 'text-white' },
    pembina: { label: 'Pembina Ekskul', bgClass: 'bg-[#3B7A82]', textClass: 'text-white' },
    teacher: { label: 'Pembina Ekskul', bgClass: 'bg-[#3B7A82]', textClass: 'text-white' },
    pengurus: { label: 'Pengurus (Monitoring)', bgClass: 'bg-[#2A2926]', textClass: 'text-white' },
  };

  const currentBadge = roleBadges[role] || roleBadges.student;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EAE6DC] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* School Brand Identity */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 bg-[#D15B40] text-white rounded flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            EH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#171717] group-hover:text-[#D15B40] transition-colors leading-none">
                EKSKUL-HUB
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                {settings.academic_year}
              </span>
            </div>
            <div className="text-[11px] text-[#68655F] font-medium tracking-wide uppercase mt-1">
              {settings.school_name}
            </div>
          </div>
        </div>

        {/* Public Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#68655F]">
          <button
            onClick={() => onNavigate('/')}
            className={`relative py-1.5 transition-all duration-200 cursor-pointer hover:text-[#171717] ${
              currentPath === '/' ? 'text-[#D15B40] font-bold' : ''
            }`}
          >
            <span>Beranda</span>
            {currentPath === '/' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D15B40] rounded-full animate-fade-in" />
            )}
          </button>

          <button
            onClick={() => onNavigate('/ekskul')}
            className={`relative py-1.5 transition-all duration-200 cursor-pointer hover:text-[#171717] ${
              currentPath.startsWith('/ekskul') ? 'text-[#D15B40] font-bold' : ''
            }`}
          >
            <span>Katalog Ekskul</span>
            {currentPath.startsWith('/ekskul') && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D15B40] rounded-full animate-fade-in" />
            )}
          </button>

          <button
            onClick={() => onNavigate('/calendar')}
            className={`relative py-1.5 transition-all duration-200 cursor-pointer hover:text-[#171717] ${
              currentPath.startsWith('/calendar') ? 'text-[#D15B40] font-bold' : ''
            }`}
          >
            <span>Kalender</span>
            {currentPath.startsWith('/calendar') && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D15B40] rounded-full animate-fade-in" />
            )}
          </button>

          <button
            onClick={() => onNavigate('/verify')}
            className={`relative py-1.5 transition-all duration-200 cursor-pointer hover:text-[#171717] ${
              currentPath.startsWith('/verify') ? 'text-[#D15B40] font-bold' : ''
            }`}
          >
            <span>Verifikasi Portofolio</span>
            {currentPath.startsWith('/verify') && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D15B40] rounded-full animate-fade-in" />
            )}
          </button>
        </nav>

        {/* Right Action: Direct Navigation to /login */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Active Dashboard Shortcut */}
              <button
                onClick={() => onNavigate(getDashboardPath(role))}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9F8F6] hover:bg-[#EAE6DC] active:scale-[0.97] text-[#171717] text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer border border-[#EAE6DC] shadow-2xs hover:shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-[#D15B40]" />
                <span>Buka Dasbor Utama</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  onNavigate('/');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F9F8F6] text-[#68655F] hover:text-[#A33D35] hover:bg-[#FDF6F5] hover:border-[#FADBD8] active:scale-95 border border-[#EAE6DC] rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                title="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-white text-sm font-bold rounded-xl hover:bg-[#333333] active:scale-[0.97] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sistem</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
