import React, { useState } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Extracurricular } from '@/types';
import { Search, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { AdminAddEkskulModal } from './AdminAddEkskulModal';
import { AdminEditEkskulModal } from './AdminEditEkskulModal';
import { AdminDeleteEkskulModal } from './AdminDeleteEkskulModal';

interface AdminEkskulSectionProps {
  ekskuls: Extracurricular[];
  setEkskuls: (data: Extracurricular[]) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onNavigate: (path: string) => void;
  isAddEkskulModalOpen: boolean;
  setIsAddEkskulModalOpen: (open: boolean) => void;
}

export const AdminEkskulSection: React.FC<AdminEkskulSectionProps> = ({
  ekskuls,
  setEkskuls,
  showNotification,
  onNavigate,
  isAddEkskulModalOpen,
  setIsAddEkskulModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEkskul, setEditingEkskul] = useState<Extracurricular | null>(null);
  const [ekskulToDelete, setEkskulToDelete] = useState<Extracurricular | null>(null);

  const toggleEkskulStatus = (item: Extracurricular) => {
    const newStatus = item.registration_status === 'open' ? 'closed' : 'open';
    const res = db.updateExtracurricular(item.id, { registration_status: newStatus });
    if (res.success) {
      setEkskuls([...db.getExtracurriculars()]);
      showNotification('success', `Status pendaftaran ${item.name} berhasil diubah ke: ${newStatus === 'open' ? 'Dibuka' : 'Ditutup'}`);
    }
  };

  const handleSuccess = (message: string) => {
    setEkskuls([...db.getExtracurriculars()]);
    showNotification('success', message);
  };

  const handleError = (message: string) => {
    showNotification('error', message);
  };

  const filteredEkskuls = ekskuls.filter(
    (e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.supervisor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DC]">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Master Data Ekstrakurikuler Resmi</h2>
            <p className="text-xs text-[#68655F]">Atur kuota daya tampung, jadwal rutin, penugasan guru pembina, dan status pendaftaran.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#68655F]" />
              <input
                type="text"
                placeholder="Cari ekskul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#F9F8F6]/50 border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
              />
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsAddEkskulModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Tambah Ekskul Baru
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEkskuls.map((ekskul) => (
            <div
              key={ekskul.id}
              className="border border-[#EAE6DC] rounded-lg p-4 bg-[#F9F8F6]/20 flex flex-col justify-between hover:border-[#234B36] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-[#171717]">{ekskul.name}</h3>
                  <Badge variant="neutral">{ekskul.category}</Badge>
                </div>
                <p className="text-xs text-[#68655F] line-clamp-2 mb-3 leading-relaxed">
                  {ekskul.short_description}
                </p>

                <div className="space-y-1.5 text-xs text-[#68655F] border-t border-[#EAE6DC]/70 pt-2.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span>Pembina:</span>
                    <strong className="text-[#171717]">{ekskul.supervisor_name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ketua Siswa:</span>
                    <span className="text-[#171717]">{ekskul.chairperson_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Jadwal Latihan:</span>
                    <span className="text-[#171717] truncate max-w-[140px]">{ekskul.practice_schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kapasitas:</span>
                    <span className="font-bold text-[#234B36]">
                      {ekskul.current_member_count} / {ekskul.member_capacity} Siswa
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE6DC]/70 flex items-center justify-between">
                <button
                  onClick={() => toggleEkskulStatus(ekskul)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    ekskul.registration_status === 'open'
                      ? 'bg-[#E7EFEA] text-[#234B36] hover:bg-[#d5e7dc]'
                      : 'bg-[#F9ECEB] text-[#A33D35] hover:bg-[#f3d9d7]'
                  }`}
                >
                  {ekskul.registration_status === 'open' ? 'Pendaftaran Buka' : 'Pendaftaran Tutup'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingEkskul(ekskul)}
                    className="p-1 text-[#68655F] hover:text-[#234B36] hover:bg-white rounded cursor-pointer"
                    title="Edit Ekskul"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEkskulToDelete(ekskul)}
                    className="p-1 text-[#68655F] hover:text-[#A33D35] hover:bg-white rounded cursor-pointer"
                    title="Hapus Ekskul"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate(`/ekskul/${ekskul.slug}`)}
                    className="p-1 text-[#68655F] hover:text-[#234B36] hover:bg-white rounded cursor-pointer"
                    title="Lihat Publik"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminAddEkskulModal
        isOpen={isAddEkskulModalOpen}
        onClose={() => setIsAddEkskulModalOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <AdminEditEkskulModal
        ekskul={editingEkskul}
        onClose={() => setEditingEkskul(null)}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <AdminDeleteEkskulModal
        ekskul={ekskulToDelete}
        onClose={() => setEkskulToDelete(null)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
};
