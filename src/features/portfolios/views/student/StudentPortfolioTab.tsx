import React from 'react';
import { Button } from '@/components/ui/Button';
import { ExtracurricularMember, Achievement, PortfolioVerification } from '@/types';
import { db } from '@/lib/database';
import { ShieldCheck, Download, ExternalLink, QrCode, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-gradient-to-br from-[#232220] to-[#171717] text-white rounded-2xl p-5 sm:p-7 shadow-xs border border-[#3E3C38] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-md text-[11px] font-bold uppercase tracking-wider text-[#D15B40]">
            <ShieldCheck className="w-4 h-4" />
            <span>Dokumen Portofolio Resmi Sekolah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Transkrip Portofolio Ekstrakurikuler Siswa
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Dokumen resmi yang memuat keikutsertaan ekskul, rekapitulasi kehadiran ({attendanceRate}%), raihan prestasi lomba, serta peran organisasi yang tervalidasi dengan kode verifikasi publik sekolah.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="bg-[#D15B40] hover:bg-[#B94931] text-white font-bold shrink-0 shadow-xs cursor-pointer justify-center"
          onClick={handleDownloadPdf}
          isLoading={isGeneratingPdf}
          icon={<Download className="w-4 h-4" />}
        >
          Unduh Dokumen PDF
        </Button>
      </div>

      {/* Official Certificate Preview Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Formal Institutional Header with Left & Right Transparent Logos */}
        <div className="pb-3">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Logo SMKN 1 Ciomas (Transparent) */}
            <div className="w-14 h-16 sm:w-18 sm:h-22 flex items-center justify-center shrink-0">
              <img
                src="/images/logo-smkn1ciomas.png"
                alt="Logo SMKN 1 Ciomas"
                className="w-full h-full object-contain filter drop-shadow-2xs select-none"
              />
            </div>

            {/* Center: Kop Teks Instansi */}
            <div className="text-center flex-1 min-w-0">
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#68655F]">
                Pemerintah Daerah Provinsi Jawa Barat • Dinas Pendidikan
              </div>
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[#525049] mt-0.5">
                Cabang Dinas Pendidikan Wilayah I Kabupaten Bogor
              </div>
              <div className="text-sm sm:text-lg font-black text-[#171717] uppercase tracking-wide mt-0.5">
                {settings.school_name || 'SMK NEGERI 1 CIOMAS'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#68655F] mt-0.5">
                Jl. Raya Laladon No. 20, Ciomas, Kab. Bogor 16610 • Telp: (0251) 8638148
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#68655F]">
                NPSN: <span className="font-mono font-semibold text-[#171717]">20254135</span> • Website: smkn1ciomas.sch.id
              </div>
            </div>

            {/* Right: Logo Tugu Kujang (Transparent) */}
            <div className="w-14 h-16 sm:w-18 sm:h-22 flex items-center justify-center shrink-0">
              <img
                src="/images/logo-tugu-kujang.png"
                alt="Logo Tugu Kujang Bogor"
                className="w-full h-full object-contain filter drop-shadow-2xs select-none"
              />
            </div>
          </div>

          {/* Formal Double Line Divider */}
          <div className="border-t-2 border-b border-[#171717] py-0.5 my-3.5 mx-auto w-full" />

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-black text-[#171717] tracking-tight uppercase">
              SURAT KETERANGAN PORTOFOLIO EKSTRAKURIKULER
            </h3>
            <div className="text-xs font-mono text-[#68655F] mt-1">
              Nomor: 421.5/SKP-EK/SMKN1CMS/2026/{verification.verification_id}
            </div>
          </div>
        </div>

        {/* Verification Fast-Action Bar */}
        <div className="p-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#525049]">
            <CheckCircle2 className="w-4 h-4 text-[#D15B40] shrink-0" />
            <span>Dokumen ini telah terdaftar sah di pangkalan data kearsipan digital sekolah.</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`/verify/${verification.verification_id}`)}
            className="px-3 py-1.5 bg-[#FDEDE9] hover:bg-[#FCE3DD] border border-[#F2C9C0] text-[#D15B40] text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Lihat Halaman Verifikasi Publik</span>
          </button>
        </div>

        {/* Student Identity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl">
            <span className="text-[10px] text-[#68655F] block uppercase font-bold tracking-wider">Nama Lengkap</span>
            <span className="text-sm font-bold text-[#171717] mt-0.5 block truncate">{studentName}</span>
          </div>
          <div className="p-3.5 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl">
            <span className="text-[10px] text-[#68655F] block uppercase font-bold tracking-wider">NISN Siswa</span>
            <span className="text-sm font-bold font-mono text-[#171717] mt-0.5 block">{regNisn}</span>
          </div>
          <div className="p-3.5 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl">
            <span className="text-[10px] text-[#68655F] block uppercase font-bold tracking-wider">Rombel / Kelas</span>
            <span className="text-sm font-bold text-[#171717] mt-0.5 block">{regClass}</span>
          </div>
          <div className="p-3.5 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl">
            <span className="text-[10px] text-[#68655F] block uppercase font-bold tracking-wider">Presensi Latihan</span>
            <span className="text-sm font-bold text-[#D15B40] mt-0.5 block">{attendanceRate}% ({presentCount}/{totalSessions} Sesi)</span>
          </div>
        </div>

        {/* Table 1: Ekstrakurikuler yang Diikuti */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D15B40]" />
            <span>1. Keikutsertaan Ekstrakurikuler</span>
          </h4>
          <div className="overflow-x-auto border border-[#EAE6DC] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                <tr>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px] w-12 text-center">No</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px]">Nama Ekstrakurikuler</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px]">Kategori</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px]">Peran / Jabatan</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px] text-right">Tahun Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DC]">
                {myMemberships.map((m, idx) => {
                  const eks = db.getExtracurricularById(m.extracurricular_id);
                  return (
                    <tr key={m.id} className="hover:bg-[#F9F8F6]/40">
                      <td className="py-2.5 px-3.5 font-mono text-[#68655F] text-center">{idx + 1}</td>
                      <td className="py-2.5 px-3.5 font-bold text-[#171717]">{eks?.name}</td>
                      <td className="py-2.5 px-3.5 text-[#525049]">{eks?.category}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[#68655F] text-right">{m.joined_at}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Prestasi & Penghargaan */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D15B40]" />
            <span>2. Rekam Jejak Prestasi & Kompetisi</span>
          </h4>
          <div className="overflow-x-auto border border-[#EAE6DC] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                <tr>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px] w-12 text-center">No</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px]">Nama Prestasi</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px]">Ajang Kejuaraan</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px]">Tingkat</th>
                  <th className="py-2.5 px-3.5 font-bold uppercase text-[11px] text-right">Peringkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DC]">
                {myAchievements.map((ach, idx) => (
                  <tr key={ach.id} className="hover:bg-[#F9F8F6]/40">
                    <td className="py-2.5 px-3.5 font-mono text-[#68655F] text-center">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-[#171717]">{ach.title}</td>
                    <td className="py-2.5 px-3.5 text-[#525049]">{ach.competition_name}</td>
                    <td className="py-2.5 px-3.5 text-[#525049]">{ach.level}</td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-[#D15B40]">{ach.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures & Certification Grid */}
        <div className="pt-6 border-t border-[#EAE6DC] grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-center">
          <div className="space-y-12">
            <div>
              <div className="text-[11px] text-[#68655F]">Mengetahui,</div>
              <div className="font-bold text-[#171717] mt-0.5">Wakasek Bidang Kesiswaan</div>
            </div>
            <div>
              <div className="font-bold text-[#171717] underline">Jamil Husein, S.Pd.</div>
              <div className="text-[11px] font-mono text-[#68655F]">NIP. 19780512 200501 1 004</div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <div className="text-[11px] text-[#68655F]">Ciomas, 20 September 2026</div>
              <div className="font-bold text-[#171717] mt-0.5">Kepala SMK Negeri 1 Ciomas</div>
            </div>
            <div>
              <div className="font-bold text-[#171717] underline">Januar Ashari, M.Pd.</div>
              <div className="text-[11px] font-mono text-[#68655F]">NIP. 19710315 199702 1 002</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
