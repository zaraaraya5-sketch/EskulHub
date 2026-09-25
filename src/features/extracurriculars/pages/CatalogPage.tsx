import React, { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/storage/mockDatabase';
import { api, getEkskulsAPI } from '@/lib/api';
import { Extracurricular } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EXTRACURRICULAR_CATEGORIES } from '@/lib/constants';
import { Search, Filter, BookOpen, Users, Calendar, MapPin, ArrowRight, Loader2 } from 'lucide-react';

interface CatalogPageProps {
  onNavigate: (path: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'popular'>('name');
  
  const [allEkskuls, setAllEkskuls] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEkskuls = async () => {
      try {
        const data = await getEkskulsAPI();
        if (data && data.length > 0) {
          setAllEkskuls(data);
        } else {
          // Fallback to mock DB if API is down or empty
          setAllEkskuls(db.getExtracurriculars());
        }
      } catch (err) {
        setAllEkskuls(db.getExtracurriculars());
      } finally {
        setLoading(false);
      }
    };
    fetchEkskuls();
  }, []);

  const filteredEkskuls = useMemo(() => {
    return allEkskuls
      .filter((item) => {
        const matchSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.short_description.toLowerCase().includes(search.toLowerCase()) ||
          item.supervisor_name.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
          selectedCategory === 'Semua Kategori' || item.category === selectedCategory;

        const matchStatus =
          statusFilter === 'all' || item.registration_status === statusFilter;

        return matchSearch && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'capacity') return b.member_capacity - a.member_capacity;
        if (sortBy === 'popular') return b.current_member_count - a.current_member_count;
        return 0;
      });
  }, [allEkskuls, search, selectedCategory, statusFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#EAE6DC] pb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#234B36] mb-1">
          Katalog Ekstrakurikuler Resmi
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#171717]">
          Daftar Kegiatan Pengembangan Minat & Bakat Siswa
        </h1>
        <p className="text-sm text-[#68655F] mt-1 max-w-2xl">
          Seluruh ekstrakurikuler dibina oleh guru berkompeten dengan silabus terstruktur dan terintegrasi langsung
          dengan catatan portofolio resmi sekolah.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#68655F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama ekskul, pembina, kata kunci..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            />
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            >
              <option value="all">Semua Status Pendaftaran</option>
              <option value="open">Hanya Pendaftaran Terbuka</option>
              <option value="closed">Kuota Terpenuhi (Ditutup)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#EAE6DC] rounded text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#234B36]"
            >
              <option value="name">Urutkan: Nama (A - Z)</option>
              <option value="popular">Urutkan: Anggota Terbanyak</option>
              <option value="capacity">Urutkan: Kuota Terbesar</option>
            </select>
          </div>
        </div>

        {/* Categories Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#EAE6DC]">
          <span className="text-xs font-semibold text-[#68655F] mr-2 shrink-0">Kategori:</span>
          {EXTRACURRICULAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#234B36] text-white border-[#234B36]'
                  : 'bg-[#F9F8F6] text-[#171717] border-[#EAE6DC] hover:bg-[#EAE6DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#68655F]">
        <span>Menampilkan <strong className="text-[#171717]">{filteredEkskuls.length}</strong> kegiatan ekstrakurikuler</span>
      </div>

      {/* Grid of Extracurriculars */}
      {filteredEkskuls.length === 0 ? (
        <div className="bg-white border border-[#EAE6DC] rounded-lg p-12 text-center">
          <BookOpen className="w-8 h-8 text-[#68655F] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#171717] mb-1">Tidak ada ekstrakurikuler yang sesuai</h3>
          <p className="text-xs text-[#68655F] mb-4">Coba sesuaikan kata kunci pencarian atau ubah filter kategori.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSearch(''); setSelectedCategory('Semua Kategori'); setStatusFilter('all'); }}
          >
            Reset Semua Filter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEkskuls.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EAE6DC] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#234B36] transition-colors"
            >
              <div>
                <div className="h-44 relative bg-[#EAE6DC] overflow-hidden">
                  <img
                    src={item.profile_image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral">{item.category}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={item.registration_status === 'open' ? 'success' : 'danger'}>
                      {item.registration_status === 'open' ? 'Pendaftaran Dibuka' : 'Ditutup'}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-base font-bold text-[#171717] mb-1.5">{item.name}</h2>
                  <p className="text-xs text-[#68655F] line-clamp-2 leading-relaxed mb-4">
                    {item.short_description}
                  </p>

                  <div className="space-y-2 text-xs text-[#68655F] border-t border-[#EAE6DC] pt-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                      <span>Pembina: <strong className="text-[#171717]">{item.supervisor_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                      <span className="truncate">Jadwal: <strong className="text-[#171717]">{item.practice_schedule}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#234B36] shrink-0" />
                      <span className="truncate">Lokasi: <strong className="text-[#171717]">{item.location}</strong></span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>Kapasitas Anggota:</span>
                        <span className="font-semibold text-[#171717]">{item.current_member_count} / {item.member_capacity} Siswa</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F9F8F6] rounded-full overflow-hidden border border-[#EAE6DC]">
                        <div
                          className="h-full bg-[#234B36] rounded-full"
                          style={{ width: `${Math.min(100, (item.current_member_count / item.member_capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => onNavigate(`/ekskul/${item.slug}`)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Lihat Profil & Daftar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
