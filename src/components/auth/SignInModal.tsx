'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  GraduationCap,
  Shield,
  BookOpen,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import {
  StaffAccount,
  getStoredStaff,
  setCurrentStaffSession,
  INITIAL_STAFF_ACCOUNTS,
} from '@/lib/data-store';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { fetchTeamFromApi } from '@/lib/team-store';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const router = useRouter();
  const { isKhmer } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'super_admin' | 'subject_lead' | 'subject_member' | 'student'>(
    'student'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedirectAndSave = (account: StaffAccount) => {
    login(account);

    if (account.role === 'super_admin') {
      router.push('/admin/team-management');
    } else if (
      (account.role === 'subject_lead' || account.role === 'subject_member') &&
      account.subjectAssigned
    ) {
      router.push(`/dashboard?subject=${account.subjectAssigned}`);
    } else if (account.role === 'student') {
      router.push('/practice');
    } else {
      router.push('/dashboard');
    }

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError(
        isKhmer
          ? 'សូមបញ្ចូលអ៊ីមែល ឬឈ្មោះអ្នកប្រើប្រាស់'
          : 'Please enter your email address or username.'
      );
      return;
    }

    if (!password) {
      setError(
        isKhmer ? 'សូមបញ្ចូលពាក្យសម្ងាត់' : 'Please enter your password.'
      );
      return;
    }

    setLoading(true);

    try {
      let authenticatedUserId: string | null = null;
      let authenticatedEmail = cleanEmail;
      let profileRecord: any = null;

      // 1. Authenticate with Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (authError) {
          // Check if error is invalid credentials or something else
          console.warn('Supabase signIn notice:', authError.message);

          // Check fallback mock/local demo staff accounts in dev mode
          const localStaff = getStoredStaff();
          const localMatch = localStaff.find(
            (s) => s.email.toLowerCase() === cleanEmail
          );

          if (!localMatch) {
            let errMsg = authError.message;
            const lower = authError.message.toLowerCase();
            if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
              errMsg = isKhmer
                ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ។ សូមពិនិត្យម្ដងទៀត។'
                : 'Invalid email or password. Please verify your credentials.';
            } else if (lower.includes('email not confirmed')) {
              errMsg = isKhmer
                ? 'សូមបញ្ជាក់អ៊ីមែលរបស់អ្នកជាមុនសិន។'
                : 'Please verify your email address.';
            }
            setError(errMsg);
            setLoading(false);
            return;
          }

          // If local demo staff matched
          profileRecord = {
            id: localMatch.id,
            email: localMatch.email,
            full_name: localMatch.fullNameKm,
            role: localMatch.role,
            status: localMatch.status || 'approved',
            assigned_subject_id: localMatch.subjectAssigned,
          };
        } else if (authData?.user) {
          authenticatedUserId = authData.user.id;
          authenticatedEmail = authData.user.email || cleanEmail;
        }
      } else {
        // Dev fallback without Supabase
        const localStaff = getStoredStaff();
        const localMatch = localStaff.find(
          (s) => s.email.toLowerCase() === cleanEmail
        );
        if (localMatch) {
          profileRecord = {
            id: localMatch.id,
            email: localMatch.email,
            full_name: localMatch.fullNameKm,
            role: localMatch.role,
            status: localMatch.status || 'approved',
            assigned_subject_id: localMatch.subjectAssigned,
          };
        }
      }

      // 2. Fetch profile from public.profiles or team API to verify status
      if (authenticatedUserId && !profileRecord && supabase) {
        const { data: prof, error: profErr } = await supabase
          .from('profiles')
          .select('*, subjects(code)')
          .eq('id', authenticatedUserId)
          .maybeSingle();

        if (prof) {
          profileRecord = prof;
        }
      }

      // If still not found by ID, attempt lookup via team store / API
      if (!profileRecord) {
        try {
          const teamResult = await fetchTeamFromApi();
          const match = teamResult.users.find(
            (u) =>
              u.email.toLowerCase() === cleanEmail ||
              (authenticatedUserId && u.id === authenticatedUserId)
          );
          if (match) {
            profileRecord = {
              id: match.id,
              email: match.email,
              full_name: match.fullName,
              role: match.role,
              status: match.status,
              assigned_subject_id: match.assignedSubjectId,
              assigned_subject_code: match.assignedSubjectCode,
            };
          }
        } catch {
          // ignore
        }
      }

      // Fallback for demo super_admin:
      if (!profileRecord && cleanEmail === 'admin@moeys.gov.kh') {
        profileRecord = {
          id: authenticatedUserId || 'staff-admin-1',
          email: 'admin@moeys.gov.kh',
          full_name: 'Dr. Chea Sovann',
          role: 'super_admin',
          status: 'approved',
          assigned_subject_id: null,
        };
      }

      if (!profileRecord) {
        setError(
          isKhmer
            ? 'រកមិនឃើញប្រវត្តិរូបគណនីរបស់អ្នកឡើយ។ សូមទាក់ទង Super Admin។'
            : 'User profile not found. Please contact the Super Admin.'
        );
        setLoading(false);
        return;
      }

      const accountStatus = (profileRecord.status || 'approved').toString().toLowerCase();

      // 3. Status Validation
      // A. Block if pending
      if (accountStatus === 'pending') {
        if (isSupabaseConfigured && supabase) {
          await supabase.auth.signOut();
        }
        setError(
          isKhmer
            ? 'គណនីរបស់អ្នកកំពុងរង់ចាំការអនុម័ត / Your account is pending approval.'
            : 'Your account is pending approval. Please wait for Super Admin verification.'
        );
        setLoading(false);
        return;
      }

      // B. Block if rejected
      if (accountStatus === 'rejected') {
        if (isSupabaseConfigured && supabase) {
          await supabase.auth.signOut();
        }
        setError(
          isKhmer
            ? 'គណនីរបស់អ្នកត្រូវបានបដិសេធ / Your account has been rejected.'
            : 'Your account has been rejected. Please contact administration.'
        );
        setLoading(false);
        return;
      }

      // C. Allow login if approved
      const assignedSubj =
        profileRecord.assigned_subject_code ||
        (profileRecord.subjects && profileRecord.subjects.code) ||
        (profileRecord.assigned_subject_id in SUBJECTS
          ? profileRecord.assigned_subject_id
          : null);

      const staffAccount: StaffAccount = {
        id: profileRecord.id || authenticatedUserId || `user-${Date.now()}`,
        email: profileRecord.email || cleanEmail,
        fullNameKm: profileRecord.full_name || 'MoEYS User',
        fullNameEn: profileRecord.full_name || 'MoEYS User',
        role: profileRecord.role || role,
        subjectAssigned:
          profileRecord.role === 'super_admin' || profileRecord.role === 'student'
            ? null
            : assignedSubj,
        isActive: true,
        status: 'approved',
        createdAt: profileRecord.created_at || new Date().toISOString(),
      };

      handleRedirectAndSave(staffAccount);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
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
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {isKhmer ? 'ចូលគណនីប្រព័ន្ធ' : 'Sign In to Account'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {isKhmer
                  ? 'ក្រសួងអប់រំ យុវជន និងកីឡា MoEYS'
                  : 'MoEYS Academic Support System'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  error.includes('pending') || error.includes('រង់ចាំ')
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* 1. Email / Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKhmer ? 'អ៊ីមែល ឬឈ្មោះអ្នកប្រើប្រាស់' : 'Email or Username'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@moeys.gov.kh"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 2. Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKhmer ? 'ពាក្យសម្ងាត់' : 'Password'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isKhmer ? 'ជ្រើសរើសប្រភេទគណនី' : 'Account Type / Role'}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {/* Student */}
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'student'
                      ? 'bg-amber-50 text-amber-700 border-amber-400 dark:bg-amber-950/40 dark:text-amber-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{isKhmer ? 'សិស្ស' : 'Student'}</span>
                </button>

                {/* Member */}
                <button
                  type="button"
                  onClick={() => setRole('subject_member')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'subject_member'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isKhmer ? 'សមាជិក' : 'Member'}</span>
                </button>

                {/* Lead */}
                <button
                  type="button"
                  onClick={() => setRole('subject_lead')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'subject_lead'
                      ? 'bg-blue-50 text-blue-700 border-blue-400 dark:bg-blue-950/40 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>{isKhmer ? 'ប្រធាន' : 'Lead'}</span>
                </button>

                {/* Super Admin */}
                <button
                  type="button"
                  onClick={() => setRole('super_admin')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'super_admin'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>{isKhmer ? 'Admin' : 'Admin'}</span>
                </button>
              </div>
            </div>

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
                    <span>{isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{isKhmer ? 'ចូលគណនី (Sign In)' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Switch to Sign Up */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              {isKhmer ? 'មិនទាន់មានគណនីមែនទេ?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  handleResetAndClose();
                  onSwitchToSignUp();
                }}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1"
              >
                {isKhmer ? 'ចុះឈ្មោះនៅទីនេះ (Sign Up)' : 'Sign up here'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
