# Quickstart: Valentine Cutscene & Message Enhancement

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
cd /Users/chanbora/Me/valentine
git checkout 002-valentine-cutscene
npm install
npm run dev
```

## Development Workflow

1. Open http://localhost:5173/ in browser
2. Play through the game to reach the castle (or use dev shortcut below)
3. Verify cutscene sequence after clicking the message button

## Dev Shortcuts (for testing cutscene quickly)

Add to browser console to skip to message state:

```javascript
// Access game instance (exposed on window for dev)
game.state = 'message';
game.messageOverlay.show();
```

Or skip directly to specific cutscene phases:

```javascript
game.state = 'sunset';
game.renderer.skyProgress = 0;
```

## Files to Modify (in order)

1. `index.html` — Add HTML message overlay structure
2. `src/styles/main.css` — Add overlay styles, stamp animation
3. `src/ui/MessageOverlay.js` — Rewrite to manage HTML overlay
4. `src/entities/BoyCharacter.js` — New male character entity
5. `src/graphics/sprites.js` — Add `drawBoyCharacter()`, `drawChatBubble()`
6. `src/graphics/Fireworks.js` — New firework launcher system
7. `src/graphics/Renderer.js` — Add sunset sky lerp
8. `src/engine/Audio.js` — Add `stampSlam()`, `fireworkBurst()`
9. `src/engine/Game.js` — Add cutscene states, wire everything
10. `src/main.js` — Wire HTML overlay button events

## Validation Checklist

- [ ] Message text renders crisply (not pixelated) on mobile
- [ ] "May I be your valentine?" appears below paragraph with distinct styling
- [ ] Both "Yes" and "yes" buttons work
- [ ] Stamp slams onto bottom-right of message with sound
- [ ] Message fades out after stamp
- [ ] Sky transitions to sunset colors smoothly
- [ ] Male character walks from castle to girlfriend
- [ ] Chat bubble with beating heart appears between them
- [ ] Fireworks launch from behind castle
- [ ] Fireworks continue indefinitely
- [ ] 60fps maintained on mobile during fireworks
- [ ] Sound effects play for stamp and firework bursts
