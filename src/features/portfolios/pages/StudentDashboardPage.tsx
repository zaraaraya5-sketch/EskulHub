import React, { useState, useMemo } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { generatePortfolioPdf } from '@/lib/pdf/generatePortfolioPdf';
import { Plus, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { Extracurricular } from '@/types';
import { StudentProfileHeader } from '../components/StudentProfileHeader';

// Import Tabs
import { StudentOverviewTab } from '../components/student/StudentOverviewTab';
import { StudentBrowseTab } from '../components/student/StudentBrowseTab';
import { StudentRegistrationsTab } from '../components/student/StudentRegistrationsTab';
import { StudentAttendanceTab } from '../components/student/StudentAttendanceTab';
import { StudentAchievementsTab } from '../components/student/StudentAchievementsTab';
import { StudentDocumentsTab } from '../components/student/StudentDocumentsTab';
import { StudentPortfolioTab } from '../components/student/StudentPortfolioTab';

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

  const [activeTab, setActiveTab] = useState<StudentDashboardTab>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const allEkskuls = db.getExtracurriculars();
  const myMemberships = db.getMembers().filter((m) => m.student_id === studentId && m.status === 'active');
  const myRegistrations = db.getRegistrations().filter((r) => r.student_id === studentId);
  const myAttendanceRecords = db.getAttendanceRecords().filter((r) => r.student_id === studentId);
  const myAchievements = db.getAchievements().filter((a) => a.student_id === studentId);
  const allActivities = db.getActivities();
  const myCertificates = db.getCertificates().filter((c) => c.student_id === studentId);
  const upcomingEvents = db.getSchoolEvents().slice(0, 4);
  const verification = db.generatePortfolioVerification(studentId, 'Drs. Bambang Suryono');

  const myEkskulIds = new Set(myMemberships.map((m) => m.extracurricular_id));
  const myActivityHistory = allActivities.filter((act) => myEkskulIds.has(act.extracurricular_id));

  const totalSessions = myAttendanceRecords.length;
  const presentCount = myAttendanceRecords.filter((r) => r.status === 'present').length;
  const lateCount = myAttendanceRecords.filter((r) => r.status === 'late').length;
  const excusedCount = myAttendanceRecords.filter((r) => r.status === 'excused').length;
  const absentCount = myAttendanceRecords.filter((r) => r.status === 'absent').length;
  const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 100;

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [selectedEkskulDetail, setSelectedEkskulDetail] = useState<Extracurricular | null>(null);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [regTargetEkskulId, setRegTargetEkskulId] = useState<string>('');
  const [regNisn, setRegNisn] = useState('0067823910');
  const [regClass, setRegClass] = useState('XII RPL 1');
  const [regReason, setRegReason] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docIssuer, setDocIssuer] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docError, setDocError] = useState('');
  const [docSuccess, setDocSuccess] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const [attendanceEkskulFilter, setAttendanceEkskulFilter] = useState('Semua');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('Semua');

  const categories = ['Semua', 'Olahraga', 'Seni & Budaya', 'Sains & Teknologi', 'Kepemimpinan', 'Bahasa & Literasi'];

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

  const filteredAttendance = useMemo(() => {
    return myAttendanceRecords.filter((rec) => {
      const matchEkskul = attendanceEkskulFilter === 'Semua' || rec.extracurricular_name === attendanceEkskulFilter;
      const matchStatus = attendanceStatusFilter === 'Semua' || rec.status === attendanceStatusFilter;
      return matchEkskul && matchStatus;
    });
  }, [myAttendanceRecords, attendanceEkskulFilter, attendanceStatusFilter]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      generatePortfolioPdf(verification, settings, {
        memberships: myMemberships,
        attendanceRate,
        presentCount,
        totalSessions,
      });
      setIsGeneratingPdf(false);
    }, 1500);
  };

  const handleOpenRegisterModal = (ekskulId?: string) => {
    setRegError('');
    setRegSuccess('');
    setRegReason('');
    if (ekskulId) setRegTargetEkskulId(ekskulId);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regTargetEkskulId) {
      setRegError('Silakan pilih ekstrakurikuler yang dituju.');
      return;
    }

    const res = db.addRegistration({
      student_id: studentId,
      extracurricular_id: regTargetEkskulId,
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

  const getEkskulStudentStatus = (ekskulId: string) => {
    const isMember = myMemberships.some((m) => m.extracurricular_id === ekskulId);
    if (isMember) return 'member';
    const reg = myRegistrations.find((r) => r.extracurricular_id === ekskulId);
    if (reg) return reg.status;
    return 'none';
  };

  return (
    <div className="space-y-6">
      <StudentProfileHeader
        studentName={studentName}
        regClass={regClass}
        regNisn={regNisn}
        academicYear={settings.academic_year}
        schoolName={settings.school_name}
        isGeneratingPdf={isGeneratingPdf}
        onOpenRegisterModal={handleOpenRegisterModal}
        onOpenUploadModal={() => {
          setDocError('');
          setDocSuccess('');
          setUploadModalOpen(true);
        }}
        onDownloadPdf={handleDownloadPdf}
      />

      {activeTab === 'overview' && (
        <StudentOverviewTab
          myRegistrations={myRegistrations}
          attendanceRate={attendanceRate}
          presentCount={presentCount}
          totalSessions={totalSessions}
          myAchievements={myAchievements}
          myCertificates={myCertificates}
          myMemberships={myMemberships}
          myAttendanceRecords={myAttendanceRecords}
          upcomingEvents={upcomingEvents}
          isGeneratingPdf={isGeneratingPdf}
          setActiveTab={setActiveTab}
          setSelectedEkskulDetail={setSelectedEkskulDetail}
          handleDownloadPdf={handleDownloadPdf}
        />
      )}

      {activeTab === 'browse' && (
        <StudentBrowseTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          filteredEkskuls={filteredEkskuls}
          getEkskulStudentStatus={getEkskulStudentStatus}
          setSelectedEkskulDetail={setSelectedEkskulDetail}
          handleOpenRegisterModal={handleOpenRegisterModal}
        />
      )}

      {activeTab === 'registrations' && (
        <StudentRegistrationsTab
          myRegistrations={myRegistrations}
          handleOpenRegisterModal={handleOpenRegisterModal}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'attendance' && (
        <StudentAttendanceTab
          attendanceRate={attendanceRate}
          totalSessions={totalSessions}
          presentCount={presentCount}
          lateCount={lateCount}
          excusedCount={excusedCount}
          absentCount={absentCount}
          attendanceEkskulFilter={attendanceEkskulFilter}
          setAttendanceEkskulFilter={setAttendanceEkskulFilter}
          attendanceStatusFilter={attendanceStatusFilter}
          setAttendanceStatusFilter={setAttendanceStatusFilter}
          myMemberships={myMemberships}
          filteredAttendance={filteredAttendance}
        />
      )}

      {activeTab === 'achievements' && (
        <StudentAchievementsTab
          myAchievements={myAchievements}
          verification={verification}
          myActivityHistory={myActivityHistory}
        />
      )}

      {activeTab === 'documents' && (
        <StudentDocumentsTab
          myCertificates={myCertificates}
          setUploadModalOpen={setUploadModalOpen}
          setDocError={setDocError}
          setDocSuccess={setDocSuccess}
        />
      )}

      {activeTab === 'portfolio' && (
        <StudentPortfolioTab
          attendanceRate={attendanceRate}
          presentCount={presentCount}
          totalSessions={totalSessions}
          studentName={studentName}
          regNisn={regNisn}
          regClass={regClass}
          myMemberships={myMemberships}
          myAchievements={myAchievements}
          verification={verification}
          settings={settings}
          handleDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
          onNavigate={onNavigate}
        />
      )}

      {/* MODALS */}
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

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F9F8F6]/60 border border-[#EAE6DC] rounded-lg">
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

            <div className="pt-3 border-t border-[#EAE6DC] flex items-center justify-end gap-2">
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
              className="w-full px-3 py-2 border border-[#EAE6DC] rounded-md text-xs bg-white focus:outline-none focus:border-[#234B36]"
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
              className="bg-[#F9F8F6]/60 text-[#68655F]"
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

          <div className="pt-3 border-t border-[#EAE6DC] flex items-center justify-end gap-2">
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

          <div className="p-3 bg-[#F9F8F6]/60 border border-[#EAE6DC] rounded text-[11px] text-[#68655F]">
            Berkas yang Anda unggah akan divalidasi oleh Kesiswaan sebelum otomatis diintegrasikan ke lembar PDF portofolio resmi kelulusan.
          </div>

          <div className="pt-3 border-t border-[#EAE6DC] flex items-center justify-end gap-2">
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
