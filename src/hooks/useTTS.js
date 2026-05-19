import { useCallback } from 'react';

/**
 * Hook for Text-to-Speech using Web Speech API
 */
export function useTTS() {
  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) {
      console.warn('Web Speech API not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'es-ES';
    utterance.rate = options.rate || 0.75; // Slower for kids
    utterance.pitch = options.pitch || 1.1; // Slightly higher, friendlier
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

  return { speak, stop };
}
