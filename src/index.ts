import { pickNextBehavior, Scheduler } from './animations/scheduler.js';
import { buildTransitions, StateMachine } from './animations/state-machine.js';
import { PET_REGISTRY } from './pets/index.js';
import type { AnimationState, BehaviorState, BichitoConfig, SpriteFrame } from './types.js';

const DEFAULT_PET = 'ariel' as const;
const DEFAULT_SIZE = 30;
const SPEED_PX = 1.5;

function renderFrame(ctx: CanvasRenderingContext2D, frame: SpriteFrame, size: number): void {
  const scale = size / 30;

  ctx.clearRect(0, 0, size, size);

  // `entries()` yields defined values, so transparency is the only case to skip.
  for (const [row, rowData] of frame.entries()) {
    for (const [col, color] of rowData.entries()) {
      if (color === null) {
        continue;
      }

      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(col * scale),
        Math.round(row * scale),
        Math.ceil(scale),
        Math.ceil(scale),
      );
    }
  }
}

function clampPosition(x: number, y: number, size: number): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(window.innerWidth - size, x)),
    y: Math.max(0, Math.min(window.innerHeight - size, y)),
  };
}

export function bichito(config: BichitoConfig = {}): () => void {
  const petId = config.pet ?? DEFAULT_PET;
  const size = config.size ?? DEFAULT_SIZE;
  const container = config.container ?? document.body;
  const definition = PET_REGISTRY[petId];
  const transitions = buildTransitions(window.innerWidth, size);
  const sm = new StateMachine('idle', transitions);
  const scheduler = new Scheduler(3000 + Math.random() * 3000);

  // Current runtime state
  let state: BehaviorState = {
    animation: 'idle',
    x: Math.random() * (window.innerWidth - size),
    y: Math.random() * (window.innerHeight - size),
    direction: 1,
  };
  let frameIndex = 0;
  let frameAccMs = 0;
  /** Time spent in the current clip, used to drive one-shot clips to completion. */
  let clipElapsedMs = 0;
  let jumpOriginY = state.y;

  // Create canvas
  const canvas = document.createElement('canvas');

  canvas.width = size;
  canvas.height = size;
  canvas.style.cssText = [
    'position:fixed',
    `width:${size}px`,
    `height:${size}px`,
    'image-rendering:pixelated',
    'cursor:pointer',
    'z-index:2147483647',
    `left:${state.x}px`,
    `top:${state.y}px`,
  ].join(';');

  const ctx = canvas.getContext('2d');

  // Nothing has been mounted yet, so there is nothing to tear down.
  if (ctx === null) {
    return () => undefined;
  }

  function transitionTo(next: AnimationState): void {
    if (sm.canTransition(next, state)) {
      state = sm.send(next, state);
      frameIndex = 0;
      frameAccMs = 0;
      clipElapsedMs = 0;

      if (next === 'walk-left') {
        state = { ...state, direction: -1 };
      }

      if (next === 'walk-right') {
        state = { ...state, direction: 1 };
      }

      if (next === 'jump') {
        jumpOriginY = state.y;
      }
    }
  }

  canvas.addEventListener('click', () => {
    if (sm.state === 'peek') {
      transitionTo(Math.random() < 0.5 ? 'jump' : 'heart');
    } else {
      transitionTo('idle');
    }
  });

  container.appendChild(canvas);

  scheduler.start({
    onFrame(elapsed) {
      const clip = definition.clips[sm.state];
      const msPerFrame = 1000 / clip.fps;
      const clipDurationMs = clip.frames.length * msPerFrame;

      frameAccMs += elapsed;
      clipElapsedMs += elapsed;

      if (frameAccMs >= msPerFrame) {
        // Carry the remainder so playback keeps clip-accurate timing rather
        // than rounding down to the animation frame rate.
        frameAccMs -= msPerFrame;

        frameIndex = clip.loop
          ? (frameIndex + 1) % clip.frames.length
          : Math.min(frameIndex + 1, clip.frames.length - 1);
      }

      // Move based on animation state
      const cur = sm.state;

      if (cur === 'walk-right') {
        state = { ...state, x: state.x + SPEED_PX };

        if (state.x >= window.innerWidth - size) {
          transitionTo('peek');
        }
      } else if (cur === 'walk-left') {
        state = { ...state, x: state.x - SPEED_PX };

        if (state.x <= 0) {
          transitionTo('idle');
        }
      } else if (cur === 'walk-up') {
        state = { ...state, y: state.y - SPEED_PX };

        if (state.y <= 0) {
          transitionTo('idle');
        }
      } else if (cur === 'walk-down') {
        state = { ...state, y: state.y + SPEED_PX };

        if (state.y >= window.innerHeight - size) {
          transitionTo('idle');
        }
      } else if (cur === 'jump') {
        // Drive the arc off clip progress so the hop lands exactly when the
        // landing frame is drawn.
        const progress = Math.min(clipElapsedMs / clipDurationMs, 1);
        const arc = Math.sin(progress * Math.PI) * size * 1.5;

        state = { ...state, y: jumpOriginY - arc };
      }

      // One-shot clips return to idle once they have played through.
      if (!clip.loop && clipElapsedMs >= clipDurationMs) {
        transitionTo('idle');
      }

      const clamped = clampPosition(state.x, state.y, size);

      state = { ...state, ...clamped };

      canvas.style.left = `${state.x}px`;
      canvas.style.top = `${state.y}px`;

      const frame = clip.frames[frameIndex];

      if (frame !== undefined) {
        renderFrame(ctx, frame, size);
      }
    },

    onBehaviorTick() {
      if (sm.state === 'peek' || sm.state === 'jump' || sm.state === 'heart') {
        return;
      }

      const next = pickNextBehavior(sm.state);

      transitionTo(next);
    },
  });

  return () => {
    scheduler.stop();
    canvas.remove();
  };
}
