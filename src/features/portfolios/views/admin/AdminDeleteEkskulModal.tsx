import React from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Extracurricular } from '@/types';

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
  const confirmDeleteEkskul = () => {
    if (!ekskul) return;
    const res = db.deleteExtracurricular(ekskul.id);
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
      title="Hapus Ekstrakurikuler"
    >
      <div className="space-y-4 text-xs">
        <p className="text-[#68655F]">
          Apakah Anda yakin ingin menghapus data ekstrakurikuler <strong className="text-[#171717]">{ekskul?.name}</strong>?
        </p>
        <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded">
          Seluruh data jadwal dan keanggotaan terkait ekskul ini tidak akan muncul lagi di katalog resmi.
        </div>
        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="outline" onClick={onClose}>
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
  );
};
