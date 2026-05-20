/**
 * Global TTS module for Canvas game engine
 * Provides speak/stop that any module can import without React dependency
 */

let _speakFn = null;
let _voiceCache = null;

/**
 * Find the best Spanish voice available on the device
 */
export function getBestSpanishVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Priority order for best Spanish voices
  const priorities = [
    // Google voices (Chrome/Android) - best quality
    v => v.lang.startsWith('es') && v.name.includes('Google') && v.name.includes('España'),
    v => v.lang.startsWith('es') && v.name.includes('Google'),
    // Apple voices (iOS/macOS)
    v => v.lang.startsWith('es') && v.name.includes('Monica'),
    v => v.lang.startsWith('es') && v.name.includes('Jorge'),
    v => v.lang.startsWith('es') && v.name.includes('Diego'),
    v => v.lang.startsWith('es') && v.name.includes('Paulina'),
    // Microsoft voices
    v => v.lang.startsWith('es') && v.name.includes('Microsoft') && v.name.includes('España'),
    v => v.lang.startsWith('es') && v.name.includes('Microsoft'),
    // Samsung voices
    v => v.lang.startsWith('es') && v.name.includes('Samsung'),
    // Any Spanish voice
    v => v.lang.startsWith('es'),
    // Latin American Spanish as fallback
    v => v.lang.startsWith('es-') && !v.lang.includes('es-ES'),
  ];

  for (const check of priorities) {
    const found = voices.find(check);
    if (found) return found;
  }

  // Ultimate fallback: any voice with 'es' in the lang
  return voices.find(v => v.lang.includes('es')) || voices[0];
}

/**
 * Ensure voices are loaded (async for some browsers)
 */
export function ensureVoices() {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve([]); return; }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) { resolve(voices); return; }
    const handler = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(window.speechSynthesis.getVoices());
    }, 2000);
  });
}

/**
 * Register the speak function from React hook
 */
export function registerTTS(speakFn) {
  _speakFn = speakFn;
}

/**
 * Speak text from anywhere (Canvas engine, mechanics, etc.)
 */
export function speak(text, options = {}) {
  if (_speakFn) {
    _speakFn(text, options);
    return;
  }
  // Direct fallback
  if (!window.speechSynthesis) {
    console.warn('Web Speech API not supported');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBestSpanishVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = options.lang || 'es-ES';
  utterance.rate = options.rate ?? 0.8;
  utterance.pitch = options.pitch ?? 1.1;
  utterance.volume = options.volume ?? 1.0;
  window.speechSynthesis.speak(utterance);
}

/**
 * Speak a syllable with emphasis (slightly slower, clearer)
 */
export function speakSyllable(syllable) {
  speak(syllable, { rate: 0.65, pitch: 1.15 });
}

/**
 * Speak a word with natural speed
 */
export function speakWord(word) {
  speak(word, { rate: 0.8, pitch: 1.1 });
}

/**
 * Speak an encouraging phrase
 */
export function speakEncouragement() {
  const phrases = [
    '¡Casi! Intenta con otra.',
    '¡No te rindas! Prueba otra vez.',
    '¡Muy cerca! Otra opción.',
    '¡Tú puedes! Piensa un poquito.',
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  speak(phrase, { rate: 0.85, pitch: 1.15 });
}

/**
 * Speak success celebration
 */
export function speakSuccess(word) {
  const phrases = [
    `¡${word}! ¡Excelente!`,
    `¡${word}! ¡Muy bien!`,
    `¡${word}! ¡Lo lograste!`,
    `¡${word}! ¡Súper!`,
  ];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  speak(phrase, { rate: 0.85, pitch: 1.2 });
}

/**
 * Cancel all speech
 */
export function stopTTS() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
