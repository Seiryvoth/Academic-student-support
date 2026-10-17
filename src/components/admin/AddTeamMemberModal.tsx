'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import {
  createTeamMemberApi,
  SubjectTeamMember,
  resolveCanonicalSubjectUuid,
} from '@/lib/team-store';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  initialSubjectId?: SubjectId | null;
  onClose: () => void;
  onSuccess: (newMember: SubjectTeamMember) => void;
  onErrorToast?: (message: string) => void;
}

export function AddTeamMemberModal({
  isOpen,
  initialSubjectId = null,
  onClose,
  onSuccess,
  onErrorToast,
}: AddTeamMemberModalProps) {
  const { isKhmer } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'subject_lead' | 'subject_member' | 'super_admin'>(
    'subject_member'
  );
  const [subjectId, setSubjectId] = useState<SubjectId | ''>(initialSubjectId || 'math');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialSubjectId) {
        setSubjectId(initialSubjectId);
        setRole('subject_member');
      } else {
        setSubjectId('math');
        setRole('subject_member');
      }
      setFullName('');
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [isOpen, initialSubjectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      const err = isKhmer
        ? 'សូមបញ្ចូលគោត្តនាម និងនាម'
        : 'Please enter the member’s full name';
      setError(err);
      onErrorToast?.(err);
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = isKhmer
        ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ'
        : 'Please enter a valid email address';
      setError(err);
      onErrorToast?.(err);
      return;
    }

    if (!password || password.length < 6) {
      const err = isKhmer
        ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ'
        : 'Password must be at least 6 characters';
      setError(err);
      onErrorToast?.(err);
      return;
    }

    if (role !== 'super_admin' && !subjectId) {
      const err = isKhmer
        ? 'សូមជ្រើសរើសមុខវិជ្ជាទទួលខុសត្រូវ'
        : 'Please select an assigned subject';
      setError(err);
      onErrorToast?.(err);
      return;
    }

    // Resolve assigned_subject_id to canonical UUID or null
    const canonicalSubjectId = resolveCanonicalSubjectUuid(subjectId, role);

    setLoading(true);

    try {
      const newMember = await createTeamMemberApi({
        full_name: cleanName,
        email: cleanEmail,
        password: password,
        role: role,
        assigned_subject_id: canonicalSubjectId,
        subject_code: role === 'super_admin' ? undefined : (subjectId || undefined),
      });

      onSuccess(newMember);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Add Member Form Submission Error]:', msg);
      setError(msg);
      onErrorToast?.(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentSubjectMeta = subjectId ? SUBJECTS[subjectId as SubjectId] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with decorative accent */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {isKhmer ? 'បន្ថែមសមាជិកក្រុមការងារថ្មី' : 'Add New Team Member'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {currentSubjectMeta
                  ? isKhmer
                    ? `ចាត់តាំងចូលដេប៉ាតឺម៉ង់៖ ${currentSubjectMeta.nameKm} (${currentSubjectMeta.nameEn})`
                    : `Assigning to: ${currentSubjectMeta.nameEn}`
                  : isKhmer
                  ? 'បង្កើតគណនី និងកំណត់សិទ្ធិដំណើរការ'
                  : 'Create account and assign role permissions'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isKhmer ? 'គោត្តនាម និងនាម' : 'Full Name'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isKhmer ? 'ឧ. លោក សុខ វិសាល / Mr. Sok Visal' : 'e.g. Sok Visal'}
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isKhmer ? 'អាសយដ្ឋានអ៊ីមែល MoEYS' : 'Email Address'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isKhmer ? 'ឈ្មោះ@moeys.gov.kh' : 'member@moeys.gov.kh'}
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {isKhmer ? 'ពាក្យសម្ងាត់សុវត្ថិភាព' : 'Initial Password'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isKhmer
                ? 'យ៉ាងតិច ៦ តួអក្សរ (សមាជិកអាចប្តូរពាក្យសម្ងាត់ពេលក្រោយបាន)'
                : 'Min 6 characters (user can change password later)'}
            </p>
          </div>

          {/* Role and Subject row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isKhmer ? 'តួនាទី' : 'Role'} <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as 'subject_lead' | 'subject_member' | 'super_admin'
                  )
                }
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="subject_member">
                  {isKhmer ? 'សមាជិកមុខវិជ្ជា (Subject Member)' : 'Subject Member'}
                </option>
                <option value="subject_lead">
                  {isKhmer ? 'ប្រធានមុខវិជ្ជា (Subject Lead)' : 'Subject Lead'}
                </option>
                <option value="super_admin">
                  {isKhmer ? 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Super Admin)' : 'Super Admin'}
                </option>
              </select>
            </div>

            {/* Subject Selection */}
            {role !== 'super_admin' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isKhmer ? 'មុខវិជ្ជាទទួលខុសត្រូវ' : 'Assigned Subject'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {Object.values(SUBJECTS).map((s) => (
                    <option key={s.id} value={s.id}>
                      {isKhmer ? `${s.nameKm} (${s.nameEn})` : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  {isKhmer ? 'វិសាលភាពសិទ្ធិ' : 'Access Scope'}
                </label>
                <div className="px-3 py-2.5 text-xs rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isKhmer ? 'គ្រប់គ្រងគ្រប់មុខវិជ្ជា (Universal)' : 'Universal MoEYS Access'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isKhmer ? 'កំពុងបង្កើត...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isKhmer ? 'បង្កើតគណនី' : 'Create Account'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
