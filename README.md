# EskulHub SMKN 1 Ciomas

EskulHub adalah sistem informasi berbasis web untuk mengelola kegiatan ekstrakurikuler, presensi latihan mingguan, pencatatan prestasi, serta penerbitan portofolio non-akademik siswa di SMKN 1 Ciomas. Sistem ini menggantikan pencatatan manual berbasis kertas dengan alur kerja digital yang menghubungkan siswa, guru pembina, dan staf kesiswaan sekolah.

---

## Masalah yang Diselesaikan

Sebelum sistem ini dibangun, pengelolaan kegiatan kesiswaan di SMKN 1 Ciomas menghadapi beberapa kendala operasional:

1. Formulir pendaftaran anggota sering tercecer dan kuota peserta per cabang sulit dipantau secara langsung.
2. Rekapitulasi absensi mingguan di lapangan atau aula sering hilang atau rusak, sehingga pembina kesulitan menilai keaktifan siswa secara objektif.
3. Fasilitas bersama seperti lapangan serbaguna dan laboratorium sering mengalami bentrok jadwal karena tidak ada kalender terpusat.
4. Piagam dan sertifikat lomba milik siswa jarang terdata rapi dalam satu arsip terpusat, sehingga penyusunan surat keterangan prestasi menjelang kelulusan membutuhkan waktu lama.
5. Pihak luar seperti perguruan tinggi dan penyedia beasiswa kesulitan memverifikasi keaslian dokumen portofolio non-akademik yang dibawa siswa.

EskulHub menyatukan seluruh proses tersebut ke dalam satu sistem terintegrasi yang mencakup verifikasi daring, pembagian hak akses terstruktur, dan perlindungan privasi data siswa.

---

## Fitur Utama Sistem

### 1. Onboarding dan Kuisioner Minat Bakat Siswa Baru
Siswa yang baru mendaftarkan akun diarahkan ke alur penentuan minat. Siswa dapat memilih untuk langsung menuju katalog jika sudah memiliki pilihan, atau mengikuti kuisioner pemetaan bakat yang terdiri dari lima pertanyaan situasi:
* Pola energi dan gaya kegiatan saat waktu luang.
* Respon spontan saat menghadapi perubahan situasi atau tekanan.
* Peran alami yang disukai dalam kerja sama kelompok.
* Suasana lingkungan belajar dan tempat berlatih yang paling nyaman.
* Target kualitas karakter yang ingin dibangun sebelum lulus sekolah.

Sistem menghitung pembobotan nilai secara otomatis dan memberikan saran cabang ekstrakurikuler utama beserta alternatif yang paling sesuai dengan kepribadian siswa.

### 2. Katalog Terpadu dan Profil Ekstrakurikuler
Katalog menyajikan seluruh cabang kegiatan aktif di SMKN 1 Ciomas: Futsal, Basket, Bola Voli, Paskibra, Pramuka, Palang Merah Remaja (PMR), Rohani Islam (Rohis), dan English Club. Setiap profil memuat:
* Deskripsi pembinaan dan tujuan kegiatan.
* Informasi pembina guru dan pengurus siswa yang bertugas.
* Jadwal latihan mingguan dan lokasi fasilitas yang digunakan.
* Status ketersediaan kuota anggota secara langsung.
* Dokumentasi galeri kegiatan dan daftar prestasi yang pernah diraih.

### 3. Pendaftaran Anggota Digital
Siswa mendaftarkan diri secara daring dengan melengkapi data kontak, kelas, NISN, serta alasan memilih cabang tersebut. Sistem memvalidasi kapasitas anggota, memeriksa apakah pendaftaran masih dibuka, dan mencegah pendaftaran ganda pada cabang yang sama. Berkas masuk ke dasbor pembina terkait untuk ditinjau dan diputuskan statusnya.

### 4. Presensi Digital Sesi Latihan
Guru pembina dapat membuka sesi latihan baru dengan mencantumkan tanggal, jam, materi latihan, dan lokasi. Pada layar presensi, pembina menandai kehadiran anggota dengan empat status: hadir, terlambat, izin atau sakit, dan alpa. Persentase kehadiran dihitung secara otomatis dan menjadi salah satu syarat kelayakan penerbitan portofolio akhir.

### 5. Kalender Kegiatan dan Pencegahan Bentrok Fasilitas
Kalender memadukan jadwal latihan rutin, agenda perlombaan, kegiatan resmi sekolah seperti Masa Pengenalan Lingkungan Sekolah (MPLS) dan Porseni, serta hari libur nasional. Saat pengguna menjadwalkan kegiatan baru, sistem secara otomatis memeriksa ketersediaan lokasi dan waktu. Jika ruangan atau lapangan telah dipesan pada jam yang sama, sistem menolak penginputan dan menampilkan rincian kegiatan yang mendahuluinya.

### 6. Impor Massal Jadwal via Berkas Excel
Pengurus dan pembina dapat memasukkan agenda kegiatan satu semester sekaligus melalui fitur unggah berkas Excel atau CSV. Sistem membaca susunan kolom, memvalidasi format tanggal dan jam, memetakan kategori kegiatan, serta menyimpan data langsung ke dalam basis data melalui transaksi yang aman.

### 7. Pengesahan Prestasi Siswa
Siswa yang memenangkan kompetisi dapat mengunggah rincian prestasi mandiri, mulai dari tingkat sekolah, kota atau kabupaten, provinsi, nasional, hingga internasional. Berkas bukti piagam atau sertifikat yang diunggah akan diverifikasi langsung oleh guru pembina sebelum dinyatakan sah dan masuk ke dalam rekam jejak resmi.

### 8. Penerbitan Portofolio PDF Bersegel Kriptografi
Siswa yang memenuhi syarat dapat mengunduh dokumen portofolio non-akademik resmi berformat PDF. Dokumen ini memuat:
* Kop resmi SMKN 1 Ciomas dan identitas lengkap siswa.
* Ringkasan keaktifan dan persentase kehadiran latihan.
* Daftar prestasi yang telah diverifikasi guru pembina.
* Tanda tangan digital pejabat kesiswaan sekolah.
* Nomor registrasi unik dan kode segel keamanan berbasis HMAC-SHA256 untuk memastikan keaslian isi dokumen.

### 9. Halaman Verifikasi Publik
Sistem menyediakan halaman publik terbuka untuk memeriksa keabsahan dokumen portofolio yang diterbitkan sekolah. Pihak verifikator luar (perguruan tinggi atau perusahaan) cukup memasukkan kode registrasi dokumen atau memindai barcode pada cetakan PDF untuk mencocokkan data langsung dengan catatan arsip sekolah.

---

## Hak Akses Pengguna

Sistem menerapkan kontrol akses berbasis peran (Role-Based Access Control) dan atribut (Attribute-Based Access Control):

* **Siswa**: Menjelajahi katalog, mengisi kuisioner minat, mendaftar ke cabang ekskul, memantau rekap absensi pribadi, mengunggah bukti prestasi, dan mengunduh berkas portofolio PDF resmi. Siswa hanya dapat melihat dan memperbarui data akun milik sendiri.
* **Pembina / Guru**: Meninjau permohonan anggota baru, menyetujui atau menolak pendaftaran sesuai kuota cabang binaannya, membuka sesi latihan, mengisi absensi mingguan, mengunggah jadwal latihan, dan memvalidasi keaslian sertifikat lomba siswa.
* **Pengurus Sekolah**: Memantau statistik keikutsertaan siswa di seluruh cabang, memvalidasi permohonan portofolio akhir, mengelola kalender acara tingkat sekolah, dan melakukan impor massal agenda dari berkas Excel.
* **Administrator**: Mengelola data induk pengguna, mengatur konfigurasi sekolah (NPSN, kepala sekolah, tahun ajaran), menonaktifkan akun yang melanggar aturan, dan mengelola struktur basis data.

---

## Standar Keamanan Sistem

EskulHub telah melalui proses audit dan pengerasan keamanan (*security hardening*) menyeluruh:

1. **Autentikasi Ketat**: Menggunakan Laravel Sanctum Personal Access Token dengan masa kedaluwarsa 7 hari. Permintaan tanpa token yang sah ditolak secara tegas dengan respon HTTP 401 Unauthorized.
2. **Pencegahan IDOR (Insecure Direct Object Reference)**: Pada pembuatan prestasi dan registrasi, identitas siswa dikunci langsung ke ID pengguna yang terautentikasi pada server. Pengguna tidak dapat memalsukan pengajuan atas nama siswa lain.
3. **Pembatasan Wewenang Pembina (ABAC)**: Pembina hanya berwenang menyetujui pendaftaran dan memvalidasi kegiatan pada ekstrakurikuler yang berada di bawah bimbingannya.
4. **Proteksi Privasi Siswa (PII)**: Akses publik ke daftar anggota menyamarkan Nomor Induk Siswa Nasional (contoh: `006****10`). Daftar pengguna publik hanya menampilkan staf pengajar dan pembina resmi, tanpa membocorkan alamat email siswa.
5. **Pembatasan Frekuensi Permintaan (Rate Limiting)**: Endpoint login dan registrasi dibatasi 15 permintaan per menit, endpoint kuisioner dibatasi 30 permintaan per menit, dan seluruh mutasi data terlindungi dengan pembatasan 60 permintaan per menit untuk mencegah serangan spam.
6. **Header Keamanan HTTP**: Server menyematkan header standar keamanan mencakup `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Strict-Transport-Security`, dan `Cross-Origin-Opener-Policy: same-origin`.

---

## Tumpukan Teknologi

### Frontend
* React 18 dengan TypeScript
* Vite sebagai bundler dan alat pengembangan
* Tailwind CSS dan CSS murni dengan variabel desain terpusat
* Lucide React untuk pustaka ikon antarmuka
* Axios untuk komunikasi data HTTP dengan penanganan token otomatis
* jsPDF dan html2canvas untuk generator dokumen portofolio sekolah
* SheetJS (xlsx) untuk penguraian berkas spreadsheet di sisi peramban

### Backend
* PHP 8.2 atau yang lebih baru
* Framework Laravel 12
* Basis data SQLite (dapat dialihkan ke MySQL / PostgreSQL jika diperlukan)
* Laravel Sanctum untuk manajemen token autentikasi API
* Enkripsi kata sandi menggunakan Bcrypt (12 rounds)

---

## Panduan Instalasi dan Menjalankan Proyek

### Prasyarat
Pastikan perangkat Anda telah terpasang:
* Node.js versi 18 atau lebih baru
* PHP versi 8.2 atau lebih baru
* Composer versi 2 atau lebih baru
* Git

### 1. Menyiapkan Backend (Laravel API)
Buka terminal dan jalankan perintah berikut:

```bash
# Masuk ke direktori backend
cd backend

# Pasang pustaka dependensi PHP
composer install

# Salin berkas lingkungan jika belum ada
cp .env.example .env

# Buat kunci enkripsi aplikasi
php artisan key:generate

# Jalankan migrasi tabel dan pengisian data awal (seeding)
php artisan migrate --seed

# Jalankan server lokal backend pada port 8000
php artisan serve
```

Server backend akan berjalan pada alamat `http://127.0.0.1:8000`.

### 2. Menyiapkan Frontend (React Vite)
Buka terminal baru di direktori utama proyek:

```bash
# Pasang dependensi Node.js
npm install

# Jalankan server pengembangan Vite
npm run dev
```

Aplikasi frontend dapat diakses melalui peramban pada alamat `http://localhost:5173`.

---

## Akun Uji Coba (Data Awal)

Seluruh akun di bawah ini telah disiapkan oleh sistem pengisi data awal (*Database Seeder*) dengan kata sandi bawaan yang sama:

| Peran | Nama | Alamat Email | Kata Sandi | Keterangan |
|---|---|---|---|---|
| Siswa | Budi Pratama | `budi@smkn1ciomas.sch.id` | `password123` | Anggota aktif ekskul Futsal dan Basket |
| Guru / Pembina | Hendra Wijaya, S.Pd. | `hendra@smkn1ciomas.sch.id` | `password123` | Guru PJOK dan Pembina resmi Ekskul Futsal |
| Pengurus Sekolah | Dra. Hj. Sri Wahyuni, M.Pd. | `sri.wahyuni@smkn1ciomas.sch.id` | `password123` | Staf Kesiswaan dan Pengawas Ekstrakurikuler |
| Administrator | Drs. Bambang Suryono | `admin@smkn1ciomas.sch.id` | `password123` | Wakil Kepala Sekolah Bidang Kesiswaan |

---

## Struktur Direktori Proyek

```text
EskulHub/
├── backend/                        # Backend Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/        # Logika API (Auth, Ekskul, Event, Presensi, dll)
│   │   │   └── Middleware/         # HybridAuthenticate, EnsureUserRole, SecurityHeaders
│   │   └── Models/                 # Model Eloquent (User, Ekskul, Event, Attendance, dll)
│   ├── config/                     # Konfigurasi aplikasi, CORS, dan Sanctum
│   ├── database/
│   │   ├── migrations/             # Skema tabel SQLite / database
│   │   └── seeders/                # Data awal pengguna, ekskul, dan kegiatan
│   └── routes/
│       └── api.php                 # Rute RESTful API terlindungi
├── src/                            # Frontend React TypeScript
│   ├── components/                 # Komponen antarmuka global dan UI umum
│   ├── features/                   # Modul per fitur aplikasi
│   │   ├── achievements/           # Pencatatan dan verifikasi prestasi
│   │   ├── attendance/             # Dasbor dan sesi presensi latihan
│   │   ├── authentication/         # Halaman masuk, pendaftaran, dan provider sesi
│   │   ├── extracurriculars/       # Katalog, profil, dan pendaftaran ekskul
│   │   ├── onboarding/             # Kuisioner minat bakat siswa baru
│   │   ├── portfolios/             # Dasbor peran, manajemen dokumen, dan cetak PDF
│   │   ├── school-events/          # Kalender interaktif dan impor Excel
│   │   └── verification/           # Pemeriksaan keaslian sertifikat publik
│   ├── lib/                        # Konfigurasi Axios API dan modul penyimpanan lokal
│   ├── types/                      # Deklarasi tipe data TypeScript
│   └── main.tsx                    # Titik masuk utama aplikasi React
├── package.json                    # Konfigurasi paket dan dependensi frontend
└── README.md                       # Dokumentasi resmi proyek
```

---

## Lisensi dan Kepemilikan

Proyek ini dikembangkan untuk kebutuhan operasional kesiswaan di SMKN 1 Ciomas, Kabupaten Bogor, Jawa Barat.
