import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Employee } from '../types/office';
import { createScreenTexture } from './textures';

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
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
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

  // Screen texture dynamically generated for this employee
  const screenTexture = useMemo(
    () => createScreenTexture(employee.name, employee.role, employee.status, employee.monitorContent),
    [employee.name, employee.role, employee.status, employee.monitorContent]
  );

  // Materials
  const suitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: employee.avatarColor,
        roughness: 0.35,
        metalness: 0.15,
      }),
    [employee.avatarColor]
  );

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8d7c4',
        roughness: 0.65,
        metalness: 0.05,
      }),
    []
  );

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: employee.hairColor,
        roughness: 0.7,
        metalness: 0.1,
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
        roughness: 0.2,
      }),
    []
  );

  const shoeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090d16',
        roughness: 0.3,
        metalness: 0.2,
      }),
    []
  );

  const chromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.9,
        roughness: 0.1,
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
      groupRef.current.position.y = 0.05 + Math.sin(t * 2 + seed) * 0.006;

      // Animation: Typing
      if (isTyping) {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.95 + Math.sin(t * 12 + seed) * 0.04;
          leftArmRef.current.rotation.y = 0.2;
          leftArmRef.current.rotation.z = 0.15;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.95 + Math.cos(t * 12 + seed) * 0.04;
          rightArmRef.current.rotation.y = -0.2;
          rightArmRef.current.rotation.z = -0.15;
        }
        if (leftHandRef.current) {
          leftHandRef.current.rotation.x = Math.sin(t * 22 + seed) * 0.12;
        }
        if (rightHandRef.current) {
          rightHandRef.current.rotation.x = Math.cos(t * 22 + seed) * 0.12;
        }
        if (headRef.current) {
          headRef.current.rotation.x = 0.16 + Math.sin(t * 2) * 0.02;
          headRef.current.rotation.y = Math.sin(t * 0.8 + seed) * 0.04;
        }
      }
      // Animation: Thinking
      else if (isThinking) {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.65;
          rightArmRef.current.rotation.y = -0.4;
          rightArmRef.current.rotation.z = -0.3;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.6;
          leftArmRef.current.rotation.z = 0.25;
        }
        if (headRef.current) {
          headRef.current.rotation.y = 0.25 + Math.sin(t * 1.5) * 0.06;
          headRef.current.rotation.x = -0.12;
        }
      }
      // Animation: Idle
      else {
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.55 + Math.sin(t * 1.2 + seed) * 0.02;
          leftArmRef.current.rotation.z = 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.55 + Math.cos(t * 1.2 + seed) * 0.02;
          rightArmRef.current.rotation.z = -0.2;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 0.6 + seed) * 0.1;
          headRef.current.rotation.x = 0.03;
        }
      }
    } else {
      // Walking / Delivering animation
      const walkCycle = Math.sin(t * 7);
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.6;

      if (isDelivering) {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -1.1;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -1.1;
      } else {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * 0.5;
        if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * 0.5;
      }
    }
  });

  return (
    <group>
      {/* 1. Live Desk Monitor with Real-Time Screen Content on Employee's Station */}
      <group position={[deskX, 0.75, deskZ]} rotation={[0, facingRotY, 0]}>
        {/* Leather Blotter Pad */}
        <mesh position={[0, 0.005, 0.1]} receiveShadow>
          <boxGeometry args={[0.84, 0.004, 0.44]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.012, 0.18]} material={chromeMaterial} castShadow>
          <boxGeometry args={[0.42, 0.008, 0.13]} />
        </mesh>
        {/* Mouse */}
        <mesh position={[0.29, 0.014, 0.18]} material={chromeMaterial} castShadow>
          <boxGeometry args={[0.06, 0.012, 0.1]} />
        </mesh>
        {/* Monitor Stand */}
        <mesh position={[0, 0.006, -0.06]} material={chromeMaterial} castShadow>
          <boxGeometry args={[0.18, 0.006, 0.18]} />
        </mesh>
        <mesh position={[0, 0.18, -0.08]} rotation={[-0.1, 0, 0]} material={chromeMaterial} castShadow>
          <boxGeometry args={[0.08, 0.34, 0.014]} />
        </mesh>
        {/* Monitor Housing */}
        <group position={[0, 0.33, -0.07]} rotation={[-0.07, 0, 0]}>
          <mesh material={chromeMaterial} castShadow>
            <boxGeometry args={[0.7, 0.44, 0.018]} />
          </mesh>
          <mesh position={[0, 0, 0.009]}>
            <boxGeometry args={[0.68, 0.42, 0.002]} />
            <meshBasicMaterial color="#080c14" />
          </mesh>
          {/* Live glowing display surface */}
          <mesh position={[0, 0.01, 0.011]}>
            <planeGeometry args={[0.65, 0.38]} />
            <meshBasicMaterial map={screenTexture} />
          </mesh>
          {/* Logo on lower chin */}
          <mesh position={[0, -0.195, 0.01]} material={chromeMaterial}>
            <circleGeometry args={[0.008, 16]} />
          </mesh>
        </group>

        {/* 3D Stack of Completed Deliverable Documents (Shows when working or has completed task) */}
        {(employee.status === 'completed' || employee.status === 'working') && (
          <group position={[-0.48, 0.015, 0.12]} rotation={[0, 0.15, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.22, 0.02, 0.3]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            {/* Top document cover with role signature badge */}
            <mesh position={[0, 0.011, 0]}>
              <planeGeometry args={[0.2, 0.28]} />
              <meshStandardMaterial color={employee.avatarColor} roughness={0.4} />
            </mesh>
            {/* Silver binder clip */}
            <mesh position={[0, 0.016, -0.12]} material={chromeMaterial}>
              <boxGeometry args={[0.04, 0.01, 0.02]} />
            </mesh>
          </group>
        )}
      </group>

      {/* 2. The Seated Animated Stylized Employee */}
      <group ref={groupRef} onClick={onSelect}>
        {/* Floor Selection Glow Ring */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.55, 0.64, 32]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Humanoid Body Group */}
        <group position={[0, 0, 0]}>
          {/* Pelvis / Hips */}
          <mesh position={[0, 0.44, 0]} material={pantsMaterial} castShadow>
            <cylinderGeometry args={[0.16, 0.15, 0.12, 16]} />
          </mesh>

          {/* Seated Legs */}
          {/* Left Leg */}
          <group ref={leftLegRef} position={[-0.11, 0.42, 0]}>
            {/* Thigh */}
            <mesh position={[0, 0, 0.14]} material={pantsMaterial} castShadow>
              <boxGeometry args={[0.11, 0.11, 0.3]} />
            </mesh>
            {/* Shin */}
            <mesh position={[0, -0.2, 0.28]} material={pantsMaterial} castShadow>
              <cylinderGeometry args={[0.045, 0.04, 0.38, 12]} />
            </mesh>
            {/* Oxford Shoe */}
            <mesh position={[0, -0.38, 0.32]} material={shoeMaterial} castShadow>
              <boxGeometry args={[0.1, 0.06, 0.18]} />
            </mesh>
          </group>

          {/* Right Leg */}
          <group ref={rightLegRef} position={[0.11, 0.42, 0]}>
            <mesh position={[0, 0, 0.14]} material={pantsMaterial} castShadow>
              <boxGeometry args={[0.11, 0.11, 0.3]} />
            </mesh>
            <mesh position={[0, -0.2, 0.28]} material={pantsMaterial} castShadow>
              <cylinderGeometry args={[0.045, 0.04, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.38, 0.32]} material={shoeMaterial} castShadow>
              <boxGeometry args={[0.1, 0.06, 0.18]} />
            </mesh>
          </group>

          {/* Torso & Tailored Suit Jacket */}
          <group position={[0, 0.72, 0]}>
            {/* Tapered Blazer Torso */}
            <mesh material={suitMaterial} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.14, 0.44, 16]} />
            </mesh>
            {/* White Shirt Collar V */}
            <mesh position={[0, 0.14, 0.12]} material={whiteShirtMaterial}>
              <boxGeometry args={[0.12, 0.14, 0.02]} />
            </mesh>
            {/* Silk Necktie */}
            <mesh position={[0, 0.04, 0.135]} material={new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.3 })}>
              <boxGeometry args={[0.035, 0.22, 0.008]} />
            </mesh>
          </group>

          {/* Stylized Sculpted Head & Facial Features */}
          <group ref={headRef} position={[0, 1.12, 0]}>
            {/* Neck */}
            <mesh position={[0, -0.12, 0]} material={skinMaterial}>
              <cylinderGeometry args={[0.05, 0.06, 0.1, 12]} />
            </mesh>
            {/* Smooth Rounded Head */}
            <mesh material={skinMaterial} scale={[0.95, 1.15, 1.05]} castShadow>
              <sphereGeometry args={[0.12, 24, 20]} />
            </mesh>

            {/* Stylized Eyes */}
            {/* Left Eye */}
            <group position={[-0.045, 0.02, 0.11]}>
              <mesh>
                <sphereGeometry args={[0.016, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.009, 12, 12]} />
                <meshBasicMaterial color="#1e293b" />
              </mesh>
            </group>
            {/* Right Eye */}
            <group position={[0.045, 0.02, 0.11]}>
              <mesh>
                <sphereGeometry args={[0.016, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <sphereGeometry args={[0.009, 12, 12]} />
                <meshBasicMaterial color="#1e293b" />
              </mesh>
            </group>

            {/* Eyebrows */}
            <mesh position={[-0.045, 0.045, 0.115]} rotation={[0, 0, -0.05]}>
              <boxGeometry args={[0.035, 0.006, 0.005]} />
              <meshBasicMaterial color={employee.hairColor} />
            </mesh>
            <mesh position={[0.045, 0.045, 0.115]} rotation={[0, 0, 0.05]}>
              <boxGeometry args={[0.035, 0.006, 0.005]} />
              <meshBasicMaterial color={employee.hairColor} />
            </mesh>

            {/* Nose Profile */}
            <mesh position={[0, 0.005, 0.13]}>
              <coneGeometry args={[0.012, 0.025, 8]} />
              <meshStandardMaterial color="#f0c2a8" roughness={0.6} />
            </mesh>

            {/* Sculpted Hairstyle */}
            <group position={[0, 0.08, -0.02]}>
              {/* Crown Volume */}
              <mesh material={hairMaterial} scale={[1.05, 0.7, 1.1]} castShadow>
                <sphereGeometry args={[0.13, 20, 16]} />
              </mesh>
              {/* Side Hair */}
              <mesh position={[-0.1, -0.02, 0.02]} material={hairMaterial}>
                <boxGeometry args={[0.04, 0.1, 0.12]} />
              </mesh>
              <mesh position={[0.1, -0.02, 0.02]} material={hairMaterial}>
                <boxGeometry args={[0.04, 0.1, 0.12]} />
              </mesh>
              {/* Back Hair */}
              <mesh position={[0, -0.04, -0.08]} material={hairMaterial}>
                <boxGeometry args={[0.18, 0.12, 0.06]} />
              </mesh>
            </group>

            {/* Designer Glasses Frame (for specific specialists) */}
            {(employee.role === 'GTM Engineer' || employee.role === 'SEO/AEO Specialist') && (
              <group position={[0, 0.02, 0.12]}>
                <mesh material={chromeMaterial}>
                  <torusGeometry args={[0.025, 0.004, 8, 16]} />
                </mesh>
                <mesh position={[-0.045, 0, 0]} material={chromeMaterial}>
                  <torusGeometry args={[0.024, 0.003, 8, 16]} />
                </mesh>
                <mesh position={[0.045, 0, 0]} material={chromeMaterial}>
                  <torusGeometry args={[0.024, 0.003, 8, 16]} />
                </mesh>
                <mesh position={[0, 0, 0]} material={chromeMaterial}>
                  <boxGeometry args={[0.03, 0.004, 0.004]} />
                </mesh>
              </group>
            )}
          </group>

          {/* Articulated Arms & Hands Resting on Desk */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.24, 0.88, 0]}>
            <mesh position={[0, -0.15, 0.06]} rotation={[0.4, 0, 0]} material={suitMaterial} castShadow>
              <cylinderGeometry args={[0.042, 0.036, 0.32, 12]} />
            </mesh>
            {/* Forearm angled forward onto desk */}
            <mesh position={[0, -0.28, 0.22]} rotation={[-0.7, 0, 0]} material={suitMaterial} castShadow>
              <cylinderGeometry args={[0.036, 0.032, 0.28, 12]} />
            </mesh>
            {/* Hand resting on keyboard */}
            <group ref={leftHandRef} position={[0, -0.38, 0.32]}>
              <mesh material={skinMaterial} castShadow>
                <boxGeometry args={[0.06, 0.025, 0.07]} />
              </mesh>
            </group>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.24, 0.88, 0]}>
            <mesh position={[0, -0.15, 0.06]} rotation={[0.4, 0, 0]} material={suitMaterial} castShadow>
              <cylinderGeometry args={[0.042, 0.036, 0.32, 12]} />
            </mesh>
            {/* Forearm angled forward onto desk */}
            <mesh position={[0, -0.28, 0.22]} rotation={[-0.7, 0, 0]} material={suitMaterial} castShadow>
              <cylinderGeometry args={[0.036, 0.032, 0.28, 12]} />
            </mesh>
            {/* Hand resting on mouse/keyboard */}
            <group ref={rightHandRef} position={[0, -0.38, 0.32]}>
              <mesh material={skinMaterial} castShadow>
                <boxGeometry args={[0.06, 0.025, 0.07]} />
              </mesh>
            </group>
          </group>

          {/* Delivering Document in Hands */}
          {isDelivering && (
            <group ref={docRef} position={[0, 0.65, 0.32]} rotation={[-0.3, 0, 0]}>
              <mesh material={new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 })} castShadow>
                <boxGeometry args={[0.24, 0.02, 0.32]} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
