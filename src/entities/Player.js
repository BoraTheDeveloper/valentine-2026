const MOVE_SPEED = 3;
const JUMP_FORCE = -10;
const SHOOT_COOLDOWN = 15;

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.grounded = false;
    this.facing = 'right';
    this.shootCooldown = 0;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.alive = true;
  }

  update(input, projectilePool) {
    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    if (input.moveRight) {
      this.velocityX = MOVE_SPEED;
      this.facing = 'right';
    } else if (input.moveLeft) {
      this.velocityX = -MOVE_SPEED;
      this.facing = 'left';
    } else {
      this.velocityX = 0;
    }

    if (input.jumpJustPressed && this.grounded) {
      this.velocityY = JUMP_FORCE;
      this.grounded = false;
    }

    if (input.shootJustPressed && this.shootCooldown <= 0) {
      const projX = this.facing === 'right'
        ? this.x + this.width
        : this.x - 16;
      projectilePool.fire(projX, this.y + this.height / 2, this.facing);
      this.shootCooldown = SHOOT_COOLDOWN;
    }

    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    this.x += this.velocityX;

    this.animTimer++;
    if (this.animTimer >= 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }

  respawn(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.invincible = true;
    this.invincibleTimer = 120;
  }
}
