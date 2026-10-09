import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface PedestalProps {
  position?: [number, number, number];
  radius?: number;
  height?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const Pedestal: React.FC<PedestalProps> = ({
  position = [0, 0, 0],
  radius = THEME.metrics.pedestalRadius,
  height = 0.5,
  isSelected = false,
  onClick,
  children,
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.z = t * 0.8;
  });

  const activeColor = isSelected ? THEME.colors.status.healthy : hovered ? THEME.colors.status.interactiveGlow : THEME.colors.status.pedestalTrim;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
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
      {/* Stone Pedestal Plinth */}
      <mesh position={[0, height / 2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius * 1.1, height, 32]} />
        <meshStandardMaterial
          color={THEME.colors.status.pedestalBase}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Glowing Trim Ring */}
      <mesh
        ref={ringRef}
        position={[0, height + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.88, radius * 0.98, 32]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={hovered || isSelected ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Upward spotlight / floor glow */}
      <pointLight
        position={[0, height + 0.4, 0]}
        color={activeColor}
        intensity={hovered || isSelected ? 1.8 : 0.8}
        distance={3.5}
      />

      {/* Children: Miniature diorama contents */}
      <group position={[0, height, 0]}>
        {children}
      </group>
    </group>
  );
};
