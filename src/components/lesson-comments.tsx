'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Reply,
  Trash2,
  User,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CornerDownRight,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import {
  CommentItem,
  getCommentsForLesson,
  addComment,
  deleteComment,
  subscribeToComments,
  STORAGE_KEY_GUEST_NAME,
} from '@/lib/comments-store';
import { getCurrentStaffSession } from '@/lib/data-store';
import { recordActivityNotification } from '@/lib/notifications-store';
import { LatexRenderer } from '@/components/latex-renderer';

interface LessonCommentsProps {
  lessonId: string;
  lessonTitleKm?: string;
  lessonTitleEn?: string;
}

export const LessonComments: React.FC<LessonCommentsProps> = ({
  lessonId,
  lessonTitleKm = '',
  lessonTitleEn = '',
}) => {
  const { t, isKhmer } = useLanguage();

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form input state
  const [guestName, setGuestName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [replySubmitting, setReplySubmitting] = useState<boolean>(false);

  // Error/validation messages
  const [formError, setFormError] = useState<string | null>(null);

  // Staff session detection
  const staffSession = useMemo(() => {
    return getCurrentStaffSession();
  }, []);

  // Load comments
  const loadComments = async () => {
    try {
      const data = await getCommentsForLesson(lessonId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();

    // Load saved guest name from localStorage
    try {
      const savedName = localStorage.getItem(STORAGE_KEY_GUEST_NAME);
      if (savedName && !staffSession) {
        setGuestName(savedName);
      }
    } catch {
      // ignore
    }

    // Subscribe to realtime updates
    const unsubscribe = subscribeToComments(() => {
      loadComments();
    });

    return () => unsubscribe();
  }, [lessonId]);

  // If staff is logged in, use their official name
  const effectiveAuthorName = staffSession
    ? (isKhmer ? staffSession.fullNameKm : staffSession.fullNameEn)
    : guestName;

  const isCurrentAuthorTeacher = Boolean(staffSession);

  // Separate top-level comments and replies
  const { topLevelComments, repliesByParent } = useMemo(() => {
    const topLevel: CommentItem[] = [];
    const replies: Record<string, CommentItem[]> = {};

    comments.forEach((c) => {
      if (!c.parentId) {
        topLevel.push(c);
      } else {
        if (!replies[c.parentId]) {
          replies[c.parentId] = [];
        }
        replies[c.parentId].push(c);
      }
    });

    // Sort newest first
    topLevel.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Sort replies chronologically
    Object.keys(replies).forEach((pId) => {
      replies[pId].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    return { topLevelComments: topLevel, repliesByParent: replies };
  }, [comments]);

  // Format relative timestamp
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

  // Submit top-level comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = effectiveAuthorName.trim();
    const trimmedContent = content.trim();

    if (!trimmedName) {
      setFormError(t('pleaseEnterName'));
      return;
    }
    if (!trimmedContent) {
      setFormError(t('pleaseEnterContent'));
      return;
    }

    setSubmitting(true);
    try {
      // Save guest name for future comments
      if (!staffSession) {
        try {
          localStorage.setItem(STORAGE_KEY_GUEST_NAME, trimmedName);
        } catch {
          // ignore
        }
      }

      const newComm = await addComment({
        lessonId,
        authorName: trimmedName,
        content: trimmedContent,
        parentId: null,
        isTeacher: isCurrentAuthorTeacher,
      });

      // If teacher posted, record notification
      if (isCurrentAuthorTeacher && staffSession) {
        recordActivityNotification({
          actionType: 'comment_reply',
          actorName: trimmedName,
          actorRole: staffSession.role,
          lessonId,
          titleKm: `លោកគ្រូ-អ្នកគ្រូបានឆ្លើយតបក្នុងមេរៀន «${lessonTitleKm}»`,
          titleEn: `Teacher replied in lesson "${lessonTitleEn}"`,
          messageKm: `${trimmedName} បានឆ្លើយតប និងពន្យល់សំណួរសិស្ស`,
          messageEn: `${trimmedName} posted verified teacher explanation`,
        });
      }

      setContent('');
      await loadComments();
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply
  const handleSubmitReply = async (parentComment: CommentItem) => {
    const trimmedName = effectiveAuthorName.trim();
    const trimmedReply = replyContent.trim();

    if (!trimmedName) {
      alert(t('pleaseEnterName'));
      return;
    }
    if (!trimmedReply) {
      alert(t('pleaseEnterContent'));
      return;
    }

    setReplySubmitting(true);
    try {
      if (!staffSession) {
        try {
          localStorage.setItem(STORAGE_KEY_GUEST_NAME, trimmedName);
        } catch {
          // ignore
        }
      }

      await addComment({
        lessonId,
        authorName: trimmedName,
        content: trimmedReply,
        parentId: parentComment.id,
        isTeacher: isCurrentAuthorTeacher,
      });

      // If teacher replied, trigger activity notification
      if (isCurrentAuthorTeacher && staffSession) {
        recordActivityNotification({
          actionType: 'comment_reply',
          actorName: trimmedName,
          actorRole: staffSession.role,
          lessonId,
          titleKm: `លោកគ្រូ-អ្នកគ្រូបានឆ្លើយតបសំណួរសិស្ស ${parentComment.authorName}`,
          titleEn: `Teacher replied to student ${parentComment.authorName}`,
          messageKm: `${trimmedName} បានឆ្លើយតបក្នុងមេរៀន «${lessonTitleKm}»`,
          messageEn: `${trimmedName} posted explanation in "${lessonTitleEn}"`,
        });
      }

      setReplyingTo(null);
      setReplyContent('');
      await loadComments();
    } finally {
      setReplySubmitting(false);
    }
  };

  // Delete comment (Staff Only)
  const handleDeleteComment = async (id: string) => {
    if (confirm(t('confirmDeleteComment'))) {
      await deleteComment(id);
      await loadComments();
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('qaSectionTitle')}
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {comments.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('qaSubtitle')}
          </p>
        </div>

        {/* Guest Friendly / No Login Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-medium self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isKhmer ? 'សួរដោយសេរី មិនបាច់បង្កើតគណនី' : 'Ask freely — No account required'}</span>
        </div>
      </div>

      {/* Main Comment Input Form (Guest-Friendly) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 transition-shadow hover:shadow-md">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Author Name Input (or verified Staff display) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            {staffSession ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t('teacherBadge')}</span>
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {effectiveAuthorName}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  ({t('postingAsStaff')})
                </span>
              </div>
            ) : (
              <div className="flex-1 max-w-sm">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('guestName')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder={t('guestNamePlaceholder')}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-400 hidden sm:block">
              {isKhmer ? 'គាំទ្ររូបមន្តគណិតវិទ្យា $LaTeX$' : 'Supports $LaTeX$ math syntax'}
            </div>
          </div>

          {/* Comment Content Textarea */}
          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder={t('commentPlaceholder')}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Validation Error Banner */}
          {formError && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {isKhmer ? 'សំណួររបស់អ្នកនឹងបង្ហាញជាសាធារណៈភ្លាមៗ' : 'Your question will be visible publicly immediately'}
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? t('posting') : t('postComment')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comment Thread List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>{isKhmer ? 'កំពុងទាញយកសំណួរ និងមតិ...' : 'Loading comments & questions...'}</span>
          </div>
        ) : topLevelComments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-40" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t('noCommentsYet')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('beTheFirstComment')}
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const replies = repliesByParent[comment.id] || [];
            const isReplying = replyingTo?.id === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors"
              >
                {/* Comment Author & Meta Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        comment.isTeacher
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {comment.isTeacher ? (
                        <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      ) : (
                        comment.authorName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {comment.authorName}
                        </span>

                        {/* Distinct Teacher Badge */}
                        {comment.isTeacher && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t('teacherBadge')}</span>
                          </span>
                        )}

                        {!comment.isTeacher && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {t('studentBadge')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Staff Moderation Delete Button */}
                  {staffSession && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={t('deleteComment')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Comment Content (with LaTeX formula support) */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1 sm:pl-10 mb-3">
                  <LatexRenderer content={comment.content} />
                </div>

                {/* Reply Action Button */}
                <div className="pl-1 sm:pl-10 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (isReplying) {
                        setReplyingTo(null);
                        setReplyContent('');
                      } else {
                        setReplyingTo(comment);
                        setReplyContent('');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{isReplying ? t('cancelReply') : t('reply')}</span>
                  </button>

                  {replies.length > 0 && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      • {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>

                {/* Inline Reply Form */}
                {isReplying && (
                  <div className="mt-4 ml-1 sm:ml-10 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-blue-500" />
                      <span>
                        {t('replyingTo')} <strong className="text-slate-900 dark:text-white">{comment.authorName}</strong>
                      </span>
                    </div>

                    <div className="space-y-3">
                      {!staffSession && (
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder={t('guestNamePlaceholder')}
                          className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      )}

                      <textarea
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={t('commentPlaceholder')}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {t('cancelReply')}
                        </button>

                        <button
                          type="button"
                          disabled={replySubmitting}
                          onClick={() => handleSubmitReply(comment)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>{replySubmitting ? t('posting') : t('reply')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nested Threaded Replies */}
                {replies.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 ml-1 sm:ml-10 space-y-3 pl-3 sm:pl-4 border-l-2 border-blue-100 dark:border-blue-900/40">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3.5 rounded-xl border transition-colors ${
                          reply.isTeacher
                            ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40 shadow-xs'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {reply.authorName}
                            </span>

                            {/* Distinct Teacher Badge on Reply */}
                            {reply.isTeacher && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                                <GraduationCap className="w-3 h-3" />
                                <span>{t('teacherBadge')}</span>
                              </span>
                            )}

                            <span className="text-[10px] text-slate-400">
                              • {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>

                          {staffSession && (
                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                              title={t('deleteComment')}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          <LatexRenderer content={reply.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
