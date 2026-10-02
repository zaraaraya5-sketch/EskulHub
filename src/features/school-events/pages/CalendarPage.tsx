import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/database';
import { getEventsAPI, deleteEventAPI } from '@/lib/api';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Plus,
  Lock,
  LogIn,
  Building,
  Users,
  Trophy,
  Flag,
  Sparkles,
  Info,
  X,
  FileSpreadsheet,
  Pencil,
  Trash2,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { EventCategory, EventType, SchoolEvent } from '@/types';
import { ImportExcelModal } from '../components/ImportExcelModal';

interface CalendarPageProps {
  onNavigate?: (path: string) => void;
}

// Helper: Formats YYYY-MM-DD string safely
const formatYYYYMMDD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper: Check if two dates represent the exact same calendar day
const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Helper for formatting event dates and times in clean Indonesian
const formatEventDateTime = (rawStart: string, rawEnd: string) => {
  if (!rawStart) return { dateStr: '', timeStr: '' };
  const dStart = new Date(rawStart.replace(' ', 'T'));
  const dEnd = rawEnd ? new Date(rawEnd.replace(' ', 'T')) : null;

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const dayName = dayNames[dStart.getDay()];
  const dateNum = dStart.getDate();
  const monthName = monthNames[dStart.getMonth()];
  const year = dStart.getFullYear();

  const startH = String(dStart.getHours()).padStart(2, '0');
  const startM = String(dStart.getMinutes()).padStart(2, '0');

  let timeStr = `${startH}:${startM} WIB`;
  if (dEnd) {
    const endH = String(dEnd.getHours()).padStart(2, '0');
    const endM = String(dEnd.getMinutes()).padStart(2, '0');
    timeStr = `${startH}:${startM} – ${endH}:${endM} WIB`;
  }

  const dateStr = `${dayName}, ${dateNum} ${monthName} ${year}`;
  return { dateStr, timeStr };
};

export const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate }) => {
  const { currentUser, role } = useAuth();

  // Active viewing date: default to 2026-10-02 (matching application timeline)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const now = new Date();
    return now.getFullYear() === 2026 ? now : new Date('2026-10-02T10:00:00');
  });

  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<SchoolEvent | null>(null);

  // Import Excel modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Delete event state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteEvent = async (id: string) => {
    setIsDeleting(true);
    setDeleteError('');

    // Keep snapshot for rollback if API fails
    const previousEvents = [...events];
    const targetEvent = events.find((e) => e.id === id) || selectedEventForDetail;
    const targetTitle = targetEvent?.title;
    const targetDate = (targetEvent?.start_time || targetEvent?.start_datetime)?.slice(0, 10);

    // 1. Immediate optimistic UI update: delete instantly from view
    setEvents((prev) =>
      prev.filter((e) => {
        if (e.id === id) return false;
        if (
          targetTitle &&
          e.title === targetTitle &&
          targetDate &&
          (e.start_time?.slice(0, 10) === targetDate || e.start_datetime?.slice(0, 10) === targetDate)
        ) {
          return false;
        }
        return true;
      })
    );
    setSelectedEventForDetail(null);
    setShowDeleteConfirm(false);

    try {
      const res = await deleteEventAPI(id, currentUser?.id);
      if (!res.success) {
        // Rollback optimistic state on failure
        setEvents(previousEvents);
        setDeleteError(res.message || 'Gagal menghapus agenda kegiatan.');
        setIsDeleting(false);
        return;
      }

      // 2. Synchronize local DB cache
      db.deleteSchoolEvent(id, currentUser?.id);
      if (targetTitle && targetDate) {
        db.events.setEvents(
          db.getSchoolEvents().filter((e) => {
            if (e.id === id) return false;
            if (
              e.title === targetTitle &&
              (e.start_time?.slice(0, 10) === targetDate || e.start_datetime?.slice(0, 10) === targetDate)
            ) {
              return false;
            }
            return true;
          })
        );
      }

      // 3. Silently refresh from SQLite database
      await fetchEvents();
    } catch (err: any) {
      setEvents(previousEvents);
      setDeleteError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Close detail popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEventForDetail) {
        setSelectedEventForDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEventForDetail]);

  // 1. Calculate Monthly Calendar Grid (Monday - Sunday standard)
  const monthGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week: 0 is Sun, 1 is Mon, ..., 6 is Sat
    // Convert to Monday-start index: Monday=0, Tuesday=1, ..., Sunday=6
    const firstDayWeekday = firstDayOfMonth.getDay();
    const prevMonthPadding = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const days = [];

    // Previous month trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthPadding - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dateString: formatYYYYMMDD(d),
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(d, new Date()),
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const dateObj = new Date(year, month, d);
      days.push({
        date: dateObj,
        dateString: formatYYYYMMDD(dateObj),
        dayNumber: d,
        isCurrentMonth: true,
        isToday: isSameDay(dateObj, new Date()),
      });
    }

    // Next month leading days to complete full grid row (35 or 42 cells)
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remainingCells; d++) {
      const dateObj = new Date(year, month + 1, d);
      days.push({
        date: dateObj,
        dateString: formatYYYYMMDD(dateObj),
        dayNumber: d,
        isCurrentMonth: false,
        isToday: isSameDay(dateObj, new Date()),
      });
    }

    return days;
  }, [currentDate]);

  // Active month range string for backend SQLite query
  const gridStartStr = `${monthGrid[0].dateString} 00:00:00`;
  const gridEndStr = `${monthGrid[monthGrid.length - 1].dateString} 23:59:59`;

  // 2. Fetch events from SQLite Backend (Semua role dapat melihat seluruh kegiatan yang sudah tersimpan)
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEventsAPI({
        start_time: gridStartStr,
        end_time: gridEndStr,
      });

      if (Array.isArray(data)) {
        // Sync local database store with authoritative SQLite backend records
        db.events.setEvents(data);
        setEvents(data);
      } else {
        setEvents(db.getSchoolEvents());
      }
    } catch (err) {
      console.error('Error loading calendar events:', err);
      setEvents(db.getSchoolEvents());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [gridStartStr, gridEndStr]);

  // Subscribe to local DB updates
  useEffect(() => {
    const unsub = db.subscribe(() => {
      fetchEvents();
    });
    return () => unsub();
  }, [gridStartStr, gridEndStr]);

  // 3. Month Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now.getFullYear() === 2026 ? now : new Date('2026-10-02T10:00:00'));
  };

  // Month & Year header label: "Oktober 2026"
  const monthYearLabel = useMemo(() => {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  // 4. Visual styling mapping by Category
  const getCategoryStyles = (cat?: string) => {
    switch (cat) {
      case 'national_holiday':
        return {
          chip: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100',
          dot: 'bg-rose-500',
          accentBar: 'bg-rose-500',
          pill: 'bg-rose-100 text-rose-800 border-rose-200',
          label: 'Libur Nasional',
          icon: Flag,
        };
      case 'school_event':
        return {
          chip: 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100',
          dot: 'bg-blue-500',
          accentBar: 'bg-blue-500',
          pill: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Acara Sekolah',
          icon: Building,
        };
      case 'extracurricular_training':
      case 'extracurricular_practice':
        return {
          chip: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100',
          dot: 'bg-emerald-500',
          accentBar: 'bg-emerald-500',
          pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Latihan Ekskul',
          icon: Users,
        };
      case 'competition':
        return {
          chip: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
          dot: 'bg-amber-500',
          accentBar: 'bg-amber-500',
          pill: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Kompetisi',
          icon: Trophy,
        };
      default:
        return {
          chip: 'bg-stone-50 text-stone-900 border-stone-200 hover:bg-stone-100',
          dot: 'bg-stone-500',
          accentBar: 'bg-[#D15B40]',
          pill: 'bg-stone-100 text-stone-800 border-stone-200',
          label: 'Agenda Resmi',
          icon: CalendarIcon,
        };
    }
  };

  // Filter events based on filter tab
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const cat = ev.category || ev.event_type;
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'extracurricular_training') {
        return cat === 'extracurricular_training' || cat === 'extracurricular_practice';
      }
      return cat === selectedCategory;
    });
  }, [events, selectedCategory]);

  const dayNamesHeader = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. Guest Notification Banner (Kondisi Belum Login) */}
      {!currentUser && (
        <div className="bg-[#FFF9F5] border border-[#F2C9C0] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FDEDE9] border border-[#F2C9C0] flex items-center justify-center text-[#D15B40] shrink-0 mt-0.5 sm:mt-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[#171717]">Kalender Kegiatan Terpadu</span>
              </div>
              <p className="text-xs sm:text-sm text-[#68655F] mt-1 leading-relaxed max-w-3xl">
                Menampilkan seluruh agenda resmi sekolah, hari libur nasional, jadwal latihan rutin, dan kompetisi ekstrakurikuler. Gunakan filter kategori di bawah untuk memilah jenis kegiatan.
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
      )}

      {/* 2. Calendar Top Navigation Bar */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Title & Month */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40]">
              <CalendarIcon className="w-4 h-4" /> Kalender Bulanan Interaktif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight mt-0.5">
              {monthYearLabel}
            </h1>
          </div>

          {/* Right: Actions & Nav Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Today Button */}
            <button
              onClick={handleToday}
              className="px-3.5 py-2 text-xs font-semibold text-[#171717] bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl hover:bg-[#EAE6DC] transition-colors cursor-pointer shadow-2xs"
            >
              Hari Ini
            </button>

            {/* Prev / Next Month Controls */}
            <div className="inline-flex rounded-xl border border-[#EAE6DC] bg-[#F9F8F6] p-0.5">
              <button
                onClick={handlePrevMonth}
                title="Bulan Sebelumnya"
                className="p-1.5 text-[#171717] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                title="Bulan Berikutnya"
                className="p-1.5 text-[#171717] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Import Excel Button for Guru & Pembina */}
            {['admin', 'pembina', 'teacher', 'guru'].includes(role || '') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
                icon={<FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
                className="border-emerald-300 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/80 font-medium shadow-2xs"
              >
                Import Excel
              </Button>
            )}

            {/* Add Event Button for privileged roles (Navigates to dedicated page, no popup) */}
            {['admin', 'pembina', 'teacher', 'guru', 'pengurus'].includes(role || '') && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => (onNavigate ? onNavigate('/calendar/create') : (window.location.href = '/calendar/create'))}
                icon={<Plus className="w-4 h-4" />}
                className="bg-[#D15B40] hover:bg-[#b84a32]"
              >
                Tambah Agenda
              </Button>
            )}
          </div>
        </div>

        {/* Filter Category Pills & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EAE6DC]/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#68655F] font-medium mr-1">Filter Kategori:</span>
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'school_event', label: 'Acara Sekolah', color: 'bg-blue-500' },
              { id: 'national_holiday', label: 'Hari Libur', color: 'bg-rose-500' },
              { id: 'extracurricular_training', label: 'Latihan Ekskul', color: 'bg-emerald-500' },
              { id: 'competition', label: 'Kompetisi', color: 'bg-amber-500' },
            ].map((f) => {
              const active = selectedCategory === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedCategory(f.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border ${
                    active
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-[#F9F8F6] text-[#68655F] border-[#EAE6DC] hover:text-[#171717]'
                  }`}
                >
                  {f.color && <span className={`w-2 h-2 rounded-full ${f.color}`} />}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#68655F]">
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D15B40] animate-ping" />
                Memuat data dari SQLite...
              </span>
            ) : (
              <span>Menampilkan {filteredEvents.length} agenda di bulan ini</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Monthly Calendar Grid */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Days of Week Header (Senin - Minggu) */}
        <div className="grid grid-cols-7 border-b border-[#EAE6DC] bg-[#F9F8F6]">
          {dayNamesHeader.map((name, i) => (
            <div
              key={i}
              className="py-3 text-center text-xs font-bold uppercase tracking-wider text-[#68655F] border-r last:border-r-0 border-[#EAE6DC]"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days Cells Matrix */}
        <div className="grid grid-cols-7 border-b border-[#EAE6DC] bg-white">
          {monthGrid.map((dayObj, idx) => {
            // Find events for this specific date
            const dayEvents = filteredEvents.filter((ev) => {
              const rawStart = ev.start_time || ev.start_datetime || '';
              return rawStart.startsWith(dayObj.dateString);
            });

            const maxVisible = 3;
            const visibleEvents = dayEvents.slice(0, maxVisible);
            const remainingCount = dayEvents.length - maxVisible;

            return (
              <div
                key={dayObj.dateString + idx}
                className={`min-h-[110px] sm:min-h-[125px] p-1.5 sm:p-2 border-r border-b border-[#EAE6DC] last:border-r-0 transition-colors flex flex-col justify-between ${
                  !dayObj.isCurrentMonth
                    ? 'bg-[#FAF8F5]/60 text-[#A8A49C]'
                    : dayObj.isToday
                    ? 'bg-[#FDEDE9]/15'
                    : 'bg-white hover:bg-[#F9F8F6]/50'
                }`}
              >
                {/* Cell Top: Day Number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full transition-transform ${
                      dayObj.isToday
                        ? 'bg-[#D15B40] text-white shadow-xs'
                        : dayObj.isCurrentMonth
                        ? 'text-[#171717]'
                        : 'text-[#A8A49C]'
                    }`}
                  >
                    {dayObj.dayNumber}
                  </span>

                  {dayEvents.length > 0 && dayObj.isCurrentMonth && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D15B40] sm:hidden" />
                  )}
                </div>

                {/* Cell Body: Event Chips */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {visibleEvents.map((ev) => {
                    const styles = getCategoryStyles(ev.category || ev.event_type);
                    const rawStart = ev.start_time || ev.start_datetime || '';
                    const timeMatch = rawStart.match(/\s(\d{2}:\d{2})/);
                    const timePrefix = timeMatch ? timeMatch[1] : '';

                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEventForDetail(ev)}
                        className={`w-full text-left px-1.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] leading-tight border transition-all truncate block cursor-pointer shadow-2xs ${styles.chip}`}
                        title={`${ev.title} (${timePrefix})`}
                      >
                        <span className="flex items-center gap-1 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
                          {timePrefix && (
                            <span className="font-bold opacity-75 shrink-0">
                              {timePrefix}
                            </span>
                          )}
                          <span className="font-semibold truncate">{ev.title}</span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Remaining events badge */}
                  {remainingCount > 0 && (
                    <button
                      onClick={() => setSelectedEventForDetail(dayEvents[maxVisible])}
                      className="text-[10px] font-bold text-[#D15B40] hover:underline px-1 block mt-0.5 cursor-pointer"
                    >
                      +{remainingCount} agenda lagi
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Event Detail Popover (Floating Card Quick Peek) */}
      {selectedEventForDetail && (() => {
        const styles = getCategoryStyles(
          selectedEventForDetail.category || selectedEventForDetail.event_type
        );
        const IconComp = styles.icon;
        const rawStart = selectedEventForDetail.start_time || selectedEventForDetail.start_datetime || '';
        const rawEnd = selectedEventForDetail.end_time || selectedEventForDetail.end_datetime || '';
        const { dateStr, timeStr } = formatEventDateTime(rawStart, rawEnd);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] transition-all"
            onClick={() => setSelectedEventForDetail(null)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EAE6DC] overflow-hidden my-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Top Accent Strip matching event category color */}
              <div className={`h-2 w-full ${styles.accentBar || 'bg-[#D15B40]'}`} />

              <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                {/* Header: Category Badge & Close Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${styles.pill}`}>
                      <IconComp className="w-3 h-3" />
                      {styles.label}
                    </span>
                    {selectedEventForDetail.extracurricular_name && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                        {selectedEventForDetail.extracurricular_name}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedEventForDetail(null)}
                    className="p-1 text-[#8F8B82] hover:text-[#171717] hover:bg-[#F0EDE6] rounded-lg transition-colors cursor-pointer"
                    title="Tutup (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Event Title */}
                <div>
                  <h3 className="text-lg font-bold text-[#171717] leading-snug">
                    {selectedEventForDetail.title}
                  </h3>
                </div>

                {/* Quick Info Block */}
                <div className="space-y-3 pt-1 text-xs sm:text-sm">
                  {/* Date & Time */}
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#D15B40] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#171717]">{dateStr}</div>
                      <div className="text-xs text-[#68655F] mt-0.5">{timeStr}</div>
                    </div>
                  </div>

                  {/* Location & Organizer */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D15B40] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#171717]">{selectedEventForDetail.location}</div>
                      {selectedEventForDetail.organizer && (
                        <div className="text-xs text-[#68655F] mt-0.5">
                          Penyelenggara: {selectedEventForDetail.organizer}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description (if available) */}
                  {selectedEventForDetail.description && (
                    <div className="pt-2 border-t border-[#EAE6DC]/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F8B82] mb-1">
                        Keterangan
                      </div>
                      <p className="text-xs text-[#525049] leading-relaxed bg-[#F9F8F6] p-2.5 rounded-xl border border-[#EAE6DC]">
                        {selectedEventForDetail.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Creator information & Permission Status */}
                {(() => {
                  const evCreatorRole = (selectedEventForDetail.created_by_role || '').toLowerCase();
                  const normUser = role === 'teacher' ? 'pembina' : (role || '').toLowerCase();
                  const normCreator = evCreatorRole === 'teacher' ? 'pembina' : evCreatorRole;

                  const canManage = (() => {
                    if (!currentUser || !role) return false;
                    if (role === 'admin') return true;

                    if (selectedEventForDetail.created_by_id && selectedEventForDetail.created_by_id === currentUser.id) {
                      return true;
                    }

                    if (normCreator && normCreator === normUser) {
                      return true;
                    }

                    if (!normCreator) {
                      const cat = selectedEventForDetail.category || selectedEventForDetail.event_type;
                      if (['extracurricular_training', 'competition'].includes(cat as string)) {
                        return normUser === 'pembina';
                      }
                      if (['school_event', 'national_holiday'].includes(cat as string)) {
                        return normUser === 'guru';
                      }
                    }

                    return false;
                  })();

                  const roleLabels: Record<string, string> = {
                    pembina: 'Pembina Ekskul',
                    guru: 'Guru',
                    pengurus: 'Pengurus Ekskul',
                    student: 'Siswa',
                    admin: 'Administrator',
                  };

                  const creatorLabel = roleLabels[normCreator] || (normCreator ? ucfirst(normCreator) : 'Pembina / Guru');
                  const userLabel = roleLabels[normUser] || ucfirst(normUser);

                  function ucfirst(str: string) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                  }

                  return (
                    <div className="space-y-3 pt-2 border-t border-[#EAE6DC]/80">
                      {/* Creator attribution pill */}
                      <div className="flex items-center justify-between text-2xs text-[#68655F]">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>Dibuat oleh: <strong className="text-[#171717]">{creatorLabel}</strong></span>
                        </span>
                        {canManage ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Izin Kelola Aktif
                          </span>
                        ) : currentUser ? (
                          <span className="text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                            Hanya Baca
                          </span>
                        ) : null}
                      </div>

                      {/* Explicit unauthorized explanation (e.g. Pengurus trying to edit Pembina) */}
                      {!canManage && currentUser && (
                        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2 text-2xs leading-relaxed">
                          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            Jadwal ini dibuat oleh <strong>{creatorLabel}</strong>. Akun Anda (<strong>{userLabel}</strong>) tidak memiliki izin untuk mengedit atau menghapus jadwal tersebut.
                          </span>
                        </div>
                      )}

                      {/* Error feedback if deletion was rejected */}
                      {deleteError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-2xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{deleteError}</span>
                        </div>
                      )}

                      {/* Inline Delete Confirmation */}
                      {showDeleteConfirm ? (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5">
                          <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> Konfirmasi Hapus Jadwal
                          </div>
                          <p className="text-2xs text-rose-800 leading-relaxed">
                            Apakah Anda yakin ingin menghapus agenda <strong>"{selectedEventForDetail.title}"</strong>? Jadwal akan dihapus secara permanen dari kalender dan database.
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                              disabled={isDeleting}
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(selectedEventForDetail.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Action Footer */
                        <div className="pt-2 flex items-center justify-between border-t border-[#EAE6DC]/60">
                          <div>
                            {canManage && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const id = selectedEventForDetail.id;
                                    setSelectedEventForDetail(null);
                                    if (onNavigate) {
                                      onNavigate(`/calendar/edit/${id}`);
                                    } else {
                                      window.location.href = `/calendar/edit/${id}`;
                                    }
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowDeleteConfirm(true)}
                                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedEventForDetail(null);
                              setShowDeleteConfirm(false);
                              setDeleteError('');
                            }}
                            className="px-4 py-1.5 text-xs font-semibold text-[#171717] bg-[#F9F8F6] hover:bg-[#EAE6DC] border border-[#EAE6DC] rounded-xl transition-colors cursor-pointer"
                          >
                            Tutup
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })()}


      {/* 6. Import Excel Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchEvents}
        currentUser={currentUser}
        role={role || ''}
      />
    </div>
  );
};
