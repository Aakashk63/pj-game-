/**
 * ARCHITECTURA CENTRAL ART & DESIGN SYSTEM THEME
 * Derived from the urban reference image and stylized diorama principles.
 * Any visual adjustment in lighting, colors, or materials should be done here.
 */

export const THEME = {
  // Color Palette
  colors: {
    // Environment & Grounds
    ground: {
      islandBase: '#1c242c',      // Floating island sub-strata bedrock
      islandTop: '#2e3a46',       // Grass/bedrock upper plateau
      plaza: '#788a96',           // Concrete pedestrian plaza paving slabs
      paverTerracotta: '#a65d46', // Terracotta diamond pavers from reference image
      paverCream: '#ede1d1',      // Pale cream diamond paver accent
      paverTan: '#d8b490',        // Warm tan diamond paver accent
      asphalt: '#2d3748',         // Dark road asphalt with aggregate grain
      curb: '#8c9bae',            // Chamfered stone street curb
      laneMarking: '#f1f5f9',     // Crisp white road dashes and crosswalk markings
      grassAccent: '#3b7a57',     // Landscaped perimeter hedges & grass strips
    },

    // Architectural Facades & Structures
    building: {
      brickPrimary: '#8d6e63',    // Warm commercial brickwork from reference
      brickDark: '#5d4037',       // Foundation pillars and decorative stonework
      concreteSand: '#9e9d89',    // Commercial office stone/stucco
      concretePale: '#a0aab2',    // Microservice modular node concrete
      glassReflective: '#38bdf8', // Blue-sky reflective office window glazing
      glassIlluminated: '#fef08a',// Warm lit windows when operational
      glassFailure: '#f87171',    // Red-tinted windows during failure
      roofMetal: '#334155',       // Rooftop flashing, parapet caps
      hvacChiller: '#64748b',     // Industrial rooftop AC and pipe hardware
      doorway: '#1e293b',         // Entrance portal depth
      storefrontSign: '#d97706',  // Warm amber illuminated retail/office signage
    },

    // Characters (Matching friendly cartoon comic style)
    character: {
      jacketLeather: '#a0522d',   // Cognac brown leather jacket
      jacketAccent: '#f5efe6',    // Cream collar / lapel
      shirtInner: '#ffffff',      // Crisp white tee / shirt
      pantsDenim: '#3d5a80',      // Classic blue denim jeans
      bootsLeather: '#6d4c41',    // Work boots
      skinTone: '#e2a782',        // Warm skin tone
      sunglasses: '#111827',      // Dark aviator shades
      hair: '#3e2723',            // Stylized dark brown hair
      pedestrianAlt: '#475569',   // Slate commuter trousers
      // Security Guard (Navy uniform, peaked cap, friendly mustache)
      guardNavy: '#1b2a4a',       // Deep navy jacket/shirt
      guardNavyDark: '#111d33',   // Cap & trousers
      guardGold: '#f1c40f',       // Gold badge & visor trim
      guardMustache: '#2c3e50',   // Friendly stylized mustache
      // Intruder (Kid-friendly cartoon dark hoodie)
      intruderHoodie: '#334155',  // Charcoal blue hoodie
      intruderPants: '#1e293b',   // Dark denim
      // Diverse employees
      skinTones: ['#f5d0a9', '#d8a070', '#8d5524', '#c68642', '#e0ac69'],
      clothes: ['#e74c3c', '#3498db', '#9b59b6', '#1abc9c', '#f39c12', '#2ecc71'],
    },

    // System Status, Signals & FX
    status: {
      healthy: '#10b981',         // Green: normal load
      passGreen: '#2ecc71',       // Green pass check
      warning: '#f59e0b',         // Amber: queue buildup
      critical: '#ef4444',        // Red
      deniedRed: '#e74c3c',       // Red access denied
      goldToken: '#f1c40f',       // Golden fast pass token
      scannerCyan: '#00f0ff',     // Cyan laser scanner beam
      packetGlow: '#06b6d4',      // Cyan glow: active network request capsule
      interactiveGlow: '#3b82f6', // Blue/cyan pulsing glow
      pedestalBase: '#1e293b',    // Diorama pedestal stone
      pedestalTrim: '#38bdf8',    // Glowing cyan/gold pedestal edge ring
      goldStar: '#fbbf24',        // High score star color
    },

    // Atmosphere & Sky
    atmosphere: {
      skyZenith: '#7dd3fc',       // Sky upper dome
      skyHorizon: '#e0f2fe',      // Atmospheric horizon haze
      fogColor: '#cbd5e1',        // Exponential depth fog
      sunLight: '#fffdf5',        // Warm sunlight (key light)
      ambientLight: '#94a3b8',    // Sky bounce ambient light
      nightSky: '#0f172a',        // Optional night contrast
    },

    // UI & HUD Tokens
    ui: {
      bgGlass: 'rgba(15, 23, 42, 0.78)',
      bgGlassLight: 'rgba(30, 41, 59, 0.85)',
      cardBorder: 'rgba(255, 255, 255, 0.12)',
      cardBorderActive: 'rgba(56, 189, 248, 0.5)',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textAccent: '#38bdf8',
      navyHeader: '#1b2a4a',
      yellowHighlight: '#f1c40f',
      buttonPrimary: '#0284c7',
      buttonPrimaryHover: '#0369a1',
      buttonSuccess: '#2ecc71',
      buttonCritical: '#e74c3c',
    }
  },

  // Lighting & Camera Defaults
  camera: {
    fov: 38,
    near: 0.1,
    far: 200,
    shots: {
      // Named camera presets for GSAP transitions
      wide: {
        position: [18, 17, 18] as [number, number, number],
        target: [0, 1.2, 0] as [number, number, number],
        fov: 38,
      },
      sunriseIntro: {
        position: [24, 6, 20] as [number, number, number],
        target: [0, 1.5, 0] as [number, number, number],
        fov: 34,
      },
      gateCloseup: {
        position: [0, 4.6, 9.2] as [number, number, number],
        target: [0, 1.2, 3.2] as [number, number, number],
        fov: 36,
      },
      deskCloseup: {
        position: [-4.6, 4.5, 6.5] as [number, number, number],
        target: [-3.8, 1.2, 2.8] as [number, number, number],
        fov: 34,
      },
      closeupBuilding: {
        position: [7, 5, 8] as [number, number, number],
        target: [0, 2.0, 0] as [number, number, number],
        fov: 32,
      },
      decisionPullback: {
        position: [0, 13, 20] as [number, number, number],
        target: [0, 1.5, 0] as [number, number, number],
        fov: 38,
      },
      topDownGrid: {
        position: [0, 26, 0.01] as [number, number, number],
        target: [0, 0, 0] as [number, number, number],
        fov: 28,
      },
      failureChaos: {
        position: [8, 7, 10] as [number, number, number],
        target: [0, 2.5, 2] as [number, number, number],
        fov: 42,
      },
      successCelebration: {
        position: [10, 9, 12] as [number, number, number],
        target: [0, 1.8, 1] as [number, number, number],
        fov: 35,
      },
      corridorCutaway: {
        position: [0, 6.5, 11] as [number, number, number],
        target: [0, 1.6, 0.4] as [number, number, number],
        fov: 36,
      },
      financeRoomCloseup: {
        position: [3.6, 4.2, 2.4] as [number, number, number],
        target: [1.2, 1.4, -1.8] as [number, number, number],
        fov: 34,
      },
      dualCheckpoint: {
        position: [14, 13, 14] as [number, number, number],
        target: [0, 1.2, 2.0] as [number, number, number],
        fov: 40,
      }
    }
  },

  lighting: {
    sunPosition: [16, 24, 14] as [number, number, number],
    sunIntensity: 1.85,
    ambientIntensity: 0.85,
    shadowMapSize: 2048,
    shadowBias: -0.00015,
  },

  // Dimensions & Grid metrics
  metrics: {
    islandRadius: 10,
    islandDepth: 4.5,
    roadWidth: 2.4,
    sidewalkWidth: 1.4,
    buildingFootprint: 2.6,
    floorHeight: 1.35,
    employeeScale: 0.45,
    pedestalRadius: 1.8,
  },

  // Animation timing presets (seconds)
  timing: {
    cameraMove: 1.4,
    buildingRise: 0.8,
    failureCollapse: 1.2,
    shakeDuration: 0.6,
    beatAutoAdvanceDelay: 3.5,
  }
} as const;

export type ThemeType = typeof THEME;
