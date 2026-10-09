import type { StoryboardConfig } from '../engine/types';
import { level0 } from './level0';
import { levelLB } from './levelLB';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { levelReqBlueprint } from './levelReqBlueprint';

export interface LevelMetadata {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  description: string;
  conceptTag: string;
  isUnlocked: (completedLevels: string[]) => boolean;
  config: StoryboardConfig;
}

export const LEVELS: LevelMetadata[] = [
  {
    id: 'level_req_blueprint',
    levelNumber: 1,
    title: 'LEVEL 1: The Blueprint & Scope Framing',
    subtitle: 'Requirements Engineering (3D Asset Pack & Turntable)',
    description: 'Muddy empty field, 10 cement mixers, 50 workers, and complete 3D procedural asset pack gallery.',
    conceptTag: '3D Asset Gallery',
    isUnlocked: () => true,
    config: levelReqBlueprint,
  },
  {
    id: 'level_0',
    levelNumber: 0,
    title: 'Level 0: Opening Day',
    subtitle: 'Vertical vs Horizontal Scaling',
    description: 'Launch your first corporate office and learn how systems withstand sudden traffic surges.',
    conceptTag: 'System Scaling',
    isUnlocked: () => true, // Playable directly
    config: level0,
  },
  {
    id: 'level_lb',
    levelNumber: 1,
    title: 'Level 1: The Traffic Director',
    subtitle: 'Load Balancing & Reverse Proxies',
    description: 'Two offices are open, but everyone rushes to Office 1! Introduce a Load Balancer to evenly distribute traffic across your infrastructure.',
    conceptTag: 'Load Balancer',
    isUnlocked: () => true, // Playable directly
    config: levelLB,
  },
  {
    id: 'level_1',
    levelNumber: 2,
    title: 'Level 2: Who Are You?',
    subtitle: 'Authentication & Identity Verification',
    description: 'Protect the company headquarters by verifying every visitor before they step inside.',
    conceptTag: 'Authentication',
    isUnlocked: () => true, // Playable directly
    config: level1,
  },
  {
    id: 'level_2',
    levelNumber: 3,
    title: 'Level 3: What Are You Allowed To Do?',
    subtitle: 'Authorization & Access Control (RBAC)',
    description: 'Control sensitive rooms and resources by enforcing role scopes and principle of least privilege.',
    conceptTag: 'Authorization',
    isUnlocked: () => true, // Playable directly
    config: level2,
  },
  {
    id: 'level_3',
    levelNumber: 4,
    title: 'Level 4: Memory Fast-Lane',
    subtitle: 'In-Memory Caching (Redis)',
    description: 'Relieve database overload by introducing an ultra-fast memory clerk right next to the office door.',
    conceptTag: 'Caching & Redis',
    isUnlocked: () => true, // Playable directly
    config: level3,
  },
  {
    id: 'level_4',
    levelNumber: 5,
    title: 'Level 5: The Waiting Room',
    subtitle: 'Message Queues & Asynchronous Workers',
    description: 'Buffer spike traffic with a decoupled queuing bay so backend workers never drop a heavy request.',
    conceptTag: 'Message Queues',
    isUnlocked: () => true, // Playable directly
    config: level4,
  },
];

export function getLevelConfig(levelId: string): StoryboardConfig | null {
  const found = LEVELS.find((l) => l.id === levelId);
  return found?.config || null;
}

