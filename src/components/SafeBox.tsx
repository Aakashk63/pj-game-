import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SafeBoxProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isOpen?: boolean;
}

export const SafeBox: React.FC<SafeBoxProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isOpen = false,
}) => {
  const doorHingeRef = useRef<THREE.Group>(null);
  const targetRotation = isOpen ? -Math.PI / 1.8 : 0;

  useFrame((_, delta) => {
    if (doorHingeRef.current) {
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetRotation,
        6,
        delta
      );
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Steel Safe Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.9, 0.9, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Vault Base Pedestal Stand */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.96, 0.1, 0.86]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Vault Door (Hinged on Left) */}
      <group ref={doorHingeRef} position={[-0.42, 0.45, 0.4]}>
        {/* Door Slab */}
        <mesh position={[0.42, 0, 0.05]} castShadow>
          <boxGeometry args={[0.84, 0.84, 0.1]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Combination Dial Wheel */}
        <mesh position={[0.42, 0.05, 0.12]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Vault Handle Spoke Wheel */}
        <mesh position={[0.65, -0.05, 0.12]}>
          <torusGeometry args={[0.08, 0.02, 12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
