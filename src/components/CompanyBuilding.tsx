import React from 'react';

interface CompanyBuildingProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const CompanyBuilding: React.FC<CompanyBuildingProps> = ({
  position = [0, 0, -1],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Concrete Foundation Plinth */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.4, 0.2, 5.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      {/* Main Ground Floor Building Mass */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 2.4, 4.8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>

      {/* Second Floor Office Mass */}
      <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 1.8, 4.6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>

      {/* Modern Blue Glass Curtain Bays */}
      <mesh position={[0, 2.4, 2.42]}>
        <planeGeometry args={[5.4, 3.2]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>

      {/* Large Glowing Blue "COMPANY" Sign on Facade */}
      <group position={[0, 4.2, 2.43]}>
        {/* Sign Backplate */}
        <mesh>
          <boxGeometry args={[3.4, 0.6, 0.08]} />
          <meshStandardMaterial color="#1b2a4a" roughness={0.4} />
        </mesh>
        {/* Illuminated Neon Bar */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[3.1, 0.4]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>
        {/* Glow point light */}
        <pointLight position={[0, 0, 0.3]} color="#38bdf8" intensity={1.2} distance={4} />
      </group>

      {/* Double Glass Sliding Entrance Doors */}
      <mesh position={[0, 0.9, 2.44]}>
        <boxGeometry args={[1.8, 1.6, 0.04]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Dark Door Frames */}
      <mesh position={[0, 0.9, 2.45]}>
        <boxGeometry args={[0.06, 1.6, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.7, 2.45]}>
        <boxGeometry args={[1.9, 0.08, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Roof Parapet Cap & HVAC */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <boxGeometry args={[6.0, 0.2, 4.8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[-1.6, 4.7, -0.8]} castShadow>
        <boxGeometry args={[1.4, 0.6, 1.2]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} />
      </mesh>
    </group>
  );
};
