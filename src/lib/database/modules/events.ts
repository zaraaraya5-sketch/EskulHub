import { SchoolEvent } from '@/types';
import * as apiService from '@/lib/api';

const DEFAULT_SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-auto-1',
    title: 'Latihan Taktik & Pressing Cepat Futsal',
    category: 'practice',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    start_datetime: '2026-10-24T15:30:00',
    end_datetime: '2026-10-24T17:30:00',
    organizer: 'Futsal',
    description: 'Pematangan formasi 2-2 dan latihan transisi cepat bertahan ke menyerang.',
    status: 'scheduled',
  },
  {
    id: 'ev-auto-2',
    title: 'Drill Fundamental Shooting & Defense Basket',
    category: 'practice',
    location: 'Lapangan Basket SMKN 1 Ciomas',
    start_datetime: '2026-10-25T15:30:00',
    end_datetime: '2026-10-25T17:30:00',
    organizer: 'Basket',
    description: 'Latihan akurasi free throw, perimeter defense, dan scrimmage 3v3.',
    status: 'scheduled',
  },
  {
    id: 'ev-auto-3',
    title: 'Simulasi Pertolongan Pertama & Balut Bidai PMR',
    category: 'practice',
    location: 'Ruang UKS & Area Terbuka',
    start_datetime: '2026-10-26T08:30:00',
    end_datetime: '2026-10-26T11:00:00',
    organizer: 'PMR',
    description: 'Penanganan darurat fraktur tulang, teknik evakuasi tandu, dan CPR dasar.',
    status: 'scheduled',
  },
  {
    id: 'ev-auto-4',
    title: 'Upacara Peringatan Hari Sumpah Pemuda Ke-98',
    category: 'ceremony',
    location: 'Lapangan Utama SMKN 1 Ciomas',
    start_datetime: '2026-10-28T07:00:00',
    end_datetime: '2026-10-28T09:30:00',
    organizer: 'Paskibra & Kesiswaan',
    description: 'Upacara pengibaran bendera merah putih berseragam adat nasional Nusantara.',
    status: 'scheduled',
  },
  {
    id: 'ev-auto-5',
    title: 'Latihan Formasi Baris-Berbaris PBB Presisi',
    category: 'practice',
    location: 'Lapangan Olahraga Utama',
    start_datetime: '2026-10-30T15:30:00',
    end_datetime: '2026-10-30T17:30:00',
    organizer: 'Paskibra',
    description: 'Langkah tegap, variasi formasi lingkaran dan kekompakan hentakan langkah.',
    status: 'scheduled',
  },
  {
    id: 'ev-auto-6',
    title: 'Friendly Match Uji Tanding Futsal Pelajar',
    category: 'competition',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    start_datetime: '2026-11-02T15:00:00',
    end_datetime: '2026-11-02T17:30:00',
    organizer: 'Futsal',
    description: 'Uji coba taktik pressing menghadapi tim futsal sekolah mitra.',
    status: 'scheduled',
  },
  {
    id: 'ev-auto-7',
    title: 'Pionering & Tali-Temali Tiang Bendera Pramuka',
    category: 'practice',
    location: 'Area Terbuka Bumi Perkemahan',
    start_datetime: '2026-11-06T14:30:00',
    end_datetime: '2026-11-06T17:00:00',
    organizer: 'Pramuka',
    description: 'Pembuatan miniatur menara pandang dan simpul palang tongkat rotan.',
    status: 'scheduled',
  },
];

export class EventsModule {
  private schoolEvents: SchoolEvent[] = [...DEFAULT_SCHOOL_EVENTS];
  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setEvents(events: SchoolEvent[]) {
    if (events && events.length > 0) {
      this.schoolEvents = events;
    } else {
      this.schoolEvents = [...DEFAULT_SCHOOL_EVENTS];
    }
  }

  public getSchoolEvents(): SchoolEvent[] {
    return this.schoolEvents;
  }

  public checkEventConflict(
    location: string,
    startDatetime: string,
    endDatetime: string,
    excludeId?: string
  ): { hasConflict: boolean; conflictingEvent?: SchoolEvent } {
    const start = new Date(startDatetime).getTime();
    const end = new Date(endDatetime).getTime();

    const conflict = this.schoolEvents.find((e) => {
      if (excludeId && e.id === excludeId) return false;
      if (e.location.toLowerCase() !== location.toLowerCase()) return false;
      const eStart = new Date(e.start_datetime).getTime();
      const eEnd = new Date(e.end_datetime).getTime();
      return start < eEnd && end > eStart;
    });

    return {
      hasConflict: Boolean(conflict),
      conflictingEvent: conflict,
    };
  }

  public addSchoolEvent(event: Omit<SchoolEvent, 'id'>, force: boolean = false) {
    const conflictCheck = this.checkEventConflict(event.location, event.start_datetime, event.end_datetime);
    if (conflictCheck.hasConflict && !force) {
      return {
        success: false,
        message: `Konflik Jadwal: Ruangan '${event.location}' telah terpakai oleh agenda "${conflictCheck.conflictingEvent?.title}" pada rentang waktu yang sama!`,
        conflict: conflictCheck.conflictingEvent,
      };
    }

    const newEvent: SchoolEvent = {
      ...event,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    this.schoolEvents.unshift(newEvent);
    apiService.createEventAPI(newEvent).catch((err) => {
      console.warn('Background sync for new event:', err);
    });
    this.notify();
    return { success: true, event: newEvent };
  }

  public updateSchoolEvent(id: string, data: Partial<SchoolEvent>, userId?: string): { success: boolean; message: string } {
    const index = this.schoolEvents.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.schoolEvents[index] = { ...this.schoolEvents[index], ...data };
    }
    apiService.updateEventAPI(id, data, userId);
    this.notify();
    return { success: true, message: 'Jadwal berhasil diperbarui.' };
  }

  public deleteSchoolEvent(id: string, userId?: string): { success: boolean; message: string } {
    this.schoolEvents = this.schoolEvents.filter((e) => e.id !== id);
    apiService.deleteEventAPI(id, userId);
    this.notify();
    return { success: true, message: 'Jadwal latihan / agenda berhasil dihapus.' };
  }
}
