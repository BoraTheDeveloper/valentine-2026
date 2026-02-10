const POOL_SIZE = 10;
const SPEED = 6;

export class ProjectilePool {
  constructor() {
    this.projectiles = [];
    this.oldestIndex = 0;

    for (let i = 0; i < POOL_SIZE; i++) {
      this.projectiles.push({
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        velocityX: SPEED,
        active: false,
      });
    }
  }

  fire(x, y, facing) {
    let proj = null;

    for (let i = 0; i < POOL_SIZE; i++) {
      if (!this.projectiles[i].active) {
        proj = this.projectiles[i];
        break;
      }
    }

    if (!proj) {
      proj = this.projectiles[this.oldestIndex];
      this.oldestIndex = (this.oldestIndex + 1) % POOL_SIZE;
    }

    proj.x = x;
    proj.y = y;
    proj.velocityX = facing === 'left' ? -SPEED : SPEED;
    proj.active = true;
  }

  update(camera) {
    for (let i = 0; i < POOL_SIZE; i++) {
      const proj = this.projectiles[i];
      if (proj.active) {
        proj.x += proj.velocityX;
        if (proj.x > camera.x + camera.width + 50 || proj.x < camera.x - 50) {
          proj.active = false;
        }
      }
    }
  }

  getActive() {
    return this.projectiles.filter((p) => p.active);
  }

  deactivate(proj) {
    proj.active = false;
  }
}
