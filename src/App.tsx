import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/features/authentication/providers/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageLoader } from '@/components/ui/PageLoader';
import { Logo } from '@/components/ui/Logo';
import { db } from '@/lib/database';
import { Menu, X } from 'lucide-react';

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
const AdminFormStudentPage = React.lazy(() => import('@/features/portfolios/pages/AdminFormStudentPage').then((m) => ({ default: m.AdminFormStudentPage })));
const AdminFormPembinaPage = React.lazy(() => import('@/features/portfolios/pages/AdminFormPembinaPage').then((m) => ({ default: m.AdminFormPembinaPage })));
const ImportEventsPage = React.lazy(() => import('@/features/school-events/pages/ImportEventsPage').then((m) => ({ default: m.ImportEventsPage })));
const StudentUploadDocumentPage = React.lazy(() => import('@/features/portfolios/pages/StudentUploadDocumentPage').then((m) => ({ default: m.StudentUploadDocumentPage })));
const OnboardingQuestionnairePage = React.lazy(() => import('@/features/extracurriculars/pages/OnboardingQuestionnairePage').then((m) => ({ default: m.OnboardingQuestionnairePage })));
const MonthlyReportPage = React.lazy(() => import('@/features/reports/pages/MonthlyReportPage').then((m) => ({ default: m.MonthlyReportPage })));

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser, role } = useAuth();
  const settings = db.getSettings();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setMobileSidebarOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPath = currentPath.split('?')[0];
  const searchString = currentPath.includes('?')
    ? currentPath.slice(currentPath.indexOf('?') + 1)
    : (typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '');
  const searchParams = new URLSearchParams(searchString);

  // Determine if current page is questionnaire onboarding
  const isOnboardingQuiz =
    cleanPath === '/student/onboarding-quiz' ||
    cleanPath === '/student/kuisioner' ||
    cleanPath === '/kuisioner';

  // Determine if current page is within authenticated dashboard layout
  const isAuthenticatedDashboardRoute =
    !isOnboardingQuiz &&
    (cleanPath.startsWith('/student') ||
      cleanPath.startsWith('/pengurus') ||
      cleanPath.startsWith('/pembina') ||
      cleanPath.startsWith('/teacher') ||
      cleanPath.startsWith('/admin'));

  // Verify client-side route authorization
  const isUnauthorizedForDashboard =
    isAuthenticatedDashboardRoute &&
    (!currentUser ||
      (cleanPath.startsWith('/student') && role !== 'student') ||
      (cleanPath.startsWith('/pengurus') && role !== 'pengurus') ||
      ((cleanPath.startsWith('/pembina') || cleanPath.startsWith('/teacher')) &&
        !['pembina', 'teacher', 'pengurus'].includes(role)) ||
      (cleanPath.startsWith('/admin') && role !== 'pengurus'));

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
    const daftarMatch = cleanPath.match(/^\/ekskul\/([^/]+)\/daftar$/);
    if (daftarMatch) {
      return <RegisterEkskulPage slug={daftarMatch[1]} onNavigate={navigate} />;
    }

    // 2. Detail route: /ekskul/:slug with contextual back navigation support
    if (cleanPath.startsWith('/ekskul/')) {
      const slug = cleanPath.replace('/ekskul/', '');
      return (
        <DetailPage
          slug={slug}
          onNavigate={navigate}
          fromPath={searchParams.get('from') || undefined}
        />
      );
    }

    // 3. Verification route: /verify/:verificationId
    if (cleanPath.startsWith('/verify')) {
      const id = cleanPath.replace(/^\/verify\/?/, '').trim();
      return <VerificationPage verificationId={id} onNavigate={navigate} />;
    }

    // 4. Calendar Edit route: /calendar/edit/:id
    if (cleanPath.startsWith('/calendar/edit/')) {
      const editId = cleanPath.replace('/calendar/edit/', '');
      return <CreateEventPage onNavigate={navigate} editEventId={editId} />;
    }

    // 5. Admin & Pengurus Ekskul Edit route: /admin/ekskul/:id/edit or /pengurus/ekskul/:id/edit
    if (
      (cleanPath.startsWith('/admin/ekskul/') || cleanPath.startsWith('/pengurus/ekskul/')) &&
      cleanPath.endsWith('/edit')
    ) {
      const parts = cleanPath.split('/');
      const editId = parts[3];
      return <AdminFormEkskulPage onNavigate={navigate} editId={editId} />;
    }

    // 5b. Admin & Pengurus Student Edit route: /admin/students/:id/edit or /pengurus/students/:id/edit
    if (
      (cleanPath.startsWith('/admin/students/') || cleanPath.startsWith('/pengurus/students/')) &&
      cleanPath.endsWith('/edit')
    ) {
      const parts = cleanPath.split('/');
      const editId = parts[3];
      return <AdminFormStudentPage onNavigate={navigate} editId={editId} />;
    }

    // 5c. Admin & Pengurus Pembina Edit route: /admin/pembina/:id/edit or /pengurus/pembina/:id/edit
    if (
      (cleanPath.startsWith('/admin/pembina/') || cleanPath.startsWith('/pengurus/pembina/')) &&
      cleanPath.endsWith('/edit')
    ) {
      const parts = cleanPath.split('/');
      const editId = parts[3];
      return <AdminFormPembinaPage onNavigate={navigate} editId={editId} />;
    }

    // 6. Exact matching routes
    switch (cleanPath) {
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
      case '/student/onboarding-quiz':
      case '/student/kuisioner':
      case '/kuisioner':
        return <OnboardingQuestionnairePage onNavigate={navigate} />;
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
      case '/pengurus/rekap':
      case '/admin/rekap':
        return <MonthlyReportPage onNavigate={navigate} overrideRole="pengurus" />;
      case '/pengurus/ekskul/tambah':
        return <AdminFormEkskulPage onNavigate={navigate} />;
      case '/pengurus/students/tambah':
        return <AdminFormStudentPage onNavigate={navigate} />;
      case '/pengurus/pembina/tambah':
      case '/pengurus/teachers/tambah':
        return <AdminFormPembinaPage onNavigate={navigate} />;
      case '/pengurus/schedule/create':
      case '/pengurus/schedule/tambah':
      case '/dashboard/pengurus/schedule/create':
      case '/admin/schedule/create':
        return <CreateEventPage onNavigate={navigate} returnPath="/pengurus/schedule" />;

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
      case '/pembina/rekap':
      case '/teacher/rekap':
        return <MonthlyReportPage onNavigate={navigate} overrideRole="pembina" />;

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
      case '/admin/students/tambah':
        return <AdminFormStudentPage onNavigate={navigate} />;
      case '/admin/pembina/tambah':
      case '/admin/teachers/tambah':
        return <AdminFormPembinaPage onNavigate={navigate} />;
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

  // If in dashboard: Render mobile header on < lg, responsive Sidebar, and full-height content
  if (isAuthenticatedDashboardRoute) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-[#F9F8F6] text-[#171717]">
        {/* Mobile Dashboard Header (< lg) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 h-16 flex items-center justify-between shadow-2xs transition-all duration-300">
          {/* Sisi Kiri: Tombol Hamburger Menu (icon button bersih + efek tekan responsif) & Logo EskulHub */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 active:scale-95 text-[#171717] flex items-center justify-center cursor-pointer select-none transition-all duration-200 shadow-2xs shrink-0"
              aria-label={mobileSidebarOpen ? "Tutup navigasi dasbor" : "Buka navigasi dasbor"}
              aria-expanded={mobileSidebarOpen}
            >
              <div className={`transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'rotate-90' : 'rotate-0'}`}>
                {mobileSidebarOpen ? (
                  <X className="w-5 h-5 text-[#D15B40] transition-transform duration-200" />
                ) : (
                  <Menu className="w-5 h-5 text-[#D15B40] transition-transform duration-200" />
                )}
              </div>
            </button>

            <Logo
              size="sm"
              withText
              hideSubtitleOnMobile={true}
              subtitle={settings.school_name}
              onClick={() => navigate('/')}
              title="Kembali ke Beranda"
            />
          </div>

          {/* Sisi Kanan: Profil User */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#F9F8F6] border border-slate-200/80 rounded-xl text-xs">
                <span className="w-6 h-6 rounded-lg bg-[#D15B40] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs">
                  {currentUser.name.charAt(0)}
                </span>
                <span className="font-bold text-[#171717] max-w-[85px] sm:max-w-[120px] truncate text-xs">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Sidebar Component (Handles both desktop sticky aside and mobile slide drawer) */}
        <Sidebar
          currentPath={currentPath}
          onNavigate={navigate}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto min-w-0 max-w-full">
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
      <footer className="bg-white border-t border-[#EAE6DC] py-6 sm:py-8 text-xs text-[#68655F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-[#171717]">Ekskul-Hub</span> — Sistem Informasi Ekstrakurikuler & Portofolio Siswa.
            <div className="text-[11px] text-[#8C887B]">Dikembangkan untuk Satuan Pendidikan Indonesia. Berbasis Standar Kearsipan Nasional.</div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-medium">
            <button onClick={() => navigate('/')} className="hover:text-[#D15B40] transition-colors cursor-pointer min-h-[36px] flex items-center">Beranda</button>
            <button onClick={() => navigate('/ekskul')} className="hover:text-[#D15B40] transition-colors cursor-pointer min-h-[36px] flex items-center">Katalog</button>
            <button onClick={() => navigate('/calendar')} className="hover:text-[#D15B40] transition-colors cursor-pointer min-h-[36px] flex items-center">Kalender</button>
            <button onClick={() => navigate('/verify')} className="hover:text-[#D15B40] transition-colors cursor-pointer min-h-[36px] flex items-center">Verifikasi Portofolio</button>
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
