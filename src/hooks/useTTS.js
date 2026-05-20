import { useCallback, useEffect, useRef } from 'react';
import { registerTTS, getBestSpanishVoice, ensureVoices } from '../utils/tts.js';

/**
 * Hook for Text-to-Speech using Web Speech API
 * Registers with global TTS module so Canvas engine can use speech
 */
export function useTTS() {
  const voiceRef = useRef(null);
  const initRef = useRef(false);

  // Initialize voices on first mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    ensureVoices().then(() => {
      voiceRef.current = getBestSpanishVoice();
    });
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) {
      console.warn('Web Speech API not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Use cached best voice or fetch fresh
    const voice = voiceRef.current || getBestSpanishVoice();
    if (voice) {
      utterance.voice = voice;
      voiceRef.current = voice;
    }

    utterance.lang = options.lang || 'es-ES';
    utterance.rate = options.rate ?? 0.8;   // 0.8 = slower for kids, clear but not too slow
    utterance.pitch = options.pitch ?? 1.1;  // Slightly higher, friendlier
    utterance.volume = options.volume || 1.0;

    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Register with global TTS module
  useEffect(() => {
    registerTTS(speak);
  }, [speak]);

  return { speak, stop };
}
