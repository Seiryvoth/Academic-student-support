'use client';

import { isSupabaseConfigured, supabase } from './supabase';

export interface CommentItem {
  id: string;
  lessonId: string;
  authorName: string;
  content: string;
  parentId: string | null;
  isTeacher: boolean;
  createdAt: string;
}

const STORAGE_KEY_COMMENTS = 'moeys_public_comments_v2';
export const STORAGE_KEY_GUEST_NAME = 'moeys_guest_username';

// Initial pre-seeded realistic comments so students & teachers immediately see Q&A engagement
const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'comm-seed-1',
    lessonId: 'math-g12-1',
    authorName: 'ចាន់ វណ្ណា (Chan Vanna)',
    content: 'លោកគ្រូ តើក្នុងការដោះស្រាយសមីការដឺក្រេទី ២ យើងអាចប្រើវិធីបំបែកតួ ឬប្រើឌីសគ្រីមីណង់ Δ (Delta) មួយណាលឿន និងងាយស្រួលជាង?',
    parentId: null,
    isTeacher: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
  },
  {
    id: 'comm-seed-2',
    lessonId: 'math-g12-1',
    authorName: 'សាស្ត្រាចារ្យ ឡុង សុខា (Math Lead)',
    content: 'សួស្តីប្អូនវណ្ណា! ប្រសិនបើមេគុណងាយស្រួល ការបំបែកតួអាចលឿនជាង។ ប៉ុន្តែរូបមន្តឌីសគ្រីមីណង់ Δ = b² - 4ac ធានាបាននូវភាពច្បាស់លាស់ និងរកឃើញឫសគ្រប់ករណី ជាពិសេសក្នុងវិញ្ញាសាប្រឡងបាក់ឌុប!',
    parentId: 'comm-seed-1',
    isTeacher: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'comm-seed-3',
    lessonId: 'math-g12-1',
    authorName: 'រ័ត្ន ធីតា (Rath Thida)',
    content: 'សូមលោកគ្រូជួយពន្យល់ចំណុចលំហាត់ស្ទង់ការយល់ដឹងទី ២ ផង ខ្ញុំនៅមិនទាន់យល់ច្បាស់ពីរបៀបជ្រើសរើសចម្លើយត្រឹមត្រូវ។',
    parentId: null,
    isTeacher: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: 'comm-seed-4',
    lessonId: 'math-g12-1',
    authorName: 'សាស្ត្រាចារ្យ ឡុង សុខា (Math Lead)',
    content: 'ប្អូនធីតា សូមពិនិត្យមើលការពន្យល់លម្អិត (Step-by-Step Solution) ក្រោមសំណួរទី ២ ដោយចុចប៊ូតុង «💡 ជំនួយស្មារតី» ឬ «📖 ការពន្យល់សង្ខេប»។ ប្រសិនបើនៅមានចម្ងល់ អាចសួរលោកគ្រូបន្ថែមបាន!',
    parentId: 'comm-seed-3',
    isTeacher: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
  },
  {
    id: 'comm-seed-5',
    lessonId: 'physics-g12-1',
    authorName: 'គង់ សម្បត្តិ (Kong Sambath)',
    content: 'អ្នកគ្រូ ត្រង់ច្បាប់ទី ២ ញូតុន F = ma តើយើងត្រូវគិតទិសដៅនៃកម្លាំងកកិតជានិច្ចមែនទេ?',
    parentId: null,
    isTeacher: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  },
  {
    id: 'comm-seed-6',
    lessonId: 'physics-g12-1',
    authorName: 'លោកស្រី គឹម សុផល (Physics Lead)',
    content: 'ពិតណាស់ប្អូន! កម្លាំងកកិតតែងតែមានទិសដៅផ្ទុយពីទិសដៅចលនារបស់អង្គធាតុ ដូច្នេះនៅពេលទម្លាក់សមីការវ៉ិចទ័រលើអ័ក្សចលនា យើងត្រូវដាក់សញ្ញាដក (-) មុខកម្លាំងកកិតជានិច្ច។',
    parentId: 'comm-seed-5',
    isTeacher: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 16).toISOString(),
  },
  {
    id: 'comm-seed-7',
    lessonId: 'chemistry-g12-1',
    authorName: 'លី មុនីរ័ត្ន (Ly Munyroth)',
    content: 'តើប្រតិកម្មគីមីក្នុងមេរៀននេះជាប្រតិកម្មរេដុក ឬប្រតិកម្មអាស៊ីត-បាស?',
    parentId: null,
    isTeacher: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
  },
  {
    id: 'comm-seed-8',
    lessonId: 'chemistry-g12-1',
    authorName: 'លោក វ៉ាន់ រតនា (Chemistry Lead)',
    content: 'សួស្តីមុនីរ័ត្ន! នេះជាប្រតិកម្មរេដុក ពីព្រោះមានការផ្លាស់ប្តូរចំនួនអុកស៊ីតកម្មនៃធាតុគីមីដែលចូលរួមប្រតិកម្ម។',
    parentId: 'comm-seed-7',
    isTeacher: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
];

export function getLocalComments(): CommentItem[] {
  if (typeof window === 'undefined') return INITIAL_COMMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(INITIAL_COMMENTS));
      return INITIAL_COMMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMMENTS;
  } catch {
    return INITIAL_COMMENTS;
  }
}

export function saveLocalComments(comments: CommentItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    window.dispatchEvent(new CustomEvent('moeys_comment_updated'));
  } catch (err) {
    console.error('Error saving comments to localStorage:', err);
  }
}

// Fetch comments for a specific lesson or all lessons (hybrid: Supabase with local fallback)
export async function getCommentsForLesson(lessonId?: string): Promise<CommentItem[]> {
  const localList = getLocalComments();

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mappedFromDb: CommentItem[] = data.map((row: any) => ({
          id: String(row.id),
          lessonId: String(row.lesson_id),
          authorName: String(row.author_name),
          content: String(row.content),
          parentId: row.parent_id ? String(row.parent_id) : null,
          isTeacher: Boolean(row.is_teacher),
          createdAt: String(row.created_at),
        }));

        // Merge DB rows with any local rows that might not yet be in remote DB
        const dbIds = new Set(mappedFromDb.map((c) => c.id));
        const merged = [
          ...mappedFromDb,
          ...localList.filter((loc) => !dbIds.has(loc.id) && (!lessonId || loc.lessonId === lessonId)),
        ];

        saveLocalComments(merged);
        return lessonId ? merged.filter((c) => c.lessonId === lessonId) : merged;
      }
    } catch {
      // Graceful fallback to local cache
    }
  }

  return lessonId ? localList.filter((c) => c.lessonId === lessonId) : localList;
}

// Add a new comment (guest-friendly or teacher reply)
export async function addComment(params: {
  lessonId: string;
  authorName: string;
  content: string;
  parentId?: string | null;
  isTeacher?: boolean;
}): Promise<CommentItem> {
  // Generate valid UUIDv4 or fallback UUID string
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `comm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const newComment: CommentItem = {
    id: newId,
    lessonId: params.lessonId,
    authorName: params.authorName.trim(),
    content: params.content.trim(),
    parentId: params.parentId || null,
    isTeacher: Boolean(params.isTeacher),
    createdAt: new Date().toISOString(),
  };

  // 1. Update local state
  const current = getLocalComments();
  const updated = [...current, newComment];
  saveLocalComments(updated);

  // 2. Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('comments').insert({
        id: newComment.id,
        lesson_id: newComment.lessonId,
        author_name: newComment.authorName,
        content: newComment.content,
        parent_id: newComment.parentId,
        is_teacher: newComment.isTeacher,
        created_at: newComment.createdAt,
      });
    } catch (err) {
      console.warn('Supabase comment insert failed, saved to local cache:', err);
    }
  }

  // 3. Dispatch event for live UI reactivity across tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('moeys_comment_added', { detail: newComment }));
  }

  return newComment;
}

// Delete a comment (for staff moderation)
export async function deleteComment(id: string): Promise<boolean> {
  const current = getLocalComments();
  // Also delete child replies if parent is deleted
  const filtered = current.filter((c) => c.id !== id && c.parentId !== id);
  saveLocalComments(filtered);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('comments').delete().eq('id', id);
    } catch {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('moeys_comment_updated'));
  }

  return true;
}

// Helper to subscribe to comment changes in components
export function subscribeToComments(onUpdate: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => onUpdate();
  window.addEventListener('moeys_comment_updated', handleUpdate);
  window.addEventListener('moeys_comment_added', handleUpdate);

  // Supabase Realtime channel subscription
  let realtimeChannel: any = null;
  if (isSupabaseConfigured && supabase) {
    try {
      realtimeChannel = supabase
        .channel('public:comments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'comments' },
          () => {
            onUpdate();
          }
        )
        .subscribe();
    } catch {
      // ignore
    }
  }

  return () => {
    window.removeEventListener('moeys_comment_updated', handleUpdate);
    window.removeEventListener('moeys_comment_added', handleUpdate);
    if (realtimeChannel && supabase) {
      try {
        supabase.removeChannel(realtimeChannel);
      } catch {
        // ignore
      }
    }
  };
}
