import { CurriculumMcq } from './curriculum-mcqs-generator';
import { GRADE_9_MATH_MCQS_PART1 } from './grade9-math-mcqs-part1';
import { GRADE_9_MATH_MCQS_PART2 } from './grade9-math-mcqs-part2';

// Combined 180 Grade 9 Mathematics MCQs (10 questions x 18 lessons)
export const ALL_GRADE_9_MATH_MCQS: CurriculumMcq[] = [
  ...GRADE_9_MATH_MCQS_PART1,
  ...GRADE_9_MATH_MCQS_PART2,
];

// Lookup 10 MCQs for a specific Grade 9 Math lesson ('math-g9-1' to 'math-g9-18')
export function getGrade9MathMcqsForLesson(lessonId: string): CurriculumMcq[] {
  return ALL_GRADE_9_MATH_MCQS.filter((q) => q.lessonId === lessonId).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
}

// Check if a lesson belongs to Grade 9 Math
export function isGrade9MathLesson(lessonId: string): boolean {
  return /^math-g9-(?:[1-9]|1[0-8])$/.test(lessonId);
}
