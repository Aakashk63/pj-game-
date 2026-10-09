import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudProps {
  position: [number, number, number];
  speed?: number;
  scale?: number;
}

export const Cloud: React.FC<CloudProps> = ({
  position,
  speed = 0.2,
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.x += delta * speed;
    if (groupRef.current.position.x > 30) {
      groupRef.current.position.x = -30;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh castShadow={false}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.9, -0.2, 0]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.9, -0.1, 0.2]}>
        <sphereGeometry args={[0.85, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.2, 0.4, -0.1]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};
