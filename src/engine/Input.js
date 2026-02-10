/**
 * Input - Unified multi-touch and keyboard input manager.
 * Touch zones are designed for landscape mobile play.
 * Provides justPressed() for single-frame triggers.
 */

export class Input {
  constructor(canvas) {
    this.canvas = canvas;

    // Current frame state
    this.state = {
      moveRight: false,
      moveLeft: false,
      jump: false,
      shoot: false,
      action: false,
    };

    // Previous frame state (for justPressed detection)
    this._prev = {
      moveRight: false,
      moveLeft: false,
      jump: false,
      shoot: false,
      action: false,
    };

    // Keyboard held state (raw)
    this._keys = {
      moveRight: false,
      moveLeft: false,
      jump: false,
      shoot: false,
      action: false,
    };

    // Active touches mapped to zones
    this._activeTouches = new Map();

    this._bindKeyboard();
    this._bindTouch();
  }

  /**
   * Returns true only on the first frame a button is pressed.
   */
  justPressed(button) {
    return this.state[button] && !this._prev[button];
  }

  /**
   * Call at the END of each update tick to snapshot previous state.
   */
  endFrame() {
    this._prev.moveRight = this.state.moveRight;
    this._prev.moveLeft = this.state.moveLeft;
    this._prev.jump = this.state.jump;
    this._prev.shoot = this.state.shoot;
    this._prev.action = this.state.action;
  }

  /**
   * Refresh unified state from keyboard + touch sources.
   */
  _refreshState() {
    const touchState = this._getTouchState();
    this.state.moveRight = this._keys.moveRight || touchState.moveRight;
    this.state.moveLeft = this._keys.moveLeft || touchState.moveLeft;
    this.state.jump = this._keys.jump || touchState.jump;
    this.state.shoot = this._keys.shoot || touchState.shoot;
    this.state.action = this._keys.action || touchState.action;
  }

  /**
   * Derive touch state from all active touches and their zones.
   */
  _getTouchState() {
    const result = {
      moveRight: false,
      moveLeft: false,
      jump: false,
      shoot: false,
      action: false,
    };

    for (const zone of this._activeTouches.values()) {
      if (zone === 'moveLeft') result.moveLeft = true;
      if (zone === 'moveRight') result.moveRight = true;
      if (zone === 'jump') result.jump = true;
      if (zone === 'shoot') result.shoot = true;
      if (zone === 'action') result.action = true;
    }

    return result;
  }

  /**
   * Map a touch coordinate to a control zone.
   * Landscape layout:
   *   Left move:  x < 15%
   *   Right move: 15% <= x < 30%
   *   Jump:       x >= 70% AND y >= 50%
   *   Shoot:      x >= 85% AND y >= 50%
   *   Action:     x >= 70% AND y < 50% (upper right = action/start)
   */
  _classifyTouch(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    if (relX < 0.15) return 'moveLeft';
    if (relX < 0.30) return 'moveRight';

    if (relX >= 0.85 && relY >= 0.50) return 'shoot';
    if (relX >= 0.70 && relY >= 0.50) return 'jump';
    if (relX >= 0.70 && relY < 0.50) return 'action';

    return null;
  }

  // --- Touch bindings ---

  _bindTouch() {
    const opts = { passive: false };

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const zone = this._classifyTouch(touch.clientX, touch.clientY);
        if (zone) this._activeTouches.set(touch.identifier, zone);
      }
      this._refreshState();
    }, opts);

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const zone = this._classifyTouch(touch.clientX, touch.clientY);
        if (zone) {
          this._activeTouches.set(touch.identifier, zone);
        } else {
          this._activeTouches.delete(touch.identifier);
        }
      }
      this._refreshState();
    }, opts);

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        this._activeTouches.delete(touch.identifier);
      }
      this._refreshState();
    }, opts);

    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        this._activeTouches.delete(touch.identifier);
      }
      this._refreshState();
    }, opts);
  }

  // --- Keyboard bindings ---

  _bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      this._setKey(e.code, true);
      this._refreshState();
    });

    window.addEventListener('keyup', (e) => {
      this._setKey(e.code, false);
      this._refreshState();
    });
  }

  _setKey(code, pressed) {
    switch (code) {
      case 'ArrowRight':
        this._keys.moveRight = pressed;
        break;
      case 'ArrowLeft':
        this._keys.moveLeft = pressed;
        break;
      case 'ArrowUp':
        this._keys.jump = pressed;
        break;
      case 'Space':
        this._keys.shoot = pressed;
        break;
      case 'Enter':
        this._keys.action = pressed;
        break;
    }
  }

  /**
   * Clean up event listeners.
   */
  destroy() {
    this._activeTouches.clear();
  }
}
