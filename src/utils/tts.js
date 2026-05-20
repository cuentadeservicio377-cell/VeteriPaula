/**
 * Global TTS module for Canvas game engine
 * v2.2 — iOS Safari hardened, phonetic spelling, presets, safe cancel, warm-up
 */

let _speakFn = null;
let _voiceCache = null;
let _cancelTimeout = null;
let _iOSWakeUpDone = false;
const _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const TTS_PRESETS = {
  instruction: { rate: 0.75, pitch: 1.1 },
  word:        { rate: 0.7,  pitch: 1.15 },
  syllable:    { rate: 0.6,  pitch: 1.2 },
  celebrate:   { rate: 0.9,  pitch: 1.2 },
  encourage:   { rate: 0.85, pitch: 1.15 },
};

// Phonetic spelling for tricky Spanish words
const PHONETIC_MAP = {
  'jirafa': 'jhee-RAH-fah',
  'avestruz': 'ah-ves-TROOTH',
  'hipopotamo': 'ee-poh-POH-tah-moh',
  'murcielago': 'moor-SYEH-lah-goh',
  'jugueteria': 'hoo-geh-teh-REE-ah',
  'pinguino': 'peen-GHEE-noh',
  'ciguena': 'see-GHEH-nyah',
  'jaguar': 'JAH-gwar',
  'tucan': 'too-KAHN',
};

function sanitizeText(text) {
  if (typeof text !== 'string') return String(text);
  // iOS bug: < and > can freeze TTS permanently
  return text.replace(/[<>]/g, '');
}

function clampForiOS(options) {
  if (!_isIOS) return options;
  return {
    ...options,
    rate: Math.max(0.6, Math.min(options.rate ?? 0.8, 1.2)),
    pitch: Math.max(0.8, Math.min(options.pitch ?? 1.1, 1.3)),
  };
}

/**
 * Find the best Spanish voice available on the device
 */
export function getBestSpanishVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const priorities = [
    v => v.lang.startsWith('es') && v.name.includes('Monica'),
    v => v.lang.startsWith('es') && v.name.includes('Jorge'),
    v => v.lang.startsWith('es') && v.name.includes('Diego'),
    v => v.lang.startsWith('es') && v.name.includes('Paulina'),
    v => v.lang.startsWith('es') && v.name.includes('Google') && v.name.includes('España'),
    v => v.lang.startsWith('es') && v.name.includes('Google'),
    v => v.lang.startsWith('es') && v.name.includes('Microsoft'),
    v => v.lang.startsWith('es') && v.name.includes('Samsung'),
    v => v.lang.startsWith('es') && v.localService === true,
    v => v.lang.startsWith('es'),
    v => v.lang.includes('es'),
  ];

  for (const check of priorities) {
    const found = voices.find(check);
    if (found) return found;
  }
  return voices.find(v => v.lang.includes('es')) || voices[0];
}

/**
 * Ensure voices are loaded (async for some browsers)
 */
export function ensureVoices() {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve([]); return; }

    const check = (attempt = 1) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) { resolve(voices); return; }
      if (attempt >= 10) { resolve(window.speechSynthesis.getVoices()); return; }
      setTimeout(() => check(attempt + 1), attempt * 100);
    };

    const handler = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      check();
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    check();

    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      check();
    }, 2000);
  });
}

/**
 * Wake-up utterance for iOS Safari — MUST happen inside a user gesture
 */
export function wakeUpSpeechSynthesis() {
  if (_iOSWakeUpDone || !window.speechSynthesis) return;
  if (_isIOS) {
    try {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  _iOSWakeUpDone = true;
}

/**
 * Register the speak function from React hook
 */
export function registerTTS(speakFn) {
  _speakFn = speakFn;
}

/**
 * Speak text from anywhere (Canvas engine, mechanics, etc.)
 * Safe cancel+speak with iOS Safari 150ms delay workaround
 */
export function speak(text, options = {}) {
  const safeText = sanitizeText(text);
  if (!safeText || !window.speechSynthesis) {
    console.warn('Web Speech API not supported or empty text');
    return;
  }

  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(safeText);
    let voice = _voiceCache || getBestSpanishVoice();

    // On iOS, forcing a specific voice can sometimes degrade quality
    // But we still try to use a Spanish voice if available
    if (_isIOS && !options.forceVoice) {
      utterance.lang = 'es-ES';
      if (voice) {
        utterance.voice = voice;
        _voiceCache = voice;
      }
    } else if (voice) {
      utterance.voice = voice;
      _voiceCache = voice;
    }

    utterance.lang = options.lang || 'es-ES';
    utterance.volume = options.volume ?? 1.0;

    const clamped = clampForiOS(options);
    utterance.rate = clamped.rate;
    utterance.pitch = clamped.pitch;

    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
  };

  // Safari bug fix: cancel() + speak() immediately = silence
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
    if (_cancelTimeout) clearTimeout(_cancelTimeout);
    _cancelTimeout = setTimeout(doSpeak, 150);
  } else {
    doSpeak();
  }
}

/**
 * Speak with a preset configuration
 */
export function speakWithPreset(text, presetName, overrides = {}) {
  const preset = TTS_PRESETS[presetName] || TTS_PRESETS.word;
  const key = text?.toLowerCase?.().replace(/[áéíóú]/g, c => ({á:'a',é:'e',í:'i',ó:'o',ú:'u'})[c]);
  const phonetic = PHONETIC_MAP[key] || text;
  speak(phonetic, { ...preset, ...overrides });
}

/**
 * Speak a syllable with emphasis (slightly slower, clearer)
 */
export function speakSyllable(syllable) {
  speak(syllable, TTS_PRESETS.syllable);
}

/**
 * Speak a word with natural speed
 */
export function speakWord(word) {
  speakWithPreset(word, 'word');
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
  speak(phrase, TTS_PRESETS.encourage);
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
  speak(phrase, TTS_PRESETS.celebrate);
}

/**
 * Speak a sequence of syllables with gaps between them
 */
export function speakSyllableSequence(syllables, gapMs = 400) {
  if (!syllables?.length) return;
  let i = 0;
  const next = () => {
    if (i >= syllables.length) return;
    const isLast = i === syllables.length - 1;
    const u = new SpeechSynthesisUtterance(syllables[i]);
    const voice = _voiceCache || getBestSpanishVoice();
    if (voice) u.voice = voice;
    u.rate = isLast ? 0.55 : 0.6;
    u.pitch = 1.2;
    u.lang = 'es-ES';
    u.onend = () => setTimeout(next, gapMs);
    window.speechSynthesis.speak(u);
    i++;
  };
  next();
}

/**
 * Cancel all speech
 */
export function stopTTS() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (_cancelTimeout) {
    clearTimeout(_cancelTimeout);
    _cancelTimeout = null;
  }
}
