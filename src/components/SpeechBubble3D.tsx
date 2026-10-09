import React from 'react';
import { Html } from '@react-three/drei';
import { CreditCard, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface SpeechBubble3DProps {
  position?: [number, number, number];
  text: string; // Max 8 words
  icon?: 'idCard' | 'check' | 'x' | 'question';
  speaker?: 'guard' | 'employee' | 'intruder';
}

export const SpeechBubble3D: React.FC<SpeechBubble3DProps> = ({
  position = [0, 2.2, 0],
  text,
  icon,
  speaker = 'guard',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'idCard':
        return <CreditCard className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'check':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'x':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'question':
        return <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return null;
    }
  };

  const isGuard = speaker === 'guard';

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div className="relative flex flex-col items-center">
          {/* Main Bubble Card */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl shadow-xl border backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 ${
              isGuard
                ? 'bg-slate-900/95 border-sky-400/80 text-white shadow-sky-950/40'
                : 'bg-white/95 border-slate-300 text-slate-900 shadow-slate-950/20'
            }`}
          >
            {getIcon()}
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {text}
            </span>
          </div>

          {/* Comic Bubble Pointer Tail */}
          <div
            className={`w-3 h-3 rotate-45 -mt-1.5 border-r border-b ${
              isGuard
                ? 'bg-slate-900 border-sky-400/80'
                : 'bg-white border-slate-300'
            }`}
          />
        </div>
      </Html>
    </group>
  );
};
