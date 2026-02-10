# Research: Valentine Cutscene & Message Enhancement

## Decision 1: Message Overlay Rendering Approach

**Decision**: Replace canvas-drawn text with an HTML/CSS overlay positioned above the canvas.

**Rationale**: Canvas text rendering at 568x320 internal resolution produces pixelated text when scaled up to fill larger screens. HTML/CSS text uses the browser's native font rasterizer, which renders crisply at any resolution. The overlay can use CSS animations for the stamp effect, which is more performant than canvas-based animation.

**Alternatives considered**:
- Higher internal canvas resolution (e.g., 1136x640) — would require doubling all sprite coordinates and sizes, massive refactor
- Canvas font scaling with `ctx.scale()` — still pixelated because canvas bitmap is scaled
- SVG overlay — unnecessary complexity for styled text

## Decision 2: Stamp Animation Technique

**Decision**: CSS keyframe animation on an HTML element within the message overlay. The stamp starts scaled large (2x) with slight rotation, then scales down to 1x with a slight overshoot bounce, simulating a rubber stamp impact.

**Rationale**: CSS transforms (scale, rotate) are GPU-accelerated and produce smooth animations without JavaScript per-frame updates. The stamp can be a styled `<div>` with border, text, and rotation.

**Alternatives considered**:
- Canvas-drawn stamp with requestAnimationFrame — would require the message overlay to remain canvas-based
- GIF/sprite animation — prohibited by no-external-images constraint
- JavaScript spring physics — over-engineered for a simple stamp

## Decision 3: Sky Gradient Transition

**Decision**: Add a `skyProgress` parameter (0.0 = daytime, 1.0 = sunset) to the Renderer's `clear()` method. Lerp between daytime colors (sky1/sky2) and sunset colors. The Game increments `skyProgress` over ~150 frames (2.5 seconds at 60fps).

**Rationale**: Linear interpolation between two gradient color sets is trivial to implement, has zero allocation cost, and integrates cleanly with the existing `clear()` method. The transition is frame-rate independent via the fixed timestep loop.

**Alternatives considered**:
- Pre-computed gradient textures — unnecessary for 2-color gradient
- CSS overlay with opacity fade — would fight with canvas z-ordering
- Shader-based transition — no WebGL in this project

## Decision 4: Fireworks System

**Decision**: Create a dedicated `Fireworks` class that manages its own particle pool (separate from the game's ParticleSystem) with firework-specific behavior: launch phase (upward velocity), burst phase (radial particle spray), and trail particles.

**Rationale**: The existing ParticleSystem has only 50 particles and uses simple spawn-and-decay behavior. Fireworks need launch trajectories, delayed bursts at peak height, and radial explosion patterns that would conflict with the general-purpose pool. A separate system with ~100 particles allows continuous fireworks without starving the existing effects.

**Alternatives considered**:
- Expanding existing ParticleSystem pool — would complicate simple spawn/decay API with firework-specific state
- Single large unified pool — harder to maintain separation of concerns

## Decision 5: Male Character Sprite Design

**Decision**: Draw the male character using the same pixel-art fillRect technique as the player, but with distinct colors: blue hat, blue tunic, darker skin or same skin tone, brown boots. Same 32x32 size for visual consistency.

**Rationale**: Maintains the established art style. Color differentiation (blue vs pink) makes it immediately obvious which character is which. Same size means collision/positioning math is identical.

**Alternatives considered**:
- Significantly different proportions — would look inconsistent
- Taller/shorter character — complicates meeting point positioning

## Decision 6: Chat Bubble Rendering

**Decision**: Draw the chat bubble on canvas using `roundRect` for the body and a small triangle pointer. The beating heart inside reuses the existing `drawHeart()` function with a sine-based pulse scale.

**Rationale**: The bubble appears during the canvas-rendered cutscene (not the HTML overlay phase), so it must be canvas-drawn. The existing `drawHeart()` is already proven and handles the shape well. Pulsing is a simple `1 + 0.15 * Math.sin(timer)` scale.

**Alternatives considered**:
- HTML overlay bubble — would require precise positioning relative to canvas-space characters
- Emoji heart — inconsistent across platforms and not pixel-art style

## Decision 7: Cutscene State Machine Design

**Decision**: Add 4 new states to the existing Game state machine: `stamp` → `sunset` → `walkToMeet` → `fireworks`. The `message` state transitions to `stamp` when a button is clicked. Each state auto-advances to the next when its animation completes.

**Rationale**: Follows the existing pattern where each game phase has its own `update*()` method in Game.js. Auto-advancing states keep the cutscene flowing without user input. The state machine is the established pattern in this codebase.

**Alternatives considered**:
- Timeline/tween system — over-engineered for 4 sequential phases
- Single "cutscene" state with internal sub-phases — less readable than separate states
- Coroutine/async approach — adds complexity without benefit for frame-based updates

## Decision 8: Sound Effects for Cutscene

**Decision**: Add two new methods to Audio.js: `stampSlam()` (short percussive impact, low frequency) and `fireworkBurst()` (ascending whistle + burst). Both use the existing `playTone()` helper with different oscillator types and frequencies.

**Rationale**: Consistent with the existing procedural audio pattern. No external audio files needed. The `playTone()` infrastructure already handles scheduling and cleanup.

**Alternatives considered**:
- Pre-recorded audio files — prohibited by minimal-dependency constraint
- No audio at all — confirmed by clarification that sound effects are wanted for key moments
