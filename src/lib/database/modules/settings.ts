import { SchoolSetting } from '@/types';
import * as apiService from '@/lib/api';

export class SettingsModule {
  private settings: SchoolSetting = {
    school_name: 'SMKN 1 Ciomas',
    npsn: '20231417',
    address: 'Jl. Raya Laladon No. 20, Ciomas, Kec. Ciomas, Kab. Bogor, Jawa Barat 16610',
    academic_year: '2025/2026',
    principal_name: 'Drs. H. Mulyadi Kartasasmita, M.Pd.',
    vice_principal_student_affairs: 'Drs. Bambang Suryono',
  };

  private notify: () => void;

  constructor(notify: () => void) {
    this.notify = notify;
  }

  public setSettings(settings: SchoolSetting) {
    this.settings = settings;
  }

  public getSettings(): SchoolSetting {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<SchoolSetting>): { success: boolean; settings: SchoolSetting } {
    this.settings = { ...this.settings, ...newSettings };
    apiService.updateSettingsAPI(newSettings);
    this.notify();
    return { success: true, settings: this.settings };
  }
}
