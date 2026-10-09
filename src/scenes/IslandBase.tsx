import React from 'react';
import { THEME } from '../art/theme';

export const IslandBase: React.FC = () => {
  const radius = THEME.metrics.islandRadius;
  const depth = THEME.metrics.islandDepth;

  return (
    <group position={[0, 0, 0]}>
      {/* Upper Foundation Plateau (Concrete / Ground surface) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius + 0.5, 0.4, 36]} />
        <meshStandardMaterial
          color={THEME.colors.ground.islandTop}
          roughness={0.8}
        />
      </mesh>

      {/* Floating Island Bedrock Substrata (Layered low-poly rock) */}
      <mesh position={[0, -depth / 2 - 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[radius + 0.4, 0.8, depth, 18]} />
        <meshStandardMaterial
          color={THEME.colors.ground.islandBase}
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Central Plaza Stone Paving Slabs */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[9, 0.02, 9]} />
        <meshStandardMaterial
          color={THEME.colors.ground.plaza}
          roughness={0.75}
        />
      </mesh>

      {/* Subtle Plaza Grid Inset Lines */}
      {[-3, -1.5, 0, 1.5, 3].map((pos, i) => (
        <group key={i}>
          <mesh position={[pos, 0.022, 0]}>
            <boxGeometry args={[0.04, 0.005, 9]} />
            <meshStandardMaterial color="#556575" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.022, pos]}>
            <boxGeometry args={[9, 0.005, 0.04]} />
            <meshStandardMaterial color="#556575" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Green Hedge Planters around perimeter */}
      {[-4.6, 4.6].map((x) =>
        [-4.6, 4.6].map((z) => (
          <group key={`planter_${x}_${z}`} position={[x, 0.1, z]}>
            {/* Stone box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.25, 1.2]} />
              <meshStandardMaterial color={THEME.colors.building.brickDark} roughness={0.8} />
            </mesh>
            {/* Manicured hedge cube */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[1.05, 0.35, 1.05]} />
              <meshStandardMaterial color={THEME.colors.ground.grassAccent} roughness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {/* Street Bollards (Pedestrian barrier posts matching reference image) */}
      {[-2.2, -1.1, 1.1, 2.2].map((x, i) => (
        <mesh key={`bollard_${i}`} position={[x, 0.2, 4.2]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.4, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Street Lamp Post */}
      <group position={[-4.0, 0, 3.8]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 2.4, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0.2, 2.35, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.38, 2.45, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fef08a"
            emissiveIntensity={1.5}
          />
        </mesh>
        <pointLight position={[0.38, 2.45, 0]} color="#fef08a" intensity={0.6} distance={4} />
      </group>
    </group>
  );
};
