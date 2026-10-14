'use client';

import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { parsePdfUrl } from '@/lib/storage-utils';
import { useLanguage } from '@/context/language-context';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
}) => {
  const { t, isKhmer } = useLanguage();

  if (!isOpen || !pdfUrl) return null;

  const parsed = parsePdfUrl(pdfUrl, title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {title || (isKhmer ? 'ឯកសារជំនួយស្មារតី PDF' : 'PDF Study Handout')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {parsed.sourceType === 'gdrive'
                  ? isKhmer ? 'Google Drive Cloud Storage (Zero-Cost Hybrid)' : 'Google Drive Cloud Storage (Zero-Cost)'
                  : 'Document Handout'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Direct Download Button */}
            <a
              href={parsed.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('downloadHandout')}</span>
            </a>

            {/* Open in New Window */}
            <a
              href={parsed.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new window"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Preview Iframe */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
          <iframe
            src={parsed.previewUrl}
            className="w-full h-full border-0"
            title={title || 'PDF Preview'}
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
};
