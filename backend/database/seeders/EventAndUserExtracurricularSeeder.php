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
                'organizer' => 'OSIS SMKN 1 Ciomas',
                'description' => 'Ajang tahunan unjuk bakat olahraga, kreativitas seni, dan kebersamaan seluruh warga SMKN 1 Ciomas.',
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
                'title' => 'Latihan Taktik & Pressing Futsal',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-09-29 15:30:00',
                'end_time' => '2026-09-29 17:30:00',
                'location' => 'Lapangan Olahraga Utama',
                'organizer' => 'Futsal',
                'description' => 'Pematangan taktik pressing cepat dan transisi permainan 2-2 menjelang turnamen pelajar.',
            ],
            [
                'id' => 'evt-trn-2',
                'title' => 'Latihan Fisik & Simulasi Friendly Match Futsal',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-10-03 15:30:00',
                'end_time' => '2026-10-03 17:30:00',
                'location' => 'Lapangan Olahraga Utama',
                'organizer' => 'Futsal',
                'description' => 'Simulasi pertandingan uji coba game plan dan koordinasi antar lini.',
            ],

            // Extracurricular Training (Basket - eks-2)
            [
                'id' => 'evt-trn-3',
                'title' => 'Drill Fundamental Shooting & Defense Basket',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-2',
                'start_time' => '2026-09-30 15:30:00',
                'end_time' => '2026-09-30 17:30:00',
                'location' => 'Lapangan Basket SMKN 1 Ciomas',
                'organizer' => 'Basket',
                'description' => 'Latihan teknik dasar shooting, passing akurat, dan transisi defense lapangan penuh.',
            ],
            [
                'id' => 'evt-trn-4',
                'title' => 'Scrimmage Match & Fast-Break Execution Basket',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-2',
                'start_time' => '2026-10-02 14:00:00',
                'end_time' => '2026-10-02 16:30:00',
                'location' => 'Lapangan Basket SMKN 1 Ciomas',
                'organizer' => 'Basket',
                'description' => 'Simulasi scrimmage internal untuk melatih eksekusi fast break dan zonal defense.',
            ],

            // Competitions (Futsal - eks-1)
            [
                'id' => 'evt-cmp-1',
                'title' => 'Babak Penyisihan Liga Futsal Pelajar Bogor',
                'category' => 'competition',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-10-02 13:00:00',
                'end_time' => '2026-10-02 15:00:00',
                'location' => 'GOR Pajajaran Bogor',
                'organizer' => 'Dispora Kabupaten Bogor',
                'description' => 'Pertandingan matchday ke-1 penyisihan grup menghadapi tim SMK wilayah Bogor.',
            ],

            // Extracurricular Training (Voli - eks-3)
            [
                'id' => 'evt-trn-5',
                'title' => 'Latihan Servis, Passing & Spike Voli',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-3',
                'start_time' => '2026-10-03 08:30:00',
                'end_time' => '2026-10-03 10:30:00',
                'location' => 'Lapangan Voli Outdoor',
                'organizer' => 'Voli',
                'description' => 'Latihan pembentukan passing bawah konsisten, jumping spike, dan positioning block.',
            ],

            // Extracurricular Training (Paskibra - eks-4)
            [
                'id' => 'evt-trn-6',
                'title' => 'Latihan Formasi Baris-Berbaris Paskibra',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-4',
                'start_time' => '2026-10-01 15:30:00',
                'end_time' => '2026-10-01 17:30:00',
                'location' => 'Lapangan Utama SMKN 1 Ciomas',
                'organizer' => 'Paskibra',
                'description' => 'Penyeragaman gerakan baris-berbaris (PBB) dan pemantapan formasi pengibaran bendera.',
            ],

            // Template activities for SMKN 1 Ciomas
            [
                'id' => 'evt-tpl-1',
                'title' => 'Latihan Fisik & Taktik Futsal',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-1',
                'start_time' => '2026-10-10 15:30:00',
                'end_time' => '2026-10-10 17:30:00',
                'location' => 'Lapangan Futsal SMKN 1 Ciomas',
                'organizer' => 'Futsal',
                'description' => 'Latihan ketahanan fisik, passing pendek, dan simulasi strategi tanding mingguan.',
            ],
            [
                'id' => 'evt-tpl-2',
                'title' => 'Simulasi Tanding Basket Antarregu',
                'category' => 'competition',
                'extracurricular_id' => 'eks-2',
                'start_time' => '2026-10-12 15:30:00',
                'end_time' => '2026-10-12 17:30:00',
                'location' => 'Lapangan Basket Outdoor SMKN 1 Ciomas',
                'organizer' => 'Basket',
                'description' => 'Uji coba pola penyerangan dan pertahanan sebelum turnamen pelajar se-Bogor.',
            ],
            [
                'id' => 'evt-tpl-3',
                'title' => 'Latihan Baris-Berbaris & Variasi Formasi',
                'category' => 'extracurricular_training',
                'extracurricular_id' => 'eks-4',
                'start_time' => '2026-10-13 15:30:00',
                'end_time' => '2026-10-13 17:30:00',
                'location' => 'Lapangan Upacara Utama SMKN 1 Ciomas',
                'organizer' => 'Paskibra',
                'description' => 'Pemantapan langkah tegap, tempo baris-berbaris, dan formasi pengibaran bendera.',
            ],
            [
                'id' => 'evt-tpl-4',
                'title' => 'Kajian Rutin & Mentoring Adab Pelajar',
                'category' => 'school_event',
                'extracurricular_id' => null,
                'start_time' => '2026-10-16 13:00:00',
                'end_time' => '2026-10-16 15:00:00',
                'location' => 'Masjid Al-Kautsar SMKN 1 Ciomas',
                'organizer' => 'Rohis',
                'description' => 'Kajian keagamaan tematik, tadarus bersama, dan bimbingan adab bagi siswa.',
            ],
            [
                'id' => 'evt-tpl-5',
                'title' => 'Praktik Pertolongan Pertama & Balut Bidai',
                'category' => 'extracurricular_training',
                'extracurricular_id' => null,
                'start_time' => '2026-10-17 08:30:00',
                'end_time' => '2026-10-17 11:00:00',
                'location' => 'Ruang UKS & Area Terbuka SMKN 1 Ciomas',
                'organizer' => 'PMR',
                'description' => 'Materi balut bidai patah tulang, evakuasi tandu darurat, dan penanganan luka ringan.',
            ],
            [
                'id' => 'evt-tpl-6',
                'title' => 'English Speech & Debate Practice',
                'category' => 'extracurricular_training',
                'extracurricular_id' => null,
                'start_time' => '2026-10-21 15:30:00',
                'end_time' => '2026-10-21 17:00:00',
                'location' => 'Laboratorium Bahasa SMKN 1 Ciomas',
                'organizer' => 'English Club',
                'description' => 'Latihan public speaking, debat parlemen, dan pelafalan kosakata bahasa Inggris.',
            ],
        ];

        foreach ($events as $e) {
            DB::table('events')->updateOrInsert(
                ['id' => $e['id']],
                array_merge($e, [
                    'created_by_id' => 'usr-guru-1',
                    'created_by_role' => 'pengurus',
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );

            DB::table('school_events')->updateOrInsert(
                ['id' => $e['id']],
                [
                    'id' => $e['id'],
                    'title' => $e['title'],
                    'event_type' => $e['category'],
                    'category' => $e['category'],
                    'location' => $e['location'],
                    'start_datetime' => $e['start_time'],
                    'end_datetime' => $e['end_time'],
                    'organizer' => $e['organizer'],
                    'description' => $e['description'] ?? null,
                    'created_by_id' => 'usr-guru-1',
                    'created_by_role' => 'pengurus',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
