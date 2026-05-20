/**
 * Drag & drop system for Canvas entities with snap-to-slot support
 */

import { tween } from './tween.js';

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
  }

  startDrag(pointerX, pointerY) {
    if (this.isSnapped) return false;
    if (this.entity.contains && this.entity.contains(pointerX, pointerY)) {
      this.isDragging = true;
      this.dragOffsetX = pointerX - this.entity.x;
      this.dragOffsetY = pointerY - this.entity.y;
      this.startX = this.entity.x;
      this.startY = this.entity.y;
      this.entity.scale = this.dragScale;
      this.onDragStart(this.entity);
      return true;
    }
    return false;
  }

  moveDrag(pointerX, pointerY) {
    if (!this.isDragging) return;
    this.entity.x = pointerX - this.dragOffsetX;
    this.entity.y = pointerY - this.dragOffsetY;
    this.checkMagnetism();
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

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
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
    // Use time-based tween instead of frame-dependent lerp
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
    if (this.label && !this.occupied) {
      ctx.fillStyle = '#BBBBBB'; ctx.font = "bold 14px 'Nunito', sans-serif";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);
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
