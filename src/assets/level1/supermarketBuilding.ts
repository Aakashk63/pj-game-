import * as THREE from 'three';
import { LEVEL1_PALETTE, createTextTexture } from './materials';
import { createZoneTiles } from './planningAssets';
import { createAutoRickshaw } from './environmentAssets';

/**
 * G26. Persistent Modular FreshMart Supermarket (Reused in ALL later levels)
 * Built with swappable modules:
 * - Foundation module (with conduit access)
 * - Shell module (green & white walls, glass facade, auto sliding doors)
 * - Roof module (parapet, HVAC chillers, solar panels, illuminated FreshMart sign)
 * - Interior module (matching zone tiles C11: Veggies, Groceries, Frozen, Checkout, Billing)
 * - Parking module (auto-rickshaw bays, EV charger, cart corral, palms)
 * - Swappable slots for later levels (security gates, server room, auth checkpoint, load balancer)
 */
export function createModularSupermarket(): THREE.Group & {
  toggleModule: (moduleName: 'foundation' | 'shell' | 'roof' | 'interior' | 'parking', visible: boolean) => void;
  getExpansionSlot: (slotName: string) => THREE.Group | null;
  updateBuilding: (time: number) => void;
} {
  const building = new THREE.Group() as THREE.Group & {
    toggleModule: (moduleName: 'foundation' | 'shell' | 'roof' | 'interior' | 'parking', visible: boolean) => void;
    getExpansionSlot: (slotName: string) => THREE.Group | null;
    updateBuilding: (time: number) => void;
  };
  building.name = 'modularFreshMartSupermarket';

  // 1. FOUNDATION MODULE
  const foundationModule = new THREE.Group();
  foundationModule.name = 'foundationModule';

  const slabMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.curedConcrete,
    roughness: 0.8,
  });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.4, 11.0), slabMat);
  slab.position.y = 0.2;
  slab.receiveShadow = true;
  foundationModule.add(slab);

  // Conduit maintenance access hatch
  const hatch = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x455A64, metalness: 0.7 })
  );
  hatch.position.set(4.5, 0.41, -4.5);
  foundationModule.add(hatch);
  building.add(foundationModule);

  // 2. SHELL MODULE (Walls, facade, doors)
  const shellModule = new THREE.Group();
  shellModule.name = 'shellModule';

  const wallGreenMat = new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.freshMartGreen,
    roughness: 0.35,
  });
  const wallWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xFAFAFA,
    roughness: 0.4,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: LEVEL1_PALETTE.skyBlue,
    transmission: 0.85,
    transparent: true,
    opacity: 0.8,
  });

  // Left wall (White with green accent stripe)
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.6, 10.8), wallWhiteMat);
  wallL.position.set(-5.35, 2.2, 0);
  wallL.castShadow = true;
  shellModule.add(wallL);

  const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.6, 10.8), wallGreenMat);
  stripeL.position.set(-5.35, 3.2, 0);
  shellModule.add(stripeL);

  // Right wall
  const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.6, 10.8), wallWhiteMat);
  wallR.position.set(5.35, 2.2, 0);
  wallR.castShadow = true;
  shellModule.add(wallR);

  const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.6, 10.8), wallGreenMat);
  stripeR.position.set(5.35, 3.2, 0);
  shellModule.add(stripeR);

  // Back wall
  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(10.8, 3.6, 0.3), wallWhiteMat);
  wallBack.position.set(0, 2.2, -5.35);
  wallBack.castShadow = true;
  shellModule.add(wallBack);

  // Front Facade with large glass display windows
  const frontL = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.6, 0.3), wallGreenMat);
  frontL.position.set(-3.9, 2.2, 5.35);
  shellModule.add(frontL);

  const frontR = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.6, 0.3), wallGreenMat);
  frontR.position.set(3.9, 2.2, 5.35);
  shellModule.add(frontR);

  // Central Glass bay & automatic sliding doors
  const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.0, 0.1), glassMat);
  glassFacade.position.set(0, 1.9, 5.35);
  shellModule.add(glassFacade);

  const lintelFront = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 0.3), wallGreenMat);
  lintelFront.position.set(0, 3.7, 5.35);
  shellModule.add(lintelFront);

  building.add(shellModule);

  // 3. ROOF MODULE
  const roofModule = new THREE.Group();
  roofModule.name = 'roofModule';

  // Flat commercial roof slab
  const roofSlab = new THREE.Mesh(
    new THREE.BoxGeometry(11.4, 0.35, 11.4),
    new THREE.MeshStandardMaterial({ color: 0xCFD8DC, roughness: 0.6 })
  );
  roofSlab.position.y = 4.15;
  roofSlab.castShadow = true;
  roofModule.add(roofSlab);

  // Parapet edge trim
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(11.6, 0.4, 11.6),
    wallGreenMat
  );
  parapet.position.y = 4.45;
  roofModule.add(parapet);

  // Solar Panels (eco green supermarket)
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x0D47A1,
    metalness: 0.9,
    roughness: 0.1,
  });
  [-3.0, 0, 3.0].forEach((x) => {
    const sPanel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 4.0), solarMat);
    sPanel.position.set(x, 4.5, -1.8);
    sPanel.rotation.x = -0.15;
    roofModule.add(sPanel);
  });

  // Rooftop Chiller / HVAC
  const chiller = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.0, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x78909C, metalness: 0.6 })
  );
  chiller.position.set(3.4, 4.95, 2.5);
  roofModule.add(chiller);

  // Illuminated "FreshMart" Store Signboard with Rupee ₹ logo
  const signTex = createTextTexture('FreshMart', {
    bg: '#1E8E3E',
    color: '#FFFFFF',
    subtext: 'SUPERMARKET • சிறந்த தரம் ₹',
    fontSize: 58,
    border: '#FFD600',
  });
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(6.2, 1.6),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.2 })
  );
  sign.name = 'illuminatedFreshMartSign';
  sign.position.set(0, 5.2, 5.85);
  roofModule.add(sign);

  building.add(roofModule);

  // 4. INTERIOR MODULE (Zones matching C11)
  const interiorModule = new THREE.Group();
  interiorModule.name = 'interiorModule';
  interiorModule.position.set(0, 0.4, 0);

  const zones = createZoneTiles();
  zones.scale.set(0.95, 0.95, 0.95);
  interiorModule.add(zones);
  building.add(interiorModule);

  // 5. PARKING MODULE
  const parkingModule = new THREE.Group();
  parkingModule.name = 'parkingModule';
  parkingModule.position.set(0, 0.05, 8.5);

  const parkingAsphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(12.0, 5.0),
    new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.asphaltDark, roughness: 0.9 })
  );
  parkingAsphalt.rotation.x = -Math.PI / 2;
  parkingAsphalt.receiveShadow = true;
  parkingModule.add(parkingAsphalt);

  // Auto-rickshaw bay with parked auto-rickshaw
  const parkedRickshaw = createAutoRickshaw();
  parkedRickshaw.name = 'parkedCustomerRickshaw';
  parkedRickshaw.position.set(-3.5, 0, 0);
  parkedRickshaw.rotation.y = 0.4;
  parkingModule.add(parkedRickshaw);

  // EV Charging post prop
  const evCharger = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.2, 0.3),
    new THREE.MeshStandardMaterial({ color: LEVEL1_PALETTE.freshMartGreenLight })
  );
  evCharger.position.set(3.5, 0.6, -1.2);
  parkingModule.add(evCharger);

  // Cart corral with silver shopping carts
  const corral = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.8, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x90A4AE, wireframe: true })
  );
  corral.position.set(2.0, 0.4, 0.5);
  parkingModule.add(corral);

  building.add(parkingModule);

  // 6. SWAPPABLE EXTENSION SLOTS (For future levels!)
  const slotCounter = new THREE.Group();
  slotCounter.name = 'slot_frontCounter';
  slotCounter.position.set(0, 0.5, 4.0);
  building.add(slotCounter);

  const slotGates = new THREE.Group();
  slotGates.name = 'slot_securityGates';
  slotGates.position.set(0, 0.5, 5.0);
  building.add(slotGates);

  const slotServer = new THREE.Group();
  slotServer.name = 'slot_serverRoom';
  slotServer.position.set(-4.0, 0.5, -4.0);
  building.add(slotServer);

  const slotLB = new THREE.Group();
  slotLB.name = 'slot_loadBalancerRack';
  slotLB.position.set(4.0, 0.5, -4.0);
  building.add(slotLB);

  // Module toggle controller
  building.toggleModule = (name, visible) => {
    switch (name) {
      case 'foundation':
        foundationModule.visible = visible;
        break;
      case 'shell':
        shellModule.visible = visible;
        break;
      case 'roof':
        roofModule.visible = visible;
        break;
      case 'interior':
        interiorModule.visible = visible;
        break;
      case 'parking':
        parkingModule.visible = visible;
        break;
    }
  };

  building.getExpansionSlot = (slotName: string) => {
    return (building.getObjectByName(slotName) as THREE.Group) || null;
  };

  building.updateBuilding = (time: number) => {
    // Subtle neon sign pulse
    (sign.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x137333);
    (sign.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(time * 3) * 0.1;
  };

  return building;
}
