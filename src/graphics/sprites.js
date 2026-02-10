/**
 * sprites.js - Drawing functions for all game entities.
 * Pure functions that take a canvas 2D context and entity data.
 */

export const PALETTE = {
  sky1: '#FFB6C1',
  sky2: '#FF7F7F',
  ground: '#8B4513',
  grass: '#4CAF50',
  heartRed: '#FF1744',
  heartPink: '#FF69B4',
  enemy: '#9C27B0',
  castleStone: '#9E9E9E',
  castleRoof: '#B71C1C',
  flag: '#E91E63',
  powerUpGlow: '#FFD700',
  white: '#FFFFFF',
};

/**
 * Draw a filled heart shape using bezier curves.
 */
export function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topY = y - size * 0.4;
  ctx.moveTo(x, y + size * 0.3);
  // Left curve
  ctx.bezierCurveTo(x - size * 0.5, y - size * 0.2,
                     x - size * 0.5, topY,
                     x, topY + size * 0.25);
  // Right curve
  ctx.bezierCurveTo(x + size * 0.5, topY,
                     x + size * 0.5, y - size * 0.2,
                     x, y + size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draw the player character - a cute pixel-art adventurer.
 * ~32x32 with red/pink hat, skin face, pink tunic, dark boots.
 * Blinks when invincible.
 */
export function drawPlayer(ctx, player) {
  // Invincibility blink: skip drawing every other frame
  if (player.invincible && Math.floor(Date.now() / 80) % 2 === 0) {
    return;
  }

  const x = Math.floor(player.x);
  const y = Math.floor(player.y);

  ctx.save();

  // Hat (red/pink) - top portion
  ctx.fillStyle = '#E91E63';
  ctx.fillRect(x + 8, y, 16, 6);
  ctx.fillRect(x + 6, y + 6, 20, 4);

  // Face (skin color)
  ctx.fillStyle = '#FFCC99';
  ctx.fillRect(x + 8, y + 10, 16, 8);

  // Eyes
  ctx.fillStyle = '#333333';
  ctx.fillRect(x + 11, y + 12, 3, 3);
  ctx.fillRect(x + 18, y + 12, 3, 3);

  // Smile
  ctx.fillStyle = '#E91E63';
  ctx.fillRect(x + 13, y + 16, 6, 1);

  // Body / tunic (pink)
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(x + 6, y + 18, 20, 8);

  // Belt
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 6, y + 24, 20, 2);

  // Arms
  ctx.fillStyle = '#FFCC99';
  ctx.fillRect(x + 2, y + 18, 4, 6);
  ctx.fillRect(x + 26, y + 18, 4, 6);

  // Boots (dark brown)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(x + 6, y + 26, 8, 6);
  ctx.fillRect(x + 18, y + 26, 8, 6);

  ctx.restore();
}

/**
 * Draw the boy character - blue-themed adventurer matching player style.
 */
export function drawBoyCharacter(ctx, boy) {
  const x = Math.floor(boy.x);
  const y = Math.floor(boy.y);

  ctx.save();

  // Hat (blue)
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(x + 8, y, 16, 6);
  ctx.fillRect(x + 6, y + 6, 20, 4);

  // Face
  ctx.fillStyle = '#FFCC99';
  ctx.fillRect(x + 8, y + 10, 16, 8);

  // Eyes
  ctx.fillStyle = '#333333';
  ctx.fillRect(x + 11, y + 12, 3, 3);
  ctx.fillRect(x + 18, y + 12, 3, 3);

  // Smile
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(x + 13, y + 16, 6, 1);

  // Body / tunic (light blue)
  ctx.fillStyle = '#42A5F5';
  ctx.fillRect(x + 6, y + 18, 20, 8);

  // Belt
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 6, y + 24, 20, 2);

  // Arms
  ctx.fillStyle = '#FFCC99';
  ctx.fillRect(x + 2, y + 18, 4, 6);
  ctx.fillRect(x + 26, y + 18, 4, 6);

  // Boots
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(x + 6, y + 26, 8, 6);
  ctx.fillRect(x + 18, y + 26, 8, 6);

  ctx.restore();
}

/**
 * Draw a chat bubble with a beating heart inside.
 */
export function drawChatBubble(ctx, x, y, heartScale) {
  const w = 40;
  const h = 32;
  const bx = x - w / 2;
  const by = y - h;

  ctx.save();

  // Bubble body
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(bx, by, w, h, 8);
  ctx.fill();

  // Bubble pointer
  ctx.beginPath();
  ctx.moveTo(x - 5, by + h);
  ctx.lineTo(x, by + h + 8);
  ctx.lineTo(x + 5, by + h);
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.strokeStyle = '#E91E63';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, w, h, 8);
  ctx.stroke();

  // Beating heart
  ctx.save();
  ctx.translate(x, by + h / 2);
  ctx.scale(heartScale, heartScale);
  drawHeart(ctx, 0, 0, 10, '#FF1744');
  ctx.restore();

  ctx.restore();
}

/**
 * Draw an enemy - a grumpy purple blob creature, ~32x32.
 */
export function drawEnemy(ctx, enemy) {
  const x = Math.floor(enemy.x);
  const y = Math.floor(enemy.y);

  ctx.save();

  // Body (purple blob)
  ctx.fillStyle = PALETTE.enemy;
  ctx.fillRect(x + 4, y + 8, 24, 20);
  ctx.fillRect(x + 8, y + 4, 16, 4);
  ctx.fillRect(x + 2, y + 12, 28, 12);

  // Angry eyes (white bg)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 8, y + 10, 6, 6);
  ctx.fillRect(x + 18, y + 10, 6, 6);

  // Pupils
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 10, y + 12, 3, 3);
  ctx.fillRect(x + 20, y + 12, 3, 3);

  // Angry eyebrows
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 7, y + 8, 7, 2);
  ctx.fillRect(x + 18, y + 8, 7, 2);

  // Frown
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 11, y + 22, 10, 2);

  // Feet
  ctx.fillStyle = '#7B1FA2';
  ctx.fillRect(x + 4, y + 28, 8, 4);
  ctx.fillRect(x + 20, y + 28, 8, 4);

  ctx.restore();
}

/**
 * Draw the castle - stone body, battlements, dark red roof, door, windows.
 */
export function drawCastle(ctx, castle) {
  const x = castle.x;
  const y = castle.y;
  const w = castle.width;
  const h = castle.height;

  ctx.save();

  // Stone body
  ctx.fillStyle = PALETTE.castleStone;
  ctx.fillRect(x, y + 30, w, h - 30);

  // Battlements on top
  const battlementWidth = 16;
  const battlementHeight = 12;
  const gap = 8;
  ctx.fillStyle = '#757575';
  for (let bx = x; bx < x + w; bx += battlementWidth + gap) {
    ctx.fillRect(bx, y + 18, battlementWidth, battlementHeight);
  }

  // Triangular roof
  ctx.fillStyle = PALETTE.castleRoof;
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 20);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + w + 4, y + 20);
  ctx.closePath();
  ctx.fill();

  // Door
  ctx.fillStyle = '#5D4037';
  const doorWidth = 24;
  const doorHeight = 40;
  ctx.fillRect(x + w / 2 - doorWidth / 2, y + h - doorHeight, doorWidth, doorHeight);

  // Door arch
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h - doorHeight, doorWidth / 2, Math.PI, 0);
  ctx.fill();

  // Windows
  ctx.fillStyle = '#42A5F5';
  ctx.fillRect(x + 16, y + 60, 14, 16);
  ctx.fillRect(x + w - 30, y + 60, 14, 16);

  // Window frames
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(x + 22, y + 60, 2, 16);
  ctx.fillRect(x + 16, y + 67, 14, 2);
  ctx.fillRect(x + w - 24, y + 60, 2, 16);
  ctx.fillRect(x + w - 30, y + 67, 14, 2);

  ctx.restore();
}

/**
 * Draw the flagpole - thin gray pole with a pink flag at flagY.
 * Includes a small heart on the flag.
 */
export function drawFlagpole(ctx, flagpole) {
  const x = flagpole.x;
  const baseY = flagpole.y + flagpole.height;
  const topY = flagpole.y;

  ctx.save();

  // Pole
  ctx.fillStyle = '#757575';
  ctx.fillRect(x - 2, topY, 4, flagpole.height);

  // Pole ball on top
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x, topY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Flag
  const flagY = flagpole.flagY;
  const flagWidth = 30;
  const flagHeight = 20;

  ctx.fillStyle = PALETTE.flag;
  ctx.fillRect(x + 2, flagY, flagWidth, flagHeight);

  // Heart on flag
  drawHeart(ctx, x + 2 + flagWidth / 2, flagY + flagHeight / 2, 8, '#FFFFFF');

  ctx.restore();
}

/**
 * Draw a power-up - golden pulsing heart with glow effect.
 */
export function drawPowerUp(ctx, powerup) {
  const centerX = powerup.x + powerup.width / 2;
  const centerY = powerup.y + powerup.height / 2;

  // Pulsing size
  const pulse = 1 + 0.15 * Math.sin(Date.now() / 150);
  const size = powerup.width * 0.8 * pulse;

  ctx.save();

  // Glow effect
  ctx.shadowColor = PALETTE.powerUpGlow;
  ctx.shadowBlur = 15;

  drawHeart(ctx, centerX, centerY, size, PALETTE.powerUpGlow);

  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.restore();
}
