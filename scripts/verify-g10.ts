import { getLessonsBySubjectAndGrade } from '../src/lib/curriculum-data';
import { ALL_GRADE_10_MATH_MCQS, getGrade10MathMcqsForLesson, isGrade10MathLesson } from '../src/lib/grade10-math-mcqs';
import { generate10McqsForLesson } from '../src/lib/curriculum-mcqs-generator';

console.log('--- VERIFYING GRADE 10 MATHEMATICS IMPLEMENTATION ---');

// 1. Verify lessons in curriculum-data
const g10Lessons = getLessonsBySubjectAndGrade('math', 10);
console.log(`Found ${g10Lessons.length} Grade 10 Math lessons (Expected: 26).`);
if (g10Lessons.length !== 26) {
  throw new Error(`Expected 26 lessons, got ${g10Lessons.length}`);
}

const expectedTitlesKm = [
  'ពហុធា',
  'ប្រមាណវិធីចែកពហុធា',
  'តក្កវិទ្យា',
  'សំណុំ',
  'ចំនួន',
  'សមីការដឺក្រេទី ២ មានមួយអញ្ញាត',
  'សមីការអសនិទាននិងសមីការដឺក្រេលំដាប់ខ្ពស់',
  'ប្រព័ន្ធសមីការ',
  'វិសមីការនិងប្រព័ន្ធវិសមីការ',
  'កូអរដោនេនៃចំណុច',
  'សមីការបន្ទាត់',
  'សមីការរង្វង់',
  'ការដោះស្រាយវិសមីការតាមក្រាប',
  'ផលធៀបត្រីកោណមាត្រ',
  'ការអនុវត្តផលធៀបត្រីកោណ',
  'អនុគមន៍និងក្រាបអនុគមន៍',
  'អនុគមន៍ដឺក្រេទី ២',
  'អនុគមន៍សនិទាននិងអសនិទាន',
  'បំណែងចែកប្រេកង់និងការតាងក្រាប',
  'រង្វាស់ទីតាំង',
  'វ៉ិចទ័រនិងប្រមាណវិធីលើវ៉ិចទ័រ',
  'ការអនុវត្តវ៉ិចទ័រ',
  'ការបំប្លែងកិល',
  'ការបំប្លែងឆ្លុះ',
  'ការបំប្លែងវិល',
  'ការបំប្លែងចាំង',
];

g10Lessons.forEach((l, idx) => {
  const expectedId = `math-g10-${idx + 1}`;
  if (l.id !== expectedId) {
    throw new Error(`Lesson ${idx + 1} ID mismatch: expected ${expectedId}, got ${l.id}`);
  }
  if (l.titleKm !== expectedTitlesKm[idx]) {
    throw new Error(`Lesson ${idx + 1} Title mismatch: expected "${expectedTitlesKm[idx]}", got "${l.titleKm}"`);
  }
  if (/^មេរៀនទី/i.test(l.titleKm) || /^Lesson/i.test(l.titleEn)) {
    throw new Error(`Lesson ${l.id} contains prefix in title: ${l.titleKm} / ${l.titleEn}`);
  }
  if (!isGrade10MathLesson(l.id)) {
    throw new Error(`isGrade10MathLesson failed for ${l.id}`);
  }
});
console.log('✓ All 26 Grade 10 lessons match official index titles with clean naming.');

// 2. Verify ALL_GRADE_10_MATH_MCQS count
console.log(`Total Grade 10 Math MCQs in master array: ${ALL_GRADE_10_MATH_MCQS.length} (Expected: 260)`);
if (ALL_GRADE_10_MATH_MCQS.length !== 260) {
  throw new Error(`Expected 260 MCQs, got ${ALL_GRADE_10_MATH_MCQS.length}`);
}

// 3. Verify each lesson's questions via generator and lookup
let visualCount = 0;
for (const lesson of g10Lessons) {
  const lookupQuestions = getGrade10MathMcqsForLesson(lesson.id);
  const genQuestions = generate10McqsForLesson(lesson);

  if (lookupQuestions.length !== 10) {
    throw new Error(`Lesson ${lesson.id} lookup returned ${lookupQuestions.length} questions, expected 10`);
  }
  if (genQuestions.length !== 10) {
    throw new Error(`Lesson ${lesson.id} generator returned ${genQuestions.length} questions, expected 10`);
  }

  lookupQuestions.forEach((q, qIdx) => {
    if (q.questionNumber !== qIdx + 1) {
      throw new Error(`${q.id} has questionNumber ${q.questionNumber}, expected ${qIdx + 1}`);
    }
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      throw new Error(`${q.id} has invalid correctAnswer: ${q.correctAnswer}`);
    }
    if (q.optionsKm.length < 4 || q.optionsEn.length < 4) {
      throw new Error(`${q.id} does not have at least 4 options`);
    }
    if (!q.questionKm || !q.questionEn) {
      throw new Error(`${q.id} missing bilingual question text`);
    }
    if (!q.explanationKm || !q.explanationEn) {
      throw new Error(`${q.id} missing bilingual explanation`);
    }
    if (!q.hintKm || !q.hintEn) {
      throw new Error(`${q.id} missing bilingual hint`);
    }
    if (q.questionImageUrl) {
      visualCount++;
      if (!q.questionImageUrl.startsWith('data:image/svg+xml')) {
        throw new Error(`${q.id} has invalid questionImageUrl format`);
      }
    }
  });
}

console.log(`✓ All 26 lessons have exactly 10 fully formed bilingual MCQs.`);
console.log(`✓ Detected ${visualCount} visual MCQs with embedded SVG Data URIs across geometric, coordinate, function, trigonometry, statistics, vector, and transformation lessons.`);
console.log('--- GRADE 10 VERIFICATION COMPLETED SUCCESSFULLY ---');
