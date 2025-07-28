import { tokenToScopeMapping, defaultTokenColorMap } from './config';
import { RaysoBlock } from '@/types/rayso';
import { SemanticToken, TokenColorMap, VSCodeTokenColor } from './types';

export function generateTokenColors(
  palette: RaysoBlock,
  tokenColors: TokenColorMap = defaultTokenColorMap
): VSCodeTokenColor[] {
  return Object.entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: mapTokenToScope(token as SemanticToken),
    settings: {
      foreground: palette[colorKey],
    },
  }));
}

function mapTokenToScope(token: SemanticToken): string | string[] {
  return tokenToScopeMapping[token];
}

export { mapTokenToScope };