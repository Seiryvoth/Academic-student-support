'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  FileQuestion,
  Eye,
  ImageIcon,
  Upload,
  Trash2,
} from 'lucide-react';
import {
  CurriculumMcq,
  McqChoice,
  McqDifficulty,
  updateCurriculumMcqInStore,
  resetCurriculumMcqInStore,
} from '@/lib/curriculum-mcqs-generator';
import { useLanguage } from '@/context/language-context';
import { LatexRenderer } from './latex-renderer';
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

interface EditCurriculumMcqModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcq: CurriculumMcq | null;
  onSaved: (updated: CurriculumMcq) => void;
  onReset?: () => void;
}

export const EditCurriculumMcqModal: React.FC<EditCurriculumMcqModalProps> = ({
  isOpen,
  onClose,
  mcq,
  onSaved,
  onReset,
}) => {
  const { t, isKhmer } = useLanguage();

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

  useEffect(() => {
    if (mcq) {
      setDifficulty(mcq.difficulty || 'medium');
      setQuestionKm(mcq.questionKm || '');
      setQuestionEn(mcq.questionEn || '');
      setOptionsKm([...mcq.optionsKm] as [string, string, string, string, string]);
      setOptionsEn([...mcq.optionsEn] as [string, string, string, string, string]);
      setCorrectAnswer(mcq.correctAnswer || 'B');
      setHintKm(mcq.hintKm || '');
      setHintEn(mcq.hintEn || '');
      setExplanationKm(mcq.explanationKm || '');
      setExplanationEn(mcq.explanationEn || '');
      setQuestionImageUrl(mcq.questionImageUrl || '');
    }
  }, [mcq]);

  if (!isOpen || !mcq) return null;

  const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];

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

    const updatedMcq: CurriculumMcq = {
      ...mcq,
      difficulty,
      questionKm: questionKm.trim(),
      questionEn: questionEn.trim(),
      optionsKm,
      optionsEn,
      correctAnswer,
      hintKm: hintKm.trim(),
      hintEn: hintEn.trim(),
      explanationKm: explanationKm.trim(),
      explanationEn: explanationEn.trim(),
      questionImageUrl: questionImageUrl.trim() || undefined,
    };

    const saved = await updateCurriculumMcqInStore(updatedMcq);

    // Also sync with unified CMS store if matching
    try {
      const { updateUnifiedMcqRecord, getStoredUnifiedMcqs } = await import('@/lib/cms-unified-store');
      const existingUnified = getStoredUnifiedMcqs().find(
        (m) => m.id === mcq.id || (m.lesson_id === mcq.lessonId && (m as any).questionNumber === mcq.questionNumber)
      );
      if (existingUnified) {
        await updateUnifiedMcqRecord(existingUnified.id, {
          question_km: questionKm.trim(),
          question_en: questionEn.trim(),
          options: optionsKm,
          correct_answer: correctAnswer,
          hint_km: hintKm.trim(),
          hint_en: hintEn.trim(),
          explanation_km: explanationKm.trim(),
          explanation_en: explanationEn.trim(),
          difficulty,
          question_image_url: questionImageUrl.trim() || null,
        });
      }
    } catch {
      // Graceful fallback
    }

    onSaved(saved);
    onClose();
  };

  const handleReset = async () => {
    if (confirm(isKhmer ? 'តើអ្នកចង់កំណត់សំណួរនេះឡើងវិញទៅតាមគំរូដើម MoEYS មែនទេ?' : 'Reset this question back to default MoEYS template?')) {
      await resetCurriculumMcqInStore(mcq.lessonId, mcq.questionNumber);
      if (onReset) onReset();
      onClose();
    }
  };

  const handleClearFields = () => {
    if (confirm(isKhmer ? 'តើអ្នកចង់សម្អាតទិន្នន័យទាំងអស់ដើម្បីសរសេរសំណួរថ្មីជំនួសវិញមែនទេ?' : 'Clear all fields to write a fresh replacement question?')) {
      setQuestionKm('');
      setQuestionEn('');
      setOptionsKm(['', '', '', '', '']);
      setOptionsEn(['', '', '', '', '']);
      setHintKm('');
      setHintEn('');
      setExplanationKm('');
      setExplanationEn('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              Q{mcq.questionNumber}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('editCurriculumMcq')} (#{mcq.questionNumber})
              </h3>
              <p className="text-xs text-slate-500">
                {t('grade')} {mcq.grade} • {mcq.lessonId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewActive(!previewActive)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                previewActive
                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">KaTeX Preview</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Difficulty & Correct Answer Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('difficulty')}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as McqDifficulty)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="basic">{t('basic')} (Q1 - Q3)</option>
                <option value="medium">{t('medium')} (Q4 - Q7)</option>
                <option value="advanced">{t('advanced')} (Q8 - Q10)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('correctAnswer')}
              </label>
              <div className="flex items-center gap-1.5">
                {choices.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCorrectAnswer(c)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      correctAnswer === c
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Text Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('titleKhmer')} (LaTeX: $...$ or $$...$$) *
              </label>
              <textarea
                rows={2}
                required
                value={questionKm}
                onChange={(e) => setQuestionKm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('titleEnglish')} (LaTeX: $...$ or $$...$$) *
              </label>
              <textarea
                rows={2}
                required
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Live KaTeX Preview Box */}
          {previewActive && (questionKm || questionEn) && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
                Live Formula Preview (KaTeX)
              </span>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <LatexRenderer content={isKhmer ? questionKm : questionEn} />
              </div>
            </div>
          )}

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

          {/* 5 Options (A, B, C, D, E) */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {t('options')}
            </span>

            {choices.map((c, optIdx) => (
              <div
                key={c}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                      correctAnswer === c
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Option {c} {correctAnswer === c && '✓ (Correct Answer)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={optionsKm[optIdx] || ''}
                    onChange={(e) => handleUpdateOption(optIdx, 'km', e.target.value)}
                    placeholder={`ភាសាខ្មែរ Option ${c} (KaTeX $...$)`}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                  <input
                    type="text"
                    value={optionsEn[optIdx] || ''}
                    onChange={(e) => handleUpdateOption(optIdx, 'en', e.target.value)}
                    placeholder={`English Option ${c} (KaTeX $...$)`}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hint & Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t('hint')} (Khmer)</span>
              </label>
              <textarea
                rows={2}
                value={hintKm}
                onChange={(e) => setHintKm(e.target.value)}
                placeholder="ជំនួយស្មារតី..."
                className="w-full px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t('hint')} (English)</span>
              </label>
              <textarea
                rows={2}
                value={hintEn}
                onChange={(e) => setHintEn(e.target.value)}
                placeholder="Hint clue..."
                className="w-full px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('shortAnswer')} (Khmer)</span>
              </label>
              <textarea
                rows={3}
                value={explanationKm}
                onChange={(e) => setExplanationKm(e.target.value)}
                placeholder="ការពន្យល់លម្អិត..."
                className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('shortAnswer')} (English)</span>
              </label>
              <textarea
                rows={3}
                value={explanationEn}
                onChange={(e) => setExplanationEn(e.target.value)}
                placeholder="Step-by-step solution..."
                className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 transition-colors flex items-center gap-1.5"
                title={isKhmer ? 'កំណត់ឡើងវិញទៅតាមគំរូដើម MoEYS' : 'Reset back to MoEYS standard question'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isKhmer ? '🔄 កំណត់ឡើងវិញ MoEYS' : '🔄 Reset to MoEYS'}</span>
              </button>

              <button
                type="button"
                onClick={handleClearFields}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1.5"
                title={isKhmer ? 'សម្អាតទិន្នន័យទាំងអស់ដើម្បីសរសេរសំណួរថ្មី' : 'Clear all fields to write a new replacement question'}
              >
                <span>{isKhmer ? '🧹 សម្អាតសរសេរថ្មី' : '🧹 Clear to Replace'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveChanges')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
