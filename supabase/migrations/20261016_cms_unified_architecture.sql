-- ====================================================================
-- CAMBODIAN MoEYS SCHOOL ACADEMIC & STUDENT SUPPORT APPLICATION
-- CMS UNIFIED RELATIONAL ARCHITECTURE & SYNCHRONIZATION MIGRATION
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 7 AND 12),
    subject_id TEXT NOT NULL CHECK (subject_id IN ('math', 'physics', 'chemistry', 'biology', 'english')),
    title_km TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_km TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_filter ON public.lessons(subject_id, grade_level, order_index);

-- 2. VIDEOS TABLE (YouTube-Style Playlist Support)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title_km TEXT NOT NULL,
    title_en TEXT NOT NULL,
    video_url TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_lesson ON public.videos(lesson_id, order_index);

-- 3. VIDEO ATTACHMENTS TABLE (PDF Handouts & Lecture Slides)
CREATE TABLE IF NOT EXISTS public.video_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_attachments_video ON public.video_attachments(video_id);

-- 4. UNIFIED MCQs TABLE (Unified & Synchronized across Lessons and Videos)
CREATE TABLE IF NOT EXISTS public.mcqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 7 AND 12),
    subject_id TEXT NOT NULL CHECK (subject_id IN ('math', 'physics', 'chemistry', 'biology', 'english')),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE, -- NULL for general lesson MCQs, UUID for video comprehension quizzes
    question_km TEXT NOT NULL,
    question_en TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 5 choices: ["A", "B", "C", "D", "E"]
    correct_answer TEXT NOT NULL, -- 'A', 'B', 'C', 'D', or 'E'
    explanation TEXT,
    hint_km TEXT,
    hint_en TEXT,
    explanation_km TEXT,
    explanation_en TEXT,
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('basic', 'medium', 'advanced')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mcqs_lesson ON public.mcqs(subject_id, grade_level, lesson_id);
CREATE INDEX IF NOT EXISTS idx_mcqs_video ON public.mcqs(video_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;

-- A. Public Read Policies for Students and Public Users
DROP POLICY IF EXISTS "Public Read Lessons" ON public.lessons;
CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Read Videos" ON public.videos;
CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Read Video Attachments" ON public.video_attachments;
CREATE POLICY "Public Read Video Attachments" ON public.video_attachments FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Read MCQs" ON public.mcqs;
CREATE POLICY "Public Read MCQs" ON public.mcqs FOR SELECT USING (TRUE);

-- B. Staff Access Control Helper Functions
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

CREATE OR REPLACE FUNCTION public.has_subject_access(target_subject TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'subject_lead'
          AND subject_assigned = target_subject
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. Staff Write Policies (Lessons)
DROP POLICY IF EXISTS "Staff Manage Lessons" ON public.lessons;
CREATE POLICY "Staff Manage Lessons" ON public.lessons FOR ALL
    USING (public.has_subject_access(subject_id))
    WITH CHECK (public.has_subject_access(subject_id));

-- D. Staff Write Policies (Videos)
DROP POLICY IF EXISTS "Staff Manage Videos" ON public.videos;
CREATE POLICY "Staff Manage Videos" ON public.videos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            WHERE l.id = lesson_id
              AND public.has_subject_access(l.subject_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lessons l
            WHERE l.id = lesson_id
              AND public.has_subject_access(l.subject_id)
        )
    );

-- E. Staff Write Policies (Video Attachments)
DROP POLICY IF EXISTS "Staff Manage Video Attachments" ON public.video_attachments;
CREATE POLICY "Staff Manage Video Attachments" ON public.video_attachments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.videos v
            JOIN public.lessons l ON l.id = v.lesson_id
            WHERE v.id = video_id
              AND public.has_subject_access(l.subject_id)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.videos v
            JOIN public.lessons l ON l.id = v.lesson_id
            WHERE v.id = video_id
              AND public.has_subject_access(l.subject_id)
        )
    );

-- F. Staff Write Policies (MCQs)
DROP POLICY IF EXISTS "Staff Manage MCQs" ON public.mcqs;
CREATE POLICY "Staff Manage MCQs" ON public.mcqs FOR ALL
    USING (public.has_subject_access(subject_id))
    WITH CHECK (public.has_subject_access(subject_id));
