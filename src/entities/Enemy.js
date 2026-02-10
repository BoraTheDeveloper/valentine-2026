export class Enemy {
  constructor(x, y, patrolMinX, patrolMaxX) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 1;
    this.patrolMinX = patrolMinX;
    this.patrolMaxX = patrolMaxX;
    this.alive = true;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update() {
    if (!this.alive) return;

    this.x += this.velocityX;

    if (this.x <= this.patrolMinX || this.x >= this.patrolMaxX) {
      this.velocityX *= -1;
    }

    this.animTimer++;
    if (this.animTimer >= 12) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }

  defeat() {
    this.alive = false;
  }
}
