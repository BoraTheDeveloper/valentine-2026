# Data Model: Valentine Game

**Branch**: `001-valentine-game` | **Date**: 2026-02-10

## Overview

All data is in-memory only. No persistence layer. Entities are JavaScript objects managed by the game loop. This document defines the shape of each entity and the game state.

## Game State

```
GameState {
  phase: "start" | "playing" | "castle" | "flagRaise" | "powerUpDrop" | "message"
  heartsCollected: number (0+)
  playerAlive: boolean
  levelComplete: boolean
  camera: Camera
  entities: Entity[]
}
```

## Entities

### Player

```
Player {
  x: number              // world position (pixels)
  y: number              // world position (pixels)
  width: 32              // hitbox width
  height: 32             // hitbox height
  velocityX: number      // horizontal speed (pixels/frame)
  velocityY: number      // vertical speed (pixels/frame, positive = down)
  grounded: boolean      // true when standing on platform
  facing: "right"        // always faces right (side-scroller)
  animationFrame: number // current sprite frame index
  animationTimer: number // time since last frame change
  shootCooldown: number  // frames remaining before can shoot again
}
```

**State transitions**: alive → hit by enemy → respawn at level start (or checkpoint)

### Heart Collectible

```
Heart {
  x: number
  y: number
  width: 24
  height: 24
  collected: boolean     // once true, not rendered or collidable
  bobOffset: number      // vertical oscillation for floating effect
}
```

**State transitions**: uncollected → player contact → collected (permanent)

### Heart Projectile (pooled)

```
Projectile {
  x: number
  y: number
  width: 16
  height: 16
  velocityX: number      // always positive (travels right)
  active: boolean        // false = available in pool for reuse
}
```

**State transitions**: inactive (in pool) → fired → hits enemy OR exits screen → inactive (returned to pool)

**Pool size**: 10 pre-allocated projectiles. If all active, oldest is recycled.

### Enemy

```
Enemy {
  x: number
  y: number
  width: 32
  height: 32
  velocityX: number      // patrol speed (alternates sign at boundaries)
  patrolMinX: number     // left boundary of patrol
  patrolMaxX: number     // right boundary of patrol
  alive: boolean         // false after hit by projectile
  animationFrame: number
  animationTimer: number
}
```

**State transitions**: alive + patrolling → hit by projectile → defeated (with particle effect) → removed

### Castle

```
Castle {
  x: number              // world position (left edge)
  y: number              // world position (bottom edge, on ground)
  width: 128
  height: 160
}
```

**No state transitions** — static level element.

### Flagpole

```
Flagpole {
  x: number              // world position (attached to castle)
  y: number              // top of pole
  height: 128            // pole height
  flagY: number          // current flag vertical position (starts at bottom)
  flagTargetY: number    // top of pole (animation target)
  raising: boolean       // true during flag-raise animation
  raised: boolean        // true once flag reaches top
}
```

**State transitions**: idle → player touches pole → raising → raised (triggers power-up drop)

### Message Power-Up

```
PowerUp {
  x: number
  y: number
  width: 32
  height: 32
  velocityY: number      // drops from castle (gravity)
  visible: boolean       // false until flag fully raised
  collected: boolean     // triggers message button
  glowTimer: number      // pulsing glow animation counter
}
```

**State transitions**: hidden → flag raised → drops from castle (gravity) → lands → player collects → collected

## Camera

```
Camera {
  x: number              // left edge of viewport in world space
  y: number              // top edge (typically 0 for flat level)
  width: number          // canvas width
  height: number         // canvas height
}
```

**Behavior**: `camera.x = clamp(player.x - width/2, 0, levelWidth - width)`

## Level Data

```
Level {
  width: number          // total level width in pixels
  height: number         // level height (fixed, matches canvas height)
  platforms: Platform[]  // solid ground/blocks
  hearts: Heart[]        // collectible positions
  enemies: Enemy[]       // enemy spawn positions + patrol ranges
  castle: Castle         // end-of-level position
  flagpole: Flagpole     // attached to castle
  playerStart: {x, y}   // spawn/respawn position
}

Platform {
  x: number
  y: number
  width: number
  height: number
  type: "ground" | "block" | "floating"
}
```

## Input State

```
InputState {
  moveRight: boolean     // touch zone or arrow right key
  moveLeft: boolean      // touch zone or arrow left key (optional)
  jump: boolean          // touch zone or arrow up key
  shoot: boolean         // touch zone or spacebar
}
```

Polled every frame. Touch and keyboard both write to the same InputState.
