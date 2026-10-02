import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/database';
import { getEventsAPI } from '@/lib/api';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Plus,
  Lock,
  LogIn,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Building,
  Users,
  Trophy,
  Flag,
  Sparkles,
  Info
} from 'lucide-react';
import { EventCategory, EventType, SchoolEvent } from '@/types';

interface CalendarPageProps {
  onNavigate?: (path: string) => void;
}

// Fixed dimensions for the Google Calendar-style time grid
const HOUR_HEIGHT = 64; // height in pixels per hour row
const START_HOUR = 7;   // 07:00 WIB
const END_HOUR = 18;    // 18:00 WIB
const TOTAL_HOURS = END_HOUR - START_HOUR + 1; // 12 rows (07:00 to 18:00)

export const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate }) => {
  const { currentUser, role } = useAuth();

  // Active viewing date: default to 2026-10-02 (matching application timeline)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // If today is in 2026, use today; otherwise lock to 2026-10-02 so demo seed data appears immediately
    const now = new Date();
    return now.getFullYear() === 2026 ? now : new Date('2026-10-02T10:00:00');
  });

  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<SchoolEvent | null>(null);

  // Modal create event state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('extracurricular_training');
  const [location, setLocation] = useState('Lapangan Olahraga Utama');
  const [startDate, setStartDate] = useState('2026-10-02T15:30');
  const [endDate, setEndDate] = useState('2026-10-02T17:30');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Futsal Garuda Nusantara');
  const [extracurricularId, setExtracurricularId] = useState<string>('eks-1');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // 1. Calculate active week days (Monday - Sunday)
  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay(); // 0 is Sunday, 1 is Monday
    // Calculate difference to Monday
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const days = [];
    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);

      const year = dayDate.getFullYear();
      const month = String(dayDate.getMonth() + 1).padStart(2, '0');
      const dateStr = String(dayDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${dateStr}`;

      const today = new Date();
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === dayDate.getMonth() &&
        today.getDate() === dayDate.getDate();

      days.push({
        date: dayDate,
        dateString,
        dayName: dayNames[i],
        dayNumber: dayDate.getDate(),
        isToday,
      });
    }

    return days;
  }, [currentDate]);

  // Start and end timestamp of the active week for backend SQLite query
  const weekStartStr = `${weekDays[0].dateString} 00:00:00`;
  const weekEndStr = `${weekDays[6].dateString} 23:59:59`;

  // 2. Fetch events from SQLite Backend based on Authentication status
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEventsAPI({
        start_time: weekStartStr,
        end_time: weekEndStr,
        user_id: currentUser?.id,
      });

      if (data && data.length > 0) {
        setEvents(data);
      } else {
        // Fallback to local DB client if API request is offline or empty
        const fallback = db.getSchoolEvents();
        setEvents(fallback);
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
  }, [weekStartStr, weekEndStr, currentUser?.id]);

  // Subscribe to local DB updates
  useEffect(() => {
    const unsub = db.subscribe(() => {
      fetchEvents();
    });
    return () => unsub();
  }, [weekStartStr, weekEndStr]);

  // 3. Navigation handlers
  const handlePrevWeek = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handleToday = () => {
    const now = new Date();
    // Use current date or lock to 2026-10-02 if outside 2026
    setCurrentDate(now.getFullYear() === 2026 ? now : new Date('2026-10-02T10:00:00'));
  };

  // Week range label formatting: "28 September – 4 Oktober 2026"
  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0].date;
    const end = weekDays[6].date;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
  }, [weekDays]);

  // 4. Conflict detection check
  const handleTimeLocationChange = (newLoc: string, newStart: string, newEnd: string) => {
    if (newLoc && newStart && newEnd) {
      const check = db.checkEventConflict(newLoc, newStart, newEnd);
      if (check.hasConflict && check.conflictingEvent) {
        setConflictWarning(
          `Peringatan Konflik Ruangan: "${newLoc}" telah dijadwalkan untuk "${check.conflictingEvent.title}" (${check.conflictingEvent.start_datetime.replace('T', ' ')} s/d ${check.conflictingEvent.end_datetime.replace('T', ' ')})!`
        );
      } else {
        setConflictWarning(null);
      }
    }
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const res = db.addSchoolEvent({
      title: title.trim(),
      category: category,
      event_type: category,
      location: location.trim(),
      start_datetime: startDate,
      end_datetime: endDate,
      start_time: startDate.replace('T', ' ') + ':00',
      end_time: endDate.replace('T', ' ') + ':00',
      description: description.trim(),
      organizer: organizer.trim(),
      extracurricular_id: extracurricularId || undefined,
    });

    if (!res.success) {
      setSubmitError(res.message || 'Gagal menambahkan kegiatan ke kalender');
    } else {
      setSubmitSuccess('Agenda kegiatan berhasil disimpan ke database SQLite!');
      fetchEvents();
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSubmitSuccess('');
        setTitle('');
        setDescription('');
      }, 1200);
    }
  };

  // 5. Visual styling mapping by Category
  const getCategoryStyles = (cat?: string) => {
    switch (cat) {
      case 'national_holiday':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100 hover:border-rose-400',
          borderAccent: 'border-l-4 border-l-rose-600',
          pill: 'bg-rose-100 text-rose-800 border-rose-200',
          label: 'Libur Nasional',
          icon: Flag,
        };
      case 'school_event':
        return {
          bg: 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100 hover:border-blue-400',
          borderAccent: 'border-l-4 border-l-blue-600',
          pill: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Acara Sekolah',
          icon: Building,
        };
      case 'extracurricular_training':
      case 'extracurricular_practice':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-400',
          borderAccent: 'border-l-4 border-l-emerald-600',
          pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Latihan Ekskul',
          icon: Users,
        };
      case 'competition':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400',
          borderAccent: 'border-l-4 border-l-amber-600',
          pill: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Kompetisi',
          icon: Trophy,
        };
      default:
        return {
          bg: 'bg-stone-50 border-stone-300 text-stone-900 hover:bg-stone-100',
          borderAccent: 'border-l-4 border-l-stone-600',
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
                <span className="font-bold text-sm sm:text-base text-[#171717]">Mode Kalender Publik (Tamu)</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] rounded-full border border-[#F2C9C0]">
                  Akses Terbatas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#68655F] mt-1 leading-relaxed max-w-3xl">
                Saat ini kalender hanya menampilkan <strong>Acara Resmi Sekolah</strong> dan <strong>Hari Libur Nasional</strong>. Masuk dengan akun Siswa atau Pengurus untuk melihat jadwal latihan, gladi, dan kompetisi ekskul yang Anda ikuti secara otomatis.
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
          
          {/* Left: Title & Week Range */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40]">
              <CalendarIcon className="w-4 h-4" /> Kalender Mingguan Interaktif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight mt-0.5">
              {weekRangeLabel}
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

            {/* Prev / Next Week Controls */}
            <div className="inline-flex rounded-xl border border-[#EAE6DC] bg-[#F9F8F6] p-0.5">
              <button
                onClick={handlePrevWeek}
                title="Minggu Sebelumnya"
                className="p-1.5 text-[#171717] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextWeek}
                title="Minggu Berikutnya"
                className="p-1.5 text-[#171717] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Add Event Button for privileged roles */}
            {['admin', 'pembina', 'teacher', 'guru', 'pengurus'].includes(role || '') && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
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
                Memuat jadwal SQLite...
              </span>
            ) : (
              <span>Menampilkan {filteredEvents.length} kegiatan aktif minggu ini</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Google Calendar Weekly Time Grid */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl shadow-sm overflow-hidden">
        {/* Scrollable Container */}
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            
            {/* Header: Days of the week row */}
            <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-[#EAE6DC] bg-[#F9F8F6] sticky top-0 z-20">
              {/* Time Column corner */}
              <div className="p-3 text-[11px] font-bold text-[#68655F] flex items-center justify-center border-r border-[#EAE6DC]">
                WIB
              </div>

              {/* 7 Days Columns */}
              {weekDays.map((d, index) => {
                return (
                  <div
                    key={index}
                    className={`py-3 px-2 text-center border-r last:border-r-0 border-[#EAE6DC] ${
                      d.isToday ? 'bg-[#FDEDE9]/40' : ''
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-[#68655F] uppercase tracking-wider">
                      {d.dayName}
                    </div>
                    <div className="mt-1 flex items-center justify-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 text-sm font-bold rounded-full transition-transform ${
                          d.isToday
                            ? 'bg-[#D15B40] text-white shadow-sm scale-110'
                            : 'text-[#171717] hover:bg-[#EAE6DC]'
                        }`}
                      >
                        {d.dayNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grid Body: Hours & Events */}
            <div className="relative grid grid-cols-[64px_repeat(7,1fr)] bg-white">
              
              {/* Time Labels Column (07:00 to 18:00) */}
              <div className="border-r border-[#EAE6DC] bg-[#F9F8F6]/60 select-none">
                {Array.from({ length: TOTAL_HOURS }).map((_, idx) => {
                  const hour = START_HOUR + idx;
                  const timeLabel = `${String(hour).padStart(2, '0')}.00`;
                  return (
                    <div
                      key={hour}
                      style={{ height: `${HOUR_HEIGHT}px` }}
                      className="text-[11px] font-medium text-[#8F8B82] pr-2 pt-1 text-right border-b border-[#EAE6DC]/60"
                    >
                      {timeLabel}
                    </div>
                  );
                })}
              </div>

              {/* 7 Columns for Days */}
              {weekDays.map((dayObj, dayIdx) => {
                // Find all events that take place on this date
                const dayEvents = filteredEvents.filter((ev) => {
                  const rawStart = ev.start_time || ev.start_datetime || '';
                  return rawStart.startsWith(dayObj.dateString);
                });

                return (
                  <div
                    key={dayObj.dateString}
                    className={`relative border-r last:border-r-0 border-[#EAE6DC] ${
                      dayObj.isToday ? 'bg-[#FDEDE9]/10' : ''
                    }`}
                    style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}
                  >
                    {/* Hour dividing background lines */}
                    {Array.from({ length: TOTAL_HOURS }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                        className="border-b border-[#EAE6DC]/50 hover:bg-stone-50/50 transition-colors pointer-events-none"
                      />
                    ))}

                    {/* Render Event Blocks in this day column */}
                    {dayEvents.map((ev) => {
                      const rawStart = ev.start_time || ev.start_datetime || '';
                      const rawEnd = ev.end_time || ev.end_datetime || '';

                      const startDate = new Date(rawStart.replace(' ', 'T'));
                      const endDate = new Date(rawEnd.replace(' ', 'T'));

                      const startH = startDate.getHours();
                      const startM = startDate.getMinutes();
                      const endH = endDate.getHours();
                      const endM = endDate.getMinutes();

                      // Calculate Top offset (minutes from 07:00)
                      const startMinutesFrom7 = (startH - START_HOUR) * 60 + startM;
                      const durationMinutes = Math.max(35, (endH * 60 + endM) - (startH * 60 + startM));

                      const pixelsPerMinute = HOUR_HEIGHT / 60;
                      const topPx = Math.max(2, startMinutesFrom7 * pixelsPerMinute);
                      const heightPx = Math.max(34, durationMinutes * pixelsPerMinute - 3);

                      const styles = getCategoryStyles(ev.category || ev.event_type);
                      const IconComp = styles.icon;

                      const formattedTimeRange = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} - ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEventForDetail(ev)}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                          }}
                          className={`absolute left-1 right-1 rounded-xl p-2 border shadow-xs transition-all duration-150 cursor-pointer overflow-hidden z-10 ${styles.bg} ${styles.borderAccent}`}
                        >
                          {/* Event Category Mini Badge */}
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold tracking-tight uppercase line-clamp-1 opacity-90">
                              {styles.label}
                            </span>
                            <span className="text-[10px] font-semibold opacity-75 shrink-0">
                              {formattedTimeRange}
                            </span>
                          </div>

                          {/* Event Title */}
                          <h4 className="text-xs font-bold leading-tight line-clamp-2">
                            {ev.title}
                          </h4>

                          {/* Location & Details if height allows */}
                          {heightPx >= 65 && (
                            <div className="mt-1 flex items-center gap-1 text-[11px] opacity-80 line-clamp-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </div>
                          )}

                          {heightPx >= 90 && ev.extracurricular_name && (
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-[#D15B40] truncate">
                              <Users className="w-3 h-3 shrink-0" />
                              <span className="truncate">{ev.extracurricular_name}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Event Detail Modal (When user clicks an event block) */}
      <Modal
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        title="Detail Agenda Kegiatan"
      >
        {selectedEventForDetail && (() => {
          const styles = getCategoryStyles(
            selectedEventForDetail.category || selectedEventForDetail.event_type
          );
          const IconComp = styles.icon;
          const rawStart = selectedEventForDetail.start_time || selectedEventForDetail.start_datetime || '';
          const rawEnd = selectedEventForDetail.end_time || selectedEventForDetail.end_datetime || '';

          return (
            <div className="space-y-5 text-sm">
              {/* Category & Title Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${styles.pill}`}>
                    <IconComp className="w-3.5 h-3.5" />
                    {styles.label}
                  </span>
                  {selectedEventForDetail.extracurricular_name && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                      {selectedEventForDetail.extracurricular_name}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-[#171717] leading-snug">
                  {selectedEventForDetail.title}
                </h3>
              </div>

              {/* Time & Location Meta Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9F8F6] p-4 rounded-xl border border-[#EAE6DC]">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#D15B40] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider block">Waktu Pelaksanaan</span>
                    <span className="text-xs font-bold text-[#171717] block mt-0.5">
                      {rawStart.replace('T', ' ')} s/d
                    </span>
                    <span className="text-xs text-[#68655F]">
                      {rawEnd.replace('T', ' ')} WIB
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D15B40] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-[#68655F] uppercase tracking-wider block">Lokasi / Fasilitas</span>
                    <span className="text-xs font-bold text-[#171717] block mt-0.5">
                      {selectedEventForDetail.location}
                    </span>
                    <span className="text-[11px] text-[#68655F]">
                      Penyelenggara: {selectedEventForDetail.organizer}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEventForDetail.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Deskripsi & Keterangan
                  </h4>
                  <p className="text-xs sm:text-sm text-[#525049] leading-relaxed p-3 bg-white border border-[#EAE6DC] rounded-xl">
                    {selectedEventForDetail.description}
                  </p>
                </div>
              )}

              {/* Footer action buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEventForDetail(null)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 5. Add Event Modal with Conflict Warning */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Jadwalkan Agenda Kegiatan Baru"
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs">
          {conflictWarning && (
            <div className="p-3 bg-[#E8F4F5] border border-[#E8BAB5] text-[#A33D35] rounded-xl flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{conflictWarning}</span>
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-[#FDEDE9] border border-[#F2C9C0] text-[#D15B40] rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <Input
            label="Judul Agenda / Latihan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Latihan Taktik Futsal Garuda Menjelang DBL"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Kategori Agenda"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="extracurricular_training">Latihan Rutin Ekskul</option>
              <option value="competition">Kompetisi & Pertandingan</option>
              <option value="school_event">Acara Sekolah / PORSENI</option>
              <option value="national_holiday">Hari Libur Nasional</option>
            </Select>

            <Select
              label="Lokasi / Fasilitas"
              value={location}
              onChange={(e) => {
                const newLoc = e.target.value;
                setLocation(newLoc);
                handleTimeLocationChange(newLoc, startDate, endDate);
              }}
            >
              <option value="Lapangan Olahraga Utama">Lapangan Olahraga Utama</option>
              <option value="Lapangan Basket Outdoor">Lapangan Basket Outdoor</option>
              <option value="Laboratorium Komputer RPL 1">Laboratorium Komputer RPL 1</option>
              <option value="Studio Multimedia & Alam Terbuka">Studio Multimedia & Alam Terbuka</option>
              <option value="Aula Serbaguna Lantai 3">Aula Serbaguna Lantai 3</option>
              <option value="Ruang Redaksi Jurnalistik">Ruang Redaksi Jurnalistik</option>
              <option value="Ruang Kedap Suara Musik">Ruang Kedap Suara Musik</option>
              <option value="Seluruh Area Sekolah">Seluruh Area Sekolah</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="datetime-local"
              label="Waktu Mulai"
              value={startDate}
              onChange={(e) => {
                const s = e.target.value;
                setStartDate(s);
                handleTimeLocationChange(location, s, endDate);
              }}
              required
            />
            <Input
              type="datetime-local"
              label="Waktu Selesai"
              value={endDate}
              onChange={(e) => {
                const end = e.target.value;
                setEndDate(end);
                handleTimeLocationChange(location, startDate, end);
              }}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Penyelenggara / Divisi"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="Contoh: Ekskul Futsal / OSIS"
              required
            />

            <Select
              label="Kaitkan ke Ekstrakurikuler"
              value={extracurricularId}
              onChange={(e) => setExtracurricularId(e.target.value)}
            >
              <option value="">-- Umum / Tanpa Ekskul --</option>
              <option value="eks-1">Futsal Garuda Nusantara</option>
              <option value="eks-2">Programming & Cyber Club</option>
              <option value="eks-3">Fotografi & Sinematografi</option>
              <option value="eks-4">Teater Citra Nusa</option>
              <option value="eks-5">Basket Nusantara Club</option>
            </Select>
          </div>

          <Textarea
            label="Deskripsi / Catatan Agenda"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan instruksi latihan, agenda yang dibahas, atau perlengkapan yang wajib dibawa..."
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE6DC]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" className="bg-[#D15B40] hover:bg-[#b84a32]">
              Simpan Jadwal ke Database
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
