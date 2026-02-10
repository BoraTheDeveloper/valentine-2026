export class FullscreenPrompt {
  constructor() {
    this.promptEl = document.getElementById('fullscreen-prompt');
    this.isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isFullscreen = false;

    if (this.isMobile && this.promptEl) {
      this.promptEl.classList.add('visible');
      this.promptEl.addEventListener('click', () => this.enterFullscreen());
      this.promptEl.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.enterFullscreen();
      });
    }

    document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.onFullscreenChange());
  }

  enterFullscreen() {
    const el = document.documentElement;
    const requestFs = el.requestFullscreen
      || el.webkitRequestFullscreen
      || el.mozRequestFullScreen
      || el.msRequestFullscreen;

    if (requestFs) {
      requestFs.call(el).then(() => {
        this.tryLockLandscape();
      }).catch(() => {
        // Fullscreen not supported — hide prompt and let them play anyway
        this.hidePrompt();
      });
    } else {
      this.hidePrompt();
    }
  }

  tryLockLandscape() {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  }

  onFullscreenChange() {
    this.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (this.isFullscreen) {
      this.hidePrompt();
    }
    window.dispatchEvent(new Event('resize'));
  }

  hidePrompt() {
    if (this.promptEl) {
      this.promptEl.classList.remove('visible');
    }
  }
}
