'use client';

import { SubjectId } from './curriculum-data';
import { StaffAccount, getStoredStaff, saveStoredStaff, getCurrentStaffSession } from './data-store';
import { isSupabaseConfigured, supabase } from './supabase';

export interface SubjectTeamMember {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'subject_lead' | 'subject_member' | 'student';
  assignedSubjectId: SubjectId | string | null;
  assignedSubjectCode?: SubjectId | null;
  subjectNameKm?: string;
  subjectNameEn?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubjectInfo {
  id: string;
  code: SubjectId;
  nameKm: string;
  nameEn: string;
}

const STORAGE_KEY_TEAM_MEMBERS = 'moeys_subject_team_members_v1';

// Deterministic UUIDs to MoEYS Subject Code mapping
const UUID_TO_SUBJECT: Record<string, SubjectId> = {
  'a0000000-0000-0000-0000-000000000001': 'math',
  'a0000000-0000-0000-0000-000000000002': 'physics',
  'a0000000-0000-0000-0000-000000000003': 'chemistry',
  'a0000000-0000-0000-0000-000000000004': 'biology',
  'a0000000-0000-0000-0000-000000000005': 'english',
};

/**
 * Universal Subject Code Resolver:
 * Accepts a Subject code ('math'), UUID, or null, and returns the canonical SubjectId.
 */
export function resolveSubjectCode(
  subjectRef: string | null | undefined,
  subjectsList?: SubjectInfo[]
): SubjectId | null {
  if (!subjectRef) return null;
  const lower = subjectRef.toLowerCase();

  if (['math', 'physics', 'chemistry', 'biology', 'english'].includes(lower)) {
    return lower as SubjectId;
  }

  if (UUID_TO_SUBJECT[lower]) {
    return UUID_TO_SUBJECT[lower];
  }

  if (subjectsList && subjectsList.length > 0) {
    const found = subjectsList.find(
      (s) => s.id.toLowerCase() === lower || s.code.toLowerCase() === lower
    );
    if (found) return found.code;
  }

  return null;
}

// Purge legacy mock data IDs
const isMockMember = (m: any) =>
  !m ||
  (typeof m.id === 'string' && m.id.startsWith('staff-')) ||
  m.email === 'math@moeys.gov.kh' ||
  m.email === 'math.member@moeys.gov.kh' ||
  m.email === 'physics@moeys.gov.kh' ||
  m.email === 'physics.member@moeys.gov.kh' ||
  m.email === 'chemistry@moeys.gov.kh' ||
  m.email === 'biology@moeys.gov.kh' ||
  m.email === 'english@moeys.gov.kh';

/**
 * Returns stored team members from local storage (filtered of any legacy mock entries)
 */
export function getStoredTeamMembers(): SubjectTeamMember[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM_MEMBERS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any legacy mock accounts
      const realOnly = parsed
        .filter((m: any) => !isMockMember(m))
        .map((m: SubjectTeamMember) => ({
          ...m,
          assignedSubjectCode: m.assignedSubjectCode || resolveSubjectCode(m.assignedSubjectId),
        }));
      return realOnly;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves real team members locally and syncs with staff accounts
 */
export function saveStoredTeamMembers(members: SubjectTeamMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanMembers = members.filter((m) => !isMockMember(m));
    const enriched = cleanMembers.map((m) => ({
      ...m,
      assignedSubjectCode: m.assignedSubjectCode || resolveSubjectCode(m.assignedSubjectId),
    }));

    localStorage.setItem(STORAGE_KEY_TEAM_MEMBERS, JSON.stringify(enriched));

    // Synchronize with general staff accounts store so dashboard reflects real changes
    const staffAccounts: StaffAccount[] = enriched.map((m) => {
      const subjectAssigned = m.assignedSubjectCode || (m.assignedSubjectId as SubjectId) || null;
      return {
        id: m.id,
        email: m.email,
        fullNameKm: m.fullName,
        fullNameEn: m.fullName,
        role: m.role,
        subjectAssigned: m.role === 'super_admin' ? null : subjectAssigned,
        isActive: true,
        createdAt: m.createdAt,
      };
    });
    saveStoredStaff(staffAccounts);

    window.dispatchEvent(new Event('moeys-team-updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Error saving team members:', err);
  }
}

/**
 * Constructs authentication headers for backend API requests
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // session lookup failed
    }
  }

  const currentStaff = getCurrentStaffSession();
  if (currentStaff) {
    headers['x-staff-email'] = currentStaff.email;
    headers['x-staff-role'] = currentStaff.role;
  }

  return headers;
}

/**
 * Fetches all team members directly from backend API connected to Supabase
 */
export async function fetchTeamFromApi(): Promise<{
  users: SubjectTeamMember[];
  subjects: SubjectInfo[];
}> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/users', {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      const subjects: SubjectInfo[] = data.subjects || [];
      const rawUsers: any[] = Array.isArray(data.users) ? data.users : [];

      const mappedUsers: SubjectTeamMember[] = rawUsers
        .filter((u: any) => !isMockMember(u))
        .map((u: any) => {
          const rawSubj = u.assigned_subject_id || u.subject_assigned || null;
          const subjCode =
            u.assigned_subject_code ||
            (u.subjects && u.subjects.code) ||
            resolveSubjectCode(rawSubj, subjects);

          return {
            id: u.id || u.user_id,
            email: u.email,
            fullName: u.full_name || u.email,
            role: u.role,
            assignedSubjectId: rawSubj,
            assignedSubjectCode: subjCode,
            subjectNameKm: u.subject_name_km || (u.subjects && u.subjects.name_km),
            subjectNameEn: u.subject_name_en || (u.subjects && u.subjects.name_en),
            createdAt: u.created_at || new Date().toISOString(),
            updatedAt: u.updated_at,
          };
        });

      // Update local storage with real Supabase profiles
      saveStoredTeamMembers(mappedUsers);
      return { users: mappedUsers, subjects };
    }
  } catch (err) {
    console.warn('API fetch team error:', err);
  }

  return {
    users: getStoredTeamMembers(),
    subjects: [],
  };
}

/**
 * Fetches a single team member profile by ID from backend API
 */
export async function fetchTeamMemberByIdApi(userId: string): Promise<SubjectTeamMember | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/users?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        const u = data.user;
        const rawSubj = u.assigned_subject_id || u.subject_assigned || null;
        const subjCode =
          u.assigned_subject_code || resolveSubjectCode(rawSubj, data.subjects);

        const member: SubjectTeamMember = {
          id: u.id || u.user_id,
          email: u.email,
          fullName: u.full_name || u.email,
          role: u.role,
          assignedSubjectId: rawSubj,
          assignedSubjectCode: subjCode,
          subjectNameKm: u.subject_name_km,
          subjectNameEn: u.subject_name_en,
          createdAt: u.created_at || new Date().toISOString(),
          updatedAt: u.updated_at,
        };

        // Update local member instance
        const current = getStoredTeamMembers();
        const updated = current.map((m) => (m.id === userId ? member : m));
        saveStoredTeamMembers(updated);

        return member;
      }
    }
  } catch (err) {
    console.warn('API fetch member by id error:', err);
  }

  const current = getStoredTeamMembers();
  return current.find((m) => m.id === userId) || null;
}

/**
 * Creates a new team member via API
 */
export async function createTeamMemberApi(payload: {
  email: string;
  password: string;
  full_name: string;
  role: 'super_admin' | 'subject_lead' | 'subject_member' | 'student';
  assigned_subject_id: string | null;
  subject_code?: string;
}): Promise<SubjectTeamMember> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to create member (${res.status})`);
  }

  const resData = await res.json();
  const u = resData.user || {};
  const rawSubj = u.assigned_subject_id || payload.assigned_subject_id || null;
  const subjCode =
    u.assigned_subject_code || (payload.subject_code as SubjectId) || resolveSubjectCode(rawSubj);

  const newMember: SubjectTeamMember = {
    id: u.id || `staff-${Date.now()}`,
    email: payload.email,
    fullName: payload.full_name,
    role: payload.role,
    assignedSubjectId: rawSubj,
    assignedSubjectCode: subjCode,
    createdAt: u.created_at || new Date().toISOString(),
    updatedAt: u.updated_at,
  };

  // Optimistic local state update
  const current = getStoredTeamMembers();
  const updated = [
    newMember,
    ...current.filter((m) => m.email.toLowerCase() !== newMember.email.toLowerCase()),
  ];
  saveStoredTeamMembers(updated);

  return newMember;
}

/**
 * Updates an existing team member via API
 */
export async function updateTeamMemberApi(payload: {
  user_id: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: 'super_admin' | 'subject_lead' | 'subject_member' | 'student';
  assigned_subject_id?: string | null;
  subject_code?: string;
}): Promise<SubjectTeamMember> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/users', {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to update member (${res.status})`);
  }

  const resData = await res.json();
  const u = resData.user || {};

  const current = getStoredTeamMembers();
  const existing = current.find((m) => m.id === payload.user_id);

  const rawSubj =
    payload.assigned_subject_id !== undefined
      ? payload.assigned_subject_id
      : u.assigned_subject_id || existing?.assignedSubjectId || null;

  const subjCode =
    (payload.subject_code as SubjectId) ||
    u.assigned_subject_code ||
    resolveSubjectCode(rawSubj) ||
    existing?.assignedSubjectCode ||
    null;

  const updatedMember: SubjectTeamMember = {
    id: payload.user_id,
    email: payload.email || u.email || existing?.email || '',
    fullName: payload.full_name || u.full_name || existing?.fullName || '',
    role: payload.role || u.role || existing?.role || 'subject_member',
    assignedSubjectId: rawSubj,
    assignedSubjectCode: payload.role === 'super_admin' ? null : subjCode,
    createdAt: existing?.createdAt || u.created_at || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = current.map((m) => (m.id === payload.user_id ? updatedMember : m));
  saveStoredTeamMembers(updatedList);

  return updatedMember;
}

/**
 * Deletes a team member via API
 */
export async function deleteTeamMemberApi(userId: string): Promise<boolean> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/users?user_id=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to delete member (${res.status})`);
  }

  // Optimistic local state update
  const current = getStoredTeamMembers();
  const filtered = current.filter((m) => m.id !== userId);
  saveStoredTeamMembers(filtered);

  return true;
}
