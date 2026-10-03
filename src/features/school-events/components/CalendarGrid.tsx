import React from 'react';
import { SchoolEvent } from '@/types';
import { CalendarDayCell } from '../hooks/useCalendarEvents';
import { DAY_NAMES_HEADER, getCategoryStyles } from '../utils/calendarUtils';

interface CalendarGridProps {
  monthGrid: CalendarDayCell[];
  events: SchoolEvent[];
  onSelectEvent: (event: SchoolEvent) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthGrid,
  events,
  onSelectEvent,
}) => {
  return (
    <div className="bg-white border border-[#EAE6DC] rounded-2xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-[#EAE6DC] bg-[#F9F8F6]">
        {DAY_NAMES_HEADER.map((name, i) => (
          <div
            key={i}
            className="py-3 text-center text-xs font-bold uppercase tracking-wider text-[#68655F] border-r last:border-r-0 border-[#EAE6DC]"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-b border-[#EAE6DC] bg-white">
        {monthGrid.map((dayObj, idx) => {
          const dayEvents = events.filter((ev) => {
            const rawStart = (ev.start_time || ev.start_datetime || '').trim();
            if (!rawStart) return false;
            const match = rawStart.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
            if (match) {
              const y = match[1];
              const m = match[2].padStart(2, '0');
              const d = match[3].padStart(2, '0');
              return `${y}-${m}-${d}` === dayObj.dateString;
            }
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

              <div className="space-y-1 flex-1 overflow-hidden">
                {visibleEvents.map((ev) => {
                  const styles = getCategoryStyles(ev.category || ev.event_type);
                  const rawStart = (ev.start_time || ev.start_datetime || '').trim();
                  const timeMatch = rawStart.match(/(?:T|\s)(\d{1,2}:\d{2})/);
                  const timePrefix = timeMatch ? timeMatch[1] : '';

                  return (
                    <button
                      key={ev.id}
                      onClick={() => onSelectEvent(ev)}
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

                {remainingCount > 0 && (
                  <button
                    onClick={() => onSelectEvent(dayEvents[maxVisible])}
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
  );
};
