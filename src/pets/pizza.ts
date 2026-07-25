import type { PetDefinition } from '../types.js';
import { applyMarkings, buildClips } from './build-clips.js';
import { DOG_POSES } from './dog-art.js';
import type { SpeciesColors } from './species-palette.js';

/** Pizza: blue merle French bulldog with pale blue eyes. */
export const PIZZA_COLORS: SpeciesColors = {
  outline: '#161d26',
  body: '#7c8ea1',
  bodyDark: '#556676',
  bodyLight: '#9fb0c2',
  white: '#f4f7fa',
  whiteDark: '#ced7e1',
  iris: '#9fd8ef',
  pupil: '#12222e',
  shine: '#ffffff',
  nose: '#232c36',
  innerEar: '#e8a9b4',
  mouth: '#232c36',
};

const MERLE = '#33424f';
/** Merle patches are quantised to 2x2 blocks — per-pixel noise reads as static. */
const BLOCK = 2;
/**
 * Merle is a mottled coat, so the patches must look scattered rather than
 * striped. A cheap 2D hash over blocks gives stable, irregular-looking splotches.
 */
const merle = (color: string, x: number, y: number): string => {
  if (color !== PIZZA_COLORS.body && color !== PIZZA_COLORS.bodyLight) {
    return color;
  }

  const bx = Math.floor(x / BLOCK);
  const by = Math.floor(y / BLOCK);

  return (bx * 7 + by * 13 + ((bx * by) % 5)) % 11 < 4 ? MERLE : color;
};

export const pizzaDefinition: PetDefinition = {
  id: 'pizza',
  clips: applyMarkings(buildClips(DOG_POSES, PIZZA_COLORS), merle),
};
