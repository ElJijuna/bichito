import type { PixelRow, SpriteFrame } from '../types.js';

/** Every sprite is authored on a square grid of this side length. */
export const SPRITE_SIZE = 30;

/** Character used for transparent pixels in the sprite DSL. */
const TRANSPARENT = '.';

/**
 * Maps a single authoring character to a CSS colour. `null` means transparent.
 * The `.` character is always transparent and does not need to be declared.
 */
export type Palette = Record<string, string | null>;

/**
 * Parses sprite art written as rows of single-character keys.
 *
 * Authoring art as strings keeps the pixel grid readable in source, which is
 * what makes the shapes editable at all:
 *
 * ```ts
 * parseFrame(palette, [
 *   '......oo....oo......',
 *   '.....oBBooooBBo.....',
 * ]);
 * ```
 *
 * Throws when the grid is not {@link SPRITE_SIZE} square or uses an undeclared
 * character, so malformed art fails loudly at import time instead of rendering
 * as silent holes.
 */
export function parseFrame(
  palette: Palette,
  rows: string[],
  size: number = SPRITE_SIZE,
): SpriteFrame {
  if (rows.length !== size) {
    throw new Error(`Sprite must have ${size} rows, received ${rows.length}`);
  }

  return rows.map((row, y): PixelRow => {
    if (row.length !== size) {
      throw new Error(`Sprite row ${y} must be ${size} chars, received ${row.length}`);
    }

    return [...row].map((char, x): string | null => {
      if (char === TRANSPARENT) {
        return null;
      }

      const color = palette[char];

      if (color === undefined) {
        throw new Error(`Unknown sprite character '${char}' at row ${y}, col ${x}`);
      }

      return color;
    });
  });
}

/** Builds a fully transparent row of the given width. */
function emptyRow(width: number): PixelRow {
  return new Array<string | null>(width).fill(null);
}

export function mirrorFrameH(frame: SpriteFrame): SpriteFrame {
  return frame.map((row) => [...row].reverse());
}

/** Shifts a frame vertically. Positive `dy` moves the art down. */
export function offsetFrame(frame: SpriteFrame, dy: number): SpriteFrame {
  if (dy === 0) {
    return frame;
  }

  const width = frame[0]?.length ?? SPRITE_SIZE;
  const blanks = Array.from({ length: Math.abs(dy) }, () => emptyRow(width));

  if (dy > 0) {
    return [...blanks, ...frame.slice(0, frame.length - dy)];
  }

  return [...frame.slice(Math.abs(dy)), ...blanks];
}

/** Shifts a frame horizontally. Positive `dx` moves the art right. */
export function offsetFrameX(frame: SpriteFrame, dx: number): SpriteFrame {
  if (dx === 0) {
    return frame;
  }

  return frame.map((row) => {
    const blanks = new Array<string | null>(Math.abs(dx)).fill(null);

    return dx > 0
      ? [...blanks, ...row.slice(0, row.length - dx)]
      : [...row.slice(Math.abs(dx)), ...blanks];
  });
}

/** Draws `overlay` on top of `base`; transparent overlay pixels keep the base. */
export function overlayFrame(base: SpriteFrame, overlay: SpriteFrame): SpriteFrame {
  return base.map((row, y) =>
    row.map((px, x) => {
      const above = overlay[y]?.[x];

      return above ?? px;
    }),
  );
}

/** Replaces colours in a frame using a lookup of old colour to new colour. */
export function recolorFrame(frame: SpriteFrame, map: Record<string, string>): SpriteFrame {
  return frame.map((row) => row.map((px) => (px === null ? null : (map[px] ?? px))));
}
