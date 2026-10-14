'use client';

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileQuestion,
  Filter,
  CheckCircle,
  Award,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  SUBJECTS,
  SubjectId,
  GradeLevel,
  GRADES,
  getLessonsBySubjectAndGrade,
  LessonItem,
} from '@/lib/curriculum-data';
import {
  getCurriculumMcqsForLesson,
  CurriculumMcq,
  McqChoice,
} from '@/lib/curriculum-mcqs-generator';
import { useLanguage } from '@/context/language-context';
import { McqCard } from '@/components/mcq-card';
import { LatexRenderer } from '@/components/latex-renderer';

export default function PracticeMcqPage() {
  const { t, isKhmer } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(12);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('math-g12-1');

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, McqChoice>>({});
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Available lessons for current subject & grade
  const lessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(selectedSubject, selectedGrade);
  }, [selectedSubject, selectedGrade]);

  // Ensure selectedLessonId is valid
  useEffect(() => {
    if (lessons.length > 0) {
      const exists = lessons.find((l) => l.id === selectedLessonId);
      if (!exists) {
        setSelectedLessonId(lessons[0].id);
        resetQuiz();
      }
    }
  }, [lessons, selectedLessonId]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const handleStorage = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Current Lesson
  const currentLesson = useMemo(() => {
    return lessons.find((l) => l.id === selectedLessonId) || lessons[0];
  }, [lessons, selectedLessonId]);

  // Strictly 10 MCQs for this lesson
  const mcqs: CurriculumMcq[] = useMemo(() => {
    if (!currentLesson) return [];
    return getCurriculumMcqsForLesson(currentLesson.id);
  }, [currentLesson, refreshKey]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsQuizFinished(false);
  };

  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    resetQuiz();
  };

  const handleAnswerSelected = (qIndex: number, choice: McqChoice) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: choice,
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / 10) * 100);

  // Calculate score
  const score = useMemo(() => {
    let correct = 0;
    mcqs.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  }, [mcqs, userAnswers]);

  // Finish quiz & trigger confetti
  const handleFinishQuiz = () => {
    setIsQuizFinished(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const currentSubjectMeta = SUBJECTS[selectedSubject];
  const currentQuestion = mcqs[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-50/70 to-transparent dark:from-blue-950/20 dark:to-transparent border-b border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>{t('standardPracticeQuiz')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {isKhmer ? '📝 លំហាត់ពហុជ្រើសរើស (MCQ) ស្តង់ដារ ១០ សំណួរ' : '📝 Standard 10-MCQ Practice Hub'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('standardPracticeSubtitle')}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t('freeStudentAccess')}
              </span>
            </div>
          </div>

          {/* Interactive Filters: [Subject] -> [Grade] -> [Lesson Dropdown] */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {/* Subject Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(Object.keys(SUBJECTS) as SubjectId[]).map((subjKey) => {
                const s = SUBJECTS[subjKey];
                const isSelected = selectedSubject === subjKey;
                return (
                  <button
                    key={subjKey}
                    onClick={() => {
                      setSelectedSubject(subjKey);
                      resetQuiz();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                      isSelected
                        ? `bg-gradient-to-r ${s.gradient} text-white shadow-md border-transparent`
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{isKhmer ? s.nameKm : s.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Grade Buttons & Lesson Select */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex-shrink-0">
                  {t('grade')}:
                </span>
                {GRADES.map((g) => {
                  const isSelected = selectedGrade === g;
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGrade(g);
                        resetQuiz();
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md border-blue-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>

              {/* Lesson Dropdown */}
              <div className="flex-1 max-w-md">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('selectLesson')}:
                </label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => handleLessonChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Practice Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {isQuizFinished ? (
          /* ========================================================== */
          /* SCORE SUMMARY CARD AT THE END OF QUIZ                       */
          /* ========================================================== */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-500/25 mb-4">
              <Trophy className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1 block">
              {t('allTenQuestionsCompleted')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              {isKhmer ? currentLesson?.titleKm : currentLesson?.titleEn}
            </h2>

            {/* Score Ring */}
            <div className="my-6 inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400">
                {score} / 10
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {score >= 8
                  ? t('excellentScore')
                  : score >= 5
                  ? t('goodScore')
                  : t('needReviewScore')}
              </span>
            </div>

            {/* Question by question mini pills */}
            <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
              {mcqs.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswer;
                return (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center border ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {t('retryQuiz')}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* ACTIVE 10-MCQ QUIZ FLOW                                    */
          /* ========================================================== */
          <div className="space-y-6">
            {/* Top Status Bar: Question Progress & 1-10 Navigation Pills */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t('question')} {currentQuestionIndex + 1} {t('of')} 10
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {isKhmer ? currentLesson?.titleKm : currentLesson?.titleEn}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isKhmer ? 'បានឆ្លើយ' : 'Answered'}:
                  </span>
                  <span className="ml-1.5 text-sm font-bold text-blue-600 dark:text-blue-400">
                    {answeredCount}/10
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Direct Jump Pills (1 to 10) */}
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
                {mcqs.map((_, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isCorrect = isAnswered && userAnswers[idx] === mcqs[idx].correctAnswer;

                  let pillStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                  if (isCurrent) {
                    pillStyle = 'border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20';
                  } else if (isAnswered) {
                    pillStyle = isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${pillStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question MCQ Card */}
            {currentQuestion && (
              <McqCard
                key={currentQuestion.id}
                questionNumber={currentQuestion.questionNumber}
                difficulty={currentQuestion.difficulty}
                questionKm={currentQuestion.questionKm}
                questionEn={currentQuestion.questionEn}
                optionsKm={currentQuestion.optionsKm}
                optionsEn={currentQuestion.optionsEn}
                correctAnswer={currentQuestion.correctAnswer}
                hintKm={currentQuestion.hintKm}
                hintEn={currentQuestion.hintEn}
                explanationKm={currentQuestion.explanationKm}
                explanationEn={currentQuestion.explanationEn}
                selectedOption={userAnswers[currentQuestionIndex] || null}
                onAnswerSelected={(isCorrect, choice) =>
                  handleAnswerSelected(currentQuestionIndex, choice)
                }
              />
            )}

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('previousQuestion')}</span>
              </button>

              {currentQuestionIndex < 9 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(9, prev + 1))}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span>{t('nextQuestion')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('finishQuiz')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
