import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { RoomArchitecture } from './RoomArchitecture';
import { Lighting } from './Lighting';
import { CameraRig } from './CameraRig';
import { DeskPod, LinearPendantLight, FiddleLeafPlant, CabinetWall } from './OfficeProps';
import { CharacterAvatar } from './CharacterAvatar';
import { WallTaskBoard } from './WallTaskBoard';
import { useOfficeStore } from '../store/useOfficeStore';

export const OfficeScene: React.FC = () => {
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);
  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);
  const employees = useOfficeStore((state) => state.employees);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || null;
  const isEvening = timeOfDay === 'evening';

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      <Canvas
        shadows
        camera={{
          position: [-2.8, 2.6, 6.2],
          fov: 48,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          {/* Architectural lighting */}
          <Lighting isEvening={isEvening} />

          {/* Camera controls & presets */}
          <CameraRig preset={cameraPreset} selectedEmployee={selectedEmployee} />

          {/* Complete Office Architecture (Windows, Skylines, Flooring, Ceiling) */}
          <RoomArchitecture isEvening={isEvening} />

          {/* Pod 1: Desks for Employees 1 to 4 (Foreground) */}
          <DeskPod position={[0, 0, 1.5]} />

          {/* Pod 2: Desks for Employees 5 to 8 (Background) */}
          <DeskPod position={[0, 0, -2.5]} />

          {/* The Eight Animated AI Employees Seated at their Stations */}
          {employees.map((emp) => (
            <CharacterAvatar
              key={emp.id}
              employee={emp}
              isSelected={emp.id === selectedEmployeeId}
              onSelect={() => selectEmployee(emp.id)}
            />
          ))}

          {/* Suspended Minimalist Linear Pendant Lights hanging along desk rows matching reference photo */}
          <LinearPendantLight position={[-0.88, 2.7, -0.5]} length={7.2} orientation="z" />
          <LinearPendantLight position={[0.88, 2.7, -0.5]} length={7.2} orientation="z" />

          {/* Lush Fiddle Leaf Fig trees by window sill matching reference photo */}
          <FiddleLeafPlant position={[6.6, 0, 2.2]} />
          <FiddleLeafPlant position={[6.6, 0, -2.5]} />

          {/* Dark Charcoal Cabinetry Wall along the Left Wall with Shelving matching reference photo */}
          <CabinetWall position={[-4.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

          {/* Interactive 65" Real-Time Task Board on central feature wall */}
          <WallTaskBoard position={[-3.88, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};
