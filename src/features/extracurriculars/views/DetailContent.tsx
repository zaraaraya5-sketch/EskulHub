import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Trophy } from 'lucide-react';
import { Extracurricular, Achievement } from '@/types';

interface DetailContentProps {
  ekskul: Extracurricular;
  achievements: Achievement[];
  activities: any[];
}

export const DetailContent: React.FC<DetailContentProps> = ({
  ekskul,
  achievements,
  activities,
}) => {
  return (
    <div className="lg:col-span-8 space-y-8">
      {/* Detailed Description */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-6">
        <h2 className="text-base font-bold text-[#171717] border-b border-[#EAE6DC] pb-3 mb-4">
          Tentang & Silabus Kegiatan
        </h2>
        <div className="text-sm text-[#474540] leading-relaxed space-y-3">
          <p>{ekskul.full_description}</p>
          <p>
            Kegiatan ekstrakurikuler ini menerapkan sistem presensi berbasis barcode digital pada setiap sesi latihan.
            Setiap anggota diwajibkan memenuhi persentase kehadiran minimal 80% untuk dapat memperoleh lembar verifikasi
            portofolio resmi pada akhir semester.
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-6">
        <div className="flex items-center justify-between border-b border-[#EAE6DC] pb-3 mb-4">
          <h2 className="text-base font-bold text-[#171717]">Daftar Prestasi Resmi Klub</h2>
          <Trophy className="w-4 h-4 text-[#B58A32]" />
        </div>

        {achievements.length === 0 ? (
          <p className="text-xs text-[#68655F]">Belum ada data prestasi resmi yang tercatat untuk ekstrakurikuler ini.</p>
        ) : (
          <div className="space-y-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="p-3.5 border border-[#EAE6DC] rounded bg-[#F9F8F6]/30 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#171717]">{ach.title}</span>
                    <Badge variant="warning">{ach.rank}</Badge>
                  </div>
                  <div className="text-xs text-[#68655F]">
                    {ach.competition_name} ({ach.level}) • Peraih: <span className="font-semibold text-[#171717]">{ach.student_name}</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#234B36] font-semibold">
                  Terverifikasi
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white border border-[#EAE6DC] rounded-lg p-6">
        <h2 className="text-base font-bold text-[#171717] border-b border-[#EAE6DC] pb-3 mb-4">
          Dokumentasi & Agenda Terbaru
        </h2>
        {activities.length === 0 ? (
          <p className="text-xs text-[#68655F]">Belum ada dokumentasi kegiatan yang diunggah.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="p-4 border border-[#EAE6DC] rounded bg-white">
                <div className="flex items-center justify-between text-xs text-[#68655F] mb-1">
                  <span className="font-semibold text-[#234B36]">{act.location}</span>
                  <span>{act.activity_date}</span>
                </div>
                <h3 className="text-sm font-bold text-[#171717] mb-2">{act.title}</h3>
                <p className="text-xs text-[#474540] mb-3 leading-relaxed">{act.description}</p>
                {act.documentation_urls.length > 0 && (
                  <div className="h-40 rounded overflow-hidden bg-[#EAE6DC]">
                    <img
                      src={act.documentation_urls[0]}
                      alt={act.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
