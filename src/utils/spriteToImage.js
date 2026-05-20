/**
 * Render pixel art sprites to PNG data URLs for use in React components
 * Caches results for performance. SSR-safe.
 */

import { PALETTE, parsePixelLine } from '../game-engine/entities/PixelSprite.js';

const cache = new Map();

function renderToCanvas(pixelLines, scale) {
  const pixels = pixelLines.map(line => parsePixelLine(line));
  const height = pixels.length;
  const width = pixels[0]?.length || 0;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const code = pixels[row][col];
      if (!code || code === 'T') continue;
      const color = PALETTE[code];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }

  return canvas.toDataURL('image/png');
}

export function spriteToDataURL(pixelLines, scale = 4) {
  if (typeof document === 'undefined') return '';
  try {
    if (!pixelLines || pixelLines.length === 0) return '';
    const cacheKey = pixelLines.join('') + '_' + scale;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const dataURL = renderToCanvas(pixelLines, scale);
    cache.set(cacheKey, dataURL);
    return dataURL;
  } catch (e) {
    console.error('spriteToDataURL error:', e);
    return '';
  }
}

export function createSpriteImage(pixelLines, scale = 4) {
  return () => spriteToDataURL(pixelLines, scale);
}

// Pre-warm cache for commonly used sprites on first client render
export function warmSpriteCache(sprites, scale = 4) {
  if (typeof document === 'undefined') return;
  Object.values(sprites).forEach(pixels => {
    spriteToDataURL(pixels, scale);
  });
}
