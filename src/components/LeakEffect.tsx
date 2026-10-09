import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LeakEffectProps {
  position?: [number, number, number];
  isActive?: boolean;
}

export const LeakEffect: React.FC<LeakEffectProps> = ({
  position = [2.8, 1.2, -0.4],
  isActive = true,
}) => {
  const papersGroupRef = useRef<THREE.Group>(null);

  // Generate 8 paper sheets flying along trajectory
  const papers = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      offset: i * 0.18,
      speed: 0.8 + (i % 3) * 0.2,
      rotationSpeed: 2 + (i % 4),
    }));
  }, []);

  useFrame((state) => {
    if (!papersGroupRef.current || !isActive) return;
    const t = state.clock.getElapsedTime();

    papersGroupRef.current.children.forEach((child, idx) => {
      const p = papers[idx];
      if (!p) return;
      const progress = ((t * p.speed + p.offset) % 1.6) / 1.6;

      // Curved trajectory from desk window (x: 0, y: 0, z: 0) to outside (x: 3.5, y: -0.4, z: -2.5)
      child.position.x = progress * 4.2;
      child.position.y = Math.sin(progress * Math.PI) * 1.2 - progress * 0.6;
      child.position.z = -progress * 3.2;

      child.rotation.x = t * p.rotationSpeed;
      child.rotation.y = t * p.rotationSpeed * 0.7;
    });
  });

  if (!isActive) return null;

  return (
    <group position={position}>
      {/* Flying Paper Sheets */}
      <group ref={papersGroupRef}>
        {papers.map((p) => (
          <mesh key={p.id}>
            <boxGeometry args={[0.22, 0.005, 0.3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Outside Shady Figure Waiting Behind Window */}
      <group position={[4.2, -0.2, -3.2]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Silhouette Head */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Dark Trenchcoat */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.5, 0.9, 0.35]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
        {/* Briefcase */}
        <mesh position={[0.35, 0.45, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.38]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* Flashing Red Alarm Light */}
      <pointLight
        position={[0, 1.2, 0]}
        color="#ef4444"
        intensity={2.0}
        distance={4.5}
      />
    </group>
  );
};
