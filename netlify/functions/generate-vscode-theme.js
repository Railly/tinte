import fs from "fs";
import path from "path";
import { createVSIX } from "@vscode/vsce";

// Token to scope mapping from current VS Code provider
export const tokenToScopeMapping = {
  classes: ["entity.name.type.class"],
  interfaces: ["entity.name.type.interface", "entity.name.type"],
  structs: ["entity.name.type.struct"],
  enums: ["entity.name.type.enum"],
  keys: ["meta.object-literal.key"],
  methods: ["entity.name.function.method", "meta.function.method"],
  functions: [
    "entity.name.function",
    "support.function",
    "meta.function-call.generic",
  ],
  variables: [
    "variable",
    "meta.variable",
    "variable.other.object.property",
    "variable.other.readwrite.alias",
  ],
  variablesOther: ["variable.other.object"],
  globalVariables: ["variable.other.global", "variable.language.this"],
  localVariables: ["variable.other.local"],
  parameters: ["variable.parameter", "meta.parameter"],
  properties: ["variable.other.property", "meta.property"],
  strings: ["string", "string.other.link", "markup.inline.raw.string.markdown"],
  stringEscapeSequences: [
    "constant.character.escape",
    "constant.other.placeholder",
  ],
  keywords: ["keyword"],
  keywordsControl: [
    "keyword.control.import",
    "keyword.control.from",
    "keyword.import",
  ],
  storageModifiers: ["storage.modifier", "keyword.modifier", "storage.type"],
  comments: ["comment", "punctuation.definition.comment"],
  docComments: ["comment.documentation", "comment.line.documentation"],
  numbers: ["constant.numeric"],
  booleans: ["constant.language.boolean", "constant.language.json"],
  operators: ["keyword.operator"],
  macros: ["entity.name.function.preprocessor", "meta.preprocessor"],
  preprocessor: ["meta.preprocessor"],
  urls: ["markup.underline.link"],
  tags: ["entity.name.tag"],
  jsxTags: ["support.class.component"],
  attributes: ["entity.other.attribute-name", "meta.attribute"],
  types: ["support.type"],
  constants: ["variable.other.constant", "variable.readonly"],
  labels: ["entity.name.label", "punctuation.definition.label"],
  namespaces: [
    "entity.name.namespace",
    "storage.modifier.namespace",
    "markup.bold.markdown",
  ],
  modules: ["entity.name.module", "storage.modifier.module"],
  typeParameters: ["variable.type.parameter", "variable.parameter.type"],
  exceptions: ["keyword.control.exception", "keyword.control.trycatch"],
  decorators: [
    "meta.decorator",
    "punctuation.decorator",
    "entity.name.function.decorator",
  ],
  calls: ["variable.function"],
  punctuation: [
    "punctuation",
    "punctuation.terminator",
    "punctuation.definition.tag",
    "punctuation.separator",
    "punctuation.definition.string",
    "punctuation.section.block",
  ],
  plain: ["source", "support.type.property-name.css"],
};

// Default token color mapping from current VS Code provider
export const defaultTokenColorMap = {
  plain: "tx",
  punctuation: "tx_2",
  classes: "pr",
  interfaces: "pr",
  structs: "pr",
  enums: "pr",
  types: "sc",
  typeParameters: "pr",
  functions: "pr",
  methods: "sc",
  calls: "tx",
  variables: "tx",
  variablesOther: "sc",
  globalVariables: "ac_2",
  localVariables: "tx",
  parameters: "tx",
  properties: "tx",
  keys: "tx",
  keywords: "sc",
  keywordsControl: "sc",
  storageModifiers: "sc",
  operators: "sc",
  strings: "ac_2",
  stringEscapeSequences: "tx",
  numbers: "ac_3",
  booleans: "ac_3",
  constants: "sc",
  comments: "tx_3",
  docComments: "tx_3",
  tags: "sc",
  jsxTags: "sc",
  attributes: "pr",
  urls: "sc",
  namespaces: "pr",
  modules: "sc",
  macros: "sc",
  preprocessor: "ac_2",
  exceptions: "sc",
  decorators: "pr",
  labels: "ac_2",
};

// Editor color mapping from current VS Code provider
export const editorColorMap = {
  "editor.background": "bg",
  "editor.foreground": "tx",
  "editor.hoverHighlightBackground": "ui_2",
  "editor.lineHighlightBackground": "bg_2",
  "editor.selectionBackground": "ui_3",
  "editor.selectionHighlightBackground": "tx_3",
  "editor.wordHighlightBackground": "ui_2",
  "editor.wordHighlightStrongBackground": "ui",
  "editor.findMatchBackground": "pr",
  "editor.findMatchHighlightBackground": "pr",
  "editor.findRangeHighlightBackground": "bg_2",
  "editor.inactiveSelectionBackground": "ui_3",
  "editor.lineHighlightBorder": "ui",
  "editor.rangeHighlightBackground": "bg_2",
  "editorWhitespace.foreground": "ui",
  "editorIndentGuide.background1": "ui_2",
  "editorHoverWidget.background": "ui",
  "editorLineNumber.activeForeground": "tx",
  "editorLineNumber.foreground": "ui_3",
  "editorGutter.background": "bg",
  "editorGutter.modifiedBackground": "ac_2",
  "editorGutter.addedBackground": "ac_2",
  "editorGutter.deletedBackground": "sc",
  "editorBracketMatch.background": "ui",
  "editorBracketMatch.border": "ui_2",
  "editorGroupHeader.tabsBackground": "bg",
  "editorGroup.border": "ui_2",
  "tab.activeBackground": "bg",
  "tab.inactiveBackground": "bg_2",
  "tab.inactiveForeground": "tx_2",
  "tab.activeForeground": "tx",
  "tab.hoverBackground": "ui_2",
  "tab.unfocusedHoverBackground": "ui_2",
  "tab.border": "ui_2",
  "tab.activeModifiedBorder": "pr",
  "tab.inactiveModifiedBorder": "sc",
  "editorWidget.background": "bg_2",
  "editorWidget.border": "ui_2",
  "editorSuggestWidget.background": "bg",
  "editorSuggestWidget.border": "ui_2",
  "editorSuggestWidget.foreground": "tx",
  "editorSuggestWidget.highlightForeground": "tx_2",
  "editorSuggestWidget.selectedBackground": "ui_2",
  "panel.background": "bg",
  "panel.border": "ui_2",
  "panelTitle.activeBorder": "ui_3",
  "panelTitle.activeForeground": "tx",
  "panelTitle.inactiveForeground": "tx_2",
  "statusBar.background": "bg",
  "statusBar.foreground": "tx",
  "statusBar.border": "ui_2",
  "statusBar.debuggingBackground": "sc",
  "statusBar.debuggingForeground": "tx",
  "titleBar.activeBackground": "bg",
  "titleBar.activeForeground": "tx",
  "titleBar.inactiveBackground": "bg_2",
  "titleBar.inactiveForeground": "tx_2",
  "titleBar.border": "ui_2",
  "menu.foreground": "tx",
  "menu.background": "bg",
  "menu.selectionForeground": "tx",
  "menu.selectionBackground": "ui_2",
  "menu.border": "ui_2",
  "terminal.foreground": "tx",
  "terminal.background": "bg",
  "terminalCursor.foreground": "tx",
  "terminalCursor.background": "bg",
  "terminal.ansiRed": "sc",
  "terminal.ansiGreen": "ac_2",
  "terminal.ansiYellow": "pr",
  "terminal.ansiBlue": "sc",
  "terminal.ansiMagenta": "ac_2",
  "terminal.ansiCyan": "ac_2",
  "activityBar.background": "bg",
  "activityBar.foreground": "tx",
  "activityBar.inactiveForeground": "tx_2",
  "activityBar.activeBorder": "tx",
  "activityBar.border": "ui_2",
  "sideBar.background": "bg",
  "sideBar.foreground": "tx",
  "sideBar.border": "ui_2",
  "sideBarTitle.foreground": "tx",
  "sideBarSectionHeader.background": "bg_2",
  "sideBarSectionHeader.foreground": "tx",
  "sideBarSectionHeader.border": "ui_2",
  "list.foreground": "tx",
  "list.inactiveSelectionBackground": "ui_2",
  "list.activeSelectionBackground": "ui_3",
  "list.inactiveSelectionForeground": "tx",
  "list.activeSelectionForeground": "tx",
  "list.focusOutline": "pr",
  "list.hoverForeground": "tx",
  "list.hoverBackground": "ui_2",
  "input.background": "bg_2",
  "input.foreground": "tx",
  "input.border": "ui_2",
  "input.placeholderForeground": "tx_2",
  "dropdown.background": "bg_2",
  "dropdown.foreground": "tx",
  "dropdown.border": "ui_2",
  "dropdown.listBackground": "bg",
  "badge.background": "sc",
  "activityBarBadge.background": "sc",
  "button.background": "sc",
  "button.foreground": "bg",
  "badge.foreground": "bg",
  "activityBarBadge.foreground": "bg",
};

const applyCustomizations = (color, token, mode) => {
  switch (token) {
    case "editor.findMatchBackground":
      return mode === "light" ? `${color}55` : `${color}66`;
    case "editor.findMatchHighlightBackground":
      return mode === "light" ? `${color}44` : `${color}55`;
    case "editor.findRangeHighlightBackground":
      return mode === "light" ? `${color}cc` : `${color}cc`;
    case "editor.hoverHighlightBackground":
    case "editor.inactiveSelectionBackground":
      return mode === "light" ? `${color}55` : `${color}66`;
    case "editor.rangeHighlightBackground":
      return mode === "light" ? `${color}33` : `${color}44`;
    case "editor.selectionBackground":
      return mode === "light" ? `${color}66` : `${color}77`;
    case "editor.selectionHighlightBackground":
    case "editor.wordHighlightBackground":
      return mode === "light" ? `${color}22` : `${color}11`;
    case "editor.wordHighlightStrongBackground":
      return mode === "light" ? `${color}33` : `${color}22`;
    case "diffEditor.insertedTextBackground":
    case "diffEditor.removedTextBackground":
      return mode === "light" ? `${color}22` : `${color}44`;
    default:
      return color;
  }
};

function getVSCodeColors(palette, mode) {
  const vsCodeColors = {};

  for (const [token, colorKey] of Object.entries(editorColorMap)) {
    const color = palette[colorKey];
    vsCodeColors[token] = applyCustomizations(color, token, mode);
  }

  return vsCodeColors;
}

function generateTokenColors(palette, tokenColors = defaultTokenColorMap, overrides) {
  return Object.entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: tokenToScopeMapping[token],
    settings: {
      foreground: overrides?.[token] || palette[colorKey],
    },
  }));
}

function convertTinteToVSCode(tinteTheme, name = "Tinte Theme", overrides) {
  const lightTheme = {
    name: `${name} Light`,
    displayName: `${name} (Light)`,
    type: "light",
    colors: getVSCodeColors(tinteTheme.light, "light"),
    tokenColors: generateTokenColors(tinteTheme.light, defaultTokenColorMap, overrides),
  };

  const darkTheme = {
    name: `${name} Dark`,
    displayName: `${name} (Dark)`,
    type: "dark",
    colors: getVSCodeColors(tinteTheme.dark, "dark"),
    tokenColors: generateTokenColors(tinteTheme.dark, defaultTokenColorMap, overrides),
  };

  return { light: lightTheme, dark: darkTheme };
}

const allowedOrigins = ["https://tinte-rh.netlify.app", "https://www.tinte.dev", "https://tinte.railly.dev", "http://localhost:3000"];

export async function handler(event) {
  const origin = event.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": isAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (jsonError) {
    console.error("JSON parsing error:", jsonError);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { tinteTheme, themeName, variant = "dark", overrides } = parsedBody;

  // Validate input
  if (!tinteTheme || !tinteTheme.light || !tinteTheme.dark) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid theme format. Expected tinteTheme with light and dark variants." }),
    };
  }

  try {
    const vsixBuffer = await createVSIXFile(tinteTheme, themeName || "Custom Theme", variant, overrides);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${(themeName || "custom-theme").toLowerCase().replace(/\s+/g, "-")}-${variant}-0.0.1.vsix"`,
      },
      body: vsixBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Error creating VSIX file:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function createVSIXFile(tinteTheme, themeName, variant, overrides) {
  const themes = convertTinteToVSCode(tinteTheme, themeName, overrides);
  const selectedTheme = variant === "light" ? themes.light : themes.dark;

  // Create a unique temporary directory in the project
  const timestamp = Date.now();
  const themePath = path.join(process.cwd(), ".temp", `theme-${timestamp}`);
  const packageJsonPath = path.join(themePath, "package.json");
  const themeJsonPath = path.join(themePath, "themes", "theme.json");
  const readmePath = path.join(themePath, "README.md");
  const vscodeignorePath = path.join(themePath, ".vscodeignore");

  // Ensure the directories exist
  fs.mkdirSync(path.join(themePath, "themes"), { recursive: true });

  // Write package.json
  const packageJson = {
    name: themeName.toLowerCase().replace(/\s+/g, "-"),
    displayName: themeName,
    publisher: "Tinte",
    version: "0.0.1",
    engines: {
      vscode: "^1.70.0",
    },
    categories: ["Themes"],
    contributes: {
      themes: [
        {
          label: `${themeName} (${variant === "light" ? "Light" : "Dark"})`,
          uiTheme: variant === "light" ? "vs" : "vs-dark",
          path: "./themes/theme.json",
        },
      ],
    },
  };

  const readmeContent = `<h3 align="center">
  <img src="https://raw.githubusercontent.com/Railly/website/main/public/images/private-github/tinte-logo.png" width="100" alt="Tinte Logo"/><br/>
  <img src="https://raw.githubusercontent.com/crafter-station/website/main/public/transparent.png" height="30" width="0px"/>
  ${themeName} by Tinte
</h3>

<p align="center">
An opinionated multi-platform color theme generator 🎨 <br>
Generated with <a href="https://tinte.railly.dev">Tinte</a>
</p>

## About This Theme

This VS Code theme was generated using Tinte, a modern theme converter and generator that supports multiple platforms and formats.

### Features

- **Semantic Color System**: Based on Flexoki-inspired continuous scale design
- **OKLCH Color Space**: Perceptually uniform colors for better contrast
- **Multi-Platform**: Compatible with VS Code and many other editors
- **Customizable**: Generated from your custom color palette

## Support Tinte

If you enjoy this theme, consider supporting the creator:

### GitHub Sponsors

<a style="margin-right: 20px;" href="https://www.github.com/sponsors/Railly">
  <img src="https://raw.githubusercontent.com/Railly/obsidian-simple-flashcards/master/github-sponsor.png" alt="Sponsor with GitHub" height="45px" />
</a>

### Buy Me a Coffee

<a href="https://www.buymeacoffee.com/raillyhugo" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="45px">
</a>

### PayPal

<a href="https://www.paypal.com/donate/?hosted_button_id=J3PJ5N6LVZCPY">
  <img style="margin-right: 20px;" src="https://raw.githubusercontent.com/Railly/Railly/main/buttons/donate-with-paypal.png" alt="Donate with PayPal" height="45px" />
</a>

## Thank You! 🙏

Your support helps maintain and improve Tinte for the entire community.

Visit [tinte.railly.dev](https://tinte.railly.dev) to create your own themes!

Happy coding! 💻✨`;

  // Create .vscodeignore file
  const vscodeignoreContent = `node_modules/
*.vsix
.vscode/
.git/
.DS_Store
*.log
`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(themeJsonPath, JSON.stringify(selectedTheme, null, 2));
  fs.writeFileSync(readmePath, readmeContent);
  fs.writeFileSync(vscodeignorePath, vscodeignoreContent);

  // Run vsce to package the theme
  try {
    // Change to the theme directory to avoid path issues
    const originalCwd = process.cwd();
    process.chdir(themePath);

    await createVSIX({
      cwd: themePath,
      allowMissingRepository: true,
      skipLicense: true,
    });

    const vsixPath = `${packageJson.name}-${packageJson.version}.vsix`;
    const vsixBuffer = fs.readFileSync(path.join(themePath, vsixPath));

    // Restore original working directory
    process.chdir(originalCwd);

    // Cleanup
    fs.rmSync(themePath, { recursive: true, force: true });

    return vsixBuffer;
  } catch (error) {
    // Cleanup in case of error
    const originalCwd = process.cwd();
    try {
      process.chdir(originalCwd);
    } catch {}
    fs.rmSync(themePath, { recursive: true, force: true });
    throw new Error(`Error creating VSIX file: ${error.message}`);
  }
}