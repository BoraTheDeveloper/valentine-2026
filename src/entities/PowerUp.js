const GROUND_Y = 280;

export class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityY = 0;
    this.visible = false;
    this.collected = false;
    this.glowTimer = 0;
    this.grounded = false;
  }

  show() {
    this.visible = true;
  }

  update() {
    if (!this.visible || this.collected) return;

    if (!this.grounded) {
      this.velocityY += 0.3;
      this.y += this.velocityY;

      if (this.y >= GROUND_Y - this.height) {
        this.y = GROUND_Y - this.height;
        this.velocityY = 0;
        this.grounded = true;
      }
    }

    this.glowTimer += 0.05;
  }

  collect() {
    this.collected = true;
  }
}
