# Game States Contract: Cutscene Sequence

## Extended State Machine

```
start → playing → castle → flagRaise → powerUpDrop → message
                                                        ↓
                                                      stamp
                                                        ↓
                                                      sunset
                                                        ↓
                                                    walkToMeet
                                                        ↓
                                                    fireworks (terminal)
```

## State Transitions

### message → stamp

**Trigger**: Player clicks "Yes" or "yes" button on the HTML overlay
**Actions**:
1. Hide the "Yes"/"yes" buttons
2. Show stamp element, trigger CSS animation (scale 2→1, rotate -15deg→-5deg, ~0.6s)
3. Play `audio.stampSlam()` sound effect
**Duration**: ~1.5 seconds (0.6s animation + 0.9s visible pause)

### stamp → sunset

**Trigger**: Stamp animation complete + pause timer elapsed
**Actions**:
1. Fade out and hide the HTML message overlay
2. Begin incrementing `renderer.skyProgress` from 0.0 toward 1.0
**Duration**: ~2.5 seconds (150 frames at 60fps)

### sunset → walkToMeet

**Trigger**: `renderer.skyProgress >= 1.0`
**Actions**:
1. Create BoyCharacter at castle door position
2. BoyCharacter begins walking left toward player character
3. Player character remains stationary, facing right
**Duration**: ~3-4 seconds depending on distance

### walkToMeet → fireworks

**Trigger**: BoyCharacter x position is within ~40px of player character x position
**Actions**:
1. Stop BoyCharacter movement, set facing = 'right' (facing the player who faces left... actually player faces right, boy faces left toward her)
2. Correct: Boy faces left (toward girlfriend), girlfriend already faces right (toward castle area)
3. Show chat bubble between them with beating heart
4. After ~2 seconds of bubble display, begin fireworks
**Duration**: ~2 seconds for bubble, then fireworks begin

### fireworks (terminal state)

**Trigger**: N/A (auto-starts after walkToMeet)
**Actions**:
1. Launch fireworks from behind castle at staggered intervals (~every 0.5-1 seconds)
2. Each firework rises, bursts into colored particles
3. Chat bubble and characters remain visible
4. Play `audio.fireworkBurst()` on each burst
**Loop**: Indefinite — this is the final game state

## Sunset Palette

| Element    | Daytime           | Sunset             |
|------------|-------------------|---------------------|
| Sky top    | #FFB6C1 (pink)    | #4A0E2E (deep plum) |
| Sky bottom | #FF7F7F (coral)   | #FF6B35 (warm orange)|

Intermediate values calculated via per-channel linear interpolation.

## Message Overlay HTML Structure

```html
<div id="valentine-overlay" class="hidden">
  <div class="valentine-panel">
    <div class="valentine-heart-top"><!-- decorative heart --></div>
    <p class="valentine-text">
      Happy valentine sweetie, i made this game just for you...
      (paragraph WITHOUT the closing question)
    </p>
    <p class="valentine-question">May I be your valentine?</p>
    <div class="valentine-buttons">
      <button class="valentine-btn" data-answer="yes">Yes</button>
      <button class="valentine-btn" data-answer="yes">yes</button>
    </div>
    <div class="valentine-stamp hidden">
      <span>Yes</span>
    </div>
  </div>
</div>
```

## Stamp Animation CSS

```
@keyframes stamp-slam {
  0%   { transform: scale(2.5) rotate(-20deg); opacity: 0; }
  50%  { transform: scale(0.95) rotate(-5deg); opacity: 1; }
  70%  { transform: scale(1.05) rotate(-4deg); opacity: 1; }
  100% { transform: scale(1) rotate(-5deg); opacity: 1; }
}
```

- Stamp color: Red border (#E91E63), red text
- Position: Bottom-right of the panel
- Duration: 0.6 seconds ease-out

## Male Character Colors

| Part   | Color   | Hex     |
|--------|---------|---------|
| Hat    | Blue    | #1565C0 |
| Face   | Skin    | #FFCC99 |
| Eyes   | Dark    | #333333 |
| Smile  | Blue    | #1565C0 |
| Tunic  | Blue    | #42A5F5 |
| Belt   | Brown   | #8B4513 |
| Arms   | Skin    | #FFCC99 |
| Boots  | Dark    | #3E2723 |

## Firework Colors (random per launch)

```javascript
const FIREWORK_COLORS = [
  '#FF1744', // red
  '#FF69B4', // pink
  '#FFD700', // gold
  '#E91E63', // deep pink
  '#FF6B35', // orange
  '#BA68C8', // purple
  '#42A5F5', // blue
];
```

## Audio Effects

### stampSlam()
- Type: 'triangle' oscillator
- Frequency: 100 Hz → rapid decay
- Duration: 0.15 seconds
- Volume: 0.2

### fireworkBurst()
- Whistle phase: 'sine' 300→800 Hz ascending over 0.3s
- Burst phase: White noise burst (multiple detuned oscillators) 0.2s
- Volume: 0.1
