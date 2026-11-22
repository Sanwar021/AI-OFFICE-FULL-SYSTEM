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
