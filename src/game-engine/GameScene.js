import { Animal } from './entities/Animal.js';
import { Pipo } from './entities/Pipo.js';
import { Paula } from './entities/Paula.js';
import { TapWordMechanic } from './mechanics/TapWord.js';
import { DragSyllablesMechanic } from './mechanics/DragSyllables.js';
import { FollowStepsMechanic } from './mechanics/FollowSteps.js';
import { TutorialHand } from './entities/TutorialHand.js';
import { ParticleSystem } from '../utils/particles.js';
import { tween, float } from '../utils/tween.js';
import { createDecoration, FLOWER_TYPES, BIOME_DECO } from './sprites/Decorations.js';
import { createItemSprite } from './sprites/Items.js';
import { speak, stopTTS, speakEncouragement, wakeUpSpeechSynthesis } from '../utils/tts.js';
import { ensureAudioContext, playMagic, playDing, startBackgroundMusic, stopBackgroundMusic, playDogBark, playDogWhine } from '../utils/sfx.js';

/**
 * v2.3 Game Scene — Tutorial hand, Paula pointing, background music, star system
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
    this.timers = [];

    // Anti-frustration state
    this.failCount = 0;
    this.inactivityTimer = 0;
    this.hintLevel = 0;

    // Visual effects
    this.screenShake = 0;
    this.flashAlpha = 0;

    // Petting reward counter (level 1)
    this.petCount = 0;

    // Tutorial
    this.tutorialHand = null;

    // Paula pointing
    this.pointingTarget = null;
    this.pointingTimer = 0;

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
    // Level 1 special: Pipo the dog with interactive touch zones
    if (this.levelData.id === 1) {
      this.animal = new Pipo(w * 0.52, h * 0.32, 10);
      this.animal.state = 'lying_down';
    } else {
      this.animal = new Animal(w * 0.55, h * 0.30, this.levelData.animal, {
        state: 'hurt', injury: this.levelData.injury, scale: 6
      });
    }

    // Animate Paula walking in
    tween({
      from: { x: -120 },
      to: { x: w * 0.12 },
      duration: 1200,
      ease: 'easeOutBack',
      onUpdate: (v) => { this.paula.x = v.x; },
      onComplete: () => {
        this.paula.setState('idle');
        if (this.levelData.id === 1) {
          // Level 1: exploration phase before buttons appear
          this.state = 'explore';
          this.startLevel1Flow();
        } else {
          this.state = 'playing';
          this.createMechanic();
        }
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

    const biomeType = BIOME_DECO[this.levelData.biome];
    if (biomeType) {
      this.biomeDeco = createDecoration(biomeType, w * 0.82, h * 0.08, 4);
    }
  }

  // Level 1 special flow: exploration → choice → celebration
  startLevel1Flow() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Step 1: Paula presents Pipo (TTS + Pipo whines)
    const t1 = setTimeout(() => {
      speak('¡Hola! Soy Paula. Este es Pipo, se lastimó la pata.', { rate: 0.75 });
    }, 400);
    this.timers.push(t1);

    const t2 = setTimeout(() => {
      if (this.animal && this.animal.setState) {
        this.animal.setState('head_up');
      }
      playDogWhine();
    }, 1800);
    this.timers.push(t2);

    // Step 2: After exploration period, show the question and buttons
    const t3 = setTimeout(() => {
      this.state = 'playing';
      this.createMechanic();
      // Paula asks the question
      speak(this.levelData.instruction, { rate: 0.75 });
    }, 6500);
    this.timers.push(t3);

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

    // Pass scene reference for particles, Paula, SFX access
    this.mechanic.scene = this;
    this.mechanic.onSuccess = () => this.onTreatmentSuccess();
    this.mechanic.onFail = () => this.onTreatmentFail();

    // Tutorial for first encounter of each mechanic
    this.setupTutorial(mechanicType);

    // Start background music
    startBackgroundMusic();

    // Paula greets and reads instruction aloud
    // Level 1: intro TTS is handled in startLevel1Flow()
    if (this.levelData.id !== 1) {
      const t1 = setTimeout(() => {
        speak('¡Hola! Soy Paula. ' + this.levelData.instruction, { rate: 0.75 });
      }, 600);
      this.timers.push(t1);
    }
  }

  // Tutorial system
  setupTutorial(mechanicType) {
    const tutorialLevels = {
      'tap_word': [1],
      'drag_syllables': [4],
      'follow_steps': [5],
      'follow_steps_drag': [11],
    };

    const needsTutorial = tutorialLevels[mechanicType]?.includes(this.levelData.id);
    if (needsTutorial && !this.hasSeenTutorial(mechanicType)) {
      // Don't mark as seen yet — persist until correct answer or timeout
      const w = this.canvas.width;
      const h = this.canvas.height;

      if (mechanicType === 'tap_word') {
        const correctBtn = this.mechanic.buttons.find(b => b.isCorrect);
        if (correctBtn) {
          this.tutorialHand = new TutorialHand(
            correctBtn.x + correctBtn.width / 2,
            correctBtn.y - 50,
            correctBtn.x + correctBtn.width / 2,
            correctBtn.y + correctBtn.height / 2
          );
        }
      } else if (mechanicType === 'drag_syllables') {
        const firstBlock = this.mechanic.syllableBlocks[0];
        const firstSlot = this.mechanic.slots[0];
        if (firstBlock && firstSlot) {
          this.tutorialHand = new TutorialHand(
            firstBlock.x + firstBlock.width / 2,
            firstBlock.y + firstBlock.height / 2,
            firstSlot.x + firstSlot.width / 2,
            firstSlot.y + firstSlot.height / 2
          );
        }
      } else if (mechanicType === 'follow_steps' || mechanicType === 'follow_steps_drag') {
        const firstObj = this.mechanic.stepObjects[0];
        if (firstObj) {
          this.tutorialHand = new TutorialHand(
            firstObj.x + firstObj.width / 2,
            firstObj.y + firstObj.height / 2,
            w * 0.55 + 70,
            h * 0.20 + 60
          );
        }
      }
    }
  }

  hasSeenTutorial(type) {
    try {
      const seen = JSON.parse(localStorage.getItem('vp_tutorials') || '{}');
      return seen[type] === true;
    } catch { return false; }
  }

  markTutorialSeen(type) {
    try {
      const seen = JSON.parse(localStorage.getItem('vp_tutorials') || '{}');
      seen[type] = true;
      localStorage.setItem('vp_tutorials', JSON.stringify(seen));
    } catch {}
  }

  onTreatmentSuccess() {
    this.state = 'success';
    this.paula.setState('celebrate');
    if (this.levelData.id === 1 && this.animal.celebrate) {
      this.animal.celebrate();
    } else {
      this.animal.heal();
    }

    // Stop tutorial if active — mark as seen now that they succeeded
    if (this.tutorialHand) {
      this.markTutorialSeen(this.levelData.mechanic);
      this.tutorialHand = null;
    }
    this.pointingTarget = null;

    // Stop background music gently
    stopBackgroundMusic();

    // SFX: magic arpeggio for level complete
    playMagic();

    // WOW MOMENT: Screen shake + flash
    this.screenShake = 12;
    this.flashAlpha = 0.8;

    // Rich celebration — more particles for level 1
    const cx = this.animal.centerX();
    const cy = this.animal.y;
    const particleCount = this.levelData.id === 1 ? 80 : 40;
    this.particles.spawnConfetti(cx, cy, particleCount);
    this.particles.spawnHearts(cx, cy - 30, 20);
    this.particles.spawnStars(cx, cy - 50, 25);

    // Level 1: Burst from multiple points
    if (this.levelData.id === 1) {
      this.particles.spawnConfetti(cx - 80, cy, 30);
      this.particles.spawnConfetti(cx + 80, cy, 30);
      this.particles.spawnHearts(cx, cy - 60, 15);
    }

    // Animal happy bark
    setTimeout(() => playDogBark(), 400);

    // Paula jumps (higher for level 1)
    const jumpHeight = this.levelData.id === 1 ? 60 : 40;
    tween({
      from: { y: this.paula.y },
      to: { y: this.paula.y - jumpHeight },
      duration: 250,
      ease: 'easeOut',
      onUpdate: (v) => { this.paula.y = v.y; },
      onComplete: () => {
        tween({
          from: { y: this.paula.y },
          to: { y: this.paula.y + jumpHeight },
          duration: 300,
          ease: 'easeOutBounce',
          onUpdate: (v) => { this.paula.y = v.y; },
        });
      },
    });

    // Speak celebration
    const t1 = setTimeout(() => {
      speak(this.levelData.celebration, { rate: 0.85, pitch: 1.15 });
    }, 200);
    this.timers.push(t1);

    // Level 1: Petting reward phase — stay in success longer
    const delay = this.levelData.id === 1 ? 4000 : 800;
    const t2 = setTimeout(() => {
      this.state = 'celebrate';
      if (this.onComplete) this.onComplete();
    }, delay);
    this.timers.push(t2);
  }

  onTreatmentFail(wrongWord) {
    this.failCount++;
    this.inactivityTimer = 0;

    // Hide tutorial on first interaction
    if (this.tutorialHand) {
      this.tutorialHand.done = true;
      this.tutorialHand = null;
    }

    // Level 1 special: "no-fail" fun reaction when choosing HUESO
    if (this.levelData.id === 1 && wrongWord === 'HUESO') {
      // Paula explains in a friendly way
      const tts1 = setTimeout(() => {
        speak('¡Un hueso es para comer! Pipo necesita una venda para su pata', { rate: 0.75, pitch: 1.15 });
      }, 400);
      this.timers.push(tts1);

      // Paula points to Pipo's hurt paw
      if (this.animal) {
        const pawX = this.animal.x + this.animal.width * 0.5;
        const pawY = this.animal.y + this.animal.height * 0.8;
        this.pointingTarget = { x: pawX, y: pawY };
        this.pointingTimer = 3.0;
        this.paula.setState('pointing');
      }

      // Pipo looks confused (head up, then back down)
      if (this.animal && this.animal.setState) {
        this.animal.setState('head_up');
        const t = setTimeout(() => {
          if (this.animal && this.animal.state === 'head_up') {
            this.animal.setState('lying_down');
          }
        }, 1200);
        this.timers.push(t);
      }

      // After explanation, auto-highlight the correct button
      const t2 = setTimeout(() => {
        if (this.mechanic && this.mechanic.highlightCorrect) {
          this.mechanic.highlightCorrect();
        }
      }, 2500);
      this.timers.push(t2);

      return; // Skip default fail handling for level 1 HUESO
    }

    // Escalate hint level
    if (this.failCount === 2) {
      this.activateHint(1);
    } else if (this.failCount === 3) {
      this.activateHint(2);
    } else if (this.failCount >= 4) {
      this.activateHint(3);
    }

    // Adaptive TTS
    if (this.failCount === 1) {
      speakEncouragement();
    } else if (this.failCount === 2) {
      speak('¡Casi! Mira bien las opciones...', { rate: 0.8, pitch: 1.1 });
    } else if (this.failCount === 3) {
      speak('Paula te va a ayudar a encontrarla...', { rate: 0.75, pitch: 1.1 });
    }

    // Paula reacts briefly, then back to idle
    this.paula.setState('worried');
    const t = setTimeout(() => {
      if (this.state === 'playing') this.paula.setState('idle');
    }, 700);
    this.timers.push(t);

    // Animal reaction (sound + animation) is handled by the mechanic
  }

  activateHint(level) {
    if (level <= this.hintLevel) return;
    this.hintLevel = level;
    if (this.mechanic?.showHint) {
      this.mechanic.showHint(level);
    }

    // Paula pointing (hint level 2)
    if (level === 2) {
      const target = this.mechanic.getCorrectTarget?.();
      if (target) {
        this.pointingTarget = target;
        this.pointingTimer = 4.0; // 4 seconds of pointing
        this.paula.setState('pointing');
      }
    }
  }

  triggerPaulaMiniCheer() {
    const original = this.paula.state;
    this.paula.setState('celebrate');
    const t = setTimeout(() => {
      if (this.paula.state === 'celebrate' && this.state === 'playing') {
        this.paula.setState(original === 'celebrate' ? 'idle' : original);
      }
    }, 250);
    this.timers.push(t);
  }

  update(dt) {
    this.stateTimer += dt;
    if (this.paula) this.paula.update(dt);
    if (this.animal) this.animal.update(dt);
    if (this.mechanic && this.state === 'playing') this.mechanic.update(dt);
    this.particles.update(dt);

    // Update tutorial hand
    if (this.tutorialHand && this.state === 'playing') {
      this.tutorialHand.update(dt);
    }

    // Update Paula pointing timer
    if (this.pointingTarget && this.pointingTimer > 0) {
      this.pointingTimer -= dt;
      if (this.pointingTimer <= 0) {
        this.pointingTarget = null;
        if (this.paula.state === 'pointing') {
          this.paula.setState('idle');
        }
      }
    }

    // Decay visual effects
    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.5) this.screenShake = 0;
    }
    if (this.flashAlpha > 0) {
      this.flashAlpha -= dt * 1.5;
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }

    // Detect inactivity for hints
    if (this.state === 'playing' && !this.mechanic?.completed) {
      this.inactivityTimer += dt;
      if (this.inactivityTimer > 8.0 && this.hintLevel === 0) {
        this.activateHint(1);
      }
    }
  }

  render(ctx, width, height) {
    // Apply screen shake
    ctx.save();
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    this.renderBackground(ctx, width, height);
    if (this.paula) this.paula.render(ctx);
    if (this.animal) this.animal.render(ctx);
    this.particles.render(ctx);
    if (this.mechanic && (this.state === 'playing' || this.state === 'success')) this.mechanic.render(ctx);

    // Render Paula pointing line
    if (this.pointingTarget && this.paula) {
      this.renderPointingLine(ctx);
    }

    // Render tutorial hand on top of everything
    if (this.tutorialHand && this.state === 'playing' && !this.tutorialHand.done) {
      this.tutorialHand.render(ctx);
    }

    // Skip indicator during success state
    if (this.state === 'success' && this.stateTimer > 0.4) {
      ctx.save();
      ctx.globalAlpha = Math.min((this.stateTimer - 0.4) * 2, 0.5);
      ctx.fillStyle = '#8D6E63';
      ctx.font = "16px 'Nunito', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('Toca para continuar', width / 2, height * 0.96);
      ctx.restore();
    }

    // Restore from screen shake
    ctx.restore();

    // Flash effect (rendered on top, unaffected by shake)
    if (this.flashAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    this.renderLevelBadge(ctx);
    this.renderSoundButton(ctx, width);
  }

  renderPointingLine(ctx) {
    if (!this.pointingTarget) return;
    const startX = this.paula.centerX();
    const startY = this.paula.y + this.paula.height * 0.3;
    const endX = this.pointingTarget.x;
    const endY = this.pointingTarget.y;

    ctx.save();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -Date.now() / 25; // Animated marching ants

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    // Quadratic curve for organic feel
    ctx.quadraticCurveTo(
      (startX + endX) / 2,
      Math.min(startY, endY) - 40,
      endX,
      endY
    );
    ctx.stroke();

    // Arrow/pulse at target
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.2;
    ctx.beginPath();
    ctx.arc(endX, endY, 8 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderBackground(ctx, w, h) {
    const palettes = {
      clinica: { top: '#FFF5F5', bottom: '#FFE4E1', ground: '#FFCDD2', accent: '#FF6B6B' },
      granja: { top: '#FFFBF0', bottom: '#FFF3E0', ground: '#FFE0B2', accent: '#F7DC6F' },
      bosque: { top: '#F0FFF4', bottom: '#E8F5E9', ground: '#C8E6C9', accent: '#58D68D' },
      selva: { top: '#F0FDFA', bottom: '#E0F2F1', ground: '#B2DFDB', accent: '#1ABC9C' },
    };
    const p = palettes[this.levelData.biome] || palettes.clinica;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, p.top);
    grad.addColorStop(1, p.bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

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

    ctx.fillStyle = p.ground;
    ctx.beginPath();
    ctx.ellipse(w / 2, h, w * 0.95, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    this.decorations.forEach((deco, i) => {
      if (deco.sprite) {
        deco.sprite.y = deco.baseY + Math.sin(time * 2 + deco.swayOffset) * 4;
        deco.sprite.render(ctx);
      }
    });

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
    wakeUpSpeechSynthesis();
    ensureAudioContext();

    // Sound button
    if (x > this.canvas.width - 65 && x < this.canvas.width - 10 && y > 10 && y < 58) {
      speak(this.levelData.instruction, { rate: 0.75 });
      return true;
    }

    // Level 1 petting reward during success
    if (this.state === 'success' && this.levelData.id === 1 && this.animal) {
      const zone = this.animal.getTouchedZone?.(x, y);
      if (zone && this.animal.onPet) {
        this.animal.onPet();
        this.petCount++;
        // Spawn extra hearts on pet
        const cx = this.animal.centerX();
        const cy = this.animal.y;
        this.particles.spawnHearts(cx, cy - 20, 5);

        if (this.petCount >= 3) {
          // Paula says goodbye
          speak('¡Pipo está muy feliz! Eres un gran veterinario', { rate: 0.8, pitch: 1.15 });
          this.timers.forEach(t => clearTimeout(t));
          this.timers = [];
          this.state = 'celebrate';
          if (this.onComplete) this.onComplete();
        }
        return true;
      }
      // Tap elsewhere skips
      this.timers.forEach(t => clearTimeout(t));
      this.timers = [];
      stopTTS();
      stopBackgroundMusic();
      this.state = 'celebrate';
      if (this.onComplete) this.onComplete();
      return true;
    }

    // Skip celebration on tap (non-level-1)
    if (this.state === 'success') {
      this.timers.forEach(t => clearTimeout(t));
      this.timers = [];
      stopTTS();
      stopBackgroundMusic();
      this.state = 'celebrate';
      if (this.onComplete) this.onComplete();
      return true;
    }

    // Reset inactivity
    this.inactivityTimer = 0;

    // Level 1 exploration phase: touch Pipo's zones
    if (this.state === 'explore' && this.levelData.id === 1 && this.animal) {
      const pipo = this.animal;
      const zone = pipo.getTouchedZone?.(x, y);
      if (zone) {
        if (zone === 'head') pipo.touchHead();
        else if (zone === 'body') pipo.touchBody();
        else if (zone === 'paw') {
          pipo.touchPaw();
          // Touching the hurt paw accelerates the flow
          if (this.exploreTimer) {
            clearTimeout(this.exploreTimer);
            this.exploreTimer = null;
          }
          // Move to playing after a short delay
          const t = setTimeout(() => {
            if (this.state === 'explore') {
              this.state = 'playing';
              this.createMechanic();
              speak(this.levelData.instruction, { rate: 0.75 });
            }
          }, 1500);
          this.timers.push(t);
        }
        return true;
      }
    }

    // Tutorial persists until correct answer (handled by mechanic) or long inactivity
    // Don't dismiss on random touches anymore

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
    stopTTS();
    stopBackgroundMusic();
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    if (this.floatAnim) this.floatAnim.stop();
  }
}
