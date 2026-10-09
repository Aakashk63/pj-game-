import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SceneSimulationState } from '../engine/types';
import { sounds } from '../engine/soundManager';

export interface GameSettings {
  sound: boolean;
  reducedMotion: boolean;
  debugMode: boolean;
}

export interface GameState {
  // Navigation & Level Progress
  currentLevelId: string | null;
  currentBeatIndex: number;
  completedLevels: string[];
  levelStars: Record<string, number>; // levelId -> 1..3 stars
  xp: number;
  
  // Per-level runtime attempt tracking
  firstTrySuccess: boolean;
  hasFailedCurrentDecision: boolean;

  // Runtime Simulation State within active 3D level
  simState: SceneSimulationState;

  // App Settings
  settings: GameSettings;

  // Actions
  startLevel: (levelId: string) => void;
  exitToMap: () => void;
  nextBeat: () => void;
  prevBeat: () => void;
  setBeatIndex: (index: number) => void;
  
  updateSimState: (updater: Partial<SceneSimulationState> | ((prev: SceneSimulationState) => SceneSimulationState)) => void;
  resetSimState: () => void;

  recordDecisionOutcome: (isCorrect: boolean) => void;
  finishLevel: (levelId: string, baseStarBonus: number, xpReward: number) => void;

  toggleSound: () => void;
  toggleReducedMotion: () => void;
  resetAllProgress: () => void;
}

const initialSimState: SceneSimulationState = {
  buildingPlaced: false,
  buildingFloors: 1,
  buildingCount: 1,
  currentLoad: 0,
  capacity: 25,
  status: 'normal',
  activeEmployees: 0,
  selectedDecision: null,
  highlightedTarget: null,
  cameraShake: 0,
  doorsJammed: false,
  isConfettiActive: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLevelId: null, // Start at level select map
      currentBeatIndex: 0,
      completedLevels: [],
      levelStars: {},
      xp: 0,
      firstTrySuccess: true,
      hasFailedCurrentDecision: false,
      simState: initialSimState,
      settings: {
        sound: true,
        reducedMotion: false,
        debugMode: false,
      },

      startLevel: (levelId: string) => {
        sounds.playClick();
        set({
          currentLevelId: levelId,
          currentBeatIndex: 0,
          firstTrySuccess: true,
          hasFailedCurrentDecision: false,
          simState: { ...initialSimState },
        });
      },

      exitToMap: () => {
        sounds.playClick();
        set({
          currentLevelId: null,
          currentBeatIndex: 0,
          simState: { ...initialSimState },
        });
      },

      setBeatIndex: (index: number) => {
        set({ currentBeatIndex: Math.max(0, index) });
      },

      nextBeat: () => {
        set((state) => ({ currentBeatIndex: state.currentBeatIndex + 1 }));
      },

      prevBeat: () => {
        set((state) => ({ currentBeatIndex: Math.max(0, state.currentBeatIndex - 1) }));
      },

      updateSimState: (updater) => {
        set((state) => ({
          simState: typeof updater === 'function' ? updater(state.simState) : { ...state.simState, ...updater },
        }));
      },

      resetSimState: () => {
        set({ simState: { ...initialSimState } });
      },

      recordDecisionOutcome: (isCorrect: boolean) => {
        if (!isCorrect) {
          set({
            firstTrySuccess: false,
            hasFailedCurrentDecision: true,
          });
        }
      },

      finishLevel: (levelId: string, baseStarBonus: number, xpReward: number) => {
        const { completedLevels, levelStars, xp, firstTrySuccess } = get();
        const earnedStars = Math.min(3, Math.max(1, baseStarBonus + (firstTrySuccess ? 1 : 0)));
        const prevStars = levelStars[levelId] || 0;
        const highestStars = Math.max(prevStars, earnedStars);

        const alreadyCompleted = completedLevels.includes(levelId);
        const newCompleted = alreadyCompleted ? completedLevels : [...completedLevels, levelId];
        
        sounds.playSuccess();
        sounds.playXpStar();

        set({
          completedLevels: newCompleted,
          levelStars: { ...levelStars, [levelId]: highestStars },
          xp: xp + xpReward,
        });
      },

      toggleSound: () => {
        set((state) => {
          const nextVal = !state.settings.sound;
          sounds.enabled = nextVal;
          if (nextVal) sounds.playClick();
          return {
            settings: { ...state.settings, sound: nextVal },
          };
        });
      },

      toggleReducedMotion: () => {
        set((state) => ({
          settings: { ...state.settings, reducedMotion: !state.settings.reducedMotion },
        }));
      },

      resetAllProgress: () => {
        set({
          completedLevels: [],
          levelStars: {},
          xp: 0,
          currentLevelId: null,
          currentBeatIndex: 0,
          simState: { ...initialSimState },
        });
      },
    }),
    {
      name: 'architectura_save_data',
      partialize: (state) => ({
        completedLevels: state.completedLevels,
        levelStars: state.levelStars,
        xp: state.xp,
        settings: state.settings,
      }),
    }
  )
);

