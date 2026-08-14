import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const providerConfigPath = join(root, "apps/web/src/config/providers.ts");
const providerModulesPath = join(root, "packages/providers/src/providers");
const readmePath = join(root, "README.md");
const startMarker = "<!-- provider-matrix:start -->";
const endMarker = "<!-- provider-matrix:end -->";
const aliases: Record<string, string> = {
  "shadcn/ui": "shadcn",
  "VS Code": "vscode",
  "Windows Terminal": "windows-terminal",
};

function providerFileStem(provider: string) {
  return (
    aliases[provider] ??
    provider
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

function readProviderNames(source: string) {
  const match = source.match(
    /export const ALL_PROVIDERS = \[([\s\S]*?)\]\s+as const;/,
  );
  if (!match) {
    throw new Error("Could not find ALL_PROVIDERS in the web provider config");
  }

  const providers = [...match[1].matchAll(/"([^"]+)"/g)].map(
    ([, provider]) => provider,
  );
  if (providers.length === 0 || new Set(providers).size !== providers.length) {
    throw new Error("ALL_PROVIDERS must contain unique provider names");
  }
  return providers;
}

function renderMatrix(providers: string[], providerModules: Set<string>) {
  const rows = providers.map((provider) => {
    const stem = providerFileStem(provider);
    const implemented = providerModules.has(stem);
    const module = implemented
      ? `\`packages/providers/src/providers/${stem}.ts\``
      : "—";
    return `| ${provider} | ${implemented ? "Implemented" : "Planned"} | ${module} |`;
  });

  return [
    startMarker,
    "| Provider | Status | Module |",
    "| --- | --- | --- |",
    ...rows,
    endMarker,
  ].join("\n");
}

const [providerConfig, providerEntries, readme] = await Promise.all([
  readFile(providerConfigPath, "utf8"),
  readdir(providerModulesPath, { withFileTypes: true }),
  readFile(readmePath, "utf8"),
]);
const providers = readProviderNames(providerConfig);
const providerModules = new Set(
  providerEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => entry.name.slice(0, -3)),
);
const start = readme.indexOf(startMarker);
const end = readme.indexOf(endMarker);
if (start === -1 || end === -1 || end < start) {
  throw new Error("README provider matrix markers are missing or out of order");
}

const matrix = renderMatrix(providers, providerModules);
const updatedReadme = `${readme.slice(0, start)}${matrix}${readme.slice(
  end + endMarker.length,
)}`;

if (process.argv.includes("--check")) {
  if (updatedReadme !== readme) {
    console.error("Provider capability matrix is out of date");
    process.exit(1);
  }
  console.log(
    `Provider capability matrix is current (${providers.length} providers)`,
  );
} else {
  await writeFile(readmePath, updatedReadme);
  console.log(
    `Updated provider capability matrix (${providers.length} providers)`,
  );
}
