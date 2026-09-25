import React from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/storage/mockDatabase';
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
      case 'guru': return '/guru/dashboard';
      case 'pembina':
      case 'teacher': return '/pembina/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'pengurus': return '/pengurus/dashboard';
      default: return '/student/dashboard';
    }
  };

  // Solid institutional badge styles
  const roleBadges: Record<string, { label: string; bgClass: string; textClass: string }> = {
    admin: { label: 'Admin', bgClass: 'bg-[#262522]', textClass: 'text-white' },
    student: { label: 'Siswa', bgClass: 'bg-[#234B36]', textClass: 'text-white' },
    guru: { label: 'Guru', bgClass: 'bg-[#8C6819]', textClass: 'text-white' },
    pembina: { label: 'Pembina', bgClass: 'bg-[#B84A3A]', textClass: 'text-white' },
    teacher: { label: 'Pembina', bgClass: 'bg-[#B84A3A]', textClass: 'text-white' },
    pengurus: { label: 'Pengurus', bgClass: 'bg-[#4B5E28]', textClass: 'text-white' },
  };

  const currentBadge = roleBadges[role] || roleBadges.student;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D8D4CC] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* School Brand Identity */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 bg-[#234B36] text-white rounded flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            EH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#171717] group-hover:text-[#234B36] transition-colors leading-none">
                EKSKUL-HUB
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2]">
                {settings.academic_year}
              </span>
            </div>
            <div className="text-[11px] text-[#68655F] font-medium tracking-wide uppercase mt-1">
              {settings.school_name}
            </div>
          </div>
        </div>

        {/* Public Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => onNavigate('/')}
            className={`transition-colors cursor-pointer py-1.5 ${
              currentPath === '/'
                ? 'text-[#234B36] border-b-2 border-[#234B36] font-bold'
                : 'text-[#68655F] hover:text-[#171717]'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('/ekskul')}
            className={`transition-colors cursor-pointer py-1.5 flex items-center gap-1.5 ${
              currentPath.startsWith('/ekskul')
                ? 'text-[#234B36] border-b-2 border-[#234B36] font-bold'
                : 'text-[#68655F] hover:text-[#171717]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#234B36]" />
            Katalog Ekstrakurikuler
          </button>
          <button
            onClick={() => onNavigate('/calendar')}
            className={`transition-colors cursor-pointer py-1.5 flex items-center gap-1.5 ${
              currentPath === '/calendar'
                ? 'text-[#234B36] border-b-2 border-[#234B36] font-bold'
                : 'text-[#68655F] hover:text-[#171717]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#234B36]" />
            Kalender Kegiatan
          </button>
          <button
            onClick={() => onNavigate('/contoh-portofolio')}
            className={`transition-colors cursor-pointer py-1.5 flex items-center gap-1.5 ${
              currentPath === '/contoh-portofolio'
                ? 'text-[#234B36] border-b-2 border-[#234B36] font-bold'
                : 'text-[#68655F] hover:text-[#171717]'
            }`}
          >
            <FileCheck className="w-4 h-4 text-[#234B36]" />
            Contoh Portofolio
          </button>
          <button
            onClick={() => onNavigate('/verify/EKH-2026-000184')}
            className={`transition-colors cursor-pointer py-1.5 flex items-center gap-1.5 ${
              currentPath.startsWith('/verify')
                ? 'text-[#234B36] border-b-2 border-[#234B36] font-bold'
                : 'text-[#68655F] hover:text-[#171717]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#234B36]" />
            Verifikasi QR
          </button>
        </nav>

        {/* Right Action: Direct Navigation to /login */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Active Role Dashboard Shortcut */}
              <button
                onClick={() => onNavigate(getDashboardPath(role))}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer ${currentBadge.bgClass}`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dasbor {currentBadge.label}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  onNavigate('/');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F5F2EA] text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] border border-[#D8D4CC] rounded text-xs font-bold transition-colors cursor-pointer"
                title="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#234B36] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#1a3828] transition-colors cursor-pointer shadow-xs border border-[#1a3828]"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk / Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
