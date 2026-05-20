/**
 * Pixel Art Sprite System — renders pixel-perfect sprites scaled on Canvas
 * Each sprite is defined as a 2D array of color codes
 * Style: Avatar World / Roblox-inspired (blocky bodies, big heads, vibrant colors)
 */

// Color palette for pixel art sprites
export const PALETTE = {
  // Skin tones
  S1: '#FFDFC4', // light skin
  S2: '#F5CBA7', // medium skin
  S3: '#E0AC69', // tan skin

  // Hair colors
  H1: '#5D4037', // brown
  H2: '#3E2723', // dark brown
  H3: '#F4D03F', // blonde
  H4: '#E74C3C', // red
  H5: '#2C3E50', // black

  // Clothing
  C1: '#FF6B6B', // pink/red (vet coat)
  C2: '#FFFFFF', // white
  C3: '#4ECDC4', // turquoise
  C4: '#FFE66D', // yellow
  C5: '#C7CEEA', // lavender

  // Eyes
  E1: '#2C3E50', // dark eye
  E2: '#FFFFFF', // eye white
  E3: '#3498DB', // blue iris
  E4: '#8B4513', // brown iris

  // Animals
  A1: '#D4A574', // dog brown
  A2: '#FFA500', // cat orange
  A3: '#F5F5DC', // rabbit white
  A4: '#808080', // gray
  A5: '#8B4513', // brown dark
  A6: '#FFFFFF', // white
  A7: '#FFDAB9', // peach
  A8: '#32CD32', // green (parrot)
  A9: '#228B22', // dark green (turtle)
  A10: '#000000', // black
  A11: '#FF8C00', // fox orange
  A12: '#A9A9A9', // wolf gray
  A13: '#D2691E', // squirrel
  A14: '#C7CEEA', // blue-gray

  // General
  B1: '#FF9AA2', // blush
  R1: '#E74C3C', // red accent
  G1: '#2ECC71', // green accent
  Y1: '#F1C40F', // yellow accent
  O1: '#E67E22', // orange
  P1: '#9B59B6', // purple

  // Transparent
  T: null,
};

/**
 * PixelSprite — renders a pixel art sprite on canvas
 */
export class PixelSprite {
  constructor(definition, options = {}) {
    this.pixels = definition.pixels || [];
    this.width = this.pixels[0]?.length || 0;
    this.height = this.pixels.length;
    this.scale = options.scale || 6;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.flipX = options.flipX || false;
    this.opacity = options.opacity || 1;
    this.rotation = options.rotation || 0;
    this.palette = definition.palette || PALETTE;
  }

  render(ctx) {
    if (!this.pixels.length) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    const centerX = this.x + (this.width * this.scale) / 2;
    const centerY = this.y + (this.height * this.scale) / 2;

    ctx.translate(centerX, centerY);
    if (this.rotation) ctx.rotate(this.rotation);
    ctx.translate(-centerX, -centerY);

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const code = this.flipX
          ? this.pixels[row][this.width - 1 - col]
          : this.pixels[row][col];

        if (!code || code === 'T') continue;

        const color = this.palette[code];
        if (!color) continue;

        const px = this.x + col * this.scale;
        const py = this.y + row * this.scale;

        ctx.fillStyle = color;
        ctx.fillRect(px, py, this.scale, this.scale);
      }
    }

    ctx.restore();
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.width * this.scale &&
           py >= this.y && py <= this.y + this.height * this.scale;
  }

  centerX() {
    return this.x + (this.width * this.scale) / 2;
  }

  centerY() {
    return this.y + (this.height * this.scale) / 2;
  }
}

/**
 * AnimatedPixelSprite — sprite with multiple frames and states
 */
export class AnimatedPixelSprite {
  constructor(frames, options = {}) {
    this.frames = frames; // { stateName: PixelSprite }
    this.currentState = options.initialState || 'idle';
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.scale = options.scale || 6;
    this.flipX = options.flipX || false;
    this.opacity = options.opacity || 1;
    this.rotation = options.rotation || 0;
    this.animTimer = 0;
    this.bobOffset = 0;
  }

  setState(state) {
    if (this.frames[state] && this.currentState !== state) {
      this.currentState = state;
    }
  }

  update(dt) {
    this.animTimer += dt;

    // Idle bob animation
    if (this.currentState === 'idle' || this.currentState === 'hurt') {
      this.bobOffset = Math.sin(this.animTimer * 3) * 2;
    } else if (this.currentState === 'celebrate') {
      this.bobOffset = Math.sin(this.animTimer * 10) * 6;
    } else {
      this.bobOffset = 0;
    }
  }

  render(ctx) {
    const sprite = this.frames[this.currentState];
    if (!sprite) return;

    // Update sprite position
    sprite.x = this.x;
    sprite.y = this.y + this.bobOffset;
    sprite.scale = this.scale;
    sprite.flipX = this.flipX;
    sprite.opacity = this.opacity;
    sprite.rotation = this.rotation;

    sprite.render(ctx);
  }

  contains(px, py) {
    const sprite = this.frames[this.currentState];
    if (!sprite) return false;
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.scale = this.scale;
    return sprite.contains(px, py);
  }

  centerX() {
    const sprite = this.frames[this.currentState];
    if (!sprite) return this.x;
    return this.x + (sprite.width * this.scale) / 2;
  }

  centerY() {
    const sprite = this.frames[this.currentState];
    if (!sprite) return this.y;
    return this.y + (sprite.height * this.scale) / 2;
  }
}

// Helper to create a sprite from pixel data
export function createSprite(pixelString, scale = 6) {
  const lines = pixelString.trim().split('\n').filter(l => l.trim());
  const pixels = lines.map(line => line.trim().split(''));
  return new PixelSprite({ pixels }, { scale });
}
