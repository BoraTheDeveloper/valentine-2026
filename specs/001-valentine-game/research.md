# Research: Valentine Game

**Branch**: `001-valentine-game` | **Date**: 2026-02-10

## R1: Game Loop Pattern

**Decision**: Fixed timestep with variable rendering using `requestAnimationFrame`

**Rationale**: Physics updates run at a fixed 60 FPS interval (16.67ms) while rendering runs as fast as hardware allows. An accumulator pattern tracks delta time and processes fixed-size update chunks. Leftover time is passed to the renderer for interpolation, eliminating visual stuttering. `requestAnimationFrame` automatically throttles inactive tabs (battery-friendly) and syncs with display refresh rate.

**Alternatives considered**:
- `setInterval`-based loop — rejected: not synced with display, causes tearing, terrible for battery
- Variable timestep — rejected: physics become non-deterministic; collision bugs at low FPS

## R2: Rendering Approach

**Decision**: Single HTML5 Canvas with 2D context

**Rationale**: Canvas 2D is universally supported on mobile browsers, hardware-accelerated via GPU compositor, and perfectly suited for a simple 2D platformer. A single canvas layer is recommended on mobile (multiple canvases cause compositing overhead).

**Alternatives considered**:
- WebGL — rejected: overkill for 2D sprites; adds complexity without performance benefit at this scale
- DOM-based rendering — rejected: cannot achieve 60 FPS with many moving elements on mobile
- Multiple canvas layers — rejected: mobile GPU compositing overhead outweighs any batching benefit

## R3: Touch Input Strategy

**Decision**: Custom multi-touch manager with virtual button zones

**Rationale**: Listen to `touchstart`, `touchmove`, `touchend` on the canvas. Track each touch by unique identifier. Define screen regions as virtual buttons (left side = move, bottom-right area split into jump and shoot). Check all active touches against all zones every frame to support simultaneous move + jump + shoot (3 fingers max). Prevent default on all touch events to block browser scrolling/zooming.

**Alternatives considered**:
- On-screen DOM button elements — rejected: z-index layering with canvas is fragile; DOM event latency higher than canvas touch events
- Hammer.js gesture library — rejected: adds runtime dependency; gesture recognition is unnecessary for simple button presses

## R4: Collision Detection

**Decision**: AABB (Axis-Aligned Bounding Box) collision with off-screen culling

**Rationale**: Simple rectangle overlap checks are sufficient for this platformer. With fewer than 100 entities on screen at any time, spatial partitioning (quadtree/grid) adds complexity without measurable benefit. Off-screen culling (only check entities within camera viewport) is the primary optimization.

**Alternatives considered**:
- Spatial hashing / grid — rejected: <100 entities makes O(n²) with culling fast enough; grid adds code complexity
- Per-pixel collision — rejected: massive overkill; pixel-level accuracy unnecessary for a casual platformer

## R5: Camera/Viewport

**Decision**: Player-centered camera with horizontal clamping

**Rationale**: Camera x-position tracks player center. Clamped between 0 and (levelWidth - canvasWidth) to prevent showing beyond level bounds. Uses `ctx.translate(-camera.x, -camera.y)` for rendering — hardware-accelerated and keeps entity positions in world space. Only entities within camera bounds are drawn (off-screen culling).

**Alternatives considered**:
- Fixed-screen sections (like original NES Mario) — rejected: doesn't match smooth scrolling expectation
- Parallax layers — considered as enhancement: background layer scrolls slower for depth effect; low cost to add

## R6: Orientation Handling

**Decision**: CSS media query for portrait detection + optional JS orientation lock

**Rationale**: `@media (orientation: portrait)` shows a full-screen overlay prompting rotation. The game canvas is hidden in portrait. `screen.orientation.lock('landscape')` is attempted when entering fullscreen (requires user gesture) but cannot be relied upon as primary mechanism due to limited browser support.

**Alternatives considered**:
- CSS `transform: rotate(90deg)` to force landscape in portrait — rejected: creates input coordinate mismatch; confusing UX
- Fullscreen-only approach — rejected: requires explicit user gesture; many users won't want fullscreen

## R7: Sprite/Asset Strategy

**Decision**: Canvas API drawing for geometric shapes + embedded pixel art data URIs for character sprites

**Rationale**: Hearts, projectiles, and simple UI elements are drawn with Canvas path API (bezier curves for hearts, rectangles for platforms). Player character and enemies use small pixel art sprites (32x32) embedded as base64 data URIs in JavaScript — no network requests, no external hosting. A 32x32 sprite sheet with 8 animation frames is ~2-5KB base64, compressing well with gzip.

**Alternatives considered**:
- All Canvas drawing (no pixel art) — considered viable but character would lack personality; pixel art adds charm for minimal size cost
- SVG sprites — rejected: SVG rendering is slower than Canvas drawImage for per-frame animation
- External image files — rejected: user specified no external image hosting

## R8: Audio Approach

**Decision**: Web Audio API with procedural sound generation (OscillatorNode)

**Rationale**: Generate simple 8-bit style sound effects (jump blip, collect chime, shoot sound, enemy defeat pop) using Web Audio API oscillators. Zero file size impact. Single `<audio>` element optional for background music loop. Audio is nice-to-have per spec assumptions.

**Alternatives considered**:
- Howler.js — rejected: 32KB dependency for something achievable with native API
- No audio at all — viable fallback; game works without sound
- jsfxr library (~3KB) — considered as enhancement if procedural sounds feel too basic

## R9: Build & Dev Tooling

**Decision**: Vite 6.x with Vitest for testing, ESLint + Prettier for code quality

**Rationale**: Vite provides instant HMR during development, efficient Rollup-based production bundling with tree-shaking, and native ES module support. Vitest integrates seamlessly with Vite config. ESLint + Prettier enforce constitution code quality requirements. All are dev dependencies only — zero runtime overhead.

**Alternatives considered**:
- Webpack — rejected: slower dev server, more configuration overhead
- No bundler (plain files) — rejected: no minification, no tree-shaking, larger bundle
- Jest for testing — rejected: Vitest is faster and shares Vite config
