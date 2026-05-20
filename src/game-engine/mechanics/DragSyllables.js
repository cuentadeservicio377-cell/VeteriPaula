import { WordButton } from '../entities/WordButton.js';
import { Draggable, DropSlot } from '../../utils/draggable.js';
import { tween } from '../../utils/tween.js';
import { shuffle } from '../../utils/shuffle.js';
import { speak, speakSyllable, speakWord, speakSuccess, speakEncouragement } from '../../utils/tts.js';
import { playWhoosh, playSnap, playBoing } from '../../utils/sfx.js';

/**
 * v2.2 — Drag & Drop Syllables with SFX, partial rewards, progress dots, hints
 */
export class DragSyllablesMechanic {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.w = canvasWidth;
    this.h = canvasHeight;
    this.syllableBlocks = [];
    this.slots = [];
    this.dragSystem = null;
    this.completed = false;
    this.onSuccess = null;
    this.onFail = null;
    this.building = [];
    this.scene = null; // set by GameScene
    this.createElements();
  }

  createElements() {
    const syllables = this.levelData.syllables;
    const slotsCount = this.levelData.slots || syllables.length;

    // Create drop slots with ghost preview
    const slotWidth = 100;
    const slotHeight = 80;
    const slotSpacing = 16;
    const totalSlotsWidth = slotsCount * slotWidth + (slotsCount - 1) * slotSpacing;
    const slotsStartX = (this.w - totalSlotsWidth) / 2;
    const slotsY = this.h * 0.42;

    this.slots = [];
    for (let i = 0; i < slotsCount; i++) {
      const slot = new DropSlot(
        slotsStartX + i * (slotWidth + slotSpacing),
        slotsY, slotWidth, slotHeight, i, `${i + 1}`
      );
      slot.expectedSyllable = syllables[i]; // ghost text
      this.slots.push(slot);
    }

    // Create draggable syllable blocks (shuffled)
    const shuffledSyllables = shuffle(syllables);
    const blockWidth = 90;
    const blockHeight = 70;
    const blockSpacing = 14;
    const totalBlocksWidth = syllables.length * blockWidth + (syllables.length - 1) * blockSpacing;
    const blocksStartX = (this.w - totalBlocksWidth) / 2;
    const blocksY = this.h * 0.68;

    this.syllableBlocks = [];
    this.draggables = [];

    shuffledSyllables.forEach((syl, i) => {
      const block = new WordButton(
        blocksStartX + i * (blockWidth + blockSpacing),
        blocksY, syl, false, {
          width: blockWidth, height: blockHeight, fontSize: 28,
          bgColor: '#C7CEEA', hoverColor: '#B5EAD7',
          correctColor: '#B5EAD7', wrongColor: '#FF9AA2',
          borderRadius: 14,
        }
      );
      block.syllable = syl;
      block.originalIndex = i;
      block.isDraggable = true;
      this.syllableBlocks.push(block);

      const drag = new Draggable(block, {
        slots: this.slots,
        magnetDistance: 80, // increased from 55
        dragScale: 1.15,
        onDragStart: () => this.onDragStart(block),
        onSnap: (entity, slot) => this.onSnap(block, slot),
        onRelease: () => this.onRelease(block),
      });
      this.draggables.push(drag);
    });

    this.targetSyllables = [...syllables];
  }

  onDragStart(block) {
    playWhoosh();
    speakSyllable(block.syllable);
    block.zIndex = 100;
  }

  onSnap(block, slot) {
    const expectedSyl = this.targetSyllables[slot.id];

    if (block.syllable === expectedSyl) {
      block.setCorrect();
      this.building.push(block.syllable);
      playSnap();

      // ===== PARTIAL REWARD =====
      const slotCx = slot.x + slot.width / 2;
      const slotCy = slot.y + slot.height / 2;

      // Sparkles + magic
      if (this.scene?.particles) {
        this.scene.particles.spawnSparkles(slotCx, slotCy, 6);
        this.scene.particles.spawnMagic(slotCx, slotCy, 3);
      }

      // Paula mini-celebration
      if (this.scene?.triggerPaulaMiniCheer) {
        this.scene.triggerPaulaMiniCheer();
      }

      // Progressive pitch TTS
      const pitch = 1.0 + (this.building.length * 0.1);
      speak(block.syllable, { rate: 0.7, pitch: Math.min(pitch, 1.3) });

      // Quick pulse
      tween({
        from: { scale: 1 },
        to: { scale: 1.1 },
        duration: 80,
        ease: 'easeOut',
        yoyo: true,
        onUpdate: (v) => { block.scale = v.scale; },
      });
      // ===== END PARTIAL REWARD =====

      const built = this.building.join('');
      if (built === this.levelData.target) {
        this.completed = true;
        this.animateWordComplete();
        setTimeout(() => speakSuccess(this.levelData.target), 300);
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, 600);
      }
    } else {
      // Near-miss detection
      const correctSlotIdx = this.targetSyllables.indexOf(block.syllable);
      const distance = Math.abs(correctSlotIdx - slot.id);

      playBoing();
      block.setWrong();

      if (distance === 1) {
        speak('¡Casi! Prueba en el espacio de al lado', { rate: 0.8, pitch: 1.1 });
      } else {
        speakEncouragement();
        if (this.onFail) this.onFail();
      }

      setTimeout(() => {
        const drag = this.draggables.find(d => d.entity === block);
        if (drag) drag.returnToStart();
        block.reset();
      }, 400);
    }
  }

  onRelease(block) {
    block.zIndex = 0;
  }

  animateWordComplete() {
    this.syllableBlocks.forEach((block, i) => {
      tween({
        from: { scale: 1 },
        to: { scale: 1.2 },
        duration: 300,
        delay: i * 100,
        ease: 'easeOut',
        onUpdate: (v) => { block.scale = v.scale; },
        onComplete: () => {
          tween({
            from: { scale: 1.2 },
            to: { scale: 1 },
            duration: 300,
            ease: 'easeOutBounce',
            onUpdate: (v) => { block.scale = v.scale; },
          });
        },
      });
    });
  }

  update(dt) {
    this.syllableBlocks.forEach(btn => btn.update(dt));
  }

  render(ctx) {
    // Question
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 24px 'Nunito', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(this.levelData.instruction, this.w / 2, this.h * 0.18);

    // Target word hint
    ctx.fillStyle = '#8D6E63';
    ctx.font = "bold 20px 'Nunito', sans-serif";
    const hint = this.levelData.tip || `Forma: ${this.levelData.target}`;
    ctx.fillText(hint, this.w / 2, this.h * 0.26);

    // Progress dots
    const total = this.slots.length;
    const dotRadius = 7;
    const dotSpacing = 22;
    const dotsWidth = total * dotSpacing;
    const dotsStartX = (this.w - dotsWidth) / 2 + dotSpacing / 2;
    const dotY = this.h * 0.33;

    for (let i = 0; i < total; i++) {
      const filled = i < this.building.length;
      ctx.beginPath();
      ctx.arc(dotsStartX + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = filled ? '#B5EAD7' : '#E8E8E8';
      ctx.fill();
      ctx.strokeStyle = filled ? '#4CAF50' : '#CCCCCC';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Slots
    this.slots.forEach(slot => slot.render(ctx));

    // Syllable blocks
    this.syllableBlocks.forEach(btn => btn.render(ctx));

    // Instruction
    if (!this.completed) {
      ctx.fillStyle = '#BCAAA4';
      ctx.font = "16px 'Nunito', sans-serif";
      ctx.fillText('Arrastra las sílabas a los espacios', this.w / 2, this.h * 0.88);
    }
  }

  handleTouch(x, y) {
    if (this.completed) return false;
    for (const drag of this.draggables) {
      if (drag.startDrag(x, y)) return true;
    }
    return false;
  }

  handleTouchMove(x, y) {
    for (const drag of this.draggables) {
      drag.moveDrag(x, y);
    }
  }

  handleTouchEnd() {
    for (const drag of this.draggables) {
      drag.endDrag();
    }
  }

  handleMouseMove(x, y) {
    this.syllableBlocks.forEach(btn => {
      if (!btn.confirmed) {
        btn.hovered = btn.contains(x, y);
      }
    });
  }

  // Anti-frustration hints
  showHint(level) {
    if (level >= 1) {
      const nextIdx = this.building.length;
      const slot = this.slots[nextIdx];
      if (slot) {
        tween({
          from: { glow: 0 },
          to: { glow: 40 },
          duration: 600,
          yoyo: true,
          repeat: 3,
          onUpdate: (v) => { slot.highlightedGlow = v.glow; },
          onComplete: () => { slot.highlightedGlow = 0; }
        });
      }
    }

    if (level >= 3) {
      // Auto-move correct syllable to slot
      const nextIdx = this.building.length;
      const expectedSyl = this.targetSyllables[nextIdx];
      const block = this.syllableBlocks.find(b => b.syllable === expectedSyl && !b.confirmed);
      const slot = this.slots[nextIdx];

      if (block && slot) {
        block.isDraggable = false;
        const targetX = slot.x + (slot.width - block.width) / 2;
        const targetY = slot.y + (slot.height - block.height) / 2;

        tween({
          from: { x: block.x, y: block.y, scale: block.scale || 1 },
          to: { x: targetX, y: targetY, scale: 1 },
          duration: 1200,
          ease: 'easeInOut',
          onUpdate: (v) => {
            block.x = v.x;
            block.y = v.y;
            block.scale = v.scale;
          },
          onComplete: () => {
            const drag = this.draggables.find(d => d.entity === block);
            if (drag) {
              drag.isSnapped = true;
              drag.snappedSlot = slot;
            }
            slot.occupied = true;
            block.isDraggable = true;
            this.onSnap(block, slot);
          }
        });

        speak('Mira cómo se hace...', { rate: 0.75, pitch: 1.0 });
      }
    }
  }

  getCorrectTarget() {
    const nextIdx = this.building.length;
    const expectedSyl = this.targetSyllables[nextIdx];
    const block = this.syllableBlocks.find(b => b.syllable === expectedSyl && !b.confirmed);
    return block ? { x: block.x + block.width / 2, y: block.y + block.height / 2 } : null;
  }

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createElements();
  }
}
