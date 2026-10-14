'use client';

import React, { useState } from 'react';
import {
  Lightbulb,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { LatexRenderer } from './latex-renderer';
import { useLanguage } from '@/context/language-context';
import { McqChoice } from '@/lib/curriculum-mcqs-generator';

export interface McqCardProps {
  questionNumber?: number;
  difficulty?: 'basic' | 'medium' | 'advanced';
  questionKm: string;
  questionEn: string;
  optionsKm: [string, string, string, string, string]; // [A, B, C, D, E]
  optionsEn: [string, string, string, string, string]; // [A, B, C, D, E]
  correctAnswer: McqChoice;
  hintKm: string;
  hintEn: string;
  explanationKm: string;
  explanationEn: string;
  onAnswerSelected?: (isCorrect: boolean, selectedChoice: McqChoice) => void;
  selectedOption?: McqChoice | null;
}

export const McqCard: React.FC<McqCardProps> = ({
  questionNumber,
  difficulty,
  questionKm,
  questionEn,
  optionsKm,
  optionsEn,
  correctAnswer,
  hintKm,
  hintEn,
  explanationKm,
  explanationEn,
  onAnswerSelected,
  selectedOption: externalSelectedOption,
}) => {
  const { isKhmer, t } = useLanguage();
  const [internalSelected, setInternalSelected] = useState<McqChoice | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const selectedChoice = externalSelectedOption !== undefined ? externalSelectedOption : internalSelected;
  const isAnswered = selectedChoice !== null;

  const choices: McqChoice[] = ['A', 'B', 'C', 'D', 'E'];

  const questionText = isKhmer ? questionKm : questionEn;
  const hintText = isKhmer ? hintKm : hintEn;
  const explanationText = isKhmer ? explanationKm : explanationEn;

  const handleSelect = (choice: McqChoice) => {
    if (isAnswered) return; // Prevent changing after selection
    setInternalSelected(choice);
    const isCorrect = choice === correctAnswer;
    if (onAnswerSelected) {
      onAnswerSelected(isCorrect, choice);
    }
    // Auto-reveal explanation upon selection for immediate learning reinforcement
    setShowExplanation(true);
  };

  const getDifficultyBadge = () => {
    if (!difficulty) return null;
    const styles = {
      basic: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      advanced: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${styles[difficulty]}`}>
        {t(difficulty)}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-lg border border-slate-200 dark:border-slate-800 transition-all">
      {/* Header: Question Number & Difficulty Badge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {questionNumber && (
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm">
              Q{questionNumber}
            </span>
          )}
          {getDifficultyBadge()}
        </div>

        {/* Collapsible "💡 Hint / ជំនួយស្មារតី" Button */}
        {hintText && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-900/50 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? t('hideHint') : t('hint')}</span>
          </button>
        )}
      </div>

      {/* Collapsible Hint Box */}
      {showHint && hintText && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-sm animate-in fade-in duration-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-xs uppercase tracking-wider block mb-1">
              {isKhmer ? 'ជំនួយស្មារតី' : 'Helpful Hint'}
            </span>
            <LatexRenderer content={hintText} />
          </div>
        </div>
      )}

      {/* Question Text with KaTeX support */}
      <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed mb-6">
        <LatexRenderer content={questionText} />
      </div>

      {/* Universal 5 Choices (A, B, C, D, E) */}
      <div className="space-y-3 mb-6">
        {choices.map((choice, idx) => {
          const optionText = isKhmer ? optionsKm[idx] : optionsEn[idx];
          const isSelected = selectedChoice === choice;
          const isCorrect = choice === correctAnswer;

          let optionStyle =
            'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
          let letterPill =
            'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold';

          if (isAnswered) {
            if (isCorrect) {
              // Highlight correct in Green
              optionStyle =
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
              letterPill = 'bg-emerald-600 text-white font-bold';
            } else if (isSelected && !isCorrect) {
              // Highlight incorrect in Red
              optionStyle =
                'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
              letterPill = 'bg-rose-600 text-white font-bold';
            } else {
              optionStyle =
                'opacity-60 border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-500';
            }
          }

          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              disabled={isAnswered}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 group active:scale-[0.99] ${optionStyle} ${
                !isAnswered ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-600' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-colors ${letterPill}`}
                >
                  {choice}
                </span>
                <div className="flex-1 text-sm sm:text-base font-normal overflow-x-auto">
                  <LatexRenderer content={optionText || ''} />
                </div>
              </div>

              {/* Status Icons */}
              {isAnswered && (
                <div className="flex-shrink-0 ml-2">
                  {isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Header & Collapsible "📖 Short Answer / ការពន្យល់សង្ខេប" Button */}
      {isAnswered && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedChoice === correctAnswer ? (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('correct')}
                </span>
              ) : (
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  {t('incorrect')}
                </span>
              )}
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1 px-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showExplanation ? t('hideShortAnswer') : t('shortAnswer')}</span>
              {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Step-by-Step Explanation Card */}
          {showExplanation && explanationText && (
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 text-slate-800 dark:text-slate-200 text-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'ការពន្យល់សង្ខេប និងដំណោះស្រាយលម្អិត' : 'Step-by-Step Short Solution'}</span>
              </div>
              <div className="leading-relaxed">
                <LatexRenderer content={explanationText} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
