import React, { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Users,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Extracurricular } from '@/types';

interface AdminFormEkskulPageProps {
  ekskulId?: string; // If provided, Edit mode; otherwise Create mode
  editId?: string;
  onNavigate: (path: string) => void;
}

export const AdminFormEkskulPage: React.FC<AdminFormEkskulPageProps> = ({ ekskulId, editId, onNavigate }) => {
  const targetId = ekskulId || editId;
  const isEditMode = Boolean(targetId);
  const existingEkskul = isEditMode && targetId ? db.getExtracurricularById(targetId) : null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Extracurricular['category']>('Olahraga');
  const [registrationStatus, setRegistrationStatus] = useState<'open' | 'closed'>('open');
  const [memberCapacity, setMemberCapacity] = useState(30);
  const [practiceSchedule, setPracticeSchedule] = useState('');
  const [location, setLocation] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [chairpersonName, setChairpersonName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate data in edit mode
  useEffect(() => {
    if (existingEkskul) {
      setName(existingEkskul.name || '');
      setCategory(existingEkskul.category || 'Olahraga');
      setRegistrationStatus(existingEkskul.registration_status || 'open');
      setMemberCapacity(existingEkskul.member_capacity || 30);
      setPracticeSchedule(existingEkskul.practice_schedule || '');
      setLocation(existingEkskul.location || '');
      setSupervisorName(existingEkskul.supervisor_name || '');
      setChairpersonName(existingEkskul.chairperson_name || '');
      setShortDescription(existingEkskul.short_description || '');
      setFullDescription(existingEkskul.full_description || '');
      setImageUrl(existingEkskul.profile_image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800');
    }
  }, [existingEkskul]);

  if (isEditMode && !existingEkskul) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <h2 className="text-xl font-bold text-[#171717]">Ekstrakurikuler Tidak Ditemukan</h2>
        <p className="text-sm text-[#525049]">Data kegiatan yang ingin kamu edit tidak ditemukan.</p>
        <Button variant="outline" onClick={() => onNavigate('/admin/ekskul')}>
          Kembali ke Daftar Ekskul
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Nama ekstrakurikuler wajib diisi.');
      return;
    }
    if (!supervisorName.trim()) {
      setFormError('Nama guru pembina wajib diisi.');
      return;
    }
    if (!practiceSchedule.trim()) {
      setFormError('Jadwal latihan rutin wajib diisi.');
      return;
    }
    if (!location.trim()) {
      setFormError('Lokasi kegiatan wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    if (isEditMode && ekskulId) {
      const res = db.updateExtracurricular(ekskulId, {
        name: name.trim(),
        category,
        registration_status: registrationStatus,
        member_capacity: Number(memberCapacity) || 30,
        practice_schedule: practiceSchedule.trim(),
        location: location.trim(),
        supervisor_name: supervisorName.trim(),
        chairperson_name: chairpersonName.trim() || 'Siswa Terpilih',
        short_description: shortDescription.trim() || 'Program pembinaan bakat dan minat siswa.',
        full_description: fullDescription.trim() || shortDescription.trim() || 'Program pembinaan ekstrakurikuler resmi sekolah.',
        image_url: imageUrl.trim(),
        profile_image: imageUrl.trim(),
      });

      setIsSubmitting(false);

      if (res.success) {
        setFormSuccess('Perubahan ekstrakurikuler berhasil disimpan!');
        setTimeout(() => onNavigate('/admin/ekskul'), 1200);
      } else {
        setFormError(res.message);
      }
    } else {
      const res = db.addExtracurricular({
        name: name.trim(),
        category,
        registration_status: registrationStatus,
        member_capacity: Number(memberCapacity) || 30,
        practice_schedule: practiceSchedule.trim(),
        location: location.trim(),
        supervisor_name: supervisorName.trim(),
        chairperson_name: chairpersonName.trim() || 'Siswa Terpilih',
        short_description: shortDescription.trim() || 'Program pembinaan bakat dan minat siswa.',
        full_description: fullDescription.trim() || shortDescription.trim() || 'Program pembinaan ekstrakurikuler resmi sekolah.',
        image_url: imageUrl.trim(),
        profile_image: imageUrl.trim(),
      });

      setIsSubmitting(false);

      if (res.success) {
        setFormSuccess('Ekstrakurikuler baru berhasil ditambahkan!');
        setTimeout(() => onNavigate('/admin/ekskul'), 1200);
      } else {
        setFormError(res.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/admin/ekskul')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#234B36] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Ekstrakurikuler</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#234B36] flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manajemen Ekstrakurikuler Sekolah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            {isEditMode ? `Edit Data: ${existingEkskul?.name}` : 'Tambah Ekstrakurikuler Baru'}
          </h1>
          <p className="text-xs text-[#525049] mt-0.5">
            Lengkapi rincian jadwal, daya tampung kuota, dan penugasan guru pembina.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={registrationStatus === 'open' ? 'success' : 'neutral'}>
            Status: {registrationStatus === 'open' ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
          </Badge>
        </div>
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* SECTION 1: INFORMASI UTAMA */}
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#171717] pb-2 border-b border-[#EAE6DC]">
            1. Informasi Pokok Kegiatan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Ekstrakurikuler"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Futsal SMKN 1 Ciomas"
              required
            />

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525049] mb-1.5">
                Kategori Ekskul
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#234B36]/20 focus:border-[#234B36]"
              >
                <option value="Olahraga">Olahraga</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Bahasa & Literasi">Bahasa & Literasi</option>
                <option value="Keagamaan">Keagamaan</option>
                <option value="Kemanusiaan">Kemanusiaan</option>
                <option value="Sains & Teknologi">Sains & Teknologi</option>
                <option value="Seni & Budaya">Seni & Budaya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525049] mb-1.5">
                Status Penerimaan Anggota Baru
              </label>
              <select
                value={registrationStatus}
                onChange={(e) => setRegistrationStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#234B36]/20 focus:border-[#234B36]"
              >
                <option value="open">Dibuka (Siswa bisa mendaftar)</option>
                <option value="closed">Ditutup (Pendaftaran selesai)</option>
              </select>
            </div>

            <Input
              label="Daya Tampung / Kapasitas Kuota Siswa"
              type="number"
              min={5}
              max={150}
              value={memberCapacity}
              onChange={(e) => setMemberCapacity(Number(e.target.value))}
              placeholder="Contoh: 30"
              required
            />
          </div>
        </div>

        {/* SECTION 2: JADWAL & LOKASI */}
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#171717] pb-2 border-b border-[#EAE6DC]">
            2. Jadwal Latihan & Fasilitas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jadwal Latihan Rutin"
              type="text"
              value={practiceSchedule}
              onChange={(e) => setPracticeSchedule(e.target.value)}
              placeholder="Contoh: Setiap Jumat (15:30 - 17:30 WIB)"
              required
            />

            <Input
              label="Lokasi / Ruangan Fasilitas"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gelanggang Olahraga / Lapangan Utama"
              required
            />
          </div>
        </div>

        {/* SECTION 3: PEMBINA & PENGURUS */}
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#171717] pb-2 border-b border-[#EAE6DC]">
            3. Penugasan Guru Pembina & Ketua Siswa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Guru Pembina"
              type="text"
              value={supervisorName}
              onChange={(e) => setSupervisorName(e.target.value)}
              placeholder="Contoh: Hendra Wijaya, S.Pd."
              required
            />

            <Input
              label="Nama Ketua Siswa / Pengurus Inti"
              type="text"
              value={chairpersonName}
              onChange={(e) => setChairpersonName(e.target.value)}
              placeholder="Contoh: Dimas Setiawan (XII RPL 1)"
            />
          </div>
        </div>

        {/* SECTION 4: DESKRIPSI & FOTO BANNER */}
        <div className="bg-white border border-[#EAE6DC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#171717] pb-2 border-b border-[#EAE6DC]">
            4. Deskripsi & Foto Sampul
          </h2>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525049] mb-1.5">
              Deskripsi Singkat (Tampil di Katalog Kartu)
            </label>
            <Input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat tentang kegiatan ekskul..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525049] mb-1.5">
              Deskripsi Lengkap (Tampil di Halaman Detail)
            </label>
            <Textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Jelaskan silabus materi, target capaian, kegiatan tahunan, dan manfaat mengikuti kegiatan ini..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525049] mb-1.5">
              URL Foto Sampul (Banner)
            </label>
            <div className="flex gap-3 items-center">
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1"
              />
            </div>
            
            {imageUrl && (
              <div className="mt-3 relative h-36 w-full rounded-xl overflow-hidden border border-[#EAE6DC] bg-[#F9F8F6]">
                <img
                  src={imageUrl}
                  alt="Pratinjau Foto"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Pratinjau Foto Sampul
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 bg-white border border-[#EAE6DC] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => onNavigate('/admin/ekskul')}
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
            {isEditMode ? 'Simpan Perubahan Ekskul' : 'Terbitkan Ekstrakurikuler Baru'}
          </Button>
        </div>
      </form>
    </div>
  );
};
