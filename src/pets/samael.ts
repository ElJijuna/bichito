import type { PetDefinition, AnimationClip, SpriteFrame } from '../types.js'
import { arielDefinition } from './ariel.js'

// Samael: white cat, light blue eyes
const COLOR_MAP: Record<string, string> = {
  '#111111': '#e8e8e8', // black → white
  '#1a1a1a': '#cccccc', // soft black → light gray
  '#22cc44': '#44bbff', // green eye → light blue
  '#119933': '#2288cc', // eye shadow → darker blue
}

function remapFrame(frame: SpriteFrame): SpriteFrame {
  return frame.map((row) =>
    row.map((px) => {
      if (px === null) return null
      return COLOR_MAP[px] ?? px
    }),
  )
}

function remapClip(clip: AnimationClip): AnimationClip {
  return { ...clip, frames: clip.frames.map(remapFrame) }
}

const base = arielDefinition.clips

export const samaelDefinition: PetDefinition = {
  id: 'samael',
  clips: {
    idle: remapClip(base.idle),
    'walk-right': remapClip(base['walk-right']),
    'walk-left': remapClip(base['walk-left']),
    'walk-up': remapClip(base['walk-up']),
    'walk-down': remapClip(base['walk-down']),
    peek: remapClip(base.peek),
    jump: remapClip(base.jump),
    heart: remapClip(base.heart),
  },
}
