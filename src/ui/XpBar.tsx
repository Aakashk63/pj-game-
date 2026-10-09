import React from 'react';
import { Trophy, Star, Volume2, VolumeX, Settings, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface XpBarProps {
  onOpenSettings: () => void;
  showBackToMap?: boolean;
}

export const XpBar: React.FC<XpBarProps> = ({
  onOpenSettings,
  showBackToMap = true,
}) => {
  const xp = useGameStore((state) => state.xp);
  const starsMap = useGameStore((state) => state.levelStars);
  const soundEnabled = useGameStore((state) => state.settings.sound);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const exitToMap = useGameStore((state) => state.exitToMap);

  const totalStars = Object.values(starsMap).reduce((a, b) => a + b, 0);

  // Derive Rank title from XP
  const getRank = (xpVal: number) => {
    if (xpVal >= 500) return 'Distinguished Architect';
    if (xpVal >= 300) return 'Principal SRE';
    if (xpVal >= 150) return 'Systems Engineer';
    return 'Junior Builder';
  };

  return (
    <div className="fixed top-6 left-6 z-30 flex items-center gap-3">
      {/* Back to Level Map */}
      {showBackToMap && (
        <button
          onClick={exitToMap}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Return to Campus Map"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Map</span>
        </button>
      )}

      {/* Rank & XP Pill */}
      <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Trophy className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wide">{xp} XP</span>
        </div>

        <div className="w-px h-3.5 bg-slate-700" />

        <div className="flex items-center gap-1 text-yellow-400">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span className="text-xs font-bold">{totalStars}</span>
        </div>

        <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />

        <span className="text-xs font-medium text-slate-400 hidden sm:block">
          {getRank(xp)}
        </span>
      </div>

      {/* Audio Toggle */}
      <button
        onClick={toggleSound}
        className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-95"
        title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-sky-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Settings Modal Button */}
      <button
        onClick={onOpenSettings}
        className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-95"
        title="Settings"
      >
        <Settings className="w-4 h-4 text-slate-400 hover:text-white" />
      </button>
    </div>
  );
};
