import { WordButton } from '../entities/WordButton.js';
import { tween, shake } from '../../utils/tween.js';
import { speak, speakSuccess, speakEncouragement, speakWord } from '../../utils/tts.js';
import { playPop, playDing, playDogWhine, playDogNope } from '../../utils/sfx.js';
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
    const btnWidth = isNarrow ? Math.min(160, (this.w - 40) / options.length - 12) : 200;
    const btnHeight = isNarrow ? 72 : 90;
    const spacing = isNarrow ? 12 : 30;
    const totalWidth = options.length * btnWidth + (options.length - 1) * spacing;
    const startX = (this.w - totalWidth) / 2;
    const y = this.h * 0.62;

    this.buttons = options.map((word, i) => {
      // Create icon sprite for this button (if mapping exists)
      const spriteType = STEP_TO_SPRITE[word.toUpperCase()];
      let iconSprite = null;
      if (spriteType) {
        // Create at (0,0) — WordButton will position it
        iconSprite = createItemSprite(spriteType, 0, 0, 4);
      }

      const btn = new WordButton(startX + i * (btnWidth + spacing), y, word, word === correct, {
        width: btnWidth, height: btnHeight, fontSize: isNarrow ? 28 : 36,
        bgColor: '#FFFFFF', hoverColor: '#FFDac1',
        correctColor: '#B5EAD7', wrongColor: '#FF9AA2',
        iconSprite: iconSprite,
        iconScale: 1.2,
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

    // Tip text (hide when completed)
    if (!this.completed) {
      ctx.fillStyle = '#A1887F';
      ctx.font = "18px 'Nunito', sans-serif";
      ctx.fillText(`Tip: ${this.levelData.tip}`, this.w / 2, this.h * 0.48);
    }

    // Render buttons
    this.buttons.forEach(btn => btn.render(ctx));

    // Render flying bandage
    if (this.flyingItem) {
      ctx.save();
      ctx.globalAlpha = this.flyingItem.alpha;
      this.flyingItem.sprite.render(ctx);
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

    // Get animal position from scene
    const animal = this.scene?.animal;
    const targetX = animal ? animal.x + animal.width * 0.6 : this.w * 0.65;
    const targetY = animal ? animal.y + animal.height * 0.5 : this.h * 0.25;

    // Phase 1: Button shrinks and flies toward animal
    tween({
      from: { x: btn.x, y: btn.y, scale: 1, alpha: 1 },
      to: { x: targetX, y: targetY, scale: 0.4, alpha: 1 },
      duration: 550,
      ease: 'easeOutBack',
      onUpdate: (v) => { btn.x = v.x; btn.y = v.y; btn.scale = v.scale; },
      onComplete: () => {
        btn.visible = false;

        // Create a flying item sprite that "sticks" to the animal's leg
        const spriteType = STEP_TO_SPRITE[btn.word.toUpperCase()];
        if (spriteType && animal) {
          this.flyingItem = {
            sprite: createItemSprite(spriteType, targetX, targetY, 4),
            timer: 1.8,
            phase: 'stick',
            alpha: 1,
          };

          // Animate the item appearing (pop in)
          if (this.flyingItem.sprite) {
            this.flyingItem.sprite.scale = 0;
            tween({
              from: { s: 0 },
              to: { s: 3 },
              duration: 300,
              ease: 'easeOutBack',
              onUpdate: (v) => {
                if (this.flyingItem && this.flyingItem.sprite) {
                  this.flyingItem.sprite.scale = v.s;
                }
              },
            });
          }
        }

        // Animal reaction
        if (animal) {
          animal.reactCorrect('😊');
        }

        speakSuccess(btn.word);

        // Trigger scene success after bandage sticks (give time to see it!)
        const delay = this.flyingItem ? 1600 : 100;
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, delay);
      },
    });
  }

  onWrong(btn) {
    btn.setWrong();
    playDogNope(); // Characterful dog head-shake sound

    // Animal reaction
    const animal = this.scene?.animal;
    if (animal && animal.reactWrong) {
      animal.reactWrong('🤔');
    }

    shake(btn, 12, 500);

    setTimeout(() => {
      speakEncouragement();
    }, 300);

    setTimeout(() => {
      btn.reset();
    }, 800);

    if (this.onFail) this.onFail();
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

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createButtons();
  }
}
