'use client';

import React, { useState } from 'react';
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
  BookOpen,
  GraduationCap,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const { isKhmer } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'subject_lead' | 'subject_member' | 'student'>('student');
  const [subjectId, setSubjectId] = useState<SubjectId>('math');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError(
        isKhmer
          ? 'សូមបញ្ចូលឈ្មោះពេញ ឬឈ្មោះអ្នកប្រើប្រាស់'
          : 'Please enter your Full Name or Username.'
      );
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError(
        isKhmer
          ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        isKhmer
          ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if ((role === 'subject_lead' || role === 'subject_member') && !subjectId) {
      setError(
        isKhmer
          ? 'សូមជ្រើសរើសមុខវិជ្ជាទទួលខុសត្រូវ'
          : 'Please select an assigned subject for this role.'
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Submit to server-side registration endpoint
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: cleanName,
          email: cleanEmail,
          password: password,
          role: role,
          assigned_subject_id: role === 'student' ? null : subjectId,
          subject_code: role === 'student' ? undefined : subjectId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || (isKhmer ? 'ការចុះឈ្មោះបានបរាជ័យ' : 'Registration failed.'));
      }

      // 2. Also call client-side supabase signUp if configured to sync local client auth session state
      if (typeof window !== 'undefined' && isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signUp({
            email: cleanEmail,
            password: password,
            options: {
              data: {
                full_name: cleanName,
                role: role,
                status: 'pending',
                assigned_subject_id: role === 'student' ? null : subjectId,
                assigned_subject_code: role === 'student' ? null : subjectId,
              },
            },
          });
        } catch {
          // Client SDK signup optional (handled primarily by /api/auth/register)
        }
      }

      // 3. Display required localized confirmation alert
      setSuccessMessage(
        isKhmer
          ? 'ការចុះឈ្មោះបានជោគជ័យ! គណនីរបស់អ្នកកំពុងរង់ចាំការអនុម័តពី Super Admin'
          : 'Registration submitted! Please wait for Super Admin approval.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shrink-0">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                {isKhmer ? 'ចុះឈ្មោះគណនីថ្មី' : 'Create an Account'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {isKhmer
                  ? 'ថ្នាលអប់រំ និងគាំទ្រការសិក្សា MoEYS'
                  : 'MoEYS Academic Learning Platform'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {successMessage ? (
            <div className="py-6 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-4 border-emerald-200 dark:border-emerald-800 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isKhmer ? 'ការចុះឈ្មោះបានសម្រេច' : 'Registration Submitted'}
                </h4>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm leading-relaxed font-medium">
                  {successMessage}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isKhmer
                    ? 'Super Admin នឹងពិនិត្យ និងអនុម័តគណនីរបស់អ្នកក្នុងពេលឆាប់ៗ។ បន្ទាប់ពីការអនុម័ត អ្នកនឹងអាចចូលប្រើប្រាស់បានភ្លាមៗ។'
                    : 'The Super Admin will review and approve your account shortly. Once approved, you will be able to sign in.'}
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onSwitchToSignIn();
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isKhmer ? 'ទៅកាន់ទំព័រចូលគណនី (Sign In)' : 'Go to Sign In'}
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isKhmer ? 'បិទ' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Full Name / Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isKhmer ? 'ឈ្មោះពេញ / ឈ្មោះអ្នកប្រើប្រាស់' : 'Full Name / Username'}
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      isKhmer
                        ? 'ឧ. ជា វណ្ណៈ ឬ vannack.chea'
                        : 'e.g. Chea Vannack or vannack.chea'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 2. Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isKhmer ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@moeys.gov.kh"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 3. Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isKhmer ? 'ពាក្យសម្ងាត់' : 'Password'}
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {isKhmer ? 'យ៉ាងតិច ៦ តួអក្សរ' : 'Min 6 chars'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. Target Role Selector (Super Admin Strictly Disabled) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isKhmer ? 'តួនាទីស្នើសុំ (Target Role)' : 'Requested Role'}
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {/* Student */}
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-amber-50 text-amber-700 border-amber-400 dark:bg-amber-950/40 dark:text-amber-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{isKhmer ? 'សិស្ស' : 'Student'}</span>
                  </button>

                  {/* Subject Member */}
                  <button
                    type="button"
                    onClick={() => setRole('subject_member')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      role === 'subject_member'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isKhmer ? 'សមាជិកមុខវិជ្ជា' : 'Member'}</span>
                  </button>

                  {/* Subject Lead */}
                  <button
                    type="button"
                    onClick={() => setRole('subject_lead')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      role === 'subject_lead'
                        ? 'bg-blue-50 text-blue-700 border-blue-400 dark:bg-blue-950/40 dark:text-blue-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isKhmer ? 'ប្រធានមុខវិជ្ជា' : 'Lead'}</span>
                  </button>

                  {/* Super Admin: Strictly Disabled */}
                  <div
                    className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 flex flex-col items-center justify-center gap-1 opacity-60 cursor-not-allowed select-none"
                    title={
                      isKhmer
                        ? 'គណនី Super Admin មិនអនុញ្ញាតឱ្យចុះឈ្មោះដោយផ្ទាល់ឡើយ'
                        : 'Super Admin accounts cannot be self-registered.'
                    }
                  >
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span className="line-through">{isKhmer ? 'Super Admin' : 'Super Admin'}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {isKhmer
                    ? '🔒 គណនី Super Admin អាចបង្កើតបានតែតាមរយៈអ្នកគ្រប់គ្រងប្រព័ន្ធផ្ទាល់ប៉ុណ្ណោះ។'
                    : '🔒 Super Admin accounts are provisioned exclusively by Ministry administrators.'}
                </p>
              </div>

              {/* 5. Subject Selector (Mandatory for subject_lead & subject_member) */}
              {(role === 'subject_lead' || role === 'subject_member') && (
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isKhmer ? 'ជ្រើសរើសមុខវិជ្ជាទទួលខុសត្រូវ' : 'Select Assigned Subject'}
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(SUBJECTS).map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameKm} ({sub.nameEn})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isKhmer
                      ? 'គណនីនេះនឹងត្រូវបានចាត់ចែងក្នុងក្រុមការងារមុខវិជ្ជានេះពេល Super Admin អនុម័ត។'
                      : 'This account will be assigned to this subject team upon approval.'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isKhmer ? 'កំពុងបញ្ជូនទិន្នន័យ...' : 'Submitting Registration...'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{isKhmer ? 'ស្នើសុំចុះឈ្មោះគណនី' : 'Submit Registration'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Switch to Sign In */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                {isKhmer ? 'មានគណនីរួចហើយមែនទេ?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onSwitchToSignIn();
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1"
                >
                  {isKhmer ? 'ចូលគណនីនៅទីនេះ' : 'Sign in here'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
