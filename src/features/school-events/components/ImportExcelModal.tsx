import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  UploadCloud,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  X,
  FileText,
  ShieldAlert,
  Loader2,
  Trash2,
  HelpCircle,
  Building,
  Users,
  Trophy,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { importEventsExcelAPI } from '@/lib/api';
import { db } from '@/lib/database';
import { parseExcelDateTime, normalizeEventCategory } from '../utils/calendarUtils';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: any;
  role: string;
}

interface ParsedEventRow {
  rowIndex: number; // Row number in Excel sheet (starts at 2)
  title: string;
  category: string;
  normalizedCategory: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  description: string;
  validationError?: string;
}

// Convert Excel date value to standard 'YYYY-MM-DD HH:mm:ss' string
const formatExcelSerialDate = (val: any, defaultTime = '08:00:00'): string => {
  return parseExcelDateTime(val, defaultTime) || '';
};

// Normalize Indonesian and English category synonyms
const normalizeCategory = (rawCat: string): string => {
  return normalizeEventCategory(rawCat);
};

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  role,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedEventRow[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; row?: number; field?: string } | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPengurus = role === 'pengurus';
  const isPembina = role === 'pembina' || role === 'teacher';
  const isAdmin = role === 'admin';

  // Allowed categories based on role
  const isCategoryAllowedForRole = (cat: string) => {
    if (isAdmin) return true;
    if (isPengurus) return ['school_event', 'national_holiday'].includes(cat);
    if (isPembina) return ['extracurricular_training', 'competition'].includes(cat);
    return false;
  };

  // 1. Download dynamic template tailored to the user's role
  const handleDownloadTemplate = () => {
    let sampleData: Record<string, any>[] = [];

    if (isPengurus) {
      sampleData = [
        {
          title: 'Upacara Hari Sumpah Pemuda',
          category: 'school_event',
          start_time: '2026-10-28 07:00:00',
          end_time: '2026-10-28 09:00:00',
          location: 'Lapangan Utama Sekolah',
          organizer: currentUser?.name || 'Pengurus & Kesiswaan',
          description: 'Upacara bendera wajib diikuti oleh seluruh dewan guru dan siswa.',
        },
        {
          title: 'Hari Pahlawan Nasional',
          category: 'national_holiday',
          start_time: '2026-11-10 00:00:00',
          end_time: '2026-11-10 23:59:59',
          location: 'Seluruh Area Sekolah',
          organizer: 'Pemerintah Republik Indonesia',
          description: 'Hari libur nasional memperingati jasa pahlawan kemerdekaan.',
        },
        {
          title: 'Class Meeting Semester Ganjil',
          category: 'school_event',
          start_time: '2026-12-14 08:00:00',
          end_time: '2026-12-18 14:00:00',
          location: 'Gedung Olahraga & Lapangan Sekolah',
          organizer: 'OSIS & Pembina Olahraga',
          description: 'Perlombaan antar kelas pasca ujian akhir semester.',
        },
      ];
    } else {
      // Pembina or Teacher or Admin
      sampleData = [
        {
          title: 'Latihan Taktik & Uji Tanding Ekskul',
          category: 'extracurricular_training',
          start_time: '2026-10-15 15:30:00',
          end_time: '2026-10-15 17:30:00',
          location: 'Lapangan Olahraga Utama',
          organizer: currentUser?.name || 'Pembina Ekskul',
          description: 'Materi latihan fisik sprint, taktik formasi, dan simulasi pertandingan.',
        },
        {
          title: 'Babak Penyisihan Olimpiade Pelajar Kota',
          category: 'competition',
          start_time: '2026-10-24 08:00:00',
          end_time: '2026-10-24 16:00:00',
          location: 'GOR Remaja Ksatria',
          organizer: 'Dispora & Panitia Turnamen Pelajar',
          description: 'Membawa kartu identitas pelajar dan seragam tanding resmi sekolah.',
        },
        {
          title: 'Gladi Bersih Penampilan Gebyar Ekskul',
          category: 'extracurricular_training',
          start_time: '2026-11-05 14:00:00',
          end_time: '2026-11-05 17:00:00',
          location: 'Aula Serbaguna Lantai 3',
          organizer: currentUser?.name || 'Tim Pembina',
          description: 'Persiapan akhir tata panggung dan durasi penampilan anggota.',
        },
      ];
    }

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal_Template');

    // Column widths
    worksheet['!cols'] = [
      { wch: 35 }, // title
      { wch: 25 }, // category
      { wch: 22 }, // start_time
      { wch: 22 }, // end_time
      { wch: 28 }, // location
      { wch: 25 }, // organizer
      { wch: 45 }, // description
    ];

    const roleName = isPengurus ? 'Pengurus' : isPembina ? 'Pembina' : 'Admin';
    XLSX.writeFile(workbook, `Template_Import_Jadwal_${roleName}.xlsx`);
  };

  // 2. Parse uploaded file using SheetJS
  const processUploadedFile = (file: File) => {
    setSelectedFile(file);
    setApiError(null);
    setApiSuccess(null);
    setIsProcessingFile(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawJson: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          raw: false,
        });

        if (!rawJson || rawJson.length === 0) {
          setApiError({
            message: 'File Excel / CSV kosong atau data baris tidak ditemukan. Pastikan data dimulai dari baris ke-2.',
            row: 1,
          });
          setParsedRows([]);
          setIsProcessingFile(false);
          return;
        }

        const extract = (rowObj: Record<string, any>, candidates: string[]) => {
          for (const key of Object.keys(rowObj)) {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (const cand of candidates) {
              const cleanCand = cand.toLowerCase().replace(/[^a-z0-9]/g, '');
              if (cleanKey === cleanCand || cleanKey.startsWith(cleanCand)) {
                return rowObj[key];
              }
            }
          }
          return '';
        };

        const validatedList: ParsedEventRow[] = rawJson.map((row, idx) => {
          const rowNumber = idx + 2; // Row 1 is header in Excel
          const title = String(
            extract(row, ['judul agenda', 'judul', 'nama kegiatan', 'nama agenda', 'title', 'agenda']) || ''
          ).trim();
          const rawCat = String(
            extract(row, ['kategori', 'jenis kegiatan', 'jenis', 'category', 'tipe']) || 'Latihan Rutin'
          ).trim();
          const normalizedCat = normalizeCategory(rawCat);

          const rawStartTime = extract(row, [
            'tanggal mulai',
            'waktu mulai',
            'mulai',
            'tanggal',
            'start_time',
            'start_datetime',
            'start',
          ]);
          const rawEndTime = extract(row, [
            'tanggal selesai',
            'waktu selesai',
            'selesai',
            'sampai',
            'end_time',
            'end_datetime',
            'end',
          ]);

          const startTime = formatExcelSerialDate(rawStartTime, '08:00:00');
          let endTime = formatExcelSerialDate(rawEndTime, '10:00:00');
          if (startTime && !endTime) {
            const sDate = new Date(startTime.replace(' ', 'T'));
            const eDate = new Date(sDate.getTime() + 2 * 60 * 60 * 1000);
            const y = eDate.getFullYear();
            const m = String(eDate.getMonth() + 1).padStart(2, '0');
            const d = String(eDate.getDate()).padStart(2, '0');
            const hh = String(eDate.getHours()).padStart(2, '0');
            const mm = String(eDate.getMinutes()).padStart(2, '0');
            const ss = String(eDate.getSeconds()).padStart(2, '0');
            endTime = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
          }

          const location =
            String(extract(row, ['lokasi', 'tempat', 'ruangan', 'location']) || '').trim() ||
            'Lingkungan SMKN 1 Ciomas';
          const organizer =
            String(
              extract(row, ['penyelenggara', 'ekskul', 'ekstrakurikuler', 'organizer', 'pic']) || ''
            ).trim() || (currentUser?.name ?? 'Pengurus');
          const description = String(
            extract(row, ['deskripsi', 'keterangan', 'catatan', 'description']) || ''
          ).trim();

          // Client-side quick validation check
          let error: string | undefined = undefined;

          if (!title) {
            error = 'Judul agenda tidak boleh kosong';
          } else if (!normalizedCat) {
            error = 'Kategori agenda tidak boleh kosong';
          } else if (!isCategoryAllowedForRole(normalizedCat)) {
            if (isPengurus) {
              error = `Kategori '${rawCat}' tidak diizinkan untuk Pengurus (Hanya: Acara Sekolah / Hari Libur Nasional)`;
            } else if (isPembina) {
              error = `Kategori '${rawCat}' tidak diizinkan untuk Pembina (Hanya: Latihan Ekskul / Lomba)`;
            } else {
              error = `Kategori '${rawCat}' tidak valid`;
            }
          } else if (!startTime) {
            error = 'Waktu mulai harus diisi dengan format YYYY-MM-DD HH:mm';
          }

          return {
            rowIndex: rowNumber,
            title,
            category: rawCat,
            normalizedCategory: normalizedCat,
            start_time: startTime,
            end_time: endTime,
            location: location || 'Seluruh Area Sekolah',
            organizer,
            description,
            validationError: error,
          };
        });

        setParsedRows(validatedList);
      } catch (err: any) {
        console.error('Error parsing excel:', err);
        setApiError({
          message: 'Gagal mengurai file Excel. Pastikan format file valid (.xlsx atau .csv).',
        });
        setParsedRows([]);
      } finally {
        setIsProcessingFile(false);
      }
    };

    reader.onerror = () => {
      setApiError({ message: 'Terjadi kesalahan saat membaca file dari perangkat Anda.' });
      setIsProcessingFile(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Drag-and-drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setApiError(null);
    setApiSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3. Submit parsed events to backend API with database transaction
  const handleSubmitImport = async () => {
    if (parsedRows.length === 0) return;

    // Check if client validation found errors
    const clientErrorRow = parsedRows.find((r) => r.validationError);
    if (clientErrorRow) {
      setApiError({
        message: `Perbaiki baris ${clientErrorRow.rowIndex}: ${clientErrorRow.validationError}`,
        row: clientErrorRow.rowIndex,
      });
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      // Determine assigned extracurricular if pembina
      const pembinaEkskulId =
        currentUser?.extracurricular_id || (currentUser as any)?.ekskul_id;

      const payload = {
        events: parsedRows.map((r) => ({
          title: r.title,
          category: r.normalizedCategory,
          start_time: r.start_time,
          end_time: r.end_time,
          location: r.location,
          organizer: r.organizer,
          description: r.description,
        })),
        file: selectedFile || undefined,
        user_id: currentUser?.id,
        extracurricular_id: isPembina ? pembinaEkskulId : undefined,
      };

      const res = await importEventsExcelAPI(payload);

      if (res && res.success) {
        setApiSuccess(
          res.message ||
            `Berhasil! Sebanyak ${parsedRows.length} agenda kegiatan berhasil ditambahkan ke kalender sekolah.`
        );

        // Keep local database also synchronized for immediate reactivity
        parsedRows.forEach((r) => {
          db.addSchoolEvent({
            title: r.title,
            category: r.normalizedCategory as any,
            event_type: r.normalizedCategory as any,
            location: r.location,
            start_datetime: r.start_time,
            end_datetime: r.end_time,
            start_time: r.start_time,
            end_time: r.end_time,
            description: r.description,
            organizer: r.organizer,
            extracurricular_id: isPembina ? pembinaEkskulId : undefined,
          });
        });

        // Trigger calendar reload
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1600);
      } else {
        setApiError({
          message: res?.message || 'Gagal menyimpan data kegiatan ke kalender sekolah.',
          row: res?.error_row,
          field: res?.error_field,
        });
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setApiError({
        message: err.message || 'Terjadi kesalahan sistem saat menghubungi backend API.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'school_event':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Building className="w-3 h-3" /> Acara Sekolah
          </span>
        );
      case 'national_holiday':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <Flag className="w-3 h-3" /> Libur Nasional
          </span>
        );
      case 'extracurricular_training':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Users className="w-3 h-3" /> Latihan Ekskul
          </span>
        );
      case 'competition':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Trophy className="w-3 h-3" /> Lomba / Kompetisi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            {cat || 'Tidak Diketahui'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-[#EAE6DC] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EAE6DC] flex items-center justify-between bg-[#F9F8F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#171717]">Import Jadwal via File Excel</h2>
              <p className="text-xs text-[#68655F]">
                Unggah berkas spreadsheet (.xlsx / .csv) untuk memasukkan jadwal kegiatan secara massal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* 1. Role-Based Permissions & Context Banner */}
          <div className="bg-[#FFFDF9] border border-[#EAE6DC] rounded-xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#171717]">Hak Akses Role:</span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-2xs ${
                  isPengurus
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : isPembina
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {isPengurus ? 'Pengurus' : isPembina ? 'Pembina Ekskul' : 'Administrator'}
                </span>
              </div>
              <p className="text-[#68655F] leading-relaxed">
                {isPengurus ? (
                  <>
                    Sebagai <strong>Pengurus</strong>, Anda berwenang mengimpor jadwal untuk kategori{' '}
                    <span className="text-blue-800 font-semibold underline decoration-blue-300">Acara Sekolah (school_event)</span> dan{' '}
                    <span className="text-rose-800 font-semibold underline decoration-rose-300">Hari Besar Nasional (national_holiday)</span>. Kolom <code>extracurricular_id</code> otomatis diset ke <strong>NULL</strong>.
                  </>
                ) : isPembina ? (
                  <>
                    Sebagai <strong>Pembina Ekskul</strong>, Anda berwenang mengimpor jadwal untuk kategori{' '}
                    <span className="text-emerald-800 font-semibold underline decoration-emerald-300">Pertemuan / Latihan (extracurricular_training)</span> dan{' '}
                    <span className="text-amber-800 font-semibold underline decoration-amber-300">Informasi Lomba (competition)</span>. Agenda akan otomatis terikat ke ID ekskul yang Anda bina.
                  </>
                ) : (
                  <>
                    Sebagai <strong>Administrator</strong>, Anda memiliki izin penuh untuk mengimpor seluruh kategori agenda sekolah dan ekstrakurikuler.
                  </>
                )}
              </p>
            </div>

            {/* Template Download Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              icon={<Download className="w-4 h-4 text-emerald-700" />}
              className="shrink-0 border-emerald-300 text-emerald-800 hover:bg-emerald-50 shadow-2xs font-semibold"
            >
              Download Template Excel (.xlsx)
            </Button>
          </div>

          {/* 2. Drag & Drop File Upload Area */}
          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                  : 'border-[#D1CCC0] bg-[#FAF8F5] hover:bg-[#F5F2EA] hover:border-[#B5AEA0]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#EAE6DC] text-emerald-700 shadow-sm flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#171717]">
                Pilih Berkas Excel atau Tarik & Lepas (Drag-and-Drop) ke Sini
              </h3>
              <p className="text-xs text-[#68655F] mt-1 max-w-md mx-auto">
                Mendukung format spreadsheet <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong>. Pastikan kolom header sesuai dengan template.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-stone-200/70 text-stone-700 font-mono text-2xs font-semibold">
                  Maks. 5 MB
                </span>
                <span className="px-2.5 py-1 rounded-md bg-stone-200/70 text-stone-700 font-mono text-2xs font-semibold">
                  UTF-8 Safe
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE6DC] rounded-xl p-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#171717]">{selectedFile.name}</div>
                  <div className="text-2xs text-[#68655F] flex items-center gap-3 mt-0.5">
                    <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">
                      {parsedRows.length} baris data terbaca
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetFile}
                className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Ganti Berkas
              </button>
            </div>
          )}

          {/* 3. Alerts for API feedback */}
          {apiError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl space-y-1">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm block">Gagal Mengimpor Berkas:</span>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">{apiError.message}</p>
                  {apiError.row && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-rose-200 text-rose-900 font-bold rounded text-2xs">
                      Deteksi Kesalahan: Baris ke-{apiError.row} pada file Excel
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {apiSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-sm block">Import Berhasil Selesai!</span>
                <p className="text-xs text-emerald-800 mt-0.5">{apiSuccess}</p>
              </div>
            </div>
          )}

          {/* 4. Parsed Table Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#171717]">
                  Pratinjau Data ({parsedRows.length} Kegiatan Ditemukan)
                </span>
                <span className="text-2xs text-[#525049]">
                  Periksa kembali daftar kegiatan sebelum disimpan ke kalender
                </span>
              </div>

              <div className="border border-[#EAE6DC] rounded-xl overflow-hidden shadow-2xs max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse text-2xs">
                  <thead className="bg-[#F9F8F6] text-[#68655F] font-semibold sticky top-0 border-b border-[#EAE6DC]">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">Baris</th>
                      <th className="py-2.5 px-3">Judul Agenda</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Waktu Mulai & Selesai</th>
                      <th className="py-2.5 px-3">Lokasi</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE6DC] bg-white">
                    {parsedRows.map((row) => {
                      const isErrorRow =
                        row.validationError || (apiError?.row && apiError.row === row.rowIndex);

                      return (
                        <tr
                          key={row.rowIndex}
                          className={`transition-colors ${
                            isErrorRow ? 'bg-rose-50/70' : 'hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-stone-500">
                            {row.rowIndex}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#171717]">
                            {row.title || <span className="text-rose-600 font-italic">[Kosong]</span>}
                          </td>
                          <td className="py-2.5 px-3">
                            {getCategoryBadge(row.normalizedCategory)}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-stone-600 whitespace-nowrap">
                            <div>{row.start_time || '-'}</div>
                            <div className="text-stone-400">s/d {row.end_time || '-'}</div>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 truncate max-w-[140px]">
                            {row.location}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {row.validationError ? (
                              <span className="text-rose-600 font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                {row.validationError}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 shrink-0" />
                                Valid
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Help / Instructions Box */}
          <div className="bg-[#FAF8F5] border border-[#EAE6DC] rounded-xl p-3.5 flex items-start gap-2.5 text-2xs text-[#68655F]">
            <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#171717]">Ketentuan Import:</strong> Baris ke-1 harus berupa nama kolom (<code>title</code>, <code>category</code>, <code>start_time</code>, <code>end_time</code>, <code>location</code>, <code>organizer</code>, <code>description</code>). Format tanggal wajib berupa <code>YYYY-MM-DD HH:MM:SS</code> (contoh: <code>2026-10-15 15:30:00</code>).
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#EAE6DC] bg-[#F9F8F6] flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Tutup
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmitImport}
            disabled={parsedRows.length === 0 || isSubmitting || isProcessingFile}
            icon={
              isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )
            }
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm"
          >
            {isSubmitting
              ? 'Menyimpan ke Kalender...'
              : `Mulai Simpan (${parsedRows.length} Jadwal)`}
          </Button>
        </div>

      </div>
    </div>
  );
};
