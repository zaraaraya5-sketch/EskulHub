import React, { useState, useEffect } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Extracurricular } from '@/types';

interface AdminEditEkskulModalProps {
  ekskul: Extracurricular | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AdminEditEkskulModal: React.FC<AdminEditEkskulModalProps> = ({
  ekskul,
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

  useEffect(() => {
    if (ekskul) {
      setEkskulName(ekskul.name);
      setEkskulCategory(ekskul.category);
      setEkskulSupervisor(ekskul.supervisor_name);
      setEkskulChairperson(ekskul.chairperson_name);
      setEkskulCapacity(ekskul.member_capacity);
      setEkskulSchedule(ekskul.practice_schedule);
      setEkskulLocation(ekskul.location);
      setEkskulDesc(ekskul.short_description);
    }
  }, [ekskul]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ekskul) return;
    if (!ekskulName.trim() || !ekskulSupervisor.trim()) {
      onError('Nama ekskul dan guru pembina wajib diisi.');
      return;
    }

    const res = db.updateExtracurricular(ekskul.id, {
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
      onSuccess(res.message);
      onClose();
    } else {
      onError(res.message);
    }
  };

  return (
    <Modal
      isOpen={ekskul !== null}
      onClose={onClose}
      title={`Edit Ekstrakurikuler: ${ekskul?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Perbarui Ekskul
          </Button>
        </div>
      </form>
    </Modal>
  );
};
