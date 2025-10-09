import { rgb } from "culori";

export interface FigmaRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function hexToFigmaRGBA(hex: string): FigmaRGBA {
  const color = rgb(hex);

  if (!color) {
    console.warn(`Failed to parse color: ${hex}, using fallback`);
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  return {
    r: color.r ?? 0,
    g: color.g ?? 0,
    b: color.b ?? 0,
    a: color.alpha ?? 1,
  };
}

export function convertShadcnPaletteToFigma(
  palette: Record<string, string>,
): Record<string, FigmaRGBA> {
  const figmaColors: Record<string, FigmaRGBA> = {};

  for (const [key, value] of Object.entries(palette)) {
    figmaColors[key] = hexToFigmaRGBA(value);
  }

  return figmaColors;
}
