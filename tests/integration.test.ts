import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bichito } from '../src/index.js';

beforeEach(() => {
  // happy-dom doesn't implement Canvas 2D — stub getContext
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
  }) as never;

  let rafId = 0;

  vi.stubGlobal('requestAnimationFrame', (_cb: FrameRequestCallback) => {
    // Queue but never fire — prevents infinite rAF loop in tests
    return ++rafId;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('bichito()', () => {
  it('appends a canvas to document.body', () => {
    const destroy = bichito({ pet: 'ariel', size: 30 });
    const canvases = document.body.querySelectorAll('canvas');

    expect(canvases.length).toBeGreaterThan(0);
    destroy();
  });

  it('removes the canvas on destroy', () => {
    const destroy = bichito({ pet: 'ariel', size: 30 });

    destroy();
    const canvases = document.body.querySelectorAll('canvas');

    expect(canvases.length).toBe(0);
  });

  it('accepts a custom container', () => {
    const div = document.createElement('div');

    document.body.appendChild(div);
    const destroy = bichito({ pet: 'thor', size: 30, container: div });

    expect(div.querySelectorAll('canvas').length).toBeGreaterThan(0);
    destroy();
  });

  it('defaults to ariel when no pet specified', () => {
    const destroy = bichito({});
    const canvas = document.body.querySelector('canvas');

    expect(canvas).toBeTruthy();
    destroy();
  });
});
