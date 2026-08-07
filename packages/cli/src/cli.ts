import { buildCommand } from "./commands/build";
import { exportCommand } from "./commands/export";
import { fromCommand } from "./commands/from";
import { lintCommand } from "./commands/lint";
import { TinteCLI } from "./tinte-cli";
import type { EditorInstallOptions } from "./types";

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case "build":
      process.exit(await buildCommand(args.slice(1)));
      break;
    case "lint":
      process.exit(await lintCommand(args.slice(1)));
      break;
    case "from":
      process.exit(await fromCommand(args.slice(1)));
      break;
    case "export":
      process.exit(await exportCommand(args.slice(1)));
      break;
  }

  const cli = new TinteCLI();

  if (args.length === 0) {
    console.log(`
🎨 Tinte CLI - Beautiful Editor Themes

Usage:
  bunx tinte <theme-slug>            # Install theme by slug
  bunx tinte <theme-url>             # Install theme from URL
  bunx tinte <theme.json>            # Install theme from local file
  bunx tinte list                    # List installed Tinte themes
  bunx tinte cleanup                 # Clean up temporary files

Design system compiler (Agent Plugins):
  bunx tinte build --plugin          # Compile identity config to an Agent Plugin
  bunx tinte lint [paths...]         # Scan for colors that bypass the token system
  bunx tinte from --emit-script      # Print the agent-browser extraction script
  bunx tinte from --normalize <json> # Normalize extracted candidates to a draft identity

Theme export (generate theme files from an identity):
  bunx tinte export --list           # List available providers
  bunx tinte export --provider vscode --out themes/
  bunx tinte export --provider zed --json

Options:
  --light                           # Install light variant
  --dark                            # Install dark variant (default)
  --close                           # Auto-close editor after install
  --timeout <ms>                    # Auto-close timeout (default: 3000)
  --code                            # Install to VS Code (default)
  --cursor                          # Install to Cursor
  --zed                             # Install to Zed

Examples:
  bunx tinte flexoki-theme          # Install to VS Code
  bunx tinte flexoki-theme --cursor # Install to Cursor
  bunx tinte flexoki-theme --zed    # Install to Zed
  bunx tinte https://tinte.dev/api/themes/slug/flexoki-theme --light
  bunx tinte ./my-theme.json --zed
    `);
    process.exit(0);
  }

  const command = args[0];
  const options: EditorInstallOptions = {
    variant: args.includes("--light") ? "light" : "dark",
    autoClose: args.includes("--close"),
    timeout: parseInt(
      args.find((arg) => arg.startsWith("--timeout"))?.split("=")[1] || "3000",
    ),
    editor: args.includes("--zed")
      ? "zed"
      : args.includes("--cursor")
        ? "cursor"
        : "code",
  };

  try {
    switch (command) {
      case "list": {
        const installed = cli.listInstalled(options.editor);
        const listEditorName =
          options.editor === "zed"
            ? "Zed"
            : options.editor === "cursor"
              ? "Cursor"
              : "VS Code";
        if (installed.length === 0) {
          console.log(
            `📋 No Tinte themes currently installed in ${listEditorName}`,
          );
        } else {
          console.log(`📋 Installed Tinte themes in ${listEditorName}:`);
          installed.forEach((theme) => console.log(`  - ${theme}`));
        }
        break;
      }

      case "cleanup":
        cli.cleanup();
        break;

      default: {
        await cli.quick(command, options);
        const installEditorName =
          options.editor === "zed"
            ? "Zed"
            : options.editor === "cursor"
              ? "Cursor"
              : "VS Code";

        // Only show post-install message for VS Code/Cursor (Zed shows its own)
        if (options.editor !== "zed") {
          console.log(`
🎉 Open ${installEditorName} and select your new theme from Preferences → Color Theme
          `);
        }
        break;
      }
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}
