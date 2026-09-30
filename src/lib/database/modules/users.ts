import { User, UserRole } from '@/types';
import * as apiService from '@/lib/api';

export class UsersModule {
  private users: User[] = [];
  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setUsers(users: User[]) {
    this.users = users;
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
    const existing = this.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
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
          : data.role === 'guru'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: true,
    };

    this.users.push(newUser);
    apiService.registerAPI(newUser);
    this.notify();
    return { success: true, message: 'Pendaftaran akun berhasil!', user: newUser };
  }

  public addUser(data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    is_active?: boolean;
  }): { success: boolean; message: string; user?: User } {
    const existing = this.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar untuk pengguna lain.' };
    }

    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      phone: data.phone || '081234567890',
      avatar_url:
        data.role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : data.role === 'guru'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: data.is_active !== undefined ? data.is_active : true,
    };

    this.users.unshift(newUser);
    apiService.addUserAPI(newUser);
    this.notify();
    return { success: true, message: 'Pengguna baru berhasil ditambahkan.', user: newUser };
  }

  public updateUser(id: string, data: Partial<User>): { success: boolean; message: string } {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }
    if (data.email) {
      const emailDup = this.users.find((u) => u.id !== id && u.email.toLowerCase() === data.email!.toLowerCase());
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
    if (user.role === 'admin' && this.users.filter((u) => u.role === 'admin').length <= 1) {
      return { success: false, message: 'Tidak dapat menghapus akun admin utama terakhir.' };
    }
    this.users = this.users.filter((u) => u.id !== id);
    apiService.deleteUserAPI(id);
    this.notify();
    return { success: true, message: `Akun ${user.name} (${user.role}) berhasil dihapus.` };
  }
}
