-- ====================================================================
-- CAMBODIAN MoEYS SCHOOL ACADEMIC & STUDENT SUPPORT APPLICATION
-- STRICT ROLE-BASED ACCESS CONTROL (RBAC) & ROW LEVEL SECURITY (RLS)
-- ====================================================================

-- 1. Ensure user_roles table allows 'student' role in check constraint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'user_roles_role_check'
          AND table_name = 'user_roles'
    ) THEN
        ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_role_check;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        ALTER TABLE public.user_roles
            ADD CONSTRAINT user_roles_role_check
            CHECK (role IN ('super_admin', 'subject_lead', 'student'));
    END IF;
END $$;

-- 2. Staff Authorization Security Definer Functions
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
    -- Super Admin has universal cross-subject access
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    -- Subject Lead has access only to their assigned subject
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'subject_lead'
          AND (subject_assigned IS NULL OR subject_assigned = target_subject)
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper to lookup subject from lesson table
CREATE OR REPLACE FUNCTION public.get_lesson_subject(target_lesson_id TEXT)
RETURNS TEXT AS $$
DECLARE
    s_val TEXT;
BEGIN
    SELECT COALESCE(subject, subject_id) INTO s_val
    FROM public.lessons
    WHERE id = target_lesson_id;
    RETURN s_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ENABLE RLS ON ALL ACADEMIC CONTENT TABLES
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'curriculum_mcqs') THEN
        ALTER TABLE public.curriculum_mcqs ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'video_resources') THEN
        ALTER TABLE public.video_resources ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'video_mcqs') THEN
        ALTER TABLE public.video_mcqs ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ====================================================================
-- A. LESSONS POLICIES: Public/Student Read, Staff-Only Write
-- ====================================================================
DROP POLICY IF EXISTS "Public and Student Read Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Read Lessons" ON public.lessons;
CREATE POLICY "Public and Student Read Lessons" ON public.lessons
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Staff Manage Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Staff Insert Lessons" ON public.lessons;
CREATE POLICY "Staff Insert Lessons" ON public.lessons
    FOR INSERT
    WITH CHECK (public.has_subject_access(COALESCE(subject, subject_id)));

DROP POLICY IF EXISTS "Staff Update Lessons" ON public.lessons;
CREATE POLICY "Staff Update Lessons" ON public.lessons
    FOR UPDATE
    USING (public.has_subject_access(COALESCE(subject, subject_id)))
    WITH CHECK (public.has_subject_access(COALESCE(subject, subject_id)));

DROP POLICY IF EXISTS "Staff Delete Lessons" ON public.lessons;
CREATE POLICY "Staff Delete Lessons" ON public.lessons
    FOR DELETE
    USING (public.has_subject_access(COALESCE(subject, subject_id)));

-- ====================================================================
-- B. VIDEOS POLICIES: Public/Student Read, Staff-Only Write
-- ====================================================================
DROP POLICY IF EXISTS "Public and Student Read Videos" ON public.videos;
DROP POLICY IF EXISTS "Public Read Videos" ON public.videos;
CREATE POLICY "Public and Student Read Videos" ON public.videos
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Staff Manage Videos" ON public.videos;
DROP POLICY IF EXISTS "Staff Insert Videos" ON public.videos;
CREATE POLICY "Staff Insert Videos" ON public.videos
    FOR INSERT
    WITH CHECK (public.has_subject_access(public.get_lesson_subject(lesson_id)));

DROP POLICY IF EXISTS "Staff Update Videos" ON public.videos;
CREATE POLICY "Staff Update Videos" ON public.videos
    FOR UPDATE
    USING (public.has_subject_access(public.get_lesson_subject(lesson_id)))
    WITH CHECK (public.has_subject_access(public.get_lesson_subject(lesson_id)));

DROP POLICY IF EXISTS "Staff Delete Videos" ON public.videos;
CREATE POLICY "Staff Delete Videos" ON public.videos
    FOR DELETE
    USING (public.has_subject_access(public.get_lesson_subject(lesson_id)));

-- ====================================================================
-- C. VIDEO ATTACHMENTS POLICIES: Public/Student Read, Staff-Only Write
-- ====================================================================
DROP POLICY IF EXISTS "Public and Student Read Video Attachments" ON public.video_attachments;
DROP POLICY IF EXISTS "Public Read Video Attachments" ON public.video_attachments;
CREATE POLICY "Public and Student Read Video Attachments" ON public.video_attachments
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Staff Manage Video Attachments" ON public.video_attachments;
DROP POLICY IF EXISTS "Staff Insert Video Attachments" ON public.video_attachments;
CREATE POLICY "Staff Insert Video Attachments" ON public.video_attachments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.videos v
            WHERE v.id = video_id
              AND public.has_subject_access(public.get_lesson_subject(v.lesson_id))
        )
    );

DROP POLICY IF EXISTS "Staff Update Video Attachments" ON public.video_attachments;
CREATE POLICY "Staff Update Video Attachments" ON public.video_attachments
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.videos v
            WHERE v.id = video_id
              AND public.has_subject_access(public.get_lesson_subject(v.lesson_id))
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.videos v
            WHERE v.id = video_id
              AND public.has_subject_access(public.get_lesson_subject(v.lesson_id))
        )
    );

DROP POLICY IF EXISTS "Staff Delete Video Attachments" ON public.video_attachments;
CREATE POLICY "Staff Delete Video Attachments" ON public.video_attachments
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.videos v
            WHERE v.id = video_id
              AND public.has_subject_access(public.get_lesson_subject(v.lesson_id))
        )
    );

-- ====================================================================
-- D. MCQS POLICIES: Public/Student Read, Staff-Only Write
-- ====================================================================
DROP POLICY IF EXISTS "Public and Student Read MCQs" ON public.mcqs;
DROP POLICY IF EXISTS "Public Read MCQs" ON public.mcqs;
CREATE POLICY "Public and Student Read MCQs" ON public.mcqs
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Staff Manage MCQs" ON public.mcqs;
DROP POLICY IF EXISTS "Staff Insert MCQs" ON public.mcqs;
CREATE POLICY "Staff Insert MCQs" ON public.mcqs
    FOR INSERT
    WITH CHECK (
        public.has_subject_access(COALESCE(subject_id, public.get_lesson_subject(lesson_id)))
    );

DROP POLICY IF EXISTS "Staff Update MCQs" ON public.mcqs;
CREATE POLICY "Staff Update MCQs" ON public.mcqs
    FOR UPDATE
    USING (public.has_subject_access(COALESCE(subject_id, public.get_lesson_subject(lesson_id))))
    WITH CHECK (public.has_subject_access(COALESCE(subject_id, public.get_lesson_subject(lesson_id))));

DROP POLICY IF EXISTS "Staff Delete MCQs" ON public.mcqs;
CREATE POLICY "Staff Delete MCQs" ON public.mcqs
    FOR DELETE
    USING (public.has_subject_access(COALESCE(subject_id, public.get_lesson_subject(lesson_id))));

-- ====================================================================
-- E. CONFIRM CASCADE CONSTRAINTS
-- ====================================================
DO $$
BEGIN
    -- Ensure videos cascades when a lesson is deleted
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'videos_lesson_id_fkey' AND table_name = 'videos'
    ) THEN
        ALTER TABLE public.videos DROP CONSTRAINT videos_lesson_id_fkey;
    END IF;
    ALTER TABLE public.videos
        ADD CONSTRAINT videos_lesson_id_fkey
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

    -- Ensure video_attachments cascades when video is deleted
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'video_attachments_video_id_fkey' AND table_name = 'video_attachments'
    ) THEN
        ALTER TABLE public.video_attachments DROP CONSTRAINT video_attachments_video_id_fkey;
    END IF;
    ALTER TABLE public.video_attachments
        ADD CONSTRAINT video_attachments_video_id_fkey
        FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;

    -- Ensure mcqs cascades when lesson is deleted
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mcqs_lesson_id_fkey' AND table_name = 'mcqs'
    ) THEN
        ALTER TABLE public.mcqs DROP CONSTRAINT mcqs_lesson_id_fkey;
    END IF;
    ALTER TABLE public.mcqs
        ADD CONSTRAINT mcqs_lesson_id_fkey
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

    -- Ensure mcqs cascades when video is deleted
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mcqs_video_id_fkey' AND table_name = 'mcqs'
    ) THEN
        ALTER TABLE public.mcqs DROP CONSTRAINT mcqs_video_id_fkey;
    END IF;
    ALTER TABLE public.mcqs
        ADD CONSTRAINT mcqs_video_id_fkey
        FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;
END $$;
