import * as THREE from 'three';
import { LEVEL1_PALETTE, createTextTexture, createHazardStripeTexture } from './materials';

/**
 * A1. Large rounded isometric muddy plot (the "field")
 * With sky-reflecting puddles, tire tracks, and edge grass tufts.
 */
export function createMuddyPlot(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'muddyPlot';

  // Base mud plot (isometric rounded slab)
  const baseGeo = new THREE.CylinderGeometry(14, 14.8, 1.2, 48);
  const mudMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.mudBrown,
    roughness: 0.88,
    metalness: 0.05,
    flatShading: true,
  });
  const groundBase = new THREE.Mesh(baseGeo, mudMat);
  groundBase.name = 'groundBase';
  groundBase.position.y = -0.6;
  groundBase.receiveShadow = true;
  group.add(groundBase);

  // Mud surface top layer with subtle organic variance
  const topGeo = new THREE.CylinderGeometry(13.6, 14, 0.25, 48);
  const mudTopMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.mudBrownDark,
    roughness: 0.92,
    metalness: 0.03,
  });
  const mudSurface = new THREE.Mesh(topGeo, mudTopMat);
  mudSurface.name = 'mudSurface';
  mudSurface.position.y = 0.05;
  mudSurface.receiveShadow = true;
  group.add(mudSurface);

  // Puddles (reflecting the sky)
  const puddlesGroup = new THREE.Group();
  puddlesGroup.name = 'puddles';

  const puddleMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.puddleWater,
    roughness: 0.08,
    metalness: 0.45,
    transparent: true,
    opacity: 0.9,
  });

  const puddleConfigs = [
    { x: -3.5, z: 2.5, rx: 2.2, rz: 1.4, rot: 0.3 },
    { x: 4.2, z: -1.8, rx: 2.8, rz: 1.8, rot: -0.4 },
    { x: -2.0, z: -4.5, rx: 1.8, rz: 1.2, rot: 0.8 },
    { x: 3.0, z: 5.0, rx: 2.0, rz: 1.5, rot: -0.2 },
    { x: 0.5, z: 1.0, rx: 1.6, rz: 1.0, rot: 0.5 },
  ];

  puddleConfigs.forEach((cfg, idx) => {
    const puddleGeo = new THREE.CylinderGeometry(cfg.rx, cfg.rx * 1.05, 0.05, 24);
    puddleGeo.scale(1, 1, cfg.rz / cfg.rx);
    const puddle = new THREE.Mesh(puddleGeo, puddleMat);
    puddle.name = `puddle_${idx}`;
    puddle.position.set(cfg.x, 0.18, cfg.z);
    puddle.rotation.y = cfg.rot;
    puddle.receiveShadow = true;
    puddlesGroup.add(puddle);

    // Mud border ring around puddle
    const ringGeo = new THREE.RingGeometry(cfg.rx * 0.95, cfg.rx * 1.2, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x4a2e16,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(cfg.x, 0.182, cfg.z);
    ring.rotation.y = cfg.rot;
    ring.scale.set(1, 1, cfg.rz / cfg.rx);
    puddlesGroup.add(ring);
  });
  group.add(puddlesGroup);

  // Tyre tracks (heavy construction trucks pressed into wet mud)
  const tracksGroup = new THREE.Group();
  tracksGroup.name = 'tireTracks';
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x4E3117,
    roughness: 0.98,
  });

  const trackCurves = [
    { startX: -12, startZ: -2, endX: 10, endZ: -1, width: 0.45 },
    { startX: -12, startZ: -3.2, endX: 10, endZ: -2.2, width: 0.45 },
    { startX: -6, startZ: -8, endX: -4, endZ: 8, width: 0.4 },
    { startX: -7.2, startZ: -8, endX: -5.2, endZ: 8, width: 0.4 },
  ];

  trackCurves.forEach((t, i) => {
    const length = Math.hypot(t.endX - t.startX, t.endZ - t.startZ);
    const trackGeo = new THREE.PlaneGeometry(t.width, length, 1, 12);
    trackGeo.rotateX(-Math.PI / 2);
    const angle = Math.atan2(t.endX - t.startX, t.endZ - t.startZ);
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.name = `tireTrack_${i}`;
    track.position.set((t.startX + t.endX) / 2, 0.185, (t.startZ + t.endZ) / 2);
    track.rotation.y = angle;
    track.receiveShadow = true;
    tracksGroup.add(track);
  });
  group.add(tracksGroup);

  // Grass tufts at the edges (Tamil Nadu tropical green blades)
  const grassGroup = new THREE.Group();
  grassGroup.name = 'grassTufts';
  const grassMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.bananaLeaf,
    roughness: 0.7,
    flatShading: true,
  });

  const numTufts = 32;
  for (let i = 0; i < numTufts; i++) {
    const angle = (i / numTufts) * Math.PI * 2 + (Math.random() * 0.15);
    const radius = 12.5 + Math.random() * 1.2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const tuft = new THREE.Group();
    tuft.position.set(x, 0.18, z);
    tuft.rotation.y = Math.random() * Math.PI * 2;

    const bladeCount = 3 + Math.floor(Math.random() * 3);
    for (let b = 0; b < bladeCount; b++) {
      const bladeGeo = new THREE.ConeGeometry(0.08, 0.45 + Math.random() * 0.25, 4);
      const blade = new THREE.Mesh(bladeGeo, grassMat);
      blade.position.y = 0.2;
      blade.rotation.z = (Math.random() - 0.5) * 0.5;
      blade.rotation.x = (Math.random() - 0.5) * 0.5;
      tuft.add(blade);
    }
    grassGroup.add(tuft);
  }
  group.add(grassGroup);

  return group;
}

/**
 * Coconut palm tree with curved segmented trunk, coconuts, and drooping palm fronds.
 */
export function createCoconutPalm(): THREE.Group {
  const palm = new THREE.Group();
  palm.name = 'coconutPalm';

  // Curved segmented trunk
  const trunkMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.palmTrunk,
    roughness: 0.85,
    flatShading: true,
  });

  const segments = 6;
  let currentY = 0;
  let currentTilt = 0;
  const trunkGroup = new THREE.Group();
  trunkGroup.name = 'trunk';

  for (let i = 0; i < segments; i++) {
    const radiusTop = 0.24 - (i * 0.02);
    const radiusBottom = 0.28 - (i * 0.02);
    const segHeight = 0.75;
    const segGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, segHeight, 7);
    const segMesh = new THREE.Mesh(segGeo, trunkMat);
    segMesh.position.y = currentY + segHeight / 2;
    segMesh.position.x = Math.sin(currentTilt) * 0.2 * i;
    segMesh.rotation.z = -0.06;
    segMesh.castShadow = true;
    trunkGroup.add(segMesh);

    // Trunk ring notch
    const ringGeo = new THREE.TorusGeometry(radiusBottom * 1.05, 0.03, 4, 8);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, trunkMat);
    ring.position.set(segMesh.position.x, currentY + 0.05, 0);
    trunkGroup.add(ring);

    currentY += segHeight * 0.95;
    currentTilt += 0.05;
  }
  palm.add(trunkGroup);

  // Crown head
  const crownPos = new THREE.Vector3(Math.sin(currentTilt) * 0.2 * (segments - 1), currentY, 0);

  // Coconuts
  const coconutMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.coconutShell,
    roughness: 0.8,
  });
  const coconutsGroup = new THREE.Group();
  coconutsGroup.name = 'coconuts';
  coconutsGroup.position.copy(crownPos);

  for (let c = 0; c < 5; c++) {
    const nutGeo = new THREE.SphereGeometry(0.18, 6, 6);
    const nut = new THREE.Mesh(nutGeo, coconutMat);
    const angle = (c / 5) * Math.PI * 2;
    nut.position.set(Math.cos(angle) * 0.22, -0.15, Math.sin(angle) * 0.22);
    nut.castShadow = true;
    coconutsGroup.add(nut);
  }
  palm.add(coconutsGroup);

  // Palm fronds
  const frondMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.palmFrond,
    roughness: 0.6,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const frondsGroup = new THREE.Group();
  frondsGroup.name = 'fronds';
  frondsGroup.position.copy(crownPos);

  const numFronds = 9;
  for (let f = 0; f < numFronds; f++) {
    const fAngle = (f / numFronds) * Math.PI * 2;
    const frond = new THREE.Group();
    frond.rotation.y = fAngle;
    frond.rotation.z = -0.45; // drooping angle

    // Spine
    const spineGeo = new THREE.CylinderGeometry(0.04, 0.07, 2.4, 4);
    spineGeo.rotateZ(Math.PI / 2);
    const spine = new THREE.Mesh(spineGeo, trunkMat);
    spine.position.x = 1.2;
    frond.add(spine);

    // Leaflets / Frond fan
    const leafGeo = new THREE.ConeGeometry(0.55, 2.3, 5);
    leafGeo.rotateZ(-Math.PI / 2);
    leafGeo.scale(1, 0.15, 0.7);
    const leafMesh = new THREE.Mesh(leafGeo, frondMat);
    leafMesh.position.x = 1.2;
    leafMesh.castShadow = true;
    frond.add(leafMesh);

    frondsGroup.add(frond);
  }
  palm.add(frondsGroup);

  return palm;
}

/**
 * Banana plant with broad luscious paddle leaves.
 */
export function createBananaPlant(): THREE.Group {
  const banana = new THREE.Group();
  banana.name = 'bananaPlant';

  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x81C784,
    roughness: 0.7,
  });
  const leafMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.bananaLeaf,
    roughness: 0.5,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  // Central pseudo-stem
  const stemGeo = new THREE.CylinderGeometry(0.14, 0.2, 1.8, 6);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.name = 'stem';
  stem.position.y = 0.9;
  banana.add(stem);

  // Large curved paddle leaves
  const leavesGroup = new THREE.Group();
  leavesGroup.name = 'leaves';
  leavesGroup.position.y = 1.6;

  const numLeaves = 6;
  for (let i = 0; i < numLeaves; i++) {
    const angle = (i / numLeaves) * Math.PI * 2;
    const leafGroup = new THREE.Group();
    leafGroup.rotation.y = angle;
    leafGroup.rotation.z = -0.55 - (i % 2) * 0.15;

    // Paddle shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.35, 0.8, 0.25, 1.8);
    shape.quadraticCurveTo(0.0, 2.1, -0.25, 1.8);
    shape.quadraticCurveTo(-0.35, 0.8, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(shape);
    leafGeo.rotateY(Math.PI / 2);
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.castShadow = true;
    leafGroup.add(leafMesh);

    leavesGroup.add(leafGroup);
  }
  banana.add(leavesGroup);

  return banana;
}

/**
 * Auto-rickshaw (Tamil Nadu yellow top, green body, 3 wheels)
 */
export function createAutoRickshaw(): THREE.Group {
  const rickshaw = new THREE.Group();
  rickshaw.name = 'autoRickshaw';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.autoGreen,
    roughness: 0.4,
    metalness: 0.2,
  });
  const topMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.autoYellow,
    roughness: 0.3,
  });
  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    roughness: 0.8,
  });
  const windshieldMat = new THREE.MeshPhysicalMaterial({
    color: 0xBFE6FF,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
  });

  // Main chassis & lower body
  const bodyGeo = new THREE.BoxGeometry(1.2, 0.7, 1.8);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.name = 'chassis';
  body.position.y = 0.55;
  body.castShadow = true;
  rickshaw.add(body);

  // Front tapered cowl
  const noseGeo = new THREE.CylinderGeometry(0.35, 0.55, 0.7, 8);
  const nose = new THREE.Mesh(noseGeo, bodyMat);
  nose.position.set(0, 0.55, 0.95);
  rickshaw.add(nose);

  // Canopy top (Yellow roof)
  const roofGeo = new THREE.BoxGeometry(1.25, 0.65, 1.7);
  const roof = new THREE.Mesh(roofGeo, topMat);
  roof.name = 'hood';
  roof.position.set(0, 1.15, -0.05);
  roof.castShadow = true;
  rickshaw.add(roof);

  // Front windshield
  const windshieldGeo = new THREE.PlaneGeometry(1.0, 0.5);
  const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
  windshield.position.set(0, 1.05, 0.82);
  windshield.rotation.x = -0.2;
  rickshaw.add(windshield);

  // Wheels: 1 front, 2 rear
  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 12);
  wheelGeo.rotateZ(Math.PI / 2);

  const frontWheel = new THREE.Mesh(wheelGeo, blackMat);
  frontWheel.name = 'frontWheel';
  frontWheel.position.set(0, 0.24, 1.0);
  frontWheel.castShadow = true;
  rickshaw.add(frontWheel);

  const rearWheelL = new THREE.Mesh(wheelGeo, blackMat);
  rearWheelL.name = 'rearWheelL';
  rearWheelL.position.set(-0.62, 0.24, -0.55);
  rearWheelL.castShadow = true;
  rickshaw.add(rearWheelL);

  const rearWheelR = new THREE.Mesh(wheelGeo, blackMat);
  rearWheelR.name = 'rearWheelR';
  rearWheelR.position.set(0.62, 0.24, -0.55);
  rearWheelR.castShadow = true;
  rickshaw.add(rearWheelR);

  // Headlight
  const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
  lightGeo.rotateX(Math.PI / 2);
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xFFF176,
    emissive: 0xFFD54F,
    emissiveIntensity: 0.6,
  });
  const headlight = new THREE.Mesh(lightGeo, lightMat);
  headlight.position.set(0, 0.62, 1.25);
  rickshaw.add(headlight);

  // Fare meter prop (tiny red box with digital display)
  const meterGeo = new THREE.BoxGeometry(0.12, 0.1, 0.08);
  const meterMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F });
  const meter = new THREE.Mesh(meterGeo, meterMat);
  meter.position.set(0.3, 0.85, 0.55);
  rickshaw.add(meter);

  return rickshaw;
}

/**
 * Dravidian temple gopuram stepped pyramid silhouette for the skyline.
 */
export function createGopuramSilhouette(): THREE.Group {
  const gopuram = new THREE.Group();
  gopuram.name = 'gopuramSilhouette';

  const stoneMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.templeStone,
    roughness: 0.9,
    flatShading: true,
  });

  // Stepped tiers
  const tiers = 6;
  let currentY = 0;
  for (let i = 0; i < tiers; i++) {
    const width = 3.2 - (i * 0.42);
    const depth = 2.4 - (i * 0.32);
    const height = 0.9;
    const tierGeo = new THREE.BoxGeometry(width, height, depth);
    const tier = new THREE.Mesh(tierGeo, stoneMat);
    tier.position.y = currentY + height / 2;
    gopuram.add(tier);

    // Decorative cornice band
    const corniceGeo = new THREE.BoxGeometry(width + 0.2, 0.15, depth + 0.2);
    const cornice = new THREE.Mesh(corniceGeo, stoneMat);
    cornice.position.y = currentY + height;
    gopuram.add(cornice);

    currentY += height + 0.1;
  }

  // Kalasams (golden barrel finials on the barrel-vault ridge)
  const barrelGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.4, 8);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrel = new THREE.Mesh(barrelGeo, stoneMat);
  barrel.position.y = currentY + 0.4;
  gopuram.add(barrel);

  const goldMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.templeGold,
    metalness: 0.6,
    roughness: 0.3,
  });

  for (let k = -2; k <= 2; k++) {
    const finialGeo = new THREE.ConeGeometry(0.08, 0.35, 6);
    const finial = new THREE.Mesh(finialGeo, goldMat);
    finial.position.set(k * 0.25, currentY + 0.9, 0);
    gopuram.add(finial);
  }

  return gopuram;
}

/**
 * A2. Background: low hills, coconut palms, distant skyline, auto-rickshaw road, sky gradient, drifting clouds.
 */
export function createBackground(): THREE.Group {
  const bg = new THREE.Group();
  bg.name = 'backgroundScene';

  // Low rolling hills
  const hillsGroup = new THREE.Group();
  hillsGroup.name = 'hills';
  const hillMat = new THREE.MeshStandardMaterial({
    color: 0x4E7D55,
    roughness: 0.9,
    flatShading: true,
  });

  const hillPositions = [
    { x: -35, z: -40, r: 24, h: 10 },
    { x: 0, z: -48, r: 28, h: 12 },
    { x: 38, z: -42, r: 26, h: 11 },
  ];

  hillPositions.forEach((h, i) => {
    const hillGeo = new THREE.ConeGeometry(h.r, h.h, 16);
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.set(h.x, h.h / 2 - 4, h.z);
    hill.name = `hill_${i}`;
    hillsGroup.add(hill);
  });
  bg.add(hillsGroup);

  // Distant temple gopuram silhouette in the skyline
  const gopuram = createGopuramSilhouette();
  gopuram.position.set(16, 2, -44);
  gopuram.scale.set(1.4, 1.4, 1.4);
  bg.add(gopuram);

  // Distant modern city blocks skyline
  const skylineGroup = new THREE.Group();
  skylineGroup.name = 'distantSkyline';
  const cityMat = new THREE.MeshStandardMaterial({
    color: 0x7E909A,
    roughness: 0.9,
  });

  for (let i = -6; i <= 6; i++) {
    const bHeight = 4 + Math.abs(i) * 1.2 + ((i * 3) % 4);
    const bGeo = new THREE.BoxGeometry(2.5, bHeight, 2.5);
    const building = new THREE.Mesh(bGeo, cityMat);
    building.position.set(i * 3.8 - 6, bHeight / 2 - 1, -50);
    skylineGroup.add(building);
  }
  bg.add(skylineGroup);

  // Auto-rickshaw road in background
  const roadGroup = new THREE.Group();
  roadGroup.name = 'rickshawRoad';

  const roadGeo = new THREE.PlaneGeometry(80, 4.5);
  roadGeo.rotateX(-Math.PI / 2);
  const roadMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.asphaltDark,
    roughness: 0.85,
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.position.set(0, 0.05, -20);
  road.receiveShadow = true;
  roadGroup.add(road);

  // White road dashed markings
  const markMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
  for (let x = -36; x < 36; x += 4) {
    const markGeo = new THREE.PlaneGeometry(2, 0.2);
    markGeo.rotateX(-Math.PI / 2);
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.position.set(x, 0.06, -20);
    roadGroup.add(mark);
  }

  // Animated Auto-rickshaws buzzing along the road
  const rickshaw1 = createAutoRickshaw();
  rickshaw1.name = 'autoRickshaw_1';
  rickshaw1.position.set(-15, 0.05, -19.2);
  rickshaw1.rotation.y = Math.PI / 2;
  roadGroup.add(rickshaw1);

  const rickshaw2 = createAutoRickshaw();
  rickshaw2.name = 'autoRickshaw_2';
  rickshaw2.position.set(8, 0.05, -20.8);
  rickshaw2.rotation.y = -Math.PI / 2;
  roadGroup.add(rickshaw2);

  bg.add(roadGroup);

  // Coconut palms & banana plants line the perimeter
  const treesGroup = new THREE.Group();
  treesGroup.name = 'perimeterTrees';

  const treeCoords = [
    { x: -14, z: -14, s: 1.1, rot: 0.2 },
    { x: -16, z: -5, s: 1.25, rot: 1.1 },
    { x: -15, z: 8, s: 1.0, rot: 2.1 },
    { x: 14, z: -13, s: 1.2, rot: 3.4 },
    { x: 16, z: 2, s: 1.15, rot: 4.2 },
    { x: 13, z: 12, s: 1.05, rot: 5.1 },
  ];

  treeCoords.forEach((tc) => {
    const palm = createCoconutPalm();
    palm.position.set(tc.x, 0.1, tc.z);
    palm.scale.set(tc.s, tc.s, tc.s);
    palm.rotation.y = tc.rot;
    treesGroup.add(palm);
  });

  // Banana plants in clusters
  const bananaCoords = [
    { x: -11, z: 11, s: 1.0 },
    { x: -12.5, z: 10, s: 0.8 },
    { x: 11, z: -9, s: 1.1 },
    { x: 12, z: -7.5, s: 0.85 },
  ];

  bananaCoords.forEach((bc) => {
    const bp = createBananaPlant();
    bp.position.set(bc.x, 0.1, bc.z);
    bp.scale.set(bc.s, bc.s, bc.s);
    treesGroup.add(bp);
  });

  bg.add(treesGroup);

  // Soft cartoon clouds drifting in sky
  const cloudsGroup = new THREE.Group();
  cloudsGroup.name = 'clouds';
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.3,
    flatShading: true,
  });

  const cloudConfigs = [
    { x: -22, y: 16, z: -25, scale: 2.2 },
    { x: 5, y: 19, z: -32, scale: 2.8 },
    { x: 26, y: 15, z: -20, scale: 2.0 },
  ];

  cloudConfigs.forEach((cc, ci) => {
    const cloud = new THREE.Group();
    cloud.name = `cloud_${ci}`;
    cloud.position.set(cc.x, cc.y, cc.z);

    const puffs = 5;
    for (let p = 0; p < puffs; p++) {
      const pGeo = new THREE.SphereGeometry(0.8 + (p % 2) * 0.4, 8, 8);
      const puff = new THREE.Mesh(pGeo, cloudMat);
      puff.position.set((p - 2) * 0.9, (p % 2) * 0.3, (p % 3) * 0.2);
      cloud.add(puff);
    }
    cloud.scale.set(cc.scale, cc.scale, cc.scale);
    cloudsGroup.add(cloud);
  });
  bg.add(cloudsGroup);

  return bg;
}

/**
 * A3. Site fence with signboard "FreshMart – Coming Soon"
 * Signboard can be swapped dynamically between Coming Soon and Grand Opening.
 */
export function createSiteFence(): THREE.Group {
  const fence = new THREE.Group();
  fence.name = 'siteFence';

  const postMat = new THREE.MeshStandardMaterial({
    color: 0x5D4037,
    roughness: 0.9,
  });
  const tinMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.wetConcreteGrey,
    roughness: 0.6,
    metalness: 0.4,
  });
  const stripeTex = createHazardStripeTexture();
  const stripeMat = new THREE.MeshStandardMaterial({
    map: stripeTex,
    roughness: 0.5,
  });

  // Front boundary fence sections with entrance gap
  const posts = [
    { x: -11, z: 9 },
    { x: -8, z: 10.5 },
    { x: -5, z: 11.2 },
    { x: -2, z: 11.5 },
    // Entrance gap between -2 and 2
    { x: 2, z: 11.5 },
    { x: 5, z: 11.2 },
    { x: 8, z: 10.5 },
    { x: 11, z: 9 },
  ];

  posts.forEach((p) => {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 6);
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(p.x, 1.0, p.z);
    post.castShadow = true;
    fence.add(post);
  });

  // Corrugated tin fence panels
  const panelConfigs = [
    { start: posts[0], end: posts[1] },
    { start: posts[1], end: posts[2] },
    { start: posts[2], end: posts[3] },
    { start: posts[4], end: posts[5] },
    { start: posts[5], end: posts[6] },
    { start: posts[6], end: posts[7] },
  ];

  panelConfigs.forEach((pc) => {
    const dx = pc.end.x - pc.start.x;
    const dz = pc.end.z - pc.start.z;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);

    const panelGeo = new THREE.BoxGeometry(len, 1.3, 0.06);
    const panel = new THREE.Mesh(panelGeo, tinMat);
    panel.position.set((pc.start.x + pc.end.x) / 2, 0.85, (pc.start.z + pc.end.z) / 2);
    panel.rotation.y = angle - Math.PI / 2;
    panel.castShadow = true;
    fence.add(panel);

    // Hazard stripe band across top of fence
    const bandGeo = new THREE.BoxGeometry(len, 0.15, 0.07);
    const band = new THREE.Mesh(bandGeo, stripeMat);
    band.position.set((pc.start.x + pc.end.x) / 2, 1.45, (pc.start.z + pc.end.z) / 2);
    band.rotation.y = angle - Math.PI / 2;
    fence.add(band);
  });

  // Large Signboard: "FreshMart – Coming Soon"
  const signGroup = new THREE.Group();
  signGroup.name = 'signboard';
  signGroup.position.set(-6.5, 0, 11);
  signGroup.rotation.y = -0.15;

  // Sign posts
  const sPostL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8), postMat);
  sPostL.position.set(-1.6, 1.6, 0);
  sPostL.castShadow = true;
  signGroup.add(sPostL);

  const sPostR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8), postMat);
  sPostR.position.set(1.6, 1.6, 0);
  sPostR.castShadow = true;
  signGroup.add(sPostR);

  // Signboard back frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.freshMartGreenDark,
    roughness: 0.6,
  });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.6, 0.12), frameMat);
  frame.position.y = 2.4;
  frame.castShadow = true;
  signGroup.add(frame);

  // Sign face canvas texture
  const comingSoonTex = createTextTexture('FreshMart', {
    bg: '#1E8E3E',
    color: '#FFFFFF',
    subtext: 'COMING SOON • புதுப்பொலிவு',
    fontSize: 58,
    border: '#FFD600',
  });
  const signFaceMat = new THREE.MeshStandardMaterial({
    map: comingSoonTex,
    roughness: 0.3,
  });
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.5), signFaceMat);
  signFace.name = 'signFace';
  signFace.position.set(0, 2.4, 0.07);
  signGroup.add(signFace);

  fence.add(signGroup);

  return fence;
}

/**
 * A4. Site cabin, traffic cones, barrier tape, diesel fuel gauge prop.
 */
export function createSiteCabin(): THREE.Group {
  const cabin = new THREE.Group();
  cabin.name = 'siteCabin';

  // Shipping container / Porta-cabin body
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xEEEEEE,
    roughness: 0.5,
    metalness: 0.3,
  });
  const bodyGeo = new THREE.BoxGeometry(3.6, 2.2, 2.2);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.name = 'cabinBody';
  body.position.y = 1.1;
  body.castShadow = true;
  cabin.add(body);

  // Corrugation ribs
  const ribMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.6 });
  for (let x = -1.6; x <= 1.6; x += 0.4) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.15, 2.24), ribMat);
    rib.position.set(x, 1.1, 0);
    cabin.add(rib);
  }

  // Door
  const doorMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.freshMartGreen,
    roughness: 0.4,
  });
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.7), doorMat);
  door.name = 'cabinDoor';
  door.position.set(-0.9, 0.95, 1.11);
  cabin.add(door);

  // Door handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6), new THREE.MeshStandardMaterial({ color: 0xFFD600 }));
  handle.position.set(-0.6, 0.95, 1.14);
  cabin.add(handle);

  // Window
  const winMat = new THREE.MeshPhysicalMaterial({
    color: LEVEL1_PALETTE.skyBlue,
    transmission: 0.8,
    transparent: true,
    opacity: 0.8,
  });
  const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), winMat);
  windowMesh.name = 'cabinWindow';
  windowMesh.position.set(0.7, 1.3, 1.11);
  cabin.add(windowMesh);

  // Roof AC Unit
  const acMat = new THREE.MeshStandardMaterial({ color: 0x90A4AE, roughness: 0.7 });
  const ac = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.6), acMat);
  ac.name = 'acUnit';
  ac.position.set(0.6, 2.45, 0);
  ac.castShadow = true;
  cabin.add(ac);

  return cabin;
}

/**
 * Traffic cones (bright safety orange with white reflective band).
 */
export function createTrafficCones(): THREE.Group {
  const cones = new THREE.Group();
  cones.name = 'trafficCones';

  const coneMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.safetyOrange,
    roughness: 0.35,
  });
  const bandMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.2,
  });
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    roughness: 0.8,
  });

  const positions = [
    { x: -1.8, z: 10.5 },
    { x: -0.9, z: 10.8 },
    { x: 0.0, z: 11.0 },
    { x: 0.9, z: 10.8 },
    { x: 1.8, z: 10.5 },
  ];

  positions.forEach((pos, idx) => {
    const single = new THREE.Group();
    single.name = `cone_${idx}`;
    single.position.set(pos.x, 0.18, pos.z);

    // Square rubber base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), baseMat);
    base.position.y = 0.02;
    single.add(base);

    // Orange cone
    const coneBody = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.65, 12), coneMat);
    coneBody.position.y = 0.35;
    coneBody.castShadow = true;
    single.add(coneBody);

    // White reflective band
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.15, 12), bandMat);
    band.position.y = 0.35;
    single.add(band);

    cones.add(single);
  });

  return cones;
}

/**
 * Barrier tape (yellow/black hazard caution tape posts)
 */
export function createBarrierTape(): THREE.Group {
  const tape = new THREE.Group();
  tape.name = 'barrierTape';

  const postMat = new THREE.MeshStandardMaterial({ color: 0x424242 });
  const stripeTex = createHazardStripeTexture();
  const tapeMat = new THREE.MeshStandardMaterial({
    map: stripeTex,
    side: THREE.DoubleSide,
  });

  const postCoords = [
    { x: -7, z: 5 },
    { x: -7, z: 8 },
    { x: -4, z: 8 },
  ];

  postCoords.forEach((p) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 6), postMat);
    post.position.set(p.x, 0.55 + 0.18, p.z);
    tape.add(post);
  });

  // Connecting caution ribbons
  for (let i = 0; i < postCoords.length - 1; i++) {
    const p1 = postCoords[i];
    const p2 = postCoords[i + 1];
    const len = Math.hypot(p2.x - p1.x, p2.z - p1.z);
    const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);

    const ribbonGeo = new THREE.PlaneGeometry(len, 0.12);
    ribbonGeo.rotateY(Math.PI / 2);
    const ribbon = new THREE.Mesh(ribbonGeo, tapeMat);
    ribbon.position.set((p1.x + p2.x) / 2, 0.85 + 0.18, (p1.z + p2.z) / 2);
    ribbon.rotation.y = angle - Math.PI / 2;
    tape.add(ribbon);
  }

  return tape;
}

/**
 * Diesel fuel gauge prop: circular dial with a needle that visibly ticks down while the player thinks.
 */
export function createFuelGaugeProp(): THREE.Group & { updateFuel: (pct: number) => void } {
  const fuelProp = new THREE.Group() as THREE.Group & { updateFuel: (pct: number) => void };
  fuelProp.name = 'dieselFuelGauge';

  // Diesel fuel cylindrical storage tank
  const tankMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.wetConcreteGrey,
    roughness: 0.4,
    metalness: 0.5,
  });
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.8, 16), tankMat);
  tank.name = 'tank';
  tank.rotation.z = Math.PI / 2;
  tank.position.set(0, 0.8, 0);
  tank.castShadow = true;
  fuelProp.add(tank);

  // Tank support legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x37474F });
  [-0.6, 0.6].forEach((x) => {
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), legMat);
    legL.position.set(x, 0.4, 0.45);
    fuelProp.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), legMat);
    legR.position.set(x, 0.4, -0.45);
    fuelProp.add(legR);
  });

  // Gauge circular housing on front
  const gaugeHousingMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    roughness: 0.3,
  });
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), gaugeHousingMat);
  housing.name = 'gaugeHousing';
  housing.rotation.x = Math.PI / 2;
  housing.position.set(0, 1.6, 0.5);
  fuelProp.add(housing);

  // Gauge dial face
  const dialTex = createTextTexture('DIESEL', {
    bg: '#FFFFFF',
    color: '#D32F2F',
    subtext: 'E ◄───► F',
    fontSize: 42,
  });
  const dialFaceMat = new THREE.MeshStandardMaterial({
    map: dialTex,
    roughness: 0.2,
  });
  const dialFace = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), dialFaceMat);
  dialFace.name = 'gaugeDial';
  dialFace.position.set(0, 1.6, 0.56);
  fuelProp.add(dialFace);

  // Gauge Needle (ticks down!)
  const needleMat = new THREE.MeshBasicMaterial({ color: 0xE53935 });
  const needleGeo = new THREE.ConeGeometry(0.02, 0.22, 4);
  const needle = new THREE.Mesh(needleGeo, needleMat);
  needle.name = 'needle';
  needle.position.set(0, 1.6, 0.57);
  needle.rotation.z = Math.PI * 0.4; // Starts near Full (F)
  fuelProp.add(needle);

  // Dynamic ticking method
  fuelProp.updateFuel = (pct: number) => {
    // pct from 1.0 (Full) to 0.0 (Empty)
    const angle = (pct - 0.5) * Math.PI * 0.9;
    needle.rotation.z = angle;
  };

  return fuelProp;
}
