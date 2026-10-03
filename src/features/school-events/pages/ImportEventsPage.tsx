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
  FileText,
  Download,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Trash2,
  Info
} from 'lucide-react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';

interface ParsedEventRow {
  index: number;
  title: string;
  category: string;
  normalizedCategory: 'practice' | 'competition' | 'ceremony' | 'exhibition';
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

  const isPembina = role === 'pembina';
  const isGuru = role === 'guru';
  const isAdmin = role === 'admin';

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedEventRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDownloadTemplate = async () => {
    try {
      const XLSX = await import('xlsx');
      const templateData = [
        {
          'Judul Agenda': 'Latihan Rutin Futsal',
          'Kategori': 'Latihan Rutin',
          'Tanggal Mulai (YYYY-MM-DD HH:mm)': '2026-10-10 15:30',
          'Tanggal Selesai (YYYY-MM-DD HH:mm)': '2026-10-10 17:30',
          'Lokasi': 'Lapangan Futsal Utama',
          'Penyelenggara': 'Futsal Garuda Nusantara',
          'Deskripsi': 'Latihan fisik dan taktik mingguan.',
        },
        {
          'Judul Agenda': 'Simulasi Lomba Robotika',
          'Kategori': 'Kompetisi',
          'Tanggal Mulai (YYYY-MM-DD HH:mm)': '2026-10-12 09:00',
          'Tanggal Selesai (YYYY-MM-DD HH:mm)': '2026-10-12 14:00',
          'Lokasi': 'Lab Komputer 3',
          'Penyelenggara': 'Robotika & Otomasi IoT',
          'Deskripsi': 'Uji coba lintasan arena sebelum turnamen kota.',
        },
      ];

      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Jadwal Agenda');
      XLSX.writeFile(wb, 'Format_Jadwal_Kegiatan_EskulHub.xlsx');
    } catch (err) {
      console.error('Error generating template:', err);
    }
  };

  const parseFile = async (file: File) => {
    setIsParsing(true);
    setParseError(null);
    setParsedRows([]);

    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (!jsonData || jsonData.length === 0) {
        setParseError('File Excel tidak berisi data baris agenda. Silakan unduh format template resmi.');
        setIsParsing(false);
        return;
      }

      const rows: ParsedEventRow[] = jsonData.map((row, idx) => {
        const title = String(row['Judul Agenda'] || row['Judul'] || row['Nama Kegiatan'] || '').trim();
        const rawCategory = String(row['Kategori'] || row['Jenis'] || 'Latihan Rutin').trim();
        const startTime = String(row['Tanggal Mulai (YYYY-MM-DD HH:mm)'] || row['Mulai'] || '').trim().replace(' ', 'T');
        const endTime = String(row['Tanggal Selesai (YYYY-MM-DD HH:mm)'] || row['Selesai'] || '').trim().replace(' ', 'T');
        const location = String(row['Lokasi'] || row['Tempat'] || 'Kampus Utama').trim();
        const organizer = String(row['Penyelenggara'] || row['Ekskul'] || 'Kesiswaan').trim();
        const description = String(row['Deskripsi'] || row['Keterangan'] || '').trim();

        let normalizedCategory: 'practice' | 'competition' | 'ceremony' | 'exhibition' = 'practice';
        const lowerCat = rawCategory.toLowerCase();
        if (lowerCat.includes('kompetisi') || lowerCat.includes('lomba')) normalizedCategory = 'competition';
        else if (lowerCat.includes('upacara') || lowerCat.includes('resmi')) normalizedCategory = 'ceremony';
        else if (lowerCat.includes('pameran') || lowerCat.includes('unjuk')) normalizedCategory = 'exhibition';

        let isValid = true;
        let validationError = '';

        if (!title) {
          isValid = false;
          validationError = 'Judul agenda kosong';
        } else if (!startTime || isNaN(Date.parse(startTime))) {
          isValid = false;
          validationError = 'Format waktu mulai tidak valid (gunakan YYYY-MM-DD HH:mm)';
        }

        return {
          index: idx + 1,
          title,
          category: rawCategory,
          normalizedCategory,
          start_time: startTime,
          end_time: endTime || startTime,
          location,
          organizer,
          description: description || `Agenda kegiatan ${title}`,
          isValid,
          validationError,
        };
      });

      setParsedRows(rows);
    } catch (err: any) {
      setParseError(`Gagal membaca file Excel: ${err?.message || 'Format file tidak didukung.'}`);
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

  const handleSaveAll = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setSubmitError('Tidak ada baris data agenda yang valid untuk disimpan.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      validRows.forEach((r) => {
        db.addSchoolEvent({
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
        });
      });

      setSubmitSuccess(`Berhasil! Sebanyak ${validRows.length} agenda kegiatan berhasil ditambahkan ke kalender sekolah.`);
      setTimeout(() => {
        onNavigate('/calendar');
      }, 1600);
    } catch (err: any) {
      setSubmitError(err?.message || 'Gagal menyimpan data agenda ke kalender.');
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
            Unggah jadwal kegiatan satu semester sekaligus melalui file spreadsheet (.xlsx atau .xls).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          icon={<Download className="w-3.5 h-3.5" />}
          className="rounded-xl"
        >
          Unduh Format Template Excel
        </Button>
      </div>

      {/* Notification Banners */}
      {submitSuccess && (
        <div className="p-4 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] text-xs rounded-xl flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{submitSuccess}</span>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {parseError && (
        <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* STEP 1: DROPZONE FILE UPLOAD */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#171717]">1. Pilih File Excel Jadwal</h2>
        
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
              {uploadedFile ? uploadedFile.name : 'Klik untuk memilih file Excel dari perangkat'}
            </div>
            <p className="text-xs text-[#525049] mt-1">
              Mendukung format .XLSX dan .XLS (Maksimal ukuran 5MB)
            </p>
          </div>

          {uploadedFile && (
            <Badge variant="success">File Terpilih: {(uploadedFile.size / 1024).toFixed(1)} KB</Badge>
          )}
        </div>
      </div>

      {/* STEP 2: PREVIEW TABLE */}
      {isParsing && (
        <div className="p-8 text-center bg-white border border-[#EAE6DC] rounded-2xl space-y-3">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#234B36]" />
          <p className="text-xs text-[#525049] font-medium">Sedang membaca dan memverifikasi baris data Excel...</p>
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
                Periksa daftar baris sebelum disimpan ke kalender resmi sekolah.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Badge variant="success">
                {parsedRows.filter((r) => r.isValid).length} Baris Valid
              </Badge>
              {parsedRows.filter((r) => !r.isValid).length > 0 && (
                <Badge variant="danger">
                  {parsedRows.filter((r) => !r.isValid).length} Baris Error
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
                  <th className="py-2.5 px-3">Waktu Mulai</th>
                  <th className="py-2.5 px-3">Lokasi</th>
                  <th className="py-2.5 px-3">Penyelenggara</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DC] bg-white">
                {parsedRows.map((row) => (
                  <tr key={row.index} className={row.isValid ? 'hover:bg-[#F9F8F6]/40' : 'bg-[#FDEDE9]/40'}>
                    <td className="py-2.5 px-3 text-center text-[#78746B] font-mono">{row.index}</td>
                    <td className="py-2.5 px-3 font-bold text-[#171717]">{row.title}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#F9F8F6] border border-[#EAE6DC] text-[11px] font-medium text-[#525049]">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#525049] font-mono text-[11px]">
                      {row.start_time.replace('T', ' ')}
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D15B40]" title={row.validationError}>
                          <AlertCircle className="w-3.5 h-3.5" />
                          Error
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
              className="w-full sm:w-auto rounded-xl px-6"
            >
              Simpan {parsedRows.filter((r) => r.isValid).length} Agenda ke Kalender
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
