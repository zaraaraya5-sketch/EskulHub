import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, UploadCloud, Download, Sparkles } from 'lucide-react';

interface StudentProfileHeaderProps {
  studentName: string;
  regClass: string;
  regNisn: string;
  academicYear: string;
  schoolName: string;
  isGeneratingPdf: boolean;
  onOpenRegisterModal: () => void;
  onOpenUploadModal: () => void;
  onDownloadPdf: () => void;
}

export const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  studentName,
  regClass,
  regNisn,
  academicYear,
  schoolName,
  isGeneratingPdf,
  onOpenRegisterModal,
  onOpenUploadModal,
  onDownloadPdf,
}) => {
  return (
    <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all">
      <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#DE6449] to-[#B94931] text-white rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm shrink-0 select-none">
          {studentName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
              Portal Siswa Resmi
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F9F8F6] text-[#525049] border border-[#EAE6DC]">
              TA {academicYear}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F9F8F6] text-[#171717] border border-[#EAE6DC]">
              {regClass}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] truncate">
            {studentName}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5 truncate">
            NISN: <span className="font-mono font-medium text-[#171717]">{regNisn}</span> • {schoolName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenRegisterModal}
          icon={<Plus className="w-3.5 h-3.5 text-[#D15B40]" />}
          className="flex-1 sm:flex-none justify-center cursor-pointer"
        >
          Daftar Ekskul Baru
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenUploadModal}
          icon={<UploadCloud className="w-3.5 h-3.5 text-[#D15B40]" />}
          className="flex-1 sm:flex-none justify-center cursor-pointer"
        >
          Unggah Dokumen
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onDownloadPdf}
          isLoading={isGeneratingPdf}
          icon={<Download className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto justify-center cursor-pointer shadow-xs"
        >
          Unduh Portofolio PDF
        </Button>
      </div>
    </div>
  );
};
