'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Pencil,
  Save,
  BookOpen,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { SubjectId, GradeLevel, SUBJECTS, LessonItem } from '@/lib/curriculum-data';
import { updateLessonTitle, getCurrentStaffSession } from '@/lib/data-store';
import { recordActivityNotification } from '@/lib/notifications-store';
import { useLanguage } from '@/context/language-context';

export interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonItem | null;
  subject: SubjectId;
  grade: GradeLevel;
  onLessonUpdated: (updatedLesson: LessonItem) => void;
}

export const EditLessonModal: React.FC<EditLessonModalProps> = ({
  isOpen,
  onClose,
  lesson,
  subject,
  grade,
  onLessonUpdated,
}) => {
  const { isKhmer } = useLanguage();

  const [titleKm, setTitleKm] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill input fields with the active lesson's title_km and title_en
  useEffect(() => {
    if (isOpen && lesson) {
      setTitleKm(lesson.titleKm || '');
      setTitleEn(lesson.titleEn || '');
      setError(null);
    }
  }, [isOpen, lesson]);

  if (!isOpen || !lesson) return null;

  const subjectMeta = SUBJECTS[subject];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKm = titleKm.trim();
    const cleanEn = titleEn.trim();

    if (!cleanKm || !cleanEn) {
      setError(
        isKhmer
          ? 'សូមបញ្ចូលចំណងជើងមេរៀនទាំងភាសាខ្មែរ និងអង់គ្លេស'
          : 'Please enter lesson titles in both Khmer and English'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 1. Update in local store & Supabase
      const updated = await updateLessonTitle(lesson.id, cleanKm, cleanEn);
      const staff = getCurrentStaffSession();

      // 2. Dispatch success activity notification / toast banner
      await recordActivityNotification({
        actionType: 'video_edit',
        subject,
        grade,
        lessonId: lesson.id,
        actorName: staff?.fullNameKm || (isKhmer ? 'គណៈគ្រប់គ្រង' : 'Admin Staff'),
        actorRole: staff?.role || 'subject_lead',
        titleKm: 'បានកែសម្រួលមេរៀនជោគជ័យ',
        titleEn: 'Lesson updated successfully',
        messageKm: `បានកែសម្រួលចំណងជើងមេរៀន «${cleanKm}» នៃមុខវិជ្ជា ${subjectMeta.nameKm} ថ្នាក់ទី ${grade}`,
        messageEn: `Updated lesson title to "${cleanEn}" for Grade ${grade} ${subjectMeta.nameEn}`,
      });

      if (updated) {
        onLessonUpdated(updated);
      } else {
        onLessonUpdated({
          ...lesson,
          titleKm: cleanKm,
          titleEn: cleanEn,
        });
      }

      onClose();
    } catch (err: any) {
      console.error('Error updating lesson:', err);
      if (err?.message === '403_FORBIDDEN' || err?.code === '42501' || err?.status === 403) {
        setError(
          isKhmer
            ? 'ការអនុញ្ញាតត្រូវបានបដិសេធ (403 Forbidden)៖ លោកអ្នកមិនមានសិទ្ធិកែប្រែមេរៀនក្នុងមុខវិជ្ជានេះទេ'
            : 'Access Forbidden (403): You do not have permission to modify lessons in this subject.'
        );
      } else {
        setError(
          isKhmer
            ? 'មានបញ្ហាក្នុងការកែសម្រួលមេរៀន សូមព្យាយាមម្តងទៀត'
            : 'Failed to update lesson. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {isKhmer ? 'កែសម្រួលចំណងជើងមេរៀន' : 'Edit Lesson Title'}
              </h3>
              <p className="text-xs text-amber-100 flex items-center gap-1.5 mt-0.5">
                <span className="font-bold">{subjectMeta.code}</span>
                <span>•</span>
                <span>
                  {isKhmer ? 'ថ្នាក់ទី' : 'Grade'} {grade}
                </span>
                <span>•</span>
                <span className="font-mono text-[11px] opacity-80">#{lesson.orderIndex}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            aria-label={isKhmer ? 'បិទផ្ទាំង' : 'Close modal'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Lesson Metadata Banner */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {isKhmer ? 'លេខសម្គាល់មេរៀន (Lesson ID):' : 'Lesson ID:'}
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {lesson.id}
            </span>
          </div>

          {/* Khmer Title */}
          <div>
            <label
              htmlFor="edit-lesson-title-km"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {isKhmer ? 'ចំណងជើងមេរៀន (ភាសាខ្មែរ)' : 'Lesson Title (Khmer)'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-lesson-title-km"
              type="text"
              value={titleKm}
              onChange={(e) => setTitleKm(e.target.value)}
              placeholder="ឧទាហរណ៍៖ ចំនួនគត់ ឬ សមីការដឺក្រេទី១..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* English Title */}
          <div>
            <label
              htmlFor="edit-lesson-title-en"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {isKhmer ? 'ចំណងជើងមេរៀន (ភាសាអង់គ្លេស)' : 'Lesson Title (English)'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-lesson-title-en"
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Whole Numbers & Integers or Linear Equations..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? isKhmer
                    ? 'កំពុងរក្សាទុក...'
                    : 'Saving...'
                  : isKhmer
                  ? 'រក្សាទុកការកែប្រែ'
                  : 'Save Changes'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
