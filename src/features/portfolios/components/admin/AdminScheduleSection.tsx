import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { SchoolEvent } from '@/types';
import { Plus, Trash2, Clock, MapPin, AlertTriangle } from 'lucide-react';

interface AdminScheduleSectionProps {
  events: SchoolEvent[];
  setEvents: (data: SchoolEvent[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export const AdminScheduleSection: React.FC<AdminScheduleSectionProps> = ({
  events,
  setEvents,
  showNotification,
}) => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'practice' | 'competition' | 'ceremony' | 'exhibition'>('practice');
  const [eventLocation, setEventLocation] = useState('Lapangan Basket');
  const [eventStart, setEventStart] = useState('2026-10-02T15:30');
  const [eventEnd, setEventEnd] = useState('2026-10-02T17:30');
  const [eventOrganizer, setEventOrganizer] = useState('PMR Wira');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const checkConflictOnTimeChange = (loc: string, start: string, end: string) => {
    if (!start || !end) return;
    const check = db.checkEventConflict(loc, start, end);
    if (check.hasConflict && check.conflictingEvent) {
      setConflictWarning(`Peringatan: Lokasi "${loc}" telah terpakai oleh "${check.conflictingEvent.title}" (${check.conflictingEvent.start_datetime.substring(11, 16)} - ${check.conflictingEvent.end_datetime.substring(11, 16)})!`);
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

    const res = db.addSchoolEvent({
      title: eventTitle.trim(),
      category: eventCategory,
      location: eventLocation,
      start_datetime: eventStart,
      end_datetime: eventEnd,
      organizer: eventOrganizer,
      description: `Sesi latihan & agenda resmi ${eventOrganizer}`,
      status: 'scheduled',
    });

    if (res.success) {
      setEvents([...db.getSchoolEvents()]);
      setIsAddEventModalOpen(false);
      setEventTitle('');
      setConflictWarning(null);
      showNotification('success', 'Agenda jadwal latihan berhasil ditambahkan!');
    } else {
      showNotification('error', res.message);
    }
  };

  const handleDeleteEvent = (id: string) => {
    const res = db.deleteSchoolEvent(id);
    if (res.success) {
      setEvents([...db.getSchoolEvents()]);
      showNotification('success', res.message);
    }
  };

  return (
    <>
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Jadwal Sesi Latihan & Kalender Ruangan</h2>
            <p className="text-xs text-[#68655F]">
              Sistem otomatis memverifikasi bentrok jadwal ruangan dan fasilitas antar-ekskul.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsAddEventModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
            Jadwalkan Sesi Latihan Baru
          </Button>
        </div>

        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="border border-[#EAE6DC] rounded-lg p-4 bg-[#F9F8F6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171717] text-sm">{ev.title}</span>
                  <Badge variant="neutral">{ev.organizer}</Badge>
                  <Badge variant={ev.category === 'practice' ? 'success' : 'warning'}>
                    {ev.category === 'practice' ? 'Latihan Rutin' : 'Agenda Khusus'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#68655F] mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#234B36]" />
                    <span>{ev.start_datetime.replace('T', ' ')} s.d. {ev.end_datetime.substring(11, 16)} WIB</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#171717]">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6819]" />
                    <span>Lokasi: {ev.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded transition-colors cursor-pointer"
                  title="Hapus Jadwal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: TAMBAH AGENDA JADWAL LATIHAN BARU */}
      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        title="Jadwalkan Sesi Latihan & Acara"
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs">
          <Input
            label="Judul Sesi Kegiatan"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Latihan Rutin Basket / Persiapan Lomba"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Kategori Agenda
              </label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="practice">Latihan Rutin Mingguan</option>
                <option value="competition">Kejuaraan / Perlombaan</option>
                <option value="exhibition">Pameran Karya / Pentas</option>
                <option value="ceremony">Upacara / Seremoni</option>
              </select>
            </div>
            <Input
              label="Organisator (Nama Ekskul)"
              type="text"
              value={eventOrganizer}
              onChange={(e) => setEventOrganizer(e.target.value)}
              placeholder="Tim Basket Putra"
              required
            />
          </div>

          <div>
            <Input
              label="Pilih Lokasi Fasilitas Sekolah"
              type="text"
              value={eventLocation}
              onChange={(e) => {
                setEventLocation(e.target.value);
                checkConflictOnTimeChange(e.target.value, eventStart, eventEnd);
              }}
              placeholder="Lapangan Basket Utama / Lab Komputer"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Waktu Mulai
              </label>
              <input
                type="datetime-local"
                value={eventStart}
                onChange={(e) => {
                  setEventStart(e.target.value);
                  checkConflictOnTimeChange(eventLocation, e.target.value, eventEnd);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Waktu Selesai
              </label>
              <input
                type="datetime-local"
                value={eventEnd}
                onChange={(e) => {
                  setEventEnd(e.target.value);
                  checkConflictOnTimeChange(eventLocation, eventStart, e.target.value);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                required
              />
            </div>
          </div>

          {conflictWarning && (
            <div className="p-3 bg-[#F9F4E5] border border-[#E4C783] rounded-md flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8C6819] shrink-0 mt-0.5" />
              <p className="text-xs text-[#8C6819] font-medium leading-relaxed">
                {conflictWarning}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddEventModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan & Jadwalkan
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
