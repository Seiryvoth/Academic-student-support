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
  Users,
  UserPlus,
  Crown,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { StaffAccount } from '@/lib/data-store';
import { SignInModal } from '@/components/auth/SignInModal';
import { SignUpModal } from '@/components/auth/SignUpModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t, isKhmer } = useLanguage();
  const { staffSession, logout, isLoading } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const isDark = mounted && (resolvedTheme ? resolvedTheme === 'dark' : theme === 'dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
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

  const displayName = staffSession
    ? (isKhmer ? staffSession.fullNameKm : staffSession.fullNameEn) || staffSession.email
    : '';

  const initials = staffSession
    ? (displayName
        .replace(/^(លោក|លោកស្រី|អ្នកគ្រូ|សាស្ត្រាចារ្យ|លោកបណ្ឌិត|Mr\.|Mrs\.|Ms\.|Prof\.|Dr\.)\s*/i, '') || 'U')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

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
                const isActive = pathname === item.href || (item.href === '/videos' && pathname === '/hub');
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

            {/* 3. Utility Controls & Auth Area (Right Side) */}
            <div className="flex items-center gap-2">
              {/* Language Switcher Toggle */}
              <button
                onClick={toggleLanguage}
                aria-label="Toggle language"
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
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

              {/* Theme Switcher Toggle */}
              <div
                role="group"
                aria-label="Theme mode switcher"
                className="hidden sm:flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  aria-pressed={mounted && !isDark}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mounted && !isDark
                      ? 'bg-white text-amber-600 shadow-xs border border-slate-200/80 scale-100'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Sun
                    className={`w-3.5 h-3.5 transition-colors ${
                      mounted && !isDark ? 'text-amber-500 fill-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="hidden xl:inline">{isKhmer ? 'ពន្លឺ' : 'Light'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  aria-pressed={mounted && isDark}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mounted && isDark
                      ? 'bg-slate-900 text-indigo-300 shadow-xs border border-indigo-500/30 scale-100'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Moon
                    className={`w-3.5 h-3.5 transition-colors ${
                      mounted && isDark ? 'text-indigo-400 fill-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="hidden xl:inline">{isKhmer ? 'ងងឹត' : 'Dark'}</span>
                </button>
              </div>

              {/* AUTH AREA */}
              {!mounted || (isLoading && !staffSession) ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-20 h-7 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                  <div className="w-20 h-7 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                </div>
              ) : staffSession ? (
                /* Authenticated User View: Avatar, Full Name, Role Badge, Logout */
                <div className="hidden sm:flex items-center gap-2.5">
                  {/* Super Admin Quick Link: Teams */}
                  {staffSession.role === 'super_admin' && (
                    <Link
                      href="/admin/team-management"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 hover:bg-indigo-100 transition-all shadow-2xs"
                      title={isKhmer ? 'គ្រប់គ្រងក្រុមការងារ & គណនី' : 'Subject Team Management'}
                    >
                      <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="hidden md:inline">{isKhmer ? 'ក្រុមការងារ' : 'Teams'}</span>
                    </Link>
                  )}

                  {/* Staff Dashboard Link */}
                  {staffSession.role !== 'student' && (
                    <Link
                      href="/dashboard"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 hover:bg-emerald-100 transition-all shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden md:inline">{isKhmer ? 'ផ្ទាំងគ្រូ' : 'Dashboard'}</span>
                    </Link>
                  )}

                  {/* User Profile Component */}
                  <div className="flex items-center gap-2 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                    {/* User Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 ${
                        staffSession.role === 'super_admin'
                          ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 ring-2 ring-indigo-400/30'
                          : staffSession.role === 'subject_lead'
                          ? 'bg-gradient-to-tr from-blue-600 to-sky-600 ring-2 ring-blue-400/30'
                          : staffSession.role === 'subject_member'
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 ring-2 ring-emerald-400/30'
                          : 'bg-gradient-to-tr from-amber-500 to-orange-500 ring-2 ring-amber-400/30'
                      }`}
                      title={displayName}
                    >
                      {initials}
                    </div>

                    {/* Name & Role Badge */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[95px] lg:max-w-[130px] leading-tight">
                        {displayName}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {staffSession.role === 'super_admin' ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wide uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            <Crown className="w-2.5 h-2.5" />
                            <span>Super Admin</span>
                          </span>
                        ) : staffSession.role === 'subject_lead' ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wide uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>{isKhmer ? 'ប្រធាន' : 'Lead'}</span>
                          </span>
                        ) : staffSession.role === 'subject_member' ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wide uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <BookOpen className="w-2.5 h-2.5" />
                            <span>{isKhmer ? 'សមាជិក' : 'Member'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wide uppercase bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <GraduationCap className="w-2.5 h-2.5" />
                            <span>{isKhmer ? 'សិស្ស' : 'Student'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Log Out button */}
                    <button
                      onClick={handleLogout}
                      title={isKhmer ? 'ចាកចេញ' : 'Log Out'}
                      aria-label="Log Out"
                      className="ml-1 p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Unauthenticated View: "Sign In / ចូលគណនី" and "Sign Up / ចុះឈ្មោះ" */
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSignInOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-2xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{isKhmer ? 'ចូលគណនី' : 'Sign In'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isKhmer ? 'ចុះឈ្មោះ' : 'Sign Up'}</span>
                  </button>
                </div>
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
            {/* Primary Nav Links */}
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
                <button
                  onClick={toggleLanguage}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="text-base">{language === 'km' ? '🇰🇭' : '🇬🇧'}</span>
                  <span>{language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
                </button>

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

            {/* Mobile Auth Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              {staffSession ? (
                <>
                  {/* User Profile Card */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {displayName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {staffSession.email}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {staffSession.role}
                    </span>
                  </div>

                  {staffSession.role === 'super_admin' && (
                    <Link
                      href="/admin/team-management"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{isKhmer ? 'គ្រប់គ្រងក្រុមការងារ & គណនី' : 'Subject Team Management'}</span>
                      </div>
                      <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-md bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100">
                        Admin
                      </span>
                    </Link>
                  )}

                  {staffSession.role !== 'student' && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        <span>{isKhmer ? 'ផ្ទាំងគ្រប់គ្រងគ្រូ' : 'Staff Dashboard'}</span>
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isKhmer ? 'ចាកចេញ' : 'Log Out'}</span>
                  </button>
                </>
              ) : !mounted || (isLoading && !staffSession) ? (
                <div className="h-10 w-full rounded-xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
              ) : (
                /* Unauthenticated Mobile Actions */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSignInOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isKhmer ? 'ចូលគណនី' : 'Sign In'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSignUpOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isKhmer ? 'ចុះឈ្មោះ' : 'Sign Up'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation */}
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
              pathname === '/videos' || pathname === '/hub'
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
              href={staffSession.role === 'super_admin' ? '/admin/team-management' : '/dashboard'}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                pathname.startsWith('/admin') || pathname === '/dashboard'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">
                {staffSession.role === 'super_admin' ? 'Admin' : 'Dashboard'}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => setSignInOpen(true)}
              className="flex flex-col items-center py-1 px-3 rounded-xl text-slate-600 dark:text-slate-400 font-medium cursor-pointer"
            >
              <Lock className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{isKhmer ? 'ចូលគណនី' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Auth Modals */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSwitchToSignUp={() => {
          setSignInOpen(false);
          setSignUpOpen(true);
        }}
      />

      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSwitchToSignIn={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
      />
    </>
  );
};
