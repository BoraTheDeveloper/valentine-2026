const FIREWORK_COLORS = [
  '#FF1744', '#FF69B4', '#FFD700', '#E91E63',
  '#FF6B35', '#BA68C8', '#42A5F5',
];

const MAX_PARTICLES = 300;
const BURST_COUNT = 30;

export class Fireworks {
  constructor() {
    this.rockets = [];
    this.particles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, color: '#fff', size: 2 });
    }
    this.burstCallbacks = [];
  }

  onBurst(cb) {
    this.burstCallbacks.push(cb);
  }

  launch(x, targetY, color) {
    this.rockets.push({
      x,
      y: 320,
      targetY: targetY || 40 + Math.random() * 80,
      vy: -(6 + Math.random() * 3),
      color: color || FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      trail: 0,
    });
  }

  update() {
    // Update rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.y += r.vy;
      r.vy *= 0.98;
      r.trail++;

      // Spawn trail particle every 3 frames
      if (r.trail % 3 === 0) {
        this._spawnParticle(r.x, r.y, (Math.random() - 0.5) * 0.5, 0.5, r.color, 0.4, 1.5);
      }

      if (r.y <= r.targetY || Math.abs(r.vy) < 0.5) {
        this._burst(r.x, r.y, r.color);
        for (const cb of this.burstCallbacks) cb();
        this.rockets.splice(i, 1);
      }
    }

    // Update particles
    for (const p of this.particles) {
      if (!p.active) continue;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= 0.018;
      if (p.life <= 0) p.active = false;
    }
  }

  _burst(x, y, color) {
    for (let i = 0; i < BURST_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / BURST_COUNT + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 2;
      this._spawnParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 1, 2 + Math.random() * 2);
    }
  }

  _spawnParticle(x, y, vx, vy, color, life, size) {
    for (const p of this.particles) {
      if (p.active) continue;
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = vx;
      p.vy = vy;
      p.color = color;
      p.life = life;
      p.size = size;
      return;
    }
  }

  render(ctx) {
    // Draw rockets
    for (const r of this.rockets) {
      ctx.fillStyle = r.color;
      ctx.fillRect(r.x - 1, r.y - 2, 3, 5);
    }

    // Draw particles
    for (const p of this.particles) {
      if (!p.active) continue;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
