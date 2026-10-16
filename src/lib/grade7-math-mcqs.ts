import { CurriculumMcq } from './curriculum-mcqs-generator';
import { GRADE_7_MATH_MCQS_PART1 } from './grade7-math-mcqs-part1';
import { GRADE_7_MATH_MCQS_PART2 } from './grade7-math-mcqs-part2';

// Combined 220 Grade 7 Mathematics MCQs (10 questions x 22 lessons)
export const ALL_GRADE_7_MATH_MCQS: CurriculumMcq[] = [
  ...GRADE_7_MATH_MCQS_PART1,
  ...GRADE_7_MATH_MCQS_PART2,
];

// Lookup 10 MCQs for a specific Grade 7 Math lesson ('math-g7-1' to 'math-g7-22')
export function getGrade7MathMcqsForLesson(lessonId: string): CurriculumMcq[] {
  return ALL_GRADE_7_MATH_MCQS.filter((q) => q.lessonId === lessonId).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
}

// Check if a lesson belongs to Grade 7 Math (1 to 22)
export function isGrade7MathLesson(lessonId: string): boolean {
  return /^math-g7-(?:[1-9]|1[0-9]|2[0-2])$/.test(lessonId);
}

