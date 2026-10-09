import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ShieldAlert, Lock, Unlock, FileSpreadsheet, Server, Database } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export interface RoleSubject {
  id: string;
  name: string;
  role: string;
  requestedTarget: string;
  requiredScope: string;
  avatarColor: string;
  isAllowed: boolean;
  reason: string;
}

const SUBJECTS: RoleSubject[] = [
  {
    id: 's1',
    name: 'Maya Lin',
    role: 'Finance Lead',
    requestedTarget: 'Finance Payroll Vault',
    requiredScope: 'finance:read_write',
    avatarColor: '#10b981',
    isAllowed: true,
    reason: 'Role has finance:read_write scope. Access permitted.',
  },
  {
    id: 's2',
    name: 'Tim Rogers',
    role: 'Engineering Intern',
    requestedTarget: 'Finance Payroll Vault',
    requiredScope: 'finance:read_write',
    avatarColor: '#f59e0b',
    isAllowed: false,
    reason: 'Intern role only has intern:read. Missing finance scope (403 Forbidden).',
  },
  {
    id: 's3',
    name: 'Elena Rostova',
    role: 'Principal DevOps',
    requestedTarget: 'Production Server Room',
    requiredScope: 'infra:admin',
    avatarColor: '#38bdf8',
    isAllowed: true,
    reason: 'Role has infra:admin scope. Server room unlocked.',
  },
  {
    id: 's4',
    name: 'Carlos Diaz',
    role: 'Marketing Associate',
    requestedTarget: 'Production DB Cluster',
    requiredScope: 'db:root_write',
    avatarColor: '#ec4899',
    isAllowed: false,
    reason: 'Marketing role cannot access raw database. Principle of Least Privilege (403).',
  },
];

interface RoleAssignmentOverlayProps {
  onAllCompleted: () => void;
}

export const RoleAssignmentOverlay: React.FC<RoleAssignmentOverlayProps> = ({
  onAllCompleted,
}) => {
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [verdict, setVerdict] = useState<'granted' | 'denied' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentSubject = SUBJECTS[subjectIndex];
  const isDone = subjectIndex >= SUBJECTS.length;

  const handleGrantAccess = () => {
    if (verdict) return;
    const isCorrect = currentSubject.isAllowed;

    if (isCorrect) {
      sounds.playCorrectDing();
      sounds.playGateBeep();
      setVerdict('granted');
      setFeedback('200 OK: Scope verified! Room unlocked.');
    } else {
      sounds.playDenyBuzz();
      sounds.playAlarm();
      setVerdict('granted');
      setFeedback('Privilege Escalation Breach! Intern accessed secret payroll.');
    }

    setTimeout(() => {
      advance();
    }, 1400);
  };

  const handleDenyAccess = () => {
    if (verdict) return;
    const isCorrect = !currentSubject.isAllowed;

    if (isCorrect) {
      sounds.playCorrectDing();
      setVerdict('denied');
      setFeedback('403 Forbidden: Correctly enforced Least Privilege policy.');
    } else {
      sounds.playDenyBuzz();
      setVerdict('denied');
      setFeedback('Blocked Authorized Personnel! Finance Lead needs vault access.');
    }

    setTimeout(() => {
      advance();
    }, 1400);
  };

  const advance = () => {
    setVerdict(null);
    setFeedback(null);
    const nextIdx = subjectIndex + 1;
    if (nextIdx >= SUBJECTS.length) {
      onAllCompleted();
    } else {
      setSubjectIndex(nextIdx);
    }
  };

  if (isDone) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-black text-xs flex items-center justify-center">
              {subjectIndex + 1}
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              RBAC Authorization Gate ({subjectIndex + 1} of {SUBJECTS.length})
            </h4>
          </div>
          <span className="text-xs text-purple-300 font-mono">
            Scope Policy: Least Privilege
          </span>
        </div>

        {/* Access Request Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0"
                style={{ backgroundColor: currentSubject.avatarColor }}
              >
                {currentSubject.name[0]}
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">{currentSubject.name}</h5>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-medium">
                  {currentSubject.role}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Target Room
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1 justify-end">
                {currentSubject.requestedTarget.includes('Vault') ? (
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                ) : currentSubject.requestedTarget.includes('Server') ? (
                  <Server className="w-3.5 h-3.5" />
                ) : (
                  <Database className="w-3.5 h-3.5" />
                )}
                {currentSubject.requestedTarget}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Required Scope: <span className="text-sky-300">{currentSubject.requiredScope}</span>
              </span>
            </div>
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-3 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  verdict === 'granted' && currentSubject.isAllowed
                    ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                    : verdict === 'denied' && !currentSubject.isAllowed
                    ? 'bg-sky-950/70 border border-sky-500/50 text-sky-300'
                    : 'bg-rose-950/70 border border-rose-500/50 text-rose-300'
                }`}
              >
                {verdict === 'granted' && currentSubject.isAllowed ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
                <span>{feedback}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decision Actions: Grant (200 OK) vs Deny (403 Forbidden) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDenyAccess}
            disabled={verdict !== null}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-rose-950/40"
          >
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Deny (403 Forbidden)</span>
          </button>

          <button
            onClick={handleGrantAccess}
            disabled={verdict !== null}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-600/30"
          >
            <Unlock className="w-4 h-4 fill-slate-950" />
            <span>Grant Access (200 OK)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
