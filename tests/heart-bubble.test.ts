import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHeartBubble } from '../src/heart-bubble.js';

const drawn: string[] = [];

beforeEach(() => {
  drawn.length = 0;
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    canvas: { width: 20, height: 20 },
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    set fillStyle(value: string) {
      drawn.push(value);
    },
  }) as never;
  vi.stubGlobal('innerWidth', 1000);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('createHeartBubble', () => {
  it('mounts a canvas into the container', () => {
    const bubble = createHeartBubble(document.body, 30);

    expect(document.body.querySelectorAll('canvas')).toHaveLength(1);
    bubble.destroy();
  });

  it('removes its canvas on destroy', () => {
    createHeartBubble(document.body, 30).destroy();

    expect(document.body.querySelectorAll('canvas')).toHaveLength(0);
  });

  it('does not intercept clicks meant for the pet', () => {
    const bubble = createHeartBubble(document.body, 30);
    const canvas = document.body.querySelector('canvas');

    expect(canvas?.style.pointerEvents).toBe('none');
    bubble.destroy();
  });

  it('draws heart pixels while alive', () => {
    const bubble = createHeartBubble(document.body, 30);

    bubble.update(0, 100, 16);

    expect(drawn).toContain('#ff4d80');
    bubble.destroy();
  });

  it('reports finished once its lifetime elapses', () => {
    const bubble = createHeartBubble(document.body, 30);

    expect(bubble.update(0, 100, 100)).toBe(true);
    expect(bubble.update(0, 100, 5000)).toBe(false);
    bubble.destroy();
  });

  describe('anchoring', () => {
    /** The tail tip spans cols 10-11 of the 20-wide grid. */
    const TAIL_TIP_COL = 10.5;
    const TAIL_TIP_ROW = 17;

    it.each([30, 60, 90])('points the tail at the pet centre at size %i', (petSize) => {
      const bubble = createHeartBubble(document.body, petSize);
      const canvas = document.body.querySelector('canvas');
      const petX = 170;

      bubble.update(petX, 240, 1);

      const scale = Math.max(1, Math.round(petSize / 30));
      const left = Number.parseFloat(canvas?.style.left ?? '0');

      expect(left + TAIL_TIP_COL * scale).toBeCloseTo(petX + petSize / 2, 5);
      bubble.destroy();
    });

    it('seats the tail on the pet head rather than floating above it', () => {
      const bubble = createHeartBubble(document.body, 90);
      const canvas = document.body.querySelector('canvas');
      const petY = 240;

      bubble.update(170, petY, 1);

      const top = Number.parseFloat(canvas?.style.top ?? '0');

      expect(top + TAIL_TIP_ROW * 3).toBeCloseTo(petY, 0);
      bubble.destroy();
    });

    it('bobs by only a couple of pixels so the tail stays attached', () => {
      const bubble = createHeartBubble(document.body, 90);
      const canvas = document.body.querySelector('canvas');

      bubble.update(170, 240, 1);
      const start = Number.parseFloat(canvas?.style.top ?? '0');

      // Near the end of its life, where the old drift was worst.
      bubble.update(170, 240, 1400);
      const end = Number.parseFloat(canvas?.style.top ?? '0');

      expect(start - end).toBeLessThanOrEqual(2 * 3);
    });
  });

  it('follows the pet as it moves', () => {
    const bubble = createHeartBubble(document.body, 30);
    const canvas = document.body.querySelector('canvas');

    bubble.update(100, 200, 16);
    const first = canvas?.style.left;

    bubble.update(300, 200, 16);

    expect(canvas?.style.left).not.toBe(first);
    bubble.destroy();
  });

  it('stays inside the viewport when the pet is at the right edge', () => {
    const bubble = createHeartBubble(document.body, 30);
    const canvas = document.body.querySelector('canvas');

    // The pet peeks flush against the right edge, so this is the common case.
    bubble.update(970, 200, 16);

    const left = Number.parseFloat(canvas?.style.left ?? '0');

    expect(left).toBeLessThanOrEqual(1000 - 20);
    bubble.destroy();
  });

  it('stays inside the viewport when the pet is at the top edge', () => {
    const bubble = createHeartBubble(document.body, 30);
    const canvas = document.body.querySelector('canvas');

    bubble.update(100, 0, 16);

    expect(Number.parseFloat(canvas?.style.top ?? '-1')).toBeGreaterThanOrEqual(0);
    bubble.destroy();
  });

  it('fades out toward the end of its life', () => {
    const bubble = createHeartBubble(document.body, 30);
    const canvas = document.body.querySelector('canvas');

    bubble.update(0, 100, 16);
    expect(Number(canvas?.style.opacity)).toBe(1);

    bubble.update(0, 100, 1400);
    expect(Number(canvas?.style.opacity)).toBeLessThan(1);

    bubble.destroy();
  });
});
