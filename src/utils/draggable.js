import { tween } from './tween.js';
import { ensureAudioContext, hapticGrab, hapticSnap } from './sfx.js';

/**
 * Drag & drop system for Canvas entities with snap-to-slot support
 * v2.2 — Expanded hitbox, anti-finger offset, drag threshold, haptic feedback, live snap
 */

export class Draggable {
  constructor(entity, options = {}) {
    this.entity = entity;
    this.slots = options.slots || [];
    this.magnetDistance = options.magnetDistance || 60;
    this.onDragStart = options.onDragStart || (() => {});
    this.onDrag = options.onDrag || (() => {});
    this.onDragEnd = options.onDragEnd || (() => {});
    this.onSnap = options.onSnap || (() => {});
    this.onRelease = options.onRelease || (() => {});

    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.startX = entity.x;
    this.startY = entity.y;
    this.isSnapped = false;
    this.snappedSlot = null;

    this.dragScale = options.dragScale || 1.15;
    this.dragThreshold = options.dragThreshold || 8;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.hasExceededThreshold = false;

    this.isAutoSnapping = false;
    this.liveSnapTween = null;
  }

  startDrag(pointerX, pointerY) {
    if (this.isSnapped) return false;

    // Use expanded hitbox for easier grabbing
    const hit = this.entity.containsExpanded
      ? this.entity.containsExpanded(pointerX, pointerY, 1.4)
      : this.entity.contains(pointerX, pointerY);

    if (hit) {
      this.isDragging = true;
      this.hasExceededThreshold = false;
      this.dragStartX = pointerX;
      this.dragStartY = pointerY;
      this.dragOffsetX = pointerX - this.entity.x;
      this.dragOffsetY = pointerY - this.entity.y;
      this.startX = this.entity.x;
      this.startY = this.entity.y;
      // Wake up audio context on first interaction
      ensureAudioContext();
      hapticGrab();
      return true;
    }
    return false;
  }

  moveDrag(pointerX, pointerY) {
    if (!this.isDragging) return;

    // Drag threshold: ignore micro-movements
    if (!this.hasExceededThreshold) {
      const dist = Math.hypot(pointerX - this.dragStartX, pointerY - this.dragStartY);
      if (dist < this.dragThreshold) return;
      this.hasExceededThreshold = true;
      this.entity.scale = this.dragScale;
      this.onDragStart(this.entity);
    }

    // Anti-finger offset: lift object 28px so child can see it under finger
    this.entity.x = pointerX - this.dragOffsetX;
    this.entity.y = pointerY - this.dragOffsetY - 28;

    this.checkMagnetism();
    this.checkLiveSnap();
    this.onDrag(this.entity);
  }

  checkMagnetism() {
    if (!this.slots.length) return;
    let closestSlot = null;
    let closestDist = Infinity;
    const cx = this.entity.x + this.entity.width / 2;
    const cy = this.entity.y + this.entity.height / 2;

    for (const slot of this.slots) {
      if (slot.occupied) continue;
      const scx = slot.x + slot.width / 2;
      const scy = slot.y + slot.height / 2;
      const dist = Math.hypot(cx - scx, cy - scy);
      if (dist < this.magnetDistance && dist < closestDist) {
        closestDist = dist;
        closestSlot = slot;
      }
    }
    for (const slot of this.slots) { slot.highlighted = (slot === closestSlot); }
  }

  checkLiveSnap() {
    if (!this.slots.length || this.isAutoSnapping) return;

    const cx = this.entity.x + this.entity.width / 2;
    const cy = this.entity.y + this.entity.height / 2;

    for (const slot of this.slots) {
      if (slot.occupied) continue;
      const scx = slot.x + slot.width / 2;
      const scy = slot.y + slot.height / 2;
      const dist = Math.hypot(cx - scx, cy - scy);

      // Live snap at 50% of magnet distance
      if (dist < this.magnetDistance * 0.5) {
        this.isAutoSnapping = true;
        const targetX = slot.x + (slot.width - this.entity.width) / 2;
        const targetY = slot.y + (slot.height - this.entity.height) / 2;

        this.liveSnapTween = tween({
          from: { x: this.entity.x, y: this.entity.y },
          to: { x: targetX, y: targetY },
          duration: 120,
          ease: 'easeOut',
          onUpdate: (v) => {
            this.entity.x = v.x;
            this.entity.y = v.y;
          },
          onComplete: () => {
            this.isAutoSnapping = false;
            this.liveSnapTween = null;
            this.endDrag();
          }
        });
        break;
      }
    }
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.liveSnapTween) {
      this.liveSnapTween.stop();
      this.liveSnapTween = null;
      this.isAutoSnapping = false;
    }

    let snapped = false;
    const cx = this.entity.x + this.entity.width / 2;
    const cy = this.entity.y + this.entity.height / 2;

    for (const slot of this.slots) {
      if (slot.occupied) continue;
      const scx = slot.x + slot.width / 2;
      const scy = slot.y + slot.height / 2;
      const dist = Math.hypot(cx - scx, cy - scy);
      if (dist < this.magnetDistance) {
        this.entity.x = slot.x + (slot.width - this.entity.width) / 2;
        this.entity.y = slot.y + (slot.height - this.entity.height) / 2;
        this.entity.scale = 1;
        slot.occupied = true;
        this.isSnapped = true;
        this.snappedSlot = slot;
        snapped = true;
        hapticSnap();
        this.onSnap(this.entity, slot);
        break;
      }
    }

    if (!snapped) {
      this.returnToStart();
      this.onRelease(this.entity);
    }
    for (const slot of this.slots) { slot.highlighted = false; }
  }

  returnToStart() {
    const startX = this.startX;
    const startY = this.startY;
    const entity = this.entity;
    tween({
      from: { x: entity.x, y: entity.y },
      to: { x: startX, y: startY },
      duration: 350,
      ease: 'easeOutBack',
      onUpdate: (v) => { entity.x = v.x; entity.y = v.y; },
      onComplete: () => { entity.scale = 1; },
    });
  }

  reset() {
    this.isDragging = false; this.isSnapped = false;
    if (this.snappedSlot) { this.snappedSlot.occupied = false; this.snappedSlot = null; }
    this.entity.x = this.startX; this.entity.y = this.startY; this.entity.scale = 1;
  }
}

export class DropSlot {
  constructor(x, y, width, height, id, label = '') {
    this.x = x; this.y = y; this.width = width; this.height = height;
    this.id = id; this.label = label;
    this.occupied = false; this.highlighted = false;
    this.expectedSyllable = ''; // ghost text for DragSyllables
    this.highlightedGlow = 0;
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.occupied ? 0.2 : 0.6;
    if (this.highlighted) {
      ctx.fillStyle = '#FFDac1'; ctx.shadowColor = '#FFB7B2'; ctx.shadowBlur = 25;
    } else {
      ctx.fillStyle = '#F0F0F0'; ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    }
    this.roundRect(ctx, this.x, this.y, this.width, this.height, 14);
    ctx.fill();
    ctx.strokeStyle = this.highlighted ? '#FF9AA2' : '#DDDDDD';
    ctx.lineWidth = this.highlighted ? 4 : 2;
    ctx.setLineDash(this.occupied ? [6, 4] : []);
    this.roundRect(ctx, this.x, this.y, this.width, this.height, 14);
    ctx.stroke();

    // Ghost preview of expected syllable (Endless Reader style)
    if (this.expectedSyllable && !this.occupied) {
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = '#8D6E63';
      ctx.font = "bold 22px 'Nunito', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.expectedSyllable, this.x + this.width / 2, this.y + this.height / 2);
      ctx.globalAlpha = 1;
    }

    if (this.label && !this.occupied) {
      ctx.fillStyle = '#BBBBBB'; ctx.font = "bold 14px 'Nunito', sans-serif";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }

    // Hint glow (anti-frustration)
    if (this.highlightedGlow > 0) {
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = this.highlightedGlow;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      this.roundRect(ctx, this.x - 2, this.y - 2, this.width + 4, this.height + 4, 16);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
}
