import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface LoadMeterProps {
  position?: [number, number, number];
  loadPercentage: number; // 0 to 100
  scale?: number;
}

export const LoadMeter: React.FC<LoadMeterProps> = ({
  position = [0, 0, 0],
  loadPercentage,
  scale = 1,
}) => {
  const liquidRef = useRef<THREE.Mesh>(null);
  const currentHeightRef = useRef<number>(0.1);

  // Meter dimensions
  const totalHeight = 1.8;
  const radius = 0.22;

  useFrame((_, delta) => {
    // Smooth lerp to target height
    const targetHeight = Math.max(0.05, Math.min(totalHeight * 0.95, (loadPercentage / 100) * totalHeight));
    currentHeightRef.current = THREE.MathUtils.lerp(currentHeightRef.current, targetHeight, delta * 6);

    if (liquidRef.current) {
      liquidRef.current.scale.y = currentHeightRef.current;
      liquidRef.current.position.y = 0.15 + currentHeightRef.current / 2;
    }
  });

  const getMeterColor = () => {
    if (loadPercentage > 85) return THEME.colors.status.critical;
    if (loadPercentage > 55) return THEME.colors.status.warning;
    return THEME.colors.status.healthy;
  };

  const meterColor = getMeterColor();

  return (
    <group position={position} scale={scale}>
      {/* Heavy base plinth */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.42, 0.16, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, totalHeight + 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.35, 0.14, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Back metal gauge plate */}
      <mesh position={[0, totalHeight / 2 + 0.15, -0.05]}>
        <cylinderGeometry args={[radius * 1.05, radius * 1.05, totalHeight, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Glass outer cylinder */}
      <mesh position={[0, totalHeight / 2 + 0.15, 0]}>
        <cylinderGeometry args={[radius, radius, totalHeight, 20]} />
        <meshPhysicalMaterial
          color="#94a3b8"
          transparent
          opacity={0.3}
          roughness={0.1}
          transmission={0.8}
          thickness={0.2}
        />
      </mesh>

      {/* Animated Glowing Liquid Core */}
      <mesh ref={liquidRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[radius * 0.85, radius * 0.85, 1, 16]} />
        <meshStandardMaterial
          color={meterColor}
          emissive={meterColor}
          emissiveIntensity={1.4}
          roughness={0.2}
        />
      </mesh>

      {/* Tick Marks (3 vertical status rings) */}
      {[0.25, 0.5, 0.75].map((fraction, i) => (
        <mesh key={i} position={[0, 0.15 + totalHeight * fraction, 0]}>
          <torusGeometry args={[radius * 1.02, 0.015, 8, 24]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} />
        </mesh>
      ))}

      {/* Gauge readout light */}
      <pointLight
        position={[0, 0.15 + (loadPercentage / 100) * totalHeight, 0.3]}
        color={meterColor}
        intensity={0.8}
        distance={2.5}
      />
    </group>
  );
};
