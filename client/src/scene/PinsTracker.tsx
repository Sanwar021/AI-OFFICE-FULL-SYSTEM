import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useOfficeStore } from '../store/useOfficeStore';

export interface PinPosition {
  x: number;
  y: number;
  visible: boolean;
}

interface PinsTrackerProps {
  onUpdatePins: (pins: Record<string, PinPosition>) => void;
}

export const PinsTracker: React.FC<PinsTrackerProps> = ({ onUpdatePins }) => {
  const employees = useOfficeStore((state) => state.employees);
  const tempVec = useRef(new THREE.Vector3());
  const prevPins = useRef<Record<string, PinPosition>>({});

  useFrame(({ camera, size }) => {
    const updated: Record<string, PinPosition> = {};
    let hasChanged = false;

    for (const emp of employees) {
      // Anchor pin directly above employee's desk station
      tempVec.current.set(emp.deskPosition.x, 1.85, emp.deskPosition.z);
      tempVec.current.project(camera);

      const isVisible = tempVec.current.z < 1;
      const x = Math.round(((tempVec.current.x + 1) * size.width) / 2);
      const y = Math.round(((-tempVec.current.y + 1) * size.height) / 2);

      const prev = prevPins.current[emp.id];
      if (!prev || Math.abs(prev.x - x) > 1 || Math.abs(prev.y - y) > 1 || prev.visible !== isVisible) {
        hasChanged = true;
      }

      updated[emp.id] = { x, y, visible: isVisible };
    }

    if (hasChanged) {
      prevPins.current = updated;
      onUpdatePins(updated);
    }
  });

  return null;
};
