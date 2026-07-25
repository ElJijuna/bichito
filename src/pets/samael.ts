import type { PetDefinition } from '../types.js';
import { buildClips } from './build-clips.js';
import { CAT_POSES } from './cat-art.js';
import type { SpeciesColors } from './species-palette.js';

/**
 * Samael: white cat with ice-blue eyes.
 *
 * A white pet needs a mid-grey outline rather than a near-black one, otherwise
 * the silhouette reads as a heavy ink drawing instead of a pale cat.
 */
export const SAMAEL_COLORS: SpeciesColors = {
  outline: '#7c8496',
  body: '#eef1f7',
  bodyDark: '#ccd3e0',
  bodyLight: '#ffffff',
  white: '#ffffff',
  whiteDark: '#dde3ee',
  iris: '#4fc3f7',
  pupil: '#123044',
  shine: '#ffffff',
  nose: '#f2a0b4',
  innerEar: '#ffc9d6',
  mouth: '#7c8496',
};

export const samaelDefinition: PetDefinition = {
  id: 'samael',
  clips: buildClips(CAT_POSES, SAMAEL_COLORS),
};
