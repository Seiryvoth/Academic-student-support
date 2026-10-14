-- ====================================================================
-- CAMBODIAN MoEYS SCHOOL ACADEMIC & STUDENT SUPPORT APPLICATION
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STAFF ROLES TABLE
-- Controls Super Admin (all subjects) and 5 Subject Leads (locked to assigned subject)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'subject_lead')),
    subject_assigned TEXT CHECK (
        subject_assigned IN ('math', 'physics', 'chemistry', 'biology', 'english') 
        OR subject_assigned IS NULL
    ),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT subject_assigned_check CHECK (
        (role = 'super_admin' AND subject_assigned IS NULL) OR
        (role = 'subject_lead' AND subject_assigned IS NOT NULL)
    )
);

-- Index for fast user auth queries
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles(email);

-- 3. MOEYS CURRICULUM LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY, -- e.g. 'math-g7-1'
    subject TEXT NOT NULL CHECK (subject IN ('math', 'physics', 'chemistry', 'biology', 'english')),
    grade INTEGER NOT NULL CHECK (grade BETWEEN 7 AND 12),
    order_index INTEGER NOT NULL,
    title_km TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_km TEXT,
    description_en TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_filter ON public.lessons(subject, grade, order_index);

-- 4. SYSTEM A: STANDARD CURRICULUM MCQs (10 MCQs Per Lesson)
CREATE TABLE IF NOT EXISTS public.curriculum_mcqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    subject TEXT NOT NULL CHECK (subject IN ('math', 'physics', 'chemistry', 'biology', 'english')),
    grade INTEGER NOT NULL CHECK (grade BETWEEN 7 AND 12),
    question_number INTEGER NOT NULL CHECK (question_number BETWEEN 1 AND 10),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'medium', 'advanced')),
    question_km TEXT NOT NULL,
    question_en TEXT NOT NULL,
    options_km JSONB NOT NULL, -- Array of 5 choices: ["A", "B", "C", "D", "E"]
    options_en JSONB NOT NULL, -- Array of 5 choices: ["A", "B", "C", "D", "E"]
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),
    hint_km TEXT NOT NULL,
    hint_en TEXT NOT NULL,
    explanation_km TEXT NOT NULL,
    explanation_en TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_curriculum_mcq UNIQUE (lesson_id, question_number)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_mcqs_lesson ON public.curriculum_mcqs(lesson_id, question_number);

-- 5. VIDEO LESSONS & HYBRID STORAGE RESOURCES
CREATE TABLE IF NOT EXISTS public.video_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    subject TEXT NOT NULL CHECK (subject IN ('math', 'physics', 'chemistry', 'biology', 'english')),
    grade INTEGER NOT NULL CHECK (grade BETWEEN 7 AND 12),
    title_km TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_km TEXT,
    description_en TEXT,
    youtube_url TEXT NOT NULL,
    youtube_video_id TEXT NOT NULL,
    pdf_url TEXT,
    pdf_source_type TEXT NOT NULL DEFAULT 'gdrive' CHECK (pdf_source_type IN ('gdrive', 'upload', 'external')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_resources_lookup ON public.video_resources(subject, grade, lesson_id);

-- 6. SYSTEM B: VIDEO-ATTACHED COMPREHENSION MCQs
CREATE TABLE IF NOT EXISTS public.video_mcqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES public.video_resources(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_km TEXT NOT NULL,
    question_en TEXT NOT NULL,
    options_km JSONB NOT NULL, -- Array of 5 choices: ["A", "B", "C", "D", "E"]
    options_en JSONB NOT NULL, -- Array of 5 choices: ["A", "B", "C", "D", "E"]
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),
    hint_km TEXT NOT NULL,
    hint_en TEXT NOT NULL,
    explanation_km TEXT NOT NULL,
    explanation_en TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_mcqs_video ON public.video_mcqs(video_id, question_number);

-- ====================================================================
-- RLS FUNCTIONS & POLICIES
-- ====================================================================

-- Function to check if the current user is an active Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'super_admin'
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if the current user has access to a specific subject
CREATE OR REPLACE FUNCTION public.has_subject_access(target_subject TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Super Admin has access to all subjects
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    -- Subject Lead has access only to their assigned subject
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'subject_lead'
          AND subject_assigned = target_subject
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_mcqs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- A. PUBLIC STUDENT ACCESS (NO AUTH REQUIRED FOR READING)
-- --------------------------------------------------------------------
-- Students can read all lessons freely
CREATE POLICY "Public Read Lessons"
    ON public.lessons FOR SELECT
    USING (TRUE);

-- Students can read all curriculum practice MCQs freely
CREATE POLICY "Public Read Curriculum MCQs"
    ON public.curriculum_mcqs FOR SELECT
    USING (TRUE);

-- Students can read all video lesson resources and PDF links freely
CREATE POLICY "Public Read Video Resources"
    ON public.video_resources FOR SELECT
    USING (TRUE);

-- Students can read all video comprehension MCQs freely
CREATE POLICY "Public Read Video MCQs"
    ON public.video_mcqs FOR SELECT
    USING (TRUE);

-- --------------------------------------------------------------------
-- B. STAFF ACCESS POLICIES (SUPER ADMIN & SUBJECT LEADS)
-- --------------------------------------------------------------------

-- User Roles Table Policies
CREATE POLICY "Staff Read Own Role or Super Admin Read All"
    ON public.user_roles FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_super_admin()
    );

CREATE POLICY "Super Admin Manage User Roles"
    ON public.user_roles FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- Lessons Table Policies
CREATE POLICY "Super Admin Modify Lessons"
    ON public.lessons FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- Video Resources Table Policies (Subject Lead restricted to assigned subject)
CREATE POLICY "Staff Insert Video Resources"
    ON public.video_resources FOR INSERT
    WITH CHECK (public.has_subject_access(subject));

CREATE POLICY "Staff Update Video Resources"
    ON public.video_resources FOR UPDATE
    USING (public.has_subject_access(subject))
    WITH CHECK (public.has_subject_access(subject));

CREATE POLICY "Staff Delete Video Resources"
    ON public.video_resources FOR DELETE
    USING (public.has_subject_access(subject));

-- Video MCQs Table Policies (Restricted via parent video subject)
CREATE POLICY "Staff Insert Video MCQs"
    ON public.video_mcqs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.video_resources v
            WHERE v.id = video_id
              AND public.has_subject_access(v.subject)
        )
    );

CREATE POLICY "Staff Update Video MCQs"
    ON public.video_mcqs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.video_resources v
            WHERE v.id = video_id
              AND public.has_subject_access(v.subject)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.video_resources v
            WHERE v.id = video_id
              AND public.has_subject_access(v.subject)
        )
    );

CREATE POLICY "Staff Delete Video MCQs"
    ON public.video_mcqs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.video_resources v
            WHERE v.id = video_id
              AND public.has_subject_access(v.subject)
        )
    );

-- Curriculum MCQs Table Policies (Super Admin or Subject Lead for that subject)
CREATE POLICY "Staff Insert Curriculum MCQs"
    ON public.curriculum_mcqs FOR INSERT
    WITH CHECK (public.has_subject_access(subject));

CREATE POLICY "Staff Update Curriculum MCQs"
    ON public.curriculum_mcqs FOR UPDATE
    USING (public.has_subject_access(subject))
    WITH CHECK (public.has_subject_access(subject));

CREATE POLICY "Staff Delete Curriculum MCQs"
    ON public.curriculum_mcqs FOR DELETE
    USING (public.has_subject_access(subject));
