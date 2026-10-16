import { getLessonsBySubjectAndGrade } from '../src/lib/curriculum-data';
import {
  ALL_GRADE_11_MATH_MCQS,
  getGrade11MathMcqsForLesson,
  isGrade11MathLesson,
} from '../src/lib/grade11-math-mcqs';
import { generate10McqsForLesson } from '../src/lib/curriculum-mcqs-generator';

const EXPECTED_LESSON_TITLES = [
  { order: 1, km: 'ស្វ៊ីតចំនួនពិត', en: 'Sequences of Real Numbers' },
  { order: 2, km: 'ស្វ៊ីតនព្វន្ត', en: 'Arithmetic Progressions' },
  { order: 3, km: 'ស្វ៊ីតធរណីមាត្រ', en: 'Geometric Progressions' },
  { order: 4, km: 'ផលបូកតួនៃស្វ៊ីតផ្សេងៗ', en: 'Sum of Terms of Various Sequences' },
  { order: 5, km: 'ទំនាក់ទំនងតួនៃស្វ៊ីត', en: 'Recurrence Relations of Sequences' },
  { order: 6, km: 'វិចារអនុមានរួមគណិតវិទ្យា', en: 'Mathematical Induction' },
  { order: 7, km: 'អនុគមន៍អិចស្ប៉ូណង់ស្យែល', en: 'Exponential Functions' },
  { order: 8, km: 'អនុគមន៍លោការីត', en: 'Logarithmic Functions' },
  { order: 9, km: 'អនុគមន៍ត្រីកោណមាត្រ', en: 'Trigonometric Functions' },
  { order: 10, km: 'រូបមន្តត្រីកោណមាត្រ', en: 'Trigonometric Formulas' },
  { order: 11, km: 'អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ', en: 'Inverse Trigonometric Functions' },
  { order: 12, km: 'សមីការនិងវិសមីការត្រីកោណមាត្រ', en: 'Trigonometric Equations and Inequalities' },
  { order: 13, km: 'សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត', en: 'Other Trigonometric Equations and Inequalities' },
  { order: 14, km: 'ម៉ាទ្រីស', en: 'Matrices' },
  { order: 15, km: 'ដេទែរមីណង់', en: 'Determinants' },
  { order: 16, km: 'ការបំប្លែងលីនេអ៊ែរ', en: 'Linear Transformations' },
  { order: 17, km: 'លីមីតនិងដេរីវេ', en: 'Limits and Derivatives' },
  { order: 18, km: 'អនុវត្តនៃដេរីវេ', en: 'Applications of Derivatives' },
  { order: 19, km: 'អថេរភាពនិងក្រាបនៃអនុគមន៍', en: 'Function Variation and Graphs' },
  { order: 20, km: 'អនុវត្តន៍ដេរីវេចំពោះសមីការនិងវិសមីការ', en: 'Applications of Derivatives to Equations and Inequalities' },
  { order: 21, km: 'ចម្លាស់', en: 'Permutations' },
  { order: 22, km: 'បន្សំ', en: 'Combinations' },
  { order: 23, km: 'ប្រូបាប', en: 'Probability' },
  { order: 24, km: 'រង្វាស់ទីតាំងនៃទិន្នន័យ', en: 'Measures of Position of Data' },
  { order: 25, km: 'រង្វាស់នៃគម្លាត', en: 'Measures of Dispersion' },
  { order: 26, km: 'រូបធរណីមាត្រក្នុងលំហ', en: 'Solid Geometry (Geometry in Space)' },
  { order: 27, km: 'បន្ទាត់និងប្លង់ស្របក្នុងលំហ', en: 'Parallel Lines and Planes in Space' },
  { order: 28, km: 'ភាពអរតូកូណាល់ក្នុងលំហ', en: 'Orthogonality in Space' },
];

function runVerification() {
  console.log('=== VERIFYING GRADE 11 MATHEMATICS CURRICULUM & MCQS ===\n');

  let passed = true;

  // 1. Verify Curriculum Lessons
  const lessons = getLessonsBySubjectAndGrade('math', 11);
  console.log(`[1] Total Grade 11 Math Lessons retrieved: ${lessons.length} (Expected: 28)`);

  if (lessons.length !== 28) {
    console.error(`❌ Expected 28 lessons, got ${lessons.length}`);
    passed = false;
  }

  for (let i = 0; i < EXPECTED_LESSON_TITLES.length; i++) {
    const exp = EXPECTED_LESSON_TITLES[i];
    const actual = lessons[i];
    if (!actual) {
      console.error(`❌ Missing lesson at index ${i + 1}`);
      passed = false;
      continue;
    }

    if (actual.titleKm !== exp.km) {
      console.error(`❌ Lesson ${exp.order} Khmer title mismatch. Expected "${exp.km}", got "${actual.titleKm}"`);
      passed = false;
    }

    if (actual.titleEn !== exp.en) {
      console.error(`❌ Lesson ${exp.order} English title mismatch. Expected "${exp.en}", got "${actual.titleEn}"`);
      passed = false;
    }

    if (actual.titleKm.includes('មេរៀនទី')) {
      console.error(`❌ Lesson ${exp.order} Khmer title contains forbidden prefix: "${actual.titleKm}"`);
      passed = false;
    }

    if (actual.id !== `math-g11-${exp.order}`) {
      console.error(`❌ Lesson ${exp.order} ID mismatch: Expected "math-g11-${exp.order}", got "${actual.id}"`);
      passed = false;
    }
  }

  if (passed) {
    console.log('✅ All 28 clean lesson titles matched perfectly without "មេរៀនទីX" prefix!\n');
  }

  // 2. Verify MCQs Count and Quality
  console.log(`[2] Total Grade 11 Math MCQs: ${ALL_GRADE_11_MATH_MCQS.length} (Expected: 280)`);
  if (ALL_GRADE_11_MATH_MCQS.length !== 280) {
    console.error(`❌ Expected 280 MCQs, got ${ALL_GRADE_11_MATH_MCQS.length}`);
    passed = false;
  }

  let visualCount = 0;

  for (let l = 1; l <= 28; l++) {
    const lessonId = `math-g11-${l}`;
    const mcqs = getGrade11MathMcqsForLesson(lessonId);

    if (mcqs.length !== 10) {
      console.error(`❌ Lesson ${lessonId} has ${mcqs.length} MCQs (Expected: 10)`);
      passed = false;
    }

    for (const q of mcqs) {
      if (q.grade !== 11 || q.subject !== 'math') {
        console.error(`❌ MCQ ${q.id} has incorrect grade or subject`);
        passed = false;
      }

      if (!q.questionKm || !q.questionEn) {
        console.error(`❌ MCQ ${q.id} missing bilingual question text`);
        passed = false;
      }

      if (!Array.isArray(q.optionsKm) || q.optionsKm.length !== 5 || !Array.isArray(q.optionsEn) || q.optionsEn.length !== 5) {
        console.error(`❌ MCQ ${q.id} invalid options structure (Must be 5-element array [A, B, C, D, ''])`);
        passed = false;
      }

      if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
        console.error(`❌ MCQ ${q.id} invalid correct answer key: ${q.correctAnswer}`);
        passed = false;
      }

      if (!q.hintKm || !q.hintEn || !q.explanationKm || !q.explanationEn) {
        console.error(`❌ MCQ ${q.id} missing hints or explanations`);
        passed = false;
      }

      if (q.questionImageUrl && q.questionImageUrl.startsWith('data:image/svg+xml')) {
        visualCount++;
      }
    }
  }

  console.log(`✅ All 280 MCQs validated (10 questions per lesson across all 28 lessons).`);
  console.log(`✅ Visual diagram attachments verified: ${visualCount} visual MCQs with SVG Data URIs.\n`);

  // 3. Verify Generator Integration
  console.log('[3] Testing curriculum-mcqs-generator dispatch:');
  for (const l of lessons) {
    const generated = generate10McqsForLesson(l);
    if (!generated || generated.length !== 10) {
      console.error(`❌ Generator returned invalid MCQs for lesson ${l.id}`);
      passed = false;
    }
  }
  console.log('✅ Generator dispatched dedicated Grade 11 questions for all 28 lessons.\n');

  // 4. Verify helper regex
  console.log('[4] Testing isGrade11MathLesson:');
  if (!isGrade11MathLesson('math-g11-1') || !isGrade11MathLesson('math-g11-28')) {
    console.error('❌ isGrade11MathLesson failed for valid boundaries');
    passed = false;
  }
  if (isGrade11MathLesson('math-g11-0') || isGrade11MathLesson('math-g11-29') || isGrade11MathLesson('phys-g11-1')) {
    console.error('❌ isGrade11MathLesson erroneously matched out-of-bounds IDs');
    passed = false;
  }
  console.log('✅ isGrade11MathLesson boundary checks passed.\n');

  if (passed) {
    console.log('🎉 ALL CHECKS PASSED SUCCESSFULLY! GRADE 11 MATHEMATICS IS FULLY READY.');
  } else {
    console.error('❌ SOME CHECKS FAILED! Please review errors above.');
    process.exit(1);
  }
}

runVerification();
