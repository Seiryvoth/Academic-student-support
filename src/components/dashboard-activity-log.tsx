'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Clock,
  Video,
  FileQuestion,
  Edit3,
  Trash2,
  MessageSquare,
  Filter,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import {
  ActivityNotificationItem,
  getStoredActivities,
  subscribeToActivities,
} from '@/lib/notifications-store';
import { SUBJECTS, SubjectId } from '@/lib/curriculum-data';

export const DashboardActivityLog: React.FC = () => {
  const { t, isKhmer } = useLanguage();

  const [activities, setActivities] = useState<ActivityNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const loadActivities = async () => {
    try {
      const list = await getStoredActivities();
      setActivities(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    const unsub = subscribeToActivities(() => {
      loadActivities();
    });
    return () => unsub();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      if (actionFilter !== 'all' && item.actionType !== actionFilter) return false;
      if (subjectFilter !== 'all' && item.subject !== subjectFilter) return false;
      return true;
    });
  }, [activities, actionFilter, subjectFilter]);

  const formatTimeAgo = (isoString: string): string => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return t('justNow');
      if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
      if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
      return `${diffDays} ${t('daysAgo')}`;
    } catch {
      return '';
    }
  };

  const getActionBadge = (actionType: ActivityNotificationItem['actionType']) => {
    switch (actionType) {
      case 'video_upload':
        return {
          label: t('actionUploadVideo'),
          icon: Video,
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
      case 'video_edit':
        return {
          label: t('actionEditVideo'),
          icon: Edit3,
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'video_delete':
        return {
          label: t('actionDeleteVideo'),
          icon: Trash2,
          bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        };
      case 'mcq_edit':
        return {
          label: t('actionEditMcq'),
          icon: FileQuestion,
          bg: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-violet-300 dark:border-violet-800',
        };
      case 'comment_reply':
        return {
          label: t('actionCommentReply'),
          icon: MessageSquare,
          bg: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800',
        };
      default:
        return {
          label: t('actionCommentPost'),
          icon: Bell,
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('activityLog')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('activityLogSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {filteredActivities.length} {isKhmer ? 'កំណត់ត្រា' : 'records'}
            </span>
          </div>
        </div>

        {/* Filter Controls (Action Type & Subject) */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 mr-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 inline mr-1" />
              {t('allActions')}:
            </span>

            {[
              { id: 'all', label: t('allActions') },
              { id: 'video_upload', label: t('actionUploadVideo') },
              { id: 'video_edit', label: t('actionEditVideo') },
              { id: 'mcq_edit', label: t('actionEditMcq') },
              { id: 'comment_reply', label: t('actionCommentReply') },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setActionFilter(act.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  actionFilter === act.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                subjectFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('allSubjects')}
            </button>
            {(Object.keys(SUBJECTS) as SubjectId[]).map((subjKey) => (
              <button
                key={subjKey}
                onClick={() => setSubjectFilter(subjKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  subjectFilter === subjKey
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isKhmer ? SUBJECTS[subjKey].nameKm : SUBJECTS[subjKey].nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">{isKhmer ? 'កំពុងទាញយកកំណត់ត្រា...' : 'Loading activity log...'}</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              {isKhmer ? 'មិនមានសកម្មភាពត្រូវបង្ហាញទេ' : 'No activity records match this filter'}
            </h3>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const badgeMeta = getActionBadge(act.actionType);
            const BadgeIcon = badgeMeta.icon;

            return (
              <div
                key={act.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Action Icon Box */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BadgeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top Badges: Action Type + Subject + Actor */}
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeMeta.bg}`}>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badgeMeta.label}</span>
                        </span>

                        {act.subject && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {isKhmer ? SUBJECTS[act.subject]?.nameKm : SUBJECTS[act.subject]?.nameEn}
                            {act.grade ? ` (G${act.grade})` : ''}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {act.actorRole === 'super_admin' ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span>{act.actorName}</span>
                        </span>
                      </div>

                      {/* Dual-Language Title dynamically adapting to active language preference */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {isKhmer ? act.titleKm : act.titleEn}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {isKhmer ? act.messageKm : act.messageEn}
                      </p>

                      {/* Secondary alternative language label */}
                      <p className="text-[11px] text-slate-400 italic mt-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-1.5">
                        {isKhmer ? act.titleEn : act.titleKm} • {isKhmer ? act.messageEn : act.messageKm}
                      </p>
                    </div>
                  </div>

                  {/* Relative Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 self-end sm:self-start flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeAgo(act.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
