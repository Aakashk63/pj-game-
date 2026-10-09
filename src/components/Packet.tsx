import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface PacketProps {
  startPos?: [number, number, number];
  endPos?: [number, number, number];
  speed?: number;
  color?: string;
  scale?: number;
}

export const Packet: React.FC<PacketProps> = ({
  startPos = [0, 0.6, 6],
  endPos = [0, 0.6, 1.5],
  speed = 1.8,
  color = THEME.colors.status.packetGlow,
  scale = 1,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const startVec = useRef(new THREE.Vector3(...startPos));
  const endVec = useRef(new THREE.Vector3(...endPos));
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    progressRef.current = (progressRef.current + delta * speed * 0.4) % 1.0;
    
    // Interpolate linearly between start and end
    meshRef.current.position.lerpVectors(startVec.current, endVec.current, progressRef.current);

    // Subtle sinusoidal bobbing and rotation
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = THREE.MathUtils.lerp(startVec.current.y, endVec.current.y, progressRef.current) + Math.sin(t * 8) * 0.08;
    meshRef.current.rotation.y = t * 4;
    meshRef.current.rotation.x = Math.sin(t * 3) * 0.2;
  });

  return (
    <group ref={meshRef} scale={scale}>
      {/* Outer energy bubble */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.26, 0.02, 8, 20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>

      {/* Point light */}
      <pointLight color={color} intensity={1.2} distance={2.5} />
    </group>
  );
};
