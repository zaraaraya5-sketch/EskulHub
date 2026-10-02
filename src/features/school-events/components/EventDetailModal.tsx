import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  X,
  Users,
  ShieldAlert,
  AlertTriangle,
  Pencil,
  Trash2,
} from 'lucide-react';
import { SchoolEvent, User } from '@/types';
import { formatEventDateTime, getCategoryStyles } from '../utils/calendarUtils';

interface EventDetailModalProps {
  event: SchoolEvent | null;
  onClose: () => void;
  currentUser: User | null;
  role?: string | null;
  onDelete: (id: string) => Promise<boolean>;
  isDeleting: boolean;
  deleteError: string;
  onNavigate?: (path: string) => void;
}

const ROLE_LABELS: Record<string, string> = {
  pembina: 'Pembina Ekskul',
  guru: 'Guru',
  pengurus: 'Pengurus Ekskul',
  student: 'Siswa',
  admin: 'Administrator',
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  currentUser,
  role,
  onDelete,
  isDeleting,
  deleteError,
  onNavigate,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && event) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  const styles = getCategoryStyles(event.category || event.event_type);
  const IconComp = styles.icon;
  const rawStart = event.start_time || event.start_datetime || '';
  const rawEnd = event.end_time || event.end_datetime || '';
  const { dateStr, timeStr } = formatEventDateTime(rawStart, rawEnd);

  const evCreatorRole = (event.created_by_role || '').toLowerCase();
  const normUser = role === 'teacher' ? 'pembina' : (role || '').toLowerCase();
  const normCreator = evCreatorRole === 'teacher' ? 'pembina' : evCreatorRole;

  const canManage = (() => {
    if (!currentUser || !role) return false;
    if (role === 'admin') return true;

    if (event.created_by_id && event.created_by_id === currentUser.id) {
      return true;
    }

    if (normCreator && normCreator === normUser) {
      return true;
    }

    if (!normCreator) {
      const cat = event.category || event.event_type;
      if (['extracurricular_training', 'competition'].includes(cat as string)) {
        return normUser === 'pembina';
      }
      if (['school_event', 'national_holiday'].includes(cat as string)) {
        return normUser === 'guru';
      }
    }

    return false;
  })();

  const creatorLabel = ROLE_LABELS[normCreator] || (normCreator ? capitalize(normCreator) : 'Pembina / Guru');
  const userLabel = ROLE_LABELS[normUser] || capitalize(normUser);

  const handleConfirmDelete = async () => {
    const success = await onDelete(event.id);
    if (success) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleEditClick = () => {
    const id = event.id;
    onClose();
    if (onNavigate) {
      onNavigate(`/calendar/edit/${id}`);
    } else {
      window.location.href = `/calendar/edit/${id}`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] transition-all"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EAE6DC] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={`h-2 w-full ${styles.accentBar || 'bg-[#D15B40]'}`} />

        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${styles.pill}`}>
                <IconComp className="w-3 h-3" />
                {styles.label}
              </span>
              {event.extracurricular_name && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                  {event.extracurricular_name}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1 text-[#8F8B82] hover:text-[#171717] hover:bg-[#F0EDE6] rounded-lg transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#171717] leading-snug">
              {event.title}
            </h3>
          </div>

          <div className="space-y-3 pt-1 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D15B40] mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#171717]">{dateStr}</div>
                <div className="text-xs text-[#68655F] mt-0.5">{timeStr}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D15B40] mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#171717]">{event.location}</div>
                {event.organizer && (
                  <div className="text-xs text-[#68655F] mt-0.5">
                    Penyelenggara: {event.organizer}
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <div className="pt-2 border-t border-[#EAE6DC]/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F8B82] mb-1">
                  Keterangan
                </div>
                <p className="text-xs text-[#525049] leading-relaxed bg-[#F9F8F6] p-2.5 rounded-xl border border-[#EAE6DC]">
                  {event.description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-[#EAE6DC]/80">
            <div className="flex items-center justify-between text-2xs text-[#68655F]">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>Dibuat oleh: <strong className="text-[#171717]">{creatorLabel}</strong></span>
              </span>
              {canManage ? (
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Izin Kelola Aktif
                </span>
              ) : currentUser ? (
                <span className="text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                  Hanya Baca
                </span>
              ) : null}
            </div>

            {!canManage && currentUser && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2 text-2xs leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Jadwal ini dibuat oleh <strong>{creatorLabel}</strong>. Akun Anda (<strong>{userLabel}</strong>) tidak memiliki izin untuk mengedit atau menghapus jadwal tersebut.
                </span>
              </div>
            )}

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-2xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{deleteError}</span>
              </div>
            )}

            {showDeleteConfirm ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5">
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Konfirmasi Hapus Jadwal
                </div>
                <p className="text-2xs text-rose-800 leading-relaxed">
                  Apakah Anda yakin ingin menghapus agenda <strong>"{event.title}"</strong>? Jadwal akan dihapus secara permanen dari kalender dan database.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                    disabled={isDeleting}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex items-center justify-between border-t border-[#EAE6DC]/60">
                <div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-[#171717] bg-[#F9F8F6] hover:bg-[#EAE6DC] border border-[#EAE6DC] rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
