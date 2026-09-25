import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  Users,
  BookOpen,
  Calendar,
  ShieldCheck,
  Trophy,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  UserCheck,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  QrCode,
  School,
  Check,
  X,
  AlertTriangle,
  FileText,
  UserMinus,
  Camera,
  UserCog,
  Upload,
} from 'lucide-react';
import { User, UserRole, Extracurricular, SchoolEvent, PortfolioVerification } from '@/types';

interface AdminDashboardPageProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
}

type AdminSection = 'dashboard' | 'students' | 'teachers' | 'pembina' | 'ekskul' | 'schedule' | 'verification' | 'profile';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, updateProfile } = useAuth();
  const settings = db.getSettings();

  // Determine current active section based on currentPath
  const getSectionFromPath = (path?: string): AdminSection => {
    if (!path) return 'dashboard';
    if (path.includes('/students')) return 'students';
    if (path.includes('/teachers')) return 'teachers';
    if (path.includes('/pembina')) return 'pembina';
    if (path.includes('/ekskul')) return 'ekskul';
    if (path.includes('/schedule') || path.includes('/events')) return 'schedule';
    if (path.includes('/verification')) return 'verification';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeSection = getSectionFromPath(currentPath);

  const switchSection = (section: AdminSection) => {
    const pathMap: Record<AdminSection, string> = {
      dashboard: '/admin/dashboard',
      students: '/admin/students',
      teachers: '/admin/teachers',
      pembina: '/admin/pembina',
      ekskul: '/admin/ekskul',
      schedule: '/admin/schedule',
      verification: '/admin/verification',
      profile: '/admin/profile',
    };
    onNavigate(pathMap[section]);
  };

  // Live state
  const [users, setUsers] = useState<User[]>(() => db.getUsers());
  const [ekskuls, setEkskuls] = useState<Extracurricular[]>(() => db.getExtracurriculars());
  const [events, setEvents] = useState<SchoolEvent[]>(() => db.getSchoolEvents());
  const [verifications, setVerifications] = useState<PortfolioVerification[]>(() => db.getVerifications());
  const [registrations, setRegistrations] = useState(() => db.getRegistrations());
  const [members] = useState(() => db.getMembers());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // ==========================================
  // MODALS STATE: USER (ADD / EDIT / DELETE)
  // ==========================================
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserTargetRole, setAddUserTargetRole] = useState<UserRole>('student');
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userPhoneInput, setUserPhoneInput] = useState('');

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('student');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserStatus, setEditUserStatus] = useState<boolean>(true);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openAddUserModal = (defaultRole: UserRole) => {
    setAddUserTargetRole(defaultRole);
    setUserNameInput('');
    setUserEmailInput('');
    setUserPhoneInput('');
    setIsAddUserModalOpen(true);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim() || !userEmailInput.trim()) {
      showNotification('error', 'Nama dan email wajib diisi.');
      return;
    }

    const res = db.addUser({
      name: userNameInput.trim(),
      email: userEmailInput.trim(),
      role: addUserTargetRole,
      phone: userPhoneInput.trim(),
      is_active: true,
    });

    if (res.success) {
      setUsers([...db.getUsers()]);
      setIsAddUserModalOpen(false);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserPhone(user.phone || '');
    setEditUserStatus(user.is_active);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const res = db.updateUser(editingUser.id, {
      name: editUserName.trim(),
      email: editUserEmail.trim(),
      role: editUserRole,
      phone: editUserPhone.trim(),
      is_active: editUserStatus,
    });

    if (res.success) {
      setUsers([...db.getUsers()]);
      setEditingUser(null);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    const res = db.deleteUser(userToDelete.id);
    if (res.success) {
      setUsers([...db.getUsers()]);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
    setUserToDelete(null);
  };

  // ==========================================
  // MODALS STATE: EKSTRAKURIKULER
  // ==========================================
  const [isAddEkskulModalOpen, setIsAddEkskulModalOpen] = useState(false);
  const [ekskulName, setEkskulName] = useState('');
  const [ekskulCategory, setEkskulCategory] = useState<Extracurricular['category']>('Olahraga');
  const [ekskulSupervisor, setEkskulSupervisor] = useState('');
  const [ekskulChairperson, setEkskulChairperson] = useState('');
  const [ekskulCapacity, setEkskulCapacity] = useState(30);
  const [ekskulSchedule, setEkskulSchedule] = useState('');
  const [ekskulLocation, setEkskulLocation] = useState('');
  const [ekskulDesc, setEkskulDesc] = useState('');

  const [editingEkskul, setEditingEkskul] = useState<Extracurricular | null>(null);
  const [ekskulToDelete, setEkskulToDelete] = useState<Extracurricular | null>(null);

  const handleAddEkskulSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ekskulName.trim() || !ekskulSupervisor.trim()) {
      showNotification('error', 'Nama ekskul dan guru pembina wajib diisi.');
      return;
    }

    const res = db.addExtracurricular({
      name: ekskulName.trim(),
      category: ekskulCategory,
      supervisor_name: ekskulSupervisor.trim(),
      chairperson_name: ekskulChairperson.trim() || 'Siswa Terpilih',
      member_capacity: Number(ekskulCapacity) || 25,
      practice_schedule: ekskulSchedule.trim() || 'Setiap Jumat (15:30 - 17:00 WIB)',
      location: ekskulLocation.trim() || 'Kampus Utama',
      short_description: ekskulDesc.trim() || 'Program pembinaan bakat dan minat siswa.',
      full_description: ekskulDesc.trim() || 'Program pembinaan ekstrakurikuler resmi SMK Nusantara Digital.',
      profile_image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      registration_status: 'open',
    });

    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      setIsAddEkskulModalOpen(false);
      setEkskulName('');
      setEkskulSupervisor('');
      setEkskulChairperson('');
      setEkskulSchedule('');
      setEkskulLocation('');
      setEkskulDesc('');
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const openEditEkskulModal = (item: Extracurricular) => {
    setEditingEkskul(item);
    setEkskulName(item.name);
    setEkskulCategory(item.category);
    setEkskulSupervisor(item.supervisor_name);
    setEkskulChairperson(item.chairperson_name);
    setEkskulCapacity(item.member_capacity);
    setEkskulSchedule(item.practice_schedule);
    setEkskulLocation(item.location);
    setEkskulDesc(item.short_description);
  };

  const handleEditEkskulSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEkskul) return;

    const res = db.updateExtracurricular(editingEkskul.id, {
      name: ekskulName.trim(),
      category: ekskulCategory,
      supervisor_name: ekskulSupervisor.trim(),
      chairperson_name: ekskulChairperson.trim(),
      member_capacity: Number(ekskulCapacity),
      practice_schedule: ekskulSchedule.trim(),
      location: ekskulLocation.trim(),
      short_description: ekskulDesc.trim(),
    });

    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      setEditingEkskul(null);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const toggleEkskulStatus = (item: Extracurricular) => {
    const newStatus = item.registration_status === 'open' ? 'closed' : 'open';
    const res = db.updateExtracurricular(item.id, { registration_status: newStatus });
    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', `Status pendaftaran ${item.name} berhasil diubah ke: ${newStatus === 'open' ? 'Dibuka' : 'Ditutup'}`);
    }
  };

  const confirmDeleteEkskul = () => {
    if (!ekskulToDelete) return;
    const res = db.deleteExtracurricular(ekskulToDelete.id);
    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
    setEkskulToDelete(null);
  };

  // ==========================================
  // MODALS STATE: SCHEDULE / EVENT
  // ==========================================
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'practice' | 'competition' | 'ceremony' | 'exhibition'>('practice');
  const [eventLocation, setEventLocation] = useState('Lapangan Basket');
  const [eventStart, setEventStart] = useState('2026-10-02T15:30');
  const [eventEnd, setEventEnd] = useState('2026-10-02T17:30');
  const [eventOrganizer, setEventOrganizer] = useState('PMR Wira');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const checkConflictOnTimeChange = (loc: string, start: string, end: string) => {
    if (!start || !end) return;
    const check = db.checkEventConflict(loc, start, end);
    if (check.hasConflict && check.conflictingEvent) {
      setConflictWarning(`Peringatan: Lokasi "${loc}" telah terpakai oleh "${check.conflictingEvent.title}" (${check.conflictingEvent.start_datetime.substring(11, 16)} - ${check.conflictingEvent.end_datetime.substring(11, 16)})!`);
    } else {
      setConflictWarning(null);
    }
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showNotification('error', 'Judul kegiatan wajib diisi.');
      return;
    }

    const res = db.addSchoolEvent({
      title: eventTitle.trim(),
      category: eventCategory,
      location: eventLocation,
      start_datetime: eventStart,
      end_datetime: eventEnd,
      organizer: eventOrganizer,
      description: `Sesi latihan & agenda resmi ${eventOrganizer}`,
      status: 'scheduled',
    });

    if (res.success) {
      setEvents([...db.getSchoolEvents()]);
      setIsAddEventModalOpen(false);
      setEventTitle('');
      setConflictWarning(null);
      showNotification('success', 'Agenda jadwal latihan berhasil ditambahkan!');
    } else {
      showNotification('error', res.message);
    }
  };

  const handleDeleteEvent = (id: string) => {
    const res = db.deleteSchoolEvent(id);
    if (res.success) {
      setEvents([...db.getSchoolEvents()]);
      showNotification('success', res.message);
    }
  };

  // ==========================================
  // REGISTRATION & QR AUDIT ACTIONS
  // ==========================================
  const handleApproveRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'approved', 'Drs. Bambang Suryono');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', 'Pendaftaran siswa berhasil disetujui!');
    }
  };

  const handleRejectRegistration = (regId: string) => {
    const res = db.updateRegistrationStatus(regId, 'rejected', 'Drs. Bambang Suryono');
    if (res.success) {
      setRegistrations([...db.getRegistrations()]);
      showNotification('success', 'Pendaftaran siswa ditolak.');
    }
  };

  const toggleVerificationStatus = (verificationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'valid' ? 'revoked' : 'valid';
    const res = db.updateVerificationStatus(verificationId, newStatus as any);
    if (res.success) {
      setVerifications([...db.getVerifications()]);
      showNotification('success', res.message);
    }
  };

  // ==========================================
  // PROFILE STATE & HANDLERS
  // ==========================================
  const [profileName, setProfileName] = useState(currentUser?.name || 'Drs. Bambang Suryono');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'admin@smknusantara.sch.id');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '081298765432');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showNotification('error', 'Ukuran foto maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileAvatar(reader.result);
        showNotification('success', 'Foto baru berhasil dimuat. Klik "Simpan Perubahan Profil" di bawah.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      showNotification('error', 'Nama dan email wajib diisi.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showNotification('error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar_url: profileAvatar,
    });

    if (res.success) {
      setUsers([...db.getUsers()]);
      setNewPassword('');
      setConfirmPassword('');
      showNotification('success', 'Profil dan foto akun Admin berhasil disimpan!');
    } else {
      showNotification('error', res.message);
    }
  };

  // Data subsets
  const studentsList = users.filter((u) => u.role === 'student');
  const teachersList = users.filter((u) => u.role === 'guru');
  const pembinaList = users.filter((u) => u.role === 'pembina' || u.role === 'teacher');

  const filteredStudents = studentsList.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTeachers = teachersList.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPembina = pembinaList.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEkskuls = ekskuls.filter(
    (e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.supervisor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Page Title */}
      <div className="border-b border-[#D8D4CC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#234B36] flex items-center gap-1.5 mb-1">
            <School className="w-3.5 h-3.5" />
            <span>Pusat Kendali Administrasi Kesiswaan • {settings.school_name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            {activeSection === 'dashboard' && 'Ringkasan Dasbor Kesiswaan'}
            {activeSection === 'students' && 'Kelola Data Siswa'}
            {activeSection === 'teachers' && 'Kelola Guru & Wali Kelas'}
            {activeSection === 'pembina' && 'Kelola Guru Pembina Ekstrakurikuler'}
            {activeSection === 'ekskul' && 'Master Data Ekstrakurikuler'}
            {activeSection === 'schedule' && 'Jadwal Latihan & Kalender Kegiatan'}
            {activeSection === 'verification' && 'Audit Verifikasi QR & Portofolio Sah'}
            {activeSection === 'profile' && 'Kelola Profil & Foto Administrator'}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">
            Admin: <strong>{settings.vice_principal_student_affairs}</strong> • Tahun Ajaran {settings.academic_year}
          </p>
        </div>

        {/* Action Header Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSection === 'students' && (
            <Button variant="primary" size="sm" onClick={() => openAddUserModal('student')} icon={<Plus className="w-3.5 h-3.5" />}>
              Tambah Siswa Baru
            </Button>
          )}
          {activeSection === 'teachers' && (
            <Button variant="primary" size="sm" onClick={() => openAddUserModal('guru')} icon={<Plus className="w-3.5 h-3.5" />}>
              Tambah Guru Baru
            </Button>
          )}
          {activeSection === 'pembina' && (
            <Button variant="primary" size="sm" onClick={() => openAddUserModal('pembina')} icon={<Plus className="w-3.5 h-3.5" />}>
              Tambah Pembina Baru
            </Button>
          )}
          {activeSection === 'ekskul' && (
            <Button variant="primary" size="sm" onClick={() => setIsAddEkskulModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Tambah Ekskul Baru
            </Button>
          )}
          {activeSection === 'schedule' && (
            <Button variant="primary" size="sm" onClick={() => setIsAddEventModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Jadwalkan Latihan Baru
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onNavigate('/')} icon={<ExternalLink className="w-3.5 h-3.5" />}>
            Halaman Publik
          </Button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 border shadow-xs transition-all ${
            notification.type === 'success' ? 'bg-[#E7EFEA] border-[#B7D2C2] text-[#234B36]' : 'bg-[#F9ECEB] border-[#E8BAB5] text-[#A33D35]'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: DASHBOARD UTAMA */}
      {/* ========================================================================= */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div
              onClick={() => switchSection('students')}
              className="bg-white border border-[#D8D4CC] rounded-lg p-4 cursor-pointer hover:border-[#234B36] transition-colors group"
            >
              <div className="flex items-center justify-between text-[#68655F] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Siswa</span>
                <GraduationCap className="w-4 h-4 text-[#234B36]" />
              </div>
              <div className="text-2xl font-bold text-[#171717] group-hover:text-[#234B36]">{studentsList.length}</div>
              <div className="text-[11px] text-[#234B36] font-semibold mt-0.5">Kelola Siswa →</div>
            </div>

            <div
              onClick={() => switchSection('teachers')}
              className="bg-white border border-[#D8D4CC] rounded-lg p-4 cursor-pointer hover:border-[#8C6819] transition-colors group"
            >
              <div className="flex items-center justify-between text-[#68655F] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Guru Wali Kelas</span>
                <Users className="w-4 h-4 text-[#8C6819]" />
              </div>
              <div className="text-2xl font-bold text-[#171717] group-hover:text-[#8C6819]">{teachersList.length}</div>
              <div className="text-[11px] text-[#8C6819] font-semibold mt-0.5">Kelola Guru →</div>
            </div>

            <div
              onClick={() => switchSection('pembina')}
              className="bg-white border border-[#D8D4CC] rounded-lg p-4 cursor-pointer hover:border-[#B84A3A] transition-colors group"
            >
              <div className="flex items-center justify-between text-[#68655F] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Guru Pembina</span>
                <UserCheck className="w-4 h-4 text-[#B84A3A]" />
              </div>
              <div className="text-2xl font-bold text-[#171717] group-hover:text-[#B84A3A]">{pembinaList.length}</div>
              <div className="text-[11px] text-[#B84A3A] font-semibold mt-0.5">Kelola Pembina →</div>
            </div>

            <div
              onClick={() => switchSection('ekskul')}
              className="bg-white border border-[#D8D4CC] rounded-lg p-4 cursor-pointer hover:border-[#234B36] transition-colors group"
            >
              <div className="flex items-center justify-between text-[#68655F] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Ekstrakurikuler</span>
                <BookOpen className="w-4 h-4 text-[#234B36]" />
              </div>
              <div className="text-2xl font-bold text-[#171717] group-hover:text-[#234B36]">{ekskuls.length}</div>
              <div className="text-[11px] text-[#234B36] font-semibold mt-0.5">Master Ekskul →</div>
            </div>

            <div
              onClick={() => switchSection('verification')}
              className="bg-white border border-[#D8D4CC] rounded-lg p-4 cursor-pointer hover:border-[#262522] transition-colors group col-span-2 lg:col-span-1"
            >
              <div className="flex items-center justify-between text-[#68655F] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Portofolio QR</span>
                <ShieldCheck className="w-4 h-4 text-[#262522]" />
              </div>
              <div className="text-2xl font-bold text-[#171717]">{verifications.length} Sah</div>
              <div className="text-[11px] text-[#262522] font-semibold mt-0.5">Audit Dokumen →</div>
            </div>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="bg-[#F5F2EA] border border-[#D8D4CC] rounded-lg p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-3">
              Aksi Cepat Administrator
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="outline" size="sm" onClick={() => openAddUserModal('student')} icon={<GraduationCap className="w-3.5 h-3.5" />}>
                + Siswa Baru
              </Button>
              <Button variant="outline" size="sm" onClick={() => openAddUserModal('guru')} icon={<Users className="w-3.5 h-3.5" />}>
                + Guru Baru
              </Button>
              <Button variant="outline" size="sm" onClick={() => openAddUserModal('pembina')} icon={<UserCheck className="w-3.5 h-3.5" />}>
                + Pembina Baru
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAddEkskulModalOpen(true)} icon={<BookOpen className="w-3.5 h-3.5" />}>
                + Ekstrakurikuler Baru
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAddEventModalOpen(true)} icon={<Calendar className="w-3.5 h-3.5" />}>
                + Jadwal Latihan
              </Button>
              <Button variant="outline" size="sm" onClick={() => switchSection('verification')} icon={<QrCode className="w-3.5 h-3.5" />}>
                Audit QR Portofolio
              </Button>
            </div>
          </div>

          {/* Pending Registrations Table */}
          <div className="bg-white border border-[#D8D4CC] rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D4CC] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Pendaftaran Ekskul Siswa yang Masuk</h3>
                <p className="text-xs text-[#68655F]">Verifikasi langsung persetujuan kuota masuk ekskul.</p>
              </div>
              <Badge variant="neutral">{registrations.filter((r) => r.status === 'pending').length} Menunggu</Badge>
            </div>

            {registrations.length === 0 ? (
              <p className="text-xs text-[#68655F]">Belum ada data pendaftaran.</p>
            ) : (
              <div className="divide-y divide-[#D8D4CC]">
                {registrations.slice(0, 5).map((reg) => (
                  <div key={reg.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-[#171717]">{reg.student_name} ({reg.student_class})</div>
                      <div className="text-[11px] text-[#68655F]">
                        Mendaftar ke: <strong className="text-[#234B36]">{reg.extracurricular_name}</strong> • Alasan: &quot;{reg.reason}&quot;
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {reg.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveRegistration(reg.id)}
                            className="px-2.5 py-1 bg-[#234B36] text-white rounded font-bold hover:bg-[#1a3828] cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleRejectRegistration(reg.id)}
                            className="px-2.5 py-1 bg-white border border-[#D8D4CC] text-[#A33D35] hover:bg-[#F9ECEB] rounded font-bold cursor-pointer"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <Badge variant={reg.status === 'approved' ? 'success' : 'danger'}>
                          {reg.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </Badge>
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
      {/* SECTION 2: KELOLA SISWA */}
      {/* ========================================================================= */}
      {activeSection === 'students' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Daftar Seluruh Siswa Terdaftar</h2>
              <p className="text-xs text-[#68655F]">Kelola akun siswa, pantau status keaktifan, dan data kontak.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]" />
                <input
                  type="text"
                  placeholder="Cari siswa atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F5F2EA]/50 border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                />
              </div>
              <Button variant="primary" size="sm" onClick={() => openAddUserModal('student')} icon={<Plus className="w-3.5 h-3.5" />}>
                Tambah Siswa
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D8D4CC] bg-[#F5F2EA]/60 text-[#68655F]">
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Nama Lengkap</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Email Akun</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">No. Telepon / WA</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Status Akun</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D4CC]">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#F5F2EA]/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#171717] flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#E7EFEA] text-[#234B36] font-bold flex items-center justify-center text-xs">
                        {st.name.substring(0, 1)}
                      </div>
                      <span>{st.name}</span>
                    </td>
                    <td className="py-3 px-3 text-[#68655F] font-mono">{st.email}</td>
                    <td className="py-3 px-3 text-[#171717]">{st.phone || '-'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${st.is_active ? 'bg-[#E7EFEA] text-[#234B36]' : 'bg-[#F9ECEB] text-[#A33D35]'}`}>
                        {st.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditUserModal(st)}
                          className="p-1.5 text-[#68655F] hover:text-[#234B36] hover:bg-[#F5F2EA] rounded cursor-pointer transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(st)}
                          className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded cursor-pointer transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: KELOLA GURU */}
      {/* ========================================================================= */}
      {activeSection === 'teachers' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Daftar Guru & Wali Kelas</h2>
              <p className="text-xs text-[#68655F]">Guru berwenang memvalidasi raport, leger capaian, dan memantau siswa binaan kelas.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]" />
                <input
                  type="text"
                  placeholder="Cari guru..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F5F2EA]/50 border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#8C6819]"
                />
              </div>
              <Button variant="primary" size="sm" onClick={() => openAddUserModal('guru')} icon={<Plus className="w-3.5 h-3.5" />}>
                Tambah Guru
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D8D4CC] bg-[#F5F2EA]/60 text-[#68655F]">
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Nama Guru</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Email Institusi</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Telepon / WhatsApp</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D4CC]">
                {filteredTeachers.map((tc) => (
                  <tr key={tc.id} className="hover:bg-[#F5F2EA]/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#171717] flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#F9F4E5] text-[#8C6819] font-bold flex items-center justify-center text-xs">
                        {tc.name.substring(0, 1)}
                      </div>
                      <span>{tc.name}</span>
                    </td>
                    <td className="py-3 px-3 text-[#68655F] font-mono">{tc.email}</td>
                    <td className="py-3 px-3 text-[#171717]">{tc.phone || '-'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tc.is_active ? 'bg-[#F9F4E5] text-[#8C6819]' : 'bg-[#F9ECEB] text-[#A33D35]'}`}>
                        {tc.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditUserModal(tc)}
                          className="p-1.5 text-[#68655F] hover:text-[#8C6819] hover:bg-[#F5F2EA] rounded cursor-pointer transition-colors"
                          title="Edit Guru"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(tc)}
                          className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded cursor-pointer transition-colors"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: KELOLA PEMBINA */}
      {/* ========================================================================= */}
      {activeSection === 'pembina' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Daftar Guru Pembina Ekstrakurikuler</h2>
              <p className="text-xs text-[#68655F]">Guru pembina memvalidasi presensi latihan, kegiatan mingguan, dan pengajuan sertifikat kejuaraan.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]" />
                <input
                  type="text"
                  placeholder="Cari pembina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F5F2EA]/50 border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#B84A3A]"
                />
              </div>
              <Button variant="primary" size="sm" onClick={() => openAddUserModal('pembina')} icon={<Plus className="w-3.5 h-3.5" />}>
                Tambah Pembina
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D8D4CC] bg-[#F5F2EA]/60 text-[#68655F]">
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Nama Pembina</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Email Institusi</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Ekskul yang Dibina</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D4CC]">
                {filteredPembina.map((pb) => {
                  const assignedEkskul = ekskuls.filter((e) => e.supervisor_name.toLowerCase().includes(pb.name.toLowerCase()));
                  return (
                    <tr key={pb.id} className="hover:bg-[#F5F2EA]/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#171717] flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#F9ECEB] text-[#B84A3A] font-bold flex items-center justify-center text-xs">
                          {pb.name.substring(0, 1)}
                        </div>
                        <span>{pb.name}</span>
                      </td>
                      <td className="py-3 px-3 text-[#68655F] font-mono">{pb.email}</td>
                      <td className="py-3 px-3">
                        {assignedEkskul.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assignedEkskul.map((e) => (
                              <Badge key={e.id} variant="neutral">{e.name}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#68655F] italic">Belum ditugaskan</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pb.is_active ? 'bg-[#F9ECEB] text-[#B84A3A]' : 'bg-[#F5F2EA] text-[#68655F]'}`}>
                          {pb.is_active ? 'Aktif Membina' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditUserModal(pb)}
                            className="p-1.5 text-[#68655F] hover:text-[#B84A3A] hover:bg-[#F5F2EA] rounded cursor-pointer transition-colors"
                            title="Edit Pembina"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(pb)}
                            className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded cursor-pointer transition-colors"
                            title="Hapus Pembina"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: KELOLA EKSTRAKURIKULER */}
      {/* ========================================================================= */}
      {activeSection === 'ekskul' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Master Data Ekstrakurikuler Resmi</h2>
              <p className="text-xs text-[#68655F]">Atur kuota daya tampung, jadwal rutin, penugasan guru pembina, dan status pendaftaran.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]" />
                <input
                  type="text"
                  placeholder="Cari ekskul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F5F2EA]/50 border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
                />
              </div>
              <Button variant="primary" size="sm" onClick={() => setIsAddEkskulModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
                Tambah Ekskul Baru
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEkskuls.map((ekskul) => (
              <div
                key={ekskul.id}
                className="border border-[#D8D4CC] rounded-lg p-4 bg-[#F5F2EA]/20 flex flex-col justify-between hover:border-[#234B36] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-[#171717]">{ekskul.name}</h3>
                    <Badge variant="neutral">{ekskul.category}</Badge>
                  </div>
                  <p className="text-xs text-[#68655F] line-clamp-2 mb-3 leading-relaxed">
                    {ekskul.short_description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#68655F] border-t border-[#D8D4CC]/70 pt-2.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span>Pembina:</span>
                      <strong className="text-[#171717]">{ekskul.supervisor_name}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ketua Siswa:</span>
                      <span className="text-[#171717]">{ekskul.chairperson_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jadwal Latihan:</span>
                      <span className="text-[#171717] truncate max-w-[140px]">{ekskul.practice_schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kapasitas:</span>
                      <span className="font-bold text-[#234B36]">
                        {ekskul.current_member_count} / {ekskul.member_capacity} Siswa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D8D4CC]/70 flex items-center justify-between">
                  <button
                    onClick={() => toggleEkskulStatus(ekskul)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      ekskul.registration_status === 'open'
                        ? 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#d5e7dc]'
                        : 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#f3d9d7]'
                    }`}
                  >
                    {ekskul.registration_status === 'open' ? 'Pendaftaran Buka' : 'Pendaftaran Tutup'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditEkskulModal(ekskul)}
                      className="p-1 text-[#68655F] hover:text-[#234B36] hover:bg-white rounded cursor-pointer"
                      title="Edit Ekskul"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEkskulToDelete(ekskul)}
                      className="p-1 text-[#68655F] hover:text-[#A33D35] hover:bg-white rounded cursor-pointer"
                      title="Hapus Ekskul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate(`/ekskul/${ekskul.slug}`)}
                      className="p-1 text-[#68655F] hover:text-[#234B36] hover:bg-white rounded cursor-pointer"
                      title="Lihat Publik"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: JADWAL & KALENDER LATIHAN */}
      {/* ========================================================================= */}
      {activeSection === 'schedule' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Jadwal Sesi Latihan & Kalender Ruangan</h2>
              <p className="text-xs text-[#68655F]">
                Sistem otomatis memverifikasi bentrok jadwal ruangan dan fasilitas antar-ekskul.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsAddEventModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Jadwalkan Sesi Latihan Baru
            </Button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="border border-[#D8D4CC] rounded-lg p-4 bg-[#F5F2EA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#171717] text-sm">{ev.title}</span>
                    <Badge variant="neutral">{ev.organizer}</Badge>
                    <Badge variant={ev.category === 'practice' ? 'success' : 'warning'}>
                      {ev.category === 'practice' ? 'Latihan Rutin' : 'Agenda Khusus'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#68655F] mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#234B36]" />
                      <span>{ev.start_datetime.replace('T', ' ')} s.d. {ev.end_datetime.substring(11, 16)} WIB</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#171717]">
                      <MapPin className="w-3.5 h-3.5 text-[#8C6819]" />
                      <span>Lokasi: {ev.location}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] rounded transition-colors cursor-pointer"
                    title="Hapus Jadwal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: VERIFIKASI QR PORTOFOLIO */}
      {/* ========================================================================= */}
      {activeSection === 'verification' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8D4CC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Arsip & Pengaturan Verifikasi QR Portofolio</h2>
              <p className="text-xs text-[#68655F]">
                Audit keabsahan dokumen, tanda tangan elektronik, serta kode QR portofolio siswa yang telah diterbitkan.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('/contoh-portofolio')} icon={<FileText className="w-3.5 h-3.5" />}>
              Format Portofolio Resmi
            </Button>
          </div>

          {/* Institutional Verification Config Card */}
          <div className="bg-[#F5F2EA] border border-[#D8D4CC] rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#68655F]">Penandatangan Dokumen</div>
              <div className="font-bold text-[#171717] mt-0.5">{settings.principal_name}</div>
              <div className="text-[11px] text-[#234B36]">Kepala Sekolah (Sertifikat Digital Valid)</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#68655F]">Verifikator Kesiswaan</div>
              <div className="font-bold text-[#171717] mt-0.5">{settings.vice_principal_student_affairs}</div>
              <div className="text-[11px] text-[#8C6819]">Wakasek Bid. Kesiswaan</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#68655F]">NPSN & Legalitas</div>
              <div className="font-bold text-[#171717] mt-0.5">NPSN: {settings.npsn}</div>
              <div className="text-[11px] text-[#68655F]">{settings.school_name}</div>
            </div>
          </div>

          {/* List of Verified Documents */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#234B36]">
              Daftar Dokumen Portofolio Sah Terdaftar
            </h3>
            {verifications.map((ver) => (
              <div
                key={ver.id}
                className="border border-[#D8D4CC] rounded-lg p-4 bg-[#F5F2EA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#171717] text-sm">{ver.student_name}</span>
                    <span className="text-[#68655F]">({ver.student_class})</span>
                    <Badge variant={ver.status === 'valid' ? 'success' : 'danger'}>
                      {ver.status === 'valid' ? 'Sah & Tervalidasi' : 'Dokumen Dicabut'}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-[#68655F] mt-1 font-mono">
                    Nomor Verifikasi: <strong className="text-[#234B36]">{ver.verification_id}</strong> • NISN: {ver.student_nisn}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate(`/verify/${ver.verification_id}`)}
                    icon={<QrCode className="w-3.5 h-3.5" />}
                  >
                    Uji QR Publik
                  </Button>
                  <button
                    onClick={() => toggleVerificationStatus(ver.verification_id, ver.status)}
                    className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                      ver.status === 'valid'
                        ? 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#e7c7c4]'
                        : 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#cde4d6]'
                    }`}
                  >
                    {ver.status === 'valid' ? 'Cabut Akses' : 'Pulihkan Sah'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: KELOLA PROFIL & FOTO ADMIN */}
      {/* ========================================================================= */}
      {activeSection === 'profile' && (
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-6 space-y-6">
          <div className="pb-4 border-b border-[#D8D4CC]">
            <h2 className="text-base font-bold text-[#171717]">Pengaturan Profil & Foto Administrator</h2>
            <p className="text-xs text-[#68655F]">
              Ubah foto profil yang tampil di sidebar, nama akun, informasi kontak, dan kata sandi kesiswaan.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Foto Profil Section */}
            <div className="bg-[#F5F2EA]/40 border border-[#D8D4CC] rounded-lg p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#234B36] mb-3">
                Foto Profil Administrator
              </label>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Live Avatar Preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group">
                    <img
                      src={profileAvatar}
                      alt={profileName}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#234B36] shadow-sm bg-white"
                    />
                    <label
                      htmlFor="avatar-file-input"
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Ganti Foto</span>
                    </label>
                  </div>
                  <span className="text-[11px] font-semibold text-[#68655F]">Pratinjau Foto</span>
                </div>

                {/* Upload & Choose Options */}
                {/* Upload Options */}
                <div className="flex-1 space-y-3 text-xs w-full">
                  <div>
                    <label className="block font-bold text-[#171717] mb-1.5">
                      Unggah File Foto Profil:
                    </label>
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-[#68655F] file:mr-3 file:py-2 file:px-3.5 file:rounded file:border file:border-[#D8D4CC] file:text-xs file:font-bold file:bg-white file:text-[#171717] hover:file:bg-[#F5F2EA] cursor-pointer"
                    />
                    <p className="text-[11px] text-[#68655F] mt-1.5">
                      Pilih file foto dari laptop/komputer Anda (Format JPG, PNG, atau WEBP, maksimal 3MB). Foto akan langsung terpasang pada pratinjau di sebelah kiri.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Profil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap & Gelar Resmi"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Drs. Bambang Suryono, M.Pd."
                required
              />

              <Input
                label="Alamat Email Akun Admin"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="admin@smknusantara.sch.id"
                required
              />

              <Input
                label="Nomor Telepon / WhatsApp"
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="081298765432"
              />

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                  Jabatan Satuan Pendidikan
                </label>
                <input
                  type="text"
                  disabled
                  value="Wakil Kepala Sekolah Bidang Kesiswaan (Admin)"
                  className="w-full px-3 py-2 text-xs bg-[#F5F2EA] border border-[#D8D4CC] rounded text-[#68655F] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Keamanan & Sandi */}
            <div className="pt-4 border-t border-[#D8D4CC]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-3">
                Pengaturan Kata Sandi (Opsional)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
                <Input
                  label="Ulangi Kata Sandi Baru"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi kata sandi baru"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#D8D4CC]">
              <Button
                type="button"
                variant="outline"
                onClick={() => switchSection('dashboard')}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Simpan Perubahan Profil
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD USER (STUDENT / GURU / PEMBINA) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title={`Tambah Akun Baru: ${addUserTargetRole === 'student' ? 'Siswa' : addUserTargetRole === 'guru' ? 'Guru' : 'Pembina'}`}
      >
        <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
          <Input
            label="Nama Lengkap Beserta Gelar"
            type="text"
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
            placeholder="Contoh: Muhammad Farhan atau Dra. Hj. Nurul Hidayati"
            required
          />

          <Input
            label="Alamat Email Akun"
            type="email"
            value={userEmailInput}
            onChange={(e) => setUserEmailInput(e.target.value)}
            placeholder="nama@smknusantara.sch.id"
            required
          />

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
              Peran Akun
            </label>
            <select
              value={addUserTargetRole}
              onChange={(e) => setAddUserTargetRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            >
              <option value="student">Siswa</option>
              <option value="guru">Guru</option>
              <option value="pembina">Pembina</option>
            </select>
          </div>

          <Input
            label="Nomor Telepon / WhatsApp"
            type="tel"
            value={userPhoneInput}
            onChange={(e) => setUserPhoneInput(e.target.value)}
            placeholder="081234567890"
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Akun
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT USER */}
      {/* ========================================================================= */}
      <Modal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title={`Edit Data Pengguna: ${editingUser?.name}`}
      >
        <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
          <Input
            label="Nama Lengkap"
            type="text"
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
            required
          />

          <Input
            label="Alamat Email"
            type="email"
            value={editUserEmail}
            onChange={(e) => setEditUserEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Peran Akun
              </label>
              <select
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="student">Siswa</option>
                <option value="guru">Guru</option>
                <option value="pembina">Pembina</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Status Akun
              </label>
              <select
                value={editUserStatus ? 'active' : 'inactive'}
                onChange={(e) => setEditUserStatus(e.target.value === 'active')}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Non-Aktif</option>
              </select>
            </div>
          </div>

          <Input
            label="Nomor WhatsApp"
            type="tel"
            value={editUserPhone}
            onChange={(e) => setEditUserPhone(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Perbarui Data
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: HAPUS USER KONFIRMASI */}
      {/* ========================================================================= */}
      <Modal
        isOpen={userToDelete !== null}
        onClose={() => setUserToDelete(null)}
        title="Konfirmasi Hapus Akun"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#68655F]">
            Apakah Anda yakin ingin menghapus akun <strong className="text-[#171717]">{userToDelete?.name}</strong> ({userToDelete?.email})?
          </p>
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded">
            Tindakan ini akan mencabut akses masuk pengguna secara permanen.
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Batal
            </Button>
            <button
              onClick={confirmDeleteUser}
              className="px-4 py-2 bg-[#A33D35] hover:bg-[#852E27] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Hapus Pengguna
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: TAMBAH EKSTRAKURIKULER BARU */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddEkskulModalOpen}
        onClose={() => setIsAddEkskulModalOpen(false)}
        title="Tambah Ekstrakurikuler Baru"
      >
        <form onSubmit={handleAddEkskulSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Nama Ekstrakurikuler"
            type="text"
            value={ekskulName}
            onChange={(e) => setEkskulName(e.target.value)}
            placeholder="Contoh: Robotik & Otomasi Cerdas"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Kategori
              </label>
              <select
                value={ekskulCategory}
                onChange={(e) => setEkskulCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="Olahraga">Olahraga</option>
                <option value="Seni & Budaya">Seni & Budaya</option>
                <option value="Sains & Teknologi">Sains & Teknologi</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Bahasa & Literasi">Bahasa & Literasi</option>
              </select>
            </div>

            <Input
              label="Kapasitas Anggota"
              type="number"
              value={ekskulCapacity}
              onChange={(e) => setEkskulCapacity(Number(e.target.value))}
              placeholder="30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Guru Pembina"
              type="text"
              value={ekskulSupervisor}
              onChange={(e) => setEkskulSupervisor(e.target.value)}
              placeholder="Dra. Hj. Sri Wahyuni, M.Pd."
              required
            />
            <Input
              label="Nama Ketua Siswa"
              type="text"
              value={ekskulChairperson}
              onChange={(e) => setEkskulChairperson(e.target.value)}
              placeholder="Ahmad Rifai"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jadwal Latihan Rutin"
              type="text"
              value={ekskulSchedule}
              onChange={(e) => setEkskulSchedule(e.target.value)}
              placeholder="Setiap Jumat (15:30 - 17:30 WIB)"
            />
            <Input
              label="Lokasi Fasilitas"
              type="text"
              value={ekskulLocation}
              onChange={(e) => setEkskulLocation(e.target.value)}
              placeholder="Lab Robotika / Lapangan"
            />
          </div>

          <Input
            label="Ringkasan Singkat Deskripsi"
            type="text"
            value={ekskulDesc}
            onChange={(e) => setEkskulDesc(e.target.value)}
            placeholder="Fokus pada penguasaan mikrokontroler, IoT, dan perancangan sirkuit cerdas."
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddEkskulModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Ekstrakurikuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: EDIT EKSTRAKURIKULER */}
      {/* ========================================================================= */}
      <Modal
        isOpen={editingEkskul !== null}
        onClose={() => setEditingEkskul(null)}
        title={`Edit Ekstrakurikuler: ${editingEkskul?.name}`}
      >
        <form onSubmit={handleEditEkskulSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Nama Ekstrakurikuler"
            type="text"
            value={ekskulName}
            onChange={(e) => setEkskulName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Kategori
              </label>
              <select
                value={ekskulCategory}
                onChange={(e) => setEkskulCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="Olahraga">Olahraga</option>
                <option value="Seni & Budaya">Seni & Budaya</option>
                <option value="Sains & Teknologi">Sains & Teknologi</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Bahasa & Literasi">Bahasa & Literasi</option>
              </select>
            </div>

            <Input
              label="Kapasitas Anggota"
              type="number"
              value={ekskulCapacity}
              onChange={(e) => setEkskulCapacity(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Guru Pembina"
              type="text"
              value={ekskulSupervisor}
              onChange={(e) => setEkskulSupervisor(e.target.value)}
              required
            />
            <Input
              label="Nama Ketua Siswa"
              type="text"
              value={ekskulChairperson}
              onChange={(e) => setEkskulChairperson(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jadwal Latihan Rutin"
              type="text"
              value={ekskulSchedule}
              onChange={(e) => setEkskulSchedule(e.target.value)}
            />
            <Input
              label="Lokasi Fasilitas"
              type="text"
              value={ekskulLocation}
              onChange={(e) => setEkskulLocation(e.target.value)}
            />
          </div>

          <Input
            label="Deskripsi Singkat"
            type="text"
            value={ekskulDesc}
            onChange={(e) => setEkskulDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingEkskul(null)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Perbarui Ekskul
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 6: HAPUS EKSTRAKURIKULER KONFIRMASI */}
      {/* ========================================================================= */}
      <Modal
        isOpen={ekskulToDelete !== null}
        onClose={() => setEkskulToDelete(null)}
        title="Hapus Ekstrakurikuler"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#68655F]">
            Apakah Anda yakin ingin menghapus data ekstrakurikuler <strong className="text-[#171717]">{ekskulToDelete?.name}</strong>?
          </p>
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded">
            Seluruh data jadwal dan keanggotaan terkait ekskul ini tidak akan muncul lagi di katalog resmi.
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" onClick={() => setEkskulToDelete(null)}>
              Batal
            </Button>
            <button
              onClick={confirmDeleteEkskul}
              className="px-4 py-2 bg-[#A33D35] hover:bg-[#852E27] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Hapus Ekstrakurikuler
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 7: TAMBAH AGENDA JADWAL LATIHAN BARU */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        title="Jadwalkan Sesi Latihan Baru"
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Nama Agenda / Sesi Latihan"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Contoh: Latihan Taktik Pertandingan Futsal"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Ekskul Penyelenggara
              </label>
              <select
                value={eventOrganizer}
                onChange={(e) => setEventOrganizer(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                {ekskuls.map((e) => (
                  <option key={e.id} value={e.name}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Lokasi Fasilitas
              </label>
              <select
                value={eventLocation}
                onChange={(e) => {
                  setEventLocation(e.target.value);
                  checkConflictOnTimeChange(e.target.value, eventStart, eventEnd);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="Lapangan Basket">Lapangan Basket</option>
                <option value="Lapangan Futsal">Lapangan Futsal</option>
                <option value="Aula Serbaguna Lantai 3">Aula Serbaguna Lantai 3</option>
                <option value="Lab Komputer 2">Lab Komputer 2</option>
                <option value="Studio Multimedia & Alam Terbuka">Studio Multimedia & Alam Terbuka</option>
                <option value="Ruang UKS / PMR">Ruang UKS / PMR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waktu Mulai"
              type="datetime-local"
              value={eventStart}
              onChange={(e) => {
                setEventStart(e.target.value);
                checkConflictOnTimeChange(eventLocation, e.target.value, eventEnd);
              }}
              required
            />
            <Input
              label="Waktu Selesai"
              type="datetime-local"
              value={eventEnd}
              onChange={(e) => {
                setEventEnd(e.target.value);
                checkConflictOnTimeChange(eventLocation, eventStart, e.target.value);
              }}
              required
            />
          </div>

          {conflictWarning && (
            <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] rounded flex items-start gap-2 text-xs text-[#A33D35]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{conflictWarning}</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddEventModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Jadwal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
