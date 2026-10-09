import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

export type GuardPose = 'idle' | 'wave' | 'stop' | 'thumbs_up';

interface GuardProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  pose?: GuardPose;
  scale?: number;
}

export const Guard: React.FC<GuardProps> = ({
  position = [0, 0.4, 0],
  rotation = [0, 0, 0],
  pose = 'idle',
  scale = 0.52,
}) => {
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);

  const navyUniform = THEME.colors.character.guardNavy || '#1b2a4a';
  const navyDark = THEME.colors.character.guardNavyDark || '#111d33';
  const goldAccent = THEME.colors.character.guardGold || '#f1c40f';
  const mustacheColor = THEME.colors.character.guardMustache || '#2c3e50';

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Head subtle scanning
    if (headRef.current) {
      if (pose === 'idle') {
        headRef.current.rotation.y = Math.sin(t * 1.6) * 0.35;
      } else {
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, delta * 8);
      }
    }

    // Arm Poses
    if (rightArmRef.current && leftArmRef.current) {
      if (pose === 'wave') {
        // Waving right hand
        rightArmRef.current.rotation.x = -Math.PI / 2.2;
        rightArmRef.current.rotation.z = Math.sin(t * 8) * 0.4 - 0.4;
        leftArmRef.current.rotation.x = 0.2;
        leftArmRef.current.rotation.z = 0.1;
      } else if (pose === 'stop') {
        // Hold up hand in "STOP" gesture
        rightArmRef.current.rotation.x = -Math.PI / 2;
        rightArmRef.current.rotation.y = 0;
        rightArmRef.current.rotation.z = 0;
        leftArmRef.current.rotation.x = 0.2;
        leftArmRef.current.rotation.z = 0.1;
      } else if (pose === 'thumbs_up') {
        // Thumbs up gesture
        rightArmRef.current.rotation.x = -Math.PI / 2.6;
        rightArmRef.current.rotation.y = -0.3;
        rightArmRef.current.rotation.z = 0.2;
        leftArmRef.current.rotation.x = 0.2;
        leftArmRef.current.rotation.z = 0.1;
      } else {
        // Idle breathing arms
        const breath = Math.sin(t * 2) * 0.05;
        rightArmRef.current.rotation.x = 0.2 + breath;
        rightArmRef.current.rotation.z = 0.1;
        leftArmRef.current.rotation.x = 0.2 + breath;
        leftArmRef.current.rotation.z = -0.1;
      }
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.45, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.22, 18, 18]} />
          <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
        </mesh>

        {/* Eyes (friendly cartoon) */}
        {[-0.07, 0.07].map((ex, i) => (
          <mesh key={i} position={[ex, 0.04, 0.19]}>
            <sphereGeometry args={[0.025, 10, 10]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} />
          </mesh>
        ))}

        {/* Friendly Mustache */}
        <mesh position={[0, -0.04, 0.2]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.05, 0.04]} />
          <meshStandardMaterial color={mustacheColor} roughness={0.8} />
        </mesh>

        {/* Peaked Guard Cap */}
        <mesh position={[0, 0.14, 0.02]} castShadow>
          <cylinderGeometry args={[0.26, 0.24, 0.14, 20]} />
          <meshStandardMaterial color={navyDark} roughness={0.5} />
        </mesh>
        {/* Cap Visor / Brim */}
        <mesh position={[0, 0.11, 0.18]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.16]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Gold Cap Badge */}
        <mesh position={[0, 0.16, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
          <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Torso in Navy Uniform */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.5, 0.58, 0.32]} />
        <meshStandardMaterial color={navyUniform} roughness={0.6} />
      </mesh>

      {/* Gold Security Chest Badge */}
      <mesh position={[0.13, 1.06, 0.17]}>
        <boxGeometry args={[0.09, 0.09, 0.02]} />
        <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* White Shirt Collar & Tie */}
      <mesh position={[0, 1.18, 0.16]}>
        <boxGeometry args={[0.14, 0.12, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.05, 0.17]}>
        <boxGeometry args={[0.05, 0.18, 0.02]} />
        <meshStandardMaterial color="#020617" roughness={0.5} />
      </mesh>

      {/* Left Arm Group */}
      <group ref={leftArmRef} position={[-0.34, 1.15, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.15, 0.48, 0.15]} />
          <meshStandardMaterial color={navyUniform} roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm Group */}
      <group ref={rightArmRef} position={[0.34, 1.15, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.15, 0.48, 0.15]} />
          <meshStandardMaterial color={navyUniform} roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
        </mesh>
        {/* Palm / Hand signal during "stop" */}
        {pose === 'stop' && (
          <mesh position={[0, -0.52, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.16, 0.03, 0.16]} />
            <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
          </mesh>
        )}
        {/* Thumbs up indicator */}
        {pose === 'thumbs_up' && (
          <mesh position={[0, -0.42, 0.06]}>
            <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
            <meshStandardMaterial color={THEME.colors.character.skinTone} />
          </mesh>
        )}
      </group>

      {/* Belt with Gold Buckle & Radio */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <boxGeometry args={[0.44, 0.1, 0.3]} />
        <meshStandardMaterial color="#020617" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.68, 0.16]}>
        <boxGeometry args={[0.1, 0.08, 0.02]} />
        <meshStandardMaterial color={goldAccent} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Walkie-talkie Radio on Belt */}
      <mesh position={[-0.2, 0.74, 0.1]}>
        <boxGeometry args={[0.07, 0.14, 0.07]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>

      {/* Trousers */}
      <mesh position={[-0.14, 0.34, 0]} castShadow>
        <boxGeometry args={[0.19, 0.6, 0.22]} />
        <meshStandardMaterial color={navyDark} roughness={0.7} />
      </mesh>
      <mesh position={[0.14, 0.34, 0]} castShadow>
        <boxGeometry args={[0.19, 0.6, 0.22]} />
        <meshStandardMaterial color={navyDark} roughness={0.7} />
      </mesh>

      {/* Polished Black Boots */}
      <mesh position={[-0.14, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.2, 0.13, 0.28]} />
        <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.06, 0.04]} castShadow>
        <boxGeometry args={[0.2, 0.13, 0.28]} />
        <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
};
