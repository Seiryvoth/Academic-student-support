'use client';

import { SubjectId, GradeLevel } from './curriculum-data';
import { isSupabaseConfigured, supabase } from './supabase';

export interface ActivityNotificationItem {
  id: string;
  actionType: 'video_upload' | 'video_edit' | 'video_delete' | 'mcq_edit' | 'comment_reply' | 'comment_post';
  subject?: SubjectId;
  grade?: GradeLevel;
  lessonId?: string;
  actorName: string;
  actorRole: 'super_admin' | 'subject_lead' | 'student';
  titleKm: string;
  titleEn: string;
  messageKm: string;
  messageEn: string;
  createdAt: string;
}

const STORAGE_KEY_ACTIVITIES = 'moeys_activity_notifications_v2';

// Seed initial realistic activity entries so staff immediately have rich context
const INITIAL_ACTIVITIES: ActivityNotificationItem[] = [
  {
    id: 'act-seed-1',
    actionType: 'video_upload',
    subject: 'math',
    grade: 12,
    lessonId: 'math-g12-1',
    actorName: 'សាស្ត្រាចារ្យ ឡុង សុខា (Math Lead)',
    actorRole: 'subject_lead',
    titleKm: 'បានអាប់ឡូតវីដេអូមុខវិជ្ជាគណិតវិទ្យាថ្មី (ថ្នាក់ទី ១២)',
    titleEn: 'New Mathematics Video uploaded (Grade 12)',
    messageKm: 'បានផ្សាយវីដេអូបង្រៀនគំរូ និងឯកសារជំនួយស្មារតី PDF លើមេរៀន «សមីការ និងវិសមីការដឺក្រេទី ២»',
    messageEn: 'Published demonstration lecture and Google Drive PDF handout for lesson "Quadratic Equations and Inequalities"',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'act-seed-2',
    actionType: 'mcq_edit',
    subject: 'physics',
    grade: 12,
    lessonId: 'physics-g12-1',
    actorName: 'លោកស្រី គឹម សុផល (Physics Lead)',
    actorRole: 'subject_lead',
    titleKm: 'បានកែសម្រួលលំហាត់ MCQ កម្មវិធីសិក្សា (ថ្នាក់ទី ១២)',
    titleEn: 'Updated Standard Curriculum MCQ (Grade 12)',
    messageKm: 'បានកែសម្រួលទិន្នន័យរូបមន្ត LaTeX និងជម្រើសចម្លើយក្នុងសំណួរទី ៣ នៃមេរៀន «ច្បាប់ញូតុន»',
    messageEn: 'Calibrated LaTeX formula rendering and option choices for Question #3 in "Newton\'s Laws"',
    createdAt: new Date(Date.now() - 3600 * 1000 * 7).toISOString(),
  },
  {
    id: 'act-seed-3',
    actionType: 'comment_reply',
    subject: 'math',
    grade: 12,
    lessonId: 'math-g12-1',
    actorName: 'សាស្ត្រាចារ្យ ឡុង សុខា (Math Lead)',
    actorRole: 'subject_lead',
    titleKm: 'បានឆ្លើយតបសំណួរសិស្សក្នុងមេរៀនគណិតវិទ្យា',
    titleEn: 'Teacher Replied to Student Question in Mathematics',
    messageKm: 'បានពន្យល់ប្អូន ចាន់ វណ្ណា អំពីរបៀបប្រើរូបមន្តឌីសគ្រីមីណង់ Δ ក្នុងការប្រឡងបាក់ឌុប',
    messageEn: 'Explained to student Chan Vanna how to apply discriminant formula Δ effectively in exams',
    createdAt: new Date(Date.now() - 3600 * 1000 * 11).toISOString(),
  },
  {
    id: 'act-seed-4',
    actionType: 'video_upload',
    subject: 'chemistry',
    grade: 12,
    lessonId: 'chemistry-g12-1',
    actorName: 'លោក វ៉ាន់ រតនា (Chemistry Lead)',
    actorRole: 'subject_lead',
    titleKm: 'បានអាប់ឡូតវីដេអូមុខវិជ្ជាគីមីវិទ្យាថ្មី (ថ្នាក់ទី ១២)',
    titleEn: 'New Chemistry Video uploaded (Grade 12)',
    messageKm: 'បានផ្សាយវីដេអូមន្ទីរពិសោធន៍ និងសំណួរស្ទង់ការយល់ដឹងលើមេរៀន «ល្បឿននៃប្រតិកម្មគីមី»',
    messageEn: 'Uploaded laboratory experiment video and comprehension quiz for "Rate of Chemical Reactions"',
    createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
  },
  {
    id: 'act-seed-5',
    actionType: 'video_edit',
    subject: 'biology',
    grade: 12,
    lessonId: 'biology-g12-1',
    actorName: 'លោកបណ្ឌិត ជា សុវណ្ណ (Super Admin)',
    actorRole: 'super_admin',
    titleKm: 'បានត្រួតពិនិត្យ និងកែសម្រួលមាតិកាជីវវិទ្យា (ថ្នាក់ទី ១២)',
    titleEn: 'Reviewed & Updated Biology Content (Grade 12)',
    messageKm: 'បានធ្វើបច្ចុប្បន្នភាពតំណភ្ជាប់ឯកសារ PDF សៀវភៅពុម្ពផ្លូវការក្រសួង MoEYS',
    messageEn: 'Updated official MoEYS textbook handout link and lesson descriptors',
    createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
  },
];

export function getLocalActivities(): ActivityNotificationItem[] {
  if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function saveLocalActivities(activities: ActivityNotificationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    window.dispatchEvent(new CustomEvent('moeys_activity_updated'));
  } catch (err) {
    console.error('Error saving activities to localStorage:', err);
  }
}

// Fetch activities (hybrid: Supabase with local fallback)
export async function getStoredActivities(): Promise<ActivityNotificationItem[]> {
  const localList = getLocalActivities();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('activity_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const mappedFromDb: ActivityNotificationItem[] = data.map((row: any) => ({
          id: String(row.id),
          actionType: row.action_type,
          subject: row.subject || undefined,
          grade: row.grade ? Number(row.grade) as GradeLevel : undefined,
          lessonId: row.lesson_id || undefined,
          actorName: String(row.actor_name),
          actorRole: row.actor_role === 'super_admin' ? 'super_admin' : row.actor_role === 'student' ? 'student' : 'subject_lead',
          titleKm: String(row.title_km),
          titleEn: String(row.title_en),
          messageKm: String(row.message_km),
          messageEn: String(row.message_en),
          createdAt: String(row.created_at),
        }));

        const dbIds = new Set(mappedFromDb.map((a) => a.id));
        const merged = [
          ...mappedFromDb,
          ...localList.filter((loc) => !dbIds.has(loc.id)),
        ];

        saveLocalActivities(merged);
        return merged;
      }
    } catch {
      // Graceful fallback to local cache
    }
  }

  return localList;
}

// Record an activity notification and trigger dual-language toast banner
export async function recordActivityNotification(params: {
  actionType: ActivityNotificationItem['actionType'];
  subject?: SubjectId;
  grade?: GradeLevel;
  lessonId?: string;
  actorName: string;
  actorRole: 'super_admin' | 'subject_lead' | 'student';
  titleKm: string;
  titleEn: string;
  messageKm: string;
  messageEn: string;
}): Promise<ActivityNotificationItem> {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const newActivity: ActivityNotificationItem = {
    id: newId,
    ...params,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to local storage
  const current = getLocalActivities();
  const updated = [newActivity, ...current];
  saveLocalActivities(updated);

  // 2. Sync to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('activity_notifications').insert({
        id: newActivity.id,
        action_type: newActivity.actionType,
        subject: newActivity.subject || null,
        grade: newActivity.grade || null,
        lesson_id: newActivity.lessonId || null,
        actor_name: newActivity.actorName,
        actor_role: newActivity.actorRole,
        title_km: newActivity.titleKm,
        title_en: newActivity.titleEn,
        message_km: newActivity.messageKm,
        message_en: newActivity.messageEn,
        created_at: newActivity.createdAt,
      });
    } catch (err) {
      console.warn('Supabase activity notification insert failed, cached locally:', err);
    }
  }

  // 3. Dispatch dual-language toast banner event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('moeys_toast_event', { detail: newActivity }));
    window.dispatchEvent(new CustomEvent('moeys_activity_updated', { detail: newActivity }));
  }

  return newActivity;
}

// Helper to subscribe to activity changes in staff dashboard
export function subscribeToActivities(onUpdate: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => onUpdate();
  window.addEventListener('moeys_activity_updated', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  let realtimeChannel: any = null;
  if (isSupabaseConfigured && supabase) {
    try {
      realtimeChannel = supabase
        .channel('public:activity_notifications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'activity_notifications' },
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
    window.removeEventListener('moeys_activity_updated', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
    if (realtimeChannel && supabase) {
      try {
        supabase.removeChannel(realtimeChannel);
      } catch {
        // ignore
      }
    }
  };
}
