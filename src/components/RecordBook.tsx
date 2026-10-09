import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface RecordBookProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isWriting?: boolean;
}

export const RecordBook: React.FC<RecordBookProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWriting = false,
}) => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isWriting) {
      lightRef.current.intensity = 1.0 + Math.sin(t * 12) * 0.8;
    } else {
      lightRef.current.intensity = 0.5 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Stone / Timber Pedestal Table */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.9, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Leather Book Cover Base */}
      <mesh position={[0, 0.94, 0]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.55]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>

      {/* Parchment Pages */}
      <mesh position={[0, 0.99, 0]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.66, 0.06, 0.52]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>

      {/* Gold Trim / Database Emblem */}
      <mesh position={[0, 1.03, 0]} rotation={[-0.1, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Writing / Query Glow Indicator */}
      <pointLight
        ref={lightRef}
        position={[0, 1.2, 0]}
        color={THEME.colors.status.packetGlow}
        intensity={0.6}
        distance={2}
      />
    </group>
  );
};
