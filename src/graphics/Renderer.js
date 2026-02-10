/**
 * Renderer - Manages the canvas, sky gradient, platform drawing,
 * and visibility culling.
 */

import { GAME_HEIGHT, GAME_WIDTH } from '../levels/level1.js';
import { PALETTE } from './sprites.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scale = 1;
    this.skyProgress = 0;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  /**
   * Resize canvas to fill its container while maintaining the game aspect ratio.
   * The internal resolution is based on GAME_WIDTH x GAME_HEIGHT.
   */
  resize() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const containerWidth = isFullscreen ? window.screen.width : (this.canvas.parentElement?.clientWidth || window.innerWidth);
    const containerHeight = isFullscreen ? window.screen.height : (this.canvas.parentElement?.clientHeight || window.innerHeight);

    const targetAspect = GAME_WIDTH / GAME_HEIGHT;
    const containerAspect = containerWidth / containerHeight;

    let drawWidth, drawHeight;

    if (containerAspect >= targetAspect) {
      drawHeight = containerHeight;
      drawWidth = drawHeight * targetAspect;
    } else {
      drawWidth = containerWidth;
      drawHeight = drawWidth / targetAspect;
    }

    this.canvas.style.width = `${drawWidth}px`;
    this.canvas.style.height = `${drawHeight}px`;

    // Center the canvas
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = `${(containerWidth - drawWidth) / 2}px`;
    this.canvas.style.top = `${(containerHeight - drawHeight) / 2}px`;

    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;

    this.scale = drawWidth / GAME_WIDTH;

    // Crisp pixel rendering
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Clear the canvas and draw the sky gradient background.
   */
  clear() {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    const t = this.skyProgress;
    const top = lerpColor(PALETTE.sky1, '#4A0E2E', t);
    const bot = lerpColor(PALETTE.sky2, '#FF6B35', t);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bot);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  /**
   * Draw all platforms with brown body and green grass strip.
   * Skips platforms outside the camera viewport.
   */
  drawPlatforms(platforms, camera) {
    const ctx = this.ctx;

    for (const plat of platforms) {
      // Culling: skip if entirely off-screen
      if (!this.isOnScreen(plat, camera)) continue;

      // Brown platform body
      ctx.fillStyle = PALETTE.ground;
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

      // Green grass strip on top (4px tall)
      const grassHeight = 4;
      ctx.fillStyle = PALETTE.grass;
      ctx.fillRect(plat.x, plat.y, plat.width, grassHeight);
    }
  }

  /**
   * Check if an entity is within the camera viewport (plus a small margin).
   */
  isOnScreen(entity, camera) {
    const margin = 64;
    return (
      entity.x + entity.width > camera.x - margin &&
      entity.x < camera.x + camera.width + margin &&
      entity.y + entity.height > camera.y - margin &&
      entity.y < camera.y + camera.height + margin
    );
  }

  /**
   * Return the canvas element.
   */
  getCanvas() {
    return this.canvas;
  }
}

function parseHex(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function lerpColor(a, b, t) {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}
