<?php

namespace App\Http\Controllers;

use App\Models\Ekskul;
use Illuminate\Http\Request;

class QuestionnaireController extends Controller
{
    /**
     * Get the 5 psychological questions and initial gate config.
     */
    public function index()
    {
        $gate = [
            'title' => 'Langkah Awal Siswa Baru',
            'prompt' => 'Apakah Anda sudah menetapkan ingin ikut ekstrakurikuler apa?',
            'description' => 'Pilihlah salah satu opsi di bawah untuk menentukan langkah pertamamu.',
            'options' => [
                [
                    'id' => 'already_decided',
                    'title' => 'Sudah, saya sudah tahu pilihan saya',
                    'description' => 'Saya sudah menetapkan ekskul pilihan dan ingin langsung menuju katalog pendaftaran.',
                    'action' => 'catalog',
                    'redirect_path' => '/ekskul',
                ],
                [
                    'id' => 'need_recommendation',
                    'title' => 'Belum, saya butuh rekomendasi',
                    'description' => 'Bantu saya menemukan ekskul yang paling pas lewat 5 soal kuisioner minat bakat.',
                    'action' => 'quiz',
                    'redirect_path' => '/student/kuisioner',
                ],
            ],
        ];

        $questions = [
            [
                'id' => 1,
                'category_name' => 'Pola Energi & Gaya Kegiatan',
                'title' => 'Saat jam istirahat atau waktu luang di sekolah, kegiatan apa yang paling cepat memulihkan antusiasmemu?',
                'description' => 'Pilihlah situasi yang paling menggambarkan dorongan energi alamimu.',
                'options' => [
                    [
                        'id' => 'q1-a',
                        'label' => 'Bergerak aktif secara dinamis dan memacu koordinasi fisik',
                        'sublabel' => 'Melepaskan kepenatan lewat aktivitas yang seru, lincah, dan penuh interaksi spontan bersama teman.',
                        'tags' => ['futsal', 'basket', 'voli'],
                    ],
                    [
                        'id' => 'q1-b',
                        'label' => 'Melakukan kegiatan luar ruangan yang teratur dan serentak',
                        'sublabel' => 'Menyukai aktivitas dengan ritme yang jelas, ketahanan fisik, dan kekompakan kelompok.',
                        'tags' => ['paskibra', 'pramuka'],
                    ],
                    [
                        'id' => 'q1-c',
                        'label' => 'Membantu teman yang butuh dukungan atau berada di tempat yang tenang',
                        'sublabel' => 'Merasa puas saat bisa mendengarkan cerita rekan, memperhatikan kenyamanan sekitar, dan memberi bantuan nyata.',
                        'tags' => ['pmr'],
                    ],
                    [
                        'id' => 'q1-d',
                        'label' => 'Mengeksplorasi wawasan baru, mengamati topik menarik, atau bertukar ide',
                        'sublabel' => 'Menikmati obrolan terbuka, mendiskusikan gagasan hangat, dan memahami sudut pandang baru.',
                        'tags' => ['english-club'],
                    ],
                    [
                        'id' => 'q1-e',
                        'label' => 'Menepi ke tempat yang teduh untuk menenangkan pikiran dan refleksi diri',
                        'sublabel' => 'Menyukai suasana damai, obrolan bermakna dari hati ke hati, serta menjaga keseimbangan batin.',
                        'tags' => ['rohis'],
                    ],
                ],
            ],
            [
                'id' => 2,
                'category_name' => 'Respon Menghadapi Tekanan',
                'title' => 'Ketika menghadapi situasi yang mendadak berubah atau penuh ketidakpastian, bagaimana refleks pertamamu?',
                'description' => 'Pilihlah reaksi spontan yang paling mencerminkan ketahanan mentalmu.',
                'options' => [
                    [
                        'id' => 'q2-a',
                        'label' => 'Bereaksi tangkas dengan tindakan nyata tanpa ragu-ragu',
                        'sublabel' => 'Langsung mengambil inisiatif taktis di tempat dan mengandalkan kecepatan insting untuk membalikkan keadaan.',
                        'tags' => ['futsal', 'basket', 'voli'],
                    ],
                    [
                        'id' => 'q2-b',
                        'label' => 'Tetap berpijak pada prosedur dan menjaga keteraturan langkah',
                        'sublabel' => 'Mengedepankan ketenangan sikap, mematuhi kesepakatan tim, dan menjaga ritme kerja agar tidak kacau.',
                        'tags' => ['paskibra', 'pramuka'],
                    ],
                    [
                        'id' => 'q2-c',
                        'label' => 'Menenangkan suasana dan memastikan kondisi semua orang aman',
                        'sublabel' => 'Sigap memeriksa rekan yang panik atau kesulitan, serta memastikan kenyamanan semua orang terlebih dahulu.',
                        'tags' => ['pmr'],
                    ],
                    [
                        'id' => 'q2-d',
                        'label' => 'Mengurai akar persoalan dan mengajak pihak terkait berdialog',
                        'sublabel' => 'Menyusun argumen yang runut, mencari titik temu yang adil, dan menyelesaikan masalah lewat komunikasi efektif.',
                        'tags' => ['english-club'],
                    ],
                    [
                        'id' => 'q2-e',
                        'label' => 'Menjaga ketenangan hati dan bersikap bijak sebelum bertindak',
                        'sublabel' => 'Mengendalikan emosi agar tidak terburu-buru, serta berpegang teguh pada prinsip kejujuran dan etika.',
                        'tags' => ['rohis'],
                    ],
                ],
            ],
            [
                'id' => 3,
                'category_name' => 'Peran dalam Kolaborasi Tim',
                'title' => 'Dalam sebuah tim atau regu tugas bersama, peran mana yang paling natural dan nyaman bagimu?',
                'description' => 'Pilihlah bentuk kontribusi yang paling membuatmu merasa bangga dan dihargai.',
                'options' => [
                    [
                        'id' => 'q3-a',
                        'label' => 'Penggerak aksi yang menjaga tempo dan semangat juang tim',
                        'sublabel' => 'Senang berada di garda depan, memacu antusiasme anggota, dan menjaga fokus agar target tercapai.',
                        'tags' => ['futsal', 'basket', 'voli'],
                    ],
                    [
                        'id' => 'q3-b',
                        'label' => 'Penjaga ketertiban sistem dan kepatuhan jadwal kelompok',
                        'sublabel' => 'Memastikan tugas terdistribusi rapi, setiap orang menjalankan perannya, dan tata tertib ditaati konsisten.',
                        'tags' => ['paskibra', 'pramuka'],
                    ],
                    [
                        'id' => 'q3-c',
                        'label' => 'Penyokong kepedulian yang memastikan tidak ada rekan yang tertinggal',
                        'sublabel' => 'Peka terhadap kebutuhan anggota yang kesulitan, mendampingi dengan sabar, dan memberikan rasa aman.',
                        'tags' => ['pmr'],
                    ],
                    [
                        'id' => 'q3-d',
                        'label' => 'Perumus gagasan dan penyampai narasi ke hadapan banyak orang',
                        'sublabel' => 'Membantu merapikan konsep ide tim agar mudah dipahami, menarik perhatian, dan meyakinkan pihak luar.',
                        'tags' => ['english-club'],
                    ],
                    [
                        'id' => 'q3-e',
                        'label' => 'Penyejuk kebersamaan yang menjaga keharmonisan hubungan antarteman',
                        'sublabel' => 'Mengutamakan rasa saling menghormati, mengedepankan ketulusan, dan meredakan gesekan antarpribadi.',
                        'tags' => ['rohis'],
                    ],
                ],
            ],
            [
                'id' => 4,
                'category_name' => 'Suasana Lingkungan Belajar & Berlatih',
                'title' => 'Suasana tempat dan ritme kegiatan seperti apa yang paling membuatmu betah berlama-lama?',
                'description' => 'Pilihlah lingkungan interaksi yang paling memicu potensi terbaik dalam dirimu.',
                'options' => [
                    [
                        'id' => 'q4-a',
                        'label' => 'Ruang terbuka yang aktif, kompetitif, dan penuh energi kebersamaan',
                        'sublabel' => 'Tempat yang leluasa untuk melatih fisik, mengasah ketangkasan, dan merasakan serunya tantangan langsung.',
                        'tags' => ['futsal', 'basket', 'voli'],
                    ],
                    [
                        'id' => 'q4-b',
                        'label' => 'Area yang luas, berbaris tertib, dan memiliki disiplin yang tegas',
                        'sublabel' => 'Suasana yang menuntut ketepatan sikap, ketahanan tubuh, dan keselarasan langkah antarsesama anggota.',
                        'tags' => ['paskibra', 'pramuka'],
                    ],
                    [
                        'id' => 'q4-c',
                        'label' => 'Tempat yang bersih, nyaman, dan siap memberikan rasa aman bagi sesama',
                        'sublabel' => 'Lingkungan yang ramah untuk melatih keterampilan praktis yang bermanfaat dan langsung menolong orang lain.',
                        'tags' => ['pmr'],
                    ],
                    [
                        'id' => 'q4-d',
                        'label' => 'Ruang interaktif yang terbuka untuk bertukar pikiran dan wawasan luas',
                        'sublabel' => 'Suasana yang mendorong rasa percaya diri dalam berbicara, memperkaya kosakata, dan membedah isu menarik.',
                        'tags' => ['english-club'],
                    ],
                    [
                        'id' => 'q4-e',
                        'label' => 'Suasana yang tenang, sejuk, dan menguatkan nilai-nilai moral',
                        'sublabel' => 'Lingkungan damai untuk merenungi hal-hal bermakna, saling mengingatkan kebaikan, dan mempererat tali persaudaraan.',
                        'tags' => ['rohis'],
                    ],
                ],
            ],
            [
                'id' => 5,
                'category_name' => 'Target Pembentukan Diri',
                'title' => 'Kualitas pembawaan diri seperti apa yang paling ingin kamu bawa pulang saat lulus nanti?',
                'description' => 'Pilihlah nilai karakter pribadi yang paling berharga bagi perjalanan hidup dan masa depanmu.',
                'options' => [
                    [
                        'id' => 'q5-a',
                        'label' => 'Kebugaran fisik prima, ketangkasan respon, dan mentalitas pantang gentar',
                        'sublabel' => 'Memiliki stamina yang tangguh, kebiasaan hidup sehat, dan keberanian bersaing secara sportif.',
                        'tags' => ['futsal', 'basket', 'voli'],
                    ],
                    [
                        'id' => 'q5-b',
                        'label' => 'Kedisiplinan baja, sikap kepemimpinan tegas, dan jiwa mandiri',
                        'sublabel' => 'Terbiasa dengan manajemen waktu yang ketat, postur tubuh sigap, dan diandalkan dalam tugas besar.',
                        'tags' => ['paskibra', 'pramuka'],
                    ],
                    [
                        'id' => 'q5-c',
                        'label' => 'Ketulusan kepedulian sosial, ketenangan darurat, dan empati kemanusiaan',
                        'sublabel' => 'Mampu memberikan rasa nyaman, sigap bertindak saat orang lain membutuhkan, dan bernilai guna bagi sesama.',
                        'tags' => ['pmr'],
                    ],
                    [
                        'id' => 'q5-d',
                        'label' => 'Keberanian berbicara di ruang publik dan pemikiran yang adaptif',
                        'sublabel' => 'Cakap mengutarakan pendapat secara runtut, luwes bergaul di pergaulan luas, dan siap menghadapi tantangan zaman.',
                        'tags' => ['english-club'],
                    ],
                    [
                        'id' => 'q5-e',
                        'label' => 'Integritas moral yang kokoh, kerendahan hati, dan ketenangan batin',
                        'sublabel' => 'Memiliki budi pekerti yang santun, teguh memegang prinsip kebajikan, dan menjadi teladan yang menyejukkan.',
                        'tags' => ['rohis'],
                    ],
                ],
            ],
        ];

        return response()->json([
            'success' => true,
            'gate' => $gate,
            'questions' => $questions,
        ]);
    }

    /**
     * Submit answers and calculate personalized recommendations.
     */
    public function submit(Request $request)
    {
        $answers = $request->input('answers', []); // [question_id => option_id]

        $scores = [
            'futsal' => 0,
            'basket' => 0,
            'voli' => 0,
            'paskibra' => 0,
            'pramuka' => 0,
            'pmr' => 0,
            'rohis' => 0,
            'english-club' => 0,
        ];

        $tagWeights = [
            'q1-a' => ['futsal' => 12, 'basket' => 11, 'voli' => 10],
            'q1-b' => ['paskibra' => 12, 'pramuka' => 10],
            'q1-c' => ['pmr' => 15],
            'q1-d' => ['english-club' => 15],
            'q1-e' => ['rohis' => 15],

            'q2-a' => ['futsal' => 11, 'basket' => 12, 'voli' => 10],
            'q2-b' => ['paskibra' => 12, 'pramuka' => 10],
            'q2-c' => ['pmr' => 15],
            'q2-d' => ['english-club' => 15],
            'q2-e' => ['rohis' => 15],

            'q3-a' => ['futsal' => 12, 'basket' => 11, 'voli' => 11],
            'q3-b' => ['paskibra' => 12, 'pramuka' => 11],
            'q3-c' => ['pmr' => 15],
            'q3-d' => ['english-club' => 15],
            'q3-e' => ['rohis' => 15],

            'q4-a' => ['futsal' => 12, 'basket' => 12, 'voli' => 10],
            'q4-b' => ['paskibra' => 11, 'pramuka' => 12],
            'q4-c' => ['pmr' => 15],
            'q4-d' => ['english-club' => 15],
            'q4-e' => ['rohis' => 15],

            'q5-a' => ['futsal' => 12, 'basket' => 12, 'voli' => 11],
            'q5-b' => ['paskibra' => 12, 'pramuka' => 11],
            'q5-c' => ['pmr' => 15],
            'q5-d' => ['english-club' => 15],
            'q5-e' => ['rohis' => 15],
        ];

        foreach ($answers as $qId => $optId) {
            if (isset($tagWeights[$optId])) {
                foreach ($tagWeights[$optId] as $slug => $points) {
                    $scores[$slug] += $points;
                }
            }
        }

        $reasons = [
            'futsal' => 'Kamu memiliki dorongan fisik tinggi, menyukai tempo cepat, dan sangat menikmati kekompakan strategi di lapangan bola.',
            'basket' => 'Kamu menyukai kompetisi fisik yang intens, kelincahan gerak, serta kerja sama tim dinamis dengan semangat juang prima.',
            'voli' => 'Kamu memiliki koordinasi gerak yang presisi, menghargai saling percaya antarteman satu tim, dan menyukai olahraga tanpa benturan fisik langsung.',
            'paskibra' => 'Karaktermu mencerminkan keteguhan kedisiplinan, postur kepemimpinan yang berwibawa, dan rasa bangga mengharumkan kehormatan sekolah.',
            'pramuka' => 'Kamu memiliki jiwa petualang mandiri, menyukai keakraban di alam terbuka, serta memiliki kreativitas tinggi dalam memecahkan masalah nyata.',
            'pmr' => 'Kamu memiliki rasa empati mendalam terhadap sesama, ketenangan dalam situasi darurat, serta panggilan hati untuk menolong orang lain.',
            'english-club' => 'Kamu memiliki minat besar dalam berkomunikasi, berani menyampaikan gagasan kritis, serta berorientasi pada wawasan dan pergaulan global.',
            'rohis' => 'Kamu memprioritaskan ketenangan spiritual, kehangatan ukhuwah islami, serta tekad kuat untuk membangun akhlak mulia sejak bangku sekolah.',
        ];

        $allEkskuls = Ekskul::all();
        $evaluated = [];

        foreach ($allEkskuls as $ekskul) {
            $rawScore = $scores[$ekskul->slug] ?? 0;
            $matchPercent = min(98, max(68, round(65 + ($rawScore / 60) * 33)));

            $evaluated[] = [
                'ekskul' => $ekskul,
                'score' => $rawScore,
                'match_percent' => $matchPercent,
                'reason' => $reasons[$ekskul->slug] ?? $ekskul->short_description,
            ];
        }

        usort($evaluated, fn($a, $b) => $b['score'] <=> $a['score']);

        return response()->json([
            'success' => true,
            'top_recommendation' => $evaluated[0] ?? null,
            'alternatives' => array_slice($evaluated, 1, 2),
            'all_ranked' => $evaluated,
        ]);
    }
}
