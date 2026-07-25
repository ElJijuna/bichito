import type { AnimationClip, AnimationState, SpriteFrame } from '../types.js';
import type { SpeciesColors } from './species-palette.js';
import { toPalette } from './species-palette.js';
import {
  mirrorFrameH,
  offsetFrame,
  offsetFrameX,
  overlayFrame,
  type Palette,
  parseFrame,
} from './sprite-utils.js';

/**
 * The poses every species authors. Clips are assembled from these, so adding a
 * species means drawing eleven pictures rather than writing animation code.
 */
export interface PoseSet {
  /** Resting, facing the viewer. */
  front: string[];
  /** Front pose with eyes closed. */
  frontBlink: string[];
  /** Front pose looking pleased. */
  frontHappy: string[];
  /** Side profile facing right — four keys of a walk cycle. */
  sideA: string[];
  sideB: string[];
  sideC: string[];
  sideD: string[];
  /** Seen from behind. */
  back: string[];
  /** Leaning in over an edge. */
  peek: string[];
  /** Crouched, gathering for a jump. */
  crouch: string[];
  /** Stretched at the top of a jump. */
  stretch: string[];
}

/** A per-pixel coat marking, applied to every frame of every clip. */
export type Marking = (color: string, x: number, y: number) => string;

/**
 * Paints breed markings over already-built clips.
 *
 * Markings run per pixel rather than per pose so a pet only describes what makes
 * it different — stripes, a blaze, merle patches — instead of redrawing the art.
 */
export function applyMarkings(
  clips: Record<AnimationState, AnimationClip>,
  marking: Marking,
): Record<AnimationState, AnimationClip> {
  const paint = (f: SpriteFrame): SpriteFrame =>
    f.map((row, y) => row.map((px, x) => (px === null ? null : marking(px, x, y))));

  return Object.fromEntries(
    Object.entries(clips).map(([state, clip]) => [
      state,
      { ...clip, frames: clip.frames.map(paint) },
    ]),
  ) as Record<AnimationState, AnimationClip>;
}

/** Heart drawn in the top-right corner, clear of the pet's face. */
const HEART_ART = [
  '..............................',
  '..............................',
  '.......................hh.hh..',
  '......................hhhhhhh.',
  '......................hhhhhhh.',
  '......................hhhhhhh.',
  '.......................hhhhh..',
  '........................hhh...',
  '.........................h....',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
  '..............................',
];
const HEART_PALETTE: Palette = { h: '#ff4d80' };

/**
 * Assembles the eight animation clips for a species.
 *
 * Every looping clip gets frames that actually differ — walk cycles move legs
 * and bob the body, idle breathes and blinks — so no state renders as a still
 * image.
 */
export function buildClips(
  poses: PoseSet,
  colors: SpeciesColors,
): Record<AnimationState, AnimationClip> {
  const palette = toPalette(colors);
  const frame = (rows: string[]): SpriteFrame => parseFrame(palette, rows);
  const front = frame(poses.front);
  const frontBlink = frame(poses.frontBlink);
  const frontHappy = frame(poses.frontHappy);
  const back = frame(poses.back);
  const peek = frame(poses.peek);
  const crouch = frame(poses.crouch);
  const stretch = frame(poses.stretch);
  const walkRight = [poses.sideA, poses.sideB, poses.sideC, poses.sideD].map(frame);
  const walkLeft = walkRight.map(mirrorFrameH);
  const heart = parseFrame(HEART_PALETTE, HEART_ART);
  const withHeart = (dy: number): SpriteFrame => overlayFrame(frontHappy, offsetFrame(heart, dy));
  /** A four-beat waddle: bob down, sway right, bob down, sway left. */
  const waddle = (pose: SpriteFrame): SpriteFrame[] => [
    pose,
    offsetFrameX(offsetFrame(pose, 1), 1),
    pose,
    offsetFrameX(offsetFrame(pose, 1), -1),
  ];

  return {
    // Breathe, breathe, blink — a still pet looks broken, so idle always moves.
    idle: {
      frames: [front, offsetFrame(front, 1), front, frontBlink],
      fps: 3,
      loop: true,
    },
    'walk-right': { frames: walkRight, fps: 8, loop: true },
    'walk-left': { frames: walkLeft, fps: 8, loop: true },
    'walk-up': { frames: waddle(back), fps: 6, loop: true },
    'walk-down': { frames: waddle(front), fps: 6, loop: true },
    peek: {
      frames: [peek, offsetFrame(peek, 1), peek, offsetFrame(peek, -1)],
      fps: 4,
      loop: true,
    },
    // Anticipate, launch, hang, fall, land, recover.
    jump: {
      frames: [
        crouch,
        offsetFrame(stretch, 2),
        offsetFrame(stretch, -2),
        offsetFrame(stretch, -1),
        stretch,
        crouch,
        front,
      ],
      fps: 12,
      loop: false,
    },
    // The pet stays on screen — earlier versions replaced it with a bare heart.
    heart: {
      frames: [frontHappy, withHeart(2), withHeart(0), withHeart(-2), withHeart(-4), withHeart(-6)],
      fps: 6,
      loop: false,
    },
  };
}
