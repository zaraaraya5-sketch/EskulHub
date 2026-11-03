import React from 'react';
import { Button } from '@/components/ui/Button';
import { ExtracurricularRegistration } from '@/types';
import { Plus, FileCheck, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5 mb-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Administrasi Keanggotaan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">Status Pendaftaran Ekstrakurikuler</h2>
          <p className="text-xs text-[#68655F] mt-0.5">
            Pantau pengajuan bergabung ekstrakurikuler yang sedang ditinjau oleh guru pembina kesiswaan.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenRegisterModal}
          icon={<Plus className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto cursor-pointer shadow-xs"
        >
          Ajukan Pendaftaran Baru
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        {myRegistrations.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#68655F] space-y-3">
            <FileCheck className="w-10 h-10 text-[#A39F97]/40 mx-auto" />
            <p>Belum ada pengajuan pendaftaran ekstrakurikuler yang tercatat untuk akun Anda.</p>
            <Button variant="primary" size="sm" onClick={() => setActiveTab('browse')} className="cursor-pointer">
              Buka Katalog Ekskul
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile Card List (< md) */}
            <div className="block md:hidden space-y-3">
              {myRegistrations.map((reg, idx) => (
                <div
                  key={reg.id}
                  className="p-4 rounded-xl border border-[#EAE6DC] bg-[#F9F8F6]/60 space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-mono text-[#8C887B]">#{idx + 1} • {reg.registration_date.split('T')[0]}</div>
                      <h4 className="text-sm font-bold text-[#171717] mt-0.5">{reg.extracurricular_name}</h4>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        reg.status === 'approved'
                          ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                          : reg.status === 'rejected'
                          ? 'bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2]'
                          : 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                      }`}
                    >
                      {reg.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Diterima</span>
                        </>
                      ) : reg.status === 'rejected' ? (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Ditolak</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Menunggu</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#EAE6DC] space-y-1.5">
                    <div>
                      <span className="text-[10px] font-semibold text-[#8C887B] uppercase tracking-wider block">Alasan:</span>
                      <p className="text-[#171717] leading-relaxed">{reg.reason}</p>
                    </div>
                    {reg.notes && (
                      <div className="pt-1.5 border-t border-[#EAE6DC]/60">
                        <span className="text-[10px] font-semibold text-[#8C887B] uppercase tracking-wider block">Catatan Reviewer:</span>
                        <p className="text-[#525049] italic">{reg.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Full Table (>= md) */}
            <div className="hidden md:block overflow-x-auto border border-[#EAE6DC] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] w-12 text-center">No</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Ekstrakurikuler</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Tanggal Daftar</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Alasan / Motivasi</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Catatan Reviewer</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DC]">
                  {myRegistrations.map((reg, idx) => (
                    <tr key={reg.id} className="hover:bg-[#F9F8F6]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#68655F] text-center">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-[#171717] whitespace-nowrap">
                        {reg.extracurricular_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#68655F] whitespace-nowrap">
                        {reg.registration_date.split('T')[0]}
                      </td>
                      <td className="py-3.5 px-4 text-[#525049] max-w-xs leading-relaxed">{reg.reason}</td>
                      <td className="py-3.5 px-4 text-[#68655F] italic leading-relaxed">
                        {reg.notes || (reg.status === 'pending' ? 'Sedang menunggu seleksi berkas & kuota anggota.' : '-')}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            reg.status === 'approved'
                              ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                              : reg.status === 'rejected'
                              ? 'bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2]'
                              : 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                          }`}
                        >
                          {reg.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Diterima</span>
                            </>
                          ) : reg.status === 'rejected' ? (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Ditolak</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Menunggu Review</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Informative Guidance Footer */}
        <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex items-start gap-3 text-xs text-[#68655F]">
          <Info className="w-4 h-4 text-[#D15B40] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#171717] block mb-0.5">Alur Verifikasi Pendaftaran:</strong>
            Setiap pendaftaran ditinjau langsung oleh Guru Pembina berdasarkan kapasitas ruangan dan jadwal latihan. Setelah status berubah menjadi <span className="font-bold text-[#D15B40]">Diterima</span>, akun Anda otomatis terhubung ke sistem presensi digital dan portofolio kelulusan.
          </div>
        </div>
      </div>
    </div>
  );
};
