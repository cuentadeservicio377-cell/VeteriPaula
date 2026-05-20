import { Entity } from './Entity.js';

/**
 * Interactive button with a word for reading mechanics
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
    this.confirmed = false; // true when selected/correct
    this.wrong = false; // true when selected/incorrect
    this.glowRadius = 0;
    
    this.bgColor = options.bgColor || '#FFDac1';
    this.hoverColor = options.hoverColor || '#FFB7B2';
    this.correctColor = options.correctColor || '#B5EAD7';
    this.wrongColor = options.wrongColor || '#FF9AA2';
    this.textColor = options.textColor || '#5D4037';
    this.fontSize = options.fontSize || 32;
    this.borderRadius = options.borderRadius || 16;
  }

  update(dt) {
    // Subtle idle animation
    if (!this.confirmed && !this.wrong) {
      this.scale = 1 + Math.sin(Date.now() * 0.003) * 0.02;
    }
  }

  draw(ctx) {
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

    // Text
    ctx.fillStyle = this.textColor;
    ctx.font = `bold ${this.fontSize}px 'Nunito', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.word, this.width / 2, this.height / 2);
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
