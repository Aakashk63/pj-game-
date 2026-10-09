import React from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Eye, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { sounds } from '../engine/soundManager';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const sound = useGameStore((state) => state.settings.sound);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const reducedMotion = useGameStore((state) => state.settings.reducedMotion);
  const toggleReducedMotion = useGameStore((state) => state.toggleReducedMotion);
  const resetAllProgress = useGameStore((state) => state.resetAllProgress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Engine Settings</h3>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-3">
              {sound ? (
                <Volume2 className="w-5 h-5 text-sky-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <span className="text-sm font-semibold text-white block">Synthesizer SFX</span>
                <span className="text-xs text-slate-400">Procedural audio chimes</span>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                sound ? 'bg-sky-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-sky-400" />
              <div>
                <span className="text-sm font-semibold text-white block">Reduced Motion</span>
                <span className="text-xs text-slate-400">Mutes camera shake & tilts</span>
              </div>
            </div>
            <button
              onClick={toggleReducedMotion}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                reducedMotion ? 'bg-sky-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Danger zone / Reset Progress */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('Reset all completed levels, XP, and star progress?')) {
                resetAllProgress();
                onClose();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Save Data</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
