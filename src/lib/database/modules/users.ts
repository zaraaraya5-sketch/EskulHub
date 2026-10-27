import { User, UserRole } from '@/types';
import * as apiService from '@/lib/api';

const DEFAULT_DEMO_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Budi Pratama',
    email: 'budi@smkn1ciomas.sch.id',
    role: 'student',
    password: 'password123',
    phone: '085712345678',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_active: true,
    nisn: '0067823910',
    class_name: 'XII RPL 1',
    gender: 'L',
    bio: 'Siswa aktif SMKN 1 Ciomas dengan minat tinggi pada olahraga basket dan futsal.',
    created_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'usr-student-2',
    name: 'Dimas Setiawan',
    email: 'dimas.setiawan@smkn1ciomas.sch.id',
    role: 'student',
    password: 'password123',
    phone: '085711223344',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    is_active: true,
    nisn: '0078912345',
    class_name: 'X TKJ 1',
    gender: 'L',
    created_at: '2026-10-02T09:30:00Z',
  },
  {
    id: 'usr-student-3',
    name: 'Rafi Alamsyah',
    email: 'rafi.alamsyah@smkn1ciomas.sch.id',
    role: 'student',
    password: 'password123',
    phone: '085755667788',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    is_active: true,
    nisn: '0065432198',
    class_name: 'XI RPL 2',
    gender: 'L',
    created_at: '2026-10-03T10:15:00Z',
  },
  {
    id: 'usr-student-4',
    name: 'Muhammad Fikri',
    email: 'fikri@smkn1ciomas.sch.id',
    role: 'student',
    password: 'password123',
    phone: '085799881122',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    is_active: true,
    nisn: '0072938491',
    class_name: 'X RPL 1',
    gender: 'L',
    created_at: '2026-10-07T14:20:00Z',
  },
  {
    id: 'usr-pembina-1',
    name: 'Hendra Wijaya, S.Pd.',
    email: 'hendra@smkn1ciomas.sch.id',
    role: 'pembina',
    password: 'password123',
    phone: '081234567891',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_active: true,
    nip: '198204152008011007',
    subject: 'Guru Pendidikan Jasmani & Pembina Ekskul Futsal',
    created_at: '2025-07-10T08:00:00Z',
  },
  {
    id: 'usr-pengurus-1',
    name: 'Rizky Ramadhan',
    email: 'rizky@smkn1ciomas.sch.id',
    role: 'pengurus',
    password: 'password123',
    phone: '085712345679',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_active: true,
    nisn: '0067823911',
    class_name: 'XII RPL 2',
    gender: 'L',
    bio: 'Ketua Ekstrakurikuler Futsal periode 2025/2026.',
    created_at: '2025-07-15T08:00:00Z',
  },
  {
    id: 'usr-admin-1',
    name: 'Jamil Husein',
    email: 'admin@smkn1ciomas.sch.id',
    role: 'pengurus',
    password: 'password123',
    phone: '081234567890',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    is_active: true,
    nip: '196803201994031004',
    subject: 'Wakil Kepala Sekolah Bidang Kesiswaan',
    created_at: '2025-01-01T08:00:00Z',
  },
  {
    id: 'usr-guru-1',
    name: 'Dra. Hj. Sri Wahyuni, M.Pd.',
    email: 'sri.wahyuni@smkn1ciomas.sch.id',
    role: 'pengurus',
    password: 'password123',
    phone: '081320491823',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    is_active: true,
    nip: '197508122002122001',
    subject: 'Staf Pengurus Kesiswaan & Ekstrakurikuler',
    created_at: '2025-01-01T08:00:00Z',
  },
];

export class UsersModule {
  private users: User[] = [...DEFAULT_DEMO_USERS];
  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setUsers(users: User[]) {
    if (users && users.length > 0) {
      const merged = [...users];
      for (const demo of DEFAULT_DEMO_USERS) {
        if (!merged.some(u => u.id === demo.id || (u.email && u.email.toLowerCase() === demo.email.toLowerCase()))) {
          merged.push(demo);
        }
      }
      this.users = merged;
    } else {
      this.users = [...DEFAULT_DEMO_USERS];
    }
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public registerUser(data: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    phone?: string;
  }): { success: boolean; message: string; user?: User } {
    const existing = this.users.find((u) => u.email && u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Alamat email sudah terdaftar di sistem.' };
    }

    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      password: data.password || 'password123',
      phone: data.phone || '081234567890',
      avatar_url:
        data.role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : data.role === 'pembina' || data.role === 'teacher'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    this.users.push(newUser);
    if (typeof apiService.registerAPI === 'function') {
      apiService.registerAPI(newUser).catch(() => {});
    }
    this.notify();
    return { success: true, message: 'Pendaftaran akun berhasil!', user: newUser };
  }

  public addUser(data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    password?: string;
    is_active?: boolean;
    nisn?: string;
    class_name?: string;
    gender?: 'L' | 'P';
    bio?: string;
    nip?: string;
    subject?: string;
  }): { success: boolean; message: string; user?: User } {
    const existing = this.users.find((u) => u.email && u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar untuk pengguna lain.' };
    }

    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      password: data.password || 'password123',
      phone: data.phone || '081234567890',
      avatar_url:
        data.role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : data.role === 'pembina' || data.role === 'teacher'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: data.is_active !== undefined ? data.is_active : true,
      nisn: data.nisn,
      class_name: data.class_name,
      gender: data.gender,
      bio: data.bio,
      nip: data.nip,
      subject: data.subject,
      created_at: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    apiService.addUserAPI(newUser).then((res) => {
      if (res && res.user) {
        const idx = this.users.findIndex((u) => u.id === newUser.id || u.email === newUser.email);
        if (idx !== -1) {
          this.users[idx] = { ...this.users[idx], ...res.user };
          this.notify();
        }
      }
    }).catch(console.error);

    this.notify();
    return { success: true, message: 'Pengguna baru berhasil ditambahkan.', user: newUser };
  }

  public async addUserAsync(data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    password?: string;
    is_active?: boolean;
    nisn?: string;
    class_name?: string;
    gender?: 'L' | 'P';
    bio?: string;
    nip?: string;
    subject?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> {
    const existing = this.users.find((u) => u.email && u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar untuk pengguna lain.' };
    }

    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      password: data.password || 'password123',
      phone: data.phone || '081234567890',
      avatar_url:
        data.role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : data.role === 'pembina' || data.role === 'teacher'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: data.is_active !== undefined ? data.is_active : true,
      nisn: data.nisn,
      class_name: data.class_name,
      gender: data.gender,
      bio: data.bio,
      nip: data.nip,
      subject: data.subject,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await apiService.addUserAPI(newUser);
      if (res && res.user) {
        const created = res.user as User;
        const exists = this.users.some((u) => u.id === created.id);
        if (!exists) {
          this.users.unshift(created);
        } else {
          const idx = this.users.findIndex((u) => u.id === created.id);
          this.users[idx] = created;
        }
        this.notify();
        return { success: true, message: `Akun ${created.name} berhasil ditambahkan!`, user: created };
      } else if (res && res.success === false && res.message) {
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      console.warn('Backend user creation error, falling back to local memory:', err);
    }

    this.users.unshift(newUser);
    this.notify();
    return { success: true, message: 'Pengguna baru berhasil ditambahkan.', user: newUser };
  }

  public updateUser(id: string, data: Partial<User>): { success: boolean; message: string } {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }
    if (data.email) {
      const emailDup = this.users.find((u) => u.id !== id && u.email && u.email.toLowerCase() === data.email!.toLowerCase());
      if (emailDup) {
        return { success: false, message: 'Alamat email sudah digunakan oleh pengguna lain.' };
      }
    }
    this.users[idx] = { ...this.users[idx], ...data };
    apiService.updateUserAPI(id, data);
    this.notify();
    return { success: true, message: 'Data pengguna berhasil diperbarui.' };
  }

  public deleteUser(id: string): { success: boolean; message: string } {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }
    if (user.role === 'pengurus' && this.users.filter((u) => u.role === 'pengurus').length <= 1) {
      return { success: false, message: 'Tidak dapat menghapus akun pengurus utama terakhir.' };
    }
    this.users = this.users.filter((u) => u.id !== id);
    apiService.deleteUserAPI(id);
    this.notify();
    return { success: true, message: `Akun ${user.name} (${user.role}) berhasil dihapus.` };
  }
}
