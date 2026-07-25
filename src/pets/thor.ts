import type { PetDefinition, PixelRow, SpriteFrame } from '../types.js';
import { buildFrame, mirrorFrameH, offsetFrame } from './sprite-utils.js';

// Thor: French Bulldog, blue pied (grey-blue + white patches)
const P = {
  _: null,
  B: '#5a6a7a', // blue-grey body
  b: '#3d4d5d', // darker blue shadow
  W: '#f0f0f0', // white patch
  w: '#d8d8d8', // white shadow
  N: '#2a1a0a', // dark nose
  E: '#3a2a1a', // dark eye
  r: '#cc4444', // tongue red
  p: '#ffaaaa', // inner ear pink
} as const;

type K = keyof typeof P;

function f(rows: K[][]): SpriteFrame {
  return buildFrame(P, rows);
}

const _ = '_' as K;
const B = 'B' as K;
const b = 'b' as K;
const W = 'W' as K;
const w = 'w' as K;
const N = 'N' as K;
const E = 'E' as K;
const r = 'r' as K;
const p = 'p' as K;
const IDLE_1: K[][] = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _, _, _, _, _, _, _, _], // bat ears
  [_, _, _, _, _, _, _, _, _, _, B, B, p, B, _, _, B, p, B, B, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _], // wide head
  [_, _, _, _, _, _, _, _, _, B, B, E, _, B, B, B, B, E, _, B, B, _, _, _, _, _, _, _, _, _], // eyes
  [_, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, B, W, W, W, W, B, B, W, W, W, W, B, _, _, _, _, _, _, _, _, _], // muzzle white
  [_, _, _, _, _, _, _, _, _, B, W, W, N, W, W, W, W, N, W, W, B, _, _, _, _, _, _, _, _, _], // nose
  [_, _, _, _, _, _, _, _, _, B, W, W, W, r, W, W, r, W, W, W, B, _, _, _, _, _, _, _, _, _], // tongue peek
  [_, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, W, W, W, W, W, W, W, W, W, W, W, W, _, _, _, _, _, _, _, _, _], // white chest
  [_, _, _, _, _, _, _, _, _, W, B, B, B, B, B, B, B, B, B, B, W, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, W, B, B, B, B, B, B, B, B, B, B, W, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, W, B, B, B, B, B, B, B, B, B, B, W, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, W, W, W, W, W, W, W, W, W, W, W, W, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _, _], // lower body
  [_, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, B, B, _, _, _, _, _, _, B, B, _, _, _, _, _, _, _, _, _, _], // short legs
  [_, _, _, _, _, _, _, _, _, _, W, W, _, _, _, _, _, _, W, W, _, _, _, _, _, _, _, _, _, _], // white paws
  [_, _, _, _, _, _, _, _, _, _, w, w, _, _, _, _, _, _, w, w, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];
const IDLE_2 = IDLE_1; // minimal animation for bulldogs
// Walk right: body tilted, legs alternating
const WALK_R1: K[][] = IDLE_1.map((row, i) => {
  if (i === 21) {
    return [
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      b,
      B,
      B,
      _,
      _,
      _,
      _,
      _,
      _,
      B,
      B,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
    ];
  }

  if (i === 22) {
    return [
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      b,
      W,
      W,
      _,
      _,
      _,
      _,
      _,
      _,
      W,
      W,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
    ];
  }

  if (i === 23) {
    return [
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      b,
      w,
      w,
      _,
      _,
      _,
      _,
      _,
      _,
      w,
      w,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
    ];
  }

  return row;
});
const WALK_R2: K[][] = IDLE_1.map((row, i) => {
  if (i === 21) {
    return [
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      B,
      B,
      _,
      _,
      _,
      _,
      _,
      _,
      B,
      B,
      b,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
    ];
  }

  if (i === 22) {
    return [
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      W,
      W,
      _,
      _,
      _,
      _,
      _,
      _,
      W,
      W,
      b,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
    ];
  }

  if (i === 23) {
    return [
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      w,
      w,
      _,
      _,
      _,
      _,
      _,
      _,
      w,
      w,
      b,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
    ];
  }

  return row;
});
const WALK_L1 = mirrorFrameH(f(WALK_R1));
const WALK_L2 = mirrorFrameH(f(WALK_R2));
const WALK_U1 = offsetFrame(f(IDLE_1), -1);
const WALK_U2 = offsetFrame(f(IDLE_1), -2);
const WALK_D1 = offsetFrame(f(IDLE_1), 1);
const WALK_D2 = offsetFrame(f(IDLE_1), 2);
const PEEK_1 = mirrorFrameH(f(WALK_R1));
const PEEK_2 = mirrorFrameH(f(WALK_R2));
const JUMP_1 = offsetFrame(f(WALK_R1), -3);
const JUMP_2 = offsetFrame(f(WALK_R1), -5);
const JUMP_3 = offsetFrame(f(WALK_R1), -3);
const JUMP_4 = offsetFrame(f(WALK_R1), -1);
const JUMP_5 = f(WALK_R1);
const JUMP_6 = f(IDLE_1);
// Heart overlay (same structure as ariel)
const H = 'B' as K;
const HEART_BASE: K[][] = Array(30)
  .fill(null)
  .map((_, i): K[] => {
    const row30 = Array(30).fill('_') as K[];

    if (i === 8) {
      row30[12] = H;
      row30[13] = H;
      row30[16] = H;
      row30[17] = H;
    }

    if (i === 9) {
      for (let c = 11; c <= 18; c++) {
        row30[c] = H;
      }
    }

    if (i === 10) {
      for (let c = 11; c <= 18; c++) {
        row30[c] = H;
      }
    }

    if (i === 11) {
      for (let c = 12; c <= 17; c++) {
        row30[c] = H;
      }
    }

    if (i === 12) {
      for (let c = 13; c <= 16; c++) {
        row30[c] = H;
      }
    }

    if (i === 13) {
      row30[14] = H;
      row30[15] = H;
    }

    return row30;
  });

export const thorDefinition: PetDefinition = {
  id: 'thor',
  clips: {
    idle: { frames: [f(IDLE_1), f(IDLE_2)], fps: 2, loop: true },
    'walk-right': { frames: [f(WALK_R1), f(WALK_R2), f(WALK_R1), f(WALK_R2)], fps: 7, loop: true },
    'walk-left': { frames: [WALK_L1, WALK_L2, WALK_L1, WALK_L2], fps: 7, loop: true },
    'walk-up': { frames: [WALK_U1, WALK_U2], fps: 4, loop: true },
    'walk-down': { frames: [WALK_D1, WALK_D2], fps: 4, loop: true },
    peek: { frames: [PEEK_1, PEEK_2], fps: 3, loop: true },
    jump: { frames: [JUMP_1, JUMP_2, JUMP_3, JUMP_4, JUMP_5, JUMP_6], fps: 10, loop: false },
    heart: { frames: [f(HEART_BASE)], fps: 1, loop: false },
  },
};
