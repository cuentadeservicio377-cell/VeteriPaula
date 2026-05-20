import { createPaula } from '../sprites/Characters.js';

/**
 * Paula — Veterinarian character using Avatar World style pixel art sprites
 * Maintains same interface as v2.0 geometric version for backward compat
 */
export class Paula {
  constructor(x, y, options = {}) {
    this.sprite = createPaula(options.scale || 5);
    this._x = x;
    this._y = y;
    this.sprite.x = x;
    this.sprite.y = y;

    this.state = options.state || 'idle';
    this.direction = options.direction || 'right';
    this.holdingItem = options.holdingItem || null;
    this.sprite.setState(this.state);
  }

  // Proxy x/y to sprite for tweening compatibility
  get x() { return this._x; }
  set x(v) { this._x = v; this.sprite.x = v; }
  get y() { return this._y; }
  set y(v) { this._y = v; this.sprite.y = v; }

  get width() {
    const frame = this.sprite.frames[this.sprite.currentState];
    return frame ? frame.width * frame.scale : 120; // 24 cols × 5
  }

  get height() {
    const frame = this.sprite.frames[this.sprite.currentState];
    return frame ? frame.height * frame.scale : 100; // 20 rows × 5
  }

  centerX() {
    return this.x + this.width / 2;
  }

  update(dt) {
    this.sprite.update(dt);
  }

  render(ctx) {
    this.sprite.render(ctx);
  }

  setState(state) {
    this.state = state;
    this.sprite.setState(state);
  }

  walkTo(targetX, duration = 1000) {
    this.setState('walk');
    const startX = this.x;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.x = startX + (targetX - startX) * progress;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.setState('idle');
      }
    };
    requestAnimationFrame(animate);
  }
}
