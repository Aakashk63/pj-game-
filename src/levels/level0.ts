import type { StoryboardConfig } from '../engine/types';

export const level0: StoryboardConfig = {
  id: 'level_0',
  levelNumber: 0,
  title: 'Opening Day',
  subtitle: 'The Scaling Paradox',
  description: 'Launch your first corporate office and learn how systems withstand sudden traffic surges.',
  unlockedByDefault: true,
  beats: [
    // 1. Cinematic: Camera flies over island at sunrise
    {
      id: 'beat_sunrise',
      type: 'cinematic',
      caption: 'Every company starts small.',
      cameraShot: 'sunriseIntro',
      autoAdvance: true,
      duration: 3.8,
    },

    // 2. Interact: Tap glowing plot to place first building
    {
      id: 'beat_place_hq',
      type: 'interact',
      caption: 'Tap the glowing plot to build HQ.',
      cameraShot: 'wide',
      targetId: 'plot_hq',
      hintText: 'Click to build office',
      actionType: 'click',
      completionEvent: 'building_placed',
    },

    // 3. Simulate: Employees walk in, load climbs, doors jam
    {
      id: 'beat_simulate_traffic',
      type: 'simulate',
      caption: 'Traffic is surging. Capacity is reached.',
      cameraShot: 'closeupBuilding',
      simDuration: 5.5,
      trafficRate: 10,
      targetCapacity: 25,
      problemTriggerTime: 2.8,
      problemDescription: 'Monolith threshold breached. Single entrance jammed.',
    },

    // 4. Decision: Two pedestal dioramas
    {
      id: 'beat_decision_scale',
      type: 'decision',
      question: 'The office is full and congested. How should we scale our capacity?',
      cameraShot: 'decisionPullback',
      options: [
        {
          id: 'scale_vertical',
          title: 'Make Tower Taller',
          tag: 'Single-Tower Expansion',
          description: 'Stack more floors onto the single monolithic building.',
          dioramaType: 'scale_up_tall',
          isCorrect: false,
          feedbackText: 'Expanding a single building upward increases internal space but leaves the single front door as a catastrophic bottleneck and single point of failure.',
          sdConcept: {
            conceptName: 'Vertical Scaling (Scale Up) — Single Machine Ceiling',
            summary: 'Upgrading a single node increases capacity temporarily, but creates a severe single point of failure and hard hardware limits.',
            buildingAnalogyEvent: 'The building was expanded upward into a 3-story tower, but all incoming visitors still funneled through the same single front door and ground lobby. The entrance immediately jammed, visitors queued onto the street, and the building began shaking under concentrated load.',
            technicalSystemReality: 'Vertical scaling upgrades a single machine with more CPU cores, RAM, and disk IOPS. However, every physical server has a strict hardware ceiling (motherboard socket limits, memory bus bottlenecks, and single NIC throughput). Most critically, it remains a Single Point of Failure (SPOF)—if the hardware faults or reboots for an OS kernel patch, 100% of user traffic goes down. High-end multi-socket servers also cost exponentially more with diminishing returns.',
            whyItFailsOrSucceeds: 'Building Analogy: Stacking 50 floors onto one foundation does not widen the sidewalk or add new street access; everyone still queues at the same door. Server Reality: Upgrading to a 128-core mega-server still receives all packets through one physical IP and network stack; when it crashes, the entire company goes offline.',
            tradeOffs: [
              'Pros: Zero distributed system complexity; no network hops between microservices; single database transaction pool.',
              'Cons: Hard physical hardware ceiling; exponentially rising cost; zero fault tolerance; downtime required to upgrade.',
            ],
            realWorldExample: 'Relational databases often scale vertically initially, but enterprise cloud services (e.g. AWS, Netflix) quickly hit physical limits and migrate to horizontal sharding and multi-node clusters.',
          },
        },
        {
          id: 'scale_horizontal',
          title: 'Add Second Building',
          tag: 'Multi-Building Campus',
          description: 'Construct a parallel office building and distribute visitors across independent entrances.',
          dioramaType: 'scale_out_multi',
          isCorrect: true,
          feedbackText: 'Parallel independent offices share incoming traffic with redundant entrances and zero single points of failure.',
          sdConcept: {
            conceptName: 'Horizontal Scaling (Scale Out) — Distributed Redundancy',
            summary: 'Deploying independent parallel nodes distributes incoming traffic across multiple entry points and eliminates single points of failure.',
            buildingAnalogyEvent: 'A second parallel office building was constructed with its own independent entrance and lobby. Arriving visitors were split evenly across both doors, cutting entrance pressure by 50% with zero congestion.',
            technicalSystemReality: 'Horizontal scaling provisions multiple independent commodity server instances running in parallel behind a traffic distributor. Each node has its own CPU, memory, OS kernel, and network interface. This provides Fault Tolerance (if Node 1 crashes, Node 2 continues serving traffic), Elastic Autoscaling (nodes can be added or terminated dynamically based on real-time traffic), and near-infinite scaling potential using cost-effective commodity cloud instances.',
            whyItFailsOrSucceeds: 'Building Analogy: Two separate buildings have two separate doors, double the physical throughput, and if one building needs maintenance, visitors can use the second building. Server Reality: Two independent server nodes distribute incoming HTTP connections; maintenance or node failure no longer takes down the application.',
            tradeOffs: [
              'Pros: High availability; fault isolation; elastic autoscaling; linear cost scaling using commodity instances.',
              'Cons: Requires stateless application architecture, load balancers, and distributed data synchronization.',
            ],
            realWorldExample: 'Google and Netflix run tens of thousands of lightweight containerized instances in Kubernetes fleets across multiple cloud availability zones.',
          },
        },
      ],
    },

    // 5. Outcome: Outcome Cinematic
    {
      id: 'beat_outcome',
      type: 'outcome',
      outcomeType: 'success', // Resolved dynamically by BeatRunner based on player choice
      targetChoiceId: 'scale_horizontal',
      highlightWeakPointId: 'building_hq_tower',
      caption: 'Load balanced! Traffic flows smoothly.',
      explanationText: 'Distributing traffic prevents single points of failure.',
    },

    // 6. Concept Card: Visual definition and real world system design
    {
      id: 'beat_concept',
      type: 'concept',
      cameraShot: 'wide',
      caption: 'Core Architecture Concept: Scaling.',
      concept: {
        title: 'Vertical vs. Horizontal Scaling',
        subtitle: 'Scaling Up vs. Scaling Out',
        definition: 'Vertical scaling upgrades a single server’s capacity. Horizontal scaling adds multiple parallel servers.',
        analogy: 'Vertical is building a taller tower with one door. Horizontal is building a second office next door.',
        diagramType: 'vertical_vs_horizontal',
        pros: [
          'Horizontal: No single point of failure (high availability)',
          'Horizontal: Near-infinite scaling ceiling',
          'Vertical: Simple initial setup with no distributed routing',
        ],
        cons: [
          'Vertical: Hard physical hardware limits & expensive downtime',
          'Horizontal: Requires a load balancer & stateless architecture',
        ],
        realWorldExamples: [
          { company: 'Netflix', usage: 'Scales horizontally over thousands of microservice instances across AWS availability zones.' },
          { company: 'Google', usage: 'Distributes billions of search queries across vast clusters of commodity server nodes.' },
        ],
      },
    },

    // 7. Visual Quiz: 1 quick visual question
    {
      id: 'beat_quiz',
      type: 'quiz',
      cameraShot: 'wide',
      caption: 'Quick Architecture Check.',
      question: 'Which architecture prevents a single point of failure?',
      explanation: 'Horizontal scaling runs duplicate independent nodes. If one crashes, others seamlessly keep the system online.',
      xpReward: 150,
      options: [
        {
          id: 'q_monolith',
          label: 'One Huge Mega-Server',
          diagramDescription: 'Single 128-core mainframe server',
          isCorrect: false,
        },
        {
          id: 'q_distributed',
          label: 'Distributed Server Fleet',
          diagramDescription: 'Multiple parallel nodes behind a load balancer',
          isCorrect: true,
        },
      ],
    },
  ],
};

