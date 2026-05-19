import { Entity } from './Entity.js';

/**
 * Animal entity with states: hurt, healing, happy
 */
export class Animal extends Entity {
  constructor(x, y, type, options = {}) {
    const size = options.size || 120;
    super(x, y, size, size);
    
    this.type = type; // 'perro', 'gato', etc.
    this.state = options.state || 'hurt'; // hurt, healing, happy
    this.injury = options.injury || 'pata';
    
    this.colors = this.getColors(type);
    this.animTimer = 0;
    this.hearts = [];
  }

  getColors(type) {
    const palettes = {
      perro: { body: '#D4A574', spot: '#8B6914', ear: '#C4956A' },
      gato: { body: '#FFA500', spot: '#FF8C00', ear: '#FFB347' },
      conejo: { body: '#F5F5DC', spot: '#E8E8C8', ear: '#FFB6C1' },
      hamster: { body: '#D2B48C', spot: '#C19A6B', ear: '#DEB887' },
      pajaro: { body: '#87CEEB', spot: '#4682B4', ear: '#B0E0E6' },
      tortuga: { body: '#228B22', spot: '#006400', ear: '#32CD32' },
      pez: { body: '#FF6347', spot: '#DC143C', ear: '#FA8072' },
      loro: { body: '#32CD32', spot: '#FF4500', ear: '#FFD700' },
      raton: { body: '#A9A9A9', spot: '#808080', ear: '#FFB6C1' },
      // Farm
      vaca: { body: '#FFFFFF', spot: '#000000', ear: '#FFB6C1' },
      gallina: { body: '#FFFFFF', spot: '#FF0000', ear: '#FF6347' },
      caballo: { body: '#8B4513', spot: '#654321', ear: '#A0522D' },
      cerdo: { body: '#FFB6C1', spot: '#FF69B4', ear: '#FFC0CB' },
      oveja: { body: '#FFFFF0', spot: '#F5F5DC', ear: '#FFB6C1' },
      pato: { body: '#FFFF00', spot: '#FFA500', ear: '#FF6347' },
      burro: { body: '#A9A9A9', spot: '#808080', ear: '#D3D3D3' },
      toro: { body: '#8B0000', spot: '#600000', ear: '#A0522D' },
      gallo: { body: '#FF4500', spot: '#FF0000', ear: '#FFD700' },
      pavo: { body: '#8B4513', spot: '#654321', ear: '#FF6347' },
      // Forest
      zorro: { body: '#FF8C00', spot: '#FF4500', ear: '#FFB6C1' },
      ardilla: { body: '#D2691E', spot: '#8B4513', ear: '#FFB6C1' },
      erizo: { body: '#808080', spot: '#696969', ear: '#FFB6C1' },
      buho: { body: '#8B4513', spot: '#654321', ear: '#D2B48C' },
      ciervo: { body: '#D2691E', spot: '#8B4513', ear: '#FFB6C1' },
      oso: { body: '#8B4513', spot: '#654321', ear: '#D2B48C' },
      lobo: { body: '#A9A9A9', spot: '#808080', ear: '#D3D3D3' },
      // Jungle
      mono: { body: '#D2691E', spot: '#8B4513', ear: '#FFB6C1' },
      tucan: { body: '#000000', spot: '#FF4500', ear: '#FFD700' },
      jaguar: { body: '#FF8C00', spot: '#000000', ear: '#FFB6C1' },
      delfin: { body: '#4682B4', spot: '#1E90FF', ear: '#87CEEB' },
      iguana: { body: '#32CD32', spot: '#228B22', ear: '#90EE90' },
      tigre: { body: '#FF8C00', spot: '#000000', ear: '#FFB6C1' },
      serpiente: { body: '#228B22', spot: '#006400', ear: '#32CD32' },
      mariposa: { body: '#FF69B4', spot: '#FF1493', ear: '#FFB6C1' },
    };
    return palettes[type] || { body: '#ccc', spot: '#999', ear: '#ddd' };
  }

  update(dt) {
    this.animTimer += dt;
    
    if (this.state === 'hurt') {
      // Subtle sad sway
      this.rotation = Math.sin(this.animTimer * 2) * 0.05;
    } else if (this.state === 'healing') {
      // Excited wiggle
      this.rotation = Math.sin(this.animTimer * 8) * 0.1;
      this.scale = 1 + Math.sin(this.animTimer * 10) * 0.05;
    } else if (this.state === 'happy') {
      // Happy bounce
      this.rotation = Math.sin(this.animTimer * 4) * 0.08;
      this.scale = 1 + Math.sin(this.animTimer * 6) * 0.08;
    }
  }

  draw(ctx) {
    const c = this.colors;
    const w = this.width;
    const h = this.height;

    // Body (rounded blob)
    ctx.fillStyle = c.body;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.55, w * 0.4, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = c.body;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.3, w * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = c.ear;
    ctx.beginPath();
    ctx.ellipse(w * 0.25, h * 0.15, w * 0.1, h * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.75, h * 0.15, w * 0.1, h * 0.15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (this.state === 'hurt') {
      // Sad eyes (arcs pointing down)
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.28, w * 0.06, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.62, h * 0.28, w * 0.06, 0.2, Math.PI - 0.2);
      ctx.stroke();
      
      // Tear
      ctx.fillStyle = '#87CEEB';
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.38, w * 0.03, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Happy/normal eyes
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.28, w * 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.62, h * 0.28, w * 0.06, 0, Math.PI * 2);
      ctx.fill();
      
      // Shine
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(w * 0.36, h * 0.26, w * 0.02, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.60, h * 0.26, w * 0.02, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.36, w * 0.05, h * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    if (this.state === 'hurt') {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.42, w * 0.08, 0, Math.PI);
      ctx.stroke();
    } else if (this.state === 'happy') {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.35, w * 0.08, 0, Math.PI);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.40);
      ctx.lineTo(w * 0.58, h * 0.40);
      ctx.stroke();
    }

    // Injury indicator (if hurt)
    if (this.state === 'hurt') {
      this.drawInjury(ctx, w, h);
    }

    // Hearts (if happy)
    if (this.state === 'happy') {
      this.drawHearts(ctx, w, h);
    }
  }

  drawInjury(ctx, w, h) {
    ctx.fillStyle = '#FF6B6B';
    ctx.font = `${w * 0.15}px sans-serif`;
    ctx.textAlign = 'center';
    
    const x = w * 0.85;
    const y = h * 0.45;
    
    ctx.fillText('💔', x, y);
    
    // Bandage hint
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(w * 0.7, h * 0.5, w * 0.2, h * 0.08);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.7, h * 0.5, w * 0.2, h * 0.08);
  }

  drawHearts(ctx, w, h) {
    const time = this.animTimer;
    for (let i = 0; i < 3; i++) {
      const offset = i * 2;
      const hx = w * 0.2 + Math.sin(time * 3 + offset) * w * 0.1;
      const hy = h * 0.1 + Math.cos(time * 2 + offset) * h * 0.05;
      const alpha = 0.5 + Math.sin(time * 4 + offset) * 0.3;
      
      ctx.globalAlpha = alpha;
      ctx.font = `${w * 0.12}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('❤️', hx, hy);
    }
    ctx.globalAlpha = 1;
  }

  heal() {
    this.state = 'healing';
    setTimeout(() => {
      this.state = 'happy';
    }, 2000);
  }
}
