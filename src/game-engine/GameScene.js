import { Animal } from './entities/Animal.js';
import { ChooseWordMechanic } from './mechanics/ChooseWord.js';
import { BuildSyllablesMechanic } from './mechanics/BuildSyllables.js';
import { FollowInstructionsMechanic } from './mechanics/FollowInstructions.js';

/**
 * Main game scene that manages a single level
 */
export class GameScene {
  constructor(canvas, levelData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.levelData = levelData;
    
    this.state = 'discovering'; // discovering, diagnosing, treating, healing, celebrating
    this.stateTimer = 0;
    
    this.animal = null;
    this.mechanic = null;
    this.particles = [];
    
    this.onComplete = null;
    this.onFail = null;
    
    this.setupScene();
  }

  setupScene() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Create animal
    this.animal = new Animal(w * 0.5 - 60, h * 0.15, this.levelData.animal, {
      state: 'hurt',
      injury: this.levelData.injury,
      size: 120
    });
    
    // Create mechanic based on level type
    setTimeout(() => {
      this.state = 'treating';
      this.createMechanic();
    }, 2000);
  }

  createMechanic() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    switch (this.levelData.mechanic) {
      case 'choose_word':
        this.mechanic = new ChooseWordMechanic(this.levelData, w, h);
        break;
      case 'build_syllables':
        this.mechanic = new BuildSyllablesMechanic(this.levelData, w, h);
        break;
      case 'follow_instructions':
        this.mechanic = new FollowInstructionsMechanic(this.levelData, w, h);
        break;
      case 'combined':
        // Use sub-mechanic for combined levels
        if (this.levelData.subMechanic === 'choose_word') {
          this.mechanic = new ChooseWordMechanic(this.levelData, w, h);
        } else if (this.levelData.subMechanic === 'build_syllables') {
          this.mechanic = new BuildSyllablesMechanic(this.levelData, w, h);
        } else {
          this.mechanic = new FollowInstructionsMechanic(this.levelData, w, h);
        }
        break;
      default:
        this.mechanic = new ChooseWordMechanic(this.levelData, w, h);
    }
    
    this.mechanic.onSuccess = () => this.onTreatmentSuccess();
    this.mechanic.onFail = () => this.onTreatmentFail();
  }

  update(dt) {
    this.stateTimer += dt;
    
    if (this.animal) {
      this.animal.update(dt);
    }
    
    if (this.mechanic && this.state === 'treating') {
      this.mechanic.update(dt);
    }
    
    // Update particles
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 100 * dt; // gravity
      p.life -= dt;
      p.opacity = Math.max(0, p.life / p.maxLife);
    });
  }

  render(ctx, width, height) {
    // Background
    this.renderBackground(ctx, width, height);
    
    // Animal
    if (this.animal) {
      this.animal.render(ctx);
    }
    
    // Particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(p.emoji, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    
    // Mechanic UI
    if (this.mechanic && this.state === 'treating') {
      this.mechanic.render(ctx);
    }
    
    // Level indicator
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(10, 10, 120, 40);
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 18px 'Nunito', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText(`Nivel ${this.levelData.id}`, 20, 37);
  }

  renderBackground(ctx, width, height) {
    const biomeColors = {
      home: { top: '#FFF8F0', bottom: '#FFE4E1' },
      farm: { top: '#F0FFF8', bottom: '#E8F5E9' },
      forest: { top: '#F0F0FF', bottom: '#E8F5E9' },
      jungle: { top: '#FFF5F0', bottom: '#FFF8E1' }
    };
    
    const colors = biomeColors[this.levelData.biome] || biomeColors.home;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colors.top);
    gradient.addColorStop(1, colors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Decorative elements
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    // Clouds
    for (let i = 0; i < 3; i++) {
      const cx = width * (0.2 + i * 0.3) + Math.sin(this.stateTimer + i) * 20;
      const cy = height * 0.08 + Math.cos(this.stateTimer * 0.5 + i) * 10;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 5, 25, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Ground
    ctx.fillStyle = '#C8E6C9';
    ctx.beginPath();
    ctx.ellipse(width / 2, height, width * 0.8, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  onTreatmentSuccess() {
    this.state = 'healing';
    this.animal.heal();
    this.spawnHearts();
    
    setTimeout(() => {
      if (this.onComplete) this.onComplete();
    }, 3000);
  }

  onTreatmentFail() {
    // Shake effect
    if (this.onFail) this.onFail();
  }

  spawnHearts() {
    const cx = this.animal.centerX();
    const cy = this.animal.y;
    
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 200,
        vy: -Math.random() * 300 - 100,
        emoji: ['❤️', '💚', '💛', '💙', '💖'][Math.floor(Math.random() * 5)],
        size: 20 + Math.random() * 15,
        life: 2 + Math.random(),
        maxLife: 2 + Math.random(),
        opacity: 1
      });
    }
  }

  handleTouch(x, y) {
    if (this.state === 'treating' && this.mechanic) {
      return this.mechanic.handleTouch(x, y);
    }
    return false;
  }

  handleMouseMove(x, y) {
    if (this.state === 'treating' && this.mechanic) {
      this.mechanic.handleMouseMove(x, y);
    }
  }

  resize() {
    if (this.mechanic) {
      this.mechanic.resize(this.canvas.width, this.canvas.height);
    }
  }
}
