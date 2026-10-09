# Architectura: 3D System Design Storyboard

> **A visual-first 3D educational game that teaches distributed system design through one continuous story: the player builds a company from scratch and scales it level by level.**

---

## 1. Core Pedagogical Architecture

1. **One Persistent World (`WorldState`)**:
   - Upgrades, buildings, guards, and infrastructure placed in earlier levels persist seamlessly across later levels via `useWorldStore`, saved in `localStorage`.
   - Adding a building in Level 1 keeps it visible in Level 2; hiring a guard keeps the guard stationed at the perimeter.

2. **Problem First, Then Options**:
   - The player first experiences the failure emerging naturally in a tick-based simulation (e.g. strangers freely walking in and stealing laptops, queues overflowing, towers shaking).
   - Only after the problem manifests do architecture options appear.

3. **Dedicated Reaction for Every Option**:
   - No generic "wrong" screens. Each option (correct or incorrect) has a dedicated physical reaction cinematic:
     - **Option A (Ignore)**: Strangers multiply, laptops stolen, chaos ensues.
     - **Option B (Sign only)**: Strangers casually ignore the sign; "A sign is not security."
     - **Option C (Guard checkpoint)**: Security guard stationed, boom barrier actively enforces perimeter rules.
   - Weak points are highlighted with a 3D pulsing ring, downward arrow pointer, and concise label.

4. **Fail, Understand, Fix**:
   - When a wrong choice is made, the player watches the consequence, reads a concise "What Went Wrong" card, and returns to the pedestals with that option marked as tried.
   - Stars reduce with each failed attempt (3 stars on first attempt, 2 stars on second, 1 star on third).

5. **Why This? Why Not The Others? (Comparison Board)**:
   - Every level features a trade-off comparison matrix comparing all options: what it does, when to use it in production, and why it failed in this scenario.

6. **The Story Hook Teaser**:
   - Every level ends with a teaser revealing the next problem created by the solution just implemented (e.g., stationing a guard introduces the problem: *"Who are you? Prove your identity!"* -> Level 2: Authentication).

---

## 2. Level Definition of Done (Enforced by Code)

The engine enforces a strict Definition of Done via `/src/engine/validateLevel.ts`. Any level registered as unlocked must satisfy 100% of the following requirements:

1. **Hook Beat**: Beat 1 must be a cinematic hook beat setting the scene.
2. **Problem Simulation**: Must have a tick-based `simulate` beat with `problemDescription` and `problemTriggerTime`.
3. **Multi-Option Decision**: Must have at least one `decision` beat with 2+ options. Every option must have:
   - A unique `reaction.cinematicKey` (no duplicates).
   - A clear `reaction.weakPointLabel`.
   - `reaction.whyItWorks` (for correct choices) or `reaction.whatWentWrong` (for incorrect choices).
4. **Interaction or Minigame**: Must include an interactive 3D mechanic (e.g. tapping to construct, badge inspection, or the Greeter Rush minigame).
5. **Comparison Board**: Must include a `compare` beat comparing all options.
6. **7-Section Concept Card**: Must define all 7 required educational components:
   - Purple Core Idea Banner
   - Yellow Term Banner
   - Real-World-to-Tech mapping table (at least 2 rows)
   - 4-to-6 step request lifecycle flow
   - Options comparison matrix
   - Pros and cons
   - Real company production examples
   - One-line memorable interview answer
7. **Visual Quiz**: Must contain at least 2 visual quiz questions with diagrams and feedback.
8. **WorldState Upgrade & Teaser**: Must specify persistent `worldUpgrade` mutations and a `teaser` hook for the next level.
9. **Strict Brevity Rules**:
   - Captions: **Maximum 12 words** per caption.
   - Speech bubbles: **Maximum 8 words** per bubble.

---

## 3. How to Add a New Level

Adding a new level is completely data-driven:

### Step 1: Create the Level Definition File
Create `src/levels/levelX.ts`:

```typescript
import type { LevelDefinition } from '../engine/types';

export const levelX: LevelDefinition = {
  id: 'level_x',
  levelNumber: X,
  worldNumber: 1,
  worldTitle: 'The Foundation',
  title: 'Level Title',
  subtitle: 'Subtitle Concept',
  conceptTag: 'Concept Tag',
  description: 'Short description of the challenge.',
  unlockedByDefault: false,
  beats: [
    // 1. Hook Cinematic
    // 2. Simulation with problem trigger
    // 3. Decision with unique reactions
    // 4. Interactive element / Minigame
    // 5. Compare board ("Why this? Why not the others?")
    // 6. 7-part Concept card
    // 7. Visual quiz (2+ questions)
    // 8. Reward beat with worldUpgrade and teaser hook
  ],
};
```

### Step 2: Register in Curriculum Registry
Open `src/levels/curriculumRegistry.ts`:
1. Import `levelX`.
2. Locate level `level_x` in `CURRICULUM_LEVELS`.
3. Attach `definition: levelX` and set `unlockedByDefault: true` when ready.
4. The system automatically runs `assertValidUnlockedLevel(levelX)` at startup to verify all criteria!

---

## 4. 40-Level Curriculum Roadmap

The game features 40 architecture levels spanning 8 progressive worlds:

- **World 1: The Foundation** (Levels 1–5: Client-Server, Authentication, Authorization, JWT Tokens, API Gateways)
- **World 2: Scaling Up** (Levels 6–10: Vertical Scaling, Horizontal Scaling, Round Robin, Least Connections, Health Checks)
- **World 3: Speed & Memory** (Levels 11–15: Redis Caching, Cache Invalidation, Cache-Aside, CDN, Cache Stampedes)
- **World 4: Storage & Data** (Levels 16–20: RDBMS & ACID, NoSQL, Primary-Replica, Sharding, CAP Theorem)
- **World 5: Asynchronous Flow** (Levels 21–25: Message Queues, Kafka Pub/Sub, Backpressure, Dead Letter Queues, Idempotency)
- **World 6: Microservices** (Levels 26–30: Service Decomposition, Service Discovery, gRPC vs REST, Consensus/Raft, Saga Pattern)
- **World 7: Resilience & Fault Tolerance** (Levels 31–35: Circuit Breakers, Rate Limiting, Graceful Degradation, Chaos Monkey, Multi-AZ)
- **World 8: Observability & Cloud Scale** (Levels 36–40: Prometheus Metrics, Distributed Tracing, SLOs/Error Budgets, Canary Deployments, Global Planetary Cloud)

---

## 5. Development & Verification

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run TypeScript compilation and production build
npm run build
```

---

## 6. Deploying to Vercel

This project is pre-configured for immediate deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub (`https://github.com/Aakashk63/pj-game-.git`).
2. Go to [Vercel Dashboard](https://vercel.com/new) and select **Import**.
3. Select your GitHub repository `pj-game-`.
4. Framework Preset will automatically detect **Vite** with build command `npm run build` and output directory `dist`.
5. Click **Deploy**. SPA client routing rewrites are configured in `vercel.json`.
