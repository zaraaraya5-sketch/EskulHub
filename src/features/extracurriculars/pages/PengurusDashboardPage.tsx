import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import {
  Users,
  UserCheck,
  CheckSquare,
  Trophy,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface PengurusDashboardPageProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const PengurusDashboardPage: React.FC<PengurusDashboardPageProps> = ({ onNavigate, currentPath = '/pengurus/dashboard' }) => {
  const { currentUser } = useAuth();

  // Pengurus manages Futsal
  const managedEkskul = db.getExtracurricularById('eks-1')!;
  const [registrations, setRegistrations] = useState(() =>
    db.getRegistrations().filter(r => r.extracurricular_id === managedEkskul.id && r.status === 'pending')
  );
  const members = db.getMembersByExtracurricularId(managedEkskul.id);
  const sessions = db.getAttendanceSessions().filter(s => s.extracurricular_id === managedEkskul.id);
  const latestSession = sessions[0];

  // Action review modal
  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleOpenReview = (id: string, type: 'approved' | 'rejected') => {
    setSelectedRegId(id);
    setActionType(type);
    setReviewNotes('');
    setActionSuccess('');
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegId) return;

    const res = db.updateRegistrationStatus(
      selectedRegId,
      actionType,
      currentUser?.name || 'Pengurus',
      reviewNotes.trim()
    );

    if (res.success) {
      setActionSuccess(res.message);
      setRegistrations(
        db.getRegistrations().filter(r => r.extracurricular_id === managedEkskul.id && r.status === 'pending')
      );
      setTimeout(() => {
        setSelectedRegId(null);
        setActionSuccess('');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D4CC] pb-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
            Panel Pengurus • {managedEkskul.name}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            {currentPath.includes('members') ? 'Daftar Anggota Ekskul' : 
             currentPath.includes('registrations') ? 'Verifikasi Pendaftaran' : 
             currentPath.includes('activities') ? 'Dokumentasi & Kegiatan' : 
             currentPath.includes('achievements') ? 'Prestasi Anggota' : 
             'Dasbor Operasional Ekstrakurikuler'}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">
            Ketua: <strong className="text-[#171717]">{managedEkskul.chairperson_name}</strong> • Pembina: <strong className="text-[#171717]">{managedEkskul.supervisor_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/pengurus/attendance')}
            icon={<CheckSquare className="w-3.5 h-3.5" />}
          >
            Buka Sesi Presensi
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-4">
          <div className="text-xs font-semibold text-[#68655F] uppercase mb-1">Anggota Resmi</div>
          <div className="text-2xl font-bold text-[#171717]">{members.length} / {managedEkskul.member_capacity}</div>
          <div className="w-full h-1 bg-[#F5F2EA] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#234B36]"
              style={{ width: `${(members.length / managedEkskul.member_capacity) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-[#D8D4CC] rounded-lg p-4">
          <div className="text-xs font-semibold text-[#68655F] uppercase mb-1">Pendaftaran Baru</div>
          <div className="text-2xl font-bold text-[#B84A3A]">{registrations.length}</div>
          <div className="text-[11px] text-[#68655F] mt-1">Perlu Persetujuan</div>
        </div>

        <div className="bg-white border border-[#D8D4CC] rounded-lg p-4">
          <div className="text-xs font-semibold text-[#68655F] uppercase mb-1">Sesi Presensi Selesai</div>
          <div className="text-2xl font-bold text-[#234B36]">{sessions.length}</div>
          <div className="text-[11px] text-[#234B36] font-medium mt-1">Semester Ganjil</div>
        </div>

        <div className="bg-white border border-[#D8D4CC] rounded-lg p-4">
          <div className="text-xs font-semibold text-[#68655F] uppercase mb-1">Rata-rata Kehadiran</div>
          <div className="text-2xl font-bold text-[#234B36]">94.2%</div>
          <div className="text-[11px] text-[#68655F] mt-1">Kategori Sangat Baik</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Pending Registrations Table */}
        <div className="lg:col-span-8 bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Pendaftaran Menunggu Verifikasi Pengurus</h2>
              <p className="text-xs text-[#68655F]">Periksa motivasi siswa dan pastikan kuota masih mencukupi.</p>
            </div>
            <Badge variant={registrations.length > 0 ? 'warning' : 'neutral'}>
              {registrations.length} Menunggu
            </Badge>
          </div>

          {registrations.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#D8D4CC] rounded bg-[#F5F2EA]/30 text-xs text-[#68655F]">
              Semua pendaftaran telah diverifikasi. Tidak ada berkas tertunda.
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 border border-[#D8D4CC] rounded bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#171717]">{reg.student_name}</span>
                      <span className="text-xs text-[#68655F]">({reg.student_class})</span>
                      <span className="font-mono text-[10px] text-[#68655F]">NISN: {reg.student_nisn}</span>
                    </div>
                    <p className="text-xs text-[#474540] italic bg-[#F5F2EA] p-2 rounded border border-[#D8D4CC]/60">
                      "{reg.reason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenReview(reg.id, 'approved')}
                    >
                      Terima
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleOpenReview(reg.id, 'rejected')}
                    >
                      Tolak
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Latest Attendance Session Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D8D4CC]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#68655F]">
                Sesi Latihan Terakhir
              </h3>
              <CheckSquare className="w-4 h-4 text-[#234B36]" />
            </div>

            {latestSession && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-[#171717]">{latestSession.title}</div>
                <div className="text-[#68655F] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{latestSession.session_date} ({latestSession.start_time} - {latestSession.end_time})</span>
                </div>
                <div className="p-3 bg-[#F5F2EA] rounded border border-[#D8D4CC] grid grid-cols-2 gap-2 text-center text-xs mt-3">
                  <div>
                    <span className="text-[#68655F] block text-[10px]">Hadir</span>
                    <strong className="text-[#234B36]">{latestSession.present_count} Siswa</strong>
                  </div>
                  <div>
                    <span className="text-[#68655F] block text-[10px]">Terlambat</span>
                    <strong className="text-[#B58A32]">{latestSession.late_count} Siswa</strong>
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center mt-2"
              onClick={() => onNavigate('/pengurus/attendance')}
            >
              Kelola Sesi Presensi Digital
            </Button>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Modal
        isOpen={Boolean(selectedRegId)}
        onClose={() => setSelectedRegId(null)}
        title={actionType === 'approved' ? 'Persetujuan Pendaftaran Anggota' : 'Penolakan Pendaftaran'}
      >
        <form onSubmit={handleConfirmReview} className="space-y-4 text-xs">
          {actionSuccess ? (
            <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
          ) : (
            <>
              <p className="text-[#474540]">
                {actionType === 'approved'
                  ? 'Siswa akan otomatis ditambahkan ke daftar anggota aktif dan mendapatkan akses presensi kegiatan.'
                  : 'Siswa akan diberi notifikasi bahwa kuota belum mencukupi atau tidak memenuhi kualifikasi.'}
              </p>

              <Textarea
                label="Catatan Pengurus (Opsional)"
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Berikan arahan untuk perlengkapan latihan atau alasan penolakan..."
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D8D4CC]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedRegId(null)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant={actionType === 'approved' ? 'primary' : 'danger'}
                >
                  Konfirmasi {actionType === 'approved' ? 'Penerimaan' : 'Penolakan'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
