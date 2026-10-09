import * as THREE from 'three';
import { LEVEL1_PALETTE } from './materials';

/**
 * B5. Single Cement Mixer Truck
 * Rotating drum, exhaust pipe with puffs, idle rumble, chute.
 */
export function createCementMixer(): THREE.Group & {
  updateMixer: (time: number, speed?: number) => void;
} {
  const truck = new THREE.Group() as THREE.Group & {
    updateMixer: (time: number, speed?: number) => void;
  };
  truck.name = 'cementMixer';

  const cabMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.safetyOrange,
    roughness: 0.35,
    metalness: 0.2,
  });
  const drumMat = new THREE.MeshStandardMaterial({
    color: 0xFAFAFA,
    roughness: 0.5,
    metalness: 0.15,
  });
  const drumStripeMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.freshMartGreen,
    roughness: 0.5,
  });
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x37474F,
    roughness: 0.8,
  });
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    roughness: 0.9,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: LEVEL1_PALETTE.skyBlue,
    transmission: 0.8,
    transparent: true,
    opacity: 0.7,
  });

  // Chassis frame
  const chassisGeo = new THREE.BoxGeometry(1.6, 0.45, 4.4);
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.name = 'chassis';
  chassis.position.y = 0.55;
  chassis.castShadow = true;
  truck.add(chassis);

  // Wheels (6 wheels: 2 front, 4 rear duals)
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 14);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    { x: -0.9, z: 1.4 },
    { x: 0.9, z: 1.4 },
    { x: -0.9, z: -0.8 },
    { x: 0.9, z: -0.8 },
    { x: -0.9, z: -1.7 },
    { x: 0.9, z: -1.7 },
  ];

  const wheelsGroup = new THREE.Group();
  wheelsGroup.name = 'wheels';
  wheelPositions.forEach((pos, idx) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.name = `wheel_${idx}`;
    wheel.position.set(pos.x, 0.38, pos.z);
    wheel.castShadow = true;
    wheelsGroup.add(wheel);
  });
  truck.add(wheelsGroup);

  // Driver Cab
  const cabGroup = new THREE.Group();
  cabGroup.name = 'cab';
  cabGroup.position.set(0, 0.75, 1.3);

  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1.4), cabMat);
  cabBody.position.y = 0.6;
  cabBody.castShadow = true;
  cabGroup.add(cabBody);

  // Cab windshield
  const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.55), glassMat);
  windshield.position.set(0, 0.85, 0.71);
  cabGroup.add(windshield);

  // Headlights & bumper
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.3), chassisMat);
  bumper.position.set(0, 0.15, 0.75);
  cabGroup.add(bumper);

  [-0.6, 0.6].forEach((x) => {
    const light = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8),
      new THREE.MeshBasicMaterial({ color: 0xFFF176 })
    );
    light.rotation.x = Math.PI / 2;
    light.position.set(x, 0.25, 0.85);
    cabGroup.add(light);
  });
  truck.add(cabGroup);

  // Rotating Cement Drum
  const drumGroup = new THREE.Group();
  drumGroup.name = 'drumMount';
  drumGroup.position.set(0, 1.4, -0.6);
  drumGroup.rotation.x = 0.22; // angled upwards

  // Central drum barrel
  const drumPivot = new THREE.Group();
  drumPivot.name = 'drum';

  const drumGeo = new THREE.CylinderGeometry(0.7, 1.05, 2.2, 16);
  const drumMesh = new THREE.Mesh(drumGeo, drumMat);
  drumMesh.rotation.x = Math.PI / 2;
  drumMesh.castShadow = true;
  drumPivot.add(drumMesh);

  // Green spiral accent bands around drum
  const stripeGeo = new THREE.TorusGeometry(0.95, 0.06, 6, 18);
  stripeGeo.rotateX(Math.PI / 3);
  const stripe = new THREE.Mesh(stripeGeo, drumStripeMat);
  drumPivot.add(stripe);

  const stripe2 = stripe.clone();
  stripe2.position.z = -0.5;
  drumPivot.add(stripe2);

  drumGroup.add(drumPivot);
  truck.add(drumGroup);

  // Pouring Chute at rear
  const chuteGroup = new THREE.Group();
  chuteGroup.name = 'chute';
  chuteGroup.position.set(0, 1.0, -2.0);

  const chuteMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.2, 0.9),
    chassisMat
  );
  chuteMesh.rotation.x = -0.3;
  chuteGroup.add(chuteMesh);
  truck.add(chuteGroup);

  // Vertical Exhaust Pipe with Animated Puffs
  const exhaustPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x455A64, metalness: 0.8 })
  );
  exhaustPipe.name = 'exhaustPipe';
  exhaustPipe.position.set(0.75, 1.8, 0.6);
  truck.add(exhaustPipe);

  const puffsGroup = new THREE.Group();
  puffsGroup.name = 'exhaustPuffs';
  puffsGroup.position.set(0.75, 2.4, 0.6);

  const puffMat = new THREE.MeshBasicMaterial({
    color: 0xECEFF1,
    transparent: true,
    opacity: 0.6,
  });

  for (let p = 0; p < 4; p++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.08 + p * 0.04, 6, 6), puffMat);
    puff.name = `puff_${p}`;
    puff.position.set(0, p * 0.2, 0);
    puffsGroup.add(puff);
  }
  truck.add(puffsGroup);

  // Animation update method
  truck.updateMixer = (time: number, speed = 1.0) => {
    // Drum continuous spin
    drumPivot.rotation.z += 0.04 * speed;

    // Idle rumble vibration
    const rumble = Math.sin(time * 30) * 0.008;
    cabGroup.position.y = 0.75 + rumble;
    drumGroup.position.y = 1.4 + rumble * 0.5;

    // Exhaust puff pulsing
    puffsGroup.children.forEach((child, i) => {
      const phase = (time * 4 + i * 0.8) % 2;
      child.position.y = phase * 0.6;
      child.scale.setScalar(0.5 + phase * 0.8);
      (child as THREE.Mesh<any, THREE.MeshBasicMaterial>).material.opacity = Math.max(0, 0.7 - phase * 0.35);
    });
  };

  return truck;
}

/**
 * Fleet of 10 Cement Mixers arranged in two neat rows.
 */
export function createCementMixerFleet(): THREE.Group & {
  updateFleet: (time: number) => void;
} {
  const fleet = new THREE.Group() as THREE.Group & {
    updateFleet: (time: number) => void;
  };
  fleet.name = 'cementMixerFleet';

  const trucks: Array<THREE.Group & { updateMixer: (time: number, speed?: number) => void }> = [];

  // Two rows of 5 mixers
  const rowLeftZ = [-6, -3, 0, 3, 6];
  const rowRightZ = [-6, -3, 0, 3, 6];

  // Left row facing inward/forward
  rowLeftZ.forEach((z, i) => {
    const mixer = createCementMixer();
    mixer.name = `mixer_L_${i}`;
    mixer.position.set(-6.5, 0.18, z);
    mixer.rotation.y = 0.35; // slight inward tilt
    fleet.add(mixer);
    trucks.push(mixer);
  });

  // Right row
  rowRightZ.forEach((z, i) => {
    const mixer = createCementMixer();
    mixer.name = `mixer_R_${i}`;
    mixer.position.set(6.5, 0.18, z);
    mixer.rotation.y = -0.35; // slight inward tilt
    fleet.add(mixer);
    trucks.push(mixer);
  });

  fleet.updateFleet = (time: number) => {
    trucks.forEach((m, idx) => {
      m.updateMixer(time + idx * 0.25, 0.8 + (idx % 3) * 0.2);
    });
  };

  return fleet;
}

/**
 * B6. Raw materials & machinery
 * Steel rod stacks, sand & gravel piles, small excavator.
 */
export function createSteelRodStacks(): THREE.Group {
  const stack = new THREE.Group();
  stack.name = 'steelRodStacks';

  const rodMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.steelBlue,
    metalness: 0.85,
    roughness: 0.25,
  });
  const rustMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.rebarRust,
    roughness: 0.7,
  });
  const timberMat = new THREE.MeshStandardMaterial({
    color: 0x5D4037,
    roughness: 0.9,
  });

  // Timber support dunnage
  [-1.2, 1.2].forEach((z) => {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.15), timberMat);
    beam.position.set(0, 0.06, z);
    stack.add(beam);
  });

  // Bundled rebar rods in neat pyramid stack
  const rows = [4, 3, 2];
  let currentY = 0.18;

  rows.forEach((count, rIdx) => {
    const startX = -((count - 1) * 0.25) / 2;
    for (let i = 0; i < count; i++) {
      const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
      rodGeo.rotateX(Math.PI / 2);
      const rod = new THREE.Mesh(rodGeo, (i + rIdx) % 3 === 0 ? rustMat : rodMat);
      rod.position.set(startX + i * 0.25, currentY, 0);
      rod.castShadow = true;
      stack.add(rod);
    }
    currentY += 0.12;
  });

  return stack;
}

export function createSandGravelPiles(): THREE.Group {
  const piles = new THREE.Group();
  piles.name = 'sandGravelPiles';

  // Sand pile (golden yellow construction sand)
  const sandMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.sandYellow,
    roughness: 0.95,
    flatShading: true,
  });
  const sandGeo = new THREE.ConeGeometry(1.8, 1.2, 14);
  const sand = new THREE.Mesh(sandGeo, sandMat);
  sand.name = 'sandPile';
  sand.position.set(-1.4, 0.6, 0);
  sand.castShadow = true;
  piles.add(sand);

  // Gravel pile (coarse aggregate grey stone)
  const gravelMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.gravelGrey,
    roughness: 0.88,
    flatShading: true,
  });
  const gravelGeo = new THREE.ConeGeometry(2.1, 1.4, 12);
  const gravel = new THREE.Mesh(gravelGeo, gravelMat);
  gravel.name = 'gravelPile';
  gravel.position.set(1.4, 0.7, 0);
  gravel.castShadow = true;
  piles.add(gravel);

  return piles;
}

export function createExcavator(): THREE.Group {
  const digger = new THREE.Group();
  digger.name = 'smallExcavator';

  const yellowMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.autoYellow,
    roughness: 0.35,
    metalness: 0.2,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x263238,
    roughness: 0.8,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x90A4AE,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Track base
  const trackGeo = new THREE.BoxGeometry(0.35, 0.35, 2.2);
  const trackL = new THREE.Mesh(trackGeo, darkMat);
  trackL.position.set(-0.7, 0.18, 0);
  digger.add(trackL);

  const trackR = new THREE.Mesh(trackGeo, darkMat);
  trackR.position.set(0.7, 0.18, 0);
  digger.add(trackR);

  // Rotating House / Cabin
  const house = new THREE.Group();
  house.name = 'excavatorHouse';
  house.position.y = 0.45;

  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.5), yellowMat);
  bodyMesh.position.y = 0.45;
  bodyMesh.castShadow = true;
  house.add(bodyMesh);

  // Operator glass cab
  const cabMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.75, 0.75),
    new THREE.MeshPhysicalMaterial({ color: 0xBFE6FF, transmission: 0.8, transparent: true })
  );
  cabMesh.position.set(-0.35, 0.9, 0.3);
  house.add(cabMesh);

  // Articulated Boom, Arm, Bucket
  const boomGroup = new THREE.Group();
  boomGroup.name = 'boom';
  boomGroup.position.set(0.35, 0.7, 0.6);
  boomGroup.rotation.x = -0.55;

  const boomMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 0.25), yellowMat);
  boomMesh.position.y = 0.9;
  boomMesh.castShadow = true;
  boomGroup.add(boomMesh);

  // Dipper Arm
  const armGroup = new THREE.Group();
  armGroup.name = 'arm';
  armGroup.position.set(0, 1.8, 0);
  armGroup.rotation.x = 1.1;

  const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.3, 0.2), yellowMat);
  armMesh.position.y = 0.65;
  armGroup.add(armMesh);

  // Bucket
  const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.45), steelMat);
  bucket.name = 'bucket';
  bucket.position.set(0, 1.3, 0.1);
  armGroup.add(bucket);

  boomGroup.add(armGroup);
  house.add(boomGroup);

  digger.add(house);
  return digger;
}

/**
 * B7. 50 Workers (instanced/optimized group)
 * 3 shirt variants, hard hats, shovels, idle animation, cheer animation.
 */
export function createWorkersCrew(): THREE.Group & {
  setState: (mode: 'idle' | 'cheer') => void;
  updateWorkers: (time: number) => void;
} {
  const crew = new THREE.Group() as THREE.Group & {
    setState: (mode: 'idle' | 'cheer') => void;
    updateWorkers: (time: number) => void;
  };
  crew.name = 'workersCrew';

  let currentMode: 'idle' | 'cheer' = 'idle';

  const workerMatOrange = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.workerOrange,
    roughness: 0.6,
  });
  const workerMatBlue = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.workerBlue,
    roughness: 0.6,
  });
  const workerMatYellow = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.workerYellow,
    roughness: 0.6,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.skinTone1,
    roughness: 0.7,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x37474F,
    roughness: 0.8,
  });
  const hardHatMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.safetyOrange,
    roughness: 0.3,
  });
  const shovelMat = new THREE.MeshStandardMaterial({
    color: 0x78909C,
    metalness: 0.7,
    roughness: 0.3,
  });

  const shirtMats = [workerMatOrange, workerMatBlue, workerMatYellow];

  // Store individual worker refs for animating
  const workerNodes: Array<{
    root: THREE.Group;
    arms: THREE.Group;
    shovel: THREE.Mesh;
    baseY: number;
    phase: number;
  }> = [];

  // Create 50 workers scattered across the site in small work teams
  const totalWorkers = 50;
  for (let i = 0; i < totalWorkers; i++) {
    const worker = new THREE.Group();
    worker.name = `worker_${i}`;

    const shirtMat = shirtMats[i % 3];

    // Body / Torso (under 400 tris)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.2), shirtMat);
    torso.position.y = 0.55;
    torso.castShadow = true;
    worker.add(torso);

    // Legs
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.18), pantsMat);
    legs.position.y = 0.2;
    worker.add(legs);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), skinMat);
    head.position.y = 0.88;
    worker.add(head);

    // Hard Hat
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.12, 8), hardHatMat);
    hat.position.y = 0.98;
    worker.add(hat);

    // Arms & Shovel
    const armsGroup = new THREE.Group();
    armsGroup.position.set(0, 0.65, 0);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), shirtMat);
    armL.position.set(-0.2, -0.15, 0.1);
    armsGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), shirtMat);
    armR.position.set(0.2, -0.15, 0.1);
    armsGroup.add(armR);

    // Shovel
    const shovel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 4), shovelMat);
    shovel.position.set(0.18, -0.2, 0.15);
    armsGroup.add(shovel);

    worker.add(armsGroup);

    // Position distributed on the field
    const angle = (i / totalWorkers) * Math.PI * 2 + (i % 5) * 0.2;
    const dist = 3.5 + (i % 7) * 0.9;
    const x = Math.cos(angle) * dist + (i % 2 === 0 ? 0.8 : -0.8);
    const z = Math.sin(angle) * dist * 0.75;

    worker.position.set(x, 0.18, z);
    worker.rotation.y = Math.random() * Math.PI * 2;
    crew.add(worker);

    workerNodes.push({
      root: worker,
      arms: armsGroup,
      shovel,
      baseY: 0.18,
      phase: i * 0.3,
    });
  }

  crew.setState = (mode: 'idle' | 'cheer') => {
    currentMode = mode;
  };

  crew.updateWorkers = (time: number) => {
    workerNodes.forEach((w) => {
      if (currentMode === 'idle') {
        // Subtle breathing / weight shifting
        w.root.position.y = w.baseY + Math.sin(time * 3 + w.phase) * 0.02;
        w.arms.rotation.x = Math.sin(time * 2 + w.phase) * 0.1;
      } else {
        // Cheering: bouncing up & raising shovels!
        w.root.position.y = w.baseY + Math.abs(Math.sin(time * 8 + w.phase)) * 0.25;
        w.arms.rotation.x = -Math.PI * 0.7 + Math.sin(time * 8 + w.phase) * 0.3;
      }
    });
  };

  return crew;
}

/**
 * B8. Site Manager (Hero NPC)
 * Orange hard hat, mustache, taps hard hat when speaking,
 * 4 expressions: asking, worried, proud, shocked.
 */
export type ManagerExpression = 'asking' | 'worried' | 'proud' | 'shocked';

export function createSiteManager(): THREE.Group & {
  setExpression: (expr: ManagerExpression) => void;
  getExpression: () => ManagerExpression;
  tapHardHat: (active: boolean) => void;
  updateManager: (time: number) => void;
} {
  const manager = new THREE.Group() as THREE.Group & {
    setExpression: (expr: ManagerExpression) => void;
    getExpression: () => ManagerExpression;
    tapHardHat: (active: boolean) => void;
    updateManager: (time: number) => void;
  };
  manager.name = 'siteManager';

  let isTapping = false;

  const skinMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.skinTone2,
    roughness: 0.6,
  });
  const vestMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.safetyOrangeBright,
    roughness: 0.5,
  });
  const hatMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.safetyOrange,
    roughness: 0.3,
    metalness: 0.1,
  });
  const mustacheMat = new THREE.MeshStandardMaterial({
    color: 0x1A1A1A,
    roughness: 0.9,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x37474F,
  });

  // Torso with safety vest & walkie-talkie
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.3), vestMat);
  torso.name = 'managerTorso';
  torso.position.y = 0.85;
  torso.castShadow = true;
  manager.add(torso);

  // Reflective vest stripes
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.1, 0.32),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  );
  stripe.position.set(0, 0.85, 0);
  manager.add(stripe);

  // Walkie-talkie prop on chest
  const walkie = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.18, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x212121 })
  );
  walkie.position.set(0.18, 1.0, 0.16);
  manager.add(walkie);

  // Legs & safety shoes
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.25), pantsMat);
  legs.position.y = 0.3;
  manager.add(legs);

  // Head
  const headGroup = new THREE.Group();
  headGroup.name = 'managerHead';
  headGroup.position.set(0, 1.35, 0);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), skinMat);
  headGroup.add(head);

  // Iconic Tamil Nadu mustache!
  const stacheGeo = new THREE.TorusGeometry(0.08, 0.03, 6, 12, Math.PI);
  const stache = new THREE.Mesh(stacheGeo, mustacheMat);
  stache.name = 'mustache';
  stache.rotation.z = Math.PI;
  stache.position.set(0, -0.04, 0.19);
  headGroup.add(stache);

  // Eyes & Eyebrows (for expressions)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const browMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), browMat);
  browL.position.set(-0.07, 0.07, 0.19);
  headGroup.add(browL);

  const browR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.02), browMat);
  browR.position.set(0.07, 0.07, 0.19);
  headGroup.add(browR);

  // Mouth
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.02), eyeMat);
  mouth.position.set(0, -0.1, 0.19);
  headGroup.add(mouth);

  // Orange hard hat
  const hatGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.16, 16);
  const hat = new THREE.Mesh(hatGeo, hatMat);
  hat.name = 'hardHat';
  hat.position.y = 0.15;
  headGroup.add(hat);

  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.03, 16), hatMat);
  brim.position.y = 0.08;
  headGroup.add(brim);

  manager.add(headGroup);

  // Right Arm (for tapping hard hat gesture)
  const armRGroup = new THREE.Group();
  armRGroup.name = 'rightArm';
  armRGroup.position.set(0.32, 1.1, 0);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), vestMat);
  armR.position.y = -0.2;
  armRGroup.add(armR);

  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), skinMat);
  handR.position.y = -0.45;
  armRGroup.add(handR);

  let currentExpr: ManagerExpression = 'asking';

  // Expression switcher
  manager.getExpression = () => currentExpr;
  manager.setExpression = (expr: ManagerExpression) => {
    currentExpr = expr;
    switch (expr) {
      case 'asking':
        browL.rotation.z = 0.35; // raised questioning eyebrow
        browR.rotation.z = -0.1;
        mouth.scale.set(1, 1, 1);
        headGroup.rotation.z = 0.08;
        break;
      case 'worried':
        browL.rotation.z = -0.3; // drooping troubled brows
        browR.rotation.z = 0.3;
        mouth.scale.set(0.8, 0.6, 1);
        headGroup.rotation.z = 0;
        break;
      case 'proud':
        browL.rotation.z = 0;
        browR.rotation.z = 0;
        mouth.scale.set(1.4, 1.2, 1); // wide grin
        headGroup.rotation.x = -0.1; // head held high
        break;
      case 'shocked':
        browL.position.y = 0.1;
        browR.position.y = 0.1;
        mouth.scale.set(1.2, 3.0, 1); // open mouth
        headGroup.rotation.x = 0.15;
        break;
    }
  };

  manager.tapHardHat = (active: boolean) => {
    isTapping = active;
  };

  manager.updateManager = (time: number) => {
    // Idle breathing
    torso.position.y = 0.85 + Math.sin(time * 2.5) * 0.015;

    // Hard hat tap gesture animation
    if (isTapping) {
      armRGroup.rotation.x = -Math.PI * 0.65;
      armRGroup.rotation.z = -Math.PI * 0.45 + Math.sin(time * 10) * 0.15;
    } else {
      armRGroup.rotation.x = 0;
      armRGroup.rotation.z = 0;
    }
  };

  manager.setExpression('asking');
  return manager;
}

/**
 * B9. Boss (player avatar, seen from behind)
 * Rubber boots, rolled-sleeve shirt, holding clipboard.
 */
export function createBossAvatar(): THREE.Group {
  const boss = new THREE.Group();
  boss.name = 'bossAvatar';

  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0xE3F2FD, // clean white/light blue shirt
    roughness: 0.6,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x263238, // dark trousers
    roughness: 0.7,
  });
  const bootMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.rubberBootBlack,
    roughness: 0.4, // shiny rubber mud boots
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.skinTone3,
    roughness: 0.6,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1A1A1A,
    roughness: 0.9,
  });

  // Mud gumboots (rubber boots)
  [-0.15, 0.15].forEach((x) => {
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.32), bootMat);
    boot.position.set(x, 0.22, 0.05);
    boot.castShadow = true;
    boss.add(boot);
  });

  // Trousers
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.25), pantsMat);
  legs.position.y = 0.65;
  boss.add(legs);

  // Shirt / Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), shirtMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  boss.add(torso);

  // Head with hair (seen from behind)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), skinMat);
  head.position.y = 1.7;
  boss.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), hairMat);
  hair.position.set(0, 1.72, -0.04);
  boss.add(hair);

  // Arms holding clipboard in front
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), shirtMat);
  armL.position.set(-0.32, 1.1, 0.15);
  armL.rotation.x = 0.6;
  boss.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), shirtMat);
  armR.position.set(0.32, 1.1, 0.15);
  armR.rotation.x = 0.6;
  boss.add(armR);

  // Large Wooden Clipboard with paper
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

  const clipboard = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.04), boardMat);
  clipboard.name = 'clipboard';
  clipboard.position.set(0, 1.15, 0.4);
  clipboard.rotation.x = -0.4;

  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.5), paperMat);
  paper.position.set(0, 0, 0.025);
  clipboard.add(paper);

  boss.add(clipboard);

  return boss;
}
