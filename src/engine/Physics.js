/**
 * Physics - Pure functions for gravity, collision detection,
 * and platform resolution.
 */

export const GRAVITY = 0.5;

/**
 * Apply gravity to an entity with a velocityY property.
 */
export function applyGravity(entity) {
  entity.velocityY += GRAVITY;
}

/**
 * Axis-Aligned Bounding Box overlap test.
 * Both a and b must have { x, y, width, height }.
 * Returns true if they overlap.
 */
export function checkAABB(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Resolve player landing on top of platforms.
 * Only resolves downward collisions (landing), not side or bottom hits.
 *
 * Logic: if the player's previous bottom was at or above the platform top,
 * and the player now overlaps the platform, snap the player on top.
 */
export function resolvePlayerPlatforms(player, platforms) {
  player.grounded = false;

  for (const plat of platforms) {
    // Skip if no horizontal overlap
    if (player.x + player.width <= plat.x || player.x >= plat.x + plat.width) {
      continue;
    }

    const playerBottom = player.y + player.height;
    const playerPrevBottom = player.y + player.height - player.velocityY;
    const platformTop = plat.y;

    // Player was above (or at) platform top last frame and is now at/below it
    if (playerPrevBottom <= platformTop + 2 && playerBottom >= platformTop) {
      // Only resolve if falling or standing (not jumping up through)
      if (player.velocityY >= 0) {
        player.y = platformTop - player.height;
        player.velocityY = 0;
        player.grounded = true;
      }
    }
  }
}
