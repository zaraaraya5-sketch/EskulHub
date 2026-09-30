import { ExtracurricularRegistration, ExtracurricularMember } from '@/types';
import * as apiService from '@/lib/api';
import { ExtracurricularsModule } from './extracurriculars';

export class RegistrationsModule {
  private registrations: ExtracurricularRegistration[] = [];
  private extracurricularsModule: ExtracurricularsModule;
  private notify: () => void;

  constructor(extracurricularsModule: ExtracurricularsModule, notify: () => void) {
    this.extracurricularsModule = extracurricularsModule;
    this.notify = notify;
  }

  public setRegistrations(registrations: ExtracurricularRegistration[]) {
    this.registrations = registrations;
  }

  public getRegistrations(): ExtracurricularRegistration[] {
    return this.registrations;
  }

  public createRegistration(data: {
    extracurricular_id: string;
    student_id: string;
    student_name: string;
    student_class: string;
    student_nisn: string;
    reason: string;
  }): { success: boolean; message: string; registration?: ExtracurricularRegistration } {
    const ekskul = this.extracurricularsModule.getExtracurricularById(data.extracurricular_id);
    if (!ekskul) return { success: false, message: 'Ekstrakurikuler tidak ditemukan' };

    const newReg: ExtracurricularRegistration = {
      id: `reg-${Date.now()}`,
      extracurricular_id: data.extracurricular_id,
      extracurricular_name: ekskul.name,
      student_id: data.student_id,
      student_name: data.student_name,
      student_class: data.student_class,
      student_nisn: data.student_nisn,
      registration_date: new Date().toISOString(),
      status: 'pending',
      reason: data.reason,
    };

    this.registrations.unshift(newReg);
    apiService.createRegistrationAPI(newReg);
    this.notify();
    return { success: true, message: 'Pendaftaran berhasil dikirimkan!', registration: newReg };
  }

  public updateRegistrationStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewerName: string,
    notes?: string
  ): { success: boolean; message: string } {
    const reg = this.registrations.find((r) => r.id === id);
    if (!reg) return { success: false, message: 'Pendaftaran tidak ditemukan' };

    reg.status = status;
    reg.reviewer_name = reviewerName;
    reg.reviewed_at = new Date().toISOString();
    if (notes) reg.notes = notes;

    if (status === 'approved') {
      const existingMem = this.extracurricularsModule
        .getMembers()
        .find((m) => m.extracurricular_id === reg.extracurricular_id && m.student_id === reg.student_id);

      if (!existingMem) {
        const newMem: ExtracurricularMember = {
          id: `mem-${Date.now()}`,
          extracurricular_id: reg.extracurricular_id,
          student_id: reg.student_id,
          student_name: reg.student_name,
          student_nisn: reg.student_nisn,
          student_class: reg.student_class,
          role: 'Anggota',
          joined_at: new Date().toISOString().split('T')[0],
          status: 'active',
        };
        this.extracurricularsModule.addLocalMember(newMem);
      }
    }

    apiService.updateRegistrationStatusAPI(id, status, reviewerName, notes);
    this.notify();
    return { success: true, message: `Pendaftaran berhasil di-${status === 'approved' ? 'setujui' : 'tolak'}` };
  }
}
