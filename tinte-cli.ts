#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

interface TinteTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface EditorInstallOptions {
  autoClose?: boolean;
  variant?: "light" | "dark";
  timeout?: number;
  editor?: "code" | "cursor";
}

class TinteCLI {
  private readonly NETLIFY_ENDPOINT =
    "https://tinte-rh.netlify.app/.netlify/functions/generate-vscode-theme";
  private readonly TMP_DIR = join(tmpdir(), "tinte-themes");

  constructor() {
    // Ensure tmp directory exists
    if (!existsSync(this.TMP_DIR)) {
      mkdirSync(this.TMP_DIR, { recursive: true });
    }
  }

  /**
   * Install theme from Tinte theme data
   */
  async installTheme(
    tinteTheme: TinteTheme,
    themeName: string,
    options: EditorInstallOptions = {},
    vscodeOverrides?: Record<string, any>,
  ): Promise<string> {
    const {
      variant = "dark",
      autoClose = true,
      timeout = 3000,
      editor = "code",
    } = options;

    const editorName = editor === "cursor" ? "Cursor" : "VS Code";
    console.log(
      `🎨 Generating ${themeName} (${variant}) theme for ${editorName}...`,
    );

    // Generate VSIX from Netlify function
    const vsixBuffer = await this.generateVSIX(
      tinteTheme,
      themeName,
      variant,
      vscodeOverrides,
    );

    // Save to tmp file
    const vsixPath = join(
      this.TMP_DIR,
      `${themeName.toLowerCase().replace(/\s+/g, "-")}-${variant}.vsix`,
    );
    writeFileSync(vsixPath, vsixBuffer);

    console.log(`📦 Theme saved to: ${vsixPath}`);

    // Install to editor
    await this.installToEditor(vsixPath, autoClose, timeout, editor);

    return vsixPath;
  }

  /**
   * Install theme from URL (theme ID or full theme data)
   */
  async installFromUrl(
    themeUrl: string,
    options: EditorInstallOptions = {},
  ): Promise<string> {
    console.log(`🌐 Fetching theme from: ${themeUrl}`);

    // If it's a Tinte theme ID, construct the API URL
    let apiUrl = themeUrl;
    if (!themeUrl.startsWith("http")) {
      apiUrl = `https://tinte-rh.netlify.app/api/themes/${themeUrl}`;
    }

    // Fetch theme data
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch theme: ${response.statusText}`);
    }

    const themeData = await response.json();
    const tinteTheme = themeData.rawTheme || themeData;
    const themeName = themeData.name || themeData.displayName || "Custom Theme";
    const vscodeOverrides =
      themeData.vscode_overrides || themeData.overrides?.vscode;

    return this.installTheme(tinteTheme, themeName, options, vscodeOverrides);
  }

  /**
   * Install theme from local JSON file
   */
  async installFromFile(
    filePath: string,
    themeName?: string,
    options: EditorInstallOptions = {},
  ): Promise<string> {
    console.log(`📁 Loading theme from: ${filePath}`);

    const fs = await import("node:fs/promises");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const themeData = JSON.parse(fileContent);

    const tinteTheme = themeData.rawTheme || themeData;
    const name =
      themeName || themeData.name || themeData.displayName || "Local Theme";
    const vscodeOverrides =
      themeData.vscode_overrides || themeData.overrides?.vscode;

    return this.installTheme(tinteTheme, name, options, vscodeOverrides);
  }

  /**
   * Quick install with theme shorthand
   */
  async quick(
    themeInput: string,
    options: EditorInstallOptions = {},
  ): Promise<string> {
    // Determine input type and route accordingly
    if (themeInput.startsWith("http")) {
      return this.installFromUrl(themeInput, options);
    } else if (themeInput.endsWith(".json")) {
      return this.installFromFile(themeInput, undefined, options);
    } else {
      // Assume it's a theme ID
      return this.installFromUrl(themeInput, options);
    }
  }

  /**
   * List installed Tinte themes in editor
   */
  listInstalled(editor: "code" | "cursor" = "code"): string[] {
    try {
      const command =
        editor === "cursor"
          ? "cursor --list-extensions --show-versions"
          : "code --list-extensions --show-versions";
      const output = execSync(command, { encoding: "utf-8" });
      return output
        .split("\n")
        .filter((line) => line.toLowerCase().includes("tinte"))
        .map((line) => line.trim())
        .filter(Boolean);
    } catch (_error) {
      const editorName = editor === "cursor" ? "Cursor" : "VS Code";
      console.warn(`⚠️  Could not list extensions. Is ${editorName} installed?`);
      return [];
    }
  }

  /**
   * Clean up temporary theme files
   */
  cleanup(): void {
    try {
      const fs = require("node:fs");
      if (existsSync(this.TMP_DIR)) {
        const files = fs.readdirSync(this.TMP_DIR);
        files.forEach((file: string) => {
          if (file.endsWith(".vsix")) {
            unlinkSync(join(this.TMP_DIR, file));
          }
        });
        console.log("🧹 Cleaned up temporary theme files");
      }
    } catch (_error) {
      console.warn("⚠️  Could not clean up temporary files");
    }
  }

  private async generateVSIX(
    tinteTheme: TinteTheme,
    themeName: string,
    variant: "light" | "dark",
    vscodeOverrides?: Record<string, any>,
  ): Promise<Buffer> {
    const response = await fetch(this.NETLIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tinteTheme,
        themeName,
        variant,
        overrides: vscodeOverrides,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate theme: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  private async installToEditor(
    vsixPath: string,
    autoClose: boolean,
    timeout: number,
    editor: "code" | "cursor",
  ): Promise<void> {
    try {
      const editorName = editor === "cursor" ? "Cursor" : "VS Code";
      const command = editor === "cursor" ? "cursor" : "code";

      console.log(`🚀 Installing theme to ${editorName}...`);

      // Install the extension
      execSync(`${command} --install-extension "${vsixPath}"`, {
        stdio: "inherit",
      });

      console.log("✅ Theme installed successfully!");

      if (autoClose) {
        console.log(`⏳ Auto-closing ${editorName} in ${timeout}ms...`);

        // Small delay to ensure installation completes
        await new Promise((resolve) => setTimeout(resolve, timeout));

        try {
          // Close all editor windows
          if (process.platform === "darwin") {
            const appName =
              editor === "cursor" ? "Cursor" : "Visual Studio Code";
            execSync(`osascript -e "quit app \\"${appName}\\""`);
          } else if (process.platform === "win32") {
            const processName = editor === "cursor" ? "Cursor.exe" : "Code.exe";
            execSync(`taskkill /F /IM ${processName}`);
          } else {
            execSync(`pkill -f "${command}"`);
          }
          console.log(`🔚 ${editorName} closed`);
        } catch (_error) {
          console.warn(`⚠️  Could not auto-close ${editorName}`);
        }
      }
    } catch (error) {
      throw new Error(`Failed to install theme: ${error}`);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const cli = new TinteCLI();

  if (args.length === 0) {
    console.log(`
🎨 Tinte CLI - Beautiful Editor Themes

Usage:
  bunx tinte <theme-id>              # Install theme by ID
  bunx tinte <theme-url>             # Install theme from URL
  bunx tinte <theme.json>            # Install theme from local file
  bunx tinte list                    # List installed Tinte themes
  bunx tinte cleanup                 # Clean up temporary files

Options:
  --light                           # Install light variant
  --dark                            # Install dark variant (default)
  --both                            # Install both light and dark variants
  --no-close                        # Don't auto-close editor
  --timeout <ms>                    # Auto-close timeout (default: 3000)
  --code                            # Install to VS Code (default)
  --cursor                          # Install to Cursor

Examples:
  bunx tinte flexoki-theme          # Install dark variant to VS Code
  bunx tinte flexoki-theme --both   # Install both variants
  bunx tinte flexoki-theme --cursor # Install to Cursor
  bunx tinte https://tinte.dev/api/themes/abc123 --light
  bunx tinte ./my-theme.json --cursor --no-close
    `);
    process.exit(0);
  }

  const command = args[0];
  const installBoth = args.includes("--both");
  const options: EditorInstallOptions = {
    variant: args.includes("--light") ? "light" : "dark",
    autoClose: !args.includes("--no-close"),
    timeout: parseInt(
      args.find((arg) => arg.startsWith("--timeout"))?.split("=")[1] || "3000",
    ),
    editor: args.includes("--cursor") ? "cursor" : "code",
  };

  try {
    switch (command) {
      case "list": {
        const installed = cli.listInstalled(options.editor);
        const editorName = options.editor === "cursor" ? "Cursor" : "VS Code";
        if (installed.length === 0) {
          console.log(
            `📋 No Tinte themes currently installed in ${editorName}`,
          );
        } else {
          console.log(`📋 Installed Tinte themes in ${editorName}:`);
          installed.forEach((theme) => console.log(`  - ${theme}`));
        }
        break;
      }

      case "cleanup":
        cli.cleanup();
        break;

      default: {
        if (installBoth) {
          console.log("📦 Installing both light and dark variants...\n");
          await cli.quick(command, { ...options, variant: "light" });
          await cli.quick(command, { ...options, variant: "dark" });
        } else {
          await cli.quick(command, options);
        }

        const editorName = options.editor === "cursor" ? "Cursor" : "VS Code";
        const editorCommand =
          options.editor === "cursor" ? "cursor ." : "code .";
        console.log(`
🎉 Theme${installBoth ? "s" : ""} installed!

Next steps:
1. Open ${editorName}: ${editorCommand}
2. Go to: File → Preferences → Color Theme
3. Select your new Tinte theme${installBoth ? "s" : ""}
4. Enjoy your beautiful new theme${installBoth ? "s" : ""}! ✨
        `);
        break;
      }
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Export for programmatic use
export { TinteCLI };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}
