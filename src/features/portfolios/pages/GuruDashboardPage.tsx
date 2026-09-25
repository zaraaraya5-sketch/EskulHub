import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  GraduationCap,
  Award,
  CheckCircle,
  FileText,
  Printer,
  Search,
  Filter,
  Users,
  Star,
  CheckSquare
} from 'lucide-react';

interface StudentGradeRecord {
  id: string;
  name: string;
  nisn: string;
  className: string;
  ekskulCount: number;
  primaryEkskul: string;
  attendancePct: number;
  characterGrade: 'Sangat Baik (A)' | 'Baik (B)' | 'Cukup (C)';
  status: 'Tervalidasi' | 'Menunggu Verifikasi';
  notes: string;
}

export const GuruDashboardPage: React.FC<{ onNavigate?: (path: string) => void, currentPath?: string }> = ({ onNavigate, currentPath = '/guru/dashboard' }) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('XII RPL 1');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Classroom student grade records
  const [studentGrades, setStudentGrades] = useState<StudentGradeRecord[]>([
    {
      id: 'usr-student-1',
      name: 'Budi Pratama',
      nisn: '0067823910',
      className: 'XII RPL 1',
      ekskulCount: 2,
      primaryEkskul: 'Programming & Cyber Club',
      attendancePct: 96,
      characterGrade: 'Sangat Baik (A)',
      status: 'Tervalidasi',
      notes: 'Aktif menjuarai LKS Kota Bandung dan konsisten hadir.',
    },
    {
      id: 'usr-student-2',
      name: 'Aisyah Putri Azzahra',
      nisn: '0068192341',
      className: 'XII RPL 1',
      ekskulCount: 1,
      primaryEkskul: 'PMR & KSR Wira',
      attendancePct: 92,
      characterGrade: 'Sangat Baik (A)',
      status: 'Tervalidasi',
      notes: 'Kedisiplinan pertolongan pertama sangat menonjol.',
    },
    {
      id: 'usr-student-3',
      name: 'Dimas Setiawan',
      nisn: '0065418290',
      className: 'XII RPL 1',
      ekskulCount: 1,
      primaryEkskul: 'Futsal Garuda Nusantara',
      attendancePct: 88,
      characterGrade: 'Baik (B)',
      status: 'Tervalidasi',
      notes: 'Partisipasi baik dalam kejuaraan regional.',
    },
    {
      id: 'usr-student-4',
      name: 'Siti Nurhaliza',
      nisn: '0069283741',
      className: 'XII RPL 1',
      ekskulCount: 1,
      primaryEkskul: 'Tari Tradisional & Saman',
      attendancePct: 94,
      characterGrade: 'Sangat Baik (A)',
      status: 'Menunggu Verifikasi',
      notes: 'Penampilan memukau pada Dies Natalis sekolah.',
    },
    {
      id: 'usr-student-5',
      name: 'Farhan Maulana',
      nisn: '0061928374',
      className: 'XII RPL 1',
      ekskulCount: 2,
      primaryEkskul: 'Robotika & Otomasi IoT',
      attendancePct: 85,
      characterGrade: 'Baik (B)',
      status: 'Menunggu Verifikasi',
      notes: 'Fokus dalam pembuatan prototipe mikrokontroler.',
    },
  ]);

  const handleVerifyGrade = (id: string) => {
    setStudentGrades(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'Tervalidasi' } : item
      )
    );
  };

  const filteredList = studentGrades.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm);
    const matchClass = selectedClass === 'all' || s.className === selectedClass;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#8C6819] mb-1">
            Portal Guru Wali Kelas & Penilai Raport • {currentUser?.name || 'Dra. Hj. Sri Wahyuni, M.Pd.'}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            {currentPath.includes('students') ? 'Data Siswa Kelas' : 
             currentPath.includes('grades') ? 'Rekap Nilai Ekstrakurikuler' : 
             currentPath.includes('verification') ? 'Verifikasi Nilai Raport' : 
             'Penilaian Karakter & Rekapitulasi Portofolio Kelas'}
          </h1>
          <p className="text-xs text-[#68655F] mt-0.5">
            Mengesahkan predikat kegiatan ekstrakurikuler serta nilai pengembangan diri siswa untuk pelaporan buku induk / raport.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintModalOpen(true)}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Cetak Leger Nilai Ekskul
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar with Solid Ochre Gold Palette (No blue, no purple) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAE6DC] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68655F]">
              Wali Kelas
            </span>
            <Users className="w-4 h-4 text-[#8C6819]" />
          </div>
          <div className="text-xl font-bold text-[#171717] mt-1">{selectedClass}</div>
          <div className="text-[11px] text-[#68655F] mt-0.5">36 Siswa Terdaftar</div>
        </div>

        <div className="bg-white border border-[#EAE6DC] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68655F]">
              Rata-rata Presensi
            </span>
            <CheckSquare className="w-4 h-4 text-[#234B36]" />
          </div>
          <div className="text-xl font-bold text-[#234B36] mt-1">91.8%</div>
          <div className="text-[11px] text-[#68655F] mt-0.5">Standar kelulusan min. 80%</div>
        </div>

        <div className="bg-white border border-[#EAE6DC] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68655F]">
              Portofolio Disahkan
            </span>
            <CheckCircle className="w-4 h-4 text-[#8C6819]" />
          </div>
          <div className="text-xl font-bold text-[#171717] mt-1">
            {studentGrades.filter(s => s.status === 'Tervalidasi').length} / {studentGrades.length}
          </div>
          <div className="text-[11px] text-[#68655F] mt-0.5">Siap dicetak di raport</div>
        </div>

        <div className="bg-white border border-[#EAE6DC] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68655F]">
              Siswa Berprestasi
            </span>
            <Award className="w-4 h-4 text-[#B84A3A]" />
          </div>
          <div className="text-xl font-bold text-[#B84A3A] mt-1">7 Medali</div>
          <div className="text-[11px] text-[#68655F] mt-0.5">Tingkat Kota & Provinsi</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#68655F]" />
          <input
            type="text"
            placeholder="Cari nama siswa atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#8C6819]"
          />
        </div>

        <div className="w-full sm:w-44">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#8C6819]"
          >
            <option value="XII RPL 1">Kelas XII RPL 1</option>
            <option value="XII RPL 2">Kelas XII RPL 2</option>
            <option value="XI DKV 1">Kelas XI DKV 1</option>
            <option value="X TKJ 1">Kelas X TKJ 1</option>
            <option value="all">Semua Kelas</option>
          </select>
        </div>

        <div className="w-full sm:w-44">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#8C6819]"
          >
            <option value="all">Semua Status Validasi</option>
            <option value="Tervalidasi">Tervalidasi</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
          </select>
        </div>
      </div>

      {/* Classroom Assessment Table */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#EAE6DC] bg-[#F9F8F6]/40 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
            Daftar Nilai & Pengesahan Portofolio Ekstrakurikuler Siswa
          </h2>
          <span className="text-[11px] text-[#68655F]">Semester Ganjil TA. 2025/2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F9F8F6] border-b border-[#EAE6DC] text-[#171717]">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-10">No</th>
                <th className="py-2.5 px-3 font-semibold">Nama Siswa / NISN</th>
                <th className="py-2.5 px-3 font-semibold">Ekskul Utama</th>
                <th className="py-2.5 px-3 font-semibold text-center">Kehadiran</th>
                <th className="py-2.5 px-3 font-semibold">Predikat Karakter</th>
                <th className="py-2.5 px-3 font-semibold">Status Pengesahan</th>
                <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D4CC]">
              {filteredList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-[#F9F8F6]/40">
                  <td className="py-3 px-3 text-[#68655F]">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#171717]">{item.name}</div>
                    <div className="text-[10px] text-[#68655F]">NISN: {item.nisn} • {item.className}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-[#171717]">{item.primaryEkskul}</span>
                    <span className="block text-[10px] text-[#68655F]">{item.ekskulCount} Kegiatan Diikuti</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-[#234B36]">{item.attendancePct}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#8C6819]">
                      <Star className="w-3 h-3 fill-[#8C6819]" />
                      {item.characterGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.status === 'Tervalidasi' ? (
                      <Badge variant="success">Tervalidasi</Badge>
                    ) : (
                      <Badge variant="warning">Menunggu Validasi</Badge>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {item.status !== 'Tervalidasi' ? (
                      <button
                        onClick={() => handleVerifyGrade(item.id)}
                        className="px-2.5 py-1 bg-[#8C6819] text-white rounded text-[11px] font-semibold hover:bg-[#705314] transition-colors cursor-pointer"
                      >
                        Sahkan Raport
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate?.('/verify/EKH-2026-000184')}
                        className="px-2.5 py-1 bg-[#F9F8F6] text-[#171717] border border-[#EAE6DC] rounded text-[11px] font-semibold hover:bg-[#EAE6DC] transition-colors cursor-pointer"
                      >
                        Lihat Portofolio
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Leger Modal */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Cetak Leger Rekapitulasi Nilai Ekstrakurikuler"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#68655F]">
            Leger ini memuat rekapitulasi nilai kegiatan non-akademik, kehadiran latihan, dan predikat karakter siswa untuk dilampirkan pada Buku Laporan Capaian Hasil Belajar (Raport).
          </p>

          <div className="p-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded text-[#171717] space-y-1">
            <div>Kelas: <strong>{selectedClass}</strong></div>
            <div>Wali Kelas: <strong>{currentUser?.name || 'Dra. Hj. Sri Wahyuni, M.Pd.'}</strong></div>
            <div>Tahun Ajaran: <strong>2025/2026 (Semester Ganjil)</strong></div>
            <div>Jumlah Siswa: <strong>{studentGrades.length} Siswa</strong></div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsPrintModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                window.print();
                setIsPrintModalOpen(false);
              }}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Cetak Dokumen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
