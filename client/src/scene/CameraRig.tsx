import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { CameraPreset, Employee } from '../types/office';
import { useOfficeStore } from '../store/useOfficeStore';

interface CameraRigProps {
  preset: CameraPreset;
  selectedEmployee: Employee | null;
}

export const CameraRig: React.FC<CameraRigProps> = ({ preset, selectedEmployee }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const isTourActive = useOfficeStore((state) => state.isTourActive);
  const tourAngle = useRef(0);

  // Target camera position and look-at point
  const targetCamPos = useRef(new THREE.Vector3(-2.8, 2.6, 6.2));
  const targetLookAt = useRef(new THREE.Vector3(0.3, 0.9, -0.6));

  useEffect(() => {
    if (preset === 'overview') {
      // Perspective matching the reference photograph
      targetCamPos.current.set(-2.8, 2.6, 6.2);
      targetLookAt.current.set(0.3, 0.9, -0.6);
    } else if (preset === 'team') {
      targetCamPos.current.set(-0.6, 2.2, 4.4);
      targetLookAt.current.set(0.1, 0.8, -0.1);
    } else if (preset === 'follow' && selectedEmployee) {
      const [ex, ey, ez] = selectedEmployee.position;
      targetCamPos.current.set(ex - 1.4, ey + 1.3, ez + 1.5);
      targetLookAt.current.set(ex, ey + 0.8, ez);
    }
  }, [preset, selectedEmployee]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTourActive) {
      // Smooth cinematic 360-degree orbit around central office
      tourAngle.current += delta * 0.18;
      const radius = 7.5;
      const camY = 3.2 + Math.sin(tourAngle.current * 0.5) * 0.4;
      const camX = Math.sin(tourAngle.current) * radius;
      const camZ = Math.cos(tourAngle.current) * radius;
      camera.position.set(camX, camY, camZ);
      controlsRef.current.target.set(0, 1.0, -0.5);
      controlsRef.current.update();
    } else {
      // Smooth lerp camera position towards target
      const speed = Math.min(delta * 4, 1);
      camera.position.lerp(targetCamPos.current, speed);
      controlsRef.current.target.lerp(targetLookAt.current, speed);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={1.2}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent clipping below floor
      minPolarAngle={0.1}
    />
  );
};
