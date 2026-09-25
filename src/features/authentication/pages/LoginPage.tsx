import React, { useState } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/storage/mockDatabase';
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
} from 'lucide-react';
import { UserRole } from '@/types';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, currentPath }) => {
  const { login, register } = useAuth();
  const settings = db.getSettings();

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState<'login' | 'register'>(
    currentPath === '/register' ? 'register' : 'login'
  );

  // Form states for Login
  const [loginIdentifier, setLoginIdentifier] = useState('budi@smknusantara.sch.id');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Form states for Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status alerts
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
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

    const res = login(loginIdentifier, loginPassword);
    if (!res.success || !res.user) {
      setError(res.message || 'Kredensial login tidak valid. Pastikan nama/email dan password sudah tepat.');
      return;
    }

    // Role-based redirection to respective dashboard
    const user = res.user;
    switch (user.role) {
      case 'admin':
        onNavigate('/admin/dashboard');
        break;
      case 'student':
        onNavigate('/student/dashboard');
        break;
      case 'guru':
        onNavigate('/guru/dashboard');
        break;
      case 'pembina':
      case 'teacher':
        onNavigate('/pembina/dashboard');
        break;
      case 'pengurus':
        onNavigate('/pengurus/dashboard');
        break;
      default:
        onNavigate('/student/dashboard');
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setError('Silakan masukkan Nama Lengkap siswa.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Silakan masukkan alamat email yang valid.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Kata sandi harus minimal 6 karakter.');
      return;
    }

    const result = register(regName.trim(), regEmail.trim(), 'student', regPassword);
    if (!result.success) {
      setError(result.message);
      return;
    }

    // Prepare credentials for easy login
    setLoginIdentifier(regEmail.trim());
    setLoginPassword(regPassword);
    setSuccessMessage('Pendaftaran berhasil! Akun siswa Anda telah terdaftar. Silakan klik Masuk untuk menuju Dasbor Siswa.');
    setMode('login');

    // Reset register fields
    setRegName('');
    setRegEmail('');
    setRegPassword('');
  };

  const fillCredentials = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setLoginIdentifier('budi@smknusantara.sch.id');
      setLoginPassword('password123');
    } else {
      setLoginIdentifier('admin@smknusantara.sch.id');
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
          <ArrowLeft className="w-4 h-4 text-[#234B36]" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Brand & Page Header */}
        <div className="text-center">
          <div className="w-13 h-13 bg-[#234B36] text-white rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-xs">
            {mode === 'login' ? (
              <GraduationCap className="w-7 h-7 text-white" />
            ) : (
              <UserPlus className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2] text-[11px] font-bold uppercase tracking-wider mb-2">
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
          <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] rounded-lg flex items-start gap-2.5 text-xs text-[#234B36]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#234B36]" />
            <span className="font-medium leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] rounded-lg flex items-start gap-2.5 text-xs text-[#A33D35]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A33D35]" />
            <span className="font-medium leading-relaxed">{error}</span>
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
              placeholder="admin@smknusantara.sch.id atau nama/email siswa"
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
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2.5 shadow-xs"
              icon={<LogIn className="w-4 h-4" />}
            >
              Masuk
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
                className="font-bold text-[#234B36] hover:underline cursor-pointer ml-1"
              >
                Buat akun
              </button>
            </div>
          </form>
        ) : (
          /* Form View: REGISTER */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap Siswa"
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Contoh: Muhammad Farhan"
              required
            />

            <Input
              label="Email Siswa"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="Contoh: farhan@smknusantara.sch.id"
              required
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2.5 shadow-xs"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Daftar
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
                className="font-bold text-[#234B36] hover:underline cursor-pointer ml-1"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        )}



        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#68655F] pt-1">
          <Lock className="w-3 h-3 text-[#234B36]" />
          <span>Akses terenkripsi & diaudit untuk kepatuhan kearsipan sekolah.</span>
        </div>
      </div>
    </div>
  );
};
