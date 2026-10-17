'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Video,
} from 'lucide-react';
import Link from 'next/link';
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
import { LessonComments } from '@/components/lesson-comments';
import { LessonToolbar, useCanManageLessons } from '@/components/admin/LessonToolbar';
import { QuickAddLessonModal } from '@/components/quick-add-lesson-modal';
import { EditLessonModal } from '@/components/admin/EditLessonModal';
import { DeleteLessonConfirmDialog } from '@/components/admin/DeleteLessonConfirmDialog';

function parseGrade(val: string | null): GradeLevel {
  const num = val ? parseInt(val, 10) : 7;
  return num >= 7 && num <= 12 ? (num as GradeLevel) : 7;
}

function parseSubject(val: string | null): SubjectId {
  if (!val) return 'math';
  const s = val.toLowerCase();
  if (s in SUBJECTS) return s as SubjectId;
  return 'math';
}

function PracticeMcqContent() {
  const { t, isKhmer } = useLanguage();
  const searchParams = useSearchParams();

  const gradeParam = searchParams.get('grade') || '7';
  const subjectParam = searchParams.get('subject') || 'math';
  const lessonParam = searchParams.get('lesson') || searchParams.get('lessonId');

  // Dynamic filter state initialization from URL query parameters
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(() => parseSubject(subjectParam));
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(() => parseGrade(gradeParam));
  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => {
    const initSubj = parseSubject(subjectParam);
    const initGrade = parseGrade(gradeParam);
    const initialLessons = getLessonsBySubjectAndGrade(initSubj, initGrade);
    if (lessonParam && initialLessons.some((l) => l.id === lessonParam)) {
      return lessonParam;
    }
    return initialLessons[0]?.id || `${initSubj}-g${initGrade}-1`;
  });

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, McqChoice>>({});
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState<boolean>(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState<boolean>(false);

  // Strict RBAC: only true if user is authenticated staff with super_admin or matching subject_lead role
  const canManageLessons = useCanManageLessons(selectedSubject);

  // Sync state if URL query parameters change (e.g. browser navigation)
  useEffect(() => {
    const g = searchParams.get('grade');
    const s = searchParams.get('subject');
    const l = searchParams.get('lesson') || searchParams.get('lessonId');

    if (g) setSelectedGrade(parseGrade(g));
    if (s) setSelectedSubject(parseSubject(s));
    if (l) setSelectedLessonId(l);
  }, [searchParams]);

  useEffect(() => {
    const handleLessonsUpdate = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener('moeys-lessons-updated', handleLessonsUpdate);
    return () => {
      window.removeEventListener('moeys-lessons-updated', handleLessonsUpdate);
    };
  }, []);

  // Available lessons for current subject & grade
  const lessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(selectedSubject, selectedGrade);
  }, [selectedSubject, selectedGrade, refreshKey]);

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

  // Current Lesson
  const currentLesson = useMemo(() => {
    return lessons.find((l) => l.id === selectedLessonId) || lessons[0];
  }, [lessons, selectedLessonId]);

  // MCQs for this lesson
  const mcqs: CurriculumMcq[] = useMemo(() => {
    if (!currentLesson) return [];
    return getCurriculumMcqsForLesson(currentLesson.id);
  }, [currentLesson, refreshKey]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsQuizFinished(false);
  };

  const updateUrl = (subj: SubjectId, grade: GradeLevel, lessonId?: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('subject', subj);
      url.searchParams.set('grade', grade.toString());
      if (lessonId) {
        url.searchParams.set('lesson', lessonId);
      }
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleSubjectChange = (newSubject: SubjectId) => {
    setSelectedSubject(newSubject);
    resetQuiz();
    updateUrl(newSubject, selectedGrade);
  };

  const handleGradeChange = (newGrade: GradeLevel) => {
    setSelectedGrade(newGrade);
    resetQuiz();
    updateUrl(selectedSubject, newGrade);
  };

  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    resetQuiz();
    updateUrl(selectedSubject, selectedGrade, lessonId);
  };

  const handleAnswerSelected = (qIndex: number, choice: McqChoice) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: choice,
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / (mcqs.length || 10)) * 100);

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

          {/* Dynamic Filter Controls (Dropdowns & Buttons) */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {/* Direct Filter Dropdowns */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-3">
                <label
                  htmlFor="practice-grade-dropdown"
                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                >
                  {t('grade')} ({isKhmer ? 'កម្រិតថ្នាក់' : 'Grade Level'})
                </label>
                <select
                  id="practice-grade-dropdown"
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(Number(e.target.value) as GradeLevel)}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {t('grade')} {g} {g === 12 ? '(Bac II)' : g === 9 ? '(Diploma)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="practice-subject-dropdown"
                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                >
                  {isKhmer ? 'មុខវិជ្ជា' : 'Subject'} ({isKhmer ? 'Academic Discipline' : 'Subject'})
                </label>
                <select
                  id="practice-subject-dropdown"
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value as SubjectId)}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {(Object.keys(SUBJECTS) as SubjectId[]).map((subjKey) => {
                    const s = SUBJECTS[subjKey];
                    return (
                      <option key={subjKey} value={subjKey}>
                        {s.code} - {isKhmer ? s.nameKm : s.nameEn}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="sm:col-span-5 flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="practice-lesson-dropdown"
                    className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                  >
                    {t('selectLesson')} ({isKhmer ? 'មេរៀន' : 'Lesson'})
                  </label>
                  <select
                    id="practice-lesson-dropdown"
                    value={selectedLessonId}
                    onChange={(e) => handleLessonChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 truncate"
                  >
                    {lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strict Conditional Rendering: Quick-Add, Edit, and Delete controls */}
                {canManageLessons && (
                  <LessonToolbar
                    selectedLesson={currentLesson || null}
                    subject={selectedSubject}
                    grade={selectedGrade}
                    onAddClick={() => setIsQuickAddOpen(true)}
                    onEditClick={() => setIsEditLessonOpen(true)}
                    onDeleteClick={() => setIsDeleteLessonOpen(true)}
                  />
                )}
              </div>
            </div>

            {/* Subject Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(Object.keys(SUBJECTS) as SubjectId[]).map((subjKey) => {
                const s = SUBJECTS[subjKey];
                const isSelected = selectedSubject === subjKey;
                return (
                  <button
                    key={subjKey}
                    type="button"
                    onClick={() => handleSubjectChange(subjKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${
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

            {/* Grade Buttons & Quick Link to Video Hub */}
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
                      type="button"
                      onClick={() => handleGradeChange(g)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center border cursor-pointer ${
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

              <Link
                href={`/videos?subject=${selectedSubject}&grade=${selectedGrade}&lesson=${selectedLessonId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isKhmer ? 'ទស្សនាវីដេអូមេរៀននេះ' : 'Watch Video Lesson'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Practice Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {isQuizFinished ? (
          /* Quiz Results Card */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-xl shadow-amber-500/25 mb-6">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isKhmer ? 'លទ្ធផលនៃការធ្វើតេស្តចំណេះដឹង' : 'Quiz Assessment Completed!'}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              {isKhmer ? currentLesson?.titleKm : currentLesson?.titleEn} (
              {isKhmer ? currentSubjectMeta.nameKm : currentSubjectMeta.nameEn} - {t('grade')}{' '}
              {selectedGrade})
            </p>

            <div className="my-8 inline-block p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                {t('score')}
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl sm:text-6xl font-black text-blue-600 dark:text-blue-400">
                  {score}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-400">
                  / {mcqs.length}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 block">
                {Math.round((score / (mcqs.length || 10)) * 100)}% {isKhmer ? 'ពិន្ទុត្រឹមត្រូវ' : 'Accuracy'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetQuiz}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('retryQuiz')}</span>
              </button>

              <Link
                href={`/videos?subject=${selectedSubject}&grade=${selectedGrade}&lesson=${selectedLessonId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isKhmer ? 'ត្រឡប់ទៅវីដេអូ' : 'Back to Video Hub'}</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active 10-Question MCQ Quiz Flow */
          <div className="space-y-6">
            {/* Progress Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  <span>
                    {isKhmer ? currentSubjectMeta.nameKm : currentSubjectMeta.nameEn} • {t('grade')}{' '}
                    {selectedGrade}
                  </span>
                  <span>•</span>
                  <span>{currentLesson?.titleKm}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {t('question')} {currentQuestionIndex + 1} {t('of')} {mcqs.length}
                </h3>
              </div>

              {/* Progress Bar & Indicators */}
              <div className="flex items-center gap-3 w-full sm:w-48">
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                  {answeredCount}/{mcqs.length}
                </span>
              </div>
            </div>

            {/* Question Quick Jump Navigation Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {mcqs.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = userAnswers[idx] !== undefined;

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center border cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md border-blue-600 scale-105'
                        : isAnswered
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Active Question MCQ Card */}
            {currentQuestion && (
              <McqCard
                key={currentQuestion.id || currentQuestionIndex}
                questionNumber={currentQuestionIndex + 1}
                questionKm={currentQuestion.questionKm}
                questionEn={currentQuestion.questionEn}
                optionsKm={currentQuestion.optionsKm}
                optionsEn={currentQuestion.optionsEn}
                correctAnswer={currentQuestion.correctAnswer}
                hintKm={currentQuestion.hintKm}
                hintEn={currentQuestion.hintEn}
                explanationKm={currentQuestion.explanationKm}
                explanationEn={currentQuestion.explanationEn}
                questionImageUrl={currentQuestion.questionImageUrl}
                selectedOption={userAnswers[currentQuestionIndex]}
                onAnswerSelected={(isCorrect, choice) =>
                  handleAnswerSelected(currentQuestionIndex, choice)
                }
              />
            )}

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('previousQuestion')}</span>
              </button>

              {currentQuestionIndex < mcqs.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(mcqs.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{t('nextQuestion')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:from-teal-700 shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('finishQuiz')}</span>
                </button>
              )}
            </div>

            {/* Public Q&A / Comment Section */}
            <LessonComments
              lessonId={selectedLessonId}
              lessonTitleKm={currentLesson?.titleKm}
              lessonTitleEn={currentLesson?.titleEn}
            />
          </div>
        )}

        {/* Strict Conditional Rendering: Modals are only mounted if canManageLessons is true */}
        {canManageLessons && (
          <>
            <QuickAddLessonModal
              isOpen={isQuickAddOpen}
              onClose={() => setIsQuickAddOpen(false)}
              subject={selectedSubject}
              grade={selectedGrade}
              onLessonCreated={(newLesson) => {
                setSelectedLessonId(newLesson.id);
                setIsQuickAddOpen(false);
                setRefreshKey((k) => k + 1);
                resetQuiz();
                updateUrl(selectedSubject, selectedGrade, newLesson.id);
              }}
            />

            <EditLessonModal
              isOpen={isEditLessonOpen}
              onClose={() => setIsEditLessonOpen(false)}
              lesson={currentLesson || null}
              subject={selectedSubject}
              grade={selectedGrade}
              onLessonUpdated={(updatedLesson) => {
                setIsEditLessonOpen(false);
                setRefreshKey((k) => k + 1);
              }}
            />

            <DeleteLessonConfirmDialog
              isOpen={isDeleteLessonOpen}
              onClose={() => setIsDeleteLessonOpen(false)}
              lesson={currentLesson || null}
              subject={selectedSubject}
              grade={selectedGrade}
              onLessonDeleted={(deletedId) => {
                setIsDeleteLessonOpen(false);
                const remaining = lessons.filter((l) => l.id !== deletedId);
                const nextLessonId = remaining.length > 0 ? remaining[0].id : '';
                setSelectedLessonId(nextLessonId);
                resetQuiz();
                updateUrl(selectedSubject, selectedGrade, nextLessonId || undefined);
                setRefreshKey((k) => k + 1);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function PracticeLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse shadow-lg mb-4">
        <span className="text-white font-black text-xl">📝</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
        Loading MoEYS Practice Hub...
      </p>
    </div>
  );
}

export default function PracticeMcqPage() {
  return (
    <Suspense fallback={<PracticeLoadingFallback />}>
      <PracticeMcqContent />
    </Suspense>
  );
}
