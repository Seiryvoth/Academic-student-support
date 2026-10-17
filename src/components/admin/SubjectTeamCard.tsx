'use client';

import React from 'react';
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  UserPlus,
  Edit2,
  Trash2,
  Crown,
  UserCheck,
  Calendar,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { SubjectMeta, SubjectId } from '@/lib/curriculum-data';
import { SubjectTeamMember } from '@/lib/team-store';

interface SubjectTeamCardProps {
  subject: SubjectMeta;
  members: SubjectTeamMember[];
  onAddMember: (subjectId: SubjectId) => void;
  onEditMember: (member: SubjectTeamMember) => void;
  onDeleteMember: (member: SubjectTeamMember) => void;
  currentUserId?: string;
  currentUserEmail?: string;
}

export function SubjectTeamCard({
  subject,
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  currentUserId,
  currentUserEmail,
}: SubjectTeamCardProps) {
  const { isKhmer } = useLanguage();

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-white" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-white" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-white" />;
      case 'Dna':
        return <Dna className="w-5 h-5 text-white" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-white" />;
      default:
        return <Users className="w-5 h-5 text-white" />;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(isKhmer ? 'km-KH' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Subject Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br ${subject.gradient}`}
          >
            {getSubjectIcon(subject.iconName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {isKhmer ? subject.nameKm : subject.nameEn}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {subject.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {members.length === 0
                ? isKhmer
                  ? 'មិនទាន់មានសមាជិកនៅឡើយ'
                  : 'No team members assigned'
                : isKhmer
                ? `ក្រុមការងារសរុប ${members.length} នាក់`
                : `${members.length} team ${members.length === 1 ? 'member' : 'members'}`}
            </p>
          </div>
        </div>

        {/* Inline Add Member Button */}
        <button
          onClick={() => onAddMember(subject.id)}
          className={`self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer bg-gradient-to-r ${subject.gradient} hover:opacity-95`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isKhmer ? '+ បន្ថែមសមាជិក' : '+ Add Member'}</span>
        </button>
      </div>

      {/* Members Table or Empty State */}
      <div className="flex-1 overflow-x-auto">
        {members.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isKhmer
                ? `មិនទាន់មានសមាជិកក្នុងមុខវិជ្ជា ${subject.nameKm} នៅឡើយទេ`
                : `No members assigned to ${subject.nameEn} yet`}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {isKhmer
                ? 'ចុចប៊ូតុងខាងក្រោមដើម្បីបន្ថែមប្រធានមុខវិជ្ជា ឬសមាជិកក្រុមការងារដំបូង'
                : 'Click below to assign the first subject lead or member'}
            </p>
            <button
              onClick={() => onAddMember(subject.id)}
              className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              {isKhmer ? '+ ចាត់តាំងសមាជិកដំបូង' : '+ Assign First Member'}
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/30 dark:bg-slate-900/40">
                <th className="py-3 px-4 sm:px-6">{isKhmer ? 'សមាជិក' : 'Member'}</th>
                <th className="py-3 px-4 sm:px-6">{isKhmer ? 'អ៊ីមែល' : 'Email'}</th>
                <th className="py-3 px-4 sm:px-6">{isKhmer ? 'តួនាទី' : 'Role'}</th>
                <th className="py-3 px-4 sm:px-6 hidden md:table-cell">{isKhmer ? 'កាលបរិច្ឆេទបង្កើត' : 'Created Date'}</th>
                <th className="py-3 px-4 sm:px-6 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {members.map((m) => {
                const cleanRole = (m.role || '').toString().trim().toLowerCase();
                const isLead = cleanRole === 'subject_lead';
                const isSuper = cleanRole === 'super_admin' || cleanRole === 'admin';
                const isSelf =
                  (currentUserId && currentUserId === m.id) ||
                  (currentUserEmail &&
                    currentUserEmail.toLowerCase().trim() === (m.email || '').toLowerCase().trim());

                const displayName = (m.fullName || m.email || (isKhmer ? 'សមាជិក' : 'Team Member')).trim();
                const initials = (displayName
                  .replace(/^(លោក|លោកស្រី|អ្នកគ្រូ|សាស្ត្រាចារ្យ|លោកបណ្ឌិត|Mr\.|Mrs\.|Ms\.|Prof\.|Dr\.)\s*/i, '') || 'ST')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Full Name & Avatar */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-xs ${
                            isSuper
                              ? 'bg-blue-600'
                              : isLead
                              ? 'bg-purple-600'
                              : 'bg-emerald-600'
                          }`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {displayName}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                                {isKhmer ? 'អ្នក' : 'You'}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 sm:hidden block truncate max-w-[140px]">
                            {m.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-xs truncate max-w-[180px] sm:max-w-none">
                          {m.email}
                        </span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4 sm:px-6">
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span>{isKhmer ? 'Super Admin' : 'Super Admin'}</span>
                        </span>
                      ) : isLead ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span>{isKhmer ? 'ប្រធានមុខវិជ្ជា' : 'Subject Lead'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{isKhmer ? 'សមាជិកមុខវិជ្ជា' : 'Subject Member'}</span>
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(m.createdAt)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEditMember(m)}
                          title={isKhmer ? 'កែសម្រួលគណនី' : 'Edit Member'}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteMember(m)}
                          disabled={Boolean(isSelf)}
                          title={
                            isSelf
                              ? isKhmer
                                ? 'មិនអាចលុបគណនីផ្ទាល់ខ្លួនបានទេ'
                                : 'Cannot delete self'
                              : isKhmer
                              ? 'លុបគណនី'
                              : 'Delete Member'
                          }
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSelf
                              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                              : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
