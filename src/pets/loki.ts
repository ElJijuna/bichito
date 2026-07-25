import type { PetDefinition } from '../types.js';
import { applyMarkings, buildClips } from './build-clips.js';
import { DOG_POSES } from './dog-art.js';
import type { SpeciesColors } from './species-palette.js';

/** Loki: fawn French bulldog with a dark mask and green eyes. */
export const LOKI_COLORS: SpeciesColors = {
  outline: '#3b2a18',
  body: '#c99a63',
  bodyDark: '#9a7043',
  bodyLight: '#e3ba86',
  white: '#fbf3e6',
  whiteDark: '#d9cbb4',
  iris: '#7fbf5f',
  pupil: '#1d1409',
  shine: '#ffffff',
  nose: '#3b2a18',
  innerEar: '#e8a9b4',
  mouth: '#3b2a18',
};

const MASK = '#5c4227';
/** Fawn frenchies wear a dark mask across the muzzle and around the eyes. */
const mask = (color: string, _x: number, y: number): string =>
  y >= 9 && y <= 18 && (color === LOKI_COLORS.body || color === LOKI_COLORS.bodyLight)
    ? MASK
    : color;

export const lokiDefinition: PetDefinition = {
  id: 'loki',
  clips: applyMarkings(buildClips(DOG_POSES, LOKI_COLORS), mask),
};
