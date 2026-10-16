'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  HelpCircle,
  Sparkles,
  FileQuestion,
  Eye,
  Plus,
  ImageIcon,
  Upload,
  Trash2,
} from 'lucide-react';
import {
  CurriculumMcq,
  McqChoice,
  McqDifficulty,
  addCurriculumMcqToStore,
  getCurriculumMcqsForLesson,
} from '@/lib/curriculum-mcqs-generator';
import { SubjectId, GradeLevel, SUBJECTS } from '@/lib/curriculum-data';
import { useLanguage } from '@/context/language-context';
import { LatexRenderer } from './latex-renderer';
import { addUnifiedMcqRecord } from '@/lib/cms-unified-store';
import {
  SVG_NUMBER_LINE,
  SVG_PRIME_VENN,
  SVG_SQUARE_GRID,
  SVG_RATIO_BAR,
  SVG_DISCOUNT_TAG,
  SVG_PARALLEL_LINES,
  SVG_CIRCLE,
  SVG_3D_CUBOID,
  SVG_REFLECTION,
  SVG_BAR_CHART,
  SVG_SPINNER,
  SVG_EQUATION_BALANCE,
} from '@/lib/grade7-math-svgs';
import {
  SVG_HISTOGRAM,
  SVG_3D_CYLINDER,
  SVG_COORDINATE_GRAPH,
  SVG_CIRCLE_ANGLES,
  SVG_SPECIAL_QUADRILATERALS,
} from '@/lib/grade8-math-svgs';
import {
  SVG_PYTHAGOREAN_THEOREM,
  SVG_THALES_THEOREM,
  SVG_SIMILAR_TRIANGLES,
  SVG_CIRCLE_ANGLE_PROPERTIES,
  SVG_CIRCLES_AND_LINES,
  SVG_SOLIDS_G9,
  SVG_DISTANCE_BETWEEN_POINTS,
  SVG_SYSTEM_LINEAR_EQUATIONS,
} from '@/lib/grade9-math-svgs';

interface AddCurriculumMcqModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  subject: SubjectId;
  grade: GradeLevel;
  targetVideoId?: string | null;
  availableVideos?: Array<{ id: string; titleKm: string; titleEn: string; orderIndex?: number }>;
  onSaved: (created: CurriculumMcq) => void;
}

export const AddCurriculumMcqModal: React.FC<AddCurriculumMcqModalProps> = ({
  isOpen,
  onClose,
  lessonId,
  subject,
  grade,
  targetVideoId,
  availableVideos = [],
  onSaved,
}) => {
  const { t, isKhmer } = useLanguage();

  const [selectedVideoId, setSelectedVideoId] = useState<string>(targetVideoId || '');
  const [questionNumber, setQuestionNumber] = useState<number>(11);
  const [difficulty, setDifficulty] = useState<McqDifficulty>('medium');
  const [questionKm, setQuestionKm] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [optionsKm, setOptionsKm] = useState<[string, string, string, string, string]>(['', '', '', '', '']);
  const [optionsEn, setOptionsEn] = useState<[string, string, string, string, string]>(['', '', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<McqChoice>('B');
  const [hintKm, setHintKm] = useState('');
  const [hintEn, setHintEn] = useState('');
  const [explanationKm, setExplanationKm] = useState('');
  const [explanationEn, setExplanationEn] = useState('');
  const [questionImageUrl, setQuestionImageUrl] = useState<string>('');
  const [previewActive, setPreviewActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedVideoId(targetVideoId || '');
      const existing = getCurriculumMcqsForLesson(lessonId);
      const nextNum = existing.length > 0 ? Math.max(...existing.map((q) => q.questionNumber)) + 1 : 1;
      setQuestionNumber(nextNum);
      setDifficulty('medium');
      setQuestionKm('');
      setQuestionEn('');
      setOptionsKm(['', '', '', '', '']);
      setOptionsEn(['', '', '', '', '']);
      setCorrectAnswer('B');
      setHintKm('');
      setHintEn('');
      setExplanationKm('');
      setExplanationEn('');
      setQuestionImageUrl('');
      setError(null);
    }
  }, [isOpen, lessonId, targetVideoId]);

  if (!isOpen) return null;

  const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];
  const subjectMeta = SUBJECTS[subject];

  const handleUpdateOption = (optIdx: number, lang: 'km' | 'en', val: string) => {
    if (lang === 'km') {
      const copy = [...optionsKm] as [string, string, string, string, string];
      copy[optIdx] = val;
      setOptionsKm(copy);
    } else {
      const copy = [...optionsEn] as [string, string, string, string, string];
      copy[optIdx] = val;
      setOptionsEn(copy);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setQuestionImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionKm.trim() && !questionEn.trim()) {
      setError(isKhmer ? 'សូមបញ្ចូលខ្លឹមសារសំណួរ' : 'Please provide question prompt');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 1. Add to unified relational store (Cross-Section Synchronization)
      await addUnifiedMcqRecord({
        grade_level: grade,
        subject_id: subject,
        lesson_id: lessonId,
        video_id: selectedVideoId || null,
        question_km: questionKm.trim() || questionEn.trim(),
        question_en: questionEn.trim() || questionKm.trim(),
        options: optionsKm,
        correct_answer: correctAnswer,
        hint_km: hintKm.trim(),
        hint_en: hintEn.trim(),
        explanation_km: explanationKm.trim(),
        explanation_en: explanationEn.trim(),
        explanation: explanationKm.trim(),
        difficulty,
        question_image_url: questionImageUrl.trim() || null,
      });

      // 2. Add to base curriculum MCQs generator store for full backwards compatibility
      const created = await addCurriculumMcqToStore({
        lessonId,
        subject,
        grade,
        questionNumber: Number(questionNumber) || 1,
        difficulty,
        questionKm: questionKm.trim() || questionEn.trim(),
        questionEn: questionEn.trim() || questionKm.trim(),
        optionsKm,
        optionsEn,
        correctAnswer,
        hintKm: hintKm.trim(),
        hintEn: hintEn.trim(),
        explanationKm: explanationKm.trim(),
        explanationEn: explanationEn.trim(),
        questionImageUrl: questionImageUrl.trim() || undefined,
      });

      onSaved(created);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save question';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {isKhmer ? `➕ បន្ថែមសំណួរលំហាត់ថ្មី #${questionNumber}` : `➕ Add New MCQ Exercise #${questionNumber}`}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/25 uppercase">
                  {subjectMeta.nameKm} • G{grade}
                </span>
              </div>
              <p className="text-xs text-indigo-100">
                {isKhmer
                  ? 'បង្កើតសំណួរ MCQ គាំទ្ររូបមន្ត KaTeX LaTeX ជម្រើសទាំង ៥ និងការពន្យល់លម្អិត'
                  : 'Create MCQ with 5 choices (A-E), KaTeX formulas, and step-by-step solutions.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Associated Video / Cross-Section Quiz Selector */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                {isKhmer ? '🎬 ភ្ជាប់ជាមួយវីដេអូជាក់លាក់ (Cross-Section Video Quiz)' : '🎬 Link to Playlist Video (Comprehension Quiz)'}
              </label>
              {selectedVideoId ? (
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {isKhmer ? 'សំណួរស្វែងយល់តាមវីដេអូ' : 'Video Comprehension'}
                </span>
              ) : (
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  {isKhmer ? 'សំណួរទូទៅប្រចាំមេរៀន' : 'General Lesson Practice'}
                </span>
              )}
            </div>
            <select
              value={selectedVideoId}
              onChange={(e) => setSelectedVideoId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
            >
              <option value="">
                {isKhmer ? '📘 សំណួរទូទៅប្រចាំមេរៀន (គ្មានវីដេអូភ្ជាប់ / General Lesson Question)' : '📘 General Lesson Practice (No Video Attached)'}
              </option>
              {availableVideos.map((v) => (
                <option key={v.id} value={v.id}>
                  🎬 #{v.orderIndex || 1}: {isKhmer ? v.titleKm : v.titleEn}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1.5">
              {isKhmer
                ? '💡 សំណួរដែលភ្ជាប់ជាមួយវីដេអូ នឹងធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិ (Cross-Section Auto Sync) បង្ហាញក្នុងទាំងផ្នែកវីដេអូ និងផ្នែកលំហាត់ប្រចាំមេរៀន។'
                : '💡 Questions linked to a video automatically synchronize across both the video quiz drawer and the main lesson MCQ section.'}
            </p>
          </div>

          {/* Row 1: Question Number, Difficulty, Correct Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isKhmer ? 'លេខរៀងសំណួរ (Question #)' : 'Question Number'} *
              </label>
              <input
                type="number"
                min={1}
                required
                value={questionNumber}
                onChange={(e) => setQuestionNumber(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('difficulty')} *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as McqDifficulty)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white"
              >
                <option value="basic">{t('basic')} (Basic)</option>
                <option value="medium">{t('medium')} (Medium)</option>
                <option value="advanced">{t('advanced')} (Advanced)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isKhmer ? 'ចម្លើយត្រឹមត្រូវ (Correct Key)' : 'Correct Answer Key'} *
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value as McqChoice)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold text-sm"
              >
                {choices.map((c) => (
                  <option key={c} value={c}>
                    Option {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Question Prompts (Khmer & English) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{isKhmer ? 'ខ្លឹមសារសំណួរ (ភាសាខ្មែរ)' : 'Question Prompt (Khmer)'} *</span>
                <span className="text-[10px] text-slate-400 font-mono">LaTeX: $...$</span>
              </label>
              <textarea
                required
                rows={3}
                value={questionKm}
                onChange={(e) => setQuestionKm(e.target.value)}
                placeholder="ឧ. គណនាលីមីត $\lim_{x \to 0} \frac{\sin(5x)}{x}$ ?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{isKhmer ? 'ខ្លឹមសារសំណួរ (ភាសាអង់គ្លេស)' : 'Question Prompt (English)'} *</span>
                <span className="text-[10px] text-slate-400 font-mono">LaTeX: $...$</span>
              </label>
              <textarea
                required
                rows={3}
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="e.g. Evaluate the limit $\lim_{x \to 0} \frac{\sin(5x)}{x}$?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Question Image / Visual Diagram Support */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{isKhmer ? 'រូបគំនូរ ឬក្រាបធរណីមាត្រ (Question Image / Diagram URL)' : 'Visual Diagram / Image (Optional)'}</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'ផ្ទុកឡើងរូបភាព (Upload)' : 'Upload File'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                {questionImageUrl && (
                  <button
                    type="button"
                    onClick={() => setQuestionImageUrl('')}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title={isKhmer ? 'លុបរូបភាព' : 'Remove Image'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={questionImageUrl}
              onChange={(e) => setQuestionImageUrl(e.target.value)}
              placeholder="https://... ឬ data:image/svg+xml;..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
            />

            {/* Quick SVG Diagram Presets for Teachers */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {isKhmer ? 'គំរូរូបភាពរហ័ស (Quick Diagram Presets):' : 'Quick Diagram Presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { nameKm: 'បន្ទាត់ចំនួន', nameEn: 'Number Line', svg: SVG_NUMBER_LINE },
                  { nameKm: 'ដ្យាក្រាមវ៉ែន GCD', nameEn: 'Venn GCD', svg: SVG_PRIME_VENN },
                  { nameKm: 'ការេ 5x5', nameEn: 'Square Grid', svg: SVG_SQUARE_GRID },
                  { nameKm: 'ផលធៀប 60/40', nameEn: 'Ratio Bar', svg: SVG_RATIO_BAR },
                  { nameKm: 'ស្លាកបញ្ចុះតម្លៃ', nameEn: 'Discount Tag', svg: SVG_DISCOUNT_TAG },
                  { nameKm: 'បន្ទាត់ស្រប', nameEn: 'Parallel Lines', svg: SVG_PARALLEL_LINES },
                  { nameKm: 'រង្វង់ r=7', nameEn: 'Circle', svg: SVG_CIRCLE },
                  { nameKm: 'ប្រលេពីប៉ែត 3D', nameEn: '3D Cuboid', svg: SVG_3D_CUBOID },
                  { nameKm: 'ភាពឆ្លុះប្លង់', nameEn: 'Reflection', svg: SVG_REFLECTION },
                  { nameKm: 'ក្រាបស្ថិតិ', nameEn: 'Bar Chart', svg: SVG_BAR_CHART },
                  { nameKm: 'កង់វិល ៤ ពណ៌', nameEn: 'Spinner', svg: SVG_SPINNER },
                  { nameKm: 'ជញ្ជីងសមីការ', nameEn: 'Balance Scale', svg: SVG_EQUATION_BALANCE },
                  { nameKm: 'អ៊ីស្តូក្រាម G8', nameEn: 'Histogram G8', svg: SVG_HISTOGRAM },
                  { nameKm: 'ស៊ីឡាំង 3D G8', nameEn: 'Cylinder G8', svg: SVG_3D_CYLINDER },
                  { nameKm: 'ក្រាបបន្ទាត់ G8', nameEn: 'Coordinate Graph G8', svg: SVG_COORDINATE_GRAPH },
                  { nameKm: 'មុំក្នុងរង្វង់ G8', nameEn: 'Circle Angles G8', svg: SVG_CIRCLE_ANGLES },
                  { nameKm: 'ចតុកោណពិសេស G8', nameEn: 'Quadrilaterals G8', svg: SVG_SPECIAL_QUADRILATERALS },
                  { nameKm: 'ពីតាគ័រ G9', nameEn: 'Pythagoras G9', svg: SVG_PYTHAGOREAN_THEOREM },
                  { nameKm: 'តាលែស G9', nameEn: 'Thales G9', svg: SVG_THALES_THEOREM },
                  { nameKm: 'ត្រីកោណដូចគ្នា G9', nameEn: 'Similar Triangles G9', svg: SVG_SIMILAR_TRIANGLES },
                  { nameKm: 'មុំក្នុងរង្វង់ G9', nameEn: 'Circle Angles G9', svg: SVG_CIRCLE_ANGLE_PROPERTIES },
                  { nameKm: 'បន្ទាត់ប៉ះរង្វង់ G9', nameEn: 'Tangent Circle G9', svg: SVG_CIRCLES_AND_LINES },
                  { nameKm: 'កោណ & ស្វ៊ែរ G9', nameEn: 'Cone & Sphere G9', svg: SVG_SOLIDS_G9 },
                  { nameKm: 'ចម្ងាយពីរចំណុច G9', nameEn: 'Distance 2-Points G9', svg: SVG_DISTANCE_BETWEEN_POINTS },
                  { nameKm: 'ប្រព័ន្ធសមីការ G9', nameEn: 'Linear System G9', svg: SVG_SYSTEM_LINEAR_EQUATIONS },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestionImageUrl(preset.svg)}
                    className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    + {isKhmer ? preset.nameKm : preset.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Diagram Thumbnail Preview */}
            {questionImageUrl && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <img
                  src={questionImageUrl}
                  alt="Question Diagram Preview"
                  className="max-h-40 w-auto object-contain rounded-lg shadow-xs"
                />
              </div>
            )}
          </div>

          {/* Row 3: 5 Multiple Choice Options (A, B, C, D, E) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>{isKhmer ? 'ជម្រើសចម្លើយទាំង ៥ (Options A–E)' : '5 Multiple-Choice Options (A–E)'}</span>
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isKhmer ? 'ចុចលើរង្វង់ដើម្បីកំណត់ជាចម្លើយត្រឹមត្រូវ' : 'Click radio button to mark correct key'}
              </span>
            </div>

            <div className="space-y-2.5">
              {choices.map((c, idx) => {
                const isCorrect = correctAnswer === c;
                return (
                  <div
                    key={c}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400/50'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(c)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                          isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {c}
                      </button>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isCorrect ? (isKhmer ? 'ចម្លើយត្រឹមត្រូវ (Correct Answer)' : 'Correct Answer') : `Option ${c}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={optionsKm[idx]}
                        onChange={(e) => handleUpdateOption(idx, 'km', e.target.value)}
                        placeholder={`ជម្រើស ${c} (ភាសាខ្មែរ / LaTeX)`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        required
                        value={optionsEn[idx]}
                        onChange={(e) => handleUpdateOption(idx, 'en', e.target.value)}
                        placeholder={`Option ${c} (English / LaTeX)`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 4: Hints (Khmer & English) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{isKhmer ? 'តម្រុយគន្លឹះ (ភាសាខ្មែរ)' : 'Hint (Khmer)'}</span>
              </label>
              <input
                type="text"
                value={hintKm}
                onChange={(e) => setHintKm(e.target.value)}
                placeholder="ឧ. ប្រើរូបមន្តលីមីតត្រីកោណមាត្រគ្រឹះ..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{isKhmer ? 'តម្រុយគន្លឹះ (ភាសាអង់គ្លេស)' : 'Hint (English)'}</span>
              </label>
              <input
                type="text"
                value={hintEn}
                onChange={(e) => setHintEn(e.target.value)}
                placeholder="e.g. Recall the fundamental trigonometric limit..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Row 5: Detailed Step-by-Step Solutions (Khmer & English) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isKhmer ? 'ដំណោះស្រាយលម្អិត (ភាសាខ្មែរ)' : 'Step-by-step Solution (Khmer)'}
              </label>
              <textarea
                rows={3}
                value={explanationKm}
                onChange={(e) => setExplanationKm(e.target.value)}
                placeholder="ដំណោះស្រាយ និងការបកស្រាយលម្អិតជាភាសាខ្មែរ..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isKhmer ? 'ដំណោះស្រាយលម្អិត (ភាសាអង់គ្លេស)' : 'Step-by-step Solution (English)'}
              </label>
              <textarea
                rows={3}
                value={explanationEn}
                onChange={(e) => setExplanationEn(e.target.value)}
                placeholder="Detailed step-by-step derivation in English..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Live KaTeX Preview Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isKhmer ? 'ការមើលរូបមន្តគណិតវិទ្យាជាក់ស្តែង (KaTeX Preview)' : 'Live LaTeX / KaTeX Formula Preview'}</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewActive(!previewActive)}
                className="text-[10px] font-semibold text-indigo-600 hover:underline"
              >
                {previewActive ? (isKhmer ? 'លាក់' : 'Hide') : (isKhmer ? 'បង្ហាញ' : 'Show')}
              </button>
            </div>
            {previewActive && (
              <div className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed min-h-[3rem]">
                <LatexRenderer
                  content={
                    (isKhmer ? questionKm : questionEn) ||
                    (isKhmer ? 'វាយបញ្ចូល LaTeX ដើម្បីមើលការបង្ហាញ...' : 'Type LaTeX formula to preview...')
                  }
                />
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isKhmer ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isKhmer ? 'រក្សាទុកសំណួរថ្មី' : 'Save New Question'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
