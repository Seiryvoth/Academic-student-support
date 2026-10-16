import { CurriculumMcq } from './curriculum-mcqs-generator';
import { GRADE_11_MATH_MCQS_PART1 } from './grade11-math-mcqs-part1';
import { GRADE_11_MATH_MCQS_PART2 } from './grade11-math-mcqs-part2';

// Combined 280 Grade 11 Mathematics MCQs (10 questions x 28 lessons)
export const ALL_GRADE_11_MATH_MCQS: CurriculumMcq[] = [
  ...GRADE_11_MATH_MCQS_PART1,
  ...GRADE_11_MATH_MCQS_PART2,
];

// Lookup 10 MCQs for a specific Grade 11 Math lesson ('math-g11-1' to 'math-g11-28')
export function getGrade11MathMcqsForLesson(lessonId: string): CurriculumMcq[] {
  return ALL_GRADE_11_MATH_MCQS.filter((q) => q.lessonId === lessonId).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
}

// Check if a lesson belongs to Grade 11 Math (1 to 28)
export function isGrade11MathLesson(lessonId: string): boolean {
  return /^math-g11-(?:[1-9]|1[0-9]|2[0-8])$/.test(lessonId);
}
