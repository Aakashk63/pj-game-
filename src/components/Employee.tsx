import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface EmployeeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  targetPosition?: [number, number, number];
  speed?: number;
  offsetPhase?: number;
  variant?: 'ulysses' | 'commuter';
  scale?: number;
  isStuck?: boolean;
}

export const Employee: React.FC<EmployeeProps> = ({
  position = [0, 0.4, 0],
  rotation = [0, 0, 0],
  targetPosition,
  speed = 1.0,
  offsetPhase = 0,
  variant = 'commuter',
  scale = 0.5,
  isStuck = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // Position interpolation state
  const currentPos = useRef(new THREE.Vector3(...position));
  const targetVec = useRef(targetPosition ? new THREE.Vector3(...targetPosition) : null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 7 * speed + offsetPhase;

    // Movement towards destination if provided
    if (targetVec.current && !isStuck) {
      const dist = currentPos.current.distanceTo(targetVec.current);
      if (dist > 0.15) {
        const dir = new THREE.Vector3().subVectors(targetVec.current, currentPos.current).normalize();
        currentPos.current.addScaledVector(dir, delta * speed * 1.5);
        groupRef.current.position.copy(currentPos.current);

        // Turn towards movement direction
        const angle = Math.atan2(dir.x, dir.z);
        groupRef.current.rotation.y = angle;
      }
    } else {
      groupRef.current.position.copy(currentPos.current);
    }

    // Walking animation cycle
    if (!isStuck) {
      // Body vertical bounce
      const bounce = Math.abs(Math.sin(t)) * 0.06;
      groupRef.current.position.y = currentPos.current.y + bounce;

      // Leg swings
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(t) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(t) * 0.45;
      }

      // Arm swings
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(t) * 0.4;
        rightArmRef.current.rotation.x = Math.sin(t) * 0.4;
      }
    } else {
      // Anxious waiting / stuck fidgeting
      const fidget = Math.sin(t * 0.4) * 0.05;
      groupRef.current.rotation.y += fidget * 0.02;
    }
  });

  const jacketColor = variant === 'ulysses' 
    ? THEME.colors.character.jacketLeather 
    : '#475569';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
      </mesh>

      {/* Hair / Sunglasses */}
      <mesh position={[0, 1.52, -0.04]} castShadow>
        <boxGeometry args={[0.38, 0.18, 0.36]} />
        <meshStandardMaterial color={THEME.colors.character.hair} roughness={0.7} />
      </mesh>
      {variant === 'ulysses' && (
        <mesh position={[0, 1.46, 0.16]}>
          <boxGeometry args={[0.32, 0.08, 0.1]} />
          <meshStandardMaterial color={THEME.colors.character.sunglasses} roughness={0.1} />
        </mesh>
      )}

      {/* Torso / Jacket */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.3]} />
        <meshStandardMaterial color={jacketColor} roughness={0.6} />
      </mesh>

      {/* Shirt / Chest accent */}
      <mesh position={[0, 0.98, 0.12]}>
        <boxGeometry args={[0.2, 0.42, 0.1]} />
        <meshStandardMaterial color={THEME.colors.character.shirtInner} roughness={0.4} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.32, 1.15, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.14, 0.44, 0.14]} />
          <meshStandardMaterial color={jacketColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.32, 1.15, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.14, 0.44, 0.14]} />
          <meshStandardMaterial color={jacketColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Waist / Belt */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <boxGeometry args={[0.42, 0.1, 0.28]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.58, 0.2]} />
        <meshStandardMaterial color={THEME.colors.character.pantsDenim} roughness={0.8} />
      </mesh>

      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.18, 0.58, 0.2]} />
        <meshStandardMaterial color={THEME.colors.character.pantsDenim} roughness={0.8} />
      </mesh>

      {/* Boots */}
      <mesh position={[-0.14, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.19, 0.12, 0.26]} />
        <meshStandardMaterial color={THEME.colors.character.bootsLeather} roughness={0.7} />
      </mesh>
      <mesh position={[0.14, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.19, 0.12, 0.26]} />
        <meshStandardMaterial color={THEME.colors.character.bootsLeather} roughness={0.7} />
      </mesh>
    </group>
  );
};
