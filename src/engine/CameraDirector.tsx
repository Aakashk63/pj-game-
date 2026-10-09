import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { THEME } from '../art/theme';
import type { CameraTarget } from './types';
import { useGameStore } from '../store/gameStore';

interface CameraDirectorProps {
  shotTarget?: CameraTarget;
  transitionDuration?: number;
}

export const CameraDirector: React.FC<CameraDirectorProps> = ({
  shotTarget = 'wide',
  transitionDuration = THEME.timing.cameraMove,
}) => {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const cameraShake = useGameStore((state) => state.simState.cameraShake);
  const reducedMotion = useGameStore((state) => state.settings.reducedMotion);

  // Resolve target position and lookAt vector
  const resolveTarget = (target: CameraTarget) => {
    if (typeof target === 'string') {
      const preset = THEME.camera.shots[target] || THEME.camera.shots.wide;
      return {
        pos: new THREE.Vector3(...preset.position),
        look: new THREE.Vector3(...preset.target),
        fov: preset.fov,
      };
    } else {
      return {
        pos: new THREE.Vector3(...target.position),
        look: new THREE.Vector3(...target.target),
        fov: target.fov || 38,
      };
    }
  };

  useEffect(() => {
    const { pos, look, fov } = resolveTarget(shotTarget);
    const duration = reducedMotion ? 0.2 : transitionDuration;

    // Animate camera position
    gsap.to(camera.position, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration,
      ease: 'power2.inOut',
    });

    // Animate lookAt vector
    gsap.to(currentLookAt.current, {
      x: look.x,
      y: look.y,
      z: look.z,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(currentLookAt.current);
      },
    });

    // Animate FOV if perspective camera
    if ('fov' in camera) {
      gsap.to(camera, {
        fov,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        },
      });
    }
  }, [shotTarget, camera, transitionDuration, reducedMotion]);

  useFrame(() => {
    // Apply camera shake if active
    if (cameraShake > 0.01) {
      const shakeOffset = new THREE.Vector3(
        (Math.random() - 0.5) * cameraShake * 0.4,
        (Math.random() - 0.5) * cameraShake * 0.4,
        (Math.random() - 0.5) * cameraShake * 0.4
      );
      camera.position.add(shakeOffset);
    }
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
