import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/features/authentication/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { HomePage } from '@/features/extracurriculars/pages/HomePage';
import { CatalogPage } from '@/features/extracurriculars/pages/CatalogPage';
import { DetailPage } from '@/features/extracurriculars/pages/DetailPage';
import { CalendarPage } from '@/features/school-events/pages/CalendarPage';
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

  const renderContent = () => {
    // 1. Detail route: /ekskul/:slug
    if (currentPath.startsWith('/ekskul/')) {
      const slug = currentPath.replace('/ekskul/', '');
      return <DetailPage slug={slug} onNavigate={navigate} />;
    }

    // 2. Verification route: /verify/:verificationId
    if (currentPath.startsWith('/verify')) {
      const id = currentPath.replace('/verify/', '').replace('/verify', '') || 'EKH-2026-000184';
      return <VerificationPage verificationId={id} onNavigate={navigate} />;
    }

    // 3. Exact matching routes
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/ekskul':
        return <CatalogPage onNavigate={navigate} />;
      case '/calendar':
        return <CalendarPage onNavigate={navigate} />;
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

      // Pengurus routes
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

      // Teacher & Pembina routes
      case '/pembina/dashboard':
      case '/pembina':
      case '/teacher/dashboard':
      case '/teacher':
      case '/teacher/extracurriculars':
      case '/teacher/attendance':
      case '/teacher/activities':
      case '/teacher/achievements':
        return <TeacherDashboardPage currentPath={currentPath} onNavigate={navigate} />;

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

  // If in dashboard: Render ONLY Sidebar and full-height content (NO NAVBAR!)
  if (isAuthenticatedDashboardRoute) {
    return (
      <div className="min-h-screen flex bg-[#F9F8F6] text-[#171717]">
        <Sidebar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    );
  }

  // Dedicated Login / Register Screen: NO NAVBAR and NO FOOTER, centered vertically and horizontally
  if (currentPath === '/login' || currentPath === '/register') {
    return (
      <div className="min-h-screen bg-[#F9F8F6] text-[#171717] flex items-center justify-center p-4 sm:p-6">
        {renderContent()}
      </div>
    );
  }

  // If on public pages: Render Navbar, content, and footer
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#171717]">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {renderContent()}
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
            <button onClick={() => navigate('/verify/EKH-2026-000184')} className="hover:text-[#234B36] cursor-pointer">Cek QR</button>
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
