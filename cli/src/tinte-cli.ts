import { execSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { EditorInstallOptions, TinteTheme } from "./types";

export class TinteCLI {
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
      autoClose = false,
      timeout = 3000,
      editor = "code",
    } = options;

    const editorName = editor === "cursor" ? "Cursor" : "VS Code";
    console.log(`🎨 Installing ${themeName} to ${editorName}...`);

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

    // Install to editor
    await this.installToEditor(vsixPath, autoClose, timeout, editor);

    return vsixPath;
  }

  /**
   * Install theme from URL (theme slug or full theme data)
   */
  async installFromUrl(
    themeUrl: string,
    options: EditorInstallOptions = {},
  ): Promise<string> {
    // If it's a Tinte theme slug, construct the API URL
    let apiUrl = themeUrl;
    if (!themeUrl.startsWith("http")) {
      apiUrl = `https://www.tinte.dev/api/themes/slug/${themeUrl}`;
    }

    // Fetch theme data
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch theme: ${response.statusText}`);
    }

    const themeData = (await response.json()) as any;
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
      const command = editor === "cursor" ? "cursor" : "code";

      // Install the extension
      execSync(`${command} --install-extension "${vsixPath}"`, {
        stdio: "pipe",
      });

      console.log("✅ Theme installed successfully!");

      if (autoClose) {
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
        } catch (_error) {
          // Silently fail on auto-close
        }
      }
    } catch (error) {
      throw new Error(`Failed to install theme: ${error}`);
    }
  }
}
