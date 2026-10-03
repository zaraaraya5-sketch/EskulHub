# EskulHub SMKN 1 Ciomas

EskulHub adalah sistem pengelolaan kegiatan ekstrakurikuler, presensi kehadiran latihan, pencatatan prestasi, dan penerbitan portofolio non-akademik untuk siswa SMKN 1 Ciomas. Sistem ini menghubungkan siswa, guru pembina, dan pengurus sekolah dalam satu alur kerja yang terstruktur dan tercatat rapi.

## Peran Pengguna dan Batas Akses

Sistem menggunakan pembagian peran berdasarkan tanggung jawab masing-masing pihak di sekolah.

### 1. Siswa
Siswa menggunakan sistem untuk mencari informasi ekstrakurikuler yang aktif di SMKN 1 Ciomas, mendaftarkan diri pada kegiatan yang diminati, memantau rekap kehadiran latihan mingguan, mengunggah bukti keikutsertaan lomba atau kegiatan, dan mencetak dokumen portofolio resmi saat diperlukan untuk keperluan kelulusan, seleksi perguruan tinggi, maupun lamaran kerja.

### 2. Pembina Ekskul
Guru pembina bertanggung jawab mengelola satu atau beberapa ekstrakurikuler yang dibina. Pembina memeriksa berkas pendaftaran calon anggota baru, menyetujui atau menolak pendaftaran sesuai kuota, membuka sesi latihan rutin, mengisi catatan kehadiran anggota, menyusun agenda latihan atau persiapan kompetisi, serta memvalidasi sertifikat penghargaan yang diajukan oleh siswa binaannya.

### 3. Pengurus Sekolah
Pengurus memegang wewenang pengawasan menyeluruh terhadap seluruh aktivitas ekstrakurikuler di SMKN 1 Ciomas. Tugas pengurus mencakup pemantauan keaktifan siswa dan pembina, peninjauan kapasitas anggota per cabang, pemantauan agenda resmi sekolah dan hari libur nasional pada kalender, impor massal jadwal kegiatan dari berkas Excel, serta penerbitan tanda tangan elektronik dan kode verifikasi portofolio kesiswaan.

## Alur Kerja Sistem

### 1. Alur Pendaftaran Anggota Baru
Siswa membuka katalog ekstrakurikuler dan memilih salah satu cabang yang pendaftarannya masih terbuka. Siswa mengisi formulir pendaftaran yang memuat alasan memilih cabang tersebut, pengalaman sebelumnya jika ada, nomor kontak aktif, dan persetujuan tata tertib latihan. Sistem memastikan siswa tidak mendaftar dua kali pada cabang yang sama dan memeriksa sisa kuota yang tersedia.

Data pendaftaran masuk ke dasbor guru pembina terkait dengan status menunggu persetujuan. Pembina meninjau data pemohon, lalu memilih opsi terima atau tolak disertai catatan singkat. Saat pendaftaran disetujui, identitas siswa langsung tercatat ke dalam daftar anggota resmi cabang tersebut.

### 2. Alur Presensi Latihan Rutin
Pada hari pelaksanaan kegiatan, pembina membuka sesi latihan baru dengan memilih tanggal, waktu mulai, materi atau fokus latihan, dan lokasi fasilitas yang digunakan. Daftar seluruh anggota resmi cabang tersebut ditampilkan pada layar presensi.

Pembina menandai status kehadiran setiap anggota: hadir, terlambat, izin atau sakit, atau alpa. Sistem menghitung persentase kehadiran setiap siswa secara otomatis. Rekapitulasi kehadiran ini dapat dilihat langsung oleh siswa pada dasbor pribadi dan tercatat sebagai komponen evaluasi keaktifan dalam portofolio akhir.

### 3. Alur Penjadwalan dan Pemeriksaan Bentrok Lokasi
Pembina dan pengurus dapat menambahkan agenda kegiatan baru melalui kalender sekolah. Setiap agenda memuat judul kegiatan, kategori acara, tanggal dan jam pelaksanaan, nama penanggung jawab, serta lokasi ruangan atau lapangan yang dipakai.

Sebelum data tersimpan, sistem melakukan pengecekan otomatis terhadap penggunaan lokasi. Jika pada rentang waktu yang sama terdapat kegiatan lain yang telah memesan fasilitas tersebut, sistem menolak penyimpanan dan menampilkan peringatan bentrok ruangan beserta rincian kegiatan yang mendahuluinya. Pengguna harus memilih waktu atau lokasi alternatif agar jadwal tidak saling tumpang tindih.

### 4. Alur Pengesahan Prestasi Siswa
Siswa yang meraih penghargaan atau sertifikat keikutsertaan kompetisi dapat mengunggah rincian capaian melalui menu dokumen portofolio. Siswa mencantumkan nama kejuaraan, cabang lomba, tingkatan wilayah (tingkat sekolah, kecamatan, kota/kabupaten, provinsi, atau nasional), tahun perolehan, peringkat juara, serta berkas foto piagam atau sertifikat pendukung.

Data prestasi yang dikirim berstatus belum diverifikasi. Pembina memeriksa keaslian bukti piagam tersebut melalui menu pembina. Jika dokumen sesuai, pembina menyetujui capaian tersebut sehingga statusnya berubah menjadi terverifikasi resmi dan berhak dimasukkan ke dalam dokumen transkrip portofolio sekolah.

### 5. Alur Penerbitan dan Pembuktian Portofolio Resmi
Setelah siswa menyelesaikan masa kegiatan ekstrakurikuler atau menjelang kelulusan, siswa mengajukan permohonan penerbitan portofolio. Pengurus sekolah memeriksa kelengkapan data siswa, keabsahan keanggotaan organisasi, persentase kehadiran latihan, dan daftar prestasi yang telah disahkan oleh pembina.

Pengurus menerbitkan dokumen portofolio non-akademik berformat PDF yang memuat identitas lengkap siswa, riwayat keikutsertaan ekskul, rekapitulasi kehadiran, daftar prestasi terverifikasi, catatan pembinaan, serta nomor registrasi unik sekolah. Dokumen dilengkapi tanda tangan elektronik pejabat kesiswaan dan kode QR khusus.

Pihak luar seperti panitia seleksi beasiswa, perguruan tinggi, maupun bagian personalia perusahaan dapat memindai kode QR atau memasukkan nomor verifikasi pada halaman publik verifikasi situs. Sistem menampilkan data asli yang tersimpan di basis data sekolah untuk memastikan keabsahan dokumen fisik tanpa risiko pemalsuan.

## Rincian Fitur Aplikasi

### 1. Katalog Terpadu SMKN 1 Ciomas
Katalog menampilkan delapan cabang ekstrakurikuler yang aktif di SMKN 1 Ciomas: Basket, Voli, Futsal, Paskibra, English Club, Rohis, Pramuka, dan PMR. Pengunjung dapat menyaring daftar berdasarkan rumpun kegiatan (olahraga, kepemimpinan, keagamaan, kemanusiaan, atau bahasa), memeriksa status ketersediaan kuota, dan mencari nama pembina atau kata kunci tertentu.

### 2. Profil Rinci Cabang Ekstrakurikuler
Halaman profil memuat deskripsi lengkap tujuan pembinaan, jadwal latihan mingguan, lokasi fasilitas yang digunakan, nama guru pembina dan ketua ekskul yang bertugas, dokumentasi galeri foto kegiatan, serta daftar pencapaian yang pernah diraih oleh tim sekolah.

### 3. Dasbor Mandiri Siswa
Halaman khusus siswa untuk memantau status keanggotaan ekskul yang diikuti, melihat riwayat persetujuan pendaftaran, memeriksa grafik kehadiran latihan berkala, mengunggah sertifikat lomba baru, dan melihat draf portofolio kegiatan sebelum dicetak.

### 4. Dasbor Pengelolaan Pembina
Ruang kerja digital bagi guru pembina untuk memproses pendaftaran anggota masuk, memantau daftar anggota aktif, menyelenggarakan presensi digital pada setiap sesi latihan, mengelola agenda tryout atau jadwal lomba, dan memvalidasi sertifikat prestasi siswa binaan.

### 5. Dasbor Pemantauan Pengurus Sekolah
Pusat monitoring bagi pengurus untuk melihat statistik menyeluruh sekolah, mengawasi sebaran minat siswa per jurusan, mengelola data induk ekstrakurikuler dan dewan pembina, serta mengesahkan penerbitan dokumen resmi kesiswaan.

### 6. Kalender Agenda Bulanan
Tampilan kalender interaktif yang memuat seluruh agenda latihan rutin, pertandingan resmi, acara peringatan hari besar sekolah seperti PORSENI, serta hari libur nasional. Kalender dilengkapi filter kategori warna untuk mempermudah identifikasi jenis kegiatan.

### 7. Pengunggahan Jadwal Massal via Excel
Fitur impor berkas spreadsheet yang memungkinkan pengurus mengunggah jadwal kegiatan satu semester sekaligus. Sistem membaca tanggal, waktu, kategori, lokasi, dan penyelenggara kegiatan secara otomatis dari tabel lembar kerja, memvalidasi formatnya, dan langsung memasukkannya ke dalam kalender sekolah.

### 8. Generator Dokumen Portofolio Resmi
Modul pencetakan dokumen portofolio siswa yang menghasilkan berkas PDF berstandar arsip sekolah. Format cetak memuat kop surat resmi SMKN 1 Ciomas, rincian kompetensi non-akademik siswa, tanda tangan penanggung jawab kesiswaan, dan kode verifikasi QR yang terhubung ke server sekolah.

### 9. Halaman Verifikasi Publik
Laman terbuka yang dapat diakses siapa saja untuk menguji keaslian dokumen portofolio yang diterbitkan oleh SMKN 1 Ciomas. Pihak penilai cukup memasukkan kode verifikasi atau memindai barcode pada dokumen cetak untuk melihat catatan prestasi resmi langsung dari basis data sekolah.
