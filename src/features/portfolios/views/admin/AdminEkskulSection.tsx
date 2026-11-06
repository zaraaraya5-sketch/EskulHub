import React, { useState } from 'react';
import { db } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Extracurricular } from '@/types';
import { Search, Plus, Edit2, Trash2, ExternalLink, Users, Calendar, UserCheck, Shield } from 'lucide-react';
import { AdminDeleteEkskulModal } from './AdminDeleteEkskulModal';

interface AdminEkskulSectionProps {
  ekskuls: Extracurricular[];
  setEkskuls: (data: Extracurricular[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onNavigate: (path: string) => void;
  isAddEkskulModalOpen?: boolean;
  setIsAddEkskulModalOpen?: (open: boolean) => void;
}

export const AdminEkskulSection: React.FC<AdminEkskulSectionProps> = ({
  ekskuls,
  setEkskuls,
  showNotification,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ekskulToDelete, setEkskulToDelete] = useState<Extracurricular | null>(null);

  const toggleEkskulStatus = (item: Extracurricular) => {
    const newStatus = item.registration_status === 'open' ? 'closed' : 'open';
    const res = db.updateExtracurricular(item.id, { registration_status: newStatus });
    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      showNotification(
        'success',
        `Status pendaftaran ${item.name} berhasil diubah ke: ${newStatus === 'open' ? 'Dibuka' : 'Ditutup'}`
      );
    }
  };

  const handleSuccess = (message: string) => {
    setEkskuls([...db.getExtracurriculars()]);
    showNotification('success', message);
  };

  const handleError = (message: string) => {
    showNotification('error', message);
  };

  const categories = ['all', ...Array.from(new Set(ekskuls.map((e) => e.category)))];

  const filteredEkskuls = ekskuls
    .filter((e) => selectedCategory === 'all' || e.category === selectedCategory)
    .filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.supervisor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'olahraga':
        return 'bg-[#FDEDE9] text-[#D15B40] border-[#F2C9C0]';
      case 'kepemimpinan':
        return 'bg-[#E7EFEA] text-[#234B36] border-[#B7D2C2]';
      case 'kemanusiaan':
        return 'bg-[#F9ECEB] text-[#A33D35] border-[#E8BAB5]';
      case 'seni & kreativitas':
      case 'seni':
        return 'bg-[#F9F4E5] text-[#8C6819] border-[#E4C783]';
      default:
        return 'bg-[#F9F8F6] text-[#525049] border-[#EAE6DC]';
    }
  };

  return (
    <>
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE6DC]">
          <div>
            <h2 className="text-base font-bold text-[#171717]">Monitoring Seluruh Ekstrakurikuler</h2>
            <p className="text-xs text-[#525049] mt-0.5">
              Kelola kapasitas anggota, jadwal latihan mingguan, guru pembina, dan status pendaftaran aktif.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#68655F]" />
              <input
                type="text"
                placeholder="Cari ekskul, pembina..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 text-xs bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-colors w-48 sm:w-60"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/pengurus/ekskul/tambah')}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Tambah Ekskul Baru
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'bg-[#F9F8F6] text-[#525049] hover:bg-[#EAE6DC] border border-[#EAE6DC]'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
          <span className="text-xs text-[#888681] ml-auto shrink-0 font-medium">
            {filteredEkskuls.length} ekskul ditampilkan
          </span>
        </div>

        {/* Modern Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredEkskuls.map((ekskul) => {
            const currentMembers = ekskul.current_member_count || 0;
            const capacity = ekskul.member_capacity || 30;
            const pct = Math.min(Math.round((currentMembers / capacity) * 100), 100);

            return (
              <div
                key={ekskul.id}
                className="group border border-[#EAE6DC] hover:border-[#D15B40] rounded-2xl p-5 bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Category and Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                        ekskul.category
                      )}`}
                    >
                      {ekskul.category}
                    </span>

                    <button
                      onClick={() => toggleEkskulStatus(ekskul)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 ${
                        ekskul.registration_status === 'open'
                          ? 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#d6e7dc]'
                          : 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#f2d8d5]'
                      }`}
                      title="Klik untuk mengubah status pendaftaran"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ekskul.registration_status === 'open' ? 'bg-[#234B36]' : 'bg-[#A33D35]'
                        }`}
                      />
                      <span>{ekskul.registration_status === 'open' ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}</span>
                    </button>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-base font-bold text-[#171717] group-hover:text-[#D15B40] transition-colors leading-snug">
                    {ekskul.name}
                  </h3>
                  <p className="text-xs text-[#525049] line-clamp-2 mt-1.5 leading-relaxed">
                    {ekskul.short_description}
                  </p>

                  {/* Visual Info Badges */}
                  <div className="space-y-2 mt-4 pt-3.5 border-t border-[#EAE6DC]/80 text-xs">
                    <div className="flex items-center gap-2 text-[#525049]">
                      <UserCheck className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                      <span className="text-[#888681] text-[11px]">Pembina:</span>
                      <span className="font-semibold text-[#171717] truncate">{ekskul.supervisor_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#525049]">
                      <Calendar className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                      <span className="text-[#888681] text-[11px]">Jadwal:</span>
                      <span className="font-medium text-[#171717] truncate">{ekskul.practice_schedule}</span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="pt-1.5">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[#888681] flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#8C6819]" />
                          Kapasitas Siswa
                        </span>
                        <span className="font-bold font-mono text-[#171717]">
                          {currentMembers} <span className="text-[#888681] font-normal">/ {capacity}</span> ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAE6DC] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            pct >= 90 ? 'bg-[#A33D35]' : pct >= 70 ? 'bg-[#D15B40]' : 'bg-[#234B36]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 mt-4 border-t border-[#EAE6DC] flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/ekskul/${ekskul.slug}?from=/pengurus`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#525049] hover:text-[#D15B40] transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Lihat Publik</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onNavigate(`/pengurus/ekskul/${ekskul.id}/edit`)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#525049] hover:text-[#D15B40] hover:bg-[#FDEDE9] border border-[#EAE6DC] hover:border-[#F2C9C0] rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                      title="Edit Ekstrakurikuler"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setEkskulToDelete(ekskul)}
                      className="p-1.5 text-[#68655F] hover:text-[#A33D35] hover:bg-[#F9ECEB] border border-transparent hover:border-[#E8BAB5] rounded-lg cursor-pointer transition-colors shadow-2xs"
                      title="Hapus Ekstrakurikuler"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdminDeleteEkskulModal
        ekskul={ekskulToDelete}
        onClose={() => setEkskulToDelete(null)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
};
