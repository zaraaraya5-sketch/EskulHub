import * as apiService from '@/lib/api';
import { SettingsModule } from './modules/settings';
import { UsersModule } from './modules/users';
import { ExtracurricularsModule } from './modules/extracurriculars';
import { RegistrationsModule } from './modules/registrations';
import { AttendanceModule } from './modules/attendance';
import { EventsModule } from './modules/events';
import { AchievementsModule } from './modules/achievements';
import { VerificationsModule } from './modules/verifications';

/**
 * SQLiteDatabaseClient — Centralized, modular SQLite client layer for EskulHub.
 * Coordinates all modular domain services and synchronizes with Laravel REST API endpoints.
 */
class SQLiteDatabaseClient {
  private listeners: Set<() => void> = new Set();
  private notify = () => {
    this.saveToCache();
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error in db subscriber:', err);
      }
    });
  };

  public settings = new SettingsModule(this.notify);
  public users = new UsersModule(this.notify);
  public extracurriculars = new ExtracurricularsModule(this.notify);
  public registrations = new RegistrationsModule(this.extracurriculars, this.notify);
  public attendance = new AttendanceModule(this.extracurriculars, this.notify);
  public events = new EventsModule(this.notify);
  public achievements = new AchievementsModule(this.notify);
  public verifications = new VerificationsModule(
    this.users,
    this.extracurriculars,
    this.attendance,
    this.achievements,
    this.settings,
    this.notify
  );

  constructor() {
    this.hydrateFromCache();
    if (typeof window !== 'undefined') {
      setTimeout(() => this.syncWithBackend(), 50);
    } else {
      this.syncWithBackend();
    }
  }

  private saveToCache() {
    try {
      if (typeof window === 'undefined') return;
      const snapshot = {
        settings: this.settings.getSettings(),
        users: this.users.getUsers(),
        ekskuls: this.extracurriculars.getExtracurriculars(),
        members: this.extracurriculars.getMembers(),
        registrations: this.registrations.getRegistrations(),
        sessions: this.attendance.getAttendanceSessions(),
        records: this.attendance.getAttendanceRecords(),
        events: this.events.getSchoolEvents(),
        achievements: this.achievements.getAchievements(),
        certificates: this.achievements.getCertificates(),
        verifications: this.verifications.getVerifications(),
      };
      localStorage.setItem('ekskul_cached_snapshot', JSON.stringify(snapshot));
    } catch {
      // Ignore cache storage errors in restricted contexts
    }
  }

  private hydrateFromCache() {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem('ekskul_cached_snapshot');
      if (!raw) return;
      const data = JSON.parse(raw);
      // Invalidate old study case cache, compound ekskul names, or outdated images
      if (
        (data.settings?.school_name && !data.settings.school_name.includes('Ciomas')) ||
        (data.ekskuls?.[0]?.name && data.ekskuls[0].name.includes('Ciomas')) ||
        data.ekskuls?.some((e: any) => 
          (e.slug === 'paskibra' && e.profile_image?.includes('photo-1532375810709')) ||
          (e.slug === 'voli' && !e.profile_image?.includes('/images/voli.jpeg')) ||
          (e.slug === 'pmr' && !e.profile_image?.includes('/images/PMR.jpeg')) ||
          (e.slug === 'rohis' && !e.profile_image?.includes('/images/Rohis.jpeg')) ||
          (e.slug === 'pramuka' && !e.profile_image?.includes('/images/pramuka.jpeg'))
        ) ||
        !data.events || data.events.length === 0
      ) {
        localStorage.removeItem('ekskul_cached_snapshot');
        return;
      }

      if (data.settings) this.settings.setSettings(data.settings);
      if (data.users?.length) this.users.setUsers(data.users);
      if (data.ekskuls?.length) this.extracurriculars.setExtracurriculars(data.ekskuls);
      if (data.members?.length) this.extracurriculars.setMembers(data.members);
      if (data.registrations?.length) this.registrations.setRegistrations(data.registrations);
      if (data.sessions?.length) this.attendance.setSessions(data.sessions);
      if (data.records?.length) this.attendance.setRecords(data.records);
      if (data.events?.length) this.events.setEvents(data.events);
      if (data.achievements?.length) this.achievements.setAchievements(data.achievements);
      if (data.certificates?.length) this.achievements.setCertificates(data.certificates);
      if (data.verifications?.length) this.verifications.setVerifications(data.verifications);
    } catch {
      // Fallback cleanly to defaults
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private isSyncing = false;

  public async syncWithBackend(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('ekskul_auth_token');

      const [
        settings,
        users,
        ekskuls,
        members,
        registrations,
        sessions,
        records,
        events,
        achievements,
        certificates,
        verifications,
      ] = await Promise.all([
        apiService.getSettingsAPI(),
        apiService.getUsersAPI(),
        apiService.getEkskulsAPI(),
        apiService.getAllMembersAPI(),
        hasToken ? apiService.getRegistrationsAPI() : Promise.resolve([]),
        hasToken ? apiService.getAttendanceSessionsAPI() : Promise.resolve([]),
        hasToken ? apiService.getAttendanceRecordsAPI() : Promise.resolve([]),
        apiService.getEventsAPI(),
        apiService.getAchievementsAPI(),
        hasToken ? apiService.getCertificatesAPI() : Promise.resolve([]),
        hasToken ? apiService.getVerificationsAPI() : Promise.resolve([]),
      ]);


      if (settings) this.settings.setSettings(settings);
      if (users && users.length > 0) this.users.setUsers(users);
      if (ekskuls && ekskuls.length > 0) this.extracurriculars.setExtracurriculars(ekskuls);
      if (members && members.length > 0) this.extracurriculars.setMembers(members);
      if (registrations && registrations.length > 0) this.registrations.setRegistrations(registrations);
      if (sessions && sessions.length > 0) this.attendance.setSessions(sessions);
      if (records && records.length > 0) this.attendance.setRecords(records);
      if (events && events.length > 0) this.events.setEvents(events);
      if (achievements && achievements.length > 0) this.achievements.setAchievements(achievements);
      if (certificates && certificates.length > 0) this.achievements.setCertificates(certificates);
      if (verifications && verifications.length > 0) this.verifications.setVerifications(verifications);

      this.saveToCache();
      this.notify();
    } catch (err) {
      console.error('Gagal mengambil data dari database lokal SQLite:', err);
    } finally {
      this.isSyncing = false;
    }
  }

  public async refresh(): Promise<void> {
    return this.syncWithBackend();
  }

  // Backward-compatible unified delegations for clean component ergonomics:
  // Settings
  public getSettings = () => this.settings.getSettings();
  public updateSettings = (data: any) => this.settings.updateSettings(data);

  // Users
  public getUsers = () => this.users.getUsers();
  public getUserById = (id: string) => this.users.getUserById(id);
  public registerUser = (data: any) => this.users.registerUser(data);
  public addUser = (data: any) => this.users.addUser(data);
  public updateUser = (id: string, data: any) => this.users.updateUser(id, data);
  public deleteUser = (id: string) => this.users.deleteUser(id);

  // Extracurriculars & Members
  public getExtracurriculars = () => this.extracurriculars.getExtracurriculars();
  public setExtracurriculars = (ekskuls: any[]) => this.extracurriculars.setExtracurriculars(ekskuls);
  public getExtracurricularBySlug = (slug: string) => this.extracurriculars.getExtracurricularBySlug(slug);
  public getExtracurricularById = (id: string) => this.extracurriculars.getExtracurricularById(id);
  public addExtracurricular = (data: any) => this.extracurriculars.addExtracurricular(data);
  public addExtracurricularAsync = (data: any) => this.extracurriculars.addExtracurricularAsync(data);
  public updateExtracurricular = (id: string, data: any) => this.extracurriculars.updateExtracurricular(id, data);
  public deleteExtracurricular = (id: string) => this.extracurriculars.deleteExtracurricular(id);
  public getMembers = () => this.extracurriculars.getMembers();
  public getMembersByExtracurricularId = (id: string) => this.extracurriculars.getMembersByExtracurricularId(id);

  // Registrations
  public getRegistrations = () => this.registrations.getRegistrations();
  public createRegistration = (data: any) => this.registrations.createRegistration(data);
  public updateRegistrationStatus = (id: string, status: any, reviewerName: string, notes?: string) =>
    this.registrations.updateRegistrationStatus(id, status, reviewerName, notes);

  // Attendance
  public getAttendanceSessions = () => this.attendance.getAttendanceSessions();
  public getAttendanceRecords = () => this.attendance.getAttendanceRecords();
  public createAttendanceSession = (data: any) => this.attendance.createAttendanceSession(data);
  public updateAttendanceRecord = (recordId: string, status: any, notes?: string) =>
    this.attendance.updateAttendanceRecord(recordId, status, notes);

  // Events
  public getSchoolEvents = () => this.events.getSchoolEvents();
  public addSchoolEvent = (event: any) => this.events.addSchoolEvent(event);
  public updateSchoolEvent = (id: string, data: any, userId?: string) =>
    this.events.updateSchoolEvent(id, data, userId);
  public deleteSchoolEvent = (id: string, userId?: string) =>
    this.events.deleteSchoolEvent(id, userId);
  public checkEventConflict = (location: string, start: string, end: string, excludeId?: string) =>
    this.events.checkEventConflict(location, start, end, excludeId);

  // Achievements & Activities
  public getActivities = () => this.achievements.getActivities();
  public getAchievements = () => this.achievements.getAchievements();
  public addAchievement = (data: any) => this.achievements.addAchievement(data);
  public verifyAchievement = (id: string, verifierName: string) => this.achievements.verifyAchievement(id, verifierName);
  public getCertificates = () => this.achievements.getCertificates();
  public addCertificate = (data: any) => this.achievements.addCertificate(data);

  // Verifications
  public getVerifications = () => this.verifications.getVerifications();
  public getVerificationById = (id: string) => this.verifications.getVerificationById(id);
  public generatePortfolioVerification = (studentId: string, verifierName: string) =>
    this.verifications.generatePortfolioVerification(studentId, verifierName);
  public updateVerificationStatus = (id: string, status: any) =>
    this.verifications.updateVerificationStatus(id, status);
}

export const db = new SQLiteDatabaseClient();
export { SQLiteDatabaseClient };
