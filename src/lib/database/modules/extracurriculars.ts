import { Extracurricular, ExtracurricularMember } from '@/types';
import * as apiService from '@/lib/api';

const INITIAL_EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 'eks-1',
    name: 'Futsal Garuda Nusantara',
    slug: 'futsal',
    category: 'Olahraga',
    short_description: 'Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal antar-sekolah.',
    full_description: 'Ekstrakurikuler Futsal Garuda Nusantara memfokuskan pada pengembangan teknik dasar, strategi taktik modern, pembentukan ketahanan fisik, serta pembinaan mental juara.',
    profile_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Rizky Ramadhan',
    practice_schedule: 'Setiap Selasa & Sabtu (15:30 - 17:30 WIB)',
    location: 'Lapangan Olahraga Utama',
    member_capacity: 30,
    current_member_count: 24,
    registration_status: 'open',
    achievements_count: 5,
  },
  {
    id: 'eks-2',
    name: 'Programming & Cyber Club',
    slug: 'programming-club',
    category: 'Sains & Teknologi',
    short_description: 'Eksplorasi pembuatan aplikasi web, kecerdasan buatan, algoritma kompetisi, dan keamanan siber.',
    full_description: 'Programming Club berfokus pada pendalaman rekayasa perangkat lunak modern, pengembangan web berbasis framework, pemecahan masalah algoritma competitive programming.',
    profile_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Aditya Nugraha',
    practice_schedule: 'Setiap Rabu & Jumat (15:30 - 17:00 WIB)',
    location: 'Laboratorium Komputer RPL 1',
    member_capacity: 25,
    current_member_count: 22,
    registration_status: 'open',
    achievements_count: 7,
  },
  {
    id: 'eks-3',
    name: 'Fotografi & Sinematografi Citra',
    slug: 'fotografi',
    category: 'Seni & Budaya',
    short_description: 'Mempelajari teknik komposisi visual, tata cahaya, editing digital, dan produksi video sekolah.',
    full_description: 'Mewadahi minat siswa di bidang karya visual, mulai dari penguasaan kamera mirrorless/DSLR, komposisi pencahayaan studio, street photography.',
    profile_image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Siti Nurhaliza',
    practice_schedule: 'Setiap Kamis (15:30 - 17:30 WIB)',
    location: 'Studio Multimedia & Alam Terbuka',
    member_capacity: 20,
    current_member_count: 18,
    registration_status: 'open',
    achievements_count: 3,
  },
  {
    id: 'eks-4',
    name: 'Teater Citra Nusa',
    slug: 'teater',
    category: 'Seni & Budaya',
    short_description: 'Pengasahan olah vokal, gestur tubuh, penulisan naskah drama, dan seni pertunjukan panggung.',
    full_description: 'Teater Citra Nusa melatih rasa percaya diri, artikulasi berbicara di depan umum, penghayatan karakter, serta kerja tim produksi panggung.',
    profile_image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Aulia Rahma',
    practice_schedule: 'Setiap Senin & Kamis (15:30 - 17:30 WIB)',
    location: 'Aula Serbaguna Lantai 3',
    member_capacity: 25,
    current_member_count: 15,
    registration_status: 'open',
    achievements_count: 4,
  },
  {
    id: 'eks-5',
    name: 'Basket Nusantara Club',
    slug: 'basket',
    category: 'Olahraga',
    short_description: 'Latihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.',
    full_description: 'Ekstrakurikuler Bola Basket menanamkan kedisiplinan tinggi, latihan fundamental passing, dribbling, shooting, serta simulasi game pertandingan intensif.',
    profile_image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Kevin Sanjaya',
    practice_schedule: 'Setiap Rabu & Sabtu (15:30 - 17:30 WIB)',
    location: 'Lapangan Basket Outdoor',
    member_capacity: 30,
    current_member_count: 26,
    registration_status: 'open',
    achievements_count: 2,
  },
  {
    id: 'eks-6',
    name: 'Jurnalistik & Mading Digital',
    slug: 'jurnalistik',
    category: 'Bahasa & Literasi',
    short_description: 'Peliputan berita sekolah, penulisan opini kritis, publikasi buletin, dan pengelolaan portal berita.',
    full_description: 'Klub Jurnalistik bertugas meliput seluruh agenda kegiatan sekolah, mewawancarai narasumber, menulis berita faktual, serta mendesain buletin bulanan cetak.',
    profile_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Fadhil Pratama',
    practice_schedule: 'Setiap Selasa (15:30 - 17:00 WIB)',
    location: 'Ruang Redaksi Jurnalistik',
    member_capacity: 20,
    current_member_count: 14,
    registration_status: 'open',
    achievements_count: 3,
  },
  {
    id: 'eks-7',
    name: 'Robotika & Otomasi IoT',
    slug: 'robotik',
    category: 'Sains & Teknologi',
    short_description: 'Perakitan robot mikrokontroler Arduino/ESP32, sensorik cerdas, dan Internet of Things.',
    full_description: 'Mempelajari arsitektur elektronika dasar, pemrograman mikrokontroler, perakitan line follower, robot pemadam api, serta perangkat otomasi berbasis IoT.',
    profile_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    supervisor_name: 'Dewi Lestari, M.Kom.',
    chairperson_name: 'Bima Sakti',
    practice_schedule: 'Setiap Jumat (15:30 - 17:30 WIB)',
    location: 'Laboratorium Mekatronika',
    member_capacity: 20,
    current_member_count: 20,
    registration_status: 'closed',
    achievements_count: 6,
  },
  {
    id: 'eks-8',
    name: 'Musik & Ensambel Nusantara',
    slug: 'musik',
    category: 'Seni & Budaya',
    short_description: 'Eksplorasi band modern dipadukan dengan harmoni alat musik tradisional Nusantara.',
    full_description: 'Ekstrakurikuler Musik memfasilitasi instrumen keyboard, gitar akustik/elektrik, bass, drum, serta kolaborasi alat musik tradisional seperti angklung.',
    profile_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    supervisor_name: 'Hendra Wijaya, S.Pd.',
    chairperson_name: 'Nadya Zulaikha',
    practice_schedule: 'Setiap Sabtu (09:00 - 12:00 WIB)',
    location: 'Ruang Kedap Suara Musik',
    member_capacity: 20,
    current_member_count: 16,
    registration_status: 'open',
    achievements_count: 4,
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
