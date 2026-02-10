export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this._melodyInterval = null;
    this._melodyNodes = [];
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
    } catch {
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = 'square', volume = 0.15) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  jump() {
    this.playTone(400, 0.1, 'square', 0.1);
    setTimeout(() => this.playTone(600, 0.1, 'square', 0.1), 50);
  }

  collectHeart() {
    this.playTone(800, 0.1, 'sine', 0.12);
    setTimeout(() => this.playTone(1200, 0.15, 'sine', 0.12), 80);
  }

  shoot() {
    this.playTone(300, 0.08, 'sawtooth', 0.08);
  }

  enemyDefeat() {
    this.playTone(500, 0.1, 'square', 0.1);
    setTimeout(() => this.playTone(350, 0.12, 'square', 0.08), 60);
    setTimeout(() => this.playTone(200, 0.15, 'square', 0.06), 120);
  }

  flagRaise() {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.1), i * 200);
    });
  }

  powerUpCollect() {
    this.playTone(1000, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(1200, 0.1, 'sine', 0.15), 80);
    setTimeout(() => this.playTone(1500, 0.2, 'sine', 0.12), 160);
  }

  playerHit() {
    this.playTone(200, 0.15, 'sawtooth', 0.12);
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.1), 100);
  }

  stampSlam() {
    this.playTone(100, 0.15, 'triangle', 0.2);
    setTimeout(() => this.playTone(80, 0.1, 'triangle', 0.12), 50);
  }

  romanticMelody() {
    if (!this.enabled || !this.ctx) return;
    this.stopMusic();

    const playOnce = () => {
      const melody = [
        [523, 0.0, 1.2, 0.08],
        [659, 1.0, 1.2, 0.08],
        [784, 2.0, 1.5, 0.07],
        [880, 3.2, 1.0, 0.06],
        [784, 4.0, 1.2, 0.07],
        [659, 5.0, 1.5, 0.08],
        [698, 6.2, 1.0, 0.07],
        [659, 7.0, 1.2, 0.08],
        [523, 8.0, 1.5, 0.07],
        [587, 9.2, 1.0, 0.06],
        [523, 10.0, 2.0, 0.08],
      ];

      const chords = [
        [[262, 330, 392], 0.0, 3.0],
        [[220, 262, 330], 3.0, 3.0],
        [[349, 440, 523], 6.0, 2.5],
        [[392, 494, 587], 8.5, 3.5],
      ];

      const t = this.ctx.currentTime + 0.1;

      for (const [freq, start, dur, vol] of melody) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + start);
        gain.gain.setValueAtTime(0, t + start);
        gain.gain.linearRampToValueAtTime(vol, t + start + 0.15);
        gain.gain.setValueAtTime(vol, t + start + dur - 0.3);
        gain.gain.linearRampToValueAtTime(0.001, t + start + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + start);
        osc.stop(t + start + dur);
        this._melodyNodes.push(osc, gain);
      }

      for (const [freqs, start, dur] of chords) {
        for (const freq of freqs) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + start);
          gain.gain.setValueAtTime(0, t + start);
          gain.gain.linearRampToValueAtTime(0.03, t + start + 0.4);
          gain.gain.setValueAtTime(0.03, t + start + dur - 0.5);
          gain.gain.linearRampToValueAtTime(0.001, t + start + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + start);
          osc.stop(t + start + dur);
          this._melodyNodes.push(osc, gain);
        }
      }
    };

    playOnce();
    this._melodyInterval = setInterval(() => playOnce(), 12000);
  }

  stopMusic() {
    if (this._melodyInterval) {
      clearInterval(this._melodyInterval);
      this._melodyInterval = null;
    }
    for (const node of this._melodyNodes) {
      try { node.disconnect(); } catch {}
    }
    this._melodyNodes = [];
  }

  fireworkBurst() {
    // Whistle up
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);

    // Burst noise
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        this.playTone(200 + Math.random() * 400, 0.12, 'sawtooth', 0.04);
      }
    }, 150);
  }
}
