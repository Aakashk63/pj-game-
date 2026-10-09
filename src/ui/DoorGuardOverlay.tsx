import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, AlertTriangle, Laptop, Folder, Coins, UserCheck } from 'lucide-react';
import { sounds } from '../engine/soundManager';
import type { RoleType } from '../components/RoleAvatar';

interface DoorGuardOverlayProps {
  onComplete: () => void;
  onConsequenceChange?: (consequence: 'salary_alert' | 'work_blocked' | null) => void;
}

interface QueueVisitor {
  id: string;
  name: string;
  role: RoleType;
  roleTitle: string;
  badgeColor: string;
  targetRoom: string;
  shouldAllow: boolean;
}

const QUEUE: QueueVisitor[] = [
  { id: 'v1', name: 'Alex Chen', role: 'developer', roleTitle: 'Developer (IT)', badgeColor: '#2563eb', targetRoom: 'Finance Records Room', shouldAllow: false },
  { id: 'v2', name: 'Sarah Lynn', role: 'hr', roleTitle: 'HR Specialist', badgeColor: '#db2777', targetRoom: 'Finance Records Room', shouldAllow: false },
  { id: 'v3', name: 'David Kim', role: 'finance', roleTitle: 'Finance Manager', badgeColor: '#059669', targetRoom: 'Finance Records Room', shouldAllow: true },
  { id: 'v4', name: 'Tim Rogers', role: 'intern', roleTitle: 'Intern', badgeColor: '#f59e0b', targetRoom: 'Finance Records Room', shouldAllow: false },
  { id: 'v5', name: 'Elena Rostova', role: 'finance', roleTitle: 'Finance Lead', badgeColor: '#059669', targetRoom: 'Finance Records Room', shouldAllow: true },
  { id: 'v6', name: 'Dev Patel', role: 'developer', roleTitle: 'Senior Dev', badgeColor: '#2563eb', targetRoom: 'Finance Records Room', shouldAllow: false },
];

export const DoorGuardOverlay: React.FC<DoorGuardOverlayProps> = ({
  onComplete,
  onConsequenceChange,
}) => {
  const [index, setIndex] = useState(0);
  const [verdictBadge, setVerdictBadge] = useState<{
    type: 'granted_correct' | 'denied_correct' | 'leak_error' | 'blocked_error';
    text: string;
  } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentVisitor = QUEUE[index];
  const isDone = index >= QUEUE.length;

  const handleDecision = (allow: boolean) => {
    if (verdictBadge) return;
    const isCorrect = allow === currentVisitor.shouldAllow;

    if (isCorrect) {
      sounds.playCorrectDing();
      sounds.playDoorBeep();
      setCorrectCount((c) => c + 1);

      if (allow) {
        setVerdictBadge({
          type: 'granted_correct',
          text: 'Access Granted (Permission Allowed)',
        });
      } else {
        setVerdictBadge({
          type: 'denied_correct',
          text: 'Access Denied (No Permission)',
        });
      }
      onConsequenceChange?.(null);
    } else {
      sounds.playDenyBuzz();
      if (allow && !currentVisitor.shouldAllow) {
        // Wrongly allowed non-finance into finance room!
        sounds.playAlarm();
        setVerdictBadge({
          type: 'leak_error',
          text: 'Security Breach! Salary files exposed!',
        });
        onConsequenceChange?.('salary_alert');
      } else {
        // Wrongly blocked legitimate Finance Manager!
        setVerdictBadge({
          type: 'blocked_error',
          text: 'Work Blocked! Finance Manager cannot do payroll!',
        });
        onConsequenceChange?.('work_blocked');
      }
    }

    setTimeout(() => {
      setVerdictBadge(null);
      onConsequenceChange?.(null);
      const nextIdx = index + 1;
      if (nextIdx >= QUEUE.length) {
        if (correctCount + (isCorrect ? 1 : 0) >= 5) {
          sounds.playSuccess();
          onComplete();
        } else {
          // Restart queue if less than 5 correct
          sounds.playFailure();
          setIndex(0);
          setCorrectCount(0);
        }
      } else {
        setIndex(nextIdx);
      }
    }, 1200);
  };

  if (isDone) return null;

  const RoleIcon =
    currentVisitor.role === 'developer'
      ? Laptop
      : currentVisitor.role === 'hr'
      ? Folder
      : currentVisitor.role === 'finance'
      ? Coins
      : UserCheck;

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900/98 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
              8
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Be The Door Guard ({index + 1} of {QUEUE.length})
            </h4>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            Score: {correctCount} / {QUEUE.length} (Need 5)
          </span>
        </div>

        {/* Approaching Visitor Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: currentVisitor.badgeColor }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0"
              >
                <RoleIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Approaching Personnel
                </span>
                <h5 className="text-sm font-bold text-white">{currentVisitor.name}</h5>
                <span
                  style={{ color: currentVisitor.badgeColor }}
                  className="text-xs font-bold"
                >
                  {currentVisitor.roleTitle}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Target Door
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Finance Records Room
              </span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                Rule: Finance Role Only
              </span>
            </div>
          </div>

          {/* Verdict Banner Feedback */}
          <AnimatePresence>
            {verdictBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`mt-3 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  verdictBadge.type === 'granted_correct'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : verdictBadge.type === 'denied_correct'
                    ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300'
                    : 'bg-rose-500/30 border border-rose-500/60 text-rose-300 animate-pulse'
                }`}
              >
                {verdictBadge.type.includes('correct') ? (
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{verdictBadge.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons: Deny vs Allow */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDecision(false)}
            disabled={verdictBadge !== null}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-rose-950/40"
          >
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Deny (No Permission)</span>
          </button>

          <button
            onClick={() => handleDecision(true)}
            disabled={verdictBadge !== null}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-600/30"
          >
            <Unlock className="w-4 h-4 fill-slate-950" />
            <span>Allow Entry</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
