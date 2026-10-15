'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  UserCheck,
  Video,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  Sparkles,
  Save,
  LogOut,
  AlertCircle,
  FileText,
  Lock,
  Layers,
  Settings2,
  FileQuestion,
  Eye,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  Bell,
} from 'lucide-react';
import {
  SUBJECTS,
  SubjectId,
  GradeLevel,
  GRADES,
  getLessonsBySubjectAndGrade,
  LessonItem,
} from '@/lib/curriculum-data';
import {
  getCurrentStaffSession,
  setCurrentStaffSession,
  getStoredVideos,
  saveStoredVideos,
  addVideoResource,
  deleteVideoResource,
  getStoredStaff,
  saveStoredStaff,
  StaffAccount,
  VideoResourceItem,
  VideoMcqItem,
} from '@/lib/data-store';
import {
  getCurriculumMcqsForLesson,
  CurriculumMcq,
  McqChoice,
  isCurriculumMcqCustomized,
  resetCurriculumMcqInStore,
  resetAllCurriculumMcqsForLesson,
  deleteCurriculumMcqInStore,
} from '@/lib/curriculum-mcqs-generator';
import { useLanguage } from '@/context/language-context';
import { parseYouTubeUrl, parsePdfUrl } from '@/lib/storage-utils';
import { LatexRenderer } from '@/components/latex-renderer';
import { EditVideoModal } from '@/components/edit-video-modal';
import { EditCurriculumMcqModal } from '@/components/edit-curriculum-mcq-modal';
import { DashboardActivityBanner } from '@/components/dashboard-activity-banner';
import { DashboardQaManagement } from '@/components/dashboard-qa-management';
import { DashboardActivityLog } from '@/components/dashboard-activity-log';
import { recordActivityNotification } from '@/lib/notifications-store';

export default function StaffDashboardPage() {
  const router = useRouter();
  const { t, isKhmer } = useLanguage();

  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'manage_content' | 'publish' | 'student_qa' | 'recent_activity' | 'manage_videos' | 'manage_staff'>('manage_content');
  const [videos, setVideos] = useState<VideoResourceItem[]>([]);
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter state for "Manage & Edit Content" Tab
  const [manageSubject, setManageSubject] = useState<SubjectId>('math');
  const [manageGrade, setManageGrade] = useState<GradeLevel>(12);
  const [manageLessonId, setManageLessonId] = useState<string>('math-g12-1');

  // Edit Modals State
  const [editingVideo, setEditingVideo] = useState<VideoResourceItem | null>(null);
  const [editingMcq, setEditingMcq] = useState<CurriculumMcq | null>(null);

  // Form State for Publish New Video Lesson
  const [formSubject, setFormSubject] = useState<SubjectId>('math');
  const [formGrade, setFormGrade] = useState<GradeLevel>(12);
  const [formLessonId, setFormLessonId] = useState<string>('math-g12-1');
  const [formTitleKm, setFormTitleKm] = useState<string>('');
  const [formTitleEn, setFormTitleEn] = useState<string>('');
  const [formDescKm, setFormDescKm] = useState<string>('');
  const [formDescEn, setFormDescEn] = useState<string>('');
  const [formYoutubeUrl, setFormYoutubeUrl] = useState<string>('');
  const [formPdfUrl, setFormPdfUrl] = useState<string>('');

  // Dynamic Video MCQs builder state for Publish Tab
  const [videoMcqs, setVideoMcqs] = useState<VideoMcqItem[]>([
    {
      id: 'vmcq-init-1',
      questionNumber: 1,
      questionKm: '',
      questionEn: '',
      optionsKm: ['', '', '', '', ''],
      optionsEn: ['', '', '', '', ''],
      correctAnswer: 'B',
      hintKm: '',
      hintEn: '',
      explanationKm: '',
      explanationEn: '',
    },
  ]);

  // Load session and data
  useEffect(() => {
    const session = getCurrentStaffSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setCurrentStaff(session);

    // If Subject Lead, force lock subject to their assigned subject
    if (session.role === 'subject_lead' && session.subjectAssigned) {
      setFormSubject(session.subjectAssigned);
      setManageSubject(session.subjectAssigned);
    } else if (typeof window !== 'undefined') {
      // If Super Admin or query param provided, select requested subject
      const urlParams = new URLSearchParams(window.location.search);
      const sub = urlParams.get('subject') as SubjectId | null;
      if (sub && ['math', 'physics', 'chemistry', 'biology', 'english'].includes(sub)) {
        setFormSubject(sub);
        setManageSubject(sub);
      }
    }

    setVideos(getStoredVideos());
    setStaffList(getStoredStaff());
  }, [router]);

  const isSuperAdmin = currentStaff?.role === 'super_admin';

  // Available lessons for Publish tab
  const availablePublishLessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(formSubject, formGrade);
  }, [formSubject, formGrade]);

  // Available lessons for Manage & Edit Content tab
  const availableManageLessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(manageSubject, manageGrade);
  }, [manageSubject, manageGrade]);

  // Keep formLessonId valid
  useEffect(() => {
    if (availablePublishLessons.length > 0) {
      const exists = availablePublishLessons.find((l) => l.id === formLessonId);
      if (!exists) {
        setFormLessonId(availablePublishLessons[0].id);
        setFormTitleKm(`${availablePublishLessons[0].titleKm} (វីដេអូបង្រៀន)`);
        setFormTitleEn(`${availablePublishLessons[0].titleEn} (Lecture)`);
        setFormDescKm(availablePublishLessons[0].descriptionKm);
        setFormDescEn(availablePublishLessons[0].descriptionEn);
      }
    }
  }, [availablePublishLessons, formLessonId]);

  // Keep manageLessonId valid
  useEffect(() => {
    if (availableManageLessons.length > 0) {
      const exists = availableManageLessons.find((l) => l.id === manageLessonId);
      if (!exists) {
        setManageLessonId(availableManageLessons[0].id);
      }
    }
  }, [availableManageLessons, manageLessonId]);

  // When lesson changes in Publish tab
  const handleLessonSelect = (lessonId: string) => {
    setFormLessonId(lessonId);
    const l = availablePublishLessons.find((item) => item.id === lessonId);
    if (l) {
      setFormTitleKm(`${l.titleKm} (វីដេអូបង្រៀន)`);
      setFormTitleEn(`${l.titleEn} (Lecture)`);
      setFormDescKm(l.descriptionKm);
      setFormDescEn(l.descriptionEn);
    }
  };

  // Add Question to dynamic MCQ builder (Publish Tab)
  const handleAddQuestion = () => {
    const nextNum = videoMcqs.length + 1;
    setVideoMcqs((prev) => [
      ...prev,
      {
        id: `vmcq-${Date.now()}-${nextNum}`,
        questionNumber: nextNum,
        questionKm: '',
        questionEn: '',
        optionsKm: ['', '', '', '', ''],
        optionsEn: ['', '', '', '', ''],
        correctAnswer: 'B',
        hintKm: '',
        hintEn: '',
        explanationKm: '',
        explanationEn: '',
      },
    ]);
  };

  // Remove Question from builder
  const handleRemoveQuestion = (index: number) => {
    if (videoMcqs.length <= 1) return;
    setVideoMcqs((prev) =>
      prev.filter((_, i) => i !== index).map((q, idx) => ({ ...q, questionNumber: idx + 1 }))
    );
  };

  // Update Question fields
  const handleUpdateMcq = (index: number, updates: Partial<VideoMcqItem>) => {
    setVideoMcqs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Update specific option text
  const handleUpdateOption = (
    qIndex: number,
    optIndex: number,
    lang: 'km' | 'en',
    value: string
  ) => {
    setVideoMcqs((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIndex] };
      if (lang === 'km') {
        const opts = [...q.optionsKm] as [string, string, string, string, string];
        opts[optIndex] = value;
        q.optionsKm = opts;
      } else {
        const opts = [...q.optionsEn] as [string, string, string, string, string];
        opts[optIndex] = value;
        q.optionsEn = opts;
      }
      copy[qIndex] = q;
      return copy;
    });
  };

  // Form Submission for New Video Lesson
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formYoutubeUrl.trim()) {
      setNotification({
        message: isKhmer ? 'សូមបញ្ចូលតំណភ្ជាប់វីដេអូ YouTube' : 'Please provide a valid YouTube URL',
        type: 'error',
      });
      return;
    }

    const parsedVideo = parseYouTubeUrl(formYoutubeUrl);
    if (!parsedVideo.isValid) {
      setNotification({
        message: isKhmer ? 'តំណភ្ជាប់ YouTube មិនត្រឹមត្រូវទេ' : 'Invalid YouTube URL provided',
        type: 'error',
      });
      return;
    }

    // Filter out blank MCQs
    const validMcqs = videoMcqs
      .filter((q) => q.questionKm.trim() || q.questionEn.trim())
      .map((q, idx) => ({
        ...q,
        questionNumber: idx + 1,
        questionKm: q.questionKm.trim() || q.questionEn.trim(),
        questionEn: q.questionEn.trim() || q.questionKm.trim(),
      }));

    const published = addVideoResource({
      lessonId: formLessonId,
      subject: formSubject,
      grade: formGrade,
      titleKm: formTitleKm.trim() || 'មេរៀនវីដេអូ MoEYS',
      titleEn: formTitleEn.trim() || 'MoEYS Video Lesson',
      descriptionKm: formDescKm.trim(),
      descriptionEn: formDescEn.trim(),
      youtubeUrl: formYoutubeUrl.trim(),
      youtubeVideoId: parsedVideo.videoId || '',
      pdfUrl: formPdfUrl.trim() || undefined,
      pdfSourceType: 'gdrive',
      createdByEmail: currentStaff?.email,
      videoMcqs: validMcqs,
    });

    const staffName = currentStaff ? (isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn) : 'Staff';
    const subjMeta = SUBJECTS[formSubject];
    recordActivityNotification({
      actionType: 'video_upload',
      subject: formSubject,
      grade: formGrade,
      lessonId: formLessonId,
      actorName: staffName,
      actorRole: currentStaff?.role || 'subject_lead',
      titleKm: `បានអាប់ឡូតវីដេអូមុខវិជ្ជា${subjMeta.nameKm}ថ្មី (ថ្នាក់ទី ${formGrade})`,
      titleEn: `New ${subjMeta.nameEn} Video uploaded (Grade ${formGrade})`,
      messageKm: `បានផ្សាយវីដេអូ «${published.titleKm}» និងលំហាត់ស្ទង់ការយល់ដឹង`,
      messageEn: `Published video "${published.titleEn}" and comprehension quiz`,
    });

    setVideos(getStoredVideos());
    setNotification({
      message: isKhmer
        ? '🎉 ផ្សាយមេរៀនវីដេអូ និងលំហាត់ MCQ បានជោគជ័យ!'
        : '🎉 Video lesson and MCQs successfully published!',
      type: 'success',
    });

    // Clear form
    setFormYoutubeUrl('');
    setFormPdfUrl('');
  };

  // Delete Video Lesson with Confirmation
  const handleDeleteVideo = (id: string) => {
    if (confirm(t('confirmDeleteDesc'))) {
      const target = videos.find((v) => v.id === id);
      const ok = deleteVideoResource(id);
      if (ok) {
        setVideos(getStoredVideos());
        if (target) {
          const staffName = currentStaff ? (isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn) : 'Staff';
          recordActivityNotification({
            actionType: 'video_delete',
            subject: target.subject,
            grade: target.grade,
            lessonId: target.lessonId,
            actorName: staffName,
            actorRole: currentStaff?.role || 'subject_lead',
            titleKm: `បានលុបមេរៀនវីដេអូ «${target.titleKm}»`,
            titleEn: `Deleted video resource "${target.titleEn}"`,
            messageKm: `បានដកចេញពីប្រព័ន្ធមេរៀនវីដេអូ និងឯកសារជំនួយស្មារតី`,
            messageEn: `Removed video resource from curriculum hub`,
          });
        }
        setNotification({
          message: t('deletedSuccessfully'),
          type: 'success',
        });
      }
    }
  };

  // Callback when a video resource is saved from modal
  const handleVideoSaved = (updated: VideoResourceItem) => {
    setVideos(getStoredVideos());
    const staffName = currentStaff ? (isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn) : 'Staff';
    recordActivityNotification({
      actionType: 'video_edit',
      subject: updated.subject,
      grade: updated.grade,
      lessonId: updated.lessonId,
      actorName: staffName,
      actorRole: currentStaff?.role || 'subject_lead',
      titleKm: `បានកែសម្រួលមេរៀនវីដេអូ «${updated.titleKm}»`,
      titleEn: `Edited video resource "${updated.titleEn}"`,
      messageKm: `បានធ្វើបច្ចុប្បន្នភាពតំណភ្ជាប់វីដេអូ ឯកសារ PDF ឬសំណួរ MCQ`,
      messageEn: `Updated video URL, PDF handout link, or attached comprehension MCQs`,
    });
    setNotification({
      message: t('updatedSuccessfully'),
      type: 'success',
    });
  };

  // Callback when a curriculum MCQ is saved from modal
  const handleCurriculumMcqSaved = (updated: CurriculumMcq) => {
    const staffName = currentStaff ? (isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn) : 'Staff';
    const subjMeta = SUBJECTS[updated.subject];
    recordActivityNotification({
      actionType: 'mcq_edit',
      subject: updated.subject,
      grade: updated.grade,
      lessonId: updated.lessonId,
      actorName: staffName,
      actorRole: currentStaff?.role || 'subject_lead',
      titleKm: `បានកែសម្រួលលំហាត់ស្តង់ដារ MoEYS សំណួរទី #${updated.questionNumber} (${subjMeta.nameKm})`,
      titleEn: `Updated standard MoEYS MCQ Question #${updated.questionNumber} (${subjMeta.nameEn})`,
      messageKm: `បានកែសម្រួលខ្លឹមសារសំណួរ ជម្រើសចម្លើយ និងដំណោះស្រាយលម្អិត`,
      messageEn: `Updated question prompt, choices, and step-by-step solution`,
    });
    setNotification({
      message: `${t('updatedSuccessfully')} (#${updated.questionNumber})`,
      type: 'success',
    });
  };

  // Reset single curriculum MCQ back to MoEYS default
  const handleResetCurriculumMcq = async (lessonId: string, qNum: number) => {
    if (
      confirm(
        isKhmer
          ? `តើអ្នកចង់កំណត់សំណួរទី #${qNum} ឡើងវិញទៅគំរូដើម MoEYS មែនទេ?`
          : `Reset Question #${qNum} back to MoEYS default template?`
      )
    ) {
      await resetCurriculumMcqInStore(lessonId, qNum);
      setNotification({
        message: isKhmer
          ? `🔄 បានកំណត់សំណួរទី #${qNum} ឡើងវិញទៅគំរូដើម MoEYS ជោគជ័យ!`
          : `🔄 Question #${qNum} reset to MoEYS default successfully!`,
        type: 'success',
      });
    }
  };

  // Delete / Remove customization for a curriculum MCQ
  const handleDeleteCurriculumMcq = async (lessonId: string, qNum: number) => {
    if (
      confirm(
        isKhmer
          ? `តើអ្នកចង់លុបការកែសម្រួលលើសំណួរទី #${qNum} មែនទេ?`
          : `Delete customization on Question #${qNum}?`
      )
    ) {
      await deleteCurriculumMcqInStore(lessonId, qNum);
      setNotification({
        message: isKhmer
          ? `🗑️ បានលុបការកែសម្រួលសំណួរទី #${qNum} ជោគជ័យ!`
          : `🗑️ Question #${qNum} customization removed!`,
        type: 'success',
      });
    }
  };

  // Reset ALL 10 MCQs for this lesson
  const handleResetAllLessonMcqs = async (lessonId: string) => {
    if (
      confirm(
        isKhmer
          ? 'តើអ្នកប្រាកដជាចង់កំណត់សំណួរទាំង ១០ ក្នុងមេរៀននេះឡើងវិញទៅគំរូដើម MoEYS ទាំងអស់មែនទេ?'
          : 'Are you sure you want to reset all 10 MCQs for this lesson back to MoEYS default template?'
      )
    ) {
      await resetAllCurriculumMcqsForLesson(lessonId);
      setNotification({
        message: isKhmer
          ? '🔄 បានកំណត់សំណួរទាំង ១០ ក្នុងមេរៀននេះឡើងវិញទៅគំរូដើម MoEYS ជោគជ័យ!'
          : '🔄 All 10 MCQs for this lesson have been reset to MoEYS default!',
        type: 'success',
      });
    }
  };

  // Toggle Staff Account Status (Super Admin Only)
  const handleToggleStaffStatus = (id: string) => {
    if (!isSuperAdmin) return;
    const updated = staffList.map((st) => (st.id === id ? { ...st, isActive: !st.isActive } : st));
    setStaffList(updated);
    saveStoredStaff(updated);
  };

  const handleLogout = () => {
    setCurrentStaffSession(null);
    router.push('/');
  };

  // Filtered resources for the "Manage & Edit Content" Tab
  const filteredLessonVideos = useMemo(() => {
    return videos.filter((v) => v.lessonId === manageLessonId);
  }, [videos, manageLessonId]);

  // Standard 10 MCQs for the selected lesson in "Manage & Edit Content"
  const lessonCurriculumMcqs = useMemo(() => {
    if (!manageLessonId) return [];
    return getCurriculumMcqsForLesson(manageLessonId);
  }, [manageLessonId, notification]);

  // Count of teacher-customized MCQs in this lesson
  const customizedCount = useMemo(() => {
    return lessonCurriculumMcqs.filter((q) => isCurriculumMcqCustomized(q.lessonId, q.questionNumber)).length;
  }, [lessonCurriculumMcqs]);

  if (!currentStaff) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28">
      {/* Top Staff Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              {isSuperAdmin ? <ShieldCheck className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {isKhmer ? currentStaff.fullNameKm : currentStaff.fullNameEn}
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold rounded-md uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {isSuperAdmin ? 'Super Admin' : `${currentStaff.subjectAssigned} Lead`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentStaff.email} • {isSuperAdmin ? 'គ្រប់គ្រងគ្រប់មុខវិជ្ជា និងគណនីគ្រូទាំងអស់' : `ចាក់សោលើមុខវិជ្ជា៖ ${SUBJECTS[currentStaff.subjectAssigned!].nameKm}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>

        {/* Real-time Content Update Notification Banner */}
        <DashboardActivityBanner onViewActivityLog={() => setActiveTab('recent_activity')} />

        {/* Dashboard Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 overflow-x-auto">
          {/* 1. Manage & Edit Content Tab (Primary Management View) */}
          <button
            onClick={() => setActiveTab('manage_content')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'manage_content'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>{t('manageEditContent')}</span>
          </button>

          {/* 2. Publish New Video Lesson */}
          <button
            onClick={() => setActiveTab('publish')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'publish'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isKhmer ? '➕ ផ្សាយមេរៀនវីដេអូ & MCQ ថ្មី' : '➕ Publish Video Lesson & MCQs'}</span>
          </button>

          {/* 3. Student Q&A Management Tab (Direct Staff Reply with Teacher Badge) */}
          <button
            onClick={() => setActiveTab('student_qa')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'student_qa'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isKhmer ? '💬 សំណួរ & មតិសិស្ស (Q&A)' : '💬 Student Q&A'}</span>
          </button>

          {/* 4. Recent Activity Log Tab */}
          <button
            onClick={() => setActiveTab('recent_activity')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'recent_activity'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{isKhmer ? '📋 កំណត់ត្រាសកម្មភាព' : '📋 Activity Log'}</span>
          </button>

          {/* 5. All Video Resources Catalog */}
          <button
            onClick={() => setActiveTab('manage_videos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'manage_videos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isKhmer ? `🎬 បញ្ជីមេរៀនវីដេអូ (${videos.length})` : `🎬 Video Resources (${videos.length})`}</span>
          </button>

          {/* 6. Manage Staff (Super Admin Only) */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('manage_staff')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'manage_staff'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isKhmer ? '👥 គ្រប់គ្រងគណនីគ្រូ (៥ មុខវិជ្ជា)' : '👥 Manage Subject Leads'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-sm font-semibold border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-100 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-100 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs uppercase font-bold px-2 py-1 hover:underline"
            >
              {t('dismiss')}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: DEDICATED "MANAGE & EDIT CONTENT" VIEW                   */}
      {/* ============================================================== */}
      {activeTab === 'manage_content' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
          {/* Header & Filter Card: Subject -> Grade -> MoEYS Lesson */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{t('manageEditContent')}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('manageEditDesc')}
                </p>
              </div>

              {!isSuperAdmin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 self-start md:self-auto">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked to {currentStaff.subjectAssigned} Lead</span>
                </span>
              )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Subject (Locked for Subject Lead, Selectable for Super Admin) */}
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('selectSubject')}
                </label>
                <select
                  disabled={!isSuperAdmin}
                  value={manageSubject}
                  onChange={(e) => setManageSubject(e.target.value as SubjectId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold disabled:opacity-80"
                >
                  {(Object.keys(SUBJECTS) as SubjectId[]).map((s) => (
                    <option key={s} value={s}>
                      {isKhmer ? SUBJECTS[s].nameKm : SUBJECTS[s].nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade (7 to 12) */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('selectGrade')}
                </label>
                <select
                  value={manageGrade}
                  onChange={(e) => setManageGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {t('grade')} {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* MoEYS Lesson */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('selectLesson')} ({availableManageLessons.length})
                </label>
                <select
                  value={manageLessonId}
                  onChange={(e) => setManageLessonId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold truncate"
                >
                  {availableManageLessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* SECTION 1: UPLOADED VIDEO & PDF RESOURCES FOR THIS LESSON  */}
          {/* ========================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {t('uploadedResources')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {filteredLessonVideos.length} {isKhmer ? 'ធនធានត្រូវបានផ្សាយក្នុងមេរៀននេះ' : 'resource(s) published for this lesson'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormSubject(manageSubject);
                  setFormGrade(manageGrade);
                  setFormLessonId(manageLessonId);
                  setActiveTab('publish');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isKhmer ? '+ បន្ថែមវីដេអូថ្មី' : '+ Add Video for this Lesson'}</span>
              </button>
            </div>

            {filteredLessonVideos.length > 0 ? (
              <div className="space-y-4">
                {filteredLessonVideos.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {item.grade}th Grade
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.videoMcqs?.length || 0} Video MCQs
                          </span>
                          {item.pdfUrl && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                              PDF Attached
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {isKhmer ? item.titleKm : item.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.youtubeUrl}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Watch on YouTube"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => setEditingVideo(item)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{t('edit')}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteVideo(item.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('delete')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Video className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t('noResourcesForLesson')}
                </p>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* SECTION 2: STANDARD 10 CURRICULUM MCQs FOR THIS LESSON      */}
          {/* ========================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {t('standardCurriculumMcqs')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isKhmer
                      ? 'សំណួរទាំង ១០ ស្តង់ដារ MoEYS (ចុច "កែសម្រួល" ដើម្បីកែប្រែ LaTeX, ជម្រើសទាំង ៥, និងការពន្យល់)'
                      : 'All 10 MoEYS standard questions (Click "Edit" to adjust LaTeX formulas, options A-E, and solutions)'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {customizedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => handleResetAllLessonMcqs(manageLessonId)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    title={isKhmer ? 'កំណត់សំណួរទាំង ១០ ឡើងវិញទៅគំរូដើម MoEYS' : 'Reset all 10 MCQs to MoEYS default'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isKhmer ? '🔄 កំណត់ទាំង ១០ ឡើងវិញ' : '🔄 Reset All 10'}</span>
                  </button>
                )}

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {customizedCount > 0
                    ? isKhmer
                      ? `កែសម្រួល ${customizedCount}/១០`
                      : `${customizedCount}/10 Edited`
                    : isKhmer
                    ? 'ស្តង់ដារ MoEYS ១០/១០'
                    : '10/10 MoEYS Standard'}
                </span>
              </div>
            </div>

            {/* List of the 10 Standard Questions */}
            <div className="space-y-4">
              {lessonCurriculumMcqs.map((q) => {
                const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];
                const isCustom = isCurriculumMcqCustomized(q.lessonId, q.questionNumber);
                const diffBadge = {
                  basic: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
                  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
                  advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200',
                }[q.difficulty];

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          #{q.questionNumber}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${diffBadge}`}>
                          {t(q.difficulty)}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Correct: {q.correctAnswer}
                        </span>

                        {isCustom ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            <span>✏️ {isKhmer ? 'កែសម្រួលរួច' : 'Custom Edited'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            ⭐ MoEYS Default
                          </span>
                        )}
                      </div>

                      {/* Question Text with KaTeX Preview */}
                      <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed mb-3">
                        <LatexRenderer content={isKhmer ? q.questionKm : q.questionEn} />
                      </div>

                      {/* 5 Options Mini Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {choices.map((c, idx) => (
                          <div
                            key={c}
                            className={`px-2 py-1 rounded-md border flex items-center gap-1.5 truncate ${
                              q.correctAnswer === c
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <span className="font-bold flex-shrink-0">{c}.</span>
                            <span className="truncate">
                              {isKhmer ? q.optionsKm[idx] : q.optionsEn[idx]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons: Edit, Reset, Delete */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-start mt-1">
                      <button
                        onClick={() => setEditingMcq(q)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{t('edit')}</span>
                      </button>

                      {isCustom && (
                        <button
                          onClick={() => handleResetCurriculumMcq(q.lessonId, q.questionNumber)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                          title={isKhmer ? 'កំណត់សំណួរនេះឡើងវិញទៅតាមគំរូដើម MoEYS' : 'Reset Question to MoEYS standard'}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isKhmer ? 'កំណត់ឡើងវិញ' : 'Reset'}</span>
                        </button>
                      )}

                      {isCustom && (
                        <button
                          onClick={() => handleDeleteCurriculumMcq(q.lessonId, q.questionNumber)}
                          className="p-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                          title={isKhmer ? 'លុបការកែសម្រួល' : 'Delete customization'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PUBLISH NEW VIDEO LESSON & MCQs                         */}
      {/* ============================================================== */}
      {activeTab === 'publish' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>{isKhmer ? 'ទម្រង់ផ្សាយមេរៀនវីដេអូ & បង្កើតសំណួរ MCQ ដោយគ្មានកូដ' : 'No-Code Video & MCQ Publishing Form'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isKhmer
                  ? 'បំពេញព័ត៌មាន បិទភ្ជាប់តំណភ្ជាប់ YouTube, Google Drive PDF និងបង្កើតសំណួរ MCQ ស្ទង់ការយល់ដឹង'
                  : 'Paste YouTube URL, Google Drive PDF Link, and dynamically attach unlimited comprehension MCQs.'}
              </p>
            </div>

            <form onSubmit={handlePublish} className="space-y-6">
              {/* Step 1 & 2: Subject & Grade Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>{t('selectSubject')}</span>
                    {!isSuperAdmin && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3" /> Locked to Lead
                      </span>
                    )}
                  </label>
                  <select
                    disabled={!isSuperAdmin}
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as SubjectId)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm disabled:opacity-80"
                  >
                    {(Object.keys(SUBJECTS) as SubjectId[]).map((s) => (
                      <option key={s} value={s}>
                        {isKhmer ? SUBJECTS[s].nameKm : SUBJECTS[s].nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('selectGrade')} (Grades 7–12)
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {t('grade')} {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MoEYS Lesson Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isKhmer ? 'ជ្រើសរើសមេរៀនតាមកម្មវិធីសិក្សា MoEYS' : 'Select Lesson from MoEYS Curriculum Tree'}
                </label>
                <select
                  value={formLessonId}
                  onChange={(e) => handleLessonSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm"
                >
                  {availablePublishLessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Hybrid Storage URLs (YouTube + Google Drive PDF) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {t('youtubeUrl')} *
                  </label>
                  <input
                    type="url"
                    required
                    value={formYoutubeUrl}
                    onChange={(e) => setFormYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {isKhmer ? 'គាំទ្រ YouTube URL គ្រប់ទម្រង់ (embed ស្វ័យប្រវត្តិកម្រិត 16:9)' : 'Auto-embedded in 16:9 player'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {t('gdrivePdfUrl')}
                  </label>
                  <input
                    type="url"
                    value={formPdfUrl}
                    onChange={(e) => setFormPdfUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {isKhmer ? 'បម្លែងទៅជាប៊ូតុងមើល និងទាញយកស្វ័យប្រវត្តិ' : 'Auto-converts to preview & direct download'}
                  </span>
                </div>
              </div>

              {/* Titles & Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('titleKhmer')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleKm}
                    onChange={(e) => setFormTitleKm(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('titleEnglish')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('descKhmer')} (KaTeX: $...$)
                  </label>
                  <textarea
                    rows={2}
                    value={formDescKm}
                    onChange={(e) => setFormDescKm(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('descEnglish')} (KaTeX: $...$)
                  </label>
                  <textarea
                    rows={2}
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Dynamic Video MCQ Builder */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <span>{isKhmer ? 'សំណួរស្ទង់ការយល់ដឹងពីវីដេអូ (Video-Attached MCQs)' : 'Dynamic Video Comprehension MCQs'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isKhmer ? 'បង្កើតសំណួរ ៥ ជម្រើស (A, B, C, D, E) ភ្ជាប់ជាមួយវីដេអូនេះ' : 'Add unlimited 5-option questions with Hint and KaTeX formulas'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t('addQuestion')}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {videoMcqs.map((q, qIndex) => {
                    const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                              {qIndex + 1}
                            </span>
                            <span>{t('question')} #{qIndex + 1}</span>
                          </span>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                              <span className="text-slate-500">{t('correctAnswer')}:</span>
                              <select
                                value={q.correctAnswer}
                                onChange={(e) =>
                                  handleUpdateMcq(qIndex, { correctAnswer: e.target.value as McqChoice })
                                }
                                className="px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold"
                              >
                                {choices.map((c) => (
                                  <option key={c} value={c}>
                                    Choice {c}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {videoMcqs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(qIndex)}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={q.questionKm}
                              onChange={(e) => handleUpdateMcq(qIndex, { questionKm: e.target.value })}
                              placeholder="សំណួរជាភាសាខ្មែរ... (KaTeX $...$)"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={q.questionEn}
                              onChange={(e) => handleUpdateMcq(qIndex, { questionEn: e.target.value })}
                              placeholder="Question in English..."
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                            />
                          </div>
                        </div>

                        {/* 5 Choices */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                            {t('options')}
                          </span>
                          {choices.map((c, optIdx) => (
                            <div key={c} className="flex items-center gap-2">
                              <span
                                className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                                  q.correctAnswer === c
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {c}
                              </span>
                              <input
                                type="text"
                                value={q.optionsKm[optIdx] || ''}
                                onChange={(e) =>
                                  handleUpdateOption(qIndex, optIdx, 'km', e.target.value)
                                }
                                placeholder={`ជម្រើស ${c} (Option ${c})`}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Hint & Short Answer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <input
                            type="text"
                            value={q.hintKm}
                            onChange={(e) => handleUpdateMcq(qIndex, { hintKm: e.target.value })}
                            placeholder="💡 ជំនួយស្មារតី..."
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white text-xs"
                          />
                          <input
                            type="text"
                            value={q.explanationKm}
                            onChange={(e) =>
                              handleUpdateMcq(qIndex, { explanationKm: e.target.value })
                            }
                            placeholder="📖 ការពន្យល់សង្ខេប..."
                            className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-slate-900 dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('publishResource')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MANAGE UPLOADED VIDEO LESSONS                           */}
      {/* ============================================================== */}
      {activeTab === 'manage_videos' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {isKhmer ? 'បញ្ជីមេរៀនវីដេអូដែលបានផ្សាយ' : 'Published Video Lessons Catalog'}
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {videos
                .filter((v) => (isSuperAdmin ? true : v.subject === currentStaff.subjectAssigned))
                .map((video) => {
                  const subjectMeta = SUBJECTS[video.subject];
                  return (
                    <div
                      key={video.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${subjectMeta.badgeBg} ${subjectMeta.badgeText}`}
                            >
                              {isKhmer ? subjectMeta.nameKm : subjectMeta.nameEn}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {t('grade')} {video.grade}
                            </span>
                            <span className="text-xs text-slate-400">
                              • {video.videoMcqs?.length || 0} MCQs
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {isKhmer ? video.titleKm : video.titleEn}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {video.youtubeUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                        <a
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Watch"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setEditingVideo(video)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{t('edit')}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SUPER ADMIN - MANAGE 5 SUBJECT LEADS                    */}
      {/* ============================================================== */}
      {activeTab === 'manage_staff' && isSuperAdmin && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isKhmer ? 'គ្រប់គ្រងគណនីប្រធានដេប៉ាតឺម៉ង់មុខវិជ្ជាទាំង ៥' : 'Department Heads & Staff Management'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isKhmer
                    ? 'Super Admin មានសិទ្ធិមើល កែសម្រួល និងផ្អាកសកម្មភាពគណនីគ្រូនីមួយៗ'
                    : 'Manage role assignments, activation status, and departmental locks.'}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffList.map((st) => {
                const isSuper = st.role === 'super_admin';
                const subjectMeta = st.subjectAssigned ? SUBJECTS[st.subjectAssigned] : null;

                return (
                  <div
                    key={st.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                          isSuper ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}
                      >
                        {isSuper ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {isKhmer ? st.fullNameKm : st.fullNameEn}
                        </h4>
                        <span className="text-xs text-slate-500">{st.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          isSuper
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : subjectMeta
                            ? `${subjectMeta.badgeBg} ${subjectMeta.badgeText}`
                            : 'bg-slate-100'
                        }`}
                      >
                        {isSuper ? 'Super Admin' : `${st.subjectAssigned} Lead`}
                      </span>

                      {!isSuper && (
                        <button
                          onClick={() => handleToggleStaffStatus(st.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                            st.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {st.isActive ? t('active') : t('inactive')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: STUDENT Q&A / PUBLIC COMMENTS MANAGEMENT                */}
      {/* ============================================================== */}
      {activeTab === 'student_qa' && currentStaff && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <DashboardQaManagement currentStaff={currentStaff} />
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: REAL-TIME RECENT ACTIVITY LOG STREAM                    */}
      {/* ============================================================== */}
      {activeTab === 'recent_activity' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <DashboardActivityLog />
        </div>
      )}

      {/* Edit Video Resource Modal */}
      <EditVideoModal
        isOpen={Boolean(editingVideo)}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        onSaved={handleVideoSaved}
      />

      {/* Edit Standard Curriculum MCQ Modal */}
      <EditCurriculumMcqModal
        isOpen={Boolean(editingMcq)}
        onClose={() => setEditingMcq(null)}
        mcq={editingMcq}
        onSaved={handleCurriculumMcqSaved}
        onReset={() => {
          setNotification({
            message: isKhmer
              ? '🔄 បានកំណត់សំណួរឡើងវិញទៅគំរូដើម MoEYS ជោគជ័យ!'
              : '🔄 Question reset to MoEYS default template successfully!',
            type: 'success',
          });
        }}
      />
    </div>
  );
}
