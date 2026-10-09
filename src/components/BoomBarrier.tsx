import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface BoomBarrierProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isOpen?: boolean;
  scale?: number;
}

export const BoomBarrier: React.FC<BoomBarrierProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isOpen = false,
  scale = 1,
}) => {
  const armPivotRef = useRef<THREE.Group>(null);
  const currentAngleRef = useRef(0);

  useFrame((_, delta) => {
    if (!armPivotRef.current) return;
    // Open = 80 degrees up (-1.4 rad)
    const targetAngle = isOpen ? -Math.PI / 2.2 : 0;
    currentAngleRef.current = THREE.MathUtils.lerp(currentAngleRef.current, targetAngle, delta * 7);
    armPivotRef.current.rotation.z = currentAngleRef.current;
  });

  const barrierLength = 2.8;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Heavy Steel Housing Column */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 1.3, 0.35]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Access Control Reader Panel */}
      <mesh position={[0.18, 0.75, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {/* RFID Sensor Glow Ring */}
      <mesh position={[0.205, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial
          color={isOpen ? THEME.colors.status.passGreen : THEME.colors.status.scannerCyan}
          emissive={isOpen ? THEME.colors.status.passGreen : THEME.colors.status.scannerCyan}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Top Status Dome Light */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.09, 14, 14]} />
        <meshStandardMaterial
          color={isOpen ? THEME.colors.status.passGreen : THEME.colors.status.deniedRed}
          emissive={isOpen ? THEME.colors.status.passGreen : THEME.colors.status.deniedRed}
          emissiveIntensity={2.0}
        />
      </mesh>
      <pointLight
        position={[0, 1.4, 0]}
        color={isOpen ? THEME.colors.status.passGreen : THEME.colors.status.deniedRed}
        intensity={1.2}
        distance={3}
      />

      {/* Pivot Hub */}
      <mesh position={[0, 0.95, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* Animated Lifting Boom Arm */}
      <group ref={armPivotRef} position={[0, 0.95, 0.3]}>
        {/* Main Aluminum Pole */}
        <mesh position={[barrierLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, barrierLength, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* High-visibility Red Stripes */}
        {[-0.9, -0.4, 0.1, 0.6, 1.1].map((offset, i) => (
          <mesh key={i} position={[barrierLength / 2 + offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.048, 0.048, 0.22, 12]} />
            <meshStandardMaterial color="#e74c3c" roughness={0.4} />
          </mesh>
        ))}

        {/* Counterweight */}
        <mesh position={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.35, 0.12, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};
