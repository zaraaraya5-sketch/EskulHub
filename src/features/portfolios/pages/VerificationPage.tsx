import React, { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { getVerificationAPI } from '@/lib/api';
import { PortfolioVerification } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  School,
  Calendar,
  User,
  Trophy,
  Award,
  GraduationCap,
  Building2,
  QrCode,
  ArrowRight,
  RotateCcw,
  Printer,
  Sparkles,
  FileText,
  Clock
} from 'lucide-react';

interface VerificationPageProps {
  verificationId?: string;
  onNavigate: (path: string) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  verificationId = '',
  onNavigate
}) => {
  const [searchInput, setSearchInput] = useState(verificationId);
  const [apiVerification, setApiVerification] = useState<PortfolioVerification | null>(null);
  const cleanId = (verificationId || '').trim();
  const hasQuery = cleanId.length > 0;
  
  // Update local input state whenever the prop changes
  useEffect(() => {
    setSearchInput(verificationId || '');
  }, [verificationId]);

  // Query live API to retrieve cryptographically sealed verification data if available
  useEffect(() => {
    let isMounted = true;
    if (cleanId) {
      getVerificationAPI(cleanId).then((res) => {
        if (isMounted && res) {
          setApiVerification(res);
        }
      });
    } else {
      setApiVerification(null);
    }
    return () => {
      isMounted = false;
    };
  }, [cleanId]);

  const verification = apiVerification || (hasQuery ? db.getVerificationById(cleanId) : undefined);
  
  // Retrieve available verified document as a living reference if available
  const existingVerifications = db.getVerifications();
  const sampleVerification = existingVerifications.length > 0 ? existingVerifications[0] : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().replace(/[<>]/g, '');
    if (query) {
      onNavigate(`/verify/${encodeURIComponent(query)}`);
    } else {
      onNavigate('/verify');
    }
  };

  const handleReset = () => {
    setSearchInput('');
    onNavigate('/verify');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Search Header Banner */}
      <section className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDEDE9] border border-[#F2C9C0] text-[#D15B40] text-xs font-semibold rounded-full mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Layanan Verifikasi Dokumen Sekolah</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight mb-2">
            Verifikasi Portofolio & Piagam Siswa
          </h1>
          <p className="text-sm text-[#525049] leading-relaxed mb-6">
            Cek keaslian lembar portofolio kegiatan ekstrakurikuler, piagam penghargaan, dan rekam jejak organisasi siswa yang diterbitkan resmi oleh sekolah.
          </p>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#78746B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Nomor verifikasi dokumen"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nomor verifikasi (contoh: EKH-2026-000184)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#EAE6DC] rounded-xl text-[#171717] placeholder:text-[#78746B] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="rounded-xl px-5">
                Cek Dokumen
              </Button>
              {hasQuery && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-xl px-3"
                  title="Kembali ke panduan"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Quick Demo Hint */}
          {sampleVerification && !hasQuery && (
            <div className="mt-3.5 flex items-center gap-2 text-xs text-[#525049]">
              <Sparkles className="w-3.5 h-3.5 text-[#D15B40]" />
              <span>Ingin mencoba cek contoh dokumen resmi?</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput(sampleVerification.verification_id);
                  onNavigate(`/verify/${sampleVerification.verification_id}`);
                }}
                className="text-[#D15B40] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                Coba ID: <code className="bg-[#F9F8F6] px-1.5 py-0.5 rounded border border-[#EAE6DC] font-mono">{sampleVerification.verification_id}</code>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* STATE 1: VERIFIED DOCUMENT FOUND */}
      {hasQuery && verification && (
        <section className="bg-white border border-[#EAE6DC] rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          {/* Certificate Top Banner */}
          <div className="bg-[#D15B40] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 block">Status Validasi Institusi:</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">DOKUMEN RESMI TERVERIFIKASI</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:text-right">
              <div>
                <span className="text-[11px] text-white/80 block uppercase">Nomor Registrasi Arsip:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">{verification.verification_id}</span>
                {verification.security_seal && (
                  <div className="mt-1 flex items-center sm:justify-end gap-1 px-2 py-0.5 rounded bg-black/20 border border-white/20 text-[10px] font-mono text-white">
                    <ShieldCheck className="w-3 h-3 text-[#A7F3D0]" />
                    <span>Kode Pengaman: {verification.security_seal}</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-lg text-xs"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Cetak
              </Button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Student & School Info Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#525049] uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-[#D15B40]" />
                  <span>Data Siswa</span>
                </div>
                <div>
                  <div className="text-base font-bold text-[#171717]">{verification.student_name}</div>
                  <div className="text-[#525049] mt-0.5">
                    NISN: <span className="font-mono font-semibold text-[#171717]">{verification.student_nisn}</span> • Kelas: <span className="font-semibold text-[#171717]">{verification.student_class}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#525049] uppercase tracking-wider">
                  <School className="w-3.5 h-3.5 text-[#D15B40]" />
                  <span>Sekolah Penerbit</span>
                </div>
                <div>
                  <div className="text-base font-bold text-[#171717]">{verification.school_name}</div>
                  <div className="text-[#525049] mt-0.5">
                    Tahun Ajaran: <span className="font-semibold text-[#171717]">{verification.academic_year}</span> • Tanggal Terbit: <span className="font-semibold text-[#171717]">{verification.issue_date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Extracurriculars List */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC] mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                  <span>1. Riwayat Ekstrakurikuler yang Diikuti</span>
                </h3>
                <Badge variant="success">Kehadiran Latihan: {verification.summary_data.total_attendance_rate}</Badge>
              </div>
              <div className="divide-y divide-[#EAE6DC] border border-[#EAE6DC] rounded-xl overflow-hidden bg-white">
                {verification.summary_data.ekskul_list.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#F9F8F6]/60 transition-colors">
                    <div>
                      <span className="font-bold text-[#171717] text-sm">{item.name}</span>
                      <span className="text-[#525049] ml-2 font-medium">({item.role})</span>
                    </div>
                    <span className="text-[#525049] font-mono bg-[#F9F8F6] px-2 py-0.5 rounded border border-[#EAE6DC]">{item.period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Achievements List */}
            {verification.summary_data.achievements && verification.summary_data.achievements.length > 0 && (
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC] mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#B58A32]" />
                    <span>2. Prestasi & Penghargaan Resmi</span>
                  </h3>
                  <span className="text-xs text-[#525049] font-medium">{verification.summary_data.achievements.length} Capaian Resmi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verification.summary_data.achievements.map((ach, idx) => (
                    <div key={idx} className="p-3.5 bg-[#F9F8F6]/60 border border-[#EAE6DC] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#171717]">{ach.title}</div>
                        <div className="text-[#525049] mt-0.5">Tingkat {ach.level} • Tahun {ach.year}</div>
                      </div>
                      <Badge variant="warning">{ach.rank}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}                {/* Official Validation Notice */}
            <div className="p-4 border-l-4 border-[#D15B40] bg-[#F9F8F6] rounded-r-xl text-xs text-[#525049] space-y-1.5">
              <div className="font-bold text-[#171717]">Catatan Pengesahan Sekolah:</div>
              <p className="leading-relaxed">
                Dokumen ini diterbitkan secara sah oleh bagian kesiswaan {verification.school_name}. 
                Seluruh catatan kegiatan, persentase kehadiran latihan, dan daftar prestasi dicatat berkala oleh guru pembina ekstrakurikuler.
              </p>
              <div className="pt-1.5 text-[11px] text-[#D15B40] font-semibold">
                Diverifikasi sah oleh: {verification.verified_by_name}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATE 2: NOT FOUND (EXPLICIT USER SEARCH BUT INVALID CODE) */}
      {hasQuery && !verification && (
        <section className="bg-white border border-[#EAE6DC] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xs animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center mx-auto border border-[#F2C9C0]">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#171717]">Dokumen Belum Ditemukan</h2>
            <p className="text-xs sm:text-sm text-[#525049] max-w-lg mx-auto mt-1 leading-relaxed">
              Kami tidak menemukan arsip dengan kode <code className="font-mono font-bold text-[#171717] bg-[#F9F8F6] px-1.5 py-0.5 rounded border border-[#EAE6DC]">{cleanId}</code>.
              Coba periksa kembali apakah ada huruf atau angka yang salah ketik, atau scan langsung kode QR pada lembar portofolio.
            </p>
          </div>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleReset}
              className="rounded-xl"
            >
              Kembali ke Panduan
            </Button>
            
            {sampleVerification && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchInput(sampleVerification.verification_id);
                  onNavigate(`/verify/${sampleVerification.verification_id}`);
                }}
                className="rounded-xl"
              >
                Coba Contoh Dokumen Sah ({sampleVerification.verification_id})
              </Button>
            )}
          </div>
        </section>
      )}

      {/* STATE 3: DEFAULT PROMOTIONAL & EDUCATIONAL COPYWRITING (WHEN NO QUERY IS ACTIVE) */}
      {!hasQuery && (
        <div className="space-y-12">
          
          {/* 3 Main Pillars of Value */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
                Kenapa Portofolio Siswa Perlu Diverifikasi?
              </h2>
              <p className="text-xs sm:text-sm text-[#525049] mt-2">
                Biar seluruh keaktifan dan prestasi siswa selama di ekskul benar-benar diakui saat mendaftar kuliah, beasiswa, maupun melamar kerja.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs flex flex-col justify-between card-interactive hover:border-[#D15B40]/40">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-105">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">Aman & Bebas Pemalsuan</h3>
                  <p className="text-xs text-[#525049] leading-relaxed">
                    Setiap lembar portofolio punya nomor seri dan kode QR khusus yang terhubung langsung ke database sekolah. Keaslian dokumen bisa dicek siapa saja dalam hitungan detik.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#EAE6DC] text-[11px] text-[#525049] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#234B36]" />
                  <span>Langsung dari Kesiswaan</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs flex flex-col justify-between card-interactive hover:border-[#D15B40]/40">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F4F5] text-[#2A7B88] flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-105">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">Siap untuk Seleksi Kuliah & Beasiswa</h3>
                  <p className="text-xs text-[#525049] leading-relaxed">
                    Panitia seleksi perguruan tinggi atau pemberi beasiswa cukup membuka tautan verifikasi untuk memastikan riwayat perlombaan dan kejuaraan siswa tanpa minta legalisir manual.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#EAE6DC] text-[11px] text-[#525049] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#234B36]" />
                  <span>Cocok untuk Lampiran SNBP</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs flex flex-col justify-between card-interactive hover:border-[#D15B40]/40">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF3DC] text-[#8C6819] flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-105">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">Bukti Nyata untuk Magang & Kerja</h3>
                  <p className="text-xs text-[#525049] leading-relaxed">
                    Perusahaan mitra magang bisa melihat tingkat kehadiran dan kepemimpinan siswa selama berorganisasi. Jadi bukti nyata kedisiplinan dan kemampuan kerja sama.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#EAE6DC] text-[11px] text-[#525049] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#234B36]" />
                  <span>Presensi & Peran Terdata Rapi</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3 Steps Guide on How It Works */}
          <section className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#171717] flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#D15B40]" />
                <span>3 Langkah Mudah Memeriksa Dokumen</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#525049] mt-1">
                Ikuti langkah sederhana ini untuk mengecek apakah portofolio atau sertifikat yang kamu terima asli.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="space-y-2.5 bg-[#F9F8F6] p-5 rounded-xl border border-[#EAE6DC]/80">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-[#D15B40] font-mono">01</div>
                  <span className="text-[11px] font-semibold text-[#78746B] uppercase tracking-wide">Cek Berkas</span>
                </div>
                <h4 className="font-bold text-sm text-[#171717]">Lihat Nomor Dokumen</h4>
                <p className="text-xs text-[#525049] leading-relaxed">
                  Buka lembar portofolio cetak atau file PDF. Temukan nomor seri verifikasi di sudut kanan atas atau persis di bawah kode QR (misalnya: <code className="font-mono font-semibold text-[#171717]">EKH-2026-000184</code>).
                </p>
              </div>

              <div className="space-y-2.5 bg-[#F9F8F6] p-5 rounded-xl border border-[#EAE6DC]/80">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-[#D15B40] font-mono">02</div>
                  <span className="text-[11px] font-semibold text-[#78746B] uppercase tracking-wide">Masukkan Kode</span>
                </div>
                <h4 className="font-bold text-sm text-[#171717]">Ketik Nomor atau Pindai QR</h4>
                <p className="text-xs text-[#525049] leading-relaxed">
                  Masukkan nomor tersebut ke kotak pencarian di atas lalu klik <em>Cek Dokumen</em>. Kamu juga bisa langsung mengarahkan kamera HP ke kode QR di dokumen.
                </p>
              </div>

              <div className="space-y-2.5 bg-[#F9F8F6] p-5 rounded-xl border border-[#EAE6DC]/80">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-[#D15B40] font-mono">03</div>
                  <span className="text-[11px] font-semibold text-[#78746B] uppercase tracking-wide">Hasil Validasi</span>
                </div>
                <h4 className="font-bold text-sm text-[#171717]">Lihat Bukti Keaslian Resmi</h4>
                <p className="text-xs text-[#525049] leading-relaxed">
                  Halaman ini seketika menampilkan identitas siswa, daftar kegiatan ekskul, persentase kehadiran, sertifikat juara, serta tanda tangan pembina sekolah.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Documents Covered */}
          <section className="space-y-4">
            <h3 className="text-base font-bold text-[#171717]">Dokumen Apa Saja yang Bisa Dicek di Sini?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex items-start gap-3 text-xs">
                <FileText className="w-5 h-5 text-[#D15B40] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#171717]">Transkrip Portofolio Ekskul</div>
                  <div className="text-[#525049] mt-0.5">Memuat riwayat keikutsertaan ekskul, peran jabatan, dan persentase kehadiran latihan.</div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex items-start gap-3 text-xs">
                <Trophy className="w-5 h-5 text-[#B58A32] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#171717]">Sertifikat Prestasi & Juara</div>
                  <div className="text-[#525049] mt-0.5">Pengakuan resmi atas keikutsertaan lomba dan medali juara yang diraih siswa.</div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex items-start gap-3 text-xs">
                <Award className="w-5 h-5 text-[#2A7B88] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#171717]">Surat Keterangan Pengurus</div>
                  <div className="text-[#525049] mt-0.5">Bukti sah masa bakti ketua, pengurus inti, dan koordinator divisi organisasi ekskul.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Trust Footer Note */}
          <div className="p-5 bg-white border border-[#EAE6DC] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC] flex items-center justify-center text-[#D15B40] shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#171717] block">Terhubung Langsung dengan Kesiswaan Sekolah</span>
                <span className="text-[#525049]">Semua data portofolio dan prestasi dikelola secara aman serta diverifikasi berkala oleh guru pembina.</span>
              </div>
            </div>
            
            {sampleVerification && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchInput(sampleVerification.verification_id);
                  onNavigate(`/verify/${sampleVerification.verification_id}`);
                }}
                className="shrink-0 rounded-xl"
              >
                Lihat Contoh Format Resmi <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
