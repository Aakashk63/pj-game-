import * as THREE from 'three';
import { LEVEL1_PALETTE, createTextTexture } from './materials';

/**
 * E19. Blueprint zones lighting up on floor, then building rising in 4 stages:
 * Stage 1: Holographic grid lines & zones light up
 * Stage 2: Foundation & conduits lock in
 * Stage 3: Steel frame & wide entrance rise
 * Stage 4: Insulated roof, solar & FreshMart sign lock in
 */
export function createRisingSupermarket(): THREE.Group & {
  setStage: (stage: 1 | 2 | 3 | 4) => void;
  updateStage: (time: number) => void;
} {
  const building = new THREE.Group() as THREE.Group & {
    setStage: (stage: 1 | 2 | 3 | 4) => void;
    updateStage: (time: number) => void;
  };
  building.name = 'risingSupermarket';

  let currentStage: 1 | 2 | 3 | 4 = 1;

  // STAGE 1: Blueprint zones on floor
  const stage1Group = new THREE.Group();
  stage1Group.name = 'stage1_blueprintGrid';

  const gridMat = new THREE.MeshBasicMaterial({
    color: LEVEL1_PALETTE.hologramBlue,
    wireframe: true,
  });
  const gridFloor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9, 8, 8), gridMat);
  gridFloor.rotation.x = -Math.PI / 2;
  gridFloor.position.y = 0.05;
  stage1Group.add(gridFloor);

  // Glowing boundary zone rings
  const zoneColors = [0x4CAF50, 0xFF9800, 0x03A9F4, 0xE91E63];
  [-2.2, 2.2].forEach((x, xi) => {
    [-2.2, 2.2].forEach((z, zi) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 1.8, 16),
        new THREE.MeshBasicMaterial({
          color: zoneColors[(xi * 2 + zi) % 4],
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(x, 0.06, z);
      stage1Group.add(ring);
    });
  });
  building.add(stage1Group);

  // STAGE 2: Deep foundation and integrated conduits
  const stage2Group = new THREE.Group();
  stage2Group.name = 'stage2_foundation';

  const foundationMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.curedConcrete,
    roughness: 0.8,
  });
  const foundation = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.5, 9.6), foundationMat);
  foundation.position.y = 0.25;
  foundation.receiveShadow = true;
  stage2Group.add(foundation);

  // Neatly visible conduit channels
  const conduitColors = [0x0288D1, 0x757575, 0xFDD835];
  conduitColors.forEach((col, ci) => {
    const cPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 8.8, 8),
      new THREE.MeshStandardMaterial({ color: col })
    );
    cPipe.rotation.x = Math.PI / 2;
    cPipe.position.set(-2 + ci * 2, 0.52, 0);
    stage2Group.add(cPipe);
  });
  building.add(stage2Group);

  // STAGE 3: Steel frame & wide entrance
  const stage3Group = new THREE.Group();
  stage3Group.name = 'stage3_steelFrame';

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x37474F,
    metalness: 0.8,
    roughness: 0.3,
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.freshMartGreen,
    roughness: 0.4,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: LEVEL1_PALETTE.skyBlue,
    transmission: 0.85,
    transparent: true,
  });

  // Vertical structural columns
  const colCoords = [
    { x: -4.5, z: -4.5 },
    { x: 4.5, z: -4.5 },
    { x: -4.5, z: 4.5 },
    { x: 4.5, z: 4.5 },
    { x: -1.8, z: 4.5 },
    { x: 1.8, z: 4.5 },
  ];
  colCoords.forEach((cc) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.2, 0.35), steelMat);
    col.position.set(cc.x, 2.1, cc.z);
    col.castShadow = true;
    stage3Group.add(col);
  });

  // Green side & back walls
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 9.0), wallMat);
  wallL.position.set(-4.5, 2.0, 0);
  stage3Group.add(wallL);

  const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 9.0), wallMat);
  wallR.position.set(4.5, 2.0, 0);
  stage3Group.add(wallR);

  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(9.0, 3.0, 0.2), wallMat);
  wallBack.position.set(0, 2.0, -4.5);
  stage3Group.add(wallBack);

  // Front Wide Glass Entrance Bay
  const glassBay = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.1), glassMat);
  glassBay.position.set(0, 1.8, 4.5);
  stage3Group.add(glassBay);

  building.add(stage3Group);

  // STAGE 4: Insulated roof, solar panels, FreshMart illuminated sign
  const stage4Group = new THREE.Group();
  stage4Group.name = 'stage4_roofAndSign';

  // Flat commercial roof
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0xCFD8DC,
    roughness: 0.6,
  });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.35, 9.8), roofMat);
  roof.position.y = 3.65;
  roof.castShadow = true;
  stage4Group.add(roof);

  // Solar panels on roof
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x0D47A1,
    metalness: 0.9,
    roughness: 0.1,
  });
  [-2.2, 0, 2.2].forEach((x) => {
    const solar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 3.2), solarMat);
    solar.position.set(x, 3.9, -1.0);
    solar.rotation.x = -0.15;
    stage4Group.add(solar);
  });

  // Rooftop HVAC units
  const hvac = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.8, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x78909C })
  );
  hvac.position.set(2.8, 4.25, 2.2);
  stage4Group.add(hvac);

  // Illuminated "FreshMart" Store Signboard with ₹ emblem
  const storeSignTex = createTextTexture('FreshMart', {
    bg: '#1E8E3E',
    color: '#FFFFFF',
    subtext: 'SUPERMARKET • சிறந்த தரம் ₹',
    fontSize: 56,
    border: '#FFD600',
  });
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1.4),
    new THREE.MeshStandardMaterial({ map: storeSignTex, roughness: 0.2 })
  );
  signMesh.position.set(0, 4.5, 4.6);
  stage4Group.add(signMesh);

  building.add(stage4Group);

  // Stage Controller
  building.setStage = (stage: 1 | 2 | 3 | 4) => {
    currentStage = stage;
    stage1Group.visible = stage >= 1;
    stage2Group.visible = stage >= 2;
    stage3Group.visible = stage >= 3;
    stage4Group.visible = stage >= 4;

    // Smooth stage scaling
    stage2Group.scale.y = stage >= 2 ? 1 : 0.01;
    stage3Group.scale.y = stage >= 3 ? 1 : 0.01;
    stage4Group.position.y = stage >= 4 ? 0 : 5.0;
  };

  building.updateStage = (time: number) => {
    if (currentStage === 1) {
      // Pulsing grid light
      gridFloor.position.y = 0.05 + Math.sin(time * 4) * 0.01;
    }
  };

  building.setStage(4); // Default to full stage
  return building;
}

/**
 * E20. Proper foundation, wide entrance with carts flowing, sprinklers on ceiling, frosted freezers.
 */
export function createProperFoundationWideEntrance(): THREE.Group & {
  updateFreezers: (time: number) => void;
} {
  const comp = new THREE.Group() as THREE.Group & {
    updateFreezers: (time: number) => void;
  };
  comp.name = 'properFoundationWideEntrance';

  const concreteMat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.curedConcrete });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: LEVEL1_PALETTE.skyBlue,
    transmission: 0.9,
    transparent: true,
  });

  // Wide 4-lane entrance frame
  const frame = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.0, 0.4), concreteMat);
  frame.position.y = 1.5;
  comp.add(frame);

  // Automatic sliding double glass doors (wide open!)
  const doorL = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.4), glassMat);
  doorL.position.set(-1.6, 1.3, 0.22);
  comp.add(doorL);

  const doorR = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.4), glassMat);
  doorR.position.set(1.6, 1.3, 0.22);
  comp.add(doorR);

  // Shopping carts flowing through smoothly
  const cartMat = new THREE.MeshStandardMaterial({ color: 0x90A4AE, metalness: 0.8 });
  [-0.9, 0.9].forEach((x, i) => {
    for (let c = 0; c < 3; c++) {
      const cart = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.65), cartMat);
      cart.name = `flowingCart_${i}_${c}`;
      cart.position.set(x, 0.35, -1.0 + c * 0.9);
      comp.add(cart);
    }
  });

  // Ceiling fire sprinkler heads
  const sprinklerMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F, metalness: 0.7 });
  [-1.5, 0, 1.5].forEach((x) => {
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.15, 8), sprinklerMat);
    sp.position.set(x, 2.9, 0);
    comp.add(sp);
  });

  // Frosted commercial freezers with icy vapor mist
  const freezerMat = new THREE.MeshStandardMaterial({ color: 0xFAFAFA, roughness: 0.2 });
  const frostMat = new THREE.MeshBasicMaterial({
    color: 0xE0F7FA,
    transparent: true,
    opacity: 0.5,
  });

  const freezer = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.1), freezerMat);
  freezer.name = 'frostedFreezer';
  freezer.position.set(0, 0.45, -2.5);
  comp.add(freezer);

  // Cold vapor mist particles
  const mistGroup = new THREE.Group();
  mistGroup.name = 'freezerMist';
  mistGroup.position.set(0, 1.0, -2.5);

  for (let m = 0; m < 6; m++) {
    const mist = new THREE.Mesh(new THREE.SphereGeometry(0.12 + m * 0.03, 6, 6), frostMat);
    mist.position.set((m - 2.5) * 0.35, 0, 0);
    mistGroup.add(mist);
  }
  comp.add(mistGroup);

  comp.updateFreezers = (time: number) => {
    mistGroup.children.forEach((p, i) => {
      p.position.y = 0.1 + Math.sin(time * 3 + i) * 0.08;
      p.scale.setScalar(0.8 + Math.cos(time * 2 + i) * 0.2);
    });
  };

  return comp;
}

/**
 * E21. Safety Inspector character plus large "PASSED" stamp prop with stamp-thud animation.
 */
export function createSafetyInspectorAndStamp(): THREE.Group & {
  triggerStampThud: (onComplete?: () => void) => void;
  updateStamp: (time: number) => void;
} {
  const inspectorGroup = new THREE.Group() as THREE.Group & {
    triggerStampThud: (onComplete?: () => void) => void;
    updateStamp: (time: number) => void;
  };
  inspectorGroup.name = 'safetyInspectorAndStamp';

  let isStamping = false;
  let stampTimer = 0;
  let onStampDone: (() => void) | null = null;

  // 1. Safety Inspector Character
  const inspector = new THREE.Group();
  inspector.name = 'safetyInspector';
  inspector.position.set(-1.8, 0, 0);

  const whiteHatMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1E88E5, roughness: 0.5 });
  const skinMat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.skinTone1 });

  // Body
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.28), jacketMat);
  torso.position.y = 0.85;
  inspector.add(torso);

  // White helmet
  const helmet = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.16, 12), whiteHatMat);
  helmet.position.set(0, 1.5, 0);
  inspector.add(helmet);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), skinMat);
  head.position.set(0, 1.35, 0);
  inspector.add(head);

  // Clipboard with all 5 green checkmarks (PASSED checklist)
  const checklistTex = createTextTexture('CODE COMPLIANT', {
    bg: '#FFFFFF',
    color: '#2E7D32',
    subtext: '✓ Safety ✓ Conduits ✓ Power',
    fontSize: 40,
  });
  const checklist = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.7),
    new THREE.MeshStandardMaterial({ map: checklistTex })
  );
  checklist.position.set(0.35, 0.95, 0.25);
  checklist.rotation.y = -0.3;
  inspector.add(checklist);

  inspectorGroup.add(inspector);

  // 2. Giant Cartoon Rubber Stamp Prop: "PASSED"
  const stampProp = new THREE.Group();
  stampProp.name = 'giantPassedStamp';
  stampProp.position.set(1.2, 4.0, 0); // starts high above

  // Stamp handle (wooden knob)
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.7 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.9, 12), handleMat);
  handle.position.y = 0.75;
  stampProp.add(handle);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), handleMat);
  knob.position.y = 1.25;
  stampProp.add(knob);

  // Stamp base block
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x3E2723 });
  const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 1.4), baseMat);
  baseBlock.position.y = 0.2;
  stampProp.add(baseBlock);

  // Stamp imprint face: "PASSED"
  const passedTex = createTextTexture('PASSED', {
    bg: '#2E7D32',
    color: '#FFFFFF',
    subtext: 'CERTIFIED ARCHITECTURE ✓',
    fontSize: 60,
    border: '#A5D6A7',
  });
  const passedFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 1.3),
    new THREE.MeshStandardMaterial({ map: passedTex, roughness: 0.3 })
  );
  passedFace.rotation.x = Math.PI / 2;
  passedFace.position.y = 0.02;
  stampProp.add(passedFace);

  inspectorGroup.add(stampProp);

  // Floor Stamp Imprint (Appears on floor after thud)
  const floorImprint = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 1.4),
    new THREE.MeshBasicMaterial({
      map: passedTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  );
  floorImprint.rotation.x = -Math.PI / 2;
  floorImprint.position.set(1.2, 0.02, 0);
  inspectorGroup.add(floorImprint);

  // Shockwave ring
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x66BB6A,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
  });
  const shockwave = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.7, 24), ringMat);
  shockwave.rotation.x = -Math.PI / 2;
  shockwave.position.set(1.2, 0.03, 0);
  inspectorGroup.add(shockwave);

  inspectorGroup.triggerStampThud = (onComplete) => {
    isStamping = true;
    stampTimer = 0;
    onStampDone = onComplete || null;
    stampProp.position.y = 4.0;
    floorImprint.material.opacity = 0;
    shockwave.material.opacity = 0;
    shockwave.scale.setScalar(1);
  };

  inspectorGroup.updateStamp = (_time: number) => {
    if (isStamping) {
      stampTimer += 0.03;
      if (stampTimer < 0.6) {
        // Fast descent
        stampProp.position.y = 4.0 - Math.pow(stampTimer / 0.6, 2) * 3.8;
      } else if (stampTimer < 0.8) {
        // THUD on floor!
        stampProp.position.y = 0.2;
        floorImprint.material.opacity = 1.0;
        // Shockwave expansion
        const swTime = (stampTimer - 0.6) / 0.2;
        shockwave.material.opacity = 1.0 - swTime;
        shockwave.scale.setScalar(1 + swTime * 3.5);
      } else if (stampTimer < 1.4) {
        // Gentle rebound / lift back up to display the stamped result
        const lift = (stampTimer - 0.8) / 0.6;
        stampProp.position.y = 0.2 + lift * 2.2;
      } else {
        isStamping = false;
        if (onStampDone) onStampDone();
      }
    }
  };

  return inspectorGroup;
}
