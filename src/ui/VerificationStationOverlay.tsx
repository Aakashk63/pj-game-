import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Scan, UserX, UserCheck } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export interface VerificationVisitor {
  id: string;
  name: string;
  empId: string;
  dept: string;
  avatarColor: string;
  hasValidCard: boolean;
  isFake: boolean;
  photoMatch: boolean;
}

const VISITORS: VerificationVisitor[] = [
  { id: 'v1', name: 'Alex Chen', empId: 'EMP-4092', dept: 'Engineering', avatarColor: '#38bdf8', hasValidCard: true, isFake: false, photoMatch: true },
  { id: 'v2', name: 'Sarah Lynn', empId: 'EMP-2088', dept: 'Operations', avatarColor: '#a855f7', hasValidCard: true, isFake: false, photoMatch: true },
  { id: 'v3', name: 'Unknown Guest', empId: 'EMP-9999 (FAKE)', dept: 'Unlisted', avatarColor: '#ef4444', hasValidCard: true, isFake: true, photoMatch: false },
  { id: 'v4', name: 'David Kim', empId: 'EMP-1021', dept: 'Systems', avatarColor: '#3b82f6', hasValidCard: true, isFake: false, photoMatch: true },
  { id: 'v5', name: 'Maya Patel', empId: 'EMP-3044', dept: 'Security', avatarColor: '#10b981', hasValidCard: true, isFake: false, photoMatch: true },
];

interface VerificationStationOverlayProps {
  onAllCompleted: (accuracy: number) => void;
  onBarrierChange: (isOpen: boolean) => void;
}

export const VerificationStationOverlay: React.FC<VerificationStationOverlayProps> = ({
  onAllCompleted,
  onBarrierChange,
}) => {
  const [visitorIndex, setVisitorIndex] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [verdict, setVerdict] = useState<'match' | 'denied' | null>(null);
  const [correctDecisions, setCorrectDecisions] = useState(0);

  const currentVisitor = VISITORS[visitorIndex];
  const isDone = visitorIndex >= VISITORS.length;

  const handleScanCard = () => {
    sounds.playScan();
    setScanned(true);
  };

  const handleAllowEntry = () => {
    if (!scanned) return;
    const isCorrect = !currentVisitor.isFake;
    if (isCorrect) {
      sounds.playCorrectDing();
      sounds.playGateBeep();
      setCorrectDecisions((c) => c + 1);
      setVerdict('match');
      onBarrierChange(true);
    } else {
      sounds.playDenyBuzz();
      setVerdict('match'); // Wrongly allowed
      onBarrierChange(true);
    }

    setTimeout(() => {
      onBarrierChange(false);
      advanceToNext();
    }, 1200);
  };

  const handleDenyEntry = () => {
    if (!scanned) return;
    const isCorrect = currentVisitor.isFake;
    if (isCorrect) {
      sounds.playCorrectDing();
      setCorrectDecisions((c) => c + 1);
    } else {
      sounds.playDenyBuzz();
    }
    sounds.playDenyBuzz();
    setVerdict('denied');

    setTimeout(() => {
      advanceToNext();
    }, 1200);
  };

  const advanceToNext = () => {
    setScanned(false);
    setVerdict(null);
    const nextIdx = visitorIndex + 1;
    if (nextIdx >= VISITORS.length) {
      const accuracy = Math.round(((correctDecisions + 1) / VISITORS.length) * 100);
      onAllCompleted(accuracy);
    } else {
      setVisitorIndex(nextIdx);
    }
  };

  if (isDone) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">
              {visitorIndex + 1}
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Gate Inspection ({visitorIndex + 1} of {VISITORS.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Employee #{currentVisitor.empId}
          </span>
        </div>

        {/* Visitor Card Inspection Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Visitor's Presented ID */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <div
              className="w-12 h-14 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0"
              style={{ backgroundColor: currentVisitor.avatarColor }}
            >
              ID
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Presented Badge
              </span>
              <h5 className="text-sm font-bold text-white">{currentVisitor.name}</h5>
              <span className="text-xs text-sky-400">{currentVisitor.dept}</span>
            </div>
          </div>

          {/* Database Match Lookup */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Records Lookup
              </span>
              {scanned ? (
                currentVisitor.isFake ? (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1 mt-1">
                    <X className="w-3.5 h-3.5" /> ID NOT FOUND IN DB
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                    <Check className="w-3.5 h-3.5" /> VERIFIED EMPLOYEE
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-500 italic mt-1 block">
                  Waiting for RFID scan...
                </span>
              )}
            </div>

            {!scanned && (
              <button
                onClick={handleScanCard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Scan</span>
              </button>
            )}
          </div>
        </div>

        {/* Result Feedback Pop-up */}
        <AnimatePresence>
          {verdict && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-2xl mb-4 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                verdict === 'match'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {verdict === 'match' ? (
                <>
                  <UserCheck className="w-4 h-4" /> Details match: Allow entry
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4" /> Details don't match: Access denied
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Decision Buttons */}
        {scanned && !verdict && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDenyEntry}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Deny Entry</span>
            </button>
            <button
              onClick={handleAllowEntry}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Allow Entry</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
