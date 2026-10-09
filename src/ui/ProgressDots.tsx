import React from 'react';
import type { Beat } from '../engine/types';

interface ProgressDotsProps {
  beats: Beat[];
  currentIndex: number;
  onSelectBeat?: (index: number) => void;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  beats,
  currentIndex,
  onSelectBeat,
}) => {
  return (
    <div className="fixed top-6 right-6 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700/50 shadow-lg">
      {beats.map((beat, idx) => {
        const isCurrent = idx === currentIndex;
        const isPast = idx < currentIndex;

        return (
          <button
            key={beat.id}
            onClick={() => onSelectBeat?.(idx)}
            title={`Beat ${idx + 1}: ${beat.type}`}
            className="group relative focus:outline-none"
          >
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-6 bg-sky-400 shadow-md shadow-sky-400/50'
                  : isPast
                  ? 'w-2.5 bg-emerald-400/80'
                  : 'w-2.5 bg-slate-600/70 group-hover:bg-slate-500'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
