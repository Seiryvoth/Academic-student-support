'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  GraduationCap,
  Home,
  Video,
  FileQuestion,
  Lock,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  UserCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { getCurrentStaffSession, setCurrentStaffSession, StaffAccount } from '@/lib/data-store';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t, isKhmer } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staffSession, setStaffSession] = useState<StaffAccount | null>(null);

  const isDark = mounted && (resolvedTheme ? resolvedTheme === 'dark' : theme === 'dark');

  useEffect(() => {
    setMounted(true);
    setStaffSession(getCurrentStaffSession());

    // Listen for storage changes in case of login/logout in other tabs/modals
    const handleStorage = () => {
      setStaffSession(getCurrentStaffSession());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const handleLogout = () => {
    setCurrentStaffSession(null);
    setStaffSession(null);
    window.location.href = '/';
  };

  const navLinks = [
    {
      href: '/',
      labelKm: '🏠 ទំព័រដើម',
      labelEn: '🏠 Home',
      icon: Home,
    },
    {
      href: '/videos',
      labelKm: '🎬 មេរៀនវីដេអូ',
      labelEn: '🎬 Video Lessons',
      icon: Video,
      badge: 'Hub',
    },
    {
      href: '/practice',
      labelKm: '📝 លំហាត់ MCQ',
      labelEn: '📝 Practice MCQ',
      icon: FileQuestion,
      badge: '10-MCQ',
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'km' ? 'en' : 'km');
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* 1. School Logo & App Title */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-hidden"
              aria-label="MoEYS Academic App"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    {isKhmer ? 'ថ្នាលអប់រំ និងគាំទ្រការសិក្សា' : 'MoEYS Academic Hub'}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                    G7 - G12
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate max-w-[200px] sm:max-w-xs">
                  {isKhmer ? 'ក្រសួងអប់រំ យុវជន និងកីឡា' : 'Cambodian MoEYS Curriculum'}
                </span>
              </div>
            </Link>

            {/* 2. Primary Navigation Buttons (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <span>{isKhmer ? item.labelKm : item.labelEn}</span>
                    {item.badge && !isActive && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Utility Controls (Right Side) */}
            <div className="flex items-center gap-2">
              {/* Language Switcher Toggle */}
              <button
                onClick={toggleLanguage}
                aria-label="Toggle language"
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
              >
                {language === 'km' ? (
                  <>
                    <span className="text-sm">🇰🇭</span>
                    <span>ខ្មែរ</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-slate-400 font-normal">EN</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">🇬🇧</span>
                    <span>EN</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-slate-400 font-normal">ខ្មែរ</span>
                  </>
                )}
              </button>

              {/* Theme Switcher (Segmented Light / Dark Mode Toggle) */}
              <div
                role="group"
                aria-label="Theme mode switcher"
                className="flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 shadow-2xs"
              >
                {/* Light Mode Option */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  aria-pressed={mounted && !isDark}
                  aria-label={isKhmer ? 'ប្ដូរទៅពន្លឺ (Light Mode)' : 'Switch to Light Mode'}
                  title={isKhmer ? 'ប្ដូរទៅពន្លឺ (Light Mode)' : 'Light Mode'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mounted && !isDark
                      ? 'bg-white text-amber-600 shadow-xs border border-slate-200/80 scale-100'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Sun
                    className={`w-3.5 h-3.5 transition-colors ${
                      mounted && !isDark ? 'text-amber-500 fill-amber-400' : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                  <span className="hidden sm:inline">{isKhmer ? 'ពន្លឺ' : 'Light'}</span>
                </button>

                {/* Dark Mode Option */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  aria-pressed={mounted && isDark}
                  aria-label={isKhmer ? 'ប្ដូរទៅងងឹត (Dark Mode)' : 'Switch to Dark Mode'}
                  title={isKhmer ? 'ប្ដូរទៅងងឹត (Dark Mode)' : 'Dark Mode'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mounted && isDark
                      ? 'bg-slate-900 text-indigo-300 shadow-xs border border-indigo-500/30 scale-100'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Moon
                    className={`w-3.5 h-3.5 transition-colors ${
                      mounted && isDark ? 'text-indigo-400 fill-indigo-400' : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                  <span className="hidden sm:inline">{isKhmer ? 'ងងឹត' : 'Dark'}</span>
                </button>
              </div>

              {/* Staff Access / Login Button */}
              {staffSession ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isKhmer ? 'ផ្ទាំងគ្រូ' : 'Dashboard'}</span>
                    <span className="text-[10px] uppercase font-bold px-1 rounded-sm bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                      {staffSession.role === 'super_admin' ? 'Admin' : staffSession.subjectAssigned}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title={t('logout')}
                    aria-label="Sign out"
                    className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{isKhmer ? '🔐 ចូលប្រព័ន្ធគ្រូ' : '🔐 Staff Login'}</span>
                </Link>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-5 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5 mb-4">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-4 h-4" />
                      <span>{isKhmer ? item.labelKm : item.labelEn}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Language & Theme Quick Switchers */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 mb-3">
              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <button
                  onClick={toggleLanguage}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="text-base">{language === 'km' ? '🇰🇭' : '🇬🇧'}</span>
                  <span>{language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
                </button>

                {/* Theme Switcher Segmented Control in Mobile */}
                <div
                  role="group"
                  aria-label="Theme mode switcher"
                  className="flex-1 flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    aria-pressed={mounted && !isDark}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mounted && !isDark
                        ? 'bg-white text-amber-600 shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Sun className={`w-3.5 h-3.5 ${mounted && !isDark ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                    <span>{isKhmer ? 'ពន្លឺ' : 'Light'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    aria-pressed={mounted && isDark}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mounted && isDark
                        ? 'bg-slate-900 text-indigo-300 shadow-xs border border-indigo-500/30 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Moon className={`w-3.5 h-3.5 ${mounted && isDark ? 'text-indigo-400 fill-indigo-400' : 'text-slate-400'}`} />
                    <span>{isKhmer ? 'ងងឹត' : 'Dark'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {staffSession ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      <span>{isKhmer ? 'ផ្ទាំងគ្រប់គ្រងគ្រូ' : 'Staff Dashboard'}</span>
                    </div>
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-800">
                      {staffSession.role === 'super_admin' ? 'Admin' : staffSession.subjectAssigned}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isKhmer ? 'ចូលប្រព័ន្ធគ្រូ (Staff Login)' : 'Staff Login'}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Bar (Video Lessons & Practice MCQ are always 1 tap away) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around gap-1">
          <Link
            href="/"
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              pathname === '/'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 font-medium'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{isKhmer ? 'ទំព័រដើម' : 'Home'}</span>
          </Link>

          <Link
            href="/videos"
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              pathname === '/videos'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 font-medium'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{isKhmer ? 'វីដេអូ' : 'Videos'}</span>
          </Link>

          <Link
            href="/practice"
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              pathname === '/practice'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 font-medium'
            }`}
          >
            <FileQuestion className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{isKhmer ? 'លំហាត់ MCQ' : 'MCQs'}</span>
          </Link>

          {staffSession ? (
            <Link
              href="/dashboard"
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                pathname === '/dashboard'
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{isKhmer ? 'ផ្ទាំងគ្រូ' : 'Admin'}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                pathname === '/login'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{isKhmer ? 'គ្រូ' : 'Staff'}</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
