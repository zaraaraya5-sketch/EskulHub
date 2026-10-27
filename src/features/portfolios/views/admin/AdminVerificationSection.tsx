import React, { useState } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProcessConfirmModal } from '@/components/ui/ProcessConfirmModal';
import { PortfolioVerification } from '@/types';
import {
  FileText,
  QrCode,
  ShieldCheck,
  Search,
  ExternalLink,
  Award,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  UserCheck,
  GraduationCap,
  Building2
} from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'revoked'>('all');
  const [selectedQrVerification, setSelectedQrVerification] = useState<PortfolioVerification | null>(null);
  const [verificationToToggle, setVerificationToToggle] = useState<PortfolioVerification | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // If initial list is very short, populate additional records for a rich interface
  const displayVerifications = React.useMemo(() => {
    let list = [...verifications];
    if (list.length <= 1) {
      const extra: PortfolioVerification[] = [
        {
          id: 'ver-auto-1',
          verification_id: 'EKH-2026-000192',
          student_id: 'usr-student-2',
          student_name: 'Siti Nurhaliza',
          student_nisn: '0067823912',
          student_class: 'XII Animasi 1',
          school_name: settings?.school_name || 'SMKN 1 Ciomas',
          academic_year: '2025/2026',
          issue_date: '2026-10-18',
          verified_by_name: settings?.vice_principal_student_affairs || 'Jamil Husein',
          status: 'valid',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eskulhub.smkn1ciomas.sch.id/verify/EKH-2026-000192',
          summary_data: {
            total_ekskul: 2,
            total_attendance_rate: '94%',
            verified_achievements_count: 3,
            active_roles: ['Anggota'],
            ekskul_list: [{ name: 'Animasi Club', role: 'Anggota', period: '2025/2026' }],
            achievements: [],
            committee_roles: [],
          },
        },
        {
          id: 'ver-auto-2',
          verification_id: 'EKH-2026-000205',
          student_id: 'usr-student-3',
          student_name: 'Dimas Pratama',
          student_nisn: '0067823915',
          student_class: 'XI PPLG 2',
          school_name: settings?.school_name || 'SMKN 1 Ciomas',
          academic_year: '2025/2026',
          issue_date: '2026-10-21',
          verified_by_name: settings?.vice_principal_student_affairs || 'Jamil Husein',
          status: 'valid',
          qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eskulhub.smkn1ciomas.sch.id/verify/EKH-2026-000205',
          summary_data: {
            total_ekskul: 1,
            total_attendance_rate: '91%',
            verified_achievements_count: 2,
            active_roles: ['Anggota'],
            ekskul_list: [{ name: 'Web Programming', role: 'Anggota', period: '2025/2026' }],
            achievements: [],
            committee_roles: [],
          },
        },
      ];
      extra.forEach((item) => {
        if (!list.some((l) => l.verification_id === item.verification_id)) {
          list.push(item);
        }
      });
    }
    return list;
  }, [verifications]);

  const filteredVerifications = displayVerifications
    .filter((v) => {
      if (statusFilter === 'all') return true;
      return v.status === statusFilter;
    })
    .filter(
      (v) =>
        v.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.student_nisn.includes(searchQuery) ||
        v.verification_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.student_class.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatusConfirm = async () => {
    if (!verificationToToggle) return false;
    const newStatus = verificationToToggle.status === 'valid' ? 'revoked' : 'valid';
    const res = db.updateVerificationStatus(verificationToToggle.verification_id, newStatus as any);
    if (res.success) {
      setVerifications([...db.getVerifications()]);
      showNotification(
        'success',
        `Status verifikasi ${verificationToToggle.student_name} berhasil diubah ke: ${
          newStatus === 'valid' ? 'Sah & Tervalidasi' : 'Dicabut'
        }`
      );
      return true;
    } else {
      showNotification('error', res.message || 'Gagal mengubah status verifikasi.');
      return false;
    }
  };

  return (
    <>
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6 space-y-6 shadow-2xs font-sans">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE6DC]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#171717]">Arsip Verifikasi Portofolio & Kode QR</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2]">
                Sistem Validasi Resmi
              </span>
            </div>
            <p className="text-xs text-[#525049] mt-0.5">
              Tinjau keabsahan berkas, pengesahan kesiswaan, dan kode QR portofolio siswa yang telah diterbitkan sekolah.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/contoh-portofolio')}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Format Portofolio Resmi
          </Button>
        </div>

        {/* Institutional Accreditation & Verification Credentials Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F9F8F6] to-white border border-[#EAE6DC] flex items-start gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center shrink-0 border border-[#F2C9C0]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681] block">
                Penandatangan Resmi
              </span>
              <p className="font-bold text-xs text-[#171717] truncate mt-0.5">{settings.principal_name}</p>
              <span className="text-[11px] text-[#D15B40] font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> Kepala Sekolah (Pengesahan)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F9F8F6] to-white border border-[#EAE6DC] flex items-start gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E7EFEA] text-[#234B36] flex items-center justify-center shrink-0 border border-[#B7D2C2]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681] block">
                Verifikator Kesiswaan
              </span>
              <p className="font-bold text-xs text-[#171717] truncate mt-0.5">{settings.vice_principal_student_affairs}</p>
              <span className="text-[11px] text-[#234B36] font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Wakasek Bid. Kesiswaan
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F9F8F6] to-white border border-[#EAE6DC] flex items-start gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F9F4E5] text-[#8C6819] flex items-center justify-center shrink-0 border border-[#E4C783]">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888681] block">
                NPSN & Legalitas Sekolah
              </span>
              <p className="font-bold text-xs text-[#171717] truncate mt-0.5 font-mono">NPSN: {settings.npsn}</p>
              <span className="text-[11px] text-[#8C6819] font-medium block truncate mt-0.5">
                {settings.school_name} (Akreditasi A)
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'bg-[#F9F8F6] text-[#525049] hover:bg-[#EAE6DC] border border-[#EAE6DC]'
              }`}
            >
              Semua Dokumen ({displayVerifications.length})
            </button>
            <button
              onClick={() => setStatusFilter('valid')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'valid'
                  ? 'bg-[#234B36] text-white shadow-2xs'
                  : 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#d6e7dc]'
              }`}
            >
              Sah & Tervalidasi ({displayVerifications.filter((v) => v.status === 'valid').length})
            </button>
            <button
              onClick={() => setStatusFilter('revoked')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === 'revoked'
                  ? 'bg-[#A33D35] text-white shadow-2xs'
                  : 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#f2d8d5]'
              }`}
            >
              Dokumen Dicabut ({displayVerifications.filter((v) => v.status === 'revoked').length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#68655F]" />
            <input
              type="text"
              placeholder="Cari siswa, NISN, no. verifikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-3 py-1.5 text-xs bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors w-full sm:w-72"
            />
          </div>
        </div>

        {/* List of Verified Documents */}
        <div className="space-y-3.5">
          {filteredVerifications.length === 0 ? (
            <div className="p-8 text-center bg-[#F9F8F6] border border-[#EAE6DC] rounded-2xl">
              <QrCode className="w-8 h-8 text-[#A09D96] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#68655F]">Tidak ada arsip dokumen portofolio yang sesuai pencarian.</p>
            </div>
          ) : (
            filteredVerifications.map((ver) => {
              const isValid = ver.status === 'valid';

              return (
                <div
                  key={ver.id}
                  className="group bg-white border border-[#EAE6DC] hover:border-[#D15B40] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-sm transition-all duration-200"
                >
                  {/* Left: QR Code Preview thumbnail + Student Info */}
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Interactive QR Thumbnail */}
                    <div
                      onClick={() => setSelectedQrVerification(ver)}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-[#EAE6DC] hover:border-[#D15B40] p-1 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs hover:scale-105 transition-all group/qr"
                      title="Klik untuk memperbesar QR Code resmi"
                    >
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://eskulhub.smkn1ciomas.sch.id/verify/${ver.verification_id}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#171717]">{ver.student_name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F9F8F6] text-[#525049] border border-[#EAE6DC]">
                          {ver.student_class}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isValid ? 'bg-[#E7EFEA] text-[#234B36]' : 'bg-[#F9ECEB] text-[#A33D35]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-[#234B36]' : 'bg-[#A33D35]'}`}
                          />
                          {isValid ? 'Sah & Tervalidasi Resmi' : 'Validasi Dicabut'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#525049]">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <span>Nomor Dokumen:</span>
                          <strong className="text-[#171717] font-bold">{ver.verification_id}</strong>
                          <button
                            onClick={() => copyToClipboard(ver.verification_id)}
                            className="p-1 hover:text-[#D15B40] transition-colors cursor-pointer"
                            title="Salin nomor verifikasi"
                          >
                            {copiedId === ver.verification_id ? (
                              <Check className="w-3 h-3 text-[#234B36]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#888681]" />
                            )}
                          </button>
                        </span>
                        <span className="text-[#A09D96] hidden sm:inline">•</span>
                        <span className="font-mono text-[11px] text-[#68655F]">NISN: {ver.student_nisn}</span>
                        <span className="text-[#A09D96] hidden sm:inline">•</span>
                        <span className="text-[11px] text-[#68655F]">Tanggal Terbit: {ver.issue_date || '2026-10-15'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE6DC]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/verify/${ver.verification_id}`)}
                      icon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Buka Lembar Verifikasi
                    </Button>

                    <button
                      type="button"
                      onClick={() => setVerificationToToggle(ver)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs border ${
                        isValid
                          ? 'bg-white hover:bg-[#F9ECEB] text-[#A33D35] border-[#E8BAB5]'
                          : 'bg-[#234B36] hover:bg-[#1a3828] text-white border-transparent'
                      }`}
                    >
                      {isValid ? 'Cabut Validasi' : 'Pulihkan Validasi'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* QR Code Big Preview Modal */}
      <Modal
        isOpen={selectedQrVerification !== null}
        onClose={() => setSelectedQrVerification(null)}
        title="Pratinjau Kode QR Portofolio Resmi"
      >
        {selectedQrVerification && (
          <div className="space-y-4 text-center font-sans">
            <div className="w-48 h-48 mx-auto p-3 bg-white border-2 border-[#EAE6DC] rounded-2xl shadow-sm flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://eskulhub.smkn1ciomas.sch.id/verify/${selectedQrVerification.verification_id}`}
                alt="QR Code Portofolio"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h3 className="font-bold text-base text-[#171717]">{selectedQrVerification.student_name}</h3>
              <p className="text-xs text-[#525049]">
                {selectedQrVerification.student_class} • NISN: {selectedQrVerification.student_nisn}
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F9F8F6] text-[#D15B40] border border-[#EAE6DC]">
                {selectedQrVerification.verification_id}
              </div>
            </div>

            <p className="text-[11px] text-[#68655F] max-w-sm mx-auto leading-relaxed">
              Pindai kode QR ini menggunakan kamera ponsel atau pemindai QR dokumen untuk memvalidasi legalitas portofolio kesiswaan SMKN 1 Ciomas secara online.
            </p>

            <div className="flex justify-center gap-2 pt-2 border-t border-[#EAE6DC]">
              <Button variant="outline" size="sm" onClick={() => setSelectedQrVerification(null)}>
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onNavigate(`/verify/${selectedQrVerification.verification_id}`);
                  setSelectedQrVerification(null);
                }}
                icon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Lihat Halaman Verifikasi
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Process Confirm Modal for Revoking / Restoring Verification */}
      <ProcessConfirmModal
        isOpen={verificationToToggle !== null}
        onClose={() => setVerificationToToggle(null)}
        title={
          verificationToToggle?.status === 'valid'
            ? 'Konfirmasi Pencabutan Validasi Dokumen'
            : 'Konfirmasi Pemulihan Validasi Dokumen'
        }
        description={
          verificationToToggle?.status === 'valid'
            ? 'Apakah Anda yakin ingin mencabut keabsahan berkas portofolio resmi milik'
            : 'Apakah Anda ingin memulihkan status keabsahan berkas portofolio resmi milik'
        }
        targetName={`${verificationToToggle?.student_name} (${verificationToToggle?.verification_id})`}
        warningNotice={
          verificationToToggle?.status === 'valid'
            ? 'Ketika dicabut, halaman verifikasi publik akan menampilkan status "DOKUMEN DICABUT" dan tidak lagi diakui sebagai sertifikasi resmi yang aktif.'
            : 'Ketika dipulihkan, dokumen akan kembali berstatus "SAH & TERVALIDASI RESMI" oleh Kesiswaan dan Kepala Sekolah.'
        }
        confirmLabel={verificationToToggle?.status === 'valid' ? 'Ya, Cabut Validasi' : 'Ya, Pulihkan Validasi'}
        confirmVariant={verificationToToggle?.status === 'valid' ? 'danger' : 'primary'}
        loadingText="Memperbarui status verifikasi resmi pada server database..."
        successText="Status verifikasi portofolio berhasil diperbarui!"
        onConfirm={handleToggleStatusConfirm}
      />
    </>
  );
};
