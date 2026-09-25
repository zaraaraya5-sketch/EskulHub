import {
  User,
  UserRole,
  Extracurricular,
  ExtracurricularMember,
  ExtracurricularRegistration,
  AttendanceSession,
  AttendanceRecord,
  SchoolEvent,
  Activity,
  Achievement,
  Certificate,
  PortfolioVerification,
  SchoolSetting,
} from '@/types';

const STORAGE_KEY = 'ekskul_hub_db_v1';

export const INITIAL_SCHOOL_SETTINGS: SchoolSetting = {
  school_name: 'SMK Nusantara Digital',
  npsn: '20103482',
  address: 'Jl. Pendidikan Merdeka No. 45, Kota Bandung, Jawa Barat',
  academic_year: '2025/2026',
  principal_name: 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
  vice_principal_student_affairs: 'Drs. Bambang Suryono',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Budi Pratama',
    email: 'budi@smknusantara.sch.id',
    role: 'student',
    password: 'password123',
    phone: '085712345678',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_active: true,
  },
  {
    id: 'usr-guru-1',
    name: 'Dra. Hj. Sri Wahyuni, M.Pd.',
    email: 'sri.wahyuni@smknusantara.sch.id',
    role: 'guru',
    password: 'password123',
    phone: '081320491823',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    is_active: true,
  },
  {
    id: 'usr-pembina-1',
    name: 'Hendra Wijaya, S.Pd.',
    email: 'hendra@smknusantara.sch.id',
    role: 'pembina',
    password: 'password123',
    phone: '081234567891',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_active: true,
  },
  {
    id: 'usr-admin-1',
    name: 'Drs. Bambang Suryono',
    email: 'admin@smknusantara.sch.id',
    role: 'admin',
    password: 'password123',
    phone: '081234567890',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    is_active: true,
  },
  {
    id: 'usr-pengurus-1',
    name: 'Rizky Ramadhan',
    email: 'rizky@smknusantara.sch.id',
    role: 'pengurus',
    password: 'password123',
    phone: '085712345679',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_active: true,
  },
  {
    id: 'usr-teacher-1',
    name: 'Hendra Wijaya, S.Pd.',
    email: 'hendra.teacher@smknusantara.sch.id',
    role: 'teacher',
    password: 'password123',
    phone: '081234567891',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_active: true,
  },
];

export const INITIAL_EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 'eks-1',
    name: 'Futsal Garuda Nusantara',
    slug: 'futsal',
    category: 'Olahraga',
    short_description: 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal antar-sekolah.',
    full_description: 'Ekstrakurikuler Futsal Garuda Nusantara memfokuskan pada pengembangan teknik dasar, strategi taktik modern, pembentukan ketahanan fisik, serta pembinaan mental juara. Latihan dipandu langsung oleh pelatih berlisensi nasional dan guru pembina olahraga.',
    profile_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Rizky Ramadhan',
    practice_schedule: 'Setiap Selasa & Sabtu (15:30 - 17:30 WIB)',
    location: 'Lapangan Olahraga Utama',
    member_capacity: 30,
    current_member_count: 24,
    registration_status: 'open',
    achievements_count: 5,
  },
  {
    id: 'eks-2',
    name: 'Programming & Cyber Club',
    slug: 'programming-club',
    category: 'Sains & Teknologi',
    short_description: 'Eksplorasi pembuatan aplikasi web, kecerdasan buatan, algoritma kompetisi, dan keamanan siber.',
    full_description: 'Programming Club berfokus pada pendalaman rekayasa perangkat lunak modern, pengembangan web berbasis framework, pemecahan masalah algoritma competitive programming, serta persiapan Lomba Kompetensi Siswa (LKS) bidang IT Software Solutions.',
    profile_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Aditya Nugraha',
    practice_schedule: 'Setiap Rabu & Jumat (15:30 - 17:00 WIB)',
    location: 'Laboratorium Komputer RPL 1',
    member_capacity: 25,
    current_member_count: 22,
    registration_status: 'open',
    achievements_count: 7,
  },
  {
    id: 'eks-3',
    name: 'Fotografi & Sinematografi Citra',
    slug: 'fotografi',
    category: 'Seni & Budaya',
    short_description: 'Mempelajari teknik komposisi visual, tata cahaya, editing digital, dan produksi video sekolah.',
    full_description: 'Mewadahi minat siswa di bidang karya visual, mulai dari penguasaan kamera mirrorless/DSLR, komposisi pencahayaan studio, street photography, hingga pembuatan film pendek dokumenter kegiatan sekolah.',
    profile_image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Siti Nurhaliza',
    practice_schedule: 'Setiap Kamis (15:30 - 17:30 WIB)',
    location: 'Studio Multimedia & Alam Terbuka',
    member_capacity: 20,
    current_member_count: 18,
    registration_status: 'open',
    achievements_count: 3,
  },
  {
    id: 'eks-4',
    name: 'Teater Citra Nusa',
    slug: 'teater',
    category: 'Seni & Budaya',
    short_description: 'Pengasahan olah vokal, gestur tubuh, penulisan naskah drama, dan seni pertunjukan panggung.',
    full_description: 'Teater Citra Nusa melatih rasa percaya diri, artikulasi berbicara di depan umum, penghayatan karakter, serta kerja tim produksi panggung. Rutin mengadakan pementasan karya orisinal setiap semester.',
    profile_image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Aulia Rahma',
    practice_schedule: 'Setiap Senin & Kamis (15:30 - 17:30 WIB)',
    location: 'Aula Serbaguna Lantai 3',
    member_capacity: 25,
    current_member_count: 15,
    registration_status: 'open',
    achievements_count: 4,
  },
  {
    id: 'eks-5',
    name: 'Basket Nusantara Club',
    slug: 'basket',
    category: 'Olahraga',
    short_description: 'Latihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.',
    full_description: 'Ekstrakurikuler Bola Basket menanamkan kedisiplinan tinggi, latihan fundamental passing, dribbling, shooting, serta simulasi game pertandingan intensif di bawah instruktur berpengalaman.',
    profile_image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Kevin Sanjaya',
    practice_schedule: 'Setiap Rabu & Sabtu (15:30 - 17:30 WIB)',
    location: 'Lapangan Basket Outdoor',
    member_capacity: 30,
    current_member_count: 26,
    registration_status: 'open',
    achievements_count: 2,
  },
  {
    id: 'eks-6',
    name: 'Jurnalistik & Mading Digital',
    slug: 'jurnalistik',
    category: 'Bahasa & Literasi',
    short_description: 'Peliputan berita sekolah, penulisan opini kritis, publikasi buletin, dan pengelolaan portal berita.',
    full_description: 'Klub Jurnalistik bertugas meliput seluruh agenda kegiatan sekolah, mewawancarai narasumber, menulis berita faktual, serta mendesain buletin bulanan cetak maupun platform mading digital sekolah.',
    profile_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Fadhil Pratama',
    practice_schedule: 'Setiap Selasa (15:30 - 17:00 WIB)',
    location: 'Ruang Redaksi Jurnalistik',
    member_capacity: 20,
    current_member_count: 14,
    registration_status: 'open',
    achievements_count: 3,
  },
  {
    id: 'eks-7',
    name: 'Robotika & Otomasi IoT',
    slug: 'robotik',
    category: 'Sains & Teknologi',
    short_description: 'Perakitan robot mikrokontroler Arduino/ESP32, sensorik cerdas, dan Internet of Things.',
    full_description: 'Mempelajari arsitektur elektronika dasar, pemrograman mikrokontroler, perakitan line follower, robot pemadam api, serta perangkat otomasi berbasis IoT untuk solusi kehidupan nyata.',
    profile_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Bima Sakti',
    practice_schedule: 'Setiap Jumat (15:30 - 17:30 WIB)',
    location: 'Laboratorium Mekatronika',
    member_capacity: 20,
    current_member_count: 20,
    registration_status: 'closed',
    achievements_count: 6,
  },
  {
    id: 'eks-8',
    name: 'Musik & Ensambel Nusantara',
    slug: 'musik',
    category: 'Seni & Budaya',
    short_description: 'Eksplorasi band modern dipadukan dengan harmoni alat musik tradisional Nusantara.',
    full_description: 'Ekstrakurikuler Musik memfasilitasi instrumen keyboard, gitar akustik/elektrik, bass, drum, serta kolaborasi alat musik tradisional seperti angklung dan gamelan modern.',
    profile_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Nadya Zulaikha',
    practice_schedule: 'Setiap Sabtu (09:00 - 12:00 WIB)',
    location: 'Ruang Kedap Suara Musik',
    member_capacity: 20,
    current_member_count: 16,
    registration_status: 'open',
    achievements_count: 4,
  },
];

export const INITIAL_MEMBERS: ExtracurricularMember[] = [
  {
    id: 'mem-1',
    extracurricular_id: 'eks-1',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    student_nisn: '0067823910',
    student_class: 'XII RPL 1',
    role: 'Wakil Ketua',
    joined_at: '2024-07-15',
    status: 'active',
  },
  {
    id: 'mem-2',
    extracurricular_id: 'eks-2',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    student_nisn: '0067823910',
    student_class: 'XII RPL 1',
    role: 'Anggota',
    joined_at: '2024-07-20',
    status: 'active',
  },
  {
    id: 'mem-3',
    extracurricular_id: 'eks-1',
    student_id: 'usr-pengurus-1',
    student_name: 'Rizky Ramadhan',
    student_nisn: '0067823911',
    student_class: 'XII RPL 2',
    role: 'Ketua',
    joined_at: '2024-07-15',
    status: 'active',
  },
];

export const INITIAL_REGISTRATIONS: ExtracurricularRegistration[] = [
  {
    id: 'reg-3',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-2',
    student_name: 'Dimas Setiawan',
    student_class: 'X TKJ 1',
    student_nisn: '0078912345',
    registration_date: '2026-09-23T14:15:00Z',
    status: 'pending',
    reason: 'Memiliki dasar teknik futsal dari SMP dan berminat menjadi penjaga gawang tim sekolah.',
  },
  {
    id: 'reg-4',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-3',
    student_name: 'Rafi Alamsyah',
    student_class: 'XI RPL 2',
    student_nisn: '0065432198',
    registration_date: '2026-09-24T09:00:00Z',
    status: 'pending',
    reason: 'Ingin mengasah kemampuan taktik formasi dan menjaga kebugaran jasmani di ekskul futsal.',
  },
  {
    id: 'reg-1',
    extracurricular_id: 'eks-7',
    extracurricular_name: 'Robotika & Otomasi IoT',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    student_class: 'XII RPL 1',
    student_nisn: '0067823910',
    registration_date: '2026-09-22T08:30:00Z',
    status: 'pending',
    reason: 'Ingin mempelajari integrasi web service dengan mikrokontroler IoT untuk smart school.',
    notes: 'Menunggu verifikasi kuota kelas gelombang 2.',
  },
  {
    id: 'reg-2',
    extracurricular_id: 'eks-5',
    extracurricular_name: 'Basket Nusantara Club',
    student_id: 'usr-pengurus-1',
    student_name: 'Rizky Ramadhan',
    student_class: 'XII RPL 2',
    student_nisn: '0067823911',
    registration_date: '2026-09-18T10:15:00Z',
    status: 'approved',
    reason: 'Meningkatkan ketahanan fisik stamina di luar jadwal futsal.',
    notes: 'Disetujui oleh Pembina Olahraga.',
    reviewer_name: 'Hendra Wijaya, S.Pd.',
    reviewed_at: '2026-09-19T14:00:00Z',
  },
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att-sess-1',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    title: 'Latihan Taktik Bertahan & Transisi Menyerang',
    session_date: '2026-09-08',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Olahraga Utama',
    notes: 'Fokus pada kekompakan zona defense 2-2 dan kecepatan counter attack.',
    created_by_name: 'Rizky Ramadhan',
    total_members: 24,
    present_count: 22,
    late_count: 1,
    excused_count: 1,
    absent_count: 0,
  },
  {
    id: 'att-sess-2',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    title: 'Simulasi Pertandingan Friendly Match Antar-Kelas',
    session_date: '2026-09-12',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Olahraga Utama',
    notes: 'Evaluasi eksekusi set piece sepak pojok dan tendangan bebas.',
    created_by_name: 'Rizky Ramadhan',
    total_members: 24,
    present_count: 23,
    late_count: 0,
    excused_count: 1,
    absent_count: 0,
  },
  {
    id: 'att-sess-3',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    title: 'Latihan Ketahanan Fisik & Sprint Interval',
    session_date: '2026-09-15',
    start_time: '15:30',
    end_time: '17:00',
    location: 'Lintasan Lari & Lapangan Utama',
    notes: 'Tes beep test dan evaluasi VO2 Max anggota inti tim futsal.',
    created_by_name: 'Rizky Ramadhan',
    total_members: 24,
    present_count: 21,
    late_count: 2,
    excused_count: 1,
    absent_count: 0,
  },
  {
    id: 'att-sess-4',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    title: 'Briefing Taktik Final Piala Walikota Pelajar',
    session_date: '2026-09-19',
    start_time: '15:30',
    end_time: '17:30',
    location: 'Lapangan Olahraga Utama',
    notes: 'Penetapan starter XI dan strategi menghadapi tim lawan unggulan.',
    created_by_name: 'Rizky Ramadhan',
    total_members: 24,
    present_count: 24,
    late_count: 0,
    excused_count: 0,
    absent_count: 0,
  },
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec-1',
    attendance_session_id: 'att-sess-1',
    session_title: 'Latihan Taktik Bertahan & Transisi Menyerang',
    session_date: '2026-09-08',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    status: 'present',
    notes: 'Hadir tepat waktu dan aktif dalam drill passing.',
    verified_by_name: 'Hendra Wijaya, S.Pd.',
  },
  {
    id: 'rec-2',
    attendance_session_id: 'att-sess-2',
    session_title: 'Simulasi Pertandingan Friendly Match Antar-Kelas',
    session_date: '2026-09-12',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    status: 'present',
    notes: 'Mencetak 2 gol dalam sesi simulasi match.',
    verified_by_name: 'Hendra Wijaya, S.Pd.',
  },
  {
    id: 'rec-3',
    attendance_session_id: 'att-sess-3',
    session_title: 'Latihan Ketahanan Fisik & Sprint Interval',
    session_date: '2026-09-15',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    status: 'late',
    notes: 'Terlambat 10 menit karena praktikum bengkel, tetap menyelesaikan target lari.',
    verified_by_name: 'Hendra Wijaya, S.Pd.',
  },
  {
    id: 'rec-4',
    attendance_session_id: 'att-sess-4',
    session_title: 'Briefing Taktik Final Piala Walikota Pelajar',
    session_date: '2026-09-19',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    status: 'present',
    notes: 'Hadir penuh dalam simulasi taktik.',
    verified_by_name: 'Hendra Wijaya, S.Pd.',
  },
];

export const INITIAL_SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-1',
    title: 'Latihan Rutin Gabungan Olahraga Futsal & Basket',
    event_type: 'extracurricular_practice',
    location: 'Lapangan Olahraga Utama',
    start_datetime: '2026-09-26T15:30:00',
    end_datetime: '2026-09-26T17:30:00',
    description: 'Sesi pemanasan fisik gabungan cabang olahraga sebelum pekan pertandingan.',
    organizer: 'Divisi Olahraga OSIS',
  },
  {
    id: 'ev-2',
    title: 'Pekan Olahraga & Seni (PORSENI) Antar-Kelas',
    event_type: 'school_event',
    location: 'Seluruh Area Sekolah',
    start_datetime: '2026-10-05T08:00:00',
    end_datetime: '2026-10-09T16:00:00',
    description: 'Ajang tahunan unjuk bakat olahraga, kreativitas seni, dan kebersamaan seluruh warga sekolah.',
    organizer: 'OSIS SMK Nusantara Digital',
  },
  {
    id: 'ev-3',
    title: 'Seleksi Daerah Lomba Kompetensi Siswa (LKS) IT',
    event_type: 'competition',
    location: 'Laboratorium Komputer RPL 1',
    start_datetime: '2026-10-14T08:00:00',
    end_datetime: '2026-10-15T17:00:00',
    description: 'Penyaringan kontingen sekolah untuk ajang LKS Tingkat Provinsi Jawa Barat bidang Web Technologies.',
    organizer: 'Program Keahlian RPL',
  },
  {
    id: 'ev-4',
    title: 'Pementasan Teater Akhir Tahun "Lembayung Nusantara"',
    event_type: 'committee_event',
    location: 'Aula Serbaguna Lantai 3',
    start_datetime: '2026-11-20T18:30:00',
    end_datetime: '2026-11-20T21:30:00',
    description: 'Pentas seni kolaborasi teater, paduan suara, dan tari tradisional nusantara.',
    organizer: 'Ekstrakurikuler Teater & Seni',
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    title: 'Turnamen Futsal Piala Walikota Pelajar Tingkat Kota',
    activity_date: '2026-08-20',
    description: 'Mengikuti kompetisi futsal bergengsi tingkat SMA/SMK se-kota Bandung yang diikuti 32 tim unggulan.',
    location: 'GOR Citra Arena Bandung',
    participant_count: 12,
    created_by_name: 'Rizky Ramadhan',
    documentation_urls: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
  },
  {
    id: 'act-2',
    extracurricular_id: 'eks-2',
    extracurricular_name: 'Programming & Cyber Club',
    title: 'Workshop Literasi Koding Siswa SMP Mitra',
    activity_date: '2026-07-28',
    description: 'Melatih dasar-dasar pemrograman logika dan pembuatan website sederhana untuk adik-adik siswa SMP binaan.',
    location: 'SMP Negeri 12 Bandung',
    participant_count: 15,
    created_by_name: 'Dewi Lestari, M.Kom.',
    documentation_urls: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'],
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    title: 'Juara 2 Turnamen Futsal Pelajar Antar-SMK se-Jawa Barat',
    competition_name: 'Walikota Futsal Championship 2026',
    level: 'Provinsi',
    rank: 'Juara 2',
    achievement_date: '2026-08-22',
    certificate_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
    is_verified: true,
    verified_by_name: 'Drs. Bambang Suryono',
    verified_at: '2026-08-25T10:00:00Z',
  },
  {
    id: 'ach-2',
    extracurricular_id: 'eks-2',
    extracurricular_name: 'Programming & Cyber Club',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    title: 'Juara 1 Lomba Kompetensi Siswa (LKS) Web Technologies',
    competition_name: 'LKS SMK Tingkat Kota Bandung 2026',
    level: 'Kota/Kabupaten',
    rank: 'Juara 1',
    achievement_date: '2026-06-15',
    certificate_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
    is_verified: true,
    verified_by_name: 'Drs. Bambang Suryono',
    verified_at: '2026-06-18T14:30:00Z',
  },
  {
    id: 'ach-3',
    extracurricular_id: 'eks-1',
    extracurricular_name: 'Futsal Garuda Nusantara',
    student_id: 'usr-pengurus-1',
    student_name: 'Rizky Ramadhan',
    title: 'Top Scorer Turnamen Walikota Cup 2026 (11 Gol)',
    competition_name: 'Walikota Futsal Championship 2026',
    level: 'Provinsi',
    rank: 'Penghargaan Khusus',
    achievement_date: '2026-08-22',
    certificate_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
    is_verified: true,
    verified_by_name: 'Hendra Wijaya, S.Pd.',
    verified_at: '2026-08-25T10:00:00Z',
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    student_id: 'usr-student-1',
    title: 'Sertifikat Juara 1 LKS Web Technologies 2026',
    issuer: 'Dinas Pendidikan Provinsi Jawa Barat',
    issue_date: '2026-06-20',
    certificate_number: '421.5/0982-Disdik/LKS/2026',
    file_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
    is_verified: true,
  },
  {
    id: 'cert-2',
    student_id: 'usr-student-1',
    title: 'Sertifikat Apresiasi Pemateri Workshop Literasi Digital Pelajar',
    issuer: 'SMK Nusantara Digital x SMPN 12 Bandung',
    issue_date: '2026-07-30',
    certificate_number: 'SMK-ND/SERT/2026/088',
    file_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
    is_verified: true,
  },
];

export const INITIAL_VERIFICATIONS: PortfolioVerification[] = [
  {
    id: 'ver-1',
    student_id: 'usr-student-1',
    student_name: 'Budi Pratama',
    student_nisn: '0067823910',
    student_class: 'XII RPL 1',
    school_name: 'SMK Nusantara Digital',
    verification_id: 'EKH-2026-000184',
    academic_year: '2025/2026',
    issue_date: '2026-09-20',
    status: 'verified',
    qr_code_url: '/verify/EKH-2026-000184',
    verified_by_name: 'Drs. Bambang Suryono',
    summary_data: {
      total_ekskul: 2,
      total_attendance_rate: '96.5%',
      verified_achievements_count: 2,
      active_roles: [
        'Wakil Ketua Futsal Garuda Nusantara',
        'Anggota Inti Programming & Cyber Club',
        'Koordinator Dokumentasi Panitia PORSENI 2026',
      ],
      ekskul_list: [
        { name: 'Futsal Garuda Nusantara', role: 'Wakil Ketua', period: '2024 - 2026' },
        { name: 'Programming & Cyber Club', role: 'Anggota Inti', period: '2024 - 2026' },
      ],
      achievements: [
        { title: 'Juara 1 Lomba Kompetensi Siswa (LKS) Web Technologies', level: 'Kota/Kabupaten', rank: 'Juara 1', year: '2026' },
        { title: 'Juara 2 Turnamen Futsal Pelajar Antar-SMK se-Jawa Barat', level: 'Provinsi', rank: 'Juara 2', year: '2026' },
      ],
      committee_roles: [
        { title: 'Panitia PORSENI SMK Nusantara Digital', role: 'Koordinator Dokumentasi', year: '2026' },
        { title: 'Workshop Koding Siswa SMP', role: 'Pemateri Modul', year: '2026' },
      ],
    },
  },
];

// Persistent state manager
class MockDatabase {
  private users: User[] = [];
  private extracurriculars: Extracurricular[] = [];
  private members: ExtracurricularMember[] = [];
  private registrations: ExtracurricularRegistration[] = [];
  private attendanceSessions: AttendanceSession[] = [];
  private attendanceRecords: AttendanceRecord[] = [];
  private schoolEvents: SchoolEvent[] = [];
  private activities: Activity[] = [];
  private achievements: Achievement[] = [];
  private certificates: Certificate[] = [];
  private verifications: PortfolioVerification[] = [];
  private settings: SchoolSetting = INITIAL_SCHOOL_SETTINGS;

  constructor() {
    this.load();
  }

  private load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.users) {
          const existingIds = new Set(data.users.map((u: any) => u.id));
          const missingDefaults = INITIAL_USERS.filter(u => !existingIds.has(u.id));
          this.users = [...data.users, ...missingDefaults];
        } else {
          this.users = INITIAL_USERS;
        }
        this.extracurriculars = data.extracurriculars || INITIAL_EXTRACURRICULARS;
        this.members = data.members || INITIAL_MEMBERS;
        this.registrations = data.registrations || INITIAL_REGISTRATIONS;
        this.attendanceSessions = data.attendanceSessions || INITIAL_ATTENDANCE_SESSIONS;
        this.attendanceRecords = data.attendanceRecords || INITIAL_ATTENDANCE_RECORDS;
        this.schoolEvents = data.schoolEvents || INITIAL_SCHOOL_EVENTS;
        this.activities = data.activities || INITIAL_ACTIVITIES;
        this.achievements = data.achievements || INITIAL_ACHIEVEMENTS;
        this.certificates = data.certificates || INITIAL_CERTIFICATES;
        this.verifications = data.verifications || INITIAL_VERIFICATIONS;
        this.settings = data.settings || INITIAL_SCHOOL_SETTINGS;
        return;
      } catch (e) {
        console.error('Failed to parse database from localStorage', e);
      }
    }
    // Fallback initialize
    this.resetToDefaults();
  }

  public save() {
    const payload = {
      users: this.users,
      extracurriculars: this.extracurriculars,
      members: this.members,
      registrations: this.registrations,
      attendanceSessions: this.attendanceSessions,
      attendanceRecords: this.attendanceRecords,
      schoolEvents: this.schoolEvents,
      activities: this.activities,
      achievements: this.achievements,
      certificates: this.certificates,
      verifications: this.verifications,
      settings: this.settings,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage (Quota Exceeded?). Data will only persist in memory.', e);
    }
  }

  public resetToDefaults() {
    this.users = [...INITIAL_USERS];
    this.extracurriculars = [...INITIAL_EXTRACURRICULARS];
    this.members = [...INITIAL_MEMBERS];
    this.registrations = [...INITIAL_REGISTRATIONS];
    this.attendanceSessions = [...INITIAL_ATTENDANCE_SESSIONS];
    this.attendanceRecords = [...INITIAL_ATTENDANCE_RECORDS];
    this.schoolEvents = [...INITIAL_SCHOOL_EVENTS];
    this.activities = [...INITIAL_ACTIVITIES];
    this.achievements = [...INITIAL_ACHIEVEMENTS];
    this.certificates = [...INITIAL_CERTIFICATES];
    this.verifications = [...INITIAL_VERIFICATIONS];
    this.settings = { ...INITIAL_SCHOOL_SETTINGS };
    this.save();
  }

  // Getters
  public getUsers() { return this.users; }

  public registerUser(data: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    phone?: string;
  }): { success: boolean; message: string; user?: User } {
    const existing = this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Alamat email sudah terdaftar di sistem.' };
    }
    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      password: data.password || 'password123',
      phone: data.phone || '081234567890',
      avatar_url: data.role === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        : data.role === 'guru'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: true,
    };
    this.users.push(newUser);
    this.save();
    return { success: true, message: 'Pendaftaran akun berhasil!', user: newUser };
  }

  public addUser(data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    is_active?: boolean;
  }): { success: boolean; message: string; user?: User } {
    const existing = this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar untuk pengguna lain.' };
    }
    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      phone: data.phone || '081234567890',
      avatar_url: data.role === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        : data.role === 'guru'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: data.is_active !== undefined ? data.is_active : true,
    };
    this.users.unshift(newUser);
    this.save();
    return { success: true, message: 'Pengguna baru berhasil ditambahkan.', user: newUser };
  }

  public updateUser(id: string, data: Partial<User>): { success: boolean; message: string } {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }
    // If email is changed, check uniqueness
    if (data.email) {
      const emailDup = this.users.find(u => u.id !== id && u.email.toLowerCase() === data.email!.toLowerCase());
      if (emailDup) {
        return { success: false, message: 'Alamat email sudah digunakan oleh pengguna lain.' };
      }
    }
    this.users[idx] = { ...this.users[idx], ...data };
    this.save();
    return { success: true, message: 'Data pengguna berhasil diperbarui.' };
  }

  public deleteUser(id: string): { success: boolean; message: string } {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }
    if (user.role === 'admin' && this.users.filter(u => u.role === 'admin').length <= 1) {
      return { success: false, message: 'Tidak dapat menghapus akun admin utama terakhir.' };
    }
    this.users = this.users.filter(u => u.id !== id);
    this.save();
    return { success: true, message: `Akun ${user.name} (${user.role}) berhasil dihapus dari sistem.` };
  }

  public getSettings() { return this.settings; }
  public getExtracurriculars() { return this.extracurriculars; }
  public getExtracurricularBySlug(slug: string) { return this.extracurriculars.find(e => e.slug === slug); }
  public getExtracurricularById(id: string) { return this.extracurriculars.find(e => e.id === id); }
  public getMembers() { return this.members; }
  public getMembersByExtracurricularId(id: string) { return this.members.filter(m => m.extracurricular_id === id); }
  public getRegistrations() { return this.registrations; }
  public getAttendanceSessions() { return this.attendanceSessions; }
  public getAttendanceRecords() { return this.attendanceRecords; }
  public getSchoolEvents() { return this.schoolEvents; }
  public getActivities() { return this.activities; }
  public getAchievements() { return this.achievements; }
  public getCertificates() { return this.certificates; }
  public getVerifications() { return this.verifications; }
  public getVerificationById(verificationId: string) {
    return this.verifications.find(v => v.verification_id.toLowerCase() === verificationId.toLowerCase());
  }

  // Registrations logic
  public createRegistration(data: {
    extracurricular_id: string;
    student_id: string;
    student_name: string;
    student_class: string;
    student_nisn: string;
    reason: string;
  }): { success: boolean; message: string; registration?: ExtracurricularRegistration } {
    const ekskul = this.getExtracurricularById(data.extracurricular_id);
    if (!ekskul) return { success: false, message: 'Ekstrakurikuler tidak ditemukan' };

    // Check duplicate
    const existing = this.registrations.find(
      r => r.extracurricular_id === data.extracurricular_id &&
           r.student_id === data.student_id &&
           r.status === 'pending'
    );
    if (existing) {
      return { success: false, message: 'Anda sudah memiliki pendaftaran yang sedang diproses untuk ekskul ini.' };
    }

    // Check membership
    const isMember = this.members.some(
      m => m.extracurricular_id === data.extracurricular_id &&
           m.student_id === data.student_id &&
           m.status === 'active'
    );
    if (isMember) {
      return { success: false, message: 'Anda sudah resmi terdaftar sebagai anggota ekskul ini.' };
    }

    // Check capacity
    if (ekskul.current_member_count >= ekskul.member_capacity) {
      return { success: false, message: 'Kapasitas anggota untuk ekskul ini sudah penuh.' };
    }

    const newReg: ExtracurricularRegistration = {
      id: `reg-${Date.now()}`,
      extracurricular_id: data.extracurricular_id,
      extracurricular_name: ekskul.name,
      student_id: data.student_id,
      student_name: data.student_name,
      student_class: data.student_class,
      student_nisn: data.student_nisn,
      registration_date: new Date().toISOString(),
      status: 'pending',
      reason: data.reason,
    };

    this.registrations.unshift(newReg);
    this.save();
    return { success: true, message: 'Pendaftaran berhasil dikirimkan!', registration: newReg };
  }

  public updateRegistrationStatus(id: string, status: 'approved' | 'rejected', reviewerName: string, notes?: string) {
    const reg = this.registrations.find(r => r.id === id);
    if (!reg) return { success: false, message: 'Pendaftaran tidak ditemukan' };

    reg.status = status;
    reg.reviewer_name = reviewerName;
    reg.reviewed_at = new Date().toISOString();
    if (notes) reg.notes = notes;

    if (status === 'approved') {
      // Add to members
      const existingMem = this.members.find(
        m => m.extracurricular_id === reg.extracurricular_id && m.student_id === reg.student_id
      );
      if (!existingMem) {
        this.members.push({
          id: `mem-${Date.now()}`,
          extracurricular_id: reg.extracurricular_id,
          student_id: reg.student_id,
          student_name: reg.student_name,
          student_nisn: reg.student_nisn,
          student_class: reg.student_class,
          role: 'Anggota',
          joined_at: new Date().toISOString().split('T')[0],
          status: 'active',
        });

        // Increase count
        const ekskul = this.getExtracurricularById(reg.extracurricular_id);
        if (ekskul) {
          ekskul.current_member_count += 1;
        }
      }
    }

    this.save();
    return { success: true, message: `Pendaftaran berhasil di-${status === 'approved' ? 'setujui' : 'tolak'}` };
  }

  // Attendance Session
  public createAttendanceSession(data: {
    extracurricular_id: string;
    title: string;
    session_date: string;
    start_time: string;
    end_time: string;
    location: string;
    notes?: string;
    created_by_name: string;
  }) {
    const ekskul = this.getExtracurricularById(data.extracurricular_id);
    if (!ekskul) return { success: false, message: 'Ekskul tidak ditemukan' };

    const members = this.getMembersByExtracurricularId(data.extracurricular_id);
    const newSession: AttendanceSession = {
      id: `att-sess-${Date.now()}`,
      extracurricular_id: data.extracurricular_id,
      extracurricular_name: ekskul.name,
      title: data.title,
      session_date: data.session_date,
      start_time: data.start_time,
      end_time: data.end_time,
      location: data.location,
      notes: data.notes,
      created_by_name: data.created_by_name,
      total_members: members.length,
      present_count: members.length, // default all present
      late_count: 0,
      excused_count: 0,
      absent_count: 0,
    };

    this.attendanceSessions.unshift(newSession);

    // Create default records for each member
    members.forEach(m => {
      this.attendanceRecords.push({
        id: `rec-${Date.now()}-${m.student_id}`,
        attendance_session_id: newSession.id,
        session_title: newSession.title,
        session_date: newSession.session_date,
        extracurricular_name: newSession.extracurricular_name,
        student_id: m.student_id,
        student_name: m.student_name,
        status: 'present',
      });
    });

    this.save();
    return { success: true, session: newSession };
  }

  // Update Attendance Record
  public updateAttendanceRecord(recordId: string, status: 'present' | 'late' | 'excused' | 'absent', notes?: string) {
    const rec = this.attendanceRecords.find(r => r.id === recordId);
    if (!rec) return { success: false, message: 'Presensi tidak ditemukan' };

    rec.status = status;
    if (notes !== undefined) rec.notes = notes;

    // Recalculate session stats
    const sess = this.attendanceSessions.find(s => s.id === rec.attendance_session_id);
    if (sess) {
      const records = this.attendanceRecords.filter(r => r.attendance_session_id === sess.id);
      sess.present_count = records.filter(r => r.status === 'present').length;
      sess.late_count = records.filter(r => r.status === 'late').length;
      sess.excused_count = records.filter(r => r.status === 'excused').length;
      sess.absent_count = records.filter(r => r.status === 'absent').length;
    }

    this.save();
    return { success: true };
  }

  // Add Achievement
  public addAchievement(data: Omit<Achievement, 'id' | 'is_verified'>) {
    const newAch: Achievement = {
      ...data,
      id: `ach-${Date.now()}`,
      is_verified: false,
    };
    this.achievements.unshift(newAch);
    this.save();
    return { success: true, achievement: newAch };
  }

  // Verify Achievement
  public verifyAchievement(id: string, verifierName: string) {
    const ach = this.achievements.find(a => a.id === id);
    if (!ach) return { success: false, message: 'Prestasi tidak ditemukan' };
    ach.is_verified = true;
    ach.verified_by_name = verifierName;
    ach.verified_at = new Date().toISOString();
    this.save();
    return { success: true };
  }

  // Add Certificate / Supporting Document
  public addCertificate(data: Omit<Certificate, 'id' | 'is_verified'> & { is_verified?: boolean }) {
    const newCert: Certificate = {
      ...data,
      id: `cert-${Date.now()}`,
      is_verified: data.is_verified ?? false,
    };
    this.certificates.unshift(newCert);
    this.save();
    return { success: true, certificate: newCert };
  }

  // Event Conflict Detection (Section 7)
  public checkEventConflict(location: string, startDatetime: string, endDatetime: string, excludeId?: string): { hasConflict: boolean; conflictingEvent?: SchoolEvent } {
    const start = new Date(startDatetime).getTime();
    const end = new Date(endDatetime).getTime();

    const conflict = this.schoolEvents.find(e => {
      if (excludeId && e.id === excludeId) return false;
      if (e.location.toLowerCase() !== location.toLowerCase()) return false;

      const eStart = new Date(e.start_datetime).getTime();
      const eEnd = new Date(e.end_datetime).getTime();

      // Check overlap: (start < eEnd) && (end > eStart)
      return start < eEnd && end > eStart;
    });

    return {
      hasConflict: Boolean(conflict),
      conflictingEvent: conflict,
    };
  }

  // Add School Event
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
    this.save();
    return { success: true, event: newEvent };
  }

  // Generate / Verify Portfolio
  public generatePortfolioVerification(studentId: string, verifierName: string): PortfolioVerification {
    const student = this.users.find(u => u.id === studentId);
    const existing = this.verifications.find(v => v.student_id === studentId);
    if (existing) return existing;

    const studentMemberships = this.members.filter(m => m.student_id === studentId);
    const studentAchievements = this.achievements.filter(a => a.student_id === studentId && a.is_verified);
    const studentRecords = this.attendanceRecords.filter(r => r.student_id === studentId);
    const attendedCount = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const rate = studentRecords.length > 0 
      ? Math.round((attendedCount / studentRecords.length) * 100) + '%'
      : '100%';

    const verificationId = `EKH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newVer: PortfolioVerification = {
      id: `ver-${Date.now()}`,
      student_id: studentId,
      student_name: student?.name || 'Siswa',
      student_nisn: '0067823910',
      student_class: 'XII RPL 1',
      school_name: this.settings.school_name,
      verification_id: verificationId,
      academic_year: this.settings.academic_year,
      issue_date: new Date().toISOString().split('T')[0],
      status: 'verified',
      qr_code_url: `/verify/${verificationId}`,
      verified_by_name: verifierName,
      summary_data: {
        total_ekskul: studentMemberships.length,
        total_attendance_rate: rate,
        verified_achievements_count: studentAchievements.length,
        active_roles: studentMemberships.map(m => `${m.role} di ${this.getExtracurricularById(m.extracurricular_id)?.name || 'Ekskul'}`),
        ekskul_list: studentMemberships.map(m => ({
          name: this.getExtracurricularById(m.extracurricular_id)?.name || 'Ekskul',
          role: m.role,
          period: '2024 - 2026',
        })),
        achievements: studentAchievements.map(a => ({
          title: a.title,
          level: a.level,
          rank: a.rank,
          year: a.achievement_date.substring(0, 4),
        })),
        committee_roles: [
          { title: 'Panitia PORSENI SMK Nusantara Digital', role: 'Koordinator Dokumentasi', year: '2026' },
        ],
      },
    };

    this.verifications.push(newVer);
    this.save();
    return newVer;
  }

  public addExtracurricular(data: Omit<Extracurricular, 'id' | 'current_member_count' | 'slug'> & { slug?: string }): { success: boolean; message: string; ekskul?: Extracurricular } {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newEkskul: Extracurricular = {
      ...data,
      id: `eks-${Date.now()}`,
      slug,
      current_member_count: 0,
      achievements_count: 0,
    };
    this.extracurriculars.push(newEkskul);
    this.save();
    return { success: true, message: `Ekstrakurikuler "${newEkskul.name}" berhasil ditambahkan!`, ekskul: newEkskul };
  }

  public updateExtracurricular(id: string, data: Partial<Extracurricular>): { success: boolean; message: string } {
    const idx = this.extracurriculars.findIndex(e => e.id === id);
    if (idx === -1) return { success: false, message: 'Ekstrakurikuler tidak ditemukan' };
    this.extracurriculars[idx] = { ...this.extracurriculars[idx], ...data };
    this.save();
    return { success: true, message: 'Data ekstrakurikuler berhasil diperbarui!' };
  }

  public deleteExtracurricular(id: string): { success: boolean; message: string } {
    const ekskul = this.extracurriculars.find(e => e.id === id);
    if (!ekskul) return { success: false, message: 'Ekstrakurikuler tidak ditemukan' };
    this.extracurriculars = this.extracurriculars.filter(e => e.id !== id);
    this.save();
    return { success: true, message: `Ekstrakurikuler "${ekskul.name}" berhasil dihapus!` };
  }

  public deleteSchoolEvent(id: string): { success: boolean; message: string } {
    this.schoolEvents = this.schoolEvents.filter(e => e.id !== id);
    this.save();
    return { success: true, message: 'Jadwal latihan / agenda berhasil dihapus.' };
  }

  public updateVerificationStatus(verificationId: string, status: 'valid' | 'revoked' | 'pending'): { success: boolean; message: string } {
    const ver = this.verifications.find(v => v.verification_id.toLowerCase() === verificationId.toLowerCase());
    if (!ver) return { success: false, message: 'Dokumen verifikasi tidak ditemukan.' };
    ver.status = status as any;
    this.save();
    return { success: true, message: `Status dokumen ${verificationId} berhasil diperbarui.` };
  }
}

export const db = new MockDatabase();
