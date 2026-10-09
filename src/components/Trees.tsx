import React from 'react';

interface TreeProps {
  position?: [number, number, number];
  scale?: number;
}

export const Tree: React.FC<TreeProps> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Stone Planter Box */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.4, 1.0]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.9]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.0, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Low-Poly Foliage Spheres */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.65, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} flatShading />
      </mesh>
      <mesh position={[0.2, 1.9, 0.1]} castShadow>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} flatShading />
      </mesh>
      <mesh position={[-0.2, 1.8, -0.1]} castShadow>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} flatShading />
      </mesh>
    </group>
  );
};
