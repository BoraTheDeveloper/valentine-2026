import { drawHeart, PALETTE } from '../graphics/sprites.js';

export class HUD {
  constructor() {
    this.hintAlpha = 1;
    this.hintTimer = 300; // 5 seconds at 60fps
    this.showHints = true;
  }

  update() {
    if (this.hintTimer > 0) {
      this.hintTimer--;
      if (this.hintTimer < 60) {
        this.hintAlpha = this.hintTimer / 60;
      }
    } else {
      this.showHints = false;
    }
  }

  render(ctx, heartsCollected, canvasWidth, canvasHeight) {
    const scale = canvasWidth / 568;

    // Heart counter
    const iconSize = 14 * scale;
    const padding = 12 * scale;
    const textSize = Math.floor(18 * scale);

    drawHeart(ctx, padding, padding, iconSize, PALETTE.heartRed);

    ctx.font = `bold ${textSize}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#000';
    ctx.fillText(`× ${heartsCollected}`, padding + iconSize + 6 * scale, padding - 2 * scale + 1);
    ctx.fillStyle = PALETTE.white;
    ctx.fillText(`× ${heartsCollected}`, padding + iconSize + 5 * scale, padding - 2 * scale);
  }

  renderHints(ctx, canvasWidth, canvasHeight) {
    if (!this.showHints) return;

    const scale = canvasWidth / 568;
    ctx.globalAlpha = this.hintAlpha * 0.4;

    const fontSize = Math.floor(11 * scale);
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';

    // Left zone
    ctx.fillText('◀', canvasWidth * 0.075, canvasHeight * 0.75);
    // Right zone
    ctx.fillText('▶', canvasWidth * 0.225, canvasHeight * 0.75);
    // Jump zone
    ctx.fillText('JUMP', canvasWidth * 0.77, canvasHeight * 0.75);
    // Shoot zone
    ctx.fillText('SHOOT', canvasWidth * 0.92, canvasHeight * 0.75);

    // Draw zone boundaries (subtle dashed lines)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;

    // Left/right divider
    ctx.beginPath();
    ctx.moveTo(canvasWidth * 0.15, canvasHeight * 0.5);
    ctx.lineTo(canvasWidth * 0.15, canvasHeight);
    ctx.stroke();

    // Right move / center divider
    ctx.beginPath();
    ctx.moveTo(canvasWidth * 0.30, canvasHeight * 0.5);
    ctx.lineTo(canvasWidth * 0.30, canvasHeight);
    ctx.stroke();

    // Jump/shoot zone
    ctx.beginPath();
    ctx.moveTo(canvasWidth * 0.70, canvasHeight * 0.5);
    ctx.lineTo(canvasWidth * 0.70, canvasHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth * 0.85, canvasHeight * 0.5);
    ctx.lineTo(canvasWidth * 0.85, canvasHeight);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
}
