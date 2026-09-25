import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { generatePortfolioPdf } from '@/lib/pdf/generatePortfolioPdf';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
  Layers,
  ExternalLink,
  Printer,
} from 'lucide-react';

interface StudentPortfolioPageProps {
  onNavigate?: (path: string) => void;
}

export const StudentPortfolioPage: React.FC<StudentPortfolioPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const settings = db.getSettings();
  const [isGenerating, setIsGenerating] = useState(false);

  // Student verification document
  const studentId = currentUser?.id || 'usr-student-1';
  const verification = db.generatePortfolioVerification(studentId, 'Drs. Bambang Suryono');

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      await generatePortfolioPdf(verification, settings);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat file PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DC] pb-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
            Portofolio Non-Akademik Siswa
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Pratinjau & Penerbitan Dokumen Resmi
          </h1>
          <p className="text-xs text-[#68655F] mt-1">
            Dokumen ini diakui resmi oleh sekolah sebagai bukti rekam jejak kegiatan ekstrakurikuler, organisasi, dan prestasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={handleDownloadPdf}
            isLoading={isGenerating}
            icon={<Download className="w-4 h-4" />}
          >
            Unduh Portofolio Resmi (PDF)
          </Button>
        </div>
      </div>

      {/* Official Verification Notice Banner */}
      <div className="p-4 bg-[#E7EFEA] border border-[#B7D2C2] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#234B36] shrink-0" />
          <div>
            <div className="font-bold text-[#234B36]">
              Nomor Registrasi Verifikasi: <span className="font-mono">{verification.verification_id}</span>
            </div>
            <div className="text-[#234B36]/80">
              Disahkan oleh Kesiswaan {settings.school_name} pada {verification.issue_date}.
            </div>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate(`/verify/${verification.verification_id}`)}
            className="text-xs text-[#234B36] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Uji Halaman Verifikasi Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Document Simulation Sheet (Official School Editorial Style) */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-6 sm:p-10 shadow-xs space-y-6 max-w-4xl mx-auto">
        {/* Kop Surat Resmi */}
        <div className="text-center border-b-2 border-[#234B36] pb-4 space-y-0.5">
          <div className="text-xs font-bold text-[#171717] tracking-wider uppercase">
            PEMERINTAH DAERAH PROVINSI JAWA BARAT
          </div>
          <div className="text-xs font-semibold text-[#68655F] uppercase">
            DINAS PENDIDIKAN & KEBUDAYAAN
          </div>
          <div className="text-lg font-bold text-[#234B36] uppercase tracking-wide">
            {settings.school_name}
          </div>
          <div className="text-[11px] text-[#68655F]">
            {settings.address} • NPSN: {settings.npsn}
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2">
          <h2 className="text-sm sm:text-base font-bold text-[#171717] uppercase tracking-wide">
            PORTOFOLIO RESMI KEGIATAN NON-AKADEMIK SISWA
          </h2>
          <div className="text-xs text-[#68655F] font-mono mt-0.5">
            Nomor Arsip: {verification.verification_id}
          </div>
        </div>

        {/* Student Identity Grid */}
        <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded p-4 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-[#68655F]">Nama Siswa Terdaftar:</div>
            <div className="text-sm font-bold text-[#171717]">{verification.student_name}</div>
          </div>
          <div>
            <div className="text-[#68655F]">Nomor Induk Siswa Nasional (NISN):</div>
            <div className="text-sm font-mono font-bold text-[#171717]">{verification.student_nisn}</div>
          </div>
          <div>
            <div className="text-[#68655F]">Tingkat / Rombongan Belajar:</div>
            <div className="font-semibold text-[#171717]">{verification.student_class}</div>
          </div>
          <div>
            <div className="text-[#68655F]">Tahun Ajaran Aktif:</div>
            <div className="font-semibold text-[#171717]">{verification.academic_year}</div>
          </div>
        </div>

        {/* Section 1: Extracurricular History */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] border-b border-[#EAE6DC] pb-1.5 flex items-center justify-between">
            <span>I. Riwayat Keanggotaan & Peran Organisasi</span>
            <span className="text-[11px] font-normal text-[#68655F]">Tingkat Kehadiran: {verification.summary_data.total_attendance_rate}</span>
          </div>

          <table className="w-full text-xs text-left border border-[#EAE6DC]">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2 px-3 font-semibold w-10">No</th>
                <th className="py-2 px-3 font-semibold">Nama Ekstrakurikuler</th>
                <th className="py-2 px-3 font-semibold">Jabatan / Peran</th>
                <th className="py-2 px-3 font-semibold">Periode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {verification.summary_data.ekskul_list.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F9F8F6]/40">
                  <td className="py-2 px-3 text-[#68655F]">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-[#171717]">{item.name}</td>
                  <td className="py-2 px-3 font-semibold text-[#234B36]">{item.role}</td>
                  <td className="py-2 px-3 font-mono text-[#68655F]">{item.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Verified Achievements */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] border-b border-[#EAE6DC] pb-1.5 flex items-center justify-between">
            <span>II. Prestasi & Penghargaan (Terverifikasi Sekolah)</span>
            <Badge variant="warning">{verification.summary_data.verified_achievements_count} Prestasi</Badge>
          </div>

          <table className="w-full text-xs text-left border border-[#EAE6DC]">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2 px-3 font-semibold w-10">No</th>
                <th className="py-2 px-3 font-semibold">Nama Kejuaraan / Kompetisi</th>
                <th className="py-2 px-3 font-semibold">Tingkat</th>
                <th className="py-2 px-3 font-semibold">Predikat</th>
                <th className="py-2 px-3 font-semibold">Tahun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {verification.summary_data.achievements.map((ach, idx) => (
                <tr key={idx} className="hover:bg-[#F9F8F6]/40">
                  <td className="py-2 px-3 text-[#68655F]">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-[#171717]">{ach.title}</td>
                  <td className="py-2 px-3 text-[#68655F]">{ach.level}</td>
                  <td className="py-2 px-3 font-semibold text-[#234B36]">{ach.rank}</td>
                  <td className="py-2 px-3 font-mono text-[#68655F]">{ach.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Committee Roles */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] border-b border-[#EAE6DC] pb-1.5">
            III. Partisipasi Kepanitiaan & Pengabdian Sekolah
          </div>

          <table className="w-full text-xs text-left border border-[#EAE6DC]">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2 px-3 font-semibold w-10">No</th>
                <th className="py-2 px-3 font-semibold">Agenda / Acara Sekolah</th>
                <th className="py-2 px-3 font-semibold">Divisi / Peran Kepanitiaan</th>
                <th className="py-2 px-3 font-semibold">Tahun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {verification.summary_data.committee_roles.map((com, idx) => (
                <tr key={idx} className="hover:bg-[#F9F8F6]/40">
                  <td className="py-2 px-3 text-[#68655F]">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-[#171717]">{com.title}</td>
                  <td className="py-2 px-3 text-[#171717]">{com.role}</td>
                  <td className="py-2 px-3 font-mono text-[#68655F]">{com.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Footer Signature Block */}
        <div className="pt-6 border-t border-[#EAE6DC] flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-[#234B36] uppercase">KODE VERIFIKASI QR DOKUMEN:</div>
            <div className="text-[11px] text-[#68655F]">
              Dokumen ini dilengkapi QR Code verifikasi resmi untuk keperluan seleksi beasiswa dan seleksi perguruan tinggi negeri (SNBP).
            </div>
            <div className="font-mono text-xs font-bold text-[#171717] pt-1">
              STATUS: RESMI TERVERIFIKASI
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[#68655F]">Bandung, {verification.issue_date}</div>
            <div className="text-[#68655F] mb-12">Wakasek Bidang Kesiswaan,</div>
            <div className="font-bold text-[#171717] underline">{settings.vice_principal_student_affairs}</div>
            <div className="text-[10px] text-[#68655F]">NIP. 19780614 200212 1 003</div>
          </div>
        </div>
      </div>
    </div>
  );
};
