import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface StatusLightProps {
  position?: [number, number, number];
  status: 'normal' | 'stressed' | 'overloaded' | 'healthy_split';
  scale?: number;
}

export const StatusLight: React.FC<StatusLightProps> = ({
  position = [0, 0, 0],
  status,
  scale = 1,
}) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const getColor = () => {
    switch (status) {
      case 'stressed':
        return THEME.colors.status.warning;
      case 'overloaded':
        return THEME.colors.status.critical;
      case 'healthy_split':
      case 'normal':
      default:
        return THEME.colors.status.healthy;
    }
  };

  const color = getColor();

  useFrame((state) => {
    if (!lightRef.current || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (status === 'overloaded') {
      // Rapid flashing strobe
      const strobe = Math.sin(t * 14) > 0 ? 2.5 : 0.2;
      lightRef.current.intensity = strobe;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = strobe * 1.5;
    } else if (status === 'stressed') {
      // Pulsing amber alert
      const pulse = 1.0 + Math.sin(t * 5) * 0.6;
      lightRef.current.intensity = pulse;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    } else {
      // Gentle calm breathing green
      const calm = 0.8 + Math.sin(t * 2) * 0.2;
      lightRef.current.intensity = calm;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = calm;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Sleek metallic stanchion post */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.9, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
      </mesh>
      
      {/* Base mounting ring */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Glass housing bulb */}
      <mesh ref={meshRef} position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Radiating point light */}
      <pointLight
        ref={lightRef}
        position={[0, 1.0, 0]}
        color={color}
        intensity={1.2}
        distance={4.5}
        decay={2}
      />
    </group>
  );
};
