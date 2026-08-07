import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lintCommand } from "./lint";

let dir: string;
let logs: string[];
let originalLog: typeof console.log;
let originalError: typeof console.error;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "tinte-lint-"));
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

describe("lintCommand", () => {
  it("detects hex literals and tailwind palette classes with exact count", async () => {
    const file = join(dir, "component.tsx");
    writeFileSync(
      file,
      [
        'const color = "#ff0000";',
        'const short = "#f00";',
        '<div className="bg-slate-500 text-red-200 border-blue-700">',
        "</div>",
      ].join("\n"),
    );

    const exitCode = await lintCommand([dir, "--json"]);

    expect(exitCode).toBe(1);
    const json = JSON.parse(logs.join("\n"));
    expect(json.count).toBe(5);
    const kinds = json.violations.map((v: { kind: string }) => v.kind).sort();
    expect(kinds).toEqual([
      "hex",
      "hex",
      "tailwind-palette",
      "tailwind-palette",
      "tailwind-palette",
    ]);
  });

  it("returns 0 violations for a clean file using var(--token)", async () => {
    const file = join(dir, "clean.tsx");
    writeFileSync(
      file,
      [
        "const style = {",
        "  background: 'var(--background)',",
        "  color: 'var(--foreground)',",
        "};",
      ].join("\n"),
    );

    const exitCode = await lintCommand([dir, "--json"]);

    expect(exitCode).toBe(0);
    const json = JSON.parse(logs.join("\n"));
    expect(json.count).toBe(0);
    expect(json.violations).toEqual([]);
  });

  it("ignores tokens.css even when it contains hex literals", async () => {
    const file = join(dir, "tokens.css");
    writeFileSync(
      file,
      [
        ":root {",
        "  --background: #ffffff;",
        "  --foreground: #0a0a0a;",
        "}",
      ].join("\n"),
    );

    const exitCode = await lintCommand([dir, "--json"]);

    expect(exitCode).toBe(0);
    const json = JSON.parse(logs.join("\n"));
    expect(json.count).toBe(0);
  });

  it("ignores lines with a tinte-ignore comment", async () => {
    const file = join(dir, "legacy.tsx");
    writeFileSync(
      file,
      [
        'const brand = "#123456"; // tinte-ignore',
        'const other = "#654321";',
      ].join("\n"),
    );

    const exitCode = await lintCommand([dir, "--json"]);

    expect(exitCode).toBe(1);
    const json = JSON.parse(logs.join("\n"));
    expect(json.count).toBe(1);
    expect(json.violations[0].match).toBe("#654321");
    expect(json.violations[0].line).toBe(2);
  });
});
