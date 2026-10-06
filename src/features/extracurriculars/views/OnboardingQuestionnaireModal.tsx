import React, { useState } from 'react';
import { db } from '@/lib/database';
import { Extracurricular } from '@/types';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Shield,
  HeartHandshake,
  Languages,
  Moon,
  ChevronRight,
  Trophy,
  Users,
  MapPin,
  Calendar,
  X,
  BookOpen,
} from 'lucide-react';

interface OnboardingQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  studentName?: string;
  studentId?: string;
}

type Stage = 'gate' | 'quiz' | 'analyzing' | 'result';

interface Option {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  tags: string[];
}

interface Question {
  id: number;
  categoryName: string;
  title: string;
  description: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    categoryName: 'Pola Energi & Gaya Kegiatan',
    title: 'Saat jam istirahat atau waktu luang di sekolah, kegiatan apa yang paling cepat memulihkan antusiasmemu?',
    description: 'Pilihlah situasi yang paling menggambarkan dorongan energi alamimu.',
    options: [
      {
        id: 'q1-a',
        label: 'Bergerak aktif secara dinamis dan memacu koordinasi fisik',
        sublabel: 'Melepaskan kepenatan lewat aktivitas yang seru, lincah, dan penuh interaksi spontan bersama teman.',
        icon: <Flame className="w-4 h-4 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q1-b',
        label: 'Melakukan kegiatan luar ruangan yang teratur dan serentak',
        sublabel: 'Menyukai aktivitas dengan ritme yang jelas, ketahanan fisik, dan kekompakan kelompok.',
        icon: <Shield className="w-4 h-4 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q1-c',
        label: 'Membantu teman yang butuh dukungan atau berada di tempat yang tenang',
        sublabel: 'Merasa puas saat bisa mendengarkan cerita rekan, memperhatikan kenyamanan sekitar, dan memberi bantuan nyata.',
        icon: <HeartHandshake className="w-4 h-4 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q1-d',
        label: 'Mengeksplorasi wawasan baru, mengamati topik menarik, atau bertukar ide',
        sublabel: 'Menikmati obrolan terbuka, mendiskusikan gagasan hangat, dan memahami sudut pandang baru.',
        icon: <Sparkles className="w-4 h-4 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q1-e',
        label: 'Menepi ke tempat yang teduh untuk menenangkan pikiran dan refleksi diri',
        sublabel: 'Menyukai suasana damai, obrolan bermakna dari hati ke hati, serta menjaga keseimbangan batin.',
        icon: <Compass className="w-4 h-4 text-[#8C6819]" />,
        tags: ['rohis'],
      },
    ],
  },
  {
    id: 2,
    categoryName: 'Respon Menghadapi Tekanan',
    title: 'Ketika menghadapi situasi yang mendadak berubah atau penuh ketidakpastian, bagaimana refleks pertamamu?',
    description: 'Pilihlah reaksi spontan yang paling mencerminkan ketahanan mentalmu.',
    options: [
      {
        id: 'q2-a',
        label: 'Bereaksi tangkas dengan tindakan nyata tanpa ragu-ragu',
        sublabel: 'Langsung mengambil inisiatif taktis di tempat dan mengandalkan kecepatan insting untuk membalikkan keadaan.',
        icon: <Flame className="w-4 h-4 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q2-b',
        label: 'Tetap berpijak pada prosedur dan menjaga keteraturan langkah',
        sublabel: 'Mengedepankan ketenangan sikap, mematuhi kesepakatan tim, dan menjaga ritme kerja agar tidak kacau.',
        icon: <Shield className="w-4 h-4 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q2-c',
        label: 'Menenangkan suasana dan memastikan kondisi semua orang aman',
        sublabel: 'Sigap memeriksa rekan yang panik atau kesulitan, serta memastikan kenyamanan semua orang terlebih dahulu.',
        icon: <HeartHandshake className="w-4 h-4 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q2-d',
        label: 'Mengurai akar persoalan dan mengajak pihak terkait berdialog',
        sublabel: 'Menyusun argumen yang runut, mencari titik temu yang adil, dan menyelesaikan masalah lewat komunikasi efektif.',
        icon: <Sparkles className="w-4 h-4 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q2-e',
        label: 'Menjaga ketenangan hati dan bersikap bijak sebelum bertindak',
        sublabel: 'Mengendalikan emosi agar tidak terburu-buru, serta berpegang teguh pada prinsip kejujuran dan etika.',
        icon: <Compass className="w-4 h-4 text-[#8C6819]" />,
        tags: ['rohis'],
      },
    ],
  },
  {
    id: 3,
    categoryName: 'Peran dalam Kolaborasi Tim',
    title: 'Dalam sebuah tim atau regu tugas bersama, peran mana yang paling natural dan nyaman bagimu?',
    description: 'Pilihlah bentuk kontribusi yang paling membuatmu merasa bangga dan dihargai.',
    options: [
      {
        id: 'q3-a',
        label: 'Penggerak aksi yang menjaga tempo dan semangat juang tim',
        sublabel: 'Senang berada di garda depan, memacu antusiasme anggota, dan menjaga fokus agar target tercapai.',
        icon: <Flame className="w-4 h-4 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q3-b',
        label: 'Penjaga ketertiban sistem dan kepatuhan jadwal kelompok',
        sublabel: 'Memastikan tugas terdistribusi rapi, setiap orang menjalankan perannya, dan tata tertib ditaati konsisten.',
        icon: <Shield className="w-4 h-4 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q3-c',
        label: 'Penyokong kepedulian yang memastikan tidak ada rekan yang tertinggal',
        sublabel: 'Peka terhadap kebutuhan anggota yang kesulitan, mendampingi dengan sabar, dan memberikan rasa aman.',
        icon: <HeartHandshake className="w-4 h-4 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q3-d',
        label: 'Perumus gagasan dan penyampai narasi ke hadapan banyak orang',
        sublabel: 'Membantu merapikan konsep ide tim agar mudah dipahami, menarik perhatian, dan meyakinkan pihak luar.',
        icon: <Sparkles className="w-4 h-4 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q3-e',
        label: 'Penyejuk kebersamaan yang menjaga keharmonisan hubungan antarteman',
        sublabel: 'Mengutamakan rasa saling menghormati, mengedepankan ketulusan, dan meredakan gesekan antarpribadi.',
        icon: <Compass className="w-4 h-4 text-[#8C6819]" />,
        tags: ['rohis'],
      },
    ],
  },
  {
    id: 4,
    categoryName: 'Suasana Lingkungan Belajar & Berlatih',
    title: 'Suasana tempat dan ritme kegiatan seperti apa yang paling membuatmu betah berlama-lama?',
    description: 'Pilihlah lingkungan interaksi yang paling memicu potensi terbaik dalam dirimu.',
    options: [
      {
        id: 'q4-a',
        label: 'Ruang terbuka yang aktif, kompetitif, dan penuh energi kebersamaan',
        sublabel: 'Tempat yang leluasa untuk melatih fisik, mengasah ketangkasan, dan merasakan serunya tantangan langsung.',
        icon: <Flame className="w-4 h-4 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q4-b',
        label: 'Area yang luas, berbaris tertib, dan memiliki disiplin yang tegas',
        sublabel: 'Suasana yang menuntut ketepatan sikap, ketahanan tubuh, dan keselarasan langkah antarsesama anggota.',
        icon: <Shield className="w-4 h-4 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q4-c',
        label: 'Tempat yang bersih, nyaman, dan siap memberikan rasa aman bagi sesama',
        sublabel: 'Lingkungan yang ramah untuk melatih keterampilan praktis yang bermanfaat dan langsung menolong orang lain.',
        icon: <HeartHandshake className="w-4 h-4 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q4-d',
        label: 'Ruang interaktif yang terbuka untuk bertukar pikiran dan wawasan luas',
        sublabel: 'Suasana yang mendorong rasa percaya diri dalam berbicara, memperkaya kosakata, dan membedah isu menarik.',
        icon: <Sparkles className="w-4 h-4 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q4-e',
        label: 'Suasana yang tenang, sejuk, dan menguatkan nilai-nilai moral',
        sublabel: 'Lingkungan damai untuk merenungi hal-hal bermakna, saling mengingatkan kebaikan, dan mempererat tali persaudaraan.',
        icon: <Compass className="w-4 h-4 text-[#8C6819]" />,
        tags: ['rohis'],
      },
    ],
  },
  {
    id: 5,
    categoryName: 'Target Pembentukan Diri',
    title: 'Kualitas pembawaan diri seperti apa yang paling ingin kamu bawa pulang saat lulus nanti?',
    description: 'Pilihlah nilai karakter pribadi yang paling berharga bagi perjalanan hidup dan masa depanmu.',
    options: [
      {
        id: 'q5-a',
        label: 'Kebugaran fisik prima, ketangkasan respon, dan mentalitas pantang gentar',
        sublabel: 'Memiliki stamina yang tangguh, kebiasaan hidup sehat, dan keberanian bersaing secara sportif.',
        icon: <Flame className="w-4 h-4 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q5-b',
        label: 'Kedisiplinan baja, sikap kepemimpinan tegas, dan jiwa mandiri',
        sublabel: 'Terbiasa dengan manajemen waktu yang ketat, postur tubuh sigap, dan diandalkan dalam tugas besar.',
        icon: <Shield className="w-4 h-4 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q5-c',
        label: 'Ketulusan kepedulian sosial, ketenangan darurat, dan empati kemanusiaan',
        sublabel: 'Mampu memberikan rasa nyaman, sigap bertindak saat orang lain membutuhkan, dan bernilai guna bagi sesama.',
        icon: <HeartHandshake className="w-4 h-4 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q5-d',
        label: 'Keberanian berbicara di ruang publik dan pemikiran yang adaptif',
        sublabel: 'Cakap mengutarakan pendapat secara runtut, luwes bergaul di pergaulan luas, dan siap menghadapi tantangan zaman.',
        icon: <Sparkles className="w-4 h-4 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q5-e',
        label: 'Integritas moral yang kokoh, kerendahan hati, dan ketenangan batin',
        sublabel: 'Memiliki budi pekerti yang santun, teguh memegang prinsip kebajikan, dan menjadi teladan yang menyejukkan.',
        icon: <Compass className="w-4 h-4 text-[#8C6819]" />,
        tags: ['rohis'],
      },
    ],
  },
];

export const OnboardingQuestionnaireModal: React.FC<OnboardingQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  studentName = 'Siswa Baru',
  studentId,
}) => {
  const allEkskuls = db.getExtracurriculars();

  const [stage, setStage] = useState<Stage>('gate');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [rankedResults, setRankedResults] = useState<{ ekskul: Extracurricular; score: number; matchPercent: number; reason: string }[]>([]);

  if (!isOpen) return null;

  const markOnboardingDone = () => {
    if (studentId) {
      localStorage.setItem(`ekskul_onboarding_completed_${studentId}`, 'true');
    }
  };

  const handleAlreadyDecided = () => {
    markOnboardingDone();
    onClose();
    onNavigate('/ekskul');
  };

  const handleStartQuiz = () => {
    setStage('quiz');
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const currentSelection = selectedAnswers[currentQuestion?.id || 1];

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optId,
    }));
  };

  const handleNext = () => {
    if (!currentSelection) return;
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    setStage('analyzing');

    const scores: Record<string, number> = {
      futsal: 0,
      basket: 0,
      voli: 0,
      paskibra: 0,
      pramuka: 0,
      pmr: 0,
      rohis: 0,
      'english-club': 0,
    };

    QUESTIONS.forEach((q) => {
      const chosenOptId = selectedAnswers[q.id];
      const opt = q.options.find((o) => o.id === chosenOptId);
      if (opt) {
        opt.tags.forEach((slug) => {
          if (scores[slug] !== undefined) {
            scores[slug] += 10;
          }
        });
      }
    });

    if (selectedAnswers[1] === 'q1-a') {
      scores['futsal'] += 3;
      scores['basket'] += 2;
    }
    if (selectedAnswers[3] === 'q3-b') {
      scores['paskibra'] += 3;
    }

    const reasonsMap: Record<string, string> = {
      futsal: 'Kamu memiliki dorongan fisik tinggi, menyukai tempo cepat, dan sangat menikmati kekompakan strategi di lapangan bola.',
      basket: 'Kamu menyukai kompetisi fisik yang intens, kelincahan gerak, serta kerja sama tim dinamis dengan semangat juang prima.',
      voli: 'Kamu memiliki koordinasi gerak yang presisi, menghargai saling percaya antarteman satu tim, dan menyukai olahraga tanpa benturan fisik langsung.',
      paskibra: 'Karaktermu mencerminkan keteguhan kedisiplinan, postur kepemimpinan yang berwibawa, dan rasa bangga mengharumkan kehormatan sekolah.',
      pramuka: 'Kamu memiliki jiwa petualang mandiri, menyukai keakraban di alam terbuka, serta memiliki kreativitas tinggi dalam memecahkan masalah nyata.',
      pmr: 'Kamu memiliki rasa empati mendalam terhadap sesama, ketenangan dalam situasi darurat, serta panggilan hati untuk menolong orang lain.',
      'english-club': 'Kamu memiliki minat besar dalam berkomunikasi, berani menyampaikan gagasan kritis, serta berorientasi pada wawasan dan pergaulan global.',
      rohis: 'Kamu memprioritaskan ketenangan spiritual, kehangatan ukhuwah islami, serta tekad kuat untuk membangun akhlak mulia sejak bangku sekolah.',
    };

    const evaluated = allEkskuls
      .map((ekskul) => {
        const rawScore = scores[ekskul.slug] || 0;
        const matchPercent = Math.min(98, Math.max(65, Math.round(65 + (rawScore / 50) * 33)));
        return {
          ekskul,
          score: rawScore,
          matchPercent,
          reason: reasonsMap[ekskul.slug] || ekskul.short_description,
        };
      })
      .sort((a, b) => b.score - a.score);

    setRankedResults(evaluated);
    markOnboardingDone();

    setTimeout(() => {
      setStage('result');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="fixed inset-0"
        onClick={() => {
          markOnboardingDone();
          onClose();
        }}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-2xl bg-white border-t sm:border border-[#EAE6DC] rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden animate-scale-in max-h-[92dvh] sm:max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal - Compact on mobile, 44px close target */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#EAE6DC] bg-[#F9F8F6] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#E7EFEA] text-[#234B36] flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#171717] truncate">
                {stage === 'gate' && 'Langkah Pertama Siswa Baru'}
                {stage === 'quiz' && `Kuisioner Minat Bakat (${currentQuestionIndex + 1}/5)`}
                {stage === 'analyzing' && 'Menganalisis Jawaban...'}
                {stage === 'result' && 'Rekomendasi Ekstrakurikuler'}
              </h3>
              <p className="text-[10px] text-[#68655F] truncate">EskulHub • SMKN 1 Ciomas</p>
            </div>
          </div>
          <button
            onClick={() => {
              markOnboardingDone();
              onClose();
            }}
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#68655F] hover:text-[#171717] rounded-xl hover:bg-[#EAE6DC] active:bg-[#E0DDD5] transition-all cursor-pointer shrink-0"
            title="Tutup & Lewati ke Dasbor"
            aria-label="Tutup modal kuisioner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          {/* ======================================================== */}
          {/* STAGE 1: GATE IN POPUP                                   */}
          {/* ======================================================== */}
          {stage === 'gate' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E7EFEA] text-[#234B36] border border-[#234B36]/20">
                  Pendaftaran Akun Berhasil 🎉
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#171717]">
                  Halo, {studentName}!
                </h2>
                <p className="text-xs sm:text-sm text-[#68655F] max-w-md mx-auto">
                  Sebelum kamu masuk ke dasbor, <strong>apakah kamu sudah menetapkan ingin ikut ekskul apa?</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Opsi 1: Sudah Tahu -> Katalog */}
                <div
                  onClick={handleAlreadyDecided}
                  className="group p-4 sm:p-5 rounded-2xl border-2 border-[#EAE6DC] hover:border-[#234B36] bg-[#F9F8F6] hover:bg-white hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 select-none"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-[#E7EFEA] text-[#234B36] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#234B36] transition-colors">
                        Sudah, saya sudah tahu pilihan saya
                      </h4>
                      <p className="text-[11px] text-[#68655F] mt-1 leading-relaxed">
                        Langsung bawa saya ke katalog ekskul untuk memilih dan mendaftar.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#234B36] pt-1">
                    <span>Ke Katalog Ekskul</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>

                {/* Opsi 2: Belum Tahu -> Kuisioner */}
                <div
                  onClick={handleStartQuiz}
                  className="group p-4 sm:p-5 rounded-2xl border-2 border-[#D15B40]/40 hover:border-[#D15B40] bg-white hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden select-none"
                >
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40]">
                      Disarankan
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#D15B40] transition-colors">
                        Belum, saya butuh rekomendasi
                      </h4>
                      <p className="text-[11px] text-[#68655F] mt-1 leading-relaxed">
                        Bantu saya temukan ekskul yang cocok lewat <strong>5 soal kuisioner singkat (±1 menit)</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#D15B40] pt-1">
                    <span>Mulai Kuisioner (5 Soal)</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    markOnboardingDone();
                    onClose();
                    onNavigate('/student/dashboard');
                  }}
                  className="min-h-[44px] px-4 py-2 inline-flex items-center justify-center text-xs text-[#68655F] hover:text-[#171717] hover:underline cursor-pointer"
                >
                  Lewati dan langsung masuk ke Dasbor Siswa &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: 5 SOAL KUISIONER                                */}
          {/* ======================================================== */}
          {stage === 'quiz' && currentQuestion && (
            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="space-y-1.5 pb-2 border-b border-[#EAE6DC]">
                <div className="flex justify-between items-center text-[11px] font-bold text-[#68655F]">
                  <span className="text-[#234B36] uppercase tracking-wide">
                    {currentQuestion.categoryName}
                  </span>
                  <span>{Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EAE6DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#234B36] rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#171717] leading-snug">
                  {currentQuestion.title}
                </h3>
                <p className="text-[11px] text-[#68655F]">{currentQuestion.description}</p>
              </div>

              {/* Options */}
              <div className="space-y-2 sm:space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = currentSelection === opt.id;
                  const letter = String.fromCharCode(65 + idx);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer flex items-start gap-3 active:scale-[0.99] select-none ${
                        isSelected
                          ? 'border-[#234B36] bg-[#E7EFEA]/30 shadow-xs'
                          : 'border-[#EAE6DC] hover:border-[#234B36]/40 hover:bg-[#F9F8F6] active:bg-[#F0EDE6]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-[11px] sm:text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#234B36] text-white shadow-2xs'
                            : 'bg-white border border-[#EAE6DC] text-[#68655F]'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : letter}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {opt.icon}
                          <span className="text-xs sm:text-sm font-bold text-[#171717]">{opt.label}</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[#68655F] leading-relaxed">{opt.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: ANALYZING                                       */}
          {/* ======================================================== */}
          {stage === 'analyzing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E7EFEA] text-[#234B36] flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#171717]">Mencocokkan Profil Minatmu...</h3>
                <p className="text-xs text-[#68655F] max-w-sm mx-auto">
                  Sistem sedang menganalisis pilihan jawabanmu dengan 8 cabang ekstrakurikuler di SMKN 1 Ciomas.
                </p>
              </div>
              <div className="w-36 h-1.5 bg-[#EAE6DC] rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-[#234B36] rounded-full animate-pulse w-full" />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 4: RESULT IN POPUP                                 */}
          {/* ======================================================== */}
          {stage === 'result' && rankedResults.length > 0 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E7EFEA] text-[#234B36]">
                  Hasil Analisis Minat & Bakat
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#171717]">
                  Rekomendasi Terbaik Untukmu
                </h3>
              </div>

              {/* Top Match Hero */}
              {(() => {
                const top = rankedResults[0];
                return (
                  <div className="border-2 border-[#234B36] rounded-2xl overflow-hidden shadow-xs space-y-0 bg-white">
                    <div className="bg-[#234B36] text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" />
                        Rekomendasi Utama
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-white text-[#234B36]">
                        {top.matchPercent}% Cocok
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center">
                      <img
                        src={top.ekskul.profile_image}
                        alt={top.ekskul.name}
                        className="w-full sm:w-28 h-36 sm:h-28 object-cover rounded-xl border border-[#EAE6DC] shrink-0"
                      />
                      <div className="space-y-2 flex-1 text-center sm:text-left min-w-0">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#234B36]">
                            {top.ekskul.category}
                          </span>
                          <h4 className="text-xl font-black text-[#171717] truncate">{top.ekskul.name}</h4>
                          <p className="text-[11px] text-[#68655F] italic mt-0.5 leading-relaxed">
                            "{top.reason}"
                          </p>
                        </div>

                        <div className="text-[11px] text-[#171717] flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="p-1 px-2 rounded-lg bg-[#F9F8F6] border border-[#EAE6DC] truncate">
                            📍 {top.ekskul.location}
                          </span>
                          <span className="p-1 px-2 rounded-lg bg-[#F9F8F6] border border-[#EAE6DC] truncate">
                            👤 Pembina: {top.ekskul.supervisor_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 bg-[#F9F8F6] border-t border-[#EAE6DC] flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          markOnboardingDone();
                          onClose();
                          onNavigate(`/ekskul/${top.ekskul.slug}/daftar`);
                        }}
                        className="min-h-[44px] flex-1 justify-center text-xs font-bold py-2 cursor-pointer shadow-xs active:scale-[0.98]"
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Daftar {top.ekskul.name} Sekarang
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          markOnboardingDone();
                          onClose();
                          onNavigate(`/ekskul/${top.ekskul.slug}`);
                        }}
                        className="min-h-[44px] justify-center text-xs font-semibold py-2 cursor-pointer active:scale-[0.98]"
                      >
                        Profil Ekskul
                      </Button>
                    </div>
                  </div>
                );
              })()}

              {/* Alternative Match */}
              {rankedResults[1] && (
                <div className="p-3.5 rounded-xl border border-[#EAE6DC] bg-[#F9F8F6] flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={rankedResults[1].ekskul.profile_image}
                      alt={rankedResults[1].ekskul.name}
                      className="w-11 h-11 rounded-lg object-cover border border-[#EAE6DC] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="text-xs font-bold text-[#171717] truncate">{rankedResults[1].ekskul.name}</h5>
                        <span className="text-[10px] text-[#234B36] font-bold shrink-0">
                          • {rankedResults[1].matchPercent}% Cocok
                        </span>
                      </div>
                      <p className="text-[10px] text-[#68655F] truncate">
                        Alternatif pilihan lain yang sesuai potensimu
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      markOnboardingDone();
                      onClose();
                      onNavigate(`/ekskul/${rankedResults[1].ekskul.slug}/daftar`);
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white border border-[#EAE6DC] hover:border-[#234B36] active:bg-[#F0EDE6] text-xs font-bold text-[#171717] hover:text-[#234B36] transition-colors cursor-pointer shrink-0"
                  >
                    Daftar
                  </button>
                </div>
              )}

              {/* Result Modal Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    markOnboardingDone();
                    onClose();
                    onNavigate('/ekskul');
                  }}
                  className="min-h-[44px] w-full sm:w-auto text-xs font-semibold cursor-pointer active:scale-[0.98]"
                  icon={<BookOpen className="w-4 h-4" />}
                >
                  Katalog Lengkap
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    markOnboardingDone();
                    onClose();
                    onNavigate('/student/dashboard');
                  }}
                  className="min-h-[44px] w-full sm:w-auto text-xs font-bold cursor-pointer active:scale-[0.98]"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Masuk ke Dasbor Siswa
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile-Friendly Footer for Quiz Stage (always in thumb reach) */}
        {stage === 'quiz' && (
          <div className="px-4 sm:px-6 py-3 border-t border-[#EAE6DC] bg-[#F9F8F6] shrink-0 flex items-center justify-between">
            <button
              type="button"
              onClick={currentQuestionIndex === 0 ? () => setStage('gate') : handlePrev}
              className="min-h-[44px] px-3 -ml-2 text-xs font-semibold text-[#68655F] hover:text-[#171717] active:text-[#171717] flex items-center gap-1.5 cursor-pointer select-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentQuestionIndex === 0 ? 'Pilihan Awal' : 'Sebelumnya'}</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={!currentSelection}
              className="min-h-[44px] text-xs font-bold px-5 py-2.5 cursor-pointer shadow-xs active:scale-[0.98]"
              icon={isLastQuestion ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            >
              {isLastQuestion ? 'Lihat Rekomendasi ✨' : 'Lanjut'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
