import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Play, Sparkles, Compass } from 'lucide-react';
import { LEVELS } from '../levels/levelRegistry';
import type { LevelMetadata } from '../levels/levelRegistry';
import { useGameStore } from '../store/gameStore';
import { sounds } from '../engine/soundManager';

interface LevelSelectMapProps {
  onSelectLevel: (levelId: string) => void;
  onOpenSettings: () => void;
  onOpenGallery?: () => void;
}

export const LevelSelectMap: React.FC<LevelSelectMapProps> = ({
  onSelectLevel,
  onOpenSettings,
  onOpenGallery,
}) => {
  const completedLevels = useGameStore((state) => state.completedLevels);
  const levelStars = useGameStore((state) => state.levelStars);
  const xp = useGameStore((state) => state.xp);

  return (
    <div className="relative h-full w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto overflow-x-hidden scroll-smooth selection:bg-sky-500 selection:text-white">
      {/* Background Ambience Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Campus Header */}
      <header className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              ARCHITECTURA
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                STORYBOARD v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Visual-First 3D Distributed Systems Simulator
            </p>
          </div>
        </div>

        {/* Player Stats & Actions */}
        <div className="flex items-center gap-3">
          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <span>🏗️ 3D Asset Gallery</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">{xp} XP</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
          >
            Settings
          </button>
        </div>
      </header>

      {/* Sticky Scrollable Level Navigation Pill Bar */}
      <div className="sticky top-0 z-20 w-full max-w-4xl py-3 px-2 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Scrollable Levels Navigation
          </span>
          <span className="text-[10px] text-sky-400 font-mono">
            Click any level to jump directly
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth">
          {LEVELS.map((lvl) => {
            const unlocked = lvl.isUnlocked(completedLevels);
            const completed = completedLevels.includes(lvl.id);
            return (
              <button
                key={`nav-${lvl.id}`}
                onClick={() => {
                  sounds.playClick();
                  const el = document.getElementById(`level-card-${lvl.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  completed
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                    : unlocked
                    ? 'bg-slate-900 text-sky-300 border-sky-500/30 hover:bg-slate-800 hover:border-sky-400'
                    : 'bg-slate-950/50 text-slate-500 border-slate-800 cursor-not-allowed'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">L{lvl.levelNumber}</span>
                <span>{lvl.title.replace(/^Level \d+:\s*/, '')}</span>
                {completed ? (
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                ) : (
                  <span className="text-[10px] text-sky-400/80">({lvl.conceptTag})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Winding Path Level Progression Map */}
      <main className="relative z-10 w-full max-w-3xl my-6 py-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Corporate Architecture Roadmap
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            From single-room startup to globally distributed fault-tolerant cloud campus.
          </p>
        </div>

        {/* Winding Nodes Column */}
        <div className="relative flex flex-col items-center gap-12 sm:gap-16">
          {/* Subtle SVG Winding Trail Line in background */}
          <div className="absolute top-10 bottom-10 w-1 bg-gradient-to-b from-sky-500 via-sky-600/40 to-slate-800 -z-10 rounded-full" />

          {LEVELS.map((lvl: LevelMetadata, idx: number) => {
            const unlocked = lvl.isUnlocked(completedLevels);
            const completed = completedLevels.includes(lvl.id);
            const stars = levelStars[lvl.id] || 0;
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={lvl.id}
                id={`level-card-${lvl.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className={`w-full flex items-center ${
                  isLeft ? 'justify-start sm:pr-24' : 'justify-end sm:pl-24'
                }`}
              >
                <div
                  className={`group relative w-full sm:w-[380px] p-5 rounded-3xl border transition-all duration-300 shadow-2xl backdrop-blur-md ${
                    unlocked
                      ? 'bg-slate-900/90 border-slate-700 hover:border-sky-400/80 hover:shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-sky-400/20">
                      {lvl.conceptTag}
                    </span>

                    {/* Star ratings or locked icon */}
                    {unlocked ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx <= stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {lvl.description}
                  </p>

                  {/* Play Action Button */}
                  {unlocked ? (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectLevel(lvl.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{completed ? 'Replay Level' : 'Launch Level'}</span>
                    </button>
                  ) : (
                    <div className="w-full text-center py-2 text-xs text-slate-600 font-medium">
                      Complete previous level to unlock
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-slate-500">
        Architectura Engine • Visual Storyboard Framework • High-Performance WebGL
      </footer>
    </div>
  );
};

