'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  FileQuestion,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  BookOpen,
  CheckCircle2,
  Download,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Award,
} from 'lucide-react';
import { SUBJECTS, SubjectId, GRADES, GradeLevel } from '@/lib/curriculum-data';
import { useLanguage } from '@/context/language-context';

export default function HomePage() {
  const { t, isKhmer } = useLanguage();
  const [activeGrade, setActiveGrade] = useState<GradeLevel>(12);

  const iconMap: Record<SubjectId, React.ReactNode> = {
    math: <Calculator className="w-6 h-6" />,
    physics: <Atom className="w-6 h-6" />,
    chemistry: <FlaskConical className="w-6 h-6" />,
    biology: <Dna className="w-6 h-6" />,
    english: <Languages className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Official MoEYS Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-100/80 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-xs mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {t('heroTitle')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
              {t('heroHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/videos"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Video className="w-5 h-5" />
              <span>{t('exploreVideosBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/practice"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <FileQuestion className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t('practiceMcqBtn')}</span>
            </Link>
          </div>

          {/* Core Highlights Pill Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">
                7 - 12
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('statGrades')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
                170+
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('statLessons')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                1,700+
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('statMcqs')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
              <span className="text-2xl font-black text-amber-500 block">
                100%
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('statAccessSub')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRADE LEVEL SELECTOR CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {isKhmer ? 'ជ្រើសរើសកម្រិតថ្នាក់ដើម្បីចាប់ផ្តើមរៀន' : 'Explore by MoEYS Grade Level'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isKhmer
                ? 'កម្មវិធីសិក្សាពេញលេញពីថ្នាក់ទី៧ ដល់ ទី១២ រួមទាំងការត្រៀមប្រឡងឌីប្លូម និងបាក់ឌុប'
                : 'Covering lower secondary and high school exam preparation (Diploma & BacII)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GRADES.map((g) => {
            const isSelected = activeGrade === g;
            const isBacII = g === 12;
            const isDiploma = g === 9;

            return (
              <button
                key={g}
                onClick={() => setActiveGrade(g)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg border-blue-600 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {isBacII && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    Bac II
                  </span>
                )}
                {isDiploma && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase ${
                      isSelected
                        ? 'bg-emerald-300 text-slate-950'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    Diploma
                  </span>
                )}

                <div className="text-2xl font-black tracking-tight mb-1">
                  {t('grade')} {g}
                </div>
                <div
                  className={`text-xs ${
                    isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isKhmer ? '៥ មុខវិជ្ជាស្នូល' : '5 Core Subjects'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. 5 CORE SUBJECT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isKhmer ? 'មុខវិជ្ជាវិទ្យាសាស្ត្រ និងភាសាទាំង ៥' : 'The 5 Core Academic Disciplines'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isKhmer
              ? 'ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលមើលមេរៀនវីដេអូ ឬធ្វើលំហាត់ MCQ ស្តង់ដារ ១០ សំណួរ'
              : 'Select a subject to watch video lectures or solve 10-MCQ quizzes.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(SUBJECTS) as SubjectId[]).map((subjKey) => {
            const subj = SUBJECTS[subjKey];
            const icon = iconMap[subjKey];

            return (
              <div
                key={subjKey}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-2xl transition-all group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${subj.gradient} text-white flex items-center justify-center shadow-md`}
                    >
                      {icon}
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${subj.badgeBg} ${subj.badgeText}`}
                    >
                      {subj.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {isKhmer ? subj.nameKm : subj.nameEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {isKhmer ? subj.descriptionKm : subj.descriptionEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/videos?subject=${subjKey}&grade=${activeGrade}`}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{t('videoLessons')}</span>
                  </Link>

                  <Link
                    href={`/practice?subject=${subjKey}&grade=${activeGrade}`}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>{t('practiceMcq')}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. KEY ARCHITECTURAL FEATURES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="bg-gradient-to-tr from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
              Architecture & Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {isKhmer
                ? 'រចនាសម្ព័ន្ធបច្ចេកវិទ្យាកម្រិតខ្ពស់ គ្មានដែនកំណត់'
                : 'Zero-Cost Hybrid Cloud Architecture'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              {isKhmer
                ? 'រួមបញ្ចូល YouTube Player 16:9 សម្រាប់មេរៀនវីដេអូ, Google Drive PDF Auto-Converter, KaTeX LaTeX សម្រាប់រូបមន្តគណិត-រូបវិទ្យា, និង PWA ដំណើរការលើ Android & iOS ដោយឥតគិតថ្លៃ។'
                : 'Leverages YouTube 16:9 responsive embeds, Google Drive direct PDF preview/download trick, KaTeX math typesetting, and PWA cross-platform mobile access.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isKhmer ? 'សិស្សប្រើប្រាស់ដោយសេរី ១០០%' : '100% Free Public Student Access'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isKhmer ? 'គ្មានការទាមទារគណនី ឬពាក្យសម្ងាត់ពីសិស្សឡើយ' : 'No student accounts or login required'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isKhmer ? 'រូបមន្តវិទ្យាសាស្ត្រ KaTeX' : 'LaTeX Math & Science Formulas'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isKhmer ? 'បង្ហាញរូបមន្តយ៉ាងច្បាស់ទាំង Light និង Dark mode' : 'Crisp rendering with dark/light mode support'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isKhmer ? 'ប្រព័ន្ធ MCQ ពីរដាច់ដោយឡែក (A & B)' : 'Dual MCQ Quiz Engine'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isKhmer ? 'MCQ ស្តង់ដារ ១០ សំណួរ + MCQ ភ្ជាប់វីដេអូគ្រូ' : '10-MCQ Standard Curriculum + Video MCQs'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isKhmer ? 'ផ្ទាំងគ្រប់គ្រងគ្រូគ្មានកូដ (No-Code)' : 'No-Code Staff Management'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isKhmer ? 'Super Admin និង Subject Leads គ្រប់គ្រងងាយស្រួល' : 'Protected by Supabase Auth and RLS'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {t('appName')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('footerRights')}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/videos" className="hover:text-blue-600 dark:hover:text-blue-400">
              {t('videoLessons')}
            </Link>
            <Link href="/practice" className="hover:text-blue-600 dark:hover:text-blue-400">
              {t('practiceMcq')}
            </Link>
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
              {t('staffLogin')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
