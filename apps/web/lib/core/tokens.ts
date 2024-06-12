import { entries } from "../utils";
import { tokenToScopeMapping } from "./config";
import { Palette, SemanticToken, TokenColorMap } from "./types";

export function generateTokenColors(
  palette: Palette,
  tokenColors: TokenColorMap
) {
  return entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: mapTokenToScope(token),
    settings: {
      foreground: palette[colorKey],
    },
  }));
}

function mapTokenToScope(token: SemanticToken): string | string[] {
  return tokenToScopeMapping[token];
}

export { mapTokenToScope };
