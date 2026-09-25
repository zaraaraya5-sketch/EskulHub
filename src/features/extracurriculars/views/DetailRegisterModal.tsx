import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { UserCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { Extracurricular } from '@/types';
import { useAuth } from '@/features/authentication/providers/AuthProvider';

interface DetailRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  ekskul: Extracurricular;
}

export const DetailRegisterModal: React.FC<DetailRegisterModalProps> = ({
  isOpen,
  onClose,
  ekskul,
}) => {
  const { currentUser } = useAuth();
  
  const [studentName, setStudentName] = useState(() => currentUser?.name || 'Budi Pratama');
  const [studentClass, setStudentClass] = useState('XII RPL 1');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!studentName.trim()) {
      setFormError('Nama siswa wajib diisi.');
      return;
    }

    if (!studentClass.trim()) {
      setFormError('Kelas siswa wajib diisi.');
      return;
    }

    if (!reason.trim()) {
      setFormError('Mohon isi deskripsi mengenai alasan dan komitmen Anda masuk ekskul ini.');
      return;
    }

    const studentId = currentUser?.id || `usr-student-${Date.now()}`;

    const result = db.createRegistration({
      extracurricular_id: ekskul.id,
      student_id: studentId,
      student_name: studentName.trim(),
      student_class: studentClass.trim(),
      student_nisn: '0067823910',
      reason: reason.trim(),
    });

    if (result.success) {
      setFormSuccess(`Formulir pendaftaran berhasil dikirim langsung ke Guru Pembina (${ekskul.supervisor_name}).`);
      setReason('');
      setTimeout(() => {
        onClose();
        setFormSuccess('');
      }, 1800);
    } else {
      setFormError(result.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pendaftaran: ${ekskul.name}`}
    >
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div className="p-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#8C6819]">
            <UserCheck className="w-4 h-4" />
            <span>Formulir ini dikirim langsung ke Guru Pembina:</span>
          </div>
          <div className="text-[#171717] font-bold pl-5">
            {ekskul.supervisor_name}
          </div>
          <div className="text-[11px] text-[#68655F] pl-5">
            Guru Pembina akan menerima pesan pendaftaran ini dan memverifikasi kelayakan anggota baru.
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="p-3 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] text-xs rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <Input
          label="Nama Lengkap Siswa"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Masukkan nama lengkap siswa..."
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Kelas & Jurusan"
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="Contoh: XII RPL 1 / X TKJ 2"
            required
          />
          <Input
            label="Kapasitas Tersisa"
            type="text"
            value={`${ekskul.member_capacity - ekskul.current_member_count} Kuota Tersedia`}
            readOnly
            className="bg-[#F9F8F6]/60 text-[#68655F]"
          />
        </div>

        <Textarea
          label="Deskripsi / Alasan Masuk Ekstrakurikuler"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Jelaskan minat Anda, pengalaman sebelumnya (bila ada), dan komitmen Anda masuk ekskul ini..."
          required
        />

        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Kirim ke Pembina
          </Button>
        </div>
      </form>
    </Modal>
  );
};
