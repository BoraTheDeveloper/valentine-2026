# Tasks: Valentine Cutscene & Message Enhancement

**Input**: Design documents from `/specs/002-valentine-cutscene/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/game-states.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. User stories 1-2 focus on the message overlay (HTML/CSS phase), while stories 3-5 focus on the canvas cutscene. All stories are P1 and must be implemented sequentially since each state auto-advances to the next.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No new project setup needed — this feature builds on the existing game. This phase covers shared infrastructure changes that multiple stories depend on.

- [x] T001 Add HTML message overlay structure (valentine-overlay, valentine-panel, valentine-text, valentine-question, valentine-buttons, valentine-stamp) to index.html per contracts/game-states.md
- [x] T002 [P] Add CSS styles for valentine overlay: .valentine-panel (pink gradient, rounded corners, centered, responsive), .valentine-text (Georgia/serif font, white, clean rendering), .valentine-question (larger decorative font, warm gold/rose color), .valentine-buttons (two styled buttons), .valentine-stamp (positioned bottom-right, red border #E91E63), @keyframes stamp-slam animation in src/styles/main.css
- [x] T003 [P] Add sunset sky support to Renderer: add skyProgress property (default 0.0), sunset color constants (#4A0E2E top, #FF6B35 bottom), modify clear() to lerp between daytime and sunset gradients based on skyProgress in src/graphics/Renderer.js

**Checkpoint**: HTML overlay exists but is hidden. Renderer supports sunset sky when skyProgress is set. CSS animations ready.

---

## Phase 2: Foundational

**Purpose**: New entities and sprite functions that multiple cutscene states depend on.

- [x] T004 [P] Create BoyCharacter entity class with x, y, width (32), height (32), velocityX, facing, walking, animFrame, animTimer properties and update() method that walks left and animates in src/entities/BoyCharacter.js
- [x] T005 [P] Add drawBoyCharacter(ctx, boy) sprite function using blue color scheme (hat #1565C0, tunic #42A5F5, same structure as drawPlayer but blue) in src/graphics/sprites.js
- [x] T006 [P] Add drawChatBubble(ctx, x, y, heartScale) function that draws a white rounded-rect bubble with triangle pointer and a pulsing heart inside using drawHeart() in src/graphics/sprites.js
- [x] T007 [P] Create Fireworks class with its own particle pool (~100 particles), launch(x, y, color) method, update() for launch/burst phases, render(ctx) for drawing trails and burst particles, and FIREWORK_COLORS array in src/graphics/Fireworks.js
- [x] T008 [P] Add stampSlam() method (triangle oscillator, 100 Hz, 0.15s, volume 0.2) and fireworkBurst() method (sine whistle 300→800 Hz + detuned burst) to Audio class in src/engine/Audio.js

**Checkpoint**: All new entities, sprites, and systems are available for use by the cutscene states.

---

## Phase 3: User Story 1 — Styled Valentine Message with Question (Priority: P1) 🎯 MVP

**Goal**: Replace the canvas-drawn MessageOverlay with an HTML/CSS overlay that renders crisp text. The question "May I be your valentine?" appears below the paragraph with romantic styling. Two buttons "Yes" and "yes" are shown.

**Independent Test**: Open the game, reach the power-up, tap "Read the Message", verify the overlay shows clean non-pixelated text, the styled question, and two buttons.

### Implementation for User Story 1

- [x] T009 [US1] Rewrite MessageOverlay class to manage the HTML overlay (#valentine-overlay) instead of canvas drawing: show() makes overlay visible with fade-in, update() animates floating hearts via CSS or minimal JS, hide() fades out and hides overlay in src/ui/MessageOverlay.js
- [x] T010 [US1] Update the valentine paragraph text in index.html to remove the closing question "darling, may I be your valentine?" — that text now only appears in the .valentine-question element
- [x] T011 [US1] Wire the HTML overlay button clicks in src/main.js: both .valentine-btn buttons call game.onValentineAccept() when clicked
- [x] T012 [US1] Update Game.js to use the rewritten MessageOverlay: onReadMessage() now calls messageOverlay.show() which shows the HTML overlay; add onValentineAccept() method that transitions from 'message' state to 'stamp' state in src/engine/Game.js

**Checkpoint**: Message overlay shows clean text, styled question, and two buttons. Clicking either button triggers acceptance.

---

## Phase 4: User Story 2 — Stamp of Approval Animation (Priority: P1)

**Goal**: After clicking Yes/yes, a rubber-stamp animation slams onto the bottom-right of the message with the word "Yes". After a brief pause, the overlay closes.

**Independent Test**: Click either button on the message overlay, observe stamp animation slam down, hear stamp sound, overlay fades out.

### Implementation for User Story 2

- [x] T013 [US2] Add stamp animation logic to MessageOverlay: showStamp() removes .hidden from .valentine-stamp, adds .stamp-animate class to trigger CSS animation, hides buttons in src/ui/MessageOverlay.js
- [x] T014 [US2] Add updateStamp() state handler in Game.js: plays audio.stampSlam() on entry, waits ~1.5s (90 frames), then calls messageOverlay.hide() and transitions to 'sunset' state in src/engine/Game.js
- [x] T015 [US2] Ensure onValentineAccept() in Game.js calls messageOverlay.showStamp() and sets state to 'stamp' in src/engine/Game.js

**Checkpoint**: Full message → stamp → close flow works with sound effect.

---

## Phase 5: User Story 3 — Sunset Sky Transition (Priority: P1)

**Goal**: After the message closes, the sky smoothly transitions from pink daytime to warm sunset/evening colors over ~2.5 seconds.

**Independent Test**: After stamp completes, observe sky gradient smoothly shifting from pink to deep plum/orange over ~2.5 seconds.

### Implementation for User Story 3

- [x] T016 [US3] Add updateSunset() state handler in Game.js: increment renderer.skyProgress by 1/150 per frame (~2.5s at 60fps), transition to 'walkToMeet' when skyProgress >= 1.0 in src/engine/Game.js

**Checkpoint**: Sky transitions smoothly from daytime to sunset palette.

---

## Phase 6: User Story 4 — Character Meeting Cutscene (Priority: P1)

**Goal**: Male character walks out of the castle toward the stationary girlfriend. When they meet, a chat bubble with beating heart appears above them.

**Independent Test**: After sunset completes, male character walks from castle to player, they face each other, chat bubble with pulsing heart appears.

### Implementation for User Story 4

- [x] T017 [US4] Add updateWalkToMeet() state handler in Game.js: create BoyCharacter at castle door position (x=3800, y=GROUND_Y-32), set walking=true with velocityX=-2; keep player stationary facing right; each frame update boy position and animation in src/engine/Game.js
- [x] T018 [US4] Add meeting detection in updateWalkToMeet(): when boy.x is within 40px of player.x, stop boy (walking=false, facing='left'), show chatBubble (set this.chatBubble = {visible: true, timer: 0}), start 2-second timer before transitioning to 'fireworks' state in src/engine/Game.js
- [x] T019 [US4] Add cutscene rendering in Game.js render method: when in walkToMeet or fireworks state, draw BoyCharacter using drawBoyCharacter(ctx, this.boy), draw chat bubble using drawChatBubble(ctx, midX, bubbleY, heartScale) with pulsing heartScale = 1 + 0.15 * Math.sin(timer) in src/engine/Game.js

**Checkpoint**: Boy walks to girlfriend, they meet, beating heart bubble appears.

---

## Phase 7: User Story 5 — Fireworks Celebration (Priority: P1)

**Goal**: Fireworks launch from behind the castle, burst into colorful particles. Characters and chat bubble remain visible. Fireworks loop indefinitely.

**Independent Test**: After meeting cutscene, fireworks launch from behind castle with burst effects and sound, continuing indefinitely.

### Implementation for User Story 5

- [x] T020 [US5] Add updateFireworks() state handler in Game.js: create Fireworks instance if not exists, launch new firework every ~40-60 frames from random x near castle (x=3700-3850) with random FIREWORK_COLORS color, call fireworks.update(), play audio.fireworkBurst() on each burst, keep chat bubble heart pulsing in src/engine/Game.js
- [x] T021 [US5] Add fireworks rendering in Game.js render method: when in 'fireworks' state, call this.fireworks.render(ctx) after drawing platforms but before HUD, continue drawing boy character and chat bubble in src/engine/Game.js
- [x] T022 [US5] Ensure camera is positioned to show the castle area and both characters during walkToMeet and fireworks states (override camera.follow to frame the scene) in src/engine/Game.js

**Checkpoint**: Fireworks launch, burst with sound, characters and bubble visible, loops forever.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Integration testing, cleanup, and final adjustments.

- [x] T023 Wire all new game states into the main Game.js update/render dispatch: ensure 'stamp', 'sunset', 'walkToMeet', 'fireworks' states are handled in the update() and render() switch/if-chain in src/engine/Game.js
- [x] T024 Remove old canvas-drawn MessageOverlay render call from Game.js render method (the HTML overlay replaces it) in src/engine/Game.js
- [x] T025 [P] Verify message overlay is responsive: test on narrow (375px) and wide (1024px) viewports, ensure text doesn't overflow and buttons are tappable in index.html + src/styles/main.css
- [x] T026 [P] Performance check: ensure fireworks maintain 60fps on mobile — verify particle pool doesn't grow unbounded, old fireworks are recycled in src/graphics/Fireworks.js
- [x] T027 Run quickstart.md validation checklist (12 items) against the running game

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Can run in parallel with Phase 1 (different files)
- **US1 (Phase 3)**: Depends on T001, T002 (HTML/CSS overlay)
- **US2 (Phase 4)**: Depends on US1 completion (stamp requires overlay to exist)
- **US3 (Phase 5)**: Depends on T003 (sunset renderer) and US2 (stamp→sunset transition)
- **US4 (Phase 6)**: Depends on T004-T006 (boy character, sprites) and US3 (sunset→walk transition)
- **US5 (Phase 7)**: Depends on T007-T008 (fireworks, audio) and US4 (walk→fireworks transition)
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

These stories are **sequential** (each state auto-advances to the next):

```
US1 (message) → US2 (stamp) → US3 (sunset) → US4 (walkToMeet) → US5 (fireworks)
```

However, the underlying **entities and systems** (Phase 2) can be built in parallel before any story work begins.

### Within Each User Story

- Entities/sprites before Game.js state handlers
- State handlers before render integration
- Each story is a complete game state transition

### Parallel Opportunities

```
Phase 1 + Phase 2 can run in parallel:
  T001 (HTML)  ║  T004 (BoyCharacter.js)
  T002 (CSS)   ║  T005 (drawBoyCharacter)
  T003 (Renderer) ║  T006 (drawChatBubble)
               ║  T007 (Fireworks.js)
               ║  T008 (Audio methods)

Within Phase 2, ALL tasks (T004-T008) are parallelizable.
```

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks in parallel (all different files):
Task: "Create BoyCharacter entity in src/entities/BoyCharacter.js"
Task: "Add drawBoyCharacter to src/graphics/sprites.js"
Task: "Add drawChatBubble to src/graphics/sprites.js"  # same file as above — serialize with T005
Task: "Create Fireworks system in src/graphics/Fireworks.js"
Task: "Add audio methods to src/engine/Audio.js"
```

Note: T005 and T006 target the same file (sprites.js) — serialize them or combine into one task.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: HTML overlay + CSS + sunset renderer
2. Complete Phase 2: BoyCharacter, sprites, Fireworks, Audio
3. Complete Phase 3: US1 — styled message with buttons
4. **STOP and VALIDATE**: Message overlay renders crisp text with question and buttons

### Incremental Delivery

1. Setup + Foundational → All building blocks ready
2. US1 → Clean message overlay → Validate
3. US2 → Stamp animation → Validate (message→stamp flow)
4. US3 → Sunset transition → Validate (stamp→sunset flow)
5. US4 → Character meeting → Validate (sunset→walk flow)
6. US5 → Fireworks → Validate (walk→fireworks flow, terminal state)
7. Polish → Performance, responsiveness, full playthrough

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Stories are sequential (each state feeds the next) but foundational work is parallel
- Commit after each phase or logical group
- The HTML message overlay replaces the canvas-drawn one entirely — remove old render calls
- Fireworks particle pool must be bounded to maintain 60fps
