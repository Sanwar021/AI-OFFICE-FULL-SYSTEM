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
  const zoomDelta = useOfficeStore((state) => state.zoomDelta);
  const prevZoomDelta = useRef(0);
  const tourAngle = useRef(0);

  // Target camera position and look-at point - Elevated perspective matching Figma design
  const targetCamPos = useRef(new THREE.Vector3(-2.4, 4.8, 8.2));
  const targetLookAt = useRef(new THREE.Vector3(0.0, 0.5, 0.8));

  // Handle Zoom In / Zoom Out smoothly
  useEffect(() => {
    if (zoomDelta !== prevZoomDelta.current) {
      const diff = zoomDelta - prevZoomDelta.current;
      prevZoomDelta.current = zoomDelta;
      const dir = new THREE.Vector3().subVectors(targetCamPos.current, targetLookAt.current);
      if (diff > 0) {
        if (dir.length() > 2.5) {
          dir.multiplyScalar(0.8);
          targetCamPos.current.copy(targetLookAt.current).add(dir);
        }
      } else {
        if (dir.length() < 14) {
          dir.multiplyScalar(1.25);
          targetCamPos.current.copy(targetLookAt.current).add(dir);
        }
      }
    }
  }, [zoomDelta]);

  useEffect(() => {
    if (preset === 'overview') {
      // Elevated overview perspective showing full office and all 8 specialists
      targetCamPos.current.set(-2.4, 4.8, 8.2);
      targetLookAt.current.set(0.0, 0.5, 0.8);
    } else if (preset === 'team') {
      targetCamPos.current.set(-0.8, 3.2, 5.8);
      targetLookAt.current.set(0.0, 0.7, 0.5);
    } else if (preset === 'follow' && selectedEmployee) {
      const [ex, ey, ez] = selectedEmployee.position;
      targetCamPos.current.set(ex - 1.4, ey + 1.5, ez + 1.8);
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
