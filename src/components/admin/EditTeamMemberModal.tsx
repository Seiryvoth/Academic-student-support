'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Save,
  KeyRound,
  Crown,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import {
  updateTeamMemberApi,
  SubjectTeamMember,
  resolveSubjectCode,
  resolveCanonicalSubjectUuid,
} from '@/lib/team-store';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  member: SubjectTeamMember | null;
  onClose: () => void;
  onSuccess: (updated: SubjectTeamMember) => void;
}

export function EditTeamMemberModal({
  isOpen,
  member,
  onClose,
  onSuccess,
}: EditTeamMemberModalProps) {
  const { isKhmer } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'super_admin' | 'subject_lead' | 'subject_member' | 'student'>(
    'subject_member'
  );
  const [subjectId, setSubjectId] = useState<SubjectId>('math');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-populate / pre-fill the form with member's exact current information
  useEffect(() => {
    if (member && isOpen) {
      setFullName(member.fullName || '');
      setEmail(member.email || '');
      setRole(member.role || 'subject_member');

      const resolved =
        resolveSubjectCode(member.assignedSubjectCode || member.assignedSubjectId) || 'math';
      setSubjectId(resolved);

      // Password left empty by default (only updates if explicitly typed in)
      setNewPassword('');
      setShowPassword(false);
      setError(null);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError(
        isKhmer ? 'សូមបញ្ចូលគោត្តនាម និងនាម' : 'Full name is required'
      );
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError(
        isKhmer ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ' : 'Valid email is required'
      );
      return;
    }

    if (newPassword && newPassword.trim().length > 0 && newPassword.trim().length < 6) {
      setError(
        isKhmer
          ? 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ'
          : 'New password must be at least 6 characters'
      );
      return;
    }

    setLoading(true);

    try {
      const cleanSubjectId = resolveCanonicalSubjectUuid(subjectId, role);

      const updated = await updateTeamMemberApi({
        user_id: member.id,
        full_name: cleanName,
        email: cleanEmail,
        role: role,
        assigned_subject_id: cleanSubjectId,
        subject_code: role === 'super_admin' ? undefined : subjectId,
        password: newPassword && newPassword.trim().length >= 6 ? newPassword.trim() : undefined,
      });

      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentSubjectMeta = subjectId ? SUBJECTS[subjectId] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {isKhmer ? 'កែសម្រួលគណនីសមាជិក' : 'Edit Team Member Account'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 uppercase">
                  {member.role === 'super_admin'
                    ? 'Super Admin'
                    : member.role === 'subject_lead'
                    ? 'Lead'
                    : 'Member'}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5 font-mono truncate max-w-xs">
                {member.email}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Full Name */}
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
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* 2. Email Address */}
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
                placeholder="member@moeys.gov.kh"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* 3. Role and Subject Selection Row */}
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
                    e.target.value as 'super_admin' | 'subject_lead' | 'subject_member' | 'student'
                  )
                }
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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

            {/* Assigned Subject */}
            {role !== 'super_admin' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isKhmer ? 'មុខវិជ្ជាទទួលខុសត្រូវ' : 'Assigned Subject'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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

          {/* 4. Reset Password Field (Optional - Left empty by default) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {isKhmer
                    ? 'កំណត់ពាក្យសម្ងាត់ថ្មី (ជាជម្រើស)'
                    : 'New Password / Reset Password (Optional)'}
                </span>
              </label>
              <span className="text-[10px] text-slate-400">
                {isKhmer ? 'ទុកចោលទទេបើមិនប្តូរ' : 'Leave empty to keep current'}
              </span>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={
                  isKhmer
                    ? '•••••••• (បញ្ចូលតែពេលចង់ផ្លាស់ប្តូរពាក្យសម្ងាត់)'
                    : '•••••••• (Only enter if changing password)'
                }
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
            <p className="text-[11px] text-slate-400">
              {isKhmer
                ? 'ប្រសិនបើទុកទទេ ប្រព័ន្ធនឹងរក្សាទុកពាក្យសម្ងាត់ចាស់ដដែល។ ប្រសិនបើបញ្ចូល ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។'
                : 'Left empty by default; only updates Supabase Auth password if filled in (min 6 characters).'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isKhmer ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isKhmer ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
