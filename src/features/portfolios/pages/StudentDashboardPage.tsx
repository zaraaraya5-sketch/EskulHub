import React, { useState, useMemo } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Extracurricular } from '@/types';
import { StudentProfileHeader } from '../views/StudentProfileHeader';

// Import Tabs
import { StudentOverviewTab } from '../views/student/StudentOverviewTab';
import { StudentBrowseTab } from '../views/student/StudentBrowseTab';
import { StudentRegistrationsTab } from '../views/student/StudentRegistrationsTab';
import { StudentAttendanceTab } from '../views/student/StudentAttendanceTab';
import { StudentAchievementsTab } from '../views/student/StudentAchievementsTab';
import { StudentDocumentsTab } from '../views/student/StudentDocumentsTab';
import { StudentPortfolioTab } from '../views/student/StudentPortfolioTab';

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

  const regNisn = '0067823910';
  const regClass = 'XII RPL 1';

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
    try {
      const { generatePortfolioPdf } = await import('@/lib/pdf/generatePortfolioPdf');
      await generatePortfolioPdf(verification, settings);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenRegister = (ekskulId?: string) => {
    if (ekskulId) {
      const found = allEkskuls.find((e) => e.id === ekskulId);
      if (found) {
        onNavigate(`/ekskul/${found.slug}/daftar`);
        return;
      }
    }
    setActiveTab('browse');
  };

  const handleSelectEkskul = (ekskul: Extracurricular | null) => {
    if (ekskul) {
      onNavigate(`/ekskul/${ekskul.slug}`);
    }
  };

  const handleOpenUpload = () => {
    onNavigate('/student/documents/tambah');
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
        onOpenRegisterModal={() => handleOpenRegister()}
        onOpenUploadModal={handleOpenUpload}
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
          setSelectedEkskulDetail={handleSelectEkskul}
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
          setSelectedEkskulDetail={handleSelectEkskul}
          handleOpenRegisterModal={handleOpenRegister}
        />
      )}

      {activeTab === 'registrations' && (
        <StudentRegistrationsTab
          myRegistrations={myRegistrations}
          handleOpenRegisterModal={handleOpenRegister}
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
          onUploadNew={handleOpenUpload}
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
    </div>
  );
};
