import { WordButton } from '../entities/WordButton.js';
import { Draggable, DropSlot } from '../../utils/draggable.js';
import { tween } from '../../utils/tween.js';
import { shuffle } from '../../utils/shuffle.js';

/**
 * v2.0 — Drag & Drop Syllables mechanic
 * Syllables are draggable blocks that snap to slots with magnetism
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
    this.createElements();
  }

  createElements() {
    const syllables = this.levelData.syllables;
    const slotsCount = this.levelData.slots || syllables.length;

    // Create drop slots
    const slotWidth = 100;
    const slotHeight = 80;
    const slotSpacing = 16;
    const totalSlotsWidth = slotsCount * slotWidth + (slotsCount - 1) * slotSpacing;
    const slotsStartX = (this.w - totalSlotsWidth) / 2;
    const slotsY = this.h * 0.42;

    this.slots = [];
    for (let i = 0; i < slotsCount; i++) {
      this.slots.push(new DropSlot(
        slotsStartX + i * (slotWidth + slotSpacing),
        slotsY, slotWidth, slotHeight, i, `${i + 1}º`
      ));
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

      // Create draggable wrapper
      const drag = new Draggable(block, {
        slots: this.slots,
        magnetDistance: 55,
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
    // Play drag sound effect
    block.zIndex = 100;
  }

  onSnap(block, slot) {
    // Check if syllable matches expected position
    const expectedSyl = this.targetSyllables[slot.id];

    if (block.syllable === expectedSyl) {
      // Correct!
      block.setCorrect();
      this.building.push(block.syllable);

      // Check if word is complete
      const built = this.building.join('');
      if (built === this.levelData.target) {
        this.completed = true;
        // Animate word becoming alive
        this.animateWordComplete();
        setTimeout(() => {
          if (this.onSuccess) this.onSuccess();
        }, 1200);
      }
    } else {
      // Wrong slot — return to start
      block.setWrong();
      setTimeout(() => {
        const drag = this.draggables.find(d => d.entity === block);
        if (drag) drag.returnToStart();
        block.reset();
      }, 400);

      if (this.onFail) this.onFail();
    }
  }

  onRelease(block) {
    block.zIndex = 0;
  }

  animateWordComplete() {
    // Pulse all blocks
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
    ctx.fillText(this.levelData.instruction, this.w / 2, this.h * 0.22);

    // Target word hint (dotted)
    ctx.fillStyle = '#8D6E63';
    ctx.font = "bold 20px 'Nunito', sans-serif";
    const hint = this.levelData.tip || `Forma: ${this.levelData.target}`;
    ctx.fillText(hint, this.w / 2, this.h * 0.30);

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

  resize(canvasWidth, canvasHeight) {
    this.w = canvasWidth; this.h = canvasHeight;
    this.createElements();
  }
}
