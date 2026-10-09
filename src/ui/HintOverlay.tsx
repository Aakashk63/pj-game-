import React from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

interface HintOverlayProps {
  hintText: string;
}

export const HintOverlay: React.FC<HintOverlayProps> = ({ hintText }) => {
  return (
    <div className="fixed inset-x-0 bottom-10 z-30 flex justify-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/90 border border-sky-400/50 backdrop-blur-md shadow-2xl text-sky-300 font-semibold text-xs sm:text-sm tracking-wide"
      >
        <MousePointerClick className="w-4 h-4 text-sky-400 animate-bounce" />
        <span>{hintText}</span>
      </motion.div>
    </div>
  );
};
