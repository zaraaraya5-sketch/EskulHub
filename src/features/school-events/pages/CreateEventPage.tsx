import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import { createEventAPI, updateEventAPI, getEventsAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Building,
  Users,
  Trophy,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Info,
  CalendarCheck,
  Loader2,
  Pencil,
} from 'lucide-react';
import { EventCategory, Extracurricular, SchoolEvent } from '@/types';

interface CreateEventPageProps {
  onNavigate?: (path: string) => void;
  editEventId?: string;
  returnPath?: string;
}

export const CreateEventPage: React.FC<CreateEventPageProps> = ({
  onNavigate,
  editEventId,
  returnPath,
}) => {
  const { currentUser, role } = useAuth();
  const ekskuls = useMemo(() => db.getExtracurriculars(), []);
  const isEditMode = Boolean(editEventId);

  // Determine user's assigned extracurricular if Pembina
  const pembinaEkskul = useMemo(() => {
    if (!currentUser) return null;
    return (
      ekskuls.find(
        (e) =>
          e.supervisor_name === currentUser.name ||
          e.id === currentUser.extracurricular_id ||
          e.id === (currentUser as any).ekskul_id
      ) || ekskuls[0]
    );
  }, [currentUser, ekskuls]);

  const isPengurus = role === 'pengurus';
  const isPembina = role === 'pembina' || role === 'teacher';

  const defaultBackPath = useMemo(() => {
    if (returnPath) return returnPath;
    if (typeof window !== 'undefined' && window.location.pathname.includes('/pengurus')) {
      return '/pengurus/schedule';
    }
    return isPengurus ? '/pengurus/schedule' : '/calendar';
  }, [returnPath, isPengurus]);

  // Smart default datetime for today afternoon
  const defaultDates = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    return {
      start: `${ymd}T15:30`,
      end: `${ymd}T17:30`,
    };
  }, []);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('extracurricular_training');
  const [location, setLocation] = useState('Lapangan Olahraga Utama');
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState(
    currentUser?.name || (isPengurus ? 'Kesiswaan & OSIS' : 'Pembina Ekskul')
  );
  const [extracurricularId, setExtracurricularId] = useState<string>(
    isPembina && pembinaEkskul ? pembinaEkskul.id : ekskuls[0]?.id || ''
  );

  const [existingEvent, setExistingEvent] = useState<SchoolEvent | null>(null);
  const [unauthorizedError, setUnauthorizedError] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Pre-fill in edit mode
  useEffect(() => {
    if (!editEventId) return;

    const loadEvent = async () => {
      let ev = db.getSchoolEvents().find((e) => e.id === editEventId);
      if (!ev) {
        const remoteEvents = await getEventsAPI();
        ev = remoteEvents.find((e) => e.id === editEventId);
      }

      if (!ev) {
        setUnauthorizedError('Agenda kegiatan tidak ditemukan dalam sistem.');
        return;
      }

      setExistingEvent(ev);

      // Validate permission: Creator or Pengurus/Admin can edit
      const userRole = (role || '').toLowerCase();
      const creatorRole = (ev.created_by_role || '').toLowerCase();
      const isOwner = Boolean(ev.created_by_id && currentUser?.id === ev.created_by_id);
      const isRoleMatch = userRole === 'admin' || userRole === 'pengurus' || isOwner;

      if (!isRoleMatch) {
        setUnauthorizedError(
          `Akses ditolak: Anda tidak memiliki izin untuk mengedit agenda kegiatan ini.`
        );
        return;
      }

      // Pre-fill form
      setTitle(ev.title || '');
      setCategory((ev.category || ev.event_type || 'extracurricular_training') as EventCategory);
      setLocation(ev.location || 'Lapangan Olahraga Utama');

      const rawStart = (ev.start_time || ev.start_datetime || '').replace(' ', 'T').slice(0, 16);
      const rawEnd = (ev.end_time || ev.end_datetime || '').replace(' ', 'T').slice(0, 16);
      if (rawStart) setStartDate(rawStart);
      if (rawEnd) setEndDate(rawEnd);

      setDescription(ev.description || '');
      setOrganizer(ev.organizer || '');
      setExtracurricularId(ev.extracurricular_id || '');
    };

    loadEvent();
  }, [editEventId, currentUser?.id, role]);

  // Real-time conflict detection check
  const checkConflict = (loc: string, start: string, end: string) => {
    if (loc && start && end) {
      const check = db.checkEventConflict(loc, start, end, editEventId);
      if (check.hasConflict && check.conflictingEvent) {
        setConflictWarning(
          `Pemberitahuan: "${loc}" terjadwal untuk kegiatan "${check.conflictingEvent.title}" pada rentang waktu yang sama.`
        );
      } else {
        setConflictWarning(null);
      }
    } else {
      setConflictWarning(null);
    }
  };

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
    checkConflict(newLoc, startDate, endDate);
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    checkConflict(location, newStart, endDate);
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    checkConflict(location, startDate, newEnd);
  };

  const selectedEkskul = useMemo(() => {
    return ekskuls.find((e) => e.id === extracurricularId);
  }, [ekskuls, extracurricularId]);

  // Preview date & time formatting
  const previewDateTime = useMemo(() => {
    if (!startDate) return { dateStr: '-', timeStr: '-' };
    const dStart = new Date(startDate);
    const dEnd = endDate ? new Date(endDate) : null;

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

    return {
      dateStr: `${dayName}, ${dateNum} ${monthName} ${year}`,
      timeStr,
    };
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    if (!title.trim()) {
      setSubmitError('Judul agenda atau sesi latihan wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setSubmitError('Waktu selesai tidak boleh lebih awal dari waktu mulai.');
      setIsSubmitting(false);
      return;
    }

    const formatDt = (dt: string) => {
      const clean = dt.replace('T', ' ').trim();
      return clean.length === 16 ? clean + ':00' : clean;
    };

    const sTime = formatDt(startDate);
    const eTime = formatDt(endDate);

    const payload: any = {
      title: title.trim(),
      category: category,
      event_type: category,
      location: location.trim(),
      start_time: sTime,
      end_time: eTime,
      start_datetime: sTime,
      end_datetime: eTime,
      description: description.trim() || `Sesi latihan & kegiatan resmi ${organizer}`,
      organizer: organizer.trim(),
      extracurricular_id: extracurricularId || undefined,
      extracurricular_name: selectedEkskul?.name || organizer.trim(),
      created_by_id: currentUser?.id,
      created_by_name: currentUser?.name,
      created_by_role: role,
      status: 'scheduled',
    };

    try {
      if (isEditMode && editEventId) {
        const res = await updateEventAPI(editEventId, payload, currentUser?.id);
        db.updateSchoolEvent(editEventId, payload, currentUser?.id);
        setSubmitSuccess('Perubahan jadwal kegiatan berhasil disimpan!');
      } else {
        const res = db.addSchoolEvent(payload, true);
        if (!res.success) {
          setSubmitError(res.message || 'Gagal menyimpan agenda kegiatan.');
          setIsSubmitting(false);
          return;
        }
        setSubmitSuccess(`Agenda "${title.trim()}" berhasil dijadwalkan!`);
      }

      setTimeout(() => {
        if (onNavigate) {
          onNavigate(defaultBackPath);
        } else {
          window.location.href = defaultBackPath;
        }
      }, 700);
    } catch (err: any) {
      console.error('Error saving event:', err);
      setSubmitError(err.message || 'Terjadi kesalahan saat menyimpan agenda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryTheme = (cat: EventCategory) => {
    switch (cat) {
      case 'national_holiday':
        return {
          pill: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: Clock,
          label: 'Hari Libur Nasional',
        };
      case 'school_event':
        return {
          pill: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Building,
          label: 'Acara Resmi Sekolah',
        };
      case 'competition':
        return {
          pill: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Trophy,
          label: 'Kompetisi & Lomba',
        };
      default:
        return {
          pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: Users,
          label: 'Latihan Rutin Ekskul',
        };
    }
  };

  const currentTheme = getCategoryTheme(category);
  const CategoryIcon = currentTheme.icon;

  if (isEditMode && unauthorizedError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#171717]">Akses Ditolak</h2>
        <p className="text-sm text-[#68655F] max-w-md mx-auto leading-relaxed">
          {unauthorizedError}
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => (onNavigate ? onNavigate(defaultBackPath) : (window.location.href = defaultBackPath))}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali ke Daftar Jadwal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <button
          onClick={() => (onNavigate ? onNavigate(defaultBackPath) : (window.location.href = defaultBackPath))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#D15B40] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Agenda Jadwal</span>
        </button>

        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40] mb-1">
                {isEditMode ? <Pencil className="w-3.5 h-3.5" /> : <CalendarCheck className="w-3.5 h-3.5" />}
                <span>{isEditMode ? 'Form Perubahan Agenda' : 'Penjadwalan Sesi Latihan & Acara'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
                {isEditMode ? 'Edit Agenda Kegiatan' : 'Jadwalkan Sesi Latihan & Acara Baru'}
              </h1>
              <p className="text-xs text-[#68655F] mt-1 max-w-2xl leading-relaxed">
                {isEditMode
                  ? 'Perbarui rincian waktu, lokasi sarana, atau instruksi agenda kegiatan yang telah dijadwalkan.'
                  : 'Lengkapi formulir penjadwalan latihan rutin mingguan, persiapan kejuaraan, atau kegiatan resmi ekstrakurikuler sekolah.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC] text-xs">
              <span className="text-[#68655F]">Akses:</span>
              <span className="font-bold text-[#171717] capitalize">
                {role === 'pengurus' ? 'Pengurus Sekolah' : role === 'pembina' ? 'Guru Pembina' : role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Feedback Banners */}
            {conflictWarning && (
              <div className="p-4 bg-[#FFF9F5] border border-[#F2C9C0] text-[#D15B40] rounded-2xl flex items-start gap-3 shadow-2xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#D15B40]" />
                <div className="space-y-0.5">
                  <strong className="block text-xs font-bold">Catatan Pemakaian Sarana</strong>
                  <span className="text-xs leading-relaxed">{conflictWarning}</span>
                  <p className="text-[11px] text-[#A6432D] italic pt-0.5">
                    *Sebagai pengurus/pembina, Anda tetap dapat menyimpan jadwal ini jika penggunaan bersama telah disetujui.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded-2xl flex items-center gap-3 shadow-2xs animate-in fade-in">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#A33D35]" />
                <span className="text-xs font-semibold">{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] rounded-2xl flex items-center gap-3 shadow-2xs animate-in fade-in">
                <CheckCircle className="w-5 h-5 shrink-0 text-[#234B36]" />
                <span className="text-xs font-bold">{submitSuccess}</span>
              </div>
            )}

            {/* Section 1: Informasi Agenda */}
            <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#EAE6DC]">
                <Sparkles className="w-4 h-4 text-[#D15B40]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  1. Informasi Agenda & Penyelenggara
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Judul Sesi Kegiatan / Latihan <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Latihan Taktik & Pressing Futsal Menjelang Turnamen DBL"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Kategori Agenda <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                  >
                    <option value="extracurricular_training">Latihan Rutin Mingguan</option>
                    <option value="competition">Kejuaraan & Kompetisi</option>
                    <option value="school_event">Acara Resmi Sekolah</option>
                    <option value="national_holiday">Hari Libur Nasional</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Ekstrakurikuler Terkait
                  </label>
                  <Select
                    value={extracurricularId}
                    onChange={(e) => {
                      setExtracurricularId(e.target.value);
                      const ek = ekskuls.find((x) => x.id === e.target.value);
                      if (ek && !isPembina) setOrganizer(ek.name);
                    }}
                  >
                    {ekskuls.map((ek) => (
                      <option key={ek.id} value={ek.id}>
                        {ek.name} ({ek.category})
                      </option>
                    ))}
                    <option value="">Kesiswaan & OSIS (Umum)</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Penanggung Jawab / Penyelenggara <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Contoh: Hendra Wijaya, S.Pd. / Kesiswaan"
                  required
                />
              </div>
            </div>

            {/* Section 2: Waktu & Lokasi Sarana */}
            <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#EAE6DC]">
                <Clock className="w-4 h-4 text-[#234B36]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  2. Lokasi Fasilitas & Jadwal Waktu
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Pilih Fasilitas / Ruangan Sekolah <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                >
                  <option value="Lapangan Futsal SMKN 1 Ciomas">Lapangan Futsal SMKN 1 Ciomas</option>
                  <option value="Lapangan Basket Outdoor SMKN 1 Ciomas">Lapangan Basket Outdoor SMKN 1 Ciomas</option>
                  <option value="Lapangan Voli Outdoor">Lapangan Voli Outdoor</option>
                  <option value="Lapangan Olahraga Utama">Lapangan Olahraga Utama</option>
                  <option value="Aula Serbaguna Lantai 3">Aula Serbaguna Lantai 3</option>
                  <option value="Ruang UKS & Area Terbuka">Ruang UKS & Area Terbuka</option>
                  <option value="Laboratorium Komputer RPL 1">Laboratorium Komputer RPL 1</option>
                  <option value="Studio Multimedia & Podcast">Studio Multimedia & Podcast</option>
                  <option value="Masjid Al-Kautsar SMKN 1 Ciomas">Masjid Al-Kautsar SMKN 1 Ciomas</option>
                  <option value="Seluruh Area Sekolah">Seluruh Area Sekolah</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Waktu Mulai <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Waktu Selesai <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Rincian & Catatan */}
            <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#EAE6DC]">
                <Info className="w-4 h-4 text-[#8C6819]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  3. Deskripsi Singkat & Rincian Materi
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Deskripsi Kegiatan / Materi Latihan (Opsional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan ringkasan materi latihan, seragam yang dikenakan, atau peralatan wajib..."
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => (onNavigate ? onNavigate(defaultBackPath) : (window.location.href = defaultBackPath))}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !title.trim()}
                icon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="w-4 h-4" />
                  )
                }
                className="w-full sm:w-auto bg-[#D15B40] hover:bg-[#b84a32] text-white font-bold shadow-xs cursor-pointer"
              >
                {isSubmitting
                  ? 'Menyimpan...'
                  : isEditMode
                  ? 'Simpan Perubahan Agenda'
                  : 'Simpan & Jadwalkan Sekarang'}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Column (Right 1 col) */}
        <div className="space-y-6">
          <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 shadow-xs space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Pratinjau Kartu Agenda
              </span>
              <span className="text-[10px] text-[#68655F]">Live Preview</span>
            </div>

            {/* Simulated Event Card */}
            <div className="rounded-2xl border border-[#EAE6DC] bg-[#FAF8F5] p-4.5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentTheme.pill}`}
                >
                  <CategoryIcon className="w-3 h-3" /> {currentTheme.label}
                </span>
                <span className="text-[10px] font-mono text-[#8C887B]">TA 2026</span>
              </div>

              <h3 className="text-sm font-bold text-[#171717] leading-snug">
                {title.trim() || 'Judul Agenda Kegiatan / Latihan...'}
              </h3>

              <div className="space-y-1.5 text-xs text-[#525049]">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                  <span className="font-semibold text-[#171717]">{previewDateTime.dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                  <span className="font-mono text-[11px]">{previewDateTime.timeStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6819] shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#5046E5] shrink-0" />
                  <span className="truncate font-semibold text-[#5046E5]">{organizer}</span>
                </div>
              </div>

              {description.trim() && (
                <p className="pt-2 border-t border-[#EAE6DC]/60 text-[11px] text-[#68655F] line-clamp-3 italic">
                  &quot;{description.trim()}&quot;
                </p>
              )}
            </div>

            {/* Helper Tips */}
            <div className="bg-[#FAF8F5] border border-[#EAE6DC] rounded-xl p-3.5 text-[11px] text-[#68655F] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                <Info className="w-3.5 h-3.5 text-[#D15B40]" /> Panduan Penjadwalan:
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Jadwal yang berhasil disimpan otomatis masuk ke carousel agenda sekolah.</li>
                <li>Pemberitahuan bentrok sarana bersifat advisori dan tidak menghalangi penyimpanan.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
