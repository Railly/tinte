import { exit } from "process";
import { getThemeName } from "./utils/index.ts";
import { generators, providers } from "./generators/index.ts";
import { currentTheme } from "./config/index.ts";

function main() {
  try {
    for (const { name: providerName, themes } of providers) {
      // Here we extract the generator function
      const generator = generators[providerName];
      if (!generator) {
        throw new Error(`Unknown provider: ${providerName}`);
      }

      for (const themeType of themes) {
        // We obtain the slugified name + theme type
        const themeName = getThemeName(currentTheme, themeType);

        console.debug(`[${providerName.toUpperCase()}]`);
        console.log(`Generating ${themeName} theme...`);

        // We call the generator function
        generator({ name: currentTheme, themeType });
      }

      console.log(
        `\x1b[32mSuccessfully generated themes for ${providerName}!\x1b[0m`
      );
    }
  } catch (error) {
    console.error(`\x1b[31mAn error occurred while generating themes:\x1b[0m`);
    exit(1);
  }
}

void main();
