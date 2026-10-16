'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  FileText,
  Plus,
  Save,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { VideoResourceItem, addVideoResource, VideoMcqItem } from '@/lib/data-store';
import { parseYouTubeUrl, parsePdfUrl } from '@/lib/storage-utils';
import { SubjectId, GradeLevel, SUBJECTS, LessonItem } from '@/lib/curriculum-data';
import { recordActivityNotification } from '@/lib/notifications-store';
import { useLanguage } from '@/context/language-context';

interface AddPlaylistVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonItem;
  existingVideoCount: number;
  onVideoAdded: (newVideo: VideoResourceItem) => void;
}

export const AddPlaylistVideoModal: React.FC<AddPlaylistVideoModalProps> = ({
  isOpen,
  onClose,
  lesson,
  existingVideoCount,
  onVideoAdded,
}) => {
  const { isKhmer } = useLanguage();

  const [titleKm, setTitleKm] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descKm, setDescKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(existingVideoCount + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOrderIndex(existingVideoCount + 1);
      setTitleKm(`${lesson.titleKm} (វីដេអូបន្ថែម #${existingVideoCount + 1})`);
      setTitleEn(`${lesson.titleEn} (Part #${existingVideoCount + 1})`);
      setDescKm(lesson.descriptionKm || '');
      setDescEn(lesson.descriptionEn || '');
      setYoutubeUrl('');
      setPdfUrl('');
      setError(null);
    }
  }, [isOpen, lesson, existingVideoCount]);

  if (!isOpen) return null;

  const subjectMeta = SUBJECTS[lesson.subject];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeUrl.trim()) {
      setError(isKhmer ? 'សូមបញ្ចូលតំណភ្ជាប់វីដេអូ YouTube' : 'Please provide a valid YouTube URL');
      return;
    }

    const parsedVideo = parseYouTubeUrl(youtubeUrl);
    if (!parsedVideo.isValid) {
      setError(isKhmer ? 'តំណភ្ជាប់ YouTube មិនត្រឹមត្រូវទេ' : 'Invalid YouTube URL provided');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newVideo = addVideoResource({
        lessonId: lesson.id,
        subject: lesson.subject,
        grade: lesson.grade,
        titleKm: titleKm.trim() || `${lesson.titleKm} (វីដេអូ #${orderIndex})`,
        titleEn: titleEn.trim() || `${lesson.titleEn} (Video #${orderIndex})`,
        descriptionKm: descKm.trim() || lesson.descriptionKm,
        descriptionEn: descEn.trim() || lesson.descriptionEn,
        youtubeUrl: youtubeUrl.trim(),
        youtubeVideoId: parsedVideo.videoId || '5PcpBw5Hbwo',
        pdfUrl: pdfUrl.trim() || undefined,
        pdfSourceType: parsePdfUrl(pdfUrl).sourceType === 'gdrive' ? 'gdrive' : 'external',
        orderIndex: Number(orderIndex) || 1,
        videoMcqs: [
          {
            id: `vmcq-${Date.now()}-1`,
            questionNumber: 1,
            questionKm: `យោងតាមវីដេអូ «${titleKm || lesson.titleKm}» តើចំណុចណាជាគោលគំនិតចម្បង?`,
            questionEn: `According to the lecture "${titleEn || lesson.titleEn}", what is the primary concept?`,
            optionsKm: [
              'ការចងចាំរូបមន្តដោយគ្មានការយល់ដឹង',
              'ការស្វែងយល់ទ្រឹស្តី និងអនុវត្តលំហាត់ជាក់ស្តែង',
              'ការរំលងជំហានដោះស្រាយ',
              'ការទន្ទេញចម្លើយ',
              'ការមិនអនុវត្តលំហាត់',
            ],
            optionsEn: [
              'Blind memorization of formulas',
              'Understanding principles and step-by-step application',
              'Skipping steps during derivation',
              'Rote memorization of final numbers',
              'Avoiding practice questions',
            ],
            correctAnswer: 'B',
            hintKm: 'ការយល់ដឹងពីទ្រឹស្តី និងការអនុវត្តជាក់ស្តែង នាំឱ្យទទួលបានជោគជ័យ។',
            hintEn: 'Understanding fundamentals and active practice are key.',
            explanationKm: 'ការយល់ដឹងពីទ្រឹស្តី និងការអនុវត្តដោះស្រាយលំហាត់ជាក់ស្តែង គឺជាមូលដ្ឋានគ្រឹះដ៏រឹងមាំបំផុត។ ចម្លើយត្រឹមត្រូវគឺ B។',
            explanationEn: 'Mastering principles combined with rigorous problem-solving yields top mastery. Choice B is correct.',
          },
        ],
      });

      // Record activity notification
      recordActivityNotification({
        actionType: 'video_edit',
        subject: lesson.subject,
        grade: lesson.grade,
        lessonId: lesson.id,
        actorName: isKhmer ? 'គ្រូបង្រៀន' : 'Teacher',
        actorRole: 'subject_lead',
        titleKm: `បានបន្ថែមវីដេអូថ្មីក្នុងបញ្ជីចាក់ «${newVideo.titleKm}»`,
        titleEn: `Added new video to playlist "${newVideo.titleEn}"`,
        messageKm: `បានបញ្ចូលវីដេអូទី #${newVideo.orderIndex} ក្នុងមេរៀន «${lesson.titleKm}»`,
        messageEn: `Appended Video #${newVideo.orderIndex} to lesson playlist`,
      });

      onVideoAdded(newVideo);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add video';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>{isKhmer ? '🎬 បន្ថែមវីដេអូទៅក្នុងបញ្ជីចាក់' : '🎬 Add Video to Lesson Playlist'}</span>
              </h2>
              <p className="text-xs text-blue-100">
                {isKhmer ? `មេរៀន៖ ${lesson.titleKm}` : `Lesson: ${lesson.titleEn}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Context pill */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${subjectMeta.badgeBg} ${subjectMeta.badgeText}`}>
              {isKhmer ? subjectMeta.nameKm : subjectMeta.nameEn} • G{lesson.grade}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isKhmer ? `វីដេអូទី #${orderIndex} ក្នុងបញ្ជីចាក់` : `Playlist Item #${orderIndex}`}
            </span>
          </div>

          {/* Order Index */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'លេខរៀងវីដេអូក្នុងបញ្ជីចាក់ (Playlist Order #)' : 'Playlist Order Number'} *
            </label>
            <input
              type="number"
              min={1}
              required
              value={orderIndex}
              onChange={(e) => setOrderIndex(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'តំណភ្ជាប់ YouTube (YouTube Video URL)' : 'YouTube Video URL'} *
            </label>
            <input
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Google Drive PDF URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'តំណភ្ជាប់ឯកសារ PDF (Google Drive / Direct PDF URL)' : 'Google Drive / PDF URL (Optional)'}
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/.../view"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Title Khmer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'ចំណងជើងវីដេអូជាភាសាខ្មែរ (Khmer Video Title)' : 'Video Title (Khmer)'}
            </label>
            <input
              type="text"
              value={titleKm}
              onChange={(e) => setTitleKm(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Title English */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKhmer ? 'ចំណងជើងវីដេអូជាភាសាអង់គ្លេស (English Video Title)' : 'Video Title (English)'}
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isKhmer ? 'កំពុងបញ្ចូល...' : 'Adding...'}</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isKhmer ? 'បន្ថែមវីដេអូទៅក្នុងបញ្ជីចាក់' : 'Add Video to Playlist'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
