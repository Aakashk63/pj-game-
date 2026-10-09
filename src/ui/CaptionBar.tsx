import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SkipForward, FastForward } from 'lucide-react';
import { THEME } from '../art/theme';

interface CaptionBarProps {
  caption?: string;
  panelBadge?: number | string;
  panelTitle?: string;
  canAdvance?: boolean;
  onAdvance?: () => void;
  onSkip?: () => void;
  beatType?: string;
}

export const CaptionBar: React.FC<CaptionBarProps> = ({
  caption,
  panelBadge,
  panelTitle,
  canAdvance = false,
  onAdvance,
  onSkip,
  beatType,
}) => {
  if (!caption) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full max-w-2xl px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={caption + String(panelBadge || '')}
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-center justify-between gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-md border pointer-events-auto"
          style={{
            backgroundColor: THEME.colors.ui.bgGlass,
            borderColor: THEME.colors.ui.cardBorderActive,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Leading Comic Panel Badge or Icon */}
          <div className="flex items-center gap-2.5 overflow-hidden">
            {panelBadge !== undefined ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-400/30">
                  {panelBadge}
                </span>
                {panelTitle && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 hidden sm:inline">
                    {panelTitle} •
                  </span>
                )}
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              </div>
            )}

            {/* Micro Caption text (max 12 words) */}
            <span className="text-slate-100 font-semibold text-sm sm:text-base tracking-wide select-none drop-shadow-sm truncate">
              {caption}
            </span>
          </div>

          {/* Action Buttons: Skip for cinematics, Continue for playable beats */}
          <div className="flex items-center gap-2 shrink-0">
            {beatType === 'cinematic' && onSkip && (
              <button
                onClick={onSkip}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] tracking-wider uppercase transition-all shadow-sm active:scale-95"
                title="Skip cinematic"
              >
                <span>Skip</span>
                <FastForward className="w-3 h-3 text-slate-400" />
              </button>
            )}

            {canAdvance && onAdvance && beatType !== 'interact' && (
              <button
                onClick={onAdvance}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
              >
                <span>Continue</span>
                <SkipForward className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
