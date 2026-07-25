import { describe, expect, it } from 'vitest';
import { PET_REGISTRY } from '../src/pets/index.js';
import type { AnimationState, PetId, SpriteFrame } from '../src/types.js';

/** Collapses a frame to a comparable string so frames can be de-duplicated. */
const fingerprint = (frame: SpriteFrame): string =>
  frame.map((row) => row.map((px) => px ?? '.').join(',')).join('|');
const ALL_STATES: AnimationState[] = [
  'idle',
  'walk-left',
  'walk-right',
  'walk-up',
  'walk-down',
  'peek',
  'jump',
  'heart',
];
const PET_IDS: PetId[] = ['ariel', 'cain', 'samael', 'thor', 'loki', 'pizza'];
const CSS_HEX = /^#[0-9a-f]{3,8}$/i;

describe('PET_REGISTRY', () => {
  it('contains all 6 pets', () => {
    for (const id of PET_IDS) {
      expect(PET_REGISTRY[id]).toBeDefined();
      expect(PET_REGISTRY[id].id).toBe(id);
    }
  });

  for (const id of PET_IDS) {
    describe(`${id}`, () => {
      const def = PET_REGISTRY[id];

      it('has all 8 AnimationState clips', () => {
        for (const state of ALL_STATES) {
          expect(def.clips[state], `missing clip: ${state}`).toBeDefined();
        }
      });

      it('every clip has at least 1 frame', () => {
        for (const state of ALL_STATES) {
          expect(def.clips[state].frames.length).toBeGreaterThan(0);
        }
      });

      it('every clip has a positive fps', () => {
        for (const state of ALL_STATES) {
          expect(def.clips[state].fps).toBeGreaterThan(0);
        }
      });

      it('every frame is a 30-row array', () => {
        for (const state of ALL_STATES) {
          for (const frame of def.clips[state].frames) {
            expect(frame.length).toBe(30);
          }
        }
      });

      it('every row has 30 columns', () => {
        for (const state of ALL_STATES) {
          for (const frame of def.clips[state].frames) {
            for (const row of frame) {
              expect(row.length).toBe(30);
            }
          }
        }
      });

      it('all non-null pixel values are valid CSS hex colors', () => {
        for (const state of ALL_STATES) {
          for (const frame of def.clips[state].frames) {
            for (const row of frame) {
              for (const px of row) {
                if (px !== null) {
                  expect(px, `invalid color: ${px}`).toMatch(CSS_HEX);
                }
              }
            }
          }
        }
      });

      it('every multi-frame clip actually animates', () => {
        for (const state of ALL_STATES) {
          const { frames } = def.clips[state];

          if (frames.length < 2) {
            continue;
          }

          const unique = new Set(frames.map(fingerprint));

          expect(unique.size, `${state} renders as a still image`).toBeGreaterThan(1);
        }
      });

      it('walk cycles move the legs on every key frame', () => {
        for (const state of ['walk-left', 'walk-right'] as const) {
          const { frames } = def.clips[state];
          const unique = new Set(frames.map(fingerprint));

          expect(unique.size, `${state} repeats key frames`).toBe(frames.length);
        }
      });

      it('draws something in every frame', () => {
        for (const state of ALL_STATES) {
          for (const [i, frame] of def.clips[state].frames.entries()) {
            const painted = frame.flat().filter((px) => px !== null).length;

            expect(painted, `${state} frame ${i} is blank`).toBeGreaterThan(100);
          }
        }
      });

      it('keeps the pet on screen during the heart reaction', () => {
        // The heart used to replace the pet entirely, leaving a bare heart.
        const heartPink = '#ff4d80';

        for (const frame of def.clips.heart.frames) {
          const colors = frame.flat().filter((px): px is string => px !== null);
          const nonHeart = colors.filter((px) => px !== heartPink);

          expect(nonHeart.length).toBeGreaterThan(100);
        }
      });
    });
  }

  /** First idle frame of a pet, which every pet is guaranteed to have. */
  const idleFrame = (id: PetId): SpriteFrame => {
    const [frame] = PET_REGISTRY[id].clips.idle.frames;

    if (frame === undefined) {
      throw new Error(`${id} has no idle frames`);
    }

    return frame;
  };

  it('gives every pet visually distinct art', () => {
    const idles = PET_IDS.map((id) => fingerprint(idleFrame(id)));

    expect(new Set(idles).size).toBe(PET_IDS.length);
  });

  it('draws cats and dogs as different silhouettes', () => {
    const shape = (id: PetId): string =>
      idleFrame(id)
        .map((row) => row.map((px) => (px === null ? '.' : '#')).join(''))
        .join('|');

    expect(shape('ariel')).not.toBe(shape('thor'));
    // Same species shares a silhouette; only the coat differs.
    expect(shape('ariel')).toBe(shape('samael'));
    expect(shape('thor')).toBe(shape('pizza'));
  });
});
