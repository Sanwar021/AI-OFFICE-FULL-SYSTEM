import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createFloorTexture, createCeilingTexture, createExteriorSkylineTexture } from './textures';

interface RoomArchitectureProps {
  isEvening: boolean;
}

export const RoomArchitecture: React.FC<RoomArchitectureProps> = ({ isEvening }) => {
  const floorTexture = useMemo(() => createFloorTexture(), []);
  const ceilingTexture = useMemo(() => createCeilingTexture(), []);
  const exteriorTexture = useMemo(() => createExteriorSkylineTexture(isEvening), [isEvening]);

  // Window mullions (vertical white frames along the right wall)
  const windowSections = useMemo(() => {
    const list = [];
    const startZ = -7;
    const endZ = 7;
    const count = 6;
    const step = (endZ - startZ) / count;
    for (let i = 0; i <= count; i++) {
      list.push(startZ + i * step);
    }
    return list;
  }, []);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.94,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        metalness: 0.1,
        ior: 1.5,
        reflectivity: 0.5,
      }),
    []
  );

  const whiteFrameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.25,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group>
      {/* 1. Floor: Light grey commercial carpet tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 18]} />
        <meshStandardMaterial
          map={floorTexture}
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Ceiling: Acoustic grid with recessed square diffusers */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.8, 0]}>
        <planeGeometry args={[20, 18]} />
        <meshStandardMaterial
          map={ceilingTexture}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Recessed Square Troffer Light Diffusers in Ceiling */}
      {[-4, 0, 4].map((z, zi) =>
        [-3, 1, 5].map((x, xi) => (
          <group key={`${zi}-${xi}`} position={[x, 3.79, z]}>
            {/* White bezel frame */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.1, 1.1]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
            </mesh>
            {/* Luminous frosted diffuser */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <planeGeometry args={[0.95, 0.95]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={isEvening ? 0.3 : 0.8}
              />
            </mesh>
          </group>
        ))
      )}

      {/* 3. Left Wall: Bright white minimalist wall */}
      <mesh position={[-9, 1.9, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 3.8]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>

      {/* White architectural structural columns along left wall */}
      {[-5, 0, 5].map((z, i) => (
        <mesh key={i} position={[-8.8, 1.9, z]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 3.8, 0.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      ))}

      {/* 4. Right Wall: Massive Floor-to-Ceiling Windows */}
      <group position={[7.5, 0, 0]}>
        {/* White window sill ledge matching reference photo */}
        <mesh position={[0, 0.2, 0]} material={whiteFrameMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.4, 16]} />
        </mesh>

        {/* Top window header */}
        <mesh position={[0, 3.7, 0]} material={whiteFrameMaterial}>
          <boxGeometry args={[0.3, 0.2, 16]} />
        </mesh>

        {/* Vertical white structural columns and mullions */}
        {windowSections.map((z, idx) => (
          <group key={idx} position={[0, 2.0, z]}>
            {/* Main white structural frame */}
            <mesh material={whiteFrameMaterial} castShadow receiveShadow>
              <boxGeometry args={[0.18, 3.4, 0.14]} />
            </mesh>
          </group>
        ))}

        {/* Horizontal transom bars */}
        {[1.2, 2.4, 3.4].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} material={whiteFrameMaterial}>
            <boxGeometry args={[0.12, 0.08, 14]} />
          </mesh>
        ))}

        {/* Large Glass Panes */}
        <mesh position={[0, 2.0, 0]} material={glassMaterial}>
          <boxGeometry args={[0.04, 3.2, 14]} />
        </mesh>
      </group>

      {/* 5. Exterior Backdrop: Bright city skyline & adjacent modern glass building facade */}
      <mesh position={[13.5, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[26, 12]} />
        <meshBasicMaterial map={exteriorTexture} />
      </mesh>
    </group>
  );
};
