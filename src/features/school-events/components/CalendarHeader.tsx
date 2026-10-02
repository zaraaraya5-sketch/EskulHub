import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileSpreadsheet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CalendarHeaderProps {
  monthYearLabel: string;
  role?: string | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenImportModal: () => void;
  onNavigate?: (path: string) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthYearLabel,
  role,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenImportModal,
  onNavigate,
}) => {
  const canImportExcel = ['admin', 'pembina', 'teacher', 'guru'].includes(role || '');
  const canAddEvent = ['admin', 'pembina', 'teacher', 'guru', 'pengurus'].includes(role || '');

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40]">
          <CalendarIcon className="w-4 h-4" /> Kalender Bulanan Interaktif
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight mt-0.5">
          {monthYearLabel}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onToday}
          className="px-3.5 py-2 text-xs font-semibold text-[#171717] bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl hover:bg-[#EAE6DC] transition-colors cursor-pointer shadow-2xs"
        >
          Hari Ini
        </button>

        <div className="inline-flex rounded-xl border border-[#EAE6DC] bg-[#F9F8F6] p-0.5">
          <button
            onClick={onPrevMonth}
            title="Bulan Sebelumnya"
            className="p-1.5 text-[#171717] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMonth}
            title="Bulan Berikutnya"
            className="p-1.5 text-[#171717] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {canImportExcel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenImportModal}
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
            className="border-emerald-300 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/80 font-medium shadow-2xs"
          >
            Import Excel
          </Button>
        )}

        {canAddEvent && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => (onNavigate ? onNavigate('/calendar/create') : (window.location.href = '/calendar/create'))}
            icon={<Plus className="w-4 h-4" />}
            className="bg-[#D15B40] hover:bg-[#b84a32]"
          >
            Tambah Agenda
          </Button>
        )}
      </div>
    </div>
  );
};
