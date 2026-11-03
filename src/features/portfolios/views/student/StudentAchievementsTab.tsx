import React from 'react';
import { Achievement, PortfolioVerification } from '@/types';
import { Trophy, Users, Layers, Award, CheckCircle2, Clock } from 'lucide-react';

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
  const verifiedCount = myAchievements.filter((a) => a.is_verified).length;

  return (
    <div className="space-y-6">
      {/* Page Header Card */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#D15B40] flex items-center gap-1.5 mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Rekam Prestasi & Kejuaraan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Prestasi, Penghargaan & Organisasi
          </h2>
          <p className="text-xs text-[#68655F] mt-0.5">
            Daftar raihan kejuaraan kompetisi dan peran kepanitiaan yang telah divalidasi oleh Kesiswaan.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-[#FDEDE9] border border-[#F2C9C0] rounded-xl text-xs font-bold text-[#D15B40] shrink-0 self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>{verifiedCount} Prestasi Tervalidasi</span>
        </div>
      </div>

      {/* Section 1: Achievements (Prestasi) */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-[#EAE6DC] pb-4">
          <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D15B40]" />
            <span>Raihan Kejuaraan & Prestasi Kompetisi</span>
          </h3>
          <p className="text-xs text-[#68655F] mt-0.5">
            Setiap piagam kejuaraan otomatis masuk ke transkrip lampiran portofolio kelulusan siswa.
          </p>
        </div>

        {myAchievements.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#68655F] space-y-2">
            <Trophy className="w-10 h-10 text-[#A39F97]/40 mx-auto" />
            <p>Belum ada data prestasi kejuaraan yang tercatat. Ajukan sertifikatmu di tab Dokumen Pendukung.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {myAchievements.map((ach) => (
              <div
                key={ach.id}
                className="p-5 border border-[#EAE6DC] rounded-xl bg-white hover:border-[#D15B40]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF9EE] border border-[#F5E6C4] text-[#B58A32] flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#171717] leading-snug">{ach.title}</h4>
                        <div className="text-xs text-[#68655F] mt-0.5 truncate">{ach.competition_name}</div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        ach.is_verified
                          ? 'bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]'
                          : 'bg-[#FEF9EE] text-[#B58A32] border border-[#F5E6C4]'
                      }`}
                    >
                      {ach.is_verified ? 'Tervalidasi' : 'Menunggu'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-[#F9F8F6] p-2.5 rounded-lg border border-[#EAE6DC]">
                    <div>
                      <span className="text-[10px] text-[#68655F] block uppercase font-semibold">Tingkat</span>
                      <strong className="text-[#171717]">{ach.level}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#68655F] block uppercase font-semibold">Peringkat</span>
                      <strong className="text-[#D15B40]">{ach.rank}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#68655F] pt-2 border-t border-[#EAE6DC] flex items-center justify-between">
                  <span>Ekskul: <strong className="text-[#171717]">{ach.extracurricular_name}</strong></span>
                  {ach.verified_by_name && (
                    <span className="text-[#D15B40] font-semibold">Oleh: {ach.verified_by_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Committees & School Events (Kepanitiaan) */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-[#EAE6DC] pb-4">
          <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D15B40]" />
            <span>Kepanitiaan & Partisipasi Event Sekolah</span>
          </h3>
          <p className="text-xs text-[#68655F] mt-0.5">
            Peran kepemimpinan dan dedikasi dalam turnamen, bakti sosial, dan kepanitiaan OSIS/Sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verification.summary_data.committee_roles?.map((comm, idx) => (
            <div
              key={idx}
              className="p-4 border border-[#EAE6DC] rounded-xl bg-[#F9F8F6] hover:bg-white hover:border-[#D15B40]/30 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#171717]">{comm.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-[#68655F] border border-[#EAE6DC]">
                  {comm.year}
                </span>
              </div>
              <div className="text-xs text-[#D15B40] font-bold">{comm.role}</div>
              <div className="text-[11px] text-[#68655F] leading-relaxed">
                Tercatat resmi dalam rekam jejak kepemimpinan non-akademik siswa.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Extracurricular Activity Documentation */}
      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-[#EAE6DC] pb-4">
          <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D15B40]" />
            <span>Riwayat Kegiatan & Dokumentasi Ekskul</span>
          </h3>
          <p className="text-xs text-[#68655F] mt-0.5">
            Dokumentasi pelaksanaan program kerja dan sesi latihan gabungan dari ekskul yang kamu ikuti.
          </p>
        </div>

        <div className="space-y-3.5">
          {myActivityHistory.map((act) => (
            <div
              key={act.id}
              className="p-4 border border-[#EAE6DC] rounded-xl bg-[#F9F8F6] hover:bg-white hover:border-[#D15B40]/30 hover:shadow-2xs transition-all flex flex-col sm:flex-row gap-4 items-start"
            >
              {act.documentation_urls?.[0] && (
                <img
                  src={act.documentation_urls[0]}
                  alt={act.title}
                  className="w-full sm:w-36 h-24 rounded-lg object-cover border border-[#EAE6DC] shrink-0"
                />
              )}
              <div className="space-y-1 text-xs flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#171717]">{act.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#F2C9C0]">
                    {act.extracurricular_name}
                  </span>
                </div>
                <p className="text-[#68655F] leading-relaxed line-clamp-2">{act.description}</p>
                <div className="text-[#68655F] pt-1 flex items-center gap-3 text-[11px] flex-wrap">
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
