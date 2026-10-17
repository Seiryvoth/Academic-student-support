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
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';
import { getCurrentStaffSession, StaffAccount } from '@/lib/data-store';
import {
  SubjectTeamMember,
  getStoredTeamMembers,
  saveStoredTeamMembers,
  fetchTeamFromApi,
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

  // Auth Guard: Load session and check super_admin privilege
  useEffect(() => {
    const session = getCurrentStaffSession();
    setCurrentStaff(session);
    setAuthChecked(true);

    const handleAuthChange = () => {
      const updated = getCurrentStaffSession();
      setCurrentStaff(updated);
    };

    window.addEventListener('moeys_staff_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('moeys_staff_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Load team members (local cache + background API sync)
  useEffect(() => {
    // 1. Instant local load
    setMembers(getStoredTeamMembers());

    // 2. Fetch from backend API
    const loadFromApi = async () => {
      setIsRefreshing(true);
      try {
        const result = await fetchTeamFromApi();
        if (result.users && result.users.length > 0) {
          setMembers(result.users);
        }
      } catch (err) {
        console.warn('API sync notice:', err);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadFromApi();

    const handleTeamUpdate = () => {
      setMembers(getStoredTeamMembers());
    };
    window.addEventListener('moeys-team-updated', handleTeamUpdate);
    return () => {
      window.removeEventListener('moeys-team-updated', handleTeamUpdate);
    };
  }, []);

  // Refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchTeamFromApi();
      if (result.users && result.users.length > 0) {
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

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === 'all' ||
        m.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // Group members by subject
  const membersBySubject = useMemo(() => {
    const grouped: Record<SubjectId, SubjectTeamMember[]> = {
      math: [],
      physics: [],
      chemistry: [],
      biology: [],
      english: [],
    };

    filteredMembers.forEach((m) => {
      if (m.assignedSubjectId && m.assignedSubjectId in grouped) {
        grouped[m.assignedSubjectId as SubjectId].push(m);
      }
    });

    return grouped;
  }, [filteredMembers]);

  // Super admins or unassigned staff
  const unassignedAndSuperAdmins = useMemo(() => {
    return filteredMembers.filter(
      (m) => m.role === 'super_admin' || !m.assignedSubjectId || !(m.assignedSubjectId in SUBJECTS)
    );
  }, [filteredMembers]);

  // Statistics
  const stats = useMemo(() => {
    const total = members.length;
    const leads = members.filter((m) => m.role === 'subject_lead').length;
    const teamMembers = members.filter((m) => m.role === 'subject_member').length;
    const supers = members.filter((m) => m.role === 'super_admin').length;
    return { total, leads, teamMembers, supers };
  }, [members]);

  // Handlers for Modals
  const handleOpenAddForSubject = (subjectId: SubjectId) => {
    setAddModalSubject(subjectId);
    setAddModalOpen(true);
  };

  const handleOpenGlobalAdd = () => {
    setAddModalSubject(null);
    setAddModalOpen(true);
  };

  const handleOpenEdit = (member: SubjectTeamMember) => {
    setEditingMember(member);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (member: SubjectTeamMember) => {
    setDeletingMember(member);
    setDeleteDialogOpen(true);
  };

  const handleAddSuccess = (newMember: SubjectTeamMember) => {
    showToast(
      'success',
      isKhmer
        ? `បានបង្កើតគណនី "${newMember.fullName}" ដោយជោគជ័យ!`
        : `Account for "${newMember.fullName}" created successfully!`
    );
  };

  const handleEditSuccess = (updated: SubjectTeamMember) => {
    showToast(
      'success',
      isKhmer
        ? `បានកែសម្រួលគណនី "${updated.fullName}" ដោយជោគជ័យ!`
        : `Account "${updated.fullName}" updated successfully!`
    );
  };

  const handleDeleteSuccess = () => {
    showToast(
      'success',
      isKhmer ? 'បានលុបគណនីជាអចិន្ត្រៃយ៍!' : 'Account permanently removed!'
    );
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
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isKhmer ? 'ចូលប្រព័ន្ធគ្រូ' : 'Staff Login'}</span>
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
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
                ? 'bg-emerald-500/90 text-white border-emerald-400'
                : 'bg-rose-500/90 text-white border-rose-400'
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
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
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
        {unassignedAndSuperAdmins.length > 0 && (
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

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {unassignedAndSuperAdmins.length} {isKhmer ? 'គណនី' : 'Accounts'}
              </span>
            </div>

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
                      (currentStaff && currentStaff.email.toLowerCase() === m.email.toLowerCase()) ||
                      (currentStaff && currentStaff.id === m.id);

                    return (
                      <tr key={m.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/10">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                              {m.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {m.fullName}
                            </span>
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
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title={isKhmer ? 'កែសម្រួល' : 'Edit'}
                            >
                              <Users className="w-4 h-4" />
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
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title={isKhmer ? 'លុប' : 'Delete'}
                              >
                                <Users className="w-4 h-4 text-rose-500" />
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
          </div>
        )}

        {/* 2. Five Core Subject Sections */}
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
