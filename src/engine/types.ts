export type CameraShotName = 
  | 'wide'
  | 'sunriseIntro'
  | 'closeupBuilding'
  | 'gateCloseup'
  | 'deskCloseup'
  | 'decisionPullback'
  | 'topDownGrid'
  | 'failureChaos'
  | 'successCelebration'
  | 'corridorCutaway'
  | 'financeRoomCloseup'
  | 'dualCheckpoint';

export interface CameraCustomShot {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export type CameraTarget = CameraShotName | CameraCustomShot;

// Comic Dialogue Bubble
export interface SpeechBubbleItem {
  speaker: 'guard' | 'employee' | 'intruder';
  text: string; // Max 8 words
  icon?: 'idCard' | 'check' | 'x' | 'question';
  delay?: number; // Delay in seconds before appearing
}

// Base Beat definition
export interface BaseBeat {
  id: string;
  type: 'cinematic' | 'interact' | 'simulate' | 'decision' | 'outcome' | 'concept' | 'quiz';
  panelNumber?: number | string; // Comic panel number (1, 2, 3...)
  panelTitle?: string; // Panel header (e.g. "The Company Entrance")
  caption?: string; // Max 12 words
  speechBubbles?: SpeechBubbleItem[];
  cameraShot?: CameraTarget;
  duration?: number; // Optional duration in seconds before auto-advance
}

// 1. Cinematic Beat
export interface CinematicBeat extends BaseBeat {
  type: 'cinematic';
  autoAdvance?: boolean;
  onEnterAction?: string;
}

// 2. Interact Beat
export interface InteractBeat extends BaseBeat {
  type: 'interact';
  targetId: string;
  hintText: string;
  actionType: 'click' | 'drag' | 'tap';
  completionEvent: string;
  interactionMode?: 
    | 'standard' 
    | 'verify_queue' 
    | 'registration_form' 
    | 'assign_roles' 
    | 'cache_station' 
    | 'queue_station'
    | 'build_matrix'
    | 'door_guard'
    | 'load_balancer_station';
}

// 3. Simulate Beat
export interface SimulateBeat extends BaseBeat {
  type: 'simulate';
  simDuration: number;
  trafficRate: number;
  targetCapacity: number;
  problemTriggerTime: number;
  problemDescription?: string;
  showRushHourCounter?: boolean;
}

export interface SystemDesignConceptDetails {
  conceptName: string;
  summary: string;
  buildingAnalogyEvent: string; // What happened in the building simulation
  technicalSystemReality: string; // Deep computer science / distributed systems explanation
  whyItFailsOrSucceeds: string; // Clear comparison between building and real server infrastructure
  tradeOffs?: string[];
  realWorldExample?: string;
}

// 4. Decision Option
export interface DecisionOption {
  id: string;
  title: string;
  tag: string;
  description: string;
  dioramaType: 
    | 'gate_open' 
    | 'ask_name' 
    | 'verify_id' 
    | 'scale_up_tall' 
    | 'scale_out_multi' 
    | 'cache_redis' 
    | 'load_balancer'
    | 'queue_buffer'
    | 'sync_block'
    | 'master_key'
    | 'verify_every_door'
    | 'role_permissions';
  isCorrect: boolean;
  feedbackText: string;
  sdConcept?: SystemDesignConceptDetails;
}

export interface DecisionBeat extends BaseBeat {
  type: 'decision';
  question: string; // Max 15 words
  options: DecisionOption[];
}

// 5. Outcome Beat
export interface OutcomeBeat extends BaseBeat {
  type: 'outcome';
  targetChoiceId?: string;
  outcomeType: 'success' | 'failure';
  highlightWeakPointId?: string;
  highlightLabel?: string;
  explanationText: string;
}

// 6. Concept Card Beat
export interface ConceptCardData {
  title: string;
  subtitle: string;
  definition: string;
  analogy: string;
  diagramType: 'vertical_vs_horizontal' | 'cache_layer' | 'queue_buffer' | 'auth_mapping' | 'load_balancer';
  pros: string[];
  cons: string[];
  realWorldExamples: { company: string; usage: string }[];
  // Reference comic card enhancements
  coreIdeaBanner?: string;
  yellowBanner?: { title: string; subtext: string };
  mappingTable?: Array<{ realWorld: string; tech: string }>;
  flowSteps?: string[];
  commonMethods?: Array<{ name: string; icon: string }>;
  sideBySide?: {
    leftTitle: string;
    leftItems: string[];
    rightTitle: string;
    rightItems: string[];
  };
}

export interface ConceptBeat extends BaseBeat {
  type: 'concept';
  concept: ConceptCardData;
}

// 7. Visual Quiz Beat
export interface QuizOption {
  id: string;
  label: string;
  diagramDescription: string;
  isCorrect: boolean;
  iconName?: string;
}

export interface QuizQuestionItem {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface QuizBeat extends BaseBeat {
  type: 'quiz';
  question: string;
  options: QuizOption[];
  explanation: string;
  xpReward: number;
  questions?: QuizQuestionItem[];
  nextLevelTeaser?: {
    levelTitle: string;
    description: string;
  };
}

export type Beat =
  | CinematicBeat
  | InteractBeat
  | SimulateBeat
  | DecisionBeat
  | OutcomeBeat
  | ConceptBeat
  | QuizBeat;

export interface StoryboardConfig {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  description: string;
  beats: Beat[];
  unlockedByDefault?: boolean;
}

// Runtime Simulation State
export interface SceneSimulationState {
  buildingPlaced: boolean;
  buildingFloors: number;
  buildingCount: number;
  currentLoad: number;
  capacity: number;
  status: 'normal' | 'stressed' | 'overloaded' | 'healthy_split';
  activeEmployees: number;
  selectedDecision: string | null;
  highlightedTarget: string | null;
  cameraShake: number;
  doorsJammed: boolean;
  isConfettiActive: boolean;
  // Level 1 Authentication additions
  barrierOpen?: boolean;
  guardPose?: 'idle' | 'wave' | 'stop' | 'thumbs_up';
  hasGuardAtGate?: boolean;
  activeIntruders?: number;
  verifiedCount?: number;
  blockedCount?: number;
  tokenCardVisible?: boolean;
  highlightLabel?: string | null;
  // Level 2 Authorization additions
  cutawayVisible?: boolean;
  activeRolePedestals?: boolean;
  selectedRole?: 'developer' | 'hr' | 'finance' | 'intern' | null;
  doorLocksState?: Record<string, 'locked' | 'unlocked'>;
  salaryLeakActive?: boolean;
  checkpointStatus?: { verified: number; allowed: number; denied: number };
  // Level Load Balancer additions
  loadBalancerDeployed?: boolean;
  loadBalancerRoutingMode?: 'round_robin' | 'least_conn' | 'ip_hash';
  server1Load?: number;
  server2Load?: number;
  server1Healthy?: boolean;
  server2Healthy?: boolean;
}


