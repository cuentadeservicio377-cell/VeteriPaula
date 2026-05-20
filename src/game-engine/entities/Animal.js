import { createAnimal } from '../sprites/Characters.js';

/**
 * Animal — Avatar World style pixel art sprite
 * States: hurt → healing → happy
 * Maintains same interface as v2.0 geometric version
 */
export class Animal {
  constructor(x, y, type, options = {}) {
    this.type = type;
    this.sprite = createAnimal(type, x, y, options.scale || 5);
    this._x = x;
    this._y = y;

    this.state = options.state || 'hurt';
    this.injury = options.injury || 'pata';
    this.healingTimer = 0;

    // Keep colors for any legacy rendering that needs it
    this.colors = this.getColors(type);
  }

  get x() { return this._x; }
  set x(v) { this._x = v; this.sprite.x = v; }
  get y() { return this._y; }
  set y(v) { this._y = v; this.sprite.y = v; }

  get width() {
    const frame = this.sprite.frames[this.sprite.currentState];
    return frame ? frame.width * frame.scale : 90; // 18 cols × 5
  }

  get height() {
    const frame = this.sprite.frames[this.sprite.currentState];
    return frame ? frame.height * frame.scale : 80; // 16 rows × 5
  }

  centerX() {
    return this.x + this.width / 2;
  }

  update(dt) {
    this.sprite.update(dt);

    if (this.state === 'healing') {
      this.healingTimer += dt;
      if (this.healingTimer > 1.5) {
        this.state = 'happy';
        this.sprite.setState('happy');
      }
    }
  }

  render(ctx) {
    this.sprite.render(ctx);

    // Hearts when happy (rendered as simple pixel hearts above the sprite)
    if (this.state === 'happy') {
      this.renderHearts(ctx);
    }
  }

  renderHearts(ctx) {
    const time = Date.now() / 1000;
    const cx = this.centerX();
    const baseY = this.y - 10;

    ctx.save();
    for (let i = 0; i < 3; i++) {
      const offset = i * 2.1;
      const hx = cx + Math.sin(time * 3 + offset) * 20;
      const hy = baseY + Math.cos(time * 2 + offset) * 8 - (i * 5);
      const alpha = 0.5 + Math.sin(time * 4 + offset) * 0.3;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FF6B6B';
      // Tiny pixel heart
      const s = 4;
      ctx.fillRect(hx - s, hy - s * 2, s * 2, s);
      ctx.fillRect(hx - s * 2, hy - s, s, s);
      ctx.fillRect(hx + s, hy - s, s, s);
      ctx.fillRect(hx - s * 2, hy, s * 4, s);
      ctx.fillRect(hx - s, hy + s, s * 2, s);
      ctx.fillRect(hx, hy + s * 2, s, s);
    }
    ctx.restore();
  }

  heal() {
    this.state = 'healing';
    this.sprite.setState('healing');
    this.healingTimer = 0;
  }

  setState(s) {
    this.state = s;
    this.sprite.setState(s);
  }

  // Legacy color palette for any UI that references it
  getColors(type) {
    const palettes = {
      perro: { body: '#D4A574', spot: '#8B6914', ear: '#C4956A' },
      gato: { body: '#FFA500', spot: '#FF8C00', ear: '#FFB347' },
      conejo: { body: '#F5F5DC', spot: '#E8E8C8', ear: '#FFB6C1' },
      pajaro: { body: '#87CEEB', spot: '#4682B4', ear: '#B0E0E6' },
      tortuga: { body: '#228B22', spot: '#006400', ear: '#32CD32' },
      vaca: { body: '#FFFFFF', spot: '#000000', ear: '#FFB6C1' },
      gallina: { body: '#FFFFFF', spot: '#FF0000', ear: '#FF6347' },
      caballo: { body: '#8B4513', spot: '#654321', ear: '#A0522D' },
      oveja: { body: '#FFFFF0', spot: '#F5F5DC', ear: '#FFB6C1' },
      pato: { body: '#FFFF00', spot: '#FFA500', ear: '#FF6347' },
      zorro: { body: '#FF8C00', spot: '#FF4500', ear: '#FFB6C1' },
      ardilla: { body: '#D2691E', spot: '#8B4513', ear: '#FFB6C1' },
      erizo: { body: '#808080', spot: '#696969', ear: '#FFB6C1' },
      buho: { body: '#8B4513', spot: '#654321', ear: '#D2B48C' },
      ciervo: { body: '#D2691E', spot: '#8B4513', ear: '#FFB6C1' },
      mono: { body: '#D2691E', spot: '#8B4513', ear: '#FFB6C1' },
      tucan: { body: '#000000', spot: '#FF4500', ear: '#FFD700' },
      jaguar: { body: '#FF8C00', spot: '#000000', ear: '#FFB6C1' },
      delfin: { body: '#4682B4', spot: '#1E90FF', ear: '#87CEEB' },
    };
    return palettes[type] || { body: '#ccc', spot: '#999', ear: '#ddd' };
  }
}
