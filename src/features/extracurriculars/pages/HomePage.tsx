import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Compass,
  UserCheck,
  CheckCircle,
  FileText,
  ShieldCheck,
  ArrowRight,
  Search,
  Calendar,
  Users,
  Trophy,
  ExternalLink,
  BookOpen,
  BellRing,
  HelpCircle,
  ChevronRight,
  Sparkles,
  School,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const settings = db.getSettings();
  const ekskuls = db.getExtracurriculars();
  const achievements = db.getAchievements().filter(a => a.is_verified);
  const [searchVerifyId, setSearchVerifyId] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVerifyId.trim()) {
      onNavigate(`/verify/${encodeURIComponent(searchVerifyId.trim())}`);
    }
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'DISCOVER',
      subtitle: 'Telusuri Minat',
      desc: 'Siswa menjelajahi katalog resmi ekstrakurikuler lengkap dengan silabus, jadwal latihan, kapasitas kuota, dan profil guru pembina.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'REGISTER',
      subtitle: 'Pendaftaran Terpusat',
      desc: 'Pendaftaran dilakukan secara daring tanpa formulir kertas. Sistem mencegah duplikasi pendaftaran dan memvalidasi kapasitas anggota.',
      icon: UserCheck,
    },
    {
      num: '03',
      title: 'ATTEND',
      subtitle: 'Presensi Digital Real-time',
      desc: 'Pengurus mencatat kehadiran di setiap sesi latihan (Hadir, Terlambat, Izin, Alpa) dan diverifikasi oleh guru pembina.',
      icon: CheckCircle,
    },
    {
      num: '04',
      title: 'RECORD & VERIFY',
      subtitle: 'Validasi Prestasi & Peran',
      desc: 'Setiap peran organisasi, kepanitiaan OSIS, kejuaraan, dan sertifikat divalidasi langsung oleh pihak kesiswaan sekolah.',
      icon: ShieldCheck,
    },
    {
      num: '05',
      title: 'BUILD & EXPORT',
      subtitle: 'Portofolio Resmi & QR Code',
      desc: 'Sistem merangkai riwayat non-akademik siswa ke format PDF resmi bertanda tangan digital dengan kode verifikasi QR publik.',
      icon: FileText,
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana cara memverifikasi keabsahan lembar portofolio siswa?',
      a: 'Setiap dokumen portofolio yang diterbitkan sistem memiliki nomor registrasi unik (contoh: EKH-2026-000184) dan QR code. Siapapun dapat memindai QR code tersebut atau memasukkan nomor verifikasi pada kolom verifikasi publik untuk melihat catatan riwayat yang disahkan sekolah.',
    },
    {
      q: 'Apakah presensi ekstrakurikuler mempengaruhi penerbitan portofolio?',
      a: 'Ya. Pihak kesiswaan menetapkan standar minimal kehadiran 80% pada sesi latihan resmi agar keanggotaan dan sertifikat dapat disahkan ke dalam lembar portofolio kelulusan.',
    },
    {
      q: 'Berapa maksimal ekstrakurikuler yang dapat diikuti siswa?',
      a: 'Siswa disarankan mengikuti maksimal 2 ekstrakurikuler aktif agar jadwal latihan tidak berbenturan dan fokus akademik tetap terjaga secara optimal.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Official Announcement Banner (High Visibility) */}
      <div className="bg-[#234B36] text-white py-3.5 px-4 sm:px-8 border-b-2 border-[#1a3828] shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="px-2 py-0.5 rounded bg-white text-[#234B36] text-[11px] font-black uppercase tracking-wider shrink-0">
              PENGUMUMAN RESMI
            </span>
            <span className="text-white/95">
              Pendaftaran Ekstrakurikuler Semester Ganjil TA. 2025/2026 dibuka sampai tanggal <strong>30 September 2026</strong>.
            </span>
          </div>
          <button
            onClick={() => onNavigate('/ekskul')}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#234B36] hover:bg-[#F5F2EA] rounded text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>Daftar Sekarang</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editorial Hero Section */}
      <section className="bg-white border-b border-[#D8D4CC] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E7EFEA] text-[#234B36] border border-[#B7D2C2] text-xs font-bold mb-5">
              <School className="w-3.5 h-3.5" />
              <span>SATUAN PENDIDIKAN RESMI: {settings.school_name.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#171717] leading-[1.15] mb-5">
              Manajemen Ekstrakurikuler, Presensi Digital, dan Portofolio Siswa Terpadu.
            </h1>
            <p className="text-base sm:text-xl text-[#68655F] leading-relaxed mb-8">
              Platform resmi kesiswaan untuk mencatat seluruh rekam jejak kegiatan non-akademik, kepengurusan organisasi, kepanitiaan, serta prestasi kejuaraan siswa menjadi dokumen portofolio sah bertanda tangan digital dan kode verifikasi QR.
            </p>

            <div className="flex flex-wrap items-center justify-start gap-3.5">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('/ekskul')}
                icon={<BookOpen className="w-4 h-4" />}
              >
                Jelajahi Katalog Ekskul
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('/contoh-portofolio')}
                icon={<FileText className="w-4 h-4" />}
              >
                Lihat Contoh Portofolio Resmi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Verification Lookup Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-[#F5F2EA] border border-[#D8D4CC] rounded-lg p-5 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Pengecekan Keaslian Dokumen Portofolio</span>
              </div>
              <p className="text-xs text-[#68655F]">
                Masukkan Kode Verifikasi Institusional (contoh: <code className="font-bold text-[#171717]">EKH-2026-000184</code>) untuk menguji keabsahan riwayat siswa.
              </p>
            </div>
            <form onSubmit={handleVerifySubmit} className="md:col-span-7 flex items-center gap-2">
              <input
                type="text"
                value={searchVerifyId}
                onChange={(e) => setSearchVerifyId(e.target.value)}
                placeholder="Masukkan Nomor Verifikasi (EKH-XXXX-XXXXXX)"
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#D8D4CC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              />
              <Button type="submit" variant="secondary" size="md">
                Verifikasi Dokumen
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Real Core Workflow Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#D8D4CC] pb-4 mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#68655F]">Arsitektur Alur Kerja</div>
          <h2 className="text-2xl font-bold text-[#171717]">Alur Terpadu Dari Pendaftaran Hingga Dokumen Sah</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white border border-[#D8D4CC] rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[#68655F] mb-3">
                    <span className="font-mono text-xs font-bold text-[#234B36]">{step.num}</span>
                    <Icon className="w-4 h-4 text-[#234B36]" />
                  </div>
                  <div className="text-xs font-bold tracking-wider text-[#171717] uppercase mb-0.5">
                    {step.title}
                  </div>
                  <div className="text-xs font-semibold text-[#234B36] mb-2">{step.subtitle}</div>
                  <p className="text-xs text-[#68655F] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Extracurriculars Catalog Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8D4CC] pb-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#68655F]">Katalog Pilihan</div>
            <h2 className="text-2xl font-bold text-[#171717]">Ekstrakurikuler Unggulan Semester Ini</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/ekskul')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Lihat Semua {ekskuls.length} Ekstrakurikuler
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ekskuls.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#D8D4CC] rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#234B36] transition-colors"
            >
              <div>
                <div className="h-40 overflow-hidden relative bg-[#EAE6DC]">
                  <img
                    src={item.profile_image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="neutral">{item.category}</Badge>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant={item.registration_status === 'open' ? 'success' : 'danger'}>
                      {item.registration_status === 'open' ? 'Pendaftaran Dibuka' : 'Kuota Penuh'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-[#171717] mb-1 line-clamp-1 group-hover:text-[#234B36] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#68655F] line-clamp-2 mb-3 leading-relaxed">
                    {item.short_description}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-[#68655F] border-t border-[#D8D4CC] pt-3">
                    <div className="flex items-center justify-between">
                      <span>Pembina:</span>
                      <span className="font-medium text-[#171717]">{item.supervisor_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jadwal:</span>
                      <span className="font-medium text-[#171717] truncate max-w-[140px]">{item.practice_schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kapasitas:</span>
                      <span className="font-medium text-[#171717]">{item.current_member_count} / {item.member_capacity} Siswa</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => onNavigate(`/ekskul/${item.slug}`)}
                >
                  Detail & Registrasi
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Achievements & School Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 bg-white border border-[#D8D4CC] rounded-lg p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
              Data Institusi
            </div>
            <h3 className="text-lg font-bold text-[#171717] mb-4">Informasi Satuan Pendidikan</h3>
            <div className="space-y-3 text-xs text-[#68655F]">
              <div>
                <span className="block text-[10px] font-semibold text-[#171717] uppercase">Nama Sekolah</span>
                <span className="text-[#171717] font-medium">{settings.school_name}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-[#171717] uppercase">NPSN Resmi</span>
                <span className="text-[#171717] font-medium">{settings.npsn}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-[#171717] uppercase">Alamat Kampus</span>
                <span className="text-[#171717] font-medium">{settings.address}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-[#171717] uppercase">Kepala Sekolah</span>
                <span className="text-[#171717] font-medium">{settings.principal_name}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-[#171717] uppercase">Wakasek Bid. Kesiswaan</span>
                <span className="text-[#171717] font-medium">{settings.vice_principal_student_affairs}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-[#D8D4CC] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D8D4CC]">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#234B36]">Papan Prestasi Terkini</div>
                <h3 className="text-lg font-bold text-[#171717]">Kejuaraan Terverifikasi Kesiswaan</h3>
              </div>
              <Trophy className="w-5 h-5 text-[#B58A32]" />
            </div>

            <div className="space-y-3">
              {achievements.slice(0, 3).map((ach) => (
                <div
                  key={ach.id}
                  className="p-3.5 border border-[#D8D4CC] rounded bg-[#F5F2EA]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#171717]">{ach.title}</span>
                      <Badge variant="warning">{ach.rank}</Badge>
                      <Badge variant="neutral">{ach.level}</Badge>
                    </div>
                    <div className="text-xs text-[#68655F]">
                      {ach.competition_name} • Oleh <span className="font-semibold text-[#171717]">{ach.student_name}</span> ({ach.extracurricular_name})
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-[#234B36] font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Terverifikasi</span>
                    </div>
                    <div className="text-[10px] text-[#68655F]">{ach.achievement_date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#D8D4CC] rounded-lg p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
              Pusat Bantuan & Regulasi
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="divide-y divide-[#D8D4CC] border-t border-[#D8D4CC]">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#171717] hover:text-[#234B36] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#68655F] transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <p className="mt-2 text-xs text-[#68655F] leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
