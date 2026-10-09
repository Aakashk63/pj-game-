import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LoadBalancerUnitProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
  routingMode?: 'round_robin' | 'least_conn' | 'ip_hash';
  server1Healthy?: boolean;
  server2Healthy?: boolean;
  onClick?: () => void;
}

export const LoadBalancerUnit: React.FC<LoadBalancerUnitProps> = ({
  position = [0, 0, 3.2],
  scale = 1,
  isActive = true,
  routingMode: _routingMode = 'round_robin',
  server1Healthy = true,
  server2Healthy = true,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const diamondRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const leftArrowRef = useRef<THREE.Mesh>(null);
  const rightArrowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (diamondRef.current) {
      diamondRef.current.rotation.y = t * 1.5;
      diamondRef.current.position.y = 1.35 + Math.sin(t * 3) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.8;
    }

    // Alternating arrow pulses
    if (isActive) {
      const pulseLeft = Math.max(0.2, (Math.sin(t * 4) + 1) / 2);
      const pulseRight = Math.max(0.2, (Math.cos(t * 4) + 1) / 2);

      if (leftArrowRef.current) {
        (leftArrowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          server1Healthy ? 0.3 + pulseLeft * 0.7 : 0.05;
      }
      if (rightArrowRef.current) {
        (rightArrowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          server2Healthy ? 0.3 + pulseRight * 0.7 : 0.05;
      }
    }
  });

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Concrete Pedestal Plinth Base */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.2, 1.35, 0.22, 24]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Glowing Outer Cyan Tech Ring */}
      <mesh ref={ringRef} position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.15, 32]} />
        <meshBasicMaterial
          color={hovered ? '#38bdf8' : '#06b6d4'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Main Server Tower Chassis */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.35}
          metalness={0.65}
        />
      </mesh>

      {/* Glass Top Router Dome */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.42, 0.18, 16]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Floating Holographic Routing Diamond */}
      <mesh ref={diamondRef} position={[0, 1.35, 0]} castShadow>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Left Directional Neon Arrow (Routes to Office 1) */}
      <group position={[-0.48, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={leftArrowRef} castShadow>
          <coneGeometry args={[0.16, 0.35, 12]} />
          <meshStandardMaterial
            color={server1Healthy ? '#10b981' : '#ef4444'}
            emissive={server1Healthy ? '#10b981' : '#ef4444'}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Right Directional Neon Arrow (Routes to Office 2) */}
      <group position={[0.48, 0.75, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh ref={rightArrowRef} castShadow>
          <coneGeometry args={[0.16, 0.35, 12]} />
          <meshStandardMaterial
            color={server2Healthy ? '#10b981' : '#ef4444'}
            emissive={server2Healthy ? '#10b981' : '#ef4444'}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Health Check Status Beacons */}
      {/* Left Beacon (Server A Health) */}
      <group position={[-0.3, 1.15, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color={server1Healthy ? '#10b981' : '#ef4444'}
            emissive={server1Healthy ? '#10b981' : '#ef4444'}
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>

      {/* Right Beacon (Server B Health) */}
      <group position={[0.3, 1.15, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color={server2Healthy ? '#10b981' : '#ef4444'}
            emissive={server2Healthy ? '#10b981' : '#ef4444'}
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>

      {/* Front Label Plate: "LOAD BALANCER" */}
      <mesh position={[0, 0.65, 0.44]}>
        <planeGeometry args={[0.65, 0.16]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
    </group>
  );
};
