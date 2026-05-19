import { Entity } from './Entity.js';

/**
 * Paula - the player character / veterinarian
 */
export class Paula extends Entity {
  constructor(x, y, options = {}) {
    const size = options.size || 100;
    super(x, y, size, size * 1.2);
    
    this.state = options.state || 'idle'; // idle, walk, interact, celebrate
    this.direction = options.direction || 'right';
    this.holdingItem = options.holdingItem || null;
    
    this.animTimer = 0;
  }

  update(dt) {
    this.animTimer += dt;
    
    switch (this.state) {
      case 'idle':
        this.scale = 1 + Math.sin(this.animTimer * 2) * 0.02;
        this.rotation = Math.sin(this.animTimer * 1.5) * 0.02;
        break;
      case 'walk':
        this.scale = 1 + Math.abs(Math.sin(this.animTimer * 8)) * 0.05;
        this.rotation = Math.sin(this.animTimer * 8) * 0.03;
        break;
      case 'interact':
        this.scale = 1 + Math.sin(this.animTimer * 6) * 0.08;
        break;
      case 'celebrate':
        this.scale = 1 + Math.sin(this.animTimer * 10) * 0.1;
        this.rotation = Math.sin(this.animTimer * 6) * 0.05;
        break;
    }
  }

  draw(ctx) {
    const w = this.width;
    const h = this.height;

    // Body (dress)
    ctx.fillStyle = '#FF9AA2';
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.4);
    ctx.lineTo(w * 0.7, h * 0.4);
    ctx.lineTo(w * 0.6, h * 0.85);
    ctx.lineTo(w * 0.4, h * 0.85);
    ctx.closePath();
    ctx.fill();

    // White coat / apron
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.4);
    ctx.lineTo(w * 0.65, h * 0.4);
    ctx.lineTo(w * 0.55, h * 0.75);
    ctx.lineTo(w * 0.45, h * 0.75);
    ctx.closePath();
    ctx.fill();

    // Cross on coat
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(w * 0.47, h * 0.48, w * 0.06, h * 0.04);
    ctx.fillRect(w * 0.49, h * 0.45, w * 0.02, h * 0.1);

    // Head
    ctx.fillStyle = '#FFDAB9'; // Skin tone
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.25, w * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.2, w * 0.24, Math.PI, 0);
    ctx.fill();
    // Ponytail
    ctx.beginPath();
    ctx.ellipse(w * 0.75, h * 0.25, w * 0.08, h * 0.12, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(w * 0.4, h * 0.24, w * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.6, h * 0.24, w * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(w * 0.39, h * 0.23, w * 0.015, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.59, h * 0.23, w * 0.015, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.28, w * 0.06, 0, Math.PI);
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(255, 154, 162, 0.4)';
    ctx.beginPath();
    ctx.arc(w * 0.32, h * 0.28, w * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.68, h * 0.28, w * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    ctx.fillStyle = '#FFDAB9';
    if (this.state === 'interact' || this.holdingItem) {
      // Arms up
      ctx.beginPath();
      ctx.ellipse(w * 0.2, h * 0.5, w * 0.06, h * 0.12, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.8, h * 0.5, w * 0.06, h * 0.12, 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Arms down
      ctx.beginPath();
      ctx.ellipse(w * 0.25, h * 0.55, w * 0.05, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.75, h * 0.55, w * 0.05, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legs
    ctx.fillStyle = '#FFDAB9';
    ctx.beginPath();
    ctx.ellipse(w * 0.42, h * 0.92, w * 0.06, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.58, h * 0.92, w * 0.06, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shoes
    ctx.fillStyle = '#C7CEEA';
    ctx.beginPath();
    ctx.ellipse(w * 0.42, h * 0.98, w * 0.07, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.58, h * 0.98, w * 0.07, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    // Holding item
    if (this.holdingItem) {
      ctx.font = `${w * 0.2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(this.holdingItem, w * 0.5, h * 0.42);
    }
  }

  setState(state) {
    this.state = state;
  }

  walkTo(targetX, duration = 1000) {
    this.state = 'walk';
    const startX = this.x;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.x = startX + (targetX - startX) * progress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.state = 'idle';
      }
    };
    
    requestAnimationFrame(animate);
  }
}
