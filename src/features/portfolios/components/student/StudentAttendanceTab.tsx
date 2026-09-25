import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { AttendanceRecord, ExtracurricularMember } from '@/types';
import { db } from '@/lib/storage/mockDatabase';

interface StudentAttendanceTabProps {
  attendanceRate: number;
  totalSessions: number;
  presentCount: number;
  lateCount: number;
  excusedCount: number;
  absentCount: number;
  attendanceEkskulFilter: string;
  setAttendanceEkskulFilter: (filter: string) => void;
  attendanceStatusFilter: string;
  setAttendanceStatusFilter: (filter: string) => void;
  myMemberships: ExtracurricularMember[];
  filteredAttendance: AttendanceRecord[];
}

export const StudentAttendanceTab: React.FC<StudentAttendanceTabProps> = ({
  attendanceRate,
  totalSessions,
  presentCount,
  lateCount,
  excusedCount,
  absentCount,
  attendanceEkskulFilter,
  setAttendanceEkskulFilter,
  attendanceStatusFilter,
  setAttendanceStatusFilter,
  myMemberships,
  filteredAttendance,
}) => {
  return (
    <div className="space-y-5">
      {/* Attendance Overview Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE6DC] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#171717]">Buku Presensi Kegiatan & Sesi Latihan</h2>
            <p className="text-xs text-[#68655F]">
              Rekapitulasi resmi kehadiran yang dicatat oleh guru pembina untuk penilaian portofolio kearsipan.
            </p>
          </div>
          <div className="px-3 py-1 bg-[#E7EFEA] border border-[#B7D2C2] rounded text-xs font-bold text-[#234B36]">
            Persentase Kehadiran: {attendanceRate}%
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-[#F9F8F6]/40 border border-[#EAE6DC] rounded">
            <span className="text-[#68655F] block text-[11px]">Total Sesi</span>
            <span className="text-lg font-bold text-[#171717]">{totalSessions}</span>
          </div>
          <div className="p-3 bg-[#E7EFEA]/50 border border-[#B7D2C2] rounded">
            <span className="text-[#234B36] block text-[11px]">Hadir</span>
            <span className="text-lg font-bold text-[#234B36]">{presentCount}</span>
          </div>
          <div className="p-3 bg-[#FDF5E6] border border-[#D9C187] rounded">
            <span className="text-[#8C6819] block text-[11px]">Terlambat</span>
            <span className="text-lg font-bold text-[#8C6819]">{lateCount}</span>
          </div>
          <div className="p-3 bg-[#EEF2F6] border border-[#C5D3E8] rounded">
            <span className="text-[#3E6399] block text-[11px]">Izin / Sakit</span>
            <span className="text-lg font-bold text-[#3E6399]">{excusedCount}</span>
          </div>
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] rounded">
            <span className="text-[#A33D35] block text-[11px]">Alpa</span>
            <span className="text-lg font-bold text-[#A33D35]">{absentCount}</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#171717]">Filter Ekskul:</span>
            <select
              value={attendanceEkskulFilter}
              onChange={(e) => setAttendanceEkskulFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#EAE6DC] rounded text-xs bg-white focus:outline-none"
            >
              <option value="Semua">Semua Ekskul</option>
              {myMemberships.map((m) => {
                const eks = db.getExtracurricularById(m.extracurricular_id);
                return (
                  <option key={m.id} value={eks?.name}>
                    {eks?.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#171717]">Status:</span>
            <select
              value={attendanceStatusFilter}
              onChange={(e) => setAttendanceStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#EAE6DC] rounded text-xs bg-white focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="present">Hadir</option>
              <option value="late">Terlambat</option>
              <option value="excused">Izin</option>
              <option value="absent">Alpa</option>
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-[#EAE6DC]">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                <th className="py-2.5 px-3 font-semibold">Materi / Sesi</th>
                <th className="py-2.5 px-3 font-semibold">Status Presensi</th>
                <th className="py-2.5 px-3 font-semibold">Catatan Pembina</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F9F8F6]/40">
                  <td className="py-2.5 px-3 font-mono text-[#68655F]">{rec.session_date}</td>
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
                      {rec.status === 'present'
                        ? 'Hadir'
                        : rec.status === 'late'
                        ? 'Terlambat'
                        : rec.status === 'excused'
                        ? 'Izin'
                        : 'Alpa'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[#68655F] italic">
                    {rec.notes || 'Hadir pada sesi terjadwal.'}
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#68655F]">
                    Tidak ada riwayat presensi yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
