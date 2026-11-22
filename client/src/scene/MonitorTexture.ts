import * as THREE from 'three';

export class DynamicMonitorTexture {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;
  private role: string;
  private lastText: string = '';
  private frameCount: number = 0;

  constructor(role: string) {
    this.role = role;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 300;
    this.ctx = this.canvas.getContext('2d')!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.generateMipmaps = false;
    this.texture.minFilter = THREE.LinearFilter;
    this.draw('Initializing workstation...', 'idle');
  }

  public update(content: string, status: string) {
    if (content === this.lastText && this.frameCount % 10 !== 0) {
      this.frameCount++;
      return;
    }
    this.lastText = content;
    this.frameCount++;
    this.draw(content, status);
    this.texture.needsUpdate = true;
  }

  private draw(content: string, status: string) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark sleek IDE/Terminal background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, w, 36);

    // Terminal window buttons
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(16, 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(32, 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(48, 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // Role title
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(`${this.role.toUpperCase()} — LIVE CONSOLE`, 68, 22);

    // Status pill
    const isWorking = status === 'working';
    ctx.fillStyle = isWorking ? '#059669' : '#475569';
    ctx.fillRect(w - 95, 8, 85, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(isWorking ? '● WORKING' : '● IDLE', w - 85, 22);

    // Terminal Content Area
    ctx.fillStyle = isWorking ? '#38bdf8' : '#64748b';
    ctx.font = '12px "Courier New", monospace';

    const lines = (content || 'Ready for task assignment.\nSystem online. Connected to Gemini.').split('\n');
    const visibleLines = lines.slice(-12);

    let y = 60;
    for (const line of visibleLines) {
      const truncated = line.slice(0, 52);
      ctx.fillText(truncated, 16, y);
      y += 18;
    }

    // Blinking cursor
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = '#14b8a6';
      ctx.fillRect(16 + (visibleLines[visibleLines.length - 1]?.length || 0) * 7.2, y - 18, 8, 14);
    }
  }

  public dispose() {
    this.texture.dispose();
  }
}
