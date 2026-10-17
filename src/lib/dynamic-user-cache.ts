/**
 * Resilient live dynamic cache for user profiles across server routes.
 * Ensures instant visibility and zero sync latency between auth, registration, and admin APIs.
 */

export interface CachedProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'subject_lead' | 'subject_member' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  assigned_subject_id: string | null;
  assigned_subject_code?: string | null;
  created_at: string;
  updated_at?: string;
  _deleted?: boolean;
}

// Global server memory cache
declare global {
  // eslint-disable-next-line no-var
  var __MOEYS_DYNAMIC_USERS__: Map<string, CachedProfile> | undefined;
}

if (!global.__MOEYS_DYNAMIC_USERS__) {
  global.__MOEYS_DYNAMIC_USERS__ = new Map<string, CachedProfile>();
}

export const dynamicUserCache = global.__MOEYS_DYNAMIC_USERS__;

export function addCachedUser(user: CachedProfile) {
  dynamicUserCache.set(user.id, user);
}

export function getCachedUser(id: string): CachedProfile | undefined {
  const u = dynamicUserCache.get(id);
  return u && !u._deleted ? u : undefined;
}

export function updateCachedUser(id: string, updates: Partial<CachedProfile>) {
  const existing = dynamicUserCache.get(id);
  if (existing) {
    dynamicUserCache.set(id, { ...existing, ...updates });
  } else {
    dynamicUserCache.set(id, updates as CachedProfile);
  }
}

export function deleteCachedUser(id: string) {
  dynamicUserCache.set(id, {
    ...(dynamicUserCache.get(id) || ({} as any)),
    _deleted: true,
  });
}
