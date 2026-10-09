import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface IDCardProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  name?: string;
  idNumber?: string;
  department?: string;
  isValid?: boolean;
  scale?: number;
  isFloating?: boolean;
  onClick?: () => void;
}

export const IDCard: React.FC<IDCardProps> = ({
  position = [0, 1.4, 0],
  rotation = [0, 0, 0],
  name: _name = 'ALEX CHEN',
  idNumber: _idNumber = 'EMP-4092',
  department: _department = 'ENG',
  isValid = true,
  scale = 1,
  isFloating = true,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !isFloating) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.08;
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 2) * 0.15;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Blue Lanyard Strap Loop */}
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.22, 0.02, 8, 24]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Metal Lanyard Clip */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Plastic ID Card Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.95, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Top Header Banner ("COMPANY ID") */}
      <mesh position={[0, 0.38, 0.025]}>
        <boxGeometry args={[0.66, 0.14, 0.01]} />
        <meshStandardMaterial color="#1b2a4a" roughness={0.4} />
      </mesh>

      {/* Photo Thumbnail Avatar Frame */}
      <mesh position={[-0.16, 0.12, 0.025]}>
        <boxGeometry args={[0.26, 0.3, 0.01]} />
        <meshStandardMaterial color={isValid ? '#38bdf8' : '#f87171'} roughness={0.5} />
      </mesh>
      {/* Photo silhouette head */}
      <mesh position={[-0.16, 0.16, 0.035]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Photo silhouette shoulders */}
      <mesh position={[-0.16, 0.05, 0.035]}>
        <cylinderGeometry args={[0.08, 0.09, 0.08, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Text Lines (Name, ID, Dept simulated with tactile embossed bars) */}
      <mesh position={[0.12, 0.22, 0.025]}>
        <boxGeometry args={[0.24, 0.04, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.12, 0.14, 0.025]}>
        <boxGeometry args={[0.22, 0.03, 0.01]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0.12, 0.06, 0.025]}>
        <boxGeometry args={[0.18, 0.03, 0.01]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* RFID Chip / Golden Contact Pad */}
      <mesh position={[0, -0.15, 0.025]}>
        <boxGeometry args={[0.14, 0.12, 0.01]} />
        <meshStandardMaterial color="#f1c40f" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Barcode Strip at Bottom */}
      <mesh position={[0, -0.32, 0.025]}>
        <boxGeometry args={[0.54, 0.12, 0.01]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Alternating barcode lines */}
      {[-0.2, -0.12, -0.04, 0.04, 0.12, 0.2].map((bx, i) => (
        <mesh key={i} position={[bx, -0.32, 0.032]}>
          <boxGeometry args={[0.025, 0.1, 0.005]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Floating subtle cyan/gold glow */}
      <pointLight
        position={[0, 0, 0.15]}
        color={isValid ? '#38bdf8' : '#ef4444'}
        intensity={0.6}
        distance={1.5}
      />
    </group>
  );
};
