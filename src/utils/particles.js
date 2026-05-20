/**
 * Rich particle system for celebrations and visual effects
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.gravity = 250;
  }

  spawnConfetti(x, y, count = 40) {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9AA2', '#B5EAD7', '#C7CEEA', '#FFDac1', '#A8E6CF'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 900,
        vy: -Math.random() * 700 - 250,
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 12,
        life: 2.5 + Math.random() * 1.5,
        maxLife: 2.5 + Math.random() * 1.5,
        type: 'confetti',
      });
    }
  }

  spawnHearts(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 350,
        vy: -Math.random() * 450 - 120,
        size: 16 + Math.random() * 18,
        emoji: ['❤️', '💖', '💕', '💗', '💝', '💘'][Math.floor(Math.random() * 6)],
        life: 2.5 + Math.random(),
        maxLife: 2.5 + Math.random(),
        type: 'emoji',
      });
    }
  }

  spawnStars(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 600,
        vy: -Math.random() * 600 - 180,
        size: 12 + Math.random() * 16,
        emoji: ['⭐', '✨', '🌟', '💫', '🌠'][Math.floor(Math.random() * 5)],
        life: 2 + Math.random(),
        maxLife: 2 + Math.random(),
        type: 'emoji',
      });
    }
  }

  spawnSparkles(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 120 + Math.random() * 250;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        color: ['#FFE66D', '#FFF', '#FFD700', '#FFA500'][Math.floor(Math.random() * 4)],
        life: 0.6 + Math.random() * 0.6,
        maxLife: 0.6 + Math.random() * 0.6,
        type: 'sparkle',
      });
    }
  }

  spawnMagic(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        size: 3 + Math.random() * 6,
        color: ['#B5EAD7', '#A0E7E5', '#C7CEEA', '#FFDac1'][Math.floor(Math.random() * 4)],
        life: 1.5 + Math.random(),
        maxLife: 1.5 + Math.random(),
        type: 'glow',
      });
    }
  }

  update(dt) {
    this.particles = this.particles.filter(p => p.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vy += this.gravity * dt;
      p.life -= dt;
      p.vx *= 0.98;
      if (p.rotationSpeed) p.rotation += p.rotationSpeed * dt;
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      const progress = 1 - (p.life / p.maxLife);
      const opacity = Math.max(0, 1 - progress * progress);
      ctx.save(); ctx.globalAlpha = opacity;

      if (p.type === 'emoji') {
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center'; ctx.fillText(p.emoji, p.x, p.y);
      } else if (p.type === 'confetti') {
        ctx.translate(p.x, p.y); ctx.rotate(p.rotation || 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.type === 'sparkle' || p.type === 'glow') {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = opacity * 0.25;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }
}
