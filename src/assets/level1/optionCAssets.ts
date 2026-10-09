import * as THREE from 'three';
import { LEVEL1_PALETTE, createTextTexture } from './materials';

/**
 * F22. Open tin shed with no dividers and an echo (visual sound rings).
 */
export function createTinShedChaos(): THREE.Group & {
  updateEchoRings: (time: number) => void;
} {
  const shed = new THREE.Group() as THREE.Group & {
    updateEchoRings: (time: number) => void;
  };
  shed.name = 'tinShedChaos';

  const rustMat = new THREE.MeshStandardMaterial({
    color: 0x8D6E63,
    roughness: 0.9,
    metalness: 0.3,
  });
  const tinRoofMat = new THREE.MeshStandardMaterial({
    color: 0x90A4AE,
    metalness: 0.7,
    roughness: 0.5,
  });

  // Open rusted steel truss pillars (no walls anywhere!)
  const pillarCoords = [
    { x: -4.0, z: -3.5 },
    { x: 4.0, z: -3.5 },
    { x: -4.0, z: 3.5 },
    { x: 4.0, z: 3.5 },
    { x: -4.0, z: 0 },
    { x: 4.0, z: 0 },
  ];

  pillarCoords.forEach((pc, i) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 0.25), rustMat);
    col.name = `shedTrussPillar_${i}`;
    col.position.set(pc.x, 1.9, pc.z);
    col.castShadow = true;
    shed.add(col);
  });

  // Cross truss beams
  const beamFront = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.2, 0.2), rustMat);
  beamFront.position.set(0, 3.7, 3.5);
  shed.add(beamFront);

  const beamBack = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.2, 0.2), rustMat);
  beamBack.position.set(0, 3.7, -3.5);
  shed.add(beamBack);

  // Corrugated Tin Roof (Slanted gable shed)
  const roofL = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.1, 7.8), tinRoofMat);
  roofL.position.set(-2.1, 4.3, 0);
  roofL.rotation.z = -0.22;
  shed.add(roofL);

  const roofR = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.1, 7.8), tinRoofMat);
  roofR.position.set(2.1, 4.3, 0);
  roofR.rotation.z = 0.22;
  shed.add(roofR);

  // Visual expanding sound echo rings rippling across cavern
  const echoGroup = new THREE.Group();
  echoGroup.name = 'soundEchoRings';
  echoGroup.position.set(0, 2.2, 0);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xFFEB3B,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });

  for (let r = 0; r < 4; r++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.5, 24), ringMat.clone());
    ring.name = `echoRing_${r}`;
    echoGroup.add(ring);
  }
  shed.add(echoGroup);

  shed.updateEchoRings = (time: number) => {
    echoGroup.children.forEach((c, idx) => {
      const mesh = c as THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
      const phase = (time * 1.5 + idx * 0.4) % 1.5;
      mesh.scale.setScalar(0.8 + phase * 3.5);
      mesh.material.opacity = Math.max(0, 0.8 - phase / 1.5);
    });
  };

  return shed;
}

/**
 * F23. Fish counter next to perfume shelf, with green stink lines drifting over.
 */
export function createFishAndPerfumeCross(): THREE.Group & {
  updateStink: (time: number) => void;
} {
  const cross = new THREE.Group() as THREE.Group & {
    updateStink: (time: number) => void;
  };
  cross.name = 'fishAndPerfumeCross';

  // 1. Fresh Fish Stall (Coastal Tamil Nadu market style)
  const fishStall = new THREE.Group();
  fishStall.name = 'fishStall';
  fishStall.position.set(-1.4, 0, 0);

  // Ice bed counter
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x37474F });
  const iceMat = new THREE.MeshStandardMaterial({ color: 0xE0F7FA, roughness: 0.1 });
  const fishMat = new THREE.MeshStandardMaterial({ color: 0x78909C, metalness: 0.6 });

  const counter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.2), counterMat);
  counter.position.y = 0.4;
  fishStall.add(counter);

  const iceBed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.1), iceMat);
  iceBed.position.y = 0.85;
  fishStall.add(iceBed);

  // Fish lying on crushed ice
  for (let f = 0; f < 3; f++) {
    const fish = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 6), fishMat);
    fish.rotation.z = Math.PI / 2;
    fish.position.set((f - 1) * 0.4, 0.98, 0);
    fishStall.add(fish);
  }
  cross.add(fishStall);

  // 2. Luxury Perfume Shelf (Placed right next to it!)
  const perfumeShelf = new THREE.Group();
  perfumeShelf.name = 'perfumeShelf';
  perfumeShelf.position.set(1.4, 0, 0);

  const shelfWood = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x4E342E })
  );
  shelfWood.position.y = 0.7;
  perfumeShelf.add(shelfWood);

  // Scent bottles
  const bottleColors = [0xE91E63, 0x9C27B0, 0x00BCD4];
  bottleColors.forEach((bc, idx) => {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8),
      new THREE.MeshStandardMaterial({ color: bc })
    );
    bottle.position.set(-0.35 + idx * 0.35, 1.2, 0.1);
    perfumeShelf.add(bottle);
  });
  cross.add(perfumeShelf);

  // 3. Animated Green Wavy Stink Particles drifting from fish over to perfume
  const stinkGroup = new THREE.Group();
  stinkGroup.name = 'stinkLines';
  stinkGroup.position.set(-0.5, 1.1, 0);

  const stinkMat = new THREE.MeshBasicMaterial({
    color: LEVEL1_PALETTE.stinkGreen,
    transparent: true,
    opacity: 0.75,
  });

  for (let s = 0; s < 6; s++) {
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), stinkMat);
    drop.name = `stinkParticle_${s}`;
    stinkGroup.add(drop);
  }
  cross.add(stinkGroup);

  // Chaos sign: "CONTAMINATION!"
  const contamTex = createTextTexture('STINK DISASTER!', {
    bg: '#7CB342',
    color: '#111111',
    subtext: 'NO DEPARTMENT SEPARATION',
    fontSize: 44,
  });
  const contamSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 0.8),
    new THREE.MeshBasicMaterial({ map: contamTex })
  );
  contamSign.position.set(0, 2.3, 0);
  cross.add(contamSign);

  cross.updateStink = (time: number) => {
    stinkGroup.children.forEach((p, idx) => {
      // Drifts from left (-1.0) to right (+2.0) across to the perfume
      const prog = (time * 1.2 + idx * 0.35) % 2.5;
      p.position.x = prog;
      p.position.y = Math.sin(time * 5 + prog * 3) * 0.25;
      p.position.z = Math.cos(time * 3 + prog) * 0.15;
    });
  };

  return cross;
}

/**
 * F24. Loose cables across walkway, 3 shoppers tripping animation.
 */
export function createTrippingShoppers(): THREE.Group & {
  updateTripping: (time: number) => void;
} {
  const trip = new THREE.Group() as THREE.Group & {
    updateTripping: (time: number) => void;
  };
  trip.name = 'trippingShoppers';

  // Walkway floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(5.0, 3.5),
    new THREE.MeshStandardMaterial({ color: 0x9E9E9E, roughness: 0.8 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.02;
  trip.add(floor);

  // Tangled loose cables strewn across the walking floor (no conduits!)
  const cableMat = new THREE.MeshStandardMaterial({ color: 0xFDD835 });
  const darkCableMat = new THREE.MeshStandardMaterial({ color: 0x212121 });

  for (let c = 0; c < 5; c++) {
    const cMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 3.8, 6),
      c % 2 === 0 ? cableMat : darkCableMat
    );
    cMesh.rotation.z = Math.PI / 2 + (c - 2) * 0.15;
    cMesh.position.set(0, 0.04, (c - 2) * 0.6);
    trip.add(cMesh);
  }

  // 3 Shoppers caught mid-stumble / trip
  const shopper1 = new THREE.Group();
  shopper1.name = 'shopperStumble_1';
  shopper1.position.set(-1.4, 0.3, 0);

  const s1Torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.55, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x1E88E5 })
  );
  s1Torso.rotation.x = 0.8; // tipped forward mid-fall!
  s1Torso.position.y = 0.5;
  shopper1.add(s1Torso);
  trip.add(shopper1);

  const shopper2 = new THREE.Group();
  shopper2.name = 'shopperStumble_2';
  shopper2.position.set(0.2, 0.3, -0.6);

  const s2Torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.55, 0.25),
    new THREE.MeshStandardMaterial({ color: 0xE91E63 })
  );
  s2Torso.rotation.z = -0.7; // tipped sideways!
  s2Torso.position.y = 0.5;
  shopper2.add(s2Torso);
  trip.add(shopper2);

  // Shopper 3 dropping a bag of tumbling oranges!
  const shopper3 = new THREE.Group();
  shopper3.name = 'shopperStumble_3';
  shopper3.position.set(1.5, 0.3, 0.4);

  const s3Torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.55, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x43A047 })
  );
  s3Torso.rotation.x = -0.6;
  s3Torso.position.y = 0.5;
  shopper3.add(s3Torso);

  // Tumbling oranges on floor
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xFF6D00 });
  const orangesGroup = new THREE.Group();
  orangesGroup.name = 'tumblingOranges';
  for (let o = 0; o < 6; o++) {
    const orange = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), orangeMat);
    orange.position.set(1.5 + (o % 3) * 0.25, 0.08, 0.4 + Math.floor(o / 3) * 0.25);
    orangesGroup.add(orange);
  }
  trip.add(orangesGroup);

  trip.updateTripping = (time: number) => {
    // Stumble vibration / wobble
    s1Torso.rotation.x = 0.8 + Math.sin(time * 8) * 0.1;
    s2Torso.rotation.z = -0.7 + Math.cos(time * 8) * 0.1;
    s3Torso.rotation.x = -0.6 + Math.sin(time * 7) * 0.12;
  };

  return trip;
}

/**
 * F25. City safety officer, whistle, orange "UNSAFE / BUSINESS SHUT DOWN" sticker.
 */
export function createCitySafetyOfficer(): THREE.Group & {
  blowWhistle: (active: boolean) => void;
  updateOfficer: (time: number) => void;
} {
  const officerProp = new THREE.Group() as THREE.Group & {
    blowWhistle: (active: boolean) => void;
    updateOfficer: (time: number) => void;
  };
  officerProp.name = 'citySafetyOfficerAndShutdown';

  let isBlowing = true;

  // Closed rolling shutter
  const shutterMat = new THREE.MeshStandardMaterial({
    color: 0x78909C,
    metalness: 0.8,
    roughness: 0.4,
  });
  const shutter = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 0.15), shutterMat);
  shutter.name = 'rollingShutter';
  shutter.position.set(0, 1.6, -1.0);
  officerProp.add(shutter);

  // Big Orange/Red "UNSAFE / BUSINESS SHUT DOWN" Sticker taped across shutter
  const shutdownTex = createTextTexture('UNSAFE / SHUT DOWN', {
    bg: '#E53935',
    color: '#FFFFFF',
    subtext: 'CODE VIOLATION • MUNICIPAL NOTICE ⚠️',
    fontSize: 48,
    border: '#FFD600',
  });
  const sticker = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 1.4),
    new THREE.MeshStandardMaterial({ map: shutdownTex, roughness: 0.4 })
  );
  sticker.name = 'unsafeSticker';
  sticker.position.set(0, 1.6, -0.91);
  sticker.rotation.z = -0.12; // slapped diagonally
  officerProp.add(sticker);

  // Municipal Safety Officer
  const officer = new THREE.Group();
  officer.name = 'safetyOfficer';
  officer.position.set(0, 0, 0.4);

  const khakiMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
  const skinMat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.skinTone2 });

  // Body
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.3), khakiMat);
  torso.position.y = 0.85;
  officer.add(torso);

  // Peaked service cap
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.14, 12), hatMat);
  cap.position.set(0, 1.5, 0);
  officer.add(cap);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), skinMat);
  head.position.set(0, 1.35, 0);
  officer.add(head);

  // Whistle in mouth
  const whistleMat = new THREE.MeshStandardMaterial({ color: 0xFFD600, metalness: 0.8 });
  const whistle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.16), whistleMat);
  whistle.name = 'whistle';
  whistle.position.set(0, 1.3, 0.22);
  officer.add(whistle);

  officerProp.add(officer);

  officerProp.blowWhistle = (active: boolean) => {
    isBlowing = active;
  };

  officerProp.updateOfficer = (time: number) => {
    if (isBlowing) {
      // Puffed chest whistling pulsation
      torso.scale.x = 1.0 + Math.sin(time * 12) * 0.04;
      whistle.position.z = 0.22 + Math.sin(time * 12) * 0.02;
    }
  };

  return officerProp;
}
