import React, { useState } from 'react';
import { db } from '@/lib/database';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Calendar,
  Building2,
  FileCheck
} from 'lucide-react';

interface StudentUploadDocumentPageProps {
  onNavigate: (path: string) => void;
}

export const StudentUploadDocumentPage: React.FC<StudentUploadDocumentPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id || 'usr-student-1';

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileUrl, setFileUrl] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title.trim()) {
      setFormError('Judul sertifikat atau piagam penghargaan wajib diisi.');
      return;
    }
    if (!issuer.trim()) {
      setFormError('Lembaga atau instansi penerbit wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    const res = db.addCertificate({
      student_id: studentId,
      title: title.trim(),
      issuer: issuer.trim(),
      certificate_number: certificateNumber.trim() || undefined,
      issue_date: issueDate,
      file_url: fileUrl.trim() || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    });

    setIsSubmitting(false);

    if (res.success) {
      setFormSuccess('Sertifikat / piagam berhasil disimpan ke portofoliomu!');
      setTimeout(() => {
        onNavigate('/student/documents');
      }, 1400);
    } else {
      setFormError(res.message || 'Gagal menyimpan dokumen.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/student/documents')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#234B36] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dokumen Portofolio</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#234B36] flex items-center gap-1.5 mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>Arsip Prestasi & Portofolio Siswa</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
          Unggah Piagam & Sertifikat Baru
        </h1>
        <p className="text-xs text-[#525049] mt-0.5">
          Simpan bukti kejuaraan, sertifikat kompetisi, atau piagam kepengurusan untuk dilampirkan pada portofolio kelulusan.
        </p>
      </div>

      {/* Notifications */}
      {formError && (
        <div className="p-3.5 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="p-3.5 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#EAE6DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 text-xs">
        <Input
          label="Judul Sertifikat / Piagam Penghargaan"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Juara 1 Lomba Desain Web Pelajar Tingkat Kota"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Lembaga / Instansi Penyelenggara"
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="Contoh: Dinas Pendidikan / Universitas"
            required
          />

          <Input
            label="Nomor Sertifikat (Jika Tercantum)"
            type="text"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            placeholder="Contoh: 421.3/SERT/2026/09"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tanggal Diterbitkan"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />

          <Input
            label="Tautan Berkas Scan / Foto Bukti"
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://drive.google.com/... atau URL gambar"
          />
        </div>

        <div className="p-4 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-xs space-y-1.5 text-[#525049]">
          <div className="font-bold text-[#171717] flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-[#234B36]" />
            <span>Pemeriksaan oleh Pembina:</span>
          </div>
          <p className="leading-relaxed">
            Sertifikat yang kamu simpan akan langsung tercatat di tab dokumen portofoliomu. Guru pembina ekskul terkait dapat mengesahkan prestasi ini agar tercetak di transkrip resmi ber-QR.
          </p>
        </div>

        <div className="pt-3 border-t border-[#EAE6DC] flex flex-col sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => onNavigate('/student/documents')}
            className="w-full sm:w-auto rounded-xl"
          >
            Batal
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full sm:w-auto rounded-xl px-6"
          >
            Simpan Dokumen Piagam
          </Button>
        </div>
      </form>
    </div>
  );
};
