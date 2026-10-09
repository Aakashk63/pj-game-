import React, { useMemo } from 'react';
import { THEME } from '../art/theme';
import { IslandBase } from './IslandBase';
import { Road } from '../components/Road';
import { Building } from '../components/Building';
import { CompanyBuilding } from '../components/CompanyBuilding';
import { Employee } from '../components/Employee';
import { Guard } from '../components/Guard';
import { BoomBarrier } from '../components/BoomBarrier';
import { IDCard } from '../components/IDCard';
import { RegistrationDesk } from '../components/RegistrationDesk';
import { IntruderCharacter } from '../components/IntruderCharacter';
import { AlarmLight } from '../components/AlarmLight';
import { ScannerBeam } from '../components/ScannerBeam';
import { TokenCard } from '../components/TokenCard';
import { Tree } from '../components/Trees';
import { SpeechBubble3D } from '../components/SpeechBubble3D';
import { StatusLight } from '../components/StatusLight';
import { LoadMeter } from '../components/LoadMeter';
import { ProblemHighlighter } from '../components/ProblemHighlighter';
import { DecisionDioramas } from './DecisionDioramas';
import { Confetti3D } from '../components/Confetti3D';
import { Cloud } from '../components/Cloud';
import { Packet } from '../components/Packet';
import { CutawayBuilding } from '../components/CutawayBuilding';
import { RoleAvatar } from '../components/RoleAvatar';
import { PermissionBoard } from '../components/PermissionBoard';
import { LoadBalancerUnit } from '../components/LoadBalancerUnit';
import { DatabaseCluster } from '../components/DatabaseCluster';
import { RedisCacheNode } from '../components/RedisCacheNode';
import { MessageQueueBay } from '../components/MessageQueueBay';
import { InteractivePlot } from './InteractivePlot';
import { Html } from '@react-three/drei';
import { CameraDirector } from '../engine/CameraDirector';
import type { Beat, DecisionOption } from '../engine/types';
import { useGameStore } from '../store/gameStore';

interface MainSceneProps {
  currentBeat?: Beat;
  onPlotInteract?: () => void;
  onSelectDecision?: (option: DecisionOption) => void;
  hideDecisionDioramas?: boolean;
}


export const MainScene: React.FC<MainSceneProps> = ({
  currentBeat,
  onPlotInteract,
  onSelectDecision,
  hideDecisionDioramas = false,
}) => {
  const simState = useGameStore((state) => state.simState);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const isCampusLevel = currentLevelId ? currentLevelId !== 'level_0' && currentLevelId !== 'level_lb' : false;
  const isLevelLB = currentLevelId === 'level_lb';
  const isLevel1 = currentLevelId === 'level_1';
  const isLevel2 = currentLevelId === 'level_2';
  const isLevel3 = currentLevelId === 'level_3';
  const isLevel4 = currentLevelId === 'level_4';

  // Crowd generation for simulation beats
  const crowd = useMemo(() => {
    return [
      { id: 'c1', start: [-2.5, 0.4, 7] as [number, number, number], target: [-0.4, 0.4, 3.8] as [number, number, number], speed: 0.9, phase: 0 },
      { id: 'c2', start: [2.2, 0.4, 6.5] as [number, number, number], target: [0.4, 0.4, 3.8] as [number, number, number], speed: 1.1, phase: 1.2 },
      { id: 'c3', start: [0.2, 0.4, 8] as [number, number, number], target: [0, 0.4, 3.6] as [number, number, number], speed: 0.85, phase: 2.5 },
      { id: 'c4', start: [-1.4, 0.4, 8.5] as [number, number, number], target: [-0.2, 0.4, 3.9] as [number, number, number], speed: 1.0, phase: 3.7 },
      { id: 'c5', start: [1.8, 0.4, 8.2] as [number, number, number], target: [0.3, 0.4, 3.7] as [number, number, number], speed: 0.95, phase: 4.8 },
    ];
  }, []);

  const isInteractBeat = currentBeat?.type === 'interact';
  const isDecisionBeat = currentBeat?.type === 'decision';

  // Dialogue bubbles for current beat
  const activeBubbles = currentBeat?.speechBubbles || [];

  return (
    <>
      {/* Dynamic GSAP Camera Director */}
      <CameraDirector shotTarget={currentBeat?.cameraShot || 'wide'} />

      {/* Atmospheric Fog */}
      <color attach="background" args={[THEME.colors.atmosphere.skyHorizon]} />
      <fog attach="fog" args={[THEME.colors.atmosphere.fogColor, 28, 70]} />

      {/* Lighting Rig */}
      <ambientLight
        color={THEME.colors.atmosphere.ambientLight}
        intensity={THEME.lighting.ambientIntensity}
      />
      <directionalLight
        position={THEME.lighting.sunPosition}
        intensity={THEME.lighting.sunIntensity}
        color={THEME.colors.atmosphere.sunLight}
        castShadow
        shadow-mapSize-width={THEME.lighting.shadowMapSize}
        shadow-mapSize-height={THEME.lighting.shadowMapSize}
        shadow-bias={THEME.lighting.shadowBias}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      {/* Low-Poly Drifting Clouds */}
      <Cloud position={[-16, 12, -12]} speed={0.4} scale={1.8} />
      <Cloud position={[14, 15, -8]} speed={0.3} scale={2.2} />
      <Cloud position={[-6, 10, 16]} speed={0.25} scale={1.5} />

      {/* Floating Tech Island Base */}
      <IslandBase />

      {/* Urban Road with diamond paver sidewalks & curbs */}
      <Road position={[0, 0.05, 5.8]} length={15} width={2.8} />

      {/* ---------------- CAMPUS SYSTEM SCENES (LEVEL 1, 2, 3, 4) ---------------- */}
      {isCampusLevel ? (
        <>
          {/* Main Building: Cutaway for Level 2, Full Company Building for others */}
          {isLevel2 ? (
            <CutawayBuilding
              position={[0, 0, 0]}
              doorStates={{
                devLab: {
                  isLocked: currentBeat?.id === 'beat1_entered_company',
                  isOpen: currentBeat?.id === 'beat2_everyone_goes_everywhere' || simState.status === 'overloaded',
                  readerStatus: currentBeat?.id === 'beat5_build_matrix' ? 'granted' : 'idle',
                },
                hrRoom: {
                  isLocked: currentBeat?.id === 'beat1_entered_company',
                  isOpen: currentBeat?.id === 'beat2_everyone_goes_everywhere' || simState.status === 'overloaded',
                  readerStatus: 'idle',
                },
                serverRoom: {
                  isLocked: true,
                  isOpen: currentBeat?.id === 'beat2_everyone_goes_everywhere' || simState.status === 'overloaded',
                  readerStatus: 'idle',
                },
                financeRoom: {
                  isLocked: currentBeat?.id !== 'beat7_special_access_granted' && simState.status !== 'overloaded',
                  isOpen:
                    currentBeat?.id === 'beat2_everyone_goes_everywhere' ||
                    currentBeat?.id === 'beat7_special_access_granted' ||
                    simState.status === 'overloaded',
                  readerStatus:
                    currentBeat?.id === 'beat6_restricted_room_attempt'
                      ? 'denied'
                      : currentBeat?.id === 'beat7_special_access_granted'
                      ? 'granted'
                      : simState.status === 'overloaded'
                      ? 'denied'
                      : 'idle',
                },
              }}
              isSalaryLeak={currentBeat?.id === 'beat2_everyone_goes_everywhere' || simState.status === 'overloaded'}
              isSalaryFolderAlert={
                currentBeat?.id === 'beat2_everyone_goes_everywhere' ||
                currentBeat?.id === 'beat6_restricted_room_attempt' ||
                simState.status === 'overloaded'
              }
            />
          ) : (
            <CompanyBuilding position={[0, 0, -0.6]} />
          )}

          {/* Entrance Boom Barrier Gate */}
          <BoomBarrier
            position={[1.2, 0, 3.6]}
            isOpen={simState.barrierOpen ?? (isLevel2 ? currentBeat?.id !== 'beat9_authn_then_authz' : (isLevel3 || isLevel4))}
          />

          {/* Security Guard */}
          {(simState.hasGuardAtGate ?? true) && (
            <Guard
              position={
                isLevel2 &&
                (currentBeat?.id === 'beat6_restricted_room_attempt' ||
                  currentBeat?.id === 'beat7_special_access_granted' ||
                  currentBeat?.id === 'beat8_be_the_door_guard')
                  ? [0.9, 0.4, -1.8]
                  : [-0.6, 0.4, 3.8]
              }
              rotation={
                isLevel2 &&
                (currentBeat?.id === 'beat6_restricted_room_attempt' ||
                  currentBeat?.id === 'beat7_special_access_granted' ||
                  currentBeat?.id === 'beat8_be_the_door_guard')
                  ? [0, -Math.PI / 2, 0]
                  : [0, 0, 0]
              }
              pose={
                currentBeat?.id === 'beat6_restricted_room_attempt'
                  ? 'stop'
                  : currentBeat?.id === 'beat7_special_access_granted'
                  ? 'thumbs_up'
                  : simState.guardPose || 'idle'
              }
            />
          )}

          {/* Registration Desk on left plaza (Only in Level 2 / Auth Verification) */}
          {isLevel1 && (
            <RegistrationDesk
              position={[-4.2, 0, 1.8]}
              rotation={[0, Math.PI / 4, 0]}
              isPrintingCard={currentBeat?.id === 'beat7_registration_desk'}
            />
          )}

          {/* Trees & Planters */}
          <Tree position={[-4.8, 0, -2.4]} />
          <Tree position={[4.8, 0, -2.4]} />
          <Tree position={[-4.8, 0, 4.2]} />
          <Tree position={[4.8, 0, 4.2]} />

          {/* Level 1: Floating ID Card */}
          {isLevel1 && (currentBeat?.id === 'beat4_guard_asks' || currentBeat?.id === 'beat5_verification_station') && (
            <group position={[0.2, 1.4, 4.2]}>
              <IDCard scale={0.7} isValid={true} />
              <ScannerBeam isScanning={currentBeat?.id === 'beat5_verification_station'} />
            </group>
          )}

          {/* Level 1: Intruder Character in Beat 2 or failure outcome */}
          {isLevel1 && (currentBeat?.id === 'beat2_crowd_grows' || currentBeat?.id === 'beat3_decision_guard' || simState.status === 'overloaded') && (
            <IntruderCharacter
              position={[1.4, 0.4, 1.2]}
              rotation={[0, Math.PI / 1.5, 0]}
              hasLaptop={true}
              isFleeing={true}
            />
          )}

          {/* Siren Alarm Light on Entrance Gate */}
          <AlarmLight
            position={[0, 2.8, 3.6]}
            isActive={
              (isLevel1 && (currentBeat?.id === 'beat2_crowd_grows' || currentBeat?.id === 'beat3_decision_guard' || simState.status === 'overloaded')) ||
              (isLevel2 && (currentBeat?.id === 'beat2_everyone_goes_everywhere' || simState.status === 'overloaded')) ||
              (isLevel3 && (currentBeat?.id === 'beat2_db_bottleneck' || simState.status === 'overloaded')) ||
              (isLevel4 && (currentBeat?.id === 'beat2_sync_bottleneck' || simState.status === 'overloaded'))
            }
          />

          {/* Golden Session Token Card in Beat 8 */}
          {simState.tokenCardVisible && (
            <TokenCard position={[0, 2.2, 3.6]} scale={1.2} />
          )}

          {/* Level 2 Beat 2 or Overloaded Consequence: Intern wandering into Finance Room */}
          {isLevel2 && (currentBeat?.id === 'beat2_everyone_goes_everywhere' || simState.status === 'overloaded') && (
            <>
              <RoleAvatar
                role="intern"
                position={[3.8, 0.4, -1.8]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={0.46}
              />
              <RoleAvatar
                role="developer"
                position={[-3.4, 0.4, 1.6]}
                scale={0.46}
              />
              <RoleAvatar
                role="hr"
                position={[3.4, 0.4, 1.6]}
                scale={0.46}
              />
            </>
          )}

          {/* Level 2 Beat 4: 3 Employees on Pedestals with PermissionBoards */}
          {isLevel2 && currentBeat?.id === 'beat4_different_employees' && (
            <group position={[0, 0, 1.2]}>
              {/* Developer */}
              <group position={[-2.6, 0, 0]}>
                <mesh position={[0, 0.08, 0]} receiveShadow>
                  <cylinderGeometry args={[0.9, 1.0, 0.16, 24]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
                </mesh>
                <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.7, 0.85, 24]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
                <RoleAvatar role="developer" position={[0, 0.45, 0]} scale={0.48} />
                <PermissionBoard role="developer" position={[0, 2.3, -0.4]} scale={0.8} />
              </group>
              {/* HR Employee */}
              <group position={[0, 0, 0.4]}>
                <mesh position={[0, 0.08, 0]} receiveShadow>
                  <cylinderGeometry args={[0.9, 1.0, 0.16, 24]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
                </mesh>
                <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.7, 0.85, 24]} />
                  <meshBasicMaterial color="#f472b6" />
                </mesh>
                <RoleAvatar role="hr" position={[0, 0.45, 0]} scale={0.48} />
                <PermissionBoard role="hr" position={[0, 2.3, -0.4]} scale={0.8} />
              </group>
              {/* Finance Manager */}
              <group position={[2.6, 0, 0]}>
                <mesh position={[0, 0.08, 0]} receiveShadow>
                  <cylinderGeometry args={[0.9, 1.0, 0.16, 24]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
                </mesh>
                <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.7, 0.85, 24]} />
                  <meshBasicMaterial color="#10b981" />
                </mesh>
                <RoleAvatar role="finance" position={[0, 0.45, 0]} scale={0.48} />
                <PermissionBoard role="finance" position={[0, 2.3, -0.4]} scale={0.8} />
              </group>
            </group>
          )}

          {/* Level 2 Beat 6: Developer denied at Finance Door */}
          {isLevel2 && currentBeat?.id === 'beat6_restricted_room_attempt' && (
            <>
              <RoleAvatar
                role="developer"
                position={[0.2, 0.4, -1.8]}
                rotation={[0, Math.PI / 2, 0]}
                scale={0.46}
              />
              {/* Red Badge: Access Denied (No Permission) */}
              <Html position={[0.55, 2.7, -1.8]} transform distanceFactor={5.5}>
                <div className="px-3.5 py-1.5 rounded-2xl bg-rose-600 text-white font-black text-xs shadow-2xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap animate-bounce">
                  <span>❌ Access Denied (No Permission)</span>
                </div>
              </Html>
            </>
          )}

          {/* Level 2 Beat 7: Finance Manager allowed at Finance Door */}
          {isLevel2 && currentBeat?.id === 'beat7_special_access_granted' && (
            <>
              <RoleAvatar
                role="finance"
                position={[2.4, 0.4, -1.8]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={0.46}
              />
              {/* Green Badge: Access Granted (Permission Allowed) */}
              <Html position={[1.5, 2.7, -1.8]} transform distanceFactor={5.5}>
                <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                  <span>✓ Access Granted (Permission Allowed)</span>
                </div>
              </Html>
            </>
          )}

          {/* Level 2 Beat 8: Interactive visitor approaching Door Guard */}
          {isLevel2 && currentBeat?.id === 'beat8_be_the_door_guard' && (
            <RoleAvatar
              role="developer"
              position={[0.2, 0.4, -1.8]}
              rotation={[0, Math.PI / 2, 0]}
              scale={0.46}
            />
          )}

          {/* Level 2 Beat 9: Authentication Then Authorization Dual Checkpoints */}
          {isLevel2 && currentBeat?.id === 'beat9_authn_then_authz' && (
            <group>
              {/* Checkpoint 1 (Gate AuthN) */}
              <mesh position={[0, 0.08, 3.6]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.9, 1.1, 24]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              <Html position={[0, 1.8, 3.6]} transform distanceFactor={6.0}>
                <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-emerald-500 text-emerald-400 font-black text-[10px] whitespace-nowrap shadow-lg">
                  Checkpoint 1: Gate (Who Are You?)
                </div>
              </Html>

              {/* Checkpoint 2 (Finance Door AuthZ) */}
              <mesh position={[1.45, 0.08, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1.0, 24]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
              <Html position={[1.45, 2.8, -1.8]} transform distanceFactor={6.0}>
                <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-sky-400 text-sky-300 font-black text-[10px] whitespace-nowrap shadow-lg">
                  Checkpoint 2: Room Door (What Can You Access?)
                </div>
              </Html>

              {/* Finance Manager: passes gate, enters Finance room */}
              <RoleAvatar role="finance" position={[2.4, 0.4, -1.8]} scale={0.44} />

              {/* Developer: passes gate, stopped at Finance door */}
              <RoleAvatar role="developer" position={[0.2, 0.4, -1.8]} rotation={[0, Math.PI / 2, 0]} scale={0.44} />

              {/* Intruder: stopped at gate */}
              <IntruderCharacter position={[0, 0.4, 5.0]} hasLaptop={false} isFleeing={false} />
            </group>
          )}

          {/* Level 2 Beat 12: Level 3 Teaser - Packed Entrance, Jammed Doors, Overload */}
          {isLevel2 && currentBeat?.id === 'beat12_outcome_complete' && (
            <group>
              {/* Long queue of verified employees backed up at entrance */}
              {[-1.2, -0.6, 0.0, 0.6, 1.2, 1.8].map((xOffset, i) => (
                <RoleAvatar
                  key={`teaser-queue-${i}`}
                  role={i % 3 === 0 ? 'developer' : i % 3 === 1 ? 'hr' : 'finance'}
                  position={[xOffset * 0.9, 0.4, 4.8 + (i % 2) * 0.6]}
                  rotation={[0, 0, 0]}
                  scale={0.42}
                />
              ))}
              {/* Overload Load Meter Banner */}
              <Html position={[0, 3.4, 3.6]} transform distanceFactor={5.5}>
                <div className="px-4 py-2 rounded-2xl bg-rose-600/95 border-2 border-white text-white font-black text-xs shadow-2xl flex items-center gap-2 animate-pulse whitespace-nowrap">
                  <span>🚨 LOAD METER: 100% (CRITICAL OVERLOAD) — DOORS JAMMED!</span>
                </div>
              </Html>
            </group>
          )}

          {/* ---------------- LEVEL 4: IN-MEMORY CACHE (REDIS) ---------------- */}
          {isLevel3 && (
            <>
              {/* Database Cluster on right courtyard */}
              <DatabaseCluster
                position={[3.6, 0, 0.6]}
                status={
                  currentBeat?.id === 'beat2_db_bottleneck' || (simState.status === 'overloaded' && simState.selectedDecision === 'opt_bigger_disk')
                    ? 'overloaded'
                    : currentBeat?.id === 'beat5_cache_surge' || simState.status === 'normal'
                    ? 'idle'
                    : 'stressed'
                }
                loadPercentage={
                  currentBeat?.id === 'beat2_db_bottleneck' || (simState.status === 'overloaded' && simState.selectedDecision === 'opt_bigger_disk')
                    ? 100
                    : currentBeat?.id === 'beat5_cache_surge'
                    ? 4
                    : 45
                }
              />

              {/* In-Memory Redis Cache Node appears on left plaza */}
              {(currentBeat?.id === 'beat4_cache_hit_interaction' ||
                currentBeat?.id === 'beat5_cache_surge' ||
                currentBeat?.id === 'beat6_concept_cache' ||
                currentBeat?.id === 'beat7_quiz_cache' ||
                simState.selectedDecision === 'opt_add_redis_cache') && (
                <RedisCacheNode
                  position={[-3.6, 0, 2.0]}
                  isActive={true}
                />
              )}

              {/* Slow Red Packets going to DB during bottleneck */}
              {(currentBeat?.id === 'beat2_db_bottleneck' || (simState.status === 'overloaded' && simState.selectedDecision === 'opt_bigger_disk')) && (
                <>
                  <Packet startPos={[0, 0.6, 3.8]} endPos={[3.6, 0.6, 0.6]} speed={1.2} color="#ef4444" />
                  <Packet startPos={[0.5, 0.6, 4.2]} endPos={[3.6, 0.6, 0.6]} speed={1.1} color="#ef4444" />
                </>
              )}

              {/* Fast Green Packets between Redis Cache & Commuters during Cache Surge */}
              {currentBeat?.id === 'beat5_cache_surge' && (
                <>
                  <Packet startPos={[-3.6, 0.8, 2.0]} endPos={[0.3, 0.6, 4.0]} speed={4.5} color="#10b981" />
                  <Packet startPos={[0.3, 0.6, 4.0]} endPos={[-3.6, 0.8, 2.0]} speed={4.5} color="#00f0ff" />
                  <Packet startPos={[-3.6, 0.8, 2.0]} endPos={[-0.4, 0.6, 3.8]} speed={4.8} color="#10b981" />
                </>
              )}
            </>
          )}

          {/* ---------------- LEVEL 5: MESSAGE QUEUES & ASYNC WORKERS ---------------- */}
          {isLevel4 && (
            <>
              {/* Message Queue Bay at front-left plaza */}
              <MessageQueueBay
                position={[-3.6, 0, 2.0]}
                isActive={currentBeat?.id !== 'beat2_sync_bottleneck' && simState.status !== 'overloaded'}
                isFrozen={currentBeat?.id === 'beat2_sync_bottleneck' || (simState.status === 'overloaded' && simState.selectedDecision === 'opt_sync_block')}
              />

              {/* Heavy Task Visitor at Entrance in Beat 1 & 2 */}
              {(currentBeat?.id === 'beat1_heavy_task_arrival' || currentBeat?.id === 'beat2_sync_bottleneck') && (
                <Employee
                  position={[0.2, 0.4, 3.8]}
                  rotation={[0, Math.PI, 0]}
                  scale={0.48}
                  isStuck={currentBeat?.id === 'beat2_sync_bottleneck'}
                />
              )}

              {/* Freeze Alarm Indicator */}
              {(currentBeat?.id === 'beat2_sync_bottleneck' || (simState.status === 'overloaded' && simState.selectedDecision === 'opt_sync_block')) && (
                <Html position={[-3.6, 3.0, 2.0]} transform distanceFactor={5.5}>
                  <div className="px-3.5 py-1.5 rounded-2xl bg-rose-600 text-white font-black text-xs shadow-2xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap animate-bounce">
                    <span>🛑 504 GATEWAY TIMEOUT (SERVER THREADS BLOCKED)</span>
                  </div>
                </Html>
              )}

              {/* Decoupled Asynchronous Packets in Beat 5 */}
              {currentBeat?.id === 'beat5_queue_surge' && (
                <>
                  {/* Ingest Packets: Arriving traffic pushes jobs to Queue Bay */}
                  <Packet startPos={[0, 0.6, 4.2]} endPos={[-3.6, 0.8, 2.0]} speed={3.6} color="#06b6d4" />
                  {/* Instant 202 Accepted return to visitor */}
                  <Packet startPos={[-3.6, 0.8, 2.0]} endPos={[0.4, 0.6, 3.8]} speed={3.8} color="#10b981" />
                  {/* Asynchronous Queue Drain: steady background packets flow into worker building */}
                  <Packet startPos={[-3.6, 0.8, 2.0]} endPos={[0, 1.0, -0.6]} speed={2.2} color="#38bdf8" />
                </>
              )}
            </>
          )}

          {/* Dialogue Speech Bubbles */}
          {activeBubbles.map((bubble, i) => {
            const bubblePos: [number, number, number] = isLevel2
              ? bubble.speaker === 'guard'
                ? (currentBeat?.id === 'beat1_entered_company' ? [-0.6, 2.2, 3.8] : [0.9, 2.2, -1.8])
                : (currentBeat?.id === 'beat2_everyone_goes_everywhere' ? [3.8, 2.2, -1.8] : [0.2, 2.2, -1.8])
              : isLevel3
              ? bubble.speaker === 'guard'
                ? [-0.6, 2.2, 3.8]
                : bubble.speaker === 'employee'
                ? [0.3, 2.1, 4.2]
                : [3.6, 2.4, 0.6]
              : isLevel4
              ? bubble.speaker === 'guard'
                ? [-0.6, 2.2, 3.8]
                : [0.2, 2.1, 4.0]
              : bubble.speaker === 'guard'
              ? [-0.6, 2.2, 3.8]
              : bubble.speaker === 'intruder'
              ? [1.4, 2.2, 1.2]
              : [0.3, 2.1, 4.2];

            return (
              <SpeechBubble3D
                key={i}
                position={bubblePos}
                speaker={bubble.speaker}
                text={bubble.text}
                icon={bubble.icon}
              />
            );
          })}

          {/* Approaching Employee Visitor in Level 1 */}
          {isLevel1 && (
            <Employee
              position={[0.3, 0.4, 4.2]}
              rotation={[0, Math.PI, 0]}
              scale={0.46}
            />
          )}
        </>
      ) : isLevelLB ? (
        /* ---------------- LEVEL 1: LOAD BALANCER SCENE ---------------- */
        <>
          {/* Two parallel buildings */}
          <group position={[0, 0, 0]}>
            {/* Office 1 (Left) */}
            <group position={[-2.4, 0, 0]}>
              <Building
                floors={1}
                status={simState.status === 'healthy_split' ? 'healthy_split' : simState.status}
                isWobbling={simState.status === 'overloaded'}
              />
              <StatusLight
                position={[-1.6, 0, 1.4]}
                status={simState.status === 'healthy_split' ? 'healthy_split' : simState.status}
              />
              <LoadMeter
                position={[-3.2, 0, 1.4]}
                loadPercentage={simState.status === 'healthy_split' ? 50 : simState.currentLoad}
              />
            </group>

            {/* Office 2 (Right) */}
            <group position={[2.4, 0, 0]}>
              <Building
                floors={1}
                status={simState.status === 'healthy_split' ? 'healthy_split' : 'normal'}
              />
              <StatusLight
                position={[1.6, 0, 1.4]}
                status={simState.status === 'healthy_split' ? 'healthy_split' : 'normal'}
              />
              <LoadMeter
                position={[3.2, 0, 1.4]}
                loadPercentage={simState.status === 'healthy_split' ? 50 : 0}
              />
            </group>

            {/* Active Load Balancer Unit at intersection */}
            {(simState.status === 'healthy_split' || currentBeat?.id === 'beat4_router_interactive' || currentBeat?.id === 'beat5_balanced_rush_hour') && (
              <LoadBalancerUnit
                position={[0, 0, 3.2]}
                isActive={true}
                routingMode="round_robin"
              />
            )}

            {/* Traffic Packets Flow */}
            {simState.status === 'healthy_split' ? (
              /* Balanced: Flow into LB, then split into Office 1 and Office 2 */
              <>
                <Packet startPos={[0, 0.5, 5.5]} endPos={[0, 0.5, 3.2]} speed={2.6} color="#06b6d4" />
                <Packet startPos={[0, 0.5, 3.2]} endPos={[-2.4, 0.5, 1.4]} speed={2.2} color="#10b981" />
                <Packet startPos={[0, 0.5, 3.2]} endPos={[2.4, 0.5, 1.4]} speed={2.2} color="#10b981" />
              </>
            ) : (
              /* Unbalanced: 100% of packets rush directly to Office 1 */
              simState.currentLoad > 0 && (
                <Packet
                  startPos={[0, 0.5, 5.5]}
                  endPos={[-2.4, 0.5, 1.4]}
                  speed={2.2}
                  color={simState.status === 'overloaded' ? '#ef4444' : '#06b6d4'}
                />
              )
            )}
          </group>

          {/* Commuter standing at door */}
          <Employee
            position={[-2.4, 0.4, 2.2]}
            variant="ulysses"
            scale={0.46}
            isStuck={simState.doorsJammed}
          />
        </>
      ) : (
        /* ---------------- LEVEL 0: SCALING SCENE ---------------- */
        <>
          {simState.buildingPlaced ? (
            <>
              {simState.status === 'healthy_split' ? (
                /* Horizontal Scaled Architecture: Two parallel buildings */
                <group position={[0, 0, 0]}>
                  <group position={[-2.4, 0, 0]}>
                    <Building floors={1} status="healthy_split" />
                    <StatusLight position={[-1.6, 0, 1.4]} status="healthy_split" />
                  </group>
                  <group position={[2.4, 0, 0]}>
                    <Building floors={1} status="healthy_split" />
                    <StatusLight position={[1.6, 0, 1.4]} status="healthy_split" />
                  </group>

                  {/* Distributed Packets */}
                  <Packet startPos={[0, 0.5, 4.5]} endPos={[-2.4, 0.5, 1.5]} speed={2.4} color="#10b981" />
                  <Packet startPos={[0, 0.5, 4.5]} endPos={[2.4, 0.5, 1.5]} speed={2.4} color="#10b981" />
                </group>
              ) : (
                /* Single Monolith Building */
                <group position={[0, 0, 0]}>
                  <Building
                    floors={simState.status === 'overloaded' ? 3 : simState.buildingFloors}
                    status={simState.status}
                    isWobbling={simState.status === 'overloaded'}
                  />
                  <StatusLight position={[-1.8, 0, 1.5]} status={simState.status} />
                  <LoadMeter position={[1.8, 0, 1.5]} loadPercentage={simState.currentLoad} />
                  {simState.currentLoad > 0 && (
                    <Packet
                      startPos={[0, 0.5, 5]}
                      endPos={[0, 0.5, 1.4]}
                      speed={2.2}
                      color={simState.status === 'overloaded' ? '#ef4444' : '#06b6d4'}
                    />
                  )}
                </group>
              )}
            </>
          ) : (
            isInteractBeat && onPlotInteract && (
              <InteractivePlot
                position={[0, 0.05, 0]}
                size={THEME.metrics.buildingFootprint}
                onInteract={onPlotInteract}
              />
            )
          )}

          {/* Ulysses Howick */}
          <Employee
            position={[0, 0.4, 3.2]}
            variant="ulysses"
            scale={0.46}
            isStuck={simState.doorsJammed}
          />
        </>
      )}

      {/* Single Point of Failure Red Ring + Arrow Highlighter */}
      {simState.highlightedTarget && (
        <ProblemHighlighter
          position={
            isLevelLB
              ? [-2.4, 0, 1.4]
              : isLevel2
              ? [3.6, 0, -1.8]
              : isLevel3
              ? [3.6, 0, 0.6]
              : isLevel4
              ? [-3.6, 0, 2.0]
              : [0, 0, 0]
          }
          radius={2.4}
          arrowHeight={4.6}
          
        />
      )}

      {/* Decision Dioramas on Pedestals side-by-side */}
      {isDecisionBeat && currentBeat && currentBeat.type === 'decision' && onSelectDecision && !hideDecisionDioramas && (
        <DecisionDioramas
          options={currentBeat.options}
          selectedId={simState.selectedDecision}
          onSelect={onSelectDecision}
        />
      )}

      {/* Commuter Crowd in Simulation beats */}
      {(simState.buildingPlaced || isCampusLevel || isLevelLB) && (
        <>
          {crowd.map((c) => (
            <Employee
              key={c.id}
              position={c.start}
              targetPosition={
                isLevelLB
                  ? simState.status === 'healthy_split'
                    ? (c.id === 'c1' || c.id === 'c3' || c.id === 'c5' ? [-2.4, 0.4, 1.6] : [2.4, 0.4, 1.6])
                    : [-2.4, 0.4, 1.6]
                  : simState.status === 'healthy_split'
                  ? (c.id === 'c1' || c.id === 'c3' ? [-2.4, 0.4, 1.6] : [2.4, 0.4, 1.6])
                  : isLevel4 && (currentBeat?.id === 'beat2_sync_bottleneck' || simState.status === 'overloaded')
                  ? [c.start[0], c.start[1], c.start[2] - 1.2]
                  : isCampusLevel
                  ? [0.6, 0.4, 4.6]
                  : c.target
              }
              speed={
                isLevel4 && (currentBeat?.id === 'beat2_sync_bottleneck' || simState.status === 'overloaded')
                  ? 0
                  : isLevel3 && (currentBeat?.id === 'beat2_db_bottleneck' || simState.status === 'overloaded')
                  ? 0.35
                  : c.speed
              }
              offsetPhase={c.phase}
              scale={0.42}
              isStuck={
                (isLevel4 && (currentBeat?.id === 'beat2_sync_bottleneck' || simState.status === 'overloaded')) ||
                (simState.doorsJammed && (isLevelLB ? c.id === 'c1' || c.id === 'c3' : true))
              }
            />
          ))}
        </>
      )}

      {/* Confetti Explosion on Success */}
      {simState.isConfettiActive && <Confetti3D count={140} origin={[0, 2, 0]} />}
    </>
  );
};
