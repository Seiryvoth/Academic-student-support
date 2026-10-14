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
    };

    const saved = await updateCurriculumMcqInStore(updatedMcq);
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
