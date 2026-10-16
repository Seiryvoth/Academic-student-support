'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Video,
  FileText,
  PlusCircle,
  Trash2,
  BookOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { VideoResourceItem, VideoMcqItem, updateVideoResource } from '@/lib/data-store';
import { parseYouTubeUrl, parsePdfUrl } from '@/lib/storage-utils';
import { useLanguage } from '@/context/language-context';
import { LatexRenderer } from './latex-renderer';
import { McqChoice } from '@/lib/curriculum-mcqs-generator';

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoResourceItem | null;
  onSaved: (updated: VideoResourceItem) => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  onClose,
  video,
  onSaved,
}) => {
  const { t, isKhmer } = useLanguage();

  const [titleKm, setTitleKm] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descKm, setDescKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoMcqs, setVideoMcqs] = useState<VideoMcqItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (video) {
      setTitleKm(video.titleKm || '');
      setTitleEn(video.titleEn || '');
      setDescKm(video.descriptionKm || '');
      setDescEn(video.descriptionEn || '');
      setYoutubeUrl(video.youtubeUrl || '');
      setPdfUrl(video.pdfUrl || '');
      setVideoMcqs(
        video.videoMcqs && video.videoMcqs.length > 0
          ? JSON.parse(JSON.stringify(video.videoMcqs))
          : [
              {
                id: `vmcq-${Date.now()}-1`,
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
            ]
      );
      setError(null);
    }
  }, [video]);

  if (!isOpen || !video) return null;

  const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];

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

  const handleRemoveQuestion = (idx: number) => {
    if (videoMcqs.length <= 1) return;
    setVideoMcqs((prev) =>
      prev.filter((_, i) => i !== idx).map((q, i) => ({ ...q, questionNumber: i + 1 }))
    );
  };

  const handleUpdateMcq = (idx: number, updates: Partial<VideoMcqItem>) => {
    setVideoMcqs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...updates };
      return copy;
    });
  };

  const handleUpdateOption = (
    qIdx: number,
    optIdx: number,
    lang: 'km' | 'en',
    val: string
  ) => {
    setVideoMcqs((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIdx] };
      if (lang === 'km') {
        const arr = [...q.optionsKm] as [string, string, string, string, string];
        arr[optIdx] = val;
        q.optionsKm = arr;
      } else {
        const arr = [...q.optionsEn] as [string, string, string, string, string];
        arr[optIdx] = val;
        q.optionsEn = arr;
      }
      copy[qIdx] = q;
      return copy;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!youtubeUrl.trim()) {
      setError(isKhmer ? 'សូមបញ្ចូលតំណភ្ជាប់ YouTube' : 'Please provide a YouTube URL');
      return;
    }

    const parsedVideo = parseYouTubeUrl(youtubeUrl);
    if (!parsedVideo.isValid) {
      setError(isKhmer ? 'តំណភ្ជាប់ YouTube មិនត្រឹមត្រូវទេ' : 'Invalid YouTube URL provided');
      return;
    }

    // Clean MCQs
    const cleanedMcqs = videoMcqs
      .filter((q) => q.questionKm.trim() || q.questionEn.trim())
      .map((q, idx) => ({
        ...q,
        questionNumber: idx + 1,
        questionKm: q.questionKm.trim() || q.questionEn.trim(),
        questionEn: q.questionEn.trim() || q.questionKm.trim(),
      }));

    const updated = updateVideoResource(video.id, {
      titleKm: titleKm.trim(),
      titleEn: titleEn.trim(),
      descriptionKm: descKm.trim(),
      descriptionEn: descEn.trim(),
      youtubeUrl: youtubeUrl.trim(),
      pdfUrl: pdfUrl.trim() || undefined,
      videoMcqs: cleanedMcqs,
    });

    if (updated) {
      onSaved(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('editResource')}
              </h3>
              <p className="text-xs text-slate-500">
                ID: {video.id} • {t('grade')} {video.grade}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('titleKhmer')} *
              </label>
              <input
                type="text"
                required
                value={titleKm}
                onChange={(e) => setTitleKm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('titleEnglish')} *
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t('youtubeUrl')} *
              </label>
              <input
                type="url"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t('gdrivePdfUrl')}
              </label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('descKhmer')} (KaTeX: $...$)
              </label>
              <textarea
                rows={2}
                value={descKm}
                onChange={(e) => setDescKm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('descEnglish')} (KaTeX: $...$)
              </label>
              <textarea
                rows={2}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Video MCQs Editor Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>{isKhmer ? 'កែសម្រួលសំណួរស្ទង់ការយល់ដឹង (Video MCQs)' : 'Edit Video MCQs'}</span>
              </h4>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t('addQuestion')}</span>
              </button>
            </div>

            <div className="space-y-4">
              {videoMcqs.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        {qIdx + 1}
                      </span>
                      <span>{isKhmer ? `សំណួរទី ${qIdx + 1}` : `Question #${qIdx + 1}`}</span>
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">{t('correctAnswer')}:</span>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) =>
                            handleUpdateMcq(qIdx, { correctAnswer: e.target.value as McqChoice })
                          }
                          className="px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-xs"
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
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        value={q.questionKm}
                        onChange={(e) => handleUpdateMcq(qIdx, { questionKm: e.target.value })}
                        placeholder="ខ្លឹមសារសំណួរជាភាសាខ្មែរ... (KaTeX $...$)"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={q.questionEn}
                        onChange={(e) => handleUpdateMcq(qIdx, { questionEn: e.target.value })}
                        placeholder="Question text in English..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pt-1">
                    {choices.map((c, optIdx) => (
                      <div key={c} className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
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
                            handleUpdateOption(qIdx, optIdx, 'km', e.target.value)
                          }
                          placeholder={`ជម្រើស ${c} (Option ${c})`}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Hint & Explanation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={q.hintKm}
                      onChange={(e) => handleUpdateMcq(qIdx, { hintKm: e.target.value })}
                      placeholder="💡 ជំនួយស្មារតី (Hint)..."
                      className="w-full px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white text-xs"
                    />
                    <input
                      type="text"
                      value={q.explanationKm}
                      onChange={(e) =>
                        handleUpdateMcq(qIdx, { explanationKm: e.target.value })
                      }
                      placeholder="📖 ការពន្យល់សង្ខេប (Explanation)..."
                      className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
