/**
 * Camera - Viewport that follows a target entity.
 * Applies translation to the canvas context for world-space rendering.
 */

export class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
  }

  /**
   * Follow a target entity, clamped within the level bounds.
   * Centers the target horizontally; vertical is fixed at 0.
   */
  follow(target, levelWidth) {
    const idealX = target.x - this.width / 2;
    const maxX = levelWidth - this.width;
    this.x = Math.max(0, Math.min(idealX, maxX));
    this.y = 0;
  }

  /**
   * Apply camera transform to the canvas context.
   * Call before drawing world-space objects.
   */
  apply(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
  }

  /**
   * Restore the canvas context after world-space drawing.
   */
  reset(ctx) {
    ctx.restore();
  }
}
