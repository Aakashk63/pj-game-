import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DoorReaderProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  status?: 'idle' | 'scanning' | 'granted' | 'denied';
}

export const DoorReader: React.FC<DoorReaderProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  status = 'idle',
}) => {
  const laserRef = useRef<THREE.Mesh>(null);

  const statusColor = {
    idle: '#38bdf8',
    scanning: '#f59e0b',
    granted: '#10b981',
    denied: '#ef4444',
  }[status];

  useFrame((state) => {
    if (laserRef.current && status === 'scanning') {
      const t = state.clock.getElapsedTime() * 6;
      laserRef.current.position.y = Math.sin(t) * 0.08;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Wall Mounting Plate */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[0.22, 0.34, 0.04]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Reader Bezel */}
      <mesh position={[0, 0, 0.01]} castShadow>
        <boxGeometry args={[0.18, 0.28, 0.03]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* NFC RFID Touch Icon Pad */}
      <mesh position={[0, -0.02, 0.027]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={statusColor} />
      </mesh>

      {/* Status LED Indicator Light */}
      <mesh position={[0, 0.09, 0.027]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={statusColor} />
      </mesh>

      {/* Scanning Laser Beam */}
      {status === 'scanning' && (
        <mesh ref={laserRef} position={[0, 0, 0.035]}>
          <boxGeometry args={[0.14, 0.015, 0.005]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      )}

      {/* Point Light Glow for scanning / granted / denied */}
      {status !== 'idle' && (
        <pointLight
          position={[0, 0, 0.08]}
          color={statusColor}
          intensity={status === 'denied' ? 1.4 : 1.0}
          distance={1.5}
        />
      )}
    </group>
  );
};
