import React, { useRef, useState } from 'react';
import {
  Building2,
  Maximize2,
  Minimize2,
  Users,
  User,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { OfficeScene } from '../../scene/OfficeScene';
import type { PinPosition } from '../../scene/PinsTracker';
import { useOfficeStore } from '../../store/useOfficeStore';

export const CenterOfficeCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pins, setPins] = useState<Record<string, PinPosition>>({});

  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const zoomIn = useOfficeStore((state) => state.zoomIn);
  const zoomOut = useOfficeStore((state) => state.zoomOut);
  const resetCamera = useOfficeStore((state) => state.resetCamera);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getShortRole = (role: string) => {
    switch (role) {
      case 'GTM Engineer':
        return 'GTM';
      case 'SEO/AEO Specialist':
        return 'SEO';
      case 'Web Development Engineer':
        return 'Web';
      case 'Social Media Manager':
        return 'Social';
      case 'Advertisement Manager':
        return 'Ads';
      case 'Sales Executive':
        return 'Sales';
      case 'Customer Satisfaction Specialist':
        return 'CS';
      default:
        return 'Chief';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden relative bg-slate-900 flex-1 min-h-[440px] flex flex-col ${
        isFullscreen ? 'w-screen h-screen rounded-none' : 'h-full'
      }`}
    >
      {/* 3D Scene Canvas */}
      <div className="absolute inset-0 z-0">
        <OfficeScene onUpdatePins={(updated) => setPins(updated)} />
      </div>

      {/* 3D Floating Nameplate Pins - Exact Figma Replica */}
      {employees.map((emp) => {
        const pin = pins[emp.id];
        if (!pin || !pin.visible) return null;
        const isSelected = emp.id === selectedEmployeeId;
        const firstName = emp.name.split(' ')[0];
        const shortRole = getShortRole(emp.role);

        return (
          <div
            key={emp.id}
            style={{
              position: 'absolute',
              left: `${pin.x}px`,
              top: `${pin.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: isSelected ? 30 : 20,
              pointerEvents: 'auto',
            }}
            onClick={(e) => {
              e.stopPropagation();
              selectEmployee(emp.id);
            }}
            className={`cursor-pointer transition-all duration-150 select-none flex items-center gap-1.5 ${
              isSelected
                ? 'px-3 py-1 bg-[#1E4E38] text-white rounded-full shadow-lg border border-emerald-400/50 scale-105 ring-2 ring-emerald-500/30'
                : 'px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-800 rounded-full shadow-md border border-slate-200/90 hover:bg-white hover:border-slate-300 hover:scale-105'
            }`}
          >
            {/* Live Indicator Dot */}
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                emp.status === 'working' || emp.status === 'writing'
                  ? 'bg-emerald-400 animate-pulse'
                  : emp.status === 'thinking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            {/* Specialist Name & Role */}
            <span className="whitespace-nowrap font-medium text-xs tracking-tight">
              {isSelected ? `${firstName} | ${shortRole}` : firstName}
            </span>
          </div>
        );
      })}

      {/* Top Left Floating Tag: [🏢 Studio headquarters •] */}
      <div className="absolute top-3.5 left-3.5 z-10 pointer-events-auto">
        <button
          onClick={resetCamera}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs text-xs font-semibold text-slate-800 hover:bg-white transition cursor-pointer"
          title="Reset to Studio Headquarters view"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Studio headquarters</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
        </button>
      </div>

      {/* Top Right Floating Button: [⛶ Fullscreen] */}
      <div className="absolute top-3.5 right-3.5 z-10 pointer-events-auto">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs hover:bg-white text-slate-700 hover:text-slate-900 transition cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Center Floating Camera Presets Pill */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md">
          {/* Overview */}
          <button
            onClick={() => setCameraPreset('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              cameraPreset === 'overview'
                ? 'bg-[#EAF3ED] text-[#1E4E38]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          {/* Team View */}
          <button
            onClick={() => setCameraPreset('team')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              cameraPreset === 'team'
                ? 'bg-[#EAF3ED] text-[#1E4E38]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team View</span>
          </button>

          {/* Follow Employee */}
          <button
            onClick={() => {
              if (!selectedEmployeeId && employees.length > 0) {
                selectEmployee(employees[0].id);
              }
              setCameraPreset('follow');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              cameraPreset === 'follow'
                ? 'bg-[#EAF3ED] text-[#1E4E38]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Follow Employee</span>
          </button>
        </div>
      </div>

      {/* Bottom Right Floating Zoom Controls */}
      <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-auto flex flex-col gap-1">
        <div className="flex flex-col items-center p-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md">
          <button
            onClick={zoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="w-3 h-px bg-slate-200 my-0.5" />
          <button
            onClick={resetCamera}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};