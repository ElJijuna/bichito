import type { PetDefinition } from '../types.js';
import { buildClips } from './build-clips.js';
import { CAT_POSES } from './cat-art.js';
import type { SpeciesColors } from './species-palette.js';

/** Ariel: black cat with bright green eyes. */
export const ARIEL_COLORS: SpeciesColors = {
  outline: '#0b0b11',
  body: '#2f2f3d',
  bodyDark: '#1b1b25',
  bodyLight: '#4c4c60',
  white: '#f3f3f7',
  whiteDark: '#c6c6d4',
  iris: '#3ddc63',
  pupil: '#0b0b11',
  shine: '#ffffff',
  nose: '#ff8fa8',
  innerEar: '#ffb3c6',
  mouth: '#0b0b11',
};

export const arielDefinition: PetDefinition = {
  id: 'ariel',
  clips: buildClips(CAT_POSES, ARIEL_COLORS),
};
