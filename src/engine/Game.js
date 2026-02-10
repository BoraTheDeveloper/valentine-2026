import { Camera } from './Camera.js';
import { Input } from './Input.js';
import { applyGravity, checkAABB, resolvePlayerPlatforms } from './Physics.js';
import { Audio } from './Audio.js';
import { Renderer } from '../graphics/Renderer.js';
import { ParticleSystem } from '../graphics/particles.js';
import {
  drawHeart, drawPlayer, drawEnemy, drawCastle,
  drawFlagpole, drawPowerUp, drawBoyCharacter, drawChatBubble,
  PALETTE,
} from '../graphics/sprites.js';
import { Fireworks } from '../graphics/Fireworks.js';
import { StartScreen } from '../ui/StartScreen.js';
import { HUD } from '../ui/HUD.js';
import { MessageOverlay } from '../ui/MessageOverlay.js';
import { Player } from '../entities/Player.js';
import { Heart } from '../entities/Heart.js';
import { ProjectilePool } from '../entities/Projectile.js';
import { Enemy } from '../entities/Enemy.js';
import { Castle } from '../entities/Castle.js';
import { PowerUp } from '../entities/PowerUp.js';
import { BoyCharacter } from '../entities/BoyCharacter.js';
import level1, { GAME_WIDTH, GAME_HEIGHT } from '../levels/level1.js';

const TIMESTEP = 1000 / 60;
const GROUND_Y = 280;

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.ctx = canvas.getContext('2d');
    this.input = new Input(canvas);
    this.camera = new Camera(GAME_WIDTH, GAME_HEIGHT);
    this.audio = new Audio();
    this.particles = new ParticleSystem();
    this.startScreen = new StartScreen();
    this.hud = new HUD();
    this.messageOverlay = new MessageOverlay();

    this.state = 'start';
    this.heartsCollected = 0;
    this.accumulator = 0;
    this.lastTime = 0;

    // Level entities
    this.player = null;
    this.platforms = [];
    this.hearts = [];
    this.enemies = [];
    this.projectiles = new ProjectilePool();
    this.castle = null;
    this.flagpole = null;
    this.powerUp = null;

    this.showMessageBtn = false;

    // Cutscene state
    this.stampTimer = 0;
    this.stampSoundPlayed = false;
    this.boy = null;
    this.chatBubble = { visible: false, timer: 0 };
    this.fireworks = null;
    this.fireworkTimer = 0;
    this.bubbleWait = 0;
  }

  init() {
    this.loadLevel(level1);
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loadLevel(lvl) {
    this.player = new Player(lvl.playerStart.x, lvl.playerStart.y);
    this.platforms = lvl.platforms;
    this.hearts = lvl.hearts.map(h => new Heart(h.x, h.y));
    this.enemies = lvl.enemies.map(
      e => new Enemy(e.x, e.y, e.patrolMinX, e.patrolMaxX)
    );
    this.castle = new Castle(lvl.castle.x, lvl.castle.y);
    this.flagpole = { ...lvl.flagpole };
    this.powerUp = new PowerUp(
      lvl.flagpole.x + 10,
      lvl.castle.y + 20
    );
    this.heartsCollected = 0;
  }

  loop(currentTime) {
    const frameTime = Math.min(currentTime - this.lastTime, 200);
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= TIMESTEP) {
      this.update();
      this.input.endFrame();
      this.accumulator -= TIMESTEP;
    }

    this.render();
    requestAnimationFrame(t => this.loop(t));
  }

  update() {
    switch (this.state) {
      case 'start': this.updateStart(); break;
      case 'playing': this.updatePlaying(); break;
      case 'castle': this.updateCastle(); break;
      case 'flagRaise': this.updateFlagRaise(); break;
      case 'powerUpDrop': this.updatePowerUpDrop(); break;
      case 'message': this.updateMessage(); break;
      case 'stamp': this.updateStamp(); break;
      case 'stampWait': break;
      case 'sunset': this.updateSunset(); break;
      case 'walkToMeet': this.updateWalkToMeet(); break;
      case 'fireworks': this.updateFireworks(); break;
    }
  }

  render() {
    this.renderer.clear();
    const ctx = this.ctx;

    if (this.state === 'start') {
      this.startScreen.render(ctx, GAME_WIDTH, GAME_HEIGHT);
      return;
    }

    // World rendering
    this.camera.apply(ctx);
    this.renderer.drawPlatforms(this.platforms, this.camera);

    // Hearts
    for (const h of this.hearts) {
      if (!h.collected && this.renderer.isOnScreen(h, this.camera)) {
        drawHeart(ctx, h.x + 12, h.y + 4, 10, PALETTE.heartRed);
      }
    }

    // Enemies
    for (const e of this.enemies) {
      if (e.alive && this.renderer.isOnScreen(e, this.camera)) {
        drawEnemy(ctx, e);
      }
    }

    // Projectiles
    for (const p of this.projectiles.getActive()) {
      const cx = p.x + p.width / 2;
      const cy = p.y + p.height / 2;
      const dir = p.velocityX > 0 ? -1 : 1;

      // Wind trail behind the heart
      for (let i = 1; i <= 4; i++) {
        ctx.globalAlpha = 0.3 - i * 0.06;
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(cx + dir * i * 7, cy, 3.5 - i * 0.5, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      drawHeart(ctx, cx, cy, 20, PALETTE.heartRed);
    }

    // Castle & flagpole
    drawCastle(ctx, this.castle);
    drawFlagpole(ctx, this.flagpole);

    // Fireworks (behind characters, in front of castle)
    if (this.fireworks && this.state === 'fireworks') {
      this.fireworks.render(ctx);
    }

    // Power-up
    if (this.powerUp.visible && !this.powerUp.collected) {
      drawPowerUp(ctx, this.powerUp);
    }

    // Player
    drawPlayer(ctx, this.player);

    // Boy character
    if (this.boy) {
      drawBoyCharacter(ctx, this.boy);
    }

    // Chat bubble
    if (this.chatBubble.visible) {
      const midX = (this.player.x + this.player.width / 2 + this.boy.x + this.boy.width / 2) / 2;
      const bubbleY = Math.min(this.player.y, this.boy.y) - 12;
      const heartScale = 1 + 0.2 * Math.sin(this.chatBubble.timer * 0.08);
      drawChatBubble(ctx, midX, bubbleY, heartScale);
    }

    // Particles
    this.particles.render(ctx);

    this.camera.reset(ctx);

    // HUD (screen space)
    this.hud.render(ctx, this.heartsCollected, GAME_WIDTH, GAME_HEIGHT);
    if (this.state === 'playing') {
      this.hud.renderHints(ctx, GAME_WIDTH, GAME_HEIGHT);
    }
  }

  // --- State: start ---
  updateStart() {
    this.startScreen.update();
    if (this.input.justPressed('action') || this.input.justPressed('jump') ||
        this.input.justPressed('shoot')) {
      this.audio.init();
      this.audio.resume();
      this.state = 'playing';
    }
  }

  // --- State: playing ---
  updatePlaying() {
    const p = this.player;
    const inp = this.input;

    const jumpPressed = inp.justPressed('jump');
    const shootPressed = inp.justPressed('shoot');
    p.update(
      {
        moveRight: inp.state.moveRight,
        moveLeft: inp.state.moveLeft,
        jumpJustPressed: jumpPressed,
        shootJustPressed: shootPressed,
      },
      this.projectiles
    );

    if (jumpPressed && p.grounded) this.audio.jump();
    if (shootPressed && p.shootCooldown <= 0) this.audio.shoot();

    applyGravity(p);
    p.y += p.velocityY;
    resolvePlayerPlatforms(p, this.platforms);

    if (p.x < 0) p.x = 0;
    if (p.x > level1.width - p.width) p.x = level1.width - p.width;

    if (p.y > GAME_HEIGHT + 50) {
      p.respawn(level1.playerStart.x, level1.playerStart.y);
      this.audio.playerHit();
    }

    for (const h of this.hearts) {
      h.update();
      if (!h.collected && checkAABB(p, h)) {
        h.collect();
        this.heartsCollected++;
        this.particles.spawn(h.x + 12, h.y + 12, 8, PALETTE.heartRed);
        this.audio.collectHeart();
      }
    }

    for (const e of this.enemies) {
      e.update();
      if (e.alive && !p.invincible && checkAABB(p, e)) {
        p.respawn(level1.playerStart.x, level1.playerStart.y);
        this.audio.playerHit();
      }
    }

    this.projectiles.update(this.camera);
    for (const proj of this.projectiles.getActive()) {
      for (const e of this.enemies) {
        if (e.alive && checkAABB(proj, e)) {
          e.defeat();
          this.projectiles.deactivate(proj);
          this.particles.spawn(e.x + 16, e.y + 16, 12, PALETTE.enemy);
          this.audio.enemyDefeat();
          break;
        }
      }
    }

    const flagHitbox = {
      x: this.flagpole.x - 8,
      y: this.flagpole.y,
      width: 20,
      height: this.flagpole.height,
    };
    if (!this.flagpole.raised && !this.flagpole.raising && checkAABB(p, flagHitbox)) {
      this.state = 'castle';
    }

    this.camera.follow(p, level1.width);
    this.particles.update();
    this.hud.update();
  }

  // --- State: castle ---
  updateCastle() {
    this.flagpole.raising = true;
    this.state = 'flagRaise';
    this.audio.flagRaise();
  }

  // --- State: flagRaise ---
  updateFlagRaise() {
    if (this.flagpole.raising) {
      this.flagpole.flagY -= 0.8;
      if (this.flagpole.flagY <= this.flagpole.flagTargetY) {
        this.flagpole.flagY = this.flagpole.flagTargetY;
        this.flagpole.raising = false;
        this.flagpole.raised = true;
        this.powerUp.show();
        this.state = 'powerUpDrop';
      }
    }
    this.particles.update();
  }

  // --- State: powerUpDrop ---
  updatePowerUpDrop() {
    this.powerUp.update();

    const p = this.player;
    const inp = this.input;

    p.update(
      {
        moveRight: inp.state.moveRight,
        moveLeft: inp.state.moveLeft,
        jumpJustPressed: inp.justPressed('jump'),
        shootJustPressed: false,
      },
      this.projectiles
    );
    applyGravity(p);
    p.y += p.velocityY;
    resolvePlayerPlatforms(p, this.platforms);

    if (this.powerUp.visible && !this.powerUp.collected && checkAABB(p, this.powerUp)) {
      this.powerUp.collect();
      this.particles.spawn(
        this.powerUp.x + 16, this.powerUp.y + 16, 15, PALETTE.powerUpGlow
      );
      this.audio.powerUpCollect();
      this.showReadMessageBtn(true);
    }

    this.camera.follow(p, level1.width);
    this.particles.update();
  }

  showReadMessageBtn(visible) {
    const btn = document.getElementById('message-btn-container');
    if (btn) btn.style.display = visible ? 'flex' : 'none';
  }

  onReadMessage() {
    this.showReadMessageBtn(false);
    this.messageOverlay.show();
    this.state = 'message';
  }

  // --- State: message ---
  updateMessage() {
    this.messageOverlay.update();
    this.particles.update();
  }

  // Called from main.js when Yes/yes is clicked
  onValentineAccept() {
    if (this.state !== 'message') return;
    this.messageOverlay.showStamp();
    this.stampTimer = 0;
    this.stampSoundPlayed = false;
    this.state = 'stamp';
  }

  // --- State: stamp ---
  updateStamp() {
    this.stampTimer++;
    if (!this.stampSoundPlayed) {
      this.audio.stampSlam();
      this.stampSoundPlayed = true;
    }
    // Wait ~1.5s (90 frames) then close overlay and transition
    if (this.stampTimer === 90) {
      this.messageOverlay.hide();
      this.state = 'stampWait';
      // Wait for the overlay fade-out (0.6s), then start sunset
      setTimeout(() => {
        if (this.state === 'stampWait') {
          this.state = 'sunset';
          this.audio.romanticMelody();
        }
      }, 650);
    }
  }

  // --- State: sunset ---
  updateSunset() {
    this.renderer.skyProgress += 1 / 150;
    if (this.renderer.skyProgress >= 1) {
      this.renderer.skyProgress = 1;
      this._startWalkToMeet();
      this.state = 'walkToMeet';
    }
    this.particles.update();
  }

  _startWalkToMeet() {
    // Boy spawns at castle door center
    const doorX = this.castle.x + this.castle.width / 2 - 16;
    this.boy = new BoyCharacter(doorX, GROUND_Y - 32);

    // Ensure player is stationary and facing right
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.facing = 'right';

    // Frame the scene: position camera to show both castle and player
    const sceneCenter = (this.player.x + doorX) / 2;
    this.camera.x = Math.max(0, sceneCenter - GAME_WIDTH / 2);
  }

  // --- State: walkToMeet ---
  updateWalkToMeet() {
    if (this.boy.walking) {
      this.boy.update();

      // Check if boy reached the player
      const meetX = this.player.x + this.player.width + 8;
      if (this.boy.x <= meetX) {
        this.boy.stopAt(meetX);
        this.boy.facing = 'left';
        this.chatBubble.visible = true;
        this.chatBubble.timer = 0;
        this.bubbleWait = 0;
      }
    }

    if (this.chatBubble.visible) {
      this.chatBubble.timer++;
      this.bubbleWait++;
      // After ~2 seconds (120 frames) of bubble, start fireworks
      if (this.bubbleWait >= 120) {
        this.fireworks = new Fireworks();
        this.fireworks.onBurst(() => this.audio.fireworkBurst());
        this.fireworkTimer = 0;
        this.state = 'fireworks';
        this._showPlayAgainBtn(true);
      }
    }

    this.particles.update();
  }

  // --- State: fireworks ---
  updateFireworks() {
    this.fireworkTimer++;
    this.chatBubble.timer++;

    // Launch a new firework every 40-60 frames
    if (this.fireworkTimer % 50 === 0 || this.fireworkTimer === 1) {
      const launchX = this.castle.x + 20 + Math.random() * (this.castle.width - 40);
      const targetY = 20 + Math.random() * 80;
      this.fireworks.launch(launchX, targetY);
    }

    this.fireworks.update();
    this.particles.update();
  }

  _showPlayAgainBtn(visible) {
    const el = document.getElementById('play-again-container');
    if (el) el.style.display = visible ? 'block' : 'none';
  }

  onPlayAgain() {
    this.audio.stopMusic();
    this._showPlayAgainBtn(false);

    // Reset cutscene state
    this.boy = null;
    this.chatBubble = { visible: false, timer: 0 };
    this.fireworks = null;
    this.fireworkTimer = 0;
    this.bubbleWait = 0;
    this.stampTimer = 0;
    this.stampSoundPlayed = false;
    this.showMessageBtn = false;
    this.renderer.skyProgress = 0;

    // Reload level and restart
    this.loadLevel(level1);
    this.state = 'playing';
  }
}
