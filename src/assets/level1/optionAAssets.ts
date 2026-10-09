import * as THREE from 'three';
import { LEVEL1_PALETTE, createTextTexture } from './materials';

/**
 * D14. Wet concrete pour with flow animation, quickly hardening into a slab with walls rising.
 */
export function createWetConcretePour(): THREE.Group & {
  setPourProgress: (progress: number) => void;
  updatePourFlow: (time: number) => void;
} {
  const pour = new THREE.Group() as THREE.Group & {
    setPourProgress: (progress: number) => void;
    updatePourFlow: (time: number) => void;
  };
  pour.name = 'wetConcretePour';

  let currentProgress = 0.5; // 0 (flowing wet) to 1.0 (hardened cracked slab)

  // Pouring metal chute from mixer
  const chuteMat = new THREE.MeshStandardMaterial({ color: 0x546E7A, metalness: 0.8 });
  const chute = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 2.8), chuteMat);
  chute.name = 'pouringChute';
  chute.position.set(-3.5, 2.2, 0);
  chute.rotation.z = -0.4;
  pour.add(chute);

  // Wet flowing concrete stream
  const wetMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.wetConcreteGrey,
    roughness: 0.2, // glossy wet sludge
    metalness: 0.1,
  });
  const streamGeo = new THREE.CylinderGeometry(0.35, 0.6, 2.2, 12);
  const stream = new THREE.Mesh(streamGeo, wetMat);
  stream.name = 'concreteStream';
  stream.position.set(-2.5, 1.3, 0);
  stream.rotation.z = -0.35;
  pour.add(stream);

  // Concrete floor slab (expands and hardens)
  const slabMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.curedConcrete,
    roughness: 0.85,
    metalness: 0.05,
  });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.35, 7.0), slabMat);
  slab.name = 'concreteSlab';
  slab.position.y = 0.18;
  slab.receiveShadow = true;
  pour.add(slab);

  // Rising crooked walls (disaster construction)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x90A4AE,
    roughness: 0.9,
  });
  const wallsGroup = new THREE.Group();
  wallsGroup.name = 'risingWalls';

  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.8, 6.8), wallMat);
  wallL.position.set(-3.4, 1.4, 0);
  wallL.rotation.z = -0.04; // crooked!
  wallL.castShadow = true;
  wallsGroup.add(wallL);

  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.8, 0.35), wallMat);
  wallBack.position.set(0, 1.4, -3.4);
  wallBack.castShadow = true;
  wallsGroup.add(wallBack);

  pour.add(wallsGroup);

  pour.setPourProgress = (progress: number) => {
    currentProgress = Math.max(0, Math.min(1, progress));
    // Walls rise with progress
    wallsGroup.scale.y = currentProgress;
    wallsGroup.position.y = (currentProgress - 1) * 1.4;
    // Chute and stream fade out once hardened
    stream.visible = currentProgress < 0.95;
    chute.visible = currentProgress < 0.95;
  };

  pour.updatePourFlow = (time: number) => {
    if (currentProgress < 0.95) {
      // Flow pulsing wave
      stream.scale.set(
        1.0 + Math.sin(time * 12) * 0.08,
        1.0,
        1.0 + Math.cos(time * 12) * 0.08
      );
    }
  };

  pour.setPourProgress(0.8);
  return pour;
}

/**
 * D15. Reefer ice-cream truck with "800 tubs" crates.
 */
export function createReeferTruck(): THREE.Group {
  const truck = new THREE.Group();
  truck.name = 'reeferIceCreamTruck';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.3,
  });
  const reeferBlue = new THREE.MeshStandardMaterial({
    color: 0x0288D1,
    roughness: 0.4,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x263238,
  });

  // Cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 1.5), reeferBlue);
  cab.position.set(0, 0.9, 2.0);
  cab.castShadow = true;
  truck.add(cab);

  // Insulated refrigerated box body
  const reeferBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 3.6), bodyMat);
  reeferBox.position.set(0, 1.25, -0.6);
  reeferBox.castShadow = true;
  truck.add(reeferBox);

  // Rooftop refrigeration unit (Thermo-King style cooling compressor)
  const chiller = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.45, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x455A64 })
  );
  chiller.position.set(0, 2.3, 1.2);
  truck.add(chiller);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 12);
  wheelGeo.rotateZ(Math.PI / 2);
  [-0.95, 0.95].forEach((x) => {
    const wF = new THREE.Mesh(wheelGeo, darkMat);
    wF.position.set(x, 0.35, 1.8);
    truck.add(wF);

    const wR = new THREE.Mesh(wheelGeo, darkMat);
    wR.position.set(x, 0.35, -1.2);
    truck.add(wR);
  });

  // Stacked Crates: "800 Tubs Ice Cream"
  const cratesGroup = new THREE.Group();
  cratesGroup.name = 'iceCreamCrates';
  cratesGroup.position.set(1.8, 0, -0.6);

  const crateTex = createTextTexture('800 TUBS', {
    bg: '#E91E63',
    color: '#FFFFFF',
    subtext: 'ICE CREAM ❄️',
    fontSize: 50,
  });
  const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.6 });

  // 4 stacked crates
  [
    { x: 0, y: 0.3, z: 0 },
    { x: 0.85, y: 0.3, z: 0 },
    { x: 0, y: 0.85, z: 0 },
    { x: 0.85, y: 0.85, z: 0 },
  ].forEach((cp, idx) => {
    const cr = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.75), crateMat);
    cr.name = `crate_${idx}`;
    cr.position.set(cp.x, cp.y, cp.z);
    cr.castShadow = true;
    cratesGroup.add(cr);
  });
  truck.add(cratesGroup);

  return truck;
}

/**
 * D16. Bare wall with NO power outlets, freezer with dead plug, melting ice-cream puddle.
 */
export function createBareWallDisaster(): THREE.Group & {
  setMeltSpread: (scale: number) => void;
  updatePuddle: (time: number) => void;
} {
  const disaster = new THREE.Group() as THREE.Group & {
    setMeltSpread: (scale: number) => void;
    updatePuddle: (time: number) => void;
  };
  disaster.name = 'bareWallDisaster';

  // Bare rough concrete wall (Zero electric sockets!)
  const wallMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.curedConcrete,
    roughness: 0.95,
  });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.0, 0.35), wallMat);
  wall.name = 'bareWall';
  wall.position.set(0, 1.5, -1.5);
  disaster.add(wall);

  // Big warning sign floating above: "NO POWER OUTLETS!"
  const noPowerTex = createTextTexture('NO POWER OUTLETS!', {
    bg: '#E53935',
    color: '#FFFFFF',
    subtext: 'MISSING NON-FUNCTIONAL SPEC',
    fontSize: 44,
  });
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 1.0),
    new THREE.MeshStandardMaterial({ map: noPowerTex })
  );
  sign.position.set(0, 3.4, -1.3);
  disaster.add(sign);

  // Chest freezer sitting unplugged
  const freezerMat = new THREE.MeshStandardMaterial({
    color: 0xE0E0E0,
    roughness: 0.4,
  });
  const freezer = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 0.9), freezerMat);
  freezer.name = 'deadFreezer';
  freezer.position.set(0, 0.42, -0.6);
  freezer.castShadow = true;
  disaster.add(freezer);

  // Dead power cable & dangling 3-pin plug on floor
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.4, 6),
    cableMat
  );
  cable.name = 'deadCable';
  cable.rotation.z = 0.6;
  cable.position.set(0.7, 0.25, -0.6);
  disaster.add(cable);

  const plug = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.08), cableMat);
  plug.name = 'loosePlug';
  plug.position.set(1.1, 0.05, -0.6);
  disaster.add(plug);

  // Melting gooey puddle spreading across floor (strawberry pink + chocolate swirl)
  const puddleMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.iceCreamPink,
    roughness: 0.15, // glossy melted dairy goo
    metalness: 0.1,
  });
  const puddleGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.04, 24);
  const meltPuddle = new THREE.Mesh(puddleGeo, puddleMat);
  meltPuddle.name = 'meltingIceCreamPuddle';
  meltPuddle.position.set(0.2, 0.02, -0.4);
  meltPuddle.receiveShadow = true;
  disaster.add(meltPuddle);

  // Chocolate swirl streaks on puddle
  const chocMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.iceCreamBrown,
    roughness: 0.2,
  });
  const chocDrop = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.05, 12), chocMat);
  chocDrop.position.set(-0.3, 0.025, -0.3);
  disaster.add(chocDrop);

  disaster.setMeltSpread = (scale: number) => {
    meltPuddle.scale.set(scale, 1, scale);
    chocDrop.scale.set(scale * 0.8, 1, scale * 0.8);
  };

  disaster.updatePuddle = (time: number) => {
    // Subtle pulsating ripple on melted puddle
    const ripple = 1.0 + Math.sin(time * 2) * 0.03;
    meltPuddle.scale.x = ripple;
    meltPuddle.scale.z = ripple;
  };

  return disaster;
}

/**
 * D17. Narrow entrance with two jammed shopping carts and cartoon "stuck" shake.
 */
export function createJammedEntrance(): THREE.Group & {
  updateJammedShake: (time: number) => void;
} {
  const jammed = new THREE.Group() as THREE.Group & {
    updateJammedShake: (time: number) => void;
  };
  jammed.name = 'jammedEntrance';

  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x9AA0A6 });
  const cartWireMat = new THREE.MeshStandardMaterial({
    color: 0xCFD8DC,
    metalness: 0.8,
    roughness: 0.2,
  });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xE53935 });

  // Narrow Doorframe (Too narrow! Only 1 cart wide)
  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.5, 0.3), concreteMat);
  postL.position.set(-0.75, 1.25, 0);
  jammed.add(postL);

  const postR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.5, 0.3), concreteMat);
  postR.position.set(0.75, 1.25, 0);
  jammed.add(postR);

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 0.3), concreteMat);
  lintel.position.set(0, 2.65, 0);
  jammed.add(lintel);

  // Two jammed shopping carts
  const cartsSubgroup = new THREE.Group();
  cartsSubgroup.name = 'jammedCartsPair';

  // Cart 1
  const cart1 = new THREE.Group();
  const basket1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.7), cartWireMat);
  basket1.position.y = 0.5;
  cart1.add(basket1);
  const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), handleMat);
  handle1.rotation.z = Math.PI / 2;
  handle1.position.set(0, 0.8, -0.35);
  cart1.add(handle1);
  cart1.position.set(-0.25, 0, 0);
  cart1.rotation.y = 0.25;
  cartsSubgroup.add(cart1);

  // Cart 2
  const cart2 = new THREE.Group();
  const basket2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.7), cartWireMat);
  basket2.position.y = 0.5;
  cart2.add(basket2);
  const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), handleMat);
  handle2.rotation.z = Math.PI / 2;
  handle2.position.set(0, 0.8, -0.35);
  cart2.add(handle2);
  cart2.position.set(0.25, 0, 0);
  cart2.rotation.y = -0.25;
  cartsSubgroup.add(cart2);

  jammed.add(cartsSubgroup);

  // "STUCK!" floating warning text
  const stuckTex = createTextTexture('JAMMED!', {
    bg: '#E53935',
    color: '#FFFFFF',
    subtext: 'BOTTLENECK • CAPACITY OVERLOAD',
    fontSize: 48,
  });
  const stuckSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.8),
    new THREE.MeshStandardMaterial({ map: stuckTex })
  );
  stuckSign.position.set(0, 3.2, 0);
  jammed.add(stuckSign);

  jammed.updateJammedShake = (time: number) => {
    // Cartoon "stuck" vibrating wobble
    const shake = Math.sin(time * 35) * 0.04;
    cartsSubgroup.position.x = shake;
    cartsSubgroup.rotation.z = shake * 0.5;
  };

  return jammed;
}

/**
 * D18. Demolition crew with jackhammer, concrete dust, budget meter draining.
 */
export function createDemolitionCrew(): THREE.Group & {
  updateDemolition: (time: number) => void;
  setBudgetDrain: (percent: number) => void;
} {
  const demo = new THREE.Group() as THREE.Group & {
    updateDemolition: (time: number) => void;
    setBudgetDrain: (percent: number) => void;
  };
  demo.name = 'demolitionCrew';

  // Jackhammer worker
  const workerMat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.workerOrange });
  const jackMat = new THREE.MeshStandardMaterial({ color: 0x455A64, metalness: 0.8 });
  const dustMat = new THREE.MeshBasicMaterial({
    color: 0xCFD8DC,
    transparent: true,
    opacity: 0.6,
  });

  const worker = new THREE.Group();
  worker.name = 'jackhammerWorker';

  // Body angled forward
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.25), workerMat);
  torso.position.set(0, 0.65, 0);
  torso.rotation.x = 0.3;
  worker.add(torso);

  // Jackhammer machine
  const jack = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), jackMat);
  jack.position.set(0, 0.45, 0.35);
  worker.add(jack);

  const chisel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.01, 0.4, 6),
    jackMat
  );
  chisel.position.set(0, 0.1, 0.35);
  worker.add(chisel);

  demo.add(worker);

  // Concrete dust particles
  const dustGroup = new THREE.Group();
  dustGroup.name = 'concreteDust';
  dustGroup.position.set(0, 0.1, 0.35);

  for (let d = 0; d < 8; d++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.08 + (d % 3) * 0.04, 6, 6), dustMat);
    p.name = `dust_${d}`;
    dustGroup.add(p);
  }
  demo.add(dustGroup);

  // Floating Budget Meter Bar (Drains into Red!)
  const meterGroup = new THREE.Group();
  meterGroup.name = 'budgetMeter';
  meterGroup.position.set(0, 2.4, 0);

  // Outer frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.45, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x212121 })
  );
  meterGroup.add(frame);

  // Fill bar (scales x)
  const barMat = new THREE.MeshBasicMaterial({ color: 0xE53935 });
  const fillBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 0.12), barMat);
  fillBar.name = 'budgetFillBar';
  fillBar.position.z = 0.02;
  meterGroup.add(fillBar);

  // Header text
  const costTex = createTextTexture('₹ OVER BUDGET!', {
    bg: 'transparent',
    color: '#FFD600',
    fontSize: 44,
  });
  const costSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.5),
    new THREE.MeshBasicMaterial({ map: costTex, transparent: true })
  );
  costSign.position.set(0, 0.5, 0.06);
  meterGroup.add(costSign);

  demo.add(meterGroup);

  demo.setBudgetDrain = (percent: number) => {
    // percent 1.0 (Safe) to 0.0 (Bankrupt)
    fillBar.scale.x = Math.max(0.05, percent);
    fillBar.position.x = ((percent - 1) * 2.2) / 2;
    if (percent < 0.3) {
      barMat.color.setHex(0xE53935); // Warning Red
    } else {
      barMat.color.setHex(0xFFA000); // Amber
    }
  };

  demo.updateDemolition = (time: number) => {
    // Violent jackhammer vibration
    const vib = Math.sin(time * 45) * 0.04;
    jack.position.y = 0.45 + vib;
    torso.position.y = 0.65 + vib * 0.5;

    // Dust particles flying upwards
    dustGroup.children.forEach((p, i) => {
      const phase = (time * 6 + i * 0.6) % 1;
      p.position.y = phase * 0.6;
      p.position.x = Math.sin(i * 1.5) * phase * 0.4;
      p.position.z = Math.cos(i * 1.5) * phase * 0.4;
      p.scale.setScalar(0.4 + phase * 1.2);
    });
  };

  demo.setBudgetDrain(0.25);
  return demo;
}
