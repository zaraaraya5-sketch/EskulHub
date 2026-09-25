import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  CheckSquare,
  Trophy,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  UserPlus,
  Mail,
  XCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { ExtracurricularRegistration } from '@/types';

interface TeacherDashboardPageProps {
  onNavigate?: (path: string) => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = () => {
  const { currentUser } = useAuth();
  const ekskuls = db.getExtracurriculars().slice(0, 2); // supervised clubs (e.g. Futsal & Basket)
  const [registrations, setRegistrations] = useState<ExtracurricularRegistration[]>(() => db.getRegistrations());
  const [achievements, setAchievements] = useState(() => db.getAchievements());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleApproveRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'approved', currentUser?.name || 'Hendra Wijaya, S.Pd.', 'Disetujui oleh Pembina Ekskul.');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setActionNotice('Pendaftaran berhasil disetujui! Siswa telah otomatis masuk ke daftar anggota resmi.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleRejectRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'rejected', currentUser?.name || 'Hendra Wijaya, S.Pd.', 'Ditolak: kuota kelas telah terpenuhi.');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setActionNotice('Pendaftaran telah ditolak.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleVerifyAchievement = (id: string) => {
    db.verifyAchievement(id, currentUser?.name || 'Hendra Wijaya, S.Pd.');
    setAchievements([...db.getAchievements()]);
  };

  // Filter incoming registrations for clubs supervised by this Pembina
  const supervisedEkskulNames = ekskuls.map(e => e.name);
  const relevantRegistrations = registrations.filter(r =>
    supervisedEkskulNames.includes(r.extracurricular_name) || r.status === 'pending'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D8D4CC] pb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#B84A3A] mb-1">
          Panel Guru Pembina • {currentUser?.name || 'Hendra Wijaya, S.Pd.'}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
          Monitoring, Pesan Masuk Pendaftaran, & Validasi Prestasi
        </h1>
        <p className="text-xs text-[#68655F] mt-0.5">
          Memantau kesehatan presensi anggota, menyetujui pesan formulir permohonan anggota baru, serta mengesahkan capaian kejuaraan siswa.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Supervised Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ekskuls.map((ekskul) => (
          <div key={ekskul.id} className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B84A3A] uppercase">{ekskul.category}</span>
              <Badge variant="success">Binaan Aktif</Badge>
            </div>
            <h2 className="text-base font-bold text-[#171717]">{ekskul.name}</h2>
            <div className="text-xs text-[#68655F] space-y-1">
              <div>Ketua Siswa: <strong className="text-[#171717]">{ekskul.chairperson_name}</strong></div>
              <div>Jadwal Rutin: <strong className="text-[#171717]">{ekskul.practice_schedule}</strong></div>
              <div>Anggota Terdaftar: <strong className="text-[#171717]">{ekskul.current_member_count} / {ekskul.member_capacity} Siswa</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: Incoming Registration Messages to Pembina */}
      <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D4CC]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#171717]">
                Pesan Formulir Permohonan Anggota Baru Masuk ke Pembina
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F9ECEB] text-[#B84A3A] border border-[#E8BAB5]">
                {relevantRegistrations.filter(r => r.status === 'pending').length} Menunggu Persetujuan
              </span>
            </div>
            <p className="text-xs text-[#68655F] mt-0.5">
              Formulir yang dikirimkan siswa memuat nama, kelas, dan alasan motivasi masuk ekskul untuk ditinjau pembina.
            </p>
          </div>
          <Mail className="w-5 h-5 text-[#B84A3A]" />
        </div>

        {relevantRegistrations.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#68655F] bg-[#F5F2EA]/40 rounded border border-[#D8D4CC]">
            Belum ada formulir permohonan anggota baru yang masuk.
          </div>
        ) : (
          <div className="space-y-3">
            {relevantRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="border border-[#D8D4CC] rounded-lg p-4 bg-[#F5F2EA]/20 hover:bg-[#F5F2EA]/50 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8D4CC]/60 pb-2.5">
                  <div>
                    <span className="text-xs font-bold text-[#171717]">{reg.student_name}</span>
                    <span className="text-[11px] text-[#68655F] ml-2">
                      Kelas: <strong className="text-[#171717]">{reg.student_class}</strong>
                    </span>
                    <span className="text-[11px] text-[#68655F] ml-2">
                      Ekskul Tujuan: <strong className="text-[#B84A3A]">{reg.extracurricular_name}</strong>
                    </span>
                  </div>

                  <div>
                    {reg.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F9F4E5] text-[#8C6819] border border-[#DFCF9B]">
                        Menunggu Persetujuan Pembina
                      </span>
                    )}
                    {reg.status === 'approved' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2]">
                        Disetujui Pembina
                      </span>
                    )}
                    {reg.status === 'rejected' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F9ECEB] text-[#A33D35] border border-[#E8BAB5]">
                        Ditolak
                      </span>
                    )}
                  </div>
                </div>

                {/* Deskripsi & Alasan Mendaftar */}
                <div className="text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#68655F] block mb-1">
                    Deskripsi & Alasan Masuk Ekskul:
                  </span>
                  <div className="p-2.5 bg-white border border-[#D8D4CC] rounded text-[#171717] italic">
                    "{reg.reason}"
                  </div>
                </div>

                {/* Action Buttons for Pembina */}
                {reg.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleRejectRegistration(reg.id)}
                      className="px-3 py-1.5 border border-[#D8D4CC] hover:bg-[#F9ECEB] text-[#A33D35] rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Tolak Permohonan
                    </button>
                    <button
                      onClick={() => handleApproveRegistration(reg.id)}
                      className="px-3.5 py-1.5 bg-[#234B36] hover:bg-[#1a3828] text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Setujui Masuk Anggota</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Verification Table */}
      <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D4CC]">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Verifikasi Prestasi Masuk Portofolio Resmi</h2>
            <p className="text-xs text-[#68655F]">
              Prestasi yang disetujui pembina akan otomatis tercantum pada transkrip resmi portofolio kelulusan siswa.
            </p>
          </div>
          <Trophy className="w-5 h-5 text-[#8C6819]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-[#D8D4CC]">
            <thead className="bg-[#F5F2EA] border-b border-[#D8D4CC] text-[#171717]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Nama Siswa</th>
                <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                <th className="py-2.5 px-3 font-semibold">Kejuaraan / Prestasi</th>
                <th className="py-2.5 px-3 font-semibold">Tingkat</th>
                <th className="py-2.5 px-3 font-semibold">Status Validasi</th>
                <th className="py-2.5 px-3 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {achievements.map((ach) => (
                <tr key={ach.id} className="hover:bg-[#F5F2EA]/40">
                  <td className="py-2.5 px-3 font-bold text-[#171717]">{ach.student_name}</td>
                  <td className="py-2.5 px-3 text-[#68655F]">{ach.extracurricular_name}</td>
                  <td className="py-2.5 px-3 font-medium text-[#171717]">{ach.title}</td>
                  <td className="py-2.5 px-3">{ach.level}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={ach.is_verified ? 'success' : 'warning'}>
                      {ach.is_verified ? 'Terverifikasi' : 'Menunggu Validasi'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {!ach.is_verified ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerifyAchievement(ach.id)}
                      >
                        Validasi Sah
                      </Button>
                    ) : (
                      <span className="text-[11px] text-[#234B36] font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Selesai</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
