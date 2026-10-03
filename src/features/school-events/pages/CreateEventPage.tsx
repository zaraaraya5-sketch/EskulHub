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
  Flag,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Info,
  CalendarCheck,
  Loader2,
  Pencil
} from 'lucide-react';
import { EventCategory, Extracurricular, SchoolEvent } from '@/types';

interface CreateEventPageProps {
  onNavigate?: (path: string) => void;
  editEventId?: string;
}

export const CreateEventPage: React.FC<CreateEventPageProps> = ({ onNavigate, editEventId }) => {
  const { currentUser, role } = useAuth();
  const ekskuls = useMemo(() => db.getExtracurriculars(), []);
  const isEditMode = Boolean(editEventId);

  // Determine user's assigned extracurricular if Pembina
  const pembinaEkskul = useMemo(() => {
    if (!currentUser) return null;
    return ekskuls.find(
      
      (e) =>
        e.supervisor_name === currentUser.name ||
        e.id === currentUser.extracurricular_id ||
        e.id === (currentUser as any).ekskul_id
    ) || ekskuls[0];
  }, [currentUser, ekskuls]);

  const isPengurus = role === 'pengurus';
  const isPembina = role === 'pembina' || role === 'teacher';

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>(
    isPengurus ? 'school_event' : 'extracurricular_training'
  );
  const [location, setLocation] = useState('Lapangan Olahraga Utama');
  const [startDate, setStartDate] = useState('2026-10-15T15:30');
  const [endDate, setEndDate] = useState('2026-10-15T17:30');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState(
    currentUser?.name || (isPengurus ? 'Pengurus / Kesiswaan' : 'Pembina Ekskul')
  );
  const [extracurricularId, setExtracurricularId] = useState<string>(
    isPembina && pembinaEkskul ? pembinaEkskul.id : ''
  );

  const [existingEvent, setExistingEvent] = useState<SchoolEvent | null>(null);
  const [unauthorizedError, setUnauthorizedError] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // In edit mode: load existing event and verify creator permission
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

      // Validate permission: Only creator role (or admin, or same user) can edit
      const userRole = (role || '').toLowerCase();
      const creatorRole = (ev.created_by_role || '').toLowerCase() ||
        (['extracurricular_training', 'competition'].includes(ev.category as string) ? 'pembina' : 'pengurus');

      const normUser = userRole === 'teacher' ? 'pembina' : userRole;
      const normCreator = creatorRole === 'teacher' ? 'pembina' : creatorRole;

      const isOwner = Boolean(ev.created_by_id && currentUser?.id === ev.created_by_id);
      const isRoleMatch = userRole === 'admin' || normUser === normCreator || isOwner;

      if (!isRoleMatch) {
        const labels: Record<string, string> = {
          pembina: 'Pembina Ekskul',
          pengurus: 'Pengurus Sekolah',
          student: 'Siswa',
        };
        const creatorLabel = labels[normCreator] || creatorRole;
        const userLabel = labels[normUser] || userRole;

        setUnauthorizedError(
          `Akses ditolak: Jadwal ini dibuat oleh ${creatorLabel}. Akun Anda dengan hak akses (${userLabel}) tidak memiliki izin untuk mengedit jadwal tersebut.`
        );
        return;
      }

      // Pre-fill form
      setTitle(ev.title || '');
      setCategory((ev.category || ev.event_type || 'school_event') as EventCategory);
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

  // Auto-set category options based on role if restricted in create mode
  useEffect(() => {
    if (isEditMode) return;
    if (isPengurus && !['school_event', 'national_holiday'].includes(category)) {
      setCategory('school_event');
    } else if (isPembina && !['extracurricular_training', 'competition'].includes(category)) {
      setCategory('extracurricular_training');
    }
  }, [role, isEditMode, isPengurus, isPembina, category]);

  // Real-time conflict detection check
  const checkConflict = (loc: string, start: string, end: string) => {
    if (loc && start && end) {
      const check = db.checkEventConflict(loc, start, end, editEventId);
      if (check.hasConflict && check.conflictingEvent) {
        setConflictWarning(
          `Peringatan Konflik Ruangan: "${loc}" telah dijadwalkan untuk "${check.conflictingEvent.title}" (${check.conflictingEvent.start_datetime.replace('T', ' ')} s/d ${check.conflictingEvent.end_datetime.replace('T', ' ')})!`
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

    const payload = {
      title: title.trim(),
      category: category,
      event_type: category,
      location: location.trim(),
      start_time: sTime,
      end_time: eTime,
      start_datetime: sTime,
      end_datetime: eTime,
      description: description.trim(),
      organizer: organizer.trim(),
      extracurricular_id: isPengurus ? undefined : extracurricularId || undefined,
    };

    try {
      if (isEditMode && editEventId) {
        // UPDATE MODE
        const res = await updateEventAPI(editEventId, payload, currentUser?.id);
        if (!res.success) {
          setSubmitError(res.message || 'Gagal memperbarui agenda kegiatan.');
          setIsSubmitting(false);
          return;
        }

        db.updateSchoolEvent(editEventId, payload, currentUser?.id);
        setSubmitSuccess('Perubahan agenda kegiatan berhasil disimpan!');
      } else {
        // CREATE MODE
        const res = db.addSchoolEvent(payload);
        if (!res.success) {
          setSubmitError(res.message || 'Gagal menyimpan agenda kegiatan.');
          setIsSubmitting(false);
          return;
        }

        setSubmitSuccess('Agenda kegiatan baru berhasil disimpan ke kalender sekolah!');
      }

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/calendar');
        } else {
          window.location.href = '/calendar';
        }
      }, 1000);
    } catch (err: any) {
      console.error('Error saving event:', err);
      setSubmitError('Terjadi kesalahan saat menyimpan agenda.');
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
          icon: Flag,
          label: 'Hari Libur Nasional',
        };
      case 'school_event':
        return {
          pill: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Building,
          label: 'Acara Sekolah',
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

  // Render unauthorized barrier if user tries to edit another role's schedule
  if (isEditMode && unauthorizedError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#171717]">Akses Ditolak: Tidak Memiliki Izin Edit</h2>
        <p className="text-sm text-[#68655F] max-w-md mx-auto leading-relaxed">
          {unauthorizedError}
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => (onNavigate ? onNavigate('/calendar') : (window.location.href = '/calendar'))}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali ke Kalender
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Header */}
      <div>
        <button
          onClick={() => (onNavigate ? onNavigate('/calendar') : (window.location.href = '/calendar'))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68655F] hover:text-[#D15B40] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Kalender Kegiatan
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40]">
              {isEditMode ? <Pencil className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
              {isEditMode ? 'Form Perubahan Agenda' : 'Form Penjadwalan'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight mt-0.5">
              {isEditMode ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-[#525049] mt-1 max-w-2xl">
              {isEditMode
                ? 'Perbarui rincian waktu, lokasi, atau deskripsi agenda kegiatan yang telah dijadwalkan.'
                : 'Jadwalkan agenda resmi sekolah, hari libur nasional, pertemuan rutin, atau kompetisi ekstrakurikuler ke kalender kegiatan sekolah.'}
            </p>
          </div>

          {/* User role status pill */}
          <div className="flex items-center gap-2 self-start md:self-auto px-3.5 py-2 rounded-xl bg-white border border-[#EAE6DC] shadow-2xs">
            <span className="text-2xs text-[#68655F]">Akses Akun:</span>
            <span className={`px-2 py-0.5 rounded-md font-bold text-2xs uppercase tracking-wider ${
              isPengurus
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : isPembina
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {isPengurus ? 'Pengurus' : isPembina ? 'Pembina Ekskul' : 'Administrator'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (2 Cols) + Preview (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Feedback Notifications */}
            {conflictWarning && (
              <div className="p-4 bg-[#FFF9F5] border border-[#F2C9C0] text-[#D15B40] rounded-2xl flex items-start gap-3 shadow-xs">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#D15B40]" />
                <div>
                  <strong className="block text-xs font-bold">Peringatan Bentrok Penggunaan Fasilitas</strong>
                  <span className="text-xs leading-relaxed mt-0.5 block">{conflictWarning}</span>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                <span className="text-xs font-semibold">{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-xs">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                <span className="text-xs font-semibold">{submitSuccess}</span>
              </div>
            )}

            {/* Section 1: Informasi Utama */}
            <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EAE6DC]">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EAE6DC] flex items-center justify-center text-[#D15B40]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#171717]">1. Informasi Utama Agenda</h3>
                  <p className="text-2xs text-[#68655F]">Tentukan nama kegiatan, kategori, dan pihak penanggung jawab.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Judul Kegiatan / Agenda <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Latihan Taktik Futsal Garuda Menjelang DBL 2026"
                  required
                  className="text-xs"
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
                    {isPengurus ? (
                      <>
                        <option value="school_event">Acara Sekolah / PORSENI</option>
                        <option value="national_holiday">Hari Libur Nasional</option>
                      </>
                    ) : isPembina ? (
                      <>
                        <option value="extracurricular_training">Latihan Rutin Ekskul</option>
                        <option value="competition">Kompetisi & Pertandingan</option>
                      </>
                    ) : (
                      <>
                        <option value="extracurricular_training">Latihan Rutin Ekskul</option>
                        <option value="competition">Kompetisi & Pertandingan</option>
                        <option value="school_event">Acara Sekolah / PORSENI</option>
                        <option value="national_holiday">Hari Libur Nasional</option>
                      </>
                    )}
                  </Select>
                  <span className="text-2xs text-[#68655F] mt-1 block">
                    {isPengurus
                      ? 'Role Pengurus mengelola Acara Sekolah dan Libur Nasional.'
                      : isPembina
                      ? 'Role Pembina mengelola Latihan Rutin dan Kompetisi.'
                      : 'Administrator memiliki akses ke semua kategori.'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Penyelenggara / Penanggung Jawab <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Contoh: Kesiswaan / Pembina Ekskul Futsal"
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Extracurricular binding dropdown (Hidden if Pengurus / Libur Nasional) */}
              {category !== 'national_holiday' && !isPengurus && (
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Kaitkan ke Ekstrakurikuler
                  </label>
                  <Select
                    value={extracurricularId}
                    onChange={(e) => setExtracurricularId(e.target.value)}
                  >
                    <option value="">-- Umum / Tanpa Kaitan Ekskul Spesifik --</option>
                    {ekskuls.map((ekskul) => (
                      <option key={ekskul.id} value={ekskul.id}>
                        {ekskul.name} ({ekskul.category})
                      </option>
                    ))}
                  </Select>
                  <span className="text-2xs text-[#68655F] mt-1 block">
                    Agenda latihan dan kompetisi akan otomatis muncul di kalender anggota ekskul terkait.
                  </span>
                </div>
              )}
            </div>

            {/* Section 2: Waktu & Lokasi Fasilitas */}
            <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EAE6DC]">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EAE6DC] flex items-center justify-center text-[#D15B40]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#171717]">2. Waktu Pelaksanaan & Fasilitas</h3>
                  <p className="text-2xs text-[#68655F]">Pastikan jadwal tidak bertabrakan dengan kegiatan ekstrakurikuler lain.</p>
                </div>
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
                    className="text-xs"
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
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Lokasi / Fasilitas Sekolah <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                >
                  <option value="Lapangan Olahraga Utama">Lapangan Olahraga Utama</option>
                  <option value="Lapangan Basket Outdoor">Lapangan Basket Outdoor</option>
                  <option value="Laboratorium Komputer RPL 1">Laboratorium Komputer RPL 1</option>
                  <option value="Studio Multimedia & Alam Terbuka">Studio Multimedia & Alam Terbuka</option>
                  <option value="Aula Serbaguna Lantai 3">Aula Serbaguna Lantai 3</option>
                  <option value="Ruang Redaksi Jurnalistik">Ruang Redaksi Jurnalistik</option>
                  <option value="Ruang Kedap Suara Musik">Ruang Kedap Suara Musik</option>
                  <option value="Gedung Olahraga Remaja">Gedung Olahraga Remaja</option>
                  <option value="Seluruh Area Sekolah">Seluruh Area Sekolah</option>
                </Select>
                <span className="text-2xs text-[#68655F] mt-1 block">
                  Sistem otomatis mendeteksi bentrok jika fasilitas telah dipesan pada jam yang sama.
                </span>
              </div>
            </div>

            {/* Section 3: Rincian & Deskripsi */}
            <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EAE6DC]">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EAE6DC] flex items-center justify-center text-[#D15B40]">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#171717]">3. Catatan & Instruksi Peserta</h3>
                  <p className="text-2xs text-[#68655F]">Informasi perlengkapan, tata tertib, atau gladi resik yang perlu diketahui peserta.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Deskripsi / Rincian Agenda
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Seluruh anggota diharapkan membawa sepatu futsal indoor, jersey tanding cadangan, dan berkumpul 15 menit sebelum sesi pemanasan dimulai..."
                  rows={4}
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => (onNavigate ? onNavigate('/calendar') : (window.location.href = '/calendar'))}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !title.trim()}
                icon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="w-4 h-4" />
                  )
                }
                className="bg-[#D15B40] hover:bg-[#b84a32] text-white font-semibold shadow-sm"
              >
                {isSubmitting
                  ? 'Menyimpan...'
                  : isEditMode
                  ? 'Simpan Perubahan Agenda'
                  : 'Simpan Agenda ke Kalender'}
              </Button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Card Preview & Guidelines */}
        <div className="space-y-6">
          
          {/* Live Preview Card */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Pratinjau Kalender
              </span>
              <span className="text-2xs text-[#68655F]">Live Preview</span>
            </div>

            {/* Simulated Event Card */}
            <div className="rounded-xl border border-[#EAE6DC] bg-[#FAF8F5] p-4 space-y-3 shadow-2xs">
              
              {/* Category Pill */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-bold border ${currentTheme.pill}`}>
                  <CategoryIcon className="w-3.5 h-3.5" /> {currentTheme.label}
                </span>
                <span className="text-2xs font-mono text-stone-500">2026</span>
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-[#171717] leading-snug">
                {title.trim() || 'Judul Agenda Kegiatan Anda...'}
              </h4>

              {/* Date & Time */}
              <div className="space-y-1 text-2xs text-[#68655F]">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                  <span className="font-semibold text-[#171717]">{previewDateTime.dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{previewDateTime.timeStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">Oleh: {organizer}</span>
                </div>
              </div>

              {/* Description preview */}
              {description.trim() && (
                <div className="pt-2 border-t border-[#EAE6DC]/60 text-2xs text-[#68655F] line-clamp-3 leading-relaxed italic">
                  "{description.trim()}"
                </div>
              )}
            </div>

            {/* Guidelines Box */}
            <div className="bg-[#FAF8F5] border border-[#EAE6DC] rounded-xl p-3.5 text-2xs text-[#68655F] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                <Info className="w-3.5 h-3.5 text-[#D15B40]" /> Aturan Hak Akses CRUD:
              </div>
              <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                <li>Agenda hanya dapat diedit atau dihapus oleh role yang membuatnya.</li>
                <li>Pengurus tidak memiliki akses untuk menghapus jadwal buatan Pembina.</li>
                <li>Admin sekolah memiliki hak akses pemeliharaan penuh.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
