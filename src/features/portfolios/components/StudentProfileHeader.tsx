import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, UploadCloud, Download } from 'lucide-react';

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
    <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-[#234B36] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
          {studentName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#234B36]">
              Portal Siswa Resmi
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2]">
              TA {academicYear}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECEAE4] text-[#171717] border border-[#EAE6DC]">
              {regClass}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
            {studentName}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">
            NISN: <span className="font-mono font-medium text-[#171717]">{regNisn}</span> • {schoolName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenRegisterModal}
          icon={<Plus className="w-3.5 h-3.5 text-[#234B36]" />}
        >
          Daftar Ekskul Baru
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenUploadModal}
          icon={<UploadCloud className="w-3.5 h-3.5 text-[#234B36]" />}
        >
          Unggah Dokumen
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onDownloadPdf}
          isLoading={isGeneratingPdf}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Unduh Portofolio PDF
        </Button>
      </div>
    </div>
  );
};
