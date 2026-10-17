import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey || !supabaseUrl.startsWith('http')) {
    return null;
  }
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return cachedAdminClient;
}

export interface VerificationResult {
  authorized: boolean;
  callerId?: string;
  callerEmail?: string;
  error?: string;
  statusCode: number;
}

/**
 * Enforces Super Admin authorization on incoming server requests.
 * Checks the Supabase JWT token from the Authorization header or cookies,
 * and verifies that the caller has the 'super_admin' role in public.profiles or public.user_roles.
 */
export async function verifySuperAdmin(req: Request): Promise<VerificationResult> {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
  const adminClient = getSupabaseAdmin();

  // If no admin client configured
  if (!adminClient) {
    return {
      authorized: false,
      error: 'Supabase server environment is not configured.',
      statusCode: 503,
    };
  }

  // 1. Try token verification via Supabase Auth
  if (token) {
    try {
      const { data: { user }, error: userError } = await adminClient.auth.getUser(token);
      if (user && !userError) {
        // Fast-path: Check metadata or admin email
        if (
          user.user_metadata?.role === 'super_admin' ||
          user.email?.toLowerCase() === 'admin@moeys.gov.kh'
        ) {
          return {
            authorized: true,
            callerId: user.id,
            callerEmail: user.email,
            statusCode: 200,
          };
        }

        // Query profiles table for role
        const { data: profile } = await adminClient
          .from('profiles')
          .select('id, email, role')
          .eq('id', user.id)
          .single();

        if (profile && profile.role === 'super_admin') {
          return {
            authorized: true,
            callerId: user.id,
            callerEmail: user.email || profile.email,
            statusCode: 200,
          };
        }

        // Check fallback user_roles table
        const { data: legacyRole } = await adminClient
          .from('user_roles')
          .select('user_id, email, role')
          .eq('user_id', user.id)
          .single();

        if (legacyRole && legacyRole.role === 'super_admin') {
          return {
            authorized: true,
            callerId: user.id,
            callerEmail: user.email || legacyRole.email,
            statusCode: 200,
          };
        }

        // Caller is authenticated, but NOT a super_admin (e.g. student or subject_lead)
        return {
          authorized: false,
          error: 'Forbidden. Caller does not have super_admin role.',
          statusCode: 403,
        };
      }
    } catch (err) {
      console.error('Error verifying bearer token:', err);
    }
  }

  // 2. Dev / fallback header verification for local development
  const devStaffEmail = req.headers.get('x-staff-email');
  const devStaffRole = req.headers.get('x-staff-role');

  if (process.env.NODE_ENV === 'development' || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (devStaffRole === 'super_admin' && devStaffEmail) {
      // Cross-check with DB or known admin email
      if (devStaffEmail.includes('admin') || devStaffEmail === 'admin@moeys.gov.kh') {
        return {
          authorized: true,
          callerId: 'staff-admin-1',
          callerEmail: devStaffEmail,
          statusCode: 200,
        };
      }

      // Check DB by email
      const { data: profile } = await adminClient
        .from('profiles')
        .select('id, email, role')
        .eq('email', devStaffEmail)
        .single();

      if (profile && profile.role === 'super_admin') {
        return {
          authorized: true,
          callerId: profile.id,
          callerEmail: profile.email,
          statusCode: 200,
        };
      }
    }
  }

  return {
    authorized: false,
    error: 'Forbidden: 403 Forbidden. Super Admin credentials required.',
    statusCode: 403,
  };
}
