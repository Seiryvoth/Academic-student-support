import { CurriculumMcq } from './curriculum-mcqs-generator';
import { GRADE_10_MATH_MCQS_PART1 } from './grade10-math-mcqs-part1';
import { GRADE_10_MATH_MCQS_PART2 } from './grade10-math-mcqs-part2';

// Combined 260 Grade 10 Mathematics MCQs (10 questions x 26 lessons)
export const ALL_GRADE_10_MATH_MCQS: CurriculumMcq[] = [
  ...GRADE_10_MATH_MCQS_PART1,
  ...GRADE_10_MATH_MCQS_PART2,
];

// Lookup 10 MCQs for a specific Grade 10 Math lesson ('math-g10-1' to 'math-g10-26')
export function getGrade10MathMcqsForLesson(lessonId: string): CurriculumMcq[] {
  return ALL_GRADE_10_MATH_MCQS.filter((q) => q.lessonId === lessonId).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
}

// Check if a lesson belongs to Grade 10 Math (1 to 26)
export function isGrade10MathLesson(lessonId: string): boolean {
  return /^math-g10-(?:[1-9]|1[0-9]|2[0-6])$/.test(lessonId);
}
