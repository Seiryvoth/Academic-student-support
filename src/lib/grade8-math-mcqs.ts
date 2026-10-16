import { CurriculumMcq } from './curriculum-mcqs-generator';
import { GRADE_8_MATH_MCQS_PART1 } from './grade8-math-mcqs-part1';
import { GRADE_8_MATH_MCQS_PART2 } from './grade8-math-mcqs-part2';

// Combined 180 Grade 8 Mathematics MCQs (10 questions x 18 lessons)
export const ALL_GRADE_8_MATH_MCQS: CurriculumMcq[] = [
  ...GRADE_8_MATH_MCQS_PART1,
  ...GRADE_8_MATH_MCQS_PART2,
];

// Lookup 10 MCQs for a specific Grade 8 Math lesson ('math-g8-1' to 'math-g8-18')
export function getGrade8MathMcqsForLesson(lessonId: string): CurriculumMcq[] {
  return ALL_GRADE_8_MATH_MCQS.filter((q) => q.lessonId === lessonId).sort(
    (a, b) => a.questionNumber - b.questionNumber
  );
}

// Check if a lesson belongs to Grade 8 Math
export function isGrade8MathLesson(lessonId: string): boolean {
  return /^math-g8-(?:[1-9]|1[0-8])$/.test(lessonId);
}
