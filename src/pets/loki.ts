import type { AnimationClip, PetDefinition, SpriteFrame } from '../types.js';
import { thorDefinition } from './thor.js';

// Loki: French Bulldog, blue pied + white chest
// Thor already has a white chest strip — for Loki we extend it more prominently
// by adding extra white pixels to the belly/chest area

function addExtraChest(frame: SpriteFrame): SpriteFrame {
  return frame.map((row, rowIdx) => {
    // Extend white chest to cover more of the front
    if (rowIdx < 13 || rowIdx > 20) {
      return row;
    }

    return row.map((px, colIdx) => {
      if (colIdx >= 11 && colIdx <= 19 && (rowIdx === 14 || rowIdx === 15 || rowIdx === 16)) {
        // already white in thor, just ensure consistency
        return '#f0f0f0';
      }

      return px;
    });
  });
}

function enhanceClip(clip: AnimationClip): AnimationClip {
  return { ...clip, frames: clip.frames.map(addExtraChest) };
}

const base = thorDefinition.clips;

export const lokiDefinition: PetDefinition = {
  id: 'loki',
  clips: {
    idle: enhanceClip(base.idle),
    'walk-right': enhanceClip(base['walk-right']),
    'walk-left': enhanceClip(base['walk-left']),
    'walk-up': enhanceClip(base['walk-up']),
    'walk-down': enhanceClip(base['walk-down']),
    peek: enhanceClip(base.peek),
    jump: enhanceClip(base.jump),
    heart: base.heart,
  },
};
