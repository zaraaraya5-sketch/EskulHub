export type UserRole = 'student' | 'pengurus' | 'guru' | 'pembina' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  nisn: string;
  class_name: string;
  gender: 'L' | 'P';
  bio?: string;
}

export interface TeacherProfile {
  id: string;
  user_id: string;
  nip: string;
  subject: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  slug: string;
  category: 'Olahraga' | 'Seni & Budaya' | 'Sains & Teknologi' | 'Kepemimpinan' | 'Bahasa & Literasi';
  short_description: string;
  full_description: string;
  profile_image: string;
  supervisor_name: string;
  supervisor_id?: string;
  chairperson_name: string;
  practice_schedule: string;
  location: string;
  member_capacity: number;
  current_member_count: number;
  registration_status: 'open' | 'closed';
  achievements_count?: number;
}

export interface ExtracurricularMember {
  id: string;
  extracurricular_id: string;
  student_id: string;
  student_name: string;
  student_nisn: string;
  student_class: string;
  role: 'Ketua' | 'Wakil Ketua' | 'Sekretaris' | 'Bendahara' | 'Anggota';
  joined_at: string;
  status: 'active' | 'inactive';
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface ExtracurricularRegistration {
  id: string;
  extracurricular_id: string;
  extracurricular_name: string;
  student_id: string;
  student_name: string;
  student_class: string;
  student_nisn: string;
  registration_date: string;
  status: RegistrationStatus;
  reason: string;
  notes?: string;
  reviewer_name?: string;
  reviewed_at?: string;
}

export type AttendanceStatus = 'present' | 'late' | 'excused' | 'absent';

export interface AttendanceSession {
  id: string;
  extracurricular_id: string;
  extracurricular_name: string;
  title: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  notes?: string;
  created_by_name: string;
  total_members: number;
  present_count: number;
  late_count: number;
  excused_count: number;
  absent_count: number;
}

export interface AttendanceRecord {
  id: string;
  attendance_session_id: string;
  session_title: string;
  session_date: string;
  extracurricular_name: string;
  student_id: string;
  student_name: string;
  status: AttendanceStatus;
  notes?: string;
  verified_by_name?: string;
}

export type EventType =
  | 'extracurricular_practice'
  | 'competition'
  | 'school_event'
  | 'osis_event'
  | 'committee_event'
  | 'meeting'
  | 'holiday'
  | 'official_school_activity';

export interface SchoolEvent {
  id: string;
  title: string;
  event_type?: EventType;
  category?: string;
  status?: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  description?: string;
  organizer: string;
}

export interface Activity {
  id: string;
  extracurricular_id: string;
  extracurricular_name: string;
  title: string;
  activity_date: string;
  description: string;
  location: string;
  documentation_urls: string[];
  participant_count: number;
  created_by_name: string;
}

export interface Achievement {
  id: string;
  extracurricular_id?: string;
  extracurricular_name?: string;
  student_id: string;
  student_name: string;
  title: string;
  competition_name: string;
  level: 'Sekolah' | 'Kota/Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  rank: string;
  achievement_date: string;
  certificate_url?: string;
  is_verified: boolean;
  verified_by_name?: string;
  verified_at?: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  file_url?: string;
  certificate_number?: string;
  is_verified: boolean;
}

export interface PortfolioVerification {
  id: string;
  student_id: string;
  student_name: string;
  student_nisn: string;
  student_class: string;
  school_name: string;
  verification_id: string; // e.g. EKH-2026-000184
  academic_year: string;
  issue_date: string;
  status: 'verified' | 'pending' | 'revoked' | 'valid';
  qr_code_url: string;
  verified_by_name: string;
  summary_data: {
    total_ekskul: number;
    total_attendance_rate: string;
    verified_achievements_count: number;
    active_roles: string[];
    ekskul_list: Array<{ name: string; role: string; period: string }>;
    achievements: Array<{ title: string; level: string; rank: string; year: string }>;
    committee_roles: Array<{ title: string; role: string; year: string }>;
  };
}

export interface SchoolSetting {
  school_name: string;
  npsn: string;
  address: string;
  academic_year: string;
  principal_name: string;
  vice_principal_student_affairs: string;
}
