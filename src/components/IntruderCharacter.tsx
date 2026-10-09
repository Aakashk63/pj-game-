import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface IntruderProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  targetPosition?: [number, number, number];
  hasLaptop?: boolean;
  isFleeing?: boolean;
  scale?: number;
}

export const IntruderCharacter: React.FC<IntruderProps> = ({
  position = [0, 0.4, 0],
  rotation = [0, 0, 0],
  targetPosition,
  hasLaptop = false,
  isFleeing = false,
  scale = 0.48,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const currentPos = useRef(new THREE.Vector3(...position));
  const targetVec = useRef(targetPosition ? new THREE.Vector3(...targetPosition) : null);

  const hoodieColor = THEME.colors.character.intruderHoodie || '#334155';
  const pantsColor = THEME.colors.character.intruderPants || '#1e293b';

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * (isFleeing ? 12 : 7);

    // Position interpolation if destination provided
    if (targetVec.current) {
      const dist = currentPos.current.distanceTo(targetVec.current);
      if (dist > 0.1) {
        const dir = new THREE.Vector3().subVectors(targetVec.current, currentPos.current).normalize();
        currentPos.current.addScaledVector(dir, delta * (isFleeing ? 3.0 : 1.4));
        groupRef.current.position.copy(currentPos.current);

        const angle = Math.atan2(dir.x, dir.z);
        groupRef.current.rotation.y = angle;
      }
    } else {
      groupRef.current.position.copy(currentPos.current);
    }

    // Walking / Sneaking bob
    const bounce = Math.abs(Math.sin(t)) * 0.07;
    groupRef.current.position.y = currentPos.current.y + bounce;

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t) * 0.5;
      rightLegRef.current.rotation.x = -Math.sin(t) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Hoodie Head (with cowl) */}
      <mesh position={[0, 1.46, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={hoodieColor} roughness={0.7} />
      </mesh>

      {/* Face Inset (kid-friendly cartoon skin + sunglasses/shades) */}
      <mesh position={[0, 1.44, 0.14]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
      </mesh>
      {/* Cool sunglasses (sneaky look, not scary) */}
      <mesh position={[0, 1.47, 0.22]}>
        <boxGeometry args={[0.2, 0.06, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Hoodie Torso */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.48, 0.56, 0.32]} />
        <meshStandardMaterial color={hoodieColor} roughness={0.7} />
      </mesh>

      {/* Front Kangaroo Pocket */}
      <mesh position={[0, 0.88, 0.14]}>
        <boxGeometry args={[0.28, 0.16, 0.08]} />
        <meshStandardMaterial color="#263445" roughness={0.7} />
      </mesh>

      {/* Backpack on Back */}
      <mesh position={[0, 1.02, -0.18]} castShadow>
        <boxGeometry args={[0.34, 0.42, 0.16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.32, 0.95, 0]} castShadow>
        <boxGeometry args={[0.14, 0.46, 0.14]} />
        <meshStandardMaterial color={hoodieColor} roughness={0.7} />
      </mesh>

      {/* Right Arm (Holding Laptop if hasLaptop) */}
      <group position={[0.32, 0.95, 0]}>
        <mesh position={[0, -0.05, 0.1]} rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.14, 0.44, 0.14]} />
          <meshStandardMaterial color={hoodieColor} roughness={0.7} />
        </mesh>

        {/* Silver Stolen Laptop */}
        {hasLaptop && (
          <group position={[0.08, -0.15, 0.25]} rotation={[0.2, 0.4, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.04, 0.25]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Glowing Apple/Company Logo */}
            <mesh position={[0, 0.025, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
            </mesh>
          </group>
        )}
      </group>

      {/* Dark Pants */}
      <mesh ref={leftLegRef} position={[-0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.58, 0.2]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.58, 0.2]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>

      {/* Red/White Sneakers */}
      <mesh position={[-0.14, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.19, 0.12, 0.28]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.19, 0.12, 0.28]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.5} />
      </mesh>
    </group>
  );
};
