import type { PetDefinition, SpriteFrame } from '../types.js';
import { buildFrame, mirrorFrameH, offsetFrame } from './sprite-utils.js';

// Ariel: black cat, green eyes
const P = {
  _: null,
  B: '#111111', // black body
  b: '#222222', // shadow / soft black
  G: '#33dd55', // green eye
  g: '#119933', // eye shadow
  W: '#ffffff', // white highlight / whisker
  p: '#ff7799', // pink nose
  y: '#ffe0cc', // inner ear
  H: '#ff4488', // heart color
} as const;

type K = keyof typeof P;
const _ = '_' as K,
  B = 'B' as K,
  b = 'b' as K,
  G = 'G' as K,
  g = 'g' as K,
  W = 'W' as K,
  p = 'p' as K,
  y = 'y' as K,
  H = 'H' as K;

function f(rows: K[][]): SpriteFrame {
  return buildFrame(P, rows);
}

// ─── IDLE (front-facing, chibi style like reference) ──────────────────────
const IDLE_1: K[][] = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, _, _, _, _, _, _, _, _, _, _, B, B, _, _, _, _, _, _, _, _], // ears top
  [_, _, _, _, _, _, _, _, B, y, B, _, _, _, _, _, _, _, _, B, y, B, _, _, _, _, _, _, _, _], // ear inner
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _], // head top
  [_, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _], // head wide
  [_, _, _, _, _, _, _, B, B, G, G, B, B, B, B, B, B, G, G, B, B, B, B, _, _, _, _, _, _, _], // eyes top
  [_, _, _, _, _, _, _, B, B, G, g, B, B, B, B, B, B, G, g, B, B, B, B, _, _, _, _, _, _, _], // eyes bot
  [_, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, B, W, B, B, B, B, B, p, B, B, B, B, W, B, B, B, _, _, _, _, _, _, _], // nose+whiskers
  [_, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _], // chin/neck
  [_, _, _, _, _, _, _, _, B, W, W, W, W, W, W, W, W, W, W, W, W, B, _, _, _, _, _, _, _, _], // chest white
  [_, _, _, _, _, _, _, _, B, W, W, W, W, W, W, W, W, W, W, W, W, B, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _], // body
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, b, b, b, _, _, _, _, _], // tail
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, b, _, b, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, b, b, b, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, _, _, _, _, _, _, _, B, B, B, _, _, _, _, _, _, _, _, _], // legs
  [_, _, _, _, _, _, _, _, B, B, B, _, _, _, _, _, _, _, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, b, b, b, _, _, _, _, _, _, _, b, b, b, _, _, _, _, _, _, _, _, _], // paws
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];
// Idle frame 2: tail shifts 1px (breathing/idle variation)
const IDLE_2: K[][] = IDLE_1.map((row, i) => {
  if (i === 16) {
    return [
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
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      _,
      b,
      b,
      b,
      _,
      _,
      _,
      _,
    ];
  }

  if (i === 17) {
    return [
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
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      _,
      b,
      _,
      b,
      _,
      _,
      _,
      _,
    ];
  }

  if (i === 18) {
    return [
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
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      B,
      _,
      b,
      b,
      b,
      _,
      _,
      _,
      _,
    ];
  }

  return row;
});
// ─── WALK RIGHT (side profile, facing right) ─────────────────────────────
// Head at right, body left, tail far left
const WALK_R1: K[][] = [
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, B, B, _, B, B, _, _, _, _, _, _, _, _, _, _, _], // two ears
  [_, _, _, _, _, _, _, _, _, _, _, _, _, B, y, B, _, B, y, B, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _], // head top
  [_, _, _, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _], // head
  [_, _, _, _, _, _, _, _, _, _, _, _, B, B, G, G, B, G, G, B, B, B, _, _, _, _, _, _, _, _], // eyes (2 visible)
  [_, _, _, _, _, _, _, _, _, _, _, _, B, B, G, g, B, G, g, B, B, B, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, B, B, B, B, p, B, B, B, B, B, _, _, _, _, _, _, _, _], // nose
  [_, _, _, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _], // neck+body start
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _], // body
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, b, b, b, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _], // tail
  [_, _, _, b, _, b, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, b, b, b, _, _, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, b, B, B, _, _, _, _, _, _, _, _, B, B, b, _, _, _, _, _, _, _, _, _], // legs spread
  [_, _, _, _, _, _, _, b, B, _, _, _, _, _, _, _, _, _, _, B, b, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, b, b, _, _, _, _, _, _, _, _, _, _, b, b, _, _, _, _, _, _, _, _, _], // paws
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];
// Walk frame 2: legs in opposite position
const WALK_R2: K[][] = WALK_R1.map((row, i) => {
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
      B,
      B,
      b,
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
      b,
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
      b,
      b,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      _,
      b,
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
      _,
    ];
  }

  return row;
});
const WALK_R3 = WALK_R1;
const WALK_R4 = WALK_R2;
// Walk-left = mirror of walk-right
const WALK_L1 = mirrorFrameH(f(WALK_R1));
const WALK_L2 = mirrorFrameH(f(WALK_R2));
// Walk up/down: slight vertical shifts of idle
const WALK_U1 = offsetFrame(f(IDLE_1), -1);
const WALK_U2 = offsetFrame(f(IDLE_2), -2);
const WALK_D1 = offsetFrame(f(IDLE_1), 1);
const WALK_D2 = offsetFrame(f(IDLE_2), 2);
// Peek: front-facing (same as idle) — cat is at right edge looking at user
const PEEK_1 = f(IDLE_1);
const PEEK_2 = f(IDLE_2);
// Jump: arc upward
const JUMP_1 = offsetFrame(f(WALK_R1), -3);
const JUMP_2 = offsetFrame(f(WALK_R1), -6);
const JUMP_3 = offsetFrame(f(WALK_R1), -8);
const JUMP_4 = offsetFrame(f(WALK_R1), -5);
const JUMP_5 = offsetFrame(f(WALK_R1), -2);
const JUMP_6 = f(IDLE_1);
// Heart overlay: pixel-art heart centered in 30x30
const EMPTY: K = _;
const HEART_FRAME: K[][] = Array.from({ length: 30 }, (_el, i): K[] => {
  const row = Array<K>(30).fill(EMPTY);

  if (i === 8) {
    row[11] = H;
    row[12] = H;
    row[15] = H;
    row[16] = H;
    row[17] = H;
    row[18] = H;
  }

  if (i === 9) {
    for (let c = 10; c <= 19; c++) {
      row[c] = H;
    }
  }

  if (i === 10) {
    for (let c = 10; c <= 19; c++) {
      row[c] = H;
    }
  }

  if (i === 11) {
    for (let c = 11; c <= 18; c++) {
      row[c] = H;
    }
  }

  if (i === 12) {
    for (let c = 12; c <= 17; c++) {
      row[c] = H;
    }
  }

  if (i === 13) {
    for (let c = 13; c <= 16; c++) {
      row[c] = H;
    }
  }

  if (i === 14) {
    row[14] = H;
    row[15] = H;
  }

  return row;
});

export const arielDefinition: PetDefinition = {
  id: 'ariel',
  clips: {
    idle: { frames: [f(IDLE_1), f(IDLE_2)], fps: 2, loop: true },
    'walk-right': { frames: [f(WALK_R1), f(WALK_R2), f(WALK_R3), f(WALK_R4)], fps: 8, loop: true },
    'walk-left': { frames: [WALK_L1, WALK_L2, WALK_L1, WALK_L2], fps: 8, loop: true },
    'walk-up': { frames: [WALK_U1, WALK_U2], fps: 4, loop: true },
    'walk-down': { frames: [WALK_D1, WALK_D2], fps: 4, loop: true },
    peek: { frames: [PEEK_1, PEEK_2], fps: 2, loop: true },
    jump: { frames: [JUMP_1, JUMP_2, JUMP_3, JUMP_4, JUMP_5, JUMP_6], fps: 10, loop: false },
    heart: { frames: [f(HEART_FRAME)], fps: 1, loop: false },
  },
};
