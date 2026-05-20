/**
 * Procedural sound effects using Web Audio API
 * Zero dependencies, zero audio files — generates all sounds procedurally
 * Compatible with iOS Safari (requires user gesture to unlock AudioContext)
 */

let _ctx = null;

function getCtx() {
  if (!_ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) _ctx = new Ctx();
  }
  return _ctx;
}

/**
 * Ensure AudioContext is resumed (required for iOS Safari)
 * Call this inside every user gesture handler
 */
export function ensureAudioContext() {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function now() {
  const ctx = getCtx();
  return ctx ? ctx.currentTime : 0;
}

function playTone({ type = 'sine', freq, duration, gain = 0.15, fadeOut = 0.08, when }) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = when ?? now();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + fadeOut);
}

function playRamp({ type = 'sine', fromFreq, toFreq, duration, gain = 0.15, when }) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = when ?? now();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fromFreq, t);
  osc.frequency.exponentialRampToValueAtTime(toFreq, t + duration);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// ── Sound Effects ───────────────────────────────────────────────

/** Pop — bright triangle burst for button taps */
export function playPop() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = now();
  playTone({ type: 'triangle', freq: 880, duration: 0.06, gain: 0.12, when: t });
  playTone({ type: 'triangle', freq: 1320, duration: 0.04, gain: 0.06, when: t + 0.02 });
}

/** Snap — double clack for correct drop */
export function playSnap() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = now();
  playTone({ type: 'square', freq: 600, duration: 0.04, gain: 0.08, when: t });
  playTone({ type: 'square', freq: 900, duration: 0.05, gain: 0.06, when: t + 0.05 });
}

/** Ding — bell-like success tone */
export function playDing() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = now();
  playTone({ type: 'sine', freq: 1318.5, duration: 0.25, gain: 0.12, when: t });      // E6
  playTone({ type: 'sine', freq: 1661.2, duration: 0.30, gain: 0.08, when: t + 0.05 }); // G#6
  playTone({ type: 'sine', freq: 1975.5, duration: 0.35, gain: 0.05, when: t + 0.10 }); // B6
}

/** Boing — soft descending sine for gentle errors */
export function playBoing() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = now();
  playRamp({ type: 'sine', fromFreq: 300, toFreq: 150, duration: 0.25, gain: 0.10, when: t });
}

/** Whoosh — noise sweep for drag start */
export function playWhoosh() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = now();

  // White noise buffer
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, t);
  filter.frequency.exponentialRampToValueAtTime(200, t + 0.15);
  filter.Q.value = 1;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

  noise.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.15);
}

/** Magic — pentatonic arpeggio for level complete */
export function playMagic() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = now();
  const notes = [523.3, 587.3, 659.3, 784.0, 880.0]; // C5 D5 E5 G5 A5
  notes.forEach((freq, i) => {
    playTone({ type: 'sine', freq, duration: 0.35, gain: 0.08 - i * 0.01, when: t + i * 0.08 });
  });
}

/** Haptic vibration (Android only — iOS doesn't support Vibration API) */
export function haptic(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/** Vibrate short bump on grab */
export function hapticGrab() {
  haptic(15);
}

/** Vibrate pattern on successful snap */
export function hapticSnap() {
  haptic([10, 20, 15]);
}
