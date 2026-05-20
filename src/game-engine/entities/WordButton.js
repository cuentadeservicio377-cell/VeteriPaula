import { Entity } from './Entity.js';

/**
 * Interactive button with a word + optional icon for reading mechanics
 * v2.3 — Added iconSprite support for pre-readers
 */
export class WordButton extends Entity {
  constructor(x, y, word, isCorrect = false, options = {}) {
    const width = options.width || 180;
    const height = options.height || 80;
    super(x, y, width, height);

    this.word = word;
    this.isCorrect = isCorrect;
    this.hovered = false;
    this.pressed = false;
    this.confirmed = false;
    this.wrong = false;
    this.visible = true;
    this.glowRadius = 0;

    this.bgColor = options.bgColor || '#FFDac1';
    this.hoverColor = options.hoverColor || '#FFB7B2';
    this.correctColor = options.correctColor || '#B5EAD7';
    this.wrongColor = options.wrongColor || '#FF9AA2';
    this.textColor = options.textColor || '#5D4037';
    this.fontSize = options.fontSize || 32;
    this.borderRadius = options.borderRadius || 16;

    // Icon sprite (PixelSprite instance) for pre-readers
    this.iconSprite = options.iconSprite || null;
    this.iconScale = options.iconScale || 1;
  }

  update(dt) {
    if (!this.confirmed && !this.wrong) {
      this.scale = 1 + Math.sin(Date.now() * 0.003) * 0.02;
    }
  }

  draw(ctx) {
    if (!this.visible) return;

    let color = this.bgColor;
    if (this.confirmed) color = this.correctColor;
    else if (this.wrong) color = this.wrongColor;
    else if (this.hovered) color = this.hoverColor;

    // Glow effect (hint anti-frustration)
    if (this.glowRadius > 0) {
      ctx.save();
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = this.glowRadius;
      this.roundRect(ctx, -4, -4, this.width + 8, this.height + 8, this.borderRadius + 4);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.fill();
      ctx.restore();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    this.roundRect(ctx, 4, 4, this.width, this.height, this.borderRadius);
    ctx.fill();

    // Button body
    ctx.fillStyle = color;
    this.roundRect(ctx, 0, 0, this.width, this.height, this.borderRadius);
    ctx.fill();

    // Border
    ctx.strokeStyle = this.confirmed ? '#5D4037' : 'rgba(93,64,55,0.2)';
    ctx.lineWidth = this.confirmed || this.wrong ? 3 : 2;
    this.roundRect(ctx, 0, 0, this.width, this.height, this.borderRadius);
    ctx.stroke();

    // Calculate icon metrics (relative coords within button)
    const hasIcon = this.iconSprite && this.iconSprite.render;
    let iconW = 0;
    let iconH = 0;
    if (hasIcon) {
      iconW = this.iconSprite.width * this.iconSprite.scale;
      iconH = this.iconSprite.height * this.iconSprite.scale;
    }
    const iconGap = hasIcon ? 12 : 0;

    // Total content width
    const textW = this.word.length * (this.fontSize * 0.55); // rough estimate
    const totalContentW = iconW + iconGap + textW;
    const startX = (this.width - totalContentW) / 2;

    // Icon
    if (hasIcon) {
      ctx.save();
      const iconX = startX + iconW / 2;
      const iconY = this.height / 2;
      // PixelSprite renders at its own x,y; we set it to 0,0 and use translate
      ctx.translate(iconX, iconY);
      this.iconSprite.x = 0;
      this.iconSprite.y = 0;
      this.iconSprite.render(ctx);
      ctx.restore();
    }

    // Text
    ctx.fillStyle = this.textColor;
    ctx.font = `bold ${this.fontSize}px 'Nunito', sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const textX = startX + iconW + iconGap;
    ctx.fillText(this.word, textX, this.height / 2);
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  containsExpanded(px, py, scale = 1.4) {
    const padX = (this.width * scale - this.width) / 2;
    const padY = (this.height * scale - this.height) / 2;
    return px >= this.x - padX
        && px <= this.x + this.width + padX
        && py >= this.y - padY
        && py <= this.y + this.height + padY;
  }

  onPress() {
    this.pressed = true;
    this.scale = 0.9;
  }

  onRelease() {
    this.pressed = false;
    this.scale = 1;
  }

  setCorrect() {
    this.confirmed = true;
    this.scale = 1.1;
  }

  setWrong() {
    this.wrong = true;
    this.scale = 0.95;
  }

  reset() {
    this.confirmed = false;
    this.wrong = false;
    this.hovered = false;
    this.pressed = false;
    this.scale = 1;
  }
}
