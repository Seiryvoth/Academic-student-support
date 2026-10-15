'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Video,
  FileText,
  Download,
  Eye,
  Filter,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SUBJECTS, SubjectId, GradeLevel, GRADES, getLessonsBySubjectAndGrade, LessonItem } from '@/lib/curriculum-data';
import { getStoredVideos, VideoResourceItem } from '@/lib/data-store';
import { parseYouTubeUrl, parsePdfUrl } from '@/lib/storage-utils';
import { useLanguage } from '@/context/language-context';
import { McqCard } from '@/components/mcq-card';
import { PdfViewerModal } from '@/components/pdf-viewer-modal';
import { LatexRenderer } from '@/components/latex-renderer';
import { LessonComments } from '@/components/lesson-comments';

export default function VideoLessonsPage() {
  const { t, isKhmer } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(12);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('math-g12-1');
  const [activeVideo, setActiveVideo] = useState<VideoResourceItem | null>(null);
  const [allVideos, setAllVideos] = useState<VideoResourceItem[]>([]);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);

  // Load videos from store and listen for edits
  useEffect(() => {
    const loadVideos = () => {
      const list = getStoredVideos();
      setAllVideos(list);
    };
    loadVideos();

    window.addEventListener('storage', loadVideos);
    return () => window.removeEventListener('storage', loadVideos);
  }, []);

  // Lessons for current subject & grade
  const availableLessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(selectedSubject, selectedGrade);
  }, [selectedSubject, selectedGrade]);

  // Update selectedLessonId if current is not in the list
  useEffect(() => {
    if (availableLessons.length > 0) {
      const exists = availableLessons.find((l) => l.id === selectedLessonId);
      if (!exists) {
        setSelectedLessonId(availableLessons[0].id);
      }
    }
  }, [availableLessons, selectedLessonId]);

  // Find videos matching the filters
  const filteredVideos = useMemo(() => {
    return allVideos.filter(
      (v) => v.subject === selectedSubject && v.grade === selectedGrade
    );
  }, [allVideos, selectedSubject, selectedGrade]);

  // Set active video whenever filteredVideos or selectedLessonId changes
  useEffect(() => {
    if (filteredVideos.length > 0) {
      const matched = filteredVideos.find((v) => v.lessonId === selectedLessonId);
      setActiveVideo(matched || filteredVideos[0]);
    } else {
      // Create a fallback video object if none uploaded yet so students always have a video lesson to watch
      const curLesson = availableLessons.find((l) => l.id === selectedLessonId) || availableLessons[0];
      if (curLesson) {
        setActiveVideo({
          id: `demo-${curLesson.id}`,
          lessonId: curLesson.id,
          subject: curLesson.subject,
          grade: curLesson.grade,
          titleKm: `${curLesson.titleKm} (វីដេអូបង្រៀនគំរូ MoEYS)`,
          titleEn: `${curLesson.titleEn} (MoEYS Demonstration Lecture)`,
          descriptionKm: curLesson.descriptionKm,
          descriptionEn: curLesson.descriptionEn,
          youtubeUrl: 'https://www.youtube.com/watch?v=5PcpBw5Hbwo',
          youtubeVideoId: '5PcpBw5Hbwo',
          pdfUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view',
          pdfSourceType: 'gdrive',
          createdAt: '2026-02-15T00:00:00Z',
          videoMcqs: [
            {
              id: 'demo-vmcq-1',
              questionNumber: 1,
              questionKm: `យោងតាមមេរៀន «${curLesson.titleKm}» តើចំណុចណាជាគោលគំនិតចម្បង?`,
              questionEn: `According to the lecture "${curLesson.titleEn}", what is the fundamental concept?`,
              optionsKm: [
                'ការចងចាំរូបមន្តដោយមិនចាំបាច់យល់ន័យ',
                'ការស្វែងយល់ទ្រឹស្តីមូលដ្ឋាន និងការអនុវត្តដោះស្រាយលំហាត់ជាក់ស្តែង',
                'ការរំលងជំហានគណនាក្នុងវិញ្ញាសា',
                'ការប្រើប្រាស់ម៉ាស៊ីនគិតលេខដោយគ្មានការផ្ទៀងផ្ទាត់',
                'ការមិនចាំបាច់អនុវត្តលំហាត់បន្ថែម',
              ],
              optionsEn: [
                'Memorizing formulas blindly without understanding principles',
                'Understanding foundational concepts and applying step-by-step solutions',
                'Skipping calculation steps during examinations',
                'Solely relying on calculators without manual derivation',
                'Avoiding independent practice exercises',
              ],
              correctAnswer: 'B',
              hintKm: 'ការយល់ដឹងពីទ្រឹស្តី និងការអនុវត្តជាក់ស្តែង គឺជាគន្លឹះនៃភាពជោគជ័យ។',
              hintEn: 'Understanding theory and consistent problem solving are essential.',
              explanationKm: 'ក្នុងកម្មវិធីសិក្សា MoEYS ការយល់ដឹងពីទ្រឹស្តី និងការអនុវត្តដោះស្រាយលំហាត់ជាក់ស្តែង គឺជាមូលដ្ឋានគ្រឹះដ៏រឹងមាំបំផុត។ ចម្លើយត្រឹមត្រូវគឺ B។',
              explanationEn: 'Under MoEYS curriculum, conceptual understanding combined with structured problem solving builds mastery. Choice B is correct.',
            },
          ],
        });
      }
    }
  }, [filteredVideos, selectedLessonId, availableLessons]);

  const currentSubjectMeta = SUBJECTS[selectedSubject];
  const parsedActiveVideo = activeVideo ? parseYouTubeUrl(activeVideo.youtubeUrl) : null;
  const parsedPdf = activeVideo?.pdfUrl ? parsePdfUrl(activeVideo.pdfUrl, activeVideo.titleKm) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-50/70 to-transparent dark:from-blue-950/20 dark:to-transparent border-b border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2">
                <Video className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'មជ្ឈមណ្ឌលមេរៀនវីដេអូ និងឯកសារ PDF' : 'Video & PDF Learning Hub'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {isKhmer ? '🎬 មេរៀនវីដេអូ និងលំហាត់ស្ទង់ការយល់ដឹង' : '🎬 Video Lessons & Comprehension Quizzes'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isKhmer
                  ? 'ទស្សនាវីដេអូពន្យល់ពីលោកគ្រូ-អ្នកគ្រូ ទាញយកសៀវភៅជំនួយស្មារតី PDF និងធ្វើលំហាត់ MCQ ភ្លាមៗ'
                  : 'Watch verified teacher explanations, download Google Drive PDF handouts, and test understanding immediately.'}
              </p>
            </div>

            {/* Public Student Access Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t('freeStudentAccess')}
              </span>
            </div>
          </div>

          {/* Interactive Filters (Subject & Grade) */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Subject Selector (5 Subjects) */}
            <div className="md:col-span-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(Object.keys(SUBJECTS) as SubjectId[]).map((subjKey) => {
                const s = SUBJECTS[subjKey];
                const isSelected = selectedSubject === subjKey;
                return (
                  <button
                    key={subjKey}
                    onClick={() => setSelectedSubject(subjKey)}
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

            {/* 2. Grade Selector (Grades 7 to 12) */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex-shrink-0">
                {t('grade')}:
              </span>
              {GRADES.map((g) => {
                const isSelected = selectedGrade === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
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
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video Player, PDF Download, and System B Video MCQs */}
          <div className="lg:col-span-8 space-y-6">
            {activeVideo ? (
              <>
                {/* 16:9 Responsive YouTube Video Player */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="relative aspect-video w-full bg-black">
                    {parsedActiveVideo?.isValid ? (
                      <iframe
                        src={parsedActiveVideo.embedUrl || ''}
                        title={isKhmer ? activeVideo.titleKm : activeVideo.titleEn}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <Video className="w-12 h-12 mb-3 opacity-40" />
                        <p className="text-sm">
                          {isKhmer ? 'មិនមានតំណភ្ជាប់វីដេអូ YouTube ត្រឹមត្រូវ' : 'No valid YouTube video URL found'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Video Metadata & Actions Bar */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${currentSubjectMeta.badgeBg} ${currentSubjectMeta.badgeText}`}>
                            {isKhmer ? currentSubjectMeta.nameKm : currentSubjectMeta.nameEn}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {t('grade')} {activeVideo.grade}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                          {isKhmer ? activeVideo.titleKm : activeVideo.titleEn}
                        </h2>
                      </div>

                      {/* PDF Handout Buttons (Dual Action: Preview Modal & Direct Download) */}
                      {activeVideo.pdfUrl && parsedPdf && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Preview PDF */}
                          <button
                            onClick={() => setPdfModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>{t('previewHandout')}</span>
                          </button>

                          {/* Direct Download PDF */}
                          <a
                            href={parsedPdf.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all active:scale-95"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t('downloadHandout')}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      <LatexRenderer
                        content={isKhmer ? activeVideo.descriptionKm : activeVideo.descriptionEn}
                      />
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* SYSTEM B: VIDEO-ATTACHED COMPREHENSION MCQs                    */}
                {/* ============================================================== */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span>{t('videoComprehensionQuiz')}</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('videoQuizSubtitle')}
                      </p>
                    </div>
                    {activeVideo.videoMcqs && activeVideo.videoMcqs.length > 0 && (
                      <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800">
                        {activeVideo.videoMcqs.length} {t('question')}s
                      </span>
                    )}
                  </div>

                  {activeVideo.videoMcqs && activeVideo.videoMcqs.length > 0 ? (
                    <div className="space-y-4">
                      {activeVideo.videoMcqs.map((mcq, idx) => (
                        <McqCard
                          key={mcq.id || idx}
                          questionNumber={mcq.questionNumber || idx + 1}
                          questionKm={mcq.questionKm}
                          questionEn={mcq.questionEn}
                          optionsKm={mcq.optionsKm}
                          optionsEn={mcq.optionsEn}
                          correctAnswer={mcq.correctAnswer}
                          hintKm={mcq.hintKm}
                          hintEn={mcq.hintEn}
                          explanationKm={mcq.explanationKm}
                          explanationEn={mcq.explanationEn}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('noVideoQuizYet')}
                      </p>
                    </div>
                  )}
                </div>

                {/* ============================================================== */}
                {/* PUBLIC Q&A / COMMENT SECTION (GUEST-FRIENDLY & TEACHER BADGES) */}
                {/* ============================================================== */}
                <LessonComments
                  lessonId={selectedLessonId}
                  lessonTitleKm={activeVideo?.titleKm}
                  lessonTitleEn={activeVideo?.titleEn}
                />
              </>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Video className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  {isKhmer ? 'សូមជ្រើសរើសមេរៀនដើម្បីទស្សនាវីដេអូ' : 'Please select a lesson to watch the video'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: MoEYS Curriculum Lesson Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {t('lessons')} ({availableLessons.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {t('grade')} {selectedGrade}
                </span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {availableLessons.map((lesson) => {
                  const isSelected = selectedLessonId === lesson.id;
                  const hasVideo = allVideos.some((v) => v.lessonId === lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {lesson.orderIndex}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {isKhmer ? lesson.titleKm : lesson.titleEn}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {isKhmer ? lesson.descriptionKm : lesson.descriptionEn}
                        </p>
                      </div>

                      {hasVideo && (
                        <span className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
                          <Video className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {activeVideo && parsedPdf && (
        <PdfViewerModal
          isOpen={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          pdfUrl={activeVideo.pdfUrl}
          title={isKhmer ? activeVideo.titleKm : activeVideo.titleEn}
        />
      )}
    </div>
  );
}
