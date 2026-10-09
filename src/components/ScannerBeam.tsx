import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScannerBeamProps {
  position?: [number, number, number];
  color?: string;
  isScanning?: boolean;
  scale?: number;
}

export const ScannerBeam: React.FC<ScannerBeamProps> = ({
  position = [0, 1.4, 0],
  color = '#00f0ff',
  isScanning = true,
  scale = 1,
}) => {
  const beamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!beamRef.current || !isScanning) return;
    const t = state.clock.getElapsedTime();
    // Sweep up and down across the card
    beamRef.current.position.y = position[1] + Math.sin(t * 8) * 0.45;
  });

  if (!isScanning) return null;

  return (
    <group ref={beamRef} position={position} scale={scale}>
      {/* Horizontal Laser Line */}
      <mesh>
        <boxGeometry args={[0.9, 0.02, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={3.0} />
      </mesh>

      {/* Fan Light Plane (translucent beam) */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <planeGeometry args={[0.9, 0.4]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Laser point light */}
      <pointLight color={color} intensity={1.5} distance={2.0} />
    </group>
  );
};
