import type { StoryboardConfig } from '../engine/types';

export const level3: StoryboardConfig = {
  id: 'level_3',
  levelNumber: 3,
  title: 'Memory Fast-Lane',
  subtitle: 'In-Memory Caching (Redis & Memcached)',
  description: 'Relieve database overload by introducing an ultra-fast memory clerk right next to the office door.',
  unlockedByDefault: true,
  beats: [
    // BEAT 1 [cinematic, Panel 1 "The Deep Archive"]
    {
      id: 'beat1_deep_archive',
      type: 'cinematic',
      panelNumber: 1,
      panelTitle: 'The Central Archive',
      caption: 'Every request walks all the way to the database.',
      cameraShot: 'closeupBuilding',
      autoAdvance: true,
      duration: 3.8,
      speechBubbles: [
        { speaker: 'employee', text: 'I need the product catalog again!', icon: 'question', delay: 0.8 },
      ],
    },

    // BEAT 2 [simulate, "The Database Overload"]
    {
      id: 'beat2_db_bottleneck',
      type: 'simulate',
      panelNumber: 2,
      panelTitle: 'Disk Overload',
      caption: 'Repeating the exact same disk lookup over and over.',
      cameraShot: 'wide',
      simDuration: 4.8,
      trafficRate: 12,
      targetCapacity: 25,
      problemTriggerTime: 2.0,
      problemDescription: 'Database disk I/O saturated at 100% processing redundant queries.',
      speechBubbles: [
        { speaker: 'guard', text: 'Database is sweating! Queue is backed up.', icon: 'x', delay: 2.2 },
      ],
    },

    // BEAT 3 [decision, "How do we speed up repeated reads?"]
    {
      id: 'beat3_decision_caching',
      type: 'decision',
      question: 'How do we handle repeated identical database reads?',
      cameraShot: 'decisionPullback',
      options: [
        {
          id: 'opt_bigger_disk',
          title: 'Upgrade Disk Drive Capacity',
          tag: 'Disk Storage Expansion',
          description: 'Expand database disk storage size and continue reading all queries directly from mechanical/SSD storage.',
          dioramaType: 'scale_up_tall',
          isCorrect: false,
          feedbackText: 'Failed! Mechanical and SSD disk I/O seek latency is thousands of times slower than RAM. Redundant queries saturate disk throughput.',
          sdConcept: {
            conceptName: 'Disk I/O Bottlenecks & Hardware Mechanical Latency',
            summary: 'Increasing disk capacity does not overcome physical disk I/O seek latency and operating system block read throughput under high-concurrency read surges.',
            buildingAnalogyEvent: 'The company purchased larger file cabinets and stacked more paper folders in the basement archives. However, the clerk still had to walk to the basement, search drawers, and fetch files for every single visitor. The line of waiting people stretched out the door as the clerk collapsed from exhaustion.',
            technicalSystemReality: 'Relational databases (PostgreSQL, MySQL) store persistent data on NVMe SSDs or hard drives. Even high-speed SSDs take 50–200 microseconds per read operation, while RAM takes ~10–100 nanoseconds—thousands of times faster. When thousands of concurrent users request identical popular data (e.g. homepage catalog, viral product page), querying the database forces disk I/O, database connection pool exhaustion, and CPU lock contention. Buying a larger disk adds storage bytes, but does nothing to increase I/O operations per second (IOPS) or eliminate lock contention.',
            whyItFailsOrSucceeds: 'Building Analogy: Having a bigger basement warehouse doesn\'t make the clerk walk any faster when 1,000 people ask for the exact same flyer. Server Reality: Scaling disk size solves capacity, not latency; the database disk queue depth spikes to 100% and crashes under redundant queries.',
            tradeOffs: [
              'Pros: Maintains strict ACID durability and single-source-of-truth transactional consistency directly on disk.',
              'Cons: Thousands of times higher latency than memory; disk I/O saturation; database connection pool starvation.',
            ],
            realWorldExample: 'Uncached relational databases during Black Friday e-commerce sales regularly crash from disk I/O exhaustion when millions of shoppers hit the same product catalog.',
          },
        },
        {
          id: 'opt_add_redis_cache',
          title: 'Deploy In-Memory Cache (Redis)',
          tag: 'In-Memory Caching Layer',
          description: 'Place a high-speed memory cache in front of the database to serve frequently requested hot data in sub-milliseconds.',
          dioramaType: 'cache_redis',
          isCorrect: true,
          feedbackText: 'Success! In-memory caching answers repetitive queries in sub-milliseconds, slashing database load to 4%!',
          sdConcept: {
            conceptName: 'In-Memory Caching & Cache-Aside Architecture',
            summary: 'Positioning an in-memory key-value store (Redis / Memcached) intercepts repetitive read queries in RAM, reducing latency to microseconds and shielding primary databases from traffic spikes.',
            buildingAnalogyEvent: 'A quick-access registration desk was placed in the front lobby stocking copies of the most frequently requested documents in arm\'s reach. 98% of visitors received their documents in 1 second without the clerk ever needing to walk down to the basement archives.',
            technicalSystemReality: 'In modern architectures, Redis or Memcached sits between application web servers and the primary database in a Cache-Aside (Lazy Loading) pattern. When a read request arrives, the app checks the cache first (Cache Hit). If present, it returns immediately in ~1 millisecond directly from RAM. If absent (Cache Miss), it fetches from the database once, stores the result in Redis with a Time-To-Live (TTL), and serves subsequent requests instantaneously. This reduces database read load by 95%+, freeing database CPU for writes.',
            whyItFailsOrSucceeds: 'Building Analogy: Keeping hot files on the desk saves hundreds of trips to the archive. Server Reality: RAM-based memory lookups take nanoseconds, protecting database connection pools and scaling read throughput to hundreds of thousands of operations per second.',
            tradeOffs: [
              'Pros: Extreme throughput (100k+ QPS per node); sub-millisecond read latency; shields primary database from spikes.',
              'Cons: Cache invalidation complexity ("There are only two hard things in Computer Science..."); risk of stale data; cache stampede/thundering herd if cache expires.',
            ],
            realWorldExample: 'Twitter/X and Reddit use massive Redis and Memcached clusters in RAM to serve timelines and post feeds with sub-5ms latency across hundreds of millions of users.',
          },
        },
      ],
    },

    // BEAT 4 [interact, Panel 3 "The Cache-Aside Flow"]
    {
      id: 'beat4_cache_hit_interaction',
      type: 'interact',
      panelNumber: 3,
      panelTitle: 'Cache-Aside Lookup',
      caption: 'Serve hot items directly from fast RAM.',
      cameraShot: 'deskCloseup',
      targetId: 'registration_desk',
      hintText: 'Inspect memory cache desk to serve request',
      actionType: 'click',
      completionEvent: 'cache_served',
      interactionMode: 'cache_station',
    },

    // BEAT 5 [simulate, Panel 4 "Sub-Millisecond Speed"]
    {
      id: 'beat5_cache_surge',
      type: 'simulate',
      panelNumber: 4,
      panelTitle: 'Lightning Throughput',
      caption: 'Data served from fast memory in milliseconds.',
      cameraShot: 'wide',
      simDuration: 4.5,
      trafficRate: 20,
      targetCapacity: 100,
      problemTriggerTime: 999, // Smooth flow!
      showRushHourCounter: true,
      speechBubbles: [
        { speaker: 'guard', text: 'Cache hit ratio: 98%! Latency: 2ms.', icon: 'check', delay: 1.0 },
      ],
    },

    // BEAT 6 [concept, THE CORE IDEA: Caching]
    {
      id: 'beat6_concept_cache',
      type: 'concept',
      cameraShot: 'wide',
      caption: 'Core Architecture: In-Memory Caching.',
      concept: {
        title: 'In-Memory Caching (Redis & Memcached)',
        subtitle: 'RAM vs. Persistent Disk Storage',
        definition: 'A cache is a high-speed data storage layer which stores a subset of data in RAM so that future requests are served faster.',
        analogy: 'Keeping your favorite notebook on top of your desk instead of walking to the basement archive every 2 minutes.',
        diagramType: 'cache_layer',
        coreIdeaBanner: 'Why travel to the deep database warehouse when you can keep popular answers right on your front desk in RAM?',
        yellowBanner: {
          title: 'CACHE = Fast Temporary In-Memory Storage',
          subtext: 'RAM lookups take ~100 nanoseconds. Hard drive disk reads take ~10 milliseconds (100,000x slower!).',
        },
        mappingTable: [
          { realWorld: 'Front Desk Sticky Note', tech: 'In-Memory Key-Value Store (Redis)' },
          { realWorld: 'Deep Basement Archive', tech: 'Relational Database (PostgreSQL / MySQL)' },
          { realWorld: 'Found Note on Desk', tech: 'Cache Hit (Sub-millisecond latency)' },
          { realWorld: 'Note Missing; Walk to Basement', tech: 'Cache Miss (Fetch DB, write to Cache)' },
          { realWorld: 'Throwing Out Old Notes', tech: 'Cache Expiration (TTL) & Eviction (LRU)' },
        ],
        flowSteps: [
          '1. Application receives request: GET /products/featured',
          '2. Checks cache first: redis.get("featured_products")',
          '3. If found (Cache Hit): Returns immediately in ~1ms',
          '4. If not found (Cache Miss): Queries SQL database on disk',
          '5. Writes result into cache with TTL (Time To Live), returns to client',
        ],
        commonMethods: [
          { name: 'Cache-Aside (Lazy Load)', icon: 'key' },
          { name: 'Write-Through Cache', icon: 'smartphone' },
          { name: 'TTL Expiration Timer', icon: 'fingerprint' },
          { name: 'LRU Eviction Policy', icon: 'globe' },
        ],
        pros: [
          'Dramatic reduction in database read load and server compute costs',
          'Blazing fast response times (sub-5ms) for user experiences',
          'Prevents cascading database failure during sudden traffic spikes',
        ],
        cons: [
          'Risk of serving stale data if cache is not properly invalidated upon updates',
          'Higher memory (RAM) infrastructure cost compared to disk storage',
        ],
        realWorldExamples: [
          { company: 'Twitter / X', usage: 'Caches user timelines in Redis/Twemproxy clusters to render home feeds instantaneously.' },
          { company: 'GitHub', usage: 'Caches repository metadata, pull requests, and permission trees in Redis.' },
          { company: 'Shopify', usage: 'Shields checkout databases during Black Friday traffic flash sales using multi-tier caching.' },
        ],
      },
    },

    // BEAT 7 [quiz]
    {
      id: 'beat7_quiz_cache',
      type: 'quiz',
      cameraShot: 'wide',
      caption: 'Quick Architecture Challenge.',
      question: 'What happens when an application experiences a "Cache Miss"?',
      explanation: 'A Cache Miss occurs when requested data is not currently in RAM. The system queries the database on disk, stores the result into the cache for future requests, and returns it to the user.',
      xpReward: 250,
      nextLevelTeaser: {
        levelTitle: 'Level 4: The Waiting Room',
        description: 'Heavy jobs like video rendering or batch emails are freezing the front door. Discover Message Queues and Asynchronous Workers.',
      },
      options: [
        {
          id: 'q_cache_correct',
          label: 'The system reads from the database, writes the result to cache, and returns it',
          diagramDescription: 'Cache-Aside lazy population pattern',
          isCorrect: true,
        },
        {
          id: 'q_cache_wrong_error',
          label: 'The server crashes and throws HTTP 500 error',
          diagramDescription: 'A cache miss is completely normal and handled gracefully',
          isCorrect: false,
        },
        {
          id: 'q_cache_wrong_ignore',
          label: 'The system ignores the request and does nothing',
          diagramDescription: 'Requests must always be fulfilled',
          isCorrect: false,
        },
      ],
    },
  ],
};
