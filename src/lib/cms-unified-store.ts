import { SubjectId, GradeLevel } from './curriculum-data';
import { INITIAL_VIDEO_RESOURCES } from './data-store';

// ============================================================================
// 1. DATABASE SCHEMA & TYPES (Relational Supabase Architecture)
// ============================================================================

export interface LessonRecord {
  id: string; // uuid or structured key 'math-g12-1'
  grade_level: number;
  subject_id: string;
  title_km: string;
  title_en: string;
  description_km?: string;
  description_en?: string;
  order_index?: number;
  created_at?: string;
}

export interface VideoRecord {
  id: string; // uuid
  lesson_id: string; // FK referencing lessons.id (on delete cascade)
  title_km: string;
  title_en: string;
  video_url: string;
  description?: string;
  order_index: number;
  created_at?: string;
}

export interface VideoAttachmentRecord {
  id: string; // uuid
  video_id: string; // FK referencing videos.id (on delete cascade)
  file_url: string;
  title: string;
  created_at?: string;
}

export interface UnifiedMcqRecord {
  id: string; // uuid
  grade_level: number;
  subject_id: string;
  lesson_id: string; // FK referencing lessons.id
  video_id?: string | null; // FK referencing videos.id (nullable: for video comprehension check)
  question_km: string;
  question_en: string;
  options: [string, string, string, string, string] | string[];
  correct_answer: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  explanation?: string;
  hint_km?: string;
  hint_en?: string;
  explanation_km?: string;
  explanation_en?: string;
  difficulty?: 'basic' | 'medium' | 'advanced';
  question_image_url?: string | null;
  created_at?: string;
}

// Local Storage Keys
export const STORAGE_KEY_CMS_VIDEOS = 'moeys_cms_videos_v1';
export const STORAGE_KEY_CMS_ATTACHMENTS = 'moeys_cms_video_attachments_v1';
export const STORAGE_KEY_CMS_MCQS = 'moeys_cms_unified_mcqs_v1';

// Global Event for Multi-Component Sync
export const CMS_SYNC_EVENT = 'moeys_cms_data_sync';

export function notifyCmsSync() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CMS_SYNC_EVENT));
    window.dispatchEvent(new Event('storage'));
  }
}

// Helper: Generate UUID v4
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// 2. VIDEOS MANAGEMENT (YouTube-Style Multi-Video Playlist)
// ============================================================================

// Seeding initial data from pre-configured rich educational resources
function seedInitialCmsDataIfEmpty(): void {
  if (typeof window === 'undefined') return;
  try {
    const rawVideos = localStorage.getItem(STORAGE_KEY_CMS_VIDEOS);
    if (rawVideos) return; // already initialized

    const seededVideos: VideoRecord[] = [];
    const seededAttachments: VideoAttachmentRecord[] = [];
    const seededMcqs: UnifiedMcqRecord[] = [];

    for (const item of INITIAL_VIDEO_RESOURCES) {
      seededVideos.push({
        id: item.id,
        lesson_id: item.lessonId,
        title_km: item.titleKm,
        title_en: item.titleEn,
        video_url: item.youtubeUrl,
        description: item.descriptionKm,
        order_index: item.orderIndex || 1,
        created_at: item.createdAt,
      });

      if (item.pdfUrl) {
        seededAttachments.push({
          id: `att-${item.id}`,
          video_id: item.id,
          file_url: item.pdfUrl,
          title: `${item.titleKm} (ឯកសារជំនួយជា PDF / Lecture Slides)`,
          created_at: item.createdAt,
        });
      }

      if (item.videoMcqs && item.videoMcqs.length > 0) {
        for (const vm of item.videoMcqs) {
          seededMcqs.push({
            id: vm.id,
            grade_level: item.grade,
            subject_id: item.subject,
            lesson_id: item.lessonId,
            video_id: item.id,
            question_km: vm.questionKm,
            question_en: vm.questionEn,
            options: vm.optionsKm,
            correct_answer: vm.correctAnswer,
            hint_km: vm.hintKm,
            hint_en: vm.hintEn,
            explanation_km: vm.explanationKm,
            explanation_en: vm.explanationEn,
            explanation: vm.explanationKm,
            difficulty: 'medium',
            question_image_url: vm.questionImageUrl || null,
            created_at: item.createdAt,
          });
        }
      }
    }

    localStorage.setItem(STORAGE_KEY_CMS_VIDEOS, JSON.stringify(seededVideos));
    localStorage.setItem(STORAGE_KEY_CMS_ATTACHMENTS, JSON.stringify(seededAttachments));
    localStorage.setItem(STORAGE_KEY_CMS_MCQS, JSON.stringify(seededMcqs));
  } catch (err) {
    console.error('Error seeding initial CMS data:', err);
  }
}

export function getStoredVideos(): VideoRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    seedInitialCmsDataIfEmpty();
    const raw = localStorage.getItem(STORAGE_KEY_CMS_VIDEOS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredVideos(videos: VideoRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CMS_VIDEOS, JSON.stringify(videos));
    notifyCmsSync();
  } catch (err) {
    console.error('Error saving videos to local storage:', err);
  }
}

export function getVideosByLesson(lessonId: string): VideoRecord[] {
  return getStoredVideos()
    .filter((v) => v.lesson_id === lessonId)
    .sort((a, b) => (a.order_index || 1) - (b.order_index || 1));
}

export async function addVideoRecord(
  data: Omit<VideoRecord, 'id' | 'created_at'>
): Promise<VideoRecord> {
  const current = getStoredVideos();
  const existingForLesson = current.filter((v) => v.lesson_id === data.lesson_id);
  const nextOrder = existingForLesson.length > 0 
    ? Math.max(...existingForLesson.map((v) => v.order_index || 1)) + 1 
    : 1;

  const newVideo: VideoRecord = {
    id: generateUUID(),
    lesson_id: data.lesson_id,
    title_km: data.title_km.trim(),
    title_en: data.title_en.trim(),
    video_url: data.video_url.trim(),
    description: data.description?.trim() || '',
    order_index: data.order_index || nextOrder,
    created_at: new Date().toISOString(),
  };

  const updated = [...current, newVideo];
  saveStoredVideos(updated);

  // Supabase Sync (Attempts 'videos', falls back safely)
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('videos').insert({
        id: newVideo.id,
        lesson_id: newVideo.lesson_id,
        title_km: newVideo.title_km,
        title_en: newVideo.title_en,
        video_url: newVideo.video_url,
        description: newVideo.description,
        order_index: newVideo.order_index,
        created_at: newVideo.created_at,
      });
    }
  } catch (err) {
    console.warn('Supabase videos table sync notice:', err);
  }

  return newVideo;
}

export async function updateVideoRecord(
  id: string,
  updates: Partial<VideoRecord>
): Promise<VideoRecord | null> {
  const current = getStoredVideos();
  const idx = current.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  const updated: VideoRecord = { ...current[idx], ...updates };
  current[idx] = updated;
  saveStoredVideos(current);

  // Supabase sync
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('videos').update(updates).eq('id', id);
    }
  } catch (err) {
    console.warn('Supabase video update notice:', err);
  }

  return updated;
}

export async function deleteVideoRecord(id: string): Promise<boolean> {
  const current = getStoredVideos();
  const filtered = current.filter((v) => v.id !== id);
  if (filtered.length !== current.length) {
    saveStoredVideos(filtered);

    // Cascade delete attachments and video-tied MCQs locally
    deleteAttachmentsByVideo(id);
    deleteMcqsByVideo(id);

    // Supabase Cascade Deletion
    try {
      const { isSupabaseConfigured, supabase } = await import('./supabase');
      if (isSupabaseConfigured && supabase) {
        await supabase.from('video_attachments').delete().eq('video_id', id);
        await supabase.from('mcqs').delete().eq('video_id', id);
        await supabase.from('videos').delete().eq('id', id);
      }
    } catch {
      // Local storage fallback
    }

    return true;
  }
  return false;
}

export async function reorderVideosList(
  lessonId: string,
  orderedIds: string[]
): Promise<VideoRecord[]> {
  const current = getStoredVideos();
  const updated = current.map((v) => {
    if (v.lesson_id === lessonId) {
      const pos = orderedIds.indexOf(v.id);
      if (pos !== -1) {
        return { ...v, order_index: pos + 1 };
      }
    }
    return v;
  });
  saveStoredVideos(updated);

  // Sync to Supabase
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      for (let i = 0; i < orderedIds.length; i++) {
        await supabase
          .from('videos')
          .update({ order_index: i + 1 })
          .eq('id', orderedIds[i]);
      }
    }
  } catch {
    // Local storage fallback
  }

  return updated
    .filter((v) => v.lesson_id === lessonId)
    .sort((a, b) => a.order_index - b.order_index);
}

// ============================================================================
// 3. VIDEO ATTACHMENTS (PDF Documents & Lecture Handouts)
// ============================================================================

export function getStoredAttachments(): VideoAttachmentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    seedInitialCmsDataIfEmpty();
    const raw = localStorage.getItem(STORAGE_KEY_CMS_ATTACHMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredAttachments(items: VideoAttachmentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CMS_ATTACHMENTS, JSON.stringify(items));
    notifyCmsSync();
  } catch (err) {
    console.error('Error saving attachments to local storage:', err);
  }
}

export function getAttachmentsByVideo(videoId: string): VideoAttachmentRecord[] {
  return getStoredAttachments().filter((a) => a.video_id === videoId);
}

export async function addVideoAttachmentRecord(
  data: Omit<VideoAttachmentRecord, 'id' | 'created_at'>
): Promise<VideoAttachmentRecord> {
  const current = getStoredAttachments();
  const newAttachment: VideoAttachmentRecord = {
    id: generateUUID(),
    video_id: data.video_id,
    file_url: data.file_url.trim(),
    title: data.title.trim(),
    created_at: new Date().toISOString(),
  };

  const updated = [...current, newAttachment];
  saveStoredAttachments(updated);

  // Supabase sync
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('video_attachments').insert({
        id: newAttachment.id,
        video_id: newAttachment.video_id,
        file_url: newAttachment.file_url,
        title: newAttachment.title,
        created_at: newAttachment.created_at,
      });
    }
  } catch (err) {
    console.warn('Supabase attachment sync notice:', err);
  }

  return newAttachment;
}

export async function deleteVideoAttachmentRecord(id: string): Promise<boolean> {
  const current = getStoredAttachments();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length !== current.length) {
    saveStoredAttachments(filtered);

    try {
      const { isSupabaseConfigured, supabase } = await import('./supabase');
      if (isSupabaseConfigured && supabase) {
        await supabase.from('video_attachments').delete().eq('id', id);
      }
    } catch {
      // Local storage fallback
    }

    return true;
  }
  return false;
}

function deleteAttachmentsByVideo(videoId: string): void {
  const current = getStoredAttachments();
  const filtered = current.filter((a) => a.video_id !== videoId);
  saveStoredAttachments(filtered);
}

// ============================================================================
// 4. CROSS-SECTION UNIFIED MCQ SYNCHRONIZATION
// ============================================================================

import { ALL_GRADE_7_MATH_MCQS } from './grade7-math-mcqs';
import { ALL_GRADE_8_MATH_MCQS } from './grade8-math-mcqs';
import { ALL_GRADE_9_MATH_MCQS } from './grade9-math-mcqs';
import { ALL_GRADE_10_MATH_MCQS } from './grade10-math-mcqs';
import { ALL_GRADE_11_MATH_MCQS } from './grade11-math-mcqs';
import { ALL_GRADE_12_MATH_MCQS } from './grade12-math-mcqs';

export function getStoredUnifiedMcqs(): UnifiedMcqRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    seedInitialCmsDataIfEmpty();
    const raw = localStorage.getItem(STORAGE_KEY_CMS_MCQS);
    const list: UnifiedMcqRecord[] = raw ? JSON.parse(raw) : [];

    // Ensure all 140 Grade 7 Math MCQs exist in unified relational store
    const existingIds = new Set(list.map((m) => m.id));
    let hasNew = false;
    for (const g7 of ALL_GRADE_7_MATH_MCQS) {
      if (!existingIds.has(g7.id)) {
        list.push({
          id: g7.id,
          grade_level: 7,
          subject_id: 'math',
          lesson_id: g7.lessonId,
          video_id: null,
          question_km: g7.questionKm,
          question_en: g7.questionEn,
          options: g7.optionsKm,
          correct_answer: g7.correctAnswer,
          hint_km: g7.hintKm,
          hint_en: g7.hintEn,
          explanation_km: g7.explanationKm,
          explanation_en: g7.explanationEn,
          explanation: g7.explanationKm,
          difficulty: g7.difficulty,
          question_image_url: g7.questionImageUrl || null,
          created_at: '2026-02-15T00:00:00Z',
        });
        existingIds.add(g7.id);
        hasNew = true;
      }
    }

    // Ensure all 150 Grade 8 Math MCQs exist in unified relational store
    for (const g8 of ALL_GRADE_8_MATH_MCQS) {
      if (!existingIds.has(g8.id)) {
        list.push({
          id: g8.id,
          grade_level: 8,
          subject_id: 'math',
          lesson_id: g8.lessonId,
          video_id: null,
          question_km: g8.questionKm,
          question_en: g8.questionEn,
          options: g8.optionsKm,
          correct_answer: g8.correctAnswer,
          hint_km: g8.hintKm,
          hint_en: g8.hintEn,
          explanation_km: g8.explanationKm,
          explanation_en: g8.explanationEn,
          explanation: g8.explanationKm,
          difficulty: g8.difficulty,
          question_image_url: g8.questionImageUrl || null,
          created_at: '2026-02-15T00:00:00Z',
        });
        existingIds.add(g8.id);
        hasNew = true;
      }
    }

    // Ensure all 180 Grade 9 Math MCQs exist in unified relational store
    for (const g9 of ALL_GRADE_9_MATH_MCQS) {
      if (!existingIds.has(g9.id)) {
        list.push({
          id: g9.id,
          grade_level: 9,
          subject_id: 'math',
          lesson_id: g9.lessonId,
          video_id: null,
          question_km: g9.questionKm,
          question_en: g9.questionEn,
          options: g9.optionsKm,
          correct_answer: g9.correctAnswer,
          hint_km: g9.hintKm,
          hint_en: g9.hintEn,
          explanation_km: g9.explanationKm,
          explanation_en: g9.explanationEn,
          explanation: g9.explanationKm,
          difficulty: g9.difficulty,
          question_image_url: g9.questionImageUrl || null,
          created_at: '2026-02-15T00:00:00Z',
        });
        existingIds.add(g9.id);
        hasNew = true;
      }
    }

    // Ensure all 260 Grade 10 Math MCQs exist in unified relational store
    for (const g10 of ALL_GRADE_10_MATH_MCQS) {
      if (!existingIds.has(g10.id)) {
        list.push({
          id: g10.id,
          grade_level: 10,
          subject_id: 'math',
          lesson_id: g10.lessonId,
          video_id: null,
          question_km: g10.questionKm,
          question_en: g10.questionEn,
          options: g10.optionsKm,
          correct_answer: g10.correctAnswer,
          hint_km: g10.hintKm,
          hint_en: g10.hintEn,
          explanation_km: g10.explanationKm,
          explanation_en: g10.explanationEn,
          explanation: g10.explanationKm,
          difficulty: g10.difficulty,
          question_image_url: g10.questionImageUrl || null,
          created_at: '2026-02-15T00:00:00Z',
        });
        existingIds.add(g10.id);
        hasNew = true;
      }
    }

    // Ensure all 280 Grade 11 Math MCQs exist in unified relational store
    for (const g11 of ALL_GRADE_11_MATH_MCQS) {
      if (!existingIds.has(g11.id)) {
        list.push({
          id: g11.id,
          grade_level: 11,
          subject_id: 'math',
          lesson_id: g11.lessonId,
          video_id: null,
          question_km: g11.questionKm,
          question_en: g11.questionEn,
          options: g11.optionsKm,
          correct_answer: g11.correctAnswer,
          hint_km: g11.hintKm,
          hint_en: g11.hintEn,
          explanation_km: g11.explanationKm,
          explanation_en: g11.explanationEn,
          explanation: g11.explanationKm,
          difficulty: g11.difficulty,
          question_image_url: g11.questionImageUrl || null,
          created_at: '2026-02-15T00:00:00Z',
        });
        existingIds.add(g11.id);
        hasNew = true;
      }
    }

    // Ensure all 270 Grade 12 Math MCQs exist in unified relational store
    for (const g12 of ALL_GRADE_12_MATH_MCQS) {
      if (!existingIds.has(g12.id)) {
        list.push({
          id: g12.id,
          grade_level: 12,
          subject_id: 'math',
          lesson_id: g12.lessonId,
          video_id: null,
          question_km: g12.questionKm,
          question_en: g12.questionEn,
          options: g12.optionsKm,
          correct_answer: g12.correctAnswer,
          hint_km: g12.hintKm,
          hint_en: g12.hintEn,
          explanation_km: g12.explanationKm,
          explanation_en: g12.explanationEn,
          explanation: g12.explanationKm,
          difficulty: g12.difficulty,
          question_image_url: g12.questionImageUrl || null,
          created_at: '2026-02-15T00:00:00Z',
        });
        existingIds.add(g12.id);
        hasNew = true;
      }
    }

    if (hasNew) {
      try {
        localStorage.setItem(STORAGE_KEY_CMS_MCQS, JSON.stringify(list));
      } catch (storageErr) {
        console.warn('LocalStorage save notice:', storageErr);
      }
    }

    return list;
  } catch {
    return [];
  }
}

export function saveStoredUnifiedMcqs(items: UnifiedMcqRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CMS_MCQS, JSON.stringify(items));
    notifyCmsSync();
  } catch (err) {
    console.error('Error saving unified MCQs to local storage:', err);
  }
}

/**
 * Returns all MCQs for a lesson.
 * Cross-Section Rule:
 * Any MCQ created under a specific video item automatically has that video's
 * lesson_id, subject_id, and grade_level, and thus automatically appears
 * here in the main lesson exercises section!
 */
export function getUnifiedMcqsByLesson(
  lessonId: string,
  filterVideoId?: string | 'all' | 'lesson_only'
): UnifiedMcqRecord[] {
  const all = getStoredUnifiedMcqs().filter((m) => m.lesson_id === lessonId);
  if (!filterVideoId || filterVideoId === 'all') {
    return all;
  }
  if (filterVideoId === 'lesson_only') {
    return all.filter((m) => !m.video_id);
  }
  return all.filter((m) => m.video_id === filterVideoId);
}

export function getUnifiedMcqsByVideo(videoId: string): UnifiedMcqRecord[] {
  return getStoredUnifiedMcqs().filter((m) => m.video_id === videoId);
}

export async function addUnifiedMcqRecord(
  data: Omit<UnifiedMcqRecord, 'id' | 'created_at'>
): Promise<UnifiedMcqRecord> {
  const current = getStoredUnifiedMcqs();
  const newMcq: UnifiedMcqRecord = {
    id: generateUUID(),
    grade_level: data.grade_level,
    subject_id: data.subject_id,
    lesson_id: data.lesson_id,
    video_id: data.video_id || null,
    question_km: data.question_km.trim(),
    question_en: data.question_en.trim(),
    options: data.options,
    correct_answer: data.correct_answer,
    explanation: data.explanation?.trim() || '',
    hint_km: data.hint_km?.trim() || '',
    hint_en: data.hint_en?.trim() || '',
    explanation_km: data.explanation_km?.trim() || '',
    explanation_en: data.explanation_en?.trim() || '',
    difficulty: data.difficulty || 'medium',
    question_image_url: data.question_image_url?.trim() || null,
    created_at: new Date().toISOString(),
  };

  const updated = [...current, newMcq];
  saveStoredUnifiedMcqs(updated);

  // Supabase sync to 'mcqs'
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('mcqs').insert({
        id: newMcq.id,
        grade_level: newMcq.grade_level,
        subject_id: newMcq.subject_id,
        lesson_id: newMcq.lesson_id,
        video_id: newMcq.video_id,
        question_km: newMcq.question_km,
        question_en: newMcq.question_en,
        options: newMcq.options,
        correct_answer: newMcq.correct_answer,
        explanation: newMcq.explanation,
        hint_km: newMcq.hint_km,
        hint_en: newMcq.hint_en,
        explanation_km: newMcq.explanation_km,
        explanation_en: newMcq.explanation_en,
        difficulty: newMcq.difficulty,
        question_image_url: newMcq.question_image_url,
        created_at: newMcq.created_at,
      });
    }
  } catch (err) {
    console.warn('Supabase mcqs sync notice:', err);
  }

  return newMcq;
}

export async function updateUnifiedMcqRecord(
  id: string,
  updates: Partial<UnifiedMcqRecord>
): Promise<UnifiedMcqRecord | null> {
  const current = getStoredUnifiedMcqs();
  const idx = current.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  const updated: UnifiedMcqRecord = { ...current[idx], ...updates };
  current[idx] = updated;
  saveStoredUnifiedMcqs(current);

  // Supabase sync
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('mcqs').update(updates).eq('id', id);
    }
  } catch (err) {
    console.warn('Supabase mcqs update notice:', err);
  }

  return updated;
}

export async function deleteUnifiedMcqRecord(id: string): Promise<boolean> {
  const current = getStoredUnifiedMcqs();
  const filtered = current.filter((m) => m.id !== id);
  if (filtered.length !== current.length) {
    saveStoredUnifiedMcqs(filtered);

    try {
      const { isSupabaseConfigured, supabase } = await import('./supabase');
      if (isSupabaseConfigured && supabase) {
        await supabase.from('mcqs').delete().eq('id', id);
      }
    } catch {
      // Local storage fallback
    }

    return true;
  }
  return false;
}

function deleteMcqsByVideo(videoId: string): void {
  const current = getStoredUnifiedMcqs();
  const filtered = current.filter((m) => m.video_id !== videoId);
  saveStoredUnifiedMcqs(filtered);
}

/**
 * Cascade deletes all videos, video attachments, and MCQs associated with a lesson from local store
 */
export function deleteLessonCascadeFromStore(lessonId: string): void {
  // 1. Identify videos for this lesson
  const allVideos = getStoredVideos();
  const videosToDelete = allVideos.filter((v) => v.lesson_id === lessonId);
  const videoIds = new Set(videosToDelete.map((v) => v.id));

  // 2. Remove videos
  const remainingVideos = allVideos.filter((v) => v.lesson_id !== lessonId);
  saveStoredVideos(remainingVideos);

  // 3. Remove attachments linked to deleted videos
  const allAttachments = getStoredAttachments();
  const remainingAttachments = allAttachments.filter((a) => !videoIds.has(a.video_id));
  saveStoredAttachments(remainingAttachments);

  // 4. Remove MCQs linked to this lesson or deleted videos
  const allMcqs = getStoredUnifiedMcqs();
  const remainingMcqs = allMcqs.filter(
    (m) => m.lesson_id !== lessonId && (!m.video_id || !videoIds.has(m.video_id))
  );
  saveStoredUnifiedMcqs(remainingMcqs);

  notifyCmsSync();
}
