import type { PixelRow, SpriteFrame } from '../types.js';

export function buildFrame<K extends string>(
  palette: Record<K, string | null>,
  rows: K[][],
): SpriteFrame {
  return rows.map((row): PixelRow => row.map((k) => palette[k]));
}

export function mirrorFrameH(frame: SpriteFrame): SpriteFrame {
  return frame.map((row) => [...row].reverse());
}

export function offsetFrame(frame: SpriteFrame, dy: number): SpriteFrame {
  const empty: PixelRow = new Array<null>(frame[0]?.length ?? 30).fill(null);

  if (dy > 0) {
    const shifted = frame.slice(0, frame.length - dy);

    return [...Array(dy).fill(empty), ...shifted];
  }

  if (dy < 0) {
    const abs = Math.abs(dy);
    const shifted = frame.slice(abs);

    return [...shifted, ...Array(abs).fill(empty)];
  }

  return frame;
}
