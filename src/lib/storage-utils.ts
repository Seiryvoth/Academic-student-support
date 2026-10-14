/**
 * Hybrid Zero-Cost Storage Utilities
 * Handles YouTube video embedding and Google Drive / External PDF links conversion.
 */

export interface ParsedVideoInfo {
  isValid: boolean;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

export interface ParsedPdfInfo {
  originalUrl: string;
  sourceType: 'gdrive' | 'direct' | 'other';
  previewUrl: string;
  downloadUrl: string;
  fileName?: string;
}

/**
 * Parses any YouTube link into a clean video ID and responsive embed URL.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function parseYouTubeUrl(url: string | null | undefined): ParsedVideoInfo {
  if (!url || typeof url !== 'string') {
    return { isValid: false, videoId: null, embedUrl: null, thumbnailUrl: null };
  }

  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return {
      isValid: true,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  return { isValid: false, videoId: null, embedUrl: null, thumbnailUrl: null };
}

/**
 * Converts Google Drive links and external PDF URLs into direct preview & download links.
 * Google Drive view links (e.g. /file/d/ID/view) are transformed into:
 * - Preview: https://drive.google.com/file/d/ID/preview (clean embed iframe)
 * - Download: https://drive.google.com/uc?export=download&id=ID (direct file download)
 */
export function parsePdfUrl(url: string | null | undefined, title?: string): ParsedPdfInfo {
  if (!url || typeof url !== 'string') {
    return {
      originalUrl: '',
      sourceType: 'other',
      previewUrl: '',
      downloadUrl: '',
      fileName: title ? `${title}.pdf` : 'handout.pdf',
    };
  }

  const trimmed = url.trim();

  // Check if it's a Google Drive link
  const gdriveIdMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (gdriveIdMatch && gdriveIdMatch[1]) {
    const fileId = gdriveIdMatch[1];
    return {
      originalUrl: trimmed,
      sourceType: 'gdrive',
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      fileName: title ? `${title}.pdf` : `MoEYS-Handout-${fileId.substring(0, 6)}.pdf`,
    };
  }

  // Regular direct PDF link
  const isDirectPdf = trimmed.toLowerCase().endsWith('.pdf');
  return {
    originalUrl: trimmed,
    sourceType: isDirectPdf ? 'direct' : 'other',
    previewUrl: trimmed,
    downloadUrl: trimmed,
    fileName: title ? `${title}.pdf` : 'document.pdf',
  };
}
