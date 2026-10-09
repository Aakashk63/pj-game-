import type { StoryboardConfig } from '../engine/types';

export const level4: StoryboardConfig = {
  id: 'level_4',
  levelNumber: 4,
  title: 'The Waiting Room',
  subtitle: 'Message Queues & Asynchronous Workers',
  description: 'Buffer spike traffic with a decoupled queuing bay so backend workers never drop a heavy request.',
  unlockedByDefault: true,
  beats: [
    // BEAT 1 [cinematic, Panel 1 "The Heavy Task"]
    {
      id: 'beat1_heavy_task_arrival',
      type: 'cinematic',
      panelNumber: 1,
      panelTitle: 'Heavy Task Arrives',
      caption: 'A customer requests a massive batch video render job.',
      cameraShot: 'closeupBuilding',
      autoAdvance: true,
      duration: 3.8,
      speechBubbles: [
        { speaker: 'employee', text: 'Render 10,000 video files right now!', icon: 'question', delay: 0.6 },
      ],
    },

    // BEAT 2 [simulate, "The Synchronous Freeze"]
    {
      id: 'beat2_sync_bottleneck',
      type: 'simulate',
      panelNumber: 2,
      panelTitle: 'Front Desk Freeze',
      caption: 'The front desk freezes trying to do heavy work synchronously.',
      cameraShot: 'wide',
      simDuration: 4.8,
      trafficRate: 15,
      targetCapacity: 20,
      problemTriggerTime: 2.0,
      problemDescription: 'HTTP 504 Gateway Timeout: All web server threads blocked on heavy video encode.',
      speechBubbles: [
        { speaker: 'guard', text: 'Front desk frozen! System timeout 504.', icon: 'x', delay: 2.2 },
      ],
    },

    // BEAT 3 [decision, "How do we handle long-running operations?"]
    {
      id: 'beat3_decision_queue',
      type: 'decision',
      question: 'How do we prevent slow background jobs from locking the web server?',
      cameraShot: 'decisionPullback',
      options: [
        {
          id: 'opt_sync_block',
          title: 'Synchronous In-Band Processing',
          tag: 'Direct Synchronous Processing',
          description: 'Keep the client HTTP connection open while the web server thread executes long-running compute jobs inline.',
          dioramaType: 'sync_block',
          isCorrect: false,
          feedbackText: 'Disaster! Web server worker threads are completely starved, causing client connections to drop with HTTP 504 Gateway Timeouts.',
          sdConcept: {
            conceptName: 'Synchronous Blocking I/O & Thread Pool Starvation',
            summary: 'Executing long-running background tasks inside synchronous web request threads locks server connections, causing thread pool starvation and widespread HTTP 504 Gateway Timeouts.',
            buildingAnalogyEvent: 'When a visitor arrived with a massive batch of complex tax paperwork, the front desk receptionist stopped all other work, locked the reception window, and spent 4 hours calculating forms. Every other visitor in line was left standing out in the rain until the entire lobby timed out and walked away furious.',
            technicalSystemReality: 'Web servers (e.g. Node.js event loops, Puma threads, Apache worker processes) have a limited pool of concurrent execution threads (typically dozens to hundreds). If a user request triggers a 60-second video encoding or PDF generation job synchronously, that thread is blocked waiting for completion. As new users arrive, all available threads quickly become exhausted. Even lightweight requests (like loading the homepage) cannot obtain a thread, resulting in server-wide cascading failure and HTTP 504 Gateway Timeouts.',
            whyItFailsOrSucceeds: 'Building Analogy: A bank teller refusing to help other customers until one person\'s complex loan is audited freezes the entire bank. Server Reality: Monolithic synchronous requests couple response time directly to processing duration, exhausting TCP socket limits and web server memory.',
            tradeOffs: [
              'Pros: Straightforward programming model; client receives immediate final results in a single HTTP request-response cycle.',
              'Cons: Rapid thread pool exhaustion; 30-second gateway timeouts; catastrophic failure under traffic spikes; zero resilience if worker crashes.',
            ],
            realWorldExample: 'Web services that attempt to generate large PDF invoices synchronously on the main API server regularly suffer site-wide outages during month-end billing runs.',
          },
        },
        {
          id: 'opt_message_queue',
          title: 'Decoupled Queue & Worker Pool',
          tag: 'Decoupled Asynchronous Queue',
          description: 'Acknowledge requests immediately with HTTP 202 Accepted, push jobs into a buffer queue, and process via background worker pool.',
          dioramaType: 'queue_buffer',
          isCorrect: true,
          feedbackText: 'Success! Decoupling ingestion from processing keeps the web server responsive while workers process jobs at steady speed.',
          sdConcept: {
            conceptName: 'Asynchronous Message Queues & Load Leveling',
            summary: 'Decoupling request ingestion from task execution using message queues (RabbitMQ, Apache Kafka, AWS SQS) ensures instantaneous web responses and provides backpressure load leveling.',
            buildingAnalogyEvent: 'The receptionist accepted the visitor\'s heavy paperwork, stamped it with an immediate tracking number (HTTP 202 Accepted), and dropped it into a sorting chute. Back-office processing clerks worked through the chute at a steady pace while the reception window stayed open to serve incoming visitors with zero delays.',
            technicalSystemReality: 'In an asynchronous event-driven architecture, the web server receives the request, publishes an event/message to a persistent message broker (RabbitMQ, Kafka, SQS), and immediately responds to the client with HTTP 202 Accepted and a job ID in under 5 milliseconds. Independent worker fleets consume messages from the queue at their own sustained pace. This pattern, known as Queue-Based Load Leveling, prevents traffic spikes from overwhelming downstream services and guarantees zero dropped jobs—if a worker crashes, the message broker re-delivers the message to another worker.',
            whyItFailsOrSucceeds: 'Building Analogy: The front desk accepts drop-offs and issues claim tickets in seconds, while the backroom processes documents steadily without blocking the door. Server Reality: The web tier remains 100% responsive under 100x traffic spikes, while the worker tier elastically autoscales based on queue depth.',
            tradeOffs: [
              'Pros: Instantaneous client response times; resilience against worker crashes; load leveling absorbs spikes; independent scaling of web and worker tiers.',
              'Cons: Requires asynchronous client polling or WebSockets for job status; adds operational overhead of managing message broker infrastructure.',
            ],
            realWorldExample: 'YouTube, Netflix, and Stripe process all video transcodes, encoding pipelines, and payment webhook dispatches through asynchronous message queues with guaranteed delivery.',
          },
        },
      ],
    },

    // BEAT 4 [interact, Panel 3 "The Queue Bay"]
    {
      id: 'beat4_queue_interaction',
      type: 'interact',
      panelNumber: 3,
      panelTitle: 'The Queuing Bay Station',
      caption: 'Enqueue heavy tasks and dispatch worker consumers.',
      cameraShot: 'deskCloseup',
      targetId: 'registration_desk',
      hintText: 'Buffer heavy jobs into message queue',
      actionType: 'click',
      completionEvent: 'queue_processed',
      interactionMode: 'queue_station',
    },

    // BEAT 5 [simulate, Panel 4 "Smooth Asynchronous Throughput"]
    {
      id: 'beat5_queue_surge',
      type: 'simulate',
      panelNumber: 4,
      panelTitle: 'Decoupled Steady Flow',
      caption: 'Tasks buffered smoothly. Response latency drops to 3ms.',
      cameraShot: 'wide',
      simDuration: 4.5,
      trafficRate: 25,
      targetCapacity: 150,
      problemTriggerTime: 999, // Smooth flow!
      showRushHourCounter: true,
      speechBubbles: [
        { speaker: 'guard', text: 'Queue depth: 10. Front desk responding in 3ms!', icon: 'check', delay: 1.0 },
      ],
    },

    // BEAT 6 [concept, THE CORE IDEA: Message Queues]
    {
      id: 'beat6_concept_queue',
      type: 'concept',
      cameraShot: 'wide',
      caption: 'Core Architecture: Message Queues & Workers.',
      concept: {
        title: 'Message Queues & Asynchronous Workers (RabbitMQ & Kafka)',
        subtitle: 'Decoupling Producers from Consumers',
        definition: 'A message queue is an asynchronous service-to-service buffer where jobs are placed by producers and drained by background consumer workers.',
        analogy: 'Taking a numbered order ticket at a busy bakery. The cashier takes your money instantly, hands you a ticket, and you step aside while bakers bake your cake.',
        diagramType: 'queue_buffer',
        coreIdeaBanner: 'Never make your web server wait for slow, heavy work. Acknowledge immediately (202 Accepted) and delegate to background workers via a queue.',
        yellowBanner: {
          title: 'MESSAGE QUEUE = Asynchronous Buffer',
          subtext: 'Producers push at burst speeds. Consumers pull at steady capacity. The system never crashes.',
        },
        mappingTable: [
          { realWorld: 'Numbered Bakery Order Ticket', tech: 'Message / Event Payload (JSON)' },
          { realWorld: 'Cashier Giving Instant Receipt', tech: 'HTTP 202 Accepted (Task ID Returned)' },
          { realWorld: 'Kitchen Bakers Cooking in Back', tech: 'Background Consumer Workers (Celery / BullMQ)' },
          { realWorld: 'Counter Order Ticket Spindle', tech: 'FIFO Queue Buffer (RabbitMQ / SQS / Kafka)' },
          { realWorld: 'Buzzer Vibrating When Ready', tech: 'WebSocket / Webhook Completion Event' },
        ],
        flowSteps: [
          '1. Client sends heavy request: POST /api/video/render',
          '2. API server puts job payload onto Message Queue',
          '3. Server immediately returns HTTP 202 Accepted with { jobId: "task_99" }',
          '4. Background worker node dequeues task and runs heavy compute',
          '5. Worker stores output in cloud storage and notifies client via webhook',
        ],
        commonMethods: [
          { name: 'FIFO Queue (First In, First Out)', icon: 'key' },
          { name: 'Pub/Sub Event Streaming', icon: 'globe' },
          { name: 'Dead-Letter Queue (DLQ)', icon: 'fingerprint' },
          { name: 'Worker Autoscaling', icon: 'smartphone' },
        ],
        pros: [
          'Prevents web servers from freezing or dropping client HTTP connections',
          'Smooths sudden traffic spikes without crashing backend databases',
          'Enables fault tolerance: failed jobs can be safely retried from the queue',
        ],
        cons: [
          'Eventual consistency: results are not available immediately to the client',
          'Additional operational complexity to manage queue brokers and worker fleets',
        ],
        realWorldExamples: [
          { company: 'Netflix', usage: 'Queues terabytes of video encoding and subtitle generation tasks across thousands of cloud worker nodes.' },
          { company: 'Uber', usage: 'Processes millions of GPS ride events and fare calculations per second via Apache Kafka event streams.' },
          { company: 'Stripe', usage: 'Buffers millions of webhook events into queues to guarantee 100% reliable delivery even if recipient servers are temporarily down.' },
        ],
      },
    },

    // BEAT 7 [quiz]
    {
      id: 'beat7_quiz_queue',
      type: 'quiz',
      cameraShot: 'wide',
      caption: 'Final Architecture Challenge.',
      question: 'Why should heavy background tasks (like PDF rendering) be moved to a Message Queue?',
      explanation: 'Message queues decouple slow background processing from the fast web server. The web server returns an immediate HTTP 202 Accepted response, preventing connection timeouts and thread pool saturation.',
      xpReward: 300,
      nextLevelTeaser: {
        levelTitle: 'Architectura Campus Master!',
        description: 'You have mastered Scaling, Authentication, Authorization, In-Memory Caching, and Message Queues! Your cloud campus is bulletproof.',
      },
      options: [
        {
          id: 'q_queue_correct',
          label: 'To immediately free the web server and prevent client connection timeouts',
          diagramDescription: 'Decoupled async workers handle heavy load without blocking users',
          isCorrect: true,
        },
        {
          id: 'q_queue_wrong_cpu',
          label: 'Because queues magically make CPU-heavy video encoding 1000x faster',
          diagramDescription: 'Compute work still takes the same time, but does not block users',
          isCorrect: false,
        },
        {
          id: 'q_queue_wrong_db',
          label: 'To avoid saving any files or records into databases',
          diagramDescription: 'Workers still write completed results to database and storage',
          isCorrect: false,
        },
      ],
    },
  ],
};
