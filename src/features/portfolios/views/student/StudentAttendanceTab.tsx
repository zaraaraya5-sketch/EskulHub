import React from 'react';
import { AttendanceRecord, ExtracurricularMember } from '@/types';
import { db } from '@/lib/database';
import { CheckSquare, Calendar, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Attendance Overview Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE6DC] pb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5 mb-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Rekapitulasi Kehadiran Siswa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
              Buku Presensi Latihan & Kegiatan
            </h2>
            <p className="text-xs text-[#68655F] mt-0.5">
              Presensi dicatat berkala oleh guru pembina dan menjadi pembobotan resmi pada lembar portofolio kesiswaan.
            </p>
          </div>
          <div className="px-3.5 py-1.5 bg-[#FDEDE9] border border-[#F2C9C0] rounded-xl text-xs font-bold text-[#D15B40] shrink-0 self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tingkat Kehadiran: {attendanceRate}%</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center text-xs">
          <div className="p-3.5 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl flex flex-col justify-between">
            <span className="text-[#68655F] block text-[11px] uppercase tracking-wider font-semibold">Total Sesi</span>
            <span className="text-xl sm:text-2xl font-black text-[#171717] mt-1">{totalSessions}</span>
          </div>
          <div className="p-3.5 bg-[#FDEDE9]/50 border border-[#F2C9C0] rounded-xl flex flex-col justify-between">
            <span className="text-[#D15B40] block text-[11px] uppercase tracking-wider font-bold">Hadir</span>
            <span className="text-xl sm:text-2xl font-black text-[#D15B40] mt-1">{presentCount}</span>
          </div>
          <div className="p-3.5 bg-[#FEF9EE] border border-[#F5E6C4] rounded-xl flex flex-col justify-between">
            <span className="text-[#B58A32] block text-[11px] uppercase tracking-wider font-bold">Terlambat</span>
            <span className="text-xl sm:text-2xl font-black text-[#B58A32] mt-1">{lateCount}</span>
          </div>
          <div className="p-3.5 bg-[#F0F5F6] border border-[#CDE0E3] rounded-xl flex flex-col justify-between">
            <span className="text-[#3B7A82] block text-[11px] uppercase tracking-wider font-bold">Izin / Sakit</span>
            <span className="text-xl sm:text-2xl font-black text-[#3B7A82] mt-1">{excusedCount}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-3.5 bg-[#FBEAE8] border border-[#F5C6C2] rounded-xl flex flex-col justify-between">
            <span className="text-[#A33D35] block text-[11px] uppercase tracking-wider font-bold">Alpa</span>
            <span className="text-xl sm:text-2xl font-black text-[#A33D35] mt-1">{absentCount}</span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#EAE6DC]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#171717]">Ekstrakurikuler:</span>
            <select
              value={attendanceEkskulFilter}
              onChange={(e) => setAttendanceEkskulFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#EAE6DC] rounded-xl text-xs bg-white text-[#171717] font-medium focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all shadow-2xs"
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
            <span className="font-semibold text-[#171717]">Status Kehadiran:</span>
            <select
              value={attendanceStatusFilter}
              onChange={(e) => setAttendanceStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#EAE6DC] rounded-xl text-xs bg-white text-[#171717] font-medium focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all shadow-2xs"
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
        {/* Mobile Card List (< md) */}
        <div className="block md:hidden space-y-3">
          {filteredAttendance.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-[#EAE6DC] bg-[#F9F8F6]/60 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono text-[#8C887B]">{rec.session_date}</div>
                  <h4 className="text-sm font-bold text-[#171717] mt-0.5">{rec.extracurricular_name}</h4>
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    rec.status === 'present'
                      ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                      : rec.status === 'late'
                      ? 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                      : rec.status === 'excused'
                      ? 'bg-[#F0F5F6] text-[#3B7A82] border border-[#CDE0E3]'
                      : 'bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2]'
                  }`}
                >
                  {rec.status === 'present'
                    ? 'Hadir'
                    : rec.status === 'late'
                    ? 'Terlambat'
                    : rec.status === 'excused'
                    ? 'Izin'
                    : 'Alpa'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#EAE6DC] space-y-1">
                <span className="text-[10px] font-semibold text-[#8C887B] uppercase tracking-wider block">Materi / Sesi:</span>
                <p className="text-[#171717] font-medium">{rec.session_title}</p>
                {rec.notes && (
                  <p className="text-[#68655F] italic text-[11px] pt-1 border-t border-[#EAE6DC]/60 mt-1.5">{rec.notes}</p>
                )}
              </div>
            </div>
          ))}

          {filteredAttendance.length === 0 && (
            <div className="py-8 text-center text-[#68655F] bg-[#F9F8F6] rounded-xl border border-dashed border-[#EAE6DC]">
              Tidak ada riwayat presensi yang sesuai dengan filter yang dipilih.
            </div>
          )}
        </div>

        {/* Desktop Attendance Table (>= md) */}
        <div className="hidden md:block overflow-x-auto border border-[#EAE6DC] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Tanggal</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Ekstrakurikuler</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Materi / Sesi</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-center">Status Presensi</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px]">Catatan Pembina</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DC]">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F9F8F6]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#68655F] whitespace-nowrap">{rec.session_date}</td>
                  <td className="py-3.5 px-4 font-bold text-[#171717] whitespace-nowrap">{rec.extracurricular_name}</td>
                  <td className="py-3.5 px-4 text-[#525049]">{rec.session_title}</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === 'present'
                          ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                          : rec.status === 'late'
                          ? 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                          : rec.status === 'excused'
                          ? 'bg-[#F0F5F6] text-[#3B7A82] border border-[#CDE0E3]'
                          : 'bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2]'
                      }`}
                    >
                      {rec.status === 'present'
                        ? 'Hadir'
                        : rec.status === 'late'
                        ? 'Terlambat'
                        : rec.status === 'excused'
                        ? 'Izin'
                        : 'Alpa'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#68655F] italic">
                    {rec.notes || 'Hadir pada sesi terjadwal.'}
                  </td>
                </tr>
              ))}
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#68655F]">
                    Tidak ada riwayat presensi yang sesuai dengan filter yang dipilih.
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
