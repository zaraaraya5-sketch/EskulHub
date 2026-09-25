import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ExtracurricularMember, Achievement, PortfolioVerification } from '@/types';
import { db } from '@/lib/storage/mockDatabase';
import { ShieldCheck, Download } from 'lucide-react';

interface StudentPortfolioTabProps {
  attendanceRate: number;
  presentCount: number;
  totalSessions: number;
  studentName: string;
  regNisn: string;
  regClass: string;
  myMemberships: ExtracurricularMember[];
  myAchievements: Achievement[];
  verification: PortfolioVerification;
  settings: any;
  handleDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  onNavigate: (path: string) => void;
}

export const StudentPortfolioTab: React.FC<StudentPortfolioTabProps> = ({
  attendanceRate,
  presentCount,
  totalSessions,
  studentName,
  regNisn,
  regClass,
  myMemberships,
  myAchievements,
  verification,
  settings,
  handleDownloadPdf,
  isGeneratingPdf,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Action Banner */}
      <div className="bg-[#234B36] text-white rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded text-xs font-semibold uppercase tracking-wider text-white">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Dokumen Resmi Validasi Kearsipan Sekolah</span>
          </div>
          <h2 className="text-xl font-bold">Portofolio Non-Akademik Terverifikasi</h2>
          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Portofolio ini berisi rekam jejak resmi keikutsertaan ekskul, persentase kehadiran digital ({attendanceRate}%), pencapaian prestasi lomba, serta peran kepanitiaan yang disahkan dengan QR Code institusi.
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="bg-white text-[#234B36] hover:bg-[#F9F8F6] border-transparent font-bold shrink-0 shadow-sm"
          onClick={handleDownloadPdf}
          isLoading={isGeneratingPdf}
          icon={<Download className="w-4 h-4" />}
        >
          Unduh Dokumen PDF
        </Button>
      </div>

      {/* Document Preview Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-6 shadow-xs space-y-6">
        <div className="border-b-2 border-[#234B36] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#234B36]">
              {settings.school_name}
            </div>
            <h3 className="text-lg font-bold text-[#171717] mt-0.5">
              SURAT KETERANGAN PORTOFOLIO EKSTRAKURIKULER
            </h3>
            <div className="text-xs text-[#68655F]">
              Nomor Surat: <span className="font-mono text-[#171717]">{verification.verification_id}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate(`/verify/${verification.verification_id}`)}
              className="px-3 py-1.5 bg-[#E7EFEA] hover:bg-[#d8e7de] border border-[#B7D2C2] text-[#234B36] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Uji Validasi QR Publik</span>
            </button>
          </div>
        </div>

        {/* Student info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#F9F8F6]/40 border border-[#EAE6DC] rounded">
            <span className="text-[#68655F] block text-[11px]">Nama Lengkap Siswa</span>
            <span className="text-sm font-bold text-[#171717]">{studentName}</span>
          </div>
          <div className="p-3 bg-[#F9F8F6]/40 border border-[#EAE6DC] rounded">
            <span className="text-[#68655F] block text-[11px]">Nomor Induk Siswa (NISN)</span>
            <span className="text-sm font-bold font-mono text-[#171717]">{regNisn}</span>
          </div>
          <div className="p-3 bg-[#F9F8F6]/40 border border-[#EAE6DC] rounded">
            <span className="text-[#68655F] block text-[11px]">Rombongan Belajar (Kelas)</span>
            <span className="text-sm font-bold text-[#171717]">{regClass}</span>
          </div>
          <div className="p-3 bg-[#F9F8F6]/40 border border-[#EAE6DC] rounded">
            <span className="text-[#68655F] block text-[11px]">Tingkat Kehadiran Latihan</span>
            <span className="text-sm font-bold text-[#234B36]">{attendanceRate}% ({presentCount}/{totalSessions} Sesi)</span>
          </div>
        </div>

        {/* Ekstrakurikuler Rekap List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            1. Keikutsertaan Ekstrakurikuler
          </h4>
          <div className="border border-[#EAE6DC] rounded-lg divide-y divide-[#D8D4CC] text-xs">
            {myMemberships.map((m) => {
              const eks = db.getExtracurricularById(m.extracurricular_id);
              return (
                <div key={m.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#171717]">{eks?.name}</span>
                    <span className="text-[#68655F] ml-2">({eks?.category})</span>
                  </div>
                  <Badge variant="success">{m.role}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
            2. Rekam Jejak Prestasi & Kompetisi
          </h4>
          <div className="border border-[#EAE6DC] rounded-lg divide-y divide-[#D8D4CC] text-xs">
            {myAchievements.map((ach) => (
              <div key={ach.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#171717]">{ach.title}</div>
                  <div className="text-[11px] text-[#68655F]">{ach.competition_name} ({ach.level})</div>
                </div>
                <Badge variant={ach.is_verified ? 'success' : 'neutral'}>{ach.rank}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Certification footnote */}
        <div className="pt-4 border-t border-[#EAE6DC] flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-[#68655F]">
          <div>
            <div>Diterbitkan di: Kota Bandung</div>
            <div>Tanggal Pengesahan: 20 September 2026</div>
            <div className="font-semibold text-[#171717] mt-2">Wakasek Kesiswaan: Drs. Bambang Suryono</div>
          </div>

          <Button
            variant="primary"
            onClick={handleDownloadPdf}
            isLoading={isGeneratingPdf}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Unduh Lembar PDF Resmi
          </Button>
        </div>
      </div>
    </div>
  );
};
