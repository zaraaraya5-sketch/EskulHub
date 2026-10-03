import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import { ShieldCheck, Info } from 'lucide-react';
import { Extracurricular } from '@/types';

interface DetailSidebarProps {
  ekskul: Extracurricular;
  isCapacityFull: boolean;
  onOpenRegister: () => void;
}

export const DetailSidebar: React.FC<DetailSidebarProps> = ({
  ekskul,
  isCapacityFull,
  onOpenRegister,
}) => {
  const { currentUser, role } = useAuth();
  const isStudent = !currentUser || role === 'student';

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#68655F] mb-3">
          Struktur Kepengurusan Siswa
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC]">
            <span className="text-[#68655F]">Ketua:</span>
            <strong className="text-[#171717]">{ekskul.chairperson_name}</strong>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC]">
            <span className="text-[#68655F]">Wakil Ketua:</span>
            <strong className="text-[#171717]">Budi Pratama</strong>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE6DC]">
            <span className="text-[#68655F]">Guru Pembina:</span>
            <strong className="text-[#171717]">{ekskul.supervisor_name}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#68655F]">Jumlah Anggota Aktif:</span>
            <strong className="text-[#D15B40]">{ekskul.current_member_count} Siswa</strong>
          </div>
        </div>
      </div>

      {/* Registration Requirement Box */}
      <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-lg p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D15B40] mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Ketentuan Anggota</span>
        </div>
        <ul className="text-xs text-[#68655F] space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>Terdaftar aktif sebagai siswa di {db.getSettings().school_name}.</li>
          <li>Wajib mengikuti sesi latihan rutin sesuai jadwal resmi.</li>
          <li>Menjaga nama baik sekolah dan sportivitas/kode etik organisasi.</li>
          <li>Presensi dicatat otomatis pada dokumen portofolio akhir.</li>
        </ul>

        <div className="mt-4 pt-3 border-t border-[#EAE6DC]">
          {isStudent ? (
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              disabled={isCapacityFull || ekskul.registration_status === 'closed'}
              onClick={onOpenRegister}
            >
              {isCapacityFull ? 'Pendaftaran Ditutup' : 'Formulir Pendaftaran'}
            </Button>
          ) : (
            <div className="p-3 bg-[#F5F2EB] border border-[#EAE6DC] rounded-lg text-xs text-[#525049] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#3B7A82] shrink-0 mt-0.5" />
              <span>Pendaftaran ekskul ini hanya dibuka untuk akun siswa.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
