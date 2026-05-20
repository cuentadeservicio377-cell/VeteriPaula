/**
 * Pixel art decorations for backgrounds — flowers, biome items
 * Avatar World style: simple, vibrant, blocky
 */

import { PixelSprite, PALETTE } from '../entities/PixelSprite.js';

// Tiny flower sprites (5x5 to 7x7)
const FLOWER_PINK = [
  'TTTR1TT',
  'TR1R1R1T',
  'TR1Y1R1T',
  'TTG1G1TT',
  'TTG1TTTT',
];

const FLOWER_YELLOW = [
  'TTY1Y1TT',
  'TY1Y1Y1T',
  'TY1O1Y1T',
  'TTG1G1TT',
  'TTTG1TTT',
];

const FLOWER_BLUE = [
  'TTC3C3TT',
  'TC3C3C3T',
  'TC3Y1C3T',
  'TTG1G1TT',
  'TTTG1TTT',
];

const FLOWER_PURPLE = [
  'TTP1P1TT',
  'TP1P1P1T',
  'TP1Y1P1T',
  'TTG1G1TT',
  'TTTG1TTT',
];

const FLOWER_WHITE = [
  'TTC2C2TT',
  'TC2C2C2T',
  'TC2Y1C2T',
  'TTG1G1TT',
  'TTTG1TTT',
];

const FLOWER_RED = [
  'TTR1R1TT',
  'TR1R1R1T',
  'TR1Y1R1T',
  'TTG1G1TT',
  'TTTG1TTT',
];

// Biome decorations (bigger, ~10x10)
const HOUSE_PIXELS = [
  'TTTTR1TTTT',
  'TTTR1R1TTT',
  'TTR1R1R1TT',
  'TTC2C2C2C2TT',
  'TC2C2C2C2C2T',
  'TC2C3C3C2C2T',
  'TC2C3C3C2C2T',
  'TC2C2C2C2C2T',
  'TTC2TTTTC2TT',
];

const TRACTOR_PIXELS = [
  'TTTTTTR1TTTT',
  'TTTTTR1R1TTT',
  'TTTTTTC2C2TT',
  'TTTTC2C2C2C2T',
  'TTTTC2C2C2C2T',
  'TTTTC2C2C2C2T',
  'TTTA10A10TTTT',
  'TTA10TTA10TTT',
];

const BUTTERFLY_PIXELS = [
  'TTC3TTTC3T',
  'TC3C3TC3C3T',
  'TTC3C3C3C3T',
  'TTTC3Y1C3TT',
  'TTTC3C3C3TT',
  'TTC3TTTC3T',
];

const PARROT_PIXELS = [
  'TTTTTA8TTT',
  'TTTA8A8A8TT',
  'TTA8A8Y1A8TT',
  'TTTA8A8A8TT',
  'TTTTA8A8TTT',
  'TTTTTA8TTT',
];

const PIXEL_DEFS = {
  flowerPink: FLOWER_PINK,
  flowerYellow: FLOWER_YELLOW,
  flowerBlue: FLOWER_BLUE,
  flowerPurple: FLOWER_PURPLE,
  flowerWhite: FLOWER_WHITE,
  flowerRed: FLOWER_RED,
  house: HOUSE_PIXELS,
  tractor: TRACTOR_PIXELS,
  butterfly: BUTTERFLY_PIXELS,
  parrot: PARROT_PIXELS,
};

export function createDecoration(type, x, y, scale = 4) {
  const def = PIXEL_DEFS[type];
  if (!def) return null;
  const pixels = def.map(line => line.trim().split(''));
  return new PixelSprite({ pixels, palette: PALETTE }, { x, y, scale });
}

// Pre-defined flower types for cycling
export const FLOWER_TYPES = [
  'flowerPink', 'flowerYellow', 'flowerBlue',
  'flowerPurple', 'flowerWhite', 'flowerRed',
];

export const BIOME_DECO = {
  clinica: 'house',
  granja: 'tractor',
  bosque: 'butterfly',
  selva: 'parrot',
};
