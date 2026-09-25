import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Badge } from '@/components/ui/Badge';
import { ATTENDANCE_STATUS_LABELS } from '@/lib/constants';
import { CheckSquare, Calendar, Filter } from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id || 'usr-student-1';

  const [selectedEkskul, setSelectedEkskul] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const allRecords = db.getAttendanceRecords().filter(r => r.student_id === studentId);
  const myMemberships = db.getMembers().filter(m => m.student_id === studentId);

  // Calculations
  const totalSessions = allRecords.length;
  const presentCount = allRecords.filter(r => r.status === 'present').length;
  const lateCount = allRecords.filter(r => r.status === 'late').length;
  const excusedCount = allRecords.filter(r => r.status === 'excused').length;
  const absentCount = allRecords.filter(r => r.status === 'absent').length;
  const attendanceRate = totalSessions > 0
    ? Math.round(((presentCount + lateCount) / totalSessions) * 100)
    : 100;

  // Filtered
  const filteredRecords = allRecords.filter((rec) => {
    const matchEkskul = selectedEkskul === 'all' || rec.extracurricular_name === selectedEkskul;
    const matchStatus = selectedStatus === 'all' || rec.status === selectedStatus;
    return matchEkskul && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
          Buku Induk Presensi Digital
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
          Rekapitulasi Kehadiran Latihan & Kegiatan
        </h1>
        <p className="text-xs text-[#68655F] mt-1">
          Catatan presensi ini menjadi salah satu komponen penilaian kelayakan verifikasi portofolio kelulusan.
        </p>
      </div>

      {/* Structured Minimal Summary Bar (No giant flashy cards, per rule #6) */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D4CC] text-center text-xs">
          <div className="py-2 px-3">
            <span className="text-[#68655F] block text-[11px] uppercase">Total Sesi</span>
            <span className="text-base font-bold text-[#171717]">{totalSessions}</span>
          </div>
          <div className="py-2 px-3">
            <span className="text-[#68655F] block text-[11px] uppercase">Hadir Tepat Waktu</span>
            <span className="text-base font-bold text-[#234B36]">{presentCount}</span>
          </div>
          <div className="py-2 px-3">
            <span className="text-[#68655F] block text-[11px] uppercase">Terlambat</span>
            <span className="text-base font-bold text-[#B58A32]">{lateCount}</span>
          </div>
          <div className="py-2 px-3">
            <span className="text-[#68655F] block text-[11px] uppercase">Izin / Sakit</span>
            <span className="text-base font-bold text-[#68655F]">{excusedCount}</span>
          </div>
          <div className="py-2 px-3">
            <span className="text-[#68655F] block text-[11px] uppercase">Alpa / Tanpa Ket.</span>
            <span className="text-base font-bold text-[#A33D35]">{absentCount}</span>
          </div>
          <div className="py-2 px-3">
            <span className="text-[#68655F] block text-[11px] uppercase">Persentase Kehadiran</span>
            <span className="text-base font-bold text-[#234B36]">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-[11px] font-semibold text-[#68655F] uppercase mb-1">Filter Ekstrakurikuler</label>
          <select
            value={selectedEkskul}
            onChange={(e) => setSelectedEkskul(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
          >
            <option value="all">Semua Ekstrakurikuler</option>
            {myMemberships.map(m => {
              const name = db.getExtracurricularById(m.extracurricular_id)?.name;
              return <option key={m.id} value={name}>{name}</option>;
            })}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <label className="block text-[11px] font-semibold text-[#68655F] uppercase mb-1">Status Kehadiran</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
          >
            <option value="all">Semua Status</option>
            <option value="present">Hadir Saja</option>
            <option value="late">Terlambat</option>
            <option value="excused">Izin / Sakit</option>
            <option value="absent">Alpa</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12">No</th>
                <th className="py-2.5 px-3 font-semibold">Tanggal Sesi</th>
                <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                <th className="py-2.5 px-3 font-semibold">Topik Latihan / Agenda</th>
                <th className="py-2.5 px-3 font-semibold">Status Presensi</th>
                <th className="py-2.5 px-3 font-semibold">Catatan Pengurus / Guru</th>
                <th className="py-2.5 px-3 font-semibold">Verifikator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#68655F]">
                    Tidak ada catatan presensi yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-[#F9F8F6]/40">
                    <td className="py-2.5 px-3 text-[#68655F]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-[#171717]">{rec.session_date}</td>
                    <td className="py-2.5 px-3 font-bold text-[#171717]">{rec.extracurricular_name}</td>
                    <td className="py-2.5 px-3 text-[#171717]">{rec.session_title}</td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          rec.status === 'present'
                            ? 'success'
                            : rec.status === 'late'
                            ? 'warning'
                            : rec.status === 'excused'
                            ? 'info'
                            : 'danger'
                        }
                      >
                        {ATTENDANCE_STATUS_LABELS[rec.status]}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-[#68655F] max-w-xs truncate">{rec.notes || '-'}</td>
                    <td className="py-2.5 px-3 text-[#234B36] font-medium">{rec.verified_by_name || 'Pembina'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
