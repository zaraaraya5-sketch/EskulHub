<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ekskul;
use App\Models\EkskulMember;
use App\Models\Registration;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use App\Models\SchoolEvent;
use App\Models\Activity;
use App\Models\Achievement;
use App\Models\Certificate;
use App\Models\PortfolioVerification;
use App\Models\SchoolSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. School Settings
        SchoolSetting::create([
            'school_name' => 'SMK Nusantara Digital',
            'npsn' => '20103482',
            'address' => 'Jl. Pendidikan Merdeka No. 45, Kota Bandung, Jawa Barat',
            'academic_year' => '2025/2026',
            'principal_name' => 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
            'vice_principal_student_affairs' => 'Drs. Bambang Suryono',
        ]);

        // 2. Users
        $users = [
            [
                'id' => 'usr-student-1',
                'name' => 'Budi Pratama',
                'email' => 'budi@smknusantara.sch.id',
                'role' => 'student',
                'password' => Hash::make('password123'),
                'phone' => '085712345678',
                'avatar_url' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                'is_active' => true,
                'nisn' => '0067823910',
                'class_name' => 'XII RPL 1',
                'gender' => 'L',
                'bio' => 'Siswa aktif jurusan RPL dengan minat tinggi pada competitive coding dan olahraga futsal.',
            ],
            [
                'id' => 'usr-guru-1',
                'name' => 'Dra. Hj. Sri Wahyuni, M.Pd.',
                'email' => 'sri.wahyuni@smknusantara.sch.id',
                'role' => 'guru',
                'password' => Hash::make('password123'),
                'phone' => '081320491823',
                'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
                'is_active' => true,
                'nip' => '197508122002122001',
                'subject' => 'Wali Kelas XII RPL 1 & Guru Bahasa Indonesia',
            ],
            [
                'id' => 'usr-pembina-1',
                'name' => 'Hendra Wijaya, S.Pd.',
                'email' => 'hendra@smknusantara.sch.id',
                'role' => 'pembina',
                'password' => Hash::make('password123'),
                'phone' => '081234567891',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                'is_active' => true,
                'nip' => '198204152008011007',
                'subject' => 'Guru Pendidikan Jasmani & Pembina Ekskul Futsal',
            ],
            [
                'id' => 'usr-admin-1',
                'name' => 'Drs. Bambang Suryono',
                'email' => 'admin@smknusantara.sch.id',
                'role' => 'admin',
                'password' => Hash::make('password123'),
                'phone' => '081234567890',
                'avatar_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                'is_active' => true,
                'nip' => '196803201994031004',
                'subject' => 'Wakil Kepala Sekolah Bidang Kesiswaan',
            ],
            [
                'id' => 'usr-pengurus-1',
                'name' => 'Rizky Ramadhan',
                'email' => 'rizky@smknusantara.sch.id',
                'role' => 'pengurus',
                'password' => Hash::make('password123'),
                'phone' => '085712345679',
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                'is_active' => true,
                'nisn' => '0067823911',
                'class_name' => 'XII RPL 2',
                'gender' => 'L',
                'bio' => 'Ketua Ekstrakurikuler Futsal Garuda Nusantara periode 2025/2026.',
            ],
            [
                'id' => 'usr-teacher-1',
                'name' => 'Hendra Wijaya, S.Pd.',
                'email' => 'hendra.teacher@smknusantara.sch.id',
                'role' => 'teacher',
                'password' => Hash::make('password123'),
                'phone' => '081234567891',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                'is_active' => true,
                'nip' => '198204152008011007',
                'subject' => 'Guru Pendidikan Jasmani & Pembina Ekskul Futsal',
            ],
        ];

        foreach ($users as $u) {
            User::create($u);
        }

        // 3. Extracurriculars
        $ekskuls = [
            [
                'id' => 'eks-1',
                'name' => 'Futsal Garuda Nusantara',
                'slug' => 'futsal',
                'category' => 'Olahraga',
                'short_description' => 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal antar-sekolah.',
                'full_description' => 'Ekstrakurikuler Futsal Garuda Nusantara memfokuskan pada pengembangan teknik dasar, strategi taktik modern, pembentukan ketahanan fisik, serta pembinaan mental juara. Latihan dipandu langsung oleh pelatih berlisensi nasional dan guru pembina olahraga.',
                'profile_image' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
                'supervisor_name' => 'Hendra Wijaya, S.Pd.',
                'chairperson_name' => 'Rizky Ramadhan',
                'practice_schedule' => 'Setiap Selasa & Sabtu (15:30 - 17:30 WIB)',
                'location' => 'Lapangan Olahraga Utama',
                'member_capacity' => 30,
                'current_member_count' => 24,
                'registration_status' => 'open',
                'achievements_count' => 5,
                'syllabus' => [
                    ['week' => 1, 'topic' => 'Pengenalan dan Teknik Dasar Passing', 'description' => 'Mempelajari cara passing pendek dan panjang dengan akurasi tinggi.'],
                    ['week' => 2, 'topic' => 'Teknik Dribbling dan Ball Control', 'description' => 'Latihan kelincahan membawa bola dan kontrol bola di ruang sempit.']
                ],
                'achievements' => [
                    ['year' => 2025, 'title' => 'Juara 1 Liga Futsal Pelajar Kota Bandung', 'level' => 'Kota/Kabupaten'],
                    ['year' => 2024, 'title' => 'Juara 2 Turnamen Antar SMK se-Jawa Barat', 'level' => 'Provinsi']
                ],
            ],
            [
                'id' => 'eks-2',
                'name' => 'Programming & Cyber Club',
                'slug' => 'programming-club',
                'category' => 'Sains & Teknologi',
                'short_description' => 'Eksplorasi pembuatan aplikasi web, kecerdasan buatan, algoritma kompetisi, dan keamanan siber.',
                'full_description' => 'Programming Club berfokus pada pendalaman rekayasa perangkat lunak modern, pengembangan web berbasis framework, pemecahan masalah algoritma competitive programming, serta persiapan Lomba Kompetensi Siswa (LKS) bidang IT Software Solutions.',
                'profile_image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                'supervisor_name' => 'Dewi Lestari, M.Kom.',
                'chairperson_name' => 'Aditya Nugraha',
                'practice_schedule' => 'Setiap Rabu & Jumat (15:30 - 17:00 WIB)',
                'location' => 'Laboratorium Komputer RPL 1',
                'member_capacity' => 25,
                'current_member_count' => 22,
                'registration_status' => 'open',
                'achievements_count' => 7,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-3',
                'name' => 'Fotografi & Sinematografi Citra',
                'slug' => 'fotografi',
                'category' => 'Seni & Budaya',
                'short_description' => 'Mempelajari teknik komposisi visual, tata cahaya, editing digital, dan produksi video sekolah.',
                'full_description' => 'Mewadahi minat siswa di bidang karya visual, mulai dari penguasaan kamera mirrorless/DSLR, komposisi pencahayaan studio, street photography, hingga pembuatan film pendek dokumenter kegiatan sekolah.',
                'profile_image' => 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
                'supervisor_name' => 'Dewi Lestari, M.Kom.',
                'chairperson_name' => 'Siti Nurhaliza',
                'practice_schedule' => 'Setiap Kamis (15:30 - 17:30 WIB)',
                'location' => 'Studio Multimedia & Alam Terbuka',
                'member_capacity' => 20,
                'current_member_count' => 18,
                'registration_status' => 'open',
                'achievements_count' => 3,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-4',
                'name' => 'Teater Citra Nusa',
                'slug' => 'teater',
                'category' => 'Seni & Budaya',
                'short_description' => 'Pengasahan olah vokal, gestur tubuh, penulisan naskah drama, dan seni pertunjukan panggung.',
                'full_description' => 'Teater Citra Nusa melatih rasa percaya diri, artikulasi berbicara di depan umum, penghayatan karakter, serta kerja tim produksi panggung. Rutin mengadakan pementasan karya orisinal setiap semester.',
                'profile_image' => 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
                'supervisor_name' => 'Hendra Wijaya, S.Pd.',
                'chairperson_name' => 'Aulia Rahma',
                'practice_schedule' => 'Setiap Senin & Kamis (15:30 - 17:30 WIB)',
                'location' => 'Aula Serbaguna Lantai 3',
                'member_capacity' => 25,
                'current_member_count' => 15,
                'registration_status' => 'open',
                'achievements_count' => 4,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-5',
                'name' => 'Basket Nusantara Club',
                'slug' => 'basket',
                'category' => 'Olahraga',
                'short_description' => 'Latihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.',
                'full_description' => 'Ekstrakurikuler Bola Basket menanamkan kedisiplinan tinggi, latihan fundamental passing, dribbling, shooting, serta simulasi game pertandingan intensif di bawah instruktur berpengalaman.',
                'profile_image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
                'supervisor_name' => 'Hendra Wijaya, S.Pd.',
                'chairperson_name' => 'Kevin Sanjaya',
                'practice_schedule' => 'Setiap Rabu & Sabtu (15:30 - 17:30 WIB)',
                'location' => 'Lapangan Basket Outdoor',
                'member_capacity' => 30,
                'current_member_count' => 26,
                'registration_status' => 'open',
                'achievements_count' => 2,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-6',
                'name' => 'Jurnalistik & Mading Digital',
                'slug' => 'jurnalistik',
                'category' => 'Bahasa & Literasi',
                'short_description' => 'Peliputan berita sekolah, penulisan opini kritis, publikasi buletin, dan pengelolaan portal berita.',
                'full_description' => 'Klub Jurnalistik bertugas meliput seluruh agenda kegiatan sekolah, mewawancarai narasumber, menulis berita faktual, serta mendesain buletin bulanan cetak maupun platform mading digital sekolah.',
                'profile_image' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
                'supervisor_name' => 'Dewi Lestari, M.Kom.',
                'chairperson_name' => 'Fadhil Pratama',
                'practice_schedule' => 'Setiap Selasa (15:30 - 17:00 WIB)',
                'location' => 'Ruang Redaksi Jurnalistik',
                'member_capacity' => 20,
                'current_member_count' => 14,
                'registration_status' => 'open',
                'achievements_count' => 3,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-7',
                'name' => 'Robotika & Otomasi IoT',
                'slug' => 'robotik',
                'category' => 'Sains & Teknologi',
                'short_description' => 'Perakitan robot mikrokontroler Arduino/ESP32, sensorik cerdas, dan Internet of Things.',
                'full_description' => 'Mempelajari arsitektur elektronika dasar, pemrograman mikrokontroler, perakitan line follower, robot pemadam api, serta perangkat otomasi berbasis IoT untuk solusi kehidupan nyata.',
                'profile_image' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
                'supervisor_name' => 'Dewi Lestari, M.Kom.',
                'chairperson_name' => 'Bima Sakti',
                'practice_schedule' => 'Setiap Jumat (15:30 - 17:30 WIB)',
                'location' => 'Laboratorium Mekatronika',
                'member_capacity' => 20,
                'current_member_count' => 20,
                'registration_status' => 'closed',
                'achievements_count' => 6,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-8',
                'name' => 'Musik & Ensambel Nusantara',
                'slug' => 'musik',
                'category' => 'Seni & Budaya',
                'short_description' => 'Eksplorasi band modern dipadukan dengan harmoni alat musik tradisional Nusantara.',
                'full_description' => 'Ekstrakurikuler Musik memfasilitasi instrumen keyboard, gitar akustik/elektrik, bass, drum, serta kolaborasi alat musik tradisional seperti angklung dan gamelan modern.',
                'profile_image' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
                'supervisor_name' => 'Hendra Wijaya, S.Pd.',
                'chairperson_name' => 'Nadya Zulaikha',
                'practice_schedule' => 'Setiap Sabtu (09:00 - 12:00 WIB)',
                'location' => 'Ruang Kedap Suara Musik',
                'member_capacity' => 20,
                'current_member_count' => 16,
                'registration_status' => 'open',
                'achievements_count' => 4,
                'syllabus' => [],
                'achievements' => [],
            ],
        ];

        foreach ($ekskuls as $item) {
            Ekskul::create($item);
        }

        // 4. Members
        $members = [
            [
                'id' => 'mem-1',
                'extracurricular_id' => 'eks-1',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'student_nisn' => '0067823910',
                'student_class' => 'XII RPL 1',
                'role' => 'Wakil Ketua',
                'joined_at' => '2024-07-15',
                'status' => 'active',
            ],
            [
                'id' => 'mem-2',
                'extracurricular_id' => 'eks-2',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'student_nisn' => '0067823910',
                'student_class' => 'XII RPL 1',
                'role' => 'Anggota',
                'joined_at' => '2024-07-20',
                'status' => 'active',
            ],
            [
                'id' => 'mem-3',
                'extracurricular_id' => 'eks-1',
                'student_id' => 'usr-pengurus-1',
                'student_name' => 'Rizky Ramadhan',
                'student_nisn' => '0067823911',
                'student_class' => 'XII RPL 2',
                'role' => 'Ketua',
                'joined_at' => '2024-07-15',
                'status' => 'active',
            ],
        ];
        foreach ($members as $m) {
            EkskulMember::create($m);
        }

        // 5. Registrations
        $registrations = [
            [
                'id' => 'reg-3',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-2',
                'student_name' => 'Dimas Setiawan',
                'student_class' => 'X TKJ 1',
                'student_nisn' => '0078912345',
                'registration_date' => '2026-09-23T14:15:00Z',
                'status' => 'pending',
                'reason' => 'Memiliki dasar teknik futsal dari SMP dan berminat menjadi penjaga gawang tim sekolah.',
            ],
            [
                'id' => 'reg-4',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-3',
                'student_name' => 'Rafi Alamsyah',
                'student_class' => 'XI RPL 2',
                'student_nisn' => '0065432198',
                'registration_date' => '2026-09-24T09:00:00Z',
                'status' => 'pending',
                'reason' => 'Ingin mengasah kemampuan taktik formasi dan menjaga kebugaran jasmani di ekskul futsal.',
            ],
            [
                'id' => 'reg-1',
                'extracurricular_id' => 'eks-7',
                'extracurricular_name' => 'Robotika & Otomasi IoT',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'student_class' => 'XII RPL 1',
                'student_nisn' => '0067823910',
                'registration_date' => '2026-09-22T08:30:00Z',
                'status' => 'pending',
                'reason' => 'Ingin mempelajari integrasi web service dengan mikrokontroler IoT untuk smart school.',
                'notes' => 'Menunggu verifikasi kuota kelas gelombang 2.',
            ],
            [
                'id' => 'reg-2',
                'extracurricular_id' => 'eks-5',
                'extracurricular_name' => 'Basket Nusantara Club',
                'student_id' => 'usr-pengurus-1',
                'student_name' => 'Rizky Ramadhan',
                'student_class' => 'XII RPL 2',
                'student_nisn' => '0067823911',
                'registration_date' => '2026-09-18T10:15:00Z',
                'status' => 'approved',
                'reason' => 'Meningkatkan ketahanan fisik stamina di luar jadwal futsal.',
                'notes' => 'Disetujui oleh Pembina Olahraga.',
                'reviewer_name' => 'Hendra Wijaya, S.Pd.',
                'reviewed_at' => '2026-09-19T14:00:00Z',
            ],
        ];
        foreach ($registrations as $r) {
            Registration::create($r);
        }

        // 6. Attendance Sessions
        $sessions = [
            [
                'id' => 'att-sess-1',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'title' => 'Latihan Taktik Bertahan & Transisi Menyerang',
                'session_date' => '2026-09-08',
                'start_time' => '15:30',
                'end_time' => '17:30',
                'location' => 'Lapangan Olahraga Utama',
                'notes' => 'Fokus pada kekompakan zona defense 2-2 dan kecepatan counter attack.',
                'created_by_name' => 'Rizky Ramadhan',
                'total_members' => 24,
                'present_count' => 22,
                'late_count' => 1,
                'excused_count' => 1,
                'absent_count' => 0,
            ],
            [
                'id' => 'att-sess-2',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'title' => 'Simulasi Pertandingan Friendly Match Antar-Kelas',
                'session_date' => '2026-09-12',
                'start_time' => '15:30',
                'end_time' => '17:30',
                'location' => 'Lapangan Olahraga Utama',
                'notes' => 'Evaluasi eksekusi set piece sepak pojok dan tendangan bebas.',
                'created_by_name' => 'Rizky Ramadhan',
                'total_members' => 24,
                'present_count' => 23,
                'late_count' => 0,
                'excused_count' => 1,
                'absent_count' => 0,
            ],
            [
                'id' => 'att-sess-3',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'title' => 'Latihan Ketahanan Fisik & Sprint Interval',
                'session_date' => '2026-09-15',
                'start_time' => '15:30',
                'end_time' => '17:00',
                'location' => 'Lintasan Lari & Lapangan Utama',
                'notes' => 'Tes beep test dan evaluasi VO2 Max anggota inti tim futsal.',
                'created_by_name' => 'Rizky Ramadhan',
                'total_members' => 24,
                'present_count' => 21,
                'late_count' => 2,
                'excused_count' => 1,
                'absent_count' => 0,
            ],
            [
                'id' => 'att-sess-4',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'title' => 'Briefing Taktik Final Piala Walikota Pelajar',
                'session_date' => '2026-09-19',
                'start_time' => '15:30',
                'end_time' => '17:30',
                'location' => 'Lapangan Olahraga Utama',
                'notes' => 'Penetapan starter XI dan strategi menghadapi tim lawan unggulan.',
                'created_by_name' => 'Rizky Ramadhan',
                'total_members' => 24,
                'present_count' => 24,
                'late_count' => 0,
                'excused_count' => 0,
                'absent_count' => 0,
            ],
        ];
        foreach ($sessions as $s) {
            AttendanceSession::create($s);
        }

        // 7. Attendance Records
        $records = [
            [
                'id' => 'rec-1',
                'attendance_session_id' => 'att-sess-1',
                'session_title' => 'Latihan Taktik Bertahan & Transisi Menyerang',
                'session_date' => '2026-09-08',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'status' => 'present',
                'notes' => 'Hadir tepat waktu dan aktif dalam drill passing.',
                'verified_by_name' => 'Hendra Wijaya, S.Pd.',
            ],
            [
                'id' => 'rec-2',
                'attendance_session_id' => 'att-sess-2',
                'session_title' => 'Simulasi Pertandingan Friendly Match Antar-Kelas',
                'session_date' => '2026-09-12',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'status' => 'present',
                'notes' => 'Mencetak 2 gol dalam sesi simulasi match.',
                'verified_by_name' => 'Hendra Wijaya, S.Pd.',
            ],
            [
                'id' => 'rec-3',
                'attendance_session_id' => 'att-sess-3',
                'session_title' => 'Latihan Ketahanan Fisik & Sprint Interval',
                'session_date' => '2026-09-15',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'status' => 'late',
                'notes' => 'Terlambat 10 menit karena praktikum bengkel, tetap menyelesaikan target lari.',
                'verified_by_name' => 'Hendra Wijaya, S.Pd.',
            ],
            [
                'id' => 'rec-4',
                'attendance_session_id' => 'att-sess-4',
                'session_title' => 'Briefing Taktik Final Piala Walikota Pelajar',
                'session_date' => '2026-09-19',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'status' => 'present',
                'notes' => 'Hadir penuh dalam simulasi taktik.',
                'verified_by_name' => 'Hendra Wijaya, S.Pd.',
            ],
        ];
        foreach ($records as $rec) {
            AttendanceRecord::create($rec);
        }

        // 8. School Events
        $events = [
            [
                'id' => 'ev-1',
                'title' => 'Latihan Rutin Gabungan Olahraga Futsal & Basket',
                'event_type' => 'extracurricular_practice',
                'location' => 'Lapangan Olahraga Utama',
                'start_datetime' => '2026-09-26T15:30:00',
                'end_datetime' => '2026-09-26T17:30:00',
                'description' => 'Sesi pemanasan fisik gabungan cabang olahraga sebelum pekan pertandingan.',
                'organizer' => 'Divisi Olahraga OSIS',
            ],
            [
                'id' => 'ev-2',
                'title' => 'Pekan Olahraga & Seni (PORSENI) Antar-Kelas',
                'event_type' => 'school_event',
                'location' => 'Seluruh Area Sekolah',
                'start_datetime' => '2026-10-05T08:00:00',
                'end_datetime' => '2026-10-09T16:00:00',
                'description' => 'Ajang tahunan unjuk bakat olahraga, kreativitas seni, dan kebersamaan seluruh warga sekolah.',
                'organizer' => 'OSIS SMK Nusantara Digital',
            ],
            [
                'id' => 'ev-3',
                'title' => 'Seleksi Daerah Lomba Kompetensi Siswa (LKS) IT',
                'event_type' => 'competition',
                'location' => 'Laboratorium Komputer RPL 1',
                'start_datetime' => '2026-10-14T08:00:00',
                'end_datetime' => '2026-10-15T17:00:00',
                'description' => 'Penyaringan kontingen sekolah untuk ajang LKS Tingkat Provinsi Jawa Barat bidang Web Technologies.',
                'organizer' => 'Program Keahlian RPL',
            ],
            [
                'id' => 'ev-4',
                'title' => 'Pementasan Teater Akhir Tahun "Lembayung Nusantara"',
                'event_type' => 'committee_event',
                'location' => 'Aula Serbaguna Lantai 3',
                'start_datetime' => '2026-11-20T18:30:00',
                'end_datetime' => '2026-11-20T21:30:00',
                'description' => 'Pentas seni kolaborasi teater, paduan suara, dan tari tradisional nusantara.',
                'organizer' => 'Ekstrakurikuler Teater & Seni',
            ],
        ];
        foreach ($events as $e) {
            SchoolEvent::create($e);
        }

        // 9. Activities
        $activities = [
            [
                'id' => 'act-1',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'title' => 'Turnamen Futsal Piala Walikota Pelajar Tingkat Kota',
                'activity_date' => '2026-08-20',
                'description' => 'Mengikuti kompetisi futsal bergengsi tingkat SMA/SMK se-kota Bandung yang diikuti 32 tim unggulan.',
                'location' => 'GOR Citra Arena Bandung',
                'participant_count' => 12,
                'created_by_name' => 'Rizky Ramadhan',
                'documentation_urls' => ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
            ],
            [
                'id' => 'act-2',
                'extracurricular_id' => 'eks-2',
                'extracurricular_name' => 'Programming & Cyber Club',
                'title' => 'Workshop Literasi Koding Siswa SMP Mitra',
                'activity_date' => '2026-07-28',
                'description' => 'Melatih dasar-dasar pemrograman logika dan pembuatan website sederhana untuk adik-adik siswa SMP binaan.',
                'location' => 'SMP Negeri 12 Bandung',
                'participant_count' => 15,
                'created_by_name' => 'Dewi Lestari, M.Kom.',
                'documentation_urls' => ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'],
            ],
        ];
        foreach ($activities as $a) {
            Activity::create($a);
        }

        // 10. Achievements
        $achievements = [
            [
                'id' => 'ach-1',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'title' => 'Juara 2 Turnamen Futsal Pelajar Antar-SMK se-Jawa Barat',
                'competition_name' => 'Walikota Futsal Championship 2026',
                'level' => 'Provinsi',
                'rank' => 'Juara 2',
                'achievement_date' => '2026-08-22',
                'certificate_url' => 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
                'is_verified' => true,
                'verified_by_name' => 'Drs. Bambang Suryono',
                'verified_at' => '2026-08-25T10:00:00Z',
            ],
            [
                'id' => 'ach-2',
                'extracurricular_id' => 'eks-2',
                'extracurricular_name' => 'Programming & Cyber Club',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'title' => 'Juara 1 Lomba Kompetensi Siswa (LKS) Web Technologies',
                'competition_name' => 'LKS SMK Tingkat Kota Bandung 2026',
                'level' => 'Kota/Kabupaten',
                'rank' => 'Juara 1',
                'achievement_date' => '2026-06-15',
                'certificate_url' => 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
                'is_verified' => true,
                'verified_by_name' => 'Drs. Bambang Suryono',
                'verified_at' => '2026-06-18T14:30:00Z',
            ],
            [
                'id' => 'ach-3',
                'extracurricular_id' => 'eks-1',
                'extracurricular_name' => 'Futsal Garuda Nusantara',
                'student_id' => 'usr-pengurus-1',
                'student_name' => 'Rizky Ramadhan',
                'title' => 'Top Scorer Turnamen Walikota Cup 2026 (11 Gol)',
                'competition_name' => 'Walikota Futsal Championship 2026',
                'level' => 'Provinsi',
                'rank' => 'Penghargaan Khusus',
                'achievement_date' => '2026-08-22',
                'certificate_url' => 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
                'is_verified' => true,
                'verified_by_name' => 'Hendra Wijaya, S.Pd.',
                'verified_at' => '2026-08-25T10:00:00Z',
            ],
        ];
        foreach ($achievements as $ach) {
            Achievement::create($ach);
        }

        // 11. Certificates
        $certificates = [
            [
                'id' => 'cert-1',
                'student_id' => 'usr-student-1',
                'title' => 'Sertifikat Juara 1 LKS Web Technologies 2026',
                'issuer' => 'Dinas Pendidikan Provinsi Jawa Barat',
                'issue_date' => '2026-06-20',
                'certificate_number' => '421.5/0982-Disdik/LKS/2026',
                'file_url' => 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
                'is_verified' => true,
            ],
            [
                'id' => 'cert-2',
                'student_id' => 'usr-student-1',
                'title' => 'Sertifikat Apresiasi Pemateri Workshop Literasi Digital Pelajar',
                'issuer' => 'SMK Nusantara Digital x SMPN 12 Bandung',
                'issue_date' => '2026-07-30',
                'certificate_number' => 'SMK-ND/SERT/2026/088',
                'file_url' => 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
                'is_verified' => true,
            ],
        ];
        foreach ($certificates as $c) {
            Certificate::create($c);
        }

        // 12. Portfolio Verifications
        $verifications = [
            [
                'id' => 'ver-1',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'student_nisn' => '0067823910',
                'student_class' => 'XII RPL 1',
                'school_name' => 'SMK Nusantara Digital',
                'verification_id' => 'EKH-2026-000184',
                'academic_year' => '2025/2026',
                'issue_date' => '2026-09-20',
                'status' => 'verified',
                'qr_code_url' => '/verify/EKH-2026-000184',
                'verified_by_name' => 'Drs. Bambang Suryono',
                'summary_data' => [
                    'total_ekskul' => 2,
                    'total_attendance_rate' => '96.5%',
                    'verified_achievements_count' => 2,
                    'active_roles' => [
                        'Wakil Ketua Futsal Garuda Nusantara',
                        'Anggota Inti Programming & Cyber Club',
                        'Koordinator Dokumentasi Panitia PORSENI 2026',
                    ],
                    'ekskul_list' => [
                        ['name' => 'Futsal Garuda Nusantara', 'role' => 'Wakil Ketua', 'period' => '2024 - 2026'],
                        ['name' => 'Programming & Cyber Club', 'role' => 'Anggota Inti', 'period' => '2024 - 2026'],
                    ],
                    'achievements' => [
                        ['title' => 'Juara 1 Lomba Kompetensi Siswa (LKS) Web Technologies', 'level' => 'Kota/Kabupaten', 'rank' => 'Juara 1', 'year' => '2026'],
                        ['title' => 'Juara 2 Turnamen Futsal Pelajar Antar-SMK se-Jawa Barat', 'level' => 'Provinsi', 'rank' => 'Juara 2', 'year' => '2026'],
                    ],
                    'committee_roles' => [
                        ['title' => 'Panitia PORSENI SMK Nusantara Digital', 'role' => 'Koordinator Dokumentasi', 'year' => '2026'],
                        ['title' => 'Workshop Koding Siswa SMP', 'role' => 'Pemateri Modul', 'year' => '2026'],
                    ],
                ],
            ],
        ];
        foreach ($verifications as $v) {
            PortfolioVerification::create($v);
        }
    }
}
