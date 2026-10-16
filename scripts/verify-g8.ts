import { getLessonsBySubjectAndGrade } from '../src/lib/curriculum-data';
import { generate10McqsForLesson } from '../src/lib/curriculum-mcqs-generator';

const g8Lessons = getLessonsBySubjectAndGrade('math', 8);
console.log('Total Grade 8 Math lessons:', g8Lessons.length);

let totalMcqs = 0;
let totalImages = 0;
let errors = 0;

for (let i = 0; i < g8Lessons.length; i++) {
  const lesson = g8Lessons[i];
  const mcqs = generate10McqsForLesson(lesson);
  totalMcqs += mcqs.length;

  const withImages = mcqs.filter((q) => !!q.questionImageUrl);
  totalImages += withImages.length;

  console.log(`${i + 1}. [${lesson.id}] "${lesson.titleKm}" / "${lesson.titleEn}"`);
  console.log(`   - MCQs count: ${mcqs.length}, Images: ${withImages.length}`);

  if (mcqs.length !== 10) {
    console.error(`   ERROR: Expected 10 MCQs, got ${mcqs.length}`);
    errors++;
  }

  mcqs.forEach((q, qIdx) => {
    // Check 4 options
    const activeKm = q.optionsKm.filter((opt) => opt !== '');
    const activeEn = q.optionsEn.filter((opt) => opt !== '');
    if (activeKm.length !== 4 || activeEn.length !== 4) {
      console.error(`   ERROR in ${q.id} (Q${qIdx + 1}): expected 4 active options, got KM=${activeKm.length}, EN=${activeEn.length}`);
      errors++;
    }
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      console.error(`   ERROR in ${q.id}: invalid correct answer "${q.correctAnswer}"`);
      errors++;
    }
    if (!q.explanationKm || !q.explanationEn) {
      console.error(`   ERROR in ${q.id}: missing explanation`);
      errors++;
    }
  });
}

console.log('\n=======================================');
console.log(`Total G8 Math MCQs: ${totalMcqs}`);
console.log(`Total G8 Questions with Visual Image: ${totalImages}`);
console.log(`Errors encountered: ${errors}`);
console.log('=======================================');
