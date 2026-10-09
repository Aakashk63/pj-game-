import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface MessageQueueBayProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
  isFrozen?: boolean;
}

export const MessageQueueBay: React.FC<MessageQueueBayProps> = ({
  position = [-3.8, 0, 2.0],
  scale = 1,
  isActive = true,
  isFrozen = false,
}) => {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!isFrozen) {
      if (gear1Ref.current) gear1Ref.current.rotation.y = t * 1.8;
      if (gear2Ref.current) gear2Ref.current.rotation.y = -t * 1.8;
      if (pulseRef.current) {
        pulseRef.current.position.x = -0.6 + ((t * 0.8) % 1.2);
      }
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Heavy Plinth Platform */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.2, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Queue Conveyor Channel */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.05, 0.7]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Queue Slot Dividers (FIFO Slots) */}
      {[-1.0, -0.3, 0.4, 1.1].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.35, 0]}>
          {/* Buffer Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.25, 0.55]} />
            <meshStandardMaterial
              color={isFrozen ? '#38bdf8' : '#0891b2'}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Job Capsule Payload */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.38, 0.2, 0.38]} />
            <meshStandardMaterial
              color={isFrozen ? '#93c5fd' : '#06b6d4'}
              emissive={isFrozen ? '#1d4ed8' : '#0891b2'}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Moving Processing Pulse on Conveyor */}
      {!isFrozen && isActive && (
        <mesh ref={pulseRef} position={[-0.6, 0.26, 0]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Background Worker Terminal 1 (Left Worker) */}
      <group position={[-1.2, 0.6, -0.7]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.9, 0.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Worker LED Display */}
        <mesh position={[0, 0.15, 0.26]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color={isFrozen ? '#ef4444' : '#10b981'} />
        </mesh>
        {/* Worker Processing Gear */}
        <mesh ref={gear1Ref} position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      </group>

      {/* Background Worker Terminal 2 (Right Worker) */}
      <group position={[1.2, 0.6, -0.7]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.9, 0.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Worker LED Display */}
        <mesh position={[0, 0.15, 0.26]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color={isFrozen ? '#ef4444' : '#10b981'} />
        </mesh>
        {/* Worker Processing Gear */}
        <mesh ref={gear2Ref} position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      </group>

      {/* 3D Floating Status Badge */}
      <Html position={[0, 2.1, 0]} transform distanceFactor={5.5}>
        <div
          className={`px-3 py-1 rounded-xl text-xs font-black shadow-2xl border flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md ${
            isFrozen
              ? 'bg-rose-950/90 text-rose-200 border-rose-500 animate-pulse'
              : 'bg-cyan-950/90 text-cyan-200 border-cyan-400'
          }`}
        >
          <span>{isFrozen ? '🚨 504 GATEWAY TIMEOUT — FRONT DESK FROZEN' : '📥 MESSAGE QUEUE (KAFKA / RABBITMQ): ASYNC 202'}</span>
        </div>
      </Html>
    </group>
  );
};
