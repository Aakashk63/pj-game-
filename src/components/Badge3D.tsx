import React from 'react';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Badge3DProps {
  position: [number, number, number];
  type: 'check' | 'x';
  label?: string;
}

export const Badge3D: React.FC<Badge3DProps> = ({
  position,
  type,
  label,
}) => {
  const isCheck = type === 'check';

  return (
    <Html position={position} center distanceFactor={6.5} style={{ pointerEvents: 'none' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xl border-2 text-xs font-black text-white whitespace-nowrap ${
          isCheck
            ? 'bg-emerald-600 border-white shadow-emerald-500/30'
            : 'bg-rose-600 border-white shadow-rose-500/30'
        }`}
      >
        {isCheck ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
        {label && <span>{label}</span>}
      </motion.div>
    </Html>
  );
};
