import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface RegistrationDeskProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isPrintingCard?: boolean;
  scale?: number;
}

export const RegistrationDesk: React.FC<RegistrationDeskProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isPrintingCard = false,
  scale = 1,
}) => {
  const printerLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!printerLightRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isPrintingCard) {
      printerLightRef.current.intensity = 1.5 + Math.sin(t * 12) * 1.0;
    } else {
      printerLightRef.current.intensity = 0.4;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Wooden / White Curved Reception Counter */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.1, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Countertop Trim */}
      <mesh position={[0, 1.12, 0]} castShadow>
        <boxGeometry args={[2.3, 0.08, 0.9]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Front Signage Panel */}
      <mesh position={[0, 0.7, 0.42]}>
        <boxGeometry args={[1.4, 0.3, 0.02]} />
        <meshStandardMaterial color="#1b2a4a" roughness={0.4} />
      </mesh>
      {/* Front Accent Text Bar */}
      <mesh position={[0, 0.7, 0.435]}>
        <boxGeometry args={[1.1, 0.1, 0.01]} />
        <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={0.6} />
      </mesh>

      {/* Digital Touchscreen Terminal */}
      <group position={[-0.45, 1.35, 0.05]} rotation={[-0.25, 0, 0]}>
        {/* Monitor Screen Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.45, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Glowing Screen Display */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.64, 0.39]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
        {/* Terminal Stand */}
        <mesh position={[0, -0.22, -0.05]} rotation={[0.25, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.22, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* ID Card Thermal Printer Box */}
      <group position={[0.55, 1.25, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.22, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Output Tray Slot */}
        <mesh position={[0, -0.02, 0.21]}>
          <boxGeometry args={[0.28, 0.04, 0.04]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        {/* Status Light */}
        <mesh position={[0.15, 0.08, 0.2]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color={isPrintingCard ? '#10b981' : '#0284c7'}
            emissive={isPrintingCard ? '#10b981' : '#0284c7'}
            emissiveIntensity={1.8}
          />
        </mesh>
        <pointLight
          ref={printerLightRef}
          position={[0, 0.1, 0.25]}
          color={isPrintingCard ? '#10b981' : '#0284c7'}
          intensity={0.6}
          distance={1.5}
        />
      </group>

      {/* Receptionist Character behind the desk */}
      <group position={[0, 0, -0.65]}>
        {/* Head */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={THEME.colors.character.skinTone} roughness={0.6} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.56, -0.04]}>
          <sphereGeometry args={[0.22, 14, 14]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        {/* Torso in professional teal blouse */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.42, 0.52, 0.28]} />
          <meshStandardMaterial color="#0d9488" roughness={0.6} />
        </mesh>
        {/* Receptionist ID Lanyard */}
        <mesh position={[0, 1.15, 0.15]}>
          <boxGeometry args={[0.1, 0.14, 0.01]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
    </group>
  );
};
