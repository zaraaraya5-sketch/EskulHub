import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/lib/database';
import { getEventsAPI, deleteEventAPI } from '@/lib/api';
import { SchoolEvent } from '@/types';
import { formatYYYYMMDD, isSameDay } from '../utils/calendarUtils';

export interface CalendarDayCell {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const useCalendarEvents = (currentUserId?: string) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const now = new Date();
    return now.getFullYear() === 2026 ? now : new Date('2026-10-02T10:00:00');
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => db.getSchoolEvents());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Indonesian Monday-start index: Monday=0, Tuesday=1, ..., Sunday=6
  const monthGrid = useMemo<CalendarDayCell[]>(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayWeekday = firstDayOfMonth.getDay();
    const prevMonthPadding = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const days: CalendarDayCell[] = [];
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

  const gridStartStr = `${monthGrid[0].dateString} 00:00:00`;
  const gridEndStr = `${monthGrid[monthGrid.length - 1].dateString} 23:59:59`;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEventsAPI({
        start_time: gridStartStr,
        end_time: gridEndStr,
      });

      if (Array.isArray(data)) {
        const existingLocal = db.getSchoolEvents();
        const merged = [...data];
        for (const localEv of existingLocal) {
          const alreadyExists = merged.some(
            (m) =>
              m.id === localEv.id ||
              (m.title === localEv.title &&
                (m.start_time?.slice(0, 10) === localEv.start_time?.slice(0, 10) ||
                  m.start_datetime?.slice(0, 10) === localEv.start_datetime?.slice(0, 10)))
          );
          if (!alreadyExists) {
            merged.push(localEv);
          }
        }
        db.events.setEvents(merged);
        setEvents(merged);
      } else {
        setEvents(db.getSchoolEvents());
      }
    } catch {
      setEvents(db.getSchoolEvents());
    } finally {
      setLoading(false);
    }
  }, [gridStartStr, gridEndStr]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      fetchEvents();
    });
    return () => unsub();
  }, [fetchEvents]);

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

  const monthYearLabel = useMemo(() => {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [currentDate]);

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

  const handleDeleteEvent = async (id: string, fallbackEvent?: SchoolEvent | null): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError('');

    const previousEvents = [...events];
    const targetEvent = events.find((e) => e.id === id) || fallbackEvent;
    const targetTitle = targetEvent?.title;
    const targetDate = (targetEvent?.start_time || targetEvent?.start_datetime)?.slice(0, 10);

    // Optimistically remove matching item from the local list
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

    try {
      const res = await deleteEventAPI(id, currentUserId);
      if (!res.success) {
        setEvents(previousEvents);
        setDeleteError(res.message || 'Gagal menghapus agenda kegiatan.');
        return false;
      }

      db.deleteSchoolEvent(id, currentUserId);
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

      await fetchEvents();
      return true;
    } catch (err: any) {
      setEvents(previousEvents);
      setDeleteError(err.message || 'Terjadi kesalahan sistem.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    currentDate,
    setCurrentDate,
    events,
    loading,
    selectedCategory,
    setSelectedCategory,
    monthGrid,
    filteredEvents,
    monthYearLabel,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    fetchEvents,
    handleDeleteEvent,
    isDeleting,
    deleteError,
    setDeleteError,
  };
};
