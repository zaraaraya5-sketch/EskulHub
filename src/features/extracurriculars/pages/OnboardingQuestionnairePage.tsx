import React, { useState } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { db } from '@/lib/database';
import { submitQuestionnaireAPI, getQuestionnaireAPI } from '@/lib/api';
import { Extracurricular } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface OnboardingQuestionnairePageProps {
  onNavigate: (path: string) => void;
}

type Stage = 'gate' | 'quiz' | 'analyzing' | 'result';

interface Option {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  tags: string[]; // Slug of ekskuls that get points
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
        icon: <Flame className="w-5 h-5 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q1-b',
        label: 'Melakukan kegiatan luar ruangan yang teratur dan serentak',
        sublabel: 'Menyukai aktivitas dengan ritme yang jelas, ketahanan fisik, dan kekompakan kelompok.',
        icon: <Shield className="w-5 h-5 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q1-c',
        label: 'Membantu teman yang butuh dukungan atau berada di tempat yang tenang',
        sublabel: 'Merasa puas saat bisa mendengarkan cerita rekan, memperhatikan kenyamanan sekitar, dan memberi bantuan nyata.',
        icon: <HeartHandshake className="w-5 h-5 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q1-d',
        label: 'Mengeksplorasi wawasan baru, mengamati topik menarik, atau bertukar ide',
        sublabel: 'Menikmati obrolan terbuka, mendiskusikan gagasan hangat, dan memahami sudut pandang baru.',
        icon: <Sparkles className="w-5 h-5 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q1-e',
        label: 'Menepi ke tempat yang teduh untuk menenangkan pikiran dan refleksi diri',
        sublabel: 'Menyukai suasana damai, obrolan bermakna dari hati ke hati, serta menjaga keseimbangan batin.',
        icon: <Compass className="w-5 h-5 text-[#8C6819]" />,
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
        icon: <Flame className="w-5 h-5 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q2-b',
        label: 'Tetap berpijak pada prosedur dan menjaga keteraturan langkah',
        sublabel: 'Mengedepankan ketenangan sikap, mematuhi kesepakatan tim, dan menjaga ritme kerja agar tidak kacau.',
        icon: <Shield className="w-5 h-5 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q2-c',
        label: 'Menenangkan suasana dan memastikan kondisi semua orang aman',
        sublabel: 'Sigap memeriksa rekan yang panik atau kesulitan, serta memastikan kenyamanan semua orang terlebih dahulu.',
        icon: <HeartHandshake className="w-5 h-5 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q2-d',
        label: 'Mengurai akar persoalan dan mengajak pihak terkait berdialog',
        sublabel: 'Menyusun argumen yang runut, mencari titik temu yang adil, dan menyelesaikan masalah lewat komunikasi efektif.',
        icon: <Sparkles className="w-5 h-5 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q2-e',
        label: 'Menjaga ketenangan hati dan bersikap bijak sebelum bertindak',
        sublabel: 'Mengendalikan emosi agar tidak terburu-buru, serta berpegang teguh pada prinsip kejujuran dan etika.',
        icon: <Compass className="w-5 h-5 text-[#8C6819]" />,
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
        icon: <Flame className="w-5 h-5 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q3-b',
        label: 'Penjaga ketertiban sistem dan kepatuhan jadwal kelompok',
        sublabel: 'Memastikan tugas terdistribusi rapi, setiap orang menjalankan perannya, dan tata tertib ditaati konsisten.',
        icon: <Shield className="w-5 h-5 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q3-c',
        label: 'Penyokong kepedulian yang memastikan tidak ada rekan yang tertinggal',
        sublabel: 'Peka terhadap kebutuhan anggota yang kesulitan, mendampingi dengan sabar, dan memberikan rasa aman.',
        icon: <HeartHandshake className="w-5 h-5 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q3-d',
        label: 'Perumus gagasan dan penyampai narasi ke hadapan banyak orang',
        sublabel: 'Membantu merapikan konsep ide tim agar mudah dipahami, menarik perhatian, dan meyakinkan pihak luar.',
        icon: <Sparkles className="w-5 h-5 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q3-e',
        label: 'Penyejuk kebersamaan yang menjaga keharmonisan hubungan antarteman',
        sublabel: 'Mengutamakan rasa saling menghormati, mengedepankan ketulusan, dan meredakan gesekan antarpribadi.',
        icon: <Compass className="w-5 h-5 text-[#8C6819]" />,
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
        icon: <Flame className="w-5 h-5 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q4-b',
        label: 'Area yang luas, berbaris tertib, dan memiliki disiplin yang tegas',
        sublabel: 'Suasana yang menuntut ketepatan sikap, ketahanan tubuh, dan keselarasan langkah antarsesama anggota.',
        icon: <Shield className="w-5 h-5 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q4-c',
        label: 'Tempat yang bersih, nyaman, dan siap memberikan rasa aman bagi sesama',
        sublabel: 'Lingkungan yang ramah untuk melatih keterampilan praktis yang bermanfaat dan langsung menolong orang lain.',
        icon: <HeartHandshake className="w-5 h-5 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q4-d',
        label: 'Ruang interaktif yang terbuka untuk bertukar pikiran dan wawasan luas',
        sublabel: 'Suasana yang mendorong rasa percaya diri dalam berbicara, memperkaya kosakata, dan membedah isu menarik.',
        icon: <Sparkles className="w-5 h-5 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q4-e',
        label: 'Suasana yang tenang, sejuk, dan menguatkan nilai-nilai moral',
        sublabel: 'Lingkungan damai untuk merenungi hal-hal bermakna, saling mengingatkan kebaikan, dan mempererat tali persaudaraan.',
        icon: <Compass className="w-5 h-5 text-[#8C6819]" />,
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
        icon: <Flame className="w-5 h-5 text-[#B84A3A]" />,
        tags: ['futsal', 'basket', 'voli'],
      },
      {
        id: 'q5-b',
        label: 'Kedisiplinan baja, sikap kepemimpinan tegas, dan jiwa mandiri',
        sublabel: 'Terbiasa dengan manajemen waktu yang ketat, postur tubuh sigap, dan diandalkan dalam tugas besar.',
        icon: <Shield className="w-5 h-5 text-[#234B36]" />,
        tags: ['paskibra', 'pramuka'],
      },
      {
        id: 'q5-c',
        label: 'Ketulusan kepedulian sosial, ketenangan darurat, dan empati kemanusiaan',
        sublabel: 'Mampu memberikan rasa nyaman, sigap bertindak saat orang lain membutuhkan, dan bernilai guna bagi sesama.',
        icon: <HeartHandshake className="w-5 h-5 text-[#D15B40]" />,
        tags: ['pmr'],
      },
      {
        id: 'q5-d',
        label: 'Keberanian berbicara di ruang publik dan pemikiran yang adaptif',
        sublabel: 'Cakap mengutarakan pendapat secara runtut, luwes bergaul di pergaulan luas, dan siap menghadapi tantangan zaman.',
        icon: <Sparkles className="w-5 h-5 text-[#2B547E]" />,
        tags: ['english-club'],
      },
      {
        id: 'q5-e',
        label: 'Integritas moral yang kokoh, kerendahan hati, dan ketenangan batin',
        sublabel: 'Memiliki budi pekerti yang santun, teguh memegang prinsip kebajikan, dan menjadi teladan yang menyejukkan.',
        icon: <Compass className="w-5 h-5 text-[#8C6819]" />,
        tags: ['rohis'],
      },
    ],
  },
];

export const OnboardingQuestionnairePage: React.FC<OnboardingQuestionnairePageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const allEkskuls = db.getExtracurriculars();

  // Stages: 'gate' -> 'quiz' -> 'analyzing' -> 'result'
  // Directly start at 'quiz' so newly registered students immediately see the questions
  const [stage, setStage] = useState<Stage>('quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [rankedResults, setRankedResults] = useState<{ ekskul: Extracurricular; score: number; matchPercent: number; reason: string }[]>([]);

  const studentName = currentUser?.name || 'Siswa Baru';

  const markOnboardingDone = () => {
    if (currentUser?.id) {
      localStorage.setItem(`ekskul_onboarding_completed_${currentUser.id}`, 'true');
    }
  };

  // 1. Gate choices
  const handleAnswerAlreadyDecided = () => {
    markOnboardingDone();
    onNavigate('/ekskul');
  };

  const handleStartQuestionnaire = () => {
    setStage('quiz');
    setCurrentQuestionIndex(0);
  };

  // 2. Quiz flow
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const currentSelection = selectedAnswers[currentQuestion.id];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (!currentSelection) return;

    if (isLastQuestion) {
      // Calculate scores
      calculateAndShowResults();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // 3. Score calculation
  const calculateAndShowResults = async () => {
    setStage('analyzing');

    // 1. Attempt server calculation via Laravel REST API
    try {
      const apiRes = await submitQuestionnaireAPI(selectedAnswers);
      if (apiRes && apiRes.success && apiRes.all_ranked && apiRes.all_ranked.length > 0) {
        setRankedResults(
          apiRes.all_ranked.map((item: any) => ({
            ekskul: item.ekskul,
            score: item.score,
            matchPercent: item.match_percent,
            reason: item.reason,
          }))
        );
        markOnboardingDone();
        setTimeout(() => {
          setStage('result');
        }, 800);
        return;
      }
    } catch (err) {
      console.warn('Fallback to local calculation:', err);
    }

    // 2. Local fallback calculation
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

    // Provide natural variations between multi-tag sports or leadership
    // e.g. based on question 1 specific option selection
    if (selectedAnswers[1] === 'q1-a') {
      scores['futsal'] += 3;
      scores['basket'] += 2;
    }
    if (selectedAnswers[3] === 'q3-b') {
      scores['paskibra'] += 3;
    }

    // Map to actual extracurricular objects from DB
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
        // Calculate a realistic percentage between 70% and 98%
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

    // Short pleasant delay to let students feel the psychological calculation
    setTimeout(() => {
      setStage('result');
    }, 1000);
  };

  // Reset quiz
  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setStage('quiz');
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10">
      {/* ======================================================== */}
      {/* STAGE 1: INITIAL GATE ("Sudah Tahu" vs "Belum Tahu")     */}
      {/* ======================================================== */}
      {stage === 'gate' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
          {/* Header Banner */}
          <div className="text-center space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7EFEA] text-[#234B36] border border-[#234B36]/20 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Langkah Pertama Siswa Baru
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171717] tracking-tight">
              Selamat Datang di EskulHub, <span className="text-[#234B36]">{studentName}</span>!
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#68655F] max-w-2xl mx-auto leading-relaxed">
              Sebelum masuk ke dasbor utama, mari tentukan langkah awal kegiatan ekstrakurikuler non-akademikmu di{' '}
              <strong className="text-[#171717]">SMKN 1 Ciomas</strong>.
            </p>
          </div>

          {/* Gate Card */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm space-y-6 sm:space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#171717]">
                Apakah Anda sudah menetapkan ingin ikut ekstrakurikuler apa?
              </h2>
              <p className="text-xs sm:text-sm text-[#68655F]">
                Pilihlah salah satu opsi di bawah untuk menentukan alur navigasi selanjutnya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Option A: Sudah Tahu */}
              <div
                onClick={handleAnswerAlreadyDecided}
                className="group p-5 sm:p-7 rounded-2xl border-2 border-[#EAE6DC] hover:border-[#234B36] bg-[#F9F8F6] hover:bg-white hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 select-none"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E7EFEA] text-[#234B36] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#171717] group-hover:text-[#234B36] transition-colors">
                      Sudah, saya sudah tahu pilihan saya
                    </h3>
                    <p className="text-xs sm:text-sm text-[#68655F] mt-1.5 leading-relaxed">
                      Saya sudah menetapkan ekskul yang ingin saya ikuti dan ingin langsung membuka formulir pendaftaran.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-[#234B36] group-hover:translate-x-1 transition-transform">
                  <span>Buka Katalog Ekskul Sekarang</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Option B: Belum Tahu -> Kuisioner */}
              <div
                onClick={handleStartQuestionnaire}
                className="group p-5 sm:p-7 rounded-2xl border-2 border-[#D15B40]/40 hover:border-[#D15B40] bg-white hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden select-none"
              >
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FDEDE9] text-[#D15B40] border border-[#D15B40]/20">
                    Disarankan
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FDEDE9] text-[#D15B40] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#171717] group-hover:text-[#D15B40] transition-colors">
                      Belum, saya masih bingung & butuh rekomendasi
                    </h3>
                    <p className="text-xs sm:text-sm text-[#68655F] mt-1.5 leading-relaxed">
                      Bantu saya menemukan ekskul yang paling pas dengan kepribadian dan minat bakat saya melalui{' '}
                      <strong>5 pertanyaan psikologis singkat (±1 menit)</strong>.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-[#D15B40] group-hover:translate-x-1 transition-transform">
                  <span>Mulai Tes Minat Bakat (5 Soal)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* Skip Option */}
            <div className="pt-4 border-t border-[#EAE6DC] text-center">
              <button
                type="button"
                onClick={() => {
                  markOnboardingDone();
                  onNavigate('/student/dashboard');
                }}
                className="min-h-[44px] px-4 py-2 inline-flex items-center justify-center text-xs text-[#68655F] hover:text-[#171717] hover:underline cursor-pointer transition-colors"
              >
                Lewati dan langsung masuk ke Dasbor Siswa &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: 5 SOAL KUISIONER PSIKOLOGIS                     */}
      {/* ======================================================== */}
      {stage === 'quiz' && (
        <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
          {/* Progress Header */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border border-[#EAE6DC] transition-colors ${
                  currentQuestionIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-[#68655F]'
                    : 'hover:bg-[#F9F8F6] text-[#171717] cursor-pointer active:bg-[#EAE6DC]'
                }`}
                title="Pertanyaan Sebelumnya"
                aria-label="Kembali ke soal sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#234B36]">
                  Soal {currentQuestionIndex + 1} dari {QUESTIONS.length}
                </span>
                <div className="text-xs font-semibold text-[#68655F] truncate">{currentQuestion.categoryName}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-48 space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-[#68655F]">
                <span>Kemajuan</span>
                <span>{Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-[#EAE6DC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#234B36] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white border border-[#EAE6DC] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E7EFEA] text-[#234B36]">
                Pertanyaan {currentQuestion.id}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#171717] tracking-tight leading-snug">
                {currentQuestion.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#68655F] leading-relaxed">
                {currentQuestion.description}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = currentSelection === opt.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D, E

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3 sm:gap-4 active:scale-[0.99] select-none ${
                      isSelected
                        ? 'border-[#234B36] bg-[#E7EFEA]/30 shadow-xs'
                        : 'border-[#EAE6DC] hover:border-[#234B36]/40 hover:bg-[#F9F8F6] active:bg-[#F0EDE6]'
                    }`}
                  >
                    {/* Circle / Letter Indicator */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#234B36] text-white shadow-2xs'
                          : 'bg-white border border-[#EAE6DC] text-[#68655F]'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : letter}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {opt.icon}
                        <h4 className="text-xs sm:text-sm font-bold text-[#171717]">
                          {opt.label}
                        </h4>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#68655F] leading-relaxed">
                        {opt.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons (Mobile Reflow Stacked) */}
            <div className="pt-4 border-t border-[#EAE6DC] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStage('gate')}
                className="min-h-[44px] px-3 inline-flex items-center justify-center text-xs text-[#68655F] hover:text-[#171717] hover:underline cursor-pointer active:scale-95 transition-all"
              >
                &larr; Kembali ke pilihan awal
              </button>

              <Button
                variant="primary"
                onClick={handleNextQuestion}
                disabled={!currentSelection}
                className="min-h-[44px] w-full sm:w-auto justify-center text-xs font-bold px-6 py-2.5 shadow-xs cursor-pointer active:scale-[0.98]"
                icon={isLastQuestion ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              >
                {isLastQuestion ? 'Lihat Rekomendasi Ekskul ✨' : 'Selanjutnya'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 3: ANALYZING (PULSE LOADER)                        */}
      {/* ======================================================== */}
      {stage === 'analyzing' && (
        <div className="bg-white border border-[#EAE6DC] rounded-3xl p-12 text-center space-y-6 shadow-sm my-12 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-[#E7EFEA] text-[#234B36] flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717]">
              Menganalisis Jawaban Psikologis...
            </h2>
            <p className="text-xs sm:text-sm text-[#68655F] max-w-md mx-auto leading-relaxed">
              Sistem sedang mencocokkan profil minat, gaya komunikasi, dan preferensi lingkunganmu dengan 8 cabang ekstrakurikuler aktif di SMKN 1 Ciomas.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-[#EAE6DC] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-[#234B36] rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 4: RESULT (REKOMENDASI EKSTURIKULER)               */}
      {/* ======================================================== */}
      {stage === 'result' && rankedResults.length > 0 && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Header Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7EFEA] text-[#234B36] text-xs font-bold uppercase tracking-wider border border-[#234B36]/20">
              <Trophy className="w-3.5 h-3.5" />
              Hasil Rekomendasi Minat & Bakat
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              Ekstrakurikuler Paling Cocok Untukmu
            </h1>
            <p className="text-xs sm:text-sm text-[#68655F] max-w-xl mx-auto">
              Berdasarkan 5 jawaban psikologis yang telah kamu isi, berikut adalah rekomendasi cabang kegiatan yang selaras dengan potensimu.
            </p>
          </div>

          {/* TOP 1 RECOMMENDATION (HERO CARD) */}
          {(() => {
            const top = rankedResults[0];
            return (
              <div className="bg-white border-2 border-[#234B36] rounded-3xl overflow-hidden shadow-md space-y-0">
                <div className="bg-[#234B36] text-white px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#EAE6DC]" />
                    <span>Rekomendasi Utama (Paling Direkomendasikan)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-[#234B36]">
                    {top.matchPercent}% Cocok
                  </span>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 aspect-4/3 rounded-2xl overflow-hidden border border-[#EAE6DC] relative shadow-2xs">
                    <img
                      src={top.ekskul.profile_image}
                      alt={top.ekskul.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-white/95 text-[#171717] shadow-xs">
                        {top.ekskul.category}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#171717]">
                        {top.ekskul.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#68655F] mt-1 italic">
                        "{top.reason}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#171717]">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC]">
                        <Calendar className="w-4 h-4 text-[#234B36] shrink-0" />
                        <span className="truncate">{top.ekskul.practice_schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC]">
                        <MapPin className="w-4 h-4 text-[#234B36] shrink-0" />
                        <span className="truncate">{top.ekskul.location}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC]">
                        <Users className="w-4 h-4 text-[#234B36] shrink-0" />
                        <span className="truncate">Pembina: {top.ekskul.supervisor_name}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9F8F6] border border-[#EAE6DC]">
                        <Trophy className="w-4 h-4 text-[#234B36] shrink-0" />
                        <span className="truncate">{top.ekskul.achievements_count || 3} Prestasi Terukir</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                      <Button
                        variant="primary"
                        onClick={() => onNavigate(`/ekskul/${top.ekskul.slug}/daftar`)}
                        className="min-h-[44px] flex-1 justify-center text-xs font-bold py-2.5 cursor-pointer shadow-xs active:scale-[0.98]"
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Daftar {top.ekskul.name} Sekarang
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onNavigate(`/ekskul/${top.ekskul.slug}`)}
                        className="min-h-[44px] justify-center text-xs font-semibold py-2.5 cursor-pointer active:scale-[0.98]"
                      >
                        Lihat Profil Lengkap
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ALTERNATIVE RECOMMENDATIONS (TOP 2 & 3) */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#234B36]" />
              Alternatif Pilihan Lain yang Juga Cocok Untukmu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rankedResults.slice(1, 3).map((alt) => (
                <div
                  key={alt.ekskul.id}
                  className="bg-white border border-[#EAE6DC] rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E7EFEA] text-[#234B36]">
                        {alt.ekskul.category}
                      </span>
                      <span className="text-xs font-bold text-[#234B36]">
                        {alt.matchPercent}% Cocok
                      </span>
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={alt.ekskul.profile_image}
                        alt={alt.ekskul.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EAE6DC] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-[#171717] truncate">{alt.ekskul.name}</h4>
                        <div className="text-[11px] text-[#68655F] truncate">
                          {alt.ekskul.location}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#68655F] line-clamp-2 leading-relaxed">
                      {alt.reason}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate(`/ekskul/${alt.ekskul.slug}/daftar`)}
                      className="min-h-[40px] flex-1 justify-center text-xs font-semibold cursor-pointer active:scale-[0.98]"
                    >
                      Daftar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/ekskul/${alt.ekskul.slug}`)}
                      className="min-h-[40px] justify-center text-xs font-semibold cursor-pointer active:scale-[0.98]"
                    >
                      Rincian
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Navigation Footer */}
          <div className="bg-[#F9F8F6] border border-[#EAE6DC] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-[#171717]">Ingin Mempertimbangkan Pilihan Lain?</h4>
              <p className="text-[11px] sm:text-xs text-[#68655F] mt-0.5">
                Kamu tetap bebas mendaftar ekskul apa pun dari 8 cabang resmi SMKN 1 Ciomas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetakeQuiz}
                className="min-h-[44px] justify-center text-xs font-semibold cursor-pointer active:scale-[0.98]"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Ulangi Tes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/ekskul')}
                className="min-h-[44px] justify-center text-xs font-semibold cursor-pointer active:scale-[0.98]"
                icon={<BookOpen className="w-3.5 h-3.5" />}
              >
                Buka Katalog Lengkap
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('/student/dashboard')}
                className="min-h-[44px] justify-center text-xs font-bold cursor-pointer active:scale-[0.98]"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Masuk ke Dasbor Siswa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
