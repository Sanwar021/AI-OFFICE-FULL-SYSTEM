import React from 'react';
import * as THREE from 'three';

interface LightingProps {
  isEvening: boolean;
}

export const Lighting: React.FC<LightingProps> = ({ isEvening }) => {
  return (
    <>
      {/* 1. Ambient Light */}
      <ambientLight
        color={isEvening ? '#1e293b' : '#f0f4f8'}
        intensity={isEvening ? 0.45 : 0.9}
      />

      {/* 2. Directional Sun Light (Streams from top-right through the curtain wall windows) */}
      <directionalLight
        position={isEvening ? [12, 4, 8] : [12, 11, 4]}
        color={isEvening ? '#fbbf24' : '#fff9ed'}
        intensity={isEvening ? 0.7 : 2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1.0}
        shadow-camera-far={32}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0003}
      />

      {/* 3. Soft Sky Fill */}
      <hemisphereLight
        args={[
          isEvening ? '#312e81' : '#cbe4f9', // Sky color
          isEvening ? '#0f172a' : '#f1f5f9', // Ground bounce
          isEvening ? 0.35 : 0.75,
        ]}
      />

      {/* 4. Sunlight Glow / Wash at top right window header matching reference photo */}
      {!isEvening && (
        <group position={[7.2, 3.4, 2.5]} rotation={[0, -Math.PI / 4, 0]}>
          <mesh>
            <planeGeometry args={[3.2, 2.0]} />
            <meshBasicMaterial
              color="#fffbf0"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {/* 5. Interior Linear Pendant Downward Lights onto Desk Pods */}
      {/* Pod 1 (Foreground) */}
      <spotLight
        position={[0, 2.7, 1.5]}
        target-position={[0, 0.75, 1.5]}
        color={isEvening ? '#fef3c7' : '#ffffff'}
        intensity={isEvening ? 1.8 : 0.9}
        angle={Math.PI / 3}
        penumbra={0.7}
        castShadow={false}
      />

      {/* Pod 2 (Background) */}
      <spotLight
        position={[0, 2.7, -2.5]}
        target-position={[0, 0.75, -2.5]}
        color={isEvening ? '#fef3c7' : '#ffffff'}
        intensity={isEvening ? 1.8 : 0.9}
        angle={Math.PI / 3}
        penumbra={0.7}
        castShadow={false}
      />
    </>
  );
};
