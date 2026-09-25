import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Compass, UserCheck, CheckCircle, FileText, ShieldCheck, Trophy, LogIn
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const settings = db.getSettings();
  const [searchVerifyId, setSearchVerifyId] = useState('');

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVerifyId.trim()) onNavigate(`/verify/${encodeURIComponent(searchVerifyId.trim())}`);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F9F8F6] to-white pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-[#EAE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="success" className="mb-6 mx-auto inline-flex shadow-sm bg-[#E7EFEA] text-[#234B36] border-[#B7D2C2]">
            Tahun Ajaran {settings.academic_year}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#171717] tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Sistem Informasi Terpadu Ekstrakurikuler <span className="text-[#234B36]">{settings.school_name}</span>
          </h1>
          <p className="text-lg md:text-xl text-[#68655F] mb-10 max-w-2xl mx-auto">
            Kelola pendaftaran ekskul, presensi digital, pencatatan prestasi, hingga pencetakan portofolio non-akademik resmi dengan validasi publik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => onNavigate('/login')} icon={<LogIn className="w-5 h-5" />} className="w-full sm:w-auto shadow-md">
              Masuk ke Portal
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate('/ekskul')} icon={<Compass className="w-5 h-5" />} className="w-full sm:w-auto bg-white">
              Jelajahi Katalog Ekskul
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Verify Tool */}
      <section className="py-0 relative z-10 max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white border border-[#EAE6DC] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[#171717] flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#234B36]" /> Verifikasi Dokumen
            </h3>
            <p className="text-sm text-[#68655F]">Masukkan kode sertifikat atau portofolio untuk mengecek validitas data institusional.</p>
          </div>
          <form onSubmit={handleVerifySubmit} className="flex-1 flex w-full gap-3">
            <input 
              type="text" 
              placeholder="Contoh: EKH-2026-000184" 
              value={searchVerifyId} 
              onChange={(e) => setSearchVerifyId(e.target.value)} 
              className="flex-1 px-4 py-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#234B36] focus:ring-1 focus:ring-[#234B36] transition-all" 
            />
            <Button type="submit" size="lg" className="rounded-xl">Cek Data</Button>
          </form>
        </div>
      </section>

      {/* System Features Workflow */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#171717] tracking-tight">Alur Digital Terpadu</h2>
            <p className="text-[#68655F] mt-4 text-lg">Platform end-to-end dari pemilihan ekskul hingga pelaporan akhir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Pendaftaran Online', desc: 'Siswa dapat memilih dan mendaftar ekskul secara mandiri melalui katalog interaktif tanpa formulir kertas.', icon: UserCheck },
              { title: 'Presensi Sesi Latihan', desc: 'Pengurus mencatat kehadiran secara real-time yang akan dipantau langsung oleh guru pembina.', icon: CheckCircle },
              { title: 'Validasi Prestasi', desc: 'Kesiswaan mengesahkan capaian juara, kepanitiaan, dan organisasi ke dalam rekam jejak siswa.', icon: Trophy },
              { title: 'Portofolio Terintegrasi', desc: 'Cetak lembar portofolio digital bertanda-tangan dengan barcode resmi untuk syarat kelulusan.', icon: FileText }
            ].map((step, i) => (
              <div key={i} className="bg-[#F9F8F6] p-8 rounded-2xl border border-[#EAE6DC] hover:shadow-md transition-shadow hover:border-[#D8D4CC] group">
                <div className="w-14 h-14 bg-white border border-[#EAE6DC] rounded-xl flex items-center justify-center text-[#234B36] mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-[#171717]">{step.title}</h3>
                <p className="text-sm text-[#68655F] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
