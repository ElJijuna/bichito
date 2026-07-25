import type { PetDefinition } from '../types.js';
import { buildClips } from './build-clips.js';
import { DOG_POSES } from './dog-art.js';
import type { SpeciesColors } from './species-palette.js';

/** Thor: blue-pied French bulldog with warm brown eyes. */
export const THOR_COLORS: SpeciesColors = {
  outline: '#1a212b',
  body: '#617386',
  bodyDark: '#42515f',
  bodyLight: '#8698ab',
  white: '#f2f5f9',
  whiteDark: '#ccd4de',
  iris: '#a9713c',
  pupil: '#150f0a',
  shine: '#ffffff',
  nose: '#28303a',
  innerEar: '#e8a9b4',
  mouth: '#28303a',
};

export const thorDefinition: PetDefinition = {
  id: 'thor',
  clips: buildClips(DOG_POSES, THOR_COLORS),
};
