import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { CameraPreset, Employee } from '../types/office';

interface CameraRigProps {
  preset: CameraPreset;
  selectedEmployee: Employee | null;
}

export const CameraRig: React.FC<CameraRigProps> = ({ preset, selectedEmployee }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Target camera position and look-at point
  const targetCamPos = useRef(new THREE.Vector3(-4.2, 3.1, 6.8));
  const targetLookAt = useRef(new THREE.Vector3(0.8, 0.9, -0.6));

  useEffect(() => {
    if (preset === 'overview') {
      // Perspective matching the reference photograph
      targetCamPos.current.set(-4.2, 3.1, 6.8);
      targetLookAt.current.set(0.8, 0.9, -0.6);
    } else if (preset === 'team') {
      targetCamPos.current.set(-1.2, 2.6, 4.8);
      targetLookAt.current.set(0.2, 0.8, -0.2);
    } else if (preset === 'follow' && selectedEmployee) {
      const [ex, ey, ez] = selectedEmployee.position;
      targetCamPos.current.set(ex - 1.6, ey + 1.4, ez + 1.8);
      targetLookAt.current.set(ex, ey + 0.8, ez);
    }
  }, [preset, selectedEmployee]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Smooth lerp camera position towards target
    const speed = Math.min(delta * 4, 1);
    camera.position.lerp(targetCamPos.current, speed);
    controlsRef.current.target.lerp(targetLookAt.current, speed);
    controlsRef.current.update();
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
