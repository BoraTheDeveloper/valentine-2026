export class OrientationPrompt {
  constructor() {
    this.isPortrait = false;
    this.checkOrientation();

    window.addEventListener('resize', () => this.checkOrientation());

    if (screen.orientation) {
      screen.orientation.addEventListener('change', () => this.checkOrientation());
    }
  }

  checkOrientation() {
    this.isPortrait = window.innerHeight > window.innerWidth;
  }

  tryLockLandscape() {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Lock not supported or not in fullscreen — that's fine
      });
    }
  }
}
