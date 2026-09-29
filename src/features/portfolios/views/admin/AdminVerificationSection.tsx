import React from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PortfolioVerification } from '@/types';
import { FileText, QrCode } from 'lucide-react';

interface AdminVerificationSectionProps {
  verifications: PortfolioVerification[];
  setVerifications: (data: PortfolioVerification[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onNavigate: (path: string) => void;
  settings: any;
}

export const AdminVerificationSection: React.FC<AdminVerificationSectionProps> = ({
  verifications,
  setVerifications,
  showNotification,
  onNavigate,
  settings,
}) => {
  const toggleVerificationStatus = (verificationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'valid' ? 'revoked' : 'valid';
    const res = db.updateVerificationStatus(verificationId, newStatus as any);
    if (res.success) {
      setVerifications([...db.getVerifications()]);
      showNotification('success', res.message);
    }
  };

  return (
    <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
        <div>
          <h2 className="text-sm font-bold text-[#171717]">Arsip & Pengaturan Verifikasi QR Portofolio</h2>
          <p className="text-xs text-[#68655F]">
            Audit keabsahan dokumen, tanda tangan elektronik, serta kode QR portofolio siswa yang telah diterbitkan.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onNavigate('/contoh-portofolio')} icon={<FileText className="w-3.5 h-3.5" />}>
          Format Portofolio Resmi
        </Button>
      </div>

      {/* Institutional Verification Config Card */}
      <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#68655F]">Penandatangan Dokumen</div>
          <div className="font-bold text-[#171717] mt-0.5">{settings.principal_name}</div>
          <div className="text-[11px] text-[#234B36]">Kepala Sekolah (Sertifikat Digital Valid)</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#68655F]">Verifikator Kesiswaan</div>
          <div className="font-bold text-[#171717] mt-0.5">{settings.vice_principal_student_affairs}</div>
          <div className="text-[11px] text-[#8C6819]">Wakasek Bid. Kesiswaan</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#68655F]">NPSN & Legalitas</div>
          <div className="font-bold text-[#171717] mt-0.5">NPSN: {settings.npsn}</div>
          <div className="text-[11px] text-[#68655F]">{settings.school_name}</div>
        </div>
      </div>

      {/* List of Verified Documents */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#234B36]">
          Daftar Dokumen Portofolio Sah Terdaftar
        </h3>
        {verifications.map((ver) => (
          <div
            key={ver.id}
            className="border border-[#EAE6DC] rounded-lg p-4 bg-[#F9F8F6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717] text-sm">{ver.student_name}</span>
                <span className="text-[#68655F]">({ver.student_class})</span>
                <Badge variant={ver.status === 'valid' ? 'success' : 'danger'}>
                  {ver.status === 'valid' ? 'Sah & Tervalidasi' : 'Dokumen Dicabut'}
                </Badge>
              </div>
              <div className="text-[11px] text-[#68655F] mt-1 font-mono">
                Nomor Verifikasi: <strong className="text-[#234B36]">{ver.verification_id}</strong> • NISN: {ver.student_nisn}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate(`/verify/${ver.verification_id}`)}
                icon={<QrCode className="w-3.5 h-3.5" />}
              >
                Uji QR Publik
              </Button>
              <button
                onClick={() => toggleVerificationStatus(ver.verification_id, ver.status)}
                className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                  ver.status === 'valid'
                    ? 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#e7c7c4]'
                    : 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#cde4d6]'
                }`}
              >
                {ver.status === 'valid' ? 'Cabut Akses' : 'Pulihkan Sah'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
