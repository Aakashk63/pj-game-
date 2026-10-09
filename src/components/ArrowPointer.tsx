import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArrowPointerProps {
  position?: [number, number, number];
  color?: string;
}

export const ArrowPointer: React.FC<ArrowPointerProps> = ({
  position = [0, 3.2, 3.6],
  color = '#ef4444',
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Bobbing down towards target
    groupRef.current.position.y = position[1] + Math.sin(time * 6) * 0.18;
  });

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI, 0, 0]}>
      {/* Arrow Cone pointing down */}
      <mesh position={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.6, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      {/* Arrow Shaft */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
};
