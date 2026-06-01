import type { PetDefinition } from '../types.js'
import { mirrorFrameH, offsetFrame } from './sprite-utils.js'
import { arielDefinition } from './ariel.js'

// Cain: yellow tabby, white right paw + chest, yellow eyes
// Strategy: reuse ariel's frame geometry, remap colors via canvas filter at render time.
// Here we override the palette by transforming each frame pixel-by-pixel.

const COLOR_MAP: Record<string, string> = {
  '#111111': '#c8860a', // black body → yellow-orange
  '#1a1a1a': '#a06000', // soft black → darker amber
  '#22cc44': '#ffcc00', // green eye → yellow eye
  '#119933': '#cc9900', // eye shadow → dark yellow
  // white/pink/inner-ear stay the same
}

function remapFrame(frame: import('../types.js').SpriteFrame): import('../types.js').SpriteFrame {
  return frame.map((row) =>
    row.map((px) => {
      if (px === null) return null
      return COLOR_MAP[px] ?? px
    }),
  )
}

function remapClip(clip: import('../types.js').AnimationClip): import('../types.js').AnimationClip {
  return { ...clip, frames: clip.frames.map(remapFrame) }
}

// White right paw: paint bottom-right leg pixels white on walk-right frames
function addWhitePaw(frame: import('../types.js').SpriteFrame): import('../types.js').SpriteFrame {
  return frame.map((row, rowIdx) => {
    if (rowIdx < 21 || rowIdx > 23) return row
    return row.map((px, colIdx) => {
      if (colIdx >= 18 && colIdx <= 20 && px !== null) return '#ffffff'
      return px
    })
  })
}

// White chest: rows 14-18, cols 13-17
function addWhiteChest(frame: import('../types.js').SpriteFrame): import('../types.js').SpriteFrame {
  return frame.map((row, rowIdx) => {
    if (rowIdx < 14 || rowIdx > 18) return row
    return row.map((px, colIdx) => {
      if (colIdx >= 13 && colIdx <= 17 && px !== null) return '#ffffff'
      return px
    })
  })
}

// Tiger stripes: add darker stripes every 3 rows on body area
function addStripes(frame: import('../types.js').SpriteFrame): import('../types.js').SpriteFrame {
  return frame.map((row, rowIdx) => {
    if (rowIdx % 3 !== 0 || rowIdx < 13 || rowIdx > 20) return row
    return row.map((px) => {
      if (px === '#c8860a') return '#7a4800'
      return px
    })
  })
}

function enhanceFrame(frame: import('../types.js').SpriteFrame): import('../types.js').SpriteFrame {
  return addStripes(addWhiteChest(addWhitePaw(remapFrame(frame))))
}

function enhanceClip(clip: import('../types.js').AnimationClip): import('../types.js').AnimationClip {
  return { ...clip, frames: clip.frames.map(enhanceFrame) }
}

const base = arielDefinition.clips

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
    heart: remapClip(base.heart),
  },
}
