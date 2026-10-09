import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, RotateCcw, ArrowRight, Building, Cpu, Scale, BookOpen, Eye } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import type { DecisionOption } from '../engine/types';

interface ArchitectureExplanationPanelProps {
  option: DecisionOption;
  onRetry?: () => void;
  onContinue?: () => void;
}

export const ArchitectureExplanationPanel: React.FC<ArchitectureExplanationPanelProps> = ({
  option,
  onRetry,
  onContinue,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const isCorrect = option.isCorrect;
  const sd = option.sdConcept;

  if (isMinimized) {
    return (
      <div className="fixed inset-x-0 bottom-6 z-50 flex items-center justify-center p-3 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-2xl bg-slate-900/95 border ${
            isCorrect ? 'border-emerald-500/50 shadow-emerald-950/60' : 'border-rose-500/50 shadow-rose-950/60'
          } shadow-2xl backdrop-blur-lg`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-bold text-white max-w-[180px] sm:max-w-[280px] truncate">
              {sd?.conceptName || option.title}
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsMinimized(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 border border-sky-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Explanation</span>
          </button>

          {!isCorrect ? (
            <button
              onClick={() => {
                sounds.playClick();
                if (onRetry) onRetry();
              }}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                if (onContinue) onContinue();
              }}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/30"
            >
              <span>Proceed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`w-full max-w-2xl bg-slate-900/95 border ${
          isCorrect ? 'border-emerald-500/50 shadow-emerald-950/50' : 'border-rose-500/50 shadow-rose-950/60'
        } rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col`}
      >
        {/* Top Accent Glow Bar */}
        <div
          className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${
            isCorrect
              ? 'from-transparent via-emerald-400 to-transparent'
              : 'from-transparent via-rose-500 to-transparent'
          }`}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Header Status Chip & View 3D Scene Action */}
          <div className="flex items-center justify-between gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Architecture Validated • Correct Decision</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Architectural Bottleneck • Incorrect Approach</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsMinimized(true);
                }}
                title="View in-scene 3D animation consequence"
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>View 3D Scene</span>
              </button>

              <span className="text-[11px] font-mono font-semibold text-slate-400 hidden sm:inline">
                {option.tag}
              </span>
            </div>
          </div>

          {/* Title & Core Summary */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5 leading-snug">
              {sd?.conceptName || option.title}
            </h3>
            <p
              className={`text-xs sm:text-sm font-medium leading-relaxed ${
                isCorrect ? 'text-emerald-200/90' : 'text-rose-200/90'
              }`}
            >
              {sd?.summary || option.feedbackText}
            </p>
          </div>

          {/* Section 1: Office Building Simulation Event */}
          {sd?.buildingAnalogyEvent && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>What Happened in the Office Building</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {sd.buildingAnalogyEvent}
              </p>
            </div>
          )}

          {/* Section 2: Technical System Design Reality */}
          {sd?.technicalSystemReality && (
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/30'
                  : 'bg-rose-950/30 border-rose-500/30'
              }`}
            >
              <div
                className={`text-[11px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                  isCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>System Design Reality & Engineering Principles</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {sd.technicalSystemReality}
              </p>
            </div>
          )}

          {/* Section 3: Deep Comparison: Building vs. Distributed Servers */}
          {sd?.whyItFailsOrSucceeds && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30">
              <div className="text-[11px] font-black uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>Architecture Comparison: Building Analogy vs. Server Fleet</span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal">
                {sd.whyItFailsOrSucceeds}
              </p>
            </div>
          )}

          {/* Section 4: Key Trade-offs / Industry Takeaways */}
          {sd?.tradeOffs && sd.tradeOffs.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Engineering Trade-offs & Production Considerations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sd.tradeOffs.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-snug"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-World Industry Reference */}
          {sd?.realWorldExample && (
            <div className="p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div className="text-xs text-indigo-200/90 leading-relaxed">
                <span className="font-bold text-indigo-300">Industry Practice: </span>
                {sd.realWorldExample}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          {!isCorrect ? (
            <button
              onClick={() => {
                sounds.playClick();
                if (onRetry) onRetry();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Alternate Architecture (Retry)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                if (onContinue) onContinue();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Proceed to Architecture Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
