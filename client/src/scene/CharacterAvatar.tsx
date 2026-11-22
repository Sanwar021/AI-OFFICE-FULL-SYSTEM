import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Employee } from '../types/office';

interface CharacterAvatarProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: () => void;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  employee,
  isSelected,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const docRef = useRef<THREE.Group>(null);

  const isWalking = employee.animationState === 'walking' || employee.animationState === 'delivering';
  const isTyping = employee.animationState === 'typing' || employee.status === 'working';
  const isThinking = employee.animationState === 'thinking' || employee.status === 'thinking';
  const isDelivering = employee.animationState === 'delivering';

  // Base desk seating coordinates
  const deskX = employee.deskPosition.x;
  const deskZ = employee.deskPosition.z;
  const facingRotY = employee.deskPosition.rotationY;

  // Materials
  const suitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: employee.avatarColor,
        roughness: 0.45,
        metalness: 0.1,
      }),
    [employee.avatarColor]
  );

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f6d5ba',
        roughness: 0.7,
      }),
    []
  );

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: employee.hairColor,
        roughness: 0.8,
      }),
    [employee.hairColor]
  );

  const pantsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.6,
      }),
    []
  );

  const whiteShirtMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.25,
      }),
    []
  );

  // Procedural Skeletal Animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const seed = employee.deskIndex * 1.7; // Desynchronize individual employees

    if (!groupRef.current) return;

    if (!isWalking) {
      // Natural seated position in the office chair
      const chairDist = facingRotY === 0 ? 0.68 : -0.68;
      const targetZ = deskZ + chairDist;
      groupRef.current.position.set(deskX, 0.05, targetZ);
      groupRef.current.rotation.y = facingRotY;

      // Subtle breathing torso bob
      groupRef.current.position.y = 0.05 + Math.sin(t * 2 + seed) * 0.008;

      // Animation: Typing
      if (isTyping) {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.15 + Math.sin(t * 14 + seed) * 0.1;
          leftArmRef.current.rotation.z = 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.15 + Math.cos(t * 14 + seed) * 0.1;
          rightArmRef.current.rotation.z = -0.2;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.14 + Math.sin(t * 3) * 0.02;
        }
      }
      // Animation: Thinking
      else if (isThinking) {
        if (rightArmRef.current) {
          // Hand to chin
          rightArmRef.current.rotation.x = -1.8;
          rightArmRef.current.rotation.y = -0.5;
          rightArmRef.current.rotation.z = -0.4;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.8;
          leftArmRef.current.rotation.z = 0.3;
        }
        if (headRef.current) {
          headRef.current.rotation.y = 0.2 + Math.sin(t * 1.5) * 0.08;
          headRef.current.rotation.x = -0.15;
        }
      }
      // Animation: Idle
      else {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.7 + Math.sin(t * 1.5 + seed) * 0.04;
          leftArmRef.current.rotation.z = 0.22;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.7 + Math.cos(t * 1.5 + seed) * 0.04;
          rightArmRef.current.rotation.z = -0.22;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 0.8 + seed) * 0.12;
          headRef.current.rotation.x = 0.04;
        }
      }
    } else {
      // Walking / Delivering animation
      const walkCycle = Math.sin(t * 7);
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.6;

      if (isDelivering) {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -1.2;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -1.2;
      } else {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * 0.5;
        if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef} onClick={onSelect}>
      {/* Interactive Selection Ring on Floor */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.55, 0.64, 32]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 3D Floating Nameplate and Real-time Status Badge */}
      <Html position={[0, 1.82, 0]} center zIndexRange={[100, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md shadow-sm border cursor-pointer transition select-none ${
            isSelected
              ? 'bg-teal-600 text-white border-teal-300 ring-1 ring-teal-400'
              : 'bg-white/95 text-slate-800 border-white/60 hover:bg-white'
          }`}
        >
          {/* Status Dot */}
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              employee.status === 'working'
                ? 'bg-emerald-400 animate-pulse'
                : employee.status === 'thinking'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-slate-400'
            }`}
          />
          <span className="whitespace-nowrap font-bold text-[10px]">{employee.name.split(' ')[0]}</span>
          <span
            className="text-[8px] px-1 py-0.2 rounded-full text-white font-extrabold uppercase"
            style={{ backgroundColor: employee.avatarColor }}
          >
            {employee.role.split(' ')[0]}
          </span>
        </div>
      </Html>

      {/* Humanoid Body */}
      <group position={[0, 0, 0]}>
        {/* Pelvis / Hips */}
        <mesh position={[0, 0.44, 0]} material={pantsMaterial} castShadow>
          <boxGeometry args={[0.3, 0.12, 0.24]} />
        </mesh>

        {/* Natural Seated Legs: Thigh forward, Shin down to floor */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.1, 0.42, 0]}>
          {/* Thigh (extends forward horizontally when seated) */}
          <mesh position={[0, 0, 0.14]} material={pantsMaterial} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.28]} />
          </mesh>
          {/* Shin (drops vertically down towards floor) */}
          <mesh position={[0, -0.2, 0.27]} material={pantsMaterial} castShadow>
            <boxGeometry args={[0.09, 0.38, 0.09]} />
          </mesh>
          {/* Shoe resting on floor */}
          <mesh position={[0, -0.38, 0.32]} material={new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.3 })} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.18]} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.1, 0.42, 0]}>
          <mesh position={[0, 0, 0.14]} material={pantsMaterial} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.28]} />
          </mesh>
          <mesh position={[0, -0.2, 0.27]} material={pantsMaterial} castShadow>
            <boxGeometry args={[0.09, 0.38, 0.09]} />
          </mesh>
          <mesh position={[0, -0.38, 0.32]} material={new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.3 })} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.18]} />
          </mesh>
        </group>

        {/* Torso & Suit Jacket */}
        <group position={[0, 0.72, 0]}>
          {/* Suit Jacket */}
          <mesh material={suitMaterial} castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.42, 0.22]} />
          </mesh>
          {/* White Shirt Collar V */}
          <mesh position={[0, 0.14, 0.112]} material={whiteShirtMaterial}>
            <boxGeometry args={[0.14, 0.14, 0.01]} />
          </mesh>
          {/* Tie */}
          <mesh position={[0, 0.04, 0.118]} material={new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.4 })}>
            <boxGeometry args={[0.04, 0.22, 0.005]} />
          </mesh>
        </group>

        {/* Head & Hair */}
        <group ref={headRef} position={[0, 1.1, 0]}>
          {/* Neck */}
          <mesh position={[0, -0.1, 0]} material={skinMaterial}>
            <cylinderGeometry args={[0.05, 0.06, 0.08, 12]} />
          </mesh>
          {/* Face */}
          <mesh material={skinMaterial} castShadow>
            <boxGeometry args={[0.2, 0.22, 0.2]} />
          </mesh>
          {/* Hair */}
          <mesh position={[0, 0.08, -0.02]} material={hairMaterial} castShadow>
            <boxGeometry args={[0.22, 0.14, 0.22]} />
          </mesh>
          {/* Eyeglasses */}
          <mesh position={[0, 0.02, 0.105]} material={new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.9 })}>
            <boxGeometry args={[0.18, 0.04, 0.01]} />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.22, 0.86, 0]}>
          <mesh position={[0, -0.15, 0]} material={suitMaterial} castShadow>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
          </mesh>
          <mesh position={[0, -0.32, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.22, 0.86, 0]}>
          <mesh position={[0, -0.15, 0]} material={suitMaterial} castShadow>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
          </mesh>
          <mesh position={[0, -0.32, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>
        </group>

        {/* Delivering Document */}
        {isDelivering && (
          <group ref={docRef} position={[0, 0.65, 0.28]} rotation={[-0.3, 0, 0]}>
            <mesh material={new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 })} castShadow>
              <boxGeometry args={[0.24, 0.02, 0.32]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
