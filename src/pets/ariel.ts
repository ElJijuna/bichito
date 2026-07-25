import type { PetDefinition } from '../types.js';
import { buildClips } from './build-clips.js';
import { CAT_POSES } from './cat-art.js';
import type { SpeciesColors } from './species-palette.js';

/**
 * Ariel: solid black cat with bright green eyes.
 *
 * A solid-black cat has no white anywhere, so the marking slots carry a barely
 * lighter black instead of a colour. They then read as fur sheen on the chest
 * and paws rather than a bib, which is what keeps the shape legible — a truly
 * flat black silhouette would lose its chest, muzzle and paws entirely.
 */
export const ARIEL_COLORS: SpeciesColors = {
  outline: '#000000',
  body: '#1c1c22',
  bodyDark: '#0f0f13',
  bodyLight: '#33333d',
  white: '#26262e',
  whiteDark: '#17171c',
  iris: '#44e06a',
  pupil: '#000000',
  shine: '#ffffff',
  nose: '#3d3138',
  innerEar: '#463840',
  mouth: '#000000',
};

export const arielDefinition: PetDefinition = {
  id: 'ariel',
  clips: buildClips(CAT_POSES, ARIEL_COLORS),
};
