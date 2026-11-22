import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useOfficeStore } from '../store/useOfficeStore';

export const WallTaskBoard: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const tasks = useOfficeStore((state) => state.tasks);

  const { ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 576; // 16:9 ratio
    const context = c.getContext('2d')!;
    const tex = new THREE.CanvasTexture(c);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    return { ctx: context, texture: tex };
  }, []);

  useFrame(() => {
    // Render Task Board on canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 576);

    // Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 60);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('🏢 AI OFFICE — REAL-TIME TASK BOARD', 30, 38);

    ctx.fillStyle = '#14b8a6';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText(`● ACTIVE SPRINT (${tasks.length} TASKS)`, 780, 38);

    // 4 Columns: Queued, Running, Approval, Completed
    const columns = [
      { title: 'QUEUED', color: '#64748b', tasks: tasks.filter((t) => t.status === 'queued') },
      { title: 'RUNNING', color: '#0ea5e9', tasks: tasks.filter((t) => t.status === 'running') },
      { title: 'APPROVAL', color: '#a855f7', tasks: tasks.filter((t) => t.status === 'needs_approval') },
      { title: 'COMPLETED', color: '#10b981', tasks: tasks.filter((t) => t.status === 'completed') },
    ];

    const colWidth = 230;
    const startX = 25;
    const gap = 18;

    columns.forEach((col, idx) => {
      const x = startX + idx * (colWidth + gap);

      // Column header
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, 80, colWidth, 40);

      ctx.fillStyle = col.color;
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(`${col.title} (${col.tasks.length})`, x + 16, 105);

      // Column body background
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.fillRect(x, 125, colWidth, 420);

      // Task cards
      let cardY = 135;
      col.tasks.slice(0, 4).forEach((task) => {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(x + 8, cardY, colWidth - 16, 75);

        // Accent strip
        ctx.fillStyle = col.color;
        ctx.fillRect(x + 8, cardY, 4, 75);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        const truncatedTitle = task.title.slice(0, 24);
        ctx.fillText(truncatedTitle, x + 20, cardY + 22);

        // Employee
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillText(`Assigned: ${task.assignedEmployeeId}`, x + 20, cardY + 42);

        // Priority pill
        ctx.fillStyle = task.priority === 'urgent' ? '#ef4444' : '#14b8a6';
        ctx.fillText(task.priority.toUpperCase(), x + 20, cardY + 62);

        cardY += 85;
      });

      if (col.tasks.length === 0) {
        ctx.fillStyle = '#475569';
        ctx.font = 'italic 12px system-ui, sans-serif';
        ctx.fillText('No tasks', x + 85, 200);
      }
    });

    texture.needsUpdate = true;
  });

  return (
    <group position={position}>
      {/* 65" Screen Display */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2.5, 1.4]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
};
