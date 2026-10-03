import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/features/authentication/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageLoader } from '@/components/ui/PageLoader';

const HomePage = React.lazy(() => import('@/features/extracurriculars/pages/HomePage').then((m) => ({ default: m.HomePage })));
const CatalogPage = React.lazy(() => import('@/features/extracurriculars/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const DetailPage = React.lazy(() => import('@/features/extracurriculars/pages/DetailPage').then((m) => ({ default: m.DetailPage })));
const CalendarPage = React.lazy(() => import('@/features/school-events/pages/CalendarPage').then((m) => ({ default: m.CalendarPage })));
const CreateEventPage = React.lazy(() => import('@/features/school-events/pages/CreateEventPage').then((m) => ({ default: m.CreateEventPage })));
const VerificationPage = React.lazy(() => import('@/features/portfolios/pages/VerificationPage').then((m) => ({ default: m.VerificationPage })));
const LoginPage = React.lazy(() => import('@/features/authentication/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const StudentDashboardPage = React.lazy(() => import('@/features/portfolios/pages/StudentDashboardPage').then((m) => ({ default: m.StudentDashboardPage })));
const StudentAttendancePage = React.lazy(() => import('@/features/attendance/pages/StudentAttendancePage').then((m) => ({ default: m.StudentAttendancePage })));
const StudentPortfolioPage = React.lazy(() => import('@/features/portfolios/pages/StudentPortfolioPage').then((m) => ({ default: m.StudentPortfolioPage })));
const PengurusDashboardPage = React.lazy(() => import('@/features/extracurriculars/pages/PengurusDashboardPage').then((m) => ({ default: m.PengurusDashboardPage })));
const PengurusAttendancePage = React.lazy(() => import('@/features/attendance/pages/PengurusAttendancePage').then((m) => ({ default: m.PengurusAttendancePage })));
const TeacherDashboardPage = React.lazy(() => import('@/features/portfolios/pages/TeacherDashboardPage').then((m) => ({ default: m.TeacherDashboardPage })));
const PortfolioSamplePage = React.lazy(() => import('@/features/portfolios/pages/PortfolioSamplePage').then((m) => ({ default: m.PortfolioSamplePage })));
const AdminDashboardPage = React.lazy(() => import('@/features/portfolios/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const RegisterEkskulPage = React.lazy(() => import('@/features/extracurriculars/pages/RegisterEkskulPage').then((m) => ({ default: m.RegisterEkskulPage })));
const AdminFormEkskulPage = React.lazy(() => import('@/features/portfolios/pages/AdminFormEkskulPage').then((m) => ({ default: m.AdminFormEkskulPage })));
const ImportEventsPage = React.lazy(() => import('@/features/school-events/pages/ImportEventsPage').then((m) => ({ default: m.ImportEventsPage })));
const StudentUploadDocumentPage = React.lazy(() => import('@/features/portfolios/pages/StudentUploadDocumentPage').then((m) => ({ default: m.StudentUploadDocumentPage })));

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
    currentPath.startsWith('/pembina') ||
    currentPath.startsWith('/teacher') ||
    currentPath.startsWith('/admin');

  // Verify client-side route authorization
  const isUnauthorizedForDashboard =
    isAuthenticatedDashboardRoute &&
    (!currentUser ||
      (currentPath.startsWith('/student') && role !== 'student') ||
      (currentPath.startsWith('/pengurus') && role !== 'pengurus') ||
      ((currentPath.startsWith('/pembina') || currentPath.startsWith('/teacher')) &&
        !['pembina', 'teacher', 'pengurus'].includes(role)) ||
      (currentPath.startsWith('/admin') && role !== 'pengurus'));

  const renderContent = () => {
    // If not authenticated at all, redirect to login
    if (isAuthenticatedDashboardRoute && !currentUser) {
      return <LoginPage currentPath="/login" onNavigate={navigate} />;
    }

    // If authenticated user visits a dashboard not belonging to their role
    if (isAuthenticatedDashboardRoute && currentUser && isUnauthorizedForDashboard) {
      const getRoleLabel = (r: string) => {
        if (r === 'student') return 'Siswa';
        if (r === 'pembina' || r === 'teacher') return 'Guru Pembina';
        if (r === 'pengurus') return 'Pengurus (Monitoring)';
        return r;
      };

      const getTargetRoleLabel = (path: string) => {
        if (path.startsWith('/student')) return 'Siswa';
        if (path.startsWith('/pembina') || path.startsWith('/teacher')) return 'Guru Pembina';
        if (path.startsWith('/pengurus') || path.startsWith('/admin')) return 'Pengurus Monitoring';
        return 'Peran Khusus';
      };

      const myDashboardPath =
        role === 'student'
          ? '/student/dashboard'
          : role === 'pembina' || role === 'teacher'
          ? '/pembina/dashboard'
          : '/pengurus/dashboard';

      return (
        <div className="max-w-md w-full bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 bg-[#FDEDE9] text-[#D15B40] rounded-2xl flex items-center justify-center mx-auto shadow-2xs font-bold text-2xl">
            !
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
              Akses Dibatasi
            </span>
            <h2 className="text-xl font-bold text-[#171717] mt-2">Halaman Bukan Untuk Peran Anda</h2>
            <p className="text-xs text-[#68655F] mt-1.5 leading-relaxed">
              Anda sedang masuk sebagai <strong>{currentUser.name}</strong> ({getRoleLabel(role)}). Halaman ini khusus untuk peran <strong>{getTargetRoleLabel(currentPath)}</strong>.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => navigate(myDashboardPath)}
              className="w-full py-2.5 px-4 bg-[#D15B40] hover:bg-[#b84a32] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Buka Dasbor Saya ({getRoleLabel(role)})
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#F9F8F6] text-[#171717] rounded-xl text-xs font-semibold transition-all border border-[#EAE6DC] cursor-pointer"
            >
              Ke Halaman Utama
            </button>
          </div>
        </div>
      );
    }

    // 1. Ekstrakurikuler Registration: /ekskul/:slug/daftar
    const daftarMatch = currentPath.match(/^\/ekskul\/([^/]+)\/daftar$/);
    if (daftarMatch) {
      return <RegisterEkskulPage slug={daftarMatch[1]} onNavigate={navigate} />;
    }

    // 2. Detail route: /ekskul/:slug
    if (currentPath.startsWith('/ekskul/')) {
      const slug = currentPath.replace('/ekskul/', '');
      return <DetailPage slug={slug} onNavigate={navigate} />;
    }

    // 3. Verification route: /verify/:verificationId
    if (currentPath.startsWith('/verify')) {
      const id = currentPath.replace(/^\/verify\/?/, '').trim();
      return <VerificationPage verificationId={id} onNavigate={navigate} />;
    }

    // 4. Calendar Edit route: /calendar/edit/:id
    if (currentPath.startsWith('/calendar/edit/')) {
      const editId = currentPath.replace('/calendar/edit/', '');
      return <CreateEventPage onNavigate={navigate} editEventId={editId} />;
    }

    // 5. Admin & Pengurus Ekskul Edit route: /admin/ekskul/:id/edit or /pengurus/ekskul/:id/edit
    if (
      (currentPath.startsWith('/admin/ekskul/') || currentPath.startsWith('/pengurus/ekskul/')) &&
      currentPath.endsWith('/edit')
    ) {
      const parts = currentPath.split('/');
      const editId = parts[3];
      return <AdminFormEkskulPage onNavigate={navigate} editId={editId} />;
    }

    // 6. Exact matching routes
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
      case '/calendar/import':
        return <ImportEventsPage onNavigate={navigate} />;
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
      case '/student/documents/tambah':
        return <StudentUploadDocumentPage onNavigate={navigate} />;
      case '/student/portfolio':
        return <StudentDashboardPage onNavigate={navigate} initialTab="portfolio" />;

      // Pengurus Monitoring routes (Admin functionality transferred to Pengurus)
      case '/pengurus/dashboard':
      case '/pengurus':
      case '/pengurus/students':
      case '/pengurus/teachers':
      case '/pengurus/pembina':
      case '/pengurus/ekskul':
      case '/pengurus/schedule':
      case '/pengurus/verification':
      case '/pengurus/profile':
      case '/pengurus/members':
      case '/pengurus/registrations':
      case '/pengurus/activities':
      case '/pengurus/achievements':
        return <AdminDashboardPage currentPath={currentPath} onNavigate={navigate} />;
      case '/pengurus/ekskul/tambah':
        return <AdminFormEkskulPage onNavigate={navigate} />;

      // Unified Pembina & Teacher routes
      case '/pembina/dashboard':
      case '/pembina':
      case '/pembina/members':
      case '/pembina/extracurriculars':
      case '/pembina/attendance':
      case '/pembina/schedule':
      case '/pembina/achievements':
      case '/teacher/dashboard':
      case '/teacher':
      case '/teacher/extracurriculars':
      case '/teacher/attendance':
      case '/teacher/activities':
      case '/teacher/achievements':
        return <TeacherDashboardPage currentPath={currentPath} onNavigate={navigate} />;

      // Admin fallback routes (mapped to Pengurus Monitoring)
      case '/admin/dashboard':
      case '/admin':
      case '/admin/students':
      case '/admin/teachers':
      case '/admin/pembina':
      case '/admin/ekskul':
        return <AdminDashboardPage currentPath={currentPath} onNavigate={navigate} />;
      case '/admin/ekskul/tambah':
        return <AdminFormEkskulPage onNavigate={navigate} />;
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
          <React.Suspense fallback={<PageLoader />}>
            {renderContent()}
          </React.Suspense>
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
            <React.Suspense fallback={<PageLoader />}>
              {renderContent()}
            </React.Suspense>
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
          <React.Suspense fallback={<PageLoader />}>
            {renderContent()}
          </React.Suspense>
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
