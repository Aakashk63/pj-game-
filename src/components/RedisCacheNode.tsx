import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface RedisCacheNodeProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const RedisCacheNode: React.FC<RedisCacheNodeProps> = ({
  position = [-3.8, 0, 2.2],
  scale = 1,
  isActive = true,
}) => {
  const ramHaloRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ramHaloRef.current) {
      ramHaloRef.current.rotation.z = t * 2.5;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Plinth Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.35, 0.2, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Outer Cyan Energy Ring on Plinth */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.15, 28]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
      </mesh>

      {/* Main Redis Memory Tower (Octagonal / High-Tech Cylinder) */}
      <mesh ref={coreRef} position={[0, 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 1.3, 16]} />
        <meshStandardMaterial
          color="#e11d48"
          emissive="#be123c"
          emissiveIntensity={isActive ? 0.7 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Fast Spinning RAM Energy Halo */}
      <mesh ref={ramHaloRef} position={[0, 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.05, 12, 32]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Second Inner Energy Ring */}
      <mesh position={[0, 1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.03, 12, 32]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Floating Holographic Crystal Core on Top */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Floating 3D HUD Badge */}
      <Html position={[0, 2.35, 0]} transform distanceFactor={5.5}>
        <div className="px-3 py-1 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-black shadow-2xl flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md">
          <span>⚡ IN-MEMORY CACHE (RAM): ~1ms LATENCY</span>
        </div>
      </Html>
    </group>
  );
};
