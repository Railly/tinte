import { palette } from "../../palette.ts";
import { ColorEntry, SemanticToken } from "../../types.ts";
import { entries, toJSON, writeFile } from "../../utils/index.ts";
import { ThemeType, VSCodeTokenColor } from "../types.ts";
import {
  mapEditorToPaletteColor,
  mapTokenToPaletteColor,
  mapTokenToScope,
} from "./mappers.ts";

const generateSemanticTokenColors = () => {
  const semanticColors: Record<SemanticToken, ColorEntry> = {} as any;

  for (const [tokenColor, colorKey] of entries(mapTokenToPaletteColor)) {
    semanticColors[tokenColor] = palette[colorKey];
  }

  return semanticColors;
};

const generateEditorThemeColors = () => {
  const themeColors: Record<string, ColorEntry> = {};

  for (const [editorColor, colorKey] of entries(mapEditorToPaletteColor)) {
    themeColors[editorColor] = palette[colorKey];
  }

  return themeColors;
};

const generateVSCodeTokenColors = (
  themeType: ThemeType,
  token: SemanticToken,
  color: ColorEntry
): VSCodeTokenColor => {
  const scope = mapTokenToScope(token);

  return {
    name: token,
    scope,
    settings: {
      foreground: color[themeType],
    },
  };
};

const generateVSCodeColors = (themeType: ThemeType) => {
  const editorThemeColors = generateEditorThemeColors();
  const vsCodeColors: Record<string, string> = {};

  for (const [token, color] of entries(editorThemeColors)) {
    vsCodeColors[token] = color[themeType];
  }

  return vsCodeColors;
};

export const generateVSCodeTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const semanticTokenColors = generateSemanticTokenColors();
  const vsCodeTokens: VSCodeTokenColor[] = [];

  for (const [token, color] of entries(semanticTokenColors)) {
    const vsCodeToken = generateVSCodeTokenColors(themeType, token, color);
    vsCodeTokens.push(vsCodeToken);
  }

  const vsCodeColors = generateVSCodeColors(themeType);

  const vsCodeTheme = {
    name,
    type: themeType,
    colors: vsCodeColors,
    tokenColors: vsCodeTokens,
  };

  const filePath = `./_generated/vscode/${name}-${themeType}-vscode.json`;

  writeFile(filePath, toJSON(vsCodeTheme));

  return vsCodeTheme;
};
