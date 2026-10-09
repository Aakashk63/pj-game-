import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface GateProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isOpen?: boolean;
}

export const Gate: React.FC<GateProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isOpen = false,
}) => {
  const armRef = useRef<THREE.Group>(null);
  const targetAngleRef = useRef(0);

  useFrame((_, delta) => {
    if (!armRef.current) return;
    targetAngleRef.current = isOpen ? -Math.PI / 2 : 0;
    armRef.current.rotation.y = THREE.MathUtils.lerp(armRef.current.rotation.y, targetAngleRef.current, delta * 8);
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Left Pillar */}
      <mesh position={[-0.75, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[0.75, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Left Scanner Dome */}
      <mesh position={[-0.75, 1.25, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color={isOpen ? THEME.colors.status.healthy : THEME.colors.status.warning}
          emissive={isOpen ? THEME.colors.status.healthy : THEME.colors.status.warning}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Right Scanner Dome */}
      <mesh position={[0.75, 1.25, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color={isOpen ? THEME.colors.status.healthy : THEME.colors.status.warning}
          emissive={isOpen ? THEME.colors.status.healthy : THEME.colors.status.warning}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Swinging Barrier Arm */}
      <group ref={armRef} position={[-0.65, 0.6, 0]}>
        <mesh position={[0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Red & white stripes on arm */}
        {[-0.3, 0.0, 0.3].map((off, i) => (
          <mesh key={i} position={[0.6 + off, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.15, 12]} />
            <meshStandardMaterial color={THEME.colors.status.critical} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
