import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  Lock,
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Trophy,
} from 'lucide-react';
import { SchoolEvent, User, Extracurricular } from '@/types';
import { db } from '@/lib/database';
import {
  generateFieldPermitPdf,
  generateFieldPermitNumber,
} from '@/lib/pdf/generateFieldPermitPdf';
import {
  generateCompetitionDispensationPdf,
  generateDispensationNumber,
} from '@/lib/pdf/generateCompetitionDispensationPdf';

interface FieldPermitModalProps {
  event: SchoolEvent;
  onClose: () => void;
  currentUser: User | null;
  role?: string | null;
}

export const FieldPermitModal: React.FC<FieldPermitModalProps> = ({
  event,
  onClose,
  currentUser,
  role,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const settings = db.getSettings();

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

  // Find associated extracurricular
  const ekskuls = db.getExtracurriculars();
  const targetEkskul: Extracurricular | undefined = (() => {
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

  // Check access control: Can Download & Print
  const canDownloadAndPrint = (() => {
    if (!currentUser) return false;
    const normRole = (role || currentUser.role || '').toLowerCase();

    // 1. Pengurus or Admin always have full access
    if (normRole === 'pengurus' || normRole === 'admin') {
      return true;
    }

    // 2. Pembina of this ekskul or event creator
    if (normRole === 'pembina' || normRole === 'teacher') {
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

    // 3. Active members of this specific extracurricular
    const members = db.getMembers();
    const isMember = members.some((m) => {
      if (m.student_id !== currentUser.id || m.status !== 'active') return false;
      if (targetEkskul && m.extracurricular_id === targetEkskul.id) return true;
      const memEkskul = ekskuls.find((e) => e.id === m.extracurricular_id);
      return Boolean(memEkskul && memEkskul.name.toLowerCase() === ekskulName.toLowerCase());
    });

    return isMember;
  })();

  // Document numbering based on category
  const permitNumber = isCompetition
    ? generateDispensationNumber(event.id)
    : generateFieldPermitNumber(event.id);

  const now = new Date();
  const issueDateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const rawStart = event.start_time || event.start_datetime || '';
  const rawEnd = event.end_time || event.end_datetime || '';

  const formatScheduleText = (): { dateStr: string; timeStr: string } => {
    if (!rawStart) return { dateStr: 'Sesuai Jadwal Resmi', timeStr: 'Sesuai Durasi Agenda' };
    const sDate = new Date(rawStart);
    const dateStr = sDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const sTime = sDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    if (rawEnd) {
      const eDate = new Date(rawEnd);
      const eTime = eDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return { dateStr, timeStr: `${sTime} s.d. ${eTime} WIB` };
    }
    return { dateStr, timeStr: `${sTime} WIB - Selesai` };
  };

  const { dateStr, timeStr } = formatScheduleText();

  const handleDownloadPdf = async () => {
    if (!canDownloadAndPrint || isGenerating) return;
    try {
      setIsGenerating(true);
      if (isCompetition) {
        await generateCompetitionDispensationPdf(
          {
            event,
            ekskul: targetEkskul,
            schoolSetting: settings,
            permitNumber,
          },
          'save'
        );
      } else {
        await generateFieldPermitPdf(
          {
            event,
            ekskul: targetEkskul,
            schoolSetting: settings,
            permitNumber,
          },
          'save'
        );
      }
    } catch (err) {
      console.error('Gagal mengunduh PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintPdf = async () => {
    if (!canDownloadAndPrint || isGenerating) return;
    try {
      setIsGenerating(true);
      if (isCompetition) {
        await generateCompetitionDispensationPdf(
          {
            event,
            ekskul: targetEkskul,
            schoolSetting: settings,
            permitNumber,
          },
          'print'
        );
      } else {
        await generateFieldPermitPdf(
          {
            event,
            ekskul: targetEkskul,
            schoolSetting: settings,
            permitNumber,
          },
          'print'
        );
      }
    } catch (err) {
      console.error('Gagal mencetak dokumen:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div
          className={`text-white px-5 py-3.5 flex items-center justify-between shrink-0 ${
            isCompetition ? 'bg-[#7A2822]' : 'bg-[#1C3A2B]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                isCompetition
                  ? 'bg-rose-500/20 border-rose-400/30 text-rose-200'
                  : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
              }`}
            >
              {isCompetition ? <Trophy className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                {isCompetition
                  ? 'Surat Keterangan Dispensasi Lomba & Kejuaraan'
                  : 'Surat Izin Penggunaan Lapangan & Fasilitas'}
              </h2>
              <p
                className={`text-2xs font-mono ${
                  isCompetition ? 'text-rose-200/80' : 'text-emerald-200/80'
                }`}
              >
                No: {permitNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canDownloadAndPrint ? (
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isCompetition
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                    : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Akses Unduh & Cetak Aktif
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                Hanya Lihat (Non-Anggota)
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Banner if non-member */}
        {!canDownloadAndPrint && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-start gap-2.5 shrink-0">
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold">Perhatian Hak Akses:</strong> Anda dapat melihat pratinjau dokumen resmi ini secara lengkap, namun fitur <strong>unduh PDF</strong> dan <strong>cetak fisik</strong> hanya dapat dilakukan oleh anggota resmi ekstrakurikuler <strong>{ekskulName}</strong>, Pembina, atau Pengurus Sekolah.
            </div>
          </div>
        )}

        {/* Scrollable Paper Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F3EF] flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-stone-300 p-6 sm:p-8 text-[#171717] font-serif select-text">
            {/* Kop Surat */}
            <div className="text-center pb-3">
              <div className="text-[11px] font-sans font-bold tracking-wider text-stone-800 uppercase">
                Pemerintah Daerah Provinsi Jawa Barat
              </div>
              <div className="text-[10px] font-sans font-semibold tracking-wide text-stone-700 uppercase">
                Dinas Pendidikan & Kebudayaan
              </div>
              <div className="text-[9px] font-sans text-stone-600 uppercase">
                Cabang Dinas Pendidikan Wilayah I Kabupaten Bogor
              </div>
              <div
                className={`text-base sm:text-lg font-sans font-black tracking-tight mt-1 uppercase ${
                  isCompetition ? 'text-[#7A2822]' : 'text-[#1C3A2B]'
                }`}
              >
                {settings.school_name}
              </div>
              <div className="text-[9px] font-sans text-stone-500 mt-0.5">
                {settings.address} | NPSN: {settings.npsn}
              </div>
            </div>

            {/* Garis Pembatas Kop */}
            <div
              className={`border-b-2 mb-0.5 ${
                isCompetition ? 'border-[#7A2822]' : 'border-[#1C3A2B]'
              }`}
            />
            <div className="border-b border-stone-800 mb-5" />

            {/* Judul & Nomor Surat */}
            <div className="text-center mb-6 font-sans">
              <h3 className="text-xs sm:text-sm font-bold uppercase underline tracking-wide text-stone-900">
                {isCompetition
                  ? 'Surat Keterangan Dispensasi & Tugas Perlombaan'
                  : 'Surat Izin Penggunaan Fasilitas & Lapangan Sekolah'}
              </h3>
              <p className="text-2xs text-stone-600 mt-1 font-mono">
                Nomor: {permitNumber}
              </p>
            </div>

            {/* Tujuan Surat */}
            <div className="text-xs space-y-1 mb-5 font-sans">
              <p className="text-stone-700">Kepada Yth.</p>
              {isCompetition ? (
                <>
                  <p className="font-semibold text-stone-900">
                    1. Bapak / Ibu Guru Pengajar Mata Pelajaran
                  </p>
                  <p className="font-semibold text-stone-900">
                    2. Bapak / Ibu Wali Kelas Siswa Terkait
                  </p>
                  <p className="text-stone-700">di Lingkungan {settings.school_name}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-stone-900">
                    1. Koordinator Sarana, Prasarana & Lapangan Olahraga
                  </p>
                  <p className="font-semibold text-stone-900">
                    2. Petugas Keamanan & Ketertiban Lingkungan Sekolah
                  </p>
                  <p className="text-stone-700">di Kampus {settings.school_name}</p>
                </>
              )}
            </div>

            {/* Paragraf Pembuka */}
            <p className="text-xs text-justify leading-relaxed text-stone-800 mb-4 font-sans">
              {isCompetition
                ? `Sehubungan dengan keikutsertaan delegasi peserta didik dalam agenda kompetisi / kejuaraan untuk membawa dan mengharumkan nama baik ${settings.school_name}, pihak Bidang Kesiswaan memberikan dispensasi resmi meninggalkan kegiatan belajar mengajar (KBM) kepada tim ekstrakurikuler berikut:`
                : `Berdasarkan Program Kerja Pembinaan Kesiswaan dan Kalender Kegiatan Ekstrakurikuler ${settings.school_name} Tahun Pelajaran ${settings.academic_year}, pihak Kesiswaan memberikan izin resmi pemakaian sarana / lapangan sekolah kepada ekstrakurikuler di bawah ini:`}
            </p>

            {/* Box Identitas & Jadwal */}
            <div
              className={`border rounded-lg p-3.5 sm:p-4 mb-4 font-sans text-xs space-y-2 ${
                isCompetition
                  ? 'bg-[#FEF8F6] border-rose-200'
                  : 'bg-[#FAF9F5] border-stone-300'
              }`}
            >
              <div className="grid grid-cols-3 gap-1">
                <span className="text-stone-500 font-medium">Ekstrakurikuler</span>
                <span
                  className={`col-span-2 font-bold text-sm ${
                    isCompetition ? 'text-[#A33D35]' : 'text-[#1C3A2B]'
                  }`}
                >
                  {ekskulName}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-stone-500 font-medium">
                  {isCompetition ? 'Nama Kompetisi' : 'Agenda Kegiatan'}
                </span>
                <span className="col-span-2 font-semibold text-stone-900">
                  {event.title}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-stone-500 font-medium">Pembina / Pendamping</span>
                <span className="col-span-2 text-stone-800">
                  {targetEkskul?.supervisor_name || 'Pembina Ekstrakurikuler'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-stone-500 font-medium">Hari & Tanggal</span>
                <span className="col-span-2 font-semibold text-stone-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  {dateStr}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-stone-500 font-medium">
                  {isCompetition ? 'Waktu Dispensasi' : 'Waktu Penggunaan'}
                </span>
                <span className="col-span-2 font-semibold text-[#D15B40] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D15B40]" />
                  {timeStr}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-stone-500 font-medium">
                  {isCompetition ? 'Lokasi / Venue' : 'Tempat / Fasilitas'}
                </span>
                <span className="col-span-2 text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  {event.location || (isCompetition ? 'Lokasi Lomba' : 'Lapangan SMKN 1 Ciomas')}
                </span>
              </div>
            </div>

            {/* Aturan & Kewajiban */}
            <div className="font-sans text-[11px] text-stone-700 space-y-1 mb-5">
              <p className="font-semibold text-stone-800">
                {isCompetition
                  ? 'Petunjuk & Ketentuan Dispensasi Akademik:'
                  : 'Ketentuan Penggunaan Fasilitas:'}
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-stone-600 pl-1">
                {isCompetition ? (
                  <>
                    <li>Peserta didik dinyatakan HADIR DISPENSASI pada jam pelajaran terkait (bukan alpa).</li>
                    <li>Bapak/Ibu Guru dimohon memberikan izin serta hak pembelajaran/tugas susulan.</li>
                    <li>Siswa berkewajiban menyelesaikan tugas yang tertinggal setelah kegiatan lomba selesai.</li>
                    <li>Menjaga etika, sportivitas, dan nama baik almamater sekolah selama pelaksanaan lomba.</li>
                  </>
                ) : (
                  <>
                    <li>Wajib menjaga kebersihan, ketertiban, dan keutuhan sarana sekolah.</li>
                    <li>Penggunaan lapangan hanya berlaku sesuai durasi jadwal tercantum.</li>
                    <li>Dilarang meninggalkan sampah dan wajib mengembalikan perlengkapan ke tempat semula.</li>
                    <li>Wajib mengenakan seragam / kaos olahraga ekstrakurikuler resmi.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Tanda Tangan & Cap */}
            <div className="font-sans pt-3 mt-4 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <p className="text-stone-500 text-[11px]">Mengetahui,</p>
                <p className="font-semibold text-stone-800">Pembina Ekstrakurikuler</p>
                <div className="h-14 flex items-center justify-center">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    [Tervalidasi Digital]
                  </span>
                </div>
                <p className="font-bold underline text-stone-900">
                  {targetEkskul?.supervisor_name || 'Pembina Ekstrakurikuler'}
                </p>
                <p className="text-2xs text-stone-500">NIP. -</p>
              </div>

              <div className="text-center">
                <p className="text-stone-500 text-[11px]">Bogor, {issueDateStr}</p>
                <p className="font-semibold text-stone-800">Wakasek Bidang Kesiswaan</p>
                <div className="h-14 flex items-center justify-center relative">
                  {/* Digital Stamp Simulation */}
                  <div
                    className={`border text-[9px] font-bold px-2 py-1 rounded rotate-[-6deg] ${
                      isCompetition
                        ? 'border-rose-600/40 text-rose-800 bg-rose-50/70'
                        : 'border-emerald-600/40 text-emerald-800 bg-emerald-50/70'
                    }`}
                  >
                    {isCompetition ? 'DISPENSASI RESMI' : 'RESMI KESISWAAN'}
                    <br />
                    SMKN 1 CIOMAS
                  </div>
                </div>
                <p className="font-bold underline text-stone-900">
                  {settings.vice_principal_student_affairs || 'Jamil Husein'}
                </p>
                <p className="text-2xs text-stone-500">NIP. 19680320 199403 1 004</p>
              </div>
            </div>

            {/* QR Verification Footer */}
            <div className="mt-5 pt-3 border-t border-dashed border-stone-300 flex items-center justify-between text-2xs text-stone-500 font-sans">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-stone-700" />
                <span>
                  Dokumen sah diterbitkan otomatis melalui sistem <strong>EskulHub SMKN 1 Ciomas</strong>
                </span>
              </div>
              <span className="font-mono text-[9px]">ID: {event.id.slice(0, 10)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white border-t border-stone-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500">
            {canDownloadAndPrint ? (
              <span
                className={`flex items-center gap-1 font-medium ${
                  isCompetition ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${isCompetition ? 'text-rose-600' : 'text-emerald-600'}`}
                />
                Format PDF standar surat dinas siap unduh dan cetak.
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Tombol unduh/cetak terkunci untuk siswa non-anggota {ekskulName}.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              disabled={!canDownloadAndPrint || isGenerating}
              title={
                canDownloadAndPrint
                  ? 'Cetak Surat Resmi'
                  : `Hanya anggota ${ekskulName} yang dapat mencetak surat ini`
              }
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                canDownloadAndPrint
                  ? 'bg-stone-800 hover:bg-stone-900 text-white cursor-pointer shadow-sm hover:shadow'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
              }`}
            >
              {canDownloadAndPrint ? <Printer className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>Cetak Dokumen</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={!canDownloadAndPrint || isGenerating}
              title={
                canDownloadAndPrint
                  ? 'Unduh Surat Format PDF'
                  : `Hanya anggota ${ekskulName} yang dapat mengunduh surat ini`
              }
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                canDownloadAndPrint
                  ? isCompetition
                    ? 'bg-[#A33D35] hover:bg-[#832D27] text-white cursor-pointer shadow-sm hover:shadow'
                    : 'bg-[#1C3A2B] hover:bg-[#142A1F] text-white cursor-pointer shadow-sm hover:shadow'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
              }`}
            >
              {canDownloadAndPrint ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isGenerating ? 'Memproses...' : 'Unduh PDF Resmi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
