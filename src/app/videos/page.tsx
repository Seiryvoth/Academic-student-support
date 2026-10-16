'use client';

import React, { Suspense } from 'react';
import { AcademicHubView } from '@/components/academic-hub-view';

function VideoLessonsLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse shadow-lg mb-4">
        <span className="text-white font-black text-xl">🎬</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
        Loading MoEYS Video & PDF Learning Hub...
      </p>
    </div>
  );
}

export default function VideoLessonsPage() {
  return (
    <Suspense fallback={<VideoLessonsLoadingFallback />}>
      <AcademicHubView />
    </Suspense>
  );
}
