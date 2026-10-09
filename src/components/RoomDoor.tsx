import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DoorReader } from './DoorReader';

interface RoomDoorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  roomName: string;
  isLocked?: boolean;
  isOpen?: boolean;
  readerStatus?: 'idle' | 'scanning' | 'granted' | 'denied';
  plaqueColor?: string;
}

export const RoomDoor: React.FC<RoomDoorProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  roomName,
  isLocked = true,
  isOpen = false,
  readerStatus = 'idle',
  plaqueColor = '#38bdf8',
}) => {
  const doorHingeRef = useRef<THREE.Group>(null);
  const targetRotation = isOpen ? -Math.PI / 2 : 0;

  useFrame((_, delta) => {
    if (doorHingeRef.current) {
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetRotation,
        8,
        delta
      );
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Door Frame (Jamb) */}
      {/* Top Header */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[1.5, 0.16, 0.18]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Left Post */}
      <mesh position={[-0.7, 1.1, 0]} castShadow>
        <boxGeometry args={[0.14, 2.2, 0.18]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Right Post */}
      <mesh position={[0.7, 1.1, 0]} castShadow>
        <boxGeometry args={[0.14, 2.2, 0.18]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* ---------------- GLOWING ROOM NAMEPLATE PLAQUE ---------------- */}
      <group position={[0, 2.45, 0.1]}>
        {/* Plaque backplate */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.28, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Glowing border rim */}
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[1.55, 0.24, 0.01]} />
          <meshBasicMaterial color={plaqueColor} />
        </mesh>
        {/* Room Label HTML */}
        <Html
          position={[0, 0, 0.04]}
          transform
          distanceFactor={5.5}
          className="select-none pointer-events-none"
        >
          <div
            style={{ borderColor: plaqueColor }}
            className="px-3 py-0.5 rounded-lg bg-slate-950/95 border text-center shadow-lg whitespace-nowrap"
          >
            <span
              style={{ color: plaqueColor }}
              className="text-[10px] font-black tracking-widest uppercase font-mono block"
            >
              {roomName}
            </span>
          </div>
        </Html>
      </group>

      {/* Lock Status Indicator LED on Top Frame */}
      <mesh position={[0, 2.12, 0.1]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={isLocked ? '#ef4444' : '#10b981'} />
      </mesh>
      <pointLight
        position={[0, 2.12, 0.15]}
        color={isLocked ? '#ef4444' : '#10b981'}
        intensity={0.8}
        distance={1.2}
      />

      {/* ---------------- SWINGING DOOR PANEL (HINGED) ---------------- */}
      <group ref={doorHingeRef} position={[-0.63, 0, 0]}>
        {/* Door Leaf (offset from hinge center) */}
        <mesh position={[0.63, 1.05, 0]} castShadow>
          <boxGeometry args={[1.26, 2.1, 0.08]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* Vision Glass Panel */}
        <mesh position={[0.63, 1.35, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.09]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.45}
          />
        </mesh>

        {/* Door Handle Lever */}
        <mesh position={[1.15, 1.0, 0.06]}>
          <boxGeometry args={[0.16, 0.04, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ---------------- INTEGRATED DOOR READER SCANNER ---------------- */}
      <DoorReader
        position={[0.88, 1.25, 0.04]}
        rotation={[0, 0, 0]}
        status={readerStatus}
      />
    </group>
  );
};
