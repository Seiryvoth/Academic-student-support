-- ====================================================================
-- SUPABASE MIGRATION: SUBJECT TEAM & ACCOUNT MANAGEMENT RBAC
-- Date: 2026-10-17
-- Module: Profiles, Subjects, Roles ENUM, and Team Isolation RLS
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE ROLES ENUM
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('super_admin', 'subject_lead', 'subject_member', 'student');
    ELSE
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'subject_lead';
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'subject_member';
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'student';
    END IF;
END $$;

-- 3. CREATE SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name_km TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed core 5 subjects if they don't exist yet
INSERT INTO public.subjects (id, code, name_km, name_en)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'math', 'គណិតវិទ្យា', 'Mathematics'),
    ('a0000000-0000-0000-0000-000000000002', 'physics', 'រូបវិទ្យា', 'Physics'),
    ('a0000000-0000-0000-0000-000000000003', 'chemistry', 'គីមីវិទ្យា', 'Chemistry'),
    ('a0000000-0000-0000-0000-000000000004', 'biology', 'ជីវវិទ្យា', 'Biology'),
    ('a0000000-0000-0000-0000-000000000005', 'english', 'ភាសាអង់គ្លេស', 'English')
ON CONFLICT (code) DO UPDATE
SET name_km = EXCLUDED.name_km,
    name_en = EXCLUDED.name_en;

-- 4. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role public.user_role NOT NULL DEFAULT 'student',
    assigned_subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups & joins
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_assigned_subject ON public.profiles(assigned_subject_id);

-- 5. UPDATED_AT TRIGGER FOR PROFILES
CREATE OR REPLACE FUNCTION public.handle_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profiles_updated_at();

-- 6. AUTH.USERS AUTO-SYNC TRIGGER (Inserts/updates profiles on auth signup/admin creation)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    v_role public.user_role;
    v_subject_id UUID;
    v_full_name TEXT;
BEGIN
    BEGIN
        v_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    EXCEPTION WHEN OTHERS THEN
        v_role := 'student'::public.user_role;
    END;

    BEGIN
        v_subject_id := (NEW.raw_user_meta_data->>'assigned_subject_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_subject_id := NULL;
    END;

    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        assigned_subject_id,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        COALESCE(v_role, 'student'::public.user_role),
        v_subject_id,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        assigned_subject_id = EXCLUDED.assigned_subject_id,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user_profile();

-- 7. RBAC SECURITY DEFINER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'super_admin'
    ) OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'super_admin'
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_caller_assigned_subject_id()
RETURNS UUID AS $$
DECLARE
    v_subject_id UUID;
BEGIN
    SELECT assigned_subject_id INTO v_subject_id
    FROM public.profiles
    WHERE id = auth.uid();
    RETURN v_subject_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES ON SUBJECTS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public and authenticated can read subjects" ON public.subjects;
CREATE POLICY "Public and authenticated can read subjects"
    ON public.subjects
    FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "Super admin can manage subjects" ON public.subjects;
CREATE POLICY "Super admin can manage subjects"
    ON public.subjects
    FOR ALL
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- 9. ROW LEVEL SECURITY (RLS) POLICIES ON PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read profiles (Permissive SELECT so profiles can be retrieved)
DROP POLICY IF EXISTS "Allow read profiles" ON public.profiles;
CREATE POLICY "Allow read profiles" ON public.profiles FOR SELECT USING (true);

-- Policy A: Super Admin has full unrestricted read/write access to all profiles
DROP POLICY IF EXISTS "Super admin full access on profiles" ON public.profiles;
CREATE POLICY "Super admin full access on profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- Policy B: Authenticated users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Policy C: Subject Lead and Subject Member can ONLY view members within their assigned subject
DROP POLICY IF EXISTS "Subject team members can view subject peers" ON public.profiles;
CREATE POLICY "Subject team members can view subject peers"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles caller
            WHERE caller.id = auth.uid()
              AND caller.role IN ('subject_lead', 'subject_member')
              AND caller.assigned_subject_id IS NOT NULL
              AND caller.assigned_subject_id = public.profiles.assigned_subject_id
        )
    );

-- 10. SYNC EXISTING USER_ROLES INTO PROFILES IF DATA EXISTS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        INSERT INTO public.profiles (id, email, full_name, role, assigned_subject_id)
        SELECT
            ur.user_id,
            ur.email,
            ur.full_name,
            CASE
                WHEN ur.role = 'super_admin' THEN 'super_admin'::public.user_role
                WHEN ur.role = 'subject_lead' THEN 'subject_lead'::public.user_role
                ELSE 'student'::public.user_role
            END,
            s.id
        FROM public.user_roles ur
        LEFT JOIN public.subjects s ON s.code = ur.subject_assigned
        WHERE ur.user_id IS NOT NULL
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
