import { WordButton } from '../entities/WordButton.js';

/**
 * Phase 1 mechanic: Choose the correct word from options
 */
export class ChooseWordMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.buttons = [];
    this.completed = false;
    this.failed = false;
    this.onSuccess = null;
    this.onFail = null;
    
    this.createButtons();
  }

  createButtons() {
    const options = this.levelData.options;
    const correct = this.levelData.correct;
    const btnWidth = 180;
    const btnHeight = 80;
    const spacing = 20;
    const totalWidth = options.length * btnWidth + (options.length - 1) * spacing;
    const startX = (this.canvasWidth - totalWidth) / 2;
    const y = this.canvasHeight * 0.65;

    this.buttons = options.map((word, i) => {
      const x = startX + i * (btnWidth + spacing);
      return new WordButton(x, y, word, word === correct, {
        width: btnWidth,
        height: btnHeight,
        fontSize: 28
      });
    });
  }

  update(dt) {
    this.buttons.forEach(btn => btn.update(dt));
  }

  render(ctx) {
    // Render question text
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 28px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.question, this.canvasWidth / 2, this.canvasHeight * 0.45);
    
    // Render buttons
    this.buttons.forEach(btn => btn.render(ctx));
    
    // Instruction hint
    if (!this.completed) {
      ctx.fillStyle = '#888';
      ctx.font = "18px 'Nunito', sans-serif";
      ctx.fillText('Toca la palabra correcta', this.canvasWidth / 2, this.canvasHeight * 0.85);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    
    for (const btn of this.buttons) {
      if (btn.contains(x, y)) {
        if (btn.isCorrect) {
          btn.setCorrect();
          this.completed = true;
          if (this.onSuccess) this.onSuccess();
        } else {
          btn.setWrong();
          setTimeout(() => btn.reset(), 800);
          if (this.onFail) this.onFail();
        }
        return true;
      }
    }
    return false;
  }

  handleMouseMove(x, y) {
    this.buttons.forEach(btn => {
      btn.hovered = btn.contains(x, y);
    });
  }

  resize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.createButtons();
  }
}
