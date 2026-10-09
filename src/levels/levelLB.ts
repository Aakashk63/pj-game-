import type { StoryboardConfig } from '../engine/types';

export const levelLB: StoryboardConfig = {
  id: 'level_lb',
  levelNumber: 1,
  title: 'Level 1: The Traffic Director',
  subtitle: 'Load Balancing & Reverse Proxies',
  description: 'Two offices are open, but everyone rushes to Office 1! Introduce a Load Balancer to evenly distribute traffic across your infrastructure.',
  unlockedByDefault: true,
  beats: [
    // BEAT 1 [cinematic, panel 1 "Two Offices, One Habit"]
    {
      id: 'beat1_two_offices_old_habit',
      type: 'cinematic',
      panelNumber: 1,
      panelTitle: 'Two Offices, One Habit',
      caption: 'Two offices are built, but visitors have an old habit...',
      cameraShot: 'wide',
      autoAdvance: true,
      duration: 4.5,
      speechBubbles: [
        { speaker: 'employee', text: 'We have two offices now!', icon: 'idCard', delay: 0.6 },
        { speaker: 'employee', text: 'Everyone still runs to Office 1!', icon: 'question', delay: 2.0 },
      ],
    },

    // BEAT 2 [simulate, panel 2 "Office 1 Overloaded"]
    {
      id: 'beat2_uneven_surge',
      type: 'simulate',
      panelNumber: 2,
      panelTitle: 'The Bottleneck Returns',
      caption: 'Office 1 is 100% full & jammed! Office 2 is completely empty.',
      cameraShot: 'wide',
      simDuration: 5.0,
      trafficRate: 18,
      targetCapacity: 50,
      problemTriggerTime: 1.8,
      problemDescription: 'Office 1 Overloaded (100%), Office 2 Empty (0%)!',
      speechBubbles: [
        { speaker: 'guard', text: 'Office 1 door is stuck! Office 2 is empty!', icon: 'x', delay: 2.2 },
      ],
    },

    // BEAT 3 [decision, "How do we direct traffic?"]
    {
      id: 'beat3_decision_load_balancer',
      type: 'decision',
      question: 'Office 1 is full, Office 2 is empty. How do we direct traffic?',
      cameraShot: 'decisionPullback',
      options: [
        {
          id: 'opt_client_guess',
          title: 'Direct at Entrance Point (Signpost)',
          tag: 'Client-Directed Routing',
          description: 'Place a notice at Office 1 entrance telling overflow visitors to turn around and walk over to Office 2 manually.',
          dioramaType: 'sync_block',
          isCorrect: false,
          feedbackText: 'Failed! Visitors still rush Office 1 first, forming long queues while Office 2 sits completely idle.',
          sdConcept: {
            conceptName: 'Client-Side Hardcoded Routing & DNS Pinning',
            summary: 'Relying on client-side routing or manual redirection creates severe uneven load distribution, cache herd effects, and cannot adapt to real-time server health.',
            buildingAnalogyEvent: 'Visitors naturally walked straight to the first familiar entrance (Office 1). Upon seeing a sign telling them to walk across the parking lot to Office 2, visitors hesitated, formed a massive queue backing onto the road, while Office 2 sat completely empty and idle.',
            technicalSystemReality: 'In distributed systems, letting clients directly pick backend server IP addresses (e.g. hardcoded client IP lists or round-robin DNS without health checks) leads to catastrophic imbalance. DNS responses are cached by operating systems and ISPs (TTL persistence), meaning all traffic from an ISP or browser session gets pinned to Server 1. If Server 1 degrades or slows down, clients continue hammering it with no awareness of Server 2\'s idle capacity.',
            whyItFailsOrSucceeds: 'Building Analogy: A physical sign board requires visitors to first arrive at the congested door before being turned away, wasting transit time and compounding sidewalk congestion. Server Reality: HTTP 302 redirects or client-side retry loops still consume network bandwidth and socket connections on the overloaded server, worsening latency rather than offloading traffic.',
            tradeOffs: [
              'Pros: No intermediary reverse proxy server or load balancer infrastructure required.',
              'Cons: Extreme load imbalance; DNS caching ignores real-time traffic spikes; zero automated failover if a server crashes.',
            ],
            realWorldExample: 'Early web architecture in the 1990s used DNS Round Robin, which was abandoned because aggressive client-side DNS caching caused 80%+ of traffic to stampede a single node.',
          },
        },
        {
          id: 'opt_load_balancer',
          title: 'Deploy Central Traffic Distributor',
          tag: 'Central Reverse Proxy Gateway',
          description: 'Place a reverse proxy distributor at the entrance fork to dynamically balance visitors across all available offices.',
          dioramaType: 'load_balancer',
          isCorrect: true,
          feedbackText: 'Success! The Load Balancer alternates traffic 50/50 with zero bottlenecks and maximum throughput!',
          sdConcept: {
            conceptName: 'Reverse Proxy Load Balancing & Health-Checked Dispatch',
            summary: 'A centralized Layer 4 / Layer 7 reverse proxy distributes incoming requests across healthy backend pools, ensuring optimal resource utilization and zero-downtime failover.',
            buildingAnalogyEvent: 'A central traffic coordinator was positioned at the entrance fork before visitors reached either building. Arriving visitors were alternated 50/50 between Office 1 and Office 2. Both buildings operated smoothly at 50% capacity with zero queue delays.',
            technicalSystemReality: 'A Reverse Proxy Load Balancer (such as NGINX, HAProxy, or AWS ALB) acts as a single virtual IP (VIP) facing clients. It terminates incoming TCP connections and dispatches requests to backend servers using algorithms like Round Robin or Least Connections. Crucially, it executes active health checks (heartbeat pings); if Server 1 encounters high latency or crashes with HTTP 500s, the load balancer removes it from the pool instantaneously and routes 100% of traffic to healthy nodes.',
            whyItFailsOrSucceeds: 'Building Analogy: The decision is made before visitors commit to a path, preventing hallway stampedes and keeping both office doors operating at safe, balanced thresholds. Server Reality: Clients connect to one reliable gateway; backend server scaling, deployments, and restarts happen invisibly behind the proxy with zero client disruptions.',
            tradeOffs: [
              'Pros: Even throughput distribution; continuous health monitoring; transparent rolling zero-downtime deploys; SSL termination.',
              'Cons: The load balancer itself can become a single point of failure if not deployed in active-passive HA pairs (e.g. Keepalived / VRRP).',
            ],
            realWorldExample: 'Cloudflare and AWS Application Load Balancers (ALB) inspect and route millions of HTTP/HTTPS requests per second across elastic Kubernetes clusters.',
          },
        },
      ],
    },

    // BEAT 4 [interact, panel 3 "Traffic Router Station"]
    {
      id: 'beat4_router_interactive',
      type: 'interact',
      panelNumber: 3,
      panelTitle: 'Traffic Dispatcher',
      caption: 'Configure and activate the Load Balancer router.',
      cameraShot: 'wide',
      targetId: 'load_balancer_router',
      hintText: 'Inspect algorithms and deploy the load balancer',
      actionType: 'click',
      completionEvent: 'load_balancer_deployed',
      interactionMode: 'load_balancer_station',
    },

    // BEAT 5 [simulate, panel 4 "Balanced Rush Hour"]
    {
      id: 'beat5_balanced_rush_hour',
      type: 'simulate',
      panelNumber: 4,
      panelTitle: 'Balanced Rush Hour',
      caption: 'Traffic split 50/50! Both buildings operate smoothly at 50% load.',
      cameraShot: 'wide',
      simDuration: 4.8,
      trafficRate: 20,
      targetCapacity: 60,
      problemTriggerTime: 999, // Smooth flow!
      showRushHourCounter: true,
      speechBubbles: [
        { speaker: 'guard', text: 'Both offices running smoothly at 50% load!', icon: 'check', delay: 1.6 },
      ],
    },

    // BEAT 6 [concept, THE CORE IDEA]
    {
      id: 'beat6_concept_lb',
      type: 'concept',
      cameraShot: 'wide',
      caption: 'Core Architecture: Load Balancing.',
      concept: {
        title: 'Load Balancing (Reverse Proxy)',
        subtitle: 'The Traffic Cop of Distributed Systems',
        definition: 'A Load Balancer distributes incoming network traffic evenly across a group of backend servers to maximize throughput, minimize response time, and prevent overload.',
        analogy: 'An airport traffic coordinator directing passengers to Security Line A, Line B, or Line C so lines move at equal speed.',
        diagramType: 'load_balancer',
        coreIdeaBanner: 'Scaling adds more servers. A Load Balancer ensures they actually share the work!',
        yellowBanner: {
          title: 'LOAD BALANCER = Who Goes Where?',
          subtext: 'Distributes client requests and automatically bypasses crashed servers.',
        },
        mappingTable: [
          { realWorld: 'Incoming Commuters', tech: 'Client HTTP Requests' },
          { realWorld: 'Entrance Fork in Road', tech: 'Reverse Proxy / Load Balancer IP' },
          { realWorld: 'Office 1 & Office 2', tech: 'Backend Server Pool (Nodes)' },
          { realWorld: 'Alternating Left / Right', tech: 'Round-Robin Algorithm' },
          { realWorld: 'Checking Door Readiness', tech: 'Health Check (Heartbeat Ping)' },
          { realWorld: 'Directing to Shorter Line', tech: 'Least Connections Algorithm' },
        ],
        flowSteps: [
          '1. Client sends request to the single Load Balancer IP / DNS address',
          '2. Load Balancer selects server via algorithm (Round Robin / Least Conn)',
          '3. Verifies backend server health status (HTTP 200 OK ping)',
          '4. Forwards request to optimal healthy server (Reverse Proxy)',
          '5. Returns backend response back to client transparently',
        ],
        commonMethods: [
          { name: 'Round Robin', icon: 'globe' },
          { name: 'Least Conn', icon: 'smartphone' },
          { name: 'IP Hash (Sticky)', icon: 'fingerprint' },
          { name: 'Health Checks', icon: 'key' },
        ],
        pros: [
          'High Availability: Automatically reroutes around crashed servers',
          'Scalability: Add or remove backend servers without updating client apps',
          'Zero Downtime: Enables rolling software deployments and maintenance',
        ],
        cons: [
          'Can be a single point of failure without active-passive backup pairs',
          'Sticky sessions require centralized session stores (e.g., Redis)',
        ],
        realWorldExamples: [
          { company: 'AWS ALB', usage: 'Distributes millions of web requests across EC2 autoscaling groups.' },
          { company: 'NGINX & HAProxy', usage: 'Battle-tested open-source reverse proxies handling trillions of requests.' },
          { company: 'Cloudflare', usage: 'Global Anycast DNS load balances queries across 300+ data centers globally.' },
        ],
      },
    },

    // BEAT 7 [quiz]
    {
      id: 'beat7_quiz_lb',
      type: 'quiz',
      cameraShot: 'wide',
      caption: 'Quick Architecture Challenge.',
      question: 'What does a Load Balancer do if one of the backend servers crashes?',
      explanation: 'Load balancers perform continuous health checks. When a server fails, it is immediately removed from the active pool and traffic routes to surviving servers with zero downtime.',
      xpReward: 200,
      options: [
        {
          id: 'q_fail_all',
          label: 'Crashes the whole website with 500 error',
          diagramDescription: 'All user connections immediately drop',
          isCorrect: false,
        },
        {
          id: 'q_health_reroute',
          label: 'Health check detects it & routes to healthy servers',
          diagramDescription: 'Automatic failover to surviving nodes with zero downtime',
          isCorrect: true,
        },
      ],
    },
  ],
};
