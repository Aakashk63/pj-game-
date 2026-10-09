import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Confetti3DProps {
  count?: number;
  origin?: [number, number, number];
}

export const Confetti3D: React.FC<Confetti3DProps> = ({
  count = 120,
  origin = [0, 2, 0],
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 4.5;
      return {
        x: origin[0] + Math.cos(angle) * radius,
        y: origin[1] + Math.random() * 6 + 1,
        z: origin[2] + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.2 - Math.random() * 1.8,
        vz: (Math.random() - 0.5) * 1.5,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        vrx: (Math.random() - 0.5) * 8,
        vry: (Math.random() - 0.5) * 8,
        vrz: (Math.random() - 0.5) * 8,
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
        scale: 0.15 + Math.random() * 0.15,
      };
    });
  }, [count, origin]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      p.y += p.vy * delta;
      p.x += p.vx * delta;
      p.z += p.vz * delta;
      p.rx += p.vrx * delta;
      p.ry += p.vry * delta;
      p.rz += p.vrz * delta;

      // Wrap around back up
      if (p.y < 0.2) {
        p.y = origin[1] + 5 + Math.random() * 2;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.set(p.scale, p.scale * 1.6, 0.02);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, p.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};
