import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Extracurricular } from '@/types';
import {
  Search,
  Users,
  Clock,
  MapPin,
  Eye,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface StudentBrowseTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: string[];
  filteredEkskuls: Extracurricular[];
  getEkskulStudentStatus: (ekskulId: string) => string;
  setSelectedEkskulDetail: (ekskul: Extracurricular | null) => void;
  handleOpenRegisterModal: (ekskulId?: string) => void;
}

export const StudentBrowseTab: React.FC<StudentBrowseTabProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  categories,
  filteredEkskuls,
  getEkskulStudentStatus,
  setSelectedEkskulDetail,
  handleOpenRegisterModal,
}) => {
  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-[#171717] tracking-tight">Katalog Ekstrakurikuler</h2>
          <p className="text-sm text-[#68655F]">
            Pilih ekskul yang sesuai dengan minat dan bakat Anda.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68655F]" />
          <input
            type="text"
            placeholder="Cari ekskul atau pembina..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#EAE6DC] rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#234B36] shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-sm ${
              categoryFilter === cat
                ? 'bg-[#234B36] text-white border border-[#234B36]'
                : 'bg-white text-[#68655F] border border-[#EAE6DC] hover:bg-[#F9F8F6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Extracurricular Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEkskuls.map((ekskul) => {
          const studentStatus = getEkskulStudentStatus(ekskul.id);
          const isFull = ekskul.current_member_count >= ekskul.member_capacity;

          return (
            <div
              key={ekskul.id}
              className="bg-white border border-[#EAE6DC]/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-[#ECEAE4]">
                  <img
                    src={ekskul.profile_image}
                    alt={ekskul.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral" className="bg-white/90 text-[#171717] backdrop-blur-md shadow-sm border-0 font-bold">
                      {ekskul.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    {ekskul.registration_status === 'open' && !isFull ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#234B36] text-white shadow-sm tracking-wider uppercase">
                        Dibuka
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-[#A33D35] text-white shadow-sm tracking-wider uppercase">
                        {isFull ? 'Penuh' : 'Ditutup'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#171717] group-hover:text-[#234B36] transition-colors">{ekskul.name}</h3>
                    <p className="text-sm text-[#68655F] line-clamp-2 mt-1.5 leading-relaxed">
                      {ekskul.short_description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs border-t border-[#EAE6DC]/60 pt-4 text-[#68655F]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#234B36]" />
                      <span>Pembina: <strong className="text-[#171717]">{ekskul.supervisor_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#234B36]" />
                      <span>{ekskul.practice_schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#234B36]" />
                      <span>{ekskul.location}</span>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-[#68655F] mb-1.5">
                      <span>Kapasitas Anggota</span>
                      <span className="font-bold text-[#171717]">
                        {ekskul.current_member_count} / {ekskul.member_capacity} Siswa
                      </span>
                    </div>
                    <div className="w-full bg-[#F9F8F6] h-1.5 rounded-full overflow-hidden border border-[#EAE6DC]">
                      <div
                        className="bg-[#234B36] h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((ekskul.current_member_count / ekskul.member_capacity) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="p-4 pt-0 border-t border-[#EAE6DC]/60 mt-3 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEkskulDetail(ekskul)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Detail
                </Button>

                {studentStatus === 'member' ? (
                  <span className="px-2.5 py-1 rounded bg-[#E7EFEA] text-[#234B36] font-bold text-xs border border-[#B7D2C2] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Anggota Aktif
                  </span>
                ) : studentStatus === 'pending' ? (
                  <span className="px-2.5 py-1 rounded bg-[#FDF5E6] text-[#8C6819] font-bold text-xs border border-[#D9C187] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Menunggu Review
                  </span>
                ) : ekskul.registration_status === 'open' && !isFull ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenRegisterModal(ekskul.id)}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Daftar Ekskul
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Penuh
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
