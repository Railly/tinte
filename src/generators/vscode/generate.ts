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

const applyCustomizations = (color: ColorEntry, token: string): ColorEntry => {
  switch (token) {
    case "editor.findMatchHighlightBackground":
      return { light: color.light + "cc", dark: color.dark + "cc" };
    case "editor.selectionBackground":
    case "editor.selectionHighlightBackground":
      return { light: color.light + "55", dark: color.dark + "55" };
    case "button.foreground":
    case "badge.foreground":
    case "activityBarBadge.foreground":
      return { light: color.dark, dark: color.dark };
    default:
      if (token.startsWith("diffEditor")) {
        return { light: color.light + "99", dark: color.dark + "99" };
      }
      return color;
  }
};

const generateEditorThemeColors = (): Record<string, ColorEntry> => {
  const themeColors: Record<string, ColorEntry> = {};

  for (const [editorToken, colorKey] of Object.entries(
    VSCodeEditorMappedTokens
  )) {
    const colorEntry = mappedPalette[colorKey];
    themeColors[editorToken] = applyCustomizations(colorEntry, editorToken);
  }

  return themeColors;
};

const generateVSCodeTokenColors = (
  themeType: ThemeType,
  token: SemanticToken,
  color: ColorEntry
): VSCodeTokenColor => {
  const scope = mapTokenToScope(token);

  const settings = {
    foreground: color[themeType],
  };

  if (scope.includes("entity.name.function")) {
    console.log({ scope });
    Object.assign(settings, {
      fontStyle: "bold",
    });
  }

  return {
    name: token,
    scope,
    settings,
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
