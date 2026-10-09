import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PulsingRingProps {
  position?: [number, number, number];
  color?: string;
  radius?: number;
}

export const PulsingRing: React.FC<PulsingRingProps> = ({
  position = [0, 0.08, 3.6],
  color = '#ef4444',
  radius = 1.2,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(time * 6) * 0.18;
    meshRef.current.scale.set(scale, scale, 1);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.8, radius, 32]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.85} />
    </mesh>
  );
};
