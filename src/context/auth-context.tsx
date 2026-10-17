'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  StaffAccount,
  getCurrentStaffSession,
  setCurrentStaffSession,
} from '@/lib/data-store';
import { SubjectId, SUBJECTS } from '@/lib/curriculum-data';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  staffSession: StaffAccount | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  role: 'super_admin' | 'subject_lead' | 'subject_member' | 'student' | null;
  assignedSubject: SubjectId | null;
  login: (account: StaffAccount) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [staffSession, setStaffSessionState] = useState<StaffAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // References to prevent duplicate auth event feedback loops
  const lastUserIdRef = useRef<string | null>(null);
  const lastTokenRef = useRef<string | null>(null);
  const isFetchingProfileRef = useRef<boolean>(false);

  /**
   * Helper to fetch and build a StaffAccount from public.profiles or user_roles
   */
  const resolveProfile = useCallback(
    async (authUser: User): Promise<StaffAccount | null> => {
      if (!isSupabaseConfigured || !supabase) return null;

      try {
        // 1. Try public.profiles first
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*, subjects(code)')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!profileErr && profile) {
          // Reject / pending check
          const accountStatus = (profile.status || 'approved').toString().toLowerCase();
          if (accountStatus === 'pending' || accountStatus === 'rejected') {
            await supabase.auth.signOut();
            return null;
          }

          let subj: SubjectId | null = null;
          if (profile.subjects?.code && profile.subjects.code in SUBJECTS) {
            subj = profile.subjects.code as SubjectId;
          } else if (profile.assigned_subject_id && profile.assigned_subject_id in SUBJECTS) {
            subj = profile.assigned_subject_id as SubjectId;
          }

          const rawRole = (profile.role || 'student').toString().trim().toLowerCase();
          const role =
            rawRole === 'super_admin' || rawRole === 'admin'
              ? 'super_admin'
              : rawRole === 'subject_lead'
              ? 'subject_lead'
              : rawRole === 'subject_member'
              ? 'subject_member'
              : 'student';

          return {
            id: profile.id,
            email: profile.email || authUser.email || '',
            fullNameKm: profile.full_name || authUser.email || 'MoEYS User',
            fullNameEn: profile.full_name || authUser.email || 'MoEYS User',
            role,
            subjectAssigned: role === 'super_admin' || role === 'student' ? null : subj,
            isActive: true,
            status: 'approved',
            createdAt: profile.created_at || authUser.created_at || new Date().toISOString(),
          };
        }

        // 2. Fallback to legacy user_roles
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (roleData) {
          const rawRole = (roleData.role || 'student').toString().trim().toLowerCase();
          const role =
            rawRole === 'super_admin' || rawRole === 'admin'
              ? 'super_admin'
              : rawRole === 'subject_lead'
              ? 'subject_lead'
              : rawRole === 'subject_member'
              ? 'subject_member'
              : 'student';

          const subj =
            roleData.subject && roleData.subject in SUBJECTS
              ? (roleData.subject as SubjectId)
              : null;

          return {
            id: authUser.id,
            email: authUser.email || '',
            fullNameKm: roleData.full_name || authUser.email || 'MoEYS Staff',
            fullNameEn: roleData.full_name || authUser.email || 'MoEYS Staff',
            role,
            subjectAssigned: role === 'super_admin' || role === 'student' ? null : subj,
            isActive: roleData.is_active !== false,
            status: 'approved',
            createdAt: authUser.created_at || new Date().toISOString(),
          };
        }

        // 3. Fallback based on user metadata
        const metaRole = (authUser.user_metadata?.role || '').toString().trim().toLowerCase();
        const role =
          metaRole === 'super_admin' || authUser.email?.toLowerCase().includes('admin')
            ? 'super_admin'
            : metaRole === 'subject_lead'
            ? 'subject_lead'
            : metaRole === 'subject_member'
            ? 'subject_member'
            : 'student';

        return {
          id: authUser.id,
          email: authUser.email || '',
          fullNameKm: authUser.user_metadata?.full_name || authUser.email || 'MoEYS User',
          fullNameEn: authUser.user_metadata?.full_name || authUser.email || 'MoEYS User',
          role,
          subjectAssigned: null,
          isActive: true,
          status: 'approved',
          createdAt: authUser.created_at || new Date().toISOString(),
        };
      } catch (err) {
        console.warn('Profile resolution notice:', err);
        return null;
      }
    },
    []
  );

  /**
   * Refreshes the current authentication session and profile
   */
  const refreshAuth = useCallback(async () => {
    if (isFetchingProfileRef.current) return;
    isFetchingProfileRef.current = true;

    try {
      if (isSupabaseConfigured && supabase) {
        const { data: { session: supaSession }, error } = await supabase.auth.getSession();
        if (!error && supaSession?.user) {
          setUser(supaSession.user);
          setSession(supaSession);
          lastUserIdRef.current = supaSession.user.id;
          lastTokenRef.current = supaSession.access_token;

          const staff = await resolveProfile(supaSession.user);
          if (staff) {
            setStaffSessionState(staff);
            setCurrentStaffSession(staff);
          }
          setIsLoading(false);
          return;
        }
      }

      // Supabase unauthenticated or not configured: verify local session
      const local = getCurrentStaffSession();
      if (local) {
        setStaffSessionState(local);
      } else {
        setStaffSessionState(null);
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.warn('refreshAuth error:', err);
    } finally {
      setIsLoading(false);
      isFetchingProfileRef.current = false;
    }
  }, [resolveProfile]);

  // Initial Auth Mount & Single Supabase Listener Setup
  useEffect(() => {
    let isSubscribed = true;

    // 1. Initial hydration check
    refreshAuth();

    // 2. Set up single onAuthStateChange listener
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = supabase.auth.onAuthStateChange(
          async (event: AuthChangeEvent, newSession: Session | null) => {
            if (!isSubscribed) return;

            // Handle TOKEN_REFRESHED: only update session token without re-fetching profile
            if (event === 'TOKEN_REFRESHED') {
              if (newSession?.access_token !== lastTokenRef.current) {
                lastTokenRef.current = newSession?.access_token || null;
                setSession(newSession);
              }
              return;
            }

            // Handle SIGNED_OUT
            if (event === 'SIGNED_OUT' || !newSession) {
              lastUserIdRef.current = null;
              lastTokenRef.current = null;
              setUser(null);
              setSession(null);
              setStaffSessionState(null);
              setCurrentStaffSession(null);
              setIsLoading(false);
              return;
            }

            // Handle SIGNED_IN or USER_UPDATED: deduplicate if user ID matches
            if (
              newSession.user.id === lastUserIdRef.current &&
              newSession.access_token === lastTokenRef.current
            ) {
              return;
            }

            lastUserIdRef.current = newSession.user.id;
            lastTokenRef.current = newSession.access_token;
            setUser(newSession.user);
            setSession(newSession);

            // Fetch profile for newly signed-in user
            const staff = await resolveProfile(newSession.user);
            if (isSubscribed) {
              if (staff) {
                setStaffSessionState(staff);
                setCurrentStaffSession(staff);
              }
              setIsLoading(false);
            }
          }
        );
        authListener = data;
      } catch (err) {
        console.warn('onAuthStateChange initialization notice:', err);
      }
    }

    // 3. Listen to internal local session changes (e.g., demo login or explicit updates)
    const handleLocalAuthChange = () => {
      if (!isSubscribed) return;
      const updated = getCurrentStaffSession();
      setStaffSessionState(updated);
    };

    window.addEventListener('moeys_staff_auth_changed', handleLocalAuthChange);

    return () => {
      isSubscribed = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
      window.removeEventListener('moeys_staff_auth_changed', handleLocalAuthChange);
    };
  }, [refreshAuth, resolveProfile]);

  /**
   * Direct login helper (used after successful modal or form login)
   */
  const login = useCallback((account: StaffAccount) => {
    setStaffSessionState(account);
    setCurrentStaffSession(account);
    setIsLoading(false);
  }, []);

  /**
   * Direct logout helper
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Logout sign-out notice:', err);
    } finally {
      lastUserIdRef.current = null;
      lastTokenRef.current = null;
      setUser(null);
      setSession(null);
      setStaffSessionState(null);
      setCurrentStaffSession(null);
      setIsLoading(false);
    }
  }, []);

  // Memoized values
  const isAuthenticated = Boolean(staffSession || user);
  const cleanRole = (staffSession?.role || '').toString().trim().toLowerCase();
  const isSuperAdmin = cleanRole === 'super_admin' || cleanRole === 'admin';
  const role = staffSession?.role || null;
  const assignedSubject = staffSession?.subjectAssigned || null;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      staffSession,
      isLoading,
      isAuthenticated,
      isSuperAdmin,
      role,
      assignedSubject,
      login,
      logout,
      refreshAuth,
    }),
    [
      user,
      session,
      staffSession,
      isLoading,
      isAuthenticated,
      isSuperAdmin,
      role,
      assignedSubject,
      login,
      logout,
      refreshAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
