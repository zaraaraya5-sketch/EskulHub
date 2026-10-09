import { Extracurricular, ExtracurricularMember } from '@/types';
import * as apiService from '@/lib/api';

const INITIAL_EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 'eks-1',
    name: 'Futsal',
    slug: 'futsal',
    category: 'Olahraga',
    short_description: 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal pelajar antarsekolah.',
    full_description: 'Ekstrakurikuler Futsal memfokuskan pada pengembangan teknik passing, dribbling, strategi taktik modern, pembentukan ketahanan fisik prima, serta pembinaan mental juara dalam turnamen antarsekolah.',
    profile_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Rizky Ramadhan',
    practice_schedule: 'Setiap Selasa & Sabtu (15:30 - 17:30 WIB)',
    location: 'Lapangan Futsal SMKN 1 Ciomas',
    member_capacity: 30,
    current_member_count: 24,
    registration_status: 'open',
    achievements_count: 5,
  },
  {
    id: 'eks-2',
    name: 'Basket',
    slug: 'basket',
    category: 'Olahraga',
    short_description: 'Pelatihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.',
    full_description: 'Ekstrakurikuler Basket melatih ketangkasan dribbling, passing, shooting, defense solid, dan kerja sama tim solid dalam turnamen antarpelajar se-Kabupaten Bogor.',
    profile_image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Kevin Sanjaya',
    practice_schedule: 'Setiap Rabu & Sabtu (15:30 - 17:30 WIB)',
    location: 'Lapangan Basket Outdoor SMKN 1 Ciomas',
    member_capacity: 30,
    current_member_count: 26,
    registration_status: 'open',
    achievements_count: 4,
  },
  {
    id: 'eks-3',
    name: 'Voli',
    slug: 'voli',
    category: 'Olahraga',
    short_description: 'Pengembangan teknik passing, servis presisi, smash tajam, dan kekompakan tim bola voli.',
    full_description: 'Ekstrakurikuler Voli melatih teknik dasar passing atas/bawah, variasi servis menukik, pertahanan receive solid, serta kombinasi spike tajam untuk kejuaraan voli pelajar.',
    profile_image: '/images/voli.jpeg',
    supervisor_name: 'Agus Setiawan, S.Pd.',
    chairperson_name: 'Dimas Pratama',
    practice_schedule: 'Setiap Senin & Kamis (15:30 - 17:30 WIB)',
    location: 'Lapangan Voli SMKN 1 Ciomas',
    member_capacity: 25,
    current_member_count: 20,
    registration_status: 'open',
    achievements_count: 3,
  },
  {
    id: 'eks-4',
    name: 'Paskibra',
    slug: 'paskibra',
    category: 'Kepemimpinan',
    short_description: 'Penempaan kedisiplinan mental, baris-berbaris (PBB) presisi, dan kepemimpinan bela negara.',
    full_description: 'Ekstrakurikuler Paskibra melatih ketahanan fisik, kekompakan langkah tegap, formasi variasi PBB indah, serta kesiapan tugas pengibaran bendera hari besar kenegaraan.',
    profile_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tBV8kDQOfViGAslYLp1_hJ4v-QxTURbwOSeOu9MR2HDzTgdZpWHVmyMM&s=10',
    supervisor_name: 'Dedi Kurniawan, S.Pd.',
    chairperson_name: 'Farhan Ramadhan',
    practice_schedule: 'Setiap Selasa & Kamis (15:30 - 17:30 WIB)',
    location: 'Lapangan Upacara Utama SMKN 1 Ciomas',
    member_capacity: 35,
    current_member_count: 28,
    registration_status: 'open',
    achievements_count: 6,
  },
  {
    id: 'eks-5',
    name: 'Pramuka',
    slug: 'pramuka',
    category: 'Kepemimpinan',
    short_description: 'Kepanduan, penjelajahan alam, tali-temali pioneering, dan kemandirian karakter pemuda.',
    full_description: 'Gugus Depan Pramuka menanamkan Dasa Darma melalui kegiatan survival alam terbuka, pioneering menara/jembatan, sandi morse/semapur, perkemahan, dan pengabdian masyarakat.',
    profile_image: '/images/pramuka.jpeg',
    supervisor_name: 'Bambang Supriyadi, S.Pd.',
    chairperson_name: 'Aditya Pratama',
    practice_schedule: 'Setiap Jumat (15:30 - 17:30 WIB)',
    location: 'Area Terbuka & Lapangan SMKN 1 Ciomas',
    member_capacity: 40,
    current_member_count: 32,
    registration_status: 'open',
    achievements_count: 5,
  },
  {
    id: 'eks-6',
    name: 'PMR',
    slug: 'pmr',
    category: 'Kemanusiaan',
    short_description: 'Pertolongan pertama (P3K), kesiapsiagaan darurat medis, tandu darurat, dan aksi kemanusiaan.',
    full_description: 'Palang Merah Remaja (PMR) melatih ketanggapdaruratan medis, balut bidai, evakuasi tandu, perawatan keluarga, kesiapan tanggap bencana, serta bakti donor darah.',
    profile_image: '/images/PMR.jpeg',
    supervisor_name: 'Rina Marlina, S.Kep.',
    chairperson_name: 'Nabila Safitri',
    practice_schedule: 'Setiap Sabtu (08:30 - 11:00 WIB)',
    location: 'Ruang UKS & Lapangan SMKN 1 Ciomas',
    member_capacity: 30,
    current_member_count: 22,
    registration_status: 'open',
    achievements_count: 4,
  },
  {
    id: 'eks-7',
    name: 'Rohis',
    slug: 'rohis',
    category: 'Keagamaan',
    short_description: 'Pembinaan akhlak mulia, kajian inspiratif keislaman, tahsin Al-Qur\'an, dan kepedulian sosial.',
    full_description: 'Rohani Islam (Rohis) mempererat ukhuwah islamiyah melalui mentoring akhlak, pendalaman ilmu agama, tadarus dan tahsin Al-Qur\'an, peringatan hari besar Islam, dan aksi kepedulian sesama.',
    profile_image: '/images/Rohis.jpeg',

    supervisor_name: 'Ustadz Ahmad Fauzi, S.Ag.',
    chairperson_name: 'Muhammad Ilham',
    practice_schedule: 'Setiap Jumat (13:00 - 15:00 WIB)',
    location: 'Masjid Al-Kautsar SMKN 1 Ciomas',
    member_capacity: 35,
    current_member_count: 29,
    registration_status: 'open',
    achievements_count: 3,
  },
  {
    id: 'eks-8',
    name: 'English Club',
    slug: 'english-club',
    category: 'Bahasa & Literasi',
    short_description: 'Membangun kepercayaan diri berbahasa Inggris melalui public speaking, debate, dan storytelling.',
    full_description: 'English Club memfasilitasi siswa dalam mengasah speaking fluency, speech competition, English parliamentary debate, persiapan uji kompetensi bahasa, dan penulisan kreatif global.',
    profile_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    supervisor_name: 'Sarah Oktaviani, S.Pd.',
    chairperson_name: 'Amanda Putri',
    practice_schedule: 'Setiap Rabu (15:30 - 17:00 WIB)',
    location: 'Laboratorium Bahasa SMKN 1 Ciomas',
    member_capacity: 25,
    current_member_count: 21,
    registration_status: 'open',
    achievements_count: 5,
  },
];

export class ExtracurricularsModule {
  private extracurriculars: Extracurricular[] = [...INITIAL_EXTRACURRICULARS];
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
    data: Omit<Extracurricular, 'id' | 'current_member_count' | 'slug'> & { slug?: string; id?: string }
  ): { success: boolean; message: string; ekskul?: Extracurricular } {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newEkskul: Extracurricular = {
      ...data,
      id: data.id || `eks-${Date.now()}`,
      slug,
      current_member_count: 0,
      achievements_count: 0,
    };
    this.extracurriculars.push(newEkskul);
    this.notify();

    apiService.createEkskulAPI(newEkskul).then((res) => {
      if (res && res.ekskul) {
        const idx = this.extracurriculars.findIndex((e) => e.id === newEkskul.id || e.slug === newEkskul.slug);
        if (idx !== -1) {
          this.extracurriculars[idx] = { ...this.extracurriculars[idx], ...res.ekskul };
        }
        this.notify();
      }
    }).catch(console.error);

    return { success: true, message: `Ekstrakurikuler "${newEkskul.name}" berhasil ditambahkan!`, ekskul: newEkskul };
  }

  public async addExtracurricularAsync(
    data: Omit<Extracurricular, 'id' | 'current_member_count' | 'slug'> & { slug?: string; id?: string }
  ): Promise<{ success: boolean; message: string; ekskul?: Extracurricular }> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newEkskul: Extracurricular = {
      ...data,
      id: data.id || `eks-${Date.now()}`,
      slug,
      current_member_count: 0,
      achievements_count: 0,
    };

    try {
      const res = await apiService.createEkskulAPI(newEkskul);
      if (res && res.ekskul) {
        const created = res.ekskul as Extracurricular;
        const exists = this.extracurriculars.some((e) => e.id === created.id);
        if (!exists) {
          this.extracurriculars.push(created);
        } else {
          const idx = this.extracurriculars.findIndex((e) => e.id === created.id);
          this.extracurriculars[idx] = created;
        }
        this.notify();
        return { success: true, message: `Ekstrakurikuler "${created.name}" berhasil ditambahkan!`, ekskul: created };
      }
    } catch (err) {
      console.warn('Backend creation failed, falling back to local memory:', err);
    }

    // Fallback: local memory
    this.extracurriculars.push(newEkskul);
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
