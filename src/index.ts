import { generateAlacrittyTheme } from "./generators/alacritty/generate.ts";
import { generateITerm2Theme } from "./generators/iterm2/generate.ts";
import { generateVanillaCSSTheme } from "./generators/vanilla-css/generate.ts";
import { generateVSCodeTheme } from "./generators/vscode/generate.ts";
import { generateWindowsTerminalTheme } from "./generators/windows-terminal/generate.ts";
import { getThemeName } from "./utils/index.ts";

const generatorMapping = {
  vscode: generateVSCodeTheme,
  "windows-terminal": generateWindowsTerminalTheme,
  iterm2: generateITerm2Theme,
  alacritty: generateAlacrittyTheme,
  "vanilla-css": generateVanillaCSSTheme,
} as const;

const config = {
  name: "Flexoki",
  providers: [
    {
      name: "vscode",
      themes: ["light", "dark"],
    },
    {
      name: "windows-terminal",
      themes: ["light", "dark"],
    },
    {
      name: "iterm2",
      themes: ["light", "dark"],
    },
    {
      name: "alacritty",
      themes: ["light", "dark"],
    },
    {
      name: "vanilla-css",
      themes: ["light"],
    },
  ],
} as const;

function main() {
  const { name, providers } = config;

  for (const { name: providerName, themes } of providers) {
    const generator = generatorMapping[providerName];
    if (!generator) {
      throw new Error(`Unknown provider: ${providerName}`);
    }

    for (const themeType of themes) {
      const themeName = getThemeName(name, themeType);

      console.debug(`[${providerName.toUpperCase()}]`);
      console.log(`Generating ${themeName} theme...`);

      generator({ name, themeType });
    }

    console.log(
      `\x1b[32mSuccessfully generated themes for ${providerName}!\x1b[0m`
    );
  }
}

void main();
