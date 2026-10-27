import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Loader2, Trash2, CheckCircle2 } from 'lucide-react';

interface ProcessConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  targetName?: string;
  warningNotice?: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  loadingText?: string;
  successText?: string;
  onConfirm: () => Promise<boolean | void> | boolean | void;
}

export const ProcessConfirmModal: React.FC<ProcessConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  targetName,
  warningNotice,
  confirmLabel = 'Hapus Sekarang',
  confirmVariant = 'danger',
  loadingText = 'Menghapus...',
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleExecute = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await onConfirm();
      if (res === false) {
        setIsSubmitting(false);
        setErrorMessage('Gagal memproses penghapusan. Silakan coba kembali.');
        return;
      }
      // Instant smooth close on success
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem saat menghapus data.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={title}
      maxWidth="md"
      icon={<AlertTriangle className="w-5 h-5 text-[#A33D35]" />}
    >
      <div className="space-y-4 font-sans text-xs">
        <div className="space-y-2">
          <p className="text-[#525049] text-sm leading-relaxed">
            {description}
            {targetName && (
              <strong className="block text-[#171717] mt-1 font-bold text-base font-mono">
                &quot;{targetName}&quot;
              </strong>
            )}
          </p>
        </div>

        {warningNotice && (
          <div className="p-3.5 bg-[#F9ECEB] border border-[#F2C9C0] text-[#A33D35] rounded-2xl text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{warningNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded-xl text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE6DC]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
              confirmVariant === 'danger'
                ? 'bg-[#A33D35] hover:bg-[#852E27] active:scale-95 disabled:opacity-60'
                : 'bg-[#D15B40] hover:bg-[#b84a32] active:scale-95 disabled:opacity-60'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
