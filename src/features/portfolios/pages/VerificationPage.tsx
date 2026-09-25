import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, AlertTriangle, Search, School, Calendar, User, Trophy, Award } from 'lucide-react';

interface VerificationPageProps {
  verificationId: string;
  onNavigate: (path: string) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ verificationId, onNavigate }) => {
  const [searchInput, setSearchInput] = useState(verificationId || '');
  const verification = db.getVerificationById(verificationId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate(`/verify/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="bg-white border border-[#D8D4CC] rounded-lg p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#234B36] mb-2">
          <ShieldCheck className="w-5 h-5 text-[#234B36]" />
          <span>Verifikasi Resmi Portofolio Siswa</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#171717] mb-2">
          Pusat Validasi Dokumen & Prestasi Non-Akademik
        </h1>
        <p className="text-xs sm:text-sm text-[#68655F] mb-4">
          Layanan publik untuk memverifikasi keabsahan lembar portofolio kegiatan siswa yang diterbitkan resmi oleh sekolah.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Masukkan Nomor Verifikasi (Contoh: EKH-2026-000184)"
            className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
          />
          <Button type="submit" variant="primary">
            Cek Keabsahan
          </Button>
        </form>
      </div>

      {/* Verification Result Card */}
      {verification ? (
        <div className="bg-white border border-[#D8D4CC] rounded-lg overflow-hidden shadow-xs">
          {/* Certificate Top Banner */}
          <div className="bg-[#234B36] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-white/80 block">Status Validasi:</span>
                <span className="text-base sm:text-lg font-bold">DOKUMEN RESMI TERVERIFIKASI</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/80 block">Nomor Arsip:</span>
              <span className="font-mono text-sm font-bold text-white">{verification.verification_id}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Student & School Info Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F5F2EA] border border-[#D8D4CC] rounded-lg text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#68655F] uppercase">
                  <User className="w-3.5 h-3.5 text-[#234B36]" />
                  <span>Identitas Siswa</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#171717]">{verification.student_name}</div>
                  <div className="text-[#68655F]">NISN: {verification.student_nisn} • Kelas: {verification.student_class}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#68655F] uppercase">
                  <School className="w-3.5 h-3.5 text-[#234B36]" />
                  <span>Satuan Pendidikan Penerbit</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#171717]">{verification.school_name}</div>
                  <div className="text-[#68655F]">Tahun Ajaran: {verification.academic_year} • Disahkan: {verification.issue_date}</div>
                </div>
              </div>
            </div>

            {/* Verified Extracurriculars List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] pb-2 border-b border-[#D8D4CC] mb-3 flex items-center justify-between">
                <span>1. Keanggotaan Ekstrakurikuler yang Disahkan</span>
                <Badge variant="success">Presensi: {verification.summary_data.total_attendance_rate}</Badge>
              </h3>
              <div className="divide-y divide-[#D8D4CC] border border-[#D8D4CC] rounded">
                {verification.summary_data.ekskul_list.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#171717]">{item.name}</span>
                      <span className="text-[#68655F] ml-2">({item.role})</span>
                    </div>
                    <span className="text-[#68655F] font-mono">{item.period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Achievements List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] pb-2 border-b border-[#D8D4CC] mb-3 flex items-center justify-between">
                <span>2. Prestasi & Penghargaan Terverifikasi</span>
                <Trophy className="w-4 h-4 text-[#B58A32]" />
              </h3>
              <div className="space-y-2">
                {verification.summary_data.achievements.map((ach, idx) => (
                  <div key={idx} className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#171717]">{ach.title}</div>
                      <div className="text-[#68655F]">Tingkat {ach.level} • {ach.year}</div>
                    </div>
                    <Badge variant="warning">{ach.rank}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Validation Notice */}
            <div className="p-4 border-l-4 border-[#234B36] bg-[#F5F2EA] text-xs text-[#68655F] space-y-1">
              <div className="font-bold text-[#171717]">Catatan Pengesahan Institusional:</div>
              <p>
                Dokumen ini sah dan dikeluarkan secara elektronik oleh Kesiswaan {verification.school_name}.
                Data riwayat ini bersumber langsung dari buku induk presensi dan pencatatan prestasi resmi sekolah.
              </p>
              <div className="pt-2 text-[11px] text-[#234B36] font-semibold">
                Diverifikasi oleh: {verification.verified_by_name}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F9ECEB] text-[#A33D35] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#171717]">Data Verifikasi Tidak Ditemukan</h2>
          <p className="text-xs text-[#68655F] max-w-md mx-auto">
            Nomor verifikasi <code className="font-bold text-[#171717]">{verificationId}</code> tidak terdaftar dalam arsip kesiswaan sekolah.
            Mohon pastikan nomor yang Anda masukkan telah sesuai dengan kode pada cetakan dokumen resmi.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/verify/EKH-2026-000184')}
            >
              Coba Contoh Dokumen Sah (EKH-2026-000184)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
