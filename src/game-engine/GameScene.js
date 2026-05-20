import { Animal } from './entities/Animal.js';
import { Paula } from './entities/Paula.js';
import { TapWordMechanic } from './mechanics/TapWord.js';
import { DragSyllablesMechanic } from './mechanics/DragSyllables.js';
import { FollowStepsMechanic } from './mechanics/FollowSteps.js';
import { ParticleSystem } from '../utils/particles.js';
import { tween, float } from '../utils/tween.js';
import { createDecoration, FLOWER_TYPES, BIOME_DECO } from './sprites/Decorations.js';
import { createItemSprite } from './sprites/Items.js';

/**
 * v2.0 Game Scene — Rich animations, particles, tweening, anti-frustration
 */
export class GameScene {
  constructor(canvas, levelData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.levelData = levelData;
    this.state = 'intro'; // intro, playing, success, celebrate
    this.stateTimer = 0;
    this.paula = null;
    this.animal = null;
    this.mechanic = null;
    this.particles = new ParticleSystem();
    this.onComplete = null;
    this.onFail = null;
    this.floatAnim = null;

    this.decorations = [];
    this.soundSprite = null;
    this.setupScene();
  }

  setupScene() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Paula enters from left
    this.paula = new Paula(-120, h * 0.35, { state: 'walk', scale: 6 });

    // Animal waits on the right, hurt
    this.animal = new Animal(w * 0.55, h * 0.30, this.levelData.animal, {
      state: 'hurt', injury: this.levelData.injury, scale: 6
    });

    // Animate Paula walking in
    tween({
      from: { x: -120 },
      to: { x: w * 0.12 },
      duration: 1200,
      ease: 'easeOutBack',
      onUpdate: (v) => { this.paula.x = v.x; },
      onComplete: () => {
        this.paula.setState('worried');
        this.state = 'playing';
        this.createMechanic();
      },
    });

    // Start floating animation for animal
    this.floatAnim = float(this.animal, 4, 1.5);

    // Create pixel art decorations
    this.createDecorations();

    // Sound button sprite
    this.soundSprite = createItemSprite('sound', this.canvas.width - 50, 18, 3);
  }

  createDecorations() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Flowers along the ground
    this.decorations = [];
    for (let i = 0; i < 7; i++) {
      const type = FLOWER_TYPES[i % FLOWER_TYPES.length];
      const fx = w * (0.08 + i * 0.14);
      const fy = h * 0.88 + (i % 2 === 0 ? 0 : 15);
      this.decorations.push({
        sprite: createDecoration(type, fx, fy, 4),
        baseY: fy,
        swayOffset: i * 1.3,
      });
    }

    // Biome decoration
    const biomeType = BIOME_DECO[this.levelData.biome];
    if (biomeType) {
      this.biomeDeco = createDecoration(biomeType, w * 0.82, h * 0.08, 4);
    }
  }

  createMechanic() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const mechanicType = this.levelData.mechanic;

    switch (mechanicType) {
      case 'tap_word':
        this.mechanic = new TapWordMechanic(this.levelData, w, h);
        break;
      case 'drag_syllables':
      case 'read_sentence_drag':
        this.mechanic = new DragSyllablesMechanic(this.levelData, w, h);
        break;
      case 'follow_steps':
      case 'follow_steps_drag':
        this.mechanic = new FollowStepsMechanic(this.levelData, w, h);
        break;
      default:
        this.mechanic = new TapWordMechanic(this.levelData, w, h);
    }

    this.mechanic.onSuccess = () => this.onTreatmentSuccess();
    this.mechanic.onFail = () => this.onTreatmentFail();

    // Read instruction aloud
    this.speakText(this.levelData.instruction);
  }

  speakText(text) {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.7;
      utterance.pitch = 1.15;
      window.speechSynthesis.speak(utterance);
    }
  }

  onTreatmentSuccess() {
    this.state = 'success';
    this.paula.setState('celebrate');
    this.animal.heal();

    // Rich celebration
    const cx = this.animal.centerX();
    const cy = this.animal.y;
    this.particles.spawnConfetti(cx, cy, 50);
    this.particles.spawnHearts(cx, cy - 30, 15);
    this.particles.spawnStars(cx, cy - 50, 20);

    // Paula jumps
    tween({
      from: { y: this.paula.y },
      to: { y: this.paula.y - 40 },
      duration: 300,
      ease: 'easeOut',
      onUpdate: (v) => { this.paula.y = v.y; },
      onComplete: () => {
        tween({
          from: { y: this.paula.y },
          to: { y: this.paula.y + 40 },
          duration: 400,
          ease: 'easeOutBounce',
          onUpdate: (v) => { this.paula.y = v.y; },
        });
      },
    });

    // Speak celebration
    setTimeout(() => {
      this.speakText(this.levelData.celebration);
    }, 500);

    setTimeout(() => {
      this.state = 'celebrate';
      if (this.onComplete) this.onComplete();
    }, 2500);
  }

  onTreatmentFail() {
    // Anti-frustration: Paula encourages
    this.paula.setState('worried');

    // Gentle hint
    setTimeout(() => {
      this.paula.setState('idle');
    }, 800);
  }

  update(dt) {
    this.stateTimer += dt;
    if (this.paula) this.paula.update(dt);
    if (this.animal) this.animal.update(dt);
    if (this.mechanic && this.state === 'playing') this.mechanic.update(dt);
    this.particles.update(dt);
  }

  render(ctx, width, height) {
    this.renderBackground(ctx, width, height);
    if (this.paula) this.paula.render(ctx);
    if (this.animal) this.animal.render(ctx);
    this.particles.render(ctx);
    if (this.mechanic && this.state === 'playing') this.mechanic.render(ctx);

    // Level badge
    this.renderLevelBadge(ctx);

    // Sound button
    this.renderSoundButton(ctx, width);
  }

  renderBackground(ctx, w, h) {
    const palettes = {
      clinica: { top: '#FFF5F5', bottom: '#FFE4E1', ground: '#FFCDD2', accent: '#FF6B6B' },
      granja: { top: '#FFFBF0', bottom: '#FFF3E0', ground: '#FFE0B2', accent: '#F7DC6F' },
      bosque: { top: '#F0FFF4', bottom: '#E8F5E9', ground: '#C8E6C9', accent: '#58D68D' },
      selva: { top: '#F0FDFA', bottom: '#E0F2F1', ground: '#B2DFDB', accent: '#1ABC9C' },
    };
    const p = palettes[this.levelData.biome] || palettes.clinica;

    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, p.top);
    grad.addColorStop(1, p.bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative clouds
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const time = this.stateTimer;
    for (let i = 0; i < 3; i++) {
      const cx = w * (0.15 + i * 0.35) + Math.sin(time * 0.5 + i * 2) * 30;
      const cy = h * 0.06 + Math.cos(time * 0.3 + i) * 8;
      ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.arc(cx + 28, cy - 6, 28, 0, Math.PI * 2);
      ctx.arc(cx + 55, cy, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    ctx.fillStyle = p.ground;
    ctx.beginPath();
    ctx.ellipse(w / 2, h, w * 0.95, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pixel art flowers (swaying)
    this.decorations.forEach((deco, i) => {
      if (deco.sprite) {
        deco.sprite.y = deco.baseY + Math.sin(time * 2 + deco.swayOffset) * 4;
        deco.sprite.render(ctx);
      }
    });

    // Biome decoration (pixel art)
    if (this.biomeDeco) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      this.biomeDeco.render(ctx);
      ctx.restore();
    }
  }

  renderLevelBadge(ctx) {
    const badgeW = 110;
    const badgeH = 42;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 8;
    this.roundRect(ctx, 12, 12, badgeW, badgeH, 14);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 16px 'Nunito', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText(`⭐ Nivel ${this.levelData.id}`, 24, 40);
  }

  renderSoundButton(ctx, w) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 6;
    this.roundRect(ctx, w - 58, 12, 46, 42, 12);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pixel art sound icon
    if (this.soundSprite) {
      this.soundSprite.x = w - 50;
      this.soundSprite.render(ctx);
    }
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  handleTouch(x, y) {
    // Sound button
    if (x > this.canvas.width - 65 && x < this.canvas.width - 10 && y > 10 && y < 58) {
      this.speakText(this.levelData.instruction);
      return true;
    }

    if (this.state === 'playing' && this.mechanic) {
      return this.mechanic.handleTouch(x, y);
    }
    return false;
  }

  handleTouchMove(x, y) {
    if (this.state === 'playing' && this.mechanic) {
      this.mechanic.handleTouchMove(x, y);
      this.mechanic.handleMouseMove(x, y);
    }
  }

  handleTouchEnd() {
    if (this.state === 'playing' && this.mechanic && this.mechanic.handleTouchEnd) {
      this.mechanic.handleTouchEnd();
    }
  }

  handleMouseMove(x, y) {
    if (this.state === 'playing' && this.mechanic) {
      this.mechanic.handleMouseMove(x, y);
    }
  }

  resize() {
    if (this.mechanic) this.mechanic.resize(this.canvas.width, this.canvas.height);
  }

  destroy() {
    if (this.floatAnim) this.floatAnim.stop();
    if (this.mechanic) {
      // Cleanup any ongoing tweens
    }
  }
}
