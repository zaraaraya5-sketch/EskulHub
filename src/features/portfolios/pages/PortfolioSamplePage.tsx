import React from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  CheckCircle,
  Award,
  Calendar,
  ExternalLink,
  QrCode,
} from 'lucide-react';

interface PortfolioSamplePageProps {
  onNavigate: (path: string) => void;
}

export const PortfolioSamplePage: React.FC<PortfolioSamplePageProps> = ({ onNavigate }) => {
  const settings = db.getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D4CC]">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D8D4CC] rounded text-xs font-semibold text-[#171717] hover:bg-[#F5F2EA] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-[#234B36]" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2] text-xs font-bold uppercase tracking-wider">
            Format Resmi Portofolio Kesiswaan
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Cetak Contoh Dokumen
          </Button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="bg-white border-2 border-[#D8D4CC] rounded-lg p-6 sm:p-10 shadow-sm space-y-8 font-sans">
        {/* Kop Surat Resmi */}
        <div className="border-b-2 border-[#171717] pb-6 flex items-center justify-between gap-6">
          <div className="w-16 h-16 bg-[#234B36] text-white rounded flex items-center justify-center font-bold text-2xl shrink-0">
            EH
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xs font-bold tracking-widest uppercase text-[#68655F]">
              PEMERINTAH DAERAH PROVINSI JAWA BARAT • DINAS PENDIDIKAN
            </h2>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717] uppercase mt-0.5">
              {settings.school_name}
            </h1>
            <p className="text-[11px] text-[#68655F] mt-1">
              NPSN: {settings.npsn} • Status: Terakreditasi A (Unggul) • {settings.address}
            </p>
            <div className="text-[10px] text-[#68655F]">
              Laman Resmi: https://smknusantara.sch.id • Surel: kesiswaan@smknusantara.sch.id
            </div>
          </div>
          <div className="w-16 h-16 shrink-0 hidden sm:flex items-center justify-center border border-[#D8D4CC] rounded p-1 bg-[#F5F2EA]">
            <QrCode className="w-12 h-12 text-[#234B36]" />
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#171717] underline underline-offset-4 decoration-2">
            PORTOFOLIO KEGIATAN NON-AKADEMIK & EKSTRAKURIKULER SISWA
          </h2>
          <div className="text-xs text-[#68655F] font-mono">
            Nomor Registrasi Kearsipan: EKH-2026-000184 / PORT-ND / IX / 2026
          </div>
        </div>

        {/* Student Biodata Box */}
        <div className="bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded p-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            <div className="flex">
              <span className="w-36 text-[#68655F]">Nama Lengkap Siswa</span>
              <span className="font-bold text-[#171717]">: Budi Pratama</span>
            </div>
            <div className="flex">
              <span className="w-36 text-[#68655F]">Nomor Induk Siswa (NISN)</span>
              <span className="font-bold text-[#171717]">: 0067823910</span>
            </div>
            <div className="flex">
              <span className="w-36 text-[#68655F]">Tingkat / Rombel</span>
              <span className="font-bold text-[#171717]">: Kelas XII RPL 1</span>
            </div>
            <div className="flex">
              <span className="w-36 text-[#68655F]">Program Keahlian</span>
              <span className="font-bold text-[#171717]">: Rekayasa Perangkat Lunak</span>
            </div>
            <div className="flex">
              <span className="w-36 text-[#68655F]">Tahun Ajaran / Semester</span>
              <span className="font-bold text-[#171717]">: 2025/2026 (Ganjil)</span>
            </div>
            <div className="flex">
              <span className="w-36 text-[#68655F]">Status Dokumen</span>
              <span className="font-bold text-[#234B36]">: Terverifikasi & Sah</span>
            </div>
          </div>
        </div>

        {/* Section 1: Extracurricular Activities History */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#D8D4CC] pb-1.5">
            <span className="w-6 h-6 rounded bg-[#234B36] text-white flex items-center justify-center font-bold text-xs shrink-0">
              I
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Catatan Partisipasi Ekstrakurikuler & Kehadiran Latihan
            </h3>
          </div>

          <table className="w-full text-xs text-left border border-[#D8D4CC]">
            <thead className="bg-[#F5F2EA] border-b border-[#D8D4CC] text-[#171717]">
              <tr>
                <th className="p-2.5 font-bold w-10">No</th>
                <th className="p-2.5 font-bold">Nama Ekstrakurikuler</th>
                <th className="p-2.5 font-bold">Peran Anggota</th>
                <th className="p-2.5 font-bold">Guru Pembina</th>
                <th className="p-2.5 font-bold text-center">Presensi Hadir</th>
                <th className="p-2.5 font-bold text-center">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              <tr>
                <td className="p-2.5 text-[#68655F]">1</td>
                <td className="p-2.5 font-bold text-[#171717]">Programming & Cyber Club</td>
                <td className="p-2.5">Ketua Divisi Web</td>
                <td className="p-2.5 text-[#68655F]">Dewi Lestari, M.Kom.</td>
                <td className="p-2.5 text-center font-bold text-[#234B36]">96% (24/25 Sesi)</td>
                <td className="p-2.5 text-center font-bold text-[#234B36]">Sangat Baik (A)</td>
              </tr>
              <tr>
                <td className="p-2.5 text-[#68655F]">2</td>
                <td className="p-2.5 font-bold text-[#171717]">Futsal Garuda Nusantara</td>
                <td className="p-2.5">Anggota Reguler</td>
                <td className="p-2.5 text-[#68655F]">Hendra Wijaya, S.Pd.</td>
                <td className="p-2.5 text-center font-bold text-[#234B36]">92% (22/24 Sesi)</td>
                <td className="p-2.5 text-center font-bold text-[#234B36]">Sangat Baik (A)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Verified Achievements & Competitions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#D8D4CC] pb-1.5">
            <span className="w-6 h-6 rounded bg-[#234B36] text-white flex items-center justify-center font-bold text-xs shrink-0">
              II
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Prestasi Kejuaraan & Penghargaan Resmi
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="border border-[#D8D4CC] rounded p-3 bg-[#F5F2EA]/20 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#8C6819] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#171717] text-sm">
                    Juara 1 Lomba Kompetensi Siswa (LKS) Web Technologies
                  </div>
                  <div className="text-[#68655F] mt-0.5">
                    Tingkat Kota Bandung • Diselenggarakan oleh Dinas Pendidikan Provinsi Jawa Barat
                  </div>
                  <div className="text-[11px] text-[#68655F] font-mono mt-1">
                    No. Sertifikat: 421.5/0982-Disdik/LKS/2026 • Tanggal: 15 Juni 2026
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2] rounded font-bold text-[10px] shrink-0">
                Tervalidasi
              </span>
            </div>

            <div className="border border-[#D8D4CC] rounded p-3 bg-[#F5F2EA]/20 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#8C6819] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#171717] text-sm">
                    Apresiasi Pemateri Workshop Literasi Digital Pelajar
                  </div>
                  <div className="text-[#68655F] mt-0.5">
                    Kolaborasi SMK Nusantara Digital x SMPN 12 Bandung
                  </div>
                  <div className="text-[11px] text-[#68655F] font-mono mt-1">
                    No. Piagam: SMK-ND/SERT/2026/088 • Tanggal: 30 Juli 2026
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2] rounded font-bold text-[10px] shrink-0">
                Tervalidasi
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Character & Soft Skills Evaluation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#D8D4CC] pb-1.5">
            <span className="w-6 h-6 rounded bg-[#234B36] text-white flex items-center justify-center font-bold text-xs shrink-0">
              III
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Evaluasi Karakter & Profil Pelajar Pancasila
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="p-3 border border-[#D8D4CC] rounded bg-[#F5F2EA]/40">
              <span className="block text-[#68655F] text-[10px] uppercase font-bold">Kemandirian</span>
              <span className="text-sm font-bold text-[#234B36] mt-1 block">Sangat Baik (A)</span>
            </div>
            <div className="p-3 border border-[#D8D4CC] rounded bg-[#F5F2EA]/40">
              <span className="block text-[#68655F] text-[10px] uppercase font-bold">Kepemimpinan</span>
              <span className="text-sm font-bold text-[#234B36] mt-1 block">Sangat Baik (A)</span>
            </div>
            <div className="p-3 border border-[#D8D4CC] rounded bg-[#F5F2EA]/40">
              <span className="block text-[#68655F] text-[10px] uppercase font-bold">Gotong Royong</span>
              <span className="text-sm font-bold text-[#234B36] mt-1 block">Sangat Baik (A)</span>
            </div>
            <div className="p-3 border border-[#D8D4CC] rounded bg-[#F5F2EA]/40">
              <span className="block text-[#68655F] text-[10px] uppercase font-bold">Integritas</span>
              <span className="text-sm font-bold text-[#234B36] mt-1 block">Sangat Baik (A)</span>
            </div>
          </div>
        </div>

        {/* Signatures & Institutional Stamps */}
        <div className="pt-6 border-t-2 border-[#171717] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-center">
          <div>
            <div className="text-[#68655F]">Mengetahui,</div>
            <div className="font-bold text-[#171717]">Wali Kelas XII RPL 1</div>
            <div className="h-16 flex items-center justify-center text-[#68655F] font-serif italic text-xs">
              [Tanda Tangan Digital Tersertifikasi]
            </div>
            <div className="font-bold text-[#171717]">Dra. Hj. Sri Wahyuni, M.Pd.</div>
            <div className="text-[10px] text-[#68655F]">NIP. 19740812 199903 2 004</div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-2 border-dashed border-[#234B36] rounded p-1 flex flex-col items-center justify-center bg-[#E7EFEA]/30">
              <QrCode className="w-12 h-12 text-[#234B36]" />
              <span className="text-[8px] font-bold text-[#234B36] mt-0.5">PINDAI UNTUK CEK</span>
            </div>
            <div className="text-[10px] text-[#68655F] font-mono mt-1">EKH-2026-000184</div>
          </div>

          <div>
            <div className="text-[#68655F]">Bandung, 20 September 2026</div>
            <div className="font-bold text-[#171717]">Wakasek Bidang Kesiswaan</div>
            <div className="h-16 flex items-center justify-center text-[#68655F] font-serif italic text-xs">
              [Tanda Tangan Digital & Stempel Kesiswaan]
            </div>
            <div className="font-bold text-[#171717]">Drs. Bambang Suryono</div>
            <div className="text-[10px] text-[#68655F]">NIP. 19680515 199403 1 007</div>
          </div>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#234B36] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#1a3828] transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>
    </div>
  );
};
