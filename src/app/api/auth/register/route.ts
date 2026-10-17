import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { addCachedUser } from '@/lib/dynamic-user-cache';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CORE_SUBJECT_MAP: Record<string, string> = {
  'math': 'a0000000-0000-0000-0000-000000000001',
  'physics': 'a0000000-0000-0000-0000-000000000002',
  'chemistry': 'a0000000-0000-0000-0000-000000000003',
  'biology': 'a0000000-0000-0000-0000-000000000004',
  'english': 'a0000000-0000-0000-0000-000000000005',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role, assigned_subject_id, subject_code } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (full_name || '').trim();
    const cleanRole = (role || '').trim().toLowerCase();

    // 1. Basic validation
    if (!cleanName) {
      return NextResponse.json(
        { error: 'សូមបញ្ចូលឈ្មោះពេញ ឬឈ្មោះអ្នកប្រើប្រាស់ / Full Name or Username is required.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ / Valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ / Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // 2. Strict Role Guardrail: super_admin can NEVER be self-registered
    if (cleanRole === 'super_admin' || cleanRole === 'admin') {
      return NextResponse.json(
        {
          error:
            'មិនអនុញ្ញាតឱ្យចុះឈ្មោះជា Super Admin ដោយផ្ទាល់ឡើយ / Selecting Super Admin role is strictly forbidden during registration.',
        },
        { status: 403 }
      );
    }

    const validRoles = ['subject_lead', 'subject_member', 'student'];
    if (!validRoles.includes(cleanRole)) {
      return NextResponse.json(
        {
          error: `តួនាទីមិនត្រឹមត្រូវឡើយ / Invalid role. Allowed: ${validRoles.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 3. Subject validation: required for subject_lead and subject_member
    let resolvedSubjectId: string | null = null;
    let resolvedSubjectCode: string | null = null;

    if (cleanRole === 'subject_lead' || cleanRole === 'subject_member') {
      const targetSubj = (assigned_subject_id || subject_code || '').trim().toLowerCase();
      if (!targetSubj) {
        return NextResponse.json(
          {
            error:
              'សូមជ្រើសរើសមុខវិជ្ជាសម្រាប់តួនាទីនេះ / Subject selection is required for Subject Leads and Members.',
          },
          { status: 400 }
        );
      }

      if (CORE_SUBJECT_MAP[targetSubj]) {
        resolvedSubjectCode = targetSubj;
        resolvedSubjectId = CORE_SUBJECT_MAP[targetSubj];
      } else if (UUID_REGEX.test(targetSubj)) {
        resolvedSubjectId = targetSubj;
        // Reverse lookup code
        for (const [code, uuid] of Object.entries(CORE_SUBJECT_MAP)) {
          if (uuid.toLowerCase() === targetSubj.toLowerCase()) {
            resolvedSubjectCode = code;
            break;
          }
        }
      } else {
        resolvedSubjectCode = targetSubj;
      }
    }

    const admin = getSupabaseAdmin();
    let newUserId: string | null = null;

    // 4. Create user in auth.users
    if (admin) {
      try {
        const { data: authUser, error: authError } = await admin.auth.admin.createUser({
          email: cleanEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            role: cleanRole,
            status: 'pending',
            assigned_subject_id: resolvedSubjectId,
            assigned_subject_code: resolvedSubjectCode,
          },
        });

        if (authUser?.user) {
          newUserId = authUser.user.id;
        } else if (authError) {
          // If already registered, return friendly error
          if (authError.message.toLowerCase().includes('already registered')) {
            return NextResponse.json(
              {
                error:
                  'អ៊ីមែលនេះមានក្នុងប្រព័ន្ធរួចហើយ / An account with this email already exists.',
              },
              { status: 409 }
            );
          }
          console.warn('Auth admin createUser notice:', authError.message);
        }
      } catch (err) {
        console.warn('Auth admin exception in register:', err);
      }
    }

    // Generate resilient UUID if auth admin did not supply one (e.g. dev/anon mode)
    if (!newUserId) {
      newUserId =
        'a' +
        Math.random().toString(16).substring(2, 9) +
        '-' +
        Math.random().toString(16).substring(2, 6) +
        '-4' +
        Math.random().toString(16).substring(2, 5) +
        '-a' +
        Math.random().toString(16).substring(2, 5) +
        '-' +
        Math.random().toString(16).substring(2, 14);
    }

    const now = new Date().toISOString();
    const profileRecord = {
      id: newUserId,
      email: cleanEmail,
      full_name: cleanName,
      role: cleanRole as 'subject_lead' | 'subject_member' | 'student',
      status: 'pending' as const,
      assigned_subject_id: resolvedSubjectId,
      assigned_subject_code: resolvedSubjectCode,
      created_at: now,
      updated_at: now,
    };

    // 5. Store in public.profiles with status: 'pending'
    if (admin) {
      try {
        await admin.from('profiles').upsert(
          {
            id: newUserId,
            email: cleanEmail,
            full_name: cleanName,
            role: cleanRole,
            status: 'pending',
            assigned_subject_id: resolvedSubjectId,
            created_at: now,
            updated_at: now,
          },
          { onConflict: 'id' }
        );
      } catch (profErr) {
        console.warn('Failed to insert into public.profiles directly:', profErr);
      }
    }

    // 6. Record in live server memory cache
    addCachedUser(profileRecord);

    return NextResponse.json(
      {
        success: true,
        user: profileRecord,
        message:
          'ការចុះឈ្មោះបានជោគជ័យ! គណនីរបស់អ្នកកំពុងរង់ចាំការអនុម័តពី Super Admin / Registration submitted! Please wait for Super Admin approval.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown registration error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
