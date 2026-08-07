import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { TinteTheme } from "@tinte/core";
import {
  getAvailableProviders,
  getProvider,
  hasProvider,
} from "@tinte/providers";

interface ExportOptions {
  provider: string;
  configPath: string;
  outDir?: string;
  outFile?: string;
  json: boolean;
  list: boolean;
}

const USAGE = `Usage:
  tinte export --provider <id> [options]
  tinte export --list

Options:
  --provider <id>     Provider to export to (e.g. vscode, zed, kitty)
  --config <path>     Identity config to read (default: ./tinte.config.json)
  --out <dir>         Directory to write into (default: current directory)
  --out-file <path>   Exact file to write, overrides --out
  --list              List available providers and exit
  --json              Print the exported content to stdout as JSON

Examples:
  tinte export --list
  tinte export --provider vscode --out themes/
  tinte export --provider zed --config ./brand.json --out-file themes/brand.json
  tinte export --provider kitty --json`;

function parseArgs(args: string[]): ExportOptions | { error: string } {
  const options: ExportOptions = {
    provider: "",
    configPath: "./tinte.config.json",
    json: false,
    list: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--list") {
      options.list = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--provider" || arg.startsWith("--provider=")) {
      const value = arg.includes("=") ? arg.split("=")[1] : args[++i];
      if (!value) return { error: "--provider requires a value" };
      options.provider = value;
    } else if (arg === "--config" || arg.startsWith("--config=")) {
      const value = arg.includes("=") ? arg.split("=")[1] : args[++i];
      if (!value) return { error: "--config requires a value" };
      options.configPath = value;
    } else if (arg === "--out" || arg.startsWith("--out=")) {
      const value = arg.includes("=") ? arg.split("=")[1] : args[++i];
      if (!value) return { error: "--out requires a value" };
      options.outDir = value;
    } else if (arg === "--out-file" || arg.startsWith("--out-file=")) {
      const value = arg.includes("=") ? arg.split("=")[1] : args[++i];
      if (!value) return { error: "--out-file requires a value" };
      options.outFile = value;
    } else if (arg === "--help" || arg === "-h") {
      return { error: "" };
    } else {
      return { error: `Unknown argument: ${arg}` };
    }
  }

  return options;
}

/**
 * Reads a Tinte identity config and returns the theme block the providers
 * consume. Accepts both a full identity (`{ name, theme: { light, dark } }`)
 * and a bare `{ light, dark }` theme, since both shapes exist in the wild.
 */
function readTheme(configPath: string): TinteTheme {
  const resolved = resolve(configPath);
  const raw = readFileSync(resolved, "utf-8");
  const parsed = JSON.parse(raw);

  const theme = parsed.theme ?? parsed;

  if (!theme?.light || !theme?.dark) {
    throw new Error(
      `${configPath} has no theme: expected "theme.light" and "theme.dark" (or a bare "light"/"dark" object)`,
    );
  }

  return {
    light: theme.light,
    dark: theme.dark,
    name: parsed.name ?? theme.name,
    author: parsed.author ?? theme.author,
  };
}

function listProviders(): number {
  const providers = getAvailableProviders();
  const byCategory = new Map<string, typeof providers>();

  for (const provider of providers) {
    const category = provider.metadata.category;
    const group = byCategory.get(category) ?? [];
    group.push(provider);
    byCategory.set(category, group);
  }

  console.log(`${providers.length} providers available:\n`);

  for (const [category, group] of [...byCategory].sort()) {
    console.log(`  ${category}`);
    for (const provider of group.sort((a, b) =>
      a.metadata.id.localeCompare(b.metadata.id),
    )) {
      const id = provider.metadata.id.padEnd(18);
      const experimental = provider.metadata.experimental
        ? " (experimental)"
        : "";
      console.log(`    ${id}${provider.metadata.name}${experimental}`);
    }
    console.log("");
  }

  return 0;
}

export async function exportCommand(args: string[]): Promise<number> {
  const parsed = parseArgs(args);

  if ("error" in parsed) {
    if (parsed.error) console.error(`${parsed.error}\n`);
    console.log(USAGE);
    return parsed.error ? 1 : 0;
  }

  if (parsed.list) {
    return listProviders();
  }

  if (!parsed.provider) {
    console.error("Missing --provider\n");
    console.log(USAGE);
    return 1;
  }

  if (!hasProvider(parsed.provider)) {
    const available = getAvailableProviders()
      .map((p) => p.metadata.id)
      .sort()
      .join(", ");
    console.error(`Unknown provider: ${parsed.provider}`);
    console.error(`Available: ${available}`);
    return 1;
  }

  let theme: TinteTheme;
  try {
    theme = readTheme(parsed.configPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not read ${parsed.configPath}: ${message}`);
    return 1;
  }

  const provider = getProvider(parsed.provider);
  if (!provider) {
    console.error(`Unknown provider: ${parsed.provider}`);
    return 1;
  }

  let output: ReturnType<typeof provider.export>;
  try {
    output = provider.export(theme);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${parsed.provider} failed to export: ${message}`);
    return 1;
  }

  if (parsed.json) {
    console.log(output.content);
    return 0;
  }

  const destination = parsed.outFile
    ? resolve(parsed.outFile)
    : resolve(join(parsed.outDir ?? ".", output.filename));

  try {
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, output.content, "utf-8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not write ${destination}: ${message}`);
    return 1;
  }

  console.log(`${parsed.provider} -> ${destination}`);
  return 0;
}
