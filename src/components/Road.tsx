import React from 'react';
import { THEME } from '../art/theme';

interface RoadProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  width?: number;
}

export const Road: React.FC<RoadProps> = ({
  position = [0, 0.05, 0],
  rotation = [0, 0, 0],
  length = 14,
  width = 2.8,
}) => {
  const dashCount = Math.floor(length / 1.6);
  const sidewalkWidth = 1.2;

  return (
    <group position={position} rotation={rotation}>
      {/* Asphalt road deck */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, length]} />
        <meshStandardMaterial color={THEME.colors.ground.asphalt} roughness={0.85} />
      </mesh>

      {/* Center dashed dividing lines */}
      {Array.from({ length: dashCount }).map((_, i) => {
        const z = -length / 2 + 1.0 + i * 1.6;
        return (
          <mesh key={i} position={[0, 0.045, z]}>
            <boxGeometry args={[0.16, 0.005, 0.8]} />
            <meshStandardMaterial color={THEME.colors.ground.laneMarking} roughness={0.4} />
          </mesh>
        );
      })}

      {/* Left Curb & Sidewalk with Diamond Paver Texture */}
      <group position={[-width / 2 - sidewalkWidth / 2, 0, 0]}>
        {/* Chamfered Curb */}
        <mesh position={[sidewalkWidth / 2 - 0.08, 0.06, 0]} receiveShadow>
          <boxGeometry args={[0.16, 0.08, length]} />
          <meshStandardMaterial color={THEME.colors.ground.curb} roughness={0.7} />
        </mesh>

        {/* Sidewalk base */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[sidewalkWidth, 0.06, length]} />
          <meshStandardMaterial color={THEME.colors.ground.paverTan} roughness={0.8} />
        </mesh>

        {/* Terracotta Diamond Insets (matching reference image) */}
        {Array.from({ length: Math.floor(length / 0.8) }).map((_, i) => (
          <mesh
            key={`left_tile_${i}`}
            position={[0, 0.085, -length / 2 + 0.5 + i * 0.8]}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
          >
            <planeGeometry args={[0.35, 0.35]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? THEME.colors.ground.paverTerracotta : THEME.colors.ground.paverCream}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Right Curb & Sidewalk with Diamond Paver Texture */}
      <group position={[width / 2 + sidewalkWidth / 2, 0, 0]}>
        {/* Chamfered Curb */}
        <mesh position={[-sidewalkWidth / 2 + 0.08, 0.06, 0]} receiveShadow>
          <boxGeometry args={[0.16, 0.08, length]} />
          <meshStandardMaterial color={THEME.colors.ground.curb} roughness={0.7} />
        </mesh>

        {/* Sidewalk base */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[sidewalkWidth, 0.06, length]} />
          <meshStandardMaterial color={THEME.colors.ground.paverTan} roughness={0.8} />
        </mesh>

        {/* Terracotta Diamond Insets */}
        {Array.from({ length: Math.floor(length / 0.8) }).map((_, i) => (
          <mesh
            key={`right_tile_${i}`}
            position={[0, 0.085, -length / 2 + 0.5 + i * 0.8]}
            rotation={[-Math.PI / 2, 0, Math.PI / 4]}
          >
            <planeGeometry args={[0.35, 0.35]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? THEME.colors.ground.paverTerracotta : THEME.colors.ground.paverCream}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
