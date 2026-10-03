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

export const parseExcelDateTime = (val: any, defaultTime = '08:00:00'): string | null => {
  if (val === null || val === undefined || val === '') return null;

  // 1. If it's already a JS Date object
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    const hh = String(val.getHours()).padStart(2, '0');
    const mm = String(val.getMinutes()).padStart(2, '0');
    const ss = String(val.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  // 2. If it's an Excel numeric serial date (e.g. 46305 or 46305.6458333333)
  const numVal =
    typeof val === 'number'
      ? val
      : typeof val === 'string' && /^\d+(\.\d+)?$/.test(val.trim())
      ? parseFloat(val.trim())
      : null;

  if (numVal !== null && !isNaN(numVal) && numVal > 10000 && numVal < 100000) {
    const utcDays = Math.floor(numVal - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);

    const fractionalDay = numVal - Math.floor(numVal) + 0.0000001;
    let totalSeconds = Math.floor(86400 * fractionalDay);

    const seconds = totalSeconds % 60;
    totalSeconds -= seconds;
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;

    const y = dateInfo.getFullYear();
    const m = String(dateInfo.getMonth() + 1).padStart(2, '0');
    const d = String(dateInfo.getDate()).padStart(2, '0');
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  // 3. String date parsing
  const str = String(val).trim();
  if (!str) return null;

  // Pattern: YYYY-MM-DD or YYYY-M-D with optional time (HH:mm or HH:mm:ss)
  const ymdMatch = str.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
  );
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, '0');
    const d = ymdMatch[3].padStart(2, '0');
    const hh = (ymdMatch[4] || defaultTime.split(':')[0] || '08').padStart(2, '0');
    const mm = (ymdMatch[5] || defaultTime.split(':')[1] || '00').padStart(2, '0');
    const ss = (ymdMatch[6] || defaultTime.split(':')[2] || '00').padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  // Pattern: DD-MM-YYYY or DD/MM/YYYY with optional time
  const dmyMatch = str.match(
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
  );
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    const hh = (dmyMatch[4] || defaultTime.split(':')[0] || '08').padStart(2, '0');
    const mm = (dmyMatch[5] || defaultTime.split(':')[1] || '00').padStart(2, '0');
    const ss = (dmyMatch[6] || defaultTime.split(':')[2] || '00').padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  // Fallback: standard Date parsing
  const parsed = new Date(str.replace(' ', 'T'));
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    const hh = String(parsed.getHours()).padStart(2, '0');
    const mm = String(parsed.getMinutes()).padStart(2, '0');
    const ss = String(parsed.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

  return null;
};

export const normalizeEventCategory = (
  rawCat: string
): 'extracurricular_training' | 'competition' | 'school_event' | 'national_holiday' => {
  const cat = (rawCat || '').toLowerCase().trim();
  if (
    cat.includes('kompetisi') ||
    cat.includes('lomba') ||
    cat.includes('tanding') ||
    cat.includes('kejuaraan') ||
    cat.includes('turnamen') ||
    cat.includes('competition')
  ) {
    return 'competition';
  }
  if (cat.includes('libur') || cat.includes('holiday') || cat.includes('hari besar')) {
    return 'national_holiday';
  }
  if (
    cat.includes('sekolah') ||
    cat.includes('upacara') ||
    cat.includes('resmi') ||
    cat.includes('school_event') ||
    cat.includes('ceremony') ||
    cat.includes('pameran') ||
    cat.includes('class meeting')
  ) {
    return 'school_event';
  }
  return 'extracurricular_training';
};

export const formatEventDateTime = (rawStart: string, rawEnd: string) => {
  if (!rawStart) return { dateStr: '', timeStr: '' };

  const parsedStart = parseExcelDateTime(rawStart, '08:00:00');
  const dStart = parsedStart ? new Date(parsedStart.replace(' ', 'T')) : new Date(rawStart.replace(' ', 'T'));
  if (isNaN(dStart.getTime())) {
    return { dateStr: rawStart, timeStr: '' };
  }

  const parsedEnd = rawEnd ? parseExcelDateTime(rawEnd, '10:00:00') : null;
  const dEnd = parsedEnd ? new Date(parsedEnd.replace(' ', 'T')) : null;

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
  if (dEnd && !isNaN(dEnd.getTime())) {
    const endH = String(dEnd.getHours()).padStart(2, '0');
    const endM = String(dEnd.getMinutes()).padStart(2, '0');
    timeStr = `${startH}:${startM} - ${endH}:${endM} WIB`;
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
