// Base utilities for Poline-powered provider generators
import { TinteBlock } from '@/types/tinte';
import { makePolineFromTinte, polineRampHex } from '@/lib/ice-theme';
import { rgb } from 'culori';

export interface PolineColorMapping {
  // Core semantic colors (Flexoki-style)
  bg: string;        // background
  bg2: string;       // background_2
  ui: string;        // interface
  ui2: string;       // interface_2
  ui3: string;       // interface_3
  tx3: string;       // text_3
  tx2: string;       // text_2
  tx: string;        // text
  
  // Accent colors (preserved from original theme)
  primary: string;
  secondary: string;
  accent: string;
  accent2: string;
  accent3: string;
  
  // Generated ANSI colors using Poline
  red: string;
  red2: string;
  green: string;
  green2: string;
  yellow: string;
  yellow2: string;
  blue: string;
  blue2: string;
  magenta: string;
  magenta2: string;
  cyan: string;
  cyan2: string;
}

// Convert hex to integer RGB for terminal configs
export function hexToInt(hex: string): { red: number; green: number; blue: number } {
  const color = rgb(hex);
  if (!color) {
    console.warn(`Invalid color: ${hex}, using fallback`);
    return { red: 128, green: 128, blue: 128 };
  }
  
  return {
    red: Math.round(color.r * 255),
    green: Math.round(color.g * 255),
    blue: Math.round(color.b * 255),
  };
}

// Process palette object to convert hex values to integers
export function processPaletteHexToInt<T extends Record<string, string>>(
  palette: T
): Record<keyof T, number> {
  const result = {} as Record<keyof T, number>;
  
  for (const [key, hex] of Object.entries(palette)) {
    const rgb = hexToInt(hex);
    // For terminals, we often need a single integer representation
    result[key as keyof T] = (rgb.red << 16) | (rgb.green << 8) | rgb.blue;
  }
  
  return result;
}

// Generate ANSI colors from Poline ramp
export function generateAnsiColors(polineRamp: string[]): {
  red: string; red2: string;
  green: string; green2: string;
  yellow: string; yellow2: string;
  blue: string; blue2: string;
  magenta: string; magenta2: string;
  cyan: string; cyan2: string;
} {
  // Use different positions in the Poline ramp for ANSI colors
  // This creates a cohesive color scheme based on the theme's color space
  const rampLength = polineRamp.length;
  
  return {
    // Normal colors (more muted, from earlier in ramp)
    red: polineRamp[Math.floor(rampLength * 0.8)] || '#dc2626',
    green: polineRamp[Math.floor(rampLength * 0.3)] || '#16a34a',
    yellow: polineRamp[Math.floor(rampLength * 0.6)] || '#ca8a04',
    blue: polineRamp[Math.floor(rampLength * 0.4)] || '#2563eb',
    magenta: polineRamp[Math.floor(rampLength * 0.7)] || '#9333ea',
    cyan: polineRamp[Math.floor(rampLength * 0.2)] || '#0891b2',
    
    // Bright colors (more vibrant, from later in ramp)
    red2: polineRamp[Math.floor(rampLength * 0.9)] || '#ef4444',
    green2: polineRamp[Math.floor(rampLength * 0.1)] || '#22c55e',
    yellow2: polineRamp[Math.floor(rampLength * 0.5)] || '#eab308',
    blue2: polineRamp[Math.floor(rampLength * 0.2)] || '#3b82f6',
    magenta2: polineRamp[Math.floor(rampLength * 0.8)] || '#a855f7',
    cyan2: polineRamp[Math.floor(rampLength * 0.1)] || '#06b6d4',
  };
}

// Create comprehensive color mapping from Tinte theme using Poline
export function createPolineColorMapping(block: TinteBlock): PolineColorMapping {
  // Generate Poline ramp for ANSI colors
  const poline = makePolineFromTinte(block);
  const polineRamp = polineRampHex(poline);
  const ansiColors = generateAnsiColors(polineRamp);
  
  return {
    // Core semantic colors (directly from Tinte)
    bg: block.background,
    bg2: block.background_2,
    ui: block.interface,
    ui2: block.interface_2,
    ui3: block.interface_3,
    tx3: block.text_3,
    tx2: block.text_2,
    tx: block.text,
    
    // Accent colors (preserved)
    primary: block.primary,
    secondary: block.secondary,
    accent: block.accent,
    accent2: block.accent_2,
    accent3: block.accent_3,
    
    // ANSI colors (generated from Poline)
    ...ansiColors,
  };
}

// Utility functions for different output formats
export function toYAML(obj: any): string {
  const yamlLines: string[] = [];
  
  function addYAMLLines(obj: any, indent = 0) {
    const spaces = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        yamlLines.push(`${spaces}${key}:`);
        addYAMLLines(value, indent + 1);
      } else {
        yamlLines.push(`${spaces}${key}: ${value}`);
      }
    }
  }
  
  addYAMLLines(obj);
  return yamlLines.join('\n');
}

export function toJSON(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

export function toConf(obj: any): string {
  const confLines: string[] = [];
  
  function addConfLines(obj: any, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        confLines.push(`# ${prefix}${key}`);
        addConfLines(value, `${prefix}${key}_`);
      } else {
        confLines.push(`${prefix}${key} ${value}`);
      }
    }
  }
  
  addConfLines(obj);
  return confLines.join('\n');
}

// Theme name utilities
export function getThemeName(name: string, mode?: 'light' | 'dark'): string {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return mode ? `${cleanName}-${mode}` : cleanName;
}

export function getDisplayName(name: string, mode?: 'light' | 'dark'): string {
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  return mode ? `${displayName} (${mode.charAt(0).toUpperCase() + mode.slice(1)})` : displayName;
}