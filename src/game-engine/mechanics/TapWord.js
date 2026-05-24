import { WordButton } from '../entities/WordButton.js';
import { tween, shake } from '../../utils/tween.js';
import { speak, speakSuccess, speakEncouragement, speakWord } from '../../utils/tts.js';
import { playPop, playDing, playDogWhine, playDogNope } from '../../utils/sfx.js';
import { spellPhonetic, playNewSounds } from '../../audio/PhoneticEngine.js';
import { createItemSprite, STEP_TO_SPRITE } from '../sprites/Items.js';

/**
 * v2.4 — Tap Word mechanic with icons, flying bandage, animal reactions
 */
export class TapWordMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.buttons = [];
    this.completed = false;
    this.onSuccess = null;
    this.onFail = null;
    this.floatAnims = [];
    this.scene = null; // set by GameScene
    this.flyingItem = null; // flying bandage/item sprite
    this.createButtons();
  }

  createButtons() {
    const options = this.levelData.options;
    const correct = this.levelData.correct;

    const isNarrow = this.w < 500;
    // Bigger bubbles for kids' fingers (min 140px diameter)
    const btnSize = isNarrow ? Math.min(160, (this.w - 60) / options.length - 20) : 180;
    const spacing = isNarrow ? 20 : 40;
    const totalWidth = options.length * btnSize + (options.length - 1) * spacing;
    const startX = (this.w - totalWidth) / 2;
    const y = this.h * 0.58;

    this.buttons = options.map((word, i) => {
      // Create icon sprite for this button (if mapping exists)
      const spriteType = STEP_TO_SPRITE[word.toUpperCase()];
      let iconSprite = null;
      if (spriteType) {
        // Create at (0,0) — WordButton will position it
        iconSprite = createItemSprite(spriteType, 0, 0, 4);
      }

      const btn = new WordButton(startX + i * (btnSize + spacing), y, word, word === correct, {
        width: btnSize, height: btnSize, fontSize: isNarrow ? 26 : 32,
        bgColor: '#FFFFFF', hoverColor: '#FFDac1',
        correctColor: '#B5EAD7', wrongColor: '#FF9AA2',
        iconSprite: iconSprite,
        iconScale: 1.4,
        borderRadius: btnSize / 2,
      });
      btn.baseY = y;
      btn.floatOffset = i * 1.5;
      return btn;
    });

    this.startFloating();
  }

  startFloating() {
    const tick = () => {
      if (this.completed) return;
      const time = performance.now() / 1000;
      this.buttons.forEach(btn => {
        if (!btn.confirmed && !btn.wrong) {
          btn.y = btn.baseY + Math.sin(time * 2 + btn.floatOffset) * 6;
        }
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  update(dt) {
    this.buttons.forEach(btn => btn.update(dt));

    // Update flying item (just for pop-in animation; success triggered by onCorrect)
    if (this.flyingItem) {
      this.flyingItem.sprite.update?.(dt);
      this.flyingItem.timer -= dt;
      if (this.flyingItem.timer <= 0 && this.flyingItem.phase === 'stick') {
        this.flyingItem = null;
      }
    }
  }

  render(ctx) {
    // Instruction text
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 26px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.instruction, this.w / 2, this.h * 0.38);

    // Tip text removed — literal tip eliminates cognitive challenge for children

    // Render buttons
    this.buttons.forEach(btn => btn.render(ctx));

    // Render flying bandage
    if (this.flyingItem && this.flyingItem.sprite) {
      ctx.save();
      ctx.globalAlpha = this.flyingItem.alpha || 1;
      // Highlight circle behind item
      const cx = this.flyingItem.sprite.x + (this.flyingItem.sprite.width * this.flyingItem.sprite.scale) / 2;
      const cy = this.flyingItem.sprite.y + (this.flyingItem.sprite.height * this.flyingItem.sprite.scale) / 2;
      const r = Math.max(this.flyingItem.sprite.width, this.flyingItem.sprite.height) * this.flyingItem.sprite.scale * 0.7;
      ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 15;
      this.flyingItem.sprite.render(ctx);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // Tap hint
    if (!this.completed) {
      ctx.fillStyle = '#BCAAA4';
      ctx.font = "16px 'Nunito', sans-serif";
      ctx.fillText('Toca la palabra correcta', this.w / 2, this.h * 0.88);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    for (const btn of this.buttons) {
      if (btn.containsExpanded(x, y)) {
        playPop();
        speakWord(btn.word);

        // Immediate squash feedback (extreme for kids)
        tween({
          from: { scale: btn.scale },
          to: { scale: 0.6 },
          duration: 50,
          ease: 'easeOut',
          onUpdate: (v) => { btn.scale = v.scale; },
          onComplete: () => {
            tween({
              from: { scale: btn.scale },
              to: { scale: 1.0 },
              duration: 200,
              ease: 'easeOutElastic',
              onUpdate: (v) => { btn.scale = v.scale; },
            });
          },
        });

        // Particles on ANY touch (keeps it fun)
        if (this.scene && this.scene.particles) {
          const cx = btn.x + btn.width / 2;
          const cy = btn.y + btn.height / 2;
          this.scene.particles.spawnStars(cx, cy, 8);
        }

        if (btn.isCorrect) {
          this.onCorrect(btn);
        } else {
          this.onWrong(btn);
        }
        return true;
      }
    }
    return false;
  }

  onCorrect(btn) {
    this.completed = true;
    btn.setCorrect();
    playDing();

    // Particles burst from the correct bubble
    if (this.scene && this.scene.particles) {
      const cx = btn.x + btn.width / 2;
      const cy = btn.y + btn.height / 2;
      this.scene.particles.spawnConfetti(cx, cy, 30);
      this.scene.particles.spawnStars(cx, cy, 15);
    }

    // Get animal position from scene
    const animal = this.scene?.animal;
    const targetX = animal ? animal.x + animal.width * 0.6 : this.w * 0.65;
    const targetY = animal ? animal.y + animal.height * 0.5 : this.h * 0.25;

    // Button flies to animal FAST
    tween({
      from: { x: btn.x, y: btn.y, scale: 1, alpha: 1 },
      to: { x: targetX, y: targetY, scale: 0.3, alpha: 1 },
      duration: 200,
      ease: 'easeOutBack',
      onUpdate: (v) => { btn.x = v.x; btn.y = v.y; btn.scale = v.scale; },
      onComplete: () => {
        btn.visible = false;

        // Item pops in on Pipo
        const spriteType = STEP_TO_SPRITE[btn.word.toUpperCase()];
        if (spriteType && animal) {
          this.flyingItem = {
            sprite: createItemSprite(spriteType, targetX, targetY, 8),
            timer: 0.5,
            phase: 'stick',
            alpha: 1,
          };
          if (this.flyingItem.sprite) {
            this.flyingItem.sprite.scale = 0;
            tween({
              from: { s: 0 },
              to: { s: 8 },
              duration: 150,
              ease: 'easeOutBack',
              onUpdate: (v) => {
                if (this.flyingItem && this.flyingItem.sprite) {
                  this.flyingItem.sprite.scale = v.s;
                }
              },
            });
          }
        }

        if (animal) animal.reactCorrect('😊');
        speakSuccess(btn.word);

        // IMMEDIATE celebration
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, 200);
      },
    });
  }

  onWrong(btn) {
    btn.setWrong();
    playDogNope();

    // Particles even on wrong (keeps it fun, not punishing)
    if (this.scene && this.scene.particles) {
      const cx = btn.x + btn.width / 2;
      const cy = btn.y + btn.height / 2;
      this.scene.particles.spawnConfetti(cx, cy, 10);
    }

    const animal = this.scene?.animal;
    if (animal && animal.reactWrong) {
      animal.reactWrong('🤔');
    }

    // Bounce the wrong bubble away
    tween({
      from: { x: btn.x, y: btn.y },
      to: { x: btn.x + (Math.random() - 0.5) * 100, y: btn.y + 50 },
      duration: 300,
      ease: 'easeOut',
      onUpdate: (v) => { btn.x = v.x; btn.y = v.y; },
      onComplete: () => {
        btn.reset();
      },
    });

    setTimeout(() => {
      speakEncouragement();
    }, 200);

    if (this.onFail) this.onFail(btn.word);
  }

  handleMouseMove(x, y) {
    this.buttons.forEach(btn => {
      if (!btn.confirmed && !btn.wrong) {
        btn.hovered = btn.containsExpanded(x, y);
        if (btn.hovered) btn.scale = 1.08;
        else btn.scale = 1;
      }
    });
  }

  handleTouchMove(x, y) {
    this.handleMouseMove(x, y);
  }

  handleTouchEnd() {
    // Nothing special needed for tap mechanic
  }

  // Anti-frustration hints
  showHint(level) {
    if (level >= 1) {
      const correctBtn = this.buttons.find(b => b.isCorrect);
      if (correctBtn) {
        tween({
          from: { glow: 0, scale: 1 },
          to: { glow: 35, scale: 1.08 },
          duration: 700,
          ease: 'easeInOut',
          yoyo: true,
          repeat: 2,
          onUpdate: (v) => {
            correctBtn.glowRadius = v.glow;
            correctBtn.scale = v.scale;
          },
          onComplete: () => {
            correctBtn.glowRadius = 0;
            correctBtn.scale = 1;
          }
        });
      }
    }
  }

  getCorrectTarget() {
    const btn = this.buttons.find(b => b.isCorrect);
    return btn ? { x: btn.x + btn.width / 2, y: btn.y + btn.height / 2 } : null;
  }

  highlightCorrect() {
    const correctBtn = this.buttons.find(b => b.isCorrect);
    if (!correctBtn || correctBtn.confirmed) return;
    tween({
      from: { glow: 0, scale: 1 },
      to: { glow: 50, scale: 1.15 },
      duration: 600,
      ease: 'easeInOut',
      yoyo: true,
      repeat: 3,
      onUpdate: (v) => {
        correctBtn.glowRadius = v.glow;
        correctBtn.scale = v.scale;
      },
      onComplete: () => {
        correctBtn.glowRadius = 20;
        correctBtn.scale = 1.05;
      }
    });
  }

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createButtons();
  }
}
