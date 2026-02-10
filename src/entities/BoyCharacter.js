const WALK_SPEED = 2;

export class BoyCharacter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = -WALK_SPEED;
    this.facing = 'left';
    this.walking = true;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update() {
    if (!this.walking) return;

    this.x += this.velocityX;

    this.animTimer++;
    if (this.animTimer >= 10) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }

  stopAt(targetX) {
    this.walking = false;
    this.velocityX = 0;
    this.x = targetX;
  }
}
