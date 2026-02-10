/**
 * Level 1 - Valentine Quest
 * Defines the complete level layout: platforms, hearts, enemies,
 * castle, and flagpole for a Mario-style side-scroller.
 */

export const GAME_HEIGHT = 320;
export const GAME_WIDTH = 568;

const GROUND_Y = 280;

const level1 = {
  width: 4000,
  height: GAME_HEIGHT,

  playerStart: { x: 50, y: GROUND_Y - 32 },

  platforms: [
    // Main ground spanning the entire level
    { x: 0, y: GROUND_Y, width: 4000, height: 40, type: 'ground' },

    // Floating platforms spread across the level
    { x: 220,  y: 220, width: 100, height: 16, type: 'floating' },
    { x: 420,  y: 200, width: 90,  height: 16, type: 'floating' },
    { x: 650,  y: 230, width: 110, height: 16, type: 'floating' },
    { x: 900,  y: 190, width: 80,  height: 16, type: 'floating' },
    { x: 1150, y: 210, width: 100, height: 16, type: 'floating' },
    { x: 1450, y: 240, width: 120, height: 16, type: 'floating' },
    { x: 1750, y: 200, width: 90,  height: 16, type: 'floating' },
    { x: 2100, y: 180, width: 100, height: 16, type: 'floating' },
    { x: 2500, y: 220, width: 110, height: 16, type: 'floating' },
    { x: 2900, y: 200, width: 100, height: 16, type: 'floating' },
  ],

  hearts: [
    // On or near the first floating platforms
    { x: 250, y: 196 },
    { x: 280, y: 196 },
    { x: 450, y: 176 },

    // Mid-air between platforms
    { x: 550, y: 200 },
    { x: 680, y: 206 },
    { x: 720, y: 206 },

    // On higher platforms
    { x: 920, y: 166 },
    { x: 1170, y: 186 },
    { x: 1200, y: 186 },

    // Ground-level collectibles
    { x: 1300, y: GROUND_Y - 24 },
    { x: 1350, y: GROUND_Y - 24 },
    { x: 1480, y: 216 },

    // Later platforms
    { x: 1780, y: 176 },
    { x: 2130, y: 156 },
    { x: 2150, y: 156 },

    // Final section
    { x: 2530, y: 196 },
    { x: 2930, y: 176 },
    { x: 3200, y: GROUND_Y - 24 },
  ],

  enemies: [
    // Ground patrollers
    { x: 350,  y: GROUND_Y - 32, patrolMinX: 300,  patrolMaxX: 500 },
    { x: 800,  y: GROUND_Y - 32, patrolMinX: 750,  patrolMaxX: 950 },
    { x: 1600, y: GROUND_Y - 32, patrolMinX: 1500, patrolMaxX: 1700 },
    { x: 2300, y: GROUND_Y - 32, patrolMinX: 2200, patrolMaxX: 2400 },

    // Platform patrollers
    { x: 1460, y: 240 - 32, patrolMinX: 1450, patrolMaxX: 1550 },
    { x: 2510, y: 220 - 32, patrolMinX: 2500, patrolMaxX: 2590 },
  ],

  castle: {
    x: 3750,
    y: GROUND_Y - 160,
    width: 128,
    height: 160,
  },

  flagpole: {
    x: 3720,
    y: GROUND_Y - 160,
    height: 140,
    flagY: GROUND_Y - 30,
    flagTargetY: GROUND_Y - 155,
    raising: false,
    raised: false,
  },
};

export default level1;
