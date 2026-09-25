import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

import { DetailHero } from '../views/DetailHero';
import { DetailContent } from '../views/DetailContent';
import { DetailSidebar } from '../views/DetailSidebar';
import { DetailRegisterModal } from '../views/DetailRegisterModal';

interface DetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ slug, onNavigate }) => {
  const ekskul = db.getExtracurricularBySlug(slug);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  if (!ekskul) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#171717] mb-2">Ekstrakurikuler Tidak Ditemukan</h2>
        <p className="text-sm text-[#68655F] mb-4">Kegiatan yang Anda cari tidak terdaftar dalam pangkalan data sekolah.</p>
        <Button variant="outline" onClick={() => onNavigate('/ekskul')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const activities = db.getActivities().filter((a) => a.extracurricular_id === ekskul.id);
  const achievements = db.getAchievements().filter((a) => a.extracurricular_id === ekskul.id);
  const isCapacityFull = ekskul.current_member_count >= ekskul.member_capacity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/ekskul')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68655F] hover:text-[#234B36] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog Ekstrakurikuler</span>
        </button>
      </div>

      <DetailHero
        ekskul={ekskul}
        isCapacityFull={isCapacityFull}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <DetailContent
          ekskul={ekskul}
          achievements={achievements}
          activities={activities}
        />

        <DetailSidebar
          ekskul={ekskul}
          isCapacityFull={isCapacityFull}
          onOpenRegister={() => setIsRegisterModalOpen(true)}
        />
      </div>

      <DetailRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        ekskul={ekskul}
      />
    </div>
  );
};
