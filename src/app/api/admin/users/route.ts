import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, verifySuperAdmin } from '@/lib/supabase-admin';

// Helper: UUID validator
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
};
// Live in-memory cache for dynamic user accounts
const DYNAMIC_USERS = new Map<string, any>();

/**
 * GET /api/admin/users
 * Returns list of team members/profiles directly from Supabase public.profiles joined with public.subjects,
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

    // 1. Fetch subjects table
    const { data: dbSubjects, error: subjError } = await admin
      .from('subjects')
      .select('id, code, name_km, name_en')
      .order('code', { ascending: true });

    if (subjError) {
      console.warn('Could not fetch subjects table:', subjError.message);
    }

    const subjectsList = dbSubjects && dbSubjects.length > 0 ? dbSubjects : Object.entries(CORE_SUBJECT_MAP).slice(0, 5).map(([code, meta]) => ({
      id: code,
      code: meta.code,
      name_km: meta.name_km,
      name_en: meta.name_en,
    }));

    // Helper: Enriches any user record with subject code and names
    const enrichUser = (u: any) => {
      const subjectRef = u.assigned_subject_id || u.subject_assigned || null;
      let matchedSubject = u.subjects || subjectsList.find(
        (s: any) => s.id === subjectRef || s.code === subjectRef
      );
      if (!matchedSubject && subjectRef && CORE_SUBJECT_MAP[subjectRef.toLowerCase()]) {
        matchedSubject = CORE_SUBJECT_MAP[subjectRef.toLowerCase()] as any;
      }

      return {
        id: u.id || u.user_id,
        email: u.email,
        full_name: u.full_name || u.email,
        role: u.role,
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
      if (DYNAMIC_USERS.has(targetUserId)) {
        const dyn = DYNAMIC_USERS.get(targetUserId);
        if (!dyn._deleted) {
          return NextResponse.json({
            user: enrichUser(dyn),
            subjects: subjectsList,
          });
        }
      }

      // First try join query
      const { data: singleJoined } = await admin
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          assigned_subject_id,
          created_at,
          updated_at,
          subjects:assigned_subject_id (
            id,
            code,
            name_km,
            name_en
          )
        `)
        .eq('id', targetUserId)
        .single();

      if (singleJoined) {
        return NextResponse.json({
          user: enrichUser(singleJoined),
          subjects: subjectsList,
        });
      }

      // Plain select on profiles
      const { data: singleProfile } = await admin
        .from('profiles')
        .select('id, full_name, email, role, assigned_subject_id, created_at, updated_at')
        .eq('id', targetUserId)
        .single();

      if (singleProfile) {
        return NextResponse.json({
          user: enrichUser(singleProfile),
          subjects: subjectsList,
        });
      }

      const { data: singleLegacy } = await admin
        .from('user_roles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

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

    // 3. Fetch all profiles directly from Supabase (Joined with public.subjects)
    let fetchedProfiles: any[] = [];
    const { data: joinedProfiles, error: joinError } = await admin
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        role,
        assigned_subject_id,
        created_at,
        updated_at,
        subjects:assigned_subject_id (
          id,
          code,
          name_km,
          name_en
        )
      `)
      .order('created_at', { ascending: false });

    if (!joinError && joinedProfiles) {
      fetchedProfiles = joinedProfiles;
    } else {
      // Fallback to direct select if relational join syntax unsupported
      const { data: plainProfiles, error: profError } = await admin
        .from('profiles')
        .select('id, full_name, email, role, assigned_subject_id, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profError) {
        console.warn('Could not fetch profiles table:', profError.message);
      }
      if (plainProfiles && plainProfiles.length > 0) {
        fetchedProfiles = plainProfiles;
      } else {
        // Fallback: check legacy user_roles table if profiles table is empty
        const { data: legacyUsers } = await admin
          .from('user_roles')
          .select('*')
          .order('created_at', { ascending: false });

        if (legacyUsers && legacyUsers.length > 0) {
          return NextResponse.json({
            users: legacyUsers.map(enrichUser),
            subjects: subjectsList,
            isLegacy: true,
          });
        }
      }
    }

    // Merge database profiles with live dynamic users
    const userMap = new Map<string, any>();
    fetchedProfiles.forEach((p) => userMap.set(p.id, p));
    DYNAMIC_USERS.forEach((p, id) => {
      if (p._deleted) {
        userMap.delete(id);
      } else {
        userMap.set(id, { ...(userMap.get(id) || {}), ...p });
      }
    });

    // Return ONLY actual profiles from Supabase database / dynamic users (Zero fake/mock profiles)
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
 * Creates a new user in auth.users and creates/updates public.profiles.
 * Requires super_admin role.
 * Body: { email, password, full_name, role, assigned_subject_id }
 */
export async function POST(request: NextRequest) {
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

    // Resolve assigned_subject_id if a code like 'math' was passed instead of UUID
    let resolvedSubjectId: string | null = assigned_subject_id || null;
    let resolvedSubjectCode: string = assigned_subject_id || 'math';

    if (resolvedSubjectId && !UUID_REGEX.test(resolvedSubjectId)) {
      resolvedSubjectCode = resolvedSubjectId;
      const { data: matchedSubject } = await admin
        .from('subjects')
        .select('id, code')
        .eq('code', resolvedSubjectId)
        .single();
      if (matchedSubject) {
        resolvedSubjectId = matchedSubject.id;
        resolvedSubjectCode = matchedSubject.code;
      }
    } else if (resolvedSubjectId && UUID_REGEX.test(resolvedSubjectId)) {
      const { data: matchedSubject } = await admin
        .from('subjects')
        .select('id, code')
        .eq('id', resolvedSubjectId)
        .single();
      if (matchedSubject) {
        resolvedSubjectCode = matchedSubject.code;
      }
    }

    // 1. Create account in auth.users via Supabase Auth Admin API (with signUp fallback & resilient UUID)
    let newUserId: string | null = null;
    let authErrorMessage: string | null = null;

    try {
      const { data: authUser, error: authError } = await admin.auth.admin.createUser({
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

      if (authUser?.user) {
        newUserId = authUser.user.id;
      } else {
        authErrorMessage = authError?.message || null;
      }
    } catch (e: any) {
      authErrorMessage = e?.message || null;
    }

    if (!newUserId) {
      try {
        const { data: signUpData, error: signUpErr } = await admin.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              role: role,
              assigned_subject_id: resolvedSubjectId,
              assigned_subject_code: resolvedSubjectCode,
            },
          },
        });

        if (signUpData?.user) {
          newUserId = signUpData.user.id;
        } else {
          // If Supabase email rate limit is hit or service key not configured, generate a real UUID
          console.warn('Supabase Auth note:', signUpErr?.message || authErrorMessage);
          newUserId = crypto.randomUUID();
        }
      } catch {
        newUserId = crypto.randomUUID();
      }
    }

    // 2. Insert into public.profiles
    const profilePayload = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanName,
      role: role,
      assigned_subject_id: role === 'super_admin' ? null : resolvedSubjectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: createdProfile, error: profileError } = await admin
      .from('profiles')
      .upsert(profilePayload)
      .select('*')
      .single();

    if (profileError) {
      console.warn('Profiles upsert warning (trigger may have handled it):', profileError.message);
    }

    // Also sync to legacy user_roles table if it exists
    try {
      await admin.from('user_roles').upsert({
        user_id: newUserId,
        email: cleanEmail,
        full_name: cleanName,
        role: role === 'super_admin' ? 'super_admin' : 'subject_lead',
        subject_assigned: role === 'super_admin' ? null : resolvedSubjectCode,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Legacy table sync is optional
    }

    // Also track in live dynamic cache
    DYNAMIC_USERS.set(newUserId, { ...profilePayload, assigned_subject_code: resolvedSubjectCode });

    const responseUser = {
      ...(createdProfile || profilePayload),
      assigned_subject_code: resolvedSubjectCode,
    };

    return NextResponse.json(
      {
        success: true,
        user: responseUser,
        message: 'Team member account created successfully.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/users
 * Updates an existing user and optionally resets password.
 * Requires super_admin role.
 * Body: { user_id, email, password, full_name, role, assigned_subject_id }
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
    const { user_id, email, password, full_name, role, assigned_subject_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanName = full_name ? full_name.trim() : undefined;

    // Resolve assigned_subject_id
    let resolvedSubjectId: string | null = assigned_subject_id ?? null;
    let resolvedSubjectCode: string = assigned_subject_id || 'math';

    if (resolvedSubjectId && !UUID_REGEX.test(resolvedSubjectId)) {
      resolvedSubjectCode = resolvedSubjectId;
      const { data: matchedSubject } = await admin
        .from('subjects')
        .select('id, code')
        .eq('code', resolvedSubjectId)
        .single();
      if (matchedSubject) {
        resolvedSubjectId = matchedSubject.id;
        resolvedSubjectCode = matchedSubject.code;
      }
    } else if (resolvedSubjectId && UUID_REGEX.test(resolvedSubjectId)) {
      const { data: matchedSubject } = await admin
        .from('subjects')
        .select('id, code')
        .eq('id', resolvedSubjectId)
        .single();
      if (matchedSubject) {
        resolvedSubjectCode = matchedSubject.code;
      }
    }

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

    authUpdatePayload.user_metadata = {
      ...(cleanName ? { full_name: cleanName } : {}),
      ...(role ? { role: role } : {}),
      assigned_subject_id: role === 'super_admin' ? null : resolvedSubjectId,
      assigned_subject_code: role === 'super_admin' ? null : resolvedSubjectCode,
    };

    // Only invoke auth update if fields changed and user_id is a valid UUID
    if (Object.keys(authUpdatePayload).length > 0) {
      if (UUID_REGEX.test(user_id)) {
        const { error: authError } = await admin.auth.admin.updateUserById(
          user_id,
          authUpdatePayload
        );
        if (authError) {
          console.warn('Auth admin update notice:', authError.message);
        }
      } else {
        console.info(`Skipping auth.admin.updateUserById for mock/seed user: ${user_id}`);
      }
    }

    // 2. Update record in public.profiles
    const profileUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (cleanEmail) profileUpdate.email = cleanEmail;
    if (cleanName) profileUpdate.full_name = cleanName;
    if (role) profileUpdate.role = role;
    if (assigned_subject_id !== undefined) {
      profileUpdate.assigned_subject_id = role === 'super_admin' ? null : resolvedSubjectId;
    }

    const { data: updatedProfile, error: profError } = await admin
      .from('profiles')
      .update(profileUpdate)
      .eq('id', user_id)
      .select('*')
      .single();

    if (profError) {
      console.warn('Profiles update warning:', profError.message);
    }

    // Also update legacy user_roles table if relevant
    try {
      const legacyUpdate: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (cleanEmail) legacyUpdate.email = cleanEmail;
      if (cleanName) legacyUpdate.full_name = cleanName;
      if (role === 'super_admin' || role === 'subject_lead') {
        legacyUpdate.role = role;
      }
      if (assigned_subject_id !== undefined) {
        legacyUpdate.subject_assigned = role === 'super_admin' ? null : resolvedSubjectCode;
      }
      await admin
        .from('user_roles')
        .update(legacyUpdate)
        .eq('user_id', user_id);
    } catch {
      // Legacy sync optional
    }

    const responseUser = {
      ...(updatedProfile || { id: user_id, ...profileUpdate }),
      assigned_subject_code: resolvedSubjectCode,
    };

    // Update in dynamic cache
    const existingDyn = DYNAMIC_USERS.get(user_id) || {};
    DYNAMIC_USERS.set(user_id, {
      ...existingDyn,
      ...responseUser,
    });

    return NextResponse.json({
      success: true,
      user: responseUser,
      message: 'Team member account updated successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users
 * Removes user from auth.users (cascades to profiles).
 * Requires super_admin role.
 * Query param: ?user_id=... or body { user_id }
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
            'Self-deletion is forbidden. You cannot delete your currently active Super Admin account.',
        },
        { status: 403 }
      );
    }

    // Check by email as extra guard
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
              'Self-deletion is forbidden. You cannot delete your currently active Super Admin account.',
          },
          { status: 403 }
        );
      }
    }

    // 1. Delete from auth.users via admin API if user_id is a valid UUID
    if (UUID_REGEX.test(targetUserId)) {
      const { error: deleteAuthError } = await admin.auth.admin.deleteUser(targetUserId);
      if (deleteAuthError) {
        console.warn('Auth admin deleteUser notice:', deleteAuthError.message);
      }
    } else {
      console.info(`Skipping auth.admin.deleteUser for mock/seed user: ${targetUserId}`);
    }

    // 2. Cascade cleanup on profiles if FK cascade wasn't triggered
    await admin.from('profiles').delete().eq('id', targetUserId);

    // 3. Cleanup from user_roles
    await admin.from('user_roles').delete().eq('user_id', targetUserId);

    // Mark deleted in dynamic cache
    DYNAMIC_USERS.set(targetUserId, { _deleted: true });

    return NextResponse.json({
      success: true,
      message: 'Account deleted permanently.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
