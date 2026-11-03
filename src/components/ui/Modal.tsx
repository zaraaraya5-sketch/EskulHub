import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'md',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto transition-all duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Viewport Backdrop Click Handler */}
      <div
        className="fixed inset-0 -z-10 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div
        className={`relative w-full max-w-[94vw] ${maxWidthStyles[maxWidth]} my-auto bg-white border border-[#EAE6DC] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#EAE6DC] bg-gradient-to-r from-[#F9F8F6] via-white to-white">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            {icon && (
              <div className="w-10 h-10 rounded-2xl bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] flex items-center justify-center shrink-0 shadow-2xs">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight truncate leading-snug">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#68655F] mt-0.5 leading-normal truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-[#68655F] hover:text-[#171717] rounded-xl hover:bg-[#EAE6DC] active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
