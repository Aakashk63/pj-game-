import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME } from '../art/theme';

interface BuildingProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  floors?: number;
  status?: 'normal' | 'stressed' | 'overloaded' | 'healthy_split';
  isWobbling?: boolean;
  scale?: number;
  highlighted?: boolean;
  onClick?: () => void;
  buildingName?: string;
}

export const Building: React.FC<BuildingProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floors = 1,
  status = 'normal',
  isWobbling = false,
  scale = 1,
  highlighted = false,
  onClick,
  buildingName,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const floorHeight = THEME.metrics.floorHeight;
  const buildingWidth = THEME.metrics.buildingFootprint;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Overload failure wobbling
    if (status === 'overloaded' || isWobbling) {
      const wobbleX = Math.sin(t * 18) * 0.05 * Math.min(floors, 3);
      const wobbleZ = Math.cos(t * 15) * 0.04 * Math.min(floors, 3);
      groupRef.current.rotation.x = rotation[0] + wobbleX;
      groupRef.current.rotation.z = rotation[2] + wobbleZ;
    } else {
      // Gentle subtle breathing
      groupRef.current.rotation.x = rotation[0];
      groupRef.current.rotation.z = rotation[2];
    }
  });

  const getWindowColor = () => {
    if (status === 'overloaded') return THEME.colors.building.glassFailure;
    if (status === 'stressed') return THEME.colors.status.warning;
    return THEME.colors.building.glassReflective;
  };

  const windowColor = getWindowColor();

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Foundation plinth / street curb contact */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[buildingWidth + 0.3, 0.2, buildingWidth + 0.3]} />
        <meshStandardMaterial color={THEME.colors.ground.curb} roughness={0.8} />
      </mesh>

      {/* Ground Floor (Lobby with glass doors & entrance canopy) */}
      <group position={[0, 0.2, 0]}>
        {/* Main masonry core */}
        <mesh position={[0, floorHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[buildingWidth, floorHeight, buildingWidth]} />
          <meshStandardMaterial
            color={THEME.colors.building.brickPrimary}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Foundation stone corners / columns */}
        {[-1, 1].map((cx) =>
          [-1, 1].map((cz) => (
            <mesh
              key={`${cx}_${cz}`}
              position={[cx * (buildingWidth / 2 - 0.1), floorHeight / 2, cz * (buildingWidth / 2 - 0.1)]}
              castShadow
            >
              <boxGeometry args={[0.3, floorHeight + 0.02, 0.3]} />
              <meshStandardMaterial color={THEME.colors.building.brickDark} roughness={0.8} />
            </mesh>
          ))
        )}

        {/* Entrance Doorway recessed frame */}
        <mesh position={[0, 0.6, buildingWidth / 2 + 0.02]} castShadow>
          <boxGeometry args={[0.9, 1.1, 0.1]} />
          <meshStandardMaterial color={THEME.colors.building.doorway} roughness={0.5} />
        </mesh>

        {/* Glass Entrance Doors */}
        <mesh position={[0, 0.58, buildingWidth / 2 + 0.05]}>
          <boxGeometry args={[0.75, 0.95, 0.05]} />
          <meshStandardMaterial
            color={windowColor}
            emissive={status === 'overloaded' ? THEME.colors.status.critical : '#0284c7'}
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Overhanging entrance canopy */}
        <mesh position={[0, 1.15, buildingWidth / 2 + 0.3]} castShadow>
          <boxGeometry args={[1.3, 0.1, 0.6]} />
          <meshStandardMaterial color={THEME.colors.building.roofMetal} roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Amber illuminated storefront signage bar */}
        <mesh position={[0, 1.25, buildingWidth / 2 + 0.03]}>
          <boxGeometry args={[1.6, 0.2, 0.05]} />
          <meshStandardMaterial
            color={THEME.colors.building.storefrontSign}
            emissive={THEME.colors.building.storefrontSign}
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Upper Floors (Modular stacked bays) */}
      {Array.from({ length: Math.max(0, floors - 1) }).map((_, fIndex) => {
        const floorY = 0.2 + floorHeight + fIndex * floorHeight;
        return (
          <group key={`floor_${fIndex}`} position={[0, floorY, 0]}>
            {/* Floor masonry block */}
            <mesh position={[0, floorHeight / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[buildingWidth - 0.05, floorHeight, buildingWidth - 0.05]} />
              <meshStandardMaterial
                color={fIndex % 2 === 0 ? THEME.colors.building.brickPrimary : '#7b5e54'}
                roughness={0.7}
              />
            </mesh>

            {/* Horizontal architectural floor divider trim */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[buildingWidth + 0.1, 0.1, buildingWidth + 0.1]} />
              <meshStandardMaterial color={THEME.colors.building.concreteSand} roughness={0.7} />
            </mesh>

            {/* Front & Back Window bays */}
            {[-1, 1].map((faceZ) => (
              <group key={`fb_${faceZ}`} position={[0, floorHeight / 2, faceZ * (buildingWidth / 2 + 0.01)]}>
                {[-0.65, 0.65].map((wx, i) => (
                  <mesh key={i} position={[wx, 0, 0]}>
                    <boxGeometry args={[0.7, 0.8, 0.05]} />
                    <meshStandardMaterial
                      color={windowColor}
                      emissive={status === 'overloaded' ? THEME.colors.status.critical : '#0284c7'}
                      emissiveIntensity={status === 'overloaded' ? 1.0 : 0.35}
                      roughness={0.1}
                      metalness={0.7}
                    />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Side Window bays */}
            {[-1, 1].map((faceX) => (
              <group
                key={`side_${faceX}`}
                position={[faceX * (buildingWidth / 2 + 0.01), floorHeight / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
              >
                {[-0.65, 0.65].map((wz, i) => (
                  <mesh key={i} position={[wz, 0, 0]}>
                    <boxGeometry args={[0.7, 0.8, 0.05]} />
                    <meshStandardMaterial
                      color={windowColor}
                      emissive={status === 'overloaded' ? THEME.colors.status.critical : '#0284c7'}
                      emissiveIntensity={status === 'overloaded' ? 1.0 : 0.35}
                      roughness={0.1}
                      metalness={0.7}
                    />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        );
      })}

      {/* Rooftop Parapet and Infrastructure */}
      {(() => {
        const topY = 0.2 + floors * floorHeight;
        return (
          <group position={[0, topY, 0]}>
            {/* Parapet cap */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <boxGeometry args={[buildingWidth + 0.08, 0.2, buildingWidth + 0.08]} />
              <meshStandardMaterial color={THEME.colors.building.roofMetal} roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Gravel roof deck */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[buildingWidth - 0.2, 0.15, buildingWidth - 0.2]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>

            {/* HVAC Chiller Unit */}
            <mesh position={[-0.5, 0.35, -0.4]} castShadow>
              <boxGeometry args={[0.8, 0.5, 0.6]} />
              <meshStandardMaterial color={THEME.colors.building.hvacChiller} roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Antenna Mast with blinking red beacon */}
            <mesh position={[0.6, 0.6, 0.5]} castShadow>
              <cylinderGeometry args={[0.02, 0.04, 1.0, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            <mesh position={[0.6, 1.15, 0.5]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial
                color={status === 'overloaded' ? '#ef4444' : '#f59e0b'}
                emissive={status === 'overloaded' ? '#ef4444' : '#f59e0b'}
                emissiveIntensity={1.8}
              />
            </mesh>
          </group>
        );
      })()}

      {/* Building label tag overhead if provided */}
      {buildingName && (
        <group position={[0, 0.2 + floors * floorHeight + 1.6, 0]}>
          {/* Subtle identification badge */}
        </group>
      )}

      {/* Active highlight glow outline */}
      {highlighted && (
        <mesh position={[0, (0.2 + floors * floorHeight) / 2, 0]}>
          <boxGeometry args={[buildingWidth + 0.4, 0.2 + floors * floorHeight + 0.2, buildingWidth + 0.4]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};
