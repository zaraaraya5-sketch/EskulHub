<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\UserExtracurricular;
use App\Models\EkskulMember;
use Illuminate\Support\Facades\DB;

class EventAndUserExtracurricularSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Sync from ekskul_members to user_extracurriculars
        $members = DB::table('ekskul_members')->get();
        foreach ($members as $m) {
            DB::table('user_extracurriculars')->updateOrInsert(
                [
                    'user_id' => $m->student_id,
                    'extracurricular_id' => $m->extracurricular_id,
                ],
                [
                    'role' => $m->role ?? 'Anggota',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Explicitly ensure user 'usr-student-1' (Budi) is in Futsal ('eks-1') and Programming Club ('eks-2')
        DB::table('user_extracurriculars')->updateOrInsert(
            ['user_id' => 'usr-student-1', 'extracurricular_id' => 'eks-1'],
            ['role' => 'Anggota', 'created_at' => now(), 'updated_at' => now()]
        );
        DB::table('user_extracurriculars')->updateOrInsert(
            ['user_id' => 'usr-student-1', 'extracurricular_id' => 'eks-2'],
            ['role' => 'Anggota', 'created_at' => now(), 'updated_at' => now()]
        );

        // Ensure user 'usr-pengurus-1' (Rizky Ramadhan) is in Futsal ('eks-1')
        DB::table('user_extracurriculars')->updateOrInsert(
            ['user_id' => 'usr-pengurus-1', 'extracurricular_id' => 'eks-1'],
            ['role' => 'Ketua', 'created_at' => now(), 'updated_at' => now()]
        );

        // 2. Events data: National Holidays, School Events, Extracurricular Training, Competitions
        $events = [
            // Public / National Holiday
            [
                'id' => 'evt-hol-1',
                'title' => 'Hari Kesaktian Pancasila',
                'category' => 'national_holiday',
                'extracurricular_id' => null,
                'start_time' => '2026-10-01 07:00:00',
                'end_time' => '2026-10-01 17:00:00',
                'location' => 'Nasional / Sekolah',
                'organizer' => 'Pemerintah RI / Humas Sekolah',
                'description' => 'Peringatan Hari Kesaktian Pancasila. Seluruh kegiatan belajar mengajar dan ekstrakurikuler libur nasional.',
            ],
            [
                'id' => 'evt-hol-2',
                'title' => 'Hari Sumpah Pemuda',
                'category' => 'national_holiday',
                'extracurricular_id' => null,
                'start_time' => '2026-10-28 07:00:00',
                'end_time' => '2026-10-28 17:00:00',
                'location' => 'Nasional / Lapangan Utama',
                'organizer' => 'Pemerintah RI / Kesiswaan',
                'description' => 'Upacara peringatan Hari Sumpah Pemuda ke-98 mengenakan pakaian adat Nusantara.',
            ],

            // School Events
            [
                'id' => 'evt-sch-1',
                'title' => 'Upacara Bendera Awal Pekan',
                'category' => 'school_event',
                'extracurricular_id' => null,
                'start_time' => '2026-09-28 07:00:00',
                'end_time' => '2026-09-28 08:15:00',
                'location' => 'Lapangan Olahraga Utama',
                'organizer' => 'Kesiswaan & Paskibra',
                'description' => 'Upacara bendera rutin senin pagi dihadiri seluruh dewan guru, staf, dan siswa.',
            ],
            [
                'id' => 'evt-sch-2',
                'title' => 'Sosialisasi Persiapan Asesmen Bakat & Minat (ABM)',
                'category' => 'school_event',
                'extracurricular_id' => null,
                'start_time' => '2026-09-30 09:30:00',
                'end_time' => '2026-09-30 11:30:00',
                'location' => 'Aula Serbaguna Lantai 3',
                'organizer' => 'Bimbingan Konseling (BK) & Kurikulum',
                'description' => 'Pengarahan pemetaan minat bakat dan portofolio kejuruan bagi seluruh siswa kelas XII.',
            ],
            [
                'id' => 'evt-sch-3',
                'title' => 'Pekan Olahraga & Seni (PORSENI) Antar-Kelas',
                'category' => 'school_event',
                'extracurricular_id' => null,
                'start_time' => '2026-10-05 08:00:00',
                'end_time' => '2026-10-09 16:00:00',
                'location' => 'Seluruh Area Sekolah',
                'organizer' => 'OSIS SMK Nusantara Digital',
                'description' => 'Ajang tahunan unjuk bakat olahraga, kreativitas seni, dan kebersamaan seluruh warga sekolah.',
            ],
            [
                'id' => 'evt-sch-4',
                'title' => 'Senam Kebugaran Jasmani (SKJ) Bersama',
                'category' => 'school_event',
                'extracurricular_id' => null,
                'start_time' => '2026-10-02 07:00:00',
                'end_time' => '2026-10-02 08:00:00',
                'location' => 'Lapangan Olahraga Utama',
                'organizer' => 'Guru Penjas & Kesiswaan',
                'description' => 'Senam pagi Jumat sehat untuk seluruh dewan guru dan siswa.',
            ],

            // Extracurricular Training (Futsal - eks-1)
            [
                'id' => 'evt-trn-1',
                'title' => 'Latihan Taktik & Pressing Futsal Garuda',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-09-29 15:30:00',
                'end_time' => '2026-09-29 17:30:00',
                'location' => 'Lapangan Olahraga Utama',
                'organizer' => 'Futsal Garuda Nusantara',
                'description' => 'Pematangan taktik pressing cepat dan transisi permainan 2-2 menjelang liga pelajar.',
            ],
            [
                'id' => 'evt-trn-2',
                'title' => 'Latihan Fisik & Simulasi Friendly Match Futsal',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-10-03 15:30:00',
                'end_time' => '2026-10-03 17:30:00',
                'location' => 'Lapangan Olahraga Utama',
                'organizer' => 'Futsal Garuda Nusantara',
                'description' => 'Simulasi pertandingan uji coba game plan dan koordinasi antar lini.',
            ],

            // Extracurricular Training (Programming Club - eks-2)
            [
                'id' => 'evt-trn-3',
                'title' => 'Coding Session: Competitive Programming & Algoritma',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-2',
                'start_time' => '2026-09-30 15:30:00',
                'end_time' => '2026-09-30 17:30:00',
                'location' => 'Laboratorium Komputer RPL 1',
                'organizer' => 'Programming & Cyber Club',
                'description' => 'Bedah soal dynamic programming, graph traversal, dan optimasi runtime untuk seleksi LKS.',
            ],
            [
                'id' => 'evt-trn-4',
                'title' => 'Workshop Full-Stack Web: React & Laravel API',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-2',
                'start_time' => '2026-10-02 14:00:00',
                'end_time' => '2026-10-02 16:30:00',
                'location' => 'Laboratorium Komputer RPL 1',
                'organizer' => 'Programming & Cyber Club',
                'description' => 'Hands-on pembuatan REST API Laravel dan integrasi frontend React modern.',
            ],

            // Competitions (Futsal - eks-1)
            [
                'id' => 'evt-cmp-1',
                'title' => 'Babak Penyisihan Liga Pelajar Futsal Kota Bandung',
                'category' => 'competition',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-10-02 13:00:00',
                'end_time' => '2026-10-02 15:00:00',
                'location' => 'GOR Tri Lomba Juang Bandung',
                'organizer' => 'Dispora Kota Bandung',
                'description' => 'Pertandingan matchday ke-1 penyisihan grup menghadapi SMK Pasundan.',
            ],

            // Extracurricular Training (Basket - eks-5) - user 'usr-student-1' is NOT member
            [
                'id' => 'evt-trn-5',
                'title' => 'Drill Fundamental Shooting & Defense Basket',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-5',
                'start_time' => '2026-10-03 08:30:00',
                'end_time' => '2026-10-03 10:30:00',
                'location' => 'Lapangan Basket Outdoor',
                'organizer' => 'Basket Nusantara Club',
                'description' => 'Latihan fisik pagi, peningkatan persentase shooting dan fast-break execution.',
            ],

            // Extracurricular Training (Fotografi - eks-3)
            [
                'id' => 'evt-trn-6',
                'title' => 'Hunting Visual & Lighting Studio Fotografi',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-3',
                'start_time' => '2026-10-01 15:30:00',
                'end_time' => '2026-10-01 17:30:00',
                'location' => 'Studio Multimedia & Alam Terbuka',
                'organizer' => 'Fotografi Citra',
                'description' => 'Teknik tiga titik pencahayaan (key, fill, back light) dan komposisi still life.',
            ],
        ];

        foreach ($events as $e) {
            DB::table('events')->updateOrInsert(
                ['id' => $e['id']],
                array_merge($e, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
