import fs from "node:fs";
import path from "node:path";
import archiver from "archiver";

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
  variablesOther: "tx",
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
  constants: "tx",
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

function getVSCodeColors(palette, mode, overrides) {
  const vsCodeColors = {};

  for (const [token, colorKey] of Object.entries(editorColorMap)) {
    const color = overrides?.[token] || palette[colorKey];
    vsCodeColors[token] = applyCustomizations(color, token, mode);
  }

  return vsCodeColors;
}

function generateTokenColors(
  palette,
  tokenColors = defaultTokenColorMap,
  overrides,
) {
  return Object.entries(tokenColors).map(([token, colorKey]) => ({
    name: token,
    scope: tokenToScopeMapping[token],
    settings: {
      foreground: overrides?.[token] || palette[colorKey],
    },
  }));
}

function convertTinteToVSCode(tinteTheme, name = "Tinte Theme", overrides) {
  const lightOverrides = overrides?.light || {};
  const darkOverrides = overrides?.dark || {};

  const lightTheme = {
    name: `${name} Light`,
    displayName: `${name} (Light)`,
    type: "light",
    colors: getVSCodeColors(tinteTheme.light, "light", lightOverrides),
    tokenColors: generateTokenColors(
      tinteTheme.light,
      defaultTokenColorMap,
      lightOverrides,
    ),
  };

  const darkTheme = {
    name: `${name} Dark`,
    displayName: `${name} (Dark)`,
    type: "dark",
    colors: getVSCodeColors(tinteTheme.dark, "dark", darkOverrides),
    tokenColors: generateTokenColors(
      tinteTheme.dark,
      defaultTokenColorMap,
      darkOverrides,
    ),
  };

  return { light: lightTheme, dark: darkTheme };
}

const allowedOrigins = [
  "https://tinte-rh.netlify.app",
  "https://www.tinte.dev",
  "https://tinte.dev",
  "http://localhost:3000",
];

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
      body: JSON.stringify({
        error:
          "Invalid theme format. Expected tinteTheme with light and dark variants.",
      }),
    };
  }

  try {
    const vsixBuffer = await createVSIXFile(
      tinteTheme,
      themeName || "Custom Theme",
      variant,
      overrides,
    );

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

function generateThemeIcon(tinteTheme, variant) {
  const palette = tinteTheme[variant];

  // Use primary colors for the gradient
  const primaryColor = palette.pr || palette.primary || "#007ACC";
  const secondaryColor = palette.ac_1 || palette.accent || "#FF6F61";
  const backgroundColor =
    palette.bg || (variant === "dark" ? "#1E1E1E" : "#FFFFFF");

  // Additional colors from the palette
  const accentColor = palette.ac_2 || palette.secondary || "#8aadf4";
  const uiColor = palette.ui || "#636572";

  // Generate SVG with the logo shape prominently in front
  const svgContent = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${secondaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="70%">
      <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${uiColor};stop-opacity:0.3" />
    </radialGradient>
  </defs>

  <!-- Background with subtle gradient -->
  <circle cx="64" cy="64" r="64" fill="url(#backgroundGradient)"/>

  <!-- Main logo shape prominently displayed in front -->
  <g transform="translate(-275, -196) scale(0.18, 0.18) translate(64, 64)">
    <path
      d="M447.047 196C471.321 196 495.594 196 520.604 196C519.575 202.51 518.547 209.019 517.487 215.726C514.254 236.204 511.036 256.684 507.825 277.165C507.61 278.533 507.395 279.902 507.174 281.311C506.755 283.988 506.335 286.665 505.915 289.341C505.519 291.869 505.123 294.397 504.725 296.925C503.917 302.081 503.112 307.238 502.348 312.401C502.131 313.867 501.913 315.334 501.689 316.845C501.514 318.052 501.339 319.259 501.159 320.502C500.656 323.244 500.656 323.244 499.409 325.739C550.837 325.739 602.264 325.739 655.249 325.739C653.622 342.837 651.562 359.9 649.016 376.886C571.258 377.503 571.258 377.503 491.929 378.133C490.695 390.483 489.461 402.833 488.189 415.558C487.116 423.814 486.007 432.045 484.761 440.274C484.444 442.407 484.128 444.541 483.812 446.675C481.101 464.814 480.027 484.793 477.792 502.258C474.119 530.95 473.775 557.722 479.462 571.494C482.605 579.106 492.147 591.425 504.396 593.948C567.979 607.047 662.067 544.987 717.585 497.892C718.958 496.735 720.332 495.579 721.705 494.422C724.512 492.056 727.312 489.683 730.106 487.303C732.256 485.476 734.412 483.656 736.583 481.855C740.76 478.373 744.282 474.835 747.507 470.447C748.329 470.859 749.152 471.27 750 471.695C749.29 472.707 749.29 472.707 748.566 473.739C743.957 480.46 740.23 487.259 736.754 494.617C719.772 529.467 694.881 559.74 667.337 586.8C664.967 589.155 664.967 589.155 662.106 592.779C658.848 596.61 655.361 599.707 651.543 602.959C649.202 605.012 647.044 607.143 644.886 609.386C639.189 615.137 632.947 620.158 626.575 625.136C625.685 625.831 624.795 626.527 623.878 627.244C574.676 665.477 518.89 692.289 455.774 693.747C519.83 712.095 571.594 699.683 628.911 668.489C662.295 649.76 693.178 626.006 721.81 600.692C724.927 597.971 728.11 595.336 731.299 592.701C720.877 614.472 705.753 634.362 690.587 653.013C688.988 654.981 687.405 656.962 685.823 658.944C677.286 669.411 667.801 678.956 658.288 688.523C657.296 689.526 657.296 689.526 656.283 690.55C647.63 699.275 638.715 707.318 629.068 714.955C627.503 716.247 625.941 717.542 624.383 718.843C607.293 732.927 588.724 744.438 569.226 754.874C568.425 755.307 567.623 755.739 566.798 756.184C545.319 767.681 523.185 774.748 499.409 779.824C498.334 780.07 497.259 780.316 496.151 780.569C491.934 781.281 487.7 781.524 483.436 781.773C482.572 781.827 481.708 781.881 480.818 781.936C478.704 782.068 476.59 782.194 474.475 782.319C484.059 783.663 493.571 783.799 503.229 783.798C505.932 783.8 508.634 783.823 511.336 783.847C575.66 784.117 634.555 750.269 685.171 713.707C685.993 714.119 686.816 714.53 687.664 714.955C685.561 717.451 683.457 719.945 681.353 722.44C680.772 723.129 680.191 723.819 679.592 724.53C663.545 743.536 646.714 761.371 626.575 776.081C625.521 776.866 624.466 777.651 623.38 778.459C570.548 816.717 503.685 834.153 439.135 824.286C405.466 818.583 373.312 801.171 353.003 773.318C312.72 715.278 327.498 638.954 337.404 573.876C339.7 558.786 341.846 543.675 343.974 528.56C347.794 501.469 351.795 474.408 355.943 447.366C356.342 444.762 356.739 442.159 357.136 439.555C359.617 423.306 362.144 407.069 365.056 390.891C365.261 389.748 365.465 388.605 365.676 387.428C365.866 386.394 366.057 385.36 366.253 384.296C366.417 383.4 366.582 382.505 366.752 381.582C367.257 379.381 367.257 379.381 368.504 376.886C337.648 376.886 306.791 376.886 275 376.886C281.234 338.214 281.234 338.214 282.48 333.224C285.162 331.919 285.162 331.919 288.729 330.948C290.705 330.384 290.705 330.384 292.722 329.808C294.15 329.417 295.579 329.026 297.051 328.623C335.303 317.479 369.611 301.121 398.425 273.344C399.304 272.543 400.183 271.743 401.089 270.917C418.819 254.292 428.916 232.399 439.567 210.97C442.035 206.03 444.504 201.09 447.047 196Z"
      fill="url(#mainGradient)"
    />
  </g>
</svg>`;

  return Buffer.from(svgContent);
}

async function createVSIXFile(tinteTheme, themeName, variant, overrides) {
  const themes = convertTinteToVSCode(tinteTheme, themeName, overrides);
  const selectedTheme = variant === "light" ? themes.light : themes.dark;

  const packageJson = {
    name: themeName.toLowerCase().replace(/\s+/g, "-"),
    displayName: themeName,
    publisher: "Tinte",
    version: "0.0.1",
    description: `${themeName} theme generated with Tinte - beautiful semantic colors for VS Code`,
    icon: "icon.svg",
    engines: {
      vscode: "^1.70.0",
    },
    categories: ["Themes"],
    keywords: ["theme", "color-theme", "tinte", "generated", variant],
    homepage: "https://tinte.dev",
    repository: {
      type: "git",
      url: "https://github.com/Railly/tinte",
    },
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

  const readmeContent = `# ${themeName} Theme

Generated with [Tinte](https://tinte.dev) 🎨

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Install from VSIX file
4. Select this .vsix file

## About

This theme was generated using Tinte's semantic color system with OKLCH color space for perceptually uniform colors.

Visit [tinte.dev](https://tinte.dev) to create your own themes!
`;

  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks = [];

    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);

    // Add extension.vsixmanifest
    const extensionManifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="${packageJson.name}" Version="${packageJson.version}" Publisher="${packageJson.publisher}" />
    <DisplayName>${packageJson.displayName}</DisplayName>
    <Description xml:space="preserve">${packageJson.displayName} theme generated with Tinte</Description>
    <Tags></Tags>
    <Categories>Themes</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="${packageJson.engines.vscode}" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="ui,workspace" />
      <Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />
    </Properties>
    <Installation>
      <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
    </Installation>
  </Metadata>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
  </Assets>
</PackageManifest>`;

    archive.append(extensionManifest, { name: "extension.vsixmanifest" });

    // Add [Content_Types].xml
    const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
  <Default Extension="md" ContentType="text/plain" />
  <Default Extension="svg" ContentType="image/svg+xml" />
</Types>`;

    archive.append(contentTypes, { name: "[Content_Types].xml" });

    // Generate and add icon
    const iconSvg = generateThemeIcon(tinteTheme, variant);
    archive.append(iconSvg, { name: "extension/icon.svg" });

    // Add extension files
    archive.append(JSON.stringify(packageJson, null, 2), {
      name: "extension/package.json",
    });
    archive.append(JSON.stringify(selectedTheme, null, 2), {
      name: "extension/themes/theme.json",
    });
    archive.append(readmeContent, { name: "extension/README.md" });

    archive.finalize();
  });
}
