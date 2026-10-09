import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

export type RoleType = 'developer' | 'hr' | 'finance' | 'intern';

interface RoleAvatarProps {
  role: RoleType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  targetPosition?: [number, number, number];
  speed?: number;
  scale?: number;
  isWalking?: boolean;
  isStuck?: boolean;
}

export const RoleAvatar: React.FC<RoleAvatarProps> = ({
  role,
  position = [0, 0.4, 0],
  rotation = [0, 0, 0],
  targetPosition,
  speed = 1.0,
  scale = 0.5,
  isWalking = false,
  isStuck = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const floatingIconRef = useRef<THREE.Group>(null);

  const currentPos = useRef(new THREE.Vector3(...position));
  const targetVec = useRef(targetPosition ? new THREE.Vector3(...targetPosition) : null);

  // Color mappings per role
  const roleConfig = {
    developer: {
      torsoColor: '#2563eb', // Royal Blue Hoodie
      pantsColor: '#1e293b', // Dark Denim
      stripeColor: '#38bdf8', // Cyan/Sky Blue
      iconColor: '#38bdf8',
      roleTitle: 'DEV',
    },
    hr: {
      torsoColor: '#db2777', // Magenta / Rose Blazer
      pantsColor: '#334155', // Charcoal Slacks
      stripeColor: '#f472b6', // Pink
      iconColor: '#f472b6',
      roleTitle: 'HR',
    },
    finance: {
      torsoColor: '#059669', // Emerald Green Vest / Suit
      pantsColor: '#0f172a', // Formal Black Slacks
      stripeColor: '#34d399', // Mint / Emerald Green
      iconColor: '#fbbf24', // Golden Coin
      roleTitle: 'FINANCE',
    },
    intern: {
      torsoColor: '#f59e0b', // Amber / Orange T-Shirt
      pantsColor: '#475569', // Khaki / Slate
      stripeColor: '#fcd34d', // Yellow
      iconColor: '#f59e0b',
      roleTitle: 'INTERN',
    },
  }[role];

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 7 * speed;

    // Movement interpolation
    if (targetVec.current && !isStuck) {
      const dist = currentPos.current.distanceTo(targetVec.current);
      if (dist > 0.1) {
        const dir = new THREE.Vector3().subVectors(targetVec.current, currentPos.current).normalize();
        currentPos.current.addScaledVector(dir, delta * speed * 1.5);
        groupRef.current.position.copy(currentPos.current);

        const angle = Math.atan2(dir.x, dir.z);
        groupRef.current.rotation.y = angle;
      }
    } else {
      groupRef.current.position.copy(currentPos.current);
    }

    // Walking animation
    if ((targetVec.current || isWalking) && !isStuck) {
      const bounce = Math.abs(Math.sin(t)) * 0.05;
      groupRef.current.position.y = currentPos.current.y + bounce;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(t) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(t) * 0.45;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(t) * 0.4;
        rightArmRef.current.rotation.x = Math.sin(t) * 0.4;
      }
    }

    // Floating role icon bobbing and rotation
    if (floatingIconRef.current) {
      const iconT = state.clock.getElapsedTime();
      floatingIconRef.current.position.y = 2.1 + Math.sin(iconT * 3) * 0.08;
      floatingIconRef.current.rotation.y = iconT * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.52, -0.04]} castShadow>
        <boxGeometry args={[0.38, 0.18, 0.36]} />
        <meshStandardMaterial
          color={role === 'developer' ? '#1e293b' : role === 'hr' ? '#854d0e' : '#334155'}
          roughness={0.7}
        />
      </mesh>

      {/* Torso with Role Outfit */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.3]} />
        <meshStandardMaterial color={roleConfig.torsoColor} roughness={0.5} />
      </mesh>

      {/* ID Badge Lanyard on Chest */}
      <group position={[0, 0.96, 0.16]}>
        {/* Lanyard Strap */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.22, 0.02]} />
          <meshStandardMaterial color={roleConfig.stripeColor} />
        </mesh>
        {/* ID Badge Plate */}
        <mesh position={[0, -0.04, 0.02]}>
          <boxGeometry args={[0.16, 0.22, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Color Stripe on Badge */}
        <mesh position={[0, 0.05, 0.03]}>
          <boxGeometry args={[0.15, 0.04, 0.01]} />
          <meshStandardMaterial color={roleConfig.stripeColor} />
        </mesh>
      </group>

      {/* Arms */}
      <group position={[-0.32, 1.15, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.14, 0.44, 0.14]} />
          <meshStandardMaterial color={roleConfig.torsoColor} roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.32, 1.15, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.14, 0.44, 0.14]} />
          <meshStandardMaterial color={roleConfig.torsoColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.16, 0.65, 0.18]} />
        <meshStandardMaterial color={roleConfig.pantsColor} roughness={0.7} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.16, 0.65, 0.18]} />
        <meshStandardMaterial color={roleConfig.pantsColor} roughness={0.7} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.14, 0.04, 0.04]}>
        <boxGeometry args={[0.18, 0.1, 0.24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      <mesh position={[0.14, 0.04, 0.04]}>
        <boxGeometry args={[0.18, 0.1, 0.24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* ---------------- FLOATING ROLE ICON ABOVE HEAD ---------------- */}
      <group ref={floatingIconRef} position={[0, 2.1, 0]}>
        {/* Halo Glow Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.03, 12, 24]} />
          <meshBasicMaterial color={roleConfig.iconColor} />
        </mesh>

        {/* 1. Developer = Blue Laptop */}
        {role === 'developer' && (
          <group scale={0.7}>
            {/* Keyboard base */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.42, 0.04, 0.3]} />
              <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Open screen */}
            <mesh position={[0, 0.15, -0.14]} rotation={[-Math.PI / 8, 0, 0]}>
              <boxGeometry args={[0.42, 0.28, 0.03]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            {/* Glowing code screen */}
            <mesh position={[0, 0.15, -0.12]} rotation={[-Math.PI / 8, 0, 0]}>
              <boxGeometry args={[0.38, 0.24, 0.01]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        )}

        {/* 2. HR = Pink Document Folder */}
        {role === 'hr' && (
          <group scale={0.7}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.38, 0.32, 0.08]} />
              <meshStandardMaterial color="#ec4899" roughness={0.3} />
            </mesh>
            {/* Folder tab */}
            <mesh position={[-0.1, 0.26, 0]}>
              <boxGeometry args={[0.14, 0.06, 0.08]} />
              <meshStandardMaterial color="#f472b6" />
            </mesh>
            {/* Document sheet sticking out */}
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[0.32, 0.24, 0.04]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* 3. Finance Manager = Golden Coin */}
        {role === 'finance' && (
          <group scale={0.8}>
            {/* Gold coin disc */}
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Inner embossed rim */}
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.18, 0.02, 12, 24]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} />
            </mesh>
          </group>
        )}

        {/* 4. Intern = Yellow Badge / Note */}
        {role === 'intern' && (
          <group scale={0.7}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.3, 0.38, 0.06]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            {/* Question mark emblem */}
            <mesh position={[0, 0.12, 0.04]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
