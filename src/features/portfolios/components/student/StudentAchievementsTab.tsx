import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Achievement, PortfolioVerification } from '@/types';
import { Trophy, Users, Layers } from 'lucide-react';

interface StudentAchievementsTabProps {
  myAchievements: Achievement[];
  verification: PortfolioVerification;
  myActivityHistory: any[];
}

export const StudentAchievementsTab: React.FC<StudentAchievementsTabProps> = ({
  myAchievements,
  verification,
  myActivityHistory,
}) => {
  return (
    <div className="space-y-6">
      {/* Section: Achievements (Prestasi) */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#B58A32]" />
              <span>Daftar Prestasi & Penghargaan Kompetisi</span>
            </h2>
            <p className="text-xs text-[#68655F]">
              Pencapaian kejuaraan resmi yang telah diverifikasi oleh tim Kesiswaan sekolah.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#E7EFEA] text-[#234B36] font-bold text-xs border border-[#B7D2C2]">
            {myAchievements.filter((a) => a.is_verified).length} Tervalidasi
          </span>
        </div>

        {myAchievements.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#68655F]">
            Belum ada data prestasi yang terdaftar. Anda dapat mengajukan piagam di tab "Dokumen Pendukung".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAchievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 border border-[#EAE6DC] rounded-lg bg-[#F9F8F6]/30 hover:bg-[#F9F8F6]/60 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-[#171717]">{ach.title}</h4>
                  <Badge variant={ach.is_verified ? 'success' : 'warning'}>
                    {ach.is_verified ? 'Tervalidasi' : 'Menunggu Validasi'}
                  </Badge>
                </div>
                <div className="text-xs text-[#68655F] space-y-0.5">
                  <div><strong className="text-[#171717]">Ajang:</strong> {ach.competition_name}</div>
                  <div><strong className="text-[#171717]">Tingkat:</strong> {ach.level} • <strong className="text-[#171717]">Peringkat:</strong> {ach.rank}</div>
                  <div><strong className="text-[#171717]">Ekskul:</strong> {ach.extracurricular_name} ({ach.achievement_date})</div>
                  {ach.verified_by_name && (
                    <div className="text-[11px] text-[#234B36] font-medium pt-1">
                      Disahkan oleh: {ach.verified_by_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Committees & School Events (Kepanitiaan & Event) */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs space-y-4">
        <div className="border-b border-[#EAE6DC] pb-3">
          <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#234B36]" />
            <span>Kepanitiaan & Partisipasi Event Sekolah</span>
          </h2>
          <p className="text-xs text-[#68655F]">
            Peran aktif dalam kepanitiaan kegiatan OSIS, turnamen antar-sekolah, dan pengabdian siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verification.summary_data.committee_roles?.map((comm, idx) => (
            <div
              key={idx}
              className="p-4 border border-[#EAE6DC] rounded-lg bg-white space-y-1 hover:border-[#234B36] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#171717]">{comm.title}</span>
                <span className="text-[11px] text-[#68655F] font-mono">{comm.year}</span>
              </div>
              <div className="text-xs text-[#234B36] font-semibold">{comm.role}</div>
              <div className="text-[11px] text-[#68655F]">Tercatat dalam rekam jejak portofolio non-akademik siswa.</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Personal Extracurricular Activity History */}
      <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 shadow-xs space-y-4">
        <div className="border-b border-[#EAE6DC] pb-3">
          <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#234B36]" />
            <span>Riwayat Kegiatan & Dokumentasi Ekskul</span>
          </h2>
          <p className="text-xs text-[#68655F]">
            Aktivitas program kerja, turnamen, dan workshop yang dilaksanakan oleh ekstrakurikuler Anda.
          </p>
        </div>

        <div className="space-y-3">
          {myActivityHistory.map((act) => (
            <div
              key={act.id}
              className="p-4 border border-[#EAE6DC] rounded-lg bg-[#F9F8F6]/20 flex flex-col md:flex-row gap-4 items-start"
            >
              {act.documentation_urls?.[0] && (
                <img
                  src={act.documentation_urls[0]}
                  alt={act.title}
                  className="w-full md:w-36 h-24 rounded-lg object-cover border border-[#EAE6DC] shrink-0"
                />
              )}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#171717]">{act.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E7EFEA] text-[#234B36]">
                    {act.extracurricular_name}
                  </span>
                </div>
                <p className="text-[#68655F] leading-relaxed">{act.description}</p>
                <div className="text-[#68655F] pt-1 flex items-center gap-3 text-[11px]">
                  <span>Tanggal: <strong className="text-[#171717]">{act.activity_date}</strong></span>
                  <span>Lokasi: <strong className="text-[#171717]">{act.location}</strong></span>
                  <span>Peserta: <strong className="text-[#171717]">{act.participant_count} Orang</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
