'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  ArrowRight,
  X,
  Video,
  FileQuestion,
  MessageSquare,
  Edit3,
  Trash2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import {
  ActivityNotificationItem,
  getStoredActivities,
  subscribeToActivities,
} from '@/lib/notifications-store';

interface DashboardActivityBannerProps {
  onViewActivityLog?: () => void;
}

export const DashboardActivityBanner: React.FC<DashboardActivityBannerProps> = ({
  onViewActivityLog,
}) => {
  const { t, isKhmer } = useLanguage();
  const [latestActivity, setLatestActivity] = useState<ActivityNotificationItem | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatest = async () => {
      const all = await getStoredActivities();
      if (all.length > 0) {
        setLatestActivity(all[0]);
      }
    };
    fetchLatest();

    const unsubscribe = subscribeToActivities(() => {
      fetchLatest();
      setDismissed(false); // un-dismiss when new update arrives
    });

    return () => unsubscribe();
  }, []);

  if (!latestActivity || dismissed) return null;

  const isUpload = latestActivity.actionType === 'video_upload';
  const isMcq = latestActivity.actionType === 'mcq_edit';
  const isReply = latestActivity.actionType === 'comment_reply';
  const isDelete = latestActivity.actionType === 'video_delete';

  let actionIcon = Video;
  let accentColor = 'from-blue-600/10 via-indigo-600/10 to-transparent border-blue-500/30';
  let badgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

  if (isUpload) {
    actionIcon = Video;
    accentColor = 'from-emerald-600/10 via-teal-600/10 to-transparent border-emerald-500/30';
    badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  } else if (isMcq) {
    actionIcon = FileQuestion;
    accentColor = 'from-violet-600/10 via-purple-600/10 to-transparent border-violet-500/30';
    badgeColor = 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300';
  } else if (isReply) {
    actionIcon = MessageSquare;
    accentColor = 'from-teal-600/10 via-cyan-600/10 to-transparent border-teal-500/30';
    badgeColor = 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300';
  } else if (isDelete) {
    actionIcon = Trash2;
    accentColor = 'from-rose-600/10 via-pink-600/10 to-transparent border-rose-500/30';
    badgeColor = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
  } else {
    actionIcon = Edit3;
    accentColor = 'from-amber-600/10 via-orange-600/10 to-transparent border-amber-500/30';
    badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  }

  const ActionIcon = actionIcon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${accentColor} bg-white dark:bg-slate-900 border p-3.5 sm:p-4 shadow-sm transition-all`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Ping badge + Dynamic Dual-Language Message */}
          <div className="flex items-start sm:items-center gap-3">
            {/* Live pulsing dot */}
            <div className="relative flex-shrink-0 mt-0.5 sm:mt-0">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                  <ActionIcon className="w-3 h-3" />
                  <span>{isKhmer ? latestActivity.titleKm : latestActivity.titleEn}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {latestActivity.actorRole === 'super_admin' ? (
                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                  ) : (
                    <UserCheck className="w-3 h-3 text-blue-500" />
                  )}
                  <span>{latestActivity.actorName}</span>
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium truncate">
                {isKhmer ? latestActivity.messageKm : latestActivity.messageEn}
                <span className="text-slate-400 dark:text-slate-500 font-normal ml-2 italic text-[11px]">
                  ({isKhmer ? latestActivity.titleEn : latestActivity.titleKm})
                </span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            {onViewActivityLog && (
              <button
                onClick={onViewActivityLog}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
              >
                <span>{isKhmer ? 'មើលកំណត់ត្រា' : 'View History'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
