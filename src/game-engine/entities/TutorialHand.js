/**
 * Animated tutorial hand for onboarding
 * Shows the child what to do without text
 */
export class TutorialHand {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.phase = 'point';
    this.phaseTimer = 0;
    this.opacity = 0.9;
    this.scale = 1;
    this.cyclesRemaining = 3;
    this.done = false;
  }

  update(dt) {
    if (this.done || this.cyclesRemaining <= 0) return;
    this.phaseTimer += dt;
    const cycleDuration = 3.5;

    if (this.phaseTimer >= cycleDuration) {
      this.phaseTimer = 0;
      this.cyclesRemaining--;
      if (this.cyclesRemaining <= 0) {
        this.done = true;
        this.opacity = 0;
      }
    }

    const t = this.phaseTimer;
    // Phases: point (0-0.8s) → grab (0.8-1.1s) → drag (1.1-2.5s) → release (2.5-2.9s) → idle (2.9-3.5s)
    if (t < 0.8) {
      this.phase = 'point';
      this.scale = 1.0 + Math.sin(t * Math.PI * 2.5) * 0.1;
      this.x = this.startX;
      this.y = this.startY;
    } else if (t < 1.1) {
      this.phase = 'grab';
      this.scale = 0.92;
    } else if (t < 2.5) {
      this.phase = 'drag';
      const progress = (t - 1.1) / 1.4;
      const eased = 1 - Math.pow(1 - progress, 3);
      this.x = this.startX + (this.targetX - this.startX) * eased;
      this.y = this.startY + (this.targetY - this.startY) * eased;
      this.scale = 1.05;
    } else if (t < 2.9) {
      this.phase = 'release';
      this.scale = 1.0;
    } else {
      this.phase = 'idle';
      this.opacity = Math.max(0, 0.9 - (t - 2.9) * 2);
    }
  }

  render(ctx) {
    if (this.done || this.opacity <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // Draw a finger/cursor as a circle with an arrow
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFA500';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner white circle
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Arrow pointing down (tap gesture)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    const arrowY = 8;
    ctx.moveTo(-7, arrowY - 4);
    ctx.lineTo(7, arrowY - 4);
    ctx.lineTo(0, arrowY + 8);
    ctx.fill();

    ctx.restore();
  }
}
