import { SchoolEvent } from '@/types';
import * as apiService from '@/lib/api';

export class EventsModule {
  private schoolEvents: SchoolEvent[] = [];
  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setEvents(events: SchoolEvent[]) {
    this.schoolEvents = events;
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

  public addSchoolEvent(event: Omit<SchoolEvent, 'id'>) {
    const conflictCheck = this.checkEventConflict(event.location, event.start_datetime, event.end_datetime);
    if (conflictCheck.hasConflict) {
      return {
        success: false,
        message: `Konflik Jadwal: Ruangan '${event.location}' telah terpakai oleh agenda "${conflictCheck.conflictingEvent?.title}" pada rentang waktu yang sama!`,
        conflict: conflictCheck.conflictingEvent,
      };
    }

    const newEvent: SchoolEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    this.schoolEvents.unshift(newEvent);
    apiService.createEventAPI(newEvent);
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
