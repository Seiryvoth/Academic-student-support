'use client';

import { SubjectId, GradeLevel, getAllLessons, getLessonById } from './curriculum-data';
import { parseYouTubeUrl, parsePdfUrl } from './storage-utils';
import { McqChoice } from './curriculum-mcqs-generator';

export interface VideoMcqItem {
  id: string;
  questionNumber: number;
  questionKm: string;
  questionEn: string;
  optionsKm: [string, string, string, string, string];
  optionsEn: [string, string, string, string, string];
  correctAnswer: McqChoice;
  hintKm: string;
  hintEn: string;
  explanationKm: string;
  explanationEn: string;
}

export interface VideoResourceItem {
  id: string;
  lessonId: string;
  subject: SubjectId;
  grade: GradeLevel;
  titleKm: string;
  titleEn: string;
  descriptionKm: string;
  descriptionEn: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  pdfUrl?: string;
  pdfSourceType: 'gdrive' | 'upload' | 'external';
  createdAt: string;
  createdByEmail?: string;
  videoMcqs: VideoMcqItem[];
}

export interface StaffAccount {
  id: string;
  email: string;
  fullNameKm: string;
  fullNameEn: string;
  role: 'super_admin' | 'subject_lead';
  subjectAssigned: SubjectId | null; // null for super_admin
  isActive: boolean;
  createdAt: string;
}

// Initial 6 Staff Accounts
export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-admin-1',
    email: 'admin@moeys.gov.kh',
    fullNameKm: 'លោកបណ្ឌិត ជា សុវណ្ណ (Super Admin)',
    fullNameEn: 'Dr. Chea Sovann (Super Admin)',
    role: 'super_admin',
    subjectAssigned: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-math-lead',
    email: 'math@moeys.gov.kh',
    fullNameKm: 'សាស្ត្រាចារ្យ ឡុង សុខា (Math Lead)',
    fullNameEn: 'Prof. Long Sokha (Math Lead)',
    role: 'subject_lead',
    subjectAssigned: 'math',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-phys-lead',
    email: 'physics@moeys.gov.kh',
    fullNameKm: 'លោកស្រី គឹម សុផល (Physics Lead)',
    fullNameEn: 'Mrs. Kim Sophal (Physics Lead)',
    role: 'subject_lead',
    subjectAssigned: 'physics',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-chem-lead',
    email: 'chemistry@moeys.gov.kh',
    fullNameKm: 'លោក វ៉ាន់ រតនា (Chemistry Lead)',
    fullNameEn: 'Mr. Vann Rattana (Chemistry Lead)',
    role: 'subject_lead',
    subjectAssigned: 'chemistry',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-bio-lead',
    email: 'biology@moeys.gov.kh',
    fullNameKm: 'លោកស្រី សេង គន្ធា (Biology Lead)',
    fullNameEn: 'Mrs. Seng Kunthea (Biology Lead)',
    role: 'subject_lead',
    subjectAssigned: 'biology',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-eng-lead',
    email: 'english@moeys.gov.kh',
    fullNameKm: 'លោក ដារ៉ា សិទ្ធិ (English Lead)',
    fullNameEn: 'Mr. Dara Sethi (English Lead)',
    role: 'subject_lead',
    subjectAssigned: 'english',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// Initial pre-seeded video lessons showcasing hybrid YouTube + Google Drive PDF architecture
export const INITIAL_VIDEO_RESOURCES: VideoResourceItem[] = [
  {
    id: 'video-math-12-1',
    lessonId: 'math-g12-1',
    subject: 'math',
    grade: 12,
    titleKm: 'ចំនួនកុំផ្លិច៖ ទម្រង់ពីជគណិត និងរូបមន្តដឺម័រ (BacII Prep)',
    titleEn: 'Complex Numbers: Algebraic Form & De Moivre Formula',
    descriptionKm: 'ការបកស្រាយលម្អិតអំពីប្រមាណវិធីលើចំនួនកុំផ្លិច $z = a + bi$ ម៉ូឌុល អាគុយម៉ង់ និងវិធីដោះស្រាយវិញ្ញាសាបាក់ឌុប។',
    descriptionEn: 'In-depth breakdown of complex numbers operations $z = a + bi$, modulus, argument, and national BacII exam problems.',
    youtubeUrl: 'https://www.youtube.com/watch?v=5PcpBw5Hbwo',
    youtubeVideoId: '5PcpBw5Hbwo',
    pdfUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    pdfSourceType: 'gdrive',
    createdAt: '2026-02-10T08:00:00Z',
    createdByEmail: 'math@moeys.gov.kh',
    videoMcqs: [
      {
        id: 'vmcq-m12-1',
        questionNumber: 1,
        questionKm: 'យោងតាមការពន្យល់ក្នុងវីដេអូ តើតម្លៃ $i^2$ ស្មើនឹងប៉ុន្មាន?',
        questionEn: 'According to the video lecture, what is the value of $i^2$?',
        optionsKm: ['$1$', '$-1$', '$0$', '$i$', '$-i$'],
        optionsEn: ['$1$', '$-1$', '$0$', '$i$', '$-i$'],
        correctAnswer: 'B',
        hintKm: 'ឯកតានិម្មិត $i$ ត្រូវបានកំណត់ដោយ $i = \\sqrt{-1}$។',
        hintEn: 'The imaginary unit $i$ is defined by $i = \\sqrt{-1}$.',
        explanationKm: 'តាមនិយមន័យគ្រឹះនៃចំនួនកុំផ្លិច $i^2 = -1$។ ចម្លើយត្រឹមត្រូវគឺ B។',
        explanationEn: 'By foundational definition of complex numbers, $i^2 = -1$. Choice B is correct.',
      },
      {
        id: 'vmcq-m12-2',
        questionNumber: 2,
        questionKm: 'តើចំនួនកុំផ្លិចឆ្លាស់ (Conjugate) នៃ $z = 4 + 3i$ គឺអ្វី?',
        questionEn: 'What is the complex conjugate of $z = 4 + 3i$?',
        optionsKm: ['$\\bar{z} = -4 - 3i$', '$\\bar{z} = 4 - 3i$', '$\\bar{z} = -4 + 3i$', '$\\bar{z} = 3 + 4i$', '$\\bar{z} = 5$'],
        optionsEn: ['$\\bar{z} = -4 - 3i$', '$\\bar{z} = 4 - 3i$', '$\\bar{z} = -4 + 3i$', '$\\bar{z} = 3 + 4i$', '$\\bar{z} = 5$'],
        correctAnswer: 'B',
        hintKm: 'ចំនួនកុំផ្លិចឆ្លាស់ $\\bar{z}$ គ្រាន់តែប្តូរសញ្ញានៃផ្នែកនិម្មិត $b$ ប៉ុណ្ណោះ។',
        hintEn: 'To form the conjugate $\\bar{z} = a - bi$, simply invert the sign of the imaginary coefficient.',
        explanationKm: 'សម្រាប់ $z = a + bi$ ចំនួនឆ្លាស់គឺ $\\bar{z} = a - bi$។ ដូច្នេះសម្រាប់ $z = 4 + 3i$ ឆ្លាស់គឺ $\\bar{z} = 4 - 3i$។ ចម្លើយគឺ B។',
        explanationEn: 'For $z = 4 + 3i$, the conjugate is $\\bar{z} = 4 - 3i$. Choice B is correct.',
      },
      {
        id: 'vmcq-m12-3',
        questionNumber: 3,
        questionKm: 'យោងតាមរូបមន្តដឺម័រ (De Moivre) តើ $(\\cos\\theta + i\\sin\\theta)^n$ ស្មើនឹងអ្វី?',
        questionEn: 'According to De Moivre’s theorem, what is $(\\cos\\theta + i\\sin\\theta)^n$?',
        optionsKm: [
          '$\\cos^n\\theta + i\\sin^n\\theta$',
          '$\\cos(n\\theta) + i\\sin(n\\theta)$',
          '$n\\cos\\theta + in\\sin\\theta$',
          '$\\cos\\theta + i\\sin(n\\theta)$',
          '$\\cos(n\\theta) - i\\sin(n\\theta)$',
        ],
        optionsEn: [
          '$\\cos^n\\theta + i\\sin^n\\theta$',
          '$\\cos(n\\theta) + i\\sin(n\\theta)$',
          '$n\\cos\\theta + in\\sin\\theta$',
          '$\\cos\\theta + i\\sin(n\\theta)$',
          '$\\cos(n\\theta) - i\\sin(n\\theta)$',
        ],
        correctAnswer: 'B',
        hintKm: 'និទស្សន្ត $n$ គុណចូលក្នុងមុំ $\\theta$ នៃស៊ីនុស និងកូស៊ីនុស។',
        hintEn: 'The exponent $n$ multiplies directly with the angle argument $\\theta$.',
        explanationKm: 'រូបមន្តដឺម័រចែងថា $(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$។ ចម្លើយត្រឹមត្រូវគឺ B។',
        explanationEn: 'De Moivre theorem states $(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$. Choice B is correct.',
      },
    ],
  },
  {
    id: 'video-phys-12-1',
    lessonId: 'physics-g12-1',
    subject: 'physics',
    grade: 12,
    titleKm: 'លំយោលមេកានិច និងប៉ោលរ៉ឺស័រ (BacII Formula Review)',
    titleEn: 'Mechanical Oscillations & Spring Pendulums',
    descriptionKm: 'ការបង្កើតសមីការឌីផេរ៉ង់ស្យែល ការគណនាខួប $T = 2\\pi\\sqrt{\\frac{m}{k}}$ និងការសិក្សាថាមពលមេកានិច។',
    descriptionEn: 'Differential equations of harmonic motion, period $T = 2\\pi\\sqrt{\\frac{m}{k}}$, and mechanical energy conservation.',
    youtubeUrl: 'https://www.youtube.com/watch?v=JZ0k4j0p12o',
    youtubeVideoId: 'JZ0k4j0p12o',
    pdfUrl: 'https://drive.google.com/file/d/1aBCdeFGHIJklmnOPqrstuvwxyz123456/view?usp=sharing',
    pdfSourceType: 'gdrive',
    createdAt: '2026-02-11T09:00:00Z',
    createdByEmail: 'physics@moeys.gov.kh',
    videoMcqs: [
      {
        id: 'vmcq-p12-1',
        questionNumber: 1,
        questionKm: 'តើខួប $T$ នៃប៉ោលរ៉ឺស័រប្រែប្រួលយ៉ាងណា ប្រសិនបើម៉ាស $m$ កើនឡើង ៤ ដង?',
        questionEn: 'How does the period $T$ of a spring pendulum change if mass $m$ is multiplied by 4?',
        optionsKm: ['ថយចុះ ២ ដង', 'កើនឡើង ២ ដង', 'កើនឡើង ៤ ដង', 'នៅថេរមិនប្រែប្រួល', 'កើនឡើង ១៦ ដង'],
        optionsEn: ['Decreases by 2 times', 'Increases by 2 times', 'Increases by 4 times', 'Remains unchanged', 'Increases by 16 times'],
        correctAnswer: 'B',
        hintKm: 'រូបមន្តខួប $T = 2\\pi\\sqrt{\\frac{m}{k}}$។ ពិនិត្យមើលឥទ្ធិពលនៃ $\\sqrt{4}$។',
        hintEn: 'Period formula $T = 2\\pi\\sqrt{\\frac{m}{k}}$. Notice the effect of $\\sqrt{4}$.',
        explanationKm: 'ដោយសារ $T$ សមាមាត្រនឹង $\\sqrt{m}$ នៅពេល $m$ កើន ៤ ដង នោះ $T\' = \\sqrt{4} T = 2T$។ ដូច្នេះខួបកើនឡើង ២ ដង (B)។',
        explanationEn: 'Since $T \\propto \\sqrt{m}$, multiplying $m$ by 4 results in $\\sqrt{4} = 2$ times the period. Choice B is correct.',
      },
      {
        id: 'vmcq-p12-2',
        questionNumber: 2,
        questionKm: 'នៅទីតាំងលំនឹង ($x = 0$) តើល្បឿនរបស់អង្គធាតុមានលក្ខណៈដូចម្តេច?',
        questionEn: 'At the equilibrium position ($x = 0$), what is the state of the object velocity?',
        optionsKm: ['ល្បឿនស្មើ ០', 'ល្បឿនមានតម្លៃអតិបរមា ($v = v_{\\max}$)', 'ល្បឿនអវិជ្ជមានជានិច្ច', 'សំទុះអតិបរមា', 'ថាមពលប៉ូតង់ស្យែលអតិបរមា'],
        optionsEn: ['Velocity is zero', 'Velocity is at its maximum ($v = v_{\\max}$)', 'Velocity is always negative', 'Acceleration is maximum', 'Potential energy is maximum'],
        correctAnswer: 'B',
        hintKm: 'នៅទីតាំងកណ្តាល (លំនឹង) ថាមពលប៉ូតង់ស្យែលប្រែក្លាយជាថាមពលស៊ីនេទិចទាំងអស់។',
        hintEn: 'At equilibrium, all potential energy is converted entirely into kinetic energy.',
        explanationKm: 'នៅ $x = 0$ ថាមពលប៉ូតង់ស្យែល $E_p = 0$ ដូច្នេះថាមពលស៊ីនេទិច $E_k$ អតិបរមា ដែលធ្វើឱ្យល្បឿន $v = v_{\\max} = \\omega A$។ ចម្លើយគឺ B។',
        explanationEn: 'At $x=0$, potential energy is zero and kinetic energy is maximized, yielding maximum speed $v_{\\max} = \\omega A$. Choice B is correct.',
      },
    ],
  },
  {
    id: 'video-chem-12-1',
    lessonId: 'chemistry-g12-2',
    subject: 'chemistry',
    grade: 12,
    titleKm: 'ទ្រឹស្តីអាស៊ីត-បាសប្រុងស្តែត និងសូលុយស្យុងទ្រនាប់',
    titleEn: 'Bronsted-Lowry Acids/Bases & Buffer Solutions',
    descriptionKm: 'ការកំណត់គូអាស៊ីត-បាសជាប់គ្នា ការគណនា pH តាមសមីការ Henderson-Hasselbalch និងលក្ខណៈសូលុយស្យុងទ្រនាប់។',
    descriptionEn: 'Conjugate acid-base pairs identification, Henderson-Hasselbalch pH calculations, and buffer resistance.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ANi709MYnWg',
    youtubeVideoId: 'ANi709MYnWg',
    pdfUrl: 'https://drive.google.com/file/d/1ZzYxWvUtSrQpOnMlKjIhGfEdCbA12345/view?usp=sharing',
    pdfSourceType: 'gdrive',
    createdAt: '2026-02-12T10:00:00Z',
    createdByEmail: 'chemistry@moeys.gov.kh',
    videoMcqs: [
      {
        id: 'vmcq-c12-1',
        questionNumber: 1,
        questionKm: 'យោងតាមទ្រឹស្តីប្រុងស្តែត-ឡូរី តើអាស៊ីតត្រូវបានកំណត់និយមន័យដូចម្តេច?',
        questionEn: 'According to the Brønsted-Lowry theory, how is an acid defined?',
        optionsKm: [
          'ជាប្រភេទគីមីដែលទទួលប្រូតុង $H^+$',
          'ជាប្រភេទគីមីដែលបោះបង់ប្រូតុង $H^+$',
          'ជាប្រភេទគីមីដែលបង្កើតអ៊ីយ៉ុង $OH^-$',
          'ជាសារធាតុមិនរលាយក្នុងទឹក',
          'ជាសារធាតុដែលមាន pH ធំជាង ៧',
        ],
        optionsEn: [
          'A chemical species that accepts a proton $H^+$',
          'A chemical species that donates a proton $H^+$',
          'A chemical species that generates $OH^-$ ions only',
          'An insoluble crystalline compound',
          'A substance with pH strictly greater than 7',
        ],
        correctAnswer: 'B',
        hintKm: 'អាស៊ីតគឺជាអ្នកផ្តល់ (Donor) ហើយបាសគឺជាអ្នកទទួល (Acceptor)។',
        hintEn: 'Acids are proton donors; bases are proton acceptors.',
        explanationKm: 'ទ្រឹស្តី Brønsted-Lowry ចែងថា អាស៊ីតជាប្រភេទគីមីដែលអាចបោះបង់ប្រូតុង $H^+$។ ចម្លើយត្រឹមត្រូវគឺ B។',
        explanationEn: 'Under the Brønsted-Lowry definition, an acid is a proton ($H^+$) donor. Choice B is correct.',
      },
    ],
  },
  {
    id: 'video-bio-12-1',
    lessonId: 'biology-g12-1',
    subject: 'biology',
    grade: 12,
    titleKm: 'ម៉ូលេគុល ADN, ARN និងការសំយោគប្រូតេអ៊ីន',
    titleEn: 'DNA, RNA & Protein Synthesis Mechanisms',
    descriptionKm: 'ដំណើរការចម្លងក្រម (Transcription) ក្នុងណ្វៃយ៉ូ និងការបកប្រែក្រម (Translation) នៅលើរីបូសូម។',
    descriptionEn: 'Nuclear transcription of mRNA and ribosome translation into functional polypeptide proteins.',
    youtubeUrl: 'https://www.youtube.com/watch?v=gG7uCskUOrA',
    youtubeVideoId: 'gG7uCskUOrA',
    pdfUrl: 'https://drive.google.com/file/d/1bio99988877766554433221100aabbcc/view?usp=sharing',
    pdfSourceType: 'gdrive',
    createdAt: '2026-02-13T11:00:00Z',
    createdByEmail: 'biology@moeys.gov.kh',
    videoMcqs: [
      {
        id: 'vmcq-b12-1',
        questionNumber: 1,
        questionKm: 'តើកូដុងចាប់ផ្តើម (Initiation Codon) នៃការសំយោគប្រូតេអ៊ីនលើ ARNm គឺអ្វី?',
        questionEn: 'What is the universal start codon for protein synthesis translation on mRNA?',
        optionsKm: ['UAA', 'AUG', 'UAG', 'UGA', 'CCC'],
        optionsEn: ['UAA', 'AUG', 'UAG', 'UGA', 'CCC'],
        correctAnswer: 'B',
        hintKm: 'កូដុងនេះកំណត់អាស៊ីតអាមីណេ មេត្យូនីន (Methionine)។',
        hintEn: 'This codon codes for the amino acid Methionine (Met).',
        explanationKm: 'AUG គឺជាកូដុងចាប់ផ្តើម (Start Codon) តែមួយគត់ដែលកូដឱ្យអាស៊ីតអាមីណេ Methionine។ ចម្លើយត្រឹមត្រូវគឺ B។',
        explanationEn: 'AUG is the universal start codon encoding Methionine. Choice B is correct.',
      },
    ],
  },
  {
    id: 'video-eng-12-1',
    lessonId: 'english-g12-1',
    subject: 'english',
    grade: 12,
    titleKm: 'Inversion & Cleft Sentences Mastery (BacII High Scorers)',
    titleEn: 'Inversion & Cleft Sentences Mastery',
    descriptionKm: 'ការប្រើប្រាស់ Negative Adverbial Inversion (Never, Rarely, Scarcely) និង It is/was... that structures សម្រាប់បាក់ឌុប។',
    descriptionEn: 'Mastering negative adverbial inversion and emphatic cleft structures for national grade 12 examinations.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z1BCujX3pw8',
    youtubeVideoId: 'Z1BCujX3pw8',
    pdfUrl: 'https://drive.google.com/file/d/1eng77766655544433322211100aabbcc/view?usp=sharing',
    pdfSourceType: 'gdrive',
    createdAt: '2026-02-14T14:00:00Z',
    createdByEmail: 'english@moeys.gov.kh',
    videoMcqs: [
      {
        id: 'vmcq-e12-1',
        questionNumber: 1,
        questionKm: 'ជ្រើសរើសទម្រង់ Inversion ត្រឹមត្រូវ៖ "Seldom ________ such an inspiring academic speech."',
        questionEn: 'Choose the correct inverted sentence: "Seldom ________ such an inspiring academic speech."',
        optionsKm: [
          'I have heard',
          'have I heard',
          'I had heard',
          'did I heard',
          'have heard I',
        ],
        optionsEn: [
          'I have heard',
          'have I heard',
          'I had heard',
          'did I heard',
          'have heard I',
        ],
        correctAnswer: 'B',
        hintKm: 'នៅពេលប្រយោគចាប់ផ្តើមដោយពាក្យ Seldom, Rarely, Never ត្រូវត្រឡប់កិរិយាសព្ទជំនួយ (Auxiliary) មកមុខប្រធាន។',
        hintEn: 'Negative adverbials at the beginning require auxiliary verb inversion: Adverb + Auxiliary + Subject + Main Verb.',
        explanationKm: 'ទម្រង់ Inversion: Seldom + have (auxiliary) + I (subject) + heard (V3)។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺ B។',
        explanationEn: 'After restrictive adverbs like "Seldom", standard inversion applies: Seldom + have + I + heard. Choice B is correct.',
      },
    ],
  },
];

// Local Storage Keys
const STORAGE_KEY_VIDEOS = 'moeys_custom_videos_v2';
const STORAGE_KEY_STAFF = 'moeys_custom_staff_v2';
const STORAGE_KEY_CURRENT_STAFF = 'moeys_active_staff_session';

export function getStoredVideos(): VideoResourceItem[] {
  if (typeof window === 'undefined') return INITIAL_VIDEO_RESOURCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(INITIAL_VIDEO_RESOURCES));
      return INITIAL_VIDEO_RESOURCES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VIDEO_RESOURCES;
  }
}

export function saveStoredVideos(videos: VideoResourceItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
  } catch (err) {
    console.error('Error saving videos to localStorage:', err);
  }
}

export function addVideoResource(item: Omit<VideoResourceItem, 'id' | 'createdAt'>): VideoResourceItem {
  const current = getStoredVideos();
  const parsedYoutube = parseYouTubeUrl(item.youtubeUrl);
  const parsedPdf = parsePdfUrl(item.pdfUrl);

  const newItem: VideoResourceItem = {
    ...item,
    id: `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    youtubeVideoId: parsedYoutube.videoId || '5PcpBw5Hbwo',
    pdfSourceType: parsedPdf.sourceType === 'gdrive' ? 'gdrive' : 'external',
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  saveStoredVideos(updated);

  // Attempt Supabase sync
  try {
    import('./supabase').then(async ({ isSupabaseConfigured, supabase }) => {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('video_resources').insert({
          id: newItem.id,
          lesson_id: newItem.lessonId,
          subject: newItem.subject,
          grade: newItem.grade,
          title_km: newItem.titleKm,
          title_en: newItem.titleEn,
          description_km: newItem.descriptionKm,
          description_en: newItem.descriptionEn,
          youtube_url: newItem.youtubeUrl,
          youtube_video_id: newItem.youtubeVideoId,
          pdf_url: newItem.pdfUrl,
          pdf_source_type: newItem.pdfSourceType,
        });

        if (newItem.videoMcqs && newItem.videoMcqs.length > 0) {
          const mcqRows = newItem.videoMcqs.map((q) => ({
            video_id: newItem.id,
            question_number: q.questionNumber,
            question_km: q.questionKm,
            question_en: q.questionEn,
            options_km: q.optionsKm,
            options_en: q.optionsEn,
            correct_answer: q.correctAnswer,
            hint_km: q.hintKm,
            hint_en: q.hintEn,
            explanation_km: q.explanationKm,
            explanation_en: q.explanationEn,
          }));
          await supabase.from('video_mcqs').insert(mcqRows);
        }
      }
    });
  } catch {
    // Local storage fallback
  }

  return newItem;
}

export function getVideoResourceById(id: string): VideoResourceItem | undefined {
  return getStoredVideos().find((v) => v.id === id);
}

export function updateVideoResource(id: string, updates: Partial<VideoResourceItem>): VideoResourceItem | null {
  const current = getStoredVideos();
  const index = current.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const updatedItem: VideoResourceItem = {
    ...existing,
    ...updates,
  };

  if (updates.youtubeUrl) {
    const parsed = parseYouTubeUrl(updates.youtubeUrl);
    if (parsed.videoId) {
      updatedItem.youtubeVideoId = parsed.videoId;
    }
  }

  if (updates.pdfUrl !== undefined) {
    const parsedPdf = parsePdfUrl(updates.pdfUrl);
    updatedItem.pdfSourceType = parsedPdf.sourceType === 'gdrive' ? 'gdrive' : 'external';
  }

  current[index] = updatedItem;
  saveStoredVideos(current);

  // Attempt Supabase sync
  try {
    import('./supabase').then(async ({ isSupabaseConfigured, supabase }) => {
      if (isSupabaseConfigured && supabase) {
        // 1. Update video metadata
        await supabase
          .from('video_resources')
          .update({
            title_km: updatedItem.titleKm,
            title_en: updatedItem.titleEn,
            description_km: updatedItem.descriptionKm,
            description_en: updatedItem.descriptionEn,
            youtube_url: updatedItem.youtubeUrl,
            youtube_video_id: updatedItem.youtubeVideoId,
            pdf_url: updatedItem.pdfUrl,
            pdf_source_type: updatedItem.pdfSourceType,
            updated_at: new Date().toISOString(),
          })
          .eq('id', updatedItem.id);

        // 2. Sync attached video MCQs if updated
        if (updatedItem.videoMcqs) {
          await supabase.from('video_mcqs').delete().eq('video_id', updatedItem.id);
          if (updatedItem.videoMcqs.length > 0) {
            const mcqRows = updatedItem.videoMcqs.map((q) => ({
              video_id: updatedItem.id,
              question_number: q.questionNumber,
              question_km: q.questionKm,
              question_en: q.questionEn,
              options_km: q.optionsKm,
              options_en: q.optionsEn,
              correct_answer: q.correctAnswer,
              hint_km: q.hintKm,
              hint_en: q.hintEn,
              explanation_km: q.explanationKm,
              explanation_en: q.explanationEn,
            }));
            await supabase.from('video_mcqs').insert(mcqRows);
          }
        }
      }
    });
  } catch {
    // Local storage fallback
  }

  return updatedItem;
}

export function deleteVideoResource(id: string): boolean {
  const current = getStoredVideos();
  const filtered = current.filter((v) => v.id !== id);
  if (filtered.length !== current.length) {
    saveStoredVideos(filtered);

    // Attempt Supabase deletion
    try {
      import('./supabase').then(async ({ isSupabaseConfigured, supabase }) => {
        if (isSupabaseConfigured && supabase) {
          await supabase.from('video_mcqs').delete().eq('video_id', id);
          await supabase.from('video_resources').delete().eq('id', id);
        }
      });
    } catch {
      // Local storage fallback
    }

    return true;
  }
  return false;
}

export function getStoredStaff(): StaffAccount[] {
  if (typeof window === 'undefined') return INITIAL_STAFF_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAFF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(INITIAL_STAFF_ACCOUNTS));
      return INITIAL_STAFF_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STAFF_ACCOUNTS;
  }
}

export function saveStoredStaff(staff: StaffAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staff));
  } catch (err) {
    console.error('Error saving staff to localStorage:', err);
  }
}

export function getCurrentStaffSession(): StaffAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_STAFF);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentStaffSession(account: StaffAccount | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (account) {
      localStorage.setItem(STORAGE_KEY_CURRENT_STAFF, JSON.stringify(account));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_STAFF);
    }
  } catch (err) {
    console.error('Error setting staff session:', err);
  }
}
