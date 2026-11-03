# Panduan Deployment EskulHub ke Vercel

Panduan lengkap untuk mendeploy frontend **EskulHub (Vite + React 19 + TypeScript)** ke platform **Vercel** secara cepat, aman, dan efisien.

---

## 1. File Konfigurasi yang Sudah Disiapkan

Repository ini telah dikonfigurasi dengan file-file pendukung deployment:
1. **`vercel.json`**:
   - Menangani **SPA Routing (Single Page Application)** agar saat user merefresh halaman di route seperti `/student/dashboard`, `/login`, atau `/pengurus/schedule` tidak muncul error *404 Not Found*.
   - Mengatur **Cache-Control** otomatis untuk file aset statis (`/assets/*`, font, dan gambar).
   - Menambahkan **Security Headers** (X-Content-Type-Options, X-Frame-Options, XSS Protection).
2. **`.vercelignore`**:
   - Mengabaikan folder `backend/`, `scratch/`, dan file lokal agar proses upload dan build di Vercel menjadi sangat cepat (kurang dari 1 menit).
3. **`src/lib/api.ts`**:
   - Telah diperbarui untuk membaca environment variable `VITE_API_URL` secara dinamis di cloud production dan otomatis fallback ke `http://127.0.0.1:8000/api` saat dijalankan lokal.

---

## 2. Cara Deployment ke Vercel

### Metode A: Melalui Dashboard Vercel (Rekomendasi via Git)

1. **Push Proyek ke GitHub / GitLab**:
   Pastikan kode terbaru sudah di-commit dan di-push ke repository Git Anda.

2. **Buka Vercel**:
   - Masuk ke [vercel.com](https://vercel.com) dan klik tombol **"Add New..."** → **"Project"**.
   - Pilih repository **EskulHub**.

3. **Pengaturan Project di Vercel**:
   Vercel akan otomatis mendeteksi proyek Vite. Pastikan nilainya sebagai berikut:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Default root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables (Opsional)**:
   Jika backend Laravel sudah di-deploy ke server online (misal di Railway / Render / VPS):
   - Tambahkan variabel:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://api-kamu.domainsekolah.sch.id/api` (atau URL backend Anda)
   *(Jika belum ada backend online, frontend tetap dapat berjalan menggunakan database client bawaan).*

5. **Klik "Deploy"**:
   - Tunggu proses build selesai sekitar 30 - 60 detik.
   - Website Anda langsung live dengan domain gratis seperti `eskulhub.vercel.app` (dan mendukung custom domain sekolah).

---

### Metode B: Melalui Terminal (Vercel CLI)

Jika ingin mendeploy langsung dari komputer tanpa push ke GitHub:

1. **Jalankan Perintah Deploy**:
   ```bash
   npx vercel
   ```
2. Ikuti instruksi di terminal:
   - *Set up and deploy?* → Tekan `y`
   - *Which scope?* → Pilih akun Vercel Anda
   - *Link to existing project?* → `n` (jika baru)
   - *Project name?* → `eskulhub`
   - *In which directory is your code located?* → `./`
   - *Want to modify settings?* → `n`
3. **Deploy ke Production**:
   ```bash
   npx vercel --prod
   ```

---

## 3. Menghubungkan Backend Laravel

Karena Vercel difokuskan untuk frontend static/SPA dan serverless Node.js, backend **Laravel + PostgreSQL** disarankan di-host di layanan yang mendukung PHP & Database:
- **Pilihan 1 (Paling Mudah & Gratis/Murah)**: [Railway.app](https://railway.app) atau [Render.com](https://render.com) (mendukung Docker/PHP & PostgreSQL).
- **Pilihan 2**: VPS Sekolah / Cloud Server (Ubuntu + Nginx + PHP 8.2 + PostgreSQL).

Setelah backend Anda memiliki URL publik (misal: `https://api.smkn1ciomas.sch.id`), masukkan URL tersebut ke Vercel:
1. Buka **Project Settings** di Vercel Dashboard.
2. Masuk ke tab **Environment Variables**.
3. Tambahkan `VITE_API_URL` = `https://api.smkn1ciomas.sch.id/api`.
4. Lakukan **Redeploy**.

---

## 4. Checklist Pra-Deployment

- [x] Routing SPA tidak 404 saat refresh (`vercel.json` rewrites aktif).
- [x] Kompilasi TypeScript bersih tanpa error (`npx tsc --noEmit` lolos).
- [x] Build produksi selesai sukses (`npm run build` menghasilkan folder `dist/`).
- [x] Favicon dan logo resmi SMKN 1 Ciomas & EskulHub tersemat tajam.

