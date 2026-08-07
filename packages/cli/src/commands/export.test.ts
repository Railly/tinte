import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { exportCommand } from "./export";

let dir: string;
let logs: string[];
let originalLog: typeof console.log;
let originalError: typeof console.error;

const THEME_BLOCK = {
  bg: "#ffffff",
  bg_2: "#fafafa",
  ui: "#ebebeb",
  ui_2: "#e0e0e0",
  ui_3: "#c9c9c9",
  tx: "#0a0a0a",
  tx_2: "#666666",
  tx_3: "#8f8f8f",
  pr: "#0a0a0a",
  sc: "#404040",
  ac_1: "#0483c5",
  ac_2: "#e26d14",
  ac_3: "#bb1b3f",
};

function writeConfig(path: string, contents: unknown) {
  writeFileSync(path, JSON.stringify(contents), "utf-8");
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "tinte-export-"));
  logs = [];
  originalLog = console.log;
  originalError = console.error;
  console.log = (...parts: unknown[]) => {
    logs.push(parts.map(String).join(" "));
  };
  console.error = (...parts: unknown[]) => {
    logs.push(parts.map(String).join(" "));
  };
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalError;
  rmSync(dir, { recursive: true, force: true });
});

describe("exportCommand", () => {
  it("writes a VS Code theme from an identity config", async () => {
    const config = join(dir, "tinte.config.json");
    writeConfig(config, {
      name: "acme",
      theme: { light: THEME_BLOCK, dark: THEME_BLOCK },
    });

    const code = await exportCommand([
      "--provider",
      "vscode",
      "--config",
      config,
      "--out",
      dir,
    ]);

    expect(code).toBe(0);

    const written = join(dir, "vscode-theme.json");
    expect(existsSync(written)).toBe(true);

    const theme = JSON.parse(readFileSync(written, "utf-8"));
    expect(theme.colors).toBeDefined();
    expect(theme.tokenColors.length).toBeGreaterThan(0);
  });

  it("accepts a bare light/dark config without a theme wrapper", async () => {
    const config = join(dir, "bare.json");
    writeConfig(config, { light: THEME_BLOCK, dark: THEME_BLOCK });

    const code = await exportCommand([
      "--provider",
      "vscode",
      "--config",
      config,
      "--out",
      dir,
    ]);

    expect(code).toBe(0);
    expect(existsSync(join(dir, "vscode-theme.json"))).toBe(true);
  });

  it("honors --out-file over --out", async () => {
    const config = join(dir, "tinte.config.json");
    writeConfig(config, { theme: { light: THEME_BLOCK, dark: THEME_BLOCK } });
    const target = join(dir, "nested", "custom-name.json");

    const code = await exportCommand([
      "--provider",
      "vscode",
      "--config",
      config,
      "--out-file",
      target,
    ]);

    expect(code).toBe(0);
    expect(existsSync(target)).toBe(true);
  });

  it("prints to stdout with --json and writes nothing", async () => {
    const config = join(dir, "tinte.config.json");
    writeConfig(config, { theme: { light: THEME_BLOCK, dark: THEME_BLOCK } });

    const code = await exportCommand([
      "--provider",
      "vscode",
      "--config",
      config,
      "--json",
    ]);

    expect(code).toBe(0);
    expect(existsSync(join(dir, "vscode-theme.json"))).toBe(false);
    expect(JSON.parse(logs.join("\n")).colors).toBeDefined();
  });

  it("lists every registered provider", async () => {
    const code = await exportCommand(["--list"]);

    expect(code).toBe(0);
    const output = logs.join("\n");
    expect(output).toContain("vscode");
    expect(output).toContain("zed");
  });

  it("fails with exit 1 on an unknown provider", async () => {
    const code = await exportCommand(["--provider", "not-a-provider"]);

    expect(code).toBe(1);
    expect(logs.join("\n")).toContain("Unknown provider");
  });

  it("fails with exit 1 when the config is missing", async () => {
    const code = await exportCommand([
      "--provider",
      "vscode",
      "--config",
      join(dir, "absent.json"),
    ]);

    expect(code).toBe(1);
    expect(logs.join("\n")).toContain("Could not read");
  });

  it("fails with exit 1 when the config has no theme", async () => {
    const config = join(dir, "empty.json");
    writeConfig(config, { name: "acme" });

    const code = await exportCommand([
      "--provider",
      "vscode",
      "--config",
      config,
    ]);

    expect(code).toBe(1);
    expect(logs.join("\n")).toContain("no theme");
  });

  it("fails with exit 1 when no provider is given", async () => {
    const code = await exportCommand([]);

    expect(code).toBe(1);
    expect(logs.join("\n")).toContain("Missing --provider");
  });
});
