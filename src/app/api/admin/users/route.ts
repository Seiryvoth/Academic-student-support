import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, verifySuperAdmin } from '@/lib/supabase-admin';
import {
  dynamicUserCache,
  addCachedUser,
  updateCachedUser,
  deleteCachedUser,
  CachedProfile,
} from '@/lib/dynamic-user-cache';

// Helper: UUID validator
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Canonical 5 subjects UUID mapping
const CANONICAL_SUBJECT_UUIDS: Record<string, string> = {
  'math': 'a0000000-0000-0000-0000-000000000001',
  'physics': 'a0000000-0000-0000-0000-000000000002',
  'chemistry': 'a0000000-0000-0000-0000-000000000003',
  'biology': 'a0000000-0000-0000-0000-000000000004',
  'english': 'a0000000-0000-0000-0000-000000000005',
};

// Standard core 5 subjects fallback mapping
const CORE_SUBJECT_MAP: Record<string, { code: string; name_km: string; name_en: string }> = {
  'math': { code: 'math', name_km: 'គណិតវិទ្យា', name_en: 'Mathematics' },
  'physics': { code: 'physics', name_km: 'រូបវិទ្យា', name_en: 'Physics' },
  'chemistry': { code: 'chemistry', name_km: 'គីមីវិទ្យា', name_en: 'Chemistry' },
  'biology': { code: 'biology', name_km: 'ជីវវិទ្យា', name_en: 'Biology' },
  'english': { code: 'english', name_km: 'ភាសាអង់គ្លេស', name_en: 'English' },
  'a0000000-0000-0000-0000-000000000001': { code: 'math', name_km: 'គណិតវិទ្យា', name_en: 'Mathematics' },
  'a0000000-0000-0000-0000-000000000002': { code: 'physics', name_km: 'រូបវិទ្យា', name_en: 'Physics' },
  'a0000000-0000-0000-0000-000000000003': { code: 'chemistry', name_km: 'គីមីវិទ្យា', name_en: 'Chemistry' },
  'a0000000-0000-0000-0000-000000000004': { code: 'biology', name_km: 'ជីវវិទ្យា', name_en: 'Biology' },
  'a0000000-0000-0000-0000-000000000005': { code: 'english', name_km: 'ភាសាអង់គ្លេស', name_en: 'English' },
};

/**
 * Validates and converts assigned_subject_id to a valid UUID or null.
 * Strictly conforms to PostgreSQL public.profiles.assigned_subject_id (UUID nullable).
 * If assigned_subject_id is empty string "", invalid format, or role is super_admin,
 * converts to null to strictly prevent HTTP 400 Bad Request error (code 22P02).
 */
export function sanitizeAssignedSubjectId(
  subjectRef: unknown,
  role?: string
): { subjectId: string | null; subjectCode: string } {
  if (role === 'super_admin') {
    return { subjectId: null, subjectCode: '' };
  }

  if (subjectRef === null || subjectRef === undefined) {
    return { subjectId: null, subjectCode: 'math' };
  }

  const str = String(subjectRef).trim();
  if (!str || str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
    return { subjectId: null, subjectCode: 'math' };
  }

  const lower = str.toLowerCase();
  if (CANONICAL_SUBJECT_UUIDS[lower]) {
    return { subjectId: CANONICAL_SUBJECT_UUIDS[lower], subjectCode: lower };
  }

  if (UUID_REGEX.test(str)) {
    const code = CORE_SUBJECT_MAP[lower]?.code || 'math';
    return { subjectId: str, subjectCode: code };
  }

  // Any non-UUID string or invalid format is safely converted to null
  return { subjectId: null, subjectCode: 'math' };
}

/**
 * GET /api/admin/users
 * Returns list of team members/profiles directly from Supabase public.profiles,
 * or a single user profile when ?user_id=<id> is supplied.
 * Requires super_admin role.
 */
export async function GET(request: NextRequest) {
  const verification = await verifySuperAdmin(request);
  if (!verification.authorized) {
    return NextResponse.json(
      { error: verification.error || 'Forbidden: 403 Forbidden' },
      { status: verification.statusCode }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Supabase server admin client is unavailable.' },
      { status: 503 }
    );
  }

  try {
    const url = new URL(request.url);
    const targetUserId = url.searchParams.get('user_id');

    // 1. Fetch subjects list (with fallback to canonical subjects)
    let subjectsList = Object.entries(CORE_SUBJECT_MAP).slice(0, 5).map(([code, meta]) => ({
      id: CANONICAL_SUBJECT_UUIDS[code] || code,
      code: meta.code,
      name_km: meta.name_km,
      name_en: meta.name_en,
    }));

    try {
      const { data: dbSubjects, error: subjError } = await admin
        .from('subjects')
        .select('id, code, name_km, name_en')
        .order('code', { ascending: true });

      if (subjError) {
        if (subjError.code !== 'PGRST205') {
          console.error('Supabase Error Details:', subjError);
        }
      } else if (dbSubjects && dbSubjects.length > 0) {
        subjectsList = dbSubjects;
      }
    } catch (error) {
      console.error('Supabase Error Details:', error);
    }

    // Helper: Enriches any user record with subject code, names, and approval status
    const enrichUser = (u: any) => {
      const subjectRef = u.assigned_subject_id || u.subject_assigned || null;
      let matchedSubject =
        u.subjects ||
        subjectsList.find((s: any) => s.id === subjectRef || s.code === subjectRef);
      if (!matchedSubject && subjectRef && CORE_SUBJECT_MAP[subjectRef.toLowerCase()]) {
        matchedSubject = CORE_SUBJECT_MAP[subjectRef.toLowerCase()] as any;
      }

      const rawStatus = (u.status || 'approved').toString().toLowerCase();
      const status = ['pending', 'approved', 'rejected'].includes(rawStatus)
        ? rawStatus
        : 'approved';

      return {
        id: u.id || u.user_id,
        email: u.email,
        full_name: u.full_name || u.email,
        role: u.role || 'student',
        status: status,
        assigned_subject_id: subjectRef,
        assigned_subject_code: matchedSubject ? matchedSubject.code : subjectRef,
        subject_name_km: matchedSubject ? matchedSubject.name_km : undefined,
        subject_name_en: matchedSubject ? matchedSubject.name_en : undefined,
        created_at: u.created_at || new Date().toISOString(),
        updated_at: u.updated_at,
      };
    };

    // 2. If single user lookup requested (?user_id=...)
    if (targetUserId) {
      if (dynamicUserCache.has(targetUserId)) {
        const dyn = dynamicUserCache.get(targetUserId);
        if (dyn && !dyn._deleted) {
          return NextResponse.json({
            user: enrichUser(dyn),
            subjects: subjectsList,
          });
        }
      }

      // Select directly from public.profiles
      try {
        const { data: singleProfile, error: singleError } = await admin
          .from('profiles')
          .select('id, full_name, email, role, status, assigned_subject_id, created_at, updated_at')
          .eq('id', targetUserId)
          .maybeSingle();

        if (singleError) {
          console.error('Supabase Error Details:', singleError);
        } else if (singleProfile) {
          return NextResponse.json({
            user: enrichUser(singleProfile),
            subjects: subjectsList,
          });
        }
      } catch (error) {
        console.error('Supabase Error Details:', error);
      }

      const { data: singleLegacy } = await admin
        .from('user_roles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (singleLegacy) {
        return NextResponse.json({
          user: enrichUser(singleLegacy),
          subjects: subjectsList,
        });
      }

      return NextResponse.json(
        { error: 'User profile not found in Supabase database.' },
        { status: 404 }
      );
    }

    // 3. Fetch all profiles directly from public.profiles
    let fetchedProfiles: any[] = [];
    try {
      const { data: plainProfiles, error: profError } = await admin
        .from('profiles')
        .select('id, full_name, email, role, status, assigned_subject_id, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profError) {
        console.error('Supabase Error Details:', profError);
      } else if (plainProfiles && plainProfiles.length > 0) {
        fetchedProfiles = plainProfiles;
      } else {
        // Fallback: check legacy user_roles table if profiles table is empty
        const { data: legacyUsers } = await admin
          .from('user_roles')
          .select('*')
          .order('created_at', { ascending: false });

        if (legacyUsers && legacyUsers.length > 0) {
          fetchedProfiles = legacyUsers;
        }
      }
    } catch (error) {
      console.error('Supabase Error Details:', error);
    }

    // Merge database profiles with live dynamic users
    const userMap = new Map<string, any>();
    fetchedProfiles.forEach((p) => userMap.set(p.id, p));
    dynamicUserCache.forEach((p, id) => {
      if (p._deleted) {
        userMap.delete(id);
      } else {
        userMap.set(id, { ...(userMap.get(id) || {}), ...p });
      }
    });

    const finalUsers = Array.from(userMap.values()).map(enrichUser);

    return NextResponse.json({
      users: finalUsers,
      subjects: subjectsList,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Creates a new user in auth.users and creates public.profiles record.
 * Requires super_admin role.
 * Body: { email, password, full_name, role, assigned_subject_id }
 */
export async function POST(request: NextRequest) {
  // 1. Authenticate caller as super_admin
  const verification = await verifySuperAdmin(request);
  if (!verification.authorized) {
    return NextResponse.json(
      { error: verification.error || 'Forbidden: 403 Forbidden. Super Admin credentials required.' },
      { status: verification.statusCode || 403 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error('[Admin API User Creation Error]: Supabase server admin client is unavailable.');
    return NextResponse.json(
      { error: 'Supabase server admin client is unavailable.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, full_name, role, assigned_subject_id } = body;

    // Validation
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (full_name || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (!cleanName) {
      return NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      );
    }

    const validRoles = ['super_admin', 'subject_lead', 'subject_member', 'student'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate and resolve assigned_subject_id:
    // Conforms strictly to UUID nullable, converts empty string "" or invalid format to null
    const { subjectId: resolvedSubjectId, subjectCode: resolvedSubjectCode } =
      sanitizeAssignedSubjectId(assigned_subject_id, role);

    console.log(`[Admin API] Creating user in Supabase Auth: email="${cleanEmail}", role="${role}", subject_id="${resolvedSubjectId}"`);

    // a) Create user in Supabase Auth via admin client
    let authData: any = null;
    let authError: any = null;
    try {
      const res = await admin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: cleanName,
          role: role,
          assigned_subject_id: resolvedSubjectId,
          assigned_subject_code: resolvedSubjectCode,
        },
      });
      authData = res.data;
      authError = res.error;
    } catch (err) {
      authError = err;
    }

    if (authError || !authData?.user) {
      console.error('Supabase Error Details:', authError);

      let errorMessage = authError?.message || 'Failed to create user in Supabase Auth.';
      if (
        errorMessage.includes('requires a valid Bearer token') ||
        authError?.status === 401
      ) {
        errorMessage =
          'Supabase Admin Service Role key (SUPABASE_SERVICE_ROLE_KEY) is missing or invalid. Please configure SUPABASE_SERVICE_ROLE_KEY in .env.local to enable server-side admin user provisioning.';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: authError?.message || authError,
        },
        { status: authError?.status || 400 }
      );
    }

    const authUser = authData.user;
    const newUserId = authUser.id;

    console.log(`[Admin API] Auth user created with ID: ${newUserId}. Now saving into public.profiles...`);

    // b) Insert new user's profile into public.profiles strictly conforming to table columns:
    // id (UUID), email (TEXT), full_name (TEXT), role (user_role), assigned_subject_id (UUID or null), status (TEXT)
    const now = new Date().toISOString();
    const profilePayload = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanName,
      role: role,
      assigned_subject_id: resolvedSubjectId,
      status: 'approved',
      created_at: now,
      updated_at: now,
    };

    let profileData: any = null;
    try {
      const { data: inserted, error: profileError } = await admin
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })
        .select('*')
        .single();

      if (profileError) {
        console.error('Supabase Error Details:', profileError);
        return NextResponse.json(
          {
            error: `User auth account created (${newUserId}), but failed to save profile into public.profiles: ${profileError.message}`,
            details: profileError,
            userId: newUserId,
          },
          { status: 500 }
        );
      }
      profileData = inserted;
    } catch (error) {
      console.error('Supabase Error Details:', error);
      return NextResponse.json(
        {
          error: `Exception saving profile into public.profiles: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error,
          userId: newUserId,
        },
        { status: 500 }
      );
    }

    console.log(`[Admin API] Profile saved successfully for user ${newUserId} (${cleanEmail}).`);

    // Keep dynamic cache in sync
    addCachedUser({
      ...profilePayload,
      ...(profileData || {}),
      assigned_subject_code: resolvedSubjectCode,
    });

    const finalUser = {
      ...(profileData || profilePayload),
      assigned_subject_code: resolvedSubjectCode,
    };

    return NextResponse.json(
      {
        success: true,
        user: finalUser,
        message: 'Account created successfully in Supabase Auth and public.profiles.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Supabase Error Details:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/users
 * Updates an existing user:
 * - Update status ('approved' | 'rejected' | 'pending')
 * - Reset password
 * - Update metadata (name, email, role, subject)
 * Requires super_admin role.
 */
export async function PUT(request: NextRequest) {
  const verification = await verifySuperAdmin(request);
  if (!verification.authorized) {
    return NextResponse.json(
      { error: verification.error || 'Forbidden: 403 Forbidden' },
      { status: verification.statusCode }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Supabase server admin client is unavailable.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { user_id, email, password, full_name, role, assigned_subject_id, status } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanName = full_name ? full_name.trim() : undefined;
    const cleanStatus = status ? status.trim().toLowerCase() : undefined;

    // Conforms strictly to UUID nullable, converts empty string "" or invalid format to null
    const { subjectId: cleanSubjectId, subjectCode: cleanSubjectCode } =
      sanitizeAssignedSubjectId(assigned_subject_id, role);

    // 1. Update in auth.users via admin.updateUserById
    const authUpdatePayload: {
      email?: string;
      password?: string;
      user_metadata?: Record<string, unknown>;
    } = {};

    if (cleanEmail) authUpdatePayload.email = cleanEmail;
    if (password && password.trim().length >= 6) {
      authUpdatePayload.password = password.trim();
    } else if (password && password.trim().length > 0 && password.trim().length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const metadataUpdate: Record<string, unknown> = {};
    if (cleanName) metadataUpdate.full_name = cleanName;
    if (role) metadataUpdate.role = role;
    if (cleanStatus) metadataUpdate.status = cleanStatus;
    if (assigned_subject_id !== undefined) {
      metadataUpdate.assigned_subject_id = cleanSubjectId;
      metadataUpdate.assigned_subject_code = cleanSubjectCode;
    }

    if (Object.keys(metadataUpdate).length > 0) {
      authUpdatePayload.user_metadata = metadataUpdate;
    }

    if (Object.keys(authUpdatePayload).length > 0 && UUID_REGEX.test(user_id)) {
      try {
        const { error: authError } = await admin.auth.admin.updateUserById(
          user_id,
          authUpdatePayload
        );
        if (authError) {
          console.error('Supabase Error Details:', authError);
        }
      } catch (err) {
        console.error('Supabase Error Details:', err);
      }
    }

    // 2. Update record in public.profiles: strictly conforming columns
    // id (UUID), email (TEXT), full_name (TEXT), role, assigned_subject_id (UUID or null), status
    const profileUpdate: {
      updated_at: string;
      email?: string;
      full_name?: string;
      role?: 'super_admin' | 'subject_lead' | 'subject_member' | 'student';
      status?: 'pending' | 'approved' | 'rejected';
      assigned_subject_id?: string | null;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (cleanEmail) profileUpdate.email = cleanEmail;
    if (cleanName) profileUpdate.full_name = cleanName;
    if (role && ['super_admin', 'subject_lead', 'subject_member', 'student'].includes(role)) {
      profileUpdate.role = role as any;
    }
    if (cleanStatus && ['pending', 'approved', 'rejected'].includes(cleanStatus)) {
      profileUpdate.status = cleanStatus as any;
    }
    if (assigned_subject_id !== undefined) {
      profileUpdate.assigned_subject_id = cleanSubjectId;
    }

    let updatedProfile: any = null;
    try {
      const { data: updated, error: profError } = await admin
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user_id)
        .select('*')
        .single();

      if (profError) {
        console.error('Supabase Error Details:', profError);
      } else if (updated) {
        updatedProfile = updated;
      }
    } catch (err) {
      console.error('Supabase Error Details:', err);
    }

    // 3. Update dynamic memory cache
    updateCachedUser(user_id, {
      ...profileUpdate,
      assigned_subject_code: cleanSubjectCode,
    } as any);

    const responseUser = {
      ...(updatedProfile || { id: user_id, ...profileUpdate }),
      assigned_subject_code: cleanSubjectCode,
    };

    return NextResponse.json({
      success: true,
      user: responseUser,
      message:
        cleanStatus === 'approved'
          ? 'Account approved successfully.'
          : cleanStatus === 'rejected'
          ? 'Account rejected.'
          : password
          ? 'Password updated successfully.'
          : 'Account updated successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Supabase Error Details:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users
 * Removes user from auth.users (cascades to profiles).
 * Requires super_admin role.
 * Enforces self-deletion prevention.
 */
export async function DELETE(request: NextRequest) {
  const verification = await verifySuperAdmin(request);
  if (!verification.authorized) {
    return NextResponse.json(
      { error: verification.error || 'Forbidden: 403 Forbidden' },
      { status: verification.statusCode }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Supabase server admin client is unavailable.' },
      { status: 503 }
    );
  }

  try {
    const url = new URL(request.url);
    let targetUserId = url.searchParams.get('user_id');

    if (!targetUserId) {
      try {
        const body = await request.json();
        targetUserId = body?.user_id;
      } catch {
        // no body provided
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'user_id is required for deletion.' },
        { status: 400 }
      );
    }

    // Guardrail: Prevent self-deletion by super_admin
    if (verification.callerId && verification.callerId === targetUserId) {
      return NextResponse.json(
        {
          error:
            'មិនអាចលុបគណនី Super Admin ផ្ទាល់ខ្លួនរបស់អ្នកបានឡើយ / Self-deletion is forbidden. You cannot delete your currently active Super Admin account.',
        },
        { status: 403 }
      );
    }

    if (verification.callerEmail) {
      const { data: targetProfile } = await admin
        .from('profiles')
        .select('email')
        .eq('id', targetUserId)
        .single();

      if (
        targetProfile &&
        targetProfile.email.toLowerCase() ===
          verification.callerEmail.toLowerCase()
      ) {
        return NextResponse.json(
          {
            error:
              'មិនអាចលុបគណនី Super Admin ផ្ទាល់ខ្លួនរបស់អ្នកបានឡើយ / Self-deletion is forbidden. You cannot delete your currently active Super Admin account.',
          },
          { status: 403 }
        );
      }
    }

    // 1. Delete from auth.users via admin API if valid UUID
    if (UUID_REGEX.test(targetUserId)) {
      try {
        const { error: deleteAuthError } = await admin.auth.admin.deleteUser(targetUserId);
        if (deleteAuthError) {
          console.warn('Auth admin deleteUser notice:', deleteAuthError.message);
        }
      } catch (err) {
        console.warn('Auth admin delete exception:', err);
      }
    }

    // 2. Cascade cleanup on profiles
    try {
      await admin.from('profiles').delete().eq('id', targetUserId);
    } catch {
      // ignore
    }

    // 3. Cleanup from user_roles
    try {
      await admin.from('user_roles').delete().eq('user_id', targetUserId);
    } catch {
      // ignore
    }

    // Mark deleted in dynamic memory cache
    deleteCachedUser(targetUserId);

    return NextResponse.json({
      success: true,
      message: 'Account permanently removed.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
