import { WordButton } from '../entities/WordButton.js';

/**
 * Phase 3 mechanic: Follow step-by-step instructions
 */
export class FollowInstructionsMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.stepButtons = [];
    this.currentStep = 0;
    this.completed = false;
    this.onSuccess = null;
    
    this.createButtons();
  }

  createButtons() {
    const steps = this.levelData.steps;
    const labels = this.levelData.stepLabels;
    const btnWidth = 200;
    const btnHeight = 70;
    const spacing = 15;
    const totalHeight = steps.length * btnHeight + (steps.length - 1) * spacing;
    const startY = (this.canvasHeight - totalHeight) / 2 + 30;
    const x = (this.canvasWidth - btnWidth) / 2;

    this.stepButtons = steps.map((step, i) => {
      const y = startY + i * (btnHeight + spacing);
      return new WordButton(x, y, labels[i], false, {
        width: btnWidth,
        height: btnHeight,
        fontSize: 20,
        bgColor: i === 0 ? '#FFDac1' : '#E8E8E8'
      });
    });
    
    this.steps = steps;
  }

  update(dt) {
    this.stepButtons.forEach((btn, i) => {
      if (i === this.currentStep && !this.completed) {
        btn.hovered = true;
        btn.scale = 1 + Math.sin(Date.now() * 0.005) * 0.03;
      }
      btn.update(dt);
    });
  }

  render(ctx) {
    // Question
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 24px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.question, this.canvasWidth / 2, this.canvasHeight * 0.18);
    
    // Progress
    ctx.fillStyle = '#888';
    ctx.font = "16px 'Nunito', sans-serif";
    ctx.fillText(`Paso ${this.currentStep + 1} de ${this.steps.length}`, this.canvasWidth / 2, this.canvasHeight * 0.25);
    
    // Step buttons
    this.stepButtons.forEach((btn, i) => {
      if (i < this.currentStep) {
        btn.bgColor = '#B5EAD7';
        btn.confirmed = true;
      } else if (i === this.currentStep && !this.completed) {
        btn.bgColor = '#FFDac1';
        btn.confirmed = false;
      } else {
        btn.bgColor = '#E8E8E8';
        btn.confirmed = false;
      }
      btn.render(ctx);
    });
    
    // Instruction
    if (!this.completed) {
      ctx.fillStyle = '#888';
      ctx.font = "18px 'Nunito', sans-serif";
      ctx.fillText('Toca el siguiente paso', this.canvasWidth / 2, this.canvasHeight * 0.88);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    
    const btn = this.stepButtons[this.currentStep];
    if (btn && btn.contains(x, y)) {
      btn.setCorrect();
      this.currentStep++;
      
      if (this.currentStep >= this.steps.length) {
        this.completed = true;
        if (this.onSuccess) this.onSuccess();
      }
      return true;
    }
    return false;
  }

  handleMouseMove(x, y) {
    // Steps are highlighted by current index, not hover
  }

  resize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.createButtons();
  }
}
