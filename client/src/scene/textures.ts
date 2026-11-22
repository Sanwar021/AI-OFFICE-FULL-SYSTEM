import * as THREE from 'three';

// Procedural commercial carpet tile texture with subtle fiber noise and seams
export function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base light grey / subtle warm tone
  ctx.fillStyle = '#dde1e5';
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw 4x4 carpet tiles (256x256 each) with slight tone variance
  const tileSize = 256;
  for (let x = 0; x < 1024; x += tileSize) {
    for (let y = 0; y < 1024; y += tileSize) {
      // Subtle shade variation per tile
      const shade = Math.floor((Math.sin(x * 12.3 + y * 7.7) * 0.5 + 0.5) * 8);
      ctx.fillStyle = `rgb(${218 + shade}, ${222 + shade}, ${226 + shade})`;
      ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

      // Fine seam lines
      ctx.strokeStyle = 'rgba(160, 170, 180, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  // Micro fiber noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 12;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Procedural acoustic ceiling tile grid
export function createCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  // 4x4 ceiling panels
  const tileSize = 128;
  for (let x = 0; x < 512; x += tileSize) {
    for (let y = 0; y < 512; y += tileSize) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tileSize, tileSize);

      // Subtle acoustic specks
      for (let s = 0; s < 30; s++) {
        const sx = x + 10 + Math.random() * (tileSize - 20);
        const sy = y + 10 + Math.random() * (tileSize - 20);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// Procedural exterior view: bright blue sky, adjacent modern glass building facade, and skyline
export function createExteriorSkylineTexture(isEvening: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  if (isEvening) {
    // Dusk / sunset gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(0.8, '#472d42');
    grad.addColorStop(1, '#854d0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1024);
  } else {
    // Crisp sunny daylight gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#78a6d6');
    grad.addColorStop(0.4, '#a2c8ec');
    grad.addColorStop(0.7, '#d6e8fa');
    grad.addColorStop(1, '#eaf2fa');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Warm sun glare upper right
    const sunGrad = ctx.createRadialGradient(1600, 250, 20, 1600, 250, 400);
    sunGrad.addColorStop(0, 'rgba(255, 255, 240, 0.85)');
    sunGrad.addColorStop(0.3, 'rgba(255, 248, 220, 0.4)');
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, 2048, 1024);
  }

  // Draw adjacent glass office building facade matching reference photo
  // The reference photo shows a multi-story glass building across the courtyard
  const facadeWidth = 1400;
  const facadeHeight = 850;
  const facadeX = 200;
  const facadeY = 174;

  // Building silhouette / glass reflection
  ctx.fillStyle = isEvening ? 'rgba(30, 41, 59, 0.95)' : 'rgba(215, 230, 245, 0.85)';
  ctx.fillRect(facadeX, facadeY, facadeWidth, facadeHeight);

  // Glass grid mullions
  const cols = 14;
  const rows = 10;
  const cellW = facadeWidth / cols;
  const cellH = facadeHeight / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const gx = facadeX + c * cellW;
      const gy = facadeY + r * cellH;

      // Window pane glass with subtle sky reflection
      if (isEvening) {
        // Some office windows have warm lights on inside
        const hasLight = (c * 7 + r * 13) % 4 === 0;
        ctx.fillStyle = hasLight ? 'rgba(251, 191, 36, 0.7)' : 'rgba(15, 23, 42, 0.85)';
      } else {
        const tint = ((c + r) % 2 === 0) ? 'rgba(180, 210, 235, 0.5)' : 'rgba(195, 222, 242, 0.55)';
        ctx.fillStyle = tint;
      }
      ctx.fillRect(gx + 3, gy + 3, cellW - 6, cellH - 6);

      // Window frames
      ctx.strokeStyle = isEvening ? '#334155' : '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(gx, gy, cellW, cellH);
    }
  }

  // Distant subtle skyscraper silhouettes on left and right
  ctx.fillStyle = isEvening ? 'rgba(15, 23, 42, 0.7)' : 'rgba(148, 175, 205, 0.45)';
  ctx.fillRect(20, 450, 160, 574);
  ctx.fillRect(1700, 380, 180, 644);
  ctx.fillRect(1900, 480, 120, 544);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural dynamic 3D screen texture for desktop monitors
export function createScreenTexture(
  employeeName: string,
  role: string,
  status: string,
  monitorContent?: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Dark IDE / terminal background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 320);

  // Top window header
  ctx.fillStyle = '#131b2e';
  ctx.fillRect(0, 0, 512, 32);

  // Window dots (red, amber, emerald)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(16, 16, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(32, 16, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(48, 16, 5, 0, Math.PI * 2);
  ctx.fill();

  // Header Title
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`${employeeName.toUpperCase()} — ${role}`, 68, 20);

  // Status Pill in header
  ctx.fillStyle = status === 'working' ? '#10b981' : status === 'thinking' ? '#f59e0b' : '#64748b';
  ctx.beginPath();
  ctx.arc(485, 16, 4, 0, Math.PI * 2);
  ctx.fill();

  if (status === 'working') {
    // Live code / work stream screen
    ctx.fillStyle = '#0d9488';
    ctx.font = '12px monospace';
    ctx.fillText('⚡ GEMINI-3.8-FLASH ENGINE RUNNING', 20, 60);

    // Simulated or real code lines
    const lines = monitorContent
      ? monitorContent.slice(0, 300).split('\n').slice(0, 8)
      : [
          'import { pipeline, streamTask } from "@google/genai";',
          'const context = await retrieveKnowledgeBase();',
          'export async function executeStrategy() {',
          '  const plan = await synthesizeDeliverable({',
          '    targetAudience: "Enterprise B2B",',
          '    compliance: "Verified",',
          '  });',
          '  await save_file("Q1_Strategy.md", plan);',
          '} // 100% tokens parsed',
        ];

    ctx.fillStyle = '#38bdf8';
    lines.forEach((line, i) => {
      ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#a7f3d0';
      ctx.fillText(line, 20, 90 + i * 20);
    });

    // Glowing progress bar at bottom
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 280, 472, 14);
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(20, 280, 360, 14);
  } else if (status === 'thinking') {
    // Neural thinking network
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('🧠 DECONSTRUCTING MULTI-STEP OBJECTIVE...', 20, 70);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px monospace';
    ctx.fillText('> Analyzing constraints & specialist dependencies', 20, 110);
    ctx.fillText('> Calculating parallel execution DAG', 20, 135);
    ctx.fillText('> Formatting structured JSON plan', 20, 160);

    // Glowing amber pulse bar
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(20, 220, 472, 6);
  } else {
    // Sleek idle workspace screen
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('09:41', 200, 120);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px sans-serif';
    ctx.fillText('AI OFFICE • STATION ACTIVE', 165, 150);

    ctx.fillStyle = '#14b8a6';
    ctx.font = '11px monospace';
    ctx.fillText('Ready for assignment via Chief of Staff', 140, 185);

    // Minimalist terminal prompt at bottom
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 230, 472, 50);
    ctx.fillStyle = '#22c55e';
    ctx.font = '12px monospace';
    ctx.fillText('$ waiting for task dispatch...', 35, 260);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
