import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EmployeeRecordsScreenProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  highlightedRowIndex?: number | null;
  statusMatch?: 'matching' | 'mismatch' | 'idle';
  scale?: number;
}

export const EmployeeRecordsScreen: React.FC<EmployeeRecordsScreenProps> = ({
  position = [0, 2, 0],
  rotation = [0, 0, 0],
  highlightedRowIndex = 1,
  statusMatch = 'matching',
  scale = 1,
}) => {
  const glowLightRef = useRef<THREE.PointLight>(null);

  const getMatchColor = () => {
    if (statusMatch === 'matching') return '#2ecc71';
    if (statusMatch === 'mismatch') return '#e74c3c';
    return '#38bdf8';
  };

  const matchColor = getMatchColor();

  useFrame((state) => {
    if (!glowLightRef.current) return;
    const t = state.clock.getElapsedTime();
    glowLightRef.current.intensity = 1.0 + Math.sin(t * 6) * 0.4;
  });

  const records = [
    { name: 'DAVID KIM', id: 'EMP-1021', dept: 'SYS' },
    { name: 'ALEX CHEN', id: 'EMP-4092', dept: 'ENG' },
    { name: 'SARAH LYNN', id: 'EMP-2088', dept: 'OPS' },
    { name: 'MAYA PATEL', id: 'EMP-3044', dept: 'SEC' },
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Outer Monitor Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.6, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Screen Display Backing */}
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[2.05, 1.45]} />
        <meshStandardMaterial color="#020617" roughness={0.2} />
      </mesh>

      {/* Screen Title Bar ("DATABASE / EMPLOYEE RECORDS") */}
      <mesh position={[0, 0.58, 0.06]}>
        <planeGeometry args={[1.95, 0.18]} />
        <meshStandardMaterial color="#1b2a4a" roughness={0.3} />
      </mesh>
      {/* Active status pip */}
      <mesh position={[0.85, 0.58, 0.065]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color={matchColor} emissive={matchColor} emissiveIntensity={1.8} />
      </mesh>

      {/* Database Record Rows */}
      {records.map((_rec, i) => {
        const isSelected = highlightedRowIndex === i;
        const rowColor = isSelected ? matchColor : '#1e293b';
        const yPos = 0.32 - i * 0.25;

        return (
          <group key={i} position={[0, yPos, 0.06]}>
            {/* Row background strip */}
            <mesh>
              <planeGeometry args={[1.9, 0.2]} />
              <meshStandardMaterial
                color={rowColor}
                emissive={isSelected ? rowColor : '#000000'}
                emissiveIntensity={isSelected ? 0.6 : 0}
                roughness={0.4}
              />
            </mesh>

            {/* Avatar icon */}
            <mesh position={[-0.8, 0, 0.01]}>
              <circleGeometry args={[0.06, 12]} />
              <meshStandardMaterial color={isSelected ? '#ffffff' : '#38bdf8'} />
            </mesh>

            {/* Name simulated bar */}
            <mesh position={[-0.35, 0.02, 0.01]}>
              <planeGeometry args={[0.6, 0.05]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* ID Number simulated bar */}
            <mesh position={[0.3, 0.02, 0.01]}>
              <planeGeometry args={[0.4, 0.04]} />
              <meshStandardMaterial color={isSelected ? '#ffffff' : '#94a3b8'} />
            </mesh>

            {/* Dept badge */}
            <mesh position={[0.72, 0, 0.01]}>
              <planeGeometry args={[0.22, 0.08]} />
              <meshStandardMaterial color={isSelected ? '#ffffff' : '#334155'} />
            </mesh>
          </group>
        );
      })}

      {/* Screen Hologram Light Glow */}
      <pointLight
        ref={glowLightRef}
        position={[0, 0, 0.3]}
        color={matchColor}
        intensity={1.0}
        distance={2.5}
      />
    </group>
  );
};
