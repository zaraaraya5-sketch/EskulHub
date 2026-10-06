import React, { useState } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  GraduationCap,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Lock,
  KeyRound,
  UserPlus,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '@/types';
import { OnboardingQuestionnaireModal } from '@/features/extracurriculars/views/OnboardingQuestionnaireModal';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, currentPath }) => {
  const { currentUser, role, login, register, logout } = useAuth();
  const settings = db.getSettings();

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState<'login' | 'register'>(
    currentPath === '/register' ? 'register' : 'login'
  );

  // Sync mode if currentPath prop changes
  React.useEffect(() => {
    if (currentPath === '/register') {
      setMode('register');
    } else if (currentPath === '/login') {
      setMode('login');
    }
  }, [currentPath]);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Login
  const [loginIdentifier, setLoginIdentifier] = useState('budi@smkn1ciomas.sch.id');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Form states for Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status alerts
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Onboarding Questionnaire Popup Modal right after registration
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);
  const [registeredStudentInfo, setRegisteredStudentInfo] = useState<{ id: string; name: string } | null>(null);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setError('Silakan masukkan nama atau email akun Anda.');
      return;
    }
    if (!loginPassword.trim()) {
      setError('Silakan masukkan kata sandi (password).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (!res.success || !res.user) {
        setError(res.message || 'Kredensial login tidak valid. Pastikan nama/email dan password sudah tepat.');
        setIsSubmitting(false);
        return;
      }

      // Role-based redirection to respective dashboard
      const user = res.user;
      switch (user.role) {
        case 'student': {
          const isCompleted = localStorage.getItem(`ekskul_onboarding_completed_${user.id}`) === 'true';
          if (!isCompleted) {
            onNavigate('/student/kuisioner');
          } else {
            onNavigate('/student/dashboard');
          }
          break;
        }
        case 'pembina':
        case 'teacher':
          onNavigate('/pembina/dashboard');
          break;
        case 'pengurus':
        default:
          onNavigate('/pengurus/dashboard');
          break;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Terjadi kesalahan sistem saat masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPassword = regPassword.trim();

    if (!cleanName) {
      setError('Silakan masukkan Nama Lengkap siswa.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Silakan masukkan alamat email yang valid (contoh: siswa@smkn1ciomas.sch.id).');
      return;
    }
    if (cleanPassword.length < 6) {
      setError('Kata sandi harus minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(cleanName, cleanEmail, 'student', cleanPassword);
      if (!result.success || !result.user) {
        setError(result.message || 'Pendaftaran akun gagal. Silakan coba lagi.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke kuisioner peminatan...');
      
      // Direct immediate redirect to the questionnaire questions page!
      setTimeout(() => {
        onNavigate('/student/kuisioner');
      }, 250);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Terjadi gangguan jaringan atau server saat mendaftar.');
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (type: 'student' | 'pengurus' | 'pembina') => {
    if (type === 'student') {
      setLoginIdentifier('budi@smkn1ciomas.sch.id');
      setLoginPassword('password123');
    } else if (type === 'pengurus') {
      setLoginIdentifier('rizky@smkn1ciomas.sch.id');
      setLoginPassword('password123');
    } else if (type === 'pembina') {
      setLoginIdentifier('hendra@smkn1ciomas.sch.id');
      setLoginPassword('password123');
    }
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Top Back Navigation */}
      <div className="mb-5 flex justify-start">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#EAE6DC] rounded text-xs font-bold text-[#171717] hover:bg-[#F9F8F6] transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#D15B40]" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Brand & Page Header */}
        <div className="text-center">
          <div className="w-13 h-13 bg-[#D15B40] text-white rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-xs">
            {mode === 'login' ? (
              <GraduationCap className="w-7 h-7 text-white" />
            ) : (
              <UserPlus className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] text-[11px] font-bold uppercase tracking-wider mb-2">
            {mode === 'login' ? 'Portal Masuk Terpadu' : 'Registrasi Akun Baru'}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
            {mode === 'login' ? 'Masuk ke Ekskul-Hub' : 'Daftar Akun Siswa'}
          </h1>
          <p className="text-xs text-[#68655F] mt-1">
            {settings.school_name} • TA {settings.academic_year}
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-[#FDEDE9] border border-[#F2C9C0] rounded-lg flex items-start gap-2.5 text-xs text-[#D15B40]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#D15B40]" />
            <span className="font-medium leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-[#E8F4F5] border border-[#E8BAB5] rounded-lg flex items-start gap-2.5 text-xs text-[#A33D35]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A33D35]" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Active Session Notice (Only shown on Login mode to avoid blocking register) */}
        {currentUser && mode === 'login' && (
          <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl space-y-2.5 text-center">
            <div className="text-xs text-[#525049]">
              Saat ini Anda sedang masuk sebagai <strong className="text-[#171717]">{currentUser.name}</strong> (
              <span className="font-semibold text-[#D15B40] uppercase">{role}</span>)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const pathMap: Record<string, string> = {
                    student: '/student/dashboard',
                    pembina: '/pembina/dashboard',
                    teacher: '/pembina/dashboard',
                    pengurus: '/pengurus/dashboard',
                  };
                  onNavigate(pathMap[role] || '/student/dashboard');
                }}
                className="w-full text-xs font-bold"
              >
                Buka Dasbor Saya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  setError('');
                  setSuccessMessage('Sesi sebelumnya telah diakhiri. Silakan masuk dengan akun lain.');
                }}
                className="text-xs shrink-0"
              >
                Ganti Akun
              </Button>
            </div>
          </div>
        )}

        {/* Form View: LOGIN */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap / Email"
              type="text"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="admin@smkn1ciomas.sch.id atau nama/email siswa"
              required
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2.5 shadow-xs"
              icon={<LogIn className="w-4 h-4" />}
            >
              {isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk'}
            </Button>

            {/* Toggle to Register */}
            <div className="text-center pt-2 text-xs text-[#68655F]">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setSuccessMessage('');
                }}
                className="font-bold text-[#D15B40] hover:underline cursor-pointer ml-1"
              >
                Buat akun
              </button>
            </div>
          </form>
        ) : (
          /* Form View: REGISTER */
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
            <Input
              label="Nama Lengkap Siswa"
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Contoh: Muhammad Farhan"
              disabled={isSubmitting}
              required
            />

            <Input
              label="Email Siswa"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="Contoh: farhan@smkn1ciomas.sch.id"
              disabled={isSubmitting}
              required
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={isSubmitting}
              required
            />

            {/* Inline Error Alert if registration fails */}
            {error && (
              <div className="p-3 bg-[#FDEDE9] border border-[#F2C9C0] rounded-xl flex items-start gap-2.5 text-xs text-[#A33D35] animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D15B40]" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2.5 shadow-xs"
              icon={<UserPlus className="w-4 h-4" />}
            >
              {isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar Akun Siswa'}
            </Button>

            {/* Toggle to Login */}
            <div className="text-center pt-2 text-xs text-[#68655F]">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="font-bold text-[#D15B40] hover:underline cursor-pointer ml-1"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        )}

        {/* Demo Accounts Quick-Select (Only on Login mode) */}
        {mode === 'login' && (
          <div className="pt-4 border-t border-[#EAE6DC] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#68655F] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D15B40]" />
                Akun Demo Pengujian
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="p-3 text-left border border-[#EAE6DC] rounded-xl bg-[#F9F8F6] hover:bg-white hover:border-[#D15B40]/40 hover:shadow-xs active:scale-[0.97] transition-all duration-200 ease-out cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D15B40]">
                  <GraduationCap className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Akun Siswa</span>
                </div>
                <div className="text-[11px] text-[#171717] font-semibold mt-1 truncate">Budi Pratama</div>
                <div className="text-[10px] text-[#68655F] truncate">budi@smkn1ciomas...</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('pembina')}
                className="p-3 text-left border border-[#EAE6DC] rounded-xl bg-[#F9F8F6] hover:bg-white hover:border-[#3B7A82]/40 hover:shadow-xs active:scale-[0.97] transition-all duration-200 ease-out cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#3B7A82]">
                  <BookOpen className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Akun Pembina</span>
                </div>
                <div className="text-[11px] text-[#171717] font-semibold mt-1 truncate">Hendra Wijaya, S.Pd.</div>
                <div className="text-[10px] text-[#68655F] truncate">hendra@smkn1ciomas...</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('pengurus')}
                className="p-3 text-left border border-[#EAE6DC] rounded-xl bg-[#F9F8F6] hover:bg-white hover:border-[#2A2926]/40 hover:shadow-xs active:scale-[0.97] transition-all duration-200 ease-out cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2A2926]">
                  <ShieldCheck className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Akun Pengurus</span>
                </div>
                <div className="text-[11px] text-[#171717] font-semibold mt-1 truncate">Rizky (Monitoring)</div>
                <div className="text-[10px] text-[#68655F] truncate">rizky@smkn1ciomas...</div>
              </button>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#68655F] pt-1">
          <Lock className="w-3 h-3 text-[#D15B40]" />
          <span>Akses terenkripsi & diaudit untuk kepatuhan kearsipan sekolah.</span>
        </div>
      </div>

      {/* Onboarding Questionnaire Popup Modal */}
      <OnboardingQuestionnaireModal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => setIsQuestionnaireModalOpen(false)}
        onNavigate={onNavigate}
        studentName={registeredStudentInfo?.name || currentUser?.name}
        studentId={registeredStudentInfo?.id || currentUser?.id}
      />
    </div>
  );
};
