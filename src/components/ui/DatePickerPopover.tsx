import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, RotateCcw } from 'lucide-react';

interface DatePickerPopoverProps {
  value?: string; // Format 'YYYY-MM-DD' or '' for all dates
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  value = '',
  onChange,
  placeholder = 'Semua Tanggal',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view month & year based on value or today
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState<number>(() =>
    isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
  );

  // Sync view when external value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Format value into Indonesian localized string
  const formatDisplayLabel = (isoDate: string): string => {
    if (!isoDate) return placeholder;
    try {
      const [y, m, d] = isoDate.split('-').map(Number);
      if (!y || !m || !d) return placeholder;
      return `${d} ${MONTH_NAMES_ID[m - 1]} ${y}`;
    } catch {
      return placeholder;
    }
  };

  // Calendar matrix calculation
  const getCalendarDays = () => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonthIndex = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const mStr = String(prevMonthIndex + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      days.push({
        dateStr: `${prevYear}-${mStr}-${dStr}`,
        dayNumber: day,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const mStr = String(viewMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      days.push({
        dateStr: `${viewYear}-${mStr}-${dStr}`,
        dayNumber: d,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill complete grid of 35 or 42 slots
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let nextDay = 1; nextDay <= remaining; nextDay++) {
      const nextMonthIndex = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const mStr = String(nextMonthIndex + 1).padStart(2, '0');
      const dStr = String(nextDay).padStart(2, '0');
      days.push({
        dateStr: `${nextYear}-${mStr}-${dStr}`,
        dayNumber: nextDay,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const todayStr = (() => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();

  const calendarDays = getCalendarDays();

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[34px] px-3 py-1.5 border rounded-xl text-xs flex items-center gap-2 bg-white cursor-pointer select-none transition-all shadow-2xs hover:bg-slate-50 active:scale-98 ${
          value
            ? 'border-[#D15B40] text-[#171717] font-semibold bg-[#FDEDE9]/20'
            : 'border-[#EAE6DC] text-[#525049] font-medium'
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <CalendarIcon className={`w-3.5 h-3.5 shrink-0 ${value ? 'text-[#D15B40]' : 'text-[#8C887B]'}`} />
        <span className="truncate max-w-[150px]">{formatDisplayLabel(value)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8C887B] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Pilih Tanggal Presensi"
          className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-50 w-72 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Calendar Header: Month & Year Navigator */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-900 tracking-tight">
              {MONTH_NAMES_ID[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_NAMES_ID.map((day, idx) => (
              <span
                key={day}
                className={`text-[10px] font-bold uppercase tracking-wider py-0.5 ${
                  idx === 0 ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((item, index) => {
              const isSelected = value === item.dateStr;
              const isToday = todayStr === item.dateStr;

              return (
                <button
                  key={`${item.dateStr}-${index}`}
                  type="button"
                  onClick={() => handleSelectDate(item.dateStr)}
                  className={`h-7 w-7 mx-auto rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer select-none relative ${
                    isSelected
                      ? 'bg-[#D15B40] text-white font-bold shadow-xs scale-105'
                      : item.isCurrentMonth
                      ? 'text-slate-700 hover:bg-slate-100 font-medium'
                      : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.dayNumber}</span>
                  {/* Subtle Today Dot Indicator if not selected */}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#D15B40]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Controls: Reset & Quick Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => handleSelectDate(todayStr)}
              className="text-[11px] font-semibold text-[#D15B40] hover:underline cursor-pointer"
            >
              Hari Ini
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Semua Tanggal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
