export const MAXIMUM_EXTRACURRICULAR_MEMBER_CAPACITY = 30;
export const DEFAULT_ATTENDANCE_STATUS = 'present';
export const PORTFOLIO_VERIFICATION_ID_PREFIX = 'EKH';
export const CURRENT_ACADEMIC_YEAR = '2025/2026';

export const EXTRACURRICULAR_CATEGORIES = [
  'Semua Kategori',
  'Olahraga',
  'Sains & Teknologi',
  'Seni & Budaya',
  'Kepemimpinan',
  'Bahasa & Literasi',
] as const;

export const ATTENDANCE_STATUS_LABELS = {
  present: 'Hadir',
  late: 'Terlambat',
  excused: 'Izin/Sakit',
  absent: 'Alpa/Tanpa Keterangan',
} as const;

export const REGISTRATION_STATUS_LABELS = {
  pending: 'Menunggu Persetujuan',
  approved: 'Diterima',
  rejected: 'Ditolak',
  withdrawn: 'Dibatalkan',
} as const;

export const ACHIEVEMENT_LEVELS = [
  'Sekolah',
  'Kota/Kabupaten',
  'Provinsi',
  'Nasional',
  'Internasional',
] as const;
