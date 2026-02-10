# Data Model: Valentine Cutscene & Message Enhancement

## Entities

### BoyCharacter

Represents the male character that walks out of the castle during the cutscene.

| Field      | Type    | Description                                        |
|------------|---------|----------------------------------------------------|
| x          | number  | Current x position (world space)                   |
| y          | number  | Current y position (world space)                   |
| width      | number  | Hitbox width (32)                                  |
| height     | number  | Hitbox height (32)                                 |
| velocityX  | number  | Horizontal speed (negative = walking left)         |
| facing     | string  | 'left' or 'right'                                  |
| walking    | boolean | Whether the character is currently walking          |
| animFrame  | number  | Current animation frame (0-3)                      |
| animTimer  | number  | Frame counter for animation cycling                |

**Lifecycle**: Created when cutscene begins (walkToMeet state). Starts at castle door x position. Walks left toward the player. Stops when reaching target x. Persists through fireworks state.

### Firework

Represents a single firework in the celebration system.

| Field      | Type    | Description                                         |
|------------|---------|-----------------------------------------------------|
| x          | number  | Current x position                                  |
| y          | number  | Current y position                                  |
| velocityY  | number  | Upward velocity (negative, decelerates)             |
| targetY    | number  | Y position at which to burst                        |
| color      | string  | Hex color for this firework's burst                 |
| phase      | string  | 'launch' or 'burst' or 'done'                      |
| particles  | array   | Array of burst particle objects                     |
| timer      | number  | Frame counter for burst duration                    |

**Lifecycle**: Created by FireworkLauncher at staggered intervals. Launches upward, bursts at targetY, particles decay, marked as done for reuse.

### FireworkParticle (sub-entity of Firework burst)

| Field   | Type   | Description                        |
|---------|--------|------------------------------------|
| x       | number | Current x position                 |
| y       | number | Current y position                 |
| vx      | number | Velocity x (radial from burst)     |
| vy      | number | Velocity y (radial + gravity)      |
| life    | number | Remaining life (1.0 → 0.0)        |
| color   | string | Hex color (inherited from parent)  |
| size    | number | Radius in pixels                   |

### SkyState (extension of Renderer)

| Field       | Type   | Description                                    |
|-------------|--------|------------------------------------------------|
| progress    | number | 0.0 (daytime) to 1.0 (sunset), default 0.0    |
| daySky1     | string | Top gradient color for daytime (#FFB6C1)       |
| daySky2     | string | Bottom gradient color for daytime (#FF7F7F)    |
| sunsetSky1  | string | Top gradient color for sunset (#4A0E2E)        |
| sunsetSky2  | string | Bottom gradient color for sunset (#FF6B35)     |

**Lifecycle**: Progress remains 0.0 during gameplay. Transitions to 1.0 during sunset state. Remains at 1.0 for walkToMeet and fireworks states.

### ChatBubble (rendered entity, no class needed)

| Field      | Type    | Description                                     |
|------------|---------|-------------------------------------------------|
| x          | number  | Center x (midpoint between two characters)      |
| y          | number  | Y position above characters' heads              |
| visible    | boolean | Whether to render                               |
| heartScale | number  | Pulsing heart scale (sine-based)                |
| timer      | number  | Animation timer for pulse                       |

**Note**: Simple enough to be managed as properties on the Game instance rather than a separate class.

### StampAnimation (managed by HTML/CSS)

| Field    | Type    | Description                                        |
|----------|---------|----------------------------------------------------|
| visible  | boolean | Whether stamp element is shown                     |
| animated | boolean | Whether CSS animation has been triggered            |

**Note**: Managed entirely via CSS classes on an HTML element. No JS animation loop needed.

## State Transitions

```
existing states:
  start → playing → castle → flagRaise → powerUpDrop → message

new states (after message):
  message → stamp → sunset → walkToMeet → fireworks

  stamp:      Stamp CSS animation plays (~1s), then auto-advance
  sunset:     Sky lerps from 0→1 over ~150 frames (~2.5s), then auto-advance
  walkToMeet: Boy walks from castle to player (~3-4s), bubble appears, then auto-advance
  fireworks:  Fireworks loop indefinitely (terminal state)
```
