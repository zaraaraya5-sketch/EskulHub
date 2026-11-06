import React, { useMemo } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

import { DetailHero } from '../views/DetailHero';
import { DetailContent } from '../views/DetailContent';
import { DetailSidebar } from '../views/DetailSidebar';

interface DetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  fromPath?: string;
}

export const DetailPage: React.FC<DetailPageProps> = ({ slug, onNavigate, fromPath }) => {
  const { currentUser, role } = useAuth();
  const ekskul = db.getExtracurricularBySlug(slug);

  // Contextual back navigation resolution based on where user arrived from
  const origin = useMemo(() => {
    if (fromPath) return fromPath;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get('from');
      if (fromParam) return fromParam;
    }
    return '';
  }, [fromPath]);

  const { backPath, backLabel } = useMemo(() => {
    // 1. Direct match with student browse / overview
    if (origin === '/student/ekskul' || origin === 'jelajah' || origin === 'browse') {
      return { backPath: '/student/ekskul', backLabel: 'Kembali ke Jelajah Ekskul' };
    }
    if (origin === '/student' || origin.startsWith('/student')) {
      return { backPath: origin, backLabel: 'Kembali ke Dasbor Siswa' };
    }

    // 2. Direct match with admin / pengurus / pembina dashboard
    if (origin.startsWith('/pengurus') || origin.startsWith('/pembina') || origin.startsWith('/admin')) {
      return { backPath: origin, backLabel: 'Kembali ke Dasbor' };
    }

    // 3. Generic "dashboard" keyword
    if (origin === 'dashboard') {
      const defaultDashboardPath = role === 'student' ? '/student/ekskul' : '/pengurus';
      const label = role === 'student' ? 'Kembali ke Jelajah Ekskul' : 'Kembali ke Dasbor';
      return { backPath: defaultDashboardPath, backLabel: label };
    }

    // 4. Public Home
    if (origin === '/' || origin === 'home') {
      return { backPath: '/', backLabel: 'Kembali ke Beranda' };
    }

    // 5. Public Catalog
    if (origin === '/ekskul' || origin === 'katalog' || origin === 'catalog') {
      return { backPath: '/ekskul', backLabel: 'Kembali ke Katalog Ekstrakurikuler' };
    }

    // 6. Intelligent Fallback: if user is logged in, return to their respective dashboard section
    if (currentUser && role === 'student') {
      return { backPath: '/student/ekskul', backLabel: 'Kembali ke Jelajah Ekskul' };
    }
    if (currentUser) {
      return { backPath: '/pengurus', backLabel: 'Kembali ke Dasbor' };
    }

    return { backPath: '/ekskul', backLabel: 'Kembali ke Katalog Ekstrakurikuler' };
  }, [origin, currentUser, role]);

  const handleBack = () => {
    onNavigate(backPath);
  };

  if (!ekskul) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#171717] mb-2">Ekstrakurikuler Tidak Ditemukan</h2>
        <p className="text-sm text-[#525049] mb-6">Kegiatan yang kamu cari tidak terdaftar di sistem sekolah.</p>
        <Button variant="outline" onClick={handleBack} icon={<ArrowLeft className="w-4 h-4" />}>
          {backLabel}
        </Button>
      </div>
    );
  }

  const activities = db.getActivities().filter((a) => a.extracurricular_id === ekskul.id);
  const achievements = db.getAchievements().filter((a) => a.extracurricular_id === ekskul.id);
  const isCapacityFull = ekskul.current_member_count >= ekskul.member_capacity;

  const handleGoToRegister = () => {
    onNavigate(`/ekskul/${ekskul.slug}/daftar`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back button with dynamic context-aware label and destination */}
      <div>
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#525049] hover:text-[#D15B40] transition-colors cursor-pointer select-none py-1.5 px-2.5 -ml-2.5 rounded-xl hover:bg-[#F9F8F6] active:scale-98"
          title={backLabel}
        >
          <ArrowLeft className="w-4 h-4 text-[#8C887B] group-hover:text-[#D15B40] transition-transform group-hover:-translate-x-0.5" />
          <span>{backLabel}</span>
        </button>
      </div>

      <DetailHero
        ekskul={ekskul}
        isCapacityFull={isCapacityFull}
        onOpenRegister={handleGoToRegister}
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
          onOpenRegister={handleGoToRegister}
        />
      </div>
    </div>
  );
};
