import { WordButton } from '../entities/WordButton.js';
import { tween, pulse, shake } from '../../utils/tween.js';

/**
 * v2.0 — Tap Word mechanic with rich animations
 * Words float, pulse on touch, fly to animal on correct
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
    this.createButtons();
  }

  createButtons() {
    const options = this.levelData.options;
    const correct = this.levelData.correct;
    const btnWidth = 200;
    const btnHeight = 90;
    const spacing = 30;
    const totalWidth = options.length * btnWidth + (options.length - 1) * spacing;
    const startX = (this.w - totalWidth) / 2;
    const y = this.h * 0.62;

    this.buttons = options.map((word, i) => {
      const btn = new WordButton(startX + i * (btnWidth + spacing), y, word, word === correct, {
        width: btnWidth, height: btnHeight, fontSize: 36,
        bgColor: '#FFFFFF', hoverColor: '#FFDac1',
        correctColor: '#B5EAD7', wrongColor: '#FF9AA2',
      });
      btn.baseY = y;
      btn.floatOffset = i * 1.5;
      return btn;
    });

    // Start floating animation
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
  }

  render(ctx) {
    // Question text
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 26px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.instruction, this.w / 2, this.h * 0.38);

    // Tip
    if (!this.completed) {
      ctx.fillStyle = '#A1887F';
      ctx.font = "18px 'Nunito', sans-serif";
      ctx.fillText(`💡 ${this.levelData.tip}`, this.w / 2, this.h * 0.48);
    }

    // Buttons
    this.buttons.forEach(btn => btn.render(ctx));

    // Hint at bottom
    if (!this.completed) {
      ctx.fillStyle = '#BCAAA4';
      ctx.font = "16px 'Nunito', sans-serif";
      ctx.fillText('Toca la palabra correcta', this.w / 2, this.h * 0.88);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    for (const btn of this.buttons) {
      if (btn.contains(x, y)) {
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

    // Animate button flying toward animal
    const targetX = this.w * 0.65;
    const targetY = this.h * 0.25;

    tween({
      from: { x: btn.x, y: btn.y, scale: 1 },
      to: { x: targetX, y: targetY, scale: 0.3 },
      duration: 800,
      ease: 'easeOut',
      onUpdate: (v) => { btn.x = v.x; btn.y = v.y; btn.scale = v.scale; },
      onComplete: () => {
        btn.visible = false;
        if (this.onSuccess) this.onSuccess();
      },
    });
  }

  onWrong(btn) {
    btn.setWrong();
    shake(btn, 12, 500);

    // Return to normal after shake
    setTimeout(() => {
      btn.reset();
    }, 800);

    if (this.onFail) this.onFail();
  }

  handleMouseMove(x, y) {
    this.buttons.forEach(btn => {
      if (!btn.confirmed && !btn.wrong) {
        btn.hovered = btn.contains(x, y);
        if (btn.hovered) btn.scale = 1.08;
        else btn.scale = 1;
      }
    });
  }

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createButtons();
  }
}
