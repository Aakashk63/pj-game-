import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface DatabaseClusterProps {
  position?: [number, number, number];
  scale?: number;
  status?: 'normal' | 'stressed' | 'overloaded' | 'idle';
  loadPercentage?: number;
}

export const DatabaseCluster: React.FC<DatabaseClusterProps> = ({
  position = [3.6, 0, 0.8],
  scale = 1,
  status = 'normal',
  loadPercentage = 20,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current && status === 'overloaded') {
      // Overloaded vibration shake
      groupRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.05;
      groupRef.current.position.z = position[2] + (Math.random() - 0.5) * 0.05;
    } else if (groupRef.current) {
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * (status === 'overloaded' ? 3.5 : 1.2);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * (status === 'overloaded' ? 3.5 : 1.2);
    }
  });

  const isOverloaded = status === 'overloaded';
  const isIdle = status === 'idle';

  const cylinderColor = isOverloaded ? '#e11d48' : isIdle ? '#334155' : '#0284c7';
  const emissiveColor = isOverloaded ? '#9f1239' : isIdle ? '#0f172a' : '#0369a1';
  const ringColor = isOverloaded ? '#ef4444' : isIdle ? '#10b981' : '#38bdf8';

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Plinth Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.45, 0.2, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Database Cylinder Stack (3 Disks) */}
      {[0.4, 0.9, 1.4].map((yPos, i) => (
        <group key={i} position={[0, yPos, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.38, 28]} />
            <meshStandardMaterial
              color={cylinderColor}
              emissive={emissiveColor}
              emissiveIntensity={isOverloaded ? 0.7 : 0.25}
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>

          {/* Disk Trim Seam */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.98, 0.98, 0.06, 28]} />
            <meshBasicMaterial color={ringColor} />
          </mesh>
        </group>
      ))}

      {/* Rotating Read/Write Activity Rings */}
      <mesh ref={ring1Ref} position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 24]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 24]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* Top Cap with Server Antenna */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.75, 0.12, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Activity Blinking Beacon */}
      <mesh position={[0, 1.76, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={isOverloaded ? '#ef4444' : '#10b981'} />
      </mesh>

      {/* 3D Floating Status Badge */}
      <Html position={[0, 2.3, 0]} transform distanceFactor={5.5}>
        <div
          className={`px-3 py-1 rounded-xl text-xs font-black shadow-2xl border flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md ${
            isOverloaded
              ? 'bg-rose-950/90 text-rose-200 border-rose-500 animate-pulse'
              : isIdle
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
              : 'bg-slate-900/90 text-sky-200 border-sky-400'
          }`}
        >
          <span>{isOverloaded ? '🚨 DB DISK SATURATED (100% I/O)' : isIdle ? '✓ DB RESTING: 4% LOAD' : `DB DISK LOAD: ${loadPercentage}%`}</span>
        </div>
      </Html>
    </group>
  );
};
