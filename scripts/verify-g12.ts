import { getLessonsBySubjectAndGrade } from '../src/lib/curriculum-data';
import {
  ALL_GRADE_12_MATH_MCQS,
  getGrade12MathMcqsForLesson,
  isGrade12MathLesson,
} from '../src/lib/grade12-math-mcqs';
import { generate10McqsForLesson } from '../src/lib/curriculum-mcqs-generator';

const EXPECTED_LESSON_TITLES = [
  { order: 1, km: 'ចំនួនកុំផ្លិចទម្រង់ពីជគណិត', en: 'Complex Numbers in Algebraic Form' },
  { order: 2, km: 'ចំនួនកុំផ្លិចទម្រង់ត្រីកោណមាត្រ', en: 'Complex Numbers in Trigonometric Form' },
  { order: 3, km: 'ស្វ័យគុណទី n និងឫសទី n នៃចំនួនកុំផ្លិច', en: 'nth Powers and nth Roots of Complex Numbers' },
  { order: 4, km: 'លីមីតនៃអនុគមន៍', en: 'Limits of Functions' },
  { order: 5, km: 'ភាពជាប់នៃអនុគមន៍', en: 'Continuity of Functions' },
  { order: 6, km: 'ដេរីវេនៃអនុគមន៍', en: 'Derivatives of Functions' },
  { order: 7, km: 'អនុវត្តន៍នៃដេរីវេ', en: 'Applications of Derivatives' },
  { order: 8, km: 'អនុវត្តន៍ផ្សេងទៀតនៃដេរីវេ', en: 'Other Applications of Derivatives' },
  { order: 9, km: 'សិក្សាអថេរភាពនិងសង់ក្រាបនៃអនុគមន៍សនិទាន', en: 'Variation and Graphs of Rational Functions' },
  { order: 10, km: 'សិក្សាអថេរភាពនិងសង់ក្រាបនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល', en: 'Variation and Graphs of Exponential Functions' },
  { order: 11, km: 'សិក្សាអថេរភាពនិងសង់ក្រាបនៃអនុគមន៍លោការីត', en: 'Variation and Graphs of Logarithmic Functions' },
  { order: 12, km: 'វ៉ិចទ័រក្នុងលំហ', en: 'Vectors in Space' },
  { order: 13, km: 'ផលគុណនៃពីរវ៉ិចទ័រក្នុងលំហ', en: 'Product of Two Vectors in Space' },
  { order: 14, km: 'អនុវត្តន៍នៃផលគុណវ៉ិចទ័រ', en: 'Applications of Vector Products' },
  { order: 15, km: 'ព្រីមីទីវនិងអាំងតេក្រាលមិនកំណត់', en: 'Primitives and Indefinite Integrals' },
  { order: 16, km: 'អាំងតេក្រាលកំណត់', en: 'Definite Integrals' },
  { order: 17, km: 'ផ្ទៃក្រឡានៃផ្ទៃកម្រាល', en: 'Area of Plane Regions' },
  { order: 18, km: 'មាឌសូលីតនិងប្រវែងធ្នូ', en: 'Volume of Solids and Arc Length' },
  { order: 19, km: 'សមីការឌីផេរ៉ង់ស្យែលលីនេអ៊ែរលំដាប់ទី 1', en: 'First-Order Linear Differential Equations' },
  { order: 20, km: 'សមីការឌីផេរ៉ង់ស្យែលលីនេអ៊ែរលំដាប់ទី 2', en: 'Second-Order Linear Differential Equations' },
  { order: 21, km: 'ប្រូបាបមានលក្ខខណ្ឌ', en: 'Conditional Probability' },
  { order: 22, km: 'ទ្រឹស្តីបទប៊ែយេស', en: 'Bayes\' Theorem' },
  { order: 23, km: 'ស្ថិតិមានពីរអថេរ', en: 'Two-Variable Statistics' },
  { order: 24, km: 'សមីការបន្ទាត់តម្រែតម្រង់លីនេអ៊ែរ', en: 'Linear Regression Equations' },
  { order: 25, km: 'ប៉ារ៉ាបូល', en: 'Parabolas' },
  { order: 26, km: 'អេលីប', en: 'Ellipses' },
  { order: 27, km: 'អ៊ីពែបូល', en: 'Hyperbolas' },
];

function runVerification() {
  console.log('=== VERIFYING GRADE 12 MATHEMATICS CURRICULUM & MCQS ===\n');

  let passed = true;

  // 1. Verify Curriculum Lessons
  const lessons = getLessonsBySubjectAndGrade('math', 12);
  console.log(`[1] Total Grade 12 Math Lessons retrieved: ${lessons.length} (Expected: 27)`);

  if (lessons.length !== 27) {
    console.error(`❌ Expected 27 lessons, got ${lessons.length}`);
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

    // Check no "មេរៀនទី" prefix in titleKm
    if (actual.titleKm.includes('មេរៀនទី')) {
      console.error(`❌ Lesson ${exp.order} contains "មេរៀនទី" prefix: "${actual.titleKm}"`);
      passed = false;
    }

    if (!actual.descriptionKm || actual.descriptionKm.length < 5) {
      console.error(`❌ Lesson ${exp.order} missing descriptionKm`);
      passed = false;
    }

    if (!actual.descriptionEn || actual.descriptionEn.length < 5) {
      console.error(`❌ Lesson ${exp.order} missing descriptionEn`);
      passed = false;
    }
  }

  if (passed) {
    console.log('✅ [1] All 27 Grade 12 Math Lessons verified with clean titles & bilingual metadata.');
  }

  // 2. Verify MCQs Count & Integrity
  console.log(`\n[2] Verifying MCQs integrity... Total loaded: ${ALL_GRADE_12_MATH_MCQS.length} (Expected: 270)`);

  if (ALL_GRADE_12_MATH_MCQS.length !== 270) {
    console.error(`❌ Expected exactly 270 MCQs, got ${ALL_GRADE_12_MATH_MCQS.length}`);
    passed = false;
  }

  const lessonsWithImages = new Set<string>();
  const validAnswers = new Set(['A', 'B', 'C', 'D']);
  const validDifficulties = new Set(['basic', 'medium', 'advanced']);

  for (let i = 1; i <= 27; i++) {
    const lessonId = `math-g12-${i}`;
    const mcqs = getGrade12MathMcqsForLesson(lessonId);

    if (mcqs.length !== 10) {
      console.error(`❌ Lesson ${lessonId} has ${mcqs.length} MCQs, expected 10!`);
      passed = false;
    }

    mcqs.forEach((q, idx) => {
      if (q.questionNumber !== idx + 1) {
        console.error(`❌ ${q.id} has questionNumber ${q.questionNumber}, expected ${idx + 1}`);
        passed = false;
      }

      if (!validDifficulties.has(q.difficulty)) {
        console.error(`❌ ${q.id} has invalid difficulty: "${q.difficulty}"`);
        passed = false;
      }

      if (!q.questionKm || q.questionKm.trim().length === 0) {
        console.error(`❌ ${q.id} missing questionKm`);
        passed = false;
      }

      if (!q.questionEn || q.questionEn.trim().length === 0) {
        console.error(`❌ ${q.id} missing questionEn`);
        passed = false;
      }

      if (!Array.isArray(q.optionsKm) || q.optionsKm.length < 4) {
        console.error(`❌ ${q.id} optionsKm invalid`);
        passed = false;
      }

      if (!Array.isArray(q.optionsEn) || q.optionsEn.length < 4) {
        console.error(`❌ ${q.id} optionsEn invalid`);
        passed = false;
      }

      if (!validAnswers.has(q.correctAnswer)) {
        console.error(`❌ ${q.id} invalid correctAnswer: "${q.correctAnswer}"`);
        passed = false;
      }

      if (!q.explanationKm || q.explanationKm.trim().length === 0) {
        console.error(`❌ ${q.id} missing explanationKm`);
        passed = false;
      }

      if (!q.explanationEn || q.explanationEn.trim().length === 0) {
        console.error(`❌ ${q.id} missing explanationEn`);
        passed = false;
      }

      if (q.questionImageUrl) {
        lessonsWithImages.add(lessonId);
        if (!q.questionImageUrl.startsWith('data:image/svg+xml')) {
          console.error(`❌ ${q.id} image URL is not a valid SVG data URI: ${q.questionImageUrl.slice(0, 30)}...`);
          passed = false;
        }
      }
    });
  }

  console.log(`✅ [2] 270 MCQs verified across all 27 lessons.`);
  console.log(`ℹ️ Lessons with image support (${lessonsWithImages.size}): ${Array.from(lessonsWithImages).join(', ')}`);

  // 3. Verify Generator integration
  console.log('\n[3] Verifying integration with curriculum-mcqs-generator...');
  for (const lesson of lessons) {
    const generated = generate10McqsForLesson(lesson);
    if (!generated || generated.length !== 10) {
      console.error(`❌ Generator returned ${generated?.length} MCQs for ${lesson.id}, expected 10!`);
      passed = false;
    }
  }

  // 4. Verify Regex Helper
  for (let i = 1; i <= 27; i++) {
    if (!isGrade12MathLesson(`math-g12-${i}`)) {
      console.error(`❌ isGrade12MathLesson failed for math-g12-${i}`);
      passed = false;
    }
  }
  if (isGrade12MathLesson('math-g12-0') || isGrade12MathLesson('math-g12-28')) {
    console.error(`❌ isGrade12MathLesson allowed out-of-range lesson`);
    passed = false;
  }

  console.log('✅ [3] Generator integration & lesson ID regex validated.');

  if (passed) {
    console.log('\n🎉 ALL GRADE 12 MATHEMATICS VERIFICATION CHECKS PASSED SUCCESSFULLY! 🎉');
    process.exit(0);
  } else {
    console.error('\n❌ VERIFICATION FAILED. Review errors above.');
    process.exit(1);
  }
}

runVerification();
