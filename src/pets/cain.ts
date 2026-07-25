import type { PetDefinition } from '../types.js';
import { applyMarkings, buildClips } from './build-clips.js';
import { CAT_POSES } from './cat-art.js';
import type { SpeciesColors } from './species-palette.js';

/**
 * Cain: amber tabby with yellow eyes, dark stripes and a single white paw.
 *
 * Only the viewer-right paw is white — the left one takes the coat colour, so
 * the odd sock reads as a marking rather than a pair of boots.
 */
export const CAIN_COLORS: SpeciesColors = {
  outline: '#3a2306',
  body: '#d6941f',
  bodyDark: '#a2690f',
  bodyLight: '#f2b74c',
  white: '#fff7ea',
  whiteDark: '#dccbb0',
  pawLeft: '#d6941f',
  pawLeftDark: '#a2690f',
  iris: '#ffd633',
  pupil: '#2b1904',
  shine: '#ffffff',
  nose: '#e8829a',
  innerEar: '#f5aebb',
  mouth: '#3a2306',
};

const STRIPE = '#8a5709';
/** Tabby banding: narrow dark bars every fourth row across the coat. */
const stripes = (color: string, _x: number, y: number): string =>
  y % 4 === 1 && (color === CAIN_COLORS.body || color === CAIN_COLORS.bodyLight) ? STRIPE : color;

export const cainDefinition: PetDefinition = {
  id: 'cain',
  clips: applyMarkings(buildClips(CAT_POSES, CAIN_COLORS), stripes),
};
