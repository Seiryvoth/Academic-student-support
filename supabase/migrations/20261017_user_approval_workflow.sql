-- ====================================================================
-- SUPABASE MIGRATION: USER ONBOARDING & APPROVAL WORKFLOW
-- Date: 2026-10-17
-- Module: Approval Status on Profiles, Auto-Sync, and RBAC Extensions
-- ====================================================================

-- 1. ADD STATUS COLUMN TO PROFILES TABLE IF NOT EXISTS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'profiles'
          AND column_name = 'status'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'
        CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- 2. CREATE INDEX ON STATUS FOR FAST FILTERING
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role_status ON public.profiles(role, status);

-- 3. ENSURE ALL PRE-EXISTING ACCOUNTS HAVE 'approved' STATUS
UPDATE public.profiles
SET status = 'approved'
WHERE status IS NULL;

-- 4. UPDATE AUTH.USERS TRIGGER TO PROPERLY HANDLE PENDING ON SELF-SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_profile()
RETURNS TRIGGER AS $$
DECLARe
    v_role public.user_role;
    v_subject_id UUID;
    v_full_name TEXT;
    v_status TEXT;
BEGIN
    -- Parse role safely from raw_user_meta_data
    BEGIN
        v_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    EXCEPTION WHEN OTHERS THEN
        v_role := 'student'::public.user_role;
    END;

    -- Parse assigned_subject_id safely
    BEGIN
        v_subject_id := (NEW.raw_user_meta_data->>'assigned_subject_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_subject_id := NULL;
    END;

    -- Extract full name
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );

    -- Extract or determine status
    -- Super Admin accounts or admin emails are automatically 'approved'
    IF v_role = 'super_admin' OR NEW.email ILIKE '%admin@moeys.gov.kh%' THEN
        v_status := 'approved';
    ELSE
        v_status := COALESCE(NEW.raw_user_meta_data->>'status', 'pending');
        IF v_status NOT IN ('pending', 'approved', 'rejected') THEN
            v_status := 'pending';
        END IF;
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        assigned_subject_id,
        status,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        COALESCE(v_role, 'student'::public.user_role),
        v_subject_id,
        v_status,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        assigned_subject_id = EXCLUDED.assigned_subject_id,
        status = CASE 
            -- Do not overwrite approved status back to pending on sync unless specified
            WHEN public.profiles.status = 'approved' AND EXCLUDED.status = 'pending' THEN 'approved'
            ELSE EXCLUDED.status
        END,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user_profile();
