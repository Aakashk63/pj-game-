import React from 'react';
import { motion } from 'framer-motion';
import type { ConceptCardData } from '../engine/types';
import { BookOpen, Check, X, ArrowRight, Lightbulb, Building2, Server, Key, Smartphone, Fingerprint, Globe, Shield, ArrowRightLeft } from 'lucide-react';
import { sounds } from '../engine/soundManager';

interface ConceptCardModalProps {
  concept: ConceptCardData;
  onContinueToQuiz: () => void;
}

export const ConceptCardModal: React.FC<ConceptCardModalProps> = ({
  concept,
  onContinueToQuiz,
}) => {
  const isAuthComic = !!concept.coreIdeaBanner || !!concept.mappingTable;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-slate-900/98 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs uppercase font-black tracking-widest text-sky-400">
            Architecture Blueprint & Concept
          </span>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
          {concept.title}
        </h2>
        <p className="text-sm font-semibold text-slate-400 mb-5">
          {concept.subtitle}
        </p>

        {/* Comic Reference: Purple "Core Idea" Banner */}
        {concept.coreIdeaBanner && (
          <div className="p-4 rounded-2xl bg-purple-950/70 border border-purple-500/40 mb-4 shadow-lg">
            <h4 className="text-xs uppercase font-extrabold text-purple-300 mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-400" /> The Core Idea
            </h4>
            <p className="text-sm text-purple-100 font-medium leading-relaxed">
              {concept.coreIdeaBanner}
            </p>
          </div>
        )}

        {/* Comic Reference: Yellow "AUTHENTICATION = Who are you?" Banner */}
        {concept.yellowBanner && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 mb-5 shadow-lg">
            <h3 className="text-base sm:text-lg font-black text-amber-300">
              {concept.yellowBanner.title}
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 font-medium mt-0.5">
              {concept.yellowBanner.subtext}
            </p>
          </div>
        )}

        {/* Comic Reference: Side-by-Side Comparison (AuthN vs AuthZ) */}
        {concept.sideBySide && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 shadow-inner">
              <h4 className="text-xs font-black uppercase tracking-wider text-sky-300 mb-2.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                {concept.sideBySide.leftTitle}
              </h4>
              <ul className="space-y-1.5 text-xs text-sky-100/90 font-medium">
                {concept.sideBySide.leftItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 shadow-inner">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 mb-2.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                {concept.sideBySide.rightTitle}
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-100/90 font-medium">
                {concept.sideBySide.rightItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Comic Reference: Animated "Real World to Tech" Mapping Table */}
        {concept.mappingTable && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-xs uppercase font-bold text-sky-400 mb-3 tracking-wider flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Real World to Tech Mapping
            </h4>
            <div className="space-y-2">
              {concept.mappingTable.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs gap-2"
                >
                  <span className="font-bold text-amber-300 flex-1">{row.realWorld}</span>
                  <div className="flex items-center gap-1 text-slate-500 shrink-0">
                    <span className="w-3 h-px bg-slate-700" />
                    <ArrowRight className="w-3 h-3 text-sky-400" />
                  </div>
                  <span className="font-bold text-sky-300 flex-1 text-right">{row.tech}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flow Steps (Step-by-step lifecycle) */}
        {concept.flowSteps && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h4 className="text-xs uppercase font-bold text-slate-400 mb-2.5 tracking-wider">
              How It Works: Step-by-Step Lifecycle
            </h4>
            <div className="space-y-1.5">
              {concept.flowSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Methods Badges */}
        {concept.commonMethods && (
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h5 className="text-[11px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
              Key Methods & Algorithms
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {concept.commonMethods.map((m, idx) => {
                const IconComp =
                  m.icon === 'key'
                    ? Key
                    : m.icon === 'smartphone'
                    ? Smartphone
                    : m.icon === 'fingerprint'
                    ? Fingerprint
                    : Globe;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-xs font-semibold text-slate-200"
                  >
                    <IconComp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{m.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fallback Definition & Analogy Grid if standard level */}
        {!isAuthComic && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-sky-400" /> Definition
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">{concept.definition}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="text-xs uppercase font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Intuition Analogy
                </h4>
                <p className="text-sm text-amber-100/90 leading-relaxed">{concept.analogy}</p>
              </div>
            </div>
          </>
        )}

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h5 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Key Advantages
            </h5>
            {concept.pros.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h5 className="text-xs uppercase font-bold text-rose-400 tracking-wider">
              Trade-offs & Risks
            </h5>
            {concept.cons.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real World Examples */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 mb-6">
          <h5 className="text-xs uppercase font-bold text-sky-400 mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Real World Production Systems
          </h5>
          <div className="space-y-1.5">
            {concept.realWorldExamples.map((ex, i) => (
              <p key={i} className="text-xs text-slate-300">
                <strong className="text-white">{ex.company}:</strong> {ex.usage}
              </p>
            ))}
          </div>
        </div>

        {/* Advance to Quiz Button */}
        <div className="flex justify-end sticky bottom-0 pt-2 bg-slate-900/90 backdrop-blur-sm">
          <button
            onClick={() => {
              sounds.playClick();
              onContinueToQuiz();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-sky-500/20 active:scale-95"
          >
            <span>Test Knowledge & Earn XP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

