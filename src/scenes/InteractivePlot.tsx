import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface InteractivePlotProps {
  position?: [number, number, number];
  size?: number;
  onInteract: () => void;
  label?: string;
}

export const InteractivePlot: React.FC<InteractivePlotProps> = ({
  position = [0, 0.05, 0],
  size = 2.8,
  onInteract,
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulsing ground target ring
    if (ringRef.current) {
      const scale = 1.0 + Math.sin(t * 5) * 0.06;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5 + Math.sin(t * 6) * 0.8;
    }

    // Hovering hologram cube / beacon
    if (beaconRef.current) {
      beaconRef.current.position.y = 1.2 + Math.sin(t * 3) * 0.2;
      beaconRef.current.rotation.y = t * 1.5;
    }
  });

  const glowColor = hovered ? '#60a5fa' : THEME.colors.status.interactiveGlow;

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Ground Glowing Target Ring */}
      <mesh
        ref={ringRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[size * 0.42, size * 0.48, 32]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={2.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic dashed grid footprint */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={glowColor}
          wireframe
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Floating Holographic Blueprint Icon */}
      <group ref={beaconRef} position={[0, 1.2, 0]}>
        {/* Hologram wireframe cube */}
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshBasicMaterial
            color={glowColor}
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Inner solid glowing core */}
        <mesh>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Upward spotlight */}
      <pointLight position={[0, 0.8, 0]} color={glowColor} intensity={1.5} distance={4} />
    </group>
  );
};
