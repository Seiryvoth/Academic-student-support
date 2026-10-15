'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Reply,
  Trash2,
  GraduationCap,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  BookOpen,
  CornerDownRight,
  User,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import {
  CommentItem,
  getLocalComments,
  addComment,
  deleteComment,
  subscribeToComments,
  getCommentsForLesson,
} from '@/lib/comments-store';
import { StaffAccount } from '@/lib/data-store';
import { SUBJECTS, SubjectId, getLessonById } from '@/lib/curriculum-data';
import { recordActivityNotification } from '@/lib/notifications-store';
import { LatexRenderer } from '@/components/latex-renderer';

interface DashboardQaManagementProps {
  currentStaff: StaffAccount;
}

export const DashboardQaManagement: React.FC<DashboardQaManagementProps> = ({
  currentStaff,
}) => {
  const { t, isKhmer } = useLanguage();

  const [allComments, setAllComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>(
    currentStaff.role === 'subject_lead' && currentStaff.subjectAssigned
      ? currentStaff.subjectAssigned
      : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered'>('all');

  // Direct reply state
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await getCommentsForLesson();
      setAllComments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToComments(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  // Separate top-level comments and replies
  const { topLevelComments, repliesByParent } = useMemo(() => {
    const topLevel: CommentItem[] = [];
    const replies: Record<string, CommentItem[]> = {};

    allComments.forEach((c) => {
      if (!c.parentId) {
        topLevel.push(c);
      } else {
        if (!replies[c.parentId]) {
          replies[c.parentId] = [];
        }
        replies[c.parentId].push(c);
      }
    });

    topLevel.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { topLevelComments: topLevel, repliesByParent: replies };
  }, [allComments]);

  // Filtered comments based on subject lock / selection and status
  const filteredComments = useMemo(() => {
    return topLevelComments.filter((comm) => {
      // 1. Subject filter
      const lessonMeta = getLessonById(comm.lessonId);
      const subject = lessonMeta?.subject || (comm.lessonId.split('-')[0] as SubjectId);

      if (currentStaff.role === 'subject_lead' && currentStaff.subjectAssigned) {
        if (subject !== currentStaff.subjectAssigned) return false;
      } else if (selectedSubjectFilter !== 'all') {
        if (subject !== selectedSubjectFilter) return false;
      }

      // 2. Status filter
      const replies = repliesByParent[comm.id] || [];
      const hasTeacherReply = replies.some((r) => r.isTeacher);

      if (statusFilter === 'pending' && hasTeacherReply) return false;
      if (statusFilter === 'answered' && !hasTeacherReply) return false;

      return true;
    });
  }, [
    topLevelComments,
    repliesByParent,
    currentStaff,
    selectedSubjectFilter,
    statusFilter,
  ]);

  // Handle staff reply
  const handleSendStaffReply = async (parentComment: CommentItem) => {
    if (!replyText.trim()) {
      alert(t('pleaseEnterContent'));
      return;
    }

    setSubmittingReply(true);
    try {
      const staffName = isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn;
      const lessonMeta = getLessonById(parentComment.lessonId);

      await addComment({
        lessonId: parentComment.lessonId,
        authorName: staffName,
        content: replyText.trim(),
        parentId: parentComment.id,
        isTeacher: true,
      });

      // Record Activity Notification
      await recordActivityNotification({
        actionType: 'comment_reply',
        subject: lessonMeta?.subject,
        grade: lessonMeta?.grade,
        lessonId: parentComment.lessonId,
        actorName: staffName,
        actorRole: currentStaff.role,
        titleKm: `លោកគ្រូ-អ្នកគ្រូបានឆ្លើយតបសំណួរសិស្ស ${parentComment.authorName}`,
        titleEn: `Teacher replied to student ${parentComment.authorName}`,
        messageKm: `បានពន្យល់ និងឆ្លើយតបក្នុងមេរៀន «${lessonMeta?.titleKm || parentComment.lessonId}»`,
        messageEn: `Posted teacher solution in "${lessonMeta?.titleEn || parentComment.lessonId}"`,
      });

      setReplyingCommentId(null);
      setReplyText('');
      await loadData();
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDeleteComment'))) {
      await deleteComment(id);
      await loadData();
    }
  };

  const formatTime = (iso: string) => {
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diffMs / 60000);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      if (mins < 2) return t('justNow');
      if (mins < 60) return `${mins} ${t('minutesAgo')}`;
      if (hours < 24) return `${hours} ${t('hoursAgo')}`;
      return `${days} ${t('daysAgo')}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('studentQaManagement')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('qaManagementDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('allQuestions')} ({topLevelComments.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('pendingReply')}
              </button>
              <button
                onClick={() => setStatusFilter('answered')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'answered'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('answered')}
              </button>
            </div>
          </div>
        </div>

        {/* Subject Filter (If Super Admin) */}
        {currentStaff.role === 'super_admin' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-4">
            <span className="text-xs font-bold text-slate-500 mr-1 flex-shrink-0">
              {isKhmer ? 'មុខវិជ្ជា៖' : 'Subject:'}
            </span>
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSubjectFilter === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('allSubjects')}
            </button>
            {(Object.keys(SUBJECTS) as SubjectId[]).map((subKey) => {
              const meta = SUBJECTS[subKey];
              const isSelected = selectedSubjectFilter === subKey;
              return (
                <button
                  key={subKey}
                  onClick={() => setSelectedSubjectFilter(subKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? `bg-gradient-to-r ${meta.gradient} text-white border-transparent shadow-xs`
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isKhmer ? meta.nameKm : meta.nameEn}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Questions Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">{isKhmer ? 'កំពុងទាញយកទិន្នន័យ...' : 'Loading questions...'}</span>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {isKhmer ? 'គ្មានសំណួរដែលត្រូវបង្ហាញទេ' : 'No questions match the current filter'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isKhmer ? 'រាល់សំណួររបស់សិស្សនឹងបង្ហាញនៅទីនេះដោយស្វ័យប្រវត្តិ' : 'All incoming student questions will appear here in real-time'}
            </p>
          </div>
        ) : (
          filteredComments.map((comm) => {
            const replies = repliesByParent[comm.id] || [];
            const hasTeacherReply = replies.some((r) => r.isTeacher);
            const lessonMeta = getLessonById(comm.lessonId);
            const isReplying = replyingCommentId === comm.id;

            return (
              <div
                key={comm.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Header: Author + Lesson badge + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                      {comm.authorName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {comm.authorName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {t('studentBadge')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(comm.createdAt)}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {lessonMeta ? (isKhmer ? lessonMeta.titleKm : lessonMeta.titleEn) : comm.lessonId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Lesson Link */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {hasTeacherReply ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('answered')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t('pendingReply')}</span>
                      </span>
                    )}

                    <Link
                      href={`/videos`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t('viewInLesson')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(comm.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={t('deleteComment')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Content */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                  <LatexRenderer content={comm.content} />
                </div>

                {/* Existing Replies List */}
                {replies.length > 0 && (
                  <div className="mb-4 pl-4 border-l-2 border-amber-300 dark:border-amber-700 space-y-2.5">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3 rounded-xl border text-xs ${
                          reply.isTeacher
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {reply.authorName}
                            </span>
                            {reply.isTeacher && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                                <GraduationCap className="w-3 h-3" />
                                <span>{t('teacherBadge')}</span>
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              • {formatTime(reply.createdAt)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDelete(reply.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          <LatexRenderer content={reply.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Reply Box / Button */}
                {isReplying ? (
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200 mb-2">
                      <GraduationCap className="w-4 h-4 text-amber-500" />
                      <span>
                        {isKhmer
                          ? `ឆ្លើយតបក្នុងនាមជា៖ ${isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn} (Teacher)`
                          : `Replying as: ${isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn} (Teacher)`}
                      </span>
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={isKhmer ? 'សរសេរចម្លើយ និងការពន្យល់ដល់សិស្សនៅទីនេះ (គាំទ្ររូបមន្ត LaTeX $)...' : 'Write teacher answer and explanation here (supports LaTeX math $)...'}
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex items-center justify-end gap-2 mt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingCommentId(null);
                          setReplyText('');
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        {t('cancel')}
                      </button>

                      <button
                        type="button"
                        disabled={submittingReply}
                        onClick={() => handleSendStaffReply(comm)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReply ? t('posting') : t('sendReply')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setReplyingCommentId(comm.id);
                      setReplyText('');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-all"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{isKhmer ? '✍️ ឆ្លើយតបសំណួរនេះ (Reply as Teacher)' : '✍️ Reply to Student Question'}</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
