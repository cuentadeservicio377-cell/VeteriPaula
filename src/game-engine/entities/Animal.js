import { Entity } from './Entity.js';
import { tween } from '../../utils/tween.js';
import { createAnimal } from '../sprites/Characters.js';

/**
 * Animal entity with reactions and emotions
 * v2.4 — Added reactWrong() with head shake and thought bubble
 */
export class Animal extends Entity {
  constructor(x, y, typeOrSprite, options = {}) {
    super(x, y, 1, 1);

    // Support both: new Animal(x, y, 'dog', {scale:6}) and new Animal(x, y, spriteObj)
    if (typeof typeOrSprite === 'string') {
      this.type = typeOrSprite;
      this.sprite = createAnimal(typeOrSprite, x, y, options.scale || 5);
    } else {
      this.type = options.type || 'unknown';
      this.sprite = typeOrSprite;
    }

    // Sync Entity dimensions to actual sprite size
    const frame = this.sprite?.frames?.[this.sprite.currentState];
    if (frame) {
      this.width = frame.width * this.sprite.scale;
      this.height = frame.height * this.sprite.scale;
    }

    this.state = options.state || 'idle'; // idle | hurt | healing | happy | confused
    this.hearts = [];
    this.healingTimer = 0;
    this.thinkTimer = 0;
    this.confusedTimer = 0;
    this.reactionText = null; // For thought bubble text
    this.reactionScale = 0;
    this.headShake = 0;
    this.headShakeTimer = 0;
  }

  setState(state) {
    this.state = state;
    if (this.sprite) this.sprite.setState(state);
  }

  update(dt) {
    if (this.sprite) this.sprite.update(dt);

    // Head shake animation
    if (this.headShakeTimer > 0) {
      this.headShakeTimer -= dt;
      this.headShake = Math.sin(this.headShakeTimer * 30) * 8;
      if (this.headShakeTimer <= 0) {
        this.headShake = 0;
      }
    }

    // Healing progression
    if (this.state === 'healing') {
      this.healingTimer += dt;
      if (this.healingTimer > 1.5) {
        this.state = 'happy';
        if (this.sprite) this.sprite.setState('happy');
      }
    }

    // Thought bubble timer
    if (this.thinkTimer > 0) {
      this.thinkTimer -= dt;
      if (this.thinkTimer <= 0) {
        this.reactionText = null;
        this.reactionScale = 0;
      }
    }

    // Confused timer
    if (this.confusedTimer > 0) {
      this.confusedTimer -= dt;
      if (this.confusedTimer <= 0 && this.state === 'confused') {
        this.state = 'hurt';
        if (this.sprite) this.sprite.setState('hurt');
      }
    }
  }

  draw(ctx) {
    if (!this.sprite) return;

    // Render sprite directly in canvas space (bypass Entity transform)
    // to avoid double-translation with PixelSprite's own transform
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Apply head shake rotation around sprite center
    if (this.headShake !== 0) {
      const cx = this.sprite.centerX();
      const cy = this.sprite.centerY() - 20;
      ctx.translate(cx, cy);
      ctx.rotate((this.headShake * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    this.sprite.render(ctx);
    ctx.restore();

    // Thought bubble (also in canvas space)
    if (this.reactionText) {
      this.drawReactionBubble(ctx);
    }
  }

  drawReactionBubble(ctx) {
    const bx = this.x + this.width / 2 + 30;
    const by = this.y - this.height / 2 - 20;
    const s = Math.min(this.reactionScale, 1);

    if (s <= 0.01) return;

    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(s, s);

    // Bubble body
    const bw = 80;
    const bh = 40;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 8);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 15, bh / 2);
    ctx.lineTo(-bw / 2 + 10, bh / 2 + 12);
    ctx.lineTo(-bw / 2 + 25, bh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Emoji / Text
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#5D4037';
    ctx.fillText(this.reactionText, 0, 0);

    ctx.restore();
  }

  heal() {
    this.state = 'healing';
    if (this.sprite) this.sprite.setState('healing');
    this.healingTimer = 0;
  }

  centerX() {
    return this.x + this.width / 2;
  }

  /**
   * React to wrong answer — head shake + confused state + thought bubble
   */
  reactWrong(text = '🤔') {
    this.state = 'confused';
    if (this.sprite) this.sprite.setState('confused');
    this.confusedTimer = 1.2;
    this.headShakeTimer = 0.6;
    this.reactionText = text;

    // Pop-in animation for thought bubble
    tween({
      from: { s: 0 },
      to: { s: 1 },
      duration: 200,
      ease: 'easeOutBack',
      onUpdate: (v) => { this.reactionScale = v.s; },
    });

    this.thinkTimer = 2.0;
  }

  /**
   * React to correct item application
   */
  reactCorrect(text = '😊') {
    this.reactionText = text;
    this.thinkTimer = 2.0;
    tween({
      from: { s: 0 },
      to: { s: 1 },
      duration: 200,
      ease: 'easeOutBack',
      onUpdate: (v) => { this.reactionScale = v.s; },
    });
  }

  /**
   * Spawn sparkle burst (called by GameScene)
   */
  spawnHearts() {
    for (let i = 0; i < 5; i++) {
      this.hearts.push({
        x: this.x + this.width / 2 + (Math.random() - 0.5) * 60,
        y: this.y - this.height / 2,
        vx: (Math.random() - 0.5) * 60,
        vy: -30 - Math.random() * 40,
        life: 1.0,
        size: 8 + Math.random() * 8,
      });
    }
  }
}
