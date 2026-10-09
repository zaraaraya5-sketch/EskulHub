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
            'school_name' => 'SMKN 1 Ciomas',
            'npsn' => '20231417',
            'address' => 'Jl. Raya Laladon No. 20, Ciomas, Kec. Ciomas, Kab. Bogor, Jawa Barat 16610',
            'academic_year' => '2025/2026',
            'principal_name' => 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
            'vice_principal_student_affairs' => 'Drs. Bambang Suryono',
        ]);

        // 2. Users
        $users = [
            [
                'id' => 'usr-student-1',
                'name' => 'Budi Pratama',
                'email' => 'budi@smkn1ciomas.sch.id',
                'role' => 'student',
                'password' => Hash::make('password123'),
                'phone' => '085712345678',
                'avatar_url' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                'is_active' => true,
                'nisn' => '0067823910',
                'class_name' => 'XII RPL 1',
                'gender' => 'L',
                'bio' => 'Siswa aktif SMKN 1 Ciomas dengan minat tinggi pada olahraga basket dan futsal.',
            ],
            [
                'id' => 'usr-guru-1',
                'name' => 'Dra. Hj. Sri Wahyuni, M.Pd.',
                'email' => 'sri.wahyuni@smkn1ciomas.sch.id',
                'role' => 'pengurus',
                'password' => Hash::make('password123'),
                'phone' => '081320491823',
                'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
                'is_active' => true,
                'nip' => '197508122002122001',
                'subject' => 'Staf Pengurus Kesiswaan & Ekstrakurikuler',
            ],
            [
                'id' => 'usr-pembina-1',
                'name' => 'Hendra Wijaya, S.Pd.',
                'email' => 'hendra@smkn1ciomas.sch.id',
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
                'email' => 'admin@smkn1ciomas.sch.id',
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
                'email' => 'rizky@smkn1ciomas.sch.id',
                'role' => 'pengurus',
                'password' => Hash::make('password123'),
                'phone' => '085712345679',
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                'is_active' => true,
                'nisn' => '0067823911',
                'class_name' => 'XII RPL 2',
                'gender' => 'L',
                'bio' => 'Ketua Ekstrakurikuler Futsal periode 2025/2026.',
            ],
            [
                'id' => 'usr-teacher-1',
                'name' => 'Hendra Wijaya, S.Pd.',
                'email' => 'hendra.teacher@smkn1ciomas.sch.id',
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
                'name' => 'Futsal',
                'slug' => 'futsal',
                'category' => 'Olahraga',
                'short_description' => 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal pelajar antarsekolah.',
                'full_description' => 'Ekstrakurikuler Futsal memfokuskan pada pengembangan teknik passing, dribbling, strategi taktik modern, pembentukan ketahanan fisik prima, serta pembinaan mental juara dalam turnamen antarsekolah.',
                'profile_image' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
                'supervisor_name' => 'Hendra Wijaya, S.Pd.',
                'chairperson_name' => 'Rizky Ramadhan',
                'practice_schedule' => 'Setiap Selasa & Sabtu (15:30 - 17:30 WIB)',
                'location' => 'Lapangan Futsal SMKN 1 Ciomas',
                'member_capacity' => 30,
                'current_member_count' => 24,
                'registration_status' => 'open',
                'achievements_count' => 5,
                'syllabus' => [
                    ['week' => 1, 'topic' => 'Pengenalan dan Teknik Dasar Passing', 'description' => 'Mempelajari cara passing pendek dan panjang dengan akurasi tinggi.'],
                    ['week' => 2, 'topic' => 'Teknik Dribbling dan Ball Control', 'description' => 'Latihan kelincahan membawa bola dan kontrol bola di ruang sempit.']
                ],
                'achievements' => [
                    ['year' => 2025, 'title' => 'Juara 1 Liga Futsal Pelajar Kabupaten Bogor', 'level' => 'Kota/Kabupaten'],
                    ['year' => 2024, 'title' => 'Juara 2 Turnamen Antar SMK se-Jawa Barat', 'level' => 'Provinsi']
                ],
            ],
            [
                'id' => 'eks-2',
                'name' => 'Basket',
                'slug' => 'basket',
                'category' => 'Olahraga',
                'short_description' => 'Pelatihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.',
                'full_description' => 'Ekstrakurikuler Basket melatih ketangkasan dribbling, passing, shooting, defense solid, dan kerja sama tim solid dalam turnamen antarpelajar se-Kabupaten Bogor.',
                'profile_image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
                'supervisor_name' => 'Hendra Wijaya, S.Pd.',
                'chairperson_name' => 'Kevin Sanjaya',
                'practice_schedule' => 'Setiap Rabu & Sabtu (15:30 - 17:30 WIB)',
                'location' => 'Lapangan Basket Outdoor SMKN 1 Ciomas',
                'member_capacity' => 30,
                'current_member_count' => 26,
                'registration_status' => 'open',
                'achievements_count' => 4,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-3',
                'name' => 'Voli',
                'slug' => 'voli',
                'category' => 'Olahraga',
                'short_description' => 'Pengembangan teknik passing, servis presisi, smash tajam, dan kekompakan tim bola voli.',
                'full_description' => 'Ekstrakurikuler Voli melatih teknik dasar passing atas/bawah, variasi servis menukik, pertahanan receive solid, serta kombinasi spike tajam untuk kejuaraan voli pelajar.',
                'profile_image' => '/images/voli.jpeg',
                'supervisor_name' => 'Agus Setiawan, S.Pd.',
                'chairperson_name' => 'Dimas Pratama',
                'practice_schedule' => 'Setiap Senin & Kamis (15:30 - 17:30 WIB)',
                'location' => 'Lapangan Voli SMKN 1 Ciomas',
                'member_capacity' => 25,
                'current_member_count' => 20,
                'registration_status' => 'open',
                'achievements_count' => 3,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-4',
                'name' => 'Paskibra',
                'slug' => 'paskibra',
                'category' => 'Kepemimpinan',
                'short_description' => 'Penempaan kedisiplinan mental, baris-berbaris (PBB) presisi, dan kepemimpinan bela negara.',
                'full_description' => 'Ekstrakurikuler Paskibra melatih ketahanan fisik, kekompakan langkah tegap, formasi variasi PBB indah, serta kesiapan tugas pengibaran bendera hari besar kenegaraan.',
                'profile_image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tBV8kDQOfViGAslYLp1_hJ4v-QxTURbwOSeOu9MR2HDzTgdZpWHVmyMM&s=10',
                'supervisor_name' => 'Dedi Kurniawan, S.Pd.',
                'chairperson_name' => 'Farhan Ramadhan',
                'practice_schedule' => 'Setiap Selasa & Kamis (15:30 - 17:30 WIB)',
                'location' => 'Lapangan Upacara Utama SMKN 1 Ciomas',
                'member_capacity' => 35,
                'current_member_count' => 28,
                'registration_status' => 'open',
                'achievements_count' => 6,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-5',
                'name' => 'Pramuka',
                'slug' => 'pramuka',
                'category' => 'Kepemimpinan',
                'short_description' => 'Kepanduan, penjelajahan alam, tali-temali pioneering, dan kemandirian karakter pemuda.',
                'full_description' => 'Gugus Depan Pramuka menanamkan Dasa Darma melalui kegiatan survival alam terbuka, pioneering menara/jembatan, sandi morse/semapur, perkemahan, dan pengabdian masyarakat.',
                'profile_image' => '/images/pramuka.jpeg',
                'supervisor_name' => 'Bambang Supriyadi, S.Pd.',
                'chairperson_name' => 'Aditya Pratama',
                'practice_schedule' => 'Setiap Jumat (15:30 - 17:30 WIB)',
                'location' => 'Area Terbuka & Lapangan SMKN 1 Ciomas',
                'member_capacity' => 40,
                'current_member_count' => 32,
                'registration_status' => 'open',
                'achievements_count' => 5,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-6',
                'name' => 'PMR',
                'slug' => 'pmr',
                'category' => 'Kemanusiaan',
                'short_description' => 'Pertolongan pertama (P3K), kesiapsiagaan darurat medis, tandu darurat, dan aksi kemanusiaan.',
                'full_description' => 'Palang Merah Remaja (PMR) melatih ketanggapdaruratan medis, balut bidai, evakuasi tandu, perawatan keluarga, kesiapan tanggap bencana, serta bakti donor darah.',
                'profile_image' => '/images/PMR.jpeg',
                'supervisor_name' => 'Rina Marlina, S.Kep.',
                'chairperson_name' => 'Nabila Safitri',
                'practice_schedule' => 'Setiap Sabtu (08:30 - 11:00 WIB)',
                'location' => 'Ruang UKS & Lapangan SMKN 1 Ciomas',
                'member_capacity' => 30,
                'current_member_count' => 22,
                'registration_status' => 'open',
                'achievements_count' => 4,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-7',
                'name' => 'Rohis',
                'slug' => 'rohis',
                'category' => 'Keagamaan',
                'short_description' => 'Pembinaan akhlak mulia, kajian inspiratif keislaman, tahsin Al-Qur\'an, dan kepedulian sosial.',
                'full_description' => 'Rohani Islam (Rohis) mempererat ukhuwah islamiyah melalui mentoring akhlak, pendalaman ilmu agama, tadarus dan tahsin Al-Qur\'an, peringatan hari besar Islam, dan aksi kepedulian sesama.',
                'profile_image' => '/images/Rohis.jpeg',

                'supervisor_name' => 'Ustadz Ahmad Fauzi, S.Ag.',
                'chairperson_name' => 'Muhammad Ilham',
                'practice_schedule' => 'Setiap Jumat (13:00 - 15:00 WIB)',
                'location' => 'Masjid Al-Kautsar SMKN 1 Ciomas',
                'member_capacity' => 35,
                'current_member_count' => 29,
                'registration_status' => 'open',
                'achievements_count' => 3,
                'syllabus' => [],
                'achievements' => [],
            ],
            [
                'id' => 'eks-8',
                'name' => 'English Club',
                'slug' => 'english-club',
                'category' => 'Bahasa & Literasi',
                'short_description' => 'Membangun kepercayaan diri berbahasa Inggris melalui public speaking, debate, dan storytelling.',
                'full_description' => 'English Club memfasilitasi siswa dalam mengasah speaking fluency, speech competition, English parliamentary debate, persiapan uji kompetensi bahasa, dan penulisan kreatif global.',
                'profile_image' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
                'supervisor_name' => 'Sarah Oktaviani, S.Pd.',
                'chairperson_name' => 'Amanda Putri',
                'practice_schedule' => 'Setiap Rabu (15:30 - 17:00 WIB)',
                'location' => 'Laboratorium Bahasa SMKN 1 Ciomas',
                'member_capacity' => 25,
                'current_member_count' => 21,
                'registration_status' => 'open',
                'achievements_count' => 5,
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Rohis',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'student_class' => 'XII RPL 1',
                'student_nisn' => '0067823910',
                'registration_date' => '2026-09-22T08:30:00Z',
                'status' => 'pending',
                'reason' => 'Ingin memperdalam kajian keagamaan, tahsin Al-Quran, dan aktif dalam kepanitiaan hari besar Islam.',
                'notes' => 'Menunggu verifikasi kuota pembinaan gelombang 2.',
            ],
            [
                'id' => 'reg-2',
                'extracurricular_id' => 'eks-2',
                'extracurricular_name' => 'Basket',
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Futsal',
                'title' => 'Briefing Taktik Final Piala Pelajar Bogor',
                'session_date' => '2026-09-19',
                'start_time' => '15:30',
                'end_time' => '17:30',
                'location' => 'Lapangan Olahraga Utama',
                'notes' => 'Penetapan starter dan strategi menghadapi tim lawan unggulan.',
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Futsal',
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
                'extracurricular_name' => 'Futsal',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'status' => 'late',
                'notes' => 'Terlambat 10 menit karena piket laboratorium, tetap menyelesaikan target lari.',
                'verified_by_name' => 'Hendra Wijaya, S.Pd.',
            ],
            [
                'id' => 'rec-4',
                'attendance_session_id' => 'att-sess-4',
                'session_title' => 'Briefing Taktik Final Piala Pelajar Bogor',
                'session_date' => '2026-09-19',
                'extracurricular_name' => 'Futsal',
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
                'organizer' => 'Kesiswaan & Pembina Olahraga',
            ],
            [
                'id' => 'ev-2',
                'title' => 'Pekan Olahraga & Seni (PORSENI) Antar-Kelas',
                'event_type' => 'school_event',
                'location' => 'Seluruh Area Sekolah',
                'start_datetime' => '2026-10-05T08:00:00',
                'end_datetime' => '2026-10-09T16:00:00',
                'description' => 'Ajang tahunan unjuk bakat olahraga, kreativitas seni, dan kebersamaan seluruh warga SMKN 1 Ciomas.',
                'organizer' => 'OSIS SMKN 1 Ciomas',
            ],
            [
                'id' => 'ev-3',
                'title' => 'Latihan Gabungan Paskibra & Pramuka Persiapan Upacara',
                'event_type' => 'school_event',
                'location' => 'Lapangan Utama SMKN 1 Ciomas',
                'start_datetime' => '2026-10-14T08:00:00',
                'end_datetime' => '2026-10-14T11:00:00',
                'description' => 'Gladi bersih upacara bendera gabungan Paskibra dan Pramuka.',
                'organizer' => 'Paskibra & Pramuka',
            ],
            [
                'id' => 'ev-4',
                'title' => 'English Speech & Debate Showcase',
                'event_type' => 'committee_event',
                'location' => 'Aula Serbaguna Lantai 3',
                'start_datetime' => '2026-11-20T13:30:00',
                'end_datetime' => '2026-11-20T16:30:00',
                'description' => 'Unjuk kemahiran pidato dan debat bahasa Inggris siswa-siswi.',
                'organizer' => 'English Club',
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
                'extracurricular_name' => 'Futsal',
                'title' => 'Turnamen Futsal Pelajar Tingkat Kabupaten Bogor',
                'activity_date' => '2026-08-20',
                'description' => 'Mengikuti kompetisi futsal bergengsi tingkat SMA/SMK se-Kabupaten Bogor yang diikuti 32 tim unggulan.',
                'location' => 'GOR Pajajaran Bogor',
                'participant_count' => 12,
                'created_by_name' => 'Rizky Ramadhan',
                'documentation_urls' => ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
            ],
            [
                'id' => 'act-2',
                'extracurricular_id' => 'eks-2',
                'extracurricular_name' => 'Basket',
                'title' => 'Exhibition Match Basket Pelajar Bogor Barat',
                'activity_date' => '2026-07-28',
                'description' => 'Pertandingan persahabatan bola basket mempererat silaturahmi antar-sekolah di wilayah Bogor Barat.',
                'location' => 'Lapangan Basket SMKN 1 Ciomas',
                'participant_count' => 15,
                'created_by_name' => 'Hendra Wijaya, S.Pd.',
                'documentation_urls' => ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
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
                'extracurricular_name' => 'Futsal',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'title' => 'Juara 2 Turnamen Futsal Pelajar Antar-SMK se-Jawa Barat',
                'competition_name' => 'Bogor Student Futsal Championship 2026',
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
                'extracurricular_name' => 'Basket',
                'student_id' => 'usr-student-1',
                'student_name' => 'Budi Pratama',
                'title' => 'Juara 1 Turnamen 3x3 Basket Pelajar Bogor',
                'competition_name' => 'Bogor Youth 3x3 Basketball 2026',
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
                'extracurricular_name' => 'Futsal',
                'student_id' => 'usr-pengurus-1',
                'student_name' => 'Rizky Ramadhan',
                'title' => 'Top Scorer Turnamen Pelajar Bogor 2026 (11 Gol)',
                'competition_name' => 'Bogor Student Futsal Championship 2026',
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
                'title' => 'Sertifikat Juara 1 Turnamen 3x3 Basket Pelajar 2026',
                'issuer' => 'Perbasi Kabupaten Bogor',
                'issue_date' => '2026-06-20',
                'certificate_number' => '421.5/0982-Perbasi/Bgr/2026',
                'file_url' => 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
                'is_verified' => true,
            ],
            [
                'id' => 'cert-2',
                'student_id' => 'usr-student-1',
                'title' => 'Sertifikat Apresiasi Pemain Terbaik Liga Futsal Pelajar',
                'issuer' => 'SMKN 1 Ciomas x Dispora Kabupaten Bogor',
                'issue_date' => '2026-07-30',
                'certificate_number' => 'SMKN1-CMS/SERT/2026/088',
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
                'school_name' => 'SMKN 1 Ciomas',
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
                        'Wakil Ketua Futsal',
                        'Anggota Inti Basket',
                        'Koordinator Dokumentasi Panitia PORSENI 2026',
                    ],
                    'ekskul_list' => [
                        ['name' => 'Futsal', 'role' => 'Wakil Ketua', 'period' => '2024 - 2026'],
                        ['name' => 'Basket', 'role' => 'Anggota Inti', 'period' => '2024 - 2026'],
                    ],
                    'achievements' => [
                        ['title' => 'Juara 1 Turnamen 3x3 Basket Pelajar Bogor', 'level' => 'Kota/Kabupaten', 'rank' => 'Juara 1', 'year' => '2026'],
                        ['title' => 'Juara 2 Turnamen Futsal Pelajar Antar-SMK se-Jawa Barat', 'level' => 'Provinsi', 'rank' => 'Juara 2', 'year' => '2026'],
                    ],
                    'committee_roles' => [
                        ['title' => 'Panitia PORSENI SMKN 1 Ciomas', 'role' => 'Koordinator Dokumentasi', 'year' => '2026'],
                        ['title' => 'Bakti Sosial PMR & Pramuka', 'role' => 'Relawan Lapangan', 'year' => '2026'],
                    ],
                ],
            ],
        ];
        foreach ($verifications as $v) {
            PortfolioVerification::create($v);
        }

        // 11. Events and User Extracurriculars
        $this->call(EventAndUserExtracurricularSeeder::class);
    }
}
