import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useOfficeStore } from '../store/useOfficeStore';

export const WallTaskBoard: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const tasks = useOfficeStore((state) => state.tasks);

  const [board] = useState(() => {
    const c = document.createElement('canvas');
    c.width = 1536;
    c.height = 864; // 16:9 high-DPI
    const context = c.getContext('2d')!;
    const tex = new THREE.CanvasTexture(c);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return { ctx: context, texture: tex };
  });

  useFrame(() => {
    const { ctx, texture } = board;

    // Render Task Board on canvas
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1536, 864);

    // Header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1536, 80);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('🏢 AI OFFICE — REAL-TIME TASK BOARD', 40, 52);

    ctx.fillStyle = '#14b8a6';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(`● ACTIVE SPRINT (${tasks.length} TASKS)`, 1180, 52);

    // 4 Columns: Queued, Running, Approval, Completed
    const columns = [
      { title: 'QUEUED', color: '#94a3b8', tasks: tasks.filter((t) => t.status === 'queued') },
      { title: 'RUNNING', color: '#38bdf8', tasks: tasks.filter((t) => t.status === 'running') },
      { title: 'APPROVAL', color: '#c084fc', tasks: tasks.filter((t) => t.status === 'needs_approval') },
      { title: 'COMPLETED', color: '#34d399', tasks: tasks.filter((t) => t.status === 'completed') },
    ];

    const colWidth = 345;
    const startX = 40;
    const gap = 24;

    columns.forEach((col, idx) => {
      const x = startX + idx * (colWidth + gap);

      // Column header
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, 110, colWidth, 54);

      ctx.fillStyle = col.color;
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText(`${col.title} (${col.tasks.length})`, x + 20, 144);

      // Column body background
      ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.fillRect(x, 175, colWidth, 650);

      // Task cards
      let cardY = 190;
      col.tasks.slice(0, 4).forEach((task) => {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(x + 10, cardY, colWidth - 20, 105);

        // Accent strip
        ctx.fillStyle = col.color;
        ctx.fillRect(x + 10, cardY, 6, 105);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px system-ui, sans-serif';
        const truncatedTitle = task.title.slice(0, 26);
        ctx.fillText(truncatedTitle, x + 26, cardY + 34);

        // Employee
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText(`Specialist: ${task.assignedEmployeeId}`, x + 26, cardY + 64);

        // Priority pill
        ctx.fillStyle = task.priority === 'urgent' ? '#ef4444' : '#14b8a6';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText(`PRIORITY: ${task.priority.toUpperCase()}`, x + 26, cardY + 90);

        cardY += 120;
      });

      if (col.tasks.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 18px system-ui, sans-serif';
        ctx.fillText('No tasks active', x + 110, 290);
      }
    });

    texture.needsUpdate = true;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* 65" Screen Display */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2.5, 1.4]} />
        <meshBasicMaterial map={board.texture} />
      </mesh>
    </group>
  );
};
