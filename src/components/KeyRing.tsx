import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KeyRingProps {
  position?: [number, number, number];
  scale?: number;
}

export const KeyRing: React.FC<KeyRingProps> = ({
  position = [0, 0, 0],
  scale = 1.0,
}) => {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.getElapsedTime();
      ringRef.current.position.y = position[1] + Math.sin(t * 3) * 0.08;
      ringRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={ringRef} position={position} scale={scale}>
      {/* Central Brass Key Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.04, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Dangling Key 1 */}
      <group position={[-0.2, -0.25, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.45, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, -0.35, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Dangling Key 2 */}
      <group position={[0, -0.3, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.06, 0.5, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.05, -0.38, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Dangling Key 3 */}
      <group position={[0.2, -0.25, 0]} rotation={[0, 0, Math.PI / 6]}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.45, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, -0.32, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
