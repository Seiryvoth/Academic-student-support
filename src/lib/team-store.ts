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

// Initial pre-seeded team members matching the official MoEYS curriculum department structure
export const INITIAL_TEAM_MEMBERS: SubjectTeamMember[] = [
  {
    id: 'staff-admin-1',
    email: 'admin@moeys.gov.kh',
    fullName: 'លោកបណ្ឌិត ជា សុវណ្ណ (Dr. Chea Sovann)',
    role: 'super_admin',
    assignedSubjectId: null,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-math-lead',
    email: 'math@moeys.gov.kh',
    fullName: 'សាស្ត្រាចារ្យ ឡុង សុខា (Prof. Long Sokha)',
    role: 'subject_lead',
    assignedSubjectId: 'math',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-math-member-1',
    email: 'math.member@moeys.gov.kh',
    fullName: 'អ្នកគ្រូ ចាន់ ស្រីមុំ (Ms. Chan Sreymom)',
    role: 'subject_member',
    assignedSubjectId: 'math',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'staff-phys-lead',
    email: 'physics@moeys.gov.kh',
    fullName: 'លោកស្រី គឹម សុផល (Mrs. Kim Sophal)',
    role: 'subject_lead',
    assignedSubjectId: 'physics',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-phys-member-1',
    email: 'physics.member@moeys.gov.kh',
    fullName: 'លោក ហេង វុទ្ធី (Mr. Heng Vuthy)',
    role: 'subject_member',
    assignedSubjectId: 'physics',
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'staff-chem-lead',
    email: 'chemistry@moeys.gov.kh',
    fullName: 'លោក វ៉ាន់ រតនា (Mr. Vann Rattana)',
    role: 'subject_lead',
    assignedSubjectId: 'chemistry',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-bio-lead',
    email: 'biology@moeys.gov.kh',
    fullName: 'លោកស្រី សេង គន្ធា (Mrs. Seng Kunthea)',
    role: 'subject_lead',
    assignedSubjectId: 'biology',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'staff-eng-lead',
    email: 'english@moeys.gov.kh',
    fullName: 'លោក ដារ៉ា សិទ្ធិ (Mr. Dara Sethi)',
    role: 'subject_lead',
    assignedSubjectId: 'english',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

/**
 * Returns stored team members from local storage or initial seed
 */
export function getStoredTeamMembers(): SubjectTeamMember[] {
  if (typeof window === 'undefined') return INITIAL_TEAM_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM_MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TEAM_MEMBERS, JSON.stringify(INITIAL_TEAM_MEMBERS));
      return INITIAL_TEAM_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TEAM_MEMBERS;
  } catch {
    return INITIAL_TEAM_MEMBERS;
  }
}

/**
 * Saves team members locally and syncs with staff accounts
 */
export function saveStoredTeamMembers(members: SubjectTeamMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TEAM_MEMBERS, JSON.stringify(members));

    // Synchronize with general staff accounts store so dashboard reflects changes
    const staffAccounts: StaffAccount[] = members.map((m) => {
      const subjectAssigned = (m.assignedSubjectId as SubjectId) || null;
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
 * Fetches all team members and subjects from backend API
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
      if (Array.isArray(data.users) && data.users.length > 0) {
        const mappedUsers: SubjectTeamMember[] = data.users.map((u: any) => ({
          id: u.id || u.user_id,
          email: u.email,
          fullName: u.full_name || u.email,
          role: u.role,
          assignedSubjectId: u.assigned_subject_id || u.subject_assigned || null,
          createdAt: u.created_at || new Date().toISOString(),
          updatedAt: u.updated_at,
        }));
        // Update local cache
        saveStoredTeamMembers(mappedUsers);
        return { users: mappedUsers, subjects: data.subjects || [] };
      }
    }
  } catch (err) {
    console.warn('API fetch team error, using local fallback:', err);
  }

  return {
    users: getStoredTeamMembers(),
    subjects: [],
  };
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

  const newMember: SubjectTeamMember = {
    id: u.id || `staff-${Date.now()}`,
    email: payload.email,
    fullName: payload.full_name,
    role: payload.role,
    assignedSubjectId: payload.assigned_subject_id || payload.subject_code || null,
    createdAt: u.created_at || new Date().toISOString(),
    updatedAt: u.updated_at,
  };

  // Optimistic local state update
  const current = getStoredTeamMembers();
  const updated = [newMember, ...current.filter((m) => m.email.toLowerCase() !== newMember.email.toLowerCase())];
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

  const current = getStoredTeamMembers();
  const existing = current.find((m) => m.id === payload.user_id);

  const updatedMember: SubjectTeamMember = {
    id: payload.user_id,
    email: payload.email || existing?.email || '',
    fullName: payload.full_name || existing?.fullName || '',
    role: payload.role || existing?.role || 'subject_member',
    assignedSubjectId:
      payload.assigned_subject_id !== undefined
        ? payload.assigned_subject_id
        : existing?.assignedSubjectId || null,
    createdAt: existing?.createdAt || new Date().toISOString(),
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
