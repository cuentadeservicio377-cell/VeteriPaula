import { WordButton } from '../entities/WordButton.js';
import { shuffle } from '../../utils/shuffle.js';

/**
 * Phase 2 mechanic: Build a word from syllables
 */
export class BuildSyllablesMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.syllableButtons = [];
    this.building = [];
    this.completed = false;
    this.onSuccess = null;
    
    this.createButtons();
  }

  createButtons() {
    const syllables = this.levelData.syllables;
    const btnWidth = 100;
    const btnHeight = 70;
    const spacing = 15;
    const totalWidth = syllables.length * btnWidth + (syllables.length - 1) * spacing;
    const startX = (this.canvasWidth - totalWidth) / 2;
    const y = this.canvasHeight * 0.65;

    // Shuffle syllables for display
    const shuffledSyllables = shuffle(syllables);

    this.syllableButtons = shuffledSyllables.map((syl, i) => {
      const x = startX + i * (btnWidth + spacing);
      return new WordButton(x, y, syl, false, {
        width: btnWidth,
        height: btnHeight,
        fontSize: 26,
        bgColor: '#C7CEEA'
      });
    });
    
    this.targetSyllables = [...syllables];
  }

  update(dt) {
    this.syllableButtons.forEach(btn => btn.update(dt));
  }

  render(ctx) {
    // Question
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 26px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.question, this.canvasWidth / 2, this.canvasHeight * 0.4);
    
    // Building area (show current progress)
    if (this.building.length > 0) {
      const built = this.building.join('');
      ctx.fillStyle = '#B5EAD7';
      ctx.font = "bold 36px 'Nunito', sans-serif";
      ctx.fillText(built, this.canvasWidth / 2, this.canvasHeight * 0.52);
    }
    
    // Target hint (dotted underline)
    ctx.strokeStyle = '#ccc';
    ctx.setLineDash([8, 4]);
    ctx.lineWidth = 2;
    const hintWidth = this.targetSyllables.length * 90;
    ctx.beginPath();
    ctx.moveTo((this.canvasWidth - hintWidth) / 2, this.canvasHeight * 0.56);
    ctx.lineTo((this.canvasWidth + hintWidth) / 2, this.canvasHeight * 0.56);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Syllable buttons
    this.syllableButtons.forEach(btn => btn.render(ctx));
    
    // Instruction
    if (!this.completed) {
      ctx.fillStyle = '#888';
      ctx.font = "18px 'Nunito', sans-serif";
      ctx.fillText('Toca las sílabas en orden', this.canvasWidth / 2, this.canvasHeight * 0.85);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    
    for (const btn of this.syllableButtons) {
      if (btn.contains(x, y) && !btn.confirmed) {
        const expectedSyl = this.targetSyllables[this.building.length];
        
        if (btn.word === expectedSyl) {
          btn.setCorrect();
          this.building.push(btn.word);
          
          if (this.building.join('') === this.levelData.target) {
            this.completed = true;
            if (this.onSuccess) this.onSuccess();
          }
        } else {
          btn.setWrong();
          setTimeout(() => btn.reset(), 600);
        }
        return true;
      }
    }
    return false;
  }

  handleMouseMove(x, y) {
    this.syllableButtons.forEach(btn => {
      if (!btn.confirmed) {
        btn.hovered = btn.contains(x, y);
      }
    });
  }

  resize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.createButtons();
  }
}
