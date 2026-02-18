export const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";
export const FONT_SIZE = 14;
export const LINE_HEIGHT = 1.6;
export const CHAR_WIDTH_RATIO = 0.6;

export function estimateCharWidth(fontSize: number = FONT_SIZE): number {
  return fontSize * CHAR_WIDTH_RATIO;
}

export function estimateLineHeightPx(fontSize: number = FONT_SIZE): number {
  return fontSize * LINE_HEIGHT;
}
