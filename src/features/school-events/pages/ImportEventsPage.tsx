import React, { useState, useRef } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Check,
  Calendar,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { parseExcelDateTime, normalizeEventCategory } from '../utils/calendarUtils';
import * as apiService from '@/lib/api';

interface ParsedEventRow {
  index: number;
  title: string;
  category: string;
  normalizedCategory: 'extracurricular_training' | 'competition' | 'school_event' | 'national_holiday';
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  description: string;
  isValid: boolean;
  validationError?: string;
}

interface ImportEventsPageProps {
  onNavigate: (path: string) => void;
}

export const ImportEventsPage: React.FC<ImportEventsPageProps> = ({ onNavigate }) => {
  const { currentUser, role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedEventRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Generate clean, beautifully formatted Excel spreadsheet with generous column widths and authentic copywriting
  const handleDownloadTemplate = async () => {
    try {
      const XLSX = await import('xlsx');

      // Sheet 1: Real-world, ready-to-use sample activities for SMKN 1 Ciomas
      const sampleEvents = [
        {
          'Judul Agenda': 'Latihan Fisik & Taktik Futsal',
          'Kategori': 'Latihan Rutin',
          'Tanggal Mulai': '2026-10-10 15:30',
          'Tanggal Selesai': '2026-10-10 17:30',
          'Lokasi': 'Lapangan Futsal SMKN 1 Ciomas',
          'Penyelenggara': 'Futsal',
          'Deskripsi': 'Latihan ketahanan fisik, passing pendek, dan simulasi strategi tanding mingguan.',
        },
        {
          'Judul Agenda': 'Simulasi Tanding Basket Antarregu',
          'Kategori': 'Kompetisi',
          'Tanggal Mulai': '2026-10-12 15:30',
          'Tanggal Selesai': '2026-10-12 17:30',
          'Lokasi': 'Lapangan Basket Outdoor SMKN 1 Ciomas',
          'Penyelenggara': 'Basket',
          'Deskripsi': 'Uji coba pola penyerangan dan pertahanan sebelum turnamen pelajar se-Bogor.',
        },
        {
          'Judul Agenda': 'Latihan Baris-Berbaris & Variasi Formasi',
          'Kategori': 'Latihan Rutin',
          'Tanggal Mulai': '2026-10-13 15:30',
          'Tanggal Selesai': '2026-10-13 17:30',
          'Lokasi': 'Lapangan Upacara Utama SMKN 1 Ciomas',
          'Penyelenggara': 'Paskibra',
          'Deskripsi': 'Pemantapan langkah tegap, tempo baris-berbaris, dan formasi pengibaran bendera.',
        },
        {
          'Judul Agenda': 'Kajian Rutin & Mentoring Adab Pelajar',
          'Kategori': 'Acara Sekolah',
          'Tanggal Mulai': '2026-10-16 13:00',
          'Tanggal Selesai': '2026-10-16 15:00',
          'Lokasi': 'Masjid Al-Kautsar SMKN 1 Ciomas',
          'Penyelenggara': 'Rohis',
          'Deskripsi': 'Kajian keagamaan tematik, tadarus bersama, dan bimbingan adab bagi siswa.',
        },
        {
          'Judul Agenda': 'Praktik Pertolongan Pertama & Balut Bidai',
          'Kategori': 'Latihan Rutin',
          'Tanggal Mulai': '2026-10-17 08:30',
          'Tanggal Selesai': '2026-10-17 11:00',
          'Lokasi': 'Ruang UKS & Area Terbuka SMKN 1 Ciomas',
          'Penyelenggara': 'PMR',
          'Deskripsi': 'Materi balut bidai patah tulang, evakuasi tandu darurat, dan penanganan luka ringan.',
        },
        {
          'Judul Agenda': 'English Speech & Debate Practice',
          'Kategori': 'Latihan Rutin',
          'Tanggal Mulai': '2026-10-21 15:30',
          'Tanggal Selesai': '2026-10-21 17:00',
          'Lokasi': 'Laboratorium Bahasa SMKN 1 Ciomas',
          'Penyelenggara': 'English Club',
          'Deskripsi': 'Latihan public speaking, debat parlemen, dan pelafalan kosakata bahasa Inggris.',
        },
      ];

      // Sheet 2: Clear, human guide instructions
      const guideData = [
        {
          'Nama Kolom': 'Judul Agenda',
          'Status': 'Wajib',
          'Contoh Nilai': 'Latihan Fisik & Taktik Futsal',
          'Keterangan': 'Nama kegiatan yang akan muncul pada kotak tanggal kalender.',
        },
        {
          'Nama Kolom': 'Kategori',
          'Status': 'Wajib',
          'Contoh Nilai': 'Latihan Rutin',
          'Keterangan': 'Pilihan: Latihan Rutin, Kompetisi, Acara Sekolah, atau Libur Nasional.',
        },
        {
          'Nama Kolom': 'Tanggal Mulai',
          'Status': 'Wajib',
          'Contoh Nilai': '2026-10-10 15:30',
          'Keterangan': 'Format didukung: YYYY-MM-DD HH:mm, YYYY-MM-DD, atau DD/MM/YYYY HH:mm.',
        },
        {
          'Nama Kolom': 'Tanggal Selesai',
          'Status': 'Opsional',
          'Contoh Nilai': '2026-10-10 17:30',
          'Keterangan': 'Jika kosong, otomatis diatur 2 jam setelah waktu mulai.',
        },
        {
          'Nama Kolom': 'Lokasi',
          'Status': 'Wajib',
          'Contoh Nilai': 'Lapangan Futsal SMKN 1 Ciomas',
          'Keterangan': 'Tempat pelaksanaan agenda di lingkungan sekolah atau luar sekolah.',
        },
        {
          'Nama Kolom': 'Penyelenggara',
          'Status': 'Wajib',
          'Contoh Nilai': 'Futsal',
          'Keterangan': 'Nama ekstrakurikuler atau pihak pengurus penyelenggara agenda.',
        },
        {
          'Nama Kolom': 'Deskripsi',
          'Status': 'Opsional',
          'Contoh Nilai': 'Latihan fisik mingguan.',
          'Keterangan': 'Ringkasan materi atau catatan instruksi bagi peserta.',
        },
      ];

      const wsEvents = XLSX.utils.json_to_sheet(sampleEvents);
      const wsGuide = XLSX.utils.json_to_sheet(guideData);

      // Set generous column widths so text is never truncated in Microsoft Excel
      wsEvents['!cols'] = [
        { wch: 38 }, // Judul Agenda
        { wch: 22 }, // Kategori
        { wch: 24 }, // Tanggal Mulai
        { wch: 24 }, // Tanggal Selesai
        { wch: 34 }, // Lokasi
        { wch: 22 }, // Penyelenggara
        { wch: 60 }, // Deskripsi
      ];

      wsGuide['!cols'] = [
        { wch: 22 }, // Nama Kolom
        { wch: 14 }, // Status
        { wch: 32 }, // Contoh Nilai
        { wch: 65 }, // Keterangan
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsEvents, 'Jadwal Kegiatan');
      XLSX.utils.book_append_sheet(wb, wsGuide, 'Panduan Pengisian');

      XLSX.writeFile(wb, 'Format_Jadwal_Kegiatan_EskulHub.xlsx');
    } catch (err) {
      console.error('Error generating template:', err);
    }
  };

  // Helper to extract field by checking multiple common header variations
  const extractField = (row: Record<string, any>, candidates: string[]): any => {
    for (const key of Object.keys(row)) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const cand of candidates) {
        const cleanCand = cand.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanKey === cleanCand || cleanKey.startsWith(cleanCand)) {
          return row[key];
        }
      }
    }
    return '';
  };

  const parseFile = async (file: File) => {
    setIsParsing(true);
    setParseError(null);
    setParsedRows([]);

    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (!jsonData || jsonData.length === 0) {
        setParseError('Berkas Excel kosong atau tidak memiliki baris data. Silakan unduh format template resmi.');
        setIsParsing(false);
        return;
      }

      const rows: ParsedEventRow[] = jsonData.map((row, idx) => {
        const rawTitle = extractField(row, [
          'judul agenda',
          'judul',
          'nama kegiatan',
          'nama agenda',
          'title',
          'agenda',
        ]);
        const title = String(rawTitle || '').trim();

        const rawCat = extractField(row, [
          'kategori',
          'jenis kegiatan',
          'jenis',
          'category',
          'tipe',
        ]);
        const categoryString = String(rawCat || 'Latihan Rutin').trim();
        const normalizedCategory = normalizeEventCategory(categoryString);

        const rawStartTime = extractField(row, [
          'tanggal mulai',
          'waktu mulai',
          'mulai',
          'tanggal',
          'start_time',
          'start_datetime',
          'start',
        ]);
        const rawEndTime = extractField(row, [
          'tanggal selesai',
          'waktu selesai',
          'selesai',
          'sampai',
          'end_time',
          'end_datetime',
          'end',
        ]);

        const rawLocation = extractField(row, ['lokasi', 'tempat', 'ruangan', 'location']);
        const location = String(rawLocation || 'Lingkungan SMKN 1 Ciomas').trim();

        const rawOrganizer = extractField(row, [
          'penyelenggara',
          'ekskul',
          'ekstrakurikuler',
          'organizer',
          'pic',
        ]);
        const organizer = String(rawOrganizer || currentUser?.name || 'Pengurus Sekolah').trim();

        const rawDesc = extractField(row, ['deskripsi', 'keterangan', 'catatan', 'description']);
        const description = String(rawDesc || `Agenda kegiatan ${title}`).trim();

        // Universal date parsing with robust fallback
        const parsedStart = parseExcelDateTime(rawStartTime, '08:00:00');
        let parsedEnd = parseExcelDateTime(rawEndTime, '10:00:00');

        let isValid = true;
        let validationError = '';

        if (!title) {
          isValid = false;
          validationError = 'Judul agenda wajib diisi.';
        } else if (!parsedStart) {
          isValid = false;
          validationError = 'Format tanggal mulai tidak terbaca. Gunakan format YYYY-MM-DD HH:mm atau YYYY-MM-DD.';
        } else {
          // If end time is missing or before start time, set to start + 2 hours
          const startDate = new Date(parsedStart.replace(' ', 'T'));
          if (!parsedEnd) {
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
            const y = endDate.getFullYear();
            const m = String(endDate.getMonth() + 1).padStart(2, '0');
            const d = String(endDate.getDate()).padStart(2, '0');
            const hh = String(endDate.getHours()).padStart(2, '0');
            const mm = String(endDate.getMinutes()).padStart(2, '0');
            const ss = String(endDate.getSeconds()).padStart(2, '0');
            parsedEnd = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
          } else {
            const endDate = new Date(parsedEnd.replace(' ', 'T'));
            if (endDate.getTime() < startDate.getTime()) {
              isValid = false;
              validationError = 'Waktu selesai tidak boleh lebih awal dari waktu mulai.';
            }
          }
        }

        return {
          index: idx + 1,
          title,
          category: categoryString,
          normalizedCategory,
          start_time: parsedStart || '',
          end_time: parsedEnd || parsedStart || '',
          location,
          organizer,
          description,
          isValid,
          validationError,
        };
      });

      setParsedRows(rows);
    } catch (err: any) {
      setParseError(`Gagal membaca berkas Excel: ${err?.message || 'Format berkas tidak didukung.'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      parseFile(file);
    }
  };

  const handleSaveAll = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setSubmitError('Tidak ada baris data agenda yang valid untuk disimpan.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // Save each valid row to local store and backend
      for (const r of validRows) {
        const payload = {
          title: r.title,
          category: r.normalizedCategory,
          event_type: r.normalizedCategory,
          location: r.location,
          start_datetime: r.start_time,
          end_datetime: r.end_time,
          start_time: r.start_time,
          end_time: r.end_time,
          description: r.description,
          organizer: r.organizer,
        };

        db.addSchoolEvent(payload);
      }

      // Synchronize state across stores
      try {
        await db.syncWithBackend();
      } catch {
        // Safe fallback in local store
      }

      setSubmitSuccess(`Berhasil menyimpan ${validRows.length} agenda kegiatan ke kalender sekolah.`);
      setTimeout(() => {
        onNavigate('/calendar');
      }, 1000);
    } catch (err: any) {
      setSubmitError(err?.message || 'Terjadi kendala saat menyimpan data agenda ke kalender.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/calendar')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#234B36] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Kalender Kegiatan</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#234B36] flex items-center gap-1.5 mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Impor Data Kalender Massal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Impor Agenda Kegiatan dari Excel
          </h1>
          <p className="text-xs text-[#525049] mt-0.5">
            Unggah jadwal latihan atau agenda kegiatan ekstrakurikuler satu semester sekaligus melalui berkas spreadsheet.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          icon={<Download className="w-3.5 h-3.5" />}
          className="rounded-xl border-[#B7D2C2] text-[#234B36] hover:bg-[#E7EFEA]"
        >
          Unduh Format Template Excel
        </Button>
      </div>

      {/* Notification Banners */}
      {submitSuccess && (
        <div className="p-4 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] text-xs rounded-xl flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{submitSuccess}</span>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded-xl flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {parseError && (
        <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded-xl flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* STEP 1: DROPZONE FILE UPLOAD */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#171717]">1. Pilih Berkas Excel Jadwal</h2>
          <span className="text-[11px] text-[#78746B]">Format: .xlsx atau .xls</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#EAE6DC] hover:border-[#234B36] rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#F9F8F6]/50 hover:bg-[#F9F8F6] space-y-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EAE6DC] text-[#234B36] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <div className="text-sm font-bold text-[#171717]">
              {uploadedFile ? uploadedFile.name : 'Klik untuk memilih berkas Excel dari perangkat'}
            </div>
            <p className="text-xs text-[#525049] mt-1">
              Kolom dan baris tanggal akan diverifikasi secara otomatis sebelum disimpan ke kalender.
            </p>
          </div>

          {uploadedFile && (
            <Badge variant="success">Berkas Terpilih: {(uploadedFile.size / 1024).toFixed(1)} KB</Badge>
          )}
        </div>
      </div>

      {/* STEP 2: PREVIEW TABLE */}
      {isParsing && (
        <div className="p-8 text-center bg-white border border-[#EAE6DC] rounded-2xl space-y-3">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#234B36]" />
          <p className="text-xs text-[#525049] font-medium">Sedang membaca dan memverifikasi baris agenda...</p>
        </div>
      )}

      {parsedRows.length > 0 && !isParsing && (
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">
                2. Pratinjau & Validasi Data ({parsedRows.length} Agenda Ditemukan)
              </h2>
              <p className="text-xs text-[#525049] mt-0.5">
                Pastikan tanggal, jam pelaksanaan, dan nama ekskul sudah tepat sebelum disimpan.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Badge variant="success">
                {parsedRows.filter((r) => r.isValid).length} Baris Siap Disimpan
              </Badge>
              {parsedRows.filter((r) => !r.isValid).length > 0 && (
                <Badge variant="danger">
                  {parsedRows.filter((r) => !r.isValid).length} Perlu Diperbaiki
                </Badge>
              )}
            </div>
          </div>

          {/* Responsive full-width table */}
          <div className="overflow-x-auto border border-[#EAE6DC] rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F9F8F6] text-[#525049] font-semibold border-b border-[#EAE6DC]">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3">Judul Agenda</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Tanggal & Waktu Mulai</th>
                  <th className="py-2.5 px-3">Waktu Selesai</th>
                  <th className="py-2.5 px-3">Lokasi</th>
                  <th className="py-2.5 px-3">Penyelenggara</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DC] bg-white">
                {parsedRows.map((row) => (
                  <tr key={row.index} className={row.isValid ? 'hover:bg-[#F9F8F6]/40' : 'bg-[#FDEDE9]/40'}>
                    <td className="py-2.5 px-3 text-center text-[#78746B] font-mono">{row.index}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#171717]">{row.title}</div>
                      {row.description && (
                        <div className="text-[11px] text-[#78746B] line-clamp-1">{row.description}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#F9F8F6] border border-[#EAE6DC] text-[11px] font-medium text-[#525049]">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#171717] font-mono text-[11px]">
                      {row.start_time ? row.start_time : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[#525049] font-mono text-[11px]">
                      {row.end_time ? row.end_time : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[#525049]">{row.location}</td>
                    <td className="py-2.5 px-3 text-[#525049]">{row.organizer}</td>
                    <td className="py-2.5 px-3 text-center">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#234B36]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Siap
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D15B40]"
                          title={row.validationError}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {row.validationError || 'Perlu dicek'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* STEP 3: ACTION BUTTONS */}
          <div className="pt-3 border-t border-[#EAE6DC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => onNavigate('/calendar')}
              className="w-full sm:w-auto rounded-xl"
            >
              Batal
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleSaveAll}
              icon={<CheckCircle2 className="w-4 h-4" />}
              className="w-full sm:w-auto rounded-xl px-6 bg-[#234B36] hover:bg-[#1b3b2b]"
            >
              Simpan {parsedRows.filter((r) => r.isValid).length} Agenda ke Kalender
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

