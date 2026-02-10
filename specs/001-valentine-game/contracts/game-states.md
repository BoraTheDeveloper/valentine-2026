# Game State Machine Contract

**Branch**: `001-valentine-game` | **Date**: 2026-02-10

## State Machine

```
[start] ---(tap start)---> [playing]
[playing] ---(player reaches flagpole)---> [castle]
[castle] ---(automatic)---> [flagRaise]
[flagRaise] ---(flag reaches top)---> [powerUpDrop]
[powerUpDrop] ---(player collects power-up)---> [message]
[message] --- (end state, no further transitions)

Side transitions during [playing]:
[playing] ---(player hits enemy)---> [respawn] ---(automatic)---> [playing]
```

## State Descriptions

### start
- Canvas shows title screen with valentine theme
- "Tap to Start" / "Press Enter" prompt
- Heart particles floating in background (ambient)
- No game entities active

### playing
- Game loop active: update + render every frame
- Player can move, jump, shoot
- Camera follows player
- HUD shows heart counter
- Enemies patrol, hearts float, projectiles fly

### respawn (sub-state of playing)
- Brief invincibility period (~2 seconds)
- Player teleported to level start or nearest checkpoint
- Visual flash/blink effect during invincibility
- Game state (collected hearts, defeated enemies) preserved

### castle
- Player has touched the flagpole
- Player input disabled (cinematic mode)
- Camera centers on castle/flagpole area
- Transition to flagRaise is immediate

### flagRaise
- Flag animates upward on the pole
- Duration: ~3 seconds
- Player stands at base of flagpole watching
- No input accepted

### powerUpDrop
- Glowing message power-up drops from castle top
- Falls with gravity, lands on ground near flagpole
- Player input re-enabled (must walk to collect)
- Power-up pulses with glow effect

### message
- Full-screen styled overlay appears over game
- Valentine message text displayed
- "Read the Message" button triggers overlay
- Hearts/particle effects around the message
- Game is effectively complete

## Input Contract

### Touch Controls (mobile)

```
Canvas Layout (landscape):
+-------------------------------------------+
|                                           |
|              GAME VIEWPORT                |
|                                           |
|  [LEFT]  [RIGHT]           [JUMP] [SHOOT] |
+-------------------------------------------+

Left zone:  x < canvas.width * 0.15
Right zone: x >= canvas.width * 0.15 AND x < canvas.width * 0.30
Jump zone:  x >= canvas.width * 0.70 AND y >= canvas.height * 0.50
Shoot zone: x >= canvas.width * 0.85 AND y >= canvas.height * 0.50
```

- Touch zones are invisible (no rendered buttons) — keeps viewport clean
- Semi-transparent button hints shown during first 5 seconds of gameplay, then fade out
- Multi-touch supported: player can move + jump + shoot simultaneously

### Keyboard Controls (desktop)

| Key | Action |
|-----|--------|
| Arrow Right | Move right |
| Arrow Left | Move left |
| Arrow Up | Jump |
| Spacebar | Shoot |
| Enter | Start game / Read message |

## Rendering Contract

### Draw Order (back to front)

1. Background gradient (sky)
2. Background decorations (clouds, hills — parallax optional)
3. Platforms / ground
4. Hearts (floating collectibles)
5. Enemies
6. Projectiles
7. Player character
8. Castle + flagpole + flag
9. Power-up (glowing)
10. Particles (explosions, collection effects)
11. HUD overlay (heart counter, top layer)

### Valentine Theme Palette

| Element | Color | Hex |
|---------|-------|-----|
| Sky gradient top | Soft pink | #FFB6C1 |
| Sky gradient bottom | Light coral | #FF7F7F |
| Ground/platforms | Warm brown | #8B4513 |
| Platform tops | Green (grass) | #4CAF50 |
| Hearts (collectible) | Red | #FF1744 |
| Hearts (projectile) | Hot pink | #FF69B4 |
| Enemy body | Purple | #9C27B0 |
| Castle stone | Gray | #9E9E9E |
| Castle roof | Dark red | #B71C1C |
| Flag | Red with heart | #E91E63 |
| Power-up glow | Gold | #FFD700 |
| Message overlay bg | Deep pink gradient | #FF1493 → #C2185B |
| Message text | White | #FFFFFF |
| HUD text | White with shadow | #FFFFFF |
