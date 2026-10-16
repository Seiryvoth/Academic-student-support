'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  BookOpen,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SubjectId, GradeLevel, SUBJECTS, getLessonsBySubjectAndGrade, LessonItem } from '@/lib/curriculum-data';
import { addCustomLesson } from '@/lib/data-store';
import { recordActivityNotification } from '@/lib/notifications-store';
import { useLanguage } from '@/context/language-context';

interface QuickAddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectId;
  grade: GradeLevel;
  onLessonCreated: (createdLesson: LessonItem) => void;
}

export const QuickAddLessonModal: React.FC<QuickAddLessonModalProps> = ({
  isOpen,
  onClose,
  subject,
  grade,
  onLessonCreated,
}) => {
  const { isKhmer } = useLanguage();

  const [titleKm, setTitleKm] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descKm, setDescKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-calculate next order index whenever modal opens or subject/grade changes
  useEffect(() => {
    if (isOpen) {
      const existing = getLessonsBySubjectAndGrade(subject, grade);
      const nextNum = existing.length > 0 ? Math.max(...existing.map((l) => l.orderIndex)) + 1 : 1;
      setOrderIndex(nextNum);
      setTitleKm('');
      setTitleEn('');
      setDescKm('');
      setDescEn('');
      setError(null);
    }
  }, [isOpen, subject, grade]);

  if (!isOpen) return null;

  const subjectMeta = SUBJECTS[subject];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleKm.trim() || !titleEn.trim()) {
      setError(isKhmer ? 'សូមបញ្ចូលចំណងជើងមេរៀនទាំងភាសាខ្មែរ និងអង់គ្លេស' : 'Please provide titles in both Khmer and English');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const customId = `${subject}-g${grade}-${orderIndex}-${Date.now().toString(36)}`;
      const newLesson = await addCustomLesson({
        customId,
        subject,
        grade,
        orderIndex: Number(orderIndex) || 1,
        titleKm: titleKm.trim(),
        titleEn: titleEn.trim(),
        descriptionKm: descKm.trim() || (isKhmer ? `មេរៀនទី ${orderIndex} នៃមុខវិជ្ជា ${subjectMeta.nameKm} ថ្នាក់ទី ${grade}` : `Lesson ${orderIndex} of Grade ${grade} ${subjectMeta.nameEn}`),
        descriptionEn: descEn.trim() || `Lesson ${orderIndex} of Grade ${grade} ${subjectMeta.nameEn}`,
      });

      // Dispatch staff activity notification
      recordActivityNotification({
        actionType: 'video_edit',
        subject,
        grade,
        lessonId: newLesson.id,
        actorName: isKhmer ? 'គណៈគ្រប់គ្រង' : 'Admin Staff',
        actorRole: 'subject_lead',
        titleKm: `បានបង្កើតមេរៀនថ្មី «${newLesson.titleKm}»`,
        titleEn: `Created new lesson "${newLesson.titleEn}"`,
        messageKm: `បានបញ្ចូលក្នុងមុខវិជ្ជា ${subjectMeta.nameKm} ថ្នាក់ទី ${grade}`,
        messageEn: `Added to Grade ${grade} ${subjectMeta.nameEn}`,
      });

      onLessonCreated(newLesson);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save lesson';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>{isKhmer ? '➕ បន្ថែមមេរៀនថ្មីដោយរហ័ស' : '➕ Quick Add New Lesson'}</span>
              </h2>
              <p className="text-xs text-blue-100">
                {isKhmer ? 'បញ្ចូលមេរៀនថ្មីទៅក្នុងកម្មវិធីសិក្សា និងបញ្ជីជ្រើសរើសភ្លាមៗ' : 'Append new lesson to curriculum dropdown & database instantly'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Context Badges (Subject + Grade) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${subjectMeta.badgeBg} ${subjectMeta.badgeText}`}>
                {isKhmer ? subjectMeta.nameKm : subjectMeta.nameEn}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                {isKhmer ? `ថ្នាក់ទី ${grade}` : `Grade ${grade}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Layers className="w-3.5 h-3.5" />
              <span>{isKhmer ? 'លំដាប់ស្វ័យប្រវត្តិ' : 'Auto assigned'}</span>
            </div>
          </div>

          {/* Lesson Order Index */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'លេខលំដាប់មេរៀន (Order Index)' : 'Lesson Order Number'} *
            </label>
            <input
              type="number"
              min={1}
              required
              value={orderIndex}
              onChange={(e) => setOrderIndex(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Khmer Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'ចំណងជើងមេរៀនជាភាសាខ្មែរ (Khmer Title)' : 'Lesson Title in Khmer'} *
            </label>
            <input
              type="text"
              required
              placeholder={isKhmer ? 'ឧ. លីមីតនៃអនុគមន៍ត្រីកោណមាត្រ' : 'e.g. លីមីតនៃអនុគមន៍ត្រីកោណមាត្រ'}
              value={titleKm}
              onChange={(e) => setTitleKm(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* English Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'ចំណងជើងមេរៀនជាភាសាអង់គ្លេស (English Title)' : 'Lesson Title in English'} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Limits of Trigonometric Functions"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Description Khmer */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              {isKhmer ? 'ការពិពណ៌នាសង្ខេបជាភាសាខ្មែរ (ជាជម្រើស)' : 'Brief Description in Khmer (Optional)'}
            </label>
            <textarea
              rows={2}
              placeholder={isKhmer ? 'ពិពណ៌នាអំពីខ្លឹមសារគោលគំនិត និងគោលបំណងនៃមេរៀន...' : 'Brief summary of the lesson concepts...'}
              value={descKm}
              onChange={(e) => setDescKm(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Description English */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              {isKhmer ? 'ការពិពណ៌នាសង្ខេបជាភាសាអង់គ្លេស (ជាជម្រើស)' : 'Brief Description in English (Optional)'}
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of the lesson concepts in English..."
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isKhmer ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isKhmer ? 'រក្សាទុក & ជ្រើសរើសមេរៀននេះ' : 'Save & Select Lesson'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
