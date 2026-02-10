import { drawHeart, PALETTE } from '../graphics/sprites.js';

const HEART_COUNT = 15;

export class StartScreen {
  constructor() {
    this.hearts = [];
    for (let i = 0; i < HEART_COUNT; i++) {
      this.hearts.push({
        x: Math.random() * 600,
        y: Math.random() * 320,
        size: 8 + Math.random() * 12,
        speed: 0.3 + Math.random() * 0.7,
        drift: (Math.random() - 0.5) * 0.5,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
    this.titlePulse = 0;
    this.promptBlink = 0;
  }

  update() {
    this.titlePulse += 0.03;
    this.promptBlink += 0.04;

    for (const h of this.hearts) {
      h.y -= h.speed;
      h.x += h.drift;
      if (h.y < -20) {
        h.y = 340;
        h.x = Math.random() * 600;
      }
    }
  }

  render(ctx, canvasWidth, canvasHeight) {
    const scaleX = canvasWidth / 568;
    const scaleY = canvasHeight / 320;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, '#2D0A3E');
    grad.addColorStop(1, '#1A0522');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Floating hearts
    for (const h of this.hearts) {
      ctx.globalAlpha = h.alpha;
      drawHeart(ctx, h.x * scaleX, h.y * scaleY, h.size * scaleX, PALETTE.heartRed);
    }
    ctx.globalAlpha = 1;

    // Title
    const titleSize = Math.floor(36 * scaleX);
    const pulse = 1 + Math.sin(this.titlePulse) * 0.05;
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight * 0.32);
    ctx.scale(pulse, pulse);

    ctx.font = `bold ${titleSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text shadow
    ctx.fillStyle = '#8B0000';
    ctx.fillText('Valentine Quest', 2 * scaleX, 2 * scaleY);

    // Main text
    ctx.fillStyle = '#FF69B4';
    ctx.fillText('Valentine Quest', 0, 0);
    ctx.restore();

    // Subtitle
    const subSize = Math.floor(14 * scaleX);
    ctx.font = `${subSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFB6C1';
    ctx.fillText('~ The Power of Love ~', canvasWidth / 2, canvasHeight * 0.45);

    // Prompt (blinking)
    const promptAlpha = 0.5 + Math.sin(this.promptBlink) * 0.5;
    ctx.globalAlpha = promptAlpha;
    const promptSize = Math.floor(16 * scaleX);
    ctx.font = `${promptSize}px Georgia, serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Tap to Start', canvasWidth / 2, canvasHeight * 0.7);
    ctx.globalAlpha = 1;

    // Small keyboard hint
    const hintSize = Math.floor(10 * scaleX);
    ctx.font = `${hintSize}px monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('or press Enter', canvasWidth / 2, canvasHeight * 0.78);
  }
}
