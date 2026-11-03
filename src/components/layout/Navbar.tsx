import React, { useState } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import { Logo } from '@/components/ui/Logo';
import {
  BookOpen,
  Calendar,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, role, logout } = useAuth();
  const settings = db.getSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = (targetRole: UserRole) => {
    switch (targetRole) {
      case 'student': return '/student/dashboard';
      case 'pembina':
      case 'teacher': return '/pembina/dashboard';
      case 'pengurus': return '/pengurus/dashboard';
      default: return '/student/dashboard';
    }
  };

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog Ekskul', path: '/ekskul' },
    { label: 'Kalender', path: '/calendar' },
    { label: 'Verifikasi Portofolio', path: '/verify' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EAE6DC] shadow-xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* School Brand Identity */}
        <Logo
          size="md"
          withText
          badgeText={settings.academic_year}
          subtitle={settings.school_name}
          onClick={() => handleNavClick('/')}
          title="Kembali ke Beranda"
        />

        {/* Public Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#68655F]">
          {navLinks.map((link) => {
            const isActive = link.path === '/' ? currentPath === '/' : currentPath.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`relative py-1.5 transition-all duration-200 cursor-pointer hover:text-[#171717] select-none ${
                  isActive ? 'text-[#D15B40] font-bold' : ''
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D15B40] rounded-full animate-fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Active Dashboard Shortcut */}
              <button
                onClick={() => handleNavClick(getDashboardPath(role))}
                className="min-h-[40px] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#F9F8F6] hover:bg-[#EAE6DC] active:scale-[0.97] text-[#171717] text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer border border-[#EAE6DC] shadow-2xs hover:shadow-xs select-none"
              >
                <LayoutDashboard className="w-4 h-4 text-[#D15B40] shrink-0" />
                <span className="hidden sm:inline">Buka Dasbor Utama</span>
                <span className="sm:hidden font-bold">Dasbor</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  handleNavClick('/');
                }}
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center sm:gap-1.5 px-2.5 sm:px-3 py-2 bg-[#F9F8F6] text-[#68655F] hover:text-[#A33D35] hover:bg-[#FDF6F5] hover:border-[#FADBD8] active:scale-95 border border-[#EAE6DC] rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                title="Keluar dari sesi"
                aria-label="Keluar dari sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/login')}
              className="min-h-[40px] inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#171717] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#333333] active:scale-[0.97] transition-all duration-200 cursor-pointer shadow-xs select-none"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Masuk</span>
            </button>
          )}

          {/* Mobile Navigation Toggle (Labeled Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl border border-[#EAE6DC] bg-[#F9F8F6] hover:bg-[#EAE6DC] active:bg-[#E0DDD5] text-xs font-bold text-[#171717] cursor-pointer transition-colors select-none"
            aria-label={mobileMenuOpen ? 'Tutup navigasi menu' : 'Buka navigasi menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <>
                <Menu className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wide">Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#EAE6DC] flex items-center justify-between bg-[#F9F8F6]">
              <Logo size="sm" withText subtitle="Menu Navigasi" onClick={() => handleNavClick('/')} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#68655F] hover:text-[#171717] hover:bg-[#EAE6DC] active:scale-95 transition-all cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#A09D96] px-3 pb-1">
                Menu Utama
              </div>
              {navLinks.map((link) => {
                const isActive = link.path === '/' ? currentPath === '/' : currentPath.startsWith(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#FDEDE9] text-[#D15B40] font-bold border border-[#F2C9C0]/80 shadow-2xs'
                        : 'text-[#171717] hover:bg-[#F9F8F6] active:bg-[#EAE6DC]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#D15B40]" />}
                  </button>
                );
              })}

              {/* Quick Questionnaire Shortcut */}
              <div className="pt-3 border-t border-[#EAE6DC]/60 mt-3">
                <button
                  onClick={() => handleNavClick('/student/kuisioner')}
                  className="w-full min-h-[44px] flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold bg-[#E7EFEA] text-[#234B36] active:scale-[0.98] transition-all cursor-pointer border border-[#C6DDD0]"
                >
                  <Compass className="w-4 h-4 shrink-0 text-[#234B36]" />
                  <span>Tes Minat Bakat (5 Soal)</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#EAE6DC] bg-[#F9F8F6] space-y-2.5">
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleNavClick(getDashboardPath(role))}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D15B40] text-white text-xs font-bold rounded-xl shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Masuk ke Dasbor Saya</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick('/');
                    }}
                    className="w-full min-h-[40px] flex items-center justify-center gap-2 px-3 py-2 text-xs text-[#A33D35] hover:bg-[#FDF6F5] active:scale-[0.98] font-bold rounded-xl border border-transparent hover:border-[#FADBD8] transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Sesi</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#171717] text-white text-xs font-bold rounded-xl shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
