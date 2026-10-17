'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { deleteTeamMemberApi, SubjectTeamMember } from '@/lib/team-store';
import { getCurrentStaffSession } from '@/lib/data-store';

interface DeleteTeamMemberDialogProps {
  isOpen: boolean;
  member: SubjectTeamMember | null;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteTeamMemberDialog({
  isOpen,
  member,
  onClose,
  onSuccess,
}: DeleteTeamMemberDialogProps) {
  const { isKhmer } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !member) return null;

  const currentStaff = getCurrentStaffSession();
  const isSelf =
    (currentStaff && currentStaff.email.toLowerCase() === member.email.toLowerCase()) ||
    (currentStaff && currentStaff.id === member.id);

  const handleDelete = async () => {
    if (isSelf) {
      setError(
        isKhmer
          ? 'មិនអាចលុបគណនី Super Admin ផ្ទាល់ខ្លួនរបស់អ្នកបានឡើយ!'
          : 'You cannot delete your own active Super Admin account!'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteTeamMemberApi(member.id);
      onSuccess(member.id);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown deletion error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Danger Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-rose-600 to-red-700 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {isKhmer ? 'បញ្ជាក់ការលុបគណនី' : 'Confirm Account Deletion'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {isKhmer ? 'សកម្មភាពអចិន្ត្រៃយ៍ និងមិនអាចត្រឡប់ក្រោយបាន' : 'Permanent & Irreversible Action'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isSelf ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isKhmer ? 'ការការពារគណនីផ្ទាល់ខ្លួន (Self-Deletion Guard)' : 'Self-Deletion Protection Active'}
                </p>
                <p className="mt-1">
                  {isKhmer
                    ? 'នេះជាគណនីដែលអ្នកកំពុងប្រើប្រាស់ចូលក្នុងប្រព័ន្ធ។ អ្នកមិនអាចលុបគណនីរបស់ខ្លួនឯងបានទេ។'
                    : 'This is your active logged-in Super Admin account. Deleting yourself is strictly prohibited.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isKhmer ? (
                  <>
                    តើអ្នកពិតជាចង់លុបគណនីសមាជិកក្រុម <strong className="text-rose-600 dark:text-rose-400 font-bold">{member.fullName}</strong> (<span className="text-slate-500 font-mono text-xs">{member.email}</span>) នេះជាអចិន្ត្រៃយ៍មែនទេ?
                  </>
                ) : (
                  <>
                    Are you sure you want to permanently remove <strong className="text-rose-600 dark:text-rose-400 font-bold">{member.fullName}</strong> (<span className="text-slate-500 font-mono text-xs">{member.email}</span>)?
                  </>
                )}
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>{isKhmer ? 'ផលប៉ះពាល់នៃការលុប៖' : 'Impact of this deletion:'}</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
                  <li>{isKhmer ? 'គណនី Supabase Auth នឹងត្រូវលុបជាស្ថាពរ' : 'Supabase Auth account will be permanently erased'}</li>
                  <li>{isKhmer ? 'ទិន្នន័យប្រវត្តិរូប (profiles) នឹងត្រូវលុបតាមរយៈ ON DELETE CASCADE' : 'Profile record will cascade-delete immediately'}</li>
                  <li>{isKhmer ? 'សមាជិកនឹងបាត់បង់សិទ្ធិចូលគ្រប់គ្រងមេរៀន និងលំហាត់ភ្លាមៗ' : 'Member will immediately lose all staff access permissions'}</li>
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            {!isSelf && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isKhmer ? 'កំពុងលុប...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isKhmer ? 'បាទ/ចាស លុបគណនី' : 'Yes, Delete Account'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
