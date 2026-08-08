import type { TinteBlock, TinteTheme } from "@tinte/core";
import { getProvider, hasProvider } from "@tinte/providers";

/**
 * Providers that convert a TinteTheme into a serializable artifact with no
 * React and no `@/` alias in their import graph, so they load from a plain
 * Node/Bun process.
 *
 * Deliberately excluded:
 *   shadcn, design-system, brand-guidelines  emit UI/HTML documents, not a
 *     theme artifact a tool consumes.
 *   banana, codex                            preview/experimental surfaces
 *     whose output is not an installable theme.
 */
const TARGET_IDS = [
  "vscode",
  "zed",
  "kitty",
  "warp",
  "alacritty",
  "windows-terminal",
  "slack",
  "gimp",
  "shiki",
] as const;

export type BuildTargetId = (typeof TARGET_IDS)[number];

interface TargetInfo {
  id: BuildTargetId;
  description: string;
  /** Whether `tinte <file> --code` can install the emitted artifact. */
  installable: boolean;
}

const TARGET_INFO: Record<BuildTargetId, Omit<TargetInfo, "id">> = {
  vscode: {
    description: "VS Code / Cursor theme, installable with tinte <file> --code",
    installable: true,
  },
  zed: { description: "Zed theme family JSON", installable: false },
  kitty: { description: "Kitty terminal conf", installable: false },
  warp: { description: "Warp terminal YAML", installable: false },
  alacritty: { description: "Alacritty terminal YAML", installable: false },
  "windows-terminal": {
    description: "Windows Terminal color scheme",
    installable: false,
  },
  slack: { description: "Slack sidebar theme", installable: false },
  gimp: { description: "GIMP palette (.gpl)", installable: false },
  shiki: { description: "Shiki syntax highlighting CSS", installable: false },
};

export function listTargets(): TargetInfo[] {
  return TARGET_IDS.map((id) => ({ id, ...TARGET_INFO[id] }));
}

export function isBuildTarget(value: string): value is BuildTargetId {
  return (TARGET_IDS as readonly string[]).includes(value);
}

export interface BuiltArtifact {
  filename: string;
  content: string;
}

/**
 * The classic installer reads `themeData.rawTheme || themeData` and expects a
 * TinteTheme (light/dark blocks) so it can generate a VSIX; a bare VS Code
 * theme has no light/dark and the generator rejects it. So the VS Code target
 * emits an envelope: the TinteTheme the installer needs, plus the converted
 * colors/tokenColors as `vscode_overrides`, which the installer forwards.
 */
export function buildForTarget(
  target: BuildTargetId,
  theme: TinteTheme,
  themeName: string,
): BuiltArtifact {
  if (!hasProvider(target)) {
    throw new Error(`provider "${target}" is not registered`);
  }

  const provider = getProvider(target);
  if (!provider) {
    throw new Error(`provider "${target}" is not registered`);
  }

  // A config may carry no `theme.name`, and providers then fall back to their
  // own default ("Custom Theme"), which loses the identity name in both the
  // artifact and its filename. Naming the theme here keeps every target
  // consistent with the identity.
  const named: TinteTheme = { ...theme, name: themeName };
  const output = provider.export(named);

  if (target !== "vscode") {
    return { filename: output.filename, content: output.content };
  }

  let converted: { colors?: unknown; tokenColors?: unknown };
  try {
    converted = JSON.parse(output.content);
  } catch (error) {
    throw new Error(
      `vscode provider returned invalid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const envelope = {
    name: themeName,
    rawTheme: {
      light: theme.light,
      dark: theme.dark,
    } satisfies { light: TinteBlock; dark: TinteBlock },
    vscode_overrides: {
      colors: converted.colors,
      tokenColors: converted.tokenColors,
    },
  };

  return {
    filename: `${slugify(themeName)}-vscode.json`,
    content: `${JSON.stringify(envelope, null, 2)}\n`,
  };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "theme"
  );
}
