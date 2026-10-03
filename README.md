# EKSKUL-HUB — Platform Manajemen Ekstrakurikuler & Portofolio Siswa

Ekskul-Hub adalah platform manajemen terpadu kegiatan ekstrakurikuler, presensi digital, pencatatan prestasi, dan penerbitan portofolio non-akademik siswa bertanda tangan digital dan kode verifikasi QR untuk satuan pendidikan di Indonesia (**SMKN 1 Ciomas**).

Aplikasi dibangun murni menggunakan **React (Vite + TypeScript)**, **Tailwind CSS**, **Node.js**, dan terintegrasi dengan **Laravel 11 Backend**, mematuhi seluruh arahan desain institusional (*Strict Anti-AI-Slop*, tanpa gradien berlebih, warna solid hangat `#F5F2EA`, aksen terakota `#D15B40`, dan teal `#3B7A82`).

---

## 1. Fitur Utama & Alur Kerja (Workflow)

```
DISCOVER → REGISTER → APPROVE → PARTICIPATE → ATTEND → RECORD & VERIFY → BUILD PORTFOLIO → GENERATE PDF → VERIFY
```

1. **Katalog Publik Ekstrakurikuler (`/ekskul`)**:
   - Menampilkan 8 ekstrakurikuler SMKN 1 Ciomas: Basket, Voli, Futsal, Paskibra, English Club, Rohis, Pramuka, PMR.
   - Pencarian real-time nama ekskul, pembina, dan kata kunci.
   - Filter kategori (*Olahraga, Keagamaan, Kemanusiaan, Kepemimpinan, Bahasa & Literasi*).
   - Filter status pendaftaran (*Buka / Kuota Penuh*).
   - Pengurutan nama, kapasitas, dan popularitas.

2. **Halaman Detail & Pendaftaran Daring (`/ekskul/:slug`)**:
   - Profil lengkap, silabus, guru pembina, ketua ekskul, jadwal rutin, lokasi latihan, dan kuota anggota.
   - Daftar prestasi resmi dan galeri dokumentasi kegiatan.
   - **Formulir Pendaftaran Online Interaktif** khusus peran Siswa dengan validasi pencegahan duplikasi dan pengecekan kapasitas maksimal.

3. **Buku Presensi Digital & Kalkulator Kehadiran (`/student/attendance` & `/pengurus/attendance`)**:
   - Status presensi standar: `Hadir (Present)`, `Terlambat (Late)`, `Izin/Sakit (Excused)`, `Alpa (Absent)`.
   - Perhitungan otomatis persentase kehadiran real-time.
   - Pengurus dapat membuka sesi latihan baru dan menandai presensi anggota secara langsung.

4. **Kalender Agenda & Deteksi Konflik Fasilitas (`/calendar`)**:
   - Jadwal terpusat latihan, turnamen, acara sekolah (PORSENI), dan agenda kesiswaan.
   - **Live Conflict Detection**: Memperingatkan secara otomatis jika ada 2 kegiatan yang mencoba menggunakan ruangan/lapangan yang sama pada waktu bersamaan.

5. **Portofolio Resmi & Ekspor PDF (`/student/portfolio`)**:
   - Rangkuman kronologis keanggotaan organisasi, persentase presensi, prestasi terverifikasi, dan peran kepanitiaan.
   - **Ekspor Dokumen PDF Resmi**: Menghasilkan transkrip bertanda tangan elektronik Wakasek Kesiswaan lengkap dengan **QR Code dinamis** menggunakan `jspdf` dan `qrcode`.

6. **Laman Verifikasi Publik (`/verify/:verificationId`)**:
   - Pengecekan keabsahan dokumen oleh pihak luar (kampus, penyedia beasiswa, atau dunia industri).
   - Menampilkan status sah, nomor verifikasi (contoh: `EKH-2026-000184`), nama siswa, NISN, serta daftar prestasi yang diakui sekolah.

---

## 2. Hak Akses & Akun Uji Coba

Di bagian bilah atas (*top ribbon*) situs, terdapat **tombol pengalih peran instan (1-click role switcher)**:

| Peran | Nama Akun Demo | Email / Keterangan |
|---|---|---|
| **Siswa** | Budi Pratama | `budi@smkn1ciomas.sch.id` (XII RPL 1 - NISN: 0067823910) |
| **Pengurus Ekskul** | Rizky Ramadhan | `rizky@smkn1ciomas.sch.id` (Ketua Ekskul Futsal Ciomas) |
| **Guru Pembina** | Hendra Wijaya, S.Pd. | `hendra@smkn1ciomas.sch.id` (Pembina Futsal & Basket) |
| **Admin Kesiswaan** | Drs. Bambang Suryono | `admin@smkn1ciomas.sch.id` (Wakasek Kesiswaan) |

---

## 3. Rute Halaman (Routes)

### Halaman Publik
- `/` — Beranda (Penjelasan alur kerja, sorotan ekskul, pencarian verifikasi cepat)
- `/ekskul` — Katalog lengkap ekstrakurikuler
- `/ekskul/:slug` — Detail ekskul (contoh: `/ekskul/futsal`, `/ekskul/programming-club`)
- `/calendar` — Kalender kegiatan terpusat & deteksi konflik fasilitas
- `/verify/:verificationId` — Laman publik verifikasi portofolio (contoh: `/verify/EKH-2026-000184`)
- `/login` — Halaman masuk portal dengan pilihan akun uji coba

### Halaman Dasbor Terotentikasi
- `/student/dashboard` — Dasbor utama siswa, ekskul aktif, presensi, dan ringkasan portofolio
- `/student/attendance` — Rekapitulasi presensi digital siswa
- `/student/portfolio` — Pratinjau portofolio resmi & unduh PDF
- `/pengurus/dashboard` — Dasbor pengurus ekskul & verifikasi pendaftaran baru
- `/pengurus/attendance` — Pengelolaan sesi presensi latihan
- `/teacher/dashboard` — Dasbor monitoring pembina & validasi prestasi
- `/admin/dashboard` — Dasbor kesiswaan sekolah & master data

---

## 4. Cara Menjalankan Aplikasi

Server lokal saat ini telah aktif di:
```bash
http://127.0.0.1:5173/
```
