import React from 'react';
import { Pedestal } from '../components/Pedestal';
import { Building } from '../components/Building';
import { Packet } from '../components/Packet';
import { BoomBarrier } from '../components/BoomBarrier';
import { Guard } from '../components/Guard';
import { Employee } from '../components/Employee';
import { IntruderCharacter } from '../components/IntruderCharacter';
import { IDCard } from '../components/IDCard';
import { KeyRing } from '../components/KeyRing';
import { RoleAvatar } from '../components/RoleAvatar';
import type { DecisionOption } from '../engine/types';

interface DecisionDioramasProps {
  options: DecisionOption[];
  selectedId: string | null;
  onSelect: (option: DecisionOption) => void;
}

export const DecisionDioramas: React.FC<DecisionDioramasProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  // Compute positions side by side
  const spacing = 4.6;
  const totalWidth = (options.length - 1) * spacing;

  return (
    <group position={[0, 0.4, 2]}>
      {options.map((opt, idx) => {
        const posX = -totalWidth / 2 + idx * spacing;
        const isSelected = selectedId === opt.id;

        return (
          <group key={opt.id} position={[posX, 0, 0]}>
            <Pedestal
              isSelected={isSelected}
              onClick={() => onSelect(opt)}
            >
              {/* Option A: Gate open (No security) */}
              {opt.dioramaType === 'gate_open' && (
                <group scale={0.46} position={[0, 0.1, 0]}>
                  <BoomBarrier position={[0, 0, 0]} isOpen={true} />
                  {/* Intruder walking straight in */}
                  <IntruderCharacter position={[0.6, 0.2, 0.8]} hasLaptop={true} />
                  <Employee position={[-0.8, 0.2, 1.2]} />
                </group>
              )}

              {/* Option B: Ask name only (Anyone can lie) */}
              {opt.dioramaType === 'ask_name' && (
                <group scale={0.46} position={[0, 0.1, 0]}>
                  <Guard position={[-0.6, 0.2, 0]} pose="wave" />
                  <BoomBarrier position={[0.4, 0, 0]} isOpen={true} />
                  {/* Liar slipping past */}
                  <IntruderCharacter position={[0.8, 0.2, 0.6]} hasLaptop={true} />
                </group>
              )}

              {/* Option C: Guard verifies ID with records (Secure Auth) */}
              {opt.dioramaType === 'verify_id' && (
                <group scale={0.46} position={[0, 0.1, 0]}>
                  <Guard position={[-0.7, 0.2, 0]} pose="thumbs_up" />
                  <BoomBarrier position={[0.4, 0, 0]} isOpen={false} />
                  {/* Employee holding verified ID */}
                  <Employee position={[0.2, 0.2, 1.0]} />
                  <IDCard position={[-0.1, 0.9, 0.6]} scale={0.5} isValid={true} />
                </group>
              )}

              {/* Legacy Level 0 Dioramas */}
              {opt.dioramaType === 'scale_up_tall' && (
                <group scale={0.52} position={[0, 0.2, 0]}>
                  <Building
                    floors={3}
                    status={isSelected ? 'stressed' : 'normal'}
                    isWobbling={false}
                  />
                  <Packet
                    startPos={[0, 0.5, 2.5]}
                    endPos={[0, 0.5, 0.8]}
                    speed={2.2}
                    color="#f59e0b"
                  />
                </group>
              )}

              {opt.dioramaType === 'scale_out_multi' && (
                <group scale={0.44} position={[0, 0.2, 0]}>
                  <group position={[-1.4, 0, 0]}>
                    <Building floors={1} status="normal" />
                  </group>
                  <group position={[1.4, 0, 0]}>
                    <Building floors={1} status="normal" />
                  </group>
                  <Packet
                    startPos={[0, 0.5, 2.5]}
                    endPos={[-1.4, 0.5, 0.8]}
                    speed={2.0}
                    color="#10b981"
                  />
                  <Packet
                    startPos={[0, 0.5, 2.5]}
                    endPos={[1.4, 0.5, 0.8]}
                    speed={2.0}
                    color="#10b981"
                  />
                </group>
              )}

              {/* Load Balancer Diorama */}
              {opt.dioramaType === 'load_balancer' && (
                <group scale={0.44} position={[0, 0.2, 0]}>
                  {/* Central Router Hub */}
                  <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.5, 0.6, 0.6, 16]} />
                    <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.95, 0]}>
                    <octahedronGeometry args={[0.2, 0]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
                  </mesh>

                  {/* Left Mini Building */}
                  <group position={[-1.3, 0, 0]}>
                    <Building floors={1} status="normal" />
                  </group>
                  {/* Right Mini Building */}
                  <group position={[1.3, 0, 0]}>
                    <Building floors={1} status="normal" />
                  </group>

                  {/* Alternating Packets */}
                  <Packet startPos={[0, 0.5, 1.8]} endPos={[0, 0.5, 0.3]} speed={2.5} color="#38bdf8" />
                  <Packet startPos={[0, 0.5, 0]} endPos={[-1.3, 0.5, 0.6]} speed={2.2} color="#10b981" />
                  <Packet startPos={[0, 0.5, 0]} endPos={[1.3, 0.5, 0.6]} speed={2.2} color="#10b981" />
                </group>
              )}

              {/* Level 3: In-Memory Redis Cache Diorama */}
              {opt.dioramaType === 'cache_redis' && (
                <group scale={0.48} position={[0, 0.2, 0]}>
                  {/* Glowing Redis In-Memory Storage Cylinder */}
                  <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 1.2, 16]} />
                    <meshStandardMaterial color="#f43f5e" roughness={0.3} metalness={0.6} />
                  </mesh>
                  {/* Glowing RAM Rings */}
                  <mesh position={[0, 0.7, 0]}>
                    <torusGeometry args={[0.9, 0.06, 12, 24]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                  {/* Lightning Fast Packets */}
                  <Packet startPos={[0, 0.7, 2.2]} endPos={[0, 0.7, 0.2]} speed={3.5} color="#10b981" />
                  <Employee position={[0.8, 0.2, 1.2]} scale={0.8} />
                </group>
              )}

              {/* Level 4: Message Queue Buffer Diorama */}
              {opt.dioramaType === 'queue_buffer' && (
                <group scale={0.48} position={[0, 0.2, 0]}>
                  {/* Queue Bay Buffers */}
                  <mesh position={[-0.8, 0.4, 0]}>
                    <boxGeometry args={[0.7, 0.8, 0.7]} />
                    <meshStandardMaterial color="#06b6d4" roughness={0.4} />
                  </mesh>
                  <mesh position={[0.8, 0.4, 0]}>
                    <boxGeometry args={[0.7, 0.8, 0.7]} />
                    <meshStandardMaterial color="#06b6d4" roughness={0.4} />
                  </mesh>
                  {/* Decoupled Packets flowing across */}
                  <Packet startPos={[0, 0.5, 2.0]} endPos={[-0.8, 0.5, 0]} speed={2.6} color="#06b6d4" />
                  <Packet startPos={[-0.8, 0.5, 0]} endPos={[0.8, 0.5, 0]} speed={2.6} color="#10b981" />
                  <Employee position={[0, 0.2, 1.2]} scale={0.8} />
                </group>
              )}

              {/* Level 4: Synchronous Freeze Diorama */}
              {opt.dioramaType === 'sync_block' && (
                <group scale={0.48} position={[0, 0.2, 0]}>
                  <Building floors={2} status="overloaded" isWobbling={true} />
                  <Employee position={[0, 0.2, 1.5]} scale={0.8} isStuck={true} />
                </group>
              )}

              {/* Level 2 Option A: One Master Key for All (Wrong) */}
              {opt.dioramaType === 'master_key' && (
                <group scale={0.5} position={[0, 0.2, 0]}>
                  <KeyRing position={[0, 1.2, 0]} scale={1.2} />
                  <RoleAvatar role="intern" position={[0, 0.1, 0.8]} scale={0.65} />
                  {/* Red warning aura */}
                  <mesh position={[0, 0.05, 0]}>
                    <ringGeometry args={[1.2, 1.35, 24]} />
                    <meshBasicMaterial color="#ef4444" />
                  </mesh>
                </group>
              )}

              {/* Level 2 Option B: Verify Identity Again at Every Door (Wrong) */}
              {opt.dioramaType === 'verify_every_door' && (
                <group scale={0.5} position={[0, 0.2, 0]}>
                  <Guard position={[-0.8, 0.2, 0]} pose="stop" />
                  <RoleAvatar role="developer" position={[0.2, 0.1, 0.6]} scale={0.65} />
                  <RoleAvatar role="hr" position={[1.1, 0.1, 1.2]} scale={0.65} />
                </group>
              )}

              {/* Level 2 Option C: Give Each Role Its Own Permissions (Correct) */}
              {opt.dioramaType === 'role_permissions' && (
                <group scale={0.46} position={[0, 0.2, 0]}>
                  <RoleAvatar role="developer" position={[-1.2, 0.1, 0.4]} scale={0.65} />
                  <RoleAvatar role="hr" position={[0, 0.1, 0.6]} scale={0.65} />
                  <RoleAvatar role="finance" position={[1.2, 0.1, 0.4]} scale={0.65} />
                  {/* Green success aura */}
                  <mesh position={[0, 0.05, 0]}>
                    <ringGeometry args={[1.8, 1.95, 32]} />
                    <meshBasicMaterial color="#10b981" />
                  </mesh>
                </group>
              )}
            </Pedestal>
          </group>
        );
      })}
    </group>
  );
};

