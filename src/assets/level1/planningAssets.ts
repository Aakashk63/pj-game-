import * as THREE from 'three';
import { LEVEL1_PALETTE, createTextTexture, createBlueprintGridTexture } from './materials';

/**
 * C10. Overturned crate + large clipboard that expands into a holographic blueprint board.
 */
export function createBlueprintCrate(): THREE.Group & {
  setHologramExpanded: (expanded: boolean) => void;
  updateHologram: (time: number) => void;
} {
  const crateProp = new THREE.Group() as THREE.Group & {
    setHologramExpanded: (expanded: boolean) => void;
    updateHologram: (time: number) => void;
  };
  crateProp.name = 'blueprintCrate';

  let isExpanded = true;
  let currentExpansion = 1.0;

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x8D6E63,
    roughness: 0.85,
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x5D4037,
    roughness: 0.9,
  });

  // Overturned wooden shipping crate
  const crateBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1.2), woodMat);
  crateBody.name = 'crateBody';
  crateBody.position.y = 0.55;
  crateBody.castShadow = true;
  crateProp.add(crateBody);

  // Reinforcing wood slats
  [-0.7, 0, 0.7].forEach((x) => {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.12, 1.24), darkWoodMat);
    slat.position.set(x, 0.55, 0);
    crateProp.add(slat);
  });

  // Rolled up paper blueprints sitting on the crate
  const paperRollMat = new THREE.MeshStandardMaterial({ color: 0xFFF9C4 });
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12), paperRollMat);
  roll.rotation.z = Math.PI / 2;
  roll.position.set(-0.3, 1.16, 0.2);
  crateProp.add(roll);

  // Large Wooden Clipboard on top of crate
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x4E342E });
  const clipboard = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 1.1), boardMat);
  clipboard.name = 'crateClipboard';
  clipboard.position.set(0.2, 1.12, -0.1);
  clipboard.rotation.y = 0.15;
  crateProp.add(clipboard);

  // Holographic blueprint board expanding above
  const hologramGroup = new THREE.Group();
  hologramGroup.name = 'hologramBoard';
  hologramGroup.position.set(0, 1.6, 0);

  // Holographic projection screen
  const gridTex = createBlueprintGridTexture();
  const holoMat = new THREE.MeshBasicMaterial({
    map: gridTex,
    color: LEVEL1_PALETTE.hologramBlue,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });

  const screenGeo = new THREE.PlaneGeometry(3.6, 2.4);
  const screen = new THREE.Mesh(screenGeo, holoMat);
  screen.name = 'holoScreen';
  screen.position.y = 1.2;
  screen.rotation.x = -0.15;
  hologramGroup.add(screen);

  // Holographic wireframe architectural zones
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00E5FF,
    wireframe: true,
  });

  const zoneBoxes = [
    { x: -1.0, y: 0.6, w: 1.1, h: 0.8 },
    { x: 0.8, y: 0.6, w: 1.2, h: 0.8 },
    { x: -1.0, y: 1.7, w: 1.1, h: 0.9 },
    { x: 0.8, y: 1.7, w: 1.2, h: 0.9 },
  ];

  zoneBoxes.forEach((zb) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(zb.w, zb.h, 0.2), wireMat);
    box.position.set(zb.x, zb.y, 0.05);
    screen.add(box);
  });

  // Animated scanner laser line
  const scanLineMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.9,
  });
  const scanLine = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.04, 0.02), scanLineMat);
  scanLine.name = 'scanLine';
  screen.add(scanLine);

  crateProp.add(hologramGroup);

  crateProp.setHologramExpanded = (expanded: boolean) => {
    isExpanded = expanded;
  };

  crateProp.updateHologram = (time: number) => {
    const targetScale = isExpanded ? 1.0 : 0.0;
    currentExpansion += (targetScale - currentExpansion) * 0.1;
    hologramGroup.scale.setScalar(currentExpansion);
    hologramGroup.visible = currentExpansion > 0.02;

    // Scan line vertical sweep
    scanLine.position.y = Math.sin(time * 3) * 1.0;
  };

  return crateProp;
}

/**
 * C11. Floor-plan zone tiles (Vegetables, Dry Groceries, Frozen/Meat, Checkout Bays, Billing, Parking)
 * Each with unique colour, icon, and 3D mini-model.
 */
export function createZoneTile(zoneType: 'veggies' | 'groceries' | 'frozen' | 'checkout' | 'billing' | 'parking'): THREE.Group {
  const tile = new THREE.Group();
  tile.name = `zoneTile_${zoneType}`;

  const tileBaseGeo = new THREE.BoxGeometry(2.4, 0.18, 2.4);

  switch (zoneType) {
    case 'veggies': {
      // Fresh Vegetables Zone (Green)
      const mat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.5 });
      const base = new THREE.Mesh(tileBaseGeo, mat);
      base.castShadow = true;
      tile.add(base);

      // Crates with carrots and cabbages
      const crateMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
      const carrotMat = new THREE.MeshStandardMaterial({ color: 0xFF6D00 });
      const cabbageMat = new THREE.MeshStandardMaterial({ color: 0x66BB6A });

      [-0.5, 0.5].forEach((x, i) => {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.8), crateMat);
        crate.position.set(x, 0.25, 0);
        tile.add(crate);

        // Vegetables inside crate
        const vegMat = i === 0 ? carrotMat : cabbageMat;
        for (let vx = -0.25; vx <= 0.25; vx += 0.25) {
          for (let vz = -0.25; vz <= 0.25; vz += 0.25) {
            const v = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), vegMat);
            v.position.set(x + vx, 0.45, vz);
            tile.add(v);
          }
        }
      });
      break;
    }

    case 'groceries': {
      // Dry Groceries Zone (Warm Brown / Mustard)
      const mat = new THREE.MeshStandardMaterial({ color: 0xB8860B, roughness: 0.6 });
      const base = new THREE.Mesh(tileBaseGeo, mat);
      base.castShadow = true;
      tile.add(base);

      // Grocery shelving unit with colorful boxes
      const shelfMat = new THREE.MeshStandardMaterial({ color: 0xCFD8DC, metalness: 0.5 });
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.45), shelfMat);
      shelf.position.set(0, 0.65, 0);
      tile.add(shelf);

      // Cereal / Grocery boxes
      const boxColors = [0xE53935, 0x1E88E5, 0xFDD835, 0x43A047];
      boxColors.forEach((col, idx) => {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.35, 0.15),
          new THREE.MeshStandardMaterial({ color: col })
        );
        box.position.set(-0.55 + idx * 0.35, 0.75, 0.15);
        tile.add(box);
      });
      break;
    }

    case 'frozen': {
      // Frozen / Meat Zone (Ice Blue)
      const mat = new THREE.MeshStandardMaterial({ color: 0x0277BD, roughness: 0.4 });
      const base = new THREE.Mesh(tileBaseGeo, mat);
      base.castShadow = true;
      tile.add(base);

      // Commercial chest freezer
      const freezerMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.3 });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: LEVEL1_PALETTE.frostCyan,
        transmission: 0.85,
        transparent: true,
      });

      const chest = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 0.9), freezerMat);
      chest.position.set(0, 0.42, 0);
      tile.add(chest);

      const glassLid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.8), glassMat);
      glassLid.position.set(0, 0.77, 0);
      tile.add(glassLid);

      // Floating frost snowflake indicator
      const frostMat = new THREE.MeshBasicMaterial({ color: 0xE0F7FA });
      const frost = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), frostMat);
      frost.position.set(0, 1.2, 0);
      tile.add(frost);
      break;
    }

    case 'checkout': {
      // Checkout Bays Zone (Safety Orange / Cyan)
      const mat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.safetyOrange, roughness: 0.5 });
      const base = new THREE.Mesh(tileBaseGeo, mat);
      base.castShadow = true;
      tile.add(base);

      // Conveyor counter
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.6, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x37474F })
      );
      counter.position.set(0, 0.4, 0);
      tile.add(counter);

      // Conveyor rubber belt
      const belt = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      belt.rotation.x = -Math.PI / 2;
      belt.position.set(0, 0.71, 0);
      tile.add(belt);

      // Scanner arch
      const scanner = new THREE.Mesh(
        new THREE.TorusGeometry(0.25, 0.04, 6, 12, Math.PI),
        new THREE.MeshBasicMaterial({ color: 0xE53935 })
      );
      scanner.position.set(0.3, 0.72, 0);
      tile.add(scanner);
      break;
    }

    case 'billing': {
      // Billing Zone (Emerald & Gold) with Rupee ₹ sign
      const mat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.freshMartGreen, roughness: 0.4 });
      const base = new THREE.Mesh(tileBaseGeo, mat);
      base.castShadow = true;
      tile.add(base);

      // Cash Register POS desk
      const posDesk = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.65, 0.7),
        new THREE.MeshStandardMaterial({ color: 0xCFD8DC })
      );
      posDesk.position.set(0, 0.42, 0);
      tile.add(posDesk);

      // Cash register terminal
      const reg = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.25, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x212121 })
      );
      reg.position.set(0, 0.85, 0);
      tile.add(reg);

      // Floating golden Rupee (₹) coin!
      const rupeeTex = createTextTexture('₹', {
        bg: '#FFC107',
        color: '#111111',
        fontSize: 72,
      });
      const coinGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 20);
      coinGeo.rotateX(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        map: rupeeTex,
        metalness: 0.8,
        roughness: 0.2,
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.position.set(0, 1.4, 0);
      tile.add(coin);
      break;
    }

    case 'parking': {
      // Parking Zone (Asphalt with stalls and mini rickshaw)
      const mat = new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.asphaltDark, roughness: 0.9 });
      const base = new THREE.Mesh(tileBaseGeo, mat);
      base.castShadow = true;
      tile.add(base);

      // White parking lines
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      [-0.7, 0, 0.7].forEach((x) => {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.8), lineMat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(x, 0.1, 0);
        tile.add(line);
      });

      // Miniature parked cart
      const cart = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.4, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xB0BEC5, wireframe: true })
      );
      cart.position.set(-0.35, 0.35, 0);
      tile.add(cart);
      break;
    }
  }

  return tile;
}

/**
 * Complete set of 6 Floor-plan Zone Tiles assembled as an architectural grid.
 */
export function createZoneTiles(): THREE.Group {
  const grid = new THREE.Group();
  grid.name = 'floorPlanZoneTiles';

  const types: Array<'veggies' | 'groceries' | 'frozen' | 'checkout' | 'billing' | 'parking'> = [
    'veggies',
    'groceries',
    'frozen',
    'checkout',
    'billing',
    'parking',
  ];

  // 3x2 grid layout
  types.forEach((t, i) => {
    const tile = createZoneTile(t);
    const col = i % 3;
    const row = Math.floor(i / 3);
    tile.position.set((col - 1) * 2.7, 0, (row - 0.5) * 2.7);
    grid.add(tile);
  });

  return grid;
}

/**
 * C12. Requirement badges (floating icons)
 * Blue: Functional (what it DOES: 5,000 shoppers, fire-exit, freezer power)
 * Amber: Non-Functional (how it PERFORMS: monsoon rain cloud, sprinkler, throughput)
 */
export function createRequirementBadge(type: 'shoppers' | 'fireExit' | 'freezerPower' | 'monsoonCloud' | 'sprinkler' | 'performance'): THREE.Group {
  const badge = new THREE.Group();
  badge.name = `badge_${type}`;

  const isFunctional = type === 'shoppers' || type === 'fireExit' || type === 'freezerPower';
  const glowColor = isFunctional ? LEVEL1_PALETTE.badgeBlue : LEVEL1_PALETTE.badgeAmber;

  // Hexagonal / Rounded Pill Frame
  const frameGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.12, 6);
  frameGeo.rotateX(Math.PI / 2);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    metalness: 0.6,
    roughness: 0.3,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  badge.add(frame);

  // Outer glowing ring
  const ringGeo = new THREE.RingGeometry(0.68, 0.78, 6);
  const ringMat = new THREE.MeshBasicMaterial({
    color: glowColor,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.z = 0.07;
  badge.add(ring);

  // Badge icon texture & 3D emblem
  let title = '';
  let sub = isFunctional ? 'FUNCTIONAL' : 'NON-FUNCTIONAL';

  switch (type) {
    case 'shoppers':
      title = '5,000 / day';
      break;
    case 'fireExit':
      title = 'FIRE EXIT';
      break;
    case 'freezerPower':
      title = '100% POWER';
      break;
    case 'monsoonCloud':
      title = 'DRAINAGE';
      break;
    case 'sprinkler':
      title = 'SPRINKLERS';
      break;
    case 'performance':
      title = '99.9% UPTIME';
      break;
  }

  const badgeTex = createTextTexture(title, {
    bg: isFunctional ? '#0288D1' : '#FF8F00',
    color: '#FFFFFF',
    subtext: sub,
    fontSize: 48,
  });
  const faceMat = new THREE.MeshStandardMaterial({
    map: badgeTex,
    roughness: 0.3,
  });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), faceMat);
  face.position.z = 0.08;
  badge.add(face);

  return badge;
}

export function createRequirementBadges(): THREE.Group & {
  updateBadges: (time: number) => void;
} {
  const container = new THREE.Group() as THREE.Group & {
    updateBadges: (time: number) => void;
  };
  container.name = 'requirementBadgesSet';

  const functionalTypes: Array<'shoppers' | 'fireExit' | 'freezerPower'> = ['shoppers', 'fireExit', 'freezerPower'];
  const nonFunctionalTypes: Array<'monsoonCloud' | 'sprinkler' | 'performance'> = ['monsoonCloud', 'sprinkler', 'performance'];

  const allBadges: THREE.Group[] = [];

  // Blue Functional set on left
  functionalTypes.forEach((t, i) => {
    const b = createRequirementBadge(t);
    b.position.set(-2.4, 2.2 + i * 1.6, 0);
    container.add(b);
    allBadges.push(b);
  });

  // Amber Non-Functional set on right
  nonFunctionalTypes.forEach((t, i) => {
    const b = createRequirementBadge(t);
    b.position.set(2.4, 2.2 + i * 1.6, 0);
    container.add(b);
    allBadges.push(b);
  });

  container.updateBadges = (time: number) => {
    allBadges.forEach((b, idx) => {
      // Gentle floating hover & slight bob
      b.position.y += Math.sin(time * 3 + idx * 0.8) * 0.003;
      b.rotation.y = Math.sin(time * 2 + idx * 0.5) * 0.12;
    });
  };

  return container;
}

/**
 * C13. Underground conduit pipes:
 * Plumbing (blue), drainage (grey), electrical (yellow), shown as cutaway under the foundation.
 */
export function createUndergroundConduits(): THREE.Group & {
  setCutawayVisibility: (visible: boolean) => void;
} {
  const conduitProp = new THREE.Group() as THREE.Group & {
    setCutawayVisibility: (visible: boolean) => void;
  };
  conduitProp.name = 'undergroundConduits';

  // Cutaway trench soil base
  const cutawaySoilMat = new THREE.MeshStandardMaterial({
    color: 0x4A2E16,
    roughness: 0.95,
  });
  const trench = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.2, 5.0), cutawaySoilMat);
  trench.position.y = -0.6;
  conduitProp.add(trench);

  // 1. Plumbing pipes (Blue with brass valves)
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0288D1,
    roughness: 0.3,
    metalness: 0.5,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xFBC02D,
    metalness: 0.8,
    roughness: 0.2,
  });

  const waterPipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 5.6, 12);
  waterPipeGeo.rotateZ(Math.PI / 2);
  const waterPipe = new THREE.Mesh(waterPipeGeo, waterMat);
  waterPipe.name = 'waterPipe';
  waterPipe.position.set(0, -0.3, -1.2);
  conduitProp.add(waterPipe);

  // Brass valve
  const valve = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 6, 12), brassMat);
  valve.position.set(0, -0.15, -1.2);
  valve.rotation.x = Math.PI / 2;
  conduitProp.add(valve);

  // 2. Drainage / Sewage pipes (Grey ribbed PVC)
  const drainMat = new THREE.MeshStandardMaterial({
    color: 0x757575,
    roughness: 0.7,
  });
  const drainPipeGeo = new THREE.CylinderGeometry(0.22, 0.22, 5.6, 14);
  drainPipeGeo.rotateZ(Math.PI / 2);
  const drainPipe = new THREE.Mesh(drainPipeGeo, drainMat);
  drainPipe.name = 'drainPipe';
  drainPipe.position.set(0, -0.7, 0);
  conduitProp.add(drainPipe);

  // Inspection chamber manhole neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12), drainMat);
  neck.position.set(0, -0.4, 0);
  conduitProp.add(neck);

  // 3. Electrical conduit ducts (Bright Yellow with glowing junction boxes)
  const elecMat = new THREE.MeshStandardMaterial({
    color: 0xFDD835,
    roughness: 0.3,
  });
  const elecPipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.6, 12);
  elecPipeGeo.rotateZ(Math.PI / 2);
  const elecPipe = new THREE.Mesh(elecPipeGeo, elecMat);
  elecPipe.name = 'electricalConduit';
  elecPipe.position.set(0, -0.2, 1.2);
  conduitProp.add(elecPipe);

  // Junction box
  const jBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.35, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xF57F17, roughness: 0.4 })
  );
  jBox.position.set(0.8, -0.1, 1.2);
  conduitProp.add(jBox);

  conduitProp.setCutawayVisibility = (visible: boolean) => {
    conduitProp.visible = visible;
  };

  return conduitProp;
}
