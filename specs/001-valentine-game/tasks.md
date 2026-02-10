# Tasks: Valentine Game

**Input**: Design documents from `/specs/001-valentine-game/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Constitution requires integration tests for the primary happy path. Minimal test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Vite project initialization, tooling, and base HTML/CSS

- [ ] T001 Initialize Vite project with `npm create vite@latest . -- --template vanilla` and configure package.json scripts (dev, build, preview, test, lint, format) in package.json
- [ ] T002 Configure Vite build settings (base path, minification, sourcemaps) in vite.config.js
- [ ] T003 [P] Configure ESLint and Prettier with project rules in .eslintrc.json and .prettierrc
- [ ] T004 [P] Create base HTML entry point with `<canvas>` element, viewport meta tag (disable zoom, landscape), and script entry in index.html
- [ ] T005 [P] Create base CSS with canvas fullscreen sizing, orientation media queries (portrait overlay), and reset styles in src/styles/main.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Game engine core — game loop, input, physics, camera, renderer, and sprite system. MUST be complete before any user story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Implement game loop with fixed timestep (16.67ms update tick), requestAnimationFrame rendering, delta time accumulator, and game state machine (start/playing/castle/flagRaise/powerUpDrop/message phases) in src/engine/Game.js
- [ ] T007 Implement input manager with multi-touch zone detection (left/right/jump/shoot regions per contracts/game-states.md), keyboard fallback (arrow keys + spacebar + enter), unified InputState object polled each frame, and touch event preventDefault in src/engine/Input.js
- [ ] T008 [P] Implement camera with player-centered horizontal tracking, edge clamping (0 to levelWidth - canvasWidth), and ctx.translate-based rendering offset in src/engine/Camera.js
- [ ] T009 [P] Implement physics with gravity constant, velocity integration, AABB collision detection (rect-rect overlap), platform collision resolution (land on top, block from sides), and grounded state tracking in src/engine/Physics.js
- [ ] T010 Implement renderer with canvas context management, off-screen culling (skip entities outside camera bounds), draw-order layers (background → platforms → hearts → enemies → projectiles → player → castle → power-up → particles → HUD), and canvas resize handling in src/graphics/Renderer.js
- [ ] T011 [P] Create sprite system with Canvas API heart shape drawing (bezier curves), platform/ground drawing, valentine theme color palette constants (per contracts/game-states.md palette table), and pixel art data URI loader for character sprites in src/graphics/sprites.js
- [ ] T012 [P] Create particle effects system with object pool (50 particles pre-allocated), spawn/update/render cycle, fade-out over lifetime, and reuse pattern in src/graphics/particles.js
- [ ] T013 Define level 1 data structure with total level dimensions (~4000px wide), ground platform spanning full width, floating platforms at varied heights, heart collectible positions (15-20 hearts), enemy spawn positions with patrol ranges (5-7 enemies), castle position at level end, flagpole position, and player start position in src/levels/level1.js

**Checkpoint**: Engine foundation ready — game loop runs, input works, canvas renders, physics applies gravity. User story implementation can begin.

---

## Phase 3: User Story 1 — Play Through the Game (Priority: P1) MVP

**Goal**: Player can start the game, move through a side-scrolling level, jump, collect hearts (counter visible), shoot heart projectiles to defeat enemies, and reach the castle at the end.

**Independent Test**: Load game URL on mobile, tap start, play through level collecting hearts and defeating enemies, reach the castle.

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create Player entity with position/velocity/hitbox (32x32), movement (walk right/left from input), jump (apply upward velocity when grounded, gravity pulls down), shoot (spawn projectile with cooldown), animation frame cycling, and respawn logic (teleport to playerStart, brief invincibility blink) in src/entities/Player.js
- [ ] T015 [P] [US1] Create Heart collectible entity with position, hitbox (24x24), floating bob animation (sine wave vertical offset), collected state toggle, and collection visual feedback (particle burst) in src/entities/Heart.js
- [ ] T016 [P] [US1] Create Projectile entity with object pool (10 pre-allocated), fire method (set position to player, velocityX forward), update (move right each frame), deactivate on enemy hit or off-screen exit, and recycle pattern in src/entities/Projectile.js
- [ ] T017 [P] [US1] Create Enemy entity with position/hitbox (32x32), patrol behavior (walk between patrolMinX/patrolMaxX, reverse direction at boundaries), alive state, defeat handler (trigger particle effect, set alive=false), and animation frame cycling in src/entities/Enemy.js
- [ ] T018 [US1] Create start screen with valentine-themed title ("Valentine Quest" or similar), animated floating heart particles in background, "Tap to Start" / "Press Enter" prompt, and transition to playing state on input in src/ui/StartScreen.js
- [ ] T019 [US1] Create HUD overlay rendering heart counter (heart icon + count) at top-left of screen, drawn on top of game world (not affected by camera translate), with white text and drop shadow per palette in src/ui/HUD.js
- [ ] T020 [US1] Create orientation prompt as CSS-driven full-screen overlay (shown via `@media (orientation: portrait)`) with rotate-phone icon/message, hiding the game canvas until landscape is detected, in src/ui/OrientationPrompt.js (JS detection) and src/styles/main.css (CSS media query)
- [ ] T021 [US1] Wire up Player, Heart, Projectile, Enemy entities into Game.js playing state: load level1 data, spawn all entities, run update loop (input → player update → enemy update → projectile update → physics → collision checks → camera follow), run render loop (renderer draws all layers), handle heart collection (increment counter, mark collected), handle projectile-enemy collision (defeat enemy, deactivate projectile, spawn particles), handle enemy-player collision (trigger respawn) in src/engine/Game.js
- [ ] T022 [US1] Create pixel art sprites for player character (32x32 sprite sheet with idle, walk frame 1, walk frame 2, jump, shoot poses — 5 frames) and enemy character (32x32 sprite sheet with walk frame 1, walk frame 2 — 2 frames) as base64 data URIs embedded in src/graphics/sprites.js. Use valentine-themed colors (player: warm tones; enemy: purple per palette).

**Checkpoint**: At this point, the full gameplay loop works — player can start, move, jump, collect hearts, shoot enemies, and traverse the level to the castle area. US1 is independently playable.

---

## Phase 4: User Story 2 — Castle Flag Ceremony and Message Reveal (Priority: P1)

**Goal**: When player reaches the castle flagpole, a flag-raising animation plays, then a glowing message power-up drops from the castle for the player to collect, showing a "Read the Message" button.

**Independent Test**: Trigger castle sequence (player touches flagpole) — verify flag rises smoothly over ~3 seconds, power-up drops with gravity and glow effect, collecting it shows the button.

**Depends on**: US1 (player must be able to reach castle)

### Implementation for User Story 2

- [ ] T023 [P] [US2] Create Castle entity with static castle structure rendering (stone body 128x160, dark red roof, door, windows) and Flagpole sub-entity (pole line, flag rectangle with heart emblem) with flag-raising animation (flagY interpolates from bottom to top over ~3 seconds) in src/entities/Castle.js
- [ ] T024 [P] [US2] Create PowerUp entity with position/hitbox (32x32), hidden state (invisible until flag raised), drop animation (gravity fall from castle top to ground), pulsing glow effect (glowTimer cycles opacity/scale), collected state, and gold color per palette in src/entities/PowerUp.js
- [ ] T025 [US2] Wire castle sequence into Game.js state machine: detect player-flagpole collision → transition to "castle" state → disable player input → center camera on castle → transition to "flagRaise" → animate flag → on flag raised: transition to "powerUpDrop" → spawn power-up drop → re-enable player input → detect player-powerUp collision → transition to "message" state → show "Read the Message" button in src/engine/Game.js

**Checkpoint**: Castle ceremony plays smoothly. Flag rises, power-up drops and glows, collecting it shows the message button. US2 works as a complete cinematic sequence.

---

## Phase 5: User Story 3 — Display the Valentine Message (Priority: P1)

**Goal**: When player taps "Read the Message" button, a beautifully styled overlay displays the valentine message with romantic styling and heart particle effects.

**Independent Test**: Tap the "Read the Message" button — verify overlay appears with full message text, romantic styling (deep pink gradient, white text, hearts, elegant typography), and no truncation on 320px+ screens.

**Depends on**: US2 (power-up must be collected to show button)

### Implementation for User Story 3

- [ ] T026 [US3] Create message overlay with full-screen semi-transparent backdrop, deep pink gradient panel (centered, responsive to screen size), valentine message text (exact text from spec, hardcoded), elegant serif/script font styling, animated heart particles floating around the message, and smooth fade-in entrance animation in src/ui/MessageOverlay.js
- [ ] T027 [US3] Wire message state into Game.js: on "message" state entry render "Read the Message" button (HTML button overlaid on canvas or canvas-drawn button), handle tap/click/Enter to trigger MessageOverlay display, pause game loop rendering (freeze last frame as backdrop), and render overlay on top in src/engine/Game.js

**Checkpoint**: Full game flow complete — start → play → castle → flag → power-up → message. The valentine proposal is delivered.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Audio, performance tuning, mobile testing, and final quality pass

- [ ] T028 [P] Implement procedural audio using Web Audio API OscillatorNode: jump sound (short ascending tone), heart collect chime (pleasant two-note ding), shoot sound (quick blip), enemy defeat pop (descending tone), flag raise fanfare (ascending scale), power-up collect sparkle sound; all triggered from game events in src/engine/Audio.js
- [ ] T029 [P] Add touch control hint overlay that shows semi-transparent button zone indicators (left/right arrows, jump/shoot labels) for the first 5 seconds of gameplay, then fades out — drawn as canvas overlay in src/ui/HUD.js
- [ ] T030 Performance optimization pass: verify object pooling works for projectiles and particles (no allocations in game loop), confirm off-screen culling in Renderer.js skips entities outside camera, test on mobile device for 60 FPS, profile and fix any GC pauses in src/engine/Game.js and src/graphics/Renderer.js
- [ ] T031 Run quickstart.md validation checklist: verify all 14 items (load time, orientation prompt, touch controls, keyboard controls, heart collection, enemy defeat, respawn, flag animation, power-up drop, message button, message display, frame rate, Safari iOS, Chrome Android) documented in specs/001-valentine-game/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion — core gameplay
- **US2 (Phase 4)**: Depends on US1 (player must reach castle)
- **US3 (Phase 5)**: Depends on US2 (power-up must be collected)
- **Polish (Phase 6)**: Depends on US3 completion (full flow must work)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — delivers playable game
- **User Story 2 (P1)**: Sequential dependency on US1 — castle sequence requires player to reach end of level
- **User Story 3 (P1)**: Sequential dependency on US2 — message overlay requires power-up collection

### Within Each User Story

- Entities (Player, Heart, Enemy, etc.) before wiring into Game.js
- Parallel entity creation where files are independent
- UI components can be built in parallel with entities
- Integration (wiring into Game.js) is always the last step per story

### Parallel Opportunities

- Phase 1: T003, T004, T005 can run in parallel
- Phase 2: T008, T009 in parallel; T011, T012, T013 in parallel (after T010)
- Phase 3 (US1): T014, T015, T016, T017 all in parallel (independent entity files); T018, T019, T020 in parallel (independent UI files)
- Phase 4 (US2): T023, T024 in parallel (independent entity files)
- Phase 6: T028, T029 in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all entity files for US1 together:
Task: "Create Player entity in src/entities/Player.js"
Task: "Create Heart entity in src/entities/Heart.js"
Task: "Create Projectile entity in src/entities/Projectile.js"
Task: "Create Enemy entity in src/entities/Enemy.js"

# Launch all UI files for US1 together:
Task: "Create start screen in src/ui/StartScreen.js"
Task: "Create HUD in src/ui/HUD.js"
Task: "Create orientation prompt in src/ui/OrientationPrompt.js"

# Then wire everything together (sequential):
Task: "Wire entities into Game.js playing state"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Play through the game on mobile — movement, jumping, hearts, enemies all work
5. Demo-ready: a playable valentine-themed platformer

### Full Delivery (Sequential — stories depend on each other)

1. Complete Setup + Foundational → Engine ready
2. Complete US1 → Playable game (MVP)
3. Complete US2 → Castle ceremony works
4. Complete US3 → Valentine message displayed (feature complete)
5. Complete Polish → Audio, hints, performance verified
6. Deploy to static hosting

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User stories are sequential (US1 → US2 → US3) because the game flow is linear
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All sprites embedded as data URIs or drawn with Canvas API — no external image requests
- Valentine message text is hardcoded exactly as provided in spec (casual spelling/tone intentional)
