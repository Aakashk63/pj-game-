import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Hash, Briefcase, Mail, Camera, ArrowDown, Check, Printer, Sparkles } from 'lucide-react';
import { sounds } from '../engine/soundManager';

interface RegistrationFormOverlayProps {
  onComplete: () => void;
}

export const RegistrationFormOverlay: React.FC<RegistrationFormOverlayProps> = ({
  onComplete,
}) => {
  const [attachedFields, setAttachedFields] = useState<string[]>([]);
  const [isSavedToDb, setIsSavedToDb] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);

  const fields = [
    { id: 'name', label: 'Full Name', value: 'Alex Turner', icon: User },
    { id: 'id', label: 'Employee ID', value: 'EMP-7740', icon: Hash },
    { id: 'dept', label: 'Department', value: 'Cloud Systems', icon: Briefcase },
    { id: 'contact', label: 'Email / Phone', value: 'alex@company.com', icon: Mail },
    { id: 'photo', label: 'Photo Avatar', value: 'Verified Face ID', icon: Camera },
  ];

  const handleAttachField = (fieldId: string) => {
    if (attachedFields.includes(fieldId)) return;
    sounds.playClick();
    const next = [...attachedFields, fieldId];
    setAttachedFields(next);

    if (next.length === fields.length) {
      // All fields attached! Trigger animated database save and ID card printing
      sounds.playRise();
      setTimeout(() => {
        setIsSavedToDb(true);
        sounds.playGateBeep();
      }, 700);

      setTimeout(() => {
        setIsPrinted(true);
        sounds.playCorrectDing();
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Registration Desk Form
            </h4>
          </div>
          <span className="text-xs text-sky-400 font-semibold">
            {attachedFields.length} / {fields.length} Attached
          </span>
        </div>

        {/* Available Fields to Tap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {fields.map((f) => {
            const isAttached = attachedFields.includes(f.id);
            const IconComponent = f.icon;

            return (
              <motion.button
                key={f.id}
                whileTap={!isAttached ? { scale: 0.95 } : {}}
                onClick={() => handleAttachField(f.id)}
                disabled={isAttached}
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                  isAttached
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 opacity-90'
                    : 'bg-slate-800/80 border-slate-700 hover:border-sky-400 text-slate-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isAttached ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-sky-400'
                  }`}
                >
                  {isAttached ? <Check className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold block truncate">{f.label}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{f.value}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Database Arrow & ID Print Result */}
        <AnimatePresence>
          {isSavedToDb && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-slate-800 pt-3 space-y-3"
            >
              {/* Animated Arrow Flow to Records Database */}
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-400">
                <ArrowDown className="w-4 h-4 animate-bounce" />
                <span>Data stored in Employee Records database</span>
              </div>

              {isPrinted && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> ID Card Printed & Issued!
                      </h5>
                      <span className="text-[11px] text-slate-400">
                        Employee identity verified & enrolled.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onComplete();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
