import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RoleType } from './RoleAvatar';

interface RoleCardProps {
  role: RoleType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isValid?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  position = [0, 1.4, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  isValid = true,
}) => {
  const cardRef = useRef<THREE.Group>(null);

  const roleMeta = {
    developer: {
      color: '#2563eb',
      title: 'DEVELOPER',
      name: 'Alex Chen',
      id: 'EMP-4092',
    },
    hr: {
      color: '#db2777',
      title: 'HR LEAD',
      name: 'Sarah Lynn',
      id: 'EMP-2088',
    },
    finance: {
      color: '#059669',
      title: 'FINANCE MGR',
      name: 'David Kim',
      id: 'EMP-1021',
    },
    intern: {
      color: '#f59e0b',
      title: 'INTERN',
      name: 'Tim Rogers',
      id: 'EMP-9031',
    },
  }[role];

  useFrame((state) => {
    if (cardRef.current) {
      const t = state.clock.getElapsedTime();
      cardRef.current.position.y = position[1] + Math.sin(t * 2.5) * 0.05;
      cardRef.current.rotation.y = rotation[1] + Math.sin(t * 1.8) * 0.15;
    }
  });

  return (
    <group ref={cardRef} position={position} rotation={rotation} scale={scale}>
      {/* Lanyard Strap */}
      <mesh position={[0, 0.7, -0.01]}>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
        <meshStandardMaterial color={roleMeta.color} roughness={0.6} />
      </mesh>

      {/* Card Clip Hook */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.04]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Main White Badge Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.62, 0.88, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Colored Role Header Stripe */}
      <mesh position={[0, 0.34, 0.012]}>
        <boxGeometry args={[0.58, 0.14, 0.005]} />
        <meshBasicMaterial color={roleMeta.color} />
      </mesh>

      {/* Photo Avatar Box */}
      <mesh position={[-0.14, 0.08, 0.012]}>
        <boxGeometry args={[0.22, 0.26, 0.005]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Name and ID Bars */}
      <mesh position={[0.12, 0.14, 0.012]}>
        <boxGeometry args={[0.24, 0.04, 0.005]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.12, 0.06, 0.012]}>
        <boxGeometry args={[0.2, 0.03, 0.005]} />
        <meshBasicMaterial color={roleMeta.color} />
      </mesh>

      {/* Barcode Strip */}
      <mesh position={[0, -0.28, 0.012]}>
        <boxGeometry args={[0.48, 0.1, 0.005]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* RFID NFC Gold Microchip */}
      <mesh position={[0.12, -0.06, 0.012]}>
        <boxGeometry args={[0.08, 0.08, 0.006]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Validation Glow Ring */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[0.7, 0.96]} />
        <meshBasicMaterial
          color={isValid ? roleMeta.color : '#ef4444'}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
