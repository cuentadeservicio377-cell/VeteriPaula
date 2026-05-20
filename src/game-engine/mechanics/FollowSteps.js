import { Draggable, DropSlot } from '../../utils/draggable.js';
import { WordButton } from '../entities/WordButton.js';
import { tween, pulse } from '../../utils/tween.js';
import { createItemSprite, STEP_TO_SPRITE } from '../sprites/Items.js';
import { speak, speakEncouragement } from '../../utils/tts.js';

/**
 * v2.1 — Follow Steps with TTS on every interaction
 * Drag treatment items to the animal in order
 */
export class FollowStepsMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.stepObjects = [];
    this.slots = [];
    this.draggables = [];
    this.itemSprites = []; // pixel art sprites for each step
    this.currentStep = 0;
    this.completed = false;
    this.onSuccess = null;
    this.onFail = null;
    this.createElements();
  }

  createElements() {
    const steps = this.levelData.steps || [];

    // Create one drop zone near the animal
    this.animalZone = {
      x: this.w * 0.55,
      y: this.h * 0.20,
      width: 140,
      height: 120,
      id: 'animal',
      occupied: false,
      highlighted: false,
      render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.highlighted ? 0.4 : 0.2;
        ctx.fillStyle = this.highlighted ? '#B5EAD7' : '#E0E0E0';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.highlighted ? '#4CAF50' : '#CCCCCC';
        ctx.lineWidth = this.highlighted ? 4 : 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    };
    this.slots = [this.animalZone];

    // Create draggable step objects
    const objWidth = 100;
    const objHeight = 80;
    const spacing = 20;
    const totalWidth = steps.length * objWidth + (steps.length - 1) * spacing;
    const startX = (this.w - totalWidth) / 2;
    const y = this.h * 0.68;

    this.stepObjects = [];
    this.draggables = [];
    this.itemSprites = [];

    steps.forEach((step, i) => {
      const obj = new WordButton(
        startX + i * (objWidth + spacing),
        y, step, false, {
          width: objWidth, height: objHeight, fontSize: 18,
          bgColor: '#FFFFFF', hoverColor: '#FFDac1',
          correctColor: '#B5EAD7', wrongColor: '#FF9AA2',
          borderRadius: 16,
        }
      );
      obj.stepName = step;
      obj.isAvailable = i === 0;
      // Hide future steps so they don't confuse the child
      obj.visible = i === 0;
      this.stepObjects.push(obj);

      // Create pixel art item sprite for this step
      const spriteType = STEP_TO_SPRITE[step] || 'agua';
      const sprite = createItemSprite(
        spriteType,
        obj.x + obj.width / 2 - 16,
        obj.y + 8,
        4
      );
      this.itemSprites.push(sprite);

      const drag = new Draggable(obj, {
        slots: this.slots,
        magnetDistance: 80,
        dragScale: 1.15,
        onDragStart: () => this.onDragStart(obj),
        onSnap: (entity, slot) => this.onSnap(obj, slot),
        onRelease: () => this.onRelease(obj),
      });
      this.draggables.push(drag);
    });
  }

  onDragStart(obj) {
    if (!obj.isAvailable) {
      obj.setWrong();
      setTimeout(() => obj.reset(), 300);
      return false;
    }
    // Speak the step name when picked up
    speak(obj.stepName, { rate: 0.75, pitch: 1.1 });
  }

  onSnap(obj, slot) {
    const expectedStep = this.levelData.steps[this.currentStep];
    if (obj.stepName === expectedStep) {
      obj.setCorrect();
      obj.isAvailable = false;
      this.currentStep++;

      tween({
        from: { scale: 1 },
        to: { scale: 0.5 },
        duration: 400,
        ease: 'easeOut',
        onUpdate: (v) => { obj.scale = v.scale; },
        onComplete: () => { obj.visible = false; }
      });

      // Speak positive feedback for the step
      speak('¡Bien!', { rate: 0.85, pitch: 1.2 });

      if (this.currentStep < this.stepObjects.length) {
        const nextObj = this.stepObjects[this.currentStep];
        nextObj.isAvailable = true;
        nextObj.visible = true;
        // Speak what's next after a short delay
        setTimeout(() => {
          speak(`Ahora: ${nextObj.stepName}`, { rate: 0.75, pitch: 1.1 });
        }, 600);
        pulse(nextObj, 0.15, 600);
      }

      if (this.currentStep >= this.levelData.steps.length) {
        this.completed = true;
        // Reduced from 1000ms to 600ms
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, 600);
      }
    } else {
      obj.setWrong();
      setTimeout(() => {
        const drag = this.draggables.find(d => d.entity === obj);
        if (drag) drag.returnToStart();
        obj.reset();
      }, 400);

      speakEncouragement();
      if (this.onFail) this.onFail();
    }
  }

  onRelease(obj) {
    // Reset availability check
  }

  update(dt) {
    this.stepObjects.forEach(btn => btn.update(dt));
    // Update item sprite positions to follow their buttons
    this.itemSprites.forEach((sprite, i) => {
      const btn = this.stepObjects[i];
      if (sprite && btn) {
        sprite.x = btn.x + btn.width / 2 - (sprite.width * sprite.scale) / 2;
        sprite.y = btn.y + 6;
      }
    });
  }

  render(ctx) {
    // Question
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 24px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.instruction, this.w / 2, this.h * 0.18);

    // Current step indicator with pixel art icon
    if (!this.completed) {
      ctx.fillStyle = '#8D6E63';
      ctx.font = "bold 20px 'Nunito', sans-serif";
      const stepName = this.levelData.steps[this.currentStep];
      ctx.fillText(`Paso ${this.currentStep + 1}: ${stepName}`, this.w / 2, this.h * 0.28);

      // Draw current step item sprite next to text
      const currentSprite = this.itemSprites[this.currentStep];
      if (currentSprite) {
        const textWidth = ctx.measureText(`Paso ${this.currentStep + 1}: ${stepName}`).width;
        currentSprite.x = this.w / 2 + textWidth / 2 + 10;
        currentSprite.y = this.h * 0.28 - 20;
        currentSprite.render(ctx);
      }
    }

    // Drop zone
    this.animalZone.render(ctx);

    // Step objects — only render visible ones
    this.stepObjects.forEach((obj, i) => {
      if (!obj.visible) return;
      obj.render(ctx);

      // Pixel art item icon on the button
      const sprite = this.itemSprites[i];
      if (sprite && obj.visible) {
        sprite.render(ctx);
      }
    });

    // Progress
    if (!this.completed) {
      ctx.fillStyle = '#BCAAA4';
      ctx.font = "16px 'Nunito', sans-serif";
      ctx.fillText(`Paso ${this.currentStep + 1} de ${this.levelData.steps.length}`, this.w / 2, this.h * 0.90);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    for (const drag of this.draggables) {
      if (drag.entity.isAvailable && drag.startDrag(x, y)) return true;
    }
    for (const drag of this.draggables) {
      if (!drag.entity.isAvailable && drag.entity.contains(x, y)) {
        return true;
      }
    }
    return false;
  }

  handleTouchMove(x, y) {
    for (const drag of this.draggables) {
      if (drag.isDragging) drag.moveDrag(x, y);
    }
  }

  handleTouchEnd() {
    for (const drag of this.draggables) {
      drag.endDrag();
    }
  }

  handleMouseMove(x, y) {
    this.stepObjects.forEach(obj => {
      if (obj.isAvailable) {
        obj.hovered = obj.contains(x, y);
      }
    });
  }

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createElements();
  }
}
