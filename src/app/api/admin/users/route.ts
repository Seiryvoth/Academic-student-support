import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, verifySuperAdmin } from '@/lib/supabase-admin';

// Helper: UUID validator
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/admin/users
 * Returns list of team members/profiles and subjects.
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
    // 1. Fetch subjects
    const { data: subjects, error: subjError } = await admin
      .from('subjects')
      .select('id, code, name_km, name_en')
      .order('code', { ascending: true });

    if (subjError) {
      console.warn('Could not fetch subjects table:', subjError.message);
    }

    // 2. Fetch profiles
    const { data: profiles, error: profError } = await admin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profError) {
      console.warn('Could not fetch profiles table:', profError.message);
      // Fallback: check legacy user_roles table if profiles table is not yet migrated
      const { data: legacyUsers } = await admin
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      return NextResponse.json({
        users: legacyUsers || [],
        subjects: subjects || [],
        isLegacy: true,
      });
    }

    return NextResponse.json({
      users: profiles || [],
      subjects: subjects || [],
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
    if (resolvedSubjectId && !UUID_REGEX.test(resolvedSubjectId)) {
      const { data: matchedSubject } = await admin
        .from('subjects')
        .select('id')
        .eq('code', resolvedSubjectId)
        .single();
      if (matchedSubject) {
        resolvedSubjectId = matchedSubject.id;
      }
    }

    // 1. Create account in auth.users via Supabase Auth Admin API
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        role: role,
        assigned_subject_id: resolvedSubjectId,
      },
    });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create auth user' },
        { status: 400 }
      );
    }

    const newUserId = authUser.user.id;

    // 2. Insert into public.profiles
    const profilePayload = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanName,
      role: role,
      assigned_subject_id: resolvedSubjectId,
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
        subject_assigned: body.subject_code || (role === 'super_admin' ? null : 'math'),
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Legacy table sync is optional
    }

    return NextResponse.json(
      {
        success: true,
        user: createdProfile || profilePayload,
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
    if (resolvedSubjectId && !UUID_REGEX.test(resolvedSubjectId)) {
      const { data: matchedSubject } = await admin
        .from('subjects')
        .select('id')
        .eq('code', resolvedSubjectId)
        .single();
      if (matchedSubject) {
        resolvedSubjectId = matchedSubject.id;
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
    }

    authUpdatePayload.user_metadata = {
      ...(cleanName ? { full_name: cleanName } : {}),
      ...(role ? { role: role } : {}),
      assigned_subject_id: resolvedSubjectId,
    };

    // Only invoke auth update if fields changed
    if (Object.keys(authUpdatePayload).length > 0) {
      const { error: authError } = await admin.auth.admin.updateUserById(
        user_id,
        authUpdatePayload
      );
      if (authError) {
        console.warn('Auth admin update notice:', authError.message);
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
      profileUpdate.assigned_subject_id = resolvedSubjectId;
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
      await admin
        .from('user_roles')
        .update(legacyUpdate)
        .eq('user_id', user_id);
    } catch {
      // Legacy sync optional
    }

    return NextResponse.json({
      success: true,
      user: updatedProfile || { id: user_id, ...profileUpdate },
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

    // 1. Delete from auth.users via admin API
    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(targetUserId);

    if (deleteAuthError) {
      console.warn('Auth admin deleteUser notice:', deleteAuthError.message);
    }

    // 2. Cascade cleanup on profiles if FK cascade wasn't triggered
    await admin.from('profiles').delete().eq('id', targetUserId);

    // 3. Cleanup from user_roles
    await admin.from('user_roles').delete().eq('user_id', targetUserId);

    return NextResponse.json({
      success: true,
      message: 'Account deleted permanently.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
