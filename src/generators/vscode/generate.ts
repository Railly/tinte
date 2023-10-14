import { currentTheme } from "../../config/index.ts";
import { mappedPalette } from "../../mapped-palette.ts";
import { ColorEntry, SemanticToken } from "../../types.ts";
import { toJSON } from "../../utils/format.ts";
import { entries, getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType, VSCodeTokenColor } from "../types.ts";
import {
  VSCodeEditorMappedTokens,
  VSCodeMappedTokens,
} from "../../config/customize/vscode.ts";
import { mapTokenToScope } from "./mappers.ts";

const generateSemanticTokenColors = () => {
  const semanticColors: Record<SemanticToken, ColorEntry> = {} as any;

  for (const [tokenColor, colorKey] of entries(
    VSCodeMappedTokens[currentTheme]
  )) {
    semanticColors[tokenColor] = mappedPalette[colorKey];
  }

  return semanticColors;
};

const generateEditorThemeColors = () => {
  const themeColors: Record<string, ColorEntry> = {};

  for (const [editorToken, colorKey] of entries(VSCodeEditorMappedTokens)) {
    themeColors[editorToken] = mappedPalette[colorKey];
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
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);
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

  const filePath = `./_generated/${slugifiedName}/vscode/${themeName}.json`;

  writeFile(filePath, toJSON(vsCodeTheme));

  return vsCodeTheme;
};
