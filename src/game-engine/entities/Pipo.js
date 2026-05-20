import { tween } from '../../utils/tween.js';
import { makePipoSprite } from '../sprites/Characters.js';
import { playDogWhine, playDogSniff, playDogOuch, playDogBarkHappy } from '../../utils/sfx.js';

/**
 * Pipo — The level 1 dog with interactive touch zones
 * v2.5: Named character with head/body/paw interactions, emotional arc
 * NOTE: Does NOT extend Entity — renders directly like Paula to avoid transform issues
 */
export class Pipo {
  constructor(x, y, scale = 6) {
    this.sprite = makePipoSprite(scale);
    this.type = 'pipo';
    this.state = 'lying_down'; // lying_down | head_up | sitting_happy | healed

    this.x = x;
    this.y = y;
    this._width = 0;
    this._height = 0;
    this.visible = true;
    this.scale = 1;
    this.opacity = 1;
    this.rotation = 0;

    // Sync dimensions to sprite
    const frame = this.sprite.frames?.[this.sprite.currentState];
    if (frame) {
      this._width = frame.width * this.sprite.scale;
      this._height = frame.height * this.sprite.scale;
    } else {
      this._width = 18 * 6;
      this._height = 16 * 6;
    }

    // Cache current frame dimensions for fast access
    this._frameWidth = this._width;
    this._frameHeight = this._height;

    // Touch zones (relative to sprite top-left)
    // These are approximate hitboxes for different body parts
    this.zones = {
      head: { x: 0.15, y: 0.10, w: 0.70, h: 0.35 },
      body: { x: 0.10, y: 0.40, w: 0.80, h: 0.35 },
      paw:  { x: 0.60, y: 0.75, w: 0.35, h: 0.20 },
    };

    // Animation timers
    this.tailWagTimer = 0;
    this.headUpTimer = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;

    // Hearts for celebration
    this.hearts = [];
    this.reactionText = null;
    this.reactionScale = 0;
    this.reactionTimer = 0;
  }

  get width() {
    const frame = this.sprite?.frames?.[this.sprite?.currentState];
    return frame ? frame.width * this.sprite.scale : this._frameWidth;
  }

  get height() {
    const frame = this.sprite?.frames?.[this.sprite?.currentState];
    return frame ? frame.height * this.sprite.scale : this._frameHeight;
  }

  setState(state) {
    if (this.state === state) return;
    this.state = state;
    if (this.sprite) this.sprite.setState(state);
  }

  update(dt) {
    // Breathing animation (subtle Y offset)
    const breathOffset = Math.sin(Date.now() * 0.003) * 1.5;

    if (this.sprite) {
      this.sprite.x = this.x;
      this.sprite.y = this.y + breathOffset;
      this.sprite.update(dt);
    }

    // Tail wag animation
    this.tailWagTimer += dt;

    // Head up auto-return
    if (this.headUpTimer > 0) {
      this.headUpTimer -= dt;
      if (this.headUpTimer <= 0 && this.state === 'head_up') {
        this.setState('lying_down');
      }
    }

    // Blink animation
    this.blinkTimer += dt;
    if (!this.isBlinking && this.blinkTimer > 2.5 + Math.random() * 2) {
      this.isBlinking = true;
      this.blinkTimer = 0;
    } else if (this.isBlinking && this.blinkTimer > 0.25) {
      this.isBlinking = false;
      this.blinkTimer = 0;
    }

    // Reaction bubble timer
    if (this.reactionTimer > 0) {
      this.reactionTimer -= dt;
      if (this.reactionTimer <= 0) {
        this.reactionText = null;
        this.reactionScale = 0;
      }
    }

    // Update hearts
    this.hearts = this.hearts.filter(h => {
      h.y += h.vy * dt;
      h.x += h.vx * dt;
      h.life -= dt;
      return h.life > 0;
    });
  }

  render(ctx) {
    if (!this.sprite || !this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Apply shake offset from reactWrong
    if (this.shakeOffset) {
      ctx.translate(this.shakeOffset * (Math.random() > 0.5 ? 1 : -1), 0);
    }

    // Tail wag rotation around tail base
    if (this.state === 'sitting_happy' || this.state === 'healed') {
      const tailAngle = Math.sin(this.tailWagTimer * 12) * 12;
      const cx = this.x + this.width * 0.85;
      const cy = this.y + this.height * 0.75;
      ctx.translate(cx, cy);
      ctx.rotate((tailAngle * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    this.sprite.render(ctx);

    // Blink: draw closed eyes (skin-colored bars over the eyes)
    if (this.isBlinking && (this.state === 'lying_down' || this.state === 'head_up')) {
      const s = this.sprite.scale || 6;
      const eyeX = this.sprite.x + 2 * s;
      const eyeY = this.sprite.y + 5 * s;
      const eyeW = 6 * s;
      const eyeH = 2 * s;
      ctx.fillStyle = '#FFDAB9'; // A7 peach color
      ctx.fillRect(eyeX, eyeY, eyeW, eyeH);
    }

    ctx.restore();

    // Draw name label
    this.drawNameLabel(ctx);

    // Draw reaction bubble
    if (this.reactionText) {
      this.drawReactionBubble(ctx);
    }

    // Draw hearts
    this.drawHearts(ctx);

    // Debug: draw touch zones (optional, for development)
    // this.drawZones(ctx);
  }

  drawNameLabel(ctx) {
    const label = 'PIPO';
    const bx = this.x + this.width / 2;
    const by = this.y - 18;

    ctx.save();
    ctx.font = "bold 16px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(label);
    const pad = 8;
    const bw = metrics.width + pad * 2;
    const bh = 26;

    // Bubble background
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 10);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#5D4037';
    ctx.fillText(label, bx, by + 1);
    ctx.restore();
  }

  drawReactionBubble(ctx) {
    const bx = this.x + this.width * 0.75;
    const by = this.y + this.height * 0.15;
    const s = Math.min(this.reactionScale, 1);
    if (s <= 0.01) return;

    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(s, s);

    const bw = 70;
    const bh = 38;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 8);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 12, bh / 2);
    ctx.lineTo(-bw / 2 + 8, bh / 2 + 10);
    ctx.lineTo(-bw / 2 + 20, bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#5D4037';
    ctx.fillText(this.reactionText, 0, 0);

    ctx.restore();
  }

  drawHearts(ctx) {
    for (const h of this.hearts) {
      const alpha = Math.min(h.life, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FF6B6B';
      const size = h.size;
      this.drawHeart(ctx, h.x, h.y, size);
      ctx.restore();
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.fill();
  }

  // Check which zone was touched
  getTouchedZone(touchX, touchY) {
    const sx = touchX - this.x;
    const sy = touchY - this.y;

    for (const [name, zone] of Object.entries(this.zones)) {
      const zx = zone.x * this.width;
      const zy = zone.y * this.height;
      const zw = zone.w * this.width;
      const zh = zone.h * this.height;
      if (sx >= zx && sx <= zx + zw && sy >= zy && sy <= zy + zh) {
        return name;
      }
    }
    return null;
  }

  // Interactive reactions
  touchHead() {
    if (this.state === 'lying_down') {
      this.setState('head_up');
      this.headUpTimer = 1.5;
    }
    playDogSniff();
    this.showReaction('❤️');
  }

  touchBody() {
    playDogSniff();
    this.showReaction('🐕');
  }

  touchPaw() {
    playDogOuch();
    this.showReaction('🦶');
    // Brief red glow on paw
    tween({
      from: { glow: 0 },
      to: { glow: 20 },
      duration: 200,
      yoyo: true,
      repeat: 1,
      onUpdate: (v) => { this.pawGlow = v.glow; },
    });
  }

  showReaction(text) {
    this.reactionText = text;
    this.reactionTimer = 2.0;
    tween({
      from: { s: 0 },
      to: { s: 1 },
      duration: 200,
      ease: 'easeOutBack',
      onUpdate: (v) => { this.reactionScale = v.s; },
    });
  }

  // Celebration when healed
  celebrate() {
    this.setState('sitting_happy');
    playDogBarkHappy();
    this.showReaction('🎉');

    // Spawn hearts
    for (let i = 0; i < 8; i++) {
      this.hearts.push({
        x: this.x + this.width / 2 + (Math.random() - 0.5) * 60,
        y: this.y + this.height * 0.3,
        vx: (Math.random() - 0.5) * 40,
        vy: -40 - Math.random() * 50,
        life: 1.5 + Math.random(),
        size: 6 + Math.random() * 8,
      });
    }
  }

  // Compatibility methods for TapWordMechanic
  reactCorrect(text = '😊') {
    this.showReaction(text);
  }

  reactWrong(text = '🤔') {
    this.showReaction(text);
    // Brief confused shake
    tween({
      from: { shake: 0 },
      to: { shake: 8 },
      duration: 100,
      yoyo: true,
      repeat: 3,
      onUpdate: (v) => { this.shakeOffset = v.shake; },
      onComplete: () => { this.shakeOffset = 0; },
    });
  }

  // Pet interaction after healing
  onPet() {
    if (this.state !== 'sitting_happy' && this.state !== 'healed') return;
    this.tailWagTimer = 0; // Reset tail wag for extra enthusiasm
    playDogBarkHappy();
    this.showReaction('❤️');

    for (let i = 0; i < 4; i++) {
      this.hearts.push({
        x: this.x + this.width / 2 + (Math.random() - 0.5) * 50,
        y: this.y + this.height * 0.3,
        vx: (Math.random() - 0.5) * 30,
        vy: -30 - Math.random() * 40,
        life: 1.0 + Math.random() * 0.5,
        size: 5 + Math.random() * 6,
      });
    }
  }

  centerX() {
    return this.x + this.width / 2;
  }

  centerY() {
    return this.y + this.height / 2;
  }
}
