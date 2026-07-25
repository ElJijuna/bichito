import { overlayFrame, type Palette, parseFrame } from './pets/sprite-utils.js';
import { drawFrame } from './render.js';
import type { SpriteFrame } from './types.js';

/** The bubble is authored on its own smaller grid than the pets. */
const BUBBLE_SIZE = 20;
/** Last row of the bubble tail, used to seat the bubble on the pet's head. */
const TAIL_TIP_ROW = 17;
const PALETTE: Palette = {
  o: '#2b2b33', // outline
  b: '#fdfdff', // bubble fill
  h: '#ff4d80', // heart
  H: '#ffa3bf', // heart highlight
};
/** Rounded speech bubble with a tail pointing down at the pet. */
const BUBBLE = [
  '.....oooooooo.......',
  '...oobbbbbbbboo.....',
  '..obbbbbbbbbbbbo....',
  '.obbbbbbbbbbbbbbo...',
  'obbbbbbbbbbbbbbbbo..',
  'obbbbbbbbbbbbbbbbo..',
  'obbbbbbbbbbbbbbbbo..',
  'obbbbbbbbbbbbbbbbo..',
  'obbbbbbbbbbbbbbbbo..',
  'obbbbbbbbbbbbbbbbo..',
  '.obbbbbbbbbbbbbbo...',
  '..obbbbbbbbbbbbo....',
  '...oobbbbbbbboo.....',
  '.....oooobbbo.......',
  '.........obbo.......',
  '..........obo.......',
  '..........oo........',
  '....................',
  '....................',
  '....................',
];
const HEART_SMALL = [
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '......hh..hh........',
  '......hhhhhh........',
  '.......hhhh.........',
  '........hh..........',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
];
const HEART_MEDIUM = [
  '....................',
  '....................',
  '....................',
  '....................',
  '......hh..hh........',
  '.....hHHhhhhh.......',
  '.....hhhhhhhh.......',
  '......hhhhhh........',
  '.......hhhh.........',
  '........hh..........',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
];
const HEART_LARGE = [
  '....................',
  '....................',
  '....................',
  '......hh..hh........',
  '.....hHHhhhhh.......',
  '....hhHHhhhhhh......',
  '....hhhhhhhhhh......',
  '.....hhhhhhhh.......',
  '......hhhhhh........',
  '.......hhhh.........',
  '........hh..........',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
];
const bubble = parseFrame(PALETTE, BUBBLE, BUBBLE_SIZE);
const withHeart = (heart: string[]): SpriteFrame =>
  overlayFrame(bubble, parseFrame(PALETTE, heart, BUBBLE_SIZE));
/** Small, medium, large, medium — a two-beat pulse rather than a linear grow. */
const FRAMES: SpriteFrame[] = [
  withHeart(HEART_SMALL),
  withHeart(HEART_MEDIUM),
  withHeart(HEART_LARGE),
  withHeart(HEART_MEDIUM),
];
const DURATION_MS = 1500;
const BEAT_FPS = 8;
/** Fraction of the lifetime spent fully opaque before fading out. */
const FADE_AFTER = 0.6;

export interface HeartBubble {
  /**
   * Advances the bubble and re-anchors it above the pet.
   * Returns `false` once it has finished and should be destroyed.
   */
  update(petX: number, petY: number, elapsedMs: number): boolean;
  destroy(): void;
}

/**
 * Pops a speech bubble with a beating heart above the pet.
 *
 * It is a separate canvas rather than part of the pet sprite because the bubble
 * has to sit outside the pet's own 30x30 box, and it re-anchors every frame so
 * it keeps up with a pet that is still walking.
 */
export function createHeartBubble(container: HTMLElement, petSize: number): HeartBubble {
  // Integer pixel scale, so bubble pixels stay crisp and match the pet's grid.
  const scale = Math.max(1, Math.round(petSize / 30));
  const dimension = BUBBLE_SIZE * scale;
  const canvas = document.createElement('canvas');

  canvas.width = dimension;
  canvas.height = dimension;
  canvas.style.cssText = [
    'position:fixed',
    `width:${dimension}px`,
    `height:${dimension}px`,
    'image-rendering:pixelated',
    'pointer-events:none',
    'z-index:2147483647',
  ].join(';');

  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    return { update: () => false, destroy: () => undefined };
  }

  container.appendChild(canvas);

  let ageMs = 0;

  return {
    update(petX, petY, elapsedMs) {
      ageMs += elapsedMs;

      const life = ageMs / DURATION_MS;

      if (life >= 1) {
        return false;
      }

      // Drift upward as it ages, and fade only over the final stretch.
      const rise = life * petSize * 0.4;
      const fade = life < FADE_AFTER ? 1 : 1 - (life - FADE_AFTER) / (1 - FADE_AFTER);
      // The pet walks to the right edge before it peeks, which is exactly when
      // it gets clicked, so the bubble has to be kept inside the viewport.
      const wantX = petX + petSize - dimension / 2;
      const x = Math.max(0, Math.min(window.innerWidth - dimension, wantX));
      // `TAIL_TIP_ROW` lands the tail on the pet's head instead of floating free.
      const y = Math.max(0, petY - dimension + (BUBBLE_SIZE - TAIL_TIP_ROW) * scale - rise);

      canvas.style.left = `${x}px`;
      canvas.style.top = `${y}px`;
      canvas.style.opacity = String(fade);

      const index = Math.floor(ageMs / (1000 / BEAT_FPS)) % FRAMES.length;
      const frame = FRAMES[index];

      if (frame !== undefined) {
        drawFrame(ctx, frame, scale);
      }

      return true;
    },

    destroy() {
      canvas.remove();
    },
  };
}
