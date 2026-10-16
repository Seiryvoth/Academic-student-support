-- ====================================================================
-- CAMBODIAN MoEYS SCHOOL ACADEMIC & STUDENT SUPPORT APPLICATION
-- EXPLICIT ON DELETE CASCADE CONSTRAINTS FOR LESSONS CASCADE DELETION
-- ====================================================================

-- 1. Ensure videos table cascades when a lesson is deleted
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'videos'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'videos_lesson_id_fkey' 
              AND table_name = 'videos'
        ) THEN
            ALTER TABLE public.videos DROP CONSTRAINT videos_lesson_id_fkey;
        END IF;
        
        ALTER TABLE public.videos
            ADD CONSTRAINT videos_lesson_id_fkey
            FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Ensure video_attachments table cascades when a video is deleted
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'video_attachments'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'video_attachments_video_id_fkey' 
              AND table_name = 'video_attachments'
        ) THEN
            ALTER TABLE public.video_attachments DROP CONSTRAINT video_attachments_video_id_fkey;
        END IF;
        
        ALTER TABLE public.video_attachments
            ADD CONSTRAINT video_attachments_video_id_fkey
            FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Ensure mcqs table cascades when a lesson or video is deleted
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'mcqs'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'mcqs_lesson_id_fkey' 
              AND table_name = 'mcqs'
        ) THEN
            ALTER TABLE public.mcqs DROP CONSTRAINT mcqs_lesson_id_fkey;
        END IF;
        
        ALTER TABLE public.mcqs
            ADD CONSTRAINT mcqs_lesson_id_fkey
            FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'mcqs_video_id_fkey' 
              AND table_name = 'mcqs'
        ) THEN
            ALTER TABLE public.mcqs DROP CONSTRAINT mcqs_video_id_fkey;
        END IF;

        ALTER TABLE public.mcqs
            ADD CONSTRAINT mcqs_video_id_fkey
            FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Guarantee cascade on curriculum_mcqs and video_resources if present
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'curriculum_mcqs'
    ) THEN
        ALTER TABLE public.curriculum_mcqs DROP CONSTRAINT IF EXISTS curriculum_mcqs_lesson_id_fkey;
        ALTER TABLE public.curriculum_mcqs
            ADD CONSTRAINT curriculum_mcqs_lesson_id_fkey
            FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'video_resources'
    ) THEN
        ALTER TABLE public.video_resources DROP CONSTRAINT IF EXISTS video_resources_lesson_id_fkey;
        ALTER TABLE public.video_resources
            ADD CONSTRAINT video_resources_lesson_id_fkey
            FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'video_mcqs'
    ) THEN
        ALTER TABLE public.video_mcqs DROP CONSTRAINT IF EXISTS video_mcqs_video_id_fkey;
        ALTER TABLE public.video_mcqs
            ADD CONSTRAINT video_mcqs_video_id_fkey
            FOREIGN KEY (video_id) REFERENCES public.video_resources(id) ON DELETE CASCADE;
    END IF;
END $$;
