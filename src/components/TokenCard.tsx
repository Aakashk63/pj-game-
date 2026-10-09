import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TokenCardProps {
  position?: [number, number, number];
  scale?: number;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  position = [0, 1.8, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.1;
    groupRef.current.rotation.y = t * 1.5;

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Golden Card Slab */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.45, 0.04]} />
        <meshStandardMaterial
          color="#f1c40f"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Center Key / Lock Emblem */}
      <mesh position={[0, 0, 0.025]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Orbiting Golden Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.55, 0.02, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.0} />
      </mesh>

      {/* Radiant golden light */}
      <pointLight color="#fbbf24" intensity={1.5} distance={3} />
    </group>
  );
};
