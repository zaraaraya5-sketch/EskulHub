import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Extracurricular } from '@/types';
import { Search, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface AdminEkskulSectionProps {
  ekskuls: Extracurricular[];
  setEkskuls: (data: Extracurricular[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onNavigate: (path: string) => void;
  isAddEkskulModalOpen: boolean;
  setIsAddEkskulModalOpen: (open: boolean) => void;
}

export const AdminEkskulSection: React.FC<AdminEkskulSectionProps> = ({
  ekskuls,
  setEkskuls,
  showNotification,
  onNavigate,
  isAddEkskulModalOpen,
  setIsAddEkskulModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [ekskulName, setEkskulName] = useState('');
  const [ekskulCategory, setEkskulCategory] = useState<Extracurricular['category']>('Olahraga');
  const [ekskulSupervisor, setEkskulSupervisor] = useState('');
  const [ekskulChairperson, setEkskulChairperson] = useState('');
  const [ekskulCapacity, setEkskulCapacity] = useState(30);
  const [ekskulSchedule, setEkskulSchedule] = useState('');
  const [ekskulLocation, setEkskulLocation] = useState('');
  const [ekskulDesc, setEkskulDesc] = useState('');

  const [editingEkskul, setEditingEkskul] = useState<Extracurricular | null>(null);
  const [ekskulToDelete, setEkskulToDelete] = useState<Extracurricular | null>(null);

  const handleAddEkskulSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ekskulName.trim() || !ekskulSupervisor.trim()) {
      showNotification('error', 'Nama ekskul dan guru pembina wajib diisi.');
      return;
    }

    const res = db.addExtracurricular({
      name: ekskulName.trim(),
      category: ekskulCategory,
      supervisor_name: ekskulSupervisor.trim(),
      chairperson_name: ekskulChairperson.trim() || 'Siswa Terpilih',
      member_capacity: Number(ekskulCapacity) || 25,
      practice_schedule: ekskulSchedule.trim() || 'Setiap Jumat (15:30 - 17:00 WIB)',
      location: ekskulLocation.trim() || 'Kampus Utama',
      short_description: ekskulDesc.trim() || 'Program pembinaan bakat dan minat siswa.',
      full_description: ekskulDesc.trim() || 'Program pembinaan ekstrakurikuler resmi SMK Nusantara Digital.',
      profile_image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      registration_status: 'open',
    });

    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      setIsAddEkskulModalOpen(false);
      setEkskulName('');
      setEkskulSupervisor('');
      setEkskulChairperson('');
      setEkskulSchedule('');
      setEkskulLocation('');
      setEkskulDesc('');
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const openEditEkskulModal = (item: Extracurricular) => {
    setEditingEkskul(item);
    setEkskulName(item.name);
    setEkskulCategory(item.category);
    setEkskulSupervisor(item.supervisor_name);
    setEkskulChairperson(item.chairperson_name);
    setEkskulCapacity(item.member_capacity);
    setEkskulSchedule(item.practice_schedule);
    setEkskulLocation(item.location);
    setEkskulDesc(item.short_description);
  };

  const handleEditEkskulSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEkskul) return;

    const res = db.updateExtracurricular(editingEkskul.id, {
      name: ekskulName.trim(),
      category: ekskulCategory,
      supervisor_name: ekskulSupervisor.trim(),
      chairperson_name: ekskulChairperson.trim(),
      member_capacity: Number(ekskulCapacity),
      practice_schedule: ekskulSchedule.trim(),
      location: ekskulLocation.trim(),
      short_description: ekskulDesc.trim(),
    });

    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      setEditingEkskul(null);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const toggleEkskulStatus = (item: Extracurricular) => {
    const newStatus = item.registration_status === 'open' ? 'closed' : 'open';
    const res = db.updateExtracurricular(item.id, { registration_status: newStatus });
    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', `Status pendaftaran ${item.name} berhasil diubah ke: ${newStatus === 'open' ? 'Dibuka' : 'Ditutup'}`);
    }
  };

  const confirmDeleteEkskul = () => {
    if (!ekskulToDelete) return;
    const res = db.deleteExtracurricular(ekskulToDelete.id);
    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
    setEkskulToDelete(null);
  };

  const filteredEkskuls = ekskuls.filter(
    (e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.supervisor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Master Data Ekstrakurikuler Resmi</h2>
            <p className="text-xs text-[#68655F]">Atur kuota daya tampung, jadwal rutin, penugasan guru pembina, dan status pendaftaran.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]" />
              <input
                type="text"
                placeholder="Cari ekskul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#F9F8F6]/50 border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              />
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsAddEkskulModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Tambah Ekskul Baru
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEkskuls.map((ekskul) => (
            <div
              key={ekskul.id}
              className="border border-[#EAE6DC] rounded-lg p-4 bg-[#F9F8F6]/20 flex flex-col justify-between hover:border-[#234B36] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-[#171717]">{ekskul.name}</h3>
                  <Badge variant="neutral">{ekskul.category}</Badge>
                </div>
                <p className="text-xs text-[#68655F] line-clamp-2 mb-3 leading-relaxed">
                  {ekskul.short_description}
                </p>

                <div className="space-y-1.5 text-xs text-[#68655F] border-t border-[#EAE6DC]/70 pt-2.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span>Pembina:</span>
                    <strong className="text-[#171717]">{ekskul.supervisor_name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ketua Siswa:</span>
                    <span className="text-[#171717]">{ekskul.chairperson_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Jadwal Latihan:</span>
                    <span className="text-[#171717] truncate max-w-[140px]">{ekskul.practice_schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kapasitas:</span>
                    <span className="font-bold text-[#234B36]">
                      {ekskul.current_member_count} / {ekskul.member_capacity} Siswa
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE6DC]/70 flex items-center justify-between">
                <button
                  onClick={() => toggleEkskulStatus(ekskul)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    ekskul.registration_status === 'open'
                      ? 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#d5e7dc]'
                      : 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#f3d9d7]'
                  }`}
                >
                  {ekskul.registration_status === 'open' ? 'Pendaftaran Buka' : 'Pendaftaran Tutup'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditEkskulModal(ekskul)}
                    className="p-1 text-[#68655F] hover:text-[#234B36] hover:bg-white rounded cursor-pointer"
                    title="Edit Ekskul"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEkskulToDelete(ekskul)}
                    className="p-1 text-[#68655F] hover:text-[#A33D35] hover:bg-white rounded cursor-pointer"
                    title="Hapus Ekskul"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate(`/ekskul/${ekskul.slug}`)}
                    className="p-1 text-[#68655F] hover:text-[#234B36] hover:bg-white rounded cursor-pointer"
                    title="Lihat Publik"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 4: TAMBAH EKSTRAKURIKULER BARU */}
      <Modal
        isOpen={isAddEkskulModalOpen}
        onClose={() => setIsAddEkskulModalOpen(false)}
        title="Tambah Ekstrakurikuler Baru"
      >
        <form onSubmit={handleAddEkskulSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Nama Ekstrakurikuler"
            type="text"
            value={ekskulName}
            onChange={(e) => setEkskulName(e.target.value)}
            placeholder="Contoh: Robotik & Otomasi Cerdas"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Kategori
              </label>
              <select
                value={ekskulCategory}
                onChange={(e) => setEkskulCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="Olahraga">Olahraga</option>
                <option value="Seni & Budaya">Seni & Budaya</option>
                <option value="Sains & Teknologi">Sains & Teknologi</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Bahasa & Literasi">Bahasa & Literasi</option>
              </select>
            </div>

            <Input
              label="Kapasitas Anggota"
              type="number"
              value={ekskulCapacity}
              onChange={(e) => setEkskulCapacity(Number(e.target.value))}
              placeholder="30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Guru Pembina"
              type="text"
              value={ekskulSupervisor}
              onChange={(e) => setEkskulSupervisor(e.target.value)}
              placeholder="Dra. Hj. Sri Wahyuni, M.Pd."
              required
            />
            <Input
              label="Nama Ketua Siswa"
              type="text"
              value={ekskulChairperson}
              onChange={(e) => setEkskulChairperson(e.target.value)}
              placeholder="Ahmad Rifai"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jadwal Latihan Rutin"
              type="text"
              value={ekskulSchedule}
              onChange={(e) => setEkskulSchedule(e.target.value)}
              placeholder="Setiap Jumat (15:30 - 17:30 WIB)"
            />
            <Input
              label="Lokasi Fasilitas"
              type="text"
              value={ekskulLocation}
              onChange={(e) => setEkskulLocation(e.target.value)}
              placeholder="Lab Robotika / Lapangan"
            />
          </div>

          <Input
            label="Ringkasan Singkat Deskripsi"
            type="text"
            value={ekskulDesc}
            onChange={(e) => setEkskulDesc(e.target.value)}
            placeholder="Fokus pada penguasaan mikrokontroler, IoT, dan perancangan sirkuit cerdas."
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddEkskulModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Ekstrakurikuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: EDIT EKSTRAKURIKULER */}
      <Modal
        isOpen={editingEkskul !== null}
        onClose={() => setEditingEkskul(null)}
        title={`Edit Ekstrakurikuler: ${editingEkskul?.name}`}
      >
        <form onSubmit={handleEditEkskulSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Nama Ekstrakurikuler"
            type="text"
            value={ekskulName}
            onChange={(e) => setEkskulName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1">
                Kategori
              </label>
              <select
                value={ekskulCategory}
                onChange={(e) => setEkskulCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              >
                <option value="Olahraga">Olahraga</option>
                <option value="Seni & Budaya">Seni & Budaya</option>
                <option value="Sains & Teknologi">Sains & Teknologi</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Bahasa & Literasi">Bahasa & Literasi</option>
              </select>
            </div>

            <Input
              label="Kapasitas Anggota"
              type="number"
              value={ekskulCapacity}
              onChange={(e) => setEkskulCapacity(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Guru Pembina"
              type="text"
              value={ekskulSupervisor}
              onChange={(e) => setEkskulSupervisor(e.target.value)}
              required
            />
            <Input
              label="Nama Ketua Siswa"
              type="text"
              value={ekskulChairperson}
              onChange={(e) => setEkskulChairperson(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jadwal Latihan Rutin"
              type="text"
              value={ekskulSchedule}
              onChange={(e) => setEkskulSchedule(e.target.value)}
            />
            <Input
              label="Lokasi Fasilitas"
              type="text"
              value={ekskulLocation}
              onChange={(e) => setEkskulLocation(e.target.value)}
            />
          </div>

          <Input
            label="Deskripsi Singkat"
            type="text"
            value={ekskulDesc}
            onChange={(e) => setEkskulDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingEkskul(null)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Perbarui Ekskul
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 6: HAPUS EKSTRAKURIKULER KONFIRMASI */}
      <Modal
        isOpen={ekskulToDelete !== null}
        onClose={() => setEkskulToDelete(null)}
        title="Hapus Ekstrakurikuler"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#68655F]">
            Apakah Anda yakin ingin menghapus data ekstrakurikuler <strong className="text-[#171717]">{ekskulToDelete?.name}</strong>?
          </p>
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded">
            Seluruh data jadwal dan keanggotaan terkait ekskul ini tidak akan muncul lagi di katalog resmi.
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" onClick={() => setEkskulToDelete(null)}>
              Batal
            </Button>
            <button
              onClick={confirmDeleteEkskul}
              className="px-4 py-2 bg-[#A33D35] hover:bg-[#852E27] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Hapus Ekstrakurikuler
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
