import React, { useState } from 'react';
import { AttendanceSession, Extracurricular, User } from '@/types';
import { Users, Clock, MapPin, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

// ============================================================================
// 1. PEMBINA: ATTENDANCE SESSION BAR CHART
// ============================================================================
interface AttendanceSessionChartProps {
  sessions: AttendanceSession[];
  capacity: number;
}

export const AttendanceSessionChart: React.FC<AttendanceSessionChartProps> = ({
  sessions,
  capacity,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="bg-[#F9F8F6] rounded-xl p-8 text-center border border-[#EAE6DC] space-y-2">
        <Clock className="w-8 h-8 text-[#A8A29E] mx-auto" />
        <p className="text-xs font-semibold text-[#525049]">
          Belum ada sesi latihan yang diselenggarakan pada bulan ini.
        </p>
        <p className="text-[11px] text-[#A8A29E]">
          Grafik kehadiran otomatis muncul saat presensi latihan mulai dicatat.
        </p>
      </div>
    );
  }

  // Calculate max scale based on max total members or capacity
  const maxVal = Math.max(capacity || 30, ...sessions.map((s) => s.total_members || 25), 10);
  const chartHeight = 180;

  return (
    <div className="space-y-4">
      {/* Chart Visual Container */}
      <div className="relative pt-6 pb-2">
        {/* Y-axis guideline lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-[#A8A29E] select-none">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
            const val = Math.round(maxVal * ratio);
            return (
              <div key={ratio} className="w-full flex items-center gap-2">
                <span className="w-6 text-right font-mono">{val}</span>
                <div className="h-px bg-[#EAE6DC] flex-1 border-b border-dashed border-[#EAE6DC]" />
              </div>
            );
          })}
        </div>

        {/* Bars Grid */}
        <div className="relative pl-8 pr-2 flex items-end justify-around gap-2 sm:gap-4 h-[180px]">
          {sessions.map((sess, idx) => {
            const present = sess.present_count || 0;
            const excused = (sess.excused_count || 0) + (sess.late_count || 0);
            const absent = sess.absent_count || 0;
            const total = sess.total_members || present + excused + absent || 1;
            const pct = Math.round((present / total) * 100);

            const presentH = (present / maxVal) * chartHeight;
            const excusedH = (excused / maxVal) * chartHeight;
            const absentH = (absent / maxVal) * chartHeight;

            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={sess.id || idx}
                className="flex-1 max-w-[64px] flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 bg-[#171717] text-white p-2.5 rounded-lg shadow-xl text-[11px] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold text-[#EAE6DC]">{sess.title}</div>
                    <div className="text-[10px] text-[#A8A29E] mb-1.5">{sess.session_date} • {sess.location}</div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="text-[#FDEDE9] font-semibold">Hadir: {present}</span>
                      <span className="text-[#FCD34D]">Izin: {excused}</span>
                      <span className="text-[#FDA4AF]">Alpa: {absent}</span>
                      <span className="bg-[#D15B40] px-1.5 py-0.5 rounded text-white font-bold">{pct}%</span>
                    </div>
                  </div>
                )}

                {/* Percentage Badge */}
                <span
                  className={`text-[10px] font-bold mb-1 transition-colors ${
                    pct >= 85 ? 'text-[#D15B40]' : pct >= 70 ? 'text-[#8C6819]' : 'text-[#A33D35]'
                  }`}
                >
                  {pct}%
                </span>

                {/* Stacked Bar Pill */}
                <div className="w-full rounded-t-md overflow-hidden flex flex-col-reverse bg-[#EAE6DC]/40 shadow-2xs group-hover:brightness-105 transition-all">
                  {/* Present (Brand Orange) */}
                  <div
                    style={{ height: `${presentH}px` }}
                    className="w-full bg-[#D15B40] transition-all duration-300"
                  />
                  {/* Excused (Amber Warning) */}
                  {excusedH > 0 && (
                    <div
                      style={{ height: `${excusedH}px` }}
                      className="w-full bg-[#B58A32] transition-all duration-300"
                    />
                  )}
                  {/* Absent (Danger Crimson) */}
                  {absentH > 0 && (
                    <div
                      style={{ height: `${absentH}px` }}
                      className="w-full bg-[#A33D35] transition-all duration-300"
                    />
                  )}
                </div>

                {/* X-axis Label (Date) */}
                <div className="mt-2 text-center text-[10px] font-semibold text-[#525049] group-hover:text-[#171717] transition-colors">
                  {sess.session_date.slice(8, 10)}/{sess.session_date.slice(5, 7)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EAE6DC] text-xs">
        <div className="flex items-center gap-4 text-[11px] text-[#525049]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#D15B40]" />
            <span>Anggota Hadir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#B58A32]" />
            <span>Izin / Sakit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#A33D35]" />
            <span>Alpa</span>
          </div>
        </div>

        <div className="text-[11px] text-[#68655F]">
          Total: <strong className="text-[#171717]">{sessions.length} Sesi Latihan</strong>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. PEMBINA: CLUB CAPACITY DONUT CHART
// ============================================================================
interface ClubCapacityDonutProps {
  activeCount: number;
  newCount: number;
  capacity: number;
}

export const ClubCapacityDonut: React.FC<ClubCapacityDonutProps> = ({
  activeCount,
  newCount,
  capacity,
}) => {
  const existingMembers = Math.max(0, activeCount - newCount);
  const remainingQuota = Math.max(0, capacity - activeCount);
  const total = capacity || 30;

  const pctFilled = Math.min(100, Math.round((activeCount / total) * 100));

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc lengths
  const existingLen = (existingMembers / total) * circumference;
  const newLen = (newCount / total) * circumference;
  const remainingLen = (remainingQuota / total) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-2">
      {/* SVG Donut */}
      <div className="relative w-[160px] h-[160px] shrink-0">
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#EAE6DC"
            strokeWidth={strokeWidth}
          />
          {/* Existing Members Segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#D15B40"
            strokeWidth={strokeWidth}
            strokeDasharray={`${existingLen} ${circumference - existingLen}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          {/* New Members Segment */}
          {newCount > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#3B7A82"
              strokeWidth={strokeWidth}
              strokeDasharray={`${newLen} ${circumference - newLen}`}
              strokeDashoffset={-existingLen}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-[#171717]">{pctFilled}%</span>
          <span className="text-[10px] font-semibold text-[#68655F] uppercase">Kuota Terisi</span>
        </div>
      </div>

      {/* Legend & Metrics Breakdown */}
      <div className="space-y-3 flex-1 max-w-xs text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FDEDE9]/60 border border-[#F2C9C0]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D15B40]" />
            <span className="font-medium text-[#171717]">Anggota Aktif Sebelumnya</span>
          </div>
          <span className="font-bold text-[#D15B40]">{existingMembers} Siswa</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#E8F4F5] border border-[#C5E1E3]/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3B7A82]" />
            <span className="font-medium text-[#171717]">Anggota Baru Bulan Ini</span>
          </div>
          <span className="font-bold text-[#3B7A82]">+{newCount} Siswa</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#F9F8F6] border border-[#EAE6DC]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EAE6DC]" />
            <span className="font-medium text-[#68655F]">Sisa Kuota Penerimaan</span>
          </div>
          <span className="font-bold text-[#525049]">{remainingQuota} Kursi</span>
        </div>

        <div className="pt-2 text-[11px] text-[#68655F] flex items-center justify-between border-t border-[#EAE6DC]">
          <span>Total Kapasitas Ekskul:</span>
          <strong className="text-[#171717]">{capacity} Siswa Maksimum</strong>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. PENGURUS: COMPARISON HORIZONTAL BARS FOR ALL EKSTRAKURIKULERS
// ============================================================================
interface EkskulGrowthChartProps {
  data: Array<{
    ekskul: Extracurricular;
    newMembersCount: number;
    totalActiveMembers: number;
    capacity: number;
    sessionCount: number;
  }>;
}

export const EkskulGrowthChart: React.FC<EkskulGrowthChartProps> = ({ data }) => {
  // Sort by growth or total members
  const sorted = [...data].sort((a, b) => b.newMembersCount - a.newMembersCount || b.totalActiveMembers - a.totalActiveMembers);
  const maxCap = Math.max(...data.map((d) => d.capacity || 30), 40);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {sorted.map((item) => {
          const activePct = Math.round((item.totalActiveMembers / item.capacity) * 100);
          const barWidthPct = (item.totalActiveMembers / maxCap) * 100;
          const newBarPct = (item.newMembersCount / maxCap) * 100;

          return (
            <div key={item.ekskul.id} className="space-y-1.5 p-2.5 rounded-lg hover:bg-[#F9F8F6] transition-colors">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171717]">{item.ekskul.name}</span>
                  <span className="text-[10px] text-[#68655F] bg-[#EAE6DC]/60 px-1.5 py-0.5 rounded">
                    {item.ekskul.category}
                  </span>
                  {item.newMembersCount > 0 && (
                    <span className="text-[10px] font-bold text-[#D15B40] bg-[#FDEDE9] px-1.5 py-0.2 rounded border border-[#F2C9C0]">
                      +{item.newMembersCount} Baru
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#525049]">
                  <span>
                    <strong>{item.totalActiveMembers}</strong> / {item.capacity} Siswa
                  </span>
                  <span className="font-bold text-[#D15B40] w-10 text-right">{activePct}%</span>
                </div>
              </div>

              {/* Dual-layer horizontal progress bar */}
              <div className="h-3 w-full bg-[#EAE6DC]/60 rounded-full overflow-hidden flex relative">
                {/* Active members bar */}
                <div
                  style={{ width: `${barWidthPct}%` }}
                  className="h-full bg-gradient-to-r from-[#D15B40] to-[#E57A60] rounded-full transition-all duration-500"
                />
                {/* Highlight glow for new members */}
                {item.newMembersCount > 0 && (
                  <div
                    style={{
                      width: `${newBarPct}%`,
                      marginLeft: `-${newBarPct}%`,
                    }}
                    className="h-full bg-[#FDEDE9] border border-[#D15B40]/40 rounded-r-full"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#EAE6DC] text-[11px] text-[#68655F]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D15B40]" />
          <span>Total Anggota Aktif</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FDEDE9] border border-[#D15B40]/50 ml-2" />
          <span>Penambahan Bulan Ini</span>
        </div>
        <span>Total: <strong>{data.length} Cabang Ekstrakurikuler</strong></span>
      </div>
    </div>
  );
};

// ============================================================================
// 4. PENGURUS: FACILITY USAGE DISTRIBUTION CHART
// ============================================================================
interface FacilityUsageChartProps {
  sessions: AttendanceSession[];
}

export const FacilityUsageChart: React.FC<FacilityUsageChartProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="bg-[#F9F8F6] rounded-xl p-8 text-center border border-[#EAE6DC]">
        <MapPin className="w-7 h-7 text-[#A8A29E] mx-auto mb-1" />
        <p className="text-xs text-[#525049]">Belum ada penggunaan lapangan pada bulan ini.</p>
      </div>
    );
  }

  // Aggregate by facility location
  const facilityMap: Record<string, { count: number; totalParticipants: number }> = {};
  sessions.forEach((s) => {
    const loc = s.location || 'Lapangan Utama';
    if (!facilityMap[loc]) {
      facilityMap[loc] = { count: 0, totalParticipants: 0 };
    }
    facilityMap[loc].count += 1;
    facilityMap[loc].totalParticipants += s.present_count || 0;
  });

  const sortedFacilities = Object.entries(facilityMap).sort((a, b) => b[1].count - a[1].count);
  const totalSessions = sessions.length;

  return (
    <div className="space-y-3">
      {sortedFacilities.map(([loc, stats], idx) => {
        const sharePct = Math.round((stats.count / totalSessions) * 100);
        const colors = [
          'bg-[#D15B40]',
          'bg-[#3B7A82]',
          'bg-[#B58A32]',
          'bg-[#525049]',
          'bg-[#A33D35]',
        ];
        const barColor = colors[idx % colors.length];

        return (
          <div key={loc} className="space-y-1 p-2 rounded-lg bg-[#F9F8F6]/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#171717] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3B7A82]" />
                <span>{loc}</span>
              </span>
              <div className="flex items-center gap-2 text-[11px] text-[#525049]">
                <span>{stats.count} Sesi ({stats.totalParticipants} Siswa)</span>
                <span className="font-bold text-[#171717]">{sharePct}%</span>
              </div>
            </div>

            <div className="h-2 w-full bg-[#EAE6DC] rounded-full overflow-hidden">
              <div
                style={{ width: `${sharePct}%` }}
                className={`h-full ${barColor} rounded-full transition-all duration-300`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// 5. PENGURUS: WEEKLY NEW STUDENT REGISTRATION TREND
// ============================================================================
interface WeeklyStudentRegistrationChartProps {
  students: User[];
  monthName: string;
}

export const WeeklyStudentRegistrationChart: React.FC<WeeklyStudentRegistrationChartProps> = ({
  students,
  monthName,
}) => {
  // Aggregate students into 4 weeks of the month (Days 1-7, 8-14, 15-21, 22-31)
  const weeks = [
    { label: 'Pekan 1 (Tgl 1-7)', count: 0 },
    { label: 'Pekan 2 (Tgl 8-14)', count: 0 },
    { label: 'Pekan 3 (Tgl 15-21)', count: 0 },
    { label: 'Pekan 4 (Tgl 22-31)', count: 0 },
  ];

  students.forEach((st) => {
    if (!st.created_at) return;
    const day = parseInt(st.created_at.slice(8, 10), 10);
    if (day <= 7) weeks[0].count += 1;
    else if (day <= 14) weeks[1].count += 1;
    else if (day <= 21) weeks[2].count += 1;
    else weeks[3].count += 1;
  });

  const maxVal = Math.max(...weeks.map((w) => w.count), 4);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 items-end h-[140px] pt-4 px-2">
        {weeks.map((w) => {
          const barHeight = (w.count / maxVal) * 110;
          return (
            <div key={w.label} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[11px] font-bold text-[#D15B40] mb-1">
                {w.count > 0 ? `+${w.count}` : '0'}
              </span>
              <div
                style={{ height: `${Math.max(barHeight, 6)}px` }}
                className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 ${
                  w.count > 0 ? 'bg-[#D15B40] group-hover:bg-[#B94931]' : 'bg-[#EAE6DC]'
                }`}
              />
              <span className="text-[10px] font-semibold text-[#68655F] mt-2 text-center line-clamp-1">
                {w.label.split(' ')[0]} {w.label.split(' ')[1]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-[#EAE6DC] flex items-center justify-between text-[11px] text-[#68655F]">
        <span>Total Akun Baru Terdaftar:</span>
        <strong className="text-[#D15B40]">+{students.length} Akun Siswa ({monthName})</strong>
      </div>
    </div>
  );
};
