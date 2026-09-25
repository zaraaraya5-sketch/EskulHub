import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Extracurricular } from '@/types';

interface AdminAddEkskulModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AdminAddEkskulModal: React.FC<AdminAddEkskulModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [ekskulName, setEkskulName] = useState('');
  const [ekskulCategory, setEkskulCategory] = useState<Extracurricular['category']>('Olahraga');
  const [ekskulSupervisor, setEkskulSupervisor] = useState('');
  const [ekskulChairperson, setEkskulChairperson] = useState('');
  const [ekskulCapacity, setEkskulCapacity] = useState(30);
  const [ekskulSchedule, setEkskulSchedule] = useState('');
  const [ekskulLocation, setEkskulLocation] = useState('');
  const [ekskulDesc, setEkskulDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ekskulName.trim() || !ekskulSupervisor.trim()) {
      onError('Nama ekskul dan guru pembina wajib diisi.');
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
      setEkskulName('');
      setEkskulSupervisor('');
      setEkskulChairperson('');
      setEkskulSchedule('');
      setEkskulLocation('');
      setEkskulDesc('');
      onSuccess(res.message);
      onClose();
    } else {
      onError(res.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Ekstrakurikuler Baru">
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan Ekstrakurikuler
          </Button>
        </div>
      </form>
    </Modal>
  );
};
