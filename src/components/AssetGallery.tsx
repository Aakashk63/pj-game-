import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createMuddyPlot,
  createBackground,
  createSiteFence,
  createSiteCabin,
  createTrafficCones,
  createBarrierTape,
  createFuelGaugeProp,
  createCoconutPalm,
  createBananaPlant,
  createAutoRickshaw,
  createGopuramSilhouette,
  createCementMixer,
  createCementMixerFleet,
  createSteelRodStacks,
  createSandGravelPiles,
  createExcavator,
  createWorkersCrew,
  createSiteManager,
  createBossAvatar,
  createBlueprintCrate,
  createZoneTiles,
  createRequirementBadges,
  createUndergroundConduits,
  createWetConcretePour,
  createReeferTruck,
  createBareWallDisaster,
  createJammedEntrance,
  createDemolitionCrew,
  createRisingSupermarket,
  createProperFoundationWideEntrance,
  createSafetyInspectorAndStamp,
  createTinShedChaos,
  createFishAndPerfumeCross,
  createTrippingShoppers,
  createCitySafetyOfficer,
  createModularSupermarket,
  playIntro,
  playOptionA,
  playOptionB,
  playOptionC,
  stopAllLevel1Animations,
} from '../assets/level1/index';
import type { ManagerExpression } from '../assets/level1/crewAssets';
import type { MeterValues, Level1SceneRefs } from '../assets/level1/level1Animations';
import {
  Play,
  RotateCcw,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

interface AssetGalleryProps {
  onBackToMap?: () => void;
}

type CategoryKey =
  | 'diorama'
  | 'environment'
  | 'crew'
  | 'planning'
  | 'optionA'
  | 'optionB'
  | 'optionC'
  | 'modular';

export const AssetGallery: React.FC<AssetGalleryProps> = ({ onBackToMap }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active Category & Asset selection
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('diorama');
  const [activeAssetId, setActiveAssetId] = useState<string>('full_diorama');

  // Turntable & rendering toggles
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [triangleCount, setTriangleCount] = useState<number>(0);

  // Live Scenario Meters
  const [meters, setMeters] = useState<MeterValues>({
    cost: 100,
    safety: 100,
    capacity: 100,
    costLabel: '₹ Initial Budget',
    safetyLabel: 'Safety Rating',
    capacityLabel: 'Target Capacity',
  });

  // Current subtitle / dialogue
  const [dialogueText, setDialogueText] = useState<string>(
    'Level 1: The Blueprint & Scope Framing — 3D Asset Pack & Interactive Turntable'
  );
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  // Interactive Asset Sub-states
  const [managerExpr, setManagerExpr] = useState<ManagerExpression>('asking');
  const [workerState, setWorkerState] = useState<'idle' | 'cheer'>('idle');
  const [buildingStage, setBuildingStage] = useState<1 | 2 | 3 | 4>(4);
  const [hologramExpanded, setHologramExpanded] = useState<boolean>(true);
  const [fuelPct, setFuelPct] = useState<number>(0.85);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const currentAssetGroupRef = useRef<THREE.Group | null>(null);
  const animUpdatersRef = useRef<Array<(time: number) => void>>([]);
  const sceneRefsRef = useRef<Level1SceneRefs | null>(null);

  // 1. Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 sky
    scene.fog = new THREE.FogExp2(0x0f172a, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(12, 10, 16);
    cameraRef.current = camera;

    // Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
    controls.minDistance = 3;
    controls.maxDistance = 50;
    controls.target.set(0, 1.5, 0);
    controlsRef.current = controls;

    // Lighting (Warm sunrise cartoon aesthetic)
    const hemiLight = new THREE.HemisphereLight(0xBFE6FF, 0x8B5A2B, 1.0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xFFF9E6, 1.8);
    dirLight.position.set(18, 25, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    const d = 20;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Subtle blue rim light from opposite side
    const rimLight = new THREE.DirectionalLight(0x00E5FF, 0.6);
    rimLight.position.set(-15, 10, -15);
    scene.add(rimLight);

    // Studio pedestal shadow catcher floor
    const shadowFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.01;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Grid helper
    const grid = new THREE.GridHelper(30, 30, 0x00E5FF, 0x334155);
    grid.position.y = 0;
    grid.visible = false;
    scene.add(grid);
    gridHelperRef.current = grid;

    // Render loop & FPS calculation
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let animFrameId: number;

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Controls update
      controls.autoRotate = autoRotate && !activeAnimation;
      controls.autoRotateSpeed = 1.6;
      controls.update();

      // Execute procedural component animators
      animUpdatersRef.current.forEach((fn) => fn(time));

      renderer.render(scene, camera);

      // FPS calculation every 500ms
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
        setTriangleCount(renderer.info.render.triangles);
        frameCount = 0;
        lastFpsTime = now;
      }
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      stopAllLevel1Animations();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update auto-rotate and grid
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // 2. Load and Mount Selected Asset into the Scene
  const loadAsset = (assetId: string) => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    // Stop ongoing animations
    stopAllLevel1Animations();
    setActiveAnimation(null);

    // Remove existing asset
    if (currentAssetGroupRef.current) {
      scene.remove(currentAssetGroupRef.current);
      currentAssetGroupRef.current = null;
    }
    animUpdatersRef.current = [];

    const root = new THREE.Group();
    root.name = `gallery_${assetId}`;

    const sceneRefs: Level1SceneRefs = {
      camera,
      controls,
      scene,
    };

    // Instantiate selected asset
    switch (assetId) {
      case 'full_diorama': {
        // Complete Living Diorama
        const field = createMuddyPlot();
        root.add(field);

        const bg = createBackground();
        root.add(bg);

        const fence = createSiteFence();
        root.add(fence);

        const cabin = createSiteCabin();
        cabin.position.set(-8, 0.18, 5);
        cabin.rotation.y = 0.4;
        root.add(cabin);

        const cones = createTrafficCones();
        root.add(cones);

        const tape = createBarrierTape();
        root.add(tape);

        const fuel = createFuelGaugeProp();
        fuel.position.set(-6, 0.18, 2);
        fuel.updateFuel(fuelPct);
        root.add(fuel);

        const fleet = createCementMixerFleet();
        root.add(fleet);
        animUpdatersRef.current.push((t) => fleet.updateFleet(t));

        const rods = createSteelRodStacks();
        rods.position.set(7.5, 0.18, -4);
        root.add(rods);

        const sand = createSandGravelPiles();
        sand.position.set(7.5, 0.18, 3.5);
        root.add(sand);

        const excavator = createExcavator();
        excavator.position.set(-6.5, 0.18, -6);
        excavator.rotation.y = 0.8;
        root.add(excavator);

        const workers = createWorkersCrew();
        workers.setState(workerState);
        root.add(workers);
        animUpdatersRef.current.push((t) => workers.updateWorkers(t));

        const manager = createSiteManager();
        manager.position.set(-0.8, 0.18, 4.2);
        manager.rotation.y = -0.3;
        manager.setExpression(managerExpr);
        root.add(manager);
        sceneRefs.manager = manager;
        animUpdatersRef.current.push((t) => manager.updateManager(t));

        const boss = createBossAvatar();
        boss.position.set(0.8, 0.18, 5.2);
        boss.rotation.y = Math.PI; // seen from behind looking at manager
        root.add(boss);

        // Planning props in center
        const crate = createBlueprintCrate();
        crate.position.set(0, 0.18, 1);
        crate.setHologramExpanded(hologramExpanded);
        root.add(crate);
        sceneRefs.blueprintCrate = crate;
        animUpdatersRef.current.push((t) => crate.updateHologram(t));

        // Setup camera
        camera.position.set(0, 12, 18);
        controls.target.set(0, 1.5, 0);
        break;
      }

      // ENVIRONMENT
      case 'muddy_plot': {
        const plot = createMuddyPlot();
        root.add(plot);
        camera.position.set(16, 12, 16);
        controls.target.set(0, 0, 0);
        break;
      }
      case 'background_skyline': {
        const bg = createBackground();
        root.add(bg);
        camera.position.set(0, 8, 25);
        controls.target.set(0, 4, -15);
        break;
      }
      case 'site_fence': {
        const fence = createSiteFence();
        root.add(fence);
        camera.position.set(-6, 3, 16);
        controls.target.set(-6, 2, 11);
        break;
      }
      case 'site_cabin': {
        const cabin = createSiteCabin();
        root.add(cabin);
        camera.position.set(4, 3, 4);
        controls.target.set(0, 1.2, 0);
        break;
      }
      case 'traffic_cones': {
        const cones = createTrafficCones();
        root.add(cones);
        camera.position.set(0, 1.5, 13);
        controls.target.set(0, 0.3, 10.5);
        break;
      }
      case 'diesel_gauge': {
        const gauge = createFuelGaugeProp();
        gauge.updateFuel(fuelPct);
        root.add(gauge);
        animUpdatersRef.current.push((t) => {
          gauge.updateFuel(0.5 + Math.sin(t * 2) * 0.4);
        });
        camera.position.set(0, 2.2, 3.2);
        controls.target.set(0, 1.2, 0);
        break;
      }
      case 'coconut_palm': {
        const palm = createCoconutPalm();
        root.add(palm);
        camera.position.set(5, 4, 5);
        controls.target.set(0, 2.5, 0);
        break;
      }
      case 'banana_plant': {
        const bp = createBananaPlant();
        root.add(bp);
        camera.position.set(3, 2, 3);
        controls.target.set(0, 1, 0);
        break;
      }
      case 'auto_rickshaw': {
        const rickshaw = createAutoRickshaw();
        root.add(rickshaw);
        camera.position.set(3, 2, 3);
        controls.target.set(0, 0.8, 0);
        break;
      }
      case 'gopuram': {
        const gop = createGopuramSilhouette();
        root.add(gop);
        camera.position.set(0, 6, 10);
        controls.target.set(0, 3.5, 0);
        break;
      }

      // CREW
      case 'cement_mixer': {
        const mixer = createCementMixer();
        root.add(mixer);
        animUpdatersRef.current.push((t) => mixer.updateMixer(t));
        camera.position.set(5, 3.5, 5);
        controls.target.set(0, 1.2, 0);
        break;
      }
      case 'mixer_fleet': {
        const fleet = createCementMixerFleet();
        root.add(fleet);
        animUpdatersRef.current.push((t) => fleet.updateFleet(t));
        camera.position.set(14, 9, 14);
        controls.target.set(0, 1, 0);
        break;
      }
      case 'steel_rods': {
        const rods = createSteelRodStacks();
        root.add(rods);
        camera.position.set(3, 2, 3);
        controls.target.set(0, 0.5, 0);
        break;
      }
      case 'sand_gravel': {
        const piles = createSandGravelPiles();
        root.add(piles);
        camera.position.set(4, 3, 4);
        controls.target.set(0, 0.8, 0);
        break;
      }
      case 'excavator': {
        const exc = createExcavator();
        root.add(exc);
        camera.position.set(4, 3, 4);
        controls.target.set(0, 1.2, 0);
        break;
      }
      case 'workers_crew': {
        const workers = createWorkersCrew();
        workers.setState(workerState);
        root.add(workers);
        animUpdatersRef.current.push((t) => workers.updateWorkers(t));
        camera.position.set(8, 5, 8);
        controls.target.set(0, 0.5, 0);
        break;
      }
      case 'site_manager': {
        const manager = createSiteManager();
        manager.setExpression(managerExpr);
        root.add(manager);
        sceneRefs.manager = manager;
        animUpdatersRef.current.push((t) => manager.updateManager(t));
        camera.position.set(1.6, 1.6, 2.2);
        controls.target.set(0, 1.1, 0);
        break;
      }
      case 'boss_avatar': {
        const boss = createBossAvatar();
        root.add(boss);
        camera.position.set(0, 1.6, -2.5); // view from behind
        controls.target.set(0, 1.1, 0);
        break;
      }

      // PLANNING
      case 'blueprint_crate': {
        const crate = createBlueprintCrate();
        crate.setHologramExpanded(hologramExpanded);
        root.add(crate);
        sceneRefs.blueprintCrate = crate;
        animUpdatersRef.current.push((t) => crate.updateHologram(t));
        camera.position.set(3, 2.5, 3.5);
        controls.target.set(0, 1.5, 0);
        break;
      }
      case 'zone_tiles': {
        const tiles = createZoneTiles();
        root.add(tiles);
        camera.position.set(6, 6, 7);
        controls.target.set(0, 0.5, 0);
        break;
      }
      case 'requirement_badges': {
        const badges = createRequirementBadges();
        root.add(badges);
        animUpdatersRef.current.push((t) => badges.updateBadges(t));
        camera.position.set(0, 3.8, 6.5);
        controls.target.set(0, 3.5, 0);
        break;
      }
      case 'underground_conduits': {
        const conduits = createUndergroundConduits();
        root.add(conduits);
        camera.position.set(5, 3, 5);
        controls.target.set(0, -0.2, 0);
        break;
      }

      // OPTION A (Disaster)
      case 'wet_concrete_pour': {
        const pour = createWetConcretePour();
        root.add(pour);
        sceneRefs.pourDisaster = pour;
        animUpdatersRef.current.push((t) => pour.updatePourFlow(t));
        camera.position.set(6, 5, 7);
        controls.target.set(0, 1.5, 0);
        break;
      }
      case 'reefer_truck': {
        const truck = createReeferTruck();
        root.add(truck);
        camera.position.set(6, 4, 6);
        controls.target.set(0, 1.2, 0);
        break;
      }
      case 'bare_wall_disaster': {
        const wall = createBareWallDisaster();
        root.add(wall);
        sceneRefs.bareWall = wall;
        animUpdatersRef.current.push((t) => wall.updatePuddle(t));
        camera.position.set(0, 2.5, 4.5);
        controls.target.set(0, 1.4, -0.5);
        break;
      }
      case 'jammed_entrance': {
        const jammed = createJammedEntrance();
        root.add(jammed);
        sceneRefs.jammedEntrance = jammed;
        animUpdatersRef.current.push((t) => jammed.updateJammedShake(t));
        camera.position.set(0, 2.2, 4.0);
        controls.target.set(0, 1.4, 0);
        break;
      }
      case 'demolition_crew': {
        const demo = createDemolitionCrew();
        root.add(demo);
        sceneRefs.demoCrew = demo;
        animUpdatersRef.current.push((t) => demo.updateDemolition(t));
        camera.position.set(0, 2.5, 4.5);
        controls.target.set(0, 1.2, 0);
        break;
      }

      // OPTION B (Success)
      case 'rising_building': {
        const rising = createRisingSupermarket();
        rising.setStage(buildingStage);
        root.add(rising);
        sceneRefs.risingBuilding = rising;
        animUpdatersRef.current.push((t) => rising.updateStage(t));
        camera.position.set(10, 8, 12);
        controls.target.set(0, 2.5, 0);
        break;
      }
      case 'proper_entrance': {
        const proper = createProperFoundationWideEntrance();
        root.add(proper);
        sceneRefs.freezerEntrance = proper;
        animUpdatersRef.current.push((t) => proper.updateFreezers(t));
        camera.position.set(0, 2.8, 6.0);
        controls.target.set(0, 1.5, 0);
        break;
      }
      case 'safety_stamp': {
        const stamp = createSafetyInspectorAndStamp();
        root.add(stamp);
        sceneRefs.safetyStamp = stamp;
        animUpdatersRef.current.push((t) => stamp.updateStamp(t));
        camera.position.set(0, 3.5, 5.5);
        controls.target.set(0, 1.5, 0);
        break;
      }

      // OPTION C (Chaos)
      case 'tin_shed_chaos': {
        const shed = createTinShedChaos();
        root.add(shed);
        sceneRefs.tinShed = shed;
        animUpdatersRef.current.push((t) => shed.updateEchoRings(t));
        camera.position.set(9, 7, 9);
        controls.target.set(0, 2.5, 0);
        break;
      }
      case 'fish_perfume': {
        const fishCross = createFishAndPerfumeCross();
        root.add(fishCross);
        sceneRefs.stinkCross = fishCross;
        animUpdatersRef.current.push((t) => fishCross.updateStink(t));
        camera.position.set(0, 2.2, 4.2);
        controls.target.set(0, 1.1, 0);
        break;
      }
      case 'tripping_shoppers': {
        const trip = createTrippingShoppers();
        root.add(trip);
        sceneRefs.trippingShoppers = trip;
        animUpdatersRef.current.push((t) => trip.updateTripping(t));
        camera.position.set(0, 2.2, 4.5);
        controls.target.set(0, 0.8, 0);
        break;
      }
      case 'city_officer': {
        const officer = createCitySafetyOfficer();
        root.add(officer);
        sceneRefs.cityOfficer = officer;
        animUpdatersRef.current.push((t) => officer.updateOfficer(t));
        camera.position.set(0, 2.5, 4.5);
        controls.target.set(0, 1.5, 0);
        break;
      }

      // MODULAR FRESHMART BUILDING
      case 'modular_supermarket': {
        const store = createModularSupermarket();
        root.add(store);
        animUpdatersRef.current.push((t) => store.updateBuilding(t));
        camera.position.set(13, 9, 14);
        controls.target.set(0, 2.5, 2.0);
        break;
      }
    }

    scene.add(root);
    currentAssetGroupRef.current = root;
    sceneRefsRef.current = sceneRefs;
  };

  // Trigger asset reload whenever assetId changes
  useEffect(() => {
    loadAsset(activeAssetId);
  }, [activeAssetId]);

  // Handle Action Animations
  const handlePlayIntro = () => {
    if (!sceneRefsRef.current) return;
    setActiveAnimation('intro');
    playIntro(
      sceneRefsRef.current,
      () => setActiveAnimation(null),
      (text) => setDialogueText(text)
    );
  };

  const handlePlayOptionA = () => {
    if (activeAssetId !== 'full_diorama') {
      setActiveAssetId('full_diorama');
    }
    setTimeout(() => {
      if (!sceneRefsRef.current) return;
      setActiveAnimation('optionA');
      playOptionA(
        sceneRefsRef.current,
        (m) => setMeters(m),
        () => setActiveAnimation(null),
        (text) => setDialogueText(text)
      );
    }, 100);
  };

  const handlePlayOptionB = () => {
    if (activeAssetId !== 'full_diorama') {
      setActiveAssetId('full_diorama');
    }
    setTimeout(() => {
      if (!sceneRefsRef.current) return;
      setActiveAnimation('optionB');
      playOptionB(
        sceneRefsRef.current,
        (m) => setMeters(m),
        () => setActiveAnimation(null),
        (text) => setDialogueText(text)
      );
    }, 100);
  };

  const handlePlayOptionC = () => {
    if (activeAssetId !== 'full_diorama') {
      setActiveAssetId('full_diorama');
    }
    setTimeout(() => {
      if (!sceneRefsRef.current) return;
      setActiveAnimation('optionC');
      playOptionC(
        sceneRefsRef.current,
        (m) => setMeters(m),
        () => setActiveAnimation(null),
        (text) => setDialogueText(text)
      );
    }, 100);
  };

  const handleResetCamera = () => {
    stopAllLevel1Animations();
    setActiveAnimation(null);
    setDialogueText('Camera reset to default turntable view.');
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(12, 10, 16);
      controlsRef.current.target.set(0, 1.5, 0);
    }
  };

  // Asset Categories and items
  const categories: Record<CategoryKey, { label: string; icon: string; items: Array<{ id: string; name: string }> }> = {
    diorama: {
      label: '🌟 Live Diorama',
      icon: 'sparkles',
      items: [{ id: 'full_diorama', name: 'Full World Diorama' }],
    },
    environment: {
      label: '🌍 Environment',
      icon: 'globe',
      items: [
        { id: 'muddy_plot', name: '1. Muddy Plot & Puddles' },
        { id: 'background_skyline', name: '2. Hills, Palms & Gopuram' },
        { id: 'site_fence', name: '3. FreshMart Fence & Sign' },
        { id: 'site_cabin', name: '4. Site Cabin' },
        { id: 'traffic_cones', name: '5. Traffic Cones' },
        { id: 'diesel_gauge', name: '6. Diesel Fuel Gauge' },
        { id: 'coconut_palm', name: '7. Coconut Palm Tree' },
        { id: 'banana_plant', name: '8. Banana Plant' },
        { id: 'auto_rickshaw', name: '9. Auto-Rickshaw' },
        { id: 'gopuram', name: '10. Temple Gopuram' },
      ],
    },
    crew: {
      label: '👷 Crew & Machinery',
      icon: 'users',
      items: [
        { id: 'cement_mixer', name: '5. Cement Mixer Truck' },
        { id: 'mixer_fleet', name: '5b. 10 Mixer Fleet' },
        { id: 'steel_rods', name: '6a. Steel Rod Bundles' },
        { id: 'sand_gravel', name: '6b. Sand & Gravel Piles' },
        { id: 'excavator', name: '6c. Small Excavator' },
        { id: 'workers_crew', name: '7. 50 Workers Crew' },
        { id: 'site_manager', name: '8. Site Manager NPC' },
        { id: 'boss_avatar', name: '9. Boss (Player Avatar)' },
      ],
    },
    planning: {
      label: '📐 Planning Props',
      icon: 'layers',
      items: [
        { id: 'blueprint_crate', name: '10. Holographic Blueprint Crate' },
        { id: 'zone_tiles', name: '11. 6 Zone Floor Tiles' },
        { id: 'requirement_badges', name: '12. Requirement Badges' },
        { id: 'underground_conduits', name: '13. Underground Conduits' },
      ],
    },
    optionA: {
      label: '💥 Option A (Disaster)',
      icon: 'alert',
      items: [
        { id: 'wet_concrete_pour', name: '14. Wet Pour & Crooked Slab' },
        { id: 'reefer_truck', name: '15. Reefer Truck (800 Tubs)' },
        { id: 'bare_wall_disaster', name: '16. Bare Wall & Melting Freezer' },
        { id: 'jammed_entrance', name: '17. Jammed Carts Bottleneck' },
        { id: 'demolition_crew', name: '18. Demolition & Budget Drain' },
      ],
    },
    optionB: {
      label: '✨ Option B (Success)',
      icon: 'check',
      items: [
        { id: 'rising_building', name: '19. 4-Stage Supermarket' },
        { id: 'proper_entrance', name: '20. Foundation & Frosted Freezers' },
        { id: 'safety_stamp', name: '21. Inspector & PASSED Stamp' },
      ],
    },
    optionC: {
      label: '⚠️ Option C (Chaos)',
      icon: 'x',
      items: [
        { id: 'tin_shed_chaos', name: '22. Open Tin Shed & Echo' },
        { id: 'fish_perfume', name: '23. Fish & Perfume Stink Cross' },
        { id: 'tripping_shoppers', name: '24. Loose Cables & Trips' },
        { id: 'city_officer', name: '25. Safety Officer & UNSAFE Sticker' },
      ],
    },
    modular: {
      label: '🏬 Modular Building',
      icon: 'store',
      items: [{ id: 'modular_supermarket', name: '26. Modular FreshMart Supermarket' }],
    },
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* TOP HEADER */}
      <header className="relative z-20 flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Campus Map</span>
            </button>
          )}

          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
              LEVEL 1: 3D ASSET GALLERY
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                PROD TURNTABLE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Supermarket Requirements Engineering • Procedural Three.js Asset Pack
            </p>
          </div>
        </div>

        {/* Real-time Performance Monitor */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">{fps} FPS</span>
            <span className="text-slate-500">•</span>
            <span className="text-sky-400">{triangleCount.toLocaleString()} tris</span>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              autoRotate
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Turntable: {autoRotate ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              showGrid
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Grid
          </button>
        </div>
      </header>

      {/* HORIZONTAL CATEGORY SELECTOR TABS */}
      <div className="relative z-10 flex items-center gap-1.5 px-4 py-2 bg-slate-900/60 backdrop-blur-sm border-b border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
        {(Object.keys(categories) as CategoryKey[]).map((catKey) => {
          const isActive = activeCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => {
                setActiveCategory(catKey);
                setActiveAssetId(categories[catKey].items[0].id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{categories[catKey].label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN VIEWPORT WITH CANVAS AND FLOATING PANELS */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* WebGL Mount Point */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* LEFT ASSET PICKER FLOATING PILL MENU */}
        <div className="absolute top-4 left-4 z-10 max-h-[calc(100%-8rem)] w-60 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 shadow-2xl space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-1">
            Select Asset
          </div>
          {categories[activeCategory].items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveAssetId(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                activeAssetId === item.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <span className="truncate">{item.name}</span>
              {activeAssetId === item.id && <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
            </button>
          ))}
        </div>

        {/* TOP RIGHT LIVE METERS HUD */}
        <div className="absolute top-4 right-4 z-10 w-72 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/80 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Activity className="w-3.5 h-3.5" />
              Live System Meters
            </span>
            <span className="font-mono text-[10px] text-slate-500">REALTIME</span>
          </div>

          {/* Cost Meter (₹) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">{meters.costLabel || 'Cost (₹)'}</span>
              <span className="font-mono text-amber-400">{meters.cost}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  meters.cost < 30 ? 'bg-rose-500' : meters.cost < 70 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${meters.cost}%` }}
              />
            </div>
          </div>

          {/* Safety Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">{meters.safetyLabel || 'Safety Code'}</span>
              <span className="font-mono text-sky-400">{meters.safety}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  meters.safety < 30 ? 'bg-rose-500' : meters.safety < 70 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${meters.safety}%` }}
              />
            </div>
          </div>

          {/* Capacity Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">{meters.capacityLabel || 'Throughput'}</span>
              <span className="font-mono text-emerald-400">{meters.capacity}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  meters.capacity < 20 ? 'bg-rose-500' : meters.capacity < 60 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${meters.capacity}%` }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM CENTER DYNAMIC ASSET CONTROLLER & CINEMATIC TRIGGER BAR */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-10 flex flex-col items-center gap-2 max-w-2xl w-full">
          {/* Subtitle / Dialogue Banner */}
          <div className="w-full px-4 py-2 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/80 text-center text-xs text-sky-200 font-medium shadow-lg truncate">
            {dialogueText}
          </div>

          {/* Interactive contextual tweaks depending on active asset */}
          {activeAssetId === 'site_manager' && (
            <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-1">Expression:</span>
              {(['asking', 'worried', 'proud', 'shocked'] as ManagerExpression[]).map((expr) => (
                <button
                  key={expr}
                  onClick={() => {
                    setManagerExpr(expr);
                    if (sceneRefsRef.current?.manager) {
                      sceneRefsRef.current.manager.setExpression(expr);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer border ${
                    managerExpr === expr
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {expr}
                </button>
              ))}
              <button
                onClick={() => {
                  if (sceneRefsRef.current?.manager) {
                    sceneRefsRef.current.manager.tapHardHat(true);
                    setTimeout(() => sceneRefsRef.current?.manager?.tapHardHat(false), 2000);
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer"
              >
                Tap Hard Hat
              </button>
            </div>
          )}

          {activeAssetId === 'workers_crew' && (
            <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-1">Worker State:</span>
              <button
                onClick={() => {
                  setWorkerState('idle');
                  (currentAssetGroupRef.current as any)?.setState('idle');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                  workerState === 'idle'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Idle Weight Shift
              </button>
              <button
                onClick={() => {
                  setWorkerState('cheer');
                  (currentAssetGroupRef.current as any)?.setState('cheer');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                  workerState === 'cheer'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                🎉 Cheer & Raise Shovels!
              </button>
            </div>
          )}

          {activeAssetId === 'rising_building' && (
            <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-1">Construction Stage:</span>
              {[1, 2, 3, 4].map((stg) => (
                <button
                  key={stg}
                  onClick={() => {
                    setBuildingStage(stg as 1 | 2 | 3 | 4);
                    if (sceneRefsRef.current?.risingBuilding) {
                      sceneRefsRef.current.risingBuilding.setStage(stg);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                    buildingStage === stg
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  Stage {stg}
                </button>
              ))}
            </div>
          )}

          {activeAssetId === 'blueprint_crate' && (
            <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-1">Hologram:</span>
              <button
                onClick={() => {
                  const nextVal = !hologramExpanded;
                  setHologramExpanded(nextVal);
                  if (sceneRefsRef.current?.blueprintCrate) {
                    sceneRefsRef.current.blueprintCrate.setHologramExpanded(nextVal);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border ${
                  hologramExpanded
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {hologramExpanded ? 'Hologram Active' : 'Hologram Collapsed'}
              </button>
            </div>
          )}

          {activeAssetId === 'diesel_gauge' && (
            <div className="flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-1">Fuel Needle:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={fuelPct}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFuelPct(val);
                  (currentAssetGroupRef.current as any)?.updateFuel?.(val);
                }}
                className="w-28 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400">{Math.round(fuelPct * 100)}%</span>
            </div>
          )}

          {/* MAIN ANIMATION CONTROLS BAR */}
          <div className="flex items-center flex-wrap justify-center gap-2 p-2 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl">
            <button
              onClick={handlePlayIntro}
              disabled={activeAnimation !== null}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Play Intro</span>
            </button>

            <button
              onClick={handlePlayOptionA}
              disabled={activeAnimation !== null}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Option A (Disaster)</span>
            </button>

            <button
              onClick={handlePlayOptionB}
              disabled={activeAnimation !== null}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Option B (Success)</span>
            </button>

            <button
              onClick={handlePlayOptionC}
              disabled={activeAnimation !== null}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Option C (Chaos)</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Cam</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
