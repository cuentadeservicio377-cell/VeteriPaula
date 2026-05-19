/**
 * Base Entity class for all game objects
 */

export class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.scale = 1;
    this.opacity = 1;
    this.rotation = 0;
  }

  update(dt) {
    // Override in subclasses
  }

  render(ctx) {
    if (!this.visible || this.opacity <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.width / 2, -this.height / 2);
    
    this.draw(ctx);
    
    ctx.restore();
  }

  draw(ctx) {
    // Override in subclasses
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, this.width, this.height);
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.width &&
           py >= this.y && py <= this.y + this.height;
  }

  centerX() {
    return this.x + this.width / 2;
  }

  centerY() {
    return this.y + this.height / 2;
  }
}
