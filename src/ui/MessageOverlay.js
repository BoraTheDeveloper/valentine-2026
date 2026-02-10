export class MessageOverlay {
  constructor() {
    this.overlay = document.getElementById('valentine-overlay');
    this.buttons = this.overlay?.querySelector('.valentine-buttons');
    this.stamp = this.overlay?.querySelector('.valentine-stamp');
    this.visible = false;
  }

  show() {
    if (!this.overlay) return;
    this.visible = true;
    this.overlay.classList.remove('hidden', 'fade-out');
    if (this.buttons) this.buttons.style.display = 'flex';
    if (this.stamp) {
      this.stamp.classList.add('hidden');
      this.stamp.classList.remove('stamp-animate');
    }
  }

  showStamp() {
    if (this.buttons) this.buttons.style.display = 'none';
    if (this.stamp) {
      this.stamp.classList.remove('hidden');
      this.stamp.classList.add('stamp-animate');
    }
  }

  hide() {
    if (!this.overlay) return;
    this.overlay.classList.add('fade-out');
    setTimeout(() => {
      this.overlay.classList.add('hidden');
      this.overlay.classList.remove('fade-out');
      this.visible = false;
    }, 600);
  }

  update() {
    // No per-frame updates needed — HTML/CSS handles animations
  }

  render() {
    // No canvas rendering — entirely HTML/CSS now
  }
}
