import React from 'react';
import { Button } from '@/components/ui/Button';
import { Extracurricular } from '@/types';

interface DetailHeroProps {
  ekskul: Extracurricular;
  isCapacityFull: boolean;
  onOpenRegister: () => void;
}

export const DetailHero: React.FC<DetailHeroProps> = ({
  ekskul,
  isCapacityFull,
  onOpenRegister,
}) => {
  return (
    <div className="bg-white border border-[#EAE6DC] rounded-lg overflow-hidden">
      <div className="h-64 sm:h-80 relative bg-[#EAE6DC]">
        <img
          src={ekskul.profile_image}
          alt={ekskul.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-white text-[#171717] text-xs font-bold">
                {ekskul.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                ekskul.registration_status === 'open' ? 'bg-[#234B36] text-white' : 'bg-[#A33D35] text-white'
              }`}>
                {ekskul.registration_status === 'open' ? 'Pendaftaran Dibuka' : 'Kuota Penuh'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">
              {ekskul.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl">
              {ekskul.short_description}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              disabled={isCapacityFull || ekskul.registration_status === 'closed'}
              onClick={onOpenRegister}
              className="shadow-sm"
            >
              {isCapacityFull ? 'Kapasitas Penuh' : 'Daftar Sekarang'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D8D4CC] border-t border-[#EAE6DC] bg-[#F9F8F6]/40 text-xs">
        <div className="p-4">
          <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Guru Pembina</span>
          <span className="font-bold text-[#171717]">{ekskul.supervisor_name}</span>
        </div>
        <div className="p-4">
          <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Ketua Ekstrakurikuler</span>
          <span className="font-bold text-[#171717]">{ekskul.chairperson_name}</span>
        </div>
        <div className="p-4">
          <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Jadwal Rutin</span>
          <span className="font-bold text-[#171717]">{ekskul.practice_schedule}</span>
        </div>
        <div className="p-4">
          <span className="block text-[11px] font-semibold text-[#68655F] uppercase mb-0.5">Kapasitas & Kuota</span>
          <span className="font-bold text-[#171717]">{ekskul.current_member_count} dari {ekskul.member_capacity} Siswa</span>
        </div>
      </div>
    </div>
  );
};
