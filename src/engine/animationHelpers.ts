import gsap from 'gsap';
import { useGameStore } from '../store/gameStore';
import { sounds } from './soundManager';

/**
 * Camera and structure shake helper
 */
export function triggerShake(intensity: number = 1.0, duration: number = 0.6) {
  const store = useGameStore.getState();
  const obj = { val: intensity };

  gsap.to(obj, {
    val: 0,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      store.updateSimState({ cameraShake: obj.val });
    },
    onComplete: () => {
      store.updateSimState({ cameraShake: 0 });
    }
  });
}

/**
 * Single Point of Failure highlighter
 * Activates pulsing red ring & pointing arrow over the weak element
 */
export function highlightProblem(targetId: string) {
  const store = useGameStore.getState();
  store.updateSimState({ highlightedTarget: targetId });
  sounds.playAlarm();
}

export function clearProblemHighlight() {
  const store = useGameStore.getState();
  store.updateSimState({ highlightedTarget: null });
}

/**
 * Play Failure Cinematic sequence:
 * 1. Overload sound & alarm
 * 2. Rapid camera shake
 * 3. Status changes to overloaded
 * 4. Highlighting single point of failure
 */
export function playFailure(weakPointId: string = 'building_hq_tower') {
  const store = useGameStore.getState();
  sounds.playFailure();
  sounds.playAlarm();

  store.updateSimState({
    status: 'overloaded',
    doorsJammed: true,
  });

  triggerShake(1.4, 0.9);
  highlightProblem(weakPointId);
}

/**
 * Play Success Cinematic sequence:
 * 1. Fanfare chime
 * 2. Status set to healthy_split
 * 3. Confetti burst active
 * 4. Clear any weak point warning
 */
export function playSuccess() {
  const store = useGameStore.getState();
  sounds.playSuccess();
  clearProblemHighlight();

  store.updateSimState({
    status: 'healthy_split',
    doorsJammed: false,
    isConfettiActive: true,
  });

  // Confetti timeout
  setTimeout(() => {
    store.updateSimState({ isConfettiActive: false });
  }, 4000);
}

/**
 * Crowd generator helper: returns array of initial spawn coordinates & target path
 */
export interface CrowdEntity {
  id: string;
  startPos: [number, number, number];
  targetPos: [number, number, number];
  speed: number;
  offsetPhase: number;
  colorType: 'jacket' | 'casual';
}

export function spawnCrowd(count: number, destination: [number, number, number] = [0, 0.4, 2]): CrowdEntity[] {
  const crowd: CrowdEntity[] = [];
  for (let i = 0; i < count; i++) {
    // Spawn along the road or plaza perimeter
    const angle = (i / count) * Math.PI * 0.9 + Math.PI * 0.55;
    const distance = 8.5 + (Math.random() * 2.5);
    const startX = Math.cos(angle) * distance;
    const startZ = Math.sin(angle) * distance;

    crowd.push({
      id: `emp_${i}_${Date.now()}`,
      startPos: [startX, 0.45, startZ],
      targetPos: [
        destination[0] + (Math.random() - 0.5) * 1.2,
        destination[1],
        destination[2] + (Math.random() - 0.5) * 1.2,
      ],
      speed: 0.8 + Math.random() * 0.6,
      offsetPhase: Math.random() * Math.PI * 2,
      colorType: i % 3 === 0 ? 'jacket' : 'casual',
    });
  }
  return crowd;
}
