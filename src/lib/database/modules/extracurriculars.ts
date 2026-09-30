import { Extracurricular, ExtracurricularMember } from '@/types';
import * as apiService from '@/lib/api';

export class ExtracurricularsModule {
  private extracurriculars: Extracurricular[] = [];
  private members: ExtracurricularMember[] = [];
  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setExtracurriculars(ekskuls: Extracurricular[]) {
    this.extracurriculars = ekskuls;
  }

  public setMembers(members: ExtracurricularMember[]) {
    this.members = members;
  }

  public getExtracurriculars(): Extracurricular[] {
    return this.extracurriculars;
  }

  public getExtracurricularBySlug(slug: string): Extracurricular | undefined {
    return this.extracurriculars.find((e) => e.slug === slug);
  }

  public getExtracurricularById(id: string): Extracurricular | undefined {
    return this.extracurriculars.find((e) => e.id === id);
  }

  public addExtracurricular(
    data: Omit<Extracurricular, 'id' | 'current_member_count' | 'slug'> & { slug?: string }
  ): { success: boolean; message: string; ekskul?: Extracurricular } {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newEkskul: Extracurricular = {
      ...data,
      id: `eks-${Date.now()}`,
      slug,
      current_member_count: 0,
      achievements_count: 0,
    };
    this.extracurriculars.push(newEkskul);
    apiService.createEkskulAPI(newEkskul);
    this.notify();
    return { success: true, message: `Ekstrakurikuler "${newEkskul.name}" berhasil ditambahkan!`, ekskul: newEkskul };
  }

  public updateExtracurricular(id: string, data: Partial<Extracurricular>): { success: boolean; message: string } {
    const idx = this.extracurriculars.findIndex((e) => e.id === id);
    if (idx === -1) return { success: false, message: 'Ekstrakurikuler tidak ditemukan' };
    this.extracurriculars[idx] = { ...this.extracurriculars[idx], ...data };
    apiService.updateEkskulAPI(id, data);
    this.notify();
    return { success: true, message: 'Data ekstrakurikuler berhasil diperbarui!' };
  }

  public deleteExtracurricular(id: string): { success: boolean; message: string } {
    const ekskul = this.extracurriculars.find((e) => e.id === id);
    if (!ekskul) return { success: false, message: 'Ekstrakurikuler tidak ditemukan' };
    this.extracurriculars = this.extracurriculars.filter((e) => e.id !== id);
    apiService.deleteEkskulAPI(id);
    this.notify();
    return { success: true, message: `Ekstrakurikuler "${ekskul.name}" berhasil dihapus!` };
  }

  public getMembers(): ExtracurricularMember[] {
    return this.members;
  }

  public getMembersByExtracurricularId(id: string): ExtracurricularMember[] {
    return this.members.filter((m) => m.extracurricular_id === id);
  }

  public addLocalMember(member: ExtracurricularMember) {
    this.members.push(member);
    const ekskul = this.getExtracurricularById(member.extracurricular_id);
    if (ekskul) {
      ekskul.current_member_count += 1;
    }
  }
}
