import { LucideIcon, Flag, Building, Users, Trophy, Calendar as CalendarIcon } from 'lucide-react';

export interface CategoryStyle {
  chip: string;
  dot: string;
  accentBar: string;
  pill: string;
  label: string;
  icon: LucideIcon;
}

export const DAY_NAMES_HEADER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const formatYYYYMMDD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatEventDateTime = (rawStart: string, rawEnd: string) => {
  if (!rawStart) return { dateStr: '', timeStr: '' };
  const dStart = new Date(rawStart.replace(' ', 'T'));
  const dEnd = rawEnd ? new Date(rawEnd.replace(' ', 'T')) : null;

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

  const dateStr = `${dayName}, ${dateNum} ${monthName} ${year}`;
  return { dateStr, timeStr };
};

export const getCategoryStyles = (cat?: string): CategoryStyle => {
  switch (cat) {
    case 'national_holiday':
      return {
        chip: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100',
        dot: 'bg-rose-500',
        accentBar: 'bg-rose-500',
        pill: 'bg-rose-100 text-rose-800 border-rose-200',
        label: 'Libur Nasional',
        icon: Flag,
      };
    case 'school_event':
      return {
        chip: 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100',
        dot: 'bg-blue-500',
        accentBar: 'bg-blue-500',
        pill: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Acara Sekolah',
        icon: Building,
      };
    case 'extracurricular_training':
    case 'extracurricular_practice':
      return {
        chip: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100',
        dot: 'bg-emerald-500',
        accentBar: 'bg-emerald-500',
        pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Latihan Ekskul',
        icon: Users,
      };
    case 'competition':
      return {
        chip: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
        dot: 'bg-amber-500',
        accentBar: 'bg-amber-500',
        pill: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Kompetisi',
        icon: Trophy,
      };
    default:
      return {
        chip: 'bg-stone-50 text-stone-900 border-stone-200 hover:bg-stone-100',
        dot: 'bg-stone-500',
        accentBar: 'bg-[#D15B40]',
        pill: 'bg-stone-100 text-stone-800 border-stone-200',
        label: 'Agenda Resmi',
        icon: CalendarIcon,
      };
  }
};
