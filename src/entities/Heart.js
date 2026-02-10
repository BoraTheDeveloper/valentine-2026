export class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 24;
    this.collected = false;
    this.bobTimer = 0;
    this.baseY = y;
  }

  update() {
    if (!this.collected) {
      this.bobTimer += 0.05;
      this.y = this.baseY + Math.sin(this.bobTimer) * 5;
    }
  }

  collect() {
    this.collected = true;
  }
}
