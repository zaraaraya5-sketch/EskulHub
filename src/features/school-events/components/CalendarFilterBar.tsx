import React from 'react';

interface CalendarFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  totalEventsCount: number;
  loading: boolean;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'Semua Kategori' },
  { id: 'school_event', label: 'Acara Sekolah', color: 'bg-blue-500' },
  { id: 'national_holiday', label: 'Hari Libur', color: 'bg-rose-500' },
  { id: 'extracurricular_training', label: 'Latihan Ekskul', color: 'bg-emerald-500' },
  { id: 'competition', label: 'Kompetisi', color: 'bg-amber-500' },
];

export const CalendarFilterBar: React.FC<CalendarFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  totalEventsCount,
  loading,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EAE6DC]/80 text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[#68655F] font-medium mr-1">Filter Kategori:</span>
        {FILTER_OPTIONS.map((f) => {
          const active = selectedCategory === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectCategory(f.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border ${
                active
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-[#F9F8F6] text-[#68655F] border-[#EAE6DC] hover:text-[#171717]'
              }`}
            >
              {f.color && <span className={`w-2 h-2 rounded-full ${f.color}`} />}
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-[#525049]">
        {loading ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D15B40] animate-ping" />
            Memuat jadwal agenda...
          </span>
        ) : (
          <span>Menampilkan {totalEventsCount} agenda di bulan ini</span>
        )}
      </div>
    </div>
  );
};
