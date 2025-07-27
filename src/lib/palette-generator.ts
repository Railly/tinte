import { oklch, rgb, formatHex } from 'culori';

export interface PaletteColor {
  name: string;
  value: string;
  luminance: number;
  contrast: {
    white: number;
    black: number;
  };
  accessibility: {
    level: 'AAA' | 'AA' | 'A' | 'Fail';
    textOnWhite: boolean;
    textOnBlack: boolean;
  };
}

function generateTailwindStops(count: number): number[] {
  if (count === 11) return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  if (count === 10) return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  if (count === 9) return [50, 100, 200, 300, 400, 500, 600, 700, 800];
  
  const stops = [50];
  const rest = count - 1;
  const stock = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  for (let i = 0; i < rest && i < stock.length; i++) {
    stops.push(stock[i]);
  }
  
  return stops;
}


function toOklch(color: string): { l: number; c: number; h: number } {
  const oklchColor = oklch(color);
  if (!oklchColor) throw new Error('Invalid color');
  
  return {
    l: oklchColor.l || 0,
    c: oklchColor.c || 0,
    h: oklchColor.h || 0
  };
}

function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const rgbColor = rgb({ mode: 'oklch', l, c, h });
  if (!rgbColor) throw new Error('Invalid OKLCH values');
  
  return {
    r: rgbColor.r || 0,
    g: rgbColor.g || 0,
    b: rgbColor.b || 0
  };
}

function rgbToHex(rgbColor: { r: number; g: number; b: number }): string {
  return formatHex({ mode: 'rgb', ...rgbColor });
}

function getSRGBLuminance(rgbColor: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgbColor;
  
  const linearize = (val: number) => {
    if (val <= 0.03928) return val / 12.92;
    return Math.pow((val + 0.055) / 1.055, 2.4);
  };
  
  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);
  
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function getContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function interpolate(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function applyContrastShift(palette: PaletteColor[], contrastShift: number): PaletteColor[] {
  if (contrastShift === 0) return palette;
  
  const shadeCount = palette.length;
  
  return palette.map((color, index) => {
    const oklchColor = toOklch(color.value);
    const positionInPalette = index / (shadeCount - 1);
    
    // Aplicar transformación suave basada en posición
    const centerDistance = Math.abs(positionInPalette - 0.5);
    const transformationStrength = Math.sin(positionInPalette * Math.PI);
    
    let newL = oklchColor.l;
    let newC = oklchColor.c;
    
    if (contrastShift > 0) {
      // Expansión de contraste
      const expansionFactor = contrastShift * centerDistance * transformationStrength * 0.3;
      
      if (positionInPalette < 0.5) {
        // Lado claro: aclarar
        newL = oklchColor.l + expansionFactor;
        newC = oklchColor.c * (1 - expansionFactor * 0.4);
      } else {
        // Lado oscuro: oscurecer, pero también puede aclarar para mayor contraste
        newL = oklchColor.l + expansionFactor * 0.7;
        newC = oklchColor.c * (1 - expansionFactor * 0.3);
      }
    } else {
      // Compresión de contraste
      const compressionFactor = Math.abs(contrastShift) * centerDistance * transformationStrength * 0.25;
      
      if (positionInPalette < 0.5) {
        // Lado claro: oscurecer hacia el centro
        newL = oklchColor.l - compressionFactor;
        newC = oklchColor.c * (1 - compressionFactor * 0.2);
      } else {
        // Lado oscuro: oscurecer más para compresión
        newL = oklchColor.l - compressionFactor * 1.3;
        newC = oklchColor.c * (1 + compressionFactor * 0.4);
      }
    }
    
    // Asegurar que los valores estén en rango válido
    newL = Math.max(0.01, Math.min(0.99, newL));
    newC = Math.max(0, newC);
    
    const rgbColor = oklchToRgb(newL, newC, oklchColor.h);
    const hex = rgbToHex(rgbColor);
    const lum = getSRGBLuminance(rgbColor);
    
    const contrastWhite = getContrastRatio(lum, 1);
    const contrastBlack = getContrastRatio(lum, 0);
    
    let level: 'AAA' | 'AA' | 'A' | 'Fail' = 'Fail';
    if (contrastWhite >= 7 || contrastBlack >= 7) level = 'AAA';
    else if (contrastWhite >= 4.5 || contrastBlack >= 4.5) level = 'AA';
    else if (contrastWhite >= 3 || contrastBlack >= 3) level = 'A';
    
    return {
      ...color,
      value: hex,
      luminance: lum,
      contrast: { white: contrastWhite, black: contrastBlack },
      accessibility: {
        level,
        textOnWhite: contrastWhite >= 4.5,
        textOnBlack: contrastBlack >= 4.5
      }
    };
  });
}

function findBestShadePosition(baseColor: string): number {
  const baseOklch = toOklch(baseColor);
  const targetLuminances = [0.985, 0.967, 0.922, 0.870, 0.708, 0.556, 0.439, 0.371, 0.269, 0.205, 0.145];
  
  let bestIndex = 0;
  let minDifference = Math.abs(targetLuminances[0] - baseOklch.l);
  
  for (let i = 1; i < targetLuminances.length; i++) {
    const difference = Math.abs(targetLuminances[i] - baseOklch.l);
    if (difference < minDifference) {
      minDifference = difference;
      bestIndex = i;
    }
  }
  
  return bestIndex;
}

export function generateTailwindPalette(baseColor: string, customStops?: number[], contrastShift: number = 0): PaletteColor[] {
  const stops = customStops || generateTailwindStops(11);
  const baseOklch = toOklch(baseColor);
  
  const basePosition = findBestShadePosition(baseColor);
  
  const lightEndpoint = { l: 0.985, c: Math.max(0.002, baseOklch.c * 0.05), h: baseOklch.h };
  const darkEndpoint = { l: 0.145, c: Math.max(0.02, baseOklch.c * 0.6), h: baseOklch.h };
  
  const palette: PaletteColor[] = [];
  
  for (let i = 0; i < stops.length; i++) {
    let interpolatedColor;
    
    if (i === basePosition) {
      // Usar el color base exacto en su posición correcta
      interpolatedColor = baseOklch;
    } else if (i < basePosition) {
      // Extrapolación hacia tonos más claros
      const factor = (basePosition - i) / basePosition;
      interpolatedColor = {
        l: interpolate(baseOklch.l, lightEndpoint.l, factor),
        c: interpolate(baseOklch.c, lightEndpoint.c, factor * 0.8),
        h: baseOklch.h
      };
    } else {
      // Extrapolación hacia tonos más oscuros
      const factor = (i - basePosition) / (stops.length - 1 - basePosition);
      interpolatedColor = {
        l: interpolate(baseOklch.l, darkEndpoint.l, factor),
        c: interpolate(baseOklch.c, darkEndpoint.c, factor * 0.9),
        h: baseOklch.h
      };
    }
    
    const rgbColor = oklchToRgb(interpolatedColor.l, interpolatedColor.c, interpolatedColor.h);
    const hex = rgbToHex(rgbColor);
    const lum = getSRGBLuminance(rgbColor);
    
    const contrastWhite = getContrastRatio(lum, 1);
    const contrastBlack = getContrastRatio(lum, 0);
    
    let level: 'AAA' | 'AA' | 'A' | 'Fail' = 'Fail';
    if (contrastWhite >= 7 || contrastBlack >= 7) level = 'AAA';
    else if (contrastWhite >= 4.5 || contrastBlack >= 4.5) level = 'AA';
    else if (contrastWhite >= 3 || contrastBlack >= 3) level = 'A';
    
    palette.push({
      name: stops[i].toString(),
      value: hex,
      luminance: lum,
      contrast: { white: contrastWhite, black: contrastBlack },
      accessibility: {
        level,
        textOnWhite: contrastWhite >= 4.5,
        textOnBlack: contrastBlack >= 4.5
      }
    });
  }
  
  return applyContrastShift(palette, contrastShift);
}