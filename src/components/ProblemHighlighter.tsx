import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { THEME } from '../art/theme';
import { AlertTriangle } from 'lucide-react';

interface ProblemHighlighterProps {
  position?: [number, number, number];
  radius?: number;
  arrowHeight?: number;
  label?: string;
}

export const ProblemHighlighter: React.FC<ProblemHighlighterProps> = ({
  position = [0, 0, 0],
  radius = 2.0,
  arrowHeight = 4.8,
  label,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulsing ground warning ring
    if (ringRef.current) {
      const pulse = 1.0 + Math.sin(t * 8) * 0.15;
      ringRef.current.scale.set(pulse, pulse, 1);
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0 + Math.sin(t * 8) * 1.0;
    }

    // Bobbing pointing arrow
    if (arrowRef.current) {
      const bob = Math.sin(t * 6) * 0.25;
      arrowRef.current.position.y = arrowHeight + bob;
      arrowRef.current.rotation.y = t * 2.0;
    }

    // Strobe light
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 2.5 + Math.sin(t * 10) * 1.5;
    }
  });

  const redColor = THEME.colors.status.critical;

  return (
    <group position={position}>
      {/* Ground Warning Ring */}
      <mesh
        ref={ringRef}
        position={[0, 0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.85, radius, 32]} />
        <meshStandardMaterial
          color={redColor}
          emissive={redColor}
          emissiveIntensity={2.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Pointer Arrow */}
      <group ref={arrowRef} position={[0, arrowHeight, 0]}>
        {/* Downward cone head */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.4, 0.7, 8]} />
          <meshStandardMaterial
            color={redColor}
            emissive={redColor}
            emissiveIntensity={3.0}
            roughness={0.2}
          />
        </mesh>

        {/* Arrow shaft */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.6, 8]} />
          <meshStandardMaterial
            color={redColor}
            emissive={redColor}
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>

        {/* Short Warning Label */}
        {label && (
          <Html position={[0, 0.9, 0]} center distanceFactor={12} className="pointer-events-none select-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/95 border border-rose-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl whitespace-nowrap animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span>{label}</span>
            </div>
          </Html>
        )}
      </group>

      {/* Warning strobe light */}
      <pointLight
        ref={pointLightRef}
        position={[0, arrowHeight - 0.5, 0]}
        color={redColor}
        intensity={3.0}
        distance={6}
      />
    </group>
  );
};
