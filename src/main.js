import { Game } from './engine/Game.js';

const canvas = document.getElementById('game-canvas');
const game = new Game(canvas);

// Wire the "Read the Message" button
const msgBtn = document.getElementById('read-message-btn');
if (msgBtn) {
  msgBtn.addEventListener('click', () => game.onReadMessage());
}

// Wire the valentine overlay buttons
const valentineBtns = document.querySelectorAll('.valentine-btn');
for (const btn of valentineBtns) {
  btn.addEventListener('click', () => game.onValentineAccept());
}

// Wire the Play Again button
const playAgainBtn = document.getElementById('play-again-btn');
if (playAgainBtn) {
  playAgainBtn.addEventListener('click', () => game.onPlayAgain());
}

game.init();
