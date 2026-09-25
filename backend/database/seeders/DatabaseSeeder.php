<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ekskul;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Ekskul::create([
            'id' => 'eks-1',
            'name' => 'Futsal Garuda Nusantara',
            'slug' => 'futsal',
            'category' => 'Olahraga',
            'short_description' => 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal antar-sekolah.',
            'full_description' => 'Ekstrakurikuler Futsal Garuda Nusantara memfokuskan pada pengembangan teknik dasar, strategi taktik modern, pembentukan ketahanan fisik, serta pembinaan mental juara. Latihan dipandu langsung oleh pelatih berlisensi nasional dan guru pembina olahraga.',
            'profile_image' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
            'supervisor_name' => 'Hendra Wijaya, S.Pd.',
            'chairman_name' => 'Rizky Ramadhan',
            'schedule_day' => 'Selasa & Jumat',
            'schedule_time' => '15:30 - 17:30 WIB',
            'location' => 'Lapangan Olahraga Utama',
            'max_quota' => 40,
            'current_members' => 38,
            'is_registration_open' => true,
            'syllabus' => [
                ['week' => 1, 'topic' => 'Pengenalan dan Teknik Dasar Passing', 'description' => 'Mempelajari cara passing pendek dan panjang dengan akurasi tinggi.'],
                ['week' => 2, 'topic' => 'Teknik Dribbling dan Ball Control', 'description' => 'Latihan kelincahan membawa bola dan kontrol bola di ruang sempit.']
            ],
            'achievements' => [
                ['year' => 2025, 'title' => 'Juara 1 Liga Futsal Pelajar Kota Bandung', 'level' => 'Kota/Kabupaten'],
                ['year' => 2024, 'title' => 'Juara 2 Turnamen Antar SMK se-Jawa Barat', 'level' => 'Provinsi']
            ],
        ]);

        Ekskul::create([
            'id' => 'eks-2',
            'name' => 'Klub Pemrograman & Robotika',
            'slug' => 'programming-club',
            'category' => 'Sains & Teknologi',
            'short_description' => 'Eksplorasi dunia coding, pengembangan aplikasi, dan perakitan robotika dasar.',
            'full_description' => 'Klub ini dirancang untuk siswa yang memiliki minat mendalam pada teknologi, rekayasa perangkat lunak, dan kecerdasan buatan.',
            'profile_image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800',
            'supervisor_name' => 'Budi Santoso, S.Kom.',
            'chairman_name' => 'Aditya Pratama',
            'schedule_day' => 'Kamis',
            'schedule_time' => '15:30 - 17:30 WIB',
            'location' => 'Laboratorium Komputer 1',
            'max_quota' => 30,
            'current_members' => 30,
            'is_registration_open' => false,
            'syllabus' => [],
            'achievements' => [],
        ]);
    }
}
