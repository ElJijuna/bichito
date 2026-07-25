import { describe, expect, it } from 'vitest';
import {
  mirrorFrameH,
  offsetFrame,
  offsetFrameX,
  overlayFrame,
  type Palette,
  parseFrame,
  recolorFrame,
  SPRITE_SIZE,
} from '../src/pets/sprite-utils.js';

const PALETTE: Palette = { a: '#aaaaaa', b: '#bbbbbb' };

/** Builds a 30-row grid from a partial spec, padding the rest with blanks. */
function grid(rows: string[]): string[] {
  const blank = '.'.repeat(SPRITE_SIZE);

  return Array.from({ length: SPRITE_SIZE }, (_r, i) => rows[i] ?? blank);
}

describe('parseFrame', () => {
  it('maps characters to palette colors and dots to null', () => {
    const frame = parseFrame(PALETTE, grid([`ab${'.'.repeat(28)}`]));

    expect(frame[0]?.[0]).toBe('#aaaaaa');
    expect(frame[0]?.[1]).toBe('#bbbbbb');
    expect(frame[0]?.[2]).toBeNull();
  });

  it('produces a 30x30 frame', () => {
    const frame = parseFrame(PALETTE, grid([]));

    expect(frame).toHaveLength(SPRITE_SIZE);
    expect(frame.every((row) => row.length === SPRITE_SIZE)).toBe(true);
  });

  it('rejects a grid with the wrong number of rows', () => {
    expect(() => parseFrame(PALETTE, ['.'.repeat(SPRITE_SIZE)])).toThrow(/30 rows/);
  });

  it('rejects a row of the wrong width', () => {
    const rows = grid([]);

    rows[3] = 'ab';

    expect(() => parseFrame(PALETTE, rows)).toThrow(/row 3/);
  });

  it('rejects a character missing from the palette', () => {
    expect(() => parseFrame(PALETTE, grid([`z${'.'.repeat(29)}`]))).toThrow(/Unknown/);
  });
});

describe('mirrorFrameH', () => {
  it('reverses each row', () => {
    const frame = parseFrame(PALETTE, grid([`ab${'.'.repeat(28)}`]));
    const mirrored = mirrorFrameH(frame);

    expect(mirrored[0]?.[SPRITE_SIZE - 1]).toBe('#aaaaaa');
    expect(mirrored[0]?.[SPRITE_SIZE - 2]).toBe('#bbbbbb');
  });

  it('round-trips back to the original', () => {
    const frame = parseFrame(PALETTE, grid([`ab${'.'.repeat(28)}`]));

    expect(mirrorFrameH(mirrorFrameH(frame))).toEqual(frame);
  });
});

describe('offsetFrame', () => {
  it('shifts art down and blanks the vacated rows', () => {
    const frame = parseFrame(PALETTE, grid([`a${'.'.repeat(29)}`]));
    const moved = offsetFrame(frame, 2);

    expect(moved[0]?.every((px) => px === null)).toBe(true);
    expect(moved[2]?.[0]).toBe('#aaaaaa');
  });

  it('shifts art up', () => {
    const rows = grid([]);

    rows[5] = `a${'.'.repeat(29)}`;

    const moved = offsetFrame(parseFrame(PALETTE, rows), -2);

    expect(moved[3]?.[0]).toBe('#aaaaaa');
  });

  it('preserves dimensions and returns the input unchanged for zero', () => {
    const frame = parseFrame(PALETTE, grid([`a${'.'.repeat(29)}`]));

    expect(offsetFrame(frame, 0)).toBe(frame);
    expect(offsetFrame(frame, 4)).toHaveLength(SPRITE_SIZE);
    expect(offsetFrame(frame, 4).every((row) => row.length === SPRITE_SIZE)).toBe(true);
  });
});

describe('offsetFrameX', () => {
  it('shifts art right', () => {
    const frame = parseFrame(PALETTE, grid([`a${'.'.repeat(29)}`]));
    const moved = offsetFrameX(frame, 3);

    expect(moved[0]?.[0]).toBeNull();
    expect(moved[0]?.[3]).toBe('#aaaaaa');
    expect(moved[0]).toHaveLength(SPRITE_SIZE);
  });

  it('shifts art left', () => {
    const frame = parseFrame(PALETTE, grid([`...a${'.'.repeat(26)}`]));
    const moved = offsetFrameX(frame, -3);

    expect(moved[0]?.[0]).toBe('#aaaaaa');
  });
});

describe('overlayFrame', () => {
  it('draws the overlay on top but keeps the base where the overlay is clear', () => {
    const base = parseFrame(PALETTE, grid([`aa${'.'.repeat(28)}`]));
    const over = parseFrame(PALETTE, grid([`b${'.'.repeat(29)}`]));
    const merged = overlayFrame(base, over);

    expect(merged[0]?.[0]).toBe('#bbbbbb');
    expect(merged[0]?.[1]).toBe('#aaaaaa');
  });
});

describe('recolorFrame', () => {
  it('replaces mapped colors and leaves others alone', () => {
    const frame = parseFrame(PALETTE, grid([`ab${'.'.repeat(28)}`]));
    const recolored = recolorFrame(frame, { '#aaaaaa': '#123456' });

    expect(recolored[0]?.[0]).toBe('#123456');
    expect(recolored[0]?.[1]).toBe('#bbbbbb');
    expect(recolored[0]?.[2]).toBeNull();
  });
});
