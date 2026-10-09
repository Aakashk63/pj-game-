import React from 'react';
import { Html } from '@react-three/drei';
import { Check, X, Shield, Laptop, Folder, Coins } from 'lucide-react';
import type { RoleType } from './RoleAvatar';

interface PermissionBoardProps {
  role: RoleType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const PermissionBoard: React.FC<PermissionBoardProps> = ({
  role,
  position = [0, 1.8, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) => {
  const data = {
    developer: {
      title: 'DEVELOPER (IT DEPT)',
      badgeColor: '#2563eb',
      icon: Laptop,
      items: [
        { name: 'IT Department', allowed: true },
        { name: 'Development Lab', allowed: true },
        { name: 'Finance Records Room', allowed: false },
      ],
    },
    hr: {
      title: 'HR SPECIALIST (HR DEPT)',
      badgeColor: '#db2777',
      icon: Folder,
      items: [
        { name: 'HR Department', allowed: true },
        { name: 'Employee Records', allowed: true },
        { name: 'Server Room', allowed: false },
      ],
    },
    finance: {
      title: 'FINANCE MANAGER',
      badgeColor: '#059669',
      icon: Coins,
      items: [
        { name: 'Finance Records Room', allowed: true },
        { name: 'Financial Records', allowed: true },
        { name: 'All Employee Data', allowed: true },
      ],
    },
    intern: {
      title: 'INTERN (GENERAL)',
      badgeColor: '#d97706',
      icon: Shield,
      items: [
        { name: 'Open Lounge Area', allowed: true },
        { name: 'Development Lab', allowed: false },
        { name: 'Finance Records Room', allowed: false },
      ],
    },
  }[role];

  const IconComp = data.icon;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 3D Board Backing */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[2.2, 1.8, 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Border Trim */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.24, 1.84, 0.02]} />
        <meshBasicMaterial color={data.badgeColor} />
      </mesh>

      {/* HTML Content Overlay */}
      <Html
        transform
        distanceFactor={4.8}
        position={[0, 0, 0.04]}
        className="select-none pointer-events-none"
      >
        <div className="w-56 p-3 rounded-2xl bg-slate-900/98 border border-slate-700/80 shadow-2xl text-left backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800">
            <div
              style={{ backgroundColor: data.badgeColor }}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
            >
              <IconComp className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white block">
                {data.title}
              </span>
              <span className="text-[8px] text-slate-400 font-semibold">Access Permissions</span>
            </div>
          </div>

          {/* Rows with Check and X marks */}
          <div className="space-y-1.5">
            {data.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-[10px]"
              >
                <span className="font-semibold text-slate-200">{item.name}</span>
                {item.allowed ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span className="text-[8px]">YES</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                    <X className="w-3 h-3 stroke-[3]" />
                    <span className="text-[8px]">NO</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
};
