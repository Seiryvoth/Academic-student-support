'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  Video,
  FileText,
  FileQuestion,
  ShieldAlert,
} from 'lucide-react';
import { SubjectId, GradeLevel, SUBJECTS, LessonItem } from '@/lib/curriculum-data';
import { deleteLessonCascade, getCurrentStaffSession } from '@/lib/data-store';
import { getStoredVideos, getAttachmentsByVideo, getUnifiedMcqsByLesson } from '@/lib/cms-unified-store';
import { recordActivityNotification } from '@/lib/notifications-store';
import { useLanguage } from '@/context/language-context';

export interface DeleteLessonConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonItem | null;
  subject: SubjectId;
  grade: GradeLevel;
  onLessonDeleted: (deletedId: string) => void;
}

export const DeleteLessonConfirmDialog: React.FC<DeleteLessonConfirmDialogProps> = ({
  isOpen,
  onClose,
  lesson,
  subject,
  grade,
  onLessonDeleted,
}) => {
  const { isKhmer } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute linked cascade impact counts
  const cascadeImpact = useMemo(() => {
    if (!lesson) return { videosCount: 0, attachmentsCount: 0, mcqsCount: 0 };
    const videos = getStoredVideos().filter((v) => v.lesson_id === lesson.id);
    let attachmentsCount = 0;
    videos.forEach((v) => {
      attachmentsCount += getAttachmentsByVideo(v.id).length;
    });
    const mcqs = getUnifiedMcqsByLesson(lesson.id);
    return {
      videosCount: videos.length,
      attachmentsCount,
      mcqsCount: mcqs.length,
    };
  }, [lesson, isOpen]);

  if (!isOpen || !lesson) return null;

  const subjectMeta = SUBJECTS[subject];

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      // 1. Cascade delete in local store & Supabase
      await deleteLessonCascade(lesson.id);
      const staff = getCurrentStaffSession();

      // 2. Dispatch destructive activity notification & toast popup
      await recordActivityNotification({
        actionType: 'video_delete',
        subject,
        grade,
        lessonId: lesson.id,
        actorName: staff?.fullNameKm || (isKhmer ? 'គណៈគ្រប់គ្រង' : 'Admin Staff'),
        actorRole: staff?.role || 'subject_lead',
        titleKm: 'បានលុបមេរៀន និងទិន្នន័យពាក់ព័ន្ធទាំងអស់',
        titleEn: 'Lesson and associated data deleted',
        messageKm: `បានលុបមេរៀន «${lesson.titleKm}» ព្រមទាំងវីដេអូ ឯកសារ PDF និងលំហាត់ MCQ ទាំងអស់ចេញពីប្រព័ន្ធ`,
        messageEn: `Deleted lesson "${lesson.titleEn}" along with all attached videos, PDFs, and MCQs`,
      });

      // 3. Trigger parent state update
      onLessonDeleted(lesson.id);
      onClose();
    } catch (err: any) {
      console.error('Error deleting lesson cascade:', err);
      if (err?.message === '403_FORBIDDEN' || err?.code === '42501' || err?.status === 403) {
        setError(
          isKhmer
            ? 'ការអនុញ្ញាតត្រូវបានបដិសេធ (403 Forbidden)៖ លោកអ្នកមិនមានសិទ្ធិលុបមេរៀនក្នុងមុខវិជ្ជានេះទេ'
            : 'Access Forbidden (403): You do not have permission to delete lessons in this subject.'
        );
      } else {
        setError(
          isKhmer
            ? 'មានបញ្ហាក្នុងការលុបមេរៀន សូមព្យាយាមម្តងទៀត'
            : 'Failed to delete lesson. Please try again.'
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-lesson-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Destructive Warning Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 id="delete-lesson-title" className="font-bold text-lg leading-tight">
                {isKhmer ? 'ការលុបមេរៀន និងទិន្នន័យពាក់ព័ន្ធ (Cascade Delete)' : 'Confirm Cascade Lesson Deletion'}
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                {subjectMeta.code} • {isKhmer ? 'ថ្នាក់ទី' : 'Grade'} {grade} • #{lesson.orderIndex}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer disabled:opacity-50"
            aria-label={isKhmer ? 'បិទផ្ទាំង' : 'Close modal'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Exact Required Warning Callout */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-rose-950 dark:text-rose-200 font-semibold leading-relaxed">
              {isKhmer ? (
                <>
                  «តើអ្នកពិតជាចង់លុបមេរៀននេះមែនទេ? រាល់វីដេអូ ឯកសារ PDF និងលំហាត់ MCQ
                  ទាំងអស់នៅក្នុងមេរៀននេះនឹងត្រូវលុបចោលទាំងស្រុងពីប្រព័ន្ធ!»
                </>
              ) : (
                <>
                  &ldquo;Are you sure? All associated videos, PDFs, and MCQs will be permanently removed!&rdquo;
                </>
              )}
            </div>
          </div>

          {/* Target Lesson Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isKhmer ? 'មេរៀនដែលត្រូវលុប' : 'Lesson to be removed'}
              </span>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {lesson.id}
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {lesson.orderIndex}. {isKhmer ? lesson.titleKm : lesson.titleEn}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isKhmer ? lesson.titleEn : lesson.titleKm}
            </p>
          </div>

          {/* Cascade Impact Statistics */}
          <div className="space-y-1.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isKhmer ? 'ទិន្នន័យដែលនឹងត្រូវលុបស្វ័យប្រវត្តិតាមមេរៀន (ON DELETE CASCADE):' : 'Data that will automatically be cascaded and deleted:'}
            </h5>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <Video className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">
                  {cascadeImpact.videosCount}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isKhmer ? 'វីដេអូ' : 'Videos'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <FileText className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">
                  {cascadeImpact.attachmentsCount}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isKhmer ? 'ឯកសារ PDF' : 'PDF Handouts'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <FileQuestion className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">
                  {cascadeImpact.mcqsCount}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isKhmer ? 'លំហាត់ MCQ' : 'MCQs'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {isDeleting
                  ? isKhmer
                    ? 'កំពុងលុប...'
                    : 'Deleting...'
                  : isKhmer
                  ? 'លុបមេរៀនជាស្ថាពរ'
                  : 'Delete Permanently'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
