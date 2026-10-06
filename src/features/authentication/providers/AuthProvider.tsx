import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { db } from '@/lib/database';
import { loginAPI, logoutAPI, registerAPI } from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (name: string, email: string, role?: UserRole, password?: string, phone?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => { success: boolean; message: string; user?: User };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from storage synchronously so state is never lost on refresh
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUserJson = localStorage.getItem('ekskul_auth_user');
      if (savedUserJson) {
        const parsed = JSON.parse(savedUserJson);
        if (parsed && parsed.id && parsed.role) {
          if (parsed.role === 'admin') parsed.role = 'pengurus';
          return parsed;
        }
      }
      const savedId = localStorage.getItem('ekskul_auth_user_id');
      if (savedId) {
        const found = db.getUsers().find((u) => u.id === savedId);
        if (found) {
          if ((found.role as any) === 'admin') found.role = 'pengurus';
          return found;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca sesi awal dari localStorage:', e);
    }
    return null;
  });

  // Synchronize localStorage whenever currentUser changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ekskul_auth_user', JSON.stringify(currentUser));
        localStorage.setItem('ekskul_auth_user_id', currentUser.id);
      }
    } catch (error) {
      console.warn('Gagal menyimpan sesi ke localStorage:', error);
    }
  }, [currentUser]);

  // Sync with DB after backend async load finishes
  useEffect(() => {
    const unsub = db.subscribe(() => {
      const allUsers = db.getUsers();
      if (allUsers.length === 0) return;

      const savedId = localStorage.getItem('ekskul_auth_user_id');
      if (savedId) {
        const found = allUsers.find((u) => u.id === savedId || (currentUser && u.email === currentUser.email));
        if (found) {
          setCurrentUser((prev) => {
            if (!prev) return found;
            // Only update if properties changed
            if (prev.id !== found.id || prev.role !== found.role || prev.name !== found.name) {
              return { ...prev, ...found };
            }
            return prev;
          });
        }
      }
    });
    return () => unsub();
  }, [currentUser]);

  const login = async (
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; message?: string; user?: User }> => {
    const clean = identifier.trim().toLowerCase();

    if (!clean) {
      return { success: false, message: 'Silakan masukkan nama atau email akun Anda.' };
    }

    if (!password || !password.trim()) {
      return { success: false, message: 'Kata sandi (password) harus diisi demi keamanan akun.' };
    }

    // 1. Attempt secure authentication with backend API first (Sanctum Token)
    try {
      const apiRes = await loginAPI(clean, password);
      if (apiRes && apiRes.success && apiRes.user) {
        localStorage.setItem('ekskul_auth_user', JSON.stringify(apiRes.user));
        localStorage.setItem('ekskul_auth_user_id', apiRes.user.id);
        setCurrentUser(apiRes.user);
        return { success: true, user: apiRes.user, message: apiRes.message };
      }
    } catch {
      // Fallback to local validation if backend is currently unreachable
    }

    // 2. Strict local validation fallback (No wildcard substring matching)
    const allUsers = db.getUsers();
    const found = allUsers.find(
      u => (u.email && u.email.toLowerCase() === clean) || (u.name && u.name.toLowerCase() === clean)
    );

    if (!found) {
      return { success: false, message: 'Akun dengan nama atau email tersebut tidak ditemukan di sistem.' };
    }

    if (!found.is_active) {
      return { success: false, message: 'Akun Anda dinonaktifkan oleh administrator sekolah.' };
    }

    // Default demo password is password123 or matches account
    const expectedPassword = found.password || 'password123';
    if (password !== expectedPassword) {
      return { success: false, message: 'Kata sandi (password) salah. Silakan coba lagi.' };
    }

    localStorage.setItem('ekskul_auth_user', JSON.stringify(found));
    localStorage.setItem('ekskul_auth_user_id', found.id);
    setCurrentUser(found);
    return { success: true, user: found };
  };

  const register = async (
    name: string,
    email: string,
    role: UserRole = 'student',
    password?: string,
    phone?: string
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || 'password123';

    // 1. First attempt registration on the Laravel backend API
    try {
      const apiRes = await registerAPI({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        phone: phone ? phone.trim() : undefined,
        role,
      });

      if (apiRes && apiRes.success && apiRes.user) {
        if (apiRes.token) {
          localStorage.setItem('ekskul_auth_token', apiRes.token);
        }
        localStorage.setItem('ekskul_auth_user', JSON.stringify(apiRes.user));
        localStorage.setItem('ekskul_auth_user_id', apiRes.user.id);
        setCurrentUser(apiRes.user);

        // Sync local in-memory user list
        const allUsers = db.getUsers();
        if (!allUsers.some(u => u.id === apiRes.user.id || (u.email && u.email.toLowerCase() === cleanEmail))) {
          allUsers.unshift(apiRes.user);
        }

        return {
          success: true,
          message: apiRes.message || 'Pendaftaran akun siswa berhasil!',
          user: apiRes.user,
        };
      }

      // If backend explicitly returned a validation error (like email duplicate), return it
      if (apiRes && apiRes.success === false && apiRes.message && !apiRes.message.includes('Gagal terhubung')) {
        return {
          success: false,
          message: apiRes.message,
        };
      }
    } catch {
      // Backend unreachable, proceed with local fallback
    }

    // 2. Fallback to local database module for offline / client operation
    const res = db.registerUser({ name: cleanName, email: cleanEmail, role, password: cleanPassword, phone });
    if (res.success && res.user) {
      localStorage.setItem('ekskul_auth_user', JSON.stringify(res.user));
      localStorage.setItem('ekskul_auth_user_id', res.user.id);
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = () => {
    logoutAPI().catch(() => {});
    localStorage.removeItem('ekskul_auth_user');
    localStorage.removeItem('ekskul_auth_user_id');
    localStorage.removeItem('ekskul_auth_token');
    setCurrentUser(null);
  };

  const switchRole = async (newRole: UserRole) => {
    const found = db.getUsers().find(u => u.role === newRole);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('ekskul_auth_user', JSON.stringify(found));
      localStorage.setItem('ekskul_auth_user_id', found.id);
      try {
        const res = await loginAPI(found.email, 'password123');
        if (res && res.token) {
          localStorage.setItem('ekskul_auth_token', res.token);
        }
      } catch {}
    }
  };


  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi pengguna aktif.' };
    const res = db.updateUser(currentUser.id, data);
    if (res.success) {
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      return { success: true, message: 'Profil berhasil diperbarui!', user: updated };
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: (currentUser?.role as any) === 'admin' || (currentUser?.role as any) === 'guru'
          ? 'pengurus'
          : (currentUser?.role || 'student'),
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
