import type { AnimationClip, PetDefinition, SpriteFrame } from '../types.js';
import { arielDefinition } from './ariel.js';

// Cain: yellow tabby, white right paw + chest, yellow eyes
// Body: #c8860a (amber-yellow), stripes: #7a4800 (dark amber)
// Eyes: yellow (#ffcc00), inner ear stays pink

const BODY_MAP: Record<string, string> = {
  '#111111': '#c8860a', // black → amber yellow
  '#222222': '#7a4800', // shadow → dark amber
  '#33dd55': '#ffcc00', // green eye → yellow eye
  '#119933': '#cc9900', // eye shadow → dark yellow
};

function remapFrame(frame: SpriteFrame): SpriteFrame {
  return frame.map((row) =>
    row.map((px) => {
      if (px === null) {
        return null;
      }

      return BODY_MAP[px] ?? px;
    }),
  );
}

// Tiger stripes: darken every 3rd body row
function addStripes(frame: SpriteFrame): SpriteFrame {
  return frame.map((row, rowIdx) => {
    if (rowIdx < 12 || rowIdx > 20 || rowIdx % 3 !== 0) {
      return row;
    }

    return row.map((px) => (px === '#c8860a' ? '#7a4800' : px));
  });
}

// White chest: rows 13-14 keep the white from ariel (already W=#ffffff)
// White right paw: bottom-right leg area (rows 21-23, cols 18-20)
function addWhitePaw(frame: SpriteFrame): SpriteFrame {
  return frame.map((row, rowIdx) => {
    if (rowIdx < 21 || rowIdx > 23) {
      return row;
    }

    return row.map((px, colIdx) => {
      if (colIdx >= 18 && colIdx <= 20 && px !== null) {
        return '#ffffff';
      }

      return px;
    });
  });
}

function enhanceFrame(frame: SpriteFrame): SpriteFrame {
  return addWhitePaw(addStripes(remapFrame(frame)));
}

function enhanceClip(clip: AnimationClip): AnimationClip {
  return { ...clip, frames: clip.frames.map(enhanceFrame) };
}

const base = arielDefinition.clips;

export const cainDefinition: PetDefinition = {
  id: 'cain',
  clips: {
    idle: enhanceClip(base.idle),
    'walk-right': enhanceClip(base['walk-right']),
    'walk-left': enhanceClip(base['walk-left']),
    'walk-up': enhanceClip(base['walk-up']),
    'walk-down': enhanceClip(base['walk-down']),
    peek: enhanceClip(base.peek),
    jump: enhanceClip(base.jump),
    heart: { ...base.heart, frames: base.heart.frames.map(remapFrame) },
  },
};
