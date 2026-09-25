import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Certificate } from '@/types';
import { UploadCloud, Award, ExternalLink } from 'lucide-react';

interface StudentDocumentsTabProps {
  myCertificates: Certificate[];
  setUploadModalOpen: (open: boolean) => void;
  setDocError: (error: string) => void;
  setDocSuccess: (success: string) => void;
}

export const StudentDocumentsTab: React.FC<StudentDocumentsTabProps> = ({
  myCertificates,
  setUploadModalOpen,
  setDocError,
  setDocSuccess,
}) => {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#171717]">Dokumen Pendukung & Piagam Prestasi</h2>
          <p className="text-xs text-[#68655F]">
            Unggah salinan sertifikat kompetisi atau piagam keikutsertaan untuk memperkuat verifikasi portofolio.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setDocError('');
            setDocSuccess('');
            setUploadModalOpen(true);
          }}
          icon={<UploadCloud className="w-3.5 h-3.5" />}
        >
          Unggah Dokumen Baru
        </Button>
      </div>

      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs space-y-4">
        {myCertificates.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#68655F] space-y-3">
            <UploadCloud className="w-10 h-10 text-[#68655F]/40 mx-auto" />
            <p>Belum ada berkas sertifikat yang diunggah.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDocError('');
                setDocSuccess('');
                setUploadModalOpen(true);
              }}
            >
              Unggah Dokumen Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 border border-[#EAE6DC] rounded-lg bg-white hover:border-[#234B36] transition-colors flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EFEA] text-[#234B36] flex items-center justify-center shrink-0 border border-[#B7D2C2]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#171717]">{cert.title}</h4>
                      <Badge variant={cert.is_verified ? 'success' : 'warning'}>
                        {cert.is_verified ? 'Terverifikasi' : 'Menunggu Review'}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#68655F]">
                      Penerbit: <strong className="text-[#171717]">{cert.issuer}</strong>
                    </div>
                    <div className="text-[11px] font-mono text-[#68655F]">
                      No: {cert.certificate_number || '-'} • Tanggal: {cert.issue_date}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE6DC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#68655F]">Format: Digital Tersimpan</span>
                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#234B36] hover:underline"
                    >
                      <span>Buka Berkas</span>
                      <ExternalLink className="w-3 h-3" />
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
