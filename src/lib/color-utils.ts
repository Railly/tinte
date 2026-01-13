import { rgb } from "culori";

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function getSRGBLuminance(rgbColor: RGBColor): number {
  const { r, g, b } = rgbColor;

  const linearize = (val: number) => {
    if (val <= 0.03928) return val / 12.92;
    return ((val + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function getLuminanceFromHex(hex: string): number {
  const c = rgb(hex);
  if (!c) return 0;
  return getSRGBLuminance({ r: c.r, g: c.g, b: c.b });
}

export function getContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastBetween(hex1: string, hex2: string): number {
  return getContrastRatio(getLuminanceFromHex(hex1), getLuminanceFromHex(hex2));
}

export function getBestTextColor(bgHex: string): "#ffffff" | "#000000" {
  const white = "#ffffff";
  const black = "#000000";
  return getContrastBetween(white, bgHex) >= getContrastBetween(black, bgHex)
    ? white
    : black;
}
