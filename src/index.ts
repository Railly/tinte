import { generateVSCodeTheme } from "./generators/vscode/generate.ts";
import { generateWindowsTerminalTheme } from "./generators/windows-terminal/generate.ts";
import { getThemeName } from "./utils/index.ts";

const config = {
  name: "Flexoki",
  providers: ["vscode", "windows-terminal", "iterm2"],
  themeTypes: ["light", "dark"],
} as const;

function main() {
  const { name, providers } = config;

  for (const themeType of config.themeTypes) {
    const themeName = getThemeName(name, themeType);

    for (const provider of providers) {
      console.debug(`[${provider.toLocaleUpperCase()}]`);
      console.log(`Generating ${themeName} theme...`);
      switch (provider) {
        case "vscode":
          generateVSCodeTheme({ name, themeType });
          break;
        case "windows-terminal":
          generateWindowsTerminalTheme({ name, themeType });
          break;
        case "iterm2":
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    }
    console.log(
      `\x1b[32mSuccessfully generated ${themeName} for ${providers.join(
        ", "
      )}!\x1b[0m`
    );
  }
}

void main();
