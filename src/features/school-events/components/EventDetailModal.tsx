import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  MapPin,
  X,
  Users,
  ShieldAlert,
  AlertTriangle,
  Pencil,
  Trash2,
  FileText,
  ChevronRight,
  ShieldCheck,
  Lock,
  Trophy,
} from 'lucide-react';
import { SchoolEvent, User } from '@/types';
import { formatEventDateTime, getCategoryStyles } from '../utils/calendarUtils';
import { FieldPermitModal } from './FieldPermitModal';
import { db } from '@/lib/database';

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
  pengurus: 'Pengurus Sekolah',
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
  const [showPermitModal, setShowPermitModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && event) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  // Lock background body and html scroll when drawer is open
  useEffect(() => {
    if (event) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [event]);

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
        return normUser === 'pengurus';
      }
    }

    return false;
  })();

  const creatorLabel = ROLE_LABELS[normCreator] || (normCreator ? capitalize(normCreator) : 'Pembina / Pengurus');
  const userLabel = ROLE_LABELS[normUser] || capitalize(normUser);

  // Detect whether this event is a Competition/Tournament or Regular Training
  const isCompetition = (() => {
    const cat = (event.category || event.event_type || '').toLowerCase();
    if (cat === 'competition') return true;
    const title = (event.title || '').toLowerCase();
    return (
      title.includes('lomba') ||
      title.includes('turnamen') ||
      title.includes('kejuaraan') ||
      title.includes('tanding') ||
      title.includes('championship') ||
      title.includes('cup') ||
      title.includes('olimpiade')
    );
  })();

  // Field Permit / Dispensation Identification & Authorization
  const isTrainingOrFieldEvent = (() => {
    if (isCompetition) return true;
    const cat = (event.category || event.event_type || '').toLowerCase();
    if (['extracurricular_training', 'training', 'practice'].includes(cat)) return true;
    if (event.extracurricular_id || event.extracurricular_name) return true;
    const loc = (event.location || '').toLowerCase();
    if (loc.includes('lapangan') || loc.includes('aula') || loc.includes('gor') || loc.includes('hall')) return true;
    return false;
  })();

  const ekskuls = db.getExtracurriculars();
  const targetEkskul = (() => {
    if (event.extracurricular_id) {
      return ekskuls.find((e) => e.id === event.extracurricular_id);
    }
    const cleanEventTitle = (event.title || '').toLowerCase();
    const cleanEventName = (event.extracurricular_name || '').toLowerCase();
    return ekskuls.find((e) => {
      const eName = e.name.toLowerCase();
      return (
        (cleanEventName && cleanEventName.includes(eName)) ||
        (cleanEventTitle && cleanEventTitle.includes(eName))
      );
    });
  })();

  const ekskulName =
    targetEkskul?.name || event.extracurricular_name || 'Ekstrakurikuler SMKN 1 Ciomas';

  const canDownloadPermit = (() => {
    if (!currentUser) return false;
    const norm = (role || currentUser.role || '').toLowerCase();
    if (norm === 'pengurus' || norm === 'admin') return true;
    if (norm === 'pembina' || norm === 'teacher') {
      if (event.created_by_id === currentUser.id) return true;
      if (
        targetEkskul &&
        (targetEkskul.supervisor_id === currentUser.id ||
          (targetEkskul.supervisor_name &&
            currentUser.name &&
            targetEkskul.supervisor_name.toLowerCase().includes(currentUser.name.toLowerCase())))
      ) {
        return true;
      }
    }
    const members = db.getMembers();
    return members.some((m) => {
      if (m.student_id !== currentUser.id || m.status !== 'active') return false;
      if (targetEkskul && m.extracurricular_id === targetEkskul.id) return true;
      const memEkskul = ekskuls.find((e) => e.id === m.extracurricular_id);
      return Boolean(memEkskul && memEkskul.name.toLowerCase() === ekskulName.toLowerCase());
    });
  })();

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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-black/50 backdrop-blur-[2px] transition-opacity animate-fadeIn overscroll-none"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 w-full sm:w-[450px] md:w-[480px] lg:w-[500px] h-full h-[100dvh] max-h-[100dvh] bg-white shadow-2xl flex flex-col overflow-hidden border-l border-[#EAE6DC] animate-panel-left overscroll-contain select-text"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Category Accent Stripe */}
        <div className={`h-2 w-full shrink-0 ${styles.accentBar || 'bg-[#D15B40]'}`} />

        {/* Panel Header */}
        <div className="px-5 pt-4 pb-3 border-b border-[#EAE6DC]/70 shrink-0 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
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

            <h2 className="text-base sm:text-lg font-bold text-[#171717] leading-snug line-clamp-2">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8F8B82] hover:text-[#171717] hover:bg-[#F0EDE6] active:scale-95 rounded-xl transition-all cursor-pointer shrink-0 mt-0.5"
            title="Tutup Panel (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body with min-h-0 to constrain flex child */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4">
          {/* Time & Location Details */}
          <div className="bg-[#FAF9F5] border border-[#EAE6DC] rounded-2xl p-4 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE6DC] flex items-center justify-center text-[#D15B40] shrink-0 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8F8B82]">
                  Waktu Pelaksanaan
                </div>
                <div className="font-bold text-[#171717] text-sm mt-0.5">{dateStr}</div>
                <div className="text-xs text-[#68655F] font-medium">{timeStr}</div>
              </div>
            </div>

            <div className="border-t border-[#EAE6DC]/60" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE6DC] flex items-center justify-center text-[#D15B40] shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8F8B82]">
                  Lokasi / Fasilitas
                </div>
                <div className="font-bold text-[#171717] text-sm mt-0.5">
                  {event.location || 'Kampus SMKN 1 Ciomas'}
                </div>
                {event.organizer && (
                  <div className="text-xs text-[#68655F] font-medium">
                    Penyelenggara: {event.organizer}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {event.description && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F8B82]">
                Keterangan & Catatan
              </div>
              <p className="text-xs sm:text-[13px] text-[#525049] leading-relaxed bg-[#F9F8F6] p-3.5 rounded-2xl border border-[#EAE6DC]">
                {event.description}
              </p>
            </div>
          )}

          {/* Dynamic Document Card: Lomba (Dispensasi) vs Latihan (Izin Lapangan) */}
          {isTrainingOrFieldEvent && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F8B82]">
                {isCompetition ? 'Dokumen Tugas & Dispensasi' : 'Dokumen Resmi Fasilitas'}
              </div>
              <div
                className={`border rounded-2xl p-4 space-y-3 shadow-xs ${
                  isCompetition
                    ? 'bg-gradient-to-br from-[#FEF6F5] to-[#FCEBE8] border-[#F2C9C0]'
                    : 'bg-gradient-to-br from-[#F0F7F3] to-[#E5EFE9] border-[#BBD8C7]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                      isCompetition ? 'bg-[#7A2822]' : 'bg-[#1C3A2B]'
                    }`}
                  >
                    {isCompetition ? (
                      <Trophy className="w-5 h-5 text-rose-200" />
                    ) : (
                      <FileText className="w-5 h-5 text-emerald-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isCompetition ? 'text-[#7A2822]' : 'text-[#1C3A2B]'
                        }`}
                      >
                        {isCompetition
                          ? 'Surat Dispensasi Mengikuti Lomba'
                          : 'Surat Izin Penggunaan Lapangan'}
                      </span>
                      {canDownloadPermit ? (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isCompetition
                              ? 'text-rose-800 bg-rose-100/90 border-rose-300'
                              : 'text-emerald-800 bg-emerald-100/90 border-emerald-300'
                          }`}
                        >
                          <ShieldCheck
                            className={`w-3 h-3 ${
                              isCompetition ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          />{' '}
                          Unduh & Cetak Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                          <Lock className="w-3 h-3 text-amber-600" /> Hanya Lihat
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-2xs mt-1 leading-relaxed ${
                        isCompetition ? 'text-[#744540]' : 'text-[#4F685B]'
                      }`}
                    >
                      {isCompetition
                        ? `Surat resmi dispensasi meninggalkan KBM untuk delegasi ${ekskulName} berstempel digital Kesiswaan & berkode QR.`
                        : `Dokumen izin resmi pemakaian sarana/lapangan untuk ${ekskulName} berstempel digital Kesiswaan & berkode QR.`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPermitModal(true)}
                  className={`w-full py-2 px-3 text-xs font-bold text-white active:scale-[0.98] rounded-xl shadow-xs hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCompetition
                      ? 'bg-[#A33D35] hover:bg-[#832D27]'
                      : 'bg-[#1C3A2B] hover:bg-[#142A1F]'
                  }`}
                >
                  {isCompetition ? (
                    <Trophy className="w-3.5 h-3.5 text-rose-200" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-emerald-200" />
                  )}
                  <span>
                    {isCompetition ? 'Buka Surat Dispensasi Lomba' : 'Buka Surat Izin Lapangan'}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          )}

          {/* Created by metadata & manage badge */}
          <div className="space-y-2 pt-2 border-t border-[#EAE6DC]/80">
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
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2 text-xs leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Jadwal ini dibuat oleh <strong>{creatorLabel}</strong>, sehingga hanya pembuat atau pengurus yang dapat mengubah atau menghapusnya.
                </span>
              </div>
            )}

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{deleteError}</span>
              </div>
            )}

            {showDeleteConfirm && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5">
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Hapus Jadwal Kegiatan
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Yakin ingin menghapus <strong>"{event.title}"</strong> dari kalender? Agenda ini tidak bisa dikembalikan.
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
            )}
          </div>
        </div>

        {/* Sticky Panel Footer */}
        <div className="p-4 bg-white border-t border-[#EAE6DC] flex items-center justify-between gap-3 shrink-0">
          <div>
            {canManage && !showDeleteConfirm && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
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
            className="px-5 py-2 text-xs font-bold text-[#171717] bg-[#F9F8F6] hover:bg-[#EAE6DC] border border-[#EAE6DC] rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Tutup Panel
          </button>
        </div>
      </div>

      {/* Field Permit Letter A4 Modal (Nested cleanly) */}
      {showPermitModal && (
        <FieldPermitModal
          event={event}
          onClose={() => setShowPermitModal(false)}
          currentUser={currentUser}
          role={role}
        />
      )}
    </div>,
    document.body
  );
};
