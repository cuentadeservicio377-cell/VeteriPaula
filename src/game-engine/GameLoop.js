/**
 * Core game loop for Canvas rendering
 */

export class GameLoop {
  constructor(canvas, updateFn, renderFn) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    
    this.isRunning = false;
    this.lastTimestamp = 0;
    this.animationId = null;
    
    this.setupCanvas();
  }

  setupCanvas() {
    const resize = () => {
      const parent = this.canvas.parentElement;
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    this._resizeHandler = resize;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop = (timestamp) => {
    if (!this.isRunning) return;
    
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05); // Cap delta time
    this.lastTimestamp = timestamp;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.updateFn) {
      this.updateFn(dt);
    }
    
    if (this.renderFn) {
      this.renderFn(this.ctx, this.canvas.width, this.canvas.height);
    }
    
    this.animationId = requestAnimationFrame(this.loop);
  };

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._resizeHandler);
  }
}
