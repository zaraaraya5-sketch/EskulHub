import axios from 'axios';
import {
  User,
  Extracurricular,
  ExtracurricularMember,
  ExtracurricularRegistration,
  AttendanceSession,
  AttendanceRecord,
  SchoolEvent,
  Achievement,
  Certificate,
  PortfolioVerification,
  SchoolSetting,
} from '@/types';

// Axios instance pointing to the Laravel backend running SQLite
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 5000,
});

// Attach Authorization Bearer token to all requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ekskul_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 1. Settings
// ==========================================
export const getSettingsAPI = async (): Promise<SchoolSetting | null> => {
  try {
    const res = await api.get('/settings');
    return res.data;
  } catch (err) {
    console.error('Error fetching settings from API:', err);
    return null;
  }
};

export const updateSettingsAPI = async (data: Partial<SchoolSetting>): Promise<SchoolSetting | null> => {
  try {
    const res = await api.put('/settings', data);
    return res.data.settings;
  } catch (err) {
    console.error('Error updating settings via API:', err);
    return null;
  }
};

// ==========================================
// 2. Auth & Users
// ==========================================
export const loginAPI = async (identifier: string, password?: string) => {
  try {
    const res = await api.post('/auth/login', { identifier, password });
    if (res.data?.token) {
      localStorage.setItem('ekskul_auth_token', res.data.token);
    }
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || 'Gagal terhubung ke server autentikasi lokal.',
    };
  }
};

export const logoutAPI = async () => {
  try {
    const res = await api.post('/auth/logout');
    localStorage.removeItem('ekskul_auth_token');
    return res.data;
  } catch (err) {
    localStorage.removeItem('ekskul_auth_token');
    return { success: true };
  }
};

export const registerAPI = async (userData: Partial<User>) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || 'Gagal mendaftarkan akun ke server lokal.',
    };
  }
};

export const updateProfileAPI = async (id: string, data: Partial<User>) => {
  try {
    const res = await api.put(`/auth/profile/${id}`, data);
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || 'Gagal memperbarui profil di server lokal.',
    };
  }
};

export const getUsersAPI = async (): Promise<User[]> => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (err) {
    console.error('Error fetching users from API:', err);
    return [];
  }
};

export const addUserAPI = async (userData: Partial<User>) => {
  try {
    const res = await api.post('/users', userData);
    return res.data;
  } catch (err) {
    console.error('Error adding user via API:', err);
    return { success: false };
  }
};

export const updateUserAPI = async (id: string, userData: Partial<User>) => {
  try {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  } catch (err) {
    console.error(`Error updating user ${id} via API:`, err);
    return { success: false };
  }
};

export const deleteUserAPI = async (id: string) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting user ${id} via API:`, err);
    return { success: false };
  }
};

// ==========================================
// 3. Extracurriculars & Members
// ==========================================
export const getEkskulsAPI = async (): Promise<Extracurricular[]> => {
  try {
    const res = await api.get('/ekskul');
    return res.data;
  } catch (err) {
    console.error('Error fetching ekskuls from API:', err);
    return [];
  }
};

export const getEkskulBySlugAPI = async (slug: string): Promise<Extracurricular | undefined> => {
  try {
    const res = await api.get(`/ekskul/${slug}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching ekskul ${slug}:`, err);
    return undefined;
  }
};

export const createEkskulAPI = async (data: Partial<Extracurricular>) => {
  try {
    const res = await api.post('/ekskul', data);
    return res.data;
  } catch (err) {
    console.error('Error creating ekskul via API:', err);
    return { success: false };
  }
};

export const updateEkskulAPI = async (id: string, data: Partial<Extracurricular>) => {
  try {
    const res = await api.put(`/ekskul/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(`Error updating ekskul ${id} via API:`, err);
    return { success: false };
  }
};

export const deleteEkskulAPI = async (id: string) => {
  try {
    const res = await api.delete(`/ekskul/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting ekskul ${id} via API:`, err);
    return { success: false };
  }
};

export const getAllMembersAPI = async (): Promise<ExtracurricularMember[]> => {
  try {
    const res = await api.get('/members');
    return res.data;
  } catch (err) {
    console.error('Error fetching all members from API:', err);
    return [];
  }
};

export const addMemberAPI = async (ekskulId: string, memberData: Partial<ExtracurricularMember>) => {
  try {
    const res = await api.post(`/ekskul/${ekskulId}/members`, memberData);
    return res.data;
  } catch (err) {
    console.error(`Error adding member to ekskul ${ekskulId} via API:`, err);
    return { success: false };
  }
};

export const deleteMemberAPI = async (memberId: string) => {
  try {
    const res = await api.delete(`/ekskul/members/${memberId}`);
    return res.data;
  } catch (err) {
    console.error(`Error removing member ${memberId} via API:`, err);
    return { success: false };
  }
};

// ==========================================
// 4. Registrations
// ==========================================
export const getRegistrationsAPI = async (): Promise<ExtracurricularRegistration[]> => {
  try {
    const res = await api.get('/registrations');
    return res.data;
  } catch (err) {
    console.error('Error fetching registrations from API:', err);
    return [];
  }
};

export const createRegistrationAPI = async (data: Partial<ExtracurricularRegistration>) => {
  try {
    const res = await api.post('/registrations', data);
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || 'Gagal mengirim pendaftaran ke server.',
    };
  }
};

export const updateRegistrationStatusAPI = async (
  id: string,
  status: 'approved' | 'rejected',
  reviewerName?: string,
  notes?: string
) => {
  try {
    const res = await api.put(`/registrations/${id}/status`, {
      status,
      reviewer_name: reviewerName,
      notes,
    });
    return res.data;
  } catch (err) {
    console.error(`Error updating registration ${id} status via API:`, err);
    return { success: false };
  }
};

// ==========================================
// 5. Attendance
// ==========================================
export const getAttendanceSessionsAPI = async (): Promise<AttendanceSession[]> => {
  try {
    const res = await api.get('/attendance/sessions');
    return res.data;
  } catch (err) {
    console.error('Error fetching attendance sessions from API:', err);
    return [];
  }
};

export const createAttendanceSessionAPI = async (data: Partial<AttendanceSession>) => {
  try {
    const res = await api.post('/attendance/sessions', data);
    return res.data;
  } catch (err) {
    console.error('Error creating attendance session via API:', err);
    return { success: false };
  }
};

export const getAttendanceRecordsAPI = async (): Promise<AttendanceRecord[]> => {
  try {
    const res = await api.get('/attendance/records');
    return res.data;
  } catch (err) {
    console.error('Error fetching attendance records from API:', err);
    return [];
  }
};

export const saveAttendanceRecordAPI = async (data: Partial<AttendanceRecord>) => {
  try {
    const res = await api.post('/attendance/records', data);
    return res.data;
  } catch (err) {
    console.error('Error saving attendance record via API:', err);
    return { success: false };
  }
};

// ==========================================
// 6. School Events & Calendar
// ==========================================
export const getEventsAPI = async (): Promise<SchoolEvent[]> => {
  try {
    const res = await api.get('/events');
    return res.data;
  } catch (err) {
    console.error('Error fetching events from API:', err);
    return [];
  }
};

export const createEventAPI = async (data: Partial<SchoolEvent>) => {
  try {
    const res = await api.post('/events', data);
    return res.data;
  } catch (err) {
    console.error('Error creating event via API:', err);
    return { success: false };
  }
};

export const updateEventAPI = async (id: string, data: Partial<SchoolEvent>) => {
  try {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(`Error updating event ${id} via API:`, err);
    return { success: false };
  }
};

export const deleteEventAPI = async (id: string) => {
  try {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting event ${id} via API:`, err);
    return { success: false };
  }
};

// ==========================================
// 7. Achievements
// ==========================================
export const getAchievementsAPI = async (): Promise<Achievement[]> => {
  try {
    const res = await api.get('/achievements');
    return res.data;
  } catch (err) {
    console.error('Error fetching achievements from API:', err);
    return [];
  }
};

export const createAchievementAPI = async (data: Partial<Achievement>) => {
  try {
    const res = await api.post('/achievements', data);
    return res.data;
  } catch (err) {
    console.error('Error creating achievement via API:', err);
    return { success: false };
  }
};

export const verifyAchievementAPI = async (id: string, verifiedByName: string) => {
  try {
    const res = await api.put(`/achievements/${id}/verify`, { verified_by_name: verifiedByName });
    return res.data;
  } catch (err) {
    console.error(`Error verifying achievement ${id} via API:`, err);
    return { success: false };
  }
};

export const deleteAchievementAPI = async (id: string) => {
  try {
    const res = await api.delete(`/achievements/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting achievement ${id} via API:`, err);
    return { success: false };
  }
};

// ==========================================
// 8. Certificates
// ==========================================
export const getCertificatesAPI = async (): Promise<Certificate[]> => {
  try {
    const res = await api.get('/certificates');
    return res.data;
  } catch (err) {
    console.error('Error fetching certificates from API:', err);
    return [];
  }
};

export const createCertificateAPI = async (data: Partial<Certificate>) => {
  try {
    const res = await api.post('/certificates', data);
    return res.data;
  } catch (err) {
    console.error('Error creating certificate via API:', err);
    return { success: false };
  }
};

export const deleteCertificateAPI = async (id: string) => {
  try {
    const res = await api.delete(`/certificates/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting certificate ${id} via API:`, err);
    return { success: false };
  }
};

// ==========================================
// 9. Portfolio Verification
// ==========================================
export const getVerificationsAPI = async (): Promise<PortfolioVerification[]> => {
  try {
    const res = await api.get('/verifications');
    return res.data;
  } catch (err) {
    console.error('Error fetching verifications list from API:', err);
    return [];
  }
};

export const getVerificationAPI = async (id: string): Promise<PortfolioVerification | null> => {
  try {
    const res = await api.get(`/verification/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching verification ${id} from API:`, err);
    return null;
  }
};

export const saveVerificationAPI = async (data: Partial<PortfolioVerification>) => {
  try {
    const res = await api.post('/verification', data);
    return res.data;
  } catch (err) {
    console.error('Error saving verification via API:', err);
    return { success: false };
  }
};
