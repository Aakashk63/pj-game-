import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SalaryFileProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isAlert?: boolean;
  isOpen?: boolean;
}

export const SalaryFile: React.FC<SalaryFileProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isAlert = false,
  isOpen = false,
}) => {
  const folderRef = useRef<THREE.Group>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (folderRef.current) {
      const t = state.clock.getElapsedTime();
      if (isAlert) {
        // Warning vibration
        folderRef.current.position.y = position[1] + Math.sin(t * 18) * 0.02;
      }
    }
    if (glowLightRef.current && isAlert) {
      const t = state.clock.getElapsedTime();
      glowLightRef.current.intensity = 1.0 + Math.sin(t * 10) * 0.8;
    }
  });

  const folderColor = isAlert ? '#ef4444' : '#d97706';
  const lightColor = isAlert ? '#ef4444' : '#f59e0b';

  return (
    <group ref={folderRef} position={position} rotation={rotation}>
      {/* Folder Back Cover */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.38, 0.02, 0.48]} />
        <meshStandardMaterial color={folderColor} roughness={0.5} />
      </mesh>

      {/* Internal Paper Pages */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.34, 0.03, 0.44]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Red "TOP SECRET / CONFIDENTIAL" Seal */}
      <mesh position={[0, 0.057, 0]}>
        <boxGeometry args={[0.22, 0.005, 0.12]} />
        <meshBasicMaterial color={isAlert ? '#dc2626' : '#b91c1c'} />
      </mesh>

      {/* Folder Top Cover (hinged if open) */}
      <mesh
        position={isOpen ? [0.18, 0.12, 0] : [0, 0.065, 0]}
        rotation={isOpen ? [0, 0, Math.PI / 4] : [0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.38, 0.015, 0.48]} />
        <meshStandardMaterial color={folderColor} roughness={0.5} />
      </mesh>

      {/* Point Light Glow */}
      <pointLight
        ref={glowLightRef}
        position={[0, 0.2, 0]}
        color={lightColor}
        intensity={0.8}
        distance={1.6}
      />
    </group>
  );
};
