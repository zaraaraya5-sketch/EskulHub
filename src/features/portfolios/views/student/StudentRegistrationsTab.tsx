import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ExtracurricularRegistration } from '@/types';
import { Plus, FileCheck } from 'lucide-react';

interface StudentRegistrationsTabProps {
  myRegistrations: ExtracurricularRegistration[];
  handleOpenRegisterModal: () => void;
  setActiveTab: (tab: any) => void;
}

export const StudentRegistrationsTab: React.FC<StudentRegistrationsTabProps> = ({
  myRegistrations,
  handleOpenRegisterModal,
  setActiveTab,
}) => {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#171717]">Status Pendaftaran Ekstrakurikuler</h2>
          <p className="text-xs text-[#68655F]">
            Pantau pengajuan bergabung ekstrakurikuler Anda yang sedang ditinjau oleh guru pembina.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenRegisterModal}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Ajukan Pendaftaran Baru
        </Button>
      </div>

      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs space-y-4">
        {myRegistrations.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#68655F] space-y-3">
            <FileCheck className="w-10 h-10 text-[#68655F]/40 mx-auto" />
            <p>Belum ada pengajuan pendaftaran ekstrakurikuler yang tercatat.</p>
            <Button variant="primary" size="sm" onClick={() => setActiveTab('browse')}>
              Buka Katalog Ekskul
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#EAE6DC]">
              <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">No</th>
                  <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                  <th className="py-2.5 px-3 font-semibold">Tanggal Daftar</th>
                  <th className="py-2.5 px-3 font-semibold">Alasan / Motivasi</th>
                  <th className="py-2.5 px-3 font-semibold">Catatan Reviewer</th>
                  <th className="py-2.5 px-3 font-semibold">Status Pendaftaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D4CC]">
                {myRegistrations.map((reg, idx) => (
                  <tr key={reg.id} className="hover:bg-[#F9F8F6]/40">
                    <td className="py-2.5 px-3 font-mono text-[#68655F]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#171717]">
                      {reg.extracurricular_name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#68655F]">
                      {reg.registration_date.split('T')[0]}
                    </td>
                    <td className="py-2.5 px-3 text-[#171717] max-w-xs">{reg.reason}</td>
                    <td className="py-2.5 px-3 text-[#68655F] italic">
                      {reg.notes || (reg.status === 'pending' ? 'Sedang menunggu kuota & jadwal seleksi berkas.' : '-')}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          reg.status === 'approved'
                            ? 'success'
                            : reg.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {reg.status === 'approved'
                          ? 'Diterima'
                          : reg.status === 'rejected'
                          ? 'Ditolak'
                          : 'Menunggu Persetujuan'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Note on workflow */}
        <div className="p-3.5 bg-[#F9F8F6]/60 border border-[#EAE6DC] rounded-lg text-xs text-[#68655F] space-y-1">
          <strong className="text-[#171717]">Alur Pendaftaran:</strong>
          <p>
            Setiap pendaftaran yang diajukan akan diverifikasi oleh Pembina Kesiswaan berdasarkan kapasitas ruang latihan dan kriteria anggota. Setelah status berubah menjadi <strong>Diterima</strong>, data Anda otomatis masuk ke dalam rekap absensi dan portofolio resmi.
          </p>
        </div>
      </div>
    </div>
  );
};
