import React, { useState, useMemo, useRef } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProcessConfirmModal } from '@/components/ui/ProcessConfirmModal';
import { SchoolEvent } from '@/types';
import {
  Plus,
  Trash2,
  Clock,
  MapPin,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

interface AdminScheduleSectionProps {
  events: SchoolEvent[];
  setEvents: (data: SchoolEvent[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  initialOpenAddModal?: boolean;
}

export const AdminScheduleSection: React.FC<AdminScheduleSectionProps> = ({
  events,
  setEvents,
  showNotification,
  initialOpenAddModal = false,
}) => {
  const ekskuls = db.getExtracurriculars();
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(initialOpenAddModal);
  const [eventToDelete, setEventToDelete] = useState<SchoolEvent | null>(null);

  // Current date setup
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  // Form states with smart defaults
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'practice' | 'competition' | 'ceremony' | 'exhibition'>('practice');
  const [eventLocation, setEventLocation] = useState('Lapangan Olahraga Utama');
  const [eventDate, setEventDate] = useState(todayStr);
  const [eventStartTime, setEventStartTime] = useState('16:00');
  const [eventEndTime, setEventEndTime] = useState('18:00');
  const [eventOrganizer, setEventOrganizer] = useState(ekskuls[0]?.name || 'Futsal');
  const [eventDescription, setEventDescription] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const checkConflict = (loc: string, date: string, start: string, end: string) => {
    if (!date || !start || !end) return;
    const startIso = `${date}T${start}:00`;
    const endIso = `${date}T${end}:00`;
    const check = db.checkEventConflict(loc, startIso, endIso);
    if (check.hasConflict && check.conflictingEvent) {
      setConflictWarning(
        `Perhatian: Ruangan "${loc}" bentrok dengan agenda "${check.conflictingEvent.title}" (${check.conflictingEvent.start_datetime.substring(11, 16)} - ${check.conflictingEvent.end_datetime.substring(11, 16)})!`
      );
    } else {
      setConflictWarning(null);
    }
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showNotification('error', 'Judul kegiatan wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const startIso = `${eventDate}T${eventStartTime}:00`;
    const endIso = `${eventDate}T${eventEndTime}:00`;

    // Force true to ensure it saves properly even if an advisory conflict exists
    const res = db.addSchoolEvent(
      {
        title: eventTitle.trim(),
        category: eventCategory,
        location: eventLocation,
        start_datetime: startIso,
        end_datetime: endIso,
        organizer: eventOrganizer,
        description: eventDescription.trim() || `Sesi latihan & kegiatan resmi ${eventOrganizer}`,
        status: 'scheduled',
      },
      true
    );

    setIsSubmitting(false);

    if (res.success) {
      setEvents([...db.getSchoolEvents()]);
      setIsAddEventModalOpen(false);
      setEventTitle('');
      setEventDescription('');
      setConflictWarning(null);
      showNotification('success', `Agenda "${eventTitle.trim()}" berhasil dijadwalkan!`);
    } else {
      showNotification('error', res.message || 'Gagal menambahkan jadwal.');
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
        return { label: 'Latihan Rutin', color: 'bg-[#E7EFEA] text-[#234B36] border-[#B7D2C2]' };
      case 'competition':
        return { label: 'Kejuaraan / Lomba', color: 'bg-[#F9ECEB] text-[#A33D35] border-[#E8BAB5]' };
      case 'ceremony':
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
            <p className="text-xs text-[#525049] mt-0.5">
              Menampilkan sesi latihan dan kegiatan penting yang akan datang atau berlangsung hari ini.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Carousel Navigation buttons */}
            <div className="flex items-center gap-1 bg-[#F9F8F6] p-1 rounded-xl border border-[#EAE6DC]">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#525049] hover:text-[#171717] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Agenda Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
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
              onClick={() => setIsAddEventModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
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
              onClick={() => setIsAddEventModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
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
                            <span className="text-lg font-black text-[#171717] leading-tight font-mono">
                              {dateInfo.dayNum}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#888681] block">
                              {dateInfo.dayName}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${dateInfo.relativeBadgeClass}`}
                            >
                              {dateInfo.relativeLabel}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setEventToDelete(ev)}
                          className="p-1.5 text-[#888681] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded-lg transition-colors cursor-pointer"
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

            {/* Dots Indicator */}
            {upcomingEvents.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
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

      {/* MODAL: TAMBAH AGENDA JADWAL LATIHAN BARU (UPGRADED WITH MODERN DESIGN & ZERO BUGS) */}
      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        title="Jadwalkan Sesi Latihan & Acara Baru"
        subtitle="Lengkapi formulir penjadwalan latihan rutin mingguan atau persiapan kejuaraan ekskul."
        maxWidth="2xl"
        icon={<CalendarIcon className="w-5 h-5 text-[#D15B40]" />}
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-5 font-sans text-xs">
          {/* Section 1: Detail Agenda */}
          <div className="p-4 rounded-2xl bg-[#F9F8F6]/60 border border-[#EAE6DC] space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-[#EAE6DC]/70">
              <Sparkles className="w-3.5 h-3.5 text-[#D15B40]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171717]">
                1. Informasi Agenda Kegiatan
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Judul Sesi Kegiatan / Latihan <span className="text-[#A33D35]">*</span>
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Contoh: Latihan Taktik & Pressing Futsal Menjelang Turnamen"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] placeholder-[#A09D96] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40] transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Kategori Agenda
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40] transition-colors"
                >
                  <option value="practice">🟢 Latihan Rutin Mingguan</option>
                  <option value="competition">🔴 Kejuaraan / Perlombaan</option>
                  <option value="exhibition">🟡 Pameran Karya / Pentas</option>
                  <option value="ceremony">🔵 Upacara / Seremoni Resmi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Ekstrakurikuler Penyelenggara
                </label>
                <select
                  value={eventOrganizer}
                  onChange={(e) => setEventOrganizer(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40] transition-colors"
                >
                  {ekskuls.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name} ({e.category})
                    </option>
                  ))}
                  <option value="Kesiswaan & OSIS">Kesiswaan & OSIS</option>
                  <option value="Pihak Luar / Mitra">Pihak Luar / Mitra</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Waktu & Lokasi Fasilitas */}
          <div className="p-4 rounded-2xl bg-[#F9F8F6]/60 border border-[#EAE6DC] space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-[#EAE6DC]/70">
              <MapPin className="w-3.5 h-3.5 text-[#234B36]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171717]">
                2. Lokasi Sarana & Jadwal Waktu
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                Pilih Fasilitas / Ruangan Sekolah <span className="text-[#A33D35]">*</span>
              </label>
              <select
                value={eventLocation}
                onChange={(e) => {
                  setEventLocation(e.target.value);
                  checkConflict(e.target.value, eventDate, eventStartTime, eventEndTime);
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40] transition-colors"
              >
                <option value="Lapangan Olahraga Utama">Lapangan Olahraga Utama</option>
                <option value="Lapangan Futsal SMKN 1 Ciomas">Lapangan Futsal SMKN 1 Ciomas</option>
                <option value="Lapangan Basket SMKN 1 Ciomas">Lapangan Basket SMKN 1 Ciomas</option>
                <option value="Lapangan Voli Outdoor">Lapangan Voli Outdoor</option>
                <option value="Aula Serbaguna Lantai 3">Aula Serbaguna Lantai 3</option>
                <option value="Ruang UKS & Area Terbuka">Ruang UKS & Area Terbuka</option>
                <option value="Masjid Al-Kautsar SMKN 1 Ciomas">Masjid Al-Kautsar SMKN 1 Ciomas</option>
                <option value="Laboratorium Komputer / Bahasa">Laboratorium Komputer / Bahasa</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Tanggal Kegiatan <span className="text-[#A33D35]">*</span>
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    checkConflict(eventLocation, e.target.value, eventStartTime, eventEndTime);
                  }}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Jam Mulai <span className="text-[#A33D35]">*</span>
                </label>
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => {
                    setEventStartTime(e.target.value);
                    checkConflict(eventLocation, eventDate, e.target.value, eventEndTime);
                  }}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Jam Selesai <span className="text-[#A33D35]">*</span>
                </label>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => {
                    setEventEndTime(e.target.value);
                    checkConflict(eventLocation, eventDate, eventStartTime, e.target.value);
                  }}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              Deskripsi Singkat / Materi Kegiatan (Opsional)
            </label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Jelaskan ringkasan materi latihan atau agenda kegiatan secara singkat..."
              rows={2}
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] placeholder-[#A09D96] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/25 focus:border-[#D15B40]"
            />
          </div>

          {/* Conflict Advisory Notice */}
          {conflictWarning && (
            <div className="p-3.5 bg-[#F9F4E5] border border-[#E4C783] rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#8C6819] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#8C6819]">Pemberitahuan Bentrok Ruangan</p>
                <p className="text-[11px] text-[#8C6819] leading-relaxed">{conflictWarning}</p>
                <p className="text-[10px] text-[#8C6819]/80 italic">
                  *Sebagai Pengurus Sekolah, Anda tetap dapat menyimpan jadwal ini jika penggunaan bersama telah disepakati.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE6DC]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddEventModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan & Jadwalkan Sekarang'}
            </Button>
          </div>
        </form>
      </Modal>

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
