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
  Compass,
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
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Eksplorasi Minat & Bakat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">Katalog Ekstrakurikuler</h2>
          <p className="text-xs text-[#68655F] mt-0.5">
            Pilih cabang kegiatan ekstrakurikuler yang sesuai dengan bakat dan minat pengembangan dirimu.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68655F]" />
          <input
            type="text"
            placeholder="Cari ekskul, pembina, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#EAE6DC] rounded-xl text-xs bg-white text-[#171717] placeholder-[#A39F97] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-all select-none ${
              categoryFilter === cat
                ? 'bg-[#D15B40] text-white shadow-xs border border-transparent font-bold'
                : 'bg-white text-[#68655F] border border-[#EAE6DC] hover:bg-[#F9F8F6] hover:text-[#171717]'
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
              className="bg-white border border-[#EAE6DC] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#D15B40]/40 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-[#ECEAE4]">
                  <img
                    src={ekskul.profile_image}
                    alt={ekskul.name}
                    width={400}
                    height={176}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800';
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#171717] backdrop-blur-md shadow-xs border border-[#EAE6DC]">
                      {ekskul.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {ekskul.registration_status === 'open' && !isFull ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0] shadow-xs">
                        Dibuka
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FBEAE8] text-[#A33D35] border border-[#F5C6C2] shadow-xs">
                        {isFull ? 'Penuh' : 'Ditutup'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#171717] group-hover:text-[#D15B40] transition-colors">
                      {ekskul.name}
                    </h3>
                    <p className="text-xs text-[#68655F] line-clamp-2 mt-1 leading-relaxed">
                      {ekskul.short_description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-[#EAE6DC] pt-3 text-[#68655F]">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                      <span className="truncate">Pembina: <strong className="text-[#171717]">{ekskul.supervisor_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                      <span className="truncate">{ekskul.practice_schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D15B40] shrink-0" />
                      <span className="truncate">{ekskul.location}</span>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-[#68655F] mb-1">
                      <span>Kapasitas Anggota</span>
                      <span className="font-bold text-[#171717]">
                        {ekskul.current_member_count} / {ekskul.member_capacity} Siswa
                      </span>
                    </div>
                    <div className="w-full bg-[#F9F8F6] h-1.5 rounded-full overflow-hidden border border-[#EAE6DC]">
                      <div
                        className="bg-[#D15B40] h-full rounded-full transition-all"
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

              {/* Bottom Action Footer */}
              <div className="p-5 pt-0 flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center text-xs cursor-pointer"
                  onClick={() => setSelectedEkskulDetail(ekskul)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Detail
                </Button>

                {studentStatus === 'member' ? (
                  <span className="flex-1 py-2 px-3 text-center bg-[#F9F8F6] text-[#D15B40] border border-[#EAE6DC] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D15B40]" />
                    <span>Terdaftar</span>
                  </span>
                ) : studentStatus === 'pending' ? (
                  <span className="flex-1 py-2 px-3 text-center bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4] rounded-xl text-xs font-bold">
                    Menunggu
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 justify-center text-xs cursor-pointer shadow-xs"
                    disabled={ekskul.registration_status !== 'open' || isFull}
                    onClick={() => handleOpenRegisterModal(ekskul.id)}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Daftar
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
