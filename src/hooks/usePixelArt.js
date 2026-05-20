import { useState, useEffect } from 'react';
import { spriteToDataURL, warmSpriteCache } from '../utils/spriteToImage.js';
import { FAMILY_SPRITES, BIOME_SPRITES, ICON_SPRITES } from '../game-engine/sprites/UI.js';
import { ANIMAL_PIXEL_DEFS } from '../game-engine/sprites/Characters.js';

// Warm caches on first import (client-side only)
if (typeof window !== 'undefined') {
  warmSpriteCache(FAMILY_SPRITES, 5);
  warmSpriteCache(BIOME_SPRITES, 5);
  warmSpriteCache(ICON_SPRITES, 4);
  warmSpriteCache(ANIMAL_PIXEL_DEFS, 3);
}

/**
 * Hook to get a data URL for a pixel art sprite
 * @param {string[]} pixelDef - Sprite pixel definition
 * @param {number} scale - Scale factor
 * @returns {string} Data URL or empty string during SSR
 */
export function useSpriteImage(pixelDef, scale = 4) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!pixelDef || pixelDef.length === 0) return;
    setUrl(spriteToDataURL(pixelDef, scale));
  }, [pixelDef, scale]);

  return url;
}

/**
 * Get family character sprite data URL
 */
export function useFamilySprite(character, scale = 5) {
  const def = FAMILY_SPRITES[character] || FAMILY_SPRITES.mama;
  return useSpriteImage(def, scale);
}

/**
 * Get biome icon sprite data URL
 */
export function useBiomeSprite(biome, scale = 5) {
  const def = BIOME_SPRITES[biome] || BIOME_SPRITES.clinica;
  return useSpriteImage(def, scale);
}

/**
 * Get UI icon sprite data URL
 */
export function useIconSprite(icon, scale = 4) {
  const def = ICON_SPRITES[icon];
  return useSpriteImage(def, scale);
}

// Static getters for non-hook contexts (event handlers, etc.)
export function getFamilySpriteUrl(character, scale = 5) {
  const def = FAMILY_SPRITES[character] || FAMILY_SPRITES.mama;
  return spriteToDataURL(def, scale);
}

export function getBiomeSpriteUrl(biome, scale = 5) {
  const def = BIOME_SPRITES[biome] || BIOME_SPRITES.clinica;
  return spriteToDataURL(def, scale);
}

export function getIconSpriteUrl(icon, scale = 4) {
  const def = ICON_SPRITES[icon];
  return spriteToDataURL(def, scale);
}

/**
 * Get animal sprite data URL
 */
export function useAnimalSprite(animal, scale = 3) {
  const def = ANIMAL_PIXEL_DEFS[animal] || ANIMAL_PIXEL_DEFS.perro;
  return useSpriteImage(def, scale);
}

export function getAnimalSpriteUrl(animal, scale = 3) {
  const def = ANIMAL_PIXEL_DEFS[animal] || ANIMAL_PIXEL_DEFS.perro;
  return spriteToDataURL(def, scale);
}
