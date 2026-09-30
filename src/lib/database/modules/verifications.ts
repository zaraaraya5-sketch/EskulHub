import { PortfolioVerification } from '@/types';
import * as apiService from '@/lib/api';
import { UsersModule } from './users';
import { ExtracurricularsModule } from './extracurriculars';
import { AttendanceModule } from './attendance';
import { AchievementsModule } from './achievements';
import { SettingsModule } from './settings';

export class VerificationsModule {
  private verifications: PortfolioVerification[] = [];
  private usersModule: UsersModule;
  private extracurricularsModule: ExtracurricularsModule;
  private attendanceModule: AttendanceModule;
  private achievementsModule: AchievementsModule;
  private settingsModule: SettingsModule;
  private notify: () => void;

  constructor(
    usersModule: UsersModule,
    extracurricularsModule: ExtracurricularsModule,
    attendanceModule: AttendanceModule,
    achievementsModule: AchievementsModule,
    settingsModule: SettingsModule,
    notify: () => void
  ) {
    this.usersModule = usersModule;
    this.extracurricularsModule = extracurricularsModule;
    this.attendanceModule = attendanceModule;
    this.achievementsModule = achievementsModule;
    this.settingsModule = settingsModule;
    this.notify = notify;
  }

  public setVerifications(verifications: PortfolioVerification[]) {
    this.verifications = verifications;
  }

  public getVerifications(): PortfolioVerification[] {
    return this.verifications;
  }

  public getVerificationById(verificationId: string): PortfolioVerification | undefined {
    return this.verifications.find(
      (v) => v.verification_id.toLowerCase() === verificationId.toLowerCase()
    );
  }

  public generatePortfolioVerification(studentId: string, verifierName: string): PortfolioVerification {
    const student = this.usersModule.getUserById(studentId);
    const existing = this.verifications.find((v) => v.student_id === studentId);
    if (existing) return existing;

    const studentMemberships = this.extracurricularsModule
      .getMembers()
      .filter((m) => m.student_id === studentId);
    const studentAchievements = this.achievementsModule
      .getAchievements()
      .filter((a) => a.student_id === studentId && a.is_verified);
    const studentRecords = this.attendanceModule
      .getAttendanceRecords()
      .filter((r) => r.student_id === studentId);
    const attendedCount = studentRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
    const rate =
      studentRecords.length > 0 ? Math.round((attendedCount / studentRecords.length) * 100) + '%' : '100%';

    const verificationId = `EKH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newVer: PortfolioVerification = {
      id: `ver-${Date.now()}`,
      student_id: studentId,
      student_name: student?.name || 'Siswa',
      student_nisn: '0067823910',
      student_class: 'XII RPL 1',
      school_name: this.settingsModule.getSettings().school_name,
      verification_id: verificationId,
      academic_year: this.settingsModule.getSettings().academic_year,
      issue_date: new Date().toISOString().split('T')[0],
      status: 'verified',
      qr_code_url: `/verify/${verificationId}`,
      verified_by_name: verifierName,
      summary_data: {
        total_ekskul: studentMemberships.length,
        total_attendance_rate: rate,
        verified_achievements_count: studentAchievements.length,
        active_roles: studentMemberships.map(
          (m) =>
            `${m.role} di ${
              this.extracurricularsModule.getExtracurricularById(m.extracurricular_id)?.name || 'Ekskul'
            }`
        ),
        ekskul_list: studentMemberships.map((m) => ({
          name: this.extracurricularsModule.getExtracurricularById(m.extracurricular_id)?.name || 'Ekskul',
          role: m.role,
          period: '2024 - 2026',
        })),
        achievements: studentAchievements.map((a) => ({
          title: a.title,
          level: a.level,
          rank: a.rank,
          year: a.achievement_date.substring(0, 4),
        })),
        committee_roles: [
          { title: 'Panitia PORSENI SMK Nusantara Digital', role: 'Koordinator Dokumentasi', year: '2026' },
        ],
      },
    };

    this.verifications.push(newVer);
    apiService.saveVerificationAPI(newVer);
    this.notify();
    return newVer;
  }

  public updateVerificationStatus(
    verificationId: string,
    status: 'valid' | 'revoked' | 'pending'
  ): { success: boolean; message: string } {
    const ver = this.verifications.find(
      (v) => v.verification_id.toLowerCase() === verificationId.toLowerCase()
    );
    if (!ver) return { success: false, message: 'Dokumen verifikasi tidak ditemukan.' };
    ver.status = status as any;
    apiService.saveVerificationAPI(ver);
    this.notify();
    return { success: true, message: `Status dokumen ${verificationId} berhasil diperbarui.` };
  }
}
