import React, { useState, useMemo, useRef } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { ProcessConfirmModal } from '@/components/ui/ProcessConfirmModal';
import { SchoolEvent } from '@/types';
import {
  Plus,
  Trash2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
} from 'lucide-react';

interface AdminScheduleSectionProps {
  events: SchoolEvent[];
  setEvents: (data: SchoolEvent[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onNavigate?: (path: string) => void;
  initialOpenAddModal?: boolean;
}

export const AdminScheduleSection: React.FC<AdminScheduleSectionProps> = ({
  events,
  setEvents,
  showNotification,
  onNavigate,
}) => {
  const [eventToDelete, setEventToDelete] = useState<SchoolEvent | null>(null);

  // Current date setup
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  // Carousel scroll ref & state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filter ONLY events that are TODAY or in the UPCOMING DAYS (Max 10, past events filtered out!)
  const upcomingEvents = useMemo(() => {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return events
      .filter((ev) => {
        const evDate = new Date(ev.start_datetime.replace(' ', 'T')).getTime();
        return !isNaN(evDate) && evDate >= todayStart;
      })
      .sort((a, b) => new Date(a.start_datetime.replace(' ', 'T')).getTime() - new Date(b.start_datetime.replace(' ', 'T')).getTime())
      .slice(0, 10);
  }, [events, todayStr]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const cardWidth = 320;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    if (direction === 'left') {
      setCarouselIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCarouselIndex((prev) => Math.min(Math.max(0, upcomingEvents.length - 1), prev + 1));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return false;
    const res = db.deleteSchoolEvent(eventToDelete.id);
    if (res.success) {
      setEvents([...db.getSchoolEvents()]);
      showNotification('success', res.message);
      return true;
    }
    return false;
  };

  const handleOpenCreatePage = () => {
    if (onNavigate) {
      onNavigate('/pengurus/schedule/create');
    } else {
      window.location.href = '/pengurus/schedule/create';
    }
  };

  // Helper date formatter
  const formatEventDate = (datetimeStr: string) => {
    try {
      const d = new Date(datetimeStr.replace(' ', 'T'));
      const dayNum = d.getDate();
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
      const monthStr = monthNames[d.getMonth()] || 'OKT';
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = dayNames[d.getDay()];

      const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const targetTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const diffDays = Math.round((targetTime - todayTime) / (1000 * 60 * 60 * 24));

      let relativeLabel = `${diffDays} Hari Lagi`;
      let relativeBadgeClass = 'bg-[#F9F8F6] text-[#525049] border-[#EAE6DC]';

      if (diffDays === 0) {
        relativeLabel = 'HARI INI';
        relativeBadgeClass = 'bg-[#FDEDE9] text-[#D15B40] border-[#F2C9C0] font-bold';
      } else if (diffDays === 1) {
        relativeLabel = 'BESOK';
        relativeBadgeClass = 'bg-[#E7EFEA] text-[#234B36] border-[#B7D2C2] font-bold';
      } else if (diffDays === 2) {
        relativeLabel = 'LUSA';
        relativeBadgeClass = 'bg-[#F9F4E5] text-[#8C6819] border-[#E4C783] font-bold';
      }

      return { dayNum, monthStr, dayName, relativeLabel, relativeBadgeClass };
    } catch {
      return {
        dayNum: 24,
        monthStr: 'OKT',
        dayName: 'Hari Ini',
        relativeLabel: 'Mendatang',
        relativeBadgeClass: 'bg-[#F9F8F6] text-[#525049] border-[#EAE6DC]',
      };
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'practice':
      case 'extracurricular_training':
        return { label: 'Latihan Rutin', color: 'bg-[#E7EFEA] text-[#234B36] border-[#B7D2C2]' };
      case 'competition':
        return { label: 'Kejuaraan / Lomba', color: 'bg-[#F9ECEB] text-[#A33D35] border-[#E8BAB5]' };
      case 'ceremony':
      case 'school_event':
        return { label: 'Seremoni Resmi', color: 'bg-[#F9F4E5] text-[#8C6819] border-[#E4C783]' };
      case 'exhibition':
        return { label: 'Pameran & Pentas', color: 'bg-[#FDEDE9] text-[#D15B40] border-[#F2C9C0]' };
      default:
        return { label: 'Agenda Sekolah', color: 'bg-[#F9F8F6] text-[#525049] border-[#EAE6DC]' };
    }
  };

  return (
    <>
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xs font-sans">
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE6DC]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#171717]">Agenda & Kalender Kegiatan Sekolah</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                Maksimal 10 Agenda Mendatang
              </span>
            </div>
            <p className="text-xs text-[#68655F] mt-1">
              Jadwal pelaksanaan sesi latihan, pertandingan persahabatan, atau gladi resik persiapan lomba.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#F9F8F6] p-1 rounded-xl border border-[#EAE6DC]">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#525049] hover:text-[#171717] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Agenda Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#525049] hover:text-[#171717] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Agenda Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreatePage}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#D15B40] hover:bg-[#b84a32] text-white font-bold"
            >
              Jadwalkan Sesi Latihan Baru
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        {upcomingEvents.length === 0 ? (
          <div className="p-10 text-center bg-[#F9F8F6] border border-[#EAE6DC] rounded-2xl space-y-3">
            <CalendarIcon className="w-10 h-10 text-[#A09D96] mx-auto opacity-40" />
            <div>
              <p className="text-sm font-bold text-[#171717]">Belum Ada Agenda Mendatang</p>
              <p className="text-xs text-[#68655F] max-w-md mx-auto mt-1">
                Jadwal kegiatan atau latihan yang telah lewat disembunyikan secara otomatis. Klik tombol di bawah untuk menambahkan agenda baru.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreatePage}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#D15B40] hover:bg-[#b84a32] text-white font-bold"
            >
              Jadwalkan Agenda Sekarang
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {upcomingEvents.map((ev) => {
                const dateInfo = formatEventDate(ev.start_datetime);
                const catInfo = getCategoryBadge(ev.category);

                return (
                  <div
                    key={ev.id}
                    className="snap-start shrink-0 w-[290px] sm:w-[315px] bg-white border border-[#EAE6DC] hover:border-[#D15B40] rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Date Badge & Relative Timing */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#FDEDE9] to-white border border-[#F2C9C0] flex flex-col items-center justify-center text-center shadow-2xs">
                            <span className="text-[10px] font-bold text-[#D15B40] tracking-wider leading-none">
                              {dateInfo.monthStr}
                            </span>
                            <span className="text-lg font-black text-[#171717] leading-tight">
                              {dateInfo.dayNum}
                            </span>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-[#171717] block leading-none">
                              {dateInfo.dayName}
                            </span>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider border ${dateInfo.relativeBadgeClass}`}
                            >
                              {dateInfo.relativeLabel}
                            </span>
                          </div>
                        </div>

                        {/* Delete Action button */}
                        <button
                          type="button"
                          onClick={() => setEventToDelete(ev)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A09D96] hover:text-[#A33D35] hover:bg-[#F9ECEB] transition-colors cursor-pointer"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Category pill */}
                      <div className="mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-[#171717] text-sm leading-snug line-clamp-2 mb-1.5">
                        {ev.title}
                      </h3>

                      {ev.description && (
                        <p className="text-[11px] text-[#68655F] line-clamp-2 mb-3 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>

                    {/* Footer metadata */}
                    <div className="pt-3 border-t border-[#EAE6DC]/80 space-y-1.5 text-xs text-[#525049]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                        <span className="font-mono text-[11px] font-medium text-[#171717]">
                          {ev.start_datetime.substring(11, 16)} - {ev.end_datetime.substring(11, 16)} WIB
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8C6819] shrink-0" />
                        <span className="truncate text-[11px] font-medium text-[#171717]">{ev.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <Users className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                        <span className="text-[11px] font-semibold text-[#D15B40] truncate">
                          {ev.organizer}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Indicator Dots */}
            {upcomingEvents.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {upcomingEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (carouselRef.current) {
                        carouselRef.current.scrollTo({ left: i * 320, behavior: 'smooth' });
                        setCarouselIndex(i);
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      carouselIndex === i ? 'w-6 bg-[#D15B40]' : 'w-1.5 bg-[#EAE6DC] hover:bg-[#A09D96]'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Process Popup Confirmation */}
      <ProcessConfirmModal
        isOpen={eventToDelete !== null}
        onClose={() => setEventToDelete(null)}
        title="Hapus Agenda Kegiatan"
        description="Apakah Anda yakin ingin membatalkan dan menghapus agenda"
        targetName={eventToDelete?.title}
        warningNotice="Jadwal pemakaian sarana dan ruangan ini akan dibatalkan sehingga ruangan dapat dipakai kembali oleh ekstrakurikuler lain."
        confirmLabel="Hapus Jadwal"
        loadingText="Menghapus agenda..."
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
