import type { SpriteFrame } from './types.js';

/**
 * Paints a sprite frame onto a canvas, one filled rect per opaque pixel.
 *
 * `scale` is how many device pixels each sprite pixel occupies. Coordinates are
 * rounded and sizes rounded up so neighbouring pixels never leave seams between
 * them at fractional scales.
 */
export function drawFrame(ctx: CanvasRenderingContext2D, frame: SpriteFrame, scale: number): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
