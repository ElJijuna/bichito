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

  for (let row = 0; row < frame.length; row++) {
    const rowData = frame[row];

    if (rowData == null) {
      continue;
    }

    for (let col = 0; col < rowData.length; col++) {
      const color = rowData[col];

      if (color == null) {
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

function showHeartOverlay(anchorCanvas: HTMLCanvasElement, size: number): void {
  const heartSize = Math.max(16, Math.round(size * 0.6));
  const heart = document.createElement('canvas');

  heart.width = heartSize;
  heart.height = heartSize;
  heart.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 2147483647;
    image-rendering: pixelated;
  `;

  const rect = anchorCanvas.getBoundingClientRect();
  const top = rect.top - heartSize - 4;
  const left = rect.left + (size - heartSize) / 2;

  heart.style.left = `${left}px`;
  heart.style.top = `${top}px`;
  document.body.appendChild(heart);

  // Draw pixel heart
  const ctx = heart.getContext('2d');

  if (ctx) {
    const s = heartSize / 8;

    ctx.fillStyle = '#ff4488';
    const pixels = [
      [1, 0],
      [2, 0],
      [5, 0],
      [6, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
      [7, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [3, 5],
      [4, 5],
    ];

    for (const coord of pixels) {
      const px = coord[0] ?? 0;
      const py = coord[1] ?? 0;

      ctx.fillRect(px * s, py * s, s, s);
    }
  }

  // Float upward and fade
  let opacity = 1;
  let dy = 0;

  const animate = () => {
    opacity -= 0.03;
    dy += 0.5;
    heart.style.opacity = String(opacity);
    heart.style.top = `${top - dy}px`;

    if (opacity > 0) {
      requestAnimationFrame(animate);
    } else {
      heart.remove();
    }
  };

  requestAnimationFrame(animate);
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
  let jumpPhase = 0;
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

  const ctx = canvas.getContext('2d')!;

  function transitionTo(next: AnimationState): void {
    if (sm.canTransition(next, state)) {
      state = sm.send(next, state);
      frameIndex = 0;
      frameAccMs = 0;

      if (next === 'walk-left') {
        state = { ...state, direction: -1 };
      }

      if (next === 'walk-right') {
        state = { ...state, direction: 1 };
      }

      if (next === 'jump') {
        jumpPhase = 0;
        jumpOriginY = state.y;
      }
    }
  }

  canvas.addEventListener('click', () => {
    if (sm.state === 'peek') {
      const chosen = Math.random() < 0.5 ? 'jump' : 'heart';

      transitionTo(chosen);

      if (chosen === 'heart') {
        showHeartOverlay(canvas, size);
      }
    } else {
      transitionTo('idle');
    }
  });

  container.appendChild(canvas);

  scheduler.start({
    onFrame(elapsed) {
      const clip = definition.clips[sm.state];
      const msPerFrame = 1000 / clip.fps;

      frameAccMs += elapsed;

      if (frameAccMs >= msPerFrame) {
        frameAccMs = 0;

        if (clip.loop) {
          frameIndex = (frameIndex + 1) % clip.frames.length;
        } else {
          frameIndex = Math.min(frameIndex + 1, clip.frames.length - 1);

          // non-looping clips auto-transition to idle when done
          if (frameIndex === clip.frames.length - 1) {
            setTimeout(() => transitionTo('idle'), msPerFrame);
          }
        }
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
        jumpPhase += 0.15;
        const arc = Math.sin(jumpPhase) * size * 1.5;

        state = { ...state, y: jumpOriginY - arc };

        if (jumpPhase >= Math.PI) {
          state = { ...state, y: jumpOriginY };
          transitionTo('idle');
        }
      }

      const clamped = clampPosition(state.x, state.y, size);

      state = { ...state, ...clamped };

      canvas.style.left = `${state.x}px`;
      canvas.style.top = `${state.y}px`;

      const frame = clip.frames[frameIndex];

      if (frame != null) {
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
