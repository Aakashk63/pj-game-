import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import type { StoryboardConfig, Beat, DecisionOption } from './types';
import { useGameStore } from '../store/gameStore';
import { sounds } from './soundManager';
import { playFailure, playSuccess, clearProblemHighlight, triggerShake } from './animationHelpers';
import { MainScene } from '../scenes/MainScene';
import { CaptionBar } from '../ui/CaptionBar';
import { ProgressDots } from '../ui/ProgressDots';
import { XpBar } from '../ui/XpBar';
import { DecisionPrompt } from '../ui/DecisionPrompt';
import { ConceptCardModal } from '../ui/ConceptCardModal';
import { QuizModal } from '../ui/QuizModal';
import { HintOverlay } from '../ui/HintOverlay';
import { SettingsModal } from '../ui/SettingsModal';
import { VerificationStationOverlay } from '../ui/VerificationStationOverlay';
import { RegistrationFormOverlay } from '../ui/RegistrationFormOverlay';
import { RoleAssignmentOverlay } from '../ui/RoleAssignmentOverlay';
import { CacheStationOverlay } from '../ui/CacheStationOverlay';
import { QueueStationOverlay } from '../ui/QueueStationOverlay';
import { AccessMatrixOverlay } from '../ui/AccessMatrixOverlay';
import { DoorGuardOverlay } from '../ui/DoorGuardOverlay';
import { LoadBalancerOverlay } from '../ui/LoadBalancerOverlay';
import { ArchitectureExplanationPanel } from '../ui/ArchitectureExplanationPanel';
import { RotateCcw, ShieldCheck, ShieldAlert, Zap, Layers } from 'lucide-react';

interface BeatRunnerProps {
  config: StoryboardConfig;
}

export const BeatRunner: React.FC<BeatRunnerProps> = ({ config }) => {
  const currentBeatIndex = useGameStore((state) => state.currentBeatIndex);
  const nextBeat = useGameStore((state) => state.nextBeat);
  const setBeatIndex = useGameStore((state) => state.setBeatIndex);
  const updateSimState = useGameStore((state) => state.updateSimState);
  const recordDecisionOutcome = useGameStore((state) => state.recordDecisionOutcome);
  const finishLevel = useGameStore((state) => state.finishLevel);
  const exitToMap = useGameStore((state) => state.exitToMap);
  const isLevel0 = config.id === 'level_0';
  const isLevelLB = config.id === 'level_lb';
  const isLevel1 = config.id === 'level_1';
  const isLevel2 = config.id === 'level_2';
  const isLevel3 = config.id === 'level_3';
  const isLevel4 = config.id === 'level_4';

  const [selectedDecisionOption, setSelectedDecisionOption] = useState<DecisionOption | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [outcomeFailed, setOutcomeFailed] = useState(false);
  const [showExplanationPanel, setShowExplanationPanel] = useState(false);
  const [activeExplanationOption, setActiveExplanationOption] = useState<DecisionOption | null>(null);

  const currentBeat: Beat | undefined = config.beats[currentBeatIndex];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear timers on beat switch
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
  }, []);

  // Handle Beat Transitions
  useEffect(() => {
    clearTimers();
    if (!currentBeat) return;

    // Reset temporary states
    if (currentBeat.type !== 'outcome') {
      clearProblemHighlight();
    }

    // 1. Cinematic Beat
    if (currentBeat.type === 'cinematic') {
      sounds.playWhoosh();

      if (isLevel1) {
        if (currentBeat.id === 'beat1_entrance') {
          updateSimState({
            hasGuardAtGate: false,
            barrierOpen: true,
            tokenCardVisible: false,
          });
        } else if (currentBeat.id === 'beat4_guard_asks') {
          updateSimState({
            hasGuardAtGate: true,
            barrierOpen: false,
            guardPose: 'stop',
          });
        } else if (currentBeat.id === 'beat8_token_fast_lane') {
          updateSimState({
            hasGuardAtGate: true,
            barrierOpen: true,
            guardPose: 'thumbs_up',
            tokenCardVisible: true,
          });
        }
      }

      if (currentBeat.autoAdvance && currentBeat.duration) {
        timerRef.current = setTimeout(() => {
          nextBeat();
        }, currentBeat.duration * 1000);
      }
    }

    // 2. Interact Beat
    if (currentBeat.type === 'interact') {
      sounds.playClick();
      if (isLevel1 && currentBeat.id === 'beat5_verification_station') {
        updateSimState({
          hasGuardAtGate: true,
          barrierOpen: false,
          guardPose: 'stop',
        });
      }
    }

    // 3. Simulate Beat
    if (currentBeat.type === 'simulate') {
      sounds.playRise();
      let elapsed = 0;
      const intervalMs = 100;

      if (isLevel1 && currentBeat.id === 'beat2_crowd_grows') {
        updateSimState({
          hasGuardAtGate: false,
          barrierOpen: true,
        });
      } else if (isLevel1 && currentBeat.id === 'beat9_rush_hour') {
        updateSimState({
          hasGuardAtGate: true,
          barrierOpen: true,
          guardPose: 'thumbs_up',
          verifiedCount: 48,
          blockedCount: 3,
        });
      }

      simIntervalRef.current = setInterval(() => {
        elapsed += 0.1;
        const progress = Math.min(1.0, elapsed / currentBeat.simDuration);
        const load = Math.min(100, Math.floor(15 + progress * 85));

        // When problem triggers
        if (elapsed >= currentBeat.problemTriggerTime && currentBeat.problemTriggerTime < 100) {
          sounds.playAlarm();
          triggerShake(0.8, 0.5);

          if (isLevel1 && currentBeat.id === 'beat2_crowd_grows') {
            updateSimState({
              highlightedTarget: 'gate_entrance',
              highlightLabel: 'No Verification: Stolen Laptop',
            });
          } else if (isLevelLB && currentBeat.id === 'beat2_uneven_surge') {
            updateSimState({
              highlightedTarget: 'office_1',
              highlightLabel: 'Office 1 Overloaded (100%), Office 2 Empty (0%)!',
              currentLoad: 100,
              status: 'overloaded',
              doorsJammed: true,
            });
          } else if (isLevel2 && currentBeat.id === 'beat2_everyone_goes_everywhere') {
            updateSimState({
              highlightedTarget: 'finance_room',
              highlightLabel: 'Confidential Leak: Intern opened Finance Room!',
              doorsJammed: false,
              status: 'overloaded',
            });
          } else if (isLevel3 && currentBeat.id === 'beat2_db_bottleneck') {
            updateSimState({
              highlightedTarget: 'database_cluster',
              highlightLabel: '100% Disk I/O Saturation: Repetitive Queries!',
              doorsJammed: true,
              status: 'overloaded',
            });
          } else if (isLevel4 && currentBeat.id === 'beat2_sync_bottleneck') {
            updateSimState({
              highlightedTarget: 'queue_bay',
              highlightLabel: 'HTTP 504 Gateway Timeout: Synchronous Thread Freeze!',
              doorsJammed: true,
              status: 'overloaded',
            });
          } else if (currentBeat.problemDescription) {
            updateSimState({
              highlightedTarget: isLevelLB ? 'office_1' : 'gate_entrance',
              highlightLabel: currentBeat.problemDescription,
              doorsJammed: true,
              status: 'overloaded',
            });
          } else {
            updateSimState({
              currentLoad: load,
              status: load > 85 ? 'overloaded' : 'stressed',
              doorsJammed: load > 85,
            });
          }
        } else if (isLevel0) {
          updateSimState({
            currentLoad: load,
            status: 'normal',
          });
        } else if (isLevelLB && currentBeat.id === 'beat5_balanced_rush_hour') {
          updateSimState({
            currentLoad: 50,
            status: 'healthy_split',
            doorsJammed: false,
          });
        } else if (isLevel3 && currentBeat.id === 'beat5_cache_surge') {
          updateSimState({
            currentLoad: 4,
            status: 'normal',
            doorsJammed: false,
          });
        } else if (isLevel4 && currentBeat.id === 'beat5_queue_surge') {
          updateSimState({
            currentLoad: 15,
            status: 'normal',
            doorsJammed: false,
          });
        }

        if (elapsed >= currentBeat.simDuration) {
          clearTimers();
          if (
            currentBeat.id !== 'beat9_rush_hour' &&
            currentBeat.id !== 'beat5_balanced_rush_hour' &&
            currentBeat.id !== 'beat5_cache_surge' &&
            currentBeat.id !== 'beat5_queue_surge'
          ) {
            sounds.playAlarm();
          }
          setTimeout(() => {
            nextBeat();
          }, 800);
        }
      }, intervalMs);
    }

    // 4. Decision Beat
    if (currentBeat.type === 'decision') {
      sounds.playWhoosh();
      setSelectedDecisionOption(null);
      setOutcomeFailed(false);
      clearProblemHighlight();
      updateSimState({ selectedDecision: null });
    }

    // 5. Outcome Beat
    if (currentBeat.type === 'outcome') {
      playSuccess();
    }

    return () => {
      clearTimers();
    };
  }, [currentBeatIndex, config.id]);

  // Player interacted with plot
  const handlePlotInteract = () => {
    if (currentBeat?.type === 'interact' && isLevel0) {
      sounds.playRise();
      updateSimState({
        buildingPlaced: true,
        buildingFloors: 1,
        status: 'normal',
      });
      nextBeat();
    }
  };

  // Player selected an architecture option
  const handleSelectOption = (opt: DecisionOption) => {
    sounds.playClick();
    setSelectedDecisionOption(opt);
    updateSimState({ selectedDecision: opt.id });
  };

  // Player confirmed their architecture decision
  const handleConfirmDecision = () => {
    if (!selectedDecisionOption) return;

    const isCorrect = selectedDecisionOption.isCorrect;
    recordDecisionOutcome(isCorrect);
    setActiveExplanationOption(selectedDecisionOption);
    setShowExplanationPanel(true);

    if (isCorrect) {
      setOutcomeFailed(false);
      sounds.playSuccess();
      if (isLevel0) {
        updateSimState({
          status: 'healthy_split',
          doorsJammed: false,
          buildingCount: 2,
          currentLoad: 40,
          selectedDecision: selectedDecisionOption.id,
        });
      } else if (isLevelLB) {
        updateSimState({
          status: 'healthy_split',
          doorsJammed: false,
          currentLoad: 50,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: null,
          highlightLabel: null,
        });
      } else if (isLevel3) {
        updateSimState({
          status: 'normal',
          doorsJammed: false,
          currentLoad: 4,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: null,
          highlightLabel: null,
        });
      } else if (isLevel4) {
        updateSimState({
          status: 'normal',
          doorsJammed: false,
          currentLoad: 15,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: null,
          highlightLabel: null,
        });
      } else {
        updateSimState({
          hasGuardAtGate: true,
          barrierOpen: true,
          guardPose: 'thumbs_up',
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: null,
          highlightLabel: null,
        });
      }
    } else {
      setOutcomeFailed(true);
      sounds.playFailure();
      sounds.playAlarm();
      triggerShake(1.2, 0.7);

      if (isLevel0) {
        playFailure('building_hq_tower');
        updateSimState({
          status: 'overloaded',
          doorsJammed: true,
          buildingFloors: 3,
          currentLoad: 100,
          selectedDecision: selectedDecisionOption.id,
        });
      } else if (isLevelLB) {
        updateSimState({
          status: 'overloaded',
          doorsJammed: true,
          currentLoad: 100,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: 'office_1',
          highlightLabel: selectedDecisionOption.feedbackText,
        });
      } else if (isLevel1) {
        updateSimState({
          status: 'overloaded',
          doorsJammed: true,
          currentLoad: 100,
          barrierOpen: true,
          hasGuardAtGate: selectedDecisionOption.id === 'opt_ask_name',
          guardPose: selectedDecisionOption.id === 'opt_ask_name' ? 'thumbs_up' : 'stop',
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: 'gate_entrance',
          highlightLabel: selectedDecisionOption.feedbackText,
        });
      } else if (isLevel2) {
        updateSimState({
          status: 'overloaded',
          doorsJammed: false,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: 'finance_room',
          highlightLabel: selectedDecisionOption.feedbackText,
        });
      } else if (isLevel3) {
        updateSimState({
          status: 'overloaded',
          doorsJammed: true,
          currentLoad: 100,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: 'database_cluster',
          highlightLabel: selectedDecisionOption.feedbackText,
        });
      } else if (isLevel4) {
        updateSimState({
          status: 'overloaded',
          doorsJammed: true,
          currentLoad: 100,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: 'queue_bay',
          highlightLabel: selectedDecisionOption.feedbackText,
        });
      } else {
        updateSimState({
          barrierOpen: true,
          selectedDecision: selectedDecisionOption.id,
          highlightedTarget: 'gate_entrance',
          highlightLabel: selectedDecisionOption.feedbackText,
        });
      }
    }
  };

  // Proceed to next beat from explanation panel
  const handleProceedFromExplanation = () => {
    setShowExplanationPanel(false);
    setActiveExplanationOption(null);
    nextBeat();
  };

  // Retry decision
  const handleRetryDecision = () => {
    sounds.playClick();
    clearProblemHighlight();
    setOutcomeFailed(false);
    setShowExplanationPanel(false);
    setActiveExplanationOption(null);
    setSelectedDecisionOption(null);
    updateSimState({
      barrierOpen: false,
      hasGuardAtGate: true,
      guardPose: 'stop',
      highlightedTarget: null,
      highlightLabel: null,
      selectedDecision: null,
      doorsJammed: false,
      status: 'normal',
      buildingFloors: 1,
    });
    const decisionBeatIdx = config.beats.findIndex((b) => b.type === 'decision');
    if (decisionBeatIdx !== -1) {
      setBeatIndex(decisionBeatIdx);
    }
  };

  // Concept card continue
  const handleConceptContinue = () => {
    sounds.playClick();
    nextBeat();
  };

  // Quiz completed
  const handleQuizComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      finishLevel(config.id, 2, currentBeat?.type === 'quiz' ? currentBeat.xpReward : 200);
      exitToMap();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Viewport */}
      <Canvas
        shadows
        camera={{
          position: [18, 17, 18],
          fov: 38,
          near: 0.1,
          far: 200,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <MainScene
          currentBeat={currentBeat}
          onPlotInteract={handlePlotInteract}
          onSelectDecision={handleSelectOption}
          hideDecisionDioramas={showExplanationPanel || outcomeFailed}
        />
      </Canvas>

      {/* Top HUD: XP, Stars, Map Button, Audio & Settings */}
      <XpBar onOpenSettings={() => setShowSettings(true)} />

      {/* Top Right Progress Tracker */}
      <ProgressDots
        beats={config.beats}
        currentIndex={currentBeatIndex}
        onSelectBeat={(idx) => {
          if (idx <= currentBeatIndex) {
            setBeatIndex(idx);
          }
        }}
      />

      {/* Center Top Cinematic Caption Bar (Max 12 words) */}
      <CaptionBar
        caption={
          outcomeFailed
            ? (selectedDecisionOption?.feedbackText || 'Bottleneck detected! Check system architecture.')
            : currentBeat?.caption
        }
        panelBadge={currentBeat?.panelNumber}
        panelTitle={currentBeat?.panelTitle}
        canAdvance={
          currentBeat?.type === 'cinematic' ||
          (currentBeat?.type === 'outcome' && !outcomeFailed)
        }
        onAdvance={nextBeat}
        onSkip={nextBeat}
        beatType={currentBeat?.type}
      />

      {/* Rush Hour Live Counter */}
      {currentBeat?.type === 'simulate' && currentBeat.showRushHourCounter && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/50 shadow-2xl backdrop-blur-md">
          {isLevel3 ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Zap className="w-4 h-4" />
                <span>Cache Hits: 98%</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                <span>RAM Latency: 1.2ms</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
                <span>DB Disk Load: 4% (Resting)</span>
              </div>
            </>
          ) : isLevel4 ? (
            <>
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                <Layers className="w-4 h-4" />
                <span>Queue Depth: 12 Jobs</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <span>Front Desk: HTTP 202 (2ms)</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
                <span>Worker Pool: 4 Steady</span>
              </div>
            </>
          ) : isLevel2 ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified: 3</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
                <span>Allowed: 2</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Denied: 1</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified: 48</span>
              </div>
              <div className="w-px h-3.5 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Blocked: 3</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Interaction Hint */}
      {currentBeat?.type === 'interact' &&
        currentBeat.interactionMode !== 'verify_queue' &&
        currentBeat.interactionMode !== 'registration_form' &&
        currentBeat.interactionMode !== 'assign_roles' &&
        currentBeat.interactionMode !== 'cache_station' &&
        currentBeat.interactionMode !== 'queue_station' &&
        currentBeat.interactionMode !== 'build_matrix' &&
        currentBeat.interactionMode !== 'door_guard' && (
          <HintOverlay hintText={currentBeat.hintText} />
        )}

      {/* Level 1: Beat 5 Interactive Guard Verification Station */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'verify_queue' && (
        <VerificationStationOverlay
          onAllCompleted={() => {
            sounds.playSuccess();
            nextBeat();
          }}
          onBarrierChange={(isOpen) => {
            updateSimState({
              barrierOpen: isOpen,
              guardPose: isOpen ? 'thumbs_up' : 'stop',
            });
          }}
        />
      )}

      {/* Level 1: Beat 7 Interactive Registration Desk */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'registration_form' && (
        <RegistrationFormOverlay
          onComplete={() => {
            sounds.playSuccess();
            nextBeat();
          }}
        />
      )}

      {/* Level 2: Beat 5 Interactive Access Matrix Builder */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'build_matrix' && (
        <AccessMatrixOverlay
          onComplete={() => {
            sounds.playSuccess();
            nextBeat();
          }}
        />
      )}

      {/* Level 2: Beat 8 Interactive Door Guard Mini-Game */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'door_guard' && (
        <DoorGuardOverlay
          onComplete={() => {
            sounds.playSuccess();
            nextBeat();
          }}
        />
      )}

      {/* Level 2 / Generic: Interactive Role Assignment (RBAC) */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'assign_roles' && (
        <RoleAssignmentOverlay
          onAllCompleted={() => {
            sounds.playSuccess();
            nextBeat();
          }}
        />
      )}

      {/* Level 3: Beat 4 Interactive In-Memory Cache Station (Redis) */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'cache_station' && (
        <CacheStationOverlay
          onComplete={() => {
            sounds.playSuccess();
            nextBeat();
          }}
        />
      )}

      {/* Level 4: Beat 4 Interactive Message Queue Station (RabbitMQ/Kafka) */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'queue_station' && (
        <QueueStationOverlay
          onComplete={() => {
            sounds.playSuccess();
            nextBeat();
          }}
        />
      )}

      {/* Level 1: Beat 4 Interactive Load Balancer Station */}
      {currentBeat?.type === 'interact' && currentBeat.interactionMode === 'load_balancer_station' && (
        <LoadBalancerOverlay
          onComplete={() => {
            sounds.playSuccess();
            updateSimState({
              status: 'healthy_split',
              doorsJammed: false,
              highlightedTarget: null,
              highlightLabel: null,
            });
            nextBeat();
          }}
        />
      )}

      {/* Decision Choices Prompt */}
      {currentBeat?.type === 'decision' && !outcomeFailed && !showExplanationPanel && (
        <DecisionPrompt
          question={currentBeat.question}
          options={currentBeat.options}
          selectedOption={selectedDecisionOption}
          onSelectOption={handleSelectOption}
          onConfirmChoice={handleConfirmDecision}
        />
      )}

      {/* Detailed System Design Architecture Explanation Panel */}
      {showExplanationPanel && activeExplanationOption && (
        <ArchitectureExplanationPanel
          option={activeExplanationOption}
          onRetry={handleRetryDecision}
          onContinue={handleProceedFromExplanation}
        />
      )}

      {/* Failure Outcome Retry Action (fallback if panel minimized) */}
      {outcomeFailed && !showExplanationPanel && (
        <div className="fixed inset-x-0 bottom-10 z-40 flex justify-center pointer-events-auto">
          <button
            onClick={handleRetryDecision}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wider uppercase shadow-2xl shadow-rose-600/40 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Alternate Architecture</span>
          </button>
        </div>
      )}

      {/* Success Outcome Continue Action */}
      {currentBeat?.type === 'outcome' && !outcomeFailed && (
        <div className="fixed inset-x-0 bottom-10 z-30 flex justify-center pointer-events-auto">
          <button
            onClick={nextBeat}
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-2xl shadow-emerald-500/40 transition-all active:scale-95"
          >
            <span>Learn Architecture Blueprint</span>
          </button>
        </div>
      )}

      {/* Concept Card Modal at Level End */}
      {currentBeat?.type === 'concept' && (
        <ConceptCardModal
          concept={currentBeat.concept}
          onContinueToQuiz={handleConceptContinue}
        />
      )}

      {/* Visual Quiz Challenge Modal */}
      {currentBeat?.type === 'quiz' && (
        <QuizModal
          quiz={currentBeat}
          onComplete={handleQuizComplete}
        />
      )}

      {/* App Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

