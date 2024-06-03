import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { createVSIX } from "@vscode/vsce";

export function generateTokenColors(palette, tokenColors) {
  return Object.entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: mapTokenToScope(token),
    settings: {
      foreground: palette[colorKey],
    },
  }));
}

function mapTokenToScope(token) {
  const tokenToScopeMapping = {
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
    strings: [
      "string",
      "string.other.link",
      "markup.inline.raw.string.markdown",
    ],
    stringEscapeSequences: [
      "constant.character.escape",
      "constant.other.placeholder",
    ],
    keywords: ["keyword"],
    keywordsControl: [
      "keyword.control.import",
      "keyword.control.from",
      "keywaord.import",
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

  return tokenToScopeMapping[token];
}

export { mapTokenToScope };

const editorColorMap = {
  // Editor Colors
  "editor.background": "background",
  "editor.foreground": "text",
  "editor.hoverHighlightBackground": "interface-2",
  "editor.lineHighlightBackground": "background-2",
  "editor.selectionBackground": "interface-3",
  "editor.selectionHighlightBackground": "text-3",
  "editor.findMatchBackground": "accent",
  "editor.findMatchHighlightBackground": "accent",
  "editor.findRangeHighlightBackground": "background-2",
  "editor.inactiveSelectionBackground": "interface-3",
  "editor.lineHighlightBorder": "interface",
  "editor.rangeHighlightBackground": "background-2",
  "notifications.background": "interface",
  "editorInlayHint.typeBackground": "interface-2",
  "editorInlayHint.typeForeground": "text",
  "editorWhitespace.foreground": "interface",
  "editorIndentGuide.background1": "interface-2",
  "editorHoverWidget.background": "interface",
  "editorLineNumber.activeForeground": "text",
  "editorLineNumber.foreground": "interface-3",

  // Gutter Colors
  "editorGutter.background": "background",
  "editorGutter.modifiedBackground": "accent-2",
  "editorGutter.addedBackground": "accent-2",
  "editorGutter.deletedBackground": "primary",

  // Bracket Matching
  "editorBracketMatch.background": "interface",
  "editorBracketMatch.border": "interface-2",

  // Error & Warnings
  "editorError.foreground": "primary",
  "editorWarning.foreground": "accent",
  "editorInfo.foreground": "secondary",

  // Diff Editor
  "diffEditor.insertedTextBackground": "accent-2",
  "diffEditor.removedTextBackground": "primary",

  // Editor Groups & Tabs
  "editorGroupHeader.tabsBackground": "background",
  "editorGroup.border": "interface-2",
  "tab.activeBackground": "background",
  "tab.inactiveBackground": "background-2",
  "tab.inactiveForeground": "text-2",
  "tab.activeForeground": "text",
  "tab.hoverBackground": "interface-2",
  "tab.unfocusedHoverBackground": "interface-2",
  "tab.border": "interface-2",
  "tab.activeModifiedBorder": "accent",
  "tab.inactiveModifiedBorder": "secondary",
  "tab.unfocusedActiveModifiedBorder": "accent",
  "tab.unfocusedInactiveModifiedBorder": "secondary",

  // Editor Widget Colors
  "editorWidget.background": "background-2",
  "editorWidget.border": "interface-2",
  "editorSuggestWidget.background": "background",
  "editorSuggestWidget.border": "interface-2",
  "editorSuggestWidget.foreground": "text",
  "editorSuggestWidget.highlightForeground": "text-2",
  "editorSuggestWidget.selectedBackground": "interface-2",

  // Peek View Colors
  "peekView.border": "interface-2",
  "peekViewEditor.background": "background",
  "peekViewEditor.matchHighlightBackground": "interface-3",
  "peekViewResult.background": "background-2",
  "peekViewResult.fileForeground": "text",
  "peekViewResult.lineForeground": "text-2",
  "peekViewResult.matchHighlightBackground": "interface-3",
  "peekViewResult.selectionBackground": "interface",
  "peekViewResult.selectionForeground": "text-3",
  "peekViewTitle.background": "interface-2",
  "peekViewTitleDescription.foreground": "text-2",
  "peekViewTitleLabel.foreground": "text",

  // Merge Conflicts
  "merge.currentHeaderBackground": "accent-2",
  "merge.currentContentBackground": "accent-2",
  "merge.incomingHeaderBackground": "accent-2",
  "merge.incomingContentBackground": "accent-2",
  "merge.border": "interface-2",
  "merge.commonContentBackground": "interface-3",
  "merge.commonHeaderBackground": "interface-2",

  // Panel Colors
  "panel.background": "background",
  "panel.border": "interface-2",
  "panelTitle.activeBorder": "interface-3",
  "panelTitle.activeForeground": "text",
  "panelTitle.inactiveForeground": "text-2",

  // Status Bar Colors
  "statusBar.background": "background",
  "statusBar.foreground": "text",
  "statusBar.border": "interface-2",
  "statusBar.debuggingBackground": "primary",
  "statusBar.debuggingForeground": "text",
  "statusBar.noFolderBackground": "interface-3",
  "statusBar.noFolderForeground": "text-3",

  // Title Bar
  "titleBar.activeBackground": "background",
  "titleBar.activeForeground": "text",
  "titleBar.inactiveBackground": "background-2",
  "titleBar.inactiveForeground": "text-2",
  "titleBar.border": "interface-2",

  // Menus
  "menu.foreground": "text",
  "menu.background": "background",
  "menu.selectionForeground": "text",
  "menu.selectionBackground": "interface-2",
  "menu.border": "interface-2",

  // Inlay Hints
  "editorInlayHint.foreground": "text-2",
  "editorInlayHint.background": "interface-2",

  // Terminal
  "terminal.foreground": "text",
  "terminal.background": "background",
  "terminalCursor.foreground": "text",
  "terminalCursor.background": "background",
  "terminal.ansiRed": "primary",
  "terminal.ansiGreen": "accent-2",
  "terminal.ansiYellow": "accent",
  "terminal.ansiBlue": "secondary",
  "terminal.ansiMagenta": "accent-2",
  "terminal.ansiCyan": "accent-2",

  // Activity Bar
  "activityBar.background": "background",
  "activityBar.foreground": "text",
  "activityBar.inactiveForeground": "text-2",
  "activityBar.activeBorder": "text",
  "activityBar.border": "interface-2",

  // Sidebar
  "sideBar.background": "background",
  "sideBar.foreground": "text",
  "sideBar.border": "interface-2",
  "sideBarTitle.foreground": "text",
  "sideBarSectionHeader.background": "background-2",
  "sideBarSectionHeader.foreground": "text",
  "sideBarSectionHeader.border": "interface-2",

  // SideBar: Highlights & Active items
  "sideBar.activeBackground": "interface-3",
  "sideBar.activeForeground": "text",

  // Sidebar: Hover
  "sideBar.hoverBackground": "interface-2",
  "sideBar.hoverForeground": "text-2",

  // File & Folder Icons
  "sideBar.folderIcon.foreground": "accent-2",
  "sideBar.fileIcon.foreground": "secondary",

  // More detailed SideBar items...
  "list.warningForeground": "accent",
  "list.errorForeground": "primary",

  // Sidebar: Selections
  "list.inactiveSelectionBackground": "interface-2",
  "list.activeSelectionBackground": "interface-3",
  "list.inactiveSelectionForeground": "text",
  "list.activeSelectionForeground": "text",
  "list.hoverForeground": "text",
  "list.hoverBackground": "interface-2",

  // Input Controls
  "input.background": "background-2",
  "input.foreground": "text",
  "input.border": "interface-2",
  "input.placeholderForeground": "text-2",
  "inputOption.activeBorder": "interface-2",
  "inputOption.activeBackground": "interface",
  "inputOption.activeForeground": "text",

  // Input Validation
  "inputValidation.infoBackground": "secondary",
  "inputValidation.infoBorder": "secondary",
  "inputValidation.warningBackground": "accent",
  "inputValidation.warningBorder": "accent",
  "inputValidation.errorBackground": "primary",
  "inputValidation.errorBorder": "primary",

  // Dropdowns
  "dropdown.background": "background-2",
  "dropdown.foreground": "text",
  "dropdown.border": "interface-2",
  "dropdown.listBackground": "background",

  // Buttons & Badges
  "badge.background": "secondary",
  "activityBarBadge.background": "secondary",
  "button.background": "secondary",

  // Arbitrary Changes to improve accessibility & consistency
  "button.foreground": "background",
  "badge.foreground": "background",
  "activityBarBadge.foreground": "background",
};

export function getVSCodeColors(palette) {
  const vsCodeColors = {};

  for (const [token, colorKey] of Object.entries(editorColorMap)) {
    vsCodeColors[token] = palette[colorKey];
  }

  return vsCodeColors;
}

export function generateVSCodeTheme(themeConfig) {
  const { displayName, palette, tokenColors } = themeConfig;

  const darkTheme = {
    name: "one-hunter-dark",
    displayName,
    type: "dark",
    colors: getVSCodeColors(palette.dark),
    tokenColors: generateTokenColors(palette.dark, tokenColors),
  };

  const lightTheme = {
    name: "one-hunter-light",
    displayName,
    type: "light",
    colors: getVSCodeColors(palette.light),
    tokenColors: generateTokenColors(palette.light, tokenColors),
  };

  return { darkTheme, lightTheme };
}

const execPromise = util.promisify(exec);

const allowedOrigins = ["https://tinte.railly.dev"];

export async function handler(event, context) {
  const origin = event.headers.origin;
  const isAllowed = allowedOrigins.includes(origin);

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin,
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
  if (event.headers["content-type"] === "application/json") {
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
  } else {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Unsupported content type" }),
    };
  }

  const { themeConfig, isDark } = parsedBody;

  try {
    const vsixBuffer = await createVSIXFile(themeConfig, isDark);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${themeConfig.displayName.toLowerCase().replace(/\s+/g, "-")}-${isDark ? "dark" : "light"}-0.0.1.vsix"`,
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

async function createVSIXFile(themeConfig, isDark) {
  const theme = generateVSCodeTheme(themeConfig);

  // Define paths
  const themePath = path.join("/tmp", "temp-theme");
  const packageJsonPath = path.join(themePath, "package.json");
  const themeJsonPath = path.join(themePath, "themes", "theme.json");
  const readmePath = path.join(themePath, "README.md");

  // Ensure the directories exist
  fs.mkdirSync(path.join(themePath, "themes"), { recursive: true });

  // Write package.json
  const packageJson = {
    name: themeConfig.displayName.toLowerCase().replace(/\s+/g, "-"),
    displayName: themeConfig.displayName,
    publisher: "Railly Hugo",
    version: "0.0.1",
    engines: {
      vscode: "^1.40.0",
    },
    categories: ["Themes"],
    contributes: {
      themes: [
        {
          label: themeConfig.displayName,
          uiTheme: isDark ? "vs-dark" : "vs-light",
          path: "./themes/theme.json",
        },
      ],
    },
  };

  fs.writeFileSync(
    readmePath,
    `# ${themeConfig.displayName}

<h3 align="center">
  <img src="https://raw.githubusercontent.com/Railly/website/main/public/images/private-github/tinte-logo.png" width="100" alt="Tinte Logo"/><br/>
  <img src="https://raw.githubusercontent.com/crafter-station/website/main/public/transparent.png" height="30" width="0px"/>
  ${themeConfig.displayName} by Tinte
</h3>

<p align="center">
An opinionated multi-platform color theme generator 🎨 <br>
</p>

## Disclaimer

Visit the web version of this project at [Tinte](https://tinte.railly.dev)
`
  );

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(
    themeJsonPath,
    JSON.stringify(isDark ? theme.darkTheme : theme.lightTheme, null, 2)
  );

  // Run vsce to package the theme
  try {
    const vsixPath = path.join(
      themePath,
      `${packageJson.name}-${packageJson.version}.vsix`
    );
    await createVSIX({ cwd: themePath, packagePath: vsixPath });
    const vsixBuffer = fs.readFileSync(vsixPath);

    // Cleanup
    fs.rmSync(themePath, { recursive: true, force: true });

    return vsixBuffer;
  } catch (error) {
    // Cleanup in case of error
    fs.rmSync(themePath, { recursive: true, force: true });
    throw new Error(`Error creating VSIX file: ${error.message}`);
  }
}
