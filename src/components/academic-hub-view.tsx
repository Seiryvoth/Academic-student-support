'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  ChevronLeft,
  Sparkles,
  ListMusic,
  Play,
  Plus,
  FileQuestion,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  SUBJECTS,
  SubjectId,
  GradeLevel,
  GRADES,
  getLessonsBySubjectAndGrade,
  LessonItem,
} from '@/lib/curriculum-data';
import { getStoredVideos, VideoResourceItem } from '@/lib/data-store';
import { parseYouTubeUrl, parsePdfUrl } from '@/lib/storage-utils';
import { useLanguage } from '@/context/language-context';
import { McqCard } from '@/components/mcq-card';
import { PdfViewerModal } from '@/components/pdf-viewer-modal';
import { LatexRenderer } from '@/components/latex-renderer';
import { LessonComments } from '@/components/lesson-comments';
import { QuickAddLessonModal } from '@/components/quick-add-lesson-modal';
import { LessonToolbar, useCanManageLessons } from '@/components/admin/LessonToolbar';
import { EditLessonModal } from '@/components/admin/EditLessonModal';
import { DeleteLessonConfirmDialog } from '@/components/admin/DeleteLessonConfirmDialog';
import {
  getAttachmentsByVideo,
  getUnifiedMcqsByVideo,
  VideoAttachmentRecord,
  CMS_SYNC_EVENT,
} from '@/lib/cms-unified-store';

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

export function AcademicHubView() {
  const { t, isKhmer } = useLanguage();
  const searchParams = useSearchParams();

  const gradeParam = searchParams.get('grade') || '7';
  const subjectParam = searchParams.get('subject') || 'math';
  const lessonParam = searchParams.get('lesson') || searchParams.get('lessonId');

  // Initialize filter states dynamically from URL query parameters
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

  const [activeVideo, setActiveVideo] = useState<VideoResourceItem | null>(null);
  const [allVideos, setAllVideos] = useState<VideoResourceItem[]>([]);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState<boolean>(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState<boolean>(false);
  const [lessonsVersion, setLessonsVersion] = useState<number>(0);

  // Strict RBAC: only true if user is authenticated staff with super_admin or matching subject_lead role
  const canManageLessons = useCanManageLessons(selectedSubject);

  // Sync state if URL query parameters change (e.g. back/forward or direct link navigation)
  useEffect(() => {
    const g = searchParams.get('grade');
    const s = searchParams.get('subject');
    const l = searchParams.get('lesson') || searchParams.get('lessonId');

    if (g) {
      setSelectedGrade(parseGrade(g));
    }
    if (s) {
      setSelectedSubject(parseSubject(s));
    }
    if (l) {
      setSelectedLessonId(l);
    }
  }, [searchParams]);

  // Load videos from store and listen for edits
  useEffect(() => {
    const loadVideos = () => {
      const list = getStoredVideos();
      setAllVideos(list);
      setLessonsVersion((v) => v + 1);
    };
    loadVideos();

    window.addEventListener('moeys-lessons-updated', loadVideos);
    window.addEventListener(CMS_SYNC_EVENT, loadVideos);
    return () => {
      window.removeEventListener('moeys-lessons-updated', loadVideos);
      window.removeEventListener(CMS_SYNC_EVENT, loadVideos);
    };
  }, []);

  // Lessons for current subject & grade
  const availableLessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(selectedSubject, selectedGrade);
  }, [selectedSubject, selectedGrade, allVideos, lessonsVersion]);

  // Update selectedLessonId if current is not in the list
  useEffect(() => {
    if (availableLessons.length > 0) {
      const exists = availableLessons.find((l) => l.id === selectedLessonId);
      if (!exists) {
        setSelectedLessonId(availableLessons[0].id);
      }
    }
  }, [availableLessons, selectedLessonId]);

  // Helper to sync URL params without reload
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
    updateUrl(newSubject, selectedGrade);
  };

  const handleGradeChange = (newGrade: GradeLevel) => {
    setSelectedGrade(newGrade);
    updateUrl(selectedSubject, newGrade);
  };

  const handleLessonChange = (newLessonId: string) => {
    setSelectedLessonId(newLessonId);
    updateUrl(selectedSubject, selectedGrade, newLessonId);
  };

  // All playlist videos for the currently selected lesson (sorted by playlist orderIndex)
  const lessonPlaylistVideos = useMemo(() => {
    const list = allVideos
      .filter((v) => v.lessonId === selectedLessonId)
      .sort((a, b) => (a.orderIndex || 1) - (b.orderIndex || 1));

    if (list.length > 0) return list;

    // Fallback demonstration video if none uploaded yet so students always have a video to learn
    const curLesson = availableLessons.find((l) => l.id === selectedLessonId) || availableLessons[0];
    if (!curLesson) return [];

    return [
      {
        id: `demo-${curLesson.id}-1`,
        lessonId: curLesson.id,
        subject: curLesson.subject,
        grade: curLesson.grade,
        orderIndex: 1,
        titleKm: `${curLesson.titleKm} (វីដេអូបង្រៀនគំរូ MoEYS)`,
        titleEn: `${curLesson.titleEn} (MoEYS Demonstration Lecture)`,
        descriptionKm: curLesson.descriptionKm,
        descriptionEn: curLesson.descriptionEn,
        youtubeUrl: 'https://www.youtube.com/watch?v=5PcpBw5Hbwo',
        youtubeVideoId: '5PcpBw5Hbwo',
        pdfUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view',
        pdfSourceType: 'gdrive' as const,
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
            ] as [string, string, string, string, string],
            optionsEn: [
              'Memorizing formulas blindly without understanding principles',
              'Understanding foundational concepts and applying step-by-step solutions',
              'Skipping calculation steps during examinations',
              'Solely relying on calculators without manual derivation',
              'Avoiding independent practice exercises',
            ] as [string, string, string, string, string],
            correctAnswer: 'B' as const,
            hintKm: 'ការយល់ដឹងពីទ្រឹស្តី និងការអនុវត្តជាក់ស្តែង គឺជាគន្លឹះនៃភាពជោគជ័យ។',
            hintEn: 'Understanding theory and consistent problem solving are essential.',
            explanationKm: 'ក្នុងកម្មវិធីសិក្សា MoEYS ការយល់ដឹងពីទ្រឹស្តី និងការអនុវត្តដោះស្រាយលំហាត់ជាក់ស្តែង គឺជាមូលដ្ឋានគ្រឹះដ៏រឹងមាំបំផុត។ ចម្លើយត្រឹមត្រូវគឺ B។',
            explanationEn: 'Under MoEYS curriculum, conceptual understanding combined with structured problem solving builds mastery. Choice B is correct.',
          },
        ],
      },
    ];
  }, [allVideos, selectedLessonId, availableLessons]);

  // Keep activeVideo in sync with current lesson playlist
  useEffect(() => {
    if (lessonPlaylistVideos.length > 0) {
      const exists = lessonPlaylistVideos.find((v) => v.id === activeVideo?.id);
      if (!exists) {
        setActiveVideo(lessonPlaylistVideos[0]);
      }
    } else {
      setActiveVideo(null);
    }
  }, [lessonPlaylistVideos, activeVideo]);

  // Current Video Index inside playlist
  const currentVideoIndex = useMemo(() => {
    if (!activeVideo) return 0;
    const idx = lessonPlaylistVideos.findIndex((v) => v.id === activeVideo.id);
    return idx >= 0 ? idx : 0;
  }, [activeVideo, lessonPlaylistVideos]);

  const handleNextVideo = () => {
    if (currentVideoIndex < lessonPlaylistVideos.length - 1) {
      setActiveVideo(lessonPlaylistVideos[currentVideoIndex + 1]);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setActiveVideo(lessonPlaylistVideos[currentVideoIndex - 1]);
    }
  };

  const currentSubjectMeta = SUBJECTS[selectedSubject];
  const parsedActiveVideo = activeVideo ? parseYouTubeUrl(activeVideo.youtubeUrl) : null;
  const parsedPdf = activeVideo?.pdfUrl ? parsePdfUrl(activeVideo.pdfUrl) : null;
  const currentLessonItem = availableLessons.find((l) => l.id === selectedLessonId);

  // Attached files for the active video
  const activeVideoAttachments = useMemo(() => {
    if (!activeVideo?.id) return [];
    return getAttachmentsByVideo(activeVideo.id);
  }, [activeVideo, allVideos]);

  // Combined MCQs: Base embedded MCQs + Unified CMS MCQs
  const combinedVideoMcqs = useMemo(() => {
    if (!activeVideo) return [];
    const base = activeVideo.videoMcqs || [];
    const unified = getUnifiedMcqsByVideo(activeVideo.id);

    const result = [...base];
    unified.forEach((um, idx) => {
      const already = result.some((m) => m.id === um.id);
      if (!already) {
        const opts = (um.options && um.options.length >= 2 ? um.options : ['A', 'B', 'C', 'D']) as any;
        result.push({
          id: um.id,
          questionNumber: base.length + idx + 1,
          questionKm: um.question_km,
          questionEn: um.question_en,
          optionsKm: opts,
          optionsEn: opts,
          correctAnswer: (um.correct_answer || 'A') as any,
          hintKm: um.hint_km || '',
          hintEn: um.hint_en || '',
          explanationKm: um.explanation_km || um.explanation || '',
          explanationEn: um.explanation_en || um.explanation || '',
          questionImageUrl: um.question_image_url || '',
        });
      }
    });

    return result;
  }, [activeVideo, allVideos]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* 1. Page Header & Interactive Filter Bar */}
      <div className="bg-gradient-to-b from-blue-50/70 to-transparent dark:from-blue-950/20 dark:to-transparent border-b border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2">
                <Video className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'មជ្ឈមណ្ឌលមេរៀនវីដេអូ និងឯកសារ PDF' : 'Video & PDF Learning Hub'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {isKhmer ? '🎬 មជ្ឈមណ្ឌលសិក្សា និងមេរៀនវីដេអូ MoEYS' : '🎬 MoEYS Academic & Video Learning Hub'}
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

          {/* ============================================================== */}
          {/* DYNAMIC FILTER CONTROLS: DROPDOWNS & PILL SELECTORS            */}
          {/* ============================================================== */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {/* Row 1: Direct Filter Dropdowns (Grade, Subject, Lesson) with Quick Add Button */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Grade Dropdown */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="grade-filter-dropdown"
                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                >
                  {t('grade')} ({isKhmer ? 'កម្រិតថ្នាក់' : 'Grade Level'})
                </label>
                <select
                  id="grade-filter-dropdown"
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

              {/* Subject Dropdown */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="subject-filter-dropdown"
                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                >
                  {isKhmer ? 'មុខវិជ្ជា' : 'Subject'} ({isKhmer ? 'Academic Discipline' : 'Subject'})
                </label>
                <select
                  id="subject-filter-dropdown"
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

              {/* Lesson Dropdown + LessonToolbar Action Group */}
              <div className="sm:col-span-5 flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="lesson-filter-dropdown"
                    className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                  >
                    {t('selectLesson')} ({isKhmer ? 'មេរៀន' : 'Lesson'})
                  </label>
                  <select
                    id="lesson-filter-dropdown"
                    value={selectedLessonId}
                    onChange={(e) => handleLessonChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 truncate"
                  >
                    {availableLessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strict Conditional Rendering: Quick-Add, Edit, and Delete controls */}
                {canManageLessons && (
                  <LessonToolbar
                    selectedLesson={currentLessonItem || null}
                    subject={selectedSubject}
                    grade={selectedGrade}
                    onAddClick={() => setIsQuickAddOpen(true)}
                    onEditClick={() => setIsEditLessonOpen(true)}
                    onDeleteClick={() => setIsDeleteLessonOpen(true)}
                  />
                )}
              </div>
            </div>

            {/* Row 2: Subject & Grade Interactive Pill Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Subject Pill Buttons */}
              <div className="md:col-span-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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

              {/* Grade Pill Buttons */}
              <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1">
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
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video Player, Handouts, Lesson Summary & Video MCQs */}
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
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${currentSubjectMeta.badgeBg} ${currentSubjectMeta.badgeText}`}
                          >
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

                      {/* PDF Handout Buttons (Preview Modal & Direct Download) */}
                      {activeVideo.pdfUrl && parsedPdf && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Preview PDF */}
                          <button
                            type="button"
                            onClick={() => setPdfModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
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

                    {/* Lesson Core Article & Concepts */}
                    {currentLessonItem && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 mb-4 border border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {isKhmer ? 'ខ្លឹមសារមេរៀនសង្ខេប' : 'Lesson Article & Notes'}
                            </h4>
                          </div>
                          <Link
                            href={`/practice?subject=${selectedSubject}&grade=${selectedGrade}&lesson=${selectedLessonId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>{t('practiceMcq')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <LatexRenderer
                            content={isKhmer ? currentLessonItem.descriptionKm : currentLessonItem.descriptionEn}
                          />
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      <LatexRenderer
                        content={isKhmer ? activeVideo.descriptionKm : activeVideo.descriptionEn}
                      />
                    </div>

                    {/* Attached Materials / PDFs from CMS Unified Store */}
                    {activeVideoAttachments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-rose-500" />
                          <span>
                            {isKhmer ? 'ឯកសារជំនួយបន្ថែម (Attached Handouts & Slides)' : 'Attached Handouts & Slides'}
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeVideoAttachments.map((att) => (
                            <a
                              key={att.id}
                              href={att.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-rose-500" />
                              <span className="truncate max-w-[200px]">{att.title}</span>
                              <Download className="w-3 h-3 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <div className="flex items-center gap-2">
                      {combinedVideoMcqs.length > 0 && (
                        <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800">
                          {isKhmer
                            ? `${combinedVideoMcqs.length} សំណួរ`
                            : `${combinedVideoMcqs.length} Question${combinedVideoMcqs.length !== 1 ? 's' : ''}`}
                        </span>
                      )}
                      <Link
                        href={`/practice?subject=${selectedSubject}&grade=${selectedGrade}&lesson=${selectedLessonId}`}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>{isKhmer ? 'ធ្វើលំហាត់ ១០ សំណួរ' : 'Take 10-MCQ Quiz'}</span>
                      </Link>
                    </div>
                  </div>

                  {combinedVideoMcqs.length > 0 ? (
                    <div className="space-y-4">
                      {combinedVideoMcqs.map((mcq, idx) => (
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
                          questionImageUrl={mcq.questionImageUrl}
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
                {/* PUBLIC Q&A / COMMENT SECTION                                  */}
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

          {/* Right Column: YouTube-Style Playlist & MoEYS Curriculum Lesson Selector */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. YouTube-Style Video Playlist Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ListMusic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                      {isKhmer ? 'បញ្ជីចាក់វីដេអូ' : 'Video Playlist'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isKhmer
                        ? `វីដេអូ ${currentVideoIndex + 1} នៃ ${lessonPlaylistVideos.length}`
                        : `Video ${currentVideoIndex + 1} of ${lessonPlaylistVideos.length}`}
                    </p>
                  </div>
                </div>

                {/* Playlist Prev/Next Skip Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    disabled={currentVideoIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title={isKhmer ? 'វីដេអូមុន' : 'Previous Video'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextVideo}
                    disabled={currentVideoIndex === lessonPlaylistVideos.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title={isKhmer ? 'វីដេអូបន្ទាប់' : 'Next Video'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable List of Playlist Videos */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {lessonPlaylistVideos.map((vid, idx) => {
                  const isCurrent = activeVideo?.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => setActiveVideo(vid)}
                      className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 shadow-sm ring-1 ring-blue-500/20'
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {/* Play Indicator / Thumbnail */}
                      <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-black flex-shrink-0 flex items-center justify-center">
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeVideoId}/mqdefault.jpg`}
                          alt=""
                          className="w-full h-full object-cover opacity-80"
                        />
                        {isCurrent ? (
                          <div className="absolute inset-0 bg-blue-600/80 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 bg-black/80 text-white rounded-xs">
                          #{vid.orderIndex || idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {isCurrent && (
                          <span className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-0.5">
                            ▶ {isKhmer ? 'កំពុងចាក់' : 'Now Playing'}
                          </span>
                        )}
                        <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white leading-snug">
                          {isKhmer ? vid.titleKm : vid.titleEn}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                          <span>{vid.videoMcqs?.length || 0} MCQs</span>
                          {vid.pdfUrl && <span className="text-red-500 font-bold">• PDF</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. MoEYS Curriculum Lesson Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {t('lessons')} ({availableLessons.length})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">
                    {t('grade')} {selectedGrade}
                  </span>
                  {canManageLessons && (
                    <LessonToolbar
                      selectedLesson={currentLessonItem || null}
                      subject={selectedSubject}
                      grade={selectedGrade}
                      onAddClick={() => setIsQuickAddOpen(true)}
                      onEditClick={() => setIsEditLessonOpen(true)}
                      onDeleteClick={() => setIsDeleteLessonOpen(true)}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {availableLessons.map((lesson) => {
                  const isSelected = selectedLessonId === lesson.id;
                  const lessonVideosCount = allVideos.filter((v) => v.lessonId === lesson.id).length;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => handleLessonChange(lesson.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
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

                      {lessonVideosCount > 0 && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-0.5 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>{lessonVideosCount}</span>
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
              setLessonsVersion((v) => v + 1);
              updateUrl(selectedSubject, selectedGrade, newLesson.id);
            }}
          />

          <EditLessonModal
            isOpen={isEditLessonOpen}
            onClose={() => setIsEditLessonOpen(false)}
            lesson={currentLessonItem || null}
            subject={selectedSubject}
            grade={selectedGrade}
            onLessonUpdated={(updatedLesson) => {
              setIsEditLessonOpen(false);
              setLessonsVersion((v) => v + 1);
            }}
          />

          <DeleteLessonConfirmDialog
            isOpen={isDeleteLessonOpen}
            onClose={() => setIsDeleteLessonOpen(false)}
            lesson={currentLessonItem || null}
            subject={selectedSubject}
            grade={selectedGrade}
            onLessonDeleted={(deletedId) => {
              setIsDeleteLessonOpen(false);
              const remaining = availableLessons.filter((l) => l.id !== deletedId);
              const nextLessonId = remaining.length > 0 ? remaining[0].id : '';
              setSelectedLessonId(nextLessonId);
              updateUrl(selectedSubject, selectedGrade, nextLessonId || undefined);
              setLessonsVersion((v) => v + 1);
            }}
          />
        </>
      )}
    </div>
  );
}
