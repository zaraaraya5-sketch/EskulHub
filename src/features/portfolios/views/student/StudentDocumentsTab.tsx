import React from 'react';
import { Button } from '@/components/ui/Button';
import { Certificate } from '@/types';
import { UploadCloud, Award, ExternalLink, FileCheck, CheckCircle2 } from 'lucide-react';

interface StudentDocumentsTabProps {
  myCertificates: Certificate[];
  onUploadNew?: () => void;
  setUploadModalOpen?: (open: boolean) => void;
  setDocError?: (error: string) => void;
  setDocSuccess?: (success: string) => void;
}

export const StudentDocumentsTab: React.FC<StudentDocumentsTabProps> = ({
  myCertificates,
  onUploadNew,
  setUploadModalOpen,
  setDocError,
  setDocSuccess,
}) => {
  const handleTriggerUpload = () => {
    if (onUploadNew) {
      onUploadNew();
      return;
    }
    if (setDocError) setDocError('');
    if (setDocSuccess) setDocSuccess('');
    if (setUploadModalOpen) setUploadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Kearsipan Dokumen Siswa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Dokumen Pendukung & Piagam Prestasi
          </h2>
          <p className="text-xs text-[#68655F] mt-0.5">
            Unggah salinan sertifikat kejuaraan atau piagam kepengurusan untuk memperkuat validitas transkrip portofolio.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleTriggerUpload}
          icon={<UploadCloud className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto cursor-pointer shadow-xs"
        >
          Unggah Dokumen Baru
        </Button>
      </div>

      {/* Main Documents Grid Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        {myCertificates.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#68655F] space-y-3">
            <UploadCloud className="w-10 h-10 text-[#A39F97]/40 mx-auto" />
            <p>Belum ada berkas piagam atau sertifikat yang diunggah.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerUpload}
              className="cursor-pointer"
            >
              Unggah Dokumen Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {myCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 border border-[#EAE6DC] rounded-xl bg-white hover:border-[#D15B40]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] flex items-center justify-center shrink-0 shadow-2xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-[#171717] leading-snug">{cert.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          cert.is_verified
                            ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                            : 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                        }`}
                      >
                        {cert.is_verified ? 'Terverifikasi' : 'Menunggu'}
                      </span>
                    </div>
                    <div className="text-xs text-[#68655F]">
                      Penerbit: <strong className="text-[#171717]">{cert.issuer}</strong>
                    </div>
                    <div className="text-[11px] font-mono text-[#68655F]">
                      No: {cert.certificate_number || '-'} • Tanggal: {cert.issue_date}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE6DC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#68655F] flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#D15B40]" />
                    <span>Format Digital Terarsip</span>
                  </span>
                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D15B40] hover:text-[#B94931] hover:underline"
                    >
                      <span>Buka Berkas</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
