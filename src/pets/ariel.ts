import type { PetDefinition, SpriteFrame } from '../types.js'
import { buildFrame, mirrorFrameH, offsetFrame } from './sprite-utils.js'

// Ariel: black cat, green eyes
const P = {
  _: null,
  B: '#111111', // black body
  b: '#1a1a1a', // soft black fur
  G: '#22cc44', // green eye
  g: '#119933', // dark green eye shadow
  W: '#ffffff', // white whisker / highlight
  p: '#ff9999', // pink nose
  y: '#ffeecc', // inner ear
} as const

type K = keyof typeof P

function f(rows: K[][]): SpriteFrame {
  return buildFrame(P, rows)
}

const _ = '_' as K
const B = 'B' as K
const b = 'b' as K
const G = 'G' as K
const g = 'g' as K
const W = 'W' as K
const p = 'p' as K
const y = 'y' as K

// 30-wide row helpers — cat body occupies center columns
const row = (...cells: K[]): K[] => cells

// Idle frame 1 — sitting cat facing right
const IDLE_1: K[][] = [
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,B,_,_,_,B,B,_,_,_,_,_,_,_,_,_,_,_), // ears
  row(_,_,_,_,_,_,_,_,_,_,_,B,B,y,B,_,B,y,B,B,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_,_), // head top
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,G,g,B,B,B,G,g,B,B,_,_,_,_,_,_,_,_,_), // eyes
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,W,B,p,B,B,W,B,B,B,_,_,_,_,_,_,_,_,_), // nose/whiskers
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_,_), // neck
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_,_), // body
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,b,b,b,b,b,_,_,_,_), // tail
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,b,_,_,_,b,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,b,b,b,b,B,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,b,B,B,B,B,B,B,B,b,_,_,_,_,_,_,_,_,_,_,_), // feet
  row(_,_,_,_,_,_,_,_,_,_,b,B,B,B,B,B,B,B,b,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,b,b,B,B,B,B,B,b,b,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
]

// Idle frame 2 — slight breathing (tail shifts one pixel)
const IDLE_2: K[][] = IDLE_1.map((r, i) =>
  i === 19 ? row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,b,b,b,b,b,b,_,_,_,_)
  : i === 20 ? row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,b,_,_,_,_,b,_,_,_,_)
  : i === 21 ? row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,b,b,b,b,b,B,_,_,_,_)
  : r
)

// Walk-right frame 1
const WALK_R1: K[][] = [
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,_,B,B,_,_,_,_,_,_,_,_,_,_,_,_), // ears tilted
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,B,y,B,B,y,B,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,G,g,B,B,G,g,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,W,B,p,B,W,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_,_), // body lean fwd
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,b,b,b,b,_,_,_,_,_), // tail back
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,b,_,_,_,b,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,B,B,B,B,B,B,B,B,B,B,b,b,b,b,B,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,b,B,B,_,_,_,_,_,_,B,B,b,_,_,_,_,_,_,_,_,_), // legs spread
  row(_,_,_,_,_,_,_,_,_,b,B,_,_,_,_,_,_,_,_,B,b,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,b,b,_,_,_,_,_,_,_,_,b,b,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
  row(_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_),
]

const WALK_R2: K[][] = WALK_R1.map((r, i) => {
  if (i === 21) return row(_,_,_,_,_,_,_,_,_,_,B,B,b,_,_,_,_,b,B,B,_,_,_,_,_,_,_,_,_,_)
  if (i === 22) return row(_,_,_,_,_,_,_,_,_,_,B,b,_,_,_,_,_,_,b,B,_,_,_,_,_,_,_,_,_,_)
  if (i === 23) return row(_,_,_,_,_,_,_,_,_,_,b,b,_,_,_,_,_,_,b,b,_,_,_,_,_,_,_,_,_,_)
  return r
})

const WALK_R3 = WALK_R1
const WALK_R4 = WALK_R2

// Walk-left = mirror of walk-right frames
const WALK_L1 = mirrorFrameH(f(WALK_R1))
const WALK_L2 = mirrorFrameH(f(WALK_R2))

// Walk-up/down: use idle offset by 1px
const WALK_U1 = offsetFrame(f(IDLE_1), -1)
const WALK_U2 = offsetFrame(f(IDLE_2), -2)
const WALK_D1 = offsetFrame(f(IDLE_1), 1)
const WALK_D2 = offsetFrame(f(IDLE_2), 2)

// Peek: cat at right edge looking left (mirror of walk-right frame)
const PEEK_1 = mirrorFrameH(f(WALK_R1))
const PEEK_2 = mirrorFrameH(f(WALK_R2))

// Jump: cat leaping (body lifted)
const JUMP_1 = offsetFrame(f(WALK_R1), -4)
const JUMP_2 = offsetFrame(f(WALK_R1), -6)
const JUMP_3 = offsetFrame(f(WALK_R1), -4)
const JUMP_4 = offsetFrame(f(WALK_R1), -2)
const JUMP_5 = f(WALK_R1)
const JUMP_6 = f(IDLE_1)

// Heart: small 30x30 frame with pixel-art heart (centered)
const H = 'B' as K  // reuse body color for heart fill
const HEART_BASE: K[][] = Array(30).fill(null).map((_, i): K[] => {
  const row30 = Array(30).fill('_') as K[]
  if (i === 8) { row30[12]=H; row30[13]=H; row30[16]=H; row30[17]=H }
  if (i === 9) { for(let c=11;c<=18;c++) row30[c]=H }
  if (i === 10) { for(let c=11;c<=18;c++) row30[c]=H }
  if (i === 11) { for(let c=12;c<=17;c++) row30[c]=H }
  if (i === 12) { for(let c=13;c<=16;c++) row30[c]=H }
  if (i === 13) { row30[14]=H; row30[15]=H }
  return row30
})

export const arielDefinition: PetDefinition = {
  id: 'ariel',
  clips: {
    idle: { frames: [f(IDLE_1), f(IDLE_2)], fps: 2, loop: true },
    'walk-right': { frames: [f(WALK_R1), f(WALK_R2), f(WALK_R3), f(WALK_R4)], fps: 8, loop: true },
    'walk-left': { frames: [WALK_L1, WALK_L2, WALK_L1, WALK_L2], fps: 8, loop: true },
    'walk-up': { frames: [WALK_U1, WALK_U2], fps: 4, loop: true },
    'walk-down': { frames: [WALK_D1, WALK_D2], fps: 4, loop: true },
    peek: { frames: [PEEK_1, PEEK_2], fps: 3, loop: true },
    jump: { frames: [JUMP_1, JUMP_2, JUMP_3, JUMP_4, JUMP_5, JUMP_6], fps: 10, loop: false },
    heart: { frames: [f(HEART_BASE)], fps: 1, loop: false },
  },
}
