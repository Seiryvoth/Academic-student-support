'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowLeft,
  Crown,
  UserCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import { getCurrentStaffSession, setCurrentStaffSession, StaffAccount } from '@/lib/data-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  SubjectTeamMember,
  getStoredTeamMembers,
  saveStoredTeamMembers,
  fetchTeamFromApi,
  fetchTeamMemberByIdApi,
  resolveSubjectCode,
} from '@/lib/team-store';
import { SubjectTeamCard } from '@/components/admin/SubjectTeamCard';
import { AddTeamMemberModal } from '@/components/admin/AddTeamMemberModal';
import { EditTeamMemberModal } from '@/components/admin/EditTeamMemberModal';
import { DeleteTeamMemberDialog } from '@/components/admin/DeleteTeamMemberDialog';

export default function TeamManagementPage() {
  const router = useRouter();
  const { t, isKhmer } = useLanguage();

  // Authentication State
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Team Data
  const [members, setMembers] = useState<SubjectTeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalSubject, setAddModalSubject] = useState<SubjectId | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SubjectTeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<SubjectTeamMember | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Immediate Re-fetch: Queries profiles handling both client and server side properly,
  // logs any Supabase RLS error to the console, and refreshes the live state.
  const loadFromApi = async () => {
    setIsRefreshing(true);
    try {
      // 1. Client-side profile query:
      // const { data, error } = await supabase.from('profiles').select('*');
      if (typeof window !== 'undefined' && isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('profiles').select('*');
          if (error) {
            console.error('[Supabase RLS Error] Failed to fetch profiles from client:', error.message, error);
          } else if (Array.isArray(data)) {
            console.log('[Supabase Client] Successfully fetched profiles:', data.length);
          }
        } catch (clientErr) {
          console.error('[Supabase Client Error] Unexpected error querying profiles:', clientErr);
        }
      }

      // 2. Fetch via team API (handles server-side admin context, merges client profiles, and updates store)
      const result = await fetchTeamFromApi();
      if (Array.isArray(result.users)) {
        setMembers(result.users);
      }
    } catch (err) {
      console.warn('API sync notice:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auth Guard: Load session from local storage AND cross-verify Supabase Auth session
  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndSession() {
      let session = getCurrentStaffSession();

      // Cross-verify with active Supabase Auth session
      if (typeof window !== 'undefined' && isSupabaseConfigured && supabase) {
        try {
          const { data: { session: supaSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.error('[Supabase Auth Error] Error fetching session:', sessionError.message);
          } else if (supaSession?.user) {
            // Also query profile for the active session user
            const { data: profile, error: profErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supaSession.user.id)
              .maybeSingle();

            if (profErr) {
              console.error('[Supabase RLS Error] Failed to fetch user profile:', profErr.message, profErr);
            }

            const rawRole = (
              profile?.role ||
              supaSession.user.user_metadata?.role ||
              (supaSession.user.email?.toLowerCase().includes('admin') ? 'super_admin' : 'subject_member')
            ).toString().trim().toLowerCase();

            const role = rawRole === 'super_admin' || rawRole === 'admin' ? 'super_admin' : (rawRole as any);

            const activeStaff: StaffAccount = {
              id: supaSession.user.id,
              email: supaSession.user.email || '',
              fullNameKm: profile?.full_name || supaSession.user.user_metadata?.full_name || supaSession.user.email || 'Super Admin',
              fullNameEn: profile?.full_name || supaSession.user.user_metadata?.full_name || supaSession.user.email || 'Super Admin',
              role: role,
              subjectAssigned: profile?.assigned_subject_id || null,
              isActive: true,
              createdAt: supaSession.user.created_at || new Date().toISOString(),
            };

            if (!session || session.email.toLowerCase() !== activeStaff.email.toLowerCase()) {
              session = activeStaff;
              setCurrentStaffSession(activeStaff);
            }
          }
        } catch (err) {
          console.warn('Auth session check notice:', err);
        }
      }

      if (isMounted) {
        setCurrentStaff(session);
        setAuthChecked(true);
      }
    }

    checkAuthAndSession();

    const handleAuthChange = () => {
      const updated = getCurrentStaffSession();
      setCurrentStaff(updated);
    };

    window.addEventListener('moeys_staff_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    // Listen to Supabase auth state changes if client is configured
    let authListener: any = null;
    if (typeof window !== 'undefined' && isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkAuthAndSession();
          await loadFromApi();
        } else if (event === 'SIGNED_OUT') {
          setCurrentStaff(null);
        }
      });
      authListener = data?.subscription;
    }

    return () => {
      isMounted = false;
      window.removeEventListener('moeys_staff_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  // Immediate Refresh / Re-fetch:
  // 1. Immediately on page load (initial mount)
  useEffect(() => {
    // Instant local cache load
    setMembers(getStoredTeamMembers());

    // Immediate fetch on mount
    loadFromApi();

    const handleTeamUpdate = () => {
      setMembers(getStoredTeamMembers());
    };
    window.addEventListener('moeys-team-updated', handleTeamUpdate);
    return () => {
      window.removeEventListener('moeys-team-updated', handleTeamUpdate);
    };
  }, []);

  // 2. Immediately after session authentication is verified
  useEffect(() => {
    if (authChecked) {
      loadFromApi();
    }
  }, [authChecked, currentStaff?.email, currentStaff?.role]);

  // Refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchTeamFromApi();
      if (Array.isArray(result.users)) {
        setMembers(result.users);
      }
      showToast(
        'success',
        isKhmer ? 'បានធ្វើបច្ចុប្បន្នភាពទិន្នន័យជោគជ័យ' : 'Team data refreshed successfully'
      );
    } catch {
      showToast(
        'error',
        isKhmer ? 'បរាជ័យក្នុងការទាញទិន្នន័យពីម៉ាស៊ីនបម្រើ' : 'Failed to refresh from server'
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtered members with case-insensitive role & search matching
  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const targetRole = roleFilter.trim().toLowerCase();

    return members.filter((m) => {
      const name = (m.fullName || m.email || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      const matchesSearch = q === '' || name.includes(q) || email.includes(q);

      const mRole = (m.role || '').trim().toLowerCase();
      const matchesRole = targetRole === 'all' || mRole === targetRole;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // Group members dynamically by subject (Subject Leads first, then Subject Members)
  const membersBySubject = useMemo(() => {
    const grouped: Record<SubjectId, SubjectTeamMember[]> = {
      math: [],
      physics: [],
      chemistry: [],
      biology: [],
      english: [],
    };

    filteredMembers.forEach((m) => {
      const mRole = (m.role || '').trim().toLowerCase();
      const code = resolveSubjectCode(m.assignedSubjectCode || m.assignedSubjectId);
      if (code && code in grouped && mRole !== 'super_admin') {
        grouped[code].push({
          ...m,
          assignedSubjectCode: code,
        });
      }
    });

    // Sort: Leads first ('subject_lead'), then Members ('subject_member')
    Object.keys(grouped).forEach((key) => {
      const subjKey = key as SubjectId;
      grouped[subjKey].sort((a, b) => {
        const roleA = (a.role || '').trim().toLowerCase();
        const roleB = (b.role || '').trim().toLowerCase();
        if (roleA === 'subject_lead' && roleB !== 'subject_lead') return -1;
        if (roleA !== 'subject_lead' && roleB === 'subject_lead') return 1;
        const nameA = a.fullName || a.email || '';
        const nameB = b.fullName || b.email || '';
        return nameA.localeCompare(nameB);
      });
    });

    return grouped;
  }, [filteredMembers]);

  // Super admins or unassigned staff (Case-insensitive & whitespace-trimmed role filtering)
  const unassignedAndSuperAdmins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const targetRole = roleFilter.trim().toLowerCase();

    // Exact role filtering: profiles.filter(p => p.role?.toLowerCase() === 'super_admin')
    const list = members
      .filter((p) => {
        const cleanRole = (p.role || '').toString().trim().toLowerCase();
        if (cleanRole === 'super_admin' || cleanRole === 'admin') return true;
        const code = resolveSubjectCode(p.assignedSubjectCode || p.assignedSubjectId);
        return !code || !(code in SUBJECTS);
      })
      .filter((m) => {
        const name = (m.fullName || m.email || '').toLowerCase();
        const email = (m.email || '').toLowerCase();
        const matchesSearch = q === '' || name.includes(q) || email.includes(q);

        const cleanRole = (m.role || '').toString().trim().toLowerCase();
        const matchesRole =
          targetRole === 'all' ||
          targetRole === 'super_admin' ||
          cleanRole === targetRole;

        return matchesSearch && matchesRole;
      });

    // Fallback: If DB query returned 0 super admins, but the active logged-in staff is a verified Super Admin
    const activeStaffRole = (currentStaff?.role || '').toString().trim().toLowerCase();
    const isActiveAdmin = activeStaffRole === 'super_admin' || activeStaffRole === 'admin';
    if (list.length === 0 && isActiveAdmin && currentStaff?.email) {
      const emailMatch = q === '' || currentStaff.email.toLowerCase().includes(q);
      const roleMatch = targetRole === 'all' || targetRole === 'super_admin' || targetRole === 'admin';
      if (emailMatch && roleMatch) {
        const activeAdminAccount: SubjectTeamMember = {
          id: currentStaff.id || 'current-super-admin',
          email: currentStaff.email,
          fullName: (currentStaff.fullNameKm || currentStaff.fullNameEn || currentStaff.email).trim() || currentStaff.email,
          role: 'super_admin',
          assignedSubjectId: null,
          assignedSubjectCode: null,
          createdAt: currentStaff.createdAt || new Date().toISOString(),
        };
        return [activeAdminAccount];
      }
    }

    return list;
  }, [members, searchQuery, roleFilter, currentStaff]);

  // Statistics
  const stats = useMemo(() => {
    const leads = members.filter((m) => (m.role || '').toString().trim().toLowerCase() === 'subject_lead').length;
    const teamMembers = members.filter((m) => (m.role || '').toString().trim().toLowerCase() === 'subject_member').length;
    const supers = unassignedAndSuperAdmins.length;
    const total = Math.max(members.length, supers + leads + teamMembers);
    return { total, leads, teamMembers, supers };
  }, [members, unassignedAndSuperAdmins]);

  // Handlers for Modals
  const handleOpenAddForSubject = (subjectId: SubjectId) => {
    setAddModalSubject(subjectId);
    setAddModalOpen(true);
  };

  const handleOpenGlobalAdd = () => {
    setAddModalSubject(null);
    setAddModalOpen(true);
  };

  // Edit action with instant pre-filling and background freshest fetch
  const handleOpenEdit = async (member: SubjectTeamMember) => {
    // 1. Instantly populate the Edit modal with that user's exact current information
    setEditingMember(member);
    setEditModalOpen(true);

    // 2. Fetch freshest profile in background to guarantee zero staleness
    try {
      const fresh = await fetchTeamMemberByIdApi(member.id);
      if (fresh) {
        setEditingMember(fresh);
      }
    } catch {
      // Keep existing data if network error
    }
  };

  const handleOpenDelete = (member: SubjectTeamMember) => {
    setDeletingMember(member);
    setDeleteDialogOpen(true);
  };

  // Dynamic UI updates and live Supabase state refresh
  const handleAddSuccess = async (newMember: SubjectTeamMember) => {
    setMembers((prev) => [
      newMember,
      ...prev.filter(
        (m) =>
          m.id !== newMember.id &&
          m.email.toLowerCase() !== newMember.email.toLowerCase()
      ),
    ]);
    showToast(
      'success',
      isKhmer
        ? `បានបង្កើតគណនី "${newMember.fullName}" ដោយជោគជ័យ!`
        : `Account for "${newMember.fullName}" created successfully!`
    );

    // Refresh live Supabase state
    try {
      const refreshed = await fetchTeamFromApi();
      if (Array.isArray(refreshed.users)) {
        setMembers(refreshed.users);
      }
    } catch {
      // optimistic update retained
    }
  };

  const handleEditSuccess = async (updated: SubjectTeamMember) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
    );
    showToast(
      'success',
      isKhmer
        ? `បានកែសម្រួលគណនី "${updated.fullName}" ដោយជោគជ័យ!`
        : `Account "${updated.fullName}" updated successfully!`
    );

    // Refresh live Supabase state
    try {
      const refreshed = await fetchTeamFromApi();
      if (Array.isArray(refreshed.users)) {
        setMembers(refreshed.users);
      }
    } catch {
      // optimistic update retained
    }
  };

  const handleDeleteSuccess = async (deletedId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== deletedId));
    showToast(
      'success',
      isKhmer ? 'បានលុបគណនីជាអចិន្ត្រៃយ៍!' : 'Account permanently removed!'
    );

    // Refresh live Supabase state
    try {
      const refreshed = await fetchTeamFromApi();
      if (Array.isArray(refreshed.users)) {
        setMembers(refreshed.users);
      }
    } catch {
      // optimistic update retained
    }
  };

  // 1. Initial Loading Screen
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            {isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់សិទ្ធិ...' : 'Verifying permissions...'}
          </p>
        </div>
      </div>
    );
  }

  // 2. Strict Security Guardrail: Non-Super-Admin or Unauthenticated User
  const isSuperAdmin = currentStaff?.role === 'super_admin';
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isKhmer ? 'ការចូលប្រើប្រាស់ត្រូវបានបដិសេធ' : 'Access Restricted'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {isKhmer
              ? 'ទំព័រគ្រប់គ្រងក្រុមការងារមុខវិជ្ជា និងគណនីនេះ ត្រូវបានអនុញ្ញាតសម្រាប់តែអ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Super Admin) នៃក្រសួងអប់រំប៉ុណ្ណោះ។'
              : 'This module is strictly restricted to Super Administrators. Please sign in with an authorized Super Admin account.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isKhmer ? 'ចូលប្រព័ន្ធគ្រូ' : 'Staff Login'}</span>
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isKhmer ? 'ទំព័រដើម' : 'Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Super Admin Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-500/95 text-white border-emerald-400 shadow-emerald-500/20'
                : 'bg-rose-500/95 text-white border-rose-400 shadow-rose-500/20'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="relative border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Background Decorative Gradient Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isKhmer ? 'ត្រឡប់ទៅផ្ទាំងគ្រូ (Dashboard)' : 'Back to Dashboard'}</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isKhmer ? 'Super Admin Mode' : 'Super Admin Mode'}</span>
              </span>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                title={isKhmer ? 'ទាញទិន្នន័យឡើងវិញ' : 'Refresh Data'}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Title & Primary Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isKhmer
                    ? 'គ្រប់គ្រងក្រុមការងារមុខវិជ្ជា & គណនី'
                    : 'Subject Team & Account Management'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {isKhmer
                  ? 'រៀបចំក្រុមការងារតាមដេប៉ាតឺម៉ង់មុខវិជ្ជាទាំង ៥ ចាត់តាំងតួនាទី (Subject Lead / Subject Member) និងគ្រប់គ្រងសិទ្ធិចូលប្រើប្រាស់ប្រព័ន្ធ'
                  : 'Manage subject teams across all 5 curriculum disciplines, configure role assignments, and oversee Supabase Auth credentials.'}
              </p>
            </div>

            {/* Global Add Member CTA */}
            <button
              onClick={handleOpenGlobalAdd}
              className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isKhmer ? '+ បន្ថែមគណនីសមាជិកថ្មី' : '+ Create New Account'}</span>
            </button>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {/* Total Members */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isKhmer ? 'សមាជិកសរុប' : 'Total Accounts'}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {stats.total}
              </span>
            </div>

            {/* Subject Leads */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ប្រធានមុខវិជ្ជា' : 'Subject Leads'}</span>
              </span>
              <span className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1 block">
                {stats.leads}
              </span>
            </div>

            {/* Subject Members */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'សមាជិកក្រុម' : 'Team Members'}</span>
              </span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block">
                {stats.teamMembers}
              </span>
            </div>

            {/* Super Admins */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'Super Admins' : 'Super Admins'}</span>
              </span>
              <span className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1 block">
                {stats.supers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isKhmer
                  ? 'ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល...'
                  : 'Search by name or email...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isKhmer ? 'ទាំងអស់' : 'All Roles'}
            </button>
            <button
              onClick={() => setRoleFilter('subject_lead')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === 'subject_lead'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isKhmer ? 'ប្រធានមុខវិជ្ជា' : 'Subject Leads'}
            </button>
            <button
              onClick={() => setRoleFilter('subject_member')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === 'subject_member'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isKhmer ? 'សមាជិកមុខវិជ្ជា' : 'Members'}
            </button>
            <button
              onClick={() => setRoleFilter('super_admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === 'super_admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isKhmer ? 'Super Admin' : 'Super Admins'}
            </button>
          </div>
        </div>

        {/* 1. Super Administrators Card (Universal Cross-Subject Access) */}
        <div className="bg-white dark:bg-slate-900 border border-blue-200/70 dark:border-blue-900/40 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isKhmer ? 'គណៈគ្រប់គ្រងជាន់ខ្ពស់ (Super Administrators)' : 'Super Administrators'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isKhmer
                    ? 'មានសិទ្ធិអាន និងសរសេរពេញលេញលើគ្រប់មុខវិជ្ជា និងគណនីទាំងអស់'
                    : 'Unrestricted universal read and write access across all 5 subjects and profiles.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {unassignedAndSuperAdmins.length} {isKhmer ? 'គណនី' : 'Accounts'}
              </span>
              <button
                onClick={handleOpenGlobalAdd}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isKhmer ? '+ បន្ថែម Admin' : '+ Add Admin'}</span>
              </button>
            </div>
          </div>

          {unassignedAndSuperAdmins.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isKhmer
                  ? 'មិនទាន់មានគណនី Super Admin ក្នុងមូលដ្ឋានទិន្នន័យនៅឡើយទេ'
                  : 'No Super Admin profiles found in database'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {isKhmer
                  ? 'ចុចប៊ូតុងខាងលើដើម្បីបង្កើតគណនី Super Admin ថ្មីសម្រាប់ចូលគ្រប់គ្រងប្រព័ន្ធ'
                  : 'Click above to create an authorized Super Admin account.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-3 px-6">{isKhmer ? 'ឈ្មោះ' : 'Name'}</th>
                    <th className="py-3 px-6">{isKhmer ? 'អ៊ីមែល' : 'Email'}</th>
                    <th className="py-3 px-6">{isKhmer ? 'សិទ្ធិ' : 'Role'}</th>
                    <th className="py-3 px-6 hidden md:table-cell">{isKhmer ? 'កាលបរិច្ឆេទ' : 'Created Date'}</th>
                    <th className="py-3 px-6 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {unassignedAndSuperAdmins.map((m) => {
                    const isSelf =
                      (currentStaff && currentStaff.email.toLowerCase().trim() === m.email.toLowerCase().trim()) ||
                      (currentStaff && currentStaff.id === m.id);

                    const displayName = (m.fullName || m.email || (isKhmer ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' : 'Super Administrator')).trim();
                    const initials = (displayName.replace(/^(លោក|លោកស្រី|អ្នកគ្រូ|សាស្ត្រាចារ្យ|លោកបណ្ឌិត|Mr\.|Mrs\.|Ms\.|Prof\.|Dr\.)\s*/i, '') || 'SA')
                      .substring(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={m.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/10">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {displayName}
                                </span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                                    {isKhmer ? 'គណនីកំពុងប្រើ' : 'Current Active'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-xs text-slate-600 dark:text-slate-300">
                          {m.email}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            <span>Super Admin</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-xs text-slate-500 hidden md:table-cell">
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                              title={isKhmer ? 'កែសម្រួលគណនី' : 'Edit Member'}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {isSelf ? (
                              <span
                                title={
                                  isKhmer
                                    ? 'គណនីរបស់អ្នកផ្ទាល់ (មិនអាចលុបបានទេ)'
                                    : 'Your active account (cannot delete)'
                                }
                                className="p-1.5 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                              >
                                <Lock className="w-4 h-4" />
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenDelete(m)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title={isKhmer ? 'លុបគណនី' : 'Delete Member'}
                              >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2. Five Core Subject Sections (Grouped Cleanly under respective subjects) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isKhmer
                ? 'ក្រុមការងារតាមដេប៉ាតឺម៉ង់មុខវិជ្ជាទាំង ៥'
                : 'Subject Teams by Curriculum Department'}
            </h2>
          </div>

          {(['math', 'physics', 'chemistry', 'biology', 'english'] as SubjectId[]).map(
            (subjId) => {
              const meta = SUBJECTS[subjId];
              const subjMembers = membersBySubject[subjId] || [];

              return (
                <SubjectTeamCard
                  key={subjId}
                  subject={meta}
                  members={subjMembers}
                  onAddMember={handleOpenAddForSubject}
                  onEditMember={handleOpenEdit}
                  onDeleteMember={handleOpenDelete}
                  currentUserId={currentStaff?.id}
                  currentUserEmail={currentStaff?.email}
                />
              );
            }
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTeamMemberModal
        isOpen={addModalOpen}
        initialSubjectId={addModalSubject}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditTeamMemberModal
        isOpen={editModalOpen}
        member={editingMember}
        onClose={() => {
          setEditModalOpen(false);
          setEditingMember(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <DeleteTeamMemberDialog
        isOpen={deleteDialogOpen}
        member={deletingMember}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingMember(null);
        }}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
