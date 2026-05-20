import { Draggable, DropSlot } from '../../utils/draggable.js';
import { WordButton } from '../entities/WordButton.js';
import { tween, pulse } from '../../utils/tween.js';
import { createItemSprite, STEP_TO_SPRITE } from '../sprites/Items.js';
import { speak, speakEncouragement } from '../../utils/tts.js';
import { playWhoosh, playSnap, playBoing } from '../../utils/sfx.js';

/**
 * v2.2 — Follow Steps with SFX, partial rewards, hints, better UX
 */
export class FollowStepsMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.stepObjects = [];
    this.slots = [];
    this.draggables = [];
    this.itemSprites = [];
    this.currentStep = 0;
    this.completed = false;
    this.onSuccess = null;
    this.onFail = null;
    this.scene = null; // set by GameScene
    this.createElements();
  }

  createElements() {
    const steps = this.levelData.steps || [];

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
      obj.visible = i === 0;
      this.stepObjects.push(obj);

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
        magnetDistance: 110, // increased from 80
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
    playWhoosh();
    speak(obj.stepName, { rate: 0.75, pitch: 1.1 });
  }

  onSnap(obj, slot) {
    const expectedStep = this.levelData.steps[this.currentStep];
    if (obj.stepName === expectedStep) {
      obj.setCorrect();
      obj.isAvailable = false;
      this.currentStep++;
      playSnap();

      // ===== PARTIAL REWARD =====
      // Paula mini-celebration
      if (this.scene?.triggerPaulaMiniCheer) {
        this.scene.triggerPaulaMiniCheer();
      }

      // Animal micro-reaction
      if (this.scene?.animal) {
        const animal = this.scene.animal;
        tween({
          from: { y: animal.y },
          to: { y: animal.y - 8 },
          duration: 120,
          ease: 'easeOut',
          onUpdate: (v) => { animal.y = v.y; },
          onComplete: () => {
            tween({
              from: { y: animal.y },
              to: { y: animal.y + 8 },
              duration: 180,
              ease: 'easeOutBounce',
              onUpdate: (v) => { animal.y = v.y; },
            });
          },
        });
      }

      // Sparkles in animal zone
      if (this.scene?.particles) {
        const zoneCx = this.animalZone.x + this.animalZone.width / 2;
        const zoneCy = this.animalZone.y + this.animalZone.height / 2;
        this.scene.particles.spawnSparkles(zoneCx, zoneCy, 5);
      }

      speak('¡Bien!', { rate: 0.85, pitch: 1.2 });
      // ===== END PARTIAL REWARD =====

      tween({
        from: { scale: 1 },
        to: { scale: 0.5 },
        duration: 400,
        ease: 'easeOut',
        onUpdate: (v) => { obj.scale = v.scale; },
        onComplete: () => { obj.visible = false; }
      });

      if (this.currentStep < this.stepObjects.length) {
        const nextObj = this.stepObjects[this.currentStep];
        nextObj.isAvailable = true;
        nextObj.visible = true;
        setTimeout(() => {
          speak(`Ahora: ${nextObj.stepName}`, { rate: 0.75, pitch: 1.1 });
        }, 400);
        pulse(nextObj, 0.15, 600);
      }

      if (this.currentStep >= this.levelData.steps.length) {
        this.completed = true;
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, 600);
      }
    } else {
      playBoing();
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
    this.itemSprites.forEach((sprite, i) => {
      const btn = this.stepObjects[i];
      if (sprite && btn) {
        sprite.x = btn.x + btn.width / 2 - (sprite.width * sprite.scale) / 2;
        sprite.y = btn.y + 6;
      }
    });
  }

  render(ctx) {
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 24px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.instruction, this.w / 2, this.h * 0.18);

    if (!this.completed) {
      ctx.fillStyle = '#8D6E63';
      ctx.font = "bold 20px 'Nunito', sans-serif";
      const stepName = this.levelData.steps[this.currentStep];
      ctx.fillText(`Paso ${this.currentStep + 1}: ${stepName}`, this.w / 2, this.h * 0.28);

      const currentSprite = this.itemSprites[this.currentStep];
      if (currentSprite) {
        const textWidth = ctx.measureText(`Paso ${this.currentStep + 1}: ${stepName}`).width;
        currentSprite.x = this.w / 2 + textWidth / 2 + 10;
        currentSprite.y = this.h * 0.28 - 20;
        currentSprite.render(ctx);
      }
    }

    this.animalZone.render(ctx);

    this.stepObjects.forEach((obj, i) => {
      if (!obj.visible) return;
      obj.render(ctx);
      const sprite = this.itemSprites[i];
      if (sprite && obj.visible) {
        sprite.render(ctx);
      }
    });

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

  showHint(level) {
    if (level >= 1) {
      const nextObj = this.stepObjects[this.currentStep];
      if (nextObj) {
        tween({
          from: { glow: 0 },
          to: { glow: 35 },
          duration: 600,
          yoyo: true,
          repeat: 3,
          onUpdate: (v) => { nextObj.glowRadius = v.glow; },
          onComplete: () => { nextObj.glowRadius = 0; }
        });
      }
    }
  }

  getCorrectTarget() {
    const nextObj = this.stepObjects[this.currentStep];
    return nextObj ? { x: nextObj.x + nextObj.width / 2, y: nextObj.y + nextObj.height / 2 } : null;
  }

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createElements();
  }
}
