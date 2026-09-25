import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Calendar as CalendarIcon, MapPin, Clock, AlertTriangle, Plus, CheckCircle, ShieldAlert } from 'lucide-react';
import { EventType, SchoolEvent } from '@/types';

interface CalendarPageProps {
  onNavigate?: (path: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = () => {
  const { role } = useAuth();
  const [events, setEvents] = useState<SchoolEvent[]>(() => db.getSchoolEvents());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('extracurricular_practice');
  const [location, setLocation] = useState('Lapangan Olahraga Utama');
  const [startDate, setStartDate] = useState('2026-09-26T15:30');
  const [endDate, setEndDate] = useState('2026-09-26T17:30');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Ekskul Futsal');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Live conflict check on location or time change
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

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const res = db.addSchoolEvent({
      title: title.trim(),
      event_type: eventType,
      location: location.trim(),
      start_datetime: startDate,
      end_datetime: endDate,
      description: description.trim(),
      organizer: organizer.trim(),
    });

    if (!res.success) {
      setSubmitError(res.message || 'Gagal menambahkan kegiatan ke kalender');
    } else {
      setSubmitSuccess('Agenda kegiatan berhasil ditambahkan ke kalender terpusat!');
      setEvents(db.getSchoolEvents());
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSubmitSuccess('');
        setTitle('');
        setDescription('');
      }, 1200);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedType === 'all') return true;
    return ev.event_type === selectedType;
  });

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'competition': return <Badge variant="warning">Kompetisi</Badge>;
      case 'extracurricular_practice': return <Badge variant="success">Latihan Rutin</Badge>;
      case 'school_event': return <Badge variant="info">Acara Sekolah</Badge>;
      case 'committee_event': return <Badge variant="neutral">Kepanitiaan</Badge>;
      default: return <Badge variant="neutral">Agenda Resmi</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D4CC] pb-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
            Kalender Kegiatan & Fasilitas Terpusat
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717]">
            Jadwal Latihan, Kompetisi, dan Agenda Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-[#68655F] mt-1">
            Mencegah bentrok penggunaan ruangan, lapangan olahraga, dan laboratorium antar-ekstrakurikuler secara terpadu.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Tambah Agenda Baru
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#D8D4CC] rounded-lg p-3 flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer border ${
            selectedType === 'all'
              ? 'bg-[#234B36] text-white border-[#234B36]'
              : 'bg-[#F5F2EA] text-[#171717] border-[#D8D4CC] hover:bg-[#EAE6DC]'
          }`}
        >
          Semua Kategori ({events.length})
        </button>
        <button
          onClick={() => setSelectedType('extracurricular_practice')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer border ${
            selectedType === 'extracurricular_practice'
              ? 'bg-[#234B36] text-white border-[#234B36]'
              : 'bg-[#F5F2EA] text-[#171717] border-[#D8D4CC] hover:bg-[#EAE6DC]'
          }`}
        >
          Latihan Rutin
        </button>
        <button
          onClick={() => setSelectedType('competition')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer border ${
            selectedType === 'competition'
              ? 'bg-[#234B36] text-white border-[#234B36]'
              : 'bg-[#F5F2EA] text-[#171717] border-[#D8D4CC] hover:bg-[#EAE6DC]'
          }`}
        >
          Kompetisi & Kejuaraan
        </button>
        <button
          onClick={() => setSelectedType('school_event')}
          className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer border ${
            selectedType === 'school_event'
              ? 'bg-[#234B36] text-white border-[#234B36]'
              : 'bg-[#F5F2EA] text-[#171717] border-[#D8D4CC] hover:bg-[#EAE6DC]'
          }`}
        >
          Acara Sekolah / PORSENI
        </button>
      </div>

      {/* Events List View */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-white border border-[#D8D4CC] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#234B36] transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getEventBadge(ev.event_type)}
                <span className="text-xs font-semibold text-[#68655F]">Penyelenggara: {ev.organizer}</span>
              </div>
              <h3 className="text-base font-bold text-[#171717]">{ev.title}</h3>
              {ev.description && (
                <p className="text-xs text-[#68655F] leading-relaxed max-w-2xl">{ev.description}</p>
              )}
            </div>

            <div className="shrink-0 flex flex-col md:items-end gap-1.5 text-xs text-[#68655F] border-t md:border-t-0 pt-3 md:pt-0 border-[#D8D4CC]">
              <div className="flex items-center gap-1.5 font-medium text-[#171717]">
                <MapPin className="w-3.5 h-3.5 text-[#234B36]" />
                <span>{ev.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#68655F]" />
                <span>
                  {ev.start_datetime.replace('T', ' ')} s/d {ev.end_datetime.replace('T', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal with Conflict Warning */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Jadwalkan Agenda Kegiatan Baru"
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs">
          {conflictWarning && (
            <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{conflictWarning}</span>
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <Input
            label="Judul Agenda / Latihan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Latihan Rutin Futsal Menjelang DBL"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori Agenda"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
            >
              <option value="extracurricular_practice">Latihan Rutin Ekskul</option>
              <option value="competition">Kompetisi / Kejuaraan</option>
              <option value="school_event">Acara Sekolah / PORSENI</option>
              <option value="committee_event">Rapat Kepanitiaan OSIS</option>
              <option value="official_school_activity">Kegiatan Kedinasan</option>
            </Select>

            <Select
              label="Lokasi / Fasilitas"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                handleTimeLocationChange(e.target.value, startDate, endDate);
              }}
            >
              <option value="Lapangan Olahraga Utama">Lapangan Olahraga Utama</option>
              <option value="Laboratorium Komputer RPL 1">Laboratorium Komputer RPL 1</option>
              <option value="Aula Serbaguna Lantai 3">Aula Serbaguna Lantai 3</option>
              <option value="Studio Multimedia & Alam Terbuka">Studio Multimedia & Alam Terbuka</option>
              <option value="Laboratorium Mekatronika">Laboratorium Mekatronika</option>
              <option value="Ruang Kedap Suara Musik">Ruang Kedap Suara Musik</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waktu Mulai"
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleTimeLocationChange(location, e.target.value, endDate);
              }}
              required
            />
            <Input
              label="Waktu Selesai"
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                handleTimeLocationChange(location, startDate, e.target.value);
              }}
              required
            />
          </div>

          <Input
            label="Penyelenggara / Penanggung Jawab"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
          />

          <Textarea
            label="Keterangan Tambahan"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan rincian agenda, perlengkapan yang digunakan, dll..."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-[#D8D4CC]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Jadwal Resmi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
