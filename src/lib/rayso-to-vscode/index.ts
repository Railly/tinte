import { getVSCodeColors } from './colors';
import { generateTokenColors } from './tokens';
import { defaultTokenColorMap } from './config';
import { RaysoTheme, VSCodeTheme, TokenColorMap } from './types';

export function raysoToVSCode(
  raysoTheme: RaysoTheme,
  name: string = 'Rayso Theme',
  tokenColorMap: TokenColorMap = defaultTokenColorMap
): { light: VSCodeTheme; dark: VSCodeTheme } {
  
  const lightTheme: VSCodeTheme = {
    name: `${name} Light`,
    displayName: `${name} (Light)`,
    type: 'light',
    colors: getVSCodeColors(raysoTheme.light, 'light'),
    tokenColors: generateTokenColors(raysoTheme.light, tokenColorMap),
  };

  const darkTheme: VSCodeTheme = {
    name: `${name} Dark`,
    displayName: `${name} (Dark)`,
    type: 'dark',
    colors: getVSCodeColors(raysoTheme.dark, 'dark'),
    tokenColors: generateTokenColors(raysoTheme.dark, tokenColorMap),
  };

  return { light: lightTheme, dark: darkTheme };
}


export * from './types';
export * from './config';
export { getVSCodeColors } from './colors';
export { generateTokenColors } from './tokens';