import { Animal } from './entities/Animal.js';
import { Paula } from './entities/Paula.js';
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
    
    this.paula = null;
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
    
    // Create Paula
    this.paula = new Paula(w * 0.15, h * 0.25, {
      state: 'idle',
      size: 90
    });
    
    // Create animal
    this.animal = new Animal(w * 0.6, h * 0.15, this.levelData.animal, {
      state: 'hurt',
      injury: this.levelData.injury,
      size: 110
    });
    
    // Animate Paula walking in
    setTimeout(() => {
      this.paula.walkTo(this.canvas.width * 0.35, 1500);
    }, 500);
    
    // Transition to treating after discovery animation
    setTimeout(() => {
      this.state = 'treating';
      this.createMechanic();
    }, 2500);
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
    
    // Read the question aloud
    this.speakText(this.levelData.question);
  }

  speakText(text) {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }

  update(dt) {
    this.stateTimer += dt;
    
    if (this.paula) {
      this.paula.update(dt);
    }
    
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
      p.vy += 100 * dt;
      p.life -= dt;
      p.opacity = Math.max(0, p.life / p.maxLife);
    });
  }

  render(ctx, width, height) {
    // Background
    this.renderBackground(ctx, width, height);
    
    // Paula
    if (this.paula) {
      this.paula.render(ctx);
    }
    
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
    this.roundRect(ctx, 10, 10, 140, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#5D4037';
    ctx.font = "bold 18px 'Nunito', sans-serif";
    ctx.textAlign = 'left';
    ctx.fillText(`Nivel ${this.levelData.id}`, 22, 38);
    
    // Sound button hint
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    this.roundRect(ctx, width - 60, 10, 50, 42, 12);
    ctx.fill();
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔊', width - 35, 38);
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  renderBackground(ctx, width, height) {
    const biomeColors = {
      home: { top: '#FFF8F0', bottom: '#FFE4E1', ground: '#C8E6C9' },
      farm: { top: '#F0FFF8', bottom: '#E8F5E9', ground: '#A5D6A7' },
      forest: { top: '#F0F0FF', bottom: '#E8F5E9', ground: '#81C784' },
      jungle: { top: '#FFF5F0', bottom: '#FFF8E1', ground: '#66BB6A' }
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
    ctx.fillStyle = colors.ground;
    ctx.beginPath();
    ctx.ellipse(width / 2, height, width * 0.9, height * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Small flowers on ground
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < 5; i++) {
      const fx = width * (0.15 + i * 0.18);
      const fy = height * 0.92 + Math.sin(this.stateTimer * 2 + i) * 3;
      ctx.fillText(['🌸', '🌼', '🌻', '🌺', '🌷'][i], fx, fy);
    }
  }

  onTreatmentSuccess() {
    this.state = 'healing';
    this.paula.setState('celebrate');
    this.animal.heal();
    this.spawnHearts();
    this.playSuccessSound();
    
    setTimeout(() => {
      if (this.onComplete) this.onComplete();
    }, 3000);
  }

  onTreatmentFail() {
    this.playFailSound();
  }

  playSuccessSound() {
    // Simple success sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio not supported
    }
  }

  playFailSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(250, audioCtx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio not supported
    }
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
    // Check if sound button was pressed
    if (x > this.canvas.width - 70 && x < this.canvas.width - 10 && y > 10 && y < 55) {
      this.speakText(this.levelData.question);
      if (this.mechanic && this.mechanic.buttons) {
        this.mechanic.buttons.forEach(btn => {
          if (btn.word) this.speakText(btn.word);
        });
      }
      return true;
    }
    
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
