import * as THREE from 'three';

export const LEVEL1_PALETTE = {
  mudBrown: 0x8B5A2B,
  mudBrownDark: 0x6E431F,
  mudPuddle: 0x5D3E24,
  puddleWater: 0x88CCEE,
  wetConcreteGrey: 0x9AA0A6,
  curedConcrete: 0xB0B7BD,
  freshMartGreen: 0x1E8E3E,
  freshMartGreenLight: 0x34A853,
  freshMartGreenDark: 0x137333,
  safetyOrange: 0xFF8A00,
  safetyOrangeBright: 0xFFA000,
  skyBlue: 0xBFE6FF,
  skyBlueDeep: 0x70B5F9,
  warningRed: 0xE53935,
  warningRedDark: 0xC62828,
  
  // Tamil Nadu & Accent Flavours
  autoYellow: 0xFFD600,
  autoGreen: 0x1B5E20,
  bananaLeaf: 0x4CAF50,
  palmFrond: 0x2E7D32,
  palmTrunk: 0x795548,
  coconutShell: 0x5D4037,
  templeStone: 0x8D6E63,
  templeGold: 0xFBC02D,
  rupeeGold: 0xFFC107,
  
  // Materials & Construction
  steelBlue: 0x78909C,
  rebarRust: 0xBF360C,
  sandYellow: 0xDEB887,
  gravelGrey: 0x757575,
  asphaltDark: 0x263238,
  hazardYellow: 0xFFEB3B,
  hazardBlack: 0x212121,
  
  // Characters & props
  skinTone1: 0xC68642,
  skinTone2: 0x8D5524,
  skinTone3: 0xE0AC69,
  workerOrange: 0xFF7043,
  workerBlue: 0x42A5F5,
  workerYellow: 0xFFCA28,
  rubberBootBlack: 0x212121,
  iceCreamPink: 0xF48FB1,
  iceCreamBrown: 0x5D4037,
  iceCreamCream: 0xFFF9C4,
  frostCyan: 0xE0F7FA,
  stinkGreen: 0x7CB342,
  hologramBlue: 0x00E5FF,
  badgeAmber: 0xFFA000,
  badgeBlue: 0x0288D1,
};

// Reusable canvas procedural textures
export function createTextTexture(
  text: string,
  options: {
    bg?: string;
    color?: string;
    fontSize?: number;
    width?: number;
    height?: number;
    border?: string;
    subtext?: string;
  } = {}
): THREE.CanvasTexture {
  const width = options.width || 512;
  const height = options.height || 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  if (options.bg) {
    ctx.fillStyle = options.bg;
    ctx.fillRect(0, 0, width, height);
  }

  if (options.border) {
    ctx.strokeStyle = options.border;
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);
  }

  ctx.fillStyle = options.color || '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${options.fontSize || 54}px sans-serif`;
  ctx.fillText(text, width / 2, options.subtext ? height / 2 - 24 : height / 2);

  if (options.subtext) {
    ctx.font = `600 ${Math.floor((options.fontSize || 54) * 0.45)}px sans-serif`;
    ctx.fillStyle = options.color || '#FFFFFF';
    ctx.fillText(options.subtext, width / 2, height / 2 + 36);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createHazardStripeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#FFD600';
  ctx.fillRect(0, 0, 256, 64);
  
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  for (let x = -64; x < 320; x += 32) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 20, 0);
    ctx.lineTo(x + 4, 64);
    ctx.lineTo(x - 16, 64);
    ctx.closePath();
  }
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createBlueprintGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0a2540';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Major accent grid
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Material cache for optimal performance (shared instances)
export const SHARED_MATERIALS = {
  mud: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.mudBrown,
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true,
  }),
  wetPuddle: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.puddleWater,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85,
  }),
  concreteGrey: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.wetConcreteGrey,
    roughness: 0.7,
    metalness: 0.1,
  }),
  freshMartGreen: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.freshMartGreen,
    roughness: 0.4,
    metalness: 0.1,
  }),
  safetyOrange: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.safetyOrange,
    roughness: 0.35,
    metalness: 0.15,
  }),
  steel: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.steelBlue,
    roughness: 0.3,
    metalness: 0.7,
  }),
  gold: new THREE.MeshStandardMaterial({
    color: LEVEL1_PALETTE.rupeeGold,
    roughness: 0.25,
    metalness: 0.8,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: LEVEL1_PALETTE.skyBlue,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 0.5,
    transparent: true,
    opacity: 0.7,
  }),
};
