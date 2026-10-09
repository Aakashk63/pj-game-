import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AlarmLightProps {
  position?: [number, number, number];
  isActive?: boolean;
  scale?: number;
}

export const AlarmLight: React.FC<AlarmLightProps> = ({
  position = [0, 2.5, 0],
  isActive = false,
  scale = 1,
}) => {
  const rotorRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!isActive) return;
    const t = state.clock.getElapsedTime();
    if (rotorRef.current) {
      rotorRef.current.rotation.y = t * 14;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 2.0 + Math.sin(t * 14) * 1.5;
    }
  });

  if (!isActive) return null;

  return (
    <group position={position} scale={scale}>
      {/* Heavy Industrial Mount Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Red Glass Dome */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.3, 16]} />
        <meshPhysicalMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.8}
          transparent
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>

      {/* Rotating Reflector Beacon */}
      <group ref={rotorRef} position={[0, 0.2, 0]}>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.12, 12]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Red Warning Point Light */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0.25, 0]}
        color="#ef4444"
        intensity={2.5}
        distance={6}
      />
    </group>
  );
};
