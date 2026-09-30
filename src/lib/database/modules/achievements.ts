import { Activity, Achievement, Certificate } from '@/types';
import * as apiService from '@/lib/api';

export class AchievementsModule {
  private activities: Activity[] = [];
  private achievements: Achievement[] = [];
  private certificates: Certificate[] = [];
  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setActivities(activities: Activity[]) {
    this.activities = activities;
  }

  public setAchievements(achievements: Achievement[]) {
    this.achievements = achievements;
  }

  public setCertificates(certificates: Certificate[]) {
    this.certificates = certificates;
  }

  public getActivities(): Activity[] {
    return this.activities;
  }

  public getAchievements(): Achievement[] {
    return this.achievements;
  }

  public addAchievement(data: Omit<Achievement, 'id' | 'is_verified'>) {
    const newAch: Achievement = {
      ...data,
      id: `ach-${Date.now()}`,
      is_verified: false,
    };
    this.achievements.unshift(newAch);
    apiService.createAchievementAPI(newAch);
    this.notify();
    return { success: true, achievement: newAch };
  }

  public verifyAchievement(id: string, verifierName: string): { success: boolean; message?: string } {
    const ach = this.achievements.find((a) => a.id === id);
    if (!ach) return { success: false, message: 'Prestasi tidak ditemukan' };
    ach.is_verified = true;
    ach.verified_by_name = verifierName;
    ach.verified_at = new Date().toISOString();
    apiService.verifyAchievementAPI(id, verifierName);
    this.notify();
    return { success: true };
  }

  public getCertificates(): Certificate[] {
    return this.certificates;
  }

  public addCertificate(data: Omit<Certificate, 'id' | 'is_verified'> & { is_verified?: boolean }) {
    const newCert: Certificate = {
      ...data,
      id: `cert-${Date.now()}`,
      is_verified: data.is_verified ?? false,
    };
    this.certificates.unshift(newCert);
    apiService.createCertificateAPI(newCert);
    this.notify();
    return { success: true, certificate: newCert };
  }
}
