import React from 'react';
import { Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GuestNotificationBannerProps {
  onNavigate?: (path: string) => void;
}

export const GuestNotificationBanner: React.FC<GuestNotificationBannerProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FFF9F5] border border-[#F2C9C0] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#FDEDE9] border border-[#F2C9C0] flex items-center justify-center text-[#D15B40] shrink-0 mt-0.5 sm:mt-0">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[#171717]">Jadwal & Agenda Sekolah</span>
          </div>
          <p className="text-xs sm:text-sm text-[#525049] mt-1 leading-relaxed max-w-3xl">
            Lihat jadwal latihan ekskul, acara sekolah, dan hari libur. Masuk ke akunmu jika ingin menambah atau mengelola agenda.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => (onNavigate ? onNavigate('/login') : (window.location.href = '/login'))}
        icon={<LogIn className="w-4 h-4" />}
        className="shrink-0 bg-[#D15B40] hover:bg-[#b84a32] text-white shadow-sm self-start md:self-auto"
      >
        Masuk ke Portal
      </Button>
    </div>
  );
};
