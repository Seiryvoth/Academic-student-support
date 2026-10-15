'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  Video,
  FileQuestion,
  Edit3,
  Trash2,
  MessageSquare,
  X,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { ActivityNotificationItem } from '@/lib/notifications-store';

export const NotificationToast: React.FC = () => {
  const { isKhmer } = useLanguage();
  const [toasts, setToasts] = useState<ActivityNotificationItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ActivityNotificationItem>;
      if (customEvent.detail) {
        const item = customEvent.detail;
        setToasts((prev) => [item, ...prev.slice(0, 3)]); // Keep max 4 active toasts

        // Auto remove after 6 seconds
        setTimeout(() => {
          removeToast(item.id);
        }, 6500);
      }
    };

    window.addEventListener('moeys_toast_event', handleToastEvent);
    return () => window.removeEventListener('moeys_toast_event', handleToastEvent);
  }, [removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full sm:w-[420px] pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isUpload = toast.actionType === 'video_upload';
        const isDelete = toast.actionType === 'video_delete';
        const isMcq = toast.actionType === 'mcq_edit';
        const isReply = toast.actionType === 'comment_reply';

        let iconBg = 'bg-blue-600 text-white';
        let IconComponent = Video;
        let borderAccent = 'border-blue-500/30';

        if (isUpload) {
          iconBg = 'bg-emerald-600 text-white';
          IconComponent = Video;
          borderAccent = 'border-emerald-500/40 shadow-emerald-500/10';
        } else if (isDelete) {
          iconBg = 'bg-rose-600 text-white';
          IconComponent = Trash2;
          borderAccent = 'border-rose-500/40 shadow-rose-500/10';
        } else if (isMcq) {
          iconBg = 'bg-violet-600 text-white';
          IconComponent = FileQuestion;
          borderAccent = 'border-violet-500/40 shadow-violet-500/10';
        } else if (isReply) {
          iconBg = 'bg-teal-600 text-white';
          IconComponent = MessageSquare;
          borderAccent = 'border-teal-500/40 shadow-teal-500/10';
        } else {
          iconBg = 'bg-amber-600 text-white';
          IconComponent = Edit3;
          borderAccent = 'border-amber-500/40 shadow-amber-500/10';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border ${borderAccent} rounded-2xl p-4 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in relative overflow-hidden`}
          >
            {/* Top Glowing Indicator Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 animate-pulse" />

            <div className="flex items-start gap-3.5 mt-1">
              {/* Action Icon */}
              <div
                className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-md`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Toast Content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {toast.actorRole === 'super_admin' ? (
                      <ShieldCheck className="w-3 h-3 text-amber-500" />
                    ) : (
                      <UserCheck className="w-3 h-3 text-blue-500" />
                    )}
                    <span>{toast.actorName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isKhmer ? 'អម្បាញ់មិញ' : 'Just now'}
                  </span>
                </div>

                {/* Dual-Language Title & Message dynamically adapting to language */}
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">
                  {isKhmer ? toast.titleKm : toast.titleEn}
                </h4>

                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {isKhmer ? toast.messageKm : toast.messageEn}
                </p>

                {/* Sub-label showing the alternative language for clarity */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="italic truncate">
                    {isKhmer ? toast.titleEn : toast.titleKm}
                  </span>
                  {toast.subject && (
                    <span className="uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400 ml-2">
                      {toast.subject}
                    </span>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
