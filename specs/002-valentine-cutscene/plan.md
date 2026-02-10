# Implementation Plan: Valentine Cutscene & Message Enhancement

**Branch**: `002-valentine-cutscene` | **Date**: 2026-02-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-valentine-cutscene/spec.md`

## Summary

Enhance the post-game experience with a polished valentine message overlay (HTML/CSS instead of canvas text), acceptance interaction with stamp animation, sunset sky transition, character meeting cutscene with chat bubble, and fireworks celebration. The message overlay moves from canvas-rendered text to an HTML overlay for crisp typography. The cutscene introduces new game states that chain automatically after the player accepts the valentine proposal.

## Technical Context

**Language/Version**: JavaScript ES2022+, HTML5, CSS3
**Primary Dependencies**: Vite 7.x (dev only), zero runtime dependencies
**Storage**: N/A
**Testing**: Vitest (available but minimal coverage currently)
**Target Platform**: Mobile browsers (landscape), desktop browsers
**Project Type**: Single project — vanilla JS game with HTML5 Canvas
**Performance Goals**: 60 fps on mobile devices during all cutscene phases including fireworks
**Constraints**: No external fonts/images; procedural audio via Web Audio API; internal canvas resolution 568x320
**Scale/Scope**: Single-player game, one level, ~20 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality | PASS | New files follow single-responsibility (CutsceneManager, Firework, etc.). Existing files modified minimally. No file will exceed 300 lines. |
| II. Testing Standards | PARTIAL | Canvas game with procedural animations is difficult to unit-test meaningfully. State transitions can be tested. |
| III. UX Consistency | PASS | Uses existing Valentine color palette. HTML overlay follows same pink/gold theme. Immediate visual feedback on button press (stamp). |
| IV. Performance | PASS | Firework particles reuse existing ParticleSystem pool pattern. Sky transition is a simple gradient lerp. No heavy allocations in render loop. |

**Quality Gates**:
- Lint & Format: DEFERRED (not yet configured in project — carried from feature 001)
- Type Check: N/A (vanilla JS, no TypeScript)
- Test Suite: State transition tests recommended
- Performance Budget: 60fps target; fireworks must not allocate per-frame
- Accessibility Scan: PARTIAL — real-time canvas game inherently limited; HTML overlay buttons are accessible
- Code Review: Solo developer project

## Project Structure

### Documentation (this feature)

```text
specs/002-valentine-cutscene/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── game-states.md   # Cutscene state machine and transitions
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── engine/
│   ├── Game.js              # MODIFY: Add cutscene states, sky transition logic
│   ├── Audio.js             # MODIFY: Add stampSlam() and fireworkBurst() methods
│   ├── Camera.js            # No changes
│   ├── Input.js             # No changes
│   └── Physics.js           # No changes
├── entities/
│   ├── Player.js            # No changes
│   ├── Heart.js             # No changes
│   ├── Projectile.js        # No changes
│   ├── Enemy.js             # No changes
│   ├── Castle.js            # No changes
│   ├── PowerUp.js           # No changes
│   └── BoyCharacter.js      # NEW: Male character entity (walk, face direction)
├── graphics/
│   ├── Renderer.js          # MODIFY: Support sunset sky gradient with lerp parameter
│   ├── sprites.js           # MODIFY: Add drawBoyCharacter(), drawChatBubble()
│   ├── particles.js         # No changes (reuse existing pool for fireworks)
│   └── Fireworks.js         # NEW: Firework launcher system (uses ParticleSystem)
├── levels/
│   └── level1.js            # No changes
├── ui/
│   ├── MessageOverlay.js    # MAJOR REWRITE: Move to HTML/CSS overlay with buttons, stamp
│   ├── StartScreen.js       # No changes
│   └── HUD.js               # No changes
├── styles/
│   └── main.css             # MODIFY: Add message overlay styles, stamp animation CSS
└── main.js                  # MODIFY: Wire HTML overlay events to game
index.html                   # MODIFY: Add message overlay HTML structure
```

**Structure Decision**: Follows existing single-project structure. Two new files (BoyCharacter.js, Fireworks.js) follow the established entity/graphics pattern. MessageOverlay transitions from canvas-only to HTML/CSS hybrid.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| WCAG 2.1 AA partial compliance | Real-time Canvas game with procedural animations cannot be fully screen-reader accessible | Static alternative would defeat the purpose of an interactive game experience. HTML overlay buttons for the acceptance flow ARE accessible. |
| Testing Standards partial | Canvas animation sequences (stamp, fireworks, sky lerp) produce visual output that requires visual inspection rather than automated assertions | State machine transitions and entity logic can still be unit-tested; visual QA done manually |
