import gsap from 'gsap';
import * as THREE from 'three';

export interface Level1SceneRefs {
  camera: THREE.Camera;
  controls?: any;
  scene: THREE.Scene;
  manager?: any;
  pourDisaster?: any;
  risingBuilding?: any;
  safetyStamp?: any;
  demoCrew?: any;
  jammedEntrance?: any;
  bareWall?: any;
  stinkCross?: any;
  trippingShoppers?: any;
  tinShed?: any;
  cityOfficer?: any;
  blueprintCrate?: any;
  freezerEntrance?: any;
}

export interface MeterValues {
  cost: number; // 0 to 100
  safety: number; // 0 to 100
  capacity: number; // 0 to 100
  costLabel?: string;
  safetyLabel?: string;
  capacityLabel?: string;
}

let activeTimeline: gsap.core.Timeline | null = null;

export function stopAllLevel1Animations(): void {
  if (activeTimeline) {
    activeTimeline.kill();
    activeTimeline = null;
  }
}

/**
 * H1. Intro Sequence:
 * Camera glides over the field to the Site Manager, who taps his hard hat and asks: "Do we pour the concrete?"
 */
export function playIntro(
  refs: Level1SceneRefs,
  onComplete?: () => void,
  onDialogue?: (text: string) => void
): gsap.core.Timeline {
  stopAllLevel1Animations();
  const tl = gsap.timeline({
    onComplete: () => {
      activeTimeline = null;
      if (onComplete) onComplete();
    },
  });
  activeTimeline = tl;

  // Initial wide panoramic camera view
  refs.camera.position.set(0, 14, 22);
  refs.camera.lookAt(0, 2, 0);

  if (refs.manager) {
    refs.manager.setExpression('asking');
    refs.manager.tapHardHat(false);
  }

  // 1. Camera swoop towards construction crew & manager
  tl.to(refs.camera.position, {
    x: 0,
    y: 4.5,
    z: 7.5,
    duration: 3.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.4, 0);
    },
  });

  // 2. Manager taps hard hat
  tl.call(() => {
    if (refs.manager) {
      refs.manager.tapHardHat(true);
      refs.manager.setExpression('asking');
    }
    if (onDialogue) {
      onDialogue('Site Manager: "Boss! All 10 mixers are ready. Do we pour the concrete right now?"');
    }
  }, undefined, 2.5);

  tl.to({}, { duration: 2.0 });

  return tl;
}

/**
 * H2. Option A Sequence (Pour first, plan later → Disaster):
 * 10-15s sequence:
 * 0-3s: Rushed pour & crooked walls rising
 * 3-7s: Reefer truck arrives with 800 tubs, but NO outlets! Freezer melts into gooey puddle
 * 7-10s: Shoppers arrive, 2 carts jam solid into narrow entrance
 * 10-14s: Demolition jackhammers break concrete, budget meter drains to red!
 */
export function playOptionA(
  refs: Level1SceneRefs,
  onMeterUpdate?: (meters: MeterValues) => void,
  onComplete?: () => void,
  onDialogue?: (text: string) => void
): gsap.core.Timeline {
  stopAllLevel1Animations();
  const tl = gsap.timeline({
    onComplete: () => {
      activeTimeline = null;
      if (onComplete) onComplete();
    },
  });
  activeTimeline = tl;

  const meters: MeterValues = { cost: 100, safety: 100, capacity: 100 };

  // Step 1: Rushed pour
  tl.call(() => {
    if (onDialogue) onDialogue('💥 STEP 1: Rushed Pour! Cement poured with zero architectural conduits!');
    if (refs.pourDisaster) refs.pourDisaster.setPourProgress(0.2);
    meters.cost = 90;
    meters.safety = 60;
    meters.capacity = 50;
    if (onMeterUpdate) onMeterUpdate({ ...meters, costLabel: '₹ Initial Pour Cost' });
  });

  tl.to(refs.camera.position, {
    x: -3,
    y: 3.8,
    z: 6,
    duration: 3.0,
    ease: 'power1.inOut',
    onUpdate: () => {
      refs.camera.lookAt(-1, 1.2, 0);
      if (refs.pourDisaster) refs.pourDisaster.setPourProgress(0.9);
    },
  });

  // Step 2: No outlets, melted ice cream
  tl.call(() => {
    if (onDialogue) onDialogue('❄️ STEP 2: Reefer truck brings 800 tubs, but the bare wall has NO sockets! Ice cream melting!');
    meters.cost = 65;
    meters.safety = 40;
    meters.capacity = 30;
    if (onMeterUpdate) onMeterUpdate({ ...meters, costLabel: '₹ Spoilage Loss (800 tubs)' });
    if (refs.manager) refs.manager.setExpression('worried');
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 2.2,
    z: 3.5,
    duration: 3.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 0.8, -0.6);
      if (refs.bareWall) refs.bareWall.setMeltSpread(1.8);
    },
  });

  // Step 3: Narrow entrance jam
  tl.call(() => {
    if (onDialogue) onDialogue('🛒 STEP 3: Narrow entrance choked! Shopping carts jammed wheel-to-wheel!');
    meters.cost = 50;
    meters.safety = 25;
    meters.capacity = 10;
    if (onMeterUpdate) onMeterUpdate({ ...meters, capacityLabel: 'Choked Throughput (10%)' });
    if (refs.manager) refs.manager.setExpression('shocked');
  });

  tl.to(refs.camera.position, {
    x: 1.5,
    y: 2.8,
    z: 4.2,
    duration: 3.0,
    ease: 'power2.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.4, 0);
    },
  });

  // Step 4: Demolition & Budget Drain
  tl.call(() => {
    if (onDialogue) onDialogue('🚨 STEP 4: Demolition crew called in to break the concrete. Budget in the RED!');
    meters.cost = 10;
    meters.safety = 15;
    meters.capacity = 0;
    if (onMeterUpdate) onMeterUpdate({ ...meters, costLabel: '₹ BANKRUPT / REWORK PENALTY' });
    if (refs.demoCrew) refs.demoCrew.setBudgetDrain(0.1);
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 5.5,
    z: 9.0,
    duration: 3.5,
    ease: 'power2.out',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.2, 0);
    },
  });

  return tl;
}

/**
 * H3. Option B Sequence (Plan first → Success):
 * 10-15s sequence:
 * 0-4s: Holographic blueprints expand, functional & non-functional badges lock in
 * 4-8s: 4-stage building rises from floor plan
 * 8-11s: Carts flow smoothly, frosted freezers hum with vapor, ceiling sprinklers ready
 * 11-14s: Safety inspector inspects -> Giant PASSED stamp thud, shockwave & celebration!
 */
export function playOptionB(
  refs: Level1SceneRefs,
  onMeterUpdate?: (meters: MeterValues) => void,
  onComplete?: () => void,
  onDialogue?: (text: string) => void
): gsap.core.Timeline {
  stopAllLevel1Animations();
  const tl = gsap.timeline({
    onComplete: () => {
      activeTimeline = null;
      if (onComplete) onComplete();
    },
  });
  activeTimeline = tl;

  const meters: MeterValues = { cost: 40, safety: 80, capacity: 50 };

  // Step 1: Blueprints & Badges
  tl.call(() => {
    if (onDialogue) onDialogue('📐 STEP 1: Requirements Framed! Functional & Non-Functional blueprints locked.');
    meters.cost = 85;
    meters.safety = 90;
    meters.capacity = 80;
    if (onMeterUpdate) onMeterUpdate({ ...meters, costLabel: '₹ Planned Budget' });
    if (refs.blueprintCrate) refs.blueprintCrate.setHologramExpanded(true);
    if (refs.manager) refs.manager.setExpression('proud');
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 3.5,
    z: 5.5,
    duration: 3.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.5, 0);
    },
  });

  // Step 2: 4-Stage Rising Building
  tl.call(() => {
    if (onDialogue) onDialogue('🏗️ STEP 2: Conduits in place. Foundation, steel frame, and roof lock in seamlessly!');
    if (refs.risingBuilding) refs.risingBuilding.setStage(2);
    meters.cost = 90;
    meters.safety = 95;
    meters.capacity = 90;
    if (onMeterUpdate) onMeterUpdate({ ...meters });
  });

  tl.to(refs.camera.position, {
    x: 4.5,
    y: 6.0,
    z: 9.0,
    duration: 3.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 2.5, 0);
      if (refs.risingBuilding) refs.risingBuilding.setStage(4);
    },
  });

  // Step 3: Wide entrance & frosted freezers
  tl.call(() => {
    if (onDialogue) onDialogue('✨ STEP 3: 4-lane entrance flows smoothly. Freezers hum at -18°C with dedicated power!');
    meters.cost = 95;
    meters.safety = 98;
    meters.capacity = 100;
    if (onMeterUpdate) onMeterUpdate({ ...meters, capacityLabel: '5,000 shoppers/day' });
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 3.2,
    z: 7.2,
    duration: 3.0,
    ease: 'power1.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.6, 2.0);
    },
  });

  // Step 4: Safety Inspector & Giant "PASSED" Stamp Thud
  tl.call(() => {
    if (onDialogue) onDialogue('🎖️ STEP 4: Municipal Safety Inspector approves with glowing green checkmarks!');
    if (refs.safetyStamp) refs.safetyStamp.triggerStampThud();
    meters.cost = 100;
    meters.safety = 100;
    meters.capacity = 100;
    if (onMeterUpdate) onMeterUpdate({ ...meters, safetyLabel: '100% Code Compliant' });
    if (refs.manager) refs.manager.setExpression('proud');
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 4.2,
    z: 6.2,
    duration: 3.5,
    ease: 'elastic.out(1, 0.75)',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.5, 0);
    },
  });

  return tl;
}

/**
 * H4. Option C Sequence (One giant shed → Chaos):
 * 10-15s sequence:
 * 0-4s: Quick tin shed built with echo sound rings
 * 4-8s: Fish stall placed next to perfume shelf! Green stink lines drift over
 * 8-11s: Loose tangled power cables trip 3 shoppers, oranges tumble everywhere
 * 11-14s: Whistle blows! Municipal officer shuts rolling shutter with "UNSAFE" sticker!
 */
export function playOptionC(
  refs: Level1SceneRefs,
  onMeterUpdate?: (meters: MeterValues) => void,
  onComplete?: () => void,
  onDialogue?: (text: string) => void
): gsap.core.Timeline {
  stopAllLevel1Animations();
  const tl = gsap.timeline({
    onComplete: () => {
      activeTimeline = null;
      if (onComplete) onComplete();
    },
  });
  activeTimeline = tl;

  const meters: MeterValues = { cost: 70, safety: 40, capacity: 60 };

  // Step 1: Open tin shed & echo
  tl.call(() => {
    if (onDialogue) onDialogue('⚡ STEP 1: Giant open tin shed built cheap. Unbearable acoustic echo!');
    meters.cost = 80;
    meters.safety = 35;
    meters.capacity = 50;
    if (onMeterUpdate) onMeterUpdate({ ...meters });
    if (refs.manager) refs.manager.setExpression('worried');
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 5.5,
    z: 8.5,
    duration: 3.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 2.5, 0);
    },
  });

  // Step 2: Fish & Perfume cross contamination
  tl.call(() => {
    if (onDialogue) onDialogue('🐟 STEP 2: Fresh fish stall placed next to luxury perfume! Horrible cross-contamination!');
    meters.cost = 45;
    meters.safety = 20;
    meters.capacity = 25;
    if (onMeterUpdate) onMeterUpdate({ ...meters, safetyLabel: 'Health Code Hazard' });
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 2.2,
    z: 3.8,
    duration: 3.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.2, 0);
    },
  });

  // Step 3: Tripping shoppers
  tl.call(() => {
    if (onDialogue) onDialogue('⚠️ STEP 3: Loose cables on walkway trip 3 shoppers! Groceries scatter everywhere!');
    meters.cost = 30;
    meters.safety = 10;
    meters.capacity = 10;
    if (onMeterUpdate) onMeterUpdate({ ...meters });
    if (refs.manager) refs.manager.setExpression('shocked');
  });

  tl.to(refs.camera.position, {
    x: 1.2,
    y: 2.5,
    z: 4.5,
    duration: 3.0,
    ease: 'power1.inOut',
    onUpdate: () => {
      refs.camera.lookAt(0, 0.8, 0);
    },
  });

  // Step 4: Municipal Officer & UNSAFE Shutdown
  tl.call(() => {
    if (onDialogue) onDialogue('🚫 STEP 4: Whistle blows! City safety officer orders IMMEDIATE SHUTDOWN!');
    meters.cost = 0;
    meters.safety = 0;
    meters.capacity = 0;
    if (onMeterUpdate) onMeterUpdate({ ...meters, safetyLabel: 'SHUT DOWN BY CITY' });
    if (refs.cityOfficer) refs.cityOfficer.blowWhistle(true);
  });

  tl.to(refs.camera.position, {
    x: 0,
    y: 3.5,
    z: 6.5,
    duration: 3.5,
    ease: 'power2.out',
    onUpdate: () => {
      refs.camera.lookAt(0, 1.6, 0);
    },
  });

  return tl;
}
