import React, { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/database';
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
    let isMounted = true;
    const fetchEkskuls = async () => {
      try {
        const data = await getEkskulsAPI();
        if (!isMounted) return;
        if (data && data.length > 0) {
          setAllEkskuls(data);
          db.setExtracurriculars(data);
        } else {
          setAllEkskuls(db.getExtracurriculars());
        }
      } catch (err) {
        if (!isMounted) return;
        setAllEkskuls(db.getExtracurriculars());
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEkskuls();

    const unsubscribe = db.subscribe(() => {
      if (!isMounted) return;
      const current = db.getExtracurriculars();
      if (current && current.length > 0) {
        setAllEkskuls([...current]);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
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
        <div className="text-xs font-bold uppercase tracking-wider text-[#D15B40] mb-1">
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
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#68655F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama ekskul, pembina, kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all duration-200 ease-out"
            />
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all duration-200 ease-out cursor-pointer"
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
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#EAE6DC] rounded-xl text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#D15B40]/20 focus:border-[#D15B40] transition-all duration-200 ease-out cursor-pointer"
            >
              <option value="name">Urutkan: Nama (A - Z)</option>
              <option value="popular">Urutkan: Anggota Terbanyak</option>
              <option value="capacity">Urutkan: Kuota Terbesar</option>
            </select>
          </div>
        </div>

        {/* Categories Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#EAE6DC] pb-1">
          <span className="text-xs font-semibold text-[#68655F] mr-1 shrink-0">Kategori:</span>
          {EXTRACURRICULAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer border select-none ${
                selectedCategory === cat
                  ? 'bg-[#D15B40] text-white border-[#D15B40] shadow-2xs'
                  : 'bg-[#F9F8F6] text-[#68655F] border-[#EAE6DC] hover:text-[#171717] hover:bg-[#EAE6DC] hover:border-[#D8D4CC]'
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
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#171717] border border-[#EAE6DC] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
              onClick={() => onNavigate(`/ekskul/${item.slug}`)}
            >
              {/* Full Landscape Image */}
              <img
                src={item.profile_image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Ambient bottom gradient for title legibility in default state */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

              {/* Badges on image (default state) */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none transition-opacity duration-300 group-hover:opacity-0 z-10">
                <Badge variant="neutral" className="bg-white/90 text-[#171717] backdrop-blur-md border-0 shadow-sm text-xs font-semibold py-0.5 px-2.5">
                  {item.category}
                </Badge>
                <Badge variant={item.registration_status === 'open' ? 'success' : 'danger'} className="shadow-sm text-xs font-semibold py-0.5 px-2.5">
                  {item.registration_status === 'open' ? 'Pendaftaran Dibuka' : 'Ditutup'}
                </Badge>
              </div>

              {/* Default Title at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2 z-10">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md leading-snug line-clamp-1">
                  {item.name}
                </h3>
              </div>

              {/* Hover Overlay: Bright Frosted Glass (Glassmorphism) */}
              <div className="absolute inset-0 bg-white/85 backdrop-blur-md border border-white/70 p-4 sm:p-5 flex flex-col justify-between text-[#171717] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20 shadow-xl">
                {/* Badges in hover */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral" className="bg-white/90 text-[#171717] border border-[#EAE6DC] text-[10px] py-0.5 px-2.5 shadow-xs font-semibold">
                    {item.category}
                  </Badge>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold tracking-wide uppercase ${item.registration_status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300/80 shadow-xs' : 'bg-rose-50 text-rose-700 border border-rose-300/80 shadow-xs'}`}>
                    {item.registration_status === 'open' ? 'Dibuka' : 'Ditutup'}
                  </span>
                </div>

                {/* Title & Bio in hover */}
                <div className="my-auto py-1">
                  <h3 className="text-base font-bold text-[#171717] mb-1.5 leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#525049] line-clamp-2 leading-relaxed font-normal">
                    {item.short_description}
                  </p>
                </div>

                {/* Button CTA */}
                <div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center shadow-md hover:shadow-lg bg-[#D15B40] hover:bg-[#b84a32] text-white border-0 text-xs py-2 transition-transform active:scale-95 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/ekskul/${item.slug}`);
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Lihat Profil & Daftar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
