'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { INITIAL_STAFF_ACCOUNTS, getStoredStaff, setCurrentStaffSession, StaffAccount } from '@/lib/data-store';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';

export default function LoginPage() {
  const router = useRouter();
  const { t, isKhmer } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we are running in local development mode
  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_APP_ENV === 'development';

  /**
   * Redirects user based on their role:
   * - Super Admin -> /dashboard (Full cross-subject access)
   * - Subject Lead -> /dashboard?subject=<assigned_subject> (Locked to their specific subject panel)
   */
  const handleRedirectAndSave = (account: StaffAccount) => {
    setCurrentStaffSession(account);

    if (account.role === 'super_admin') {
      router.push('/dashboard');
    } else if (account.role === 'subject_lead' && account.subjectAssigned) {
      router.push(`/dashboard?subject=${account.subjectAssigned}`);
    } else {
      router.push('/dashboard');
    }
  };

  /**
   * Main Login Handler
   * 1. Uses supabase.auth.signInWithPassword to authenticate
   * 2. Queries user_roles table using user_id to fetch role and assigned subject
   * 3. Redirects Super Admin to /dashboard and Subject Leads to their subject panel
   * 4. Handles loading state and comprehensive error reporting
   */
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError(
        isKhmer
          ? 'សូមបញ្ចូលអ៊ីមែលផ្លូវការ MoEYS'
          : 'Please enter your official MoEYS email address'
      );
      return;
    }

    if (!password) {
      setError(
        isKhmer
          ? 'សូមបញ្ចូលពាក្យសម្ងាត់'
          : 'Please enter your password'
      );
      return;
    }

    setLoading(true);

    try {
      const { isSupabaseConfigured, supabase } = await import('@/lib/supabase');

      if (isSupabaseConfigured && supabase) {
        // Step 1: Authenticate with Supabase Auth using signInWithPassword
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        // Step 4: Handle authentication failures
        if (authError) {
          // In local development mode, check if credentials match local demo staff accounts
          // to allow testing without needing pre-seeded auth.users:
          if (isDevelopment) {
            const allStaff = getStoredStaff();
            const localFound = allStaff.find(
              (acc) => acc.email.toLowerCase() === cleanEmail
            );

            if (localFound) {
              if (!localFound.isActive) {
                setError(
                  isKhmer
                    ? 'គណនីនេះត្រូវបានផ្អាកដំណើរការបណ្ដោះអាសន្ន។ សូមទាក់ទង Super Admin។'
                    : 'This staff account has been deactivated. Please contact the Super Admin.'
                );
                setLoading(false);
                return;
              }
              handleRedirectAndSave(localFound);
              setLoading(false);
              return;
            }
          }

          // Format clean, localized error message
          let errMsg = authError.message;
          const lower = authError.message.toLowerCase();

          if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
            errMsg = isKhmer
              ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមពិនិត្យម្ដងទៀត។'
              : 'Invalid email or password. Please verify your credentials.';
          } else if (lower.includes('email not confirmed')) {
            errMsg = isKhmer
              ? 'សូមបញ្ជាក់អ៊ីមែលរបស់អ្នកតាមរយៈតំណភ្ជាប់ដែលបានផ្ញើទៅប្រអប់សំបុត្រជាមុនសិន។'
              : 'Please confirm your email address before logging in.';
          } else if (lower.includes('too many requests')) {
            errMsg = isKhmer
              ? 'ការចូលបរាជ័យច្រើនដងពេក។ សូមរង់ចាំមួយភ្លែតសិន។'
              : 'Too many failed login attempts. Please wait a moment and try again.';
          }

          setError(errMsg);
          setLoading(false);
          return;
        }

        // Step 2: Query user_roles table using user ID
        if (authData?.user) {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();

          if (roleError || !roleData) {
            // Fallback: Check user_roles by email in case user_id was not linked yet
            const { data: roleByEmail } = await supabase
              .from('user_roles')
              .select('*')
              .eq('email', cleanEmail)
              .single();

            const matchedRole = roleData || roleByEmail;

            if (!matchedRole) {
              // Sign out from Supabase if not a registered staff member
              await supabase.auth.signOut();
              setError(
                isKhmer
                  ? 'គណនីរបស់អ្នកមិនមានសិទ្ធិចូលជាគ្រូ ឬគណៈគ្រប់គ្រងក្នុងតារាង user_roles ទេ។ សូមទាក់ទង Super Admin។'
                  : 'Authenticated successfully, but no staff role found in user_roles table. Please contact your Super Administrator.'
              );
              setLoading(false);
              return;
            }

            // Verify if staff account is active
            if (matchedRole.is_active === false) {
              await supabase.auth.signOut();
              setError(
                isKhmer
                  ? 'គណនីនេះត្រូវបានផ្អាកដំណើរការបណ្ដោះអាសន្ន។ សូមទាក់ទង Super Admin។'
                  : 'This staff account has been deactivated. Please contact the Super Admin.'
              );
              setLoading(false);
              return;
            }

            const staffAccount: StaffAccount = {
              id: matchedRole.id || authData.user.id,
              email: matchedRole.email || cleanEmail,
              fullNameKm: matchedRole.full_name || 'គ្រូបង្រៀន MoEYS',
              fullNameEn: matchedRole.full_name || 'MoEYS Staff',
              role: matchedRole.role as 'super_admin' | 'subject_lead',
              subjectAssigned: (matchedRole.subject_assigned as SubjectId) || null,
              isActive: matchedRole.is_active !== false,
              createdAt: matchedRole.created_at || new Date().toISOString(),
            };

            // Step 3: Redirect based on role
            handleRedirectAndSave(staffAccount);
            setLoading(false);
            return;
          }

          // Verify if staff account is active
          if (roleData.is_active === false) {
            await supabase.auth.signOut();
            setError(
              isKhmer
                ? 'គណនីនេះត្រូវបានផ្អាកដំណើរការបណ្ដោះអាសន្ន។ សូមទាក់ទង Super Admin។'
                : 'This staff account has been deactivated. Please contact the Super Admin.'
            );
            setLoading(false);
            return;
          }

          const staffAccount: StaffAccount = {
            id: roleData.id || authData.user.id,
            email: roleData.email || cleanEmail,
            fullNameKm: roleData.full_name || 'គ្រូបង្រៀន MoEYS',
            fullNameEn: roleData.full_name || 'MoEYS Staff',
            role: roleData.role as 'super_admin' | 'subject_lead',
            subjectAssigned: (roleData.subject_assigned as SubjectId) || null,
            isActive: roleData.is_active !== false,
            createdAt: roleData.created_at || new Date().toISOString(),
          };

          // Step 3: Redirect based on role
          handleRedirectAndSave(staffAccount);
          setLoading(false);
          return;
        }
      }
    } catch (err: unknown) {
      console.error('Supabase authentication error:', err);
      setError(
        isKhmer
          ? 'មានបញ្ហាបច្ចេកទេសក្នុងការភ្ជាប់ទៅកាន់ Supabase។ សូមព្យាយាមម្ដងទៀត។'
          : 'A network or server error occurred while connecting to Supabase. Please try again.'
      );
      setLoading(false);
      return;
    }

    // Local fallback when Supabase is not configured:
    const allStaff = getStoredStaff();
    const found = allStaff.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (found) {
      if (!found.isActive) {
        setError(
          isKhmer
            ? 'គណនីនេះត្រូវបានផ្អាកដំណើរការបណ្ដោះអាសន្ន។ សូមទាក់ទង Super Admin។'
            : 'This account has been deactivated. Please contact the Super Admin.'
        );
        setLoading(false);
        return;
      }

      handleRedirectAndSave(found);
    } else {
      setError(
        isKhmer
          ? 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។ សូមពិនិត្យម្ដងទៀត។'
          : 'Invalid email or password. Please verify your credentials.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isKhmer ? 'ច្រកចូលប្រព័ន្ធសម្រាប់គ្រូ និងគណៈគ្រប់គ្រង' : 'Staff & Administration Login'}
        </h1>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {isKhmer
            ? 'សម្រាប់តែ Super Admin និងប្រធានដេប៉ាតឺម៉ង់មុខវិជ្ជាទាំង ៥ នៃ MoEYS ប៉ុណ្ណោះ'
            : 'For Super Administrator and the 5 MoEYS Subject Department Leads only'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Manual Login Form */}
          <form className="space-y-4" onSubmit={handleManualSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isKhmer ? 'អ៊ីមែលផ្លូវការ (MoEYS Email)' : 'MoEYS Official Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@moeys.gov.kh"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all disabled:opacity-60"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isKhmer ? 'ពាក្យសម្ងាត់ (Password)' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{t('staffLogin')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Access for Demo / Testing (DEVELOPMENT ENVIRONMENT ONLY) */}
          {isDevelopment && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isKhmer ? 'គណនីសាកល្បង (Local Dev Only)' : 'Quick Demo Test Accounts (Dev Only)'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                  Dev Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                {isKhmer
                  ? 'ផ្នែកនេះបង្ហាញតែក្នុងពេល local development (npm run dev) ប៉ុណ្ណោះ សម្រាប់សម្រួលដល់ការ test។'
                  : 'This section is only visible during local development for testing purposes.'}
              </p>

              <div className="space-y-2">
                {INITIAL_STAFF_ACCOUNTS.map((acc) => {
                  const isSuper = acc.role === 'super_admin';
                  const subjectMeta = acc.subjectAssigned ? SUBJECTS[acc.subjectAssigned] : null;

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleRedirectAndSave(acc)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-semibold cursor-pointer active:scale-98 ${
                        isSuper
                          ? 'bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-100'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {isSuper ? (
                          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="block truncate font-bold">
                            {isKhmer ? acc.fullNameKm : acc.fullNameEn}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                            {acc.email}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold flex-shrink-0 ${
                          isSuper
                            ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                            : subjectMeta
                            ? `${subjectMeta.badgeBg} ${subjectMeta.badgeText}`
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSuper ? 'Super Admin' : acc.subjectAssigned}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security note footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>
                {isKhmer
                  ? 'ការពារសុវត្ថិភាពដោយប្រព័ន្ធ MoEYS Staff Role-Based Access Control'
                  : 'Secured by MoEYS Staff Role-Based Access Control'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
