import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizBeat, QuizOption } from '../engine/types';
import { CheckCircle2, XCircle, Award, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { sounds } from '../engine/soundManager';

interface QuizModalProps {
  quiz: QuizBeat;
  onComplete: (isCorrect: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  onComplete,
}) => {
  // Questions array: default to quiz options, or multi-question if available
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showTeaser, setShowTeaser] = useState<boolean>(false);

  const questions = quiz.questions && quiz.questions.length > 0
    ? quiz.questions
    : quiz.id === 'beat11_quiz_auth'
    ? [
        {
          question: quiz.question,
          options: quiz.options,
          explanation: quiz.explanation,
        },
        {
          question: 'A new user logs in for the first time. What must happen first?',
          options: [
            {
              id: 'q2_wrong_skip',
              label: 'Skip checking and let them in immediately',
              diagramDescription: 'Zero verification: High risk',
              isCorrect: false,
            },
            {
              id: 'q2_correct_register',
              label: 'Register credentials and store details in user database',
              diagramDescription: 'Enrollment: Create identity record',
              isCorrect: true,
            },
            {
              id: 'q2_wrong_name',
              label: 'Ask for their name only without saving records',
              diagramDescription: 'No proof: Claims cannot be verified',
              isCorrect: false,
            },
          ],
          explanation: 'First-time users must register their credentials so the authentication system has a stored record to verify them against in the future.',
        },
      ]
    : [
        {
          question: quiz.question,
          options: quiz.options,
          explanation: quiz.explanation,
        },
      ];

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelect = (option: QuizOption) => {
    if (hasSubmitted && isCorrect) return;
    setSelectedOptionId(option.id);
    setHasSubmitted(true);

    if (option.isCorrect) {
      sounds.playSuccess();
      sounds.playCorrectDing();
    } else {
      sounds.playDenyBuzz();
    }
  };

  const handleNextQuestionOrFinish = () => {
    if (currentQuestionIndex < questions.length - 1) {
      sounds.playClick();
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    } else {
      sounds.playXpStar();
      setShowTeaser(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
      >
        {!showTeaser ? (
          <>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                    Architecture Challenge
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{quiz.xpReward} XP</span>
              </div>
            </div>

            {/* Question Title */}
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 leading-snug">
              {currentQ.question}
            </h3>

            {/* Visual Diagram Options */}
            <div className="space-y-3 mb-5">
              {currentQ.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const showSuccess = hasSubmitted && isSelected && option.isCorrect;
                const showError = hasSubmitted && isSelected && !option.isCorrect;

                return (
                  <motion.button
                    key={option.id}
                    whileHover={!hasSubmitted ? { scale: 1.01 } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 relative flex items-center justify-between ${
                      showSuccess
                        ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/50'
                        : showError
                        ? 'bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/50'
                        : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                        {option.label}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {option.diagramDescription}
                      </p>
                    </div>

                    {showSuccess && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-3" />
                    )}
                    {showError && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-3" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback & Explanation */}
            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl mb-5 text-xs leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/50 border border-rose-500/30 text-rose-200'
                }`}
              >
                {isCorrect ? (
                  <p>
                    <strong className="text-emerald-400">Correct!</strong> {currentQ.explanation}
                  </p>
                ) : (
                  <p>
                    <strong className="text-rose-400">Not quite!</strong> Review the definition and try selecting the verification choice.
                  </p>
                )}
              </motion.div>
            )}

            {/* Advance to next question or complete */}
            {hasSubmitted && isCorrect && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestionOrFinish}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  <span>
                    {currentQuestionIndex < questions.length - 1
                      ? 'Next Question'
                      : 'Claim Level Rewards'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Level 2 Teaser & Reward Modal */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-2xl font-black text-white mb-1">Level 1 Complete!</h3>
            <p className="text-xs text-slate-400 mb-6">
              You mastered Authentication: identity verification at the perimeter.
            </p>

            {/* Level 2 Teaser Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2 text-sky-400">
                <Lock className="w-4 h-4" />
                <span className="text-xs uppercase font-extrabold tracking-wider">
                  Unlocked: Level 2 Teaser
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                "What Are You Allowed To Do?" (Authorization)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                An authenticated employee is stopped at the door of the "Finance Records Room". 
                Authentication verifies who you are. Authorization determines where you can go!
              </p>
            </div>

            <button
              onClick={() => onComplete(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-sky-500/30 active:scale-95"
            >
              <span>Return to Campus Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
