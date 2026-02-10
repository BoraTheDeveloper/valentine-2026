# Feature Specification: Valentine Game

**Feature Branch**: `001-valentine-game`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Build a mobile-optimized webapp — a Mario/Rambo-style side-scrolling game where the player collects hearts, shoots heart projectiles at enemies, and reaches a castle with a flag-raising ceremony that reveals a personal valentine message."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play Through the Game (Priority: P1)

The player opens the game on their phone, taps to start, and controls a character that runs through a side-scrolling level. The character jumps over obstacles, collects floating hearts (like Mario coins), and shoots heart-shaped projectiles ("the power of love") at enemies. The level ends at a castle with a flagpole.

**Why this priority**: This is the core gameplay loop — without it, nothing else matters. The entire experience depends on the game being playable and fun.

**Independent Test**: Can be fully tested by loading the game URL on a mobile device, tapping start, and playing through the level from start to finish — collecting hearts, defeating enemies, and reaching the castle.

**Acceptance Scenarios**:

1. **Given** the game is loaded, **When** the player taps the start button, **Then** the game begins with the character on screen and the level scrolling.
2. **Given** the game is running, **When** the player taps the jump control, **Then** the character jumps with gravity physics and lands back down.
3. **Given** the game is running, **When** the player taps the shoot control, **Then** the character fires a heart-shaped projectile forward.
4. **Given** a heart projectile hits an enemy, **When** the collision is detected, **Then** the enemy is defeated with a visual effect.
5. **Given** the character overlaps a floating heart collectible, **When** the collision is detected, **Then** the heart is collected with a visual/audio cue and the heart counter increments.
6. **Given** the character reaches the castle, **When** they touch the flagpole, **Then** the flag-raising sequence begins.

---

### User Story 2 - Castle Flag Ceremony and Message Reveal (Priority: P1)

After reaching the castle, the player watches a flag slowly rise to the top of the pole. Once the flag reaches the top, a glowing "message power-up" item drops out of the castle. The player collects it, and a button appears to "Read the Message."

**Why this priority**: This is the emotional payoff — the entire game leads to this moment. It is equally critical as the gameplay itself.

**Independent Test**: Can be tested by triggering the castle sequence directly — verify the flag rises, the power-up drops, collection works, and the button appears.

**Acceptance Scenarios**:

1. **Given** the character touches the flagpole, **When** the flag-raising animation plays, **Then** the flag rises smoothly from bottom to top of the pole.
2. **Given** the flag has fully risen, **When** the animation completes, **Then** a glowing message power-up item drops from the castle.
3. **Given** the power-up is on screen, **When** the player's character collects it, **Then** a "Read the Message" button appears on screen.

---

### User Story 3 - Display the Valentine Message (Priority: P1)

When the player taps "Read the Message," a beautiful overlay appears displaying the personal valentine message with romantic styling. The message reads:

"Happy valentine sweetie, i made this game just for you, unique to you, just like my love for you. i hope you have fun playing this game because it was made with lovee duhhh. althought it's quite near to valentine day, i hope i didn't come too late to ask you this question. darling, may I be your valentine?"

**Why this priority**: This is the entire purpose of the game — the valentine proposal. Without this, the game has no meaning.

**Independent Test**: Can be tested by tapping the "Read the Message" button and verifying the full message displays correctly with romantic styling.

**Acceptance Scenarios**:

1. **Given** the "Read the Message" button is visible, **When** the player taps it, **Then** a styled overlay appears with the valentine message.
2. **Given** the message overlay is displayed, **When** the player reads it, **Then** the full message text is visible without truncation and styled romantically (hearts, warm colors, elegant typography).

---

### Edge Cases

- What happens if the player dies or falls off-screen? The character respawns at the beginning of the level (or a nearby checkpoint) — this is a love game, no game-over screen needed.
- What happens if the player skips past enemies without defeating them? They can proceed — defeating enemies is optional fun, not required.
- What happens on very small screens (below 320px width)? The game scales down proportionally and remains playable.
- What happens if the player refreshes mid-game? The game restarts from the beginning.
- What happens if the player holds their phone in portrait? A friendly prompt appears asking them to rotate to landscape; the game pauses until orientation is correct.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a side-scrolling 2D game level in landscape orientation. If the device is in portrait mode, the system MUST display a prompt asking the player to rotate their phone (or auto-rotate if supported).
- **FR-002**: The player character MUST be controllable via on-screen touch controls (move right, jump, and shoot). On desktop, keyboard controls MUST be supported as a fallback (arrow keys to move/jump, spacebar to shoot); touch controls MUST be hidden on desktop.
- **FR-003**: The character MUST be able to jump with gravity-based physics (rise, peak, fall).
- **FR-004**: The character MUST fire heart-shaped projectiles when the shoot control is activated.
- **FR-005**: Heart projectiles MUST travel forward and defeat enemies on contact.
- **FR-006**: Floating heart collectibles MUST be scattered throughout the level and collected on contact.
- **FR-007**: A heart counter MUST be displayed on screen showing the number of hearts collected.
- **FR-008**: Enemies MUST appear in the level and move in simple patterns (e.g., walking back and forth).
- **FR-009**: Contact with an enemy (without shooting) MUST cause the character to respawn (no permanent death/game-over).
- **FR-010**: The level MUST end with a castle and a flagpole.
- **FR-011**: Touching the flagpole MUST trigger a flag-raising animation that moves the flag from bottom to top.
- **FR-012**: After the flag reaches the top, a glowing message power-up MUST drop from the castle.
- **FR-013**: Collecting the message power-up MUST display a "Read the Message" button.
- **FR-014**: Tapping "Read the Message" MUST display a styled overlay with the exact valentine message text provided by the user.
- **FR-015**: The game MUST be playable in a mobile web browser without requiring installation.
- **FR-016**: The game MUST include valentine-themed visuals (pink/red color palette, hearts, romantic atmosphere).

### Key Entities

- **Player Character**: The controllable avatar that runs, jumps, and shoots hearts. Has position, velocity, and animation state.
- **Heart Collectible**: Floating pickup items scattered in the level. Has position and collected/uncollected state.
- **Heart Projectile**: Fired by the player. Has position, velocity, and active/inactive state.
- **Enemy**: Hostile characters in the level. Has position, movement pattern, and alive/defeated state.
- **Castle & Flagpole**: End-of-level landmark. Flag has a vertical position (bottom to top) for the raising animation.
- **Message Power-Up**: Special item that drops from the castle after the flag ceremony. Has position and collected/uncollected state.

## Assumptions

- The game is a single-level experience (one level leading to the castle).
- No persistent save state or account system is needed — it is a one-time play experience.
- Audio/sound effects are a nice-to-have but not required for the core experience.
- The character uses player-controlled movement (Mario-style): the player holds/taps a move control to walk right, and can stop at any time. The camera follows the character.
- The valentine message text is hardcoded exactly as provided, including the casual spelling and tone (this is intentional and personal).
- The game targets modern mobile browsers (Safari on iOS, Chrome on Android).
- No multiplayer or leaderboard functionality is needed.

## Clarifications

### Session 2026-02-10

- Q: Movement model — auto-runner, player-controlled (Mario-style), or hybrid? → A: Player-controlled (Mario-style) — player holds/taps a move control to walk right, can stop at any time.
- Q: Game orientation — portrait, landscape, or both? → A: Landscape only. Show a rotate-phone prompt if device is in portrait mode.
- Q: Desktop keyboard support? → A: Yes — arrow keys to move/jump, spacebar to shoot. Touch controls hidden on desktop.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A player can complete the entire game (start to valentine message) in under 5 minutes on a mobile device.
- **SC-002**: The game loads and becomes playable within 3 seconds on a standard mobile connection.
- **SC-003**: Touch controls respond to input within 100 milliseconds with no perceptible lag.
- **SC-004**: The game runs at a smooth frame rate (no visible stuttering) on a mid-range mobile device.
- **SC-005**: The valentine message is fully readable without scrolling or truncation on screens 320px wide and larger.
- **SC-006**: 100% of first-time players can understand the controls and begin playing without instructions beyond on-screen prompts.
