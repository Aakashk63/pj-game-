import React from 'react';
import { motion } from 'framer-motion';
import type { DecisionOption } from '../engine/types';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../engine/soundManager';

interface DecisionPromptProps {
  question: string; // Max 15 words
  options: DecisionOption[];
  selectedOption: DecisionOption | null;
  onSelectOption: (option: DecisionOption) => void;
  onConfirmChoice: () => void;
}

export const DecisionPrompt: React.FC<DecisionPromptProps> = ({
  question,
  options,
  selectedOption,
  onSelectOption,
  onConfirmChoice,
}) => {
  return (
    <div className="fixed inset-x-0 bottom-8 z-40 flex flex-col items-center pointer-events-none px-4">
      {/* Top Question Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 px-6 py-2.5 rounded-full bg-slate-900/90 border border-sky-400/40 backdrop-blur-md shadow-2xl pointer-events-auto"
      >
        <span className="text-white font-bold text-base sm:text-lg tracking-wide drop-shadow-sm">
          {question}
        </span>
      </motion.div>

      {/* Choice Options Cards */}
      <div className={`w-full ${options.length === 3 ? 'max-w-4xl sm:grid-cols-3' : 'max-w-2xl sm:grid-cols-2'} grid grid-cols-1 gap-3.5 pointer-events-auto`}>
        {options.map((opt) => {
          const isSelected = selectedOption?.id === opt.id;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                if (isSelected) {
                  onConfirmChoice();
                } else {
                  onSelectOption(opt);
                }
              }}
              className={`relative cursor-pointer p-4 rounded-2xl backdrop-blur-md border transition-all duration-200 shadow-xl ${
                isSelected
                  ? 'bg-sky-950/90 border-sky-400 ring-2 ring-sky-400/60 shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900/85 border-slate-700/60 hover:border-sky-500/50 hover:bg-slate-900/95'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-sky-500/20">
                  {opt.tag}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                )}
              </div>

              <h4 className="text-white font-bold text-base mb-1">
                {opt.title}
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {opt.description}
              </p>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-sky-500/30 flex items-center justify-between text-xs text-sky-300 font-medium">
                  <span>Selected</span>
                  <span className="text-[11px] text-sky-400/80">Click again to deploy</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Commit Decision Button */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-4 pointer-events-auto"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              onConfirmChoice();
            }}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-sky-500/30 transition-all active:scale-95 cursor-pointer hover:shadow-sky-400/50"
          >
            <span>Deploy Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

