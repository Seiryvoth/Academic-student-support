import { CurriculumMcq } from './curriculum-mcqs-generator';
import { GRADE_12_MATH_MCQS_PART1 } from './grade12-math-mcqs-part1';
import { GRADE_12_MATH_MCQS_PART2 } from './grade12-math-mcqs-part2';

// Combined 270 Grade 12 Mathematics MCQs (10 questions x 27 lessons)
export const ALL_GRADE_12_MATH_MCQS: CurriculumMcq[] = [
  ...GRADE_12_MATH_MCQS_PART1,
  ...GRADE_12_MATH_MCQS_PART2,
];

// Lookup 10 MCQs for a specific Grade 12 Math lesson ('math-g12-1' to 'math-g12-27')
export function getGrade12MathMcqsForLesson(lessonId: string): CurriculumMcq[] {
  return ALL_GRADE_12_MATH_MCQS.filter((q) => q.lessonId === lessonId).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
}

// Check if a lesson belongs to Grade 12 Math (1 to 27)
export function isGrade12MathLesson(lessonId: string): boolean {
  return /^math-g12-(?:[1-9]|1[0-9]|2[0-7])$/.test(lessonId);
}
