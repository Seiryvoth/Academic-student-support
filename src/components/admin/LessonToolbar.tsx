'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { SubjectId, GradeLevel, LessonItem } from '@/lib/curriculum-data';
import { getCurrentStaffSession, canManageSubject, StaffAccount } from '@/lib/data-store';
import { useLanguage } from '@/context/language-context';

export interface LessonToolbarProps {
  selectedLesson: LessonItem | null;
  subject: SubjectId;
  grade: GradeLevel;
  onAddClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  className?: string;
}

/**
 * Hook to reactively track whether current session has permission to manage lessons for this subject
 */
export function useCanManageLessons(subject: SubjectId): boolean {
  const [staff, setStaff] = useState<StaffAccount | null>(null);

  useEffect(() => {
    setStaff(getCurrentStaffSession());

    const handleAuthChange = () => {
      setStaff(getCurrentStaffSession());
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('moeys_staff_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('moeys_staff_auth_changed', handleAuthChange);
    };
  }, []);

  return canManageSubject(staff, subject);
}

export const LessonToolbar: React.FC<LessonToolbarProps> = ({
  selectedLesson,
  subject,
  grade,
  onAddClick,
  onEditClick,
  onDeleteClick,
  className = '',
}) => {
  const { isKhmer } = useLanguage();
  const canManageLessons = useCanManageLessons(subject);

  // STRICT CONDITIONAL RENDERING:
  // For users with the student role or unauthenticated public visitors,
  // these control buttons must NEVER be rendered into the DOM.
  if (!canManageLessons) {
    return null;
  }

  const hasSelectedLesson = !!selectedLesson;

  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/90 backdrop-blur-xs shadow-xs ${className}`}
      role="toolbar"
      aria-label={isKhmer ? 'របារគ្រប់គ្រងមេរៀន' : 'Lesson Action Controls'}
    >
      {/* 1. Add Button (+) -> Triggers Create Lesson Modal */}
      <button
        type="button"
        onClick={onAddClick}
        className="h-8 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
        title={isKhmer ? 'បង្កើតមេរៀនថ្មី (+)' : 'Add New Lesson (+)'}
        aria-label={isKhmer ? 'បង្កើតមេរៀនថ្មី' : 'Add New Lesson'}
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isKhmer ? 'បន្ថែម' : 'Add'}</span>
      </button>

      {/* 2. Edit Button (✏️) -> Disabled when no lesson is actively selected */}
      <button
        type="button"
        onClick={hasSelectedLesson ? onEditClick : undefined}
        disabled={!hasSelectedLesson}
        title={
          hasSelectedLesson
            ? isKhmer
              ? `កែសម្រួលមេរៀន៖ ${selectedLesson?.titleKm}`
              : `Edit lesson: ${selectedLesson?.titleEn}`
            : isKhmer
            ? 'សូមជ្រើសរើសមេរៀនជាមុនសិន'
            : 'Please select a lesson first'
        }
        aria-label={isKhmer ? 'កែសម្រួលមេរៀន' : 'Edit Lesson'}
        className={`h-8 px-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all ${
          hasSelectedLesson
            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-600 shadow-xs cursor-pointer active:scale-95'
            : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border border-transparent opacity-60 cursor-not-allowed'
        }`}
      >
        <Pencil className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isKhmer ? 'កែ' : 'Edit'}</span>
      </button>

      {/* 3. Delete Button (🗑️) -> Disabled when no lesson is actively selected; styled with subtle red warning tone */}
      <button
        type="button"
        onClick={hasSelectedLesson ? onDeleteClick : undefined}
        disabled={!hasSelectedLesson}
        title={
          hasSelectedLesson
            ? isKhmer
              ? `លុបមេរៀន៖ ${selectedLesson?.titleKm}`
              : `Delete lesson: ${selectedLesson?.titleEn}`
            : isKhmer
            ? 'សូមជ្រើសរើសមេរៀនជាមុនសិន'
            : 'Please select a lesson first'
        }
        aria-label={isKhmer ? 'លុបមេរៀន' : 'Delete Lesson'}
        className={`h-8 px-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all ${
          hasSelectedLesson
            ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs cursor-pointer active:scale-95'
            : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border border-transparent opacity-60 cursor-not-allowed'
        }`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isKhmer ? 'លុប' : 'Delete'}</span>
      </button>
    </div>
  );
};
