/**
 * ParticleSystem - Object-pooled particle effects.
 * Pre-allocates particles to avoid GC during gameplay.
 */

const POOL_SIZE = 50;

export class ParticleSystem {
  constructor() {
    this.particles = [];

    // Pre-allocate the particle pool
    for (let i = 0; i < POOL_SIZE; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1,
        color: '#FFFFFF',
        size: 3,
        active: false,
      });
    }
  }

  /**
   * Spawn `count` particles at (x, y) with given color.
   * Activates inactive particles from the pool.
   */
  spawn(x, y, count, color) {
    let spawned = 0;

    for (const particle of this.particles) {
      if (spawned >= count) break;
      if (particle.active) continue;

      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() * 4) - 2;          // -2 to 2
      particle.vy = -(Math.random() * 2.5 + 0.5);     // -3 to -0.5
      particle.life = 1;
      particle.maxLife = 1;
      particle.color = color;
      particle.size = 2 + Math.random() * 2;           // 2 to 4
      particle.active = true;

      spawned++;
    }
  }

  /**
   * Update all active particles: move, apply gravity, decay life.
   */
  update() {
    for (const p of this.particles) {
      if (!p.active) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // slight gravity
      p.life -= 0.02;

      if (p.life <= 0) {
        p.active = false;
      }
    }
  }

  /**
   * Render all active particles as filled circles with fading alpha.
   */
  render(ctx) {
    ctx.save();

    for (const p of this.particles) {
      if (!p.active) continue;

      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
