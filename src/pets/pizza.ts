import type { PetDefinition, AnimationClip, SpriteFrame } from '../types.js'
import { thorDefinition } from './thor.js'

// Pizza: French Bulldog, blue merle pied
// Blue merle = irregular darker patches over the blue-grey base

const MERLE_PATCH_COLOR = '#2a3a4a' // darker merle spots

function addMerlePattern(frame: SpriteFrame): SpriteFrame {
  return frame.map((row, rowIdx) =>
    row.map((px, colIdx) => {
      if (px === null || px === '#f0f0f0' || px === '#d8d8d8') return px
      // Irregular merle pattern based on position checksum
      const isDarkPatch =
        (rowIdx * 3 + colIdx * 7) % 11 < 3 &&
        px === '#5a6a7a'
      return isDarkPatch ? MERLE_PATCH_COLOR : px
    }),
  )
}

function enhanceClip(clip: AnimationClip): AnimationClip {
  return { ...clip, frames: clip.frames.map(addMerlePattern) }
}

const base = thorDefinition.clips

export const pizzaDefinition: PetDefinition = {
  id: 'pizza',
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
}
