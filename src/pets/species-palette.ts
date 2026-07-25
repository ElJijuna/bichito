import type { Palette } from './sprite-utils.js';

/**
 * Colour slots every pet fills in. Keeping the slots fixed lets the cat and dog
 * art be authored once and re-skinned per pet, instead of each pet re-deriving
 * its art by colour-swapping another pet's frames.
 */
export interface SpeciesColors {
  /** Silhouette outline. Should be the darkest colour so shapes read anywhere. */
  outline: string;
  /** Main coat colour. */
  body: string;
  /** Shaded coat, used for undersides and the tail. */
  bodyDark: string;
  /** Lit coat, used as a rim along the top so the sprite pops on dark pages. */
  bodyLight: string;
  /** Chest, muzzle and paw markings. */
  white: string;
  /** Shaded markings. */
  whiteDark: string;
  /** Iris. */
  iris: string;
  /** Pupil. */
  pupil: string;
  /** Eye highlight. */
  shine: string;
  /** Nose. */
  nose: string;
  /** Inner ear. */
  innerEar: string;
  /** Mouth and muzzle line. */
  mouth: string;
}

/** Translates a {@link SpeciesColors} into the character map the art uses. */
export function toPalette(colors: SpeciesColors): Palette {
  return {
    o: colors.outline,
    B: colors.body,
    D: colors.bodyDark,
    L: colors.bodyLight,
    W: colors.white,
    w: colors.whiteDark,
    G: colors.iris,
    P: colors.pupil,
    S: colors.shine,
    n: colors.nose,
    y: colors.innerEar,
    m: colors.mouth,
  };
}
