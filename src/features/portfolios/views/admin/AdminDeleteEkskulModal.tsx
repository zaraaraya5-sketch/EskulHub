import React from 'react';
import { db } from '@/lib/database';
import { Extracurricular } from '@/types';
import { ProcessConfirmModal } from '@/components/ui/ProcessConfirmModal';

interface AdminDeleteEkskulModalProps {
  ekskul: Extracurricular | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AdminDeleteEkskulModal: React.FC<AdminDeleteEkskulModalProps> = ({
  ekskul,
  onClose,
  onSuccess,
  onError,
}) => {
  const handleDelete = async () => {
    if (!ekskul) return;
    const res = db.deleteExtracurricular(ekskul.id);
    if (res.success) {
      onSuccess(res.message);
      return true;
    } else {
      onError(res.message);
      return false;
    }
  };

  return (
    <ProcessConfirmModal
      isOpen={ekskul !== null}
      onClose={onClose}
      title="Hapus Ekstrakurikuler"
      description="Apakah Anda yakin ingin menghapus data ekstrakurikuler"
      targetName={ekskul?.name}
      warningNotice="Seluruh data jadwal latihan, presensi, dan keanggotaan terkait ekstrakurikuler ini tidak akan muncul lagi di katalog resmi sekolah."
      confirmLabel="Hapus Ekstrakurikuler"
      loadingText="Menghapus data ekstrakurikuler dari sistem..."
      successText={`Ekstrakurikuler ${ekskul?.name || ''} berhasil dihapus!`}
      onConfirm={handleDelete}
    />
  );
};
