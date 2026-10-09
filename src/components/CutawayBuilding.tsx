import React from 'react';
import { RoomDoor } from './RoomDoor';
import { SafeBox } from './SafeBox';
import { SalaryFile } from './SalaryFile';
import { LeakEffect } from './LeakEffect';

export interface DoorRuntimeState {
  isLocked: boolean;
  isOpen: boolean;
  readerStatus: 'idle' | 'scanning' | 'granted' | 'denied';
}

interface CutawayBuildingProps {
  position?: [number, number, number];
  doorStates?: {
    devLab?: DoorRuntimeState;
    hrRoom?: DoorRuntimeState;
    serverRoom?: DoorRuntimeState;
    financeRoom?: DoorRuntimeState;
  };
  isSalaryLeak?: boolean;
  isSalaryFolderAlert?: boolean;
}

export const CutawayBuilding: React.FC<CutawayBuildingProps> = ({
  position = [0, 0, 0],
  doorStates = {},
  isSalaryLeak = false,
  isSalaryFolderAlert = false,
}) => {
  const defaultDoorState: DoorRuntimeState = {
    isLocked: true,
    isOpen: false,
    readerStatus: 'idle',
  };

  const devDoor = doorStates.devLab || defaultDoorState;
  const hrDoor = doorStates.hrRoom || defaultDoorState;
  const serverDoor = doorStates.serverRoom || defaultDoorState;
  const financeDoor = doorStates.financeRoom || defaultDoorState;

  return (
    <group position={position}>
      {/* ---------------- BUILDING FOUNDATION & FLOOR SLAB ---------------- */}
      {/* Concrete foundation slab */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[11.5, 0.3, 7.5]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Corridor Floor (Diamond Pavers / Polished Marble) */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2.8, 7.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* ---------------- EXTERIOR & DIVIDER WALLS ---------------- */}
      {/* Rear Main Exterior Wall */}
      <mesh position={[0, 1.8, -3.65]} castShadow receiveShadow>
        <boxGeometry args={[11.5, 3.6, 0.2]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      {/* Left Exterior Wall */}
      <mesh position={[-5.65, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3.6, 7.5]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      {/* Right Exterior Wall */}
      <mesh position={[5.65, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3.6, 7.5]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Horizontal Divider Walls separating front and back rooms */}
      {/* Left divider (between Dev Lab & Server Room) */}
      <mesh position={[-3.6, 1.5, 0]} castShadow>
        <boxGeometry args={[4.2, 3.0, 0.16]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      {/* Right divider (between HR Room & Finance Room) */}
      <mesh position={[3.6, 1.5, 0]} castShadow>
        <boxGeometry args={[4.2, 3.0, 0.16]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>

      {/* Corridor Longitudinal Walls with Door Openings */}
      {/* Left Corridor Wall segments */}
      <mesh position={[-1.45, 1.5, -3.0]} castShadow>
        <boxGeometry args={[0.16, 3.0, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      <mesh position={[-1.45, 1.5, 0]} castShadow>
        <boxGeometry args={[0.16, 3.0, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      <mesh position={[-1.45, 1.5, 3.0]} castShadow>
        <boxGeometry args={[0.16, 3.0, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>

      {/* Right Corridor Wall segments */}
      <mesh position={[1.45, 1.5, -3.0]} castShadow>
        <boxGeometry args={[0.16, 3.0, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      <mesh position={[1.45, 1.5, 0]} castShadow>
        <boxGeometry args={[0.16, 3.0, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      <mesh position={[1.45, 1.5, 3.0]} castShadow>
        <boxGeometry args={[0.16, 3.0, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>

      {/* ---------------- 4 INTERIOR ROOMS ---------------- */}

      {/* ================= 1. DEV LAB (FRONT LEFT) ================= */}
      <group position={[-3.6, 0, 1.8]}>
        {/* Parquet Floor */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[4.0, 3.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Work Desk */}
        <mesh position={[-0.6, 0.4, 0]} castShadow>
          <boxGeometry args={[1.8, 0.75, 0.8]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Dual Monitors */}
        <mesh position={[-0.8, 0.95, 0.1]} rotation={[0, Math.PI / 12, 0]}>
          <boxGeometry args={[0.45, 0.32, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-0.35, 0.95, -0.05]} rotation={[0, -Math.PI / 16, 0]}>
          <boxGeometry args={[0.45, 0.32, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Office Chair */}
        <mesh position={[-0.6, 0.45, -0.6]} castShadow>
          <boxGeometry args={[0.45, 0.8, 0.45]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Soft Blue Ambient Lab Light */}
        <pointLight position={[0, 2.2, 0]} color="#38bdf8" intensity={0.6} distance={3.5} />
      </group>

      {/* ================= 2. SERVER ROOM (REAR LEFT) ================= */}
      <group position={[-3.6, 0, -1.8]}>
        {/* Antistatic Floor Tiles */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[4.0, 3.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
        {/* Server Rack 1 */}
        <mesh position={[-1.1, 1.1, 0]} castShadow>
          <boxGeometry args={[0.9, 2.2, 0.7]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Server Rack 1 Blinking LEDs */}
        <mesh position={[-1.1, 1.1, 0.36]}>
          <boxGeometry args={[0.75, 1.8, 0.01]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        {/* Server Rack 2 */}
        <mesh position={[0.2, 1.1, 0]} castShadow>
          <boxGeometry args={[0.9, 2.2, 0.7]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Server Rack 2 Blinking LEDs */}
        <mesh position={[0.2, 1.1, 0.36]}>
          <boxGeometry args={[0.75, 1.8, 0.01]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        {/* Cyan Mainframe Light */}
        <pointLight position={[0, 2.2, 0]} color="#06b6d4" intensity={0.7} distance={3.5} />
      </group>

      {/* ================= 3. HR ROOM (FRONT RIGHT) ================= */}
      <group position={[3.6, 0, 1.8]}>
        {/* Warm Carpet Floor */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[4.0, 3.4]} />
          <meshStandardMaterial color="#312e81" roughness={0.6} />
        </mesh>
        {/* Round Meeting Table */}
        <mesh position={[0.4, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.75, 20]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </mesh>
        {/* Filing Cabinets on Wall */}
        <mesh position={[1.4, 0.8, -0.6]} castShadow>
          <boxGeometry args={[0.6, 1.6, 0.8]} />
          <meshStandardMaterial color="#db2777" roughness={0.4} />
        </mesh>
        {/* Soft Pink HR Ambient Light */}
        <pointLight position={[0, 2.2, 0]} color="#f472b6" intensity={0.6} distance={3.5} />
      </group>

      {/* ================= 4. FINANCE RECORDS ROOM (REAR RIGHT) ================= */}
      <group position={[3.6, 0, -1.8]}>
        {/* Executive Hardwood Floor */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[4.0, 3.4]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>

        {/* Executive Mahogany Desk */}
        <mesh position={[0.2, 0.42, 0]} castShadow>
          <boxGeometry args={[1.8, 0.78, 0.9]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Confidential Salary Folder Prop on Desk */}
        <SalaryFile
          position={[0.2, 0.84, 0.05]}
          isAlert={isSalaryFolderAlert}
          isOpen={isSalaryLeak}
        />

        {/* Heavy Steel SafeBox in Corner */}
        <SafeBox
          position={[1.35, 0, -1.0]}
          rotation={[0, -Math.PI / 4, 0]}
          isOpen={isSalaryLeak}
        />

        {/* Window on Exterior Wall */}
        <mesh position={[1.9, 1.6, -1.7]}>
          <boxGeometry args={[1.4, 1.2, 0.05]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.1} transparent opacity={0.4} />
        </mesh>

        {/* LeakEffect Papers flying out window */}
        <LeakEffect
          position={[0.2, 0.85, 0.05]}
          isActive={isSalaryLeak}
        />

        {/* Golden Finance Ambient Light */}
        <pointLight
          position={[0, 2.2, 0]}
          color={isSalaryFolderAlert ? '#ef4444' : '#fbbf24'}
          intensity={0.8}
          distance={3.5}
        />
      </group>

      {/* ---------------- 4 SECURITY ROOM DOORS AT CORRIDOR ---------------- */}
      {/* 1. Dev Lab Door (Facing Corridor at x = -1.45, z = 1.8) */}
      <RoomDoor
        position={[-1.45, 0, 1.8]}
        rotation={[0, Math.PI / 2, 0]}
        roomName="DEV LAB"
        plaqueColor="#38bdf8"
        isLocked={devDoor.isLocked}
        isOpen={devDoor.isOpen}
        readerStatus={devDoor.readerStatus}
      />

      {/* 2. Server Room Door (Facing Corridor at x = -1.45, z = -1.8) */}
      <RoomDoor
        position={[-1.45, 0, -1.8]}
        rotation={[0, Math.PI / 2, 0]}
        roomName="SERVER ROOM"
        plaqueColor="#06b6d4"
        isLocked={serverDoor.isLocked}
        isOpen={serverDoor.isOpen}
        readerStatus={serverDoor.readerStatus}
      />

      {/* 3. HR Room Door (Facing Corridor at x = 1.45, z = 1.8) */}
      <RoomDoor
        position={[1.45, 0, 1.8]}
        rotation={[0, -Math.PI / 2, 0]}
        roomName="HR ROOM"
        plaqueColor="#f472b6"
        isLocked={hrDoor.isLocked}
        isOpen={hrDoor.isOpen}
        readerStatus={hrDoor.readerStatus}
      />

      {/* 4. Finance Records Room Door (Facing Corridor at x = 1.45, z = -1.8) */}
      <RoomDoor
        position={[1.45, 0, -1.8]}
        rotation={[0, -Math.PI / 2, 0]}
        roomName="FINANCE RECORDS ROOM"
        plaqueColor="#10b981"
        isLocked={financeDoor.isLocked}
        isOpen={financeDoor.isOpen}
        readerStatus={financeDoor.readerStatus}
      />
    </group>
  );
};
