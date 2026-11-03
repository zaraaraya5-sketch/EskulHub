import React, { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Users,
  Award,
  ChevronRight,
  School,
  Lock,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from 'lucide-react';
import type {
  PembinaMonthlyReportData,
  PengurusMonthlyReportData,
} from '@/lib/pdf/generateMonthlyReportPdf';
import { getMonthlyReportAggregation } from '@/lib/services/monthlyReportService';
import {
  AttendanceSessionChart,
  ClubCapacityDonut,
  EkskulGrowthChart,
  FacilityUsageChart,
  WeeklyStudentRegistrationChart,
} from '../components/ReportCharts';

interface MonthlyReportPageProps {
  onNavigate: (path: string) => void;
  overrideRole?: 'pembina' | 'pengurus';
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const MonthlyReportPage: React.FC<MonthlyReportPageProps> = ({ onNavigate, overrideRole }) => {
  const { currentUser } = useAuth();
  const schoolSetting = db.getSettings();

  // Determine current active role
  const role =
    overrideRole ||
    (currentUser?.role === 'pengurus'
      ? 'pengurus'
      : currentUser?.role === 'pembina' || currentUser?.role === 'teacher'
      ? 'pembina'
      : 'pembina');

  // Month & Year state (defaults to current date, October 2026)
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return now.getFullYear() >= 2026 ? now.getFullYear() : 2026;
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    return now.getMonth() + 1; // October = 10
  });

  // UI View Mode: 'visual' (Charts/Graphs) vs 'table' (Tabular Full Data)
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');

  // Collapsible detail tables inside visual mode
  const [showMembersTable, setShowMembersTable] = useState(false);
  const [showSessionsTable, setShowSessionsTable] = useState(false);
  const [showAchievementsTable, setShowAchievementsTable] = useState(false);
  const [showStudentsTable, setShowStudentsTable] = useState(false);
  const [showFacilityTable, setShowFacilityTable] = useState(false);
  const [showGrowthTable, setShowGrowthTable] = useState(false);

  const monthKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const monthName = MONTH_NAMES[selectedMonth - 1];

  // Refresh subscriptions from db
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const unsub = db.subscribe(() => setRefreshKey((k) => k + 1));
    return () => unsub();
  }, []);

  // Database models
  const allUsers = useMemo(() => db.getUsers(), [refreshKey]);
  const allEkskuls = useMemo(() => db.getExtracurriculars(), [refreshKey]);
  const allMembers = useMemo(() => db.getMembers(), [refreshKey]);
  const allSessions = useMemo(() => db.getAttendanceSessions(), [refreshKey]);
  const allAchievements = useMemo(() => db.getAchievements(), [refreshKey]);

  // ==========================================
  // PEMBINA-SPECIFIC LOGIC
  // ==========================================
  const supervisedEkskuls = useMemo(() => {
    if (!currentUser) return allEkskuls.slice(0, 2);
    const matched = allEkskuls.filter(
      (e) =>
        (e.supervisor_id && e.supervisor_id === currentUser.id) ||
        (currentUser.name && e.supervisor_name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
        (currentUser.email && currentUser.email.toLowerCase().includes('hendra') && (e.id === 'eks-1' || e.name.toLowerCase().includes('futsal') || e.id === 'eks-2' || e.name.toLowerCase().includes('basket')))
    );
    return matched.length > 0 ? matched : allEkskuls.slice(0, 2);
  }, [allEkskuls, currentUser]);

  const [selectedEkskulId, setSelectedEkskulId] = useState<string>(() => {
    return supervisedEkskuls[0]?.id || 'eks-1';
  });

  useEffect(() => {
    if (!supervisedEkskuls.some((e) => e.id === selectedEkskulId)) {
      if (supervisedEkskuls[0]) {
        setSelectedEkskulId(supervisedEkskuls[0].id);
      }
    }
  }, [supervisedEkskuls, selectedEkskulId]);

  const activeEkskul = supervisedEkskuls.find((e) => e.id === selectedEkskulId) || supervisedEkskuls[0];

  const pembinaData = useMemo(() => {
    return getMonthlyReportAggregation(selectedYear, selectedMonth, 'pembina', {
      ekskulId: selectedEkskulId,
      currentUser,
    }) as any;
  }, [selectedYear, selectedMonth, selectedEkskulId, currentUser, refreshKey]);

  // ==========================================
  // PENGURUS-SPECIFIC LOGIC (SCHOOL-WIDE MACRO)
  // ==========================================
  const pengurusData = useMemo(() => {
    return getMonthlyReportAggregation(selectedYear, selectedMonth, 'pengurus', {
      currentUser,
    }) as any;
  }, [selectedYear, selectedMonth, currentUser, refreshKey]);

  // Export PDF Handler (Uses official institutional tabular format with signatures)
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async (mode: 'save' | 'print' = 'save') => {
    try {
      setIsExporting(true);
      const { generateMonthlyReportPdf } = await import('@/lib/pdf/generateMonthlyReportPdf');
      if (role === 'pembina' && pembinaData && activeEkskul) {
        const payload: PembinaMonthlyReportData = {
          mode: 'pembina',
          year: selectedYear,
          month: selectedMonth,
          monthName,
          ekskul: activeEkskul,
          pembinaName: currentUser?.name || activeEkskul.supervisor_name || 'Hendra Wijaya, S.Pd.',
          pembinaNip: currentUser?.nip || '198204152008011007',
          schoolSetting,
          newMembers: pembinaData.newMembers,
          activeMembersCount: pembinaData.activeMembersCount,
          capacity: pembinaData.capacity,
          sessions: pembinaData.sessions,
          achievements: pembinaData.achievements,
        };
        await generateMonthlyReportPdf(payload, mode);
      } else if (role === 'pengurus' && pengurusData) {
        const payload: PengurusMonthlyReportData = {
          mode: 'pengurus',
          year: selectedYear,
          month: selectedMonth,
          monthName,
          schoolSetting,
          pengurusName: currentUser?.name || 'Rizky Ramadhan',
          newRegisteredStudents: pengurusData.newStudents,
          ekskulRecapList: pengurusData.ekskulRecapList,
          facilityUsageSessions: pengurusData.facilityUsageSessions,
          achievements: pengurusData.achievements,
        };
        await generateMonthlyReportPdf(payload, mode);
      }
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const backDashboardPath = role === 'pengurus' ? '/pengurus/dashboard' : '/pembina/dashboard';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE6DC] pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(backDashboardPath)}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Kembali ke Dasbor
          </Button>
          <div className="h-4 w-px bg-[#EAE6DC] hidden sm:block" />
          <div className="text-xs text-[#68655F] flex items-center gap-1.5">
            <span>{role === 'pengurus' ? 'Panel Pengurus' : 'Panel Guru Pembina'}</span>
            <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
            <span className="font-semibold text-[#171717]">Rekapitulasi Bulanan</span>
          </div>
        </div>

        {/* Read-Only Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F9F8F6] text-[#525049] border border-[#EAE6DC]">
            <Lock className="w-3 h-3 text-[#8C6819]" />
            <span>Mode Hanya Baca (Read-Only)</span>
          </div>
        </div>
      </div>

      {/* Main Header Card with Month Selector, View Mode Switch, & Export Actions */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2 flex-1 min-w-0">
            {/* Context Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                <Sparkles className="w-3 h-3 text-[#D15B40]" />
                <span>Sistem Otomatis Real-Time</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8F4F5] text-[#3B7A82] border border-[#C5E1E3]">
                <span>{role === 'pengurus' ? 'Monitoring Sekolah' : `Ekskul ${activeEkskul?.name}`}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
              {role === 'pengurus'
                ? 'Laporan Rekapitulasi Bulanan Sekolah'
                : `Laporan Rekap Bulanan ${activeEkskul?.name}`}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#525049] leading-relaxed max-w-2xl">
              {role === 'pengurus'
                ? 'Pantau tren pendaftaran akun siswa baru, perolehan anggota ekskul, dan utilisasi sarana sekolah lewat grafik visual interaktif. Saat dicetak, dokumen akan otomatis berformat laporan resmi tertulis.'
                : 'Pantau tren presensi sesi latihan, rasio kuota keanggotaan, dan prestasi ekskul lewat grafik visual interaktif. Saat dicetak, dokumen akan otomatis berformat laporan resmi tertulis.'}
            </p>
          </div>

          {/* Export PDF Actions */}
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExportPdf('print')}
                disabled={isExporting}
                className="inline-flex items-center justify-center font-semibold text-xs px-3.5 py-2 gap-1.5 rounded-xl bg-white border border-[#EAE6DC] hover:border-[#F2C9C0] hover:bg-[#FDEDE9] hover:text-[#D15B40] text-[#171717] shadow-2xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-3.5 h-3.5 text-[#525049]" />
                <span>Cetak</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportPdf('save')}
                disabled={isExporting}
                className="inline-flex items-center justify-center font-semibold text-xs px-4 py-2 gap-2 rounded-xl bg-[#D15B40] hover:bg-[#B94931] active:bg-[#A63F28] text-white shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Membuat PDF...' : 'Unduh Rekap PDF Resmi'}</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#8C6819] italic">
              <FileCheck className="w-3 h-3 text-[#8C6819] shrink-0" />
              <span>*PDF dicetak dalam format naskah resmi kedinasan</span>
            </div>
          </div>
        </div>

        {/* Filter Controls: Month, Year, and Display View Mode Switch */}
        <div className="pt-4 border-t border-[#EAE6DC] flex flex-wrap items-center justify-between gap-4 bg-[#F9F8F6] p-3.5 rounded-lg">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717]">
              <Calendar className="w-4 h-4 text-[#D15B40]" />
              <span>Pilih Periode:</span>
            </div>

            {/* Month Dropdown */}
            <div className="relative">
              <select
                aria-label="Pilih Bulan"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-xs font-semibold text-[#171717] bg-white border border-[#D5D0C5] rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D15B40] shadow-2xs cursor-pointer"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    Bulan {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <select
                aria-label="Pilih Tahun"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs font-semibold text-[#171717] bg-white border border-[#D5D0C5] rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D15B40] shadow-2xs cursor-pointer"
              >
                {[2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick button to current month */}
            <button
              onClick={() => {
                setSelectedMonth(10);
                setSelectedYear(2026);
              }}
              className="text-[11px] font-semibold text-[#D15B40] hover:bg-[#F9DDD6] px-2.5 py-1 rounded-md bg-[#FDEDE9] border border-[#F2C9C0] transition-colors cursor-pointer"
            >
              Oktober 2026 (Bulan Ini)
            </button>
          </div>

          {/* VIEW MODE TOGGLE BUTTONS (Visual Charts vs Full Tables) */}
          <div className="flex items-center p-1 bg-white border border-[#D5D0C5] rounded-lg shadow-2xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-[#D15B40] text-white shadow-2xs'
                  : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F9F8F6]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Tampilan Grafik Visual</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#D15B40] text-white shadow-2xs'
                  : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F9F8F6]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tampilan Rincian Tabel</span>
            </button>
          </div>
        </div>

        {/* IF PEMBINA SUPERVISES MULTIPLE CLUBS: RENDER DISTINCT TABS */}
        {role === 'pembina' && supervisedEkskuls.length > 1 && (
          <div className="pt-2">
            <div className="text-xs font-bold text-[#525049] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#3B7A82]" />
              <span>Pilih Ekstrakurikuler Binaan (Rekapan Terpisah):</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {supervisedEkskuls.map((ekskul) => {
                const isSelected = ekskul.id === selectedEkskulId;
                return (
                  <button
                    key={ekskul.id}
                    onClick={() => setSelectedEkskulId(ekskul.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#D15B40] text-white border-[#D15B40] shadow-sm'
                        : 'bg-white text-[#525049] border-[#D5D0C5] hover:border-[#F2C9C0] hover:bg-[#FDEDE9] hover:text-[#D15B40]'
                    }`}
                  >
                    <span>{ekskul.name}</span>
                    <Badge variant={isSelected ? 'neutral' : 'info'} className={isSelected ? 'bg-white/20 text-white border-white/30' : ''}>
                      {ekskul.category}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#8C6819] mt-2 bg-[#FDF8EA] p-2 rounded border border-[#EFE2B8]">
              Perhatian: Anda membina lebih dari 1 ekstrakurikuler. Sesuai ketentuan, data rekapitulasi grafik dan file cetak PDF dipisahkan mandiri untuk setiap ekskul binaan.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* VIEW FOR PEMBINA                                         */}
      {/* ======================================================== */}
      {role === 'pembina' && pembinaData && (
        <div className="space-y-6">
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Anggota Baru</span>
                <Users className="w-4 h-4 text-[#D15B40]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                +{pembinaData.newMembers.length}{' '}
                <span className="text-xs font-normal text-[#68655F]">Siswa</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">Disahkan pada {monthName} {selectedYear}</p>
            </div>

            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Total Anggota Aktif</span>
                <CheckCircle2 className="w-4 h-4 text-[#3B7A82]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                {pembinaData.activeMembersCount}{' '}
                <span className="text-xs font-normal text-[#68655F]">/ {pembinaData.capacity} Kapasitas</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">
                Keterisian Kuota: {Math.round((pembinaData.activeMembersCount / pembinaData.capacity) * 100)}%
              </p>
            </div>

            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Sesi Latihan Bulan Ini</span>
                <Clock className="w-4 h-4 text-[#D15B40]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                {pembinaData.sessions.length}{' '}
                <span className="text-xs font-normal text-[#68655F]">Pertemuan</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">
                Tingkat Kehadiran: <strong className="text-[#D15B40]">{pembinaData.attendancePercentage}%</strong>
              </p>
            </div>

            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Prestasi Diraih</span>
                <Award className="w-4 h-4 text-[#8C6819]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                {pembinaData.achievements.length}{' '}
                <span className="text-xs font-normal text-[#68655F]">Penghargaan</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">Kejuaraan resmi terverifikasi</p>
            </div>
          </div>

          {/* VISUAL CHARTS MODE */}
          {viewMode === 'visual' && (
            <div className="space-y-6">
              {/* Graphic 1: Attendance Sessions Bar Chart */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE6DC] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#D15B40]" />
                      <span>Grafik Evaluasi Presensi & Kehadiran Sesi Latihan</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Visualisasi kehadiran anggota pada setiap sesi latihan {activeEkskul.name} selama bulan {monthName} {selectedYear}.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSessionsTable(!showSessionsTable)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D15B40] hover:bg-[#F9DDD6] self-start sm:self-center bg-[#FDEDE9] border border-[#F2C9C0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{showSessionsTable ? 'Sembunyikan Tabel' : 'Lihat Rincian Tabel'}</span>
                    {showSessionsTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* The Attendance Session Bar Chart */}
                <AttendanceSessionChart
                  sessions={pembinaData.sessions}
                  capacity={pembinaData.capacity}
                />

                {/* Collapsible Session Table if requested */}
                {showSessionsTable && (
                  <div className="pt-4 border-t border-[#EAE6DC]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                          <tr>
                            <th className="py-2.5 px-3 w-10 text-center">No</th>
                            <th className="py-2.5 px-3">Tanggal & Waktu</th>
                            <th className="py-2.5 px-3">Materi Latihan</th>
                            <th className="py-2.5 px-3">Lokasi</th>
                            <th className="py-2.5 px-3 text-center">Hadir</th>
                            <th className="py-2.5 px-3 text-center">Izin/Sakit</th>
                            <th className="py-2.5 px-3 text-center">Alpa</th>
                            <th className="py-2.5 px-3 text-center">% Hadir</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE6DC]">
                          {pembinaData.sessions.map((s, idx) => {
                            const present = s.present_count || 0;
                            const excused = (s.excused_count || 0) + (s.late_count || 0);
                            const absent = s.absent_count || 0;
                            const total = s.total_members || present + excused + absent || 1;
                            const pct = Math.round((present / total) * 100);
                            return (
                              <tr key={s.id} className="hover:bg-[#F9F8F6]/50">
                                <td className="py-2 px-3 text-center text-[#68655F]">{idx + 1}</td>
                                <td className="py-2 px-3 text-[#171717]">{s.session_date} ({s.start_time})</td>
                                <td className="py-2 px-3 font-semibold text-[#171717]">{s.title}</td>
                                <td className="py-2 px-3 text-[#525049]">{s.location}</td>
                                <td className="py-2 px-3 text-center font-bold text-[#D15B40]">{present}</td>
                                <td className="py-2 px-3 text-center text-[#8C6819]">{excused}</td>
                                <td className="py-2 px-3 text-center text-[#A33D35]">{absent}</td>
                                <td className="py-2 px-3 text-center font-bold text-[#D15B40]">{pct}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Graphic 2 & 3: Two Column Layout (Donut Kuota & Achievement Spotlight) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart: Rasio Kuota Keanggotaan */}
                <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#3B7A82]" />
                        <span>Proporsi & Utilisasi Kuota Anggota</span>
                      </h2>
                      <p className="text-xs text-[#68655F] mt-0.5">Rasio anggota lama, penambahan bulan ini, dan sisa daya tampung.</p>
                    </div>
                    <button
                      onClick={() => setShowMembersTable(!showMembersTable)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#D15B40] hover:bg-[#F9DDD6] bg-[#FDEDE9] border border-[#F2C9C0] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {showMembersTable ? 'Tutup' : 'Rincian'}
                    </button>
                  </div>

                  <ClubCapacityDonut
                    activeCount={pembinaData.activeMembersCount}
                    newCount={pembinaData.newMembers.length}
                    capacity={pembinaData.capacity}
                  />

                  {/* Collapsible New Members Table */}
                  {showMembersTable && (
                    <div className="pt-3 border-t border-[#EAE6DC] max-h-60 overflow-y-auto">
                      <div className="text-xs font-bold text-[#171717] mb-2">Anggota Baru Disahkan:</div>
                      {pembinaData.newMembers.length === 0 ? (
                        <p className="text-xs text-[#A8A29E] italic">Tidak ada anggota baru di bulan ini.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {pembinaData.newMembers.map((m, idx) => (
                            <div key={m.id || idx} className="flex items-center justify-between text-xs p-2 rounded bg-[#F9F8F6]">
                              <span className="font-semibold text-[#171717]">{m.student_name} ({m.student_class})</span>
                              <span className="text-[11px] text-[#68655F]">Tgl: {m.joined_at}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Graphic 3: Prestasi & Penghargaan Spotlight */}
                <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#8C6819]" />
                        <span>Rekap Prestasi & Piagam Bulan Ini</span>
                      </h2>
                      <p className="text-xs text-[#68655F] mt-0.5">Penghargaan resmi yang ditorehkan atlet ekskul binaan.</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#FDF8EA] text-[#8C6819]">
                      {pembinaData.achievements.length} Prestasi
                    </span>
                  </div>

                  {pembinaData.achievements.length === 0 ? (
                    <div className="bg-[#F9F8F6] rounded-xl p-8 text-center border border-[#EAE6DC] space-y-2">
                      <Award className="w-8 h-8 text-[#A8A29E] mx-auto" />
                      <p className="text-xs font-semibold text-[#525049]">
                        Belum ada turnamen/prestasi baru di bulan {monthName} {selectedYear}.
                      </p>
                      <p className="text-[11px] text-[#A8A29E]">
                        Sertifikat yang diverifikasi akan otomatis tampil di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pembinaData.achievements.map((ach) => (
                        <div
                          key={ach.id}
                          className="p-3.5 rounded-lg border border-[#EFE2B8] bg-gradient-to-r from-[#FDF8EA] to-white flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#8C6819]/10 text-[#8C6819] flex items-center justify-center shrink-0">
                              <Award className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#171717]">{ach.competition_name}</div>
                              <div className="text-[11px] text-[#525049]">{ach.rank} • Tingkat {ach.level}</div>
                              <div className="text-[10px] text-[#8C6819] font-medium mt-0.5">Peraih: {ach.student_name}</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-[#68655F] shrink-0">
                            {ach.achievement_date}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TABULAR FULL DATA MODE (When user toggles 'Tampilan Rincian Tabel') */}
          {viewMode === 'table' && (
            <div className="space-y-6">
              {/* Section 1: Tabel Anggota Baru Masuk */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D15B40]" />
                      <span>I. Rekapitulasi Anggota Baru Masuk ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Daftar siswa yang resmi bergabung dan disetujui menjadi anggota ekstrakurikuler {activeEkskul.name} pada bulan terpilih.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                    {pembinaData.newMembers.length} Siswa
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Nama Lengkap Siswa</th>
                        <th className="py-3 px-4">NISN</th>
                        <th className="py-3 px-4">Kelas</th>
                        <th className="py-3 px-4">Tanggal Bergabung</th>
                        <th className="py-3 px-4">Peran / Jabatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pembinaData.newMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#68655F] italic">
                            Tidak ada penambahan anggota baru yang disahkan pada bulan {monthName} {selectedYear}.
                          </td>
                        </tr>
                      ) : (
                        pembinaData.newMembers.map((m, idx) => (
                          <tr key={m.id || idx} className="hover:bg-[#F9F8F6]/50">
                            <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-[#171717]">{m.student_name}</td>
                            <td className="py-3 px-4 text-[#525049]">{m.student_nisn || '-'}</td>
                            <td className="py-3 px-4 text-[#525049]">{m.student_class}</td>
                            <td className="py-3 px-4 text-[#525049]">{m.joined_at}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[#E8F4F5] text-[#3B7A82]">
                                {m.role || 'Anggota'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Tabel Pelaksanaan Sesi Latihan & Presensi */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#3B7A82]" />
                      <span>II. Rekapitulasi Pelaksanaan Sesi Latihan & Kehadiran ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Daftar seluruh agenda latihan rutin, materi pembahasan, serta catatan kehadiran anggota per pertemuan.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E8F4F5] text-[#3B7A82]">
                    {pembinaData.sessions.length} Sesi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Tanggal & Waktu</th>
                        <th className="py-3 px-4">Materi / Topik Latihan</th>
                        <th className="py-3 px-4">Lokasi</th>
                        <th className="py-3 px-4 text-center">Hadir</th>
                        <th className="py-3 px-4 text-center">Izin / Sakit</th>
                        <th className="py-3 px-4 text-center">Alpa</th>
                        <th className="py-3 px-4 text-center">% Hadir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pembinaData.sessions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-[#68655F] italic">
                            Belum ada sesi latihan yang tercatat dalam sistem pada bulan {monthName} {selectedYear}.
                          </td>
                        </tr>
                      ) : (
                        pembinaData.sessions.map((s, idx) => {
                          const present = s.present_count || 0;
                          const excused = (s.excused_count || 0) + (s.late_count || 0);
                          const absent = s.absent_count || 0;
                          const total = s.total_members || present + excused + absent || 1;
                          const pct = Math.round((present / total) * 100);

                          return (
                            <tr key={s.id} className="hover:bg-[#F9F8F6]/50">
                              <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                              <td className="py-3 px-4 text-[#171717] font-medium">
                                <div>{s.session_date}</div>
                                <div className="text-[11px] text-[#68655F]">{s.start_time} - {s.end_time} WIB</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-bold text-[#171717]">{s.title}</div>
                                {s.notes && <div className="text-[11px] text-[#68655F] line-clamp-1">{s.notes}</div>}
                              </td>
                              <td className="py-3 px-4 text-[#525049]">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#A8A29E]" />
                                  <span>{s.location}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-[#D15B40]">{present}</td>
                              <td className="py-3 px-4 text-center text-[#8C6819]">{excused}</td>
                              <td className="py-3 px-4 text-center text-[#A33D35]">{absent}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="font-bold text-[#D15B40]">{pct}%</span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Tabel Prestasi & Kejuaraan */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#8C6819]" />
                      <span>III. Rekapitulasi Prestasi & Kejuaraan ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Daftar torehan medali, piagam penghargaan, dan prestasi lomba yang diraih anggota {activeEkskul.name} bulan ini.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDF8EA] text-[#8C6819]">
                    {pembinaData.achievements.length} Prestasi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Tanggal Prestasi</th>
                        <th className="py-3 px-4">Nama Kejuaraan / Turnamen</th>
                        <th className="py-3 px-4">Tingkat</th>
                        <th className="py-3 px-4">Peringkat / Juara</th>
                        <th className="py-3 px-4">Siswa Peraih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pembinaData.achievements.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#68655F] italic">
                            Tidak ada catatan kejuaraan / turnamen pada bulan {monthName} {selectedYear}.
                          </td>
                        </tr>
                      ) : (
                        pembinaData.achievements.map((a, idx) => (
                          <tr key={a.id} className="hover:bg-[#F9F8F6]/50">
                            <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                            <td className="py-3 px-4 text-[#525049]">{a.achievement_date}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#171717]">{a.competition_name}</div>
                              <div className="text-[11px] text-[#68655F]">{a.title}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#F9F8F6] text-[#525049] border border-[#EAE6DC]">
                                {a.level}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-[#8C6819]">{a.rank}</td>
                            <td className="py-3 px-4 text-[#171717] font-medium">{a.student_name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW FOR PENGURUS (SCHOOL-WIDE MACRO)                    */}
      {/* ======================================================== */}
      {role === 'pengurus' && pengurusData && (
        <div className="space-y-6">
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Akun Siswa Baru</span>
                <Users className="w-4 h-4 text-[#D15B40]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                +{pengurusData.newStudents.length}{' '}
                <span className="text-xs font-normal text-[#68655F]">Akun</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">Daftar website bulan {monthName}</p>
            </div>

            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Anggota Baru Ekskul</span>
                <CheckCircle2 className="w-4 h-4 text-[#3B7A82]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                +{pengurusData.ekskulRecapList.reduce((acc, curr) => acc + curr.newMembersCount, 0)}{' '}
                <span className="text-xs font-normal text-[#68655F]">Siswa</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">Penambahan seluruh cabang ekskul</p>
            </div>

            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Penggunaan Sarana</span>
                <Clock className="w-4 h-4 text-[#D15B40]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                {pengurusData.facilityUsageSessions.length}{' '}
                <span className="text-xs font-normal text-[#68655F]">Sesi Latihan</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">Log pemanfaatan lapangan sekolah</p>
            </div>

            <div className="bg-white border border-[#EAE6DC] p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#68655F] uppercase">
                <span>Prestasi Sekolah</span>
                <Award className="w-4 h-4 text-[#8C6819]" />
              </div>
              <div className="mt-2 text-2xl font-black text-[#171717]">
                {pengurusData.achievements.length}{' '}
                <span className="text-xs font-normal text-[#68655F]">Penghargaan</span>
              </div>
              <p className="text-[11px] text-[#525049] mt-1">Torehan prestasi bulan {monthName}</p>
            </div>
          </div>

          {/* VISUAL CHARTS MODE FOR PENGURUS */}
          {viewMode === 'visual' && (
            <div className="space-y-6">
              {/* Graphic 1: Ekskul Growth Comparison Bars */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE6DC] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#D15B40]" />
                      <span>Grafik Komparasi Pertumbuhan & Keaktifan Anggota Antar-Ekstrakurikuler</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Perbandingan kapasitas terisi dan penambahan anggota baru pada seluruh ekskul di SMKN 1 Ciomas ({monthName} {selectedYear}).
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGrowthTable(!showGrowthTable)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D15B40] hover:bg-[#F9DDD6] self-start sm:self-center bg-[#FDEDE9] border border-[#F2C9C0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{showGrowthTable ? 'Sembunyikan Tabel' : 'Lihat Rincian Tabel'}</span>
                    {showGrowthTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <EkskulGrowthChart data={pengurusData.ekskulRecapList} />

                {/* Collapsible Comparison Table */}
                {showGrowthTable && (
                  <div className="pt-4 border-t border-[#EAE6DC]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                          <tr>
                            <th className="py-2.5 px-3">Ekskul</th>
                            <th className="py-2.5 px-3">Kategori</th>
                            <th className="py-2.5 px-3">Pembina</th>
                            <th className="py-2.5 px-3 text-center">Anggota Baru</th>
                            <th className="py-2.5 px-3 text-center">Total Aktif</th>
                            <th className="py-2.5 px-3 text-center">Sesi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE6DC]">
                          {pengurusData.ekskulRecapList.map((item) => (
                            <tr key={item.ekskul.id} className="hover:bg-[#F9F8F6]/50">
                              <td className="py-2 px-3 font-bold text-[#171717]">{item.ekskul.name}</td>
                              <td className="py-2 px-3 text-[#525049]">{item.ekskul.category}</td>
                              <td className="py-2 px-3 text-[#525049]">{item.ekskul.supervisor_name}</td>
                              <td className="py-2 px-3 text-center font-bold text-[#D15B40]">+{item.newMembersCount}</td>
                              <td className="py-2 px-3 text-center text-[#171717]">{item.totalActiveMembers} / {item.capacity}</td>
                              <td className="py-2 px-3 text-center text-[#525049]">{item.sessionCount}x</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Graphic 2 & 3: Two Column Layout (Sarana Usage & Weekly Student Signups) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphic 2: Pemanfaatan Lapangan & Sarana Sekolah */}
                <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D15B40]" />
                        <span>Intensitas Pemanfaatan Sarana & Lapangan</span>
                      </h2>
                      <p className="text-xs text-[#68655F] mt-0.5">Sebaran pemakaian sarana olahraga dan fasilitas kampus.</p>
                    </div>
                    <button
                      onClick={() => setShowFacilityTable(!showFacilityTable)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#D15B40] hover:bg-[#F9DDD6] bg-[#FDEDE9] border border-[#F2C9C0] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {showFacilityTable ? 'Tutup' : 'Rincian'}
                    </button>
                  </div>

                  <FacilityUsageChart sessions={pengurusData.facilityUsageSessions} />

                  {/* Collapsible Facility Table */}
                  {showFacilityTable && (
                    <div className="pt-3 border-t border-[#EAE6DC] max-h-60 overflow-y-auto">
                      <div className="space-y-1.5 text-xs">
                        {pengurusData.facilityUsageSessions.map((s, idx) => (
                          <div key={s.id || idx} className="p-2 rounded bg-[#F9F8F6] flex items-center justify-between">
                            <div>
                              <strong className="text-[#171717]">{s.extracurricular_name}</strong> • {s.location}
                              <div className="text-[10px] text-[#68655F]">{s.session_date} ({s.start_time})</div>
                            </div>
                            <span className="font-bold text-[#D15B40]">{s.present_count} Siswa</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Graphic 3: Tren Registrasi Akun Siswa Baru per Pekan */}
                <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#D15B40]" />
                        <span>Tren Pembuatan Akun Siswa Baru</span>
                      </h2>
                      <p className="text-xs text-[#68655F] mt-0.5">Pertumbuhan akun siswa baru per pekan di website ({monthName}).</p>
                    </div>
                    <button
                      onClick={() => setShowStudentsTable(!showStudentsTable)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#D15B40] hover:bg-[#F9DDD6] bg-[#FDEDE9] border border-[#F2C9C0] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {showStudentsTable ? 'Tutup' : 'Rincian'}
                    </button>
                  </div>

                  <WeeklyStudentRegistrationChart
                    students={pengurusData.newStudents}
                    monthName={monthName}
                  />

                  {/* Collapsible Students Table */}
                  {showStudentsTable && (
                    <div className="pt-3 border-t border-[#EAE6DC] max-h-60 overflow-y-auto">
                      <div className="space-y-1.5 text-xs">
                        {pengurusData.newStudents.map((st) => (
                          <div key={st.id} className="p-2 rounded bg-[#F9F8F6] flex items-center justify-between">
                            <div>
                              <strong className="text-[#171717]">{st.name}</strong> ({st.class_name || 'Siswa'})
                              <div className="text-[10px] text-[#68655F]">{st.email}</div>
                            </div>
                            <span className="text-[11px] text-[#D15B40] font-semibold">
                              {st.created_at ? st.created_at.split('T')[0] : '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Graphic 4: Torehan Prestasi Sekolah Bulan Ini */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#8C6819]" />
                      <span>Rekapitulasi Prestasi Sekolah Bulan Ini</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">Daftar piala dan medali yang disumbangkan oleh berbagai ekskul.</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#FDF8EA] text-[#8C6819]">
                    {pengurusData.achievements.length} Prestasi
                  </span>
                </div>

                {pengurusData.achievements.length === 0 ? (
                  <div className="bg-[#F9F8F6] rounded-xl p-8 text-center border border-[#EAE6DC] space-y-2">
                    <Award className="w-8 h-8 text-[#A8A29E] mx-auto" />
                    <p className="text-xs font-semibold text-[#525049]">
                      Belum ada prestasi baru yang tercatat pada bulan {monthName} {selectedYear}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pengurusData.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-3.5 rounded-lg border border-[#EFE2B8] bg-gradient-to-r from-[#FDF8EA] to-white flex flex-col justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#8C6819]/15 text-[#8C6819] flex items-center justify-center shrink-0 mt-0.5">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D15B40] text-white">
                              {ach.extracurricular_name || 'Ekskul'}
                            </span>
                            <div className="text-xs font-bold text-[#171717] mt-1 line-clamp-1">{ach.competition_name}</div>
                            <div className="text-[11px] text-[#525049]">{ach.rank} • {ach.level}</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#EFE2B8]/60 flex items-center justify-between text-[10px] text-[#68655F]">
                          <span>Atlet: <strong>{ach.student_name}</strong></span>
                          <span>{ach.achievement_date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TABULAR FULL DATA MODE (When user toggles 'Tampilan Rincian Tabel') */}
          {viewMode === 'table' && (
            <div className="space-y-6">
              {/* Section 1: Tabel Siswa Baru yang Daftar di Website Bulan Ini */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D15B40]" />
                      <span>I. Rekapitulasi Akun Siswa Baru Terdaftar di Website ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Daftar akun siswa yang baru melakukan registrasi akun di platform EskulHub pada bulan terpilih.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                    {pengurusData.newStudents.length} Akun Baru
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Email Akun</th>
                        <th className="py-3 px-4">NISN</th>
                        <th className="py-3 px-4">Kelas</th>
                        <th className="py-3 px-4">Tanggal Buat Akun</th>
                        <th className="py-3 px-4">Status Akun</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pengurusData.newStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#68655F] italic">
                            Tidak ada pendaftaran akun siswa baru di website pada bulan {monthName} {selectedYear}.
                          </td>
                        </tr>
                      ) : (
                        pengurusData.newStudents.map((st, idx) => (
                          <tr key={st.id} className="hover:bg-[#F9F8F6]/50">
                            <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-[#171717]">{st.name}</td>
                            <td className="py-3 px-4 text-[#525049]">{st.email}</td>
                            <td className="py-3 px-4 text-[#525049]">{st.nisn || '-'}</td>
                            <td className="py-3 px-4 text-[#525049]">{st.class_name || '-'}</td>
                            <td className="py-3 px-4 text-[#525049]">
                              {st.created_at ? st.created_at.split('T')[0] : '-'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                                Aktif
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Tabel Komparasi Penambahan Anggota per Ekskul */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#3B7A82]" />
                      <span>II. Rekapitulasi Penambahan Anggota per Ekstrakurikuler ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Tabel perkembangan keanggotaan, kuota terisi, dan intensitas latihan dari setiap ekskul di SMKN 1 Ciomas.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E8F4F5] text-[#3B7A82]">
                    {pengurusData.ekskulRecapList.length} Cabang Ekskul
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Nama Ekstrakurikuler</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Guru Pembina</th>
                        <th className="py-3 px-4 text-center">Penambahan Bulan Ini</th>
                        <th className="py-3 px-4 text-center">Total Anggota Aktif</th>
                        <th className="py-3 px-4 text-center">Kapasitas</th>
                        <th className="py-3 px-4 text-center">Sesi Latihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pengurusData.ekskulRecapList.map((item, idx) => {
                        const capacityPct = Math.round((item.totalActiveMembers / item.capacity) * 100);
                        return (
                          <tr key={item.ekskul.id} className="hover:bg-[#F9F8F6]/50">
                            <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-[#171717]">{item.ekskul.name}</td>
                            <td className="py-3 px-4 text-[#525049]">{item.ekskul.category}</td>
                            <td className="py-3 px-4 text-[#525049]">{item.ekskul.supervisor_name}</td>
                            <td className="py-3 px-4 text-center font-bold text-[#D15B40]">
                              {item.newMembersCount > 0 ? `+${item.newMembersCount} Siswa` : '-'}
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-[#171717]">
                              {item.totalActiveMembers} Siswa
                            </td>
                            <td className="py-3 px-4 text-center text-[#525049]">
                              {item.capacity} ({capacityPct}%)
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[#F9F8F6] text-[#525049] border border-[#EAE6DC]">
                                {item.sessionCount} Kali
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Log Penggunaan Fasilitas & Sarana Prasarana */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D15B40]" />
                      <span>III. Log Penggunaan Fasilitas & Lapangan Sekolah ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Daftar pemakaian lapangan olahraga, aula, laboratorium, dan sarana sekolah oleh seluruh ekstrakurikuler.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDEDE9] text-[#D15B40]">
                    {pengurusData.facilityUsageSessions.length} Penggunaan
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Ekstrakurikuler</th>
                        <th className="py-3 px-4">Sarana / Fasilitas</th>
                        <th className="py-3 px-4">Topik Sesi Latihan</th>
                        <th className="py-3 px-4">Waktu</th>
                        <th className="py-3 px-4 text-center">Peserta Hadir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pengurusData.facilityUsageSessions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#68655F] italic">
                            Belum ada log penggunaan fasilitas sekolah yang tercatat pada bulan {monthName} {selectedYear}.
                          </td>
                        </tr>
                      ) : (
                        pengurusData.facilityUsageSessions.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-[#F9F8F6]/50">
                            <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                            <td className="py-3 px-4 font-semibold text-[#171717]">{s.session_date}</td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-[#D15B40]">{s.extracurricular_name}</span>
                            </td>
                            <td className="py-3 px-4 text-[#525049] font-medium">{s.location}</td>
                            <td className="py-3 px-4 text-[#171717]">{s.title}</td>
                            <td className="py-3 px-4 text-[#68655F]">{s.start_time} - {s.end_time} WIB</td>
                            <td className="py-3 px-4 text-center font-bold text-[#D15B40]">
                              {s.present_count || 0} Siswa
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Tabel Prestasi Sekolah Bulan Ini */}
              <div className="bg-white border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#8C6819]" />
                      <span>IV. Rekapitulasi Prestasi & Kejuaraan Sekolah ({monthName} {selectedYear})</span>
                    </h2>
                    <p className="text-xs text-[#68655F] mt-0.5">
                      Daftar seluruh prestasi dan piala yang berhasil disumbangkan siswa SMKN 1 Ciomas pada bulan terpilih.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDF8EA] text-[#8C6819]">
                    {pengurusData.achievements.length} Prestasi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9F8F6] text-[#525049] font-bold border-b border-[#EAE6DC]">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Ekstrakurikuler</th>
                        <th className="py-3 px-4">Nama Kejuaraan / Turnamen</th>
                        <th className="py-3 px-4">Tingkat</th>
                        <th className="py-3 px-4">Peringkat / Juara</th>
                        <th className="py-3 px-4">Siswa Peraih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE6DC]">
                      {pengurusData.achievements.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#68655F] italic">
                            Tidak ada catatan piala / kejuaraan baru pada bulan {monthName} {selectedYear}.
                          </td>
                        </tr>
                      ) : (
                        pengurusData.achievements.map((a, idx) => (
                          <tr key={a.id} className="hover:bg-[#F9F8F6]/50">
                            <td className="py-3 px-4 text-center text-[#68655F]">{idx + 1}</td>
                            <td className="py-3 px-4 text-[#525049]">{a.achievement_date}</td>
                            <td className="py-3 px-4 font-bold text-[#D15B40]">{a.extracurricular_name || 'Ekskul'}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#171717]">{a.competition_name}</div>
                              <div className="text-[11px] text-[#68655F]">{a.title}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#F9F8F6] text-[#525049] border border-[#EAE6DC]">
                                {a.level}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-[#8C6819]">{a.rank}</td>
                            <td className="py-3 px-4 text-[#171717] font-medium">{a.student_name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
