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
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit2,
  Info,
  Layers,
} from 'lucide-react';
import { Extracurricular } from '@/types';

interface AdminFormEkskulPageProps {
  ekskulId?: string;
  editId?: string;
  onNavigate: (path: string) => void;
}

export const AdminFormEkskulPage: React.FC<AdminFormEkskulPageProps> = ({
  ekskulId,
  editId,
  onNavigate,
}) => {
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
        <p className="text-sm text-[#525049]">Data kegiatan yang ingin Anda edit tidak ditemukan dalam database.</p>
        <Button variant="outline" onClick={() => onNavigate('/pengurus/ekskul')}>
          Kembali ke Daftar Ekskul
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (isEditMode && targetId) {
      const res = db.updateExtracurricular(targetId, {
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
        setTimeout(() => onNavigate('/pengurus/ekskul'), 800);
      } else {
        setFormError(res.message);
      }
    } else {
      const res = await db.addExtracurricularAsync({
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
        setTimeout(() => onNavigate('/pengurus/ekskul'), 800);
      } else {
        setFormError(res.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={() => onNavigate('/pengurus/ekskul')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525049] hover:text-[#D15B40] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Ekstrakurikuler</span>
        </button>
      </div>

      {/* Header section card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] bg-[#FDEDE9] border border-[#F2C9C0] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                {isEditMode ? <Edit2 className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                <span>{isEditMode ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}</span>
              </span>
              <Badge variant="neutral">Kategori: {category}</Badge>
              <Badge variant={registrationStatus === 'open' ? 'success' : 'neutral'}>
                {registrationStatus === 'open' ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
              {isEditMode ? `Edit Data: ${existingEkskul?.name}` : 'Tambah Ekstrakurikuler Baru'}
            </h1>
            <p className="text-xs text-[#68655F] max-w-2xl leading-relaxed">
              Lengkapi rincian jadwal, daya tampung kuota, lokasi sarana, dan penugasan guru pembina.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Notifications */}
          {formError && (
            <div className="p-4 bg-[#F9ECEB] border border-[#E8BAB5] text-[#A33D35] rounded-xl flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Gagal Menyimpan Data</p>
                <p className="text-xs">{formError}</p>
              </div>
            </div>
          )}

          {formSuccess && (
            <div className="p-4 bg-[#E7EFEA] border border-[#B7D2C2] text-[#234B36] rounded-xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Berhasil Disimpan</p>
                <p className="text-xs">{formSuccess}</p>
              </div>
            </div>
          )}

          {/* Section 1: Informasi Pokok */}
          <div className="space-y-4">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D15B40]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                1. Informasi Pokok Kegiatan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Ekstrakurikuler *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Futsal SMKN 1 Ciomas"
                required
              />

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                  Kategori Ekskul
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                  Status Penerimaan Anggota Baru
                </label>
                <select
                  value={registrationStatus}
                  onChange={(e) => setRegistrationStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors"
                >
                  <option value="open">Dibuka (Siswa dapat mendaftar)</option>
                  <option value="closed">Ditutup (Pendaftaran selesai)</option>
                </select>
              </div>

              <Input
                label="Kapasitas Kuota Siswa *"
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

          {/* Section 2: Jadwal & Sarana */}
          <div className="space-y-4 pt-4 border-t border-[#EAE6DC]">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#234B36]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                2. Jadwal Latihan & Fasilitas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Jadwal Latihan Rutin *"
                type="text"
                value={practiceSchedule}
                onChange={(e) => setPracticeSchedule(e.target.value)}
                placeholder="Contoh: Setiap Selasa & Sabtu (15:30 - 17:30 WIB)"
                required
              />

              <Input
                label="Lokasi / Fasilitas Sarana *"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Lapangan Futsal SMKN 1 Ciomas"
                required
              />
            </div>
          </div>

          {/* Section 3: Pembina & Ketua */}
          <div className="space-y-4 pt-4 border-t border-[#EAE6DC]">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8C6819]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                3. Pembina & Pengurus Ekskul
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Guru Pembina *"
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
                placeholder="Contoh: Rizky Ramadhan (XI PPLG 1)"
              />
            </div>
          </div>

          {/* Section 4: Deskripsi & Banner */}
          <div className="space-y-4 pt-4 border-t border-[#EAE6DC]">
            <div className="border-b border-[#EAE6DC] pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D15B40]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                4. Deskripsi & Foto Sampul
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                Deskripsi Singkat (Tampil di Katalog)
              </label>
              <Input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ringkasan 1-2 kalimat tentang pembinaan ekskul..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                Deskripsi Lengkap (Tampil di Halaman Detail)
              </label>
              <Textarea
                rows={3}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Jelaskan silabus materi, target pembinaan, persiapan kompetisi, dan manfaat kegiatan..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#68655F] mb-1.5">
                URL Foto Sampul (Banner)
              </label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />

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

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-[#EAE6DC]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/pengurus/ekskul')}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              className="w-full sm:w-auto bg-[#D15B40] hover:bg-[#b84a32] text-white font-bold"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isEditMode
                ? 'Perbarui Data Ekskul'
                : 'Terbitkan Ekstrakurikuler Baru'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
