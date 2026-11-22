import React, { useMemo } from 'react';
import * as THREE from 'three';

// Optimized physical materials with realistic metallic & roughness values
const chromeMaterial = new THREE.MeshStandardMaterial({
  color: '#f1f5f9',
  metalness: 0.95,
  roughness: 0.08,
});

const deskTopMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  metalness: 0.02,
  roughness: 0.18,
});

const darkMatMaterial = new THREE.MeshStandardMaterial({
  color: '#181f2a',
  roughness: 0.8,
  metalness: 0.1,
});

const chairMeshMaterial = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  roughness: 0.65,
  metalness: 0.25,
});

const monitorBodyMaterial = new THREE.MeshStandardMaterial({
  color: '#e2e8f0',
  metalness: 0.9,
  roughness: 0.15,
});

// Ergonomic Mesh Swivel Chair matching the reference photo
export const OfficeChair: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-star polished chrome spider base */}
      <group position={[0, 0.05, 0]}>
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 0.3;
          const z = Math.sin(rad) * 0.3;
          return (
            <group key={i}>
              {/* Polished Chrome Spoke */}
              <mesh position={[x / 2, 0.02, z / 2]} rotation={[0, -rad, 0]} material={chromeMaterial} castShadow>
                <boxGeometry args={[0.3, 0.02, 0.03]} />
              </mesh>
              {/* Dual Caster Wheel */}
              <mesh position={[x, -0.015, z]} material={darkMatMaterial} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.025, 16]} />
              </mesh>
            </group>
          );
        })}
        {/* Chrome pneumatic gas-lift cylinder */}
        <mesh position={[0, 0.22, 0]} material={chromeMaterial} castShadow>
          <cylinderGeometry args={[0.024, 0.028, 0.38, 16]} />
        </mesh>
      </group>

      {/* Ergonomic seat cushion */}
      <mesh position={[0, 0.46, 0]} material={chairMeshMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.07, 0.46]} />
      </mesh>

      {/* Contoured mesh backrest with spine curve */}
      <group position={[0, 0.8, -0.2]}>
        {/* Outer curved frame */}
        <mesh material={chairMeshMaterial} castShadow>
          <boxGeometry args={[0.44, 0.6, 0.03]} />
        </mesh>
        {/* Breathable mesh inner panel */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.38, 0.54]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* Chrome lumbar support bar */}
        <mesh position={[0, -0.12, -0.02]} material={chromeMaterial}>
          <boxGeometry args={[0.36, 0.05, 0.025]} />
        </mesh>
      </group>

      {/* Adjustable T-shaped Armrests with chrome struts */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={i} position={[x, 0.6, -0.04]}>
          <mesh material={chromeMaterial} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.22, 12]} />
          </mesh>
          <mesh position={[0, 0.11, 0.04]} material={darkMatMaterial} castShadow>
            <boxGeometry args={[0.065, 0.028, 0.24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Sleek All-in-One Desktop Monitor (Apple Studio Display / iMac style)
export const DesktopMonitor: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  screenTexture?: THREE.Texture | null;
}> = ({ position, rotationY = 0, screenTexture }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Black leather executive desk mat */}
      <mesh position={[0, 0.005, 0.1]} material={darkMatMaterial} receiveShadow>
        <boxGeometry args={[0.82, 0.004, 0.44]} />
      </mesh>

      {/* Slim silver keyboard */}
      <mesh position={[0, 0.012, 0.18]} material={monitorBodyMaterial} castShadow>
        <boxGeometry args={[0.42, 0.008, 0.13]} />
      </mesh>

      {/* Optical mouse */}
      <mesh position={[0.29, 0.014, 0.18]} material={monitorBodyMaterial} castShadow>
        <boxGeometry args={[0.06, 0.012, 0.1]} />
      </mesh>

      {/* Monitor Stand */}
      <group position={[0, 0, -0.06]}>
        {/* Aluminum foot plate */}
        <mesh position={[0, 0.006, 0]} material={chromeMaterial} castShadow>
          <boxGeometry args={[0.18, 0.006, 0.18]} />
        </mesh>
        {/* Angled vertical spine */}
        <mesh position={[0, 0.19, -0.02]} rotation={[-0.1, 0, 0]} material={chromeMaterial} castShadow>
          <boxGeometry args={[0.08, 0.34, 0.014]} />
        </mesh>
      </group>

      {/* Monitor Display Housing (Tilted slightly back) */}
      <group position={[0, 0.33, -0.06]} rotation={[-0.07, 0, 0]}>
        {/* Silver unibody back */}
        <mesh material={monitorBodyMaterial} castShadow>
          <boxGeometry args={[0.7, 0.44, 0.018]} />
        </mesh>
        {/* Slim black bezel */}
        <mesh position={[0, 0, 0.009]}>
          <boxGeometry args={[0.68, 0.42, 0.002]} />
          <meshBasicMaterial color="#080c14" />
        </mesh>
        {/* Screen Glass Surface */}
        <mesh position={[0, 0.01, 0.011]}>
          <planeGeometry args={[0.65, 0.38]} />
          {screenTexture ? (
            <meshBasicMaterial map={screenTexture} />
          ) : (
            <meshStandardMaterial
              color="#0f172a"
              emissive="#1e293b"
              emissiveIntensity={0.5}
              roughness={0.15}
            />
          )}
        </mesh>
        {/* Apple/Premium logo dot on lower chin */}
        <mesh position={[0, -0.195, 0.01]} material={chromeMaterial}>
          <circleGeometry args={[0.008, 16]} />
        </mesh>
      </group>
    </group>
  );
};

// Modern Desk with Splayed Chrome A-frame Legs matching reference photo
export const ModernDesk: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  hasAccessories?: boolean;
}> = ({ position, rotationY = 0, hasAccessories = true }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Tabletop: Pure white beveled surface */}
      <mesh position={[0, 0.73, 0]} material={deskTopMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.035, 0.9]} />
      </mesh>

      {/* Silver cable grommet */}
      <mesh position={[0.65, 0.75, -0.32]} material={chromeMaterial}>
        <cylinderGeometry args={[0.035, 0.035, 0.006, 24]} />
      </mesh>

      {/* Modesty / Cable management tray */}
      <mesh position={[0, 0.65, -0.2]} material={darkMatMaterial}>
        <boxGeometry args={[1.3, 0.12, 0.15]} />
      </mesh>

      {/* Splayed Chrome A-frame Inverted V Legs */}
      {[-0.72, 0.72].map((x, sideIdx) => (
        <group key={sideIdx} position={[x, 0, 0]}>
          {/* Top bracket plate */}
          <mesh position={[0, 0.71, 0]} material={chromeMaterial}>
            <boxGeometry args={[0.05, 0.02, 0.78]} />
          </mesh>
          {/* Front angled leg */}
          <mesh position={[0, 0.35, 0.33]} rotation={[0.18, 0, 0]} material={chromeMaterial} castShadow>
            <cylinderGeometry args={[0.02, 0.018, 0.74, 16]} />
          </mesh>
          {/* Rear angled leg */}
          <mesh position={[0, 0.35, -0.33]} rotation={[-0.18, 0, 0]} material={chromeMaterial} castShadow>
            <cylinderGeometry args={[0.02, 0.018, 0.74, 16]} />
          </mesh>
          {/* Chrome floor glides / leveling feet */}
          <mesh position={[0, 0.01, 0.39]} material={chromeMaterial}>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
          </mesh>
          <mesh position={[0, 0.01, -0.39]} material={chromeMaterial}>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
          </mesh>
        </group>
      ))}

      {/* Accessories */}
      {hasAccessories && (
        <group>
          {/* Ceramic Coffee Mug */}
          <group position={[-0.55, 0.75, 0.22]}>
            <mesh material={new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 })} castShadow>
              <cylinderGeometry args={[0.038, 0.034, 0.085, 20]} />
            </mesh>
            <mesh position={[0, 0.036, 0]}>
              <cylinderGeometry args={[0.033, 0.033, 0.005, 16]} />
              <meshBasicMaterial color="#3e2723" />
            </mesh>
            <mesh position={[-0.045, 0, 0]} material={chromeMaterial}>
              <torusGeometry args={[0.022, 0.006, 8, 16]} />
            </mesh>
          </group>

          {/* Pen cup */}
          <group position={[0.62, 0.75, 0.15]}>
            <mesh material={new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8, roughness: 0.2 })} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.09, 16]} />
            </mesh>
            <mesh position={[-0.01, 0.06, 0.01]} rotation={[0.1, 0.1, 0.1]}>
              <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            <mesh position={[0.01, 0.06, -0.01]} rotation={[-0.1, -0.1, -0.1]}>
              <cylinderGeometry args={[0.004, 0.004, 0.13, 8]} />
              <meshBasicMaterial color="#e11d48" />
            </mesh>
          </group>

          {/* Notebook */}
          <mesh position={[-0.55, 0.755, -0.15]} rotation={[0, 0.1, 0]} material={new THREE.MeshStandardMaterial({ color: '#0f766e', roughness: 0.6 })} castShadow>
            <boxGeometry args={[0.16, 0.015, 0.22]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// 4-Desk Pod (Matching the reference photo island arrangement)
export const DeskPod: React.FC<{
  position: [number, number, number];
}> = ({ position }) => {
  return (
    <group position={position}>
      {/* Central acoustic privacy partition */}
      <mesh position={[0, 0.86, 0]} material={new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.4 })} castShadow>
        <boxGeometry args={[3.45, 0.32, 0.03]} />
      </mesh>

      {/* Desk 1 (Front Left) - Chair facing desk towards -z */}
      <ModernDesk position={[-0.88, 0, 0.48]} />
      <OfficeChair position={[-0.88, 0, 1.08]} rotation={[0, Math.PI, 0]} />

      {/* Desk 2 (Front Right) - Chair facing desk towards -z */}
      <ModernDesk position={[0.88, 0, 0.48]} />
      <OfficeChair position={[0.88, 0, 1.08]} rotation={[0, Math.PI, 0]} />

      {/* Desk 3 (Back Left, facing desk towards +z) */}
      <ModernDesk position={[-0.88, 0, -0.48]} />
      <OfficeChair position={[-0.88, 0, -1.08]} rotation={[0, 0, 0]} />

      {/* Desk 4 (Back Right, facing desk towards +z) */}
      <ModernDesk position={[0.88, 0, -0.48]} />
      <OfficeChair position={[0.88, 0, -1.08]} rotation={[0, 0, 0]} />

      {/* Black Paper Shredder / Waste Bin with silver handle under desk */}
      <group position={[0, 0, 0.38]}>
        <mesh position={[0, 0.22, 0]} material={new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.35 })} castShadow>
          <boxGeometry args={[0.26, 0.44, 0.22]} />
        </mesh>
        <mesh position={[0, 0.33, 0.112]} material={chromeMaterial}>
          <boxGeometry args={[0.1, 0.04, 0.005]} />
        </mesh>
      </group>

      {/* Executive Leather Bag on floor */}
      <mesh position={[0.88, 0.16, -0.05]} material={new THREE.MeshStandardMaterial({ color: '#1a1f2c', roughness: 0.6 })} castShadow>
        <boxGeometry args={[0.38, 0.28, 0.12]} />
      </mesh>
    </group>
  );
};

// Suspended Linear Pendant Light matching reference photo
export const LinearPendantLight: React.FC<{
  position: [number, number, number];
  length?: number;
  orientation?: 'x' | 'z';
}> = ({ position, length = 6.8, orientation = 'z' }) => {
  const isZ = orientation === 'z';
  return (
    <group position={position}>
      {/* Slim white architectural housing */}
      <mesh material={new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 })} castShadow>
        <boxGeometry args={isZ ? [0.12, 0.1, length] : [length, 0.1, 0.12]} />
      </mesh>
      {/* Downward luminous frosted LED diffuser */}
      <mesh position={[0, -0.051, 0]} rotation={isZ ? [Math.PI / 2, 0, 0] : [Math.PI / 2, 0, 0]}>
        <planeGeometry args={isZ ? [0.1, length - 0.04] : [length - 0.04, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Chrome aircraft suspension cables to ceiling */}
      {[-length / 2 + 0.4, 0, length / 2 - 0.4].map((coord, i) => (
        <mesh
          key={i}
          position={isZ ? [0, 0.5, coord] : [coord, 0.5, 0]}
          material={chromeMaterial}
        >
          <cylinderGeometry args={[0.002, 0.002, 1.0, 8]} />
        </mesh>
      ))}
    </group>
  );
};

// Organic Fiddle Leaf Fig Plant with Broad Scalloped Leaves in White Ceramic Pot
export const FiddleLeafPlant: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const leafNodes = useMemo(() => {
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i * 137.5 * Math.PI) / 180;
      const height = 0.5 + (i / count) * 0.95;
      const dist = 0.12 + (i / count) * 0.22;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      list.push({
        pos: [x, height, z] as [number, number, number],
        rot: [0.35 + Math.sin(i * 1.5) * 0.15, angle, 0.1] as [number, number, number],
        scale: 0.3 + (i / count) * 0.16,
      });
    }
    return list;
  }, []);

  return (
    <group position={position}>
      {/* Sleek Tapered Glossy White Ceramic Planter */}
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.22, 0.72, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.06} metalness={0.05} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.69, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
        <meshStandardMaterial color="#2d2319" roughness={0.9} />
      </mesh>

      {/* Plant Trunk */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.038, 0.85, 12]} />
        <meshStandardMaterial color="#4e3b2b" roughness={0.8} />
      </mesh>

      {/* Broad Scalloped Green Leaves */}
      {leafNodes.map((leaf, idx) => (
        <group key={idx} position={leaf.pos} rotation={leaf.rot} scale={leaf.scale}>
          {/* Leaf stalk */}
          <mesh position={[0, 0, 0.1]} rotation={[0.4, 0, 0]} material={new THREE.MeshStandardMaterial({ color: '#2e7d32', roughness: 0.5 })}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
          </mesh>
          {/* Broad Fiddle-shaped leaf blade */}
          <mesh position={[0, 0.05, 0.28]} rotation={[-Math.PI / 4, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.01, 0.65]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#2e7d32' : '#388e3c'}
              roughness={0.3}
              metalness={0.08}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Dark Charcoal Cabinetry Wall with Shelf Lighting, Binders, and Central Task Board
export const CabinetWall: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Dark graphite cabinetry body matching reference photo */}
      <mesh position={[0, 1.9, 0]} receiveShadow>
        <boxGeometry args={[15, 3.8, 0.6]} />
        <meshStandardMaterial color="#22262d" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* Left Shelving */}
      <group position={[-3.2, 1.8, 0.32]}>
        {[0.6, 1.2, 1.8, 2.4].map((y, i) => (
          <group key={i} position={[0, y - 1.2, 0]}>
            <mesh>
              <boxGeometry args={[2.8, 0.04, 0.5]} />
              <meshStandardMaterial color="#181c22" roughness={0.7} />
            </mesh>
            {/* Shelf Under-cabinet Warm LED Accent Light */}
            <mesh position={[0, -0.025, 0]}>
              <planeGeometry args={[2.7, 0.04]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Blue and Black Document Binders */}
        {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((x, i) => (
          <mesh key={i} position={[x, -0.38, 0]} castShadow>
            <boxGeometry args={[0.07, 0.32, 0.28]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#1d4ed8' : i % 3 === 1 ? '#0f172a' : '#f8fafc'}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Right Shelving */}
      <group position={[3.2, 1.8, 0.32]}>
        {[0.6, 1.2, 1.8, 2.4].map((y, i) => (
          <group key={i} position={[0, y - 1.2, 0]}>
            <mesh>
              <boxGeometry args={[2.8, 0.04, 0.5]} />
              <meshStandardMaterial color="#181c22" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.025, 0]}>
              <planeGeometry args={[2.7, 0.04]} />
              <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Books & Decor Ceramic Vase */}
        {[-0.8, -0.4, 0.4, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0.25, 0]} castShadow>
            <boxGeometry args={[0.06, 0.28, 0.24]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#334155' : '#0284c7'} roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.34, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.12} metalness={0.05} />
        </mesh>
      </group>

      {/* Central 65" Wall Display (Office Task Board) */}
      <group position={[0, 2.1, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[2.6, 1.5, 0.05]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.028]}>
          <planeGeometry args={[2.5, 1.4]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#1e293b"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};
