import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildCommand } from "./build";

/**
 * Cronwatch — the identity used in the A/B run: paper background, ink text,
 * amber accent, 2px radius, hue-driven primary.
 */
const cronwatchBlock = {
  bg: "#faf9f5",
  bg_2: "#f1efe9",
  ui: "#dcd9d0",
  ui_2: "#c9c5ba",
  ui_3: "#a8a396",
  tx: "#1c1b17",
  tx_2: "#5c584e",
  tx_3: "#8a857a",
  pr: "#c98a2b",
  sc: "#3c3931",
  ac_1: "#2f6f4f",
  ac_2: "#8a6d3b",
  ac_3: "#b4341f",
};

const cronwatchDarkBlock = {
  bg: "#171613",
  bg_2: "#201f1a",
  ui: "#332f28",
  ui_2: "#453f35",
  ui_3: "#5c554a",
  tx: "#f2f0ea",
  tx_2: "#b3ada0",
  tx_3: "#847e72",
  pr: "#e0a94f",
  sc: "#d9d4c8",
  ac_1: "#5fae86",
  ac_2: "#c4a05e",
  ac_3: "#e0664f",
};

const cronwatchIdentity = {
  name: "cronwatch",
  theme: {
    light: cronwatchBlock,
    dark: cronwatchDarkBlock,
    name: "Cronwatch",
  },
  typography: {
    families: {
      sans: "system-ui, sans-serif",
      mono: "ui-monospace, monospace",
    },
    roles: {
      display: { size: 44, lineHeight: 1.05, weight: 600 },
      title: { size: 30, lineHeight: 1.15, weight: 600 },
      heading: { size: 20, lineHeight: 1.3, weight: 600 },
      body: { size: 16, lineHeight: 1.6, weight: 400 },
      label: { size: 13, lineHeight: 1.4, weight: 500 },
      mono: { size: 13, lineHeight: 1.5, weight: 400 },
    },
  },
  radius: "2px",
  primaryStyle: "hue",
  voiceWords: ["operational", "exact", "unhurried"],
  dosDonts: [
    "Do: state the failure mode before the feature.",
    'Don\'t: use the word "platform".',
  ],
};

let workDir: string;

async function writeConfig(name: string, config: unknown): Promise<string> {
  const path = join(workDir, name);
  await writeFile(path, JSON.stringify(config, null, 2), "utf8");
  return path;
}

beforeEach(async () => {
  workDir = await mkdtemp(join(tmpdir(), "tinte-build-"));
});

afterEach(async () => {
  await rm(workDir, { recursive: true, force: true });
});

describe("buildCommand --plugin", () => {
  it("emits a well-formed agent plugin for Cronwatch", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const out = join(workDir, "out");

    const code = await buildCommand([
      "--plugin",
      "--config",
      config,
      "--out",
      out,
    ]);
    expect(code).toBe(0);

    const pluginJson = JSON.parse(
      await readFile(join(out, "plugin.json"), "utf8"),
    );
    expect(pluginJson.$schema).toBe(
      "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    );
    expect(pluginJson.name).toBe("cronwatch-design");

    const skill = await readFile(
      join(out, "skills", "cronwatch-design", "SKILL.md"),
      "utf8",
    );
    expect(skill).not.toContain("{{");
    expect(skill).not.toContain("}}");
    expect(skill).toContain("cronwatch");
    expect(skill).toContain("./references/tokens.css");
    expect(skill).toContain("display 44/1.05 600");
    expect(skill).toContain("operational, exact, unhurried");
    expect(skill).toContain("Do: state the failure mode before the feature.");

    // The rules block renders as bullets...
    expect(skill).toContain(
      "- Do: state the failure mode before the feature.\n",
    );
    // ...but the inline occurrence stays a sentence, not a broken list.
    expect(skill).toContain(
      'Sentence case unless\nDo: state the failure mode before the feature; Don\'t: use the word "platform" says otherwise.',
    );
    expect(skill).not.toContain(
      '- Don\'t: use the word "platform". says otherwise.',
    );

    const tokens = await readFile(
      join(out, "skills", "cronwatch-design", "references", "tokens.css"),
      "utf8",
    );
    expect(tokens).toContain("oklch(");
    expect(tokens).toContain("--radius: 2px;");
    expect(tokens).toContain(":root {");
    expect(tokens).toContain(".dark {");
    expect(tokens).not.toContain("#");

    // Every shadcn base token the template promises must be present.
    for (const token of [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "border",
      "input",
      "ring",
    ]) {
      expect(tokens).toContain(`--${token}: oklch(`);
    }

    // Values are rounded, not raw float dumps.
    for (const value of tokens.matchAll(/oklch\(([^)]*)\)/g)) {
      for (const component of value[1].trim().split(/\s+/)) {
        const decimals = component.split(".")[1];
        expect(decimals === undefined || decimals.length <= 4).toBe(true);
      }
    }
  });

  it("does not inject the inverted note for primaryStyle hue", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const out = join(workDir, "out");

    expect(
      await buildCommand(["--plugin", "--config", config, "--out", out]),
    ).toBe(0);

    const skill = await readFile(
      join(out, "skills", "cronwatch-design", "SKILL.md"),
      "utf8",
    );
    expect(skill).not.toContain("inverted foreground/background pair");
  });
});

describe("buildCommand primaryStyle inverted", () => {
  it("injects the inverted-primary rule and inverts --primary", async () => {
    const config = await writeConfig("inverted.json", {
      ...cronwatchIdentity,
      name: "monolith",
      primaryStyle: "inverted",
    });
    const out = join(workDir, "out");

    expect(
      await buildCommand(["--plugin", "--config", config, "--out", out]),
    ).toBe(0);

    const skill = await readFile(
      join(out, "skills", "monolith-design", "SKILL.md"),
      "utf8",
    );
    expect(skill).not.toContain("{{");
    expect(skill).toContain(
      "The primary action style is an inverted foreground/background pair, not a hue.",
    );
    expect(skill).toContain("Do not introduce an accent color for CTAs.");

    const tokens = await readFile(
      join(out, "skills", "monolith-design", "references", "tokens.css"),
      "utf8",
    );
    // --primary must equal --foreground (tx), not the amber accent.
    const foreground = tokens.match(/--foreground: (oklch\([^)]*\));/)?.[1];
    const primary = tokens.match(/--primary: (oklch\([^)]*\));/)?.[1];
    expect(foreground).toBeDefined();
    expect(primary).toBe(foreground as string);

    const background = tokens.match(/--background: (oklch\([^)]*\));/)?.[1];
    const primaryFg = tokens.match(
      /--primary-foreground: (oklch\([^)]*\));/,
    )?.[1];
    expect(primaryFg).toBe(background as string);
  });
});

describe("buildCommand without --plugin", () => {
  it("emits design.md and tokens.css loose", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const out = join(workDir, "out");

    expect(await buildCommand(["--config", config, "--out", out])).toBe(0);

    const design = await readFile(join(out, "design.md"), "utf8");
    expect(design).not.toContain("{{");
    expect(design).toContain("cronwatch");

    const tokens = await readFile(join(out, "tokens.css"), "utf8");
    expect(tokens).toContain("oklch(");
    expect(tokens).toContain("--radius: 2px;");
  });

  it("omits the .dark block when the theme has no dark variant", async () => {
    const { dark: _dark, ...lightOnly } = cronwatchIdentity.theme;
    const config = await writeConfig("light-only.json", {
      ...cronwatchIdentity,
      theme: lightOnly,
    });
    const out = join(workDir, "out");

    expect(await buildCommand(["--config", config, "--out", out])).toBe(0);

    const tokens = await readFile(join(out, "tokens.css"), "utf8");
    expect(tokens).toContain(":root {");
    expect(tokens).not.toContain(".dark {");
  });
});

describe("buildCommand validation", () => {
  it("exits non-zero with a clear error on an invalid config", async () => {
    const config = await writeConfig("bad.json", {
      ...cronwatchIdentity,
      primaryStyle: "gradient",
      radius: "",
    });
    const out = join(workDir, "out");

    const errors: string[] = [];
    const original = console.error;
    console.error = (...parts: unknown[]) => {
      errors.push(parts.map(String).join(" "));
    };

    let code: number;
    try {
      code = await buildCommand(["--plugin", "--config", config, "--out", out]);
    } finally {
      console.error = original;
    }

    expect(code).not.toBe(0);
    const output = errors.join("\n");
    expect(output).toContain("not a valid tinte identity");
    expect(output).toContain("primaryStyle");
    expect(output).toContain("radius");
  });

  it("exits non-zero when the config file is missing", async () => {
    const original = console.error;
    const errors: string[] = [];
    console.error = (...parts: unknown[]) => {
      errors.push(parts.map(String).join(" "));
    };

    let code: number;
    try {
      code = await buildCommand([
        "--config",
        join(workDir, "does-not-exist.json"),
        "--out",
        join(workDir, "out"),
      ]);
    } finally {
      console.error = original;
    }

    expect(code).not.toBe(0);
    expect(errors.join("\n")).toContain("config not found");
  });

  it("exits non-zero on malformed JSON", async () => {
    const path = join(workDir, "broken.json");
    await writeFile(path, "{ not json", "utf8");

    const original = console.error;
    const errors: string[] = [];
    console.error = (...parts: unknown[]) => {
      errors.push(parts.map(String).join(" "));
    };

    let code: number;
    try {
      code = await buildCommand([
        "--config",
        path,
        "--out",
        join(workDir, "o"),
      ]);
    } finally {
      console.error = original;
    }

    expect(code).not.toBe(0);
    expect(errors.join("\n")).toContain("not valid JSON");
  });
});

describe("buildCommand --to", () => {
  it("emits a VS Code artifact the classic installer can consume", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const out = join(workDir, "themes");

    const code = await buildCommand([
      "--to",
      "vscode",
      "--config",
      config,
      "--out",
      out,
    ]);
    expect(code).toBe(0);

    const artifact = JSON.parse(
      await readFile(join(out, "cronwatch-vscode.json"), "utf8"),
    );

    // The installer reads `rawTheme || themeData` and needs light/dark blocks
    // to generate a VSIX; a bare VS Code theme has neither.
    expect(artifact.rawTheme.light.bg).toBe(cronwatchBlock.bg);
    expect(artifact.rawTheme.dark.bg).toBe(cronwatchDarkBlock.bg);
    expect(artifact.name).toBe("Cronwatch");

    expect(
      Object.keys(artifact.vscode_overrides.colors).length,
    ).toBeGreaterThan(0);
    expect(artifact.vscode_overrides.tokenColors.length).toBeGreaterThan(0);
  });

  it("emits a Zed theme family carrying the identity name", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const out = join(workDir, "themes");

    const code = await buildCommand([
      "--to",
      "zed",
      "--config",
      config,
      "--out",
      out,
    ]);
    expect(code).toBe(0);

    const theme = JSON.parse(
      await readFile(join(out, "cronwatch.json"), "utf8"),
    );
    expect(theme.$schema).toContain("zed.dev/schema/themes");
    expect(theme.name).toBe("Cronwatch");
    expect(
      theme.themes.map((t: { appearance: string }) => t.appearance),
    ).toEqual(["light", "dark"]);
  });

  it("emits a kitty conf with the mapped foreground and background", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const out = join(workDir, "themes");

    const code = await buildCommand([
      "--to",
      "kitty",
      "--config",
      config,
      "--out",
      out,
    ]);
    expect(code).toBe(0);

    // The kitty provider emits the dark variant, terminals being dark by
    // convention.
    const conf = await readFile(join(out, "tinte-theme-kitty.conf"), "utf8");
    expect(conf).toContain(`background ${cronwatchDarkBlock.bg}`);
    expect(conf).toContain(`foreground ${cronwatchDarkBlock.tx}`);
  });

  it("writes to an explicit file path when --out has an extension", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const target = join(workDir, "nested", "my-theme.json");

    const code = await buildCommand([
      "--to",
      "vscode",
      "--config",
      config,
      "--out",
      target,
    ]);
    expect(code).toBe(0);

    const artifact = JSON.parse(await readFile(target, "utf8"));
    expect(artifact.rawTheme).toBeDefined();
  });

  it("lists targets when --to has no value, without needing a config", async () => {
    const logs: string[] = [];
    const original = console.log;
    console.log = (...parts: unknown[]) => {
      logs.push(parts.map(String).join(" "));
    };

    let code: number;
    try {
      code = await buildCommand(["--to"]);
    } finally {
      console.log = original;
    }

    expect(code).toBe(0);
    expect(logs.join("\n")).toContain("vscode");
    expect(logs.join("\n")).toContain("kitty");
  });

  it("rejects a provider that is not a valid target", async () => {
    const config = await writeConfig("tinte.config.json", cronwatchIdentity);
    const errors: string[] = [];
    const original = console.error;
    console.error = (...parts: unknown[]) => {
      errors.push(parts.map(String).join(" "));
    };

    let code: number;
    try {
      code = await buildCommand(["--to", "shadcn", "--config", config]);
    } finally {
      console.error = original;
    }

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("unknown --to target");
  });
});
