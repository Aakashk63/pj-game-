# ARCHITECTURA: ART BIBLE & STYLE SPECIFICATION

## 1. Vision & Visual Identity
Architectura transforms complex, abstract distributed systems and backend infrastructure concepts into a tactile, living miniature isometric corporate campus built atop a floating tech island. 

Every design decision is rooted in **tactile physical metaphors**:
- Servers and microservices are modern brick-and-mortar office buildings, server silos, and guard gates.
- Network requests are animated packet capsules and commuters navigating pedestrian diamond pavers and asphalt boulevards.
- System bottlenecks, memory leaks, and cascading failures are depicted through visible physical stress: shaking towers, red warning beacons, jammed turnstiles, and smoking vents.

---

## 2. Analysis of the Reference Image
The reference image depicts an urban street intersection with distinct material separation, natural sun-drenched lighting, and grounded human scale:
1. **Pavement & Ground Planes:**
   - Sidewalk pavers feature a diagonal diamond pattern in terracotta (`#A65D46`), warm tan (`#D8B490`), and pale cream (`#EDE1D1`).
   - Street asphalt is deep charcoal slate (`#2C3539` to `#3B4252`) bordered by chamfered concrete curbs (`#8C9BAE`).
   - Pedestrian plaza slabs are cool grey-blue stone (`#607274` to `#90A4AE`).
2. **Architecture & Silhouette:**
   - Foreground and midground buildings feature warm brickwork (`#795548`), structural masonry piers, modular dark-framed window bays, and ground-level storefront canopies (`#B08968`).
   - Background industrial infrastructure (silos, cooling towers, ventilation stacks) silhouetted in soft teal-grey haze (`#546E7A`).
   - Planters and street vegetation introduce crisp forest emerald accents (`#2E7D32`, `#43A047`).
3. **Lighting & Shadow Behavior:**
   - High diagonal directional sunlight (warm ivory `#FFF8E7`, ~45° azimuth, 55° elevation) casting crisp yet soft-fading diagonal contact shadows.
   - Rich ambient sky fill (`#78909C` / `#B0BEC5`) ensuring facades never drop into pitch blackness.
   - Atmospheric aerial haze fading distant geometries into a pale cyan-cerulean horizon (`#90CAF9` to `#E0F2FE`).
4. **Characters & Scale:**
   - Grounded proportions with character clothing details (warm leather jackets `#A0522D`, denim `#3D5A80`, work boots `#6D4C41`).
   - Floating clean high-contrast sans-serif typography markers for identification.

---

## 3. Central Color Palette (`/art/theme.ts`)

### Primary Surface & Environment
| Token | Hex Code | Purpose |
|---|---|---|
| `ground.islandBase` | `#1E252B` | Floating rock base and foundation strata |
| `ground.islandTop` | `#2B363F` | Top grass / concrete foundation plateau |
| `ground.plaza` | `#788A96` | Large stone pedestrian plaza tiles |
| `ground.paverWarm` | `#A65D46` | Terracotta diagonal sidewalk pavers |
| `ground.paverTan` | `#D8B490` | Tan diagonal sidewalk pavers |
| `ground.asphalt` | `#2D3748` | Roadways and transit lanes |
| `ground.curb` | `#8C9BAE` | Chamfered stone curb dividers |
| `ground.curbHighlight`| `#CBD5E1`| White/reflective lane paint and crosswalks |

### Architectural Facades
| Token | Hex Code | Purpose |
|---|---|---|
| `building.brickWarm` | `#8D6E63` | Primary headquarters & monolithic backend servers |
| `building.brickDark` | `#5D4037` | Base foundation columns & architectural trim |
| `building.concrete` | `#A0AAB2` | Microservice outposts & scalable modular nodes |
| `building.glass` | `#38BDF8` | Reflective office windows & server rack visors |
| `building.glassLit` | `#FDE047` | Occupied office windows / active worker suites |
| `building.roofTrim` | `#334155` | Parapet caps, HVAC mounts, and antenna masts |
| `building.foliage` | `#3B7A57` | Green perimeter planters & courtyard hedges |

### State & System Health Signals
| Token | Hex Code | Purpose |
|---|---|---|
| `status.healthy` | `#10B981` | Green: low latency, healthy throughput, success |
| `status.warning` | `#F59E0B` | Amber: memory pressure, queue filling, load alert |
| `status.critical` | `#EF4444` | Red: bottleneck, crash, overload, single point of failure |
| `status.packet` | `#06B6D4` | Cyan glow: network request packets in transit |
| `status.glow` | `#60A5FA` | Interactive hint ring, selectable plots |

### Character & Prop Palette
| Token | Hex Code | Purpose |
|---|---|---|
| `character.jacket` | `#A0522D` | Founder / Ulysses leather jacket |
| `character.denim` | `#3D5A80` | Commuter denim trousers |
| `character.shirt` | `#F8FAFC` | Employee business shirts |
| `character.skin` | `#E2A782` | Stylized skin tone |
| `character.hair` | `#3E2723` | Stylized hair geometries |

### Lighting & Atmospheric Sky
| Token | Hex Code | Purpose |
|---|---|---|
| `sky.zenith` | `#7DD3FC` | Upper daytime sky dome |
| `sky.horizon` | `#E0F2FE` | Atmospheric horizon haze |
| `sky.fog` | `#CBD5E1` | Depth distance fog |
| `light.sun` | `#FFFDF5` | Warm key directional light (intensity: 1.8) |
| `light.ambient` | `#94A3B8` | Hemispheric sky/ground fill light (intensity: 0.8) |

---

## 4. Lighting & Shadows
- **Key Light:** DirectionalLight positioned at `[15, 25, 12]` with `castShadow = true`.
  - Shadow map resolution: `2048x2048`, bias `-0.0001`, soft PCF shadow filtering.
- **Ambient / Fill Light:** HemisphericLight from sky (`#7DD3FC`) to ground (`#2B363F`) with 0.75 intensity.
- **Accent Point Lights:** Placed at server beacons, entrance lanterns, and status lights to provide localized warm or emergency illumination.
- **Fog:** Linear exponential fog matching `sky.horizon` (`#CBD5E1`, near: 35, far: 85) to blend the floating island seamlessly into the atmosphere.

---

## 5. Camera Angles & Composition
All gameplay uses an elevated isometric-perspective camera rig:
- **Default Wide (Isometric Campus):** Position `[18, 16, 18]`, Target `[0, 1, 0]`, FOV `36°`.
- **Closeup (Inspection):** Position `[7, 6, 7]`, Target `[0, 2, 0]`, FOV `32°`.
- **Pullback (Decision Pedestals):** Position `[0, 14, 22]`, Target `[0, 2, 0]`, FOV `40°`.
- **Top-Down (Network & Routing):** Position `[0, 26, 0.01]`, Target `[0, 0, 0]`, FOV `30°`.
All camera moves are handled via `GSAP` interpolation with `power2.inOut` easing.

---

## 6. Geometry & Modeling Guidelines
1. **Procedural Polished Primitives:**
   - Boxes with subtle bevels / rounded chamfers (`boxGeometry` with subdivided bevels or layered trims).
   - Roofs topped with HVAC units, antennas, and glowing status bulbs.
   - Buildings constructed in modular stackable floor slabs (Floor 1: Lobby/Entrance, Floor 2+: Office bay with recessed window insets).
2. **Animation & Living Scene Dynamics:**
   - Characters: Stylized humanoid capsule/cylinder forms with animated walking bobbing, idle breathing, and directional heading.
   - Packets: Glowing capsule capsules with sine-wave floating trails moving between queues and processors.
   - Load Meter: Physical mechanical cylinder gauge with liquid fill shader and segmented tick marks.
   - Decision Dioramas: Micro-pedestals featuring rotating floating mini-replicas of architecture.

---

## 7. UI Design System
- **Philosophy:** Non-intrusive, game-inspired HUD.
- **Caption Bar:** Centered pill bar at the top with sleek backdrop blur, bold micro-copy (≤ 12 words), animated icon indicator.
- **Progress Dots:** Segmented beat tracker at the top right showing current phase in the level.
- **Decision Prompts:** Floating crystal cards positioned directly above dioramas with tactile hover states.
- **Concept Cards:** Cinematic glassmorphic modal with rich technical diagrams, pros/cons pill badges, and real-world architecture callouts.

---

## 8. Level 1: "Who Are You?" (Authentication Comic Direction)
- **Comic Panel Format:** Each beat is treated as an active panel with a numbered badge (`Panel 1`, `Panel 2`, etc.), giving the experience a living comic-strip rhythm.
- **Security Guard:** Friendly cartoon aesthetic, deep navy blue uniform (`#1B2A4A`), peaked cap with gold badge (`#F1C40F`), friendly styled mustache, warm skin tone. Poses include `idle`, `wave`, `stop` (hand raised), and `thumbs-up`.
- **Intruder Character:** Kid-friendly cartoon figure wearing a dark hoodie (`#334155`), sneaky posture, not scary.
- **Company Building:** Modern glass and concrete facade with blue illuminated "COMPANY" sign, manicured planter boxes, and perimeter trees.
- **Entrance Gate & Boom Barrier:** Striped red/white barrier arm that raises upon approved verification.
- **In-World Dialogue Bubbles:** Rounded speech bubbles hovering directly above characters with micro-copy (≤ 8 words) and graphic icons (ID card, green check, red X).
- **Core Verification Badges:** Crisp pop-up badges: Green tick (`#2ECC71` "Details match: Allow entry") and Red X (`#E74C3C` "Details don't match: Access denied").
- **Real-World to Tech Mapping:** Interactive reference table connecting real-world security guard mechanisms directly to authentication tokens, credentials, databases, and sessions.

