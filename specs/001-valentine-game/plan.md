# Implementation Plan: Valentine Game

**Branch**: `001-valentine-game` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-valentine-game/spec.md`

## Summary

Build a mobile-optimized, Mario-style 2D side-scrolling platformer webapp where the player controls a character that collects hearts, shoots heart projectiles at enemies, and reaches a castle with a flag-raising ceremony that reveals a personal valentine message. The game uses vanilla HTML5 Canvas with Vite as the build tool, targeting landscape orientation on mobile browsers with keyboard fallback on desktop.

## Technical Context

**Language/Version**: JavaScript (ES2022+), HTML5, CSS3
**Primary Dependencies**: Vite 6.x (build tool only — zero runtime dependencies)
**Storage**: N/A (no persistence required; single-session game)
**Testing**: Vitest (ships with Vite ecosystem)
**Target Platform**: Mobile web browsers (Safari iOS, Chrome Android) + desktop fallback
**Project Type**: Single-page web application
**Performance Goals**: 60 FPS on mid-range mobile devices; <3s initial load
**Constraints**: Bundle <250KB gzipped; landscape-only; no external image hosting
**Scale/Scope**: Single-level game, single player, ~5 min play session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Code Quality | Files <300 lines, single responsibility, self-documenting names | PASS — structure splits into engine/, entities/, graphics/, ui/ modules |
| I. Code Quality | Strict typing at module boundaries | PASS — JSDoc type annotations on all public interfaces; Vite supports type checking |
| I. Code Quality | Automated linting/formatting | PASS — ESLint + Prettier configured via Vite |
| II. Testing Standards | Integration test for primary happy path | PASS — Vitest with JSDOM for game loop and state transitions |
| II. Testing Standards | Deterministic tests, isolated data | PASS — game state is pure; no shared mutable test fixtures |
| III. UX Consistency | Design system (color, spacing, interaction) | PASS — valentine theme palette defined; touch controls follow mobile game conventions |
| III. UX Consistency | Loading/empty/error states designed | PASS — start screen, portrait-rotate prompt, respawn handling |
| III. UX Consistency | 100ms input feedback | PASS — Canvas game loop at 60 FPS = 16ms per frame; input processed every frame |
| III. UX Consistency | WCAG 2.1 AA / keyboard navigable | PARTIAL — game canvas is visual-only by nature; keyboard controls support desktop; start/message screens use semantic HTML |
| IV. Performance | LCP <2.5s | PASS — single HTML + JS bundle; no external assets |
| IV. Performance | Bundle <250KB gzipped | PASS — estimated 80-120KB gzipped (vanilla JS, embedded pixel art, no frameworks) |
| IV. Performance | No memory leaks | PASS — object pooling for projectiles/particles; no dynamic allocation in game loop |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| WCAG 2.1 AA partial compliance for Canvas game | Canvas-based games cannot fully satisfy screen-reader requirements for real-time gameplay | Non-canvas (DOM-based) game would not achieve 60 FPS target on mobile. Semantic HTML is used for all non-gameplay UI (start screen, message overlay, orientation prompt). |

## Project Structure

### Documentation (this feature)

```text
specs/001-valentine-game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── game-states.md   # Game state machine contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.js              # Entry point: canvas setup, game init
├── engine/
│   ├── Game.js          # Game loop, state machine, scene management
│   ├── Input.js         # Touch + keyboard input manager
│   ├── Camera.js        # Viewport scrolling, player tracking
│   ├── Physics.js       # Gravity, AABB collision detection
│   └── Audio.js         # Web Audio API procedural sounds
├── entities/
│   ├── Player.js        # Player character (movement, jump, shoot)
│   ├── Enemy.js         # Enemy behavior (patrol pattern)
│   ├── Heart.js         # Floating heart collectible
│   ├── Projectile.js    # Heart projectile (pooled)
│   ├── Castle.js        # Castle structure + flag animation
│   └── PowerUp.js       # Message power-up drop
├── graphics/
│   ├── Renderer.js      # Canvas drawing coordination, culling
│   ├── sprites.js       # Pixel art data URIs + Canvas shape drawing
│   └── particles.js     # Simple particle effects (pooled)
├── levels/
│   └── level1.js        # Level layout data (platforms, enemies, hearts)
├── ui/
│   ├── StartScreen.js   # Title/start screen
│   ├── HUD.js           # Heart counter, in-game UI
│   ├── MessageOverlay.js # Valentine message display
│   └── OrientationPrompt.js # Portrait-to-landscape prompt
└── styles/
    └── main.css         # Canvas sizing, UI overlays, orientation media queries

tests/
├── engine/
│   ├── Game.test.js     # Game state transitions
│   ├── Input.test.js    # Input mapping
│   └── Physics.test.js  # Collision detection
├── entities/
│   ├── Player.test.js   # Movement, jump physics, shooting
│   └── Enemy.test.js    # Patrol behavior
└── integration/
    └── gameplay.test.js # Full game flow: start → play → castle → message

index.html               # Single page entry with <canvas>
vite.config.js           # Vite configuration
package.json             # Vite + Vitest dev dependencies only
```

**Structure Decision**: Single project (Option 1 adapted). This is a purely client-side game with no backend — all code lives under `src/` with a clear engine/entities/graphics/ui separation. Tests mirror the src structure.
