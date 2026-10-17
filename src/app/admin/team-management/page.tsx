'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  KeyRound,
  Check,
  X,
  Clock,
  GraduationCap,
  BookOpen,
  Mail,
  Calendar,
  Layers,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import { StaffAccount } from '@/lib/data-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  SubjectTeamMember,
  getStoredTeamMembers,
  saveStoredTeamMembers,
  fetchTeamFromApi,
  fetchTeamMemberByIdApi,
  resolveSubjectCode,
  approveUserApi,
  rejectUserApi,
} from '@/lib/team-store';
import { SubjectTeamCard } from '@/components/admin/SubjectTeamCard';
import { AddTeamMemberModal } from '@/components/admin/AddTeamMemberModal';
import { EditTeamMemberModal } from '@/components/admin/EditTeamMemberModal';
import { DeleteTeamMemberDialog } from '@/components/admin/DeleteTeamMemberDialog';
import { ResetPasswordModal } from '@/components/admin/ResetPasswordModal';

export default function TeamManagementPage() {
  const router = useRouter();
  const { isKhmer } = useLanguage();
  const { staffSession, isLoading, isSuperAdmin, isAuthenticated } = useAuth();
  const currentStaff = staffSession;

  // Tab State: 'pending' (Tab A) or 'active' (Tab B)
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');

  // Team Data
  const [members, setMembers] = useState<SubjectTeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalSubject, setAddModalSubject] = useState<SubjectId | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SubjectTeamMember | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordMember, setResetPasswordMember] = useState<SubjectTeamMember | null>(null);
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

  const loadFromApi = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchTeamFromApi();
      if (Array.isArray(result.users)) {
        setMembers(result.users);
      }
    } catch (err) {
      console.error('Supabase Error Details:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auth Guard: Only redirect when isLoading transitions from true to false and user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Initial load when super admin status is verified
  useEffect(() => {
    if (isSuperAdmin) {
      setMembers(getStoredTeamMembers());
      loadFromApi();
    }
  }, [isSuperAdmin, loadFromApi]);

  // Listen to local team store updates
  useEffect(() => {
    const handleTeamUpdate = () => {
      setMembers(getStoredTeamMembers());
    };
    window.addEventListener('moeys-team-updated', handleTeamUpdate);
    return () => {
      window.removeEventListener('moeys-team-updated', handleTeamUpdate);
    };
  }, []);

  // Derived: Pending requests vs Active accounts
  const pendingMembers = useMemo(() => {
    return members.filter((m) => m.status === 'pending');
  }, [members]);

  const activeMembers = useMemo(() => {
    return members.filter((m) => m.status === 'approved' || !m.status);
  }, [members]);

  // Filtered Pending list based on search
  const filteredPending = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pendingMembers;
    return pendingMembers.filter((m) => {
      const name = (m.fullName || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [pendingMembers, searchQuery]);

  // Filtered Active list based on search and role
  const filteredActive = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const targetRole = roleFilter.trim().toLowerCase();

    return activeMembers.filter((m) => {
      const name = (m.fullName || m.email || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      const matchesSearch = q === '' || name.includes(q) || email.includes(q);

      const mRole = (m.role || '').trim().toLowerCase();
      const matchesRole = targetRole === 'all' || mRole === targetRole;

      return matchesSearch && matchesRole;
    });
  }, [activeMembers, searchQuery, roleFilter]);

  // Super admins list
  const activeSuperAdmins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const targetRole = roleFilter.trim().toLowerCase();

    const list = activeMembers
      .filter((p) => {
        const cleanRole = (p.role || '').toString().trim().toLowerCase();
        return cleanRole === 'super_admin' || cleanRole === 'admin';
      })
      .filter((m) => {
        const name = (m.fullName || m.email || '').toLowerCase();
        const email = (m.email || '').toLowerCase();
        const matchesSearch = q === '' || name.includes(q) || email.includes(q);
        const matchesRole =
          targetRole === 'all' || targetRole === 'super_admin' || targetRole === 'admin';
        return matchesSearch && matchesRole;
      });

    // Fallback: If DB query returned 0 super admins, but logged in user is Super Admin
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
          status: 'approved',
          assignedSubjectId: null,
          assignedSubjectCode: null,
          createdAt: currentStaff.createdAt || new Date().toISOString(),
        };
        return [activeAdminAccount];
      }
    }

    return list;
  }, [activeMembers, searchQuery, roleFilter, currentStaff]);

  // Grouped active members by subject (Leads & Members only)
  const activeBySubject = useMemo(() => {
    const grouped: Record<SubjectId, SubjectTeamMember[]> = {
      math: [],
      physics: [],
      chemistry: [],
      biology: [],
      english: [],
    };

    filteredActive.forEach((m) => {
      const mRole = (m.role || '').trim().toLowerCase();
      if (mRole === 'subject_lead' || mRole === 'subject_member') {
        const code = resolveSubjectCode(m.assignedSubjectCode || m.assignedSubjectId);
        if (code && code in grouped) {
          grouped[code].push({
            ...m,
            assignedSubjectCode: code,
          });
        }
      }
    });

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
  }, [filteredActive]);

  // Active Students list
  const activeStudents = useMemo(() => {
    return filteredActive.filter(
      (m) => (m.role || '').toString().trim().toLowerCase() === 'student'
    );
  }, [filteredActive]);

  // Actions for Pending Approvals
  const handleApprove = async (member: SubjectTeamMember) => {
    setActionLoadingId(member.id);
    try {
      // Optimistic state update: update status in local state immediately
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: 'approved' } : m))
      );

      await approveUserApi(member.id);

      showToast(
        'success',
        isKhmer
          ? `បានអនុម័តគណនី "${member.fullName}" ដោយជោគជ័យ!`
          : `Account "${member.fullName}" approved successfully!`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      showToast('error', msg);
      // Revert on failure
      loadFromApi();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (member: SubjectTeamMember) => {
    if (!window.confirm(
      isKhmer
        ? `តើអ្នកពិតជាចង់បដិសេធសំណើរបស់ "${member.fullName}" មែនទេ?`
        : `Are you sure you want to reject the registration for "${member.fullName}"?`
    )) {
      return;
    }

    setActionLoadingId(member.id);
    try {
      // Optimistic state update: remove from list
      setMembers((prev) => prev.filter((m) => m.id !== member.id));

      await rejectUserApi(member.id);

      showToast(
        'success',
        isKhmer
          ? `បានបដិសេធសំណើចុះឈ្មោះរបស់ "${member.fullName}" រួចរាល់!`
          : `Registration for "${member.fullName}" rejected.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rejection failed';
      showToast('error', msg);
      loadFromApi();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Modals openers
  const handleOpenGlobalAdd = () => {
    setAddModalSubject(null);
    setAddModalOpen(true);
  };

  const handleOpenAddForSubject = (subjectId: SubjectId) => {
    setAddModalSubject(subjectId);
    setAddModalOpen(true);
  };

  const handleOpenEdit = async (member: SubjectTeamMember) => {
    setEditingMember(member);
    setEditModalOpen(true);

    try {
      const fresh = await fetchTeamMemberByIdApi(member.id);
      if (fresh) {
        setEditingMember(fresh);
      }
    } catch {
      // ignore
    }
  };

  const handleOpenResetPassword = (member: SubjectTeamMember) => {
    setResetPasswordMember(member);
    setResetPasswordOpen(true);
  };

  const handleOpenDelete = (member: SubjectTeamMember) => {
    setDeletingMember(member);
    setDeleteDialogOpen(true);
  };

  const handleAddSuccess = async (newMember: SubjectTeamMember) => {
    // Re-fetch live profiles list directly from Supabase
    await loadFromApi();
    showToast(
      'success',
      isKhmer
        ? `បានបង្កើតគណនី "${newMember.fullName}" ដោយជោគជ័យ!`
        : `Account for "${newMember.fullName}" created successfully!`
    );
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
  };

  const handleDeleteSuccess = async (deletedId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== deletedId));
    showToast(
      'success',
      isKhmer ? 'បានលុបគណនីជាអចិន្ត្រៃយ៍!' : 'Account permanently removed!'
    );
  };

  const handleResetPasswordSuccess = (email: string) => {
    showToast(
      'success',
      isKhmer
        ? `បានប្តូរលេខសម្ងាត់សម្រាប់ ${email} ដោយជោគជ័យ!`
        : `Password updated successfully for ${email}!`
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(isKhmer ? 'km-KH' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Access Guard & Graceful Loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់សិទ្ធិ Super Admin...' : 'Verifying Super Admin access...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isKhmer ? 'សូមរង់ចាំបន្តិច' : 'Please wait a moment'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isKhmer ? 'គ្មានសិទ្ធិចូលដំណើរការ' : 'Access Denied'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isKhmer
              ? 'ទំព័រនេះសម្រាប់តែអ្នកគ្រប់គ្រងប្រព័ន្ធជាន់ខ្ពស់ (Super Admin) ប៉ុណ្ណោះ។'
              : 'This management dashboard is restricted to Ministry Super Admins.'}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isKhmer ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Header Section */}
      <div className="relative border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
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
                <span>Super Admin Mode</span>
              </span>
              <button
                onClick={loadFromApi}
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

          {/* Title & Add Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isKhmer
                    ? 'គ្រប់គ្រងការអនុម័ត & គណនីសកម្ម'
                    : 'User Onboarding & Account Management'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {isKhmer
                  ? 'អនុម័តសំណើចុះឈ្មោះគណនីថ្មី គ្រប់គ្រងគណនីសកម្មតាមមុខវិជ្ជា និងកំណត់លេខសម្ងាត់ឡើងវិញតាមរយៈ Supabase Service Role'
                  : 'Approve new registration requests, manage active accounts across curriculum subjects, and reset passwords via Supabase Service Role.'}
              </p>
            </div>

            <button
              onClick={handleOpenGlobalAdd}
              className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isKhmer ? '+ បង្កើតគណនីដោយផ្ទាល់' : '+ Provision Account'}</span>
            </button>
          </div>

          {/* Core Tabs: Tab A (Pending) vs Tab B (Active) */}
          <div className="mt-8 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
            {/* Tab A */}
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isKhmer ? 'សំណើរង់ចាំការអនុម័ត' : 'Pending Approvals'}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  pendingMembers.length > 0
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {pendingMembers.length}
              </span>
            </button>

            {/* Tab B */}
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isKhmer ? 'បញ្ជីគណនីសកម្ម' : 'Active Accounts'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activeMembers.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isKhmer
                  ? 'ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល...'
                  : 'Search by full name or email...'
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab === 'active' && (
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'តម្រង៖' : 'Filter:'}</span>
              </span>

              {[
                { id: 'all', labelKm: 'ទាំងអស់', labelEn: 'All' },
                { id: 'super_admin', labelKm: 'Super Admin', labelEn: 'Super Admin' },
                { id: 'subject_lead', labelKm: 'ប្រធានមុខវិជ្ជា', labelEn: 'Lead' },
                { id: 'subject_member', labelKm: 'សមាជិក', labelEn: 'Member' },
                { id: 'student', labelKm: 'សិស្ស', labelEn: 'Student' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => setRoleFilter(rf.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    roleFilter === rf.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isKhmer ? rf.labelKm : rf.labelEn}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB A: PENDING APPROVALS */}
        {/* ========================================================================= */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isKhmer ? 'សំណើរង់ចាំការអនុម័តពី Super Admin' : 'Pending Super Admin Approvals'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isKhmer
                        ? 'គណនីខាងក្រោមបានចុះឈ្មោះ និងមិនទាន់អាចចូលប្រព័ន្ធបានទេរហូតដល់អ្នកចុចអនុម័ត'
                        : 'These registered users cannot log in until approved by a Super Admin.'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                  {filteredPending.length} {isKhmer ? 'សំណើ' : 'requests'}
                </span>
              </div>

              {filteredPending.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {isKhmer ? 'គ្មានសំណើរង់ចាំការអនុម័តឡើយ' : 'No Pending Requests'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {isKhmer
                      ? 'រាល់គណនីដែលបានចុះឈ្មោះត្រូវបានពិនិត្យ និងអនុម័តរួចរាល់ទាំងអស់។'
                      : 'All user registrations have been verified and approved.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                        <th className="py-3.5 px-4 sm:px-6">{isKhmer ? 'ឈ្មោះពេញ / គណនី' : 'Full Name'}</th>
                        <th className="py-3.5 px-4 sm:px-6">{isKhmer ? 'អ៊ីមែល' : 'Email'}</th>
                        <th className="py-3.5 px-4 sm:px-6">{isKhmer ? 'តួនាទីស្នើសុំ' : 'Requested Role'}</th>
                        <th className="py-3.5 px-4 sm:px-6">{isKhmer ? 'មុខវិជ្ជាចាត់តាំង' : 'Assigned Subject'}</th>
                        <th className="py-3.5 px-4 sm:px-6">{isKhmer ? 'កាលបរិច្ឆេទចុះឈ្មោះ' : 'Registered Date'}</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredPending.map((m) => {
                        const isLoading = actionLoadingId === m.id;
                        const subjectCode = resolveSubjectCode(m.assignedSubjectCode || m.assignedSubjectId);
                        const subjMeta = subjectCode ? SUBJECTS[subjectCode] : null;

                        return (
                          <tr
                            key={m.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Full Name & Avatar */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                  {m.fullName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                                    {m.fullName}
                                  </span>
                                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{isKhmer ? 'រង់ចាំការអនុម័ត' : 'Pending Approval'}</span>
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{m.email}</span>
                              </div>
                            </td>

                            {/* Requested Role */}
                            <td className="py-4 px-4 sm:px-6">
                              {m.role === 'subject_lead' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  <Crown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  <span>{isKhmer ? 'ប្រធានមុខវិជ្ជា' : 'Subject Lead'}</span>
                                </span>
                              ) : m.role === 'subject_member' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>{isKhmer ? 'សមាជិកមុខវិជ្ជា' : 'Subject Member'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  <GraduationCap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  <span>{isKhmer ? 'សិស្ស' : 'Student'}</span>
                                </span>
                              )}
                            </td>

                            {/* Assigned Subject */}
                            <td className="py-4 px-4 sm:px-6">
                              {subjMeta ? (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${subjMeta.badgeBg} ${subjMeta.badgeText} border`}>
                                  <span>{isKhmer ? subjMeta.nameKm : subjMeta.nameEn}</span>
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">
                                  {isKhmer ? 'មិនមាន (N/A)' : 'N/A'}
                                </span>
                              )}
                            </td>

                            {/* Registered Date */}
                            <td className="py-4 px-4 sm:px-6 text-xs text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{formatDate(m.createdAt)}</span>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Approve Button */}
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => handleApprove(m)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isKhmer ? 'អនុម័ត' : 'Approve'}</span>
                                </button>

                                {/* Reject Button */}
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => handleReject(m)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>{isKhmer ? 'បដិសេធ' : 'Reject'}</span>
                                </button>
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB B: ACTIVE ACCOUNTS */}
        {/* ========================================================================= */}
        {activeTab === 'active' && (
          <div className="space-y-8">
            {/* Section 1: Super Admins */}
            {(roleFilter === 'all' || roleFilter === 'super_admin') && activeSuperAdmins.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {isKhmer ? 'គណនីគ្រប់គ្រងជាន់ខ្ពស់ (Super Admins)' : 'Super Administrators'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isKhmer ? 'សិទ្ធិពេញលេញលើប្រព័ន្ធ និងមុខវិជ្ជាទាំង ៥' : 'Full system privileges across all subjects'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {activeSuperAdmins.length} {isKhmer ? 'នាក់' : 'admins'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSuperAdmins.map((adminMember) => {
                    const isSelf =
                      (currentStaff && currentStaff.id === adminMember.id) ||
                      (currentStaff && currentStaff.email.toLowerCase() === adminMember.email.toLowerCase());

                    return (
                      <div
                        key={adminMember.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:shadow-md transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                              {adminMember.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {adminMember.fullName}
                                </span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                                    {isKhmer ? 'អ្នក' : 'You'}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 font-mono block">
                                {adminMember.email}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase shrink-0">
                            Super Admin
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(adminMember)}
                            title={isKhmer ? 'កែសម្រួលគណនី' : 'Edit Account'}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => handleOpenResetPassword(adminMember)}
                            title={isKhmer ? 'ប្តូរលេខសម្ងាត់' : 'Reset Password'}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(adminMember)}
                            disabled={Boolean(isSelf)}
                            title={
                              isSelf
                                ? isKhmer
                                  ? 'មិនអាចលុបគណនីផ្ទាល់ខ្លួនបានឡើយ'
                                  : 'Cannot delete self'
                                : isKhmer
                                ? 'លុបគណនី'
                                : 'Delete Account'
                            }
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSelf
                                ? 'text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed'
                                : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Subject Teams (5 Subjects) */}
            {(roleFilter === 'all' || roleFilter === 'subject_lead' || roleFilter === 'subject_member') && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isKhmer ? 'ក្រុមការងារមុខវិជ្ជាទាំង ៥ (Subject Teams)' : 'Subject Teams (5 Disciplines)'}
                  </h3>
                </div>

                <div className="space-y-6">
                  {Object.values(SUBJECTS).map((sub) => {
                    const teamList = activeBySubject[sub.id] || [];
                    return (
                      <SubjectTeamCard
                        key={sub.id}
                        subject={sub}
                        members={teamList}
                        onAddMember={handleOpenAddForSubject}
                        onEditMember={handleOpenEdit}
                        onResetPassword={handleOpenResetPassword}
                        onDeleteMember={handleOpenDelete}
                        currentUserId={currentStaff?.id}
                        currentUserEmail={currentStaff?.email}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 3: Registered Students */}
            {(roleFilter === 'all' || roleFilter === 'student') && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {isKhmer ? 'គណនីសិស្សដែលបានអនុម័ត (Active Students)' : 'Active Student Accounts'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isKhmer
                          ? 'សិស្សានុសិស្សដែលបានចុះឈ្មោះ និងទទួលបានការអនុម័ត'
                          : 'Approved student accounts in the platform'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {activeStudents.length} {isKhmer ? 'នាក់' : 'students'}
                  </span>
                </div>

                {activeStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {isKhmer ? 'មិនទាន់មានគណនីសិស្សសកម្មនៅឡើយទេ' : 'No active student accounts found.'}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">{isKhmer ? 'ឈ្មោះសិស្ស' : 'Student Name'}</th>
                          <th className="py-3 px-4">{isKhmer ? 'អ៊ីមែល' : 'Email'}</th>
                          <th className="py-3 px-4">{isKhmer ? 'កាលបរិច្ឆេទបង្កើត' : 'Joined Date'}</th>
                          <th className="py-3 px-4 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeStudents.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                                  {st.fullName.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                  {st.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                              {st.email}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-400">
                              {formatDate(st.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(st)}
                                  title={isKhmer ? 'កែសម្រួល' : 'Edit'}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenResetPassword(st)}
                                  title={isKhmer ? 'ប្តូរលេខសម្ងាត់' : 'Reset Password'}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(st)}
                                  title={isKhmer ? 'លុបគណនី' : 'Delete'}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTeamMemberModal
        isOpen={addModalOpen}
        initialSubjectId={addModalSubject}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        onErrorToast={(errMsg) => showToast('error', errMsg)}
      />

      <EditTeamMemberModal
        isOpen={editModalOpen}
        member={editingMember}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <ResetPasswordModal
        isOpen={resetPasswordOpen}
        member={resetPasswordMember}
        onClose={() => setResetPasswordOpen(false)}
        onSuccess={handleResetPasswordSuccess}
      />

      <DeleteTeamMemberDialog
        isOpen={deleteDialogOpen}
        member={deletingMember}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
