# Quickstart: Valentine Game

**Branch**: `001-valentine-game` | **Date**: 2026-02-10

## Prerequisites

- Node.js 18+ installed
- npm or pnpm

## Setup

```bash
# Clone and checkout branch
git clone <repo-url>
cd valentine
git checkout 001-valentine-game

# Install dev dependencies
npm install

# Start development server
npm run dev
```

The game opens at `http://localhost:5173` (Vite default).

## Development

```bash
# Dev server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint check
npm run lint

# Format code
npm run format

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Testing on Mobile

1. Run `npm run dev -- --host` to expose on local network
2. Find your machine's local IP (e.g., `192.168.1.100`)
3. Open `http://192.168.1.100:5173` on your phone
4. Rotate phone to landscape
5. Tap to start playing

## Production Build

```bash
npm run build
```

Output goes to `dist/` — a single `index.html` with inlined/bundled JS and CSS. Can be deployed to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

## Validation Checklist

- [ ] Game loads in <3 seconds on mobile
- [ ] Landscape orientation prompt appears in portrait
- [ ] Touch controls work (move right, jump, shoot)
- [ ] Keyboard controls work on desktop (arrows + spacebar)
- [ ] Hearts are collectible and counter increments
- [ ] Enemies patrol and can be defeated by heart projectiles
- [ ] Player respawns on enemy contact (no game over)
- [ ] Castle flagpole triggers flag-raising animation
- [ ] Flag reaches top → power-up drops from castle
- [ ] Collecting power-up shows "Read the Message" button
- [ ] Tapping button shows styled valentine message overlay
- [ ] Message text matches exactly as specified
- [ ] No visible frame rate drops on mid-range mobile
- [ ] Game works on Safari iOS and Chrome Android
