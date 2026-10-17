'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Plus,
  ArrowUp,
  ArrowDown,
  Play,
  ListMusic,
  ChevronDown,
  ChevronUp,
  Paperclip,
  CheckSquare,
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
  VideoRecord,
  VideoAttachmentRecord,
  UnifiedMcqRecord,
  getStoredAttachments,
  getAttachmentsByVideo,
  addVideoAttachmentRecord,
  deleteVideoAttachmentRecord,
  getStoredUnifiedMcqs,
  getUnifiedMcqsByLesson,
  getUnifiedMcqsByVideo,
  deleteUnifiedMcqRecord,
  CMS_SYNC_EVENT,
} from '@/lib/cms-unified-store';
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
import { useAuth } from '@/context/auth-context';
import { parseYouTubeUrl, parsePdfUrl } from '@/lib/storage-utils';
import { LatexRenderer } from '@/components/latex-renderer';
import { EditVideoModal } from '@/components/edit-video-modal';
import { EditCurriculumMcqModal } from '@/components/edit-curriculum-mcq-modal';
import { QuickAddLessonModal } from '@/components/quick-add-lesson-modal';
import { AddPlaylistVideoModal } from '@/components/add-playlist-video-modal';
import { AddCurriculumMcqModal } from '@/components/add-curriculum-mcq-modal';
import { DashboardActivityBanner } from '@/components/dashboard-activity-banner';
import { DashboardQaManagement } from '@/components/dashboard-qa-management';
import { DashboardActivityLog } from '@/components/dashboard-activity-log';
import { recordActivityNotification } from '@/lib/notifications-store';
import { reorderLessonVideos, getVideosForLesson } from '@/lib/data-store';

export default function StaffDashboardPage() {
  const router = useRouter();
  const { t, isKhmer } = useLanguage();
  const { staffSession, isLoading, isAuthenticated, logout } = useAuth();
  const currentStaff = staffSession;

  const [activeTab, setActiveTab] = useState<'manage_content' | 'publish' | 'student_qa' | 'recent_activity' | 'manage_videos' | 'manage_staff'>('manage_content');
  const [videos, setVideos] = useState<VideoResourceItem[]>([]);
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter state for "Manage & Edit Content" Tab
  const [manageSubject, setManageSubject] = useState<SubjectId>('math');
  const [manageGrade, setManageGrade] = useState<GradeLevel>(12);
  const [manageLessonId, setManageLessonId] = useState<string>('math-g12-1');

  // Edit & Add Modals State
  const [editingVideo, setEditingVideo] = useState<VideoResourceItem | null>(null);
  const [editingMcq, setEditingMcq] = useState<CurriculumMcq | null>(null);
  const [quickAddLessonOpen, setQuickAddLessonOpen] = useState<boolean>(false);
  const [quickAddTarget, setQuickAddTarget] = useState<'manage' | 'publish'>('manage');
  const [addPlaylistVideoOpen, setAddPlaylistVideoOpen] = useState<boolean>(false);
  const [addMcqOpen, setAddMcqOpen] = useState<boolean>(false);
  const [lessonRefreshKey, setLessonRefreshKey] = useState<number>(0);

  // CMS Video Sub-Form Accordion & Synchronized MCQs State
  const [expandedVideoIds, setExpandedVideoIds] = useState<string[]>([]);
  const [videoAttachmentsState, setVideoAttachmentsState] = useState<VideoAttachmentRecord[]>([]);
  const [unifiedMcqsState, setUnifiedMcqsState] = useState<UnifiedMcqRecord[]>([]);
  const [selectedTargetVideoIdForMcq, setSelectedTargetVideoIdForMcq] = useState<string | null>(null);
  const [newAttachmentInputs, setNewAttachmentInputs] = useState<Record<string, { title: string; url: string }>>({});
  const [mcqFilterTab, setMcqFilterTab] = useState<'all' | 'lesson_only' | 'video_only'>('all');

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

  // Auth Guard: Only redirect when isLoading transitions from true to false and user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load session-dependent data
  useEffect(() => {
    if (!staffSession) return;

    // If Subject Lead, force lock subject to their assigned subject
    if (staffSession.role === 'subject_lead' && staffSession.subjectAssigned) {
      setFormSubject(staffSession.subjectAssigned);
      setManageSubject(staffSession.subjectAssigned);
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
    setVideoAttachmentsState(getStoredAttachments());
    setUnifiedMcqsState(getStoredUnifiedMcqs());

    const handleLessonUpdate = () => {
      setLessonRefreshKey((prev) => prev + 1);
    };
    const handleCmsSync = () => {
      setVideoAttachmentsState(getStoredAttachments());
      setUnifiedMcqsState(getStoredUnifiedMcqs());
      setVideos(getStoredVideos());
    };

    window.addEventListener('moeys-lessons-updated', handleLessonUpdate);
    window.addEventListener(CMS_SYNC_EVENT, handleCmsSync);
    return () => {
      window.removeEventListener('moeys-lessons-updated', handleLessonUpdate);
      window.removeEventListener(CMS_SYNC_EVENT, handleCmsSync);
    };
  }, [staffSession]);

  const cleanStaffRole = (currentStaff?.role || '').toString().trim().toLowerCase();
  const isSuperAdmin = cleanStaffRole === 'super_admin' || cleanStaffRole === 'admin';

  const currentStaffSubject =
    currentStaff?.subjectAssigned && currentStaff.subjectAssigned in SUBJECTS
      ? SUBJECTS[currentStaff.subjectAssigned as SubjectId]
      : null;

  const currentSubject =
    manageSubject && manageSubject in SUBJECTS
      ? SUBJECTS[manageSubject]
      : null;

  // Available lessons for Publish tab
  const availablePublishLessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(formSubject, formGrade);
  }, [formSubject, formGrade, lessonRefreshKey]);

  // Available lessons for Manage & Edit Content tab
  const availableManageLessons = useMemo(() => {
    return getLessonsBySubjectAndGrade(manageSubject, manageGrade);
  }, [manageSubject, manageGrade, lessonRefreshKey]);

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
    const subjMeta = formSubject && formSubject in SUBJECTS ? SUBJECTS[formSubject] : null;
    const subjNameKm = subjMeta?.nameKm || formSubject || 'មុខវិជ្ជា';
    const subjNameEn = subjMeta?.nameEn || formSubject || 'Subject';
    recordActivityNotification({
      actionType: 'video_upload',
      subject: formSubject,
      grade: formGrade,
      lessonId: formLessonId,
      actorName: staffName,
      actorRole: currentStaff?.role || 'subject_lead',
      titleKm: `បានអាប់ឡូតវីដេអូមុខវិជ្ជា${subjNameKm}ថ្មី (ថ្នាក់ទី ${formGrade})`,
      titleEn: `New ${subjNameEn} Video uploaded (Grade ${formGrade})`,
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
    const subjMeta = updated.subject && updated.subject in SUBJECTS ? SUBJECTS[updated.subject] : null;
    const subjNameKm = subjMeta?.nameKm || updated.subject || 'មុខវិជ្ជា';
    const subjNameEn = subjMeta?.nameEn || updated.subject || 'Subject';
    recordActivityNotification({
      actionType: 'mcq_edit',
      subject: updated.subject,
      grade: updated.grade,
      lessonId: updated.lessonId,
      actorName: staffName,
      actorRole: currentStaff?.role || 'subject_lead',
      titleKm: `បានកែសម្រួលលំហាត់ស្តង់ដារ MoEYS សំណួរទី #${updated.questionNumber} (${subjNameKm})`,
      titleEn: `Updated standard MoEYS MCQ Question #${updated.questionNumber} (${subjNameEn})`,
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

  // Filtered resources for the "Manage & Edit Content" Tab (sorted by playlist orderIndex)
  const filteredLessonVideos = useMemo(() => {
    return videos
      .filter((v) => v.lessonId === manageLessonId)
      .sort((a, b) => (a.orderIndex || 1) - (b.orderIndex || 1));
  }, [videos, manageLessonId]);

  // Current selected lesson item for Manage Content tab
  const currentManageLesson = useMemo(() => {
    return (
      availableManageLessons.find((l) => l.id === manageLessonId) ||
      availableManageLessons[0] || {
        id: manageLessonId,
        subject: manageSubject,
        grade: manageGrade,
        orderIndex: 1,
        titleKm: 'មេរៀន MoEYS',
        titleEn: 'MoEYS Lesson',
        descriptionKm: '',
        descriptionEn: '',
      }
    );
  }, [availableManageLessons, manageLessonId, manageSubject, manageGrade]);

  // Reorder videos in playlist
  const handleMoveVideo = (videoId: string, direction: 'up' | 'down') => {
    const list = [...filteredLessonVideos];
    const index = list.findIndex((v) => v.id === videoId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    } else {
      return;
    }

    reorderLessonVideos(manageLessonId, list.map((v) => v.id));
    setVideos(getStoredVideos());
    setNotification({
      message: isKhmer ? '🔄 បានរៀបចំលំដាប់បញ្ជីចាក់វីដេអូជោគជ័យ!' : '🔄 Playlist reordered successfully!',
      type: 'success',
    });
  };

  // Quick Add Lesson Callback
  const handleQuickLessonCreated = (newLesson: LessonItem) => {
    setLessonRefreshKey((prev) => prev + 1);
    if (quickAddTarget === 'manage') {
      setManageLessonId(newLesson.id);
    } else {
      setFormLessonId(newLesson.id);
    }
    setNotification({
      message: isKhmer
        ? `✅ បានបញ្ចូលមេរៀនថ្មី «${newLesson.titleKm}» និងបានជ្រើសរើសដោយស្វ័យប្រវត្តិ!`
        : `✅ Created lesson "${newLesson.titleEn}" and selected automatically!`,
      type: 'success',
    });
  };

  // Standard 10 MCQs for the selected lesson in "Manage & Edit Content"
  const lessonCurriculumMcqs = useMemo(() => {
    if (!manageLessonId) return [];
    return getCurriculumMcqsForLesson(manageLessonId);
  }, [manageLessonId, notification]);

  // Count of teacher-customized MCQs in this lesson
  const customizedCount = useMemo(() => {
    return lessonCurriculumMcqs.filter((q) => isCurriculumMcqCustomized(q.lessonId, q.questionNumber)).length;
  }, [lessonCurriculumMcqs]);

  // Toggle Expand Video Drawer in Section 1
  const toggleVideoExpanded = (videoId: string) => {
    setExpandedVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  // Add PDF Attachment to Video
  const handleAddAttachment = async (videoId: string) => {
    const input = newAttachmentInputs[videoId];
    if (!input || !input.title?.trim() || !input.url?.trim()) {
      setNotification({
        message: isKhmer ? 'សូមបញ្ចូលចំណងជើងឯកសារ និងតំណភ្ជាប់ PDF' : 'Please provide document title and PDF URL',
        type: 'error',
      });
      return;
    }

    await addVideoAttachmentRecord({
      video_id: videoId,
      title: input.title.trim(),
      file_url: input.url.trim(),
    });

    setNewAttachmentInputs((prev) => ({
      ...prev,
      [videoId]: { title: '', url: '' },
    }));

    setVideoAttachmentsState(getStoredAttachments());
    setNotification({
      message: isKhmer ? '✅ បានភ្ជាប់ឯកសារ PDF ថ្មីជោគជ័យ!' : '✅ PDF document attached successfully!',
      type: 'success',
    });
  };

  // Delete PDF Attachment
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (confirm(isKhmer ? 'តើអ្នកប្រាកដជាចង់លុបឯកសារភ្ជាប់នេះ?' : 'Are you sure you want to delete this attachment?')) {
      await deleteVideoAttachmentRecord(attachmentId);
      setVideoAttachmentsState(getStoredAttachments());
      setNotification({
        message: isKhmer ? '🗑️ បានលុបឯកសារភ្ជាប់ជោគជ័យ' : '🗑️ Attachment deleted',
        type: 'success',
      });
    }
  };

  // Open Add MCQ Modal for specific video (Video Comprehension Quiz)
  const handleOpenAddMcqForVideo = (videoId: string) => {
    setSelectedTargetVideoIdForMcq(videoId);
    setAddMcqOpen(true);
  };

  // Delete Unified MCQ (from video or main list)
  const handleDeleteUnifiedMcq = async (mcqId: string) => {
    if (confirm(isKhmer ? 'តើអ្នកពិតជាចង់លុបសំណួរនេះ?' : 'Are you sure you want to delete this question?')) {
      await deleteUnifiedMcqRecord(mcqId);
      setUnifiedMcqsState(getStoredUnifiedMcqs());
      setNotification({
        message: isKhmer ? '🗑️ បានលុបសំណួរជោគជ័យ (សមកាលកម្មរួចរាល់)' : '🗑️ Question deleted and synchronized',
        type: 'success',
      });
    }
  };

  // All unified MCQs for this lesson (Cross-Section blending)
  const allUnifiedLessonMcqs = useMemo(() => {
    const list: Array<{
      id: string;
      videoId?: string | null;
      questionNumber: number;
      difficulty: 'basic' | 'medium' | 'advanced';
      questionKm: string;
      questionEn: string;
      optionsKm: [string, string, string, string, string];
      optionsEn: [string, string, string, string, string];
      correctAnswer: McqChoice;
      hintKm?: string;
      hintEn?: string;
      explanationKm?: string;
      explanationEn?: string;
      questionImageUrl?: string | null;
      isCustom?: boolean;
      isUnifiedStore?: boolean;
    }> = [];

    // 1. Add unified MCQs from cms store
    const cmsMcqs = unifiedMcqsState.filter((m) => m.lesson_id === manageLessonId);
    cmsMcqs.forEach((m, idx) => {
      const opts = (Array.isArray(m.options) ? m.options : ['', '', '', '', '']) as [string, string, string, string, string];
      list.push({
        id: m.id,
        videoId: m.video_id,
        questionNumber: idx + 1,
        difficulty: m.difficulty || 'medium',
        questionKm: m.question_km,
        questionEn: m.question_en,
        optionsKm: opts,
        optionsEn: opts,
        correctAnswer: (m.correct_answer || 'A') as McqChoice,
        hintKm: m.hint_km,
        hintEn: m.hint_en,
        explanationKm: m.explanation_km || m.explanation,
        explanationEn: m.explanation_en || m.explanation,
        questionImageUrl: m.question_image_url || null,
        isCustom: true,
        isUnifiedStore: true,
      });
    });

    // 2. If list has no general lesson MCQs, blend base curriculum MCQs
    if (list.filter((q) => !q.videoId).length === 0) {
      lessonCurriculumMcqs.forEach((q) => {
        list.push({
          id: q.id,
          videoId: null,
          questionNumber: q.questionNumber,
          difficulty: q.difficulty,
          questionKm: q.questionKm,
          questionEn: q.questionEn,
          optionsKm: q.optionsKm,
          optionsEn: q.optionsEn,
          correctAnswer: q.correctAnswer,
          hintKm: q.hintKm,
          hintEn: q.hintEn,
          explanationKm: q.explanationKm,
          explanationEn: q.explanationEn,
          questionImageUrl: q.questionImageUrl || null,
          isCustom: isCurriculumMcqCustomized(q.lessonId, q.questionNumber),
          isUnifiedStore: false,
        });
      });
    }

    return list;
  }, [unifiedMcqsState, manageLessonId, lessonCurriculumMcqs]);

  // Filter display by tab: all | lesson_only | video_only
  const displayMcqs = useMemo(() => {
    if (mcqFilterTab === 'lesson_only') {
      return allUnifiedLessonMcqs.filter((q) => !q.videoId);
    }
    if (mcqFilterTab === 'video_only') {
      return allUnifiedLessonMcqs.filter((q) => !!q.videoId);
    }
    return allUnifiedLessonMcqs;
  }, [allUnifiedLessonMcqs, mcqFilterTab]);

  if (isLoading || !currentStaff) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់គណនី...' : 'Verifying session...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isKhmer ? 'សូមរង់ចាំបន្តិច' : 'Please wait a moment'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                  {isSuperAdmin
                    ? 'Super Admin'
                    : `${currentStaffSubject?.nameEn || currentStaff.subjectAssigned || 'Staff'} Lead`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentStaff.email} •{' '}
                {isSuperAdmin
                  ? isKhmer
                    ? 'គ្រប់គ្រងគ្រប់មុខវិជ្ជា និងគណនីទាំងអស់'
                    : 'Universal Access: All Subjects & Accounts'
                  : isKhmer
                  ? `ចាត់តាំងលើមុខវិជ្ជា៖ ${currentStaffSubject?.nameKm || currentSubject?.nameKm || 'មិនបានចាត់តាំង / Unassigned'}`
                  : `Assigned Subject: ${currentStaffSubject?.nameEn || currentSubject?.nameEn || 'Unassigned'}`}
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
                  <span>
                    {isKhmer
                      ? `ចាក់សោលើមុខវិជ្ជា៖ ${currentStaffSubject?.nameKm || currentStaff.subjectAssigned || 'ទូទៅ'}`
                      : `Locked to ${currentStaffSubject?.nameEn || currentStaff.subjectAssigned || 'Assigned'} Lead`}
                  </span>
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
                      {isKhmer ? SUBJECTS[s]?.nameKm || s : SUBJECTS[s]?.nameEn || s}
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

              {/* MoEYS Lesson with Inline Quick-Add Plus Button (+) */}
              <div className="md:col-span-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('selectLesson')} ({availableManageLessons.length})
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {isKhmer ? 'ចុច (+) បន្ថែមមេរៀនរហ័ស' : 'Click (+) to Quick Add'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={manageLessonId}
                    onChange={(e) => setManageLessonId(e.target.value)}
                    className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold truncate focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {availableManageLessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                      </option>
                    ))}
                  </select>

                  {/* Inline Quick-Add Lesson Plus Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAddTarget('manage');
                      setQuickAddLessonOpen(true);
                    }}
                    className="h-10 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 flex-shrink-0 cursor-pointer"
                    title={isKhmer ? '➕ បន្ថែមមេរៀនថ្មីដោយរហ័ស (+)' : '➕ Quick-Add New Lesson (+)'}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{isKhmer ? 'មេរៀនថ្មី' : 'New Lesson'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* SECTION 1: YOUTUBE-STYLE PLAYLIST & MULTI-VIDEO MANAGEMENT  */}
          {/* ========================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ListMusic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isKhmer ? '🎬 បញ្ជីចាក់វីដេអូមេរៀន (YouTube Playlist)' : '🎬 Lesson Video Playlist'}</span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {filteredLessonVideos.length} {isKhmer ? 'វីដេអូ' : 'Videos'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isKhmer
                      ? 'គ្រប់គ្រងវីដេអូច្រើនក្នុងមេរៀនតែមួយ រៀបចំលំដាប់ចាក់ (Reorder) និងកែសម្រួលព័ត៌មាន'
                      : 'Manage multiple playlist videos per lesson, drag/reorder playback order, and edit resources.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Add Video to Playlist & Publish Tab */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAddPlaylistVideoOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isKhmer ? '+ បន្ថែមវីដេអូទៅក្នុងបញ្ជីចាក់' : '+ Add Video to Playlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormSubject(manageSubject);
                    setFormGrade(manageGrade);
                    setFormLessonId(manageLessonId);
                    setActiveTab('publish');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isKhmer ? 'ទម្រង់ផ្សាយពេញលេញ' : 'Full Publish Form'}</span>
                </button>
              </div>
            </div>

            {filteredLessonVideos.length > 0 ? (
              <div className="space-y-3">
                {filteredLessonVideos.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-2xs"
                  >
                    {/* Top Row: Video Reorder, Info, and Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                      {/* Reorder Buttons & Order Index */}
                      <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleMoveVideo(item.id, 'up')}
                          disabled={idx === 0}
                          title={isKhmer ? 'រំកិលឡើងលើ' : 'Move Up'}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          #{item.orderIndex || idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveVideo(item.id, 'down')}
                          disabled={idx === filteredLessonVideos.length - 1}
                          title={isKhmer ? 'រំកិលចុះក្រោម' : 'Move Down'}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Video Info */}
                      <div className="truncate flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {item.grade}th Grade
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.videoMcqs?.length || 0} {isKhmer ? 'សំណួរ MCQ' : 'MCQs'}
                          </span>
                          {item.pdfUrl && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                              PDF Handout
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

                    {/* Action Buttons: Watch, Edit, Delete */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={isKhmer ? 'ទស្សនានៅលើ YouTube' : 'Watch on YouTube'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setEditingVideo(item)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{t('edit')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(item.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('delete')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Accordion: Attached Materials & Video MCQs Sub-form */}
                  <div className="w-full mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => toggleVideoExpanded(item.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{isKhmer ? 'ឯកសារភ្ជាប់ & សំណួរវីដេអូ' : 'Attached Materials & Video MCQs'}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {videoAttachmentsState.filter((a) => a.video_id === item.id).length} {isKhmer ? 'PDF' : 'PDFs'} •{' '}
                          {unifiedMcqsState.filter((m) => m.video_id === item.id).length} {isKhmer ? 'MCQ' : 'MCQs'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <span>{expandedVideoIds.includes(item.id) ? (isKhmer ? 'បិទ' : 'Collapse') : (isKhmer ? 'ពន្លាត' : 'Expand')}</span>
                        {expandedVideoIds.includes(item.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Content Drawer */}
                    {expandedVideoIds.includes(item.id) && (
                      <div className="mt-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in-50 duration-200">
                        {/* 1. PDF Documents & Handouts Sub-Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-rose-500" />
                              <span>{isKhmer ? 'ឯកសារជំនួយជា PDF / ស្លាយបង្រៀន (PDF Materials)' : 'Attached PDF Documents & Lecture Notes'}</span>
                            </h5>
                            <span className="text-[11px] text-slate-500">
                              {videoAttachmentsState.filter((a) => a.video_id === item.id).length} {isKhmer ? 'ឯកសារភ្ជាប់' : 'Attached'}
                            </span>
                          </div>

                          {/* Existing Attachments List */}
                          {videoAttachmentsState.filter((a) => a.video_id === item.id).length > 0 ? (
                            <div className="space-y-2 mb-3">
                              {videoAttachmentsState
                                .filter((a) => a.video_id === item.id)
                                .map((att) => (
                                  <div
                                    key={att.id}
                                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                        PDF
                                      </span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {att.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <a
                                        href={att.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                                      >
                                        <span>{isKhmer ? 'បើកមើល' : 'View'}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteAttachment(att.id)}
                                        className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                                        title={isKhmer ? 'លុបឯកសារ' : 'Delete attachment'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic mb-3">
                              {isKhmer ? 'មិនទាន់មានឯកសារ PDF ភ្ជាប់សម្រាប់វីដេអូនេះនៅឡើយទេ។' : 'No PDF documents attached to this video yet.'}
                            </p>
                          )}

                          {/* Inline Add Attachment Sub-form */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder={isKhmer ? 'ចំណងជើងឯកសារ (ឧ. ស្លាយមេរៀន)' : 'Document title (e.g. Lecture Handout)'}
                              value={newAttachmentInputs[item.id]?.title || ''}
                              onChange={(e) =>
                                setNewAttachmentInputs((prev) => ({
                                  ...prev,
                                  [item.id]: { ...(prev[item.id] || { url: '' }), title: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                            />
                            <input
                              type="url"
                              placeholder={isKhmer ? 'តំណភ្ជាប់ PDF / Google Drive' : 'PDF or Google Drive URL'}
                              value={newAttachmentInputs[item.id]?.url || ''}
                              onChange={(e) =>
                                setNewAttachmentInputs((prev) => ({
                                  ...prev,
                                  [item.id]: { ...(prev[item.id] || { title: '' }), url: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddAttachment(item.id)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isKhmer ? 'ភ្ជាប់ PDF' : 'Attach PDF'}</span>
                            </button>
                          </div>
                        </div>

                        {/* 2. Video Comprehension Quizzes Sub-Section */}
                        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <CheckSquare className="w-4 h-4 text-indigo-500" />
                              <span>{isKhmer ? 'សំណួរស្វែងយល់តាមវីដេអូ (Video Comprehension Quizzes)' : 'Video Comprehension Quizzes'}</span>
                            </h5>
                            <button
                              type="button"
                              onClick={() => handleOpenAddMcqForVideo(item.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isKhmer ? '+ បន្ថែមសំណួរសម្រាប់វីដេអូនេះ' : '+ Add Question for this Video'}</span>
                            </button>
                          </div>

                          {/* List of Video-attached MCQs */}
                          {unifiedMcqsState.filter((m) => m.video_id === item.id).length > 0 ? (
                            <div className="space-y-2">
                              {unifiedMcqsState
                                .filter((m) => m.video_id === item.id)
                                .map((q, qIdx) => (
                                  <div
                                    key={q.id}
                                    className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs flex items-start justify-between gap-2"
                                  >
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                                          {qIdx + 1}
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                                          {isKhmer ? q.question_km : q.question_en}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                                          {isKhmer ? `ចម្លើយ: ${q.correct_answer}` : `Key: ${q.correct_answer}`}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteUnifiedMcq(q.id)}
                                      className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex-shrink-0 cursor-pointer"
                                      title={isKhmer ? 'លុបសំណួរ' : 'Delete question'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">
                              {isKhmer
                                ? 'មិនទាន់មានសំណួរស្វែងយល់សម្រាប់វីដេអូនេះនៅឡើយទេ។ ចុចប៊ូតុង «+ បន្ថែមសំណួរសម្រាប់វីដេអូនេះ» ដើម្បីបង្កើតសំណួរ។'
                                : 'No comprehension questions attached to this video yet. Click "+ Add Question for this Video" to create one.'}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Video className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                  {t('noResourcesForLesson')}
                </p>
                <button
                  type="button"
                  onClick={() => setAddPlaylistVideoOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isKhmer ? 'បន្ថែមវីដេអូដំបូងក្នុងមេរៀននេះ' : 'Add First Video for this Lesson'}</span>
                </button>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* SECTION 2: UNIFIED & SYNCHRONIZED MCQs (LESSON & VIDEOS)   */}
          {/* ========================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isKhmer ? '📝 កម្រងសំណួរលំហាត់ និងតេស្តស្វែងយល់តាមវីដេអូ (Unified MCQs)' : '📝 Unified Curriculum & Video Quizzes'}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isKhmer
                      ? 'សមកាលកម្មស្វ័យប្រវត្តិនូវសំណួរលំហាត់ទូទៅ និងសំណួរវីដេអូក្នុងបញ្ជីចាក់ (Cross-Section Auto Sync)'
                      : 'Automatically synchronized lesson practice exercises and video playlist quizzes.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {/* + Add New MCQ Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetVideoIdForMcq(null);
                    setAddMcqOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isKhmer ? '+ បន្ថែមសំណួរថ្មី' : '+ Add New MCQ'}</span>
                </button>

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
                  {isKhmer ? `សរុប ${allUnifiedLessonMcqs.length} សំណួរ` : `${allUnifiedLessonMcqs.length} Questions Total`}
                </span>
              </div>
            </div>

            {/* Filter Tabs: All | Lesson Only | Video Only */}
            <div className="flex items-center gap-2 mb-5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setMcqFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mcqFilterTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKhmer ? `ទាំងអស់ (${allUnifiedLessonMcqs.length})` : `All (${allUnifiedLessonMcqs.length})`}
              </button>
              <button
                type="button"
                onClick={() => setMcqFilterTab('lesson_only')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mcqFilterTab === 'lesson_only'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKhmer
                  ? `លំហាត់មេរៀនទូទៅ (${allUnifiedLessonMcqs.filter((q) => !q.videoId).length})`
                  : `General Lesson (${allUnifiedLessonMcqs.filter((q) => !q.videoId).length})`}
              </button>
              <button
                type="button"
                onClick={() => setMcqFilterTab('video_only')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mcqFilterTab === 'video_only'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKhmer
                  ? `សំណួរពីវីដេអូ (${allUnifiedLessonMcqs.filter((q) => !!q.videoId).length})`
                  : `From Videos (${allUnifiedLessonMcqs.filter((q) => !!q.videoId).length})`}
              </button>
            </div>

            {/* List of Unified Questions */}
            {displayMcqs.length > 0 ? (
              <div className="space-y-4">
                {displayMcqs.map((q, idx) => {
                  const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];
                  const diffBadge = {
                    basic: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
                    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
                    advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200',
                  }[q.difficulty];

                  const parentVideo = q.videoId ? filteredLessonVideos.find((v) => v.id === q.videoId) : null;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            #{q.questionNumber || idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${diffBadge}`}>
                            {t(q.difficulty)}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Correct: {q.correctAnswer}
                          </span>

                          {/* Cross-Section Source Badge */}
                          {parentVideo ? (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                              <Video className="w-3 h-3 text-indigo-600" />
                              <span className="truncate max-w-[200px]">
                                {isKhmer ? 'វីដេអូ: ' : 'Video: '}
                                {isKhmer ? parentVideo.titleKm : parentVideo.titleEn}
                              </span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-slate-500" />
                              <span>{isKhmer ? 'លំហាត់មេរៀនទូទៅ' : 'General Lesson Practice'}</span>
                            </span>
                          )}
                        </div>

                        {/* Question Text with KaTeX Preview */}
                        <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed mb-2">
                          <LatexRenderer content={isKhmer ? q.questionKm : q.questionEn} />
                        </div>

                        {/* Optional Question Image / Diagram Preview */}
                        {q.questionImageUrl && (
                          <div className="mb-3 max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 flex items-center justify-center">
                            <img
                              src={q.questionImageUrl}
                              alt="MCQ Diagram"
                              className="max-h-32 w-auto object-contain rounded-lg"
                            />
                          </div>
                        )}

                        {/* 5 Options Mini Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          {choices.map((c, optIdx) => (
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
                                {isKhmer ? q.optionsKm[optIdx] : q.optionsEn[optIdx]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons: Edit, Delete */}
                      <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-start mt-1">
                        <button
                          onClick={() => {
                            setEditingMcq({
                              id: q.id,
                              lessonId: manageLessonId,
                              subject: manageSubject,
                              grade: manageGrade,
                              questionNumber: q.questionNumber || idx + 1,
                              difficulty: q.difficulty,
                              questionKm: q.questionKm,
                              questionEn: q.questionEn,
                              optionsKm: q.optionsKm,
                              optionsEn: q.optionsEn,
                              correctAnswer: q.correctAnswer,
                              hintKm: q.hintKm || '',
                              hintEn: q.hintEn || '',
                              explanationKm: q.explanationKm || '',
                              explanationEn: q.explanationEn || '',
                              questionImageUrl: q.questionImageUrl || '',
                            });
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{t('edit')}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (q.isUnifiedStore) {
                              handleDeleteUnifiedMcq(q.id);
                            } else {
                              handleDeleteCurriculumMcq(manageLessonId, q.questionNumber);
                            }
                          }}
                          className="p-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                          title={isKhmer ? 'លុបសំណួរ' : 'Delete question'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <FileQuestion className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                  {isKhmer ? 'មិនមានសំណួរក្នុងប្រភេទនេះទេ' : 'No questions found in this category'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTargetVideoIdForMcq(null);
                    setAddMcqOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isKhmer ? 'បន្ថែមសំណួរថ្មី' : 'Add New Question'}</span>
                </button>
              </div>
            )}
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
                        <Lock className="w-3 h-3" /> Locked to {currentStaffSubject?.nameEn || currentStaff.subjectAssigned || 'Lead'}
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
                        {isKhmer ? SUBJECTS[s]?.nameKm || s : SUBJECTS[s]?.nameEn || s}
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

              {/* MoEYS Lesson Selector with Quick-Add Plus Button (+) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isKhmer ? 'ជ្រើសរើសមេរៀនតាមកម្មវិធីសិក្សា MoEYS' : 'Select Lesson from MoEYS Curriculum Tree'}
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {isKhmer ? 'ចុច (+) បន្ថែមមេរៀនរហ័ស' : 'Click (+) to Quick Add'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formLessonId}
                    onChange={(e) => handleLessonSelect(e.target.value)}
                    className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm"
                  >
                    {availablePublishLessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.orderIndex}. {isKhmer ? l.titleKm : l.titleEn}
                      </option>
                    ))}
                  </select>

                  {/* Inline Quick-Add Lesson Plus Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAddTarget('publish');
                      setQuickAddLessonOpen(true);
                    }}
                    className="h-10 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 flex-shrink-0 cursor-pointer"
                    title={isKhmer ? '➕ បន្ថែមមេរៀនថ្មីដោយរហ័ស (+)' : '➕ Quick-Add New Lesson (+)'}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{isKhmer ? 'មេរៀនថ្មី' : 'New Lesson'}</span>
                  </button>
                </div>
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
                            <span>{isKhmer ? `សំណួរទី ${qIndex + 1}` : `Question #${qIndex + 1}`}</span>
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
                .filter((v) => (isSuperAdmin ? true : (currentStaff?.subjectAssigned ? v.subject === currentStaff.subjectAssigned : true)))
                .map((video) => {
                  const subjectMeta = video.subject && video.subject in SUBJECTS ? SUBJECTS[video.subject] : null;
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
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${subjectMeta?.badgeBg || 'bg-slate-100 border-slate-200'} ${subjectMeta?.badgeText || 'text-slate-700'}`}
                            >
                              {isKhmer ? subjectMeta?.nameKm || video.subject : subjectMeta?.nameEn || video.subject}
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

              <Link
                href="/admin/team-management"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{isKhmer ? 'គ្រប់គ្រងក្រុមការងារ & គណនីពេញលេញ →' : 'Team & Account Module →'}</span>
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffList.map((st) => {
                const cleanStRole = (st.role || '').toString().trim().toLowerCase();
                const isSuper = cleanStRole === 'super_admin' || cleanStRole === 'admin';
                const subjectMeta = st.subjectAssigned && st.subjectAssigned in SUBJECTS ? SUBJECTS[st.subjectAssigned as SubjectId] : null;

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
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isSuper
                          ? 'Super Admin'
                          : `${subjectMeta ? (isKhmer ? subjectMeta.nameKm : subjectMeta.nameEn) : (st.subjectAssigned || 'Staff')} Lead`}
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

      {/* Quick Add Lesson Modal (Triggered by + button) */}
      <QuickAddLessonModal
        isOpen={quickAddLessonOpen}
        onClose={() => setQuickAddLessonOpen(false)}
        subject={quickAddTarget === 'manage' ? manageSubject : formSubject}
        grade={quickAddTarget === 'manage' ? manageGrade : formGrade}
        onLessonCreated={handleQuickLessonCreated}
      />

      {/* Add Video to Playlist Modal */}
      <AddPlaylistVideoModal
        isOpen={addPlaylistVideoOpen}
        onClose={() => setAddPlaylistVideoOpen(false)}
        lesson={currentManageLesson}
        existingVideoCount={filteredLessonVideos.length}
        onVideoAdded={(newVid) => {
          setVideos(getStoredVideos());
          setNotification({
            message: isKhmer
              ? `✅ បានបញ្ចូលវីដេអូ «${newVid.titleKm}» ទៅក្នុងបញ្ជីចាក់ជោគជ័យ!`
              : `✅ Added video "${newVid.titleEn}" to playlist successfully!`,
            type: 'success',
          });
        }}
      />

      {/* Add New MCQ Modal */}
      <AddCurriculumMcqModal
        isOpen={addMcqOpen}
        onClose={() => {
          setAddMcqOpen(false);
          setSelectedTargetVideoIdForMcq(null);
        }}
        lessonId={manageLessonId}
        subject={manageSubject}
        grade={manageGrade}
        targetVideoId={selectedTargetVideoIdForMcq}
        availableVideos={filteredLessonVideos}
        onSaved={(created) => {
          setNotification({
            message: isKhmer
              ? `✅ បានបញ្ចូលសំណួរថ្មី #${created.questionNumber} ជោគជ័យ (សមកាលកម្មរួចរាល់)!`
              : `✅ Added question #${created.questionNumber} successfully and synchronized!`,
            type: 'success',
          });
        }}
      />
    </div>
  );
}
