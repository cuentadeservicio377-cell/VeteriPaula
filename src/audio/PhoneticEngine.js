/**
 * PhoneticEngine — Síntesis de fonemas en español usando Web Audio API
 * Genera sonidos de vocales y consonantes básicas para apoyo fonético
 * Versión 1.0: Vocales /a/, /e/, /i/, /o/, /u/
 */

import { ensureAudioContext } from '../utils/sfx.js';

let _ctx = null;
function getCtx() {
  if (!_ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) _ctx = new Ctx();
  }
  return _ctx;
}

function now() {
  const ctx = getCtx();
  return ctx ? ctx.currentTime : 0;
}

/**
 * Formantes aproximados para vocales del español
 * Basado en valores acústicos típicos (F1, F2 en Hz)
 */
const VOWEL_FORMANTS = {
  a: { f1: 730, f2: 1090, gain: 0.18 },
  e: { f1: 530, f2: 1840, gain: 0.15 },
  i: { f1: 270, f2: 2290, gain: 0.12 },
  o: { f1: 570, f2: 840, gain: 0.15 },
  u: { f1: 300, f2: 870, gain: 0.12 },
};

/**
 * Reproduce una vocal sintetizada
 * @param {string} vowel - 'a', 'e', 'i', 'o', 'u'
 * @param {number} duration - segundos (default 0.35)
 * @param {number} when - tiempo de inicio en AudioContext
 */
export function playVowel(vowel, duration = 0.35, when) {
  ensureAudioContext();
  const ctx = getCtx();
  if (!ctx) return;

  const formant = VOWEL_FORMANTS[vowel.toLowerCase()];
  if (!formant) {
    console.warn('Vocal no soportada:', vowel);
    return;
  }

  const t = when ?? now();

  // Fuente: oscilador con un poco de ruido para naturalidad
  const osc = ctx.createOscillator();
  const noise = ctx.createBufferSource();
  const masterGain = ctx.createGain();

  // Oscilador base (frecuencia fundamental ~150Hz para voz femenina/niña)
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, t); // más alto para sonar como niña
  osc.frequency.exponentialRampToValueAtTime(210, t + duration * 0.8);

  // Filtros de formante (F1 y F2)
  const f1Filter = ctx.createBiquadFilter();
  f1Filter.type = 'bandpass';
  f1Filter.frequency.value = formant.f1;
  f1Filter.Q.value = 8;

  const f2Filter = ctx.createBiquadFilter();
  f2Filter.type = 'bandpass';
  f2Filter.frequency.value = formant.f2;
  f2Filter.Q.value = 8;

  // Ruido suave para breathiness
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.03;
  }
  noise.buffer = buffer;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.04, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  // Ganancia master con envolvente
  masterGain.gain.setValueAtTime(0, t);
  masterGain.gain.linearRampToValueAtTime(formant.gain, t + 0.04);
  masterGain.gain.setValueAtTime(formant.gain, t + duration - 0.08);
  masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  // Conexiones
  osc.connect(f1Filter);
  osc.connect(f2Filter);
  noise.connect(noiseGain);
  noiseGain.connect(masterGain);
  f1Filter.connect(masterGain);
  f2Filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + duration + 0.05);
  noise.start(t);
  noise.stop(t + duration);
}

/**
 * Reproduce una consonante simple
 * @param {string} consonant - 'm', 'n', 'l', 'p', 't', 'k', 's', 'r', 'v', 'b', 'd', 'g'
 * @param {number} duration - segundos
 */
export function playConsonant(consonant, duration = 0.15, when) {
  ensureAudioContext();
  const ctx = getCtx();
  if (!ctx) return;

  const t = when ?? now();
  const c = consonant.toLowerCase();

  // Nasales: m, n
  if (c === 'm' || c === 'n') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = c === 'm' ? 280 : 450;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(c === 'm' ? 180 : 220, t);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
    return;
  }

  // Plosivas: p, t, k, b, d, g
  if (['p', 't', 'k', 'b', 'd', 'g'].includes(c)) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = c === 'p' || c === 'b' ? 'lowpass' : 'bandpass';
    filter.frequency.value = { p: 800, b: 700, t: 3500, d: 3200, k: 4500, g: 4000 }[c] || 2000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(['p', 't', 'k'].includes(c) ? 0.08 : 0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    noise.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + duration);
    return;
  }

  // Fricativas: s, v, f
  if (['s', 'v', 'f'].includes(c)) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = c === 's' ? 6500 : c === 'f' ? 5500 : 2800;
    filter.Q.value = 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(c === 's' ? 0.06 : 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    noise.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + duration);
    return;
  }

  // Líquidas: l, r
  if (c === 'l' || c === 'r') {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(c === 'l' ? 320 : 380, t);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
    return;
  }

  console.warn('Consonante no soportada:', consonant);
}

/**
 * Deletrea una palabra fonéticamente, reproduciendo cada fonema
 * @param {string} word - palabra a deletrear (ej: "VENDA")
 * @param {number} gap - segundos entre fonemas (default 0.25)
 */
export function spellPhonetic(word, gap = 0.25) {
  ensureAudioContext();
  const ctx = getCtx();
  if (!ctx) return;

  const letters = word.toLowerCase().split('');
  const vowels = 'aeiou';
  let delay = 0;

  letters.forEach((letter) => {
    const t = ctx.currentTime + delay;
    if (vowels.includes(letter)) {
      playVowel(letter, 0.35, t);
    } else {
      playConsonant(letter, 0.15, t);
    }
    delay += gap;
  });
}

/**
 * Reproduce el sonido de una letra (vocal o consonante)
 * Alias simple para uso directo
 */
export function playLetterSound(letter) {
  const vowels = 'aeiou';
  const l = letter.toLowerCase();
  if (vowels.includes(l)) {
    playVowel(l);
  } else {
    playConsonant(l);
  }
}

/**
 * Reproduce los "new sounds" de un nivel
 * @param {string[]} sounds - array de sonidos del nivel (ej: ['/a/', '/e/'])
 */
export function playNewSounds(sounds) {
  if (!sounds || sounds.length === 0) return;
  let delay = 0.1;
  sounds.forEach((sound) => {
    const match = sound.match(/\/([a-z])\//);
    if (match) {
      const letter = match[1];
      setTimeout(() => playLetterSound(letter), delay * 1000);
      delay += 0.5;
    }
  });
}
