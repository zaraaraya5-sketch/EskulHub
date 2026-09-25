import React, { useState, useMemo } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { generatePortfolioPdf } from '@/lib/pdf/generatePortfolioPdf';
import {
  BookOpen,
  CheckSquare,
  Trophy,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Download,
  Search,
  Plus,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Award,
  Users,
  MapPin,
  UserCheck,
  FileCheck,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Extracurricular, ExtracurricularRegistration, Certificate } from '@/types';

export type StudentDashboardTab =
  | 'overview'
  | 'browse'
  | 'registrations'
  | 'attendance'
  | 'achievements'
  | 'documents'
  | 'portfolio';

interface StudentDashboardPageProps {
  onNavigate: (path: string) => void;
  initialTab?: StudentDashboardTab;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onNavigate,
  initialTab = 'overview',
}) => {
  const { currentUser } = useAuth();
  const settings = db.getSettings();
  const studentId = currentUser?.id || 'usr-student-1';
  const studentName = currentUser?.name || 'Siswa SMK Nusantara';

  // Active Tab
  const [activeTab, setActiveTab] = useState<StudentDashboardTab>(initialTab);

  // Queries from Mock Database
  const allEkskuls = db.getExtracurriculars();
  const myMemberships = db.getMembers().filter((m) => m.student_id === studentId && m.status === 'active');
  const myRegistrations = db.getRegistrations().filter((r) => r.student_id === studentId);
  const myAttendanceRecords = db.getAttendanceRecords().filter((r) => r.student_id === studentId);
  const myAchievements = db.getAchievements().filter((a) => a.student_id === studentId);
  const allActivities = db.getActivities();
  const myCertificates = db.getCertificates().filter((c) => c.student_id === studentId);
  const upcomingEvents = db.getSchoolEvents().slice(0, 4);
  const verification = db.generatePortfolioVerification(studentId, 'Drs. Bambang Suryono');

  // Personal Extracurricular Activities History (matches memberships or student activities)
  const myEkskulIds = new Set(myMemberships.map((m) => m.extracurricular_id));
  const myActivityHistory = allActivities.filter((act) => myEkskulIds.has(act.extracurricular_id));

  // Attendance metrics
  const totalSessions = myAttendanceRecords.length;
  const presentCount = myAttendanceRecords.filter((r) => r.status === 'present').length;
  const lateCount = myAttendanceRecords.filter((r) => r.status === 'late').length;
  const excusedCount = myAttendanceRecords.filter((r) => r.status === 'excused').length;
  const absentCount = myAttendanceRecords.filter((r) => r.status === 'absent').length;
  const attendanceRate =
    totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 100;

  // State: PDF Generation
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // State: Detail Modal
  const [selectedEkskulDetail, setSelectedEkskulDetail] = useState<Extracurricular | null>(null);

  // State: Registration Modal
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [regTargetEkskulId, setRegTargetEkskulId] = useState<string>('');
  const [regNisn, setRegNisn] = useState('0067823910');
  const [regClass, setRegClass] = useState('XII RPL 1');
  const [regReason, setRegReason] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // State: Upload Supporting Document Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docIssuer, setDocIssuer] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docError, setDocError] = useState('');
  const [docSuccess, setDocSuccess] = useState('');

  // State: Browse Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // State: Attendance Filters
  const [attendanceEkskulFilter, setAttendanceEkskulFilter] = useState('Semua');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('Semua');

  // Categories list
  const categories = ['Semua', 'Olahraga', 'Seni & Budaya', 'Sains & Teknologi', 'Kepemimpinan', 'Bahasa & Literasi'];

  // Filtered Ekskuls for Browse
  const filteredEkskuls = useMemo(() => {
    return allEkskuls.filter((eks) => {
      const matchCategory = categoryFilter === 'Semua' || eks.category === categoryFilter;
      const matchSearch =
        eks.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eks.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eks.supervisor_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allEkskuls, categoryFilter, searchQuery]);

  // Filtered Attendance Records
  const filteredAttendance = useMemo(() => {
    return myAttendanceRecords.filter((rec) => {
      const matchEkskul =
        attendanceEkskulFilter === 'Semua' || rec.extracurricular_name === attendanceEkskulFilter;
      const matchStatus =
        attendanceStatusFilter === 'Semua' || rec.status === attendanceStatusFilter;
      return matchEkskul && matchStatus;
    });
  }, [myAttendanceRecords, attendanceEkskulFilter, attendanceStatusFilter]);

  // Handlers: PDF Export
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePortfolioPdf(verification, settings);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Gagal menerbitkan PDF portofolio. Silakan coba sesaat lagi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handlers: Registration
  const handleOpenRegisterModal = (ekskulId?: string) => {
    setRegError('');
    setRegSuccess('');
    setRegReason('');
    if (ekskulId) {
      setRegTargetEkskulId(ekskulId);
    } else {
      const firstAvailable = allEkskuls.find((e) => e.registration_status === 'open');
      setRegTargetEkskulId(firstAvailable?.id || allEkskuls[0]?.id || '');
    }
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regTargetEkskulId) {
      setRegError('Silakan pilih ekstrakurikuler yang ingin didaftar.');
      return;
    }
    if (!regReason.trim()) {
      setRegError('Mohon isi alasan atau motivasi Anda bergabung.');
      return;
    }

    const res = db.createRegistration({
      extracurricular_id: regTargetEkskulId,
      student_id: studentId,
      student_name: studentName,
      student_class: regClass,
      student_nisn: regNisn,
      reason: regReason.trim(),
    });

    if (!res.success) {
      setRegError(res.message);
      return;
    }

    setRegSuccess('Pendaftaran berhasil diajukan! Status dapat Anda pantau di tab "Status Pendaftaran".');
    setRegReason('');
    setTimeout(() => {
      setRegisterModalOpen(false);
      setActiveTab('registrations');
    }, 1200);
  };

  // Handlers: Upload Supporting Document
  const handleUploadDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocError('');
    setDocSuccess('');

    if (!docTitle.trim()) {
      setDocError('Judul sertifikat / piagam wajib diisi.');
      return;
    }
    if (!docIssuer.trim()) {
      setDocError('Lembaga atau instansi penerbit wajib diisi.');
      return;
    }

    const res = db.addCertificate({
      student_id: studentId,
      title: docTitle.trim(),
      issuer: docIssuer.trim(),
      certificate_number: docNumber.trim() || `SMK-ND/DOC/${Date.now().toString().slice(-4)}`,
      issue_date: docDate,
      file_url: docFileUrl.trim() || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
      is_verified: false,
    });

    if (res.success) {
      setDocSuccess('Dokumen pendukung berhasil diunggah! Berkas akan ditinjau oleh Kesiswaan untuk integrasi portofolio.');
      setDocTitle('');
      setDocIssuer('');
      setDocNumber('');
      setTimeout(() => {
        setUploadModalOpen(false);
        setActiveTab('documents');
      }, 1200);
    }
  };

  // Helper check for registration / membership status
  const getEkskulStudentStatus = (ekskulId: string) => {
    const isMember = myMemberships.some((m) => m.extracurricular_id === ekskulId);
    if (isMember) return 'member';
    const reg = myRegistrations.find((r) => r.extracurricular_id === ekskulId);
    if (reg) return reg.status;
    return 'none';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Student Profile Header */}
      <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-[#234B36] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            {studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#234B36]">
                Portal Siswa Resmi
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2]">
                TA {settings.academic_year}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECEAE4] text-[#171717] border border-[#D8D4CC]">
                {regClass}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
              {studentName}
            </h1>
            <p className="text-xs text-[#68655F] mt-0.5">
              NISN: <span className="font-mono font-medium text-[#171717]">{regNisn}</span> • {settings.school_name}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenRegisterModal()}
            icon={<Plus className="w-3.5 h-3.5 text-[#234B36]" />}
          >
            Daftar Ekskul Baru
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDocError('');
              setDocSuccess('');
              setUploadModalOpen(true);
            }}
            icon={<UploadCloud className="w-3.5 h-3.5 text-[#234B36]" />}
          >
            Unggah Piagam/Sertifikat
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            isLoading={isGeneratingPdf}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Unduh Portofolio PDF
          </Button>
        </div>
      </div>

      {/* 5 Core Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => setActiveTab('overview')}
          className="bg-white border border-[#D8D4CC] rounded-lg p-3.5 hover:border-[#234B36] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#68655F] uppercase">Ekskul Aktif</div>
          <div className="text-2xl font-bold text-[#171717] mt-1">{myMemberships.length}</div>
          <div className="text-[10px] text-[#234B36] font-medium mt-0.5">Terdaftar resmi</div>
        </div>

        <div
          onClick={() => setActiveTab('registrations')}
          className="bg-white border border-[#D8D4CC] rounded-lg p-3.5 hover:border-[#234B36] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#68655F] uppercase">Pendaftaran Diajukan</div>
          <div className="text-2xl font-bold text-[#171717] mt-1">
            {myRegistrations.length}
          </div>
          <div className="text-[10px] text-[#B58A32] font-semibold mt-0.5">
            {myRegistrations.filter((r) => r.status === 'pending').length} Menunggu review
          </div>
        </div>

        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white border border-[#D8D4CC] rounded-lg p-3.5 hover:border-[#234B36] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#68655F] uppercase">Tingkat Kehadiran</div>
          <div className="text-2xl font-bold text-[#234B36] mt-1">{attendanceRate}%</div>
          <div className="text-[10px] text-[#68655F] mt-0.5">{presentCount} Hadir dari {totalSessions} sesi</div>
        </div>

        <div
          onClick={() => setActiveTab('achievements')}
          className="bg-white border border-[#D8D4CC] rounded-lg p-3.5 hover:border-[#234B36] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#68655F] uppercase">Prestasi Terdata</div>
          <div className="text-2xl font-bold text-[#171717] mt-1">{myAchievements.length}</div>
          <div className="text-[10px] text-[#234B36] font-medium mt-0.5">
            {myAchievements.filter((a) => a.is_verified).length} Tervalidasi resmi
          </div>
        </div>

        <div
          onClick={() => setActiveTab('documents')}
          className="bg-white border border-[#D8D4CC] rounded-lg p-3.5 hover:border-[#234B36] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#68655F] uppercase">Dokumen Pendukung</div>
          <div className="text-2xl font-bold text-[#171717] mt-1">{myCertificates.length}</div>
          <div className="text-[10px] text-[#234B36] font-medium mt-0.5">Piagam tersimpan</div>
        </div>
      </div>

      {/* Navigation Tabs for All 10 Student Features */}
      <div className="border-b border-[#D8D4CC] bg-white rounded-t-lg px-2 pt-2 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ikhtisar & Ekskul Saya</span>
        </button>

        <button
          onClick={() => setActiveTab('browse')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'browse'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Jelajah Ekskul</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'registrations'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Status Pendaftaran</span>
          {myRegistrations.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'registrations'
                  ? 'bg-white text-[#234B36]'
                  : 'bg-[#E7EFEA] text-[#234B36]'
              }`}
            >
              {myRegistrations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Presensi & Kehadiran</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'achievements'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Prestasi & Kepanitiaan</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Dokumen Pendukung</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-md transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
            activeTab === 'portfolio'
              ? 'bg-[#234B36] text-white border-t border-x border-[#234B36]'
              : 'text-[#68655F] hover:text-[#171717] hover:bg-[#F5F2EA]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Portofolio Resmi (PDF & QR)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & EKSKUL SAYA */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Memberships & Activity Overview */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Memberships */}
            <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D8D4CC]">
                <div>
                  <h2 className="text-sm font-bold text-[#171717]">Ekstrakurikuler yang Diikuti</h2>
                  <p className="text-xs text-[#68655F] mt-0.5">Daftar ekskul resmi tempat Anda terdaftar aktif sebagai anggota/pengurus.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('browse')}
                  icon={<Search className="w-3.5 h-3.5" />}
                >
                  Jelajah Ekskul Lain
                </Button>
              </div>

              {myMemberships.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#68655F] space-y-3">
                  <p>Anda belum terdaftar dalam ekstrakurikuler manapun saat ini.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('browse')}
                  >
                    Daftar Sekarang
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myMemberships.map((m) => {
                    const ekskul = db.getExtracurricularById(m.extracurricular_id);
                    return (
                      <div
                        key={m.id}
                        className="p-4 border border-[#D8D4CC] rounded-lg bg-[#F5F2EA]/30 hover:bg-[#F5F2EA]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={ekskul?.profile_image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150'}
                            alt={ekskul?.name}
                            className="w-14 h-14 rounded-lg object-cover border border-[#D8D4CC] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-bold text-[#171717]">{ekskul?.name}</span>
                              <Badge variant="success">{m.role}</Badge>
                              <span className="text-[11px] text-[#68655F]">
                                Bergabung: {m.joined_at}
                              </span>
                            </div>
                            <div className="text-xs text-[#68655F] space-y-0.5">
                              <div><strong className="text-[#171717]">Jadwal:</strong> {ekskul?.practice_schedule}</div>
                              <div><strong className="text-[#171717]">Lokasi:</strong> {ekskul?.location} • <strong className="text-[#171717]">Pembina:</strong> {ekskul?.supervisor_name}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEkskulDetail(ekskul || null)}
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Detail
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Attendance Preview */}
            <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#D8D4CC]">
                <div>
                  <h2 className="text-sm font-bold text-[#171717]">Catatan Presensi Terkini</h2>
                  <p className="text-xs text-[#68655F] mt-0.5">Rekap sesi latihan terakhir yang dicatat oleh pembina/pengurus ekskul.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('attendance')}
                  icon={<CheckSquare className="w-3.5 h-3.5" />}
                >
                  Buku Presensi Lengkap
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-[#D8D4CC]">
                  <thead className="bg-[#F5F2EA] border-b border-[#D8D4CC] text-[#171717]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                      <th className="py-2.5 px-3 font-semibold">Ekstrakurikuler</th>
                      <th className="py-2.5 px-3 font-semibold">Materi Latihan</th>
                      <th className="py-2.5 px-3 font-semibold">Status Presensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D4CC]">
                    {myAttendanceRecords.slice(0, 5).map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F5F2EA]/40">
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
                      </tr>
                    ))}
                    {myAttendanceRecords.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-[#68655F]">
                          Belum ada catatan presensi latihan tercatat untuk akun Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Quick Portfolio Card & Upcoming Events */}
          <div className="lg:col-span-4 space-y-6">
            {/* Portfolio Status Card */}
            <div className="bg-[#234B36] text-white rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
                <ShieldCheck className="w-4 h-4" />
                <span>Dokumen Portofolio Resmi</span>
              </div>
              <h3 className="text-base font-bold">Portofolio Non-Akademik TA. 2025/2026</h3>
              <p className="text-xs text-white/85 leading-relaxed">
                Seluruh rekam jejak ekskul, presensi ({attendanceRate}%), dan sertifikat prestasi telah diverifikasi dengan QR publik resmi.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center bg-white text-[#234B36] hover:bg-[#F5F2EA] border-transparent font-bold"
                  onClick={handleDownloadPdf}
                  isLoading={isGeneratingPdf}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Unduh Portofolio (PDF)
                </Button>
                <button
                  type="button"
                  onClick={() => setActiveTab('portfolio')}
                  className="text-center text-xs text-white/80 hover:text-white underline cursor-pointer py-1"
                >
                  Pratinjau Lembar Portofolio
                </button>
              </div>
            </div>

            {/* Upcoming Agenda & Practices */}
            <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D8D4CC]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#68655F]">
                  Agenda Mendatang
                </h3>
                <Calendar className="w-4 h-4 text-[#234B36]" />
              </div>

              <div className="space-y-3 text-xs">
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded-lg space-y-1">
                    <div className="font-bold text-[#171717]">{ev.title}</div>
                    <div className="text-[#68655F] flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.start_datetime.replace('T', ' ')}</span>
                    </div>
                    <div className="text-[11px] text-[#234B36] font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{ev.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BROWSE EXTRACURRICULARS */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-5">
          {/* Search & Filter Header */}
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#171717]">Katalog Ekstrakurikuler Sekolah</h2>
                <p className="text-xs text-[#68655F]">
                  Pilih dan daftarkan diri pada ekstrakurikuler yang sesuai dengan minat dan bakat Anda.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenRegisterModal()}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Formulir Pendaftaran Langsung
              </Button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68655F]" />
                <input
                  type="text"
                  placeholder="Cari nama ekskul, pembina, atau kegiatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#D8D4CC] rounded-md text-xs bg-white focus:outline-none focus:border-[#234B36]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer shrink-0 transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#234B36] text-white'
                        : 'bg-[#F5F2EA] text-[#68655F] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extracurricular Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEkskuls.map((ekskul) => {
              const studentStatus = getEkskulStudentStatus(ekskul.id);
              const isFull = ekskul.current_member_count >= ekskul.member_capacity;

              return (
                <div
                  key={ekskul.id}
                  className="bg-white border border-[#D8D4CC] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#234B36] transition-colors"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-40 overflow-hidden bg-[#ECEAE4]">
                      <img
                        src={ekskul.profile_image}
                        alt={ekskul.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant="neutral" className="bg-[#171717]/80 text-white backdrop-blur-xs text-[10px]">
                          {ekskul.category}
                        </Badge>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        {ekskul.registration_status === 'open' && !isFull ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2] shadow-xs">
                            Pendaftaran Dibuka
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F9ECEB] text-[#A33D35] border border-[#E8BAB5] shadow-xs">
                            {isFull ? 'Kuota Penuh' : 'Pendaftaran Ditutup'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-[#171717]">{ekskul.name}</h3>
                        <p className="text-xs text-[#68655F] line-clamp-2 mt-1 leading-relaxed">
                          {ekskul.short_description}
                        </p>
                      </div>

                      <div className="space-y-1 text-xs border-t border-[#D8D4CC] pt-3 text-[#68655F]">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#234B36]" />
                          <span>Pembina: <strong className="text-[#171717]">{ekskul.supervisor_name}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#234B36]" />
                          <span>{ekskul.practice_schedule}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#234B36]" />
                          <span>{ekskul.location}</span>
                        </div>
                      </div>

                      {/* Quota Progress */}
                      <div className="pt-1">
                        <div className="flex justify-between text-[11px] text-[#68655F] mb-1">
                          <span>Kapasitas Anggota</span>
                          <span className="font-bold text-[#171717]">
                            {ekskul.current_member_count} / {ekskul.member_capacity} Kuota
                          </span>
                        </div>
                        <div className="w-full bg-[#EAE6DC] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#234B36] h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((ekskul.current_member_count / ekskul.member_capacity) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 pt-0 border-t border-[#D8D4CC]/60 mt-3 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEkskulDetail(ekskul)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Detail
                    </Button>

                    {studentStatus === 'member' ? (
                      <span className="px-2.5 py-1 rounded bg-[#E7EFEA] text-[#234B36] font-bold text-xs border border-[#B7D2C2] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Anggota Aktif
                      </span>
                    ) : studentStatus === 'pending' ? (
                      <span className="px-2.5 py-1 rounded bg-[#FDF5E6] text-[#8C6819] font-bold text-xs border border-[#D9C187] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Menunggu Review
                      </span>
                    ) : ekskul.registration_status === 'open' && !isFull ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenRegisterModal(ekskul.id)}
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Daftar Ekskul
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Penuh
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REGISTRATION STATUS */}
      {/* ========================================================================= */}
      {activeTab === 'registrations' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#171717]">Status Pendaftaran Ekstrakurikuler</h2>
              <p className="text-xs text-[#68655F]">
                Pantau pengajuan bergabung ekstrakurikuler Anda yang sedang ditinjau oleh guru pembina.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenRegisterModal()}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Ajukan Pendaftaran Baru
            </Button>
          </div>

          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
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
                <table className="w-full text-xs text-left border border-[#D8D4CC]">
                  <thead className="bg-[#F5F2EA] border-b border-[#D8D4CC] text-[#171717]">
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
                      <tr key={reg.id} className="hover:bg-[#F5F2EA]/40">
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
            <div className="p-3.5 bg-[#F5F2EA]/60 border border-[#D8D4CC] rounded-lg text-xs text-[#68655F] space-y-1">
              <strong className="text-[#171717]">Alur Pendaftaran:</strong>
              <p>
                Setiap pendaftaran yang diajukan akan diverifikasi oleh Pembina Kesiswaan berdasarkan kapasitas ruang latihan dan kriteria anggota. Setelah status berubah menjadi <strong>Diterima</strong>, data Anda otomatis masuk ke dalam rekap absensi dan portofolio resmi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ATTENDANCE HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Attendance Overview Card */}
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8D4CC] pb-3">
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
              <div className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded">
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
                  className="px-2.5 py-1.5 border border-[#D8D4CC] rounded text-xs bg-white focus:outline-none"
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
                  className="px-2.5 py-1.5 border border-[#D8D4CC] rounded text-xs bg-white focus:outline-none"
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
              <table className="w-full text-xs text-left border border-[#D8D4CC]">
                <thead className="bg-[#F5F2EA] border-b border-[#D8D4CC] text-[#171717]">
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
                    <tr key={rec.id} className="hover:bg-[#F5F2EA]/40">
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
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ACHIEVEMENTS & COMMITTEES & ACTIVITIES */}
      {/* ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Section: Achievements (Prestasi) */}
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D4CC] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#B58A32]" />
                  <span>Daftar Prestasi & Penghargaan Kompetisi</span>
                </h2>
                <p className="text-xs text-[#68655F]">
                  Pencapaian kejuaraan resmi yang telah diverifikasi oleh tim Kesiswaan sekolah.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#E7EFEA] text-[#234B36] font-bold text-xs border border-[#B7D2C2]">
                {myAchievements.filter((a) => a.is_verified).length} Tervalidasi
              </span>
            </div>

            {myAchievements.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#68655F]">
                Belum ada data prestasi yang terdaftar. Anda dapat mengajukan piagam di tab "Dokumen Pendukung".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 border border-[#D8D4CC] rounded-lg bg-[#F5F2EA]/30 hover:bg-[#F5F2EA]/60 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-[#171717]">{ach.title}</h4>
                      <Badge variant={ach.is_verified ? 'success' : 'warning'}>
                        {ach.is_verified ? 'Tervalidasi' : 'Menunggu Validasi'}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#68655F] space-y-0.5">
                      <div><strong className="text-[#171717]">Ajang:</strong> {ach.competition_name}</div>
                      <div><strong className="text-[#171717]">Tingkat:</strong> {ach.level} • <strong className="text-[#171717]">Peringkat:</strong> {ach.rank}</div>
                      <div><strong className="text-[#171717]">Ekskul:</strong> {ach.extracurricular_name} ({ach.achievement_date})</div>
                      {ach.verified_by_name && (
                        <div className="text-[11px] text-[#234B36] font-medium pt-1">
                          Disahkan oleh: {ach.verified_by_name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Committees & School Events (Kepanitiaan & Event) */}
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-[#D8D4CC] pb-3">
              <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#234B36]" />
                <span>Kepanitiaan & Partisipasi Event Sekolah</span>
              </h2>
              <p className="text-xs text-[#68655F]">
                Peran aktif dalam kepanitiaan kegiatan OSIS, turnamen antar-sekolah, dan pengabdian siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verification.summary_data.committee_roles?.map((comm, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-[#D8D4CC] rounded-lg bg-white space-y-1 hover:border-[#234B36] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">{comm.title}</span>
                    <span className="text-[11px] text-[#68655F] font-mono">{comm.year}</span>
                  </div>
                  <div className="text-xs text-[#234B36] font-semibold">{comm.role}</div>
                  <div className="text-[11px] text-[#68655F]">Tercatat dalam rekam jejak portofolio non-akademik siswa.</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Personal Extracurricular Activity History */}
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-[#D8D4CC] pb-3">
              <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#234B36]" />
                <span>Riwayat Kegiatan & Dokumentasi Ekskul</span>
              </h2>
              <p className="text-xs text-[#68655F]">
                Aktivitas program kerja, turnamen, dan workshop yang dilaksanakan oleh ekstrakurikuler Anda.
              </p>
            </div>

            <div className="space-y-3">
              {myActivityHistory.map((act) => (
                <div
                  key={act.id}
                  className="p-4 border border-[#D8D4CC] rounded-lg bg-[#F5F2EA]/20 flex flex-col md:flex-row gap-4 items-start"
                >
                  {act.documentation_urls?.[0] && (
                    <img
                      src={act.documentation_urls[0]}
                      alt={act.title}
                      className="w-full md:w-36 h-24 rounded-lg object-cover border border-[#D8D4CC] shrink-0"
                    />
                  )}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#171717]">{act.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E7EFEA] text-[#234B36]">
                        {act.extracurricular_name}
                      </span>
                    </div>
                    <p className="text-[#68655F] leading-relaxed">{act.description}</p>
                    <div className="text-[#68655F] pt-1 flex items-center gap-3 text-[11px]">
                      <span>Tanggal: <strong className="text-[#171717]">{act.activity_date}</strong></span>
                      <span>Lokasi: <strong className="text-[#171717]">{act.location}</strong></span>
                      <span>Peserta: <strong className="text-[#171717]">{act.participant_count} Orang</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SUPPORTING DOCUMENTS (UPLOAD & VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#171717]">Dokumen Pendukung & Piagam Prestasi</h2>
              <p className="text-xs text-[#68655F]">
                Unggah salinan sertifikat kompetisi atau piagam keikutsertaan untuk memperkuat verifikasi portofolio.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDocError('');
                setDocSuccess('');
                setUploadModalOpen(true);
              }}
              icon={<UploadCloud className="w-3.5 h-3.5" />}
            >
              Unggah Dokumen Baru
            </Button>
          </div>

          <div className="bg-white border border-[#D8D4CC] rounded-xl p-5 shadow-xs space-y-4">
            {myCertificates.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#68655F] space-y-3">
                <UploadCloud className="w-10 h-10 text-[#68655F]/40 mx-auto" />
                <p>Belum ada berkas sertifikat yang diunggah.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setUploadModalOpen(true)}
                >
                  Unggah Dokumen Pertama
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 border border-[#D8D4CC] rounded-lg bg-white hover:border-[#234B36] transition-colors flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E7EFEA] text-[#234B36] flex items-center justify-center shrink-0 border border-[#B7D2C2]">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-[#171717]">{cert.title}</h4>
                          <Badge variant={cert.is_verified ? 'success' : 'warning'}>
                            {cert.is_verified ? 'Terverifikasi' : 'Menunggu Review'}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-[#68655F]">
                          Penerbit: <strong className="text-[#171717]">{cert.issuer}</strong>
                        </div>
                        <div className="text-[11px] font-mono text-[#68655F]">
                          No: {cert.certificate_number || '-'} • Tanggal: {cert.issue_date}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D8D4CC] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#68655F]">Format: Digital Tersimpan</span>
                      {cert.file_url && (
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#234B36] hover:underline"
                        >
                          <span>Buka Berkas</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: OFFICIAL PORTFOLIO (PDF & QR) */}
      {/* ========================================================================= */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="bg-[#234B36] text-white rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded text-xs font-semibold uppercase tracking-wider text-white">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Dokumen Resmi Validasi Kearsipan Sekolah</span>
              </div>
              <h2 className="text-xl font-bold">Portofolio Non-Akademik Terverifikasi</h2>
              <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                Portofolio ini berisi rekam jejak resmi keikutsertaan ekskul, persentase kehadiran digital ({attendanceRate}%), pencapaian prestasi lomba, serta peran kepanitiaan yang disahkan dengan QR Code institusi.
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="bg-white text-[#234B36] hover:bg-[#F5F2EA] border-transparent font-bold shrink-0 shadow-sm"
              onClick={handleDownloadPdf}
              isLoading={isGeneratingPdf}
              icon={<Download className="w-4 h-4" />}
            >
              Unduh Dokumen PDF
            </Button>
          </div>

          {/* Document Preview Card */}
          <div className="bg-white border border-[#D8D4CC] rounded-xl p-6 shadow-xs space-y-6">
            <div className="border-b-2 border-[#234B36] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#234B36]">
                  {settings.school_name}
                </div>
                <h3 className="text-lg font-bold text-[#171717] mt-0.5">
                  SURAT KETERANGAN PORTOFOLIO EKSTRAKURIKULER
                </h3>
                <div className="text-xs text-[#68655F]">
                  Nomor Surat: <span className="font-mono text-[#171717]">{verification.verification_id}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(`/verify/${verification.verification_id}`)}
                  className="px-3 py-1.5 bg-[#E7EFEA] hover:bg-[#d8e7de] border border-[#B7D2C2] text-[#234B36] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Uji Validasi QR Publik</span>
                </button>
              </div>
            </div>

            {/* Student info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded">
                <span className="text-[#68655F] block text-[11px]">Nama Lengkap Siswa</span>
                <span className="text-sm font-bold text-[#171717]">{studentName}</span>
              </div>
              <div className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded">
                <span className="text-[#68655F] block text-[11px]">Nomor Induk Siswa (NISN)</span>
                <span className="text-sm font-bold font-mono text-[#171717]">{regNisn}</span>
              </div>
              <div className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded">
                <span className="text-[#68655F] block text-[11px]">Rombongan Belajar (Kelas)</span>
                <span className="text-sm font-bold text-[#171717]">{regClass}</span>
              </div>
              <div className="p-3 bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded">
                <span className="text-[#68655F] block text-[11px]">Tingkat Kehadiran Latihan</span>
                <span className="text-sm font-bold text-[#234B36]">{attendanceRate}% ({presentCount}/{totalSessions} Sesi)</span>
              </div>
            </div>

            {/* Ekstrakurikuler Rekap List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                1. Keikutsertaan Ekstrakurikuler
              </h4>
              <div className="border border-[#D8D4CC] rounded-lg divide-y divide-[#D8D4CC] text-xs">
                {myMemberships.map((m) => {
                  const eks = db.getExtracurricularById(m.extracurricular_id);
                  return (
                    <div key={m.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#171717]">{eks?.name}</span>
                        <span className="text-[#68655F] ml-2">({eks?.category})</span>
                      </div>
                      <Badge variant="success">{m.role}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                2. Rekam Jejak Prestasi & Kompetisi
              </h4>
              <div className="border border-[#D8D4CC] rounded-lg divide-y divide-[#D8D4CC] text-xs">
                {myAchievements.map((ach) => (
                  <div key={ach.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#171717]">{ach.title}</div>
                      <div className="text-[11px] text-[#68655F]">{ach.competition_name} ({ach.level})</div>
                    </div>
                    <Badge variant={ach.is_verified ? 'success' : 'neutral'}>{ach.rank}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures & Certification footnote */}
            <div className="pt-4 border-t border-[#D8D4CC] flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-[#68655F]">
              <div>
                <div>Diterbitkan di: Kota Bandung</div>
                <div>Tanggal Pengesahan: 20 September 2026</div>
                <div className="font-semibold text-[#171717] mt-2">Wakasek Kesiswaan: Drs. Bambang Suryono</div>
              </div>

              <Button
                variant="primary"
                onClick={handleDownloadPdf}
                isLoading={isGeneratingPdf}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Unduh Lembar PDF Resmi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL EKSTRAKURIKULER */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(selectedEkskulDetail)}
        onClose={() => setSelectedEkskulDetail(null)}
        title={selectedEkskulDetail?.name || 'Detail Ekstrakurikuler'}
        maxWidth="lg"
      >
        {selectedEkskulDetail && (
          <div className="space-y-4 text-xs">
            <div className="relative h-44 rounded-lg overflow-hidden bg-[#ECEAE4]">
              <img
                src={selectedEkskulDetail.profile_image}
                alt={selectedEkskulDetail.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5">
                <Badge variant="neutral" className="bg-[#171717]/80 text-white">
                  {selectedEkskulDetail.category}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#171717] mb-1">
                {selectedEkskulDetail.name}
              </h3>
              <p className="text-xs text-[#68655F] leading-relaxed">
                {selectedEkskulDetail.full_description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F5F2EA]/60 border border-[#D8D4CC] rounded-lg">
              <div>
                <span className="text-[#68655F] block text-[11px]">Pembina:</span>
                <strong className="text-[#171717]">{selectedEkskulDetail.supervisor_name}</strong>
              </div>
              <div>
                <span className="text-[#68655F] block text-[11px]">Ketua Ekskul:</span>
                <strong className="text-[#171717]">{selectedEkskulDetail.chairperson_name}</strong>
              </div>
              <div>
                <span className="text-[#68655F] block text-[11px]">Jadwal Latihan:</span>
                <strong className="text-[#171717]">{selectedEkskulDetail.practice_schedule}</strong>
              </div>
              <div>
                <span className="text-[#68655F] block text-[11px]">Tempat/Lokasi:</span>
                <strong className="text-[#171717]">{selectedEkskulDetail.location}</strong>
              </div>
              <div>
                <span className="text-[#68655F] block text-[11px]">Kapasitas Anggota:</span>
                <strong className="text-[#171717]">
                  {selectedEkskulDetail.current_member_count} / {selectedEkskulDetail.member_capacity} Kuota
                </strong>
              </div>
              <div>
                <span className="text-[#68655F] block text-[11px]">Status Pendaftaran:</span>
                <Badge
                  variant={selectedEkskulDetail.registration_status === 'open' ? 'success' : 'danger'}
                >
                  {selectedEkskulDetail.registration_status === 'open' ? 'Dibuka' : 'Ditutup'}
                </Badge>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D8D4CC] flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedEkskulDetail(null)}>
                Tutup
              </Button>
              {selectedEkskulDetail.registration_status === 'open' &&
                !myMemberships.some((m) => m.extracurricular_id === selectedEkskulDetail.id) && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const id = selectedEkskulDetail.id;
                      setSelectedEkskulDetail(null);
                      handleOpenRegisterModal(id);
                    }}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Daftar ke Ekskul Ini
                  </Button>
                )}
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: FORM PENDAFTARAN EKSTRAKURIKULER */}
      {/* ========================================================================= */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Formulir Pendaftaran Ekstrakurikuler"
        maxWidth="md"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          {regSuccess && (
            <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] rounded-lg flex items-start gap-2.5 text-[#234B36]">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{regSuccess}</span>
            </div>
          )}

          {regError && (
            <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] rounded-lg flex items-start gap-2.5 text-[#A33D35]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{regError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Pilih Ekstrakurikuler
            </label>
            <select
              value={regTargetEkskulId}
              onChange={(e) => setRegTargetEkskulId(e.target.value)}
              className="w-full px-3 py-2 border border-[#D8D4CC] rounded-md text-xs bg-white focus:outline-none focus:border-[#234B36]"
              required
            >
              <option value="" disabled>-- Pilih Ekstrakurikuler --</option>
              {allEkskuls.map((e) => (
                <option
                  key={e.id}
                  value={e.id}
                  disabled={e.registration_status === 'closed' || e.current_member_count >= e.member_capacity}
                >
                  {e.name} ({e.category}) - {e.registration_status === 'open' ? 'Buka' : 'Tutup'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Siswa (Auto)"
              type="text"
              value={studentName}
              readOnly
              className="bg-[#F5F2EA]/60 text-[#68655F]"
            />
            <Input
              label="NISN Siswa"
              type="text"
              value={regNisn}
              onChange={(e) => setRegNisn(e.target.value)}
              required
            />
          </div>

          <Input
            label="Kelas / Rombel"
            type="text"
            value={regClass}
            onChange={(e) => setRegClass(e.target.value)}
            placeholder="Contoh: XII RPL 1"
            required
          />

          <Textarea
            label="Alasan & Motivasi Bergabung"
            value={regReason}
            onChange={(e) => setRegReason(e.target.value)}
            placeholder="Tuliskan pengalaman dasar, minat khusus, atau target kompetisi Anda..."
            rows={3}
            required
          />

          <div className="pt-3 border-t border-[#D8D4CC] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRegisterModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Kirim Pendaftaran
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: UNGGAH DOKUMEN PENDUKUNG / SERTIFIKAT */}
      {/* ========================================================================= */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Unggah Dokumen Piagam / Sertifikat Pendukung"
        maxWidth="md"
      >
        <form onSubmit={handleUploadDocumentSubmit} className="space-y-4 text-xs">
          {docSuccess && (
            <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] rounded-lg flex items-start gap-2.5 text-[#234B36]">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{docSuccess}</span>
            </div>
          )}

          {docError && (
            <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] rounded-lg flex items-start gap-2.5 text-[#A33D35]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{docError}</span>
            </div>
          )}

          <Input
            label="Judul Sertifikat / Piagam Penghargaan"
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Contoh: Juara 1 Lomba Desain Web Pelajar Kota"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lembaga / Instansi Penerbit"
              type="text"
              value={docIssuer}
              onChange={(e) => setDocIssuer(e.target.value)}
              placeholder="Contoh: Dinas Pendidikan Jabar"
              required
            />
            <Input
              label="Nomor Sertifikat (Bila Ada)"
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="Contoh: 421/SERT/2026/09"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Penerbitan"
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              required
            />
            <Input
              label="Tautan Berkas / File Scan URL"
              type="url"
              value={docFileUrl}
              onChange={(e) => setDocFileUrl(e.target.value)}
              placeholder="https://... (atau biarkan kosong untuk simulasi)"
            />
          </div>

          <div className="p-3 bg-[#F5F2EA]/60 border border-[#D8D4CC] rounded text-[11px] text-[#68655F]">
            Berkas yang Anda unggah akan divalidasi oleh Kesiswaan sebelum otomatis diintegrasikan ke lembar PDF portofolio resmi kelulusan.
          </div>

          <div className="pt-3 border-t border-[#D8D4CC] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUploadModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<UploadCloud className="w-3.5 h-3.5" />}
            >
              Simpan & Ajukan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
