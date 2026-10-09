import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Shield, Check, X, AlertTriangle, Sparkles, Laptop, Folder, Coins } from 'lucide-react';
import { sounds } from '../engine/soundManager';

interface AccessMatrixOverlayProps {
  onComplete: () => void;
}

interface RoomDef {
  id: string;
  name: string;
  badgeColor: string;
}

interface RoleDef {
  id: string;
  title: string;
  icon: typeof Laptop;
  badgeColor: string;
  correctRooms: string[];
}

const ROOMS: RoomDef[] = [
  { id: 'devLab', name: 'Dev Lab', badgeColor: '#38bdf8' },
  { id: 'hrRoom', name: 'HR Room', badgeColor: '#f472b6' },
  { id: 'serverRoom', name: 'Server Room', badgeColor: '#06b6d4' },
  { id: 'financeRoom', name: 'Finance Room', badgeColor: '#10b981' },
];

const ROLES: RoleDef[] = [
  { id: 'dev', title: 'Developer', icon: Laptop, badgeColor: '#2563eb', correctRooms: ['devLab'] },
  { id: 'hr', title: 'HR Employee', icon: Folder, badgeColor: '#db2777', correctRooms: ['hrRoom'] },
  { id: 'finance', title: 'Finance Mgr', icon: Coins, badgeColor: '#059669', correctRooms: ['financeRoom'] },
];

export const AccessMatrixOverlay: React.FC<AccessMatrixOverlayProps> = ({
  onComplete,
}) => {
  // Matrix state: roleId -> array of roomIds granted
  const [grants, setGrants] = useState<Record<string, string[]>>({
    dev: [],
    hr: [],
    finance: [],
  });

  const [errorBubble, setErrorBubble] = useState<string | null>(null);

  // Toggle cell
  const handleToggleCell = (roleId: string, roomId: string) => {
    sounds.playClick();
    setErrorBubble(null);

    const currentRooms = grants[roleId] || [];
    const isGranted = currentRooms.includes(roomId);

    const targetRole = ROLES.find((r) => r.id === roleId);
    const isAllowed = targetRole?.correctRooms.includes(roomId);

    if (!isGranted && !isAllowed) {
      // Wrong grant attempt: trigger "Too much access!" warning
      sounds.playDenyBuzz();
      setErrorBubble(`Too much access! ${targetRole?.title} does not need ${ROOMS.find((r) => r.id === roomId)?.name}.`);
    } else {
      sounds.playDoorBeep();
    }

    setGrants((prev) => {
      const existing = prev[roleId] || [];
      const updated = isGranted
        ? existing.filter((id) => id !== roomId)
        : [...existing, roomId];
      return { ...prev, [roleId]: updated };
    });
  };

  // Evaluate least privilege accuracy
  const totalCorrectTargets = ROLES.reduce((acc, r) => acc + r.correctRooms.length, 0); // 3
  let matches = 0;
  let falsePositives = 0;

  ROLES.forEach((r) => {
    const granted = grants[r.id] || [];
    r.correctRooms.forEach((cr) => {
      if (granted.includes(cr)) matches++;
    });
    granted.forEach((gr) => {
      if (!r.correctRooms.includes(gr)) falsePositives++;
    });
  });

  const isFullyCorrect = matches === totalCorrectTargets && falsePositives === 0;

  // Least privilege dial score (0 to 100%)
  const privilegeScore = Math.max(0, Math.min(100, Math.round((matches / totalCorrectTargets) * 100 - falsePositives * 25)));

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/98 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">
              5
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Grid className="w-4 h-4 text-sky-400" />
              Build The Permissions (Access Matrix)
            </h4>
          </div>

          {/* Mini Dial: "Only what they need" (Principle of Least Privilege) */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
              Least Privilege Dial:
            </span>
            <span
              className={`font-black font-mono ${
                privilegeScore === 100 ? 'text-emerald-400' : privilegeScore > 50 ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {privilegeScore}%
            </span>
          </div>
        </div>

        {/* 3x4 Matrix Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono uppercase">
                <th className="p-2">Role</th>
                {ROOMS.map((room) => (
                  <th key={room.id} className="p-2 text-center">
                    <span
                      style={{ color: room.badgeColor }}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 font-bold"
                    >
                      {room.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => {
                const IconComp = role.icon;
                const grantedList = grants[role.id] || [];

                return (
                  <tr key={role.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          style={{ backgroundColor: role.badgeColor }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white">{role.title}</span>
                      </div>
                    </td>

                    {ROOMS.map((room) => {
                      const isGranted = grantedList.includes(room.id);
                      const isTargetCorrect = role.correctRooms.includes(room.id);

                      return (
                        <td key={room.id} className="p-2 text-center">
                          <button
                            onClick={() => handleToggleCell(role.id, room.id)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto transition-all active:scale-90 ${
                              isGranted
                                ? isTargetCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                                  : 'bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse'
                                : isTargetCorrect
                                ? 'bg-slate-800/80 border-dashed border-sky-400/60 text-sky-400 hover:border-sky-400'
                                : 'bg-slate-800/50 border-slate-700 text-slate-600 hover:border-slate-500'
                            }`}
                          >
                            {isGranted ? (
                              isTargetCorrect ? (
                                <Check className="w-5 h-5 stroke-[3]" />
                              ) : (
                                <X className="w-5 h-5 stroke-[3]" />
                              )
                            ) : isTargetCorrect ? (
                              <span className="text-[10px] font-bold opacity-60">+</span>
                            ) : (
                              <span className="text-[10px] opacity-20">-</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Warning Alert Bubble for Wrong Grants */}
        <AnimatePresence>
          {errorBubble && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorBubble}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Proceed Action Button */}
        <button
          onClick={() => {
            sounds.playSuccess();
            onComplete();
          }}
          disabled={!isFullyCorrect}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
            isFullyCorrect
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isFullyCorrect
              ? 'Permissions Verified • Enforce Policy'
              : 'Assign Correct Rooms (Only What Each Role Needs)'}
          </span>
        </button>
      </motion.div>
    </div>
  );
};
