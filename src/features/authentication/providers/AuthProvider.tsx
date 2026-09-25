import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { db } from '@/lib/storage/mockDatabase';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => { success: boolean; message?: string; user?: User };
  register: (name: string, email: string, role?: UserRole, password?: string, phone?: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => { success: boolean; message: string; user?: User };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const users = db.getUsers();
  // Initialize from storage or null
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('ekskul_auth_user_id');
    const found = users.find(u => u.id === savedId);
    return found || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ekskul_auth_user_id', currentUser.id);
    } else {
      localStorage.removeItem('ekskul_auth_user_id');
    }
  }, [currentUser]);

  const login = (identifier: string, password?: string): { success: boolean; message?: string; user?: User } => {
    const clean = identifier.trim().toLowerCase();
    const allUsers = db.getUsers();
    const found = allUsers.find(
      u => u.email.toLowerCase() === clean ||
           u.name.toLowerCase() === clean ||
           u.name.toLowerCase().includes(clean)
    );
    if (!found) {
      return { success: false, message: 'Akun dengan nama atau email tersebut tidak ditemukan di sistem.' };
    }
    if (found.password && password && found.password !== password) {
      return { success: false, message: 'Kata sandi (password) salah. Silakan coba lagi.' };
    }
    setCurrentUser(found);
    return { success: true, user: found };
  };

  const register = (name: string, email: string, role: UserRole = 'student', password?: string, phone?: string) => {
    const res = db.registerUser({ name, email, role, password, phone });
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const found = db.getUsers().find(u => u.role === newRole);
    if (found) {
      setCurrentUser(found);
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
        role: currentUser?.role || 'student',
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
