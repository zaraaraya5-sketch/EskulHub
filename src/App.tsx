import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/features/authentication/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { HomePage } from '@/features/extracurriculars/pages/HomePage';
import { CatalogPage } from '@/features/extracurriculars/pages/CatalogPage';
import { DetailPage } from '@/features/extracurriculars/pages/DetailPage';
import { CalendarPage } from '@/features/school-events/pages/CalendarPage';
import { CreateEventPage } from '@/features/school-events/pages/CreateEventPage';
import { VerificationPage } from '@/features/portfolios/pages/VerificationPage';
import { LoginPage } from '@/features/authentication/pages/LoginPage';
import { StudentDashboardPage } from '@/features/portfolios/pages/StudentDashboardPage';
import { StudentAttendancePage } from '@/features/attendance/pages/StudentAttendancePage';
import { StudentPortfolioPage } from '@/features/portfolios/pages/StudentPortfolioPage';
import { PengurusDashboardPage } from '@/features/extracurriculars/pages/PengurusDashboardPage';
import { PengurusAttendancePage } from '@/features/attendance/pages/PengurusAttendancePage';
import { TeacherDashboardPage } from '@/features/portfolios/pages/TeacherDashboardPage';
import { GuruDashboardPage } from '@/features/portfolios/pages/GuruDashboardPage';
import { PortfolioSamplePage } from '@/features/portfolios/pages/PortfolioSamplePage';
import { AdminDashboardPage } from '@/features/portfolios/pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const { currentUser, role } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if current page is within authenticated dashboard layout
  const isAuthenticatedDashboardRoute =
    currentPath.startsWith('/student') ||
    currentPath.startsWith('/pengurus') ||
    currentPath.startsWith('/guru') ||
    currentPath.startsWith('/pembina') ||
    currentPath.startsWith('/teacher') ||
    currentPath.startsWith('/admin');

  // Verify client-side route authorization
  const isUnauthorizedForDashboard =
    isAuthenticatedDashboardRoute &&
    (!currentUser ||
      (currentPath.startsWith('/admin') && role !== 'admin') ||
      (currentPath.startsWith('/guru') && !['guru', 'admin'].includes(role)) ||
      ((currentPath.startsWith('/pembina') || currentPath.startsWith('/teacher')) &&
        !['pembina', 'teacher', 'guru', 'admin'].includes(role)) ||
      (currentPath.startsWith('/pengurus') &&
        !['pengurus', 'pembina', 'teacher', 'admin'].includes(role)));

  const renderContent = () => {
    // If attempting to access protected dashboard without permission, show login
    if (isUnauthorizedForDashboard) {
      return <LoginPage currentPath="/login" onNavigate={navigate} />;
    }

    // 1. Detail route: /ekskul/:slug
    if (currentPath.startsWith('/ekskul/')) {
      const slug = currentPath.replace('/ekskul/', '');
      return <DetailPage slug={slug} onNavigate={navigate} />;
    }

    // 2. Verification route: /verify/:verificationId
    if (currentPath.startsWith('/verify')) {
      const id = currentPath.replace(/^\/verify\/?/, '').trim();
      return <VerificationPage verificationId={id} onNavigate={navigate} />;
    }

    // 3. Calendar Edit route: /calendar/edit/:id
    if (currentPath.startsWith('/calendar/edit/')) {
      const editId = currentPath.replace('/calendar/edit/', '');
      return <CreateEventPage onNavigate={navigate} editEventId={editId} />;
    }

    // 3. Exact matching routes
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/ekskul':
        return <CatalogPage onNavigate={navigate} />;
      case '/calendar':
        return <CalendarPage onNavigate={navigate} />;
      case '/calendar/create':
      case '/events/create':
        return <CreateEventPage onNavigate={navigate} />;
      case '/contoh-portofolio':
        return <PortfolioSamplePage onNavigate={navigate} />;
      case '/login':
      case '/register':
        return <LoginPage currentPath={currentPath} onNavigate={navigate} />;

      // Student routes
      case '/student/dashboard':
      case '/student':
        return <StudentDashboardPage onNavigate={navigate} initialTab="overview" />;
      case '/student/ekskul':
        return <StudentDashboardPage onNavigate={navigate} initialTab="browse" />;
      case '/student/registrations':
        return <StudentDashboardPage onNavigate={navigate} initialTab="registrations" />;
      case '/student/attendance':
        return <StudentDashboardPage onNavigate={navigate} initialTab="attendance" />;
      case '/student/activities':
      case '/student/achievements':
        return <StudentDashboardPage onNavigate={navigate} initialTab="achievements" />;
      case '/student/documents':
        return <StudentDashboardPage onNavigate={navigate} initialTab="documents" />;
      case '/student/portfolio':
        return <StudentDashboardPage onNavigate={navigate} initialTab="portfolio" />;

      // Pengurus routes (Legacy fallbacks)
      case '/pengurus/dashboard':
      case '/pengurus':
      case '/pengurus/members':
      case '/pengurus/registrations':
      case '/pengurus/activities':
      case '/pengurus/achievements':
        return <PengurusDashboardPage currentPath={currentPath} onNavigate={navigate} />;
      case '/pengurus/attendance':
        return <PengurusAttendancePage />;
      case '/pengurus/schedule':
        return <CalendarPage onNavigate={navigate} />;

      // Unified Teacher, Pembina & Pengurus routes
      case '/pembina/dashboard':
      case '/pembina':
      case '/pembina/members':
      case '/pembina/extracurriculars':
      case '/pembina/attendance':
      case '/pembina/achievements':
      case '/teacher/dashboard':
      case '/teacher':
      case '/teacher/extracurriculars':
      case '/teacher/attendance':
      case '/teacher/activities':
      case '/teacher/achievements':
        return <TeacherDashboardPage currentPath={currentPath} onNavigate={navigate} />;
      case '/pembina/schedule':
        return <CalendarPage onNavigate={navigate} />;

      // Guru Wali Kelas routes
      case '/guru/dashboard':
      case '/guru':
      case '/guru/students':
      case '/guru/grades':
      case '/guru/verification':
        return <GuruDashboardPage currentPath={currentPath} onNavigate={navigate} />;

      // Admin routes
      case '/admin/dashboard':
      case '/admin':
      case '/admin/students':
      case '/admin/teachers':
      case '/admin/pembina':
      case '/admin/ekskul':
      case '/admin/schedule':
      case '/admin/events':
      case '/admin/verification':
      case '/admin/profile':
      case '/admin/registrations':
      case '/admin/portfolio':
      case '/admin/settings':
        return <AdminDashboardPage currentPath={currentPath} onNavigate={navigate} />;

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  // Dedicated Login / Register Screen or Unauthorized Dashboard Access
  if (currentPath === '/login' || currentPath === '/register' || isUnauthorizedForDashboard) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] text-[#171717] flex items-center justify-center p-4 sm:p-6">
        <div key={currentPath} className="w-full flex justify-center animate-scale-in">
          {renderContent()}
        </div>
      </div>
    );
  }

  // If in dashboard: Render ONLY Sidebar and full-height content (NO NAVBAR!)
  if (isAuthenticatedDashboardRoute) {
    return (
      <div className="min-h-screen flex bg-[#F9F8F6] text-[#171717]">
        <Sidebar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
          <div key={currentPath} className="max-w-7xl mx-auto animate-fade-in-up">
            {renderContent()}
          </div>
        </main>
      </div>
    );
  }

  // If on public pages: Render Navbar, content, and footer
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#171717]">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        <div key={currentPath} className="animate-fade-in-up">
          {renderContent()}
        </div>
      </main>

      {/* Institutional Editorial Footer */}
      <footer className="bg-white border-t border-[#EAE6DC] py-8 text-xs text-[#68655F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#171717]">Ekskul-Hub</span> — Sistem Informasi Ekstrakurikuler & Portofolio Siswa.
            <div className="text-[11px] mt-0.5">Dikembangkan untuk Satuan Pendidikan Indonesia. Berbasis Standar Kearsipan Nasional.</div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => navigate('/')} className="hover:text-[#234B36] cursor-pointer">Beranda</button>
            <button onClick={() => navigate('/ekskul')} className="hover:text-[#234B36] cursor-pointer">Katalog</button>
            <button onClick={() => navigate('/calendar')} className="hover:text-[#234B36] cursor-pointer">Kalender</button>
            <button onClick={() => navigate('/verify')} className="hover:text-[#234B36] cursor-pointer">Verifikasi Portofolio</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
